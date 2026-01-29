"""
Agents Router - Handles chat and agent interactions.
"""
from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import asyncio
import json
from datetime import datetime

from backend.database import get_db
from backend.models import ChatSession, User, Workspace, AgentTask, TaskStatus, WorkspaceType, Workflow
from backend.services.auth_service import get_current_user, decode_token
from backend.services.agent_service import AgentOrchestrator, WorkspaceContext, WorkflowConfig
from backend.services.bulk_insert import index_folder, generate_context_prompt, BulkInsertResult
from backend.services.bulk_insert import index_folder, generate_context_prompt, BulkInsertResult
from backend.routers.stacks import BUILTIN_STACKS

router = APIRouter(prefix="/agents", tags=["agents"])


def check_stack_access(user: User, stack_slug: str):
    """Check if user has access to the requested stack."""
    # Find stack config
    stack = next((s for s in BUILTIN_STACKS if s["slug"] == stack_slug), None)
    if not stack:
        # If not builtin, it might be a custom stack which are allowed
        return
    
    tier_required = stack.get("tier_required", "free")
    
    # Tier hierarchy
    tiers = ["free", "developer", "team", "enterprise"]
    
    try:
        user_level = tiers.index(user.subscription_tier)
        req_level = tiers.index(tier_required)
        
        if user_level < req_level:
            raise HTTPException(
                status_code=403,
                detail=f"This stack requires {tier_required.title()} tier"
            )
    except ValueError:
        # If invalid tier, default to deny if required is not free
        if tier_required != "free":
             raise HTTPException(status_code=403, detail="Invalid subscription tier")


class ChatMessage(BaseModel):
    content: str
    stack_slug: Optional[str] = "speed-demon"
    session_id: Optional[int] = None
    workspace_id: Optional[int] = None
    workflow_id: Optional[int] = None  # Use custom Elastic Swarm workflow
    apply_changes: bool = False  # Whether to apply file changes to workspace


class AgentResponse(BaseModel):
    message: str
    agent: str
    artifacts: list[dict] = []
    files_modified: list[str] = []
    status: str = "complete"


def _get_workspace_context(
    workspace: Workspace
) -> WorkspaceContext:
    """Build workspace context from database model."""
    workspace_path = (
        workspace.github_clone_path 
        if workspace.type == WorkspaceType.GITHUB 
        else workspace.local_path
    )
    
    return WorkspaceContext(
        workspace_id=workspace.id,
        workspace_path=workspace_path,
        workspace_type=workspace.type.value,
        github_repo=workspace.github_repo
    )


@router.post("/chat")
async def chat(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Send a message and get response (non-streaming)."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")

    # Check subscription access for the requested stack
    check_stack_access(current_user, message.stack_slug)

    # Get workspace context if specified
    workspace_context = None
    if message.workspace_id and current_user:
        workspace = db.query(Workspace).filter(
            Workspace.id == message.workspace_id,
            Workspace.user_id == current_user.id
        ).first()
        if workspace:
            workspace_context = _get_workspace_context(workspace)
    
    # Load workflow config if workflow_id provided
    workflow_config = None
    if message.workflow_id:
        workflow = db.query(Workflow).filter(
            Workflow.id == message.workflow_id
        ).first()
        if workflow:
            # Convert workflow nodes to agents dict
            agents_dict = {}
            for node in (workflow.nodes or []):
                node_id = node.get("id")
                node_data = node.get("data", {})
                agents_dict[node_id] = {
                    "type": node_data.get("agentType", "custom"),
                    "label": node_data.get("label", "Agent"),
                    "model": node_data.get("model", "gpt-4o-mini"),
                    "provider": node_data.get("provider", "openai"),
                    "temperature": node_data.get("temperature", 0.7),
                    "system_prompt": node_data.get("systemPrompt", "")
                }
            
            # Convert edges to connections
            connections = []
            for edge in (workflow.edges or []):
                connections.append({
                    "from": edge.get("source"),
                    "to": edge.get("target")
                })
            
            workflow_config = WorkflowConfig(
                workflow_id=workflow.id,
                name=workflow.name,
                agents=agents_dict,
                connections=connections,
                global_settings=workflow.global_settings or {}
            )
    
    orchestrator = AgentOrchestrator(
        stack_slug=message.stack_slug, 
        user=current_user,
        workspace=workspace_context,
        workflow_id=message.workflow_id,
        workflow_config=workflow_config
    )
    
    response = await orchestrator.process_message(message.content)
    
    # Apply file changes if requested
    if message.apply_changes and workspace_context:
        file_results = await orchestrator.execute_file_operations()
        response["file_results"] = file_results
    
    # Save to session if logged in
    if current_user and message.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == message.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if session:
            messages = session.messages or []
            messages.append({"role": "user", "content": message.content})
            messages.append({
                "role": "assistant", 
                "content": response["message"], 
                "agent": response["agent"],
                "files_modified": response.get("files_modified", [])
            })
            session.messages = messages
            session.updated_at = datetime.now()
            db.commit()
            
            # Create agent task record
            task = AgentTask(
                session_id=session.id,
                workspace_id=message.workspace_id,
                agent_name=response["agent"],
                status=TaskStatus.COMPLETED,
                input_data={"message": message.content},
                output_data={"response": response["message"]},
                files_modified=response.get("files_modified", []),
                started_at=datetime.now(),
                completed_at=datetime.now()
            )
            db.add(task)
            db.commit()
    
    return response


class BulkInsertRequest(BaseModel):
    folder_path: str
    session_id: Optional[int] = None
    max_files: int = 500
    include_content: bool = True


@router.post("/bulk-insert")
async def bulk_insert(
    request: BulkInsertRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Index all files in a folder for context injection.
    
    This endpoint processes a folder and returns indexed file information
    that can be used as context for chat conversations.
    """
    # Index the folder
    result = await index_folder(
        folder_path=request.folder_path,
        max_files=request.max_files,
        include_content=request.include_content
    )
    
    # Generate context prompt for chat
    context_prompt = generate_context_prompt(result)
    
    # Optionally store in session
    if request.session_id and current_user:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if session:
            messages = session.messages or []
            messages.append({
                "role": "system",
                "content": f"[Bulk Insert] Indexed {result.indexed_files} files from {result.folder_path}",
                "context": context_prompt,
                "files_indexed": [f.relative_path for f in result.files]
            })
            session.messages = messages
            db.commit()
    
    return {
        "success": len(result.errors) == 0,
        "folder_path": result.folder_path,
        "indexed_files": result.indexed_files,
        "skipped_files": result.skipped_files,
        "total_size_kb": round(result.total_size / 1024, 1),
        "summary": result.summary,
        "files": [
            {
                "path": f.relative_path,
                "language": f.language,
                "lines": f.line_count,
                "size": f.size
            }
            for f in result.files
        ],
        "errors": result.errors,
        "context_prompt": context_prompt if request.include_content else None
    }


@router.get("/sessions")
async def list_sessions(
    workspace_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List user's chat sessions."""
    if not current_user:
        return []
    
    query = db.query(ChatSession).filter(ChatSession.user_id == current_user.id)
    
    if workspace_id:
        query = query.filter(ChatSession.workspace_id == workspace_id)
    
    sessions = query.order_by(ChatSession.updated_at.desc()).limit(50).all()
    
    return [
        {
            "id": s.id,
            "title": s.title,
            "workspace_id": s.workspace_id,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "updated_at": s.updated_at.isoformat() if s.updated_at else None,
            "message_count": len(s.messages or [])
        }
        for s in sessions
    ]


@router.post("/sessions")
async def create_session(
    title: str = "New Chat",
    stack_slug: str = "speed-demon",
    workspace_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new chat session."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required")
    
    # Validate workspace if specified
    if workspace_id:
        workspace = db.query(Workspace).filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        ).first()
        if not workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
    
    session = ChatSession(
        user_id=current_user.id,
        workspace_id=workspace_id,
        title=title,
        messages=[]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {"id": session.id, "title": session.title, "workspace_id": workspace_id}


@router.get("/sessions/{session_id}")
async def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific session with messages."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.user_id and (not current_user or session.user_id != current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "id": session.id,
        "title": session.title,
        "workspace_id": session.workspace_id,
        "messages": session.messages or [],
        "created_at": session.created_at.isoformat() if session.created_at else None,
        "updated_at": session.updated_at.isoformat() if session.updated_at else None
    }


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a chat session."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required")
    
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    
    return {"deleted": True}


@router.get("/sessions/{session_id}/tasks")
async def list_session_tasks(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List agent tasks for a session."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required")
    
    # Verify session belongs to user
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    tasks = db.query(AgentTask).filter(
        AgentTask.session_id == session_id
    ).order_by(AgentTask.created_at.desc()).all()
    
    return [
        {
            "id": t.id,
            "agent_name": t.agent_name,
            "status": t.status.value,
            "files_modified": t.files_modified or [],
            "started_at": t.started_at.isoformat() if t.started_at else None,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None
        }
        for t in tasks
    ]


# WebSocket for streaming responses
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)
    
    async def send_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/{client_id}")
async def websocket_chat(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for streaming chat."""
    await manager.connect(websocket, client_id)
    
    # Try to get user from token
    user = None
    user_id = None
    try:
        token = websocket.query_params.get("token")
        if token:
            payload = decode_token(token)
            user_id = payload.get("sub")
    except:
        pass
    
    try:
        while True:
            data = await websocket.receive_json()
            
            message = data.get("content", "")
            stack_slug = data.get("stack", "speed-demon")
            workspace_id = data.get("workspace_id")
            apply_changes = data.get("apply_changes", False)
            
            # Check stack access if we identified the user
            if user_id:
                # We need to fetch the user object to check tier
                 from backend.database import SessionLocal
                 db = SessionLocal()
                 try:
                     user = db.query(User).filter(User.id == user_id).first()
                     if user:
                         try:
                             check_stack_access(user, stack_slug)
                         except HTTPException as e:
                             await manager.send_message(client_id, {
                                 "type": "error",
                                 "error": e.detail
                             })
                             continue
                 finally:
                     db.close()

            # Get workspace context
            workspace_context = None
            if workspace_id and user_id:
                from backend.database import SessionLocal
                db = SessionLocal()
                try:
                    workspace = db.query(Workspace).filter(
                        Workspace.id == workspace_id
                    ).first()
                    if workspace:
                        workspace_context = _get_workspace_context(workspace)
                finally:
                    db.close()
            
            # Send typing indicator
            await manager.send_message(client_id, {
                "type": "status",
                "status": "thinking",
                "agent": "Orchestrator"
            })
            
            # Process with agents
            orchestrator = AgentOrchestrator(
                stack_slug=stack_slug, 
                user=user,
                workspace=workspace_context
            )
            
            async for chunk in orchestrator.stream_message(message):
                await manager.send_message(client_id, chunk)
            
            # Apply file changes if requested
            if apply_changes and workspace_context:
                file_results = await orchestrator.execute_file_operations()
                await manager.send_message(client_id, {
                    "type": "file_operations",
                    "results": file_results
                })
            
            await manager.send_message(client_id, {
                "type": "complete"
            })
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
