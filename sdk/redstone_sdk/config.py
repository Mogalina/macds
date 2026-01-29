import os
from pathlib import Path
from dataclasses import dataclass
from typing import Optional
import yaml

CONFIG_DIR = Path.home() / ".redstone"
CONFIG_FILE = CONFIG_DIR / "config.yaml"
TOKEN_FILE = CONFIG_DIR / "token"

@dataclass
class Config:
    api_url: str = "https://api.redstone.dev"
    default_stack: str = "speed-demon"
    
    @classmethod
    def load(cls) -> "Config":
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE) as f:
                data = yaml.safe_load(f) or {}
            return cls(
                api_url=data.get("api_url", cls.api_url),
                default_stack=data.get("default_stack", cls.default_stack),
            )
        return cls()
    
    def save(self) -> None:
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_FILE, "w") as f:
            yaml.dump({
                "api_url": self.api_url,
                "default_stack": self.default_stack,
            }, f)

def get_token() -> Optional[str]:
    if TOKEN_FILE.exists():
        return TOKEN_FILE.read_text().strip()
    return None

def save_token(token: str) -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(token)
    TOKEN_FILE.chmod(0o600)

def clear_token() -> None:
    if TOKEN_FILE.exists():
        TOKEN_FILE.unlink()
