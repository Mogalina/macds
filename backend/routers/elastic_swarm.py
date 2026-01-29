"""
Elastic Swarm API Router
Workflow management and configuration endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.database import get_db
from backend.models.models import User, Workflow
from backend.services.workflow_service import WorkflowService, LLM_PROVIDERS, AGENT_TYPES, WORKFLOW_TEMPLATES
from backend.services.auth_service import require_auth


router = APIRouter(prefix="/elastic-swarm", tags=["elastic-swarm"])


# Pydantic Models
class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    nodes: Optional[List[Dict[str, Any]]] = []
    edges: Optional[List[Dict[str, Any]]] = []
    global_settings: Optional[Dict[str, Any]] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    global_settings: Optional[Dict[str, Any]] = None


class YAMLImport(BaseModel):
    name: str
    yaml_content: str


class WorkflowResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    global_settings: Optional[Dict[str, Any]]
    yaml_config: Optional[str]
    is_public: bool
    is_template: bool
    created_at: str
    updated_at: Optional[str]
    
    class Config:
        from_attributes = True


def check_subscription(user: User):
    """Check if user has a paid subscription for Elastic Swarm."""
    if user.subscription_tier not in ["pro", "team", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Elastic Swarm requires a Pro or Team subscription"
        )


# LLM Providers & Agent Types Endpoints
@router.get("/llm-providers")
async def get_llm_providers():
    """Get available LLM providers and their models."""
    return LLM_PROVIDERS


@router.get("/agent-types")
async def get_agent_types():
    """Get available agent types."""
    return AGENT_TYPES


@router.get("/templates")
async def get_templates():
    """Get starter workflow templates."""
    return WORKFLOW_TEMPLATES


# Workflow CRUD Endpoints
@router.post("/workflows", response_model=WorkflowResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Create a new Elastic Swarm workflow."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    
    try:
        new_workflow = service.create_workflow(
            user_id=current_user.id,
            name=workflow.name,
            description=workflow.description,
            nodes=workflow.nodes,
            edges=workflow.edges,
            global_settings=workflow.global_settings,
        )
        
        return {
            "id": new_workflow.id,
            "name": new_workflow.name,
            "slug": new_workflow.slug,
            "description": new_workflow.description,
            "nodes": new_workflow.nodes or [],
            "edges": new_workflow.edges or [],
            "global_settings": new_workflow.global_settings,
            "yaml_config": new_workflow.yaml_config,
            "is_public": new_workflow.is_public,
            "is_template": new_workflow.is_template,
            "created_at": new_workflow.created_at.isoformat() if new_workflow.created_at else "",
            "updated_at": new_workflow.updated_at.isoformat() if new_workflow.updated_at else None,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/workflows")
async def list_workflows(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """List all workflows for the current user."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    workflows = service.get_workflows(current_user.id)
    
    return {
        "workflows": [
            {
                "id": w.id,
                "name": w.name,
                "slug": w.slug,
                "description": w.description,
                "is_public": w.is_public,
                "is_template": w.is_template,
                "node_count": len(w.nodes or []),
                "created_at": w.created_at.isoformat() if w.created_at else "",
            }
            for w in workflows
        ]
    }


@router.get("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Get a specific workflow."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    workflow = service.get_workflow(workflow_id, current_user.id)
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {
        "id": workflow.id,
        "name": workflow.name,
        "slug": workflow.slug,
        "description": workflow.description,
        "nodes": workflow.nodes or [],
        "edges": workflow.edges or [],
        "global_settings": workflow.global_settings,
        "yaml_config": workflow.yaml_config,
        "is_public": workflow.is_public,
        "is_template": workflow.is_template,
        "created_at": workflow.created_at.isoformat() if workflow.created_at else "",
        "updated_at": workflow.updated_at.isoformat() if workflow.updated_at else None,
    }


@router.put("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    workflow: WorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Update a workflow."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    updated = service.update_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
        name=workflow.name,
        description=workflow.description,
        nodes=workflow.nodes,
        edges=workflow.edges,
        global_settings=workflow.global_settings,
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {
        "id": updated.id,
        "name": updated.name,
        "slug": updated.slug,
        "description": updated.description,
        "nodes": updated.nodes or [],
        "edges": updated.edges or [],
        "global_settings": updated.global_settings,
        "yaml_config": updated.yaml_config,
        "is_public": updated.is_public,
        "is_template": updated.is_template,
        "created_at": updated.created_at.isoformat() if updated.created_at else "",
        "updated_at": updated.updated_at.isoformat() if updated.updated_at else None,
    }


@router.delete("/workflows/{workflow_id}")
async def delete_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Delete a workflow."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    deleted = service.delete_workflow(workflow_id, current_user.id)
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {"message": "Workflow deleted"}


# YAML Import/Export Endpoints
@router.post("/workflows/{workflow_id}/yaml")
async def export_workflow_yaml(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Export workflow as YAML."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    yaml_content = service.export_yaml(workflow_id, current_user.id)
    
    if yaml_content is None:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {"yaml": yaml_content}


@router.post("/import-yaml", response_model=WorkflowResponse)
async def import_workflow_yaml(
    data: YAMLImport,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Import workflow from YAML."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    
    try:
        workflow = service.import_yaml(
            user_id=current_user.id,
            yaml_content=data.yaml_content,
            name=data.name,
        )
        
        return {
            "id": workflow.id,
            "name": workflow.name,
            "slug": workflow.slug,
            "description": workflow.description,
            "nodes": workflow.nodes or [],
            "edges": workflow.edges or [],
            "global_settings": workflow.global_settings,
            "yaml_config": workflow.yaml_config,
            "is_public": workflow.is_public,
            "is_template": workflow.is_template,
            "created_at": workflow.created_at.isoformat() if workflow.created_at else "",
            "updated_at": workflow.updated_at.isoformat() if workflow.updated_at else None,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Use workflow for chat
@router.post("/workflows/{workflow_id}/execute")
async def execute_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    """Start a chat session using this workflow."""
    check_subscription(current_user)
    
    service = WorkflowService(db)
    workflow = service.get_workflow(workflow_id, current_user.id)
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Return the workflow configuration for use in chat
    return {
        "workflow_id": workflow.id,
        "name": workflow.name,
        "agents": workflow.nodes,
        "connections": workflow.edges,
        "global_settings": workflow.global_settings,
        "ready": True,
    }
