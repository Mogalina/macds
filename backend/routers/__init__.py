from backend.routers.auth import router as auth_router
from backend.routers.agents import router as agents_router
from backend.routers.stacks import router as stacks_router
from backend.routers.billing import router as billing_router
from backend.routers.registry import router as registry_router
from backend.routers.github import router as github_router
from backend.routers.workspaces import router as workspaces_router

__all__ = [
    "auth_router",
    "agents_router", 
    "stacks_router",
    "billing_router",
    "registry_router",
    "github_router",
    "workspaces_router",
]
