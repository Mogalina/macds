from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, LargeBinary, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base
import enum

# Enums
class WorkspaceType(str, enum.Enum):
    GITHUB = "github"
    LOCAL = "local"

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(255))
    avatar_url = Column(String(500))
    subscription_tier = Column(String(50), default="free")
    stripe_customer_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    stacks = relationship("Stack", back_populates="owner")
    workflows = relationship("Workflow", back_populates="owner")
    sessions = relationship("ChatSession", back_populates="user")
    workspaces = relationship("Workspace", back_populates="owner")
    github_token = relationship("GitHubToken", back_populates="user", uselist=False)

class Stack(Base):
    __tablename__ = "stacks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), index=True)
    slug = Column(String(100), unique=True, index=True)
    description = Column(Text)
    config = Column(JSON)  # Agent configs, LLM settings
    is_public = Column(Boolean, default=False)
    is_builtin = Column(Boolean, default=False)
    downloads = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="stacks")

class Workflow(Base):
    """Elastic Swarm workflow definition with visual node graph."""
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100))
    slug = Column(String(100), unique=True, index=True)
    description = Column(Text)
    
    # Visual workflow graph data
    nodes = Column(JSON, default=list)  # Agent nodes with positions, LLM configs
    edges = Column(JSON, default=list)  # Connections between agents
    stages = Column(JSON)  # Legacy: Workflow DAG definition
    
    # Configuration
    yaml_config = Column(Text)  # Declarative YAML representation
    global_settings = Column(JSON, default=dict)  # Default LLM, temperature, etc.
    
    # Metadata
    is_public = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)  # Starter templates
    downloads = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="workflows")

class Workspace(Base):
    """Represents a working directory for agents - either a GitHub repo or local folder."""
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    type = Column(SQLEnum(WorkspaceType), nullable=False)
    
    # GitHub-specific
    github_repo = Column(String(500))  # owner/repo format
    github_branch = Column(String(100), default="main")
    github_clone_path = Column(String(1000))  # Local path where repo is cloned
    
    # Local-specific
    local_path = Column(String(1000))
    
    # Metadata
    last_synced_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="workspaces")
    sessions = relationship("ChatSession", back_populates="workspace")

class GitHubToken(Base):
    """Stores encrypted GitHub OAuth tokens per user."""
    __tablename__ = "github_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    access_token_encrypted = Column(LargeBinary, nullable=False)
    refresh_token_encrypted = Column(LargeBinary, nullable=True)
    expires_at = Column(DateTime(timezone=True))
    scopes = Column(JSON, default=list)  # List of OAuth scopes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="github_token")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)
    stack_id = Column(Integer, ForeignKey("stacks.id"))
    title = Column(String(200))
    messages = Column(JSON, default=list)
    context = Column(JSON, default=dict)  # Working memory
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="sessions")
    workspace = relationship("Workspace", back_populates="sessions")
    stack = relationship("Stack")
    tasks = relationship("AgentTask", back_populates="session")

class AgentTask(Base):
    """Tracks individual agent task executions within a chat session."""
    __tablename__ = "agent_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)
    agent_name = Column(String(100), nullable=False)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.PENDING)
    input_data = Column(JSON)
    output_data = Column(JSON)
    files_modified = Column(JSON, default=list)  # List of file paths
    error = Column(Text)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("ChatSession", back_populates="tasks")
    workspace = relationship("Workspace")

class Usage(Base):
    __tablename__ = "usage"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(String(7))  # YYYY-MM
    requests_count = Column(Integer, default=0)
    tokens_used = Column(Integer, default=0)
    cost_usd = Column(Integer, default=0)  # Stored as cents
    
    user = relationship("User")
