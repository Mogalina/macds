"""
GitHub Service - Handles GitHub OAuth and repository operations.
"""
import httpx
from typing import Optional
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import base64
import hashlib

from backend.config import get_settings

settings = get_settings()


def _get_cipher():
    """Get Fernet cipher for token encryption."""
    # Derive a valid Fernet key from the encryption key
    key = hashlib.sha256(settings.encryption_key.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def encrypt_token(token: str) -> bytes:
    """Encrypt a token for storage."""
    cipher = _get_cipher()
    return cipher.encrypt(token.encode())


def decrypt_token(encrypted: bytes) -> str:
    """Decrypt a stored token."""
    cipher = _get_cipher()
    return cipher.decrypt(encrypted).decode()


class GitHubService:
    """Service for interacting with GitHub API."""
    
    GITHUB_API_BASE = "https://api.github.com"
    GITHUB_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize"
    GITHUB_OAUTH_TOKEN = "https://github.com/login/oauth/access_token"
    
    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            headers = {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Redstone-App"
            }
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            self._client = httpx.AsyncClient(
                base_url=self.GITHUB_API_BASE,
                headers=headers,
                timeout=30.0
            )
        return self._client
    
    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None
    
    @classmethod
    def get_oauth_url(cls, state: str) -> str:
        """Generate GitHub OAuth authorization URL."""
        scopes = "user:email,repo,read:org"
        return (
            f"{cls.GITHUB_OAUTH_AUTHORIZE}"
            f"?client_id={settings.github_client_id}"
            f"&redirect_uri={settings.github_redirect_uri}"
            f"&scope={scopes}"
            f"&state={state}"
        )
    
    @classmethod
    async def exchange_code_for_token(cls, code: str) -> dict:
        """Exchange OAuth code for access token."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                cls.GITHUB_OAUTH_TOKEN,
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": settings.github_redirect_uri,
                },
                headers={"Accept": "application/json"}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_current_user(self) -> dict:
        """Get authenticated user info."""
        client = await self._get_client()
        response = await client.get("/user")
        response.raise_for_status()
        return response.json()
    
    async def get_user_emails(self) -> list[dict]:
        """Get user's email addresses."""
        client = await self._get_client()
        response = await client.get("/user/emails")
        response.raise_for_status()
        return response.json()
    
    async def get_user_repos(
        self, 
        page: int = 1, 
        per_page: int = 30,
        sort: str = "updated"
    ) -> list[dict]:
        """Get repositories for the authenticated user."""
        client = await self._get_client()
        response = await client.get(
            "/user/repos",
            params={
                "page": page,
                "per_page": per_page,
                "sort": sort,
                "affiliation": "owner,collaborator,organization_member"
            }
        )
        response.raise_for_status()
        return response.json()
    
    async def get_repo(self, owner: str, repo: str) -> dict:
        """Get repository details."""
        client = await self._get_client()
        response = await client.get(f"/repos/{owner}/{repo}")
        response.raise_for_status()
        return response.json()
    
    async def get_repo_contents(
        self, 
        owner: str, 
        repo: str, 
        path: str = "",
        ref: Optional[str] = None
    ) -> list[dict]:
        """Get contents of a repository directory."""
        client = await self._get_client()
        params = {}
        if ref:
            params["ref"] = ref
        response = await client.get(
            f"/repos/{owner}/{repo}/contents/{path}",
            params=params
        )
        response.raise_for_status()
        result = response.json()
        return result if isinstance(result, list) else [result]
    
    async def get_file_content(
        self,
        owner: str,
        repo: str,
        path: str,
        ref: Optional[str] = None
    ) -> dict:
        """Get content of a specific file."""
        client = await self._get_client()
        params = {}
        if ref:
            params["ref"] = ref
        response = await client.get(
            f"/repos/{owner}/{repo}/contents/{path}",
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    async def create_or_update_file(
        self,
        owner: str,
        repo: str,
        path: str,
        content: str,
        message: str,
        sha: Optional[str] = None,
        branch: Optional[str] = None
    ) -> dict:
        """Create or update a file in a repository."""
        import base64
        client = await self._get_client()
        
        data = {
            "message": message,
            "content": base64.b64encode(content.encode()).decode()
        }
        if sha:
            data["sha"] = sha
        if branch:
            data["branch"] = branch
        
        response = await client.put(
            f"/repos/{owner}/{repo}/contents/{path}",
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    async def get_branches(self, owner: str, repo: str) -> list[dict]:
        """Get repository branches."""
        client = await self._get_client()
        response = await client.get(f"/repos/{owner}/{repo}/branches")
        response.raise_for_status()
        return response.json()
    
    async def get_commits(
        self,
        owner: str,
        repo: str,
        sha: Optional[str] = None,
        per_page: int = 30
    ) -> list[dict]:
        """Get repository commits."""
        client = await self._get_client()
        params = {"per_page": per_page}
        if sha:
            params["sha"] = sha
        response = await client.get(
            f"/repos/{owner}/{repo}/commits",
            params=params
        )
        response.raise_for_status()
        return response.json()


class GitOperations:
    """Handle local git operations for cloned repositories."""
    
    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path
    
    async def clone(self, repo_url: str, branch: str = "main") -> bool:
        """Clone a repository to the workspace."""
        import asyncio
        process = await asyncio.create_subprocess_exec(
            "git", "clone", "--branch", branch, "--single-branch", repo_url, self.workspace_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        return process.returncode == 0
    
    async def pull(self) -> bool:
        """Pull latest changes."""
        import asyncio
        process = await asyncio.create_subprocess_exec(
            "git", "pull",
            cwd=self.workspace_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        return process.returncode == 0
    
    async def add_and_commit(self, message: str, files: list[str] = None) -> bool:
        """Stage and commit changes."""
        import asyncio
        
        # Add files
        if files:
            for f in files:
                process = await asyncio.create_subprocess_exec(
                    "git", "add", f,
                    cwd=self.workspace_path,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await process.communicate()
        else:
            process = await asyncio.create_subprocess_exec(
                "git", "add", "-A",
                cwd=self.workspace_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
        
        # Commit
        process = await asyncio.create_subprocess_exec(
            "git", "commit", "-m", message,
            cwd=self.workspace_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()
        return process.returncode == 0
    
    async def push(self, remote: str = "origin", branch: str = "main") -> bool:
        """Push commits to remote."""
        import asyncio
        process = await asyncio.create_subprocess_exec(
            "git", "push", remote, branch,
            cwd=self.workspace_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()
        return process.returncode == 0
    
    async def get_status(self) -> dict:
        """Get git status."""
        import asyncio
        process = await asyncio.create_subprocess_exec(
            "git", "status", "--porcelain",
            cwd=self.workspace_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, _ = await process.communicate()
        
        changes = []
        for line in stdout.decode().strip().split("\n"):
            if line:
                status = line[:2].strip()
                path = line[3:]
                changes.append({"status": status, "path": path})
        
        return {"changes": changes, "has_changes": len(changes) > 0}
