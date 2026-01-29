"""
GitHub Router - Handles GitHub OAuth and repository operations.
"""
from fastapi import APIRouter, HTTPException, Depends, Query, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import secrets

from backend.database import get_db
from backend.config import get_settings
from backend.models import User, GitHubToken, Workspace, WorkspaceType
from backend.services.auth_service import get_current_user, create_access_token
from backend.services.github_service import GitHubService, encrypt_token, decrypt_token

settings = get_settings()
router = APIRouter(prefix="/github", tags=["github"])

# Store OAuth state temporarily (in production, use Redis)
_oauth_states: dict[str, dict] = {}


@router.get("/auth")
async def github_auth_redirect():
    """Initiate GitHub OAuth flow."""
    if not settings.github_client_id:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = {"created_at": datetime.now()}
    
    oauth_url = GitHubService.get_oauth_url(state)
    return RedirectResponse(url=oauth_url)


@router.get("/callback")
async def github_auth_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db)
):
    """Handle GitHub OAuth callback."""
    # Validate state
    if state not in _oauth_states:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    
    state_data = _oauth_states.pop(state)
    if datetime.now() - state_data["created_at"] > timedelta(minutes=10):
        raise HTTPException(status_code=400, detail="OAuth state expired")
    
    try:
        # Exchange code for token
        token_data = await GitHubService.exchange_code_for_token(code)
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        # Get user info from GitHub
        github = GitHubService(access_token)
        github_user = await github.get_current_user()
        emails = await github.get_user_emails()
        await github.close()
        
        # Find primary email
        primary_email = next(
            (e["email"] for e in emails if e.get("primary")),
            emails[0]["email"] if emails else None
        )
        
        # Find or create user
        user = db.query(User).filter(User.github_id == github_user["id"]).first()
        
        if not user:
            # Create new user
            user = User(
                github_id=github_user["id"],
                username=github_user["login"],
                email=primary_email,
                avatar_url=github_user.get("avatar_url")
            )
            db.add(user)
            db.flush()
        else:
            # Update existing user
            user.username = github_user["login"]
            user.email = primary_email
            user.avatar_url = github_user.get("avatar_url")
        
        # Store encrypted GitHub token
        encrypted_token = encrypt_token(access_token)
        
        existing_token = db.query(GitHubToken).filter(GitHubToken.user_id == user.id).first()
        if existing_token:
            existing_token.access_token_encrypted = encrypted_token
            existing_token.scopes = token_data.get("scope", "").split(",")
            existing_token.updated_at = datetime.now()
        else:
            github_token = GitHubToken(
                user_id=user.id,
                access_token_encrypted=encrypted_token,
                scopes=token_data.get("scope", "").split(",")
            )
            db.add(github_token)
        
        db.commit()
        
        # Create JWT for our app
        jwt_token = create_access_token(data={"sub": str(user.id)})
        
        # Redirect to frontend with token
        frontend_url = f"{settings.frontend_url}/auth/callback?token={jwt_token}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth failed: {str(e)}")


@router.get("/repos")
async def list_repos(
    page: int = Query(1, ge=1),
    per_page: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List repositories accessible to the user."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Get GitHub token
    github_token = db.query(GitHubToken).filter(
        GitHubToken.user_id == current_user.id
    ).first()
    
    if not github_token:
        raise HTTPException(status_code=400, detail="GitHub not connected")
    
    access_token = decrypt_token(github_token.access_token_encrypted)
    github = GitHubService(access_token)
    
    try:
        repos = await github.get_user_repos(page=page, per_page=per_page)
        return {
            "repos": [
                {
                    "id": r["id"],
                    "name": r["name"],
                    "full_name": r["full_name"],
                    "description": r.get("description"),
                    "private": r["private"],
                    "default_branch": r.get("default_branch", "main"),
                    "language": r.get("language"),
                    "updated_at": r.get("updated_at")
                }
                for r in repos
            ],
            "page": page,
            "per_page": per_page
        }
    finally:
        await github.close()


@router.get("/repos/{owner}/{repo}")
async def get_repo(
    owner: str,
    repo: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get repository details."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    github_token = db.query(GitHubToken).filter(
        GitHubToken.user_id == current_user.id
    ).first()
    
    if not github_token:
        raise HTTPException(status_code=400, detail="GitHub not connected")
    
    access_token = decrypt_token(github_token.access_token_encrypted)
    github = GitHubService(access_token)
    
    try:
        repo_data = await github.get_repo(owner, repo)
        branches = await github.get_branches(owner, repo)
        
        return {
            "repo": {
                "id": repo_data["id"],
                "name": repo_data["name"],
                "full_name": repo_data["full_name"],
                "description": repo_data.get("description"),
                "private": repo_data["private"],
                "default_branch": repo_data.get("default_branch", "main"),
                "language": repo_data.get("language"),
                "size": repo_data.get("size"),
                "clone_url": repo_data.get("clone_url"),
                "ssh_url": repo_data.get("ssh_url")
            },
            "branches": [b["name"] for b in branches]
        }
    finally:
        await github.close()


@router.get("/repos/{owner}/{repo}/contents")
async def get_repo_contents(
    owner: str,
    repo: str,
    path: str = Query("", description="Path within repository"),
    ref: Optional[str] = Query(None, description="Branch or commit"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get contents of a repository path."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    github_token = db.query(GitHubToken).filter(
        GitHubToken.user_id == current_user.id
    ).first()
    
    if not github_token:
        raise HTTPException(status_code=400, detail="GitHub not connected")
    
    access_token = decrypt_token(github_token.access_token_encrypted)
    github = GitHubService(access_token)
    
    try:
        contents = await github.get_repo_contents(owner, repo, path, ref)
        return {
            "path": path,
            "contents": [
                {
                    "name": c["name"],
                    "path": c["path"],
                    "type": c["type"],  # "file" or "dir"
                    "size": c.get("size"),
                    "sha": c.get("sha")
                }
                for c in contents
            ]
        }
    finally:
        await github.close()


@router.get("/repos/{owner}/{repo}/file")
async def get_file_content(
    owner: str,
    repo: str,
    path: str = Query(...),
    ref: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get content of a specific file."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    github_token = db.query(GitHubToken).filter(
        GitHubToken.user_id == current_user.id
    ).first()
    
    if not github_token:
        raise HTTPException(status_code=400, detail="GitHub not connected")
    
    access_token = decrypt_token(github_token.access_token_encrypted)
    github = GitHubService(access_token)
    
    try:
        import base64
        file_data = await github.get_file_content(owner, repo, path, ref)
        
        content = None
        if file_data.get("content"):
            content = base64.b64decode(file_data["content"]).decode("utf-8")
        
        return {
            "path": path,
            "content": content,
            "sha": file_data.get("sha"),
            "size": file_data.get("size"),
            "encoding": file_data.get("encoding")
        }
    finally:
        await github.close()


@router.get("/status")
async def github_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if GitHub is connected for current user."""
    if not current_user:
        return {"connected": False}
    
    github_token = db.query(GitHubToken).filter(
        GitHubToken.user_id == current_user.id
    ).first()
    
    if not github_token:
        return {"connected": False}
    
    return {
        "connected": True,
        "scopes": github_token.scopes,
        "connected_at": github_token.created_at.isoformat() if github_token.created_at else None
    }
