from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from backend.database import get_db
from backend.models import Stack, User
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/stacks", tags=["stacks"])

class StackCreate(BaseModel):
    name: str
    description: str = ""
    config: dict
    is_public: bool = False

class StackUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[dict] = None
    is_public: Optional[bool] = None

class StackResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    config: dict
    is_public: bool
    is_builtin: bool
    downloads: int
    owner_username: Optional[str]
    
    class Config:
        from_attributes = True

# Pre-built stacks
BUILTIN_STACKS = [
    {
        "name": "Architect Pro",
        "slug": "architect-pro",
        "description": "Best for system design and large codebases. Uses Claude 3.5 Sonnet for deep architectural reasoning.",
        "config": {
            "default_model": "anthropic/claude-3.5-sonnet",
            "agents": {
                "ArchitectAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.5},
                "ProductAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.7},
                "ImplementationAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.3},
            },
            "focus": "architecture"
        },
        "tier_required": "developer"
    },
    {
        "name": "Speed Demon",
        "slug": "speed-demon",
        "description": "Optimized for fast iteration and prototyping. Uses GPT-4o-mini and Gemini Flash.",
        "config": {
            "default_model": "openai/gpt-4o-mini",
            "agents": {
                "ArchitectAgent": {"model": "openai/gpt-4o-mini", "temperature": 0.7},
                "ProductAgent": {"model": "google/gemini-flash", "temperature": 0.8},
                "ImplementationAgent": {"model": "openai/gpt-4o-mini", "temperature": 0.5},
            },
            "focus": "speed"
        },
        "tier_required": "free"
    },
    {
        "name": "Full Stack",
        "slug": "full-stack",
        "description": "Balanced stack for production applications. Combines Claude and GPT-4o.",
        "config": {
            "default_model": "anthropic/claude-3.5-sonnet",
            "agents": {
                "ArchitectAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.5},
                "ProductAgent": {"model": "openai/gpt-4o", "temperature": 0.7},
                "ImplementationAgent": {"model": "openai/gpt-4o", "temperature": 0.3},
                "ReviewerAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.3},
            },
            "focus": "balanced"
        },
        "tier_required": "developer"
    },
    {
        "name": "Budget Builder",
        "slug": "budget-builder",
        "description": "Cost-effective development with Gemini Pro. Great for learning and small projects.",
        "config": {
            "default_model": "google/gemini-pro",
            "agents": {
                "ArchitectAgent": {"model": "google/gemini-pro", "temperature": 0.6},
                "ProductAgent": {"model": "google/gemini-pro", "temperature": 0.7},
                "ImplementationAgent": {"model": "google/gemini-pro", "temperature": 0.4},
            },
            "focus": "cost"
        },
        "tier_required": "free"
    },
    {
        "name": "Security First",
        "slug": "security-first",
        "description": "Security-focused stack with enhanced review. Claude for deep security analysis.",
        "config": {
            "default_model": "anthropic/claude-3.5-sonnet",
            "agents": {
                "ArchitectAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.3},
                "ReviewerAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.2},
                "BuildTestAgent": {"model": "anthropic/claude-3.5-sonnet", "temperature": 0.3},
            },
            "focus": "security"
        },
        "tier_required": "team"
    },
]

@router.get("/builtin")
async def get_builtin_stacks():
    """Get all pre-built stacks."""
    return BUILTIN_STACKS

@router.get("")
async def list_stacks(
    public_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """List stacks (user's + public)."""
    query = db.query(Stack)
    
    if public_only:
        query = query.filter(Stack.is_public == True)
    elif current_user:
        query = query.filter(
            (Stack.user_id == current_user.id) | (Stack.is_public == True)
        )
    else:
        query = query.filter(Stack.is_public == True)
    
    stacks = query.order_by(Stack.downloads.desc()).limit(50).all()
    return [
        StackResponse(
            id=s.id,
            name=s.name,
            slug=s.slug,
            description=s.description or "",
            config=s.config,
            is_public=s.is_public,
            is_builtin=s.is_builtin,
            downloads=s.downloads,
            owner_username=s.owner.username if s.owner else None
        )
        for s in stacks
    ]

@router.post("")
async def create_stack(
    stack: StackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a custom stack."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required to create stacks")
    
    slug = stack.name.lower().replace(" ", "-")
    existing = db.query(Stack).filter(Stack.slug == slug).first()
    if existing:
        slug = f"{slug}-{current_user.id}"
    
    new_stack = Stack(
        user_id=current_user.id,
        name=stack.name,
        slug=slug,
        description=stack.description,
        config=stack.config,
        is_public=stack.is_public
    )
    db.add(new_stack)
    db.commit()
    db.refresh(new_stack)
    
    return {"id": new_stack.id, "slug": new_stack.slug}

@router.get("/{slug}")
async def get_stack(slug: str, db: Session = Depends(get_db)):
    """Get stack by slug."""
    # Check builtins first
    for builtin in BUILTIN_STACKS:
        if builtin["slug"] == slug:
            return builtin
    
    stack = db.query(Stack).filter(Stack.slug == slug).first()
    if not stack:
        raise HTTPException(status_code=404, detail="Stack not found")
    
    return StackResponse(
        id=stack.id,
        name=stack.name,
        slug=stack.slug,
        description=stack.description or "",
        config=stack.config,
        is_public=stack.is_public,
        is_builtin=stack.is_builtin,
        downloads=stack.downloads,
        owner_username=stack.owner.username if stack.owner else None
    )
