from typing import Optional, Generator
import httpx
from redstone_sdk.config import Config, get_token

class RedstoneClient:
    def __init__(self, config: Optional[Config] = None, token: Optional[str] = None):
        self.config = config or Config.load()
        self.token = token or get_token()
        self._client = httpx.Client(
            base_url=self.config.api_url,
            headers=self._headers(),
            timeout=60.0
        )
    
    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def _request(self, method: str, path: str, **kwargs) -> dict:
        response = self._client.request(method, path, **kwargs)
        response.raise_for_status()
        return response.json()
    
    # Auth
    def get_me(self) -> dict:
        return self._request("GET", "/auth/me")
    
    # Stacks
    def list_builtin_stacks(self) -> list:
        return self._request("GET", "/stacks/builtin")
    
    def list_stacks(self, public_only: bool = False) -> list:
        return self._request("GET", f"/stacks?public_only={public_only}")
    
    def get_stack(self, slug: str) -> dict:
        return self._request("GET", f"/stacks/{slug}")
    
    def create_stack(self, name: str, description: str, config: dict, is_public: bool = False) -> dict:
        return self._request("POST", "/stacks", json={
            "name": name,
            "description": description,
            "config": config,
            "is_public": is_public
        })
    
    # Chat
    def chat(
        self, 
        content: str, 
        stack_slug: Optional[str] = None, 
        session_id: Optional[int] = None,
        workflow_id: Optional[int] = None,
        workspace_id: Optional[int] = None
    ) -> dict:
        """Send a chat message. Optionally use a custom workflow instead of a stack."""
        payload = {
            "content": content,
            "stack_slug": stack_slug or self.config.default_stack,
            "session_id": session_id
        }
        if workflow_id:
            payload["workflow_id"] = workflow_id
        if workspace_id:
            payload["workspace_id"] = workspace_id
        return self._request("POST", "/agents/chat", json=payload)
    
    def list_sessions(self) -> list:
        return self._request("GET", "/agents/sessions")
    
    def get_session(self, session_id: int) -> dict:
        return self._request("GET", f"/agents/sessions/{session_id}")
    
    # Elastic Swarm Workflows
    def list_workflows(self) -> list:
        """List all workflows for the current user."""
        return self._request("GET", "/elastic-swarm/workflows")
    
    def get_workflow(self, workflow_id: int) -> dict:
        """Get a specific workflow."""
        return self._request("GET", f"/elastic-swarm/workflows/{workflow_id}")
    
    def create_workflow(
        self, 
        name: str, 
        nodes: list, 
        edges: list, 
        description: str = "",
        global_settings: Optional[dict] = None
    ) -> dict:
        """Create a new Elastic Swarm workflow."""
        return self._request("POST", "/elastic-swarm/workflows", json={
            "name": name,
            "description": description,
            "nodes": nodes,
            "edges": edges,
            "global_settings": global_settings or {}
        })
    
    def delete_workflow(self, workflow_id: int) -> dict:
        """Delete a workflow."""
        return self._request("DELETE", f"/elastic-swarm/workflows/{workflow_id}")
    
    def export_workflow_yaml(self, workflow_id: int) -> str:
        """Export workflow as YAML."""
        return self._request("GET", f"/elastic-swarm/workflows/{workflow_id}/yaml")
    
    def import_workflow_yaml(self, name: str, yaml_content: str) -> dict:
        """Import workflow from YAML."""
        return self._request("POST", "/elastic-swarm/import-yaml", json={
            "name": name,
            "yaml_content": yaml_content
        })
    
    # Registry
    def browse_registry(self, query: str = "", sort: str = "downloads") -> list:
        return self._request("GET", f"/registry/stacks?q={query}&sort={sort}")
    
    def pull_stack(self, slug: str) -> dict:
        return self._request("POST", f"/registry/pull/stack/{slug}")
    
    def publish_stack(self, stack_id: int) -> dict:
        return self._request("POST", "/registry/publish", json={"type": "stack", "id": stack_id})
    
    # Billing
    def get_usage(self) -> dict:
        return self._request("GET", "/billing/usage")
    
    def close(self):
        self._client.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, *args):
        self.close()
