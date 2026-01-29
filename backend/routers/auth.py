from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
import httpx
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.config import get_settings
from backend.services.auth_service import create_access_token, get_current_user, require_auth
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.get("/login")
async def login():
    """Redirect to GitHub OAuth."""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.github_client_id}"
        f"&redirect_uri={settings.github_redirect_uri}"
        f"&scope=user:email,repo"
    )
    return RedirectResponse(url=github_auth_url)

@router.get("/callback")
async def callback(code: str, db: Session = Depends(get_db)):
    """Handle GitHub OAuth callback."""
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_response.json()
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data["error_description"])
        
        github_token = token_data["access_token"]
        
        # Get user info from GitHub
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {github_token}"}
        )
        github_user = user_response.json()
    
    # Find or create user
    user = db.query(User).filter(User.github_id == github_user["id"]).first()
    
    if not user:
        user = User(
            github_id=github_user["id"],
            username=github_user["login"],
            email=github_user.get("email"),
            avatar_url=github_user.get("avatar_url"),
            subscription_tier="free"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.username = github_user["login"]
        user.avatar_url = github_user.get("avatar_url")
        db.commit()
    
    # Create JWT token
    access_token = create_access_token({"sub": str(user.id), "github_token": github_token})
    
    # Redirect to frontend with token
    frontend_url = f"http://localhost:3000/auth/success?token={access_token}"
    return RedirectResponse(url=frontend_url)

@router.get("/me")
async def get_me(current_user: User = Depends(require_auth)):
    """Get current user info."""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "subscription_tier": current_user.subscription_tier
    }

@router.post("/logout")
async def logout():
    """Logout (client should clear token)."""
    return {"message": "Logged out"}
