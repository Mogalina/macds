"""
Workspaces Router - Manages user workspaces.
"""
from fastapi import APIRouter, HTTPException, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path

from backend.database import get_db
from backend.config import get_settings
from backend.models import User, Workspace, WorkspaceType, GitHubToken
from backend.services.auth_service import get_current_user
from backend.services.workspace_service import WorkspaceService
from backend.services.github_service import GitHubService, GitOperations, decrypt_token

settings = get_settings()
router = APIRouter(prefix="/workspaces", tags=["workspaces"])


class CreateWorkspaceRequest(BaseModel):
    name: str
    type: WorkspaceType
    github_repo: Optional[str] = None  # owner/repo format
    github_branch: Optional[str] = "main"
    local_path: Optional[str] = None


class FileWriteRequest(BaseModel):
    content: str


class FileMoveRequest(BaseModel):
    to_path: str


@router.get("")
async def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all workspaces for the current user."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspaces = db.query(Workspace).filter(
        Workspace.user_id == current_user.id
    ).order_by(Workspace.updated_at.desc()).all()
    
    return {
        "workspaces": [
            {
                "id": w.id,
                "name": w.name,
                "type": w.type.value,
                "github_repo": w.github_repo,
                "github_branch": w.github_branch,
                "local_path": w.local_path,
                "last_synced_at": w.last_synced_at.isoformat() if w.last_synced_at else None,
                "created_at": w.created_at.isoformat() if w.created_at else None
            }
            for w in workspaces
        ]
    }


@router.post("")
async def create_workspace(
    request: CreateWorkspaceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new workspace."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Validate based on type
    if request.type == WorkspaceType.GITHUB:
        if not request.github_repo:
            raise HTTPException(status_code=400, detail="github_repo required for GitHub workspace")
        
        # Verify GitHub access
        github_token = db.query(GitHubToken).filter(
            GitHubToken.user_id == current_user.id
        ).first()
        
        if not github_token:
            raise HTTPException(status_code=400, detail="GitHub not connected")
        
        # Create workspace directory
        workspace_dir = WorkspaceService.create_workspace_directory(
            workspace_id=0,  # Will update after creation
            workspace_type="github"
        )
        
        # Clone the repository
        access_token = decrypt_token(github_token.access_token_encrypted)
        owner, repo = request.github_repo.split("/")
        clone_url = f"https://{access_token}@github.com/{request.github_repo}.git"
        
        git_ops = GitOperations(str(workspace_dir / request.github_repo.replace("/", "_")))
        
        try:
            success = await git_ops.clone(clone_url, request.github_branch or "main")
            if not success:
                raise Exception("Clone failed")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")
        
        # Create workspace record
        workspace = Workspace(
            user_id=current_user.id,
            name=request.name or request.github_repo,
            type=WorkspaceType.GITHUB,
            github_repo=request.github_repo,
            github_branch=request.github_branch or "main",
            github_clone_path=str(git_ops.workspace_path),
            last_synced_at=datetime.now()
        )
        
    else:  # LOCAL
        if not request.local_path:
            raise HTTPException(status_code=400, detail="local_path required for local workspace")
        
        # Validate path exists
        local_path = Path(request.local_path).resolve()
        if not local_path.exists():
            raise HTTPException(status_code=400, detail=f"Path does not exist: {request.local_path}")
        if not local_path.is_dir():
            raise HTTPException(status_code=400, detail="Path must be a directory")
        
        workspace = Workspace(
            user_id=current_user.id,
            name=request.name or local_path.name,
            type=WorkspaceType.LOCAL,
            local_path=str(local_path)
        )
    
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    return {
        "id": workspace.id,
        "name": workspace.name,
        "type": workspace.type.value,
        "github_repo": workspace.github_repo,
        "local_path": workspace.local_path,
        "created": True
    }


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get workspace details."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Get workspace path
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    
    # Get file tree
    ws_service = WorkspaceService(workspace_path)
    file_tree = ws_service.get_file_tree()
    
    return {
        "id": workspace.id,
        "name": workspace.name,
        "type": workspace.type.value,
        "github_repo": workspace.github_repo,
        "github_branch": workspace.github_branch,
        "local_path": workspace.local_path,
        "file_tree": file_tree,
        "last_synced_at": workspace.last_synced_at.isoformat() if workspace.last_synced_at else None
    }


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: int,
    delete_files: bool = Query(False, description="Also delete cloned files"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a workspace."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Optionally delete cloned files for GitHub workspaces
    if delete_files and workspace.type == WorkspaceType.GITHUB and workspace.github_clone_path:
        import shutil
        try:
            shutil.rmtree(workspace.github_clone_path)
        except Exception:
            pass  # Ignore file deletion errors
    
    db.delete(workspace)
    db.commit()
    
    return {"deleted": True}


@router.get("/{workspace_id}/files")
async def list_files(
    workspace_id: int,
    path: str = Query("", description="Subdirectory path"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List files in a workspace directory."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    ws_service = WorkspaceService(workspace_path)
    
    files = ws_service.list_files(subpath=path)
    
    return {"path": path, "files": files}


@router.get("/{workspace_id}/files/content")
async def read_file(
    workspace_id: int,
    path: str = Query(..., description="File path"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Read file content."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    ws_service = WorkspaceService(workspace_path)
    
    try:
        file_data = ws_service.read_file(path)
        return file_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{workspace_id}/files/content")
async def write_file(
    workspace_id: int,
    path: str = Query(..., description="File path"),
    request: FileWriteRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Write file content."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    ws_service = WorkspaceService(workspace_path)
    
    try:
        result = ws_service.write_file(path, request.content)
        workspace.updated_at = datetime.now()
        db.commit()
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{workspace_id}/files")
async def delete_file(
    workspace_id: int,
    path: str = Query(..., description="File path"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a file or directory."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    ws_service = WorkspaceService(workspace_path)
    
    try:
        result = ws_service.delete_file(path)
        return result
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{workspace_id}/git/sync")
async def sync_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Sync a GitHub workspace (pull latest changes)."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.type != WorkspaceType.GITHUB:
        raise HTTPException(status_code=400, detail="Sync only available for GitHub workspaces")
    
    git_ops = GitOperations(workspace.github_clone_path)
    success = await git_ops.pull()
    
    if success:
        workspace.last_synced_at = datetime.now()
        db.commit()
    
    return {"synced": success, "synced_at": datetime.now().isoformat()}


@router.get("/{workspace_id}/git/status")
async def git_status(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get git status for a workspace."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.type != WorkspaceType.GITHUB:
        raise HTTPException(status_code=400, detail="Git status only available for GitHub workspaces")
    
    git_ops = GitOperations(workspace.github_clone_path)
    status = await git_ops.get_status()
    
    return status


@router.post("/{workspace_id}/git/commit")
async def commit_changes(
    workspace_id: int,
    message: str = Query(..., description="Commit message"),
    files: Optional[List[str]] = Body(None, description="Files to stage (or all if not specified)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Commit changes in a workspace."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.type != WorkspaceType.GITHUB:
        raise HTTPException(status_code=400, detail="Git commit only available for GitHub workspaces")
    
    git_ops = GitOperations(workspace.github_clone_path)
    success = await git_ops.add_and_commit(message, files)
    
    return {"committed": success}


@router.post("/{workspace_id}/git/push")
async def push_changes(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Push committed changes to GitHub."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.type != WorkspaceType.GITHUB:
        raise HTTPException(status_code=400, detail="Git push only available for GitHub workspaces")
    
    git_ops = GitOperations(workspace.github_clone_path)
    success = await git_ops.push(branch=workspace.github_branch or "main")
    
    return {"pushed": success}


@router.get("/{workspace_id}/search")
async def search_files(
    workspace_id: int,
    query: str = Query(..., description="Search pattern"),
    file_pattern: str = Query("*", description="File glob pattern"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for content in workspace files."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace_path = workspace.github_clone_path if workspace.type == WorkspaceType.GITHUB else workspace.local_path
    ws_service = WorkspaceService(workspace_path)
    
    results = ws_service.search_files(query, file_pattern)
    
    return {"query": query, "results": results}
