from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.database import get_db
from backend.models import User, Usage
from backend.services.auth_service import require_auth
from backend.config import get_settings

router = APIRouter(prefix="/billing", tags=["billing"])
settings = get_settings()

SUBSCRIPTION_TIERS = {
    "free": {
        "name": "Free",
        "price": 0,
        "requests_per_month": 100,
        "features": ["Local mode", "3 agents", "Community stacks"]
    },
    "developer": {
        "name": "Developer",
        "price": 1900,  # cents
        "price_id": "price_developer_monthly",
        "requests_per_month": 1000,
        "features": ["GitHub integration", "7 agents", "Custom stacks", "Priority support"]
    },
    "team": {
        "name": "Team",
        "price": 4900,
        "price_id": "price_team_monthly",
        "requests_per_month": 5000,
        "features": ["Unlimited agents", "Private registry", "Team sharing", "API access"]
    },
    "enterprise": {
        "name": "Enterprise",
        "price": None,  # Custom
        "requests_per_month": None,  # Unlimited
        "features": ["Self-hosted option", "SLA", "Dedicated support", "Custom integrations"]
    }
}

@router.get("/plans")
async def get_plans():
    """Get available subscription plans."""
    return SUBSCRIPTION_TIERS

@router.get("/usage")
async def get_usage(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get current usage stats."""
    from datetime import datetime
    current_month = datetime.now().strftime("%Y-%m")
    
    usage = db.query(Usage).filter(
        Usage.user_id == current_user.id,
        Usage.month == current_month
    ).first()
    
    tier_info = SUBSCRIPTION_TIERS.get(current_user.subscription_tier, SUBSCRIPTION_TIERS["free"])
    limit = tier_info["requests_per_month"]
    
    return {
        "tier": current_user.subscription_tier,
        "requests_used": usage.requests_count if usage else 0,
        "requests_limit": limit,
        "tokens_used": usage.tokens_used if usage else 0,
        "cost_usd": (usage.cost_usd / 100) if usage else 0
    }

class CheckoutRequest(BaseModel):
    tier: str
    success_url: str = "http://localhost:3000/billing/success"
    cancel_url: str = "http://localhost:3000/billing/cancel"

@router.post("/checkout")
async def create_checkout(
    request: CheckoutRequest,
    current_user: User = Depends(require_auth)
):
    """Create Stripe checkout session."""
    if request.tier not in SUBSCRIPTION_TIERS:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    tier = SUBSCRIPTION_TIERS[request.tier]
    if tier["price"] is None:
        raise HTTPException(status_code=400, detail="Contact sales for enterprise")
    
    # In production, create actual Stripe checkout
    # For now, return mock session
    return {
        "checkout_url": f"https://checkout.stripe.com/mock?tier={request.tier}",
        "session_id": f"cs_mock_{request.tier}"
    }

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks."""
    # In production, verify signature and handle events
    payload = await request.json()
    event_type = payload.get("type")
    
    if event_type == "checkout.session.completed":
        # Update user subscription
        pass
    elif event_type == "customer.subscription.deleted":
        # Downgrade to free
        pass
    
    return {"status": "received"}

@router.post("/cancel")
async def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Cancel subscription (downgrade to free)."""
    current_user.subscription_tier = "free"
    db.commit()
    return {"message": "Subscription cancelled", "tier": "free"}
