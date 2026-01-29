from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from backend.database import get_db
from backend.models import Stack, Workflow, User
from backend.services.auth_service import get_current_user, require_auth

router = APIRouter(prefix="/registry", tags=["registry"])

class PublishRequest(BaseModel):
    type: str  # "stack" or "workflow"
    id: int

@router.get("/stacks")
async def browse_stacks(
    q: str = Query("", description="Search query"),
    sort: str = Query("downloads", description="Sort by: downloads, recent"),
    db: Session = Depends(get_db)
):
    """Browse public stacks in the registry."""
    query = db.query(Stack).filter(Stack.is_public == True)
    
    if q:
        query = query.filter(Stack.name.ilike(f"%{q}%"))
    
    if sort == "recent":
        query = query.order_by(Stack.created_at.desc())
    else:
        query = query.order_by(Stack.downloads.desc())
    
    stacks = query.limit(50).all()
    
    return [
        {
            "id": s.id,
            "name": s.name,
            "slug": s.slug,
            "description": s.description,
            "downloads": s.downloads,
            "owner": s.owner.username if s.owner else "Redstone"
        }
        for s in stacks
    ]

@router.get("/workflows")
async def browse_workflows(
    q: str = Query(""),
    db: Session = Depends(get_db)
):
    """Browse public workflows."""
    query = db.query(Workflow).filter(Workflow.is_public == True)
    
    if q:
        query = query.filter(Workflow.name.ilike(f"%{q}%"))
    
    workflows = query.order_by(Workflow.downloads.desc()).limit(50).all()
    
    return [
        {
            "id": w.id,
            "name": w.name,
            "slug": w.slug,
            "description": w.description,
            "downloads": w.downloads,
            "owner": w.owner.username if w.owner else "Redstone"
        }
        for w in workflows
    ]

@router.post("/publish")
async def publish_to_registry(
    request: PublishRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Publish a stack or workflow to the public registry."""
    if request.type == "stack":
        item = db.query(Stack).filter(
            Stack.id == request.id,
            Stack.user_id == current_user.id
        ).first()
    else:
        item = db.query(Workflow).filter(
            Workflow.id == request.id,
            Workflow.user_id == current_user.id
        ).first()
    
    if not item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.is_public = True
    db.commit()
    
    return {"message": "Published successfully", "slug": item.slug}

@router.post("/pull/{type}/{slug}")
async def pull_from_registry(
    type: str,
    slug: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Pull a stack or workflow from the registry."""
    if type == "stack":
        item = db.query(Stack).filter(Stack.slug == slug, Stack.is_public == True).first()
    else:
        item = db.query(Workflow).filter(Workflow.slug == slug, Workflow.is_public == True).first()
    
    if not item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Increment download count
    item.downloads += 1
    db.commit()
    
    return {
        "name": item.name,
        "config": item.config if hasattr(item, 'config') else item.stages,
        "description": item.description
    }
