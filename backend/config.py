import os
from pathlib import Path
from dataclasses import dataclass, field
from functools import lru_cache
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Settings:
    # App
    app_name: str = "Redstone"
    debug: bool = False
    secret_key: str = ""
    
    # JWT
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Database
    database_url: str = "postgresql://localhost/redstone"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # GitHub OAuth
    github_client_id: str = ""
    github_client_secret: str = ""
    github_redirect_uri: str = "http://localhost:8000/auth/github/callback"
    
    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    
    # LLM APIs
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    openrouter_api_key: str = ""
    
    # Paths
    macds_path: Path = field(default_factory=lambda: Path(__file__).parent.parent / "macds")
    workspaces_path: Path = field(default_factory=lambda: Path(__file__).parent.parent / "workspaces")
    
    # Frontend
    frontend_url: str = "http://localhost:3000"
    
    # Encryption
    encryption_key: str = ""  # For encrypting GitHub tokens
    
    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            debug=os.getenv("DEBUG", "false").lower() == "true",
            secret_key=os.getenv("SECRET_KEY", "dev-secret-change-in-production"),
            jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
            jwt_expire_minutes=int(os.getenv("JWT_EXPIRE_MINUTES", str(60 * 24 * 7))),
            database_url=os.getenv("DATABASE_URL", "postgresql://localhost/redstone"),
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
            github_client_id=os.getenv("GITHUB_CLIENT_ID", ""),
            github_client_secret=os.getenv("GITHUB_CLIENT_SECRET", ""),
            github_redirect_uri=os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/auth/callback"),
            stripe_secret_key=os.getenv("STRIPE_SECRET_KEY", ""),
            stripe_webhook_secret=os.getenv("STRIPE_WEBHOOK_SECRET", ""),
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
            google_api_key=os.getenv("GOOGLE_API_KEY", ""),
            openrouter_api_key=os.getenv("OPENROUTER_API_KEY", ""),
            frontend_url=os.getenv("FRONTEND_URL", "http://localhost:3000"),
            encryption_key=os.getenv("ENCRYPTION_KEY", os.getenv("SECRET_KEY", "dev-secret-change-in-production")),
        )
    
    def get_llm_provider(self) -> Optional[str]:
        """Return the first available LLM provider."""
        if self.anthropic_api_key:
            return "anthropic"
        if self.openai_api_key:
            return "openai"
        if self.google_api_key:
            return "google"
        if self.openrouter_api_key:
            return "openrouter"
        return None
    
    def validate_llm_keys(self) -> bool:
        """Check if at least one LLM API key is configured."""
        return bool(
            self.openai_api_key or 
            self.anthropic_api_key or 
            self.google_api_key or 
            self.openrouter_api_key
        )

@lru_cache
def get_settings() -> Settings:
    return Settings.from_env()
