from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.config import get_settings
from backend.database import init_db
from backend.routers import (
    auth_router,
    agents_router,
    stacks_router,
    billing_router,
    registry_router,
    github_router,
    workspaces_router,
)
from backend.routers.elastic_swarm import router as elastic_swarm_router

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    
    # Create workspaces directory
    settings.workspaces_path.mkdir(parents=True, exist_ok=True)
    (settings.workspaces_path / "github").mkdir(exist_ok=True)
    (settings.workspaces_path / "local").mkdir(exist_ok=True)
    
    yield
    # Shutdown

app = FastAPI(
    title="Redstone API",
    description="Multi-Agent Coding Development System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://redstone.dev",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(agents_router)
app.include_router(stacks_router)
app.include_router(billing_router)
app.include_router(registry_router)
app.include_router(github_router)
app.include_router(workspaces_router)
app.include_router(elastic_swarm_router)

@app.get("/")
async def root():
    return {
        "name": "Redstone API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/config/status")
async def config_status():
    """Check configuration status."""
    return {
        "llm_configured": settings.validate_llm_keys(),
        "llm_provider": settings.get_llm_provider(),
        "github_configured": bool(settings.github_client_id and settings.github_client_secret),
        "stripe_configured": bool(settings.stripe_secret_key),
    }
