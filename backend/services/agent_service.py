"""
Agent Service - Orchestrates MACDS agents for chat interactions.
"""
from typing import Optional, AsyncGenerator
import asyncio
from dataclasses import dataclass
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.config import get_settings
from backend.routers.stacks import BUILTIN_STACKS
from backend.services.workspace_service import WorkspaceService

settings = get_settings()


@dataclass
class AgentConfig:
    model: str
    temperature: float = 0.7
    max_tokens: int = 4096


@dataclass
class WorkspaceContext:
    """Context for agent file operations."""
    workspace_id: int
    workspace_path: str
    workspace_type: str  # 'github' or 'local'
    github_repo: Optional[str] = None
    
    def get_service(self) -> WorkspaceService:
        return WorkspaceService(self.workspace_path)


@dataclass
class WorkflowConfig:
    """Workflow configuration for agent chaining."""
    workflow_id: int
    name: str
    agents: dict  # agent_id -> agent config
    connections: list[dict]  # list of {from, to} connections
    global_settings: dict


class AgentOrchestrator:
    """Orchestrates MACDS agents for chat interactions."""
    
    def __init__(
        self, 
        stack_slug: str = "speed-demon", 
        user=None,
        workspace: Optional[WorkspaceContext] = None,
        workflow_id: Optional[int] = None,
        workflow_config: Optional[WorkflowConfig] = None
    ):
        self.stack_slug = stack_slug
        self.user = user
        self.workspace = workspace
        self.workflow_id = workflow_id
        self.workflow_config = workflow_config
        self.stack_config = self._load_stack_config()
        self._file_operations: list[dict] = []
        self._agent_outputs: dict[str, str] = {}  # Store outputs for chaining
    
    def _load_stack_config(self) -> dict:
        # If we have a workflow config, convert it to stack format
        if self.workflow_config:
            return self._workflow_to_stack_config(self.workflow_config)
        
        for stack in BUILTIN_STACKS:
            if stack["slug"] == self.stack_slug:
                return stack["config"]
        return BUILTIN_STACKS[1]["config"]
    
    def _workflow_to_stack_config(self, workflow: WorkflowConfig) -> dict:
        """Convert workflow config to stack config format."""
        agents_config = {}
        
        # Map workflow agent types to agent names
        agent_type_map = {
            "orchestrator": "OrchestratorAgent",
            "architect": "ArchitectAgent",
            "implementation": "ImplementationAgent",
            "reviewer": "ReviewerAgent",
            "tester": "BuildTestAgent",
            "debugger": "ImplementationAgent",
            "optimizer": "ReviewerAgent",
            "documenter": "ProductAgent",
            "custom": "ImplementationAgent"
        }
        
        for agent_id, agent_data in workflow.agents.items():
            agent_type = agent_data.get("type", "custom")
            agent_name = agent_type_map.get(agent_type, "ImplementationAgent")
            
            agents_config[agent_name] = {
                "id": agent_id,
                "model": agent_data.get("model", "gpt-4o-mini"),
                "provider": agent_data.get("provider", "openai"),
                "temperature": agent_data.get("temperature", 0.7),
                "system_prompt": agent_data.get("system_prompt", "")
            }
        
        return {
            "default_model": workflow.global_settings.get("default_model", "gpt-4o-mini"),
            "agents": agents_config,
            "connections": workflow.connections
        }
    
    def _get_execution_order(self) -> list[str]:
        """Get agent execution order based on workflow connections."""
        if not self.workflow_config:
            return []
        
        connections = self.workflow_config.connections
        agents = self.workflow_config.agents
        
        # Build adjacency list
        from_to = {}
        in_degree = {agent_id: 0 for agent_id in agents}
        
        for conn in connections:
            src, dst = str(conn.get("from")), str(conn.get("to"))
            if src not in from_to:
                from_to[src] = []
            from_to[src].append(dst)
            if dst in in_degree:
                in_degree[dst] += 1
        
        # Topological sort (Kahn's algorithm)
        queue = [node for node, degree in in_degree.items() if degree == 0]
        order = []
        
        while queue:
            node = queue.pop(0)
            order.append(node)
            for neighbor in from_to.get(node, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        return order
    
    def _get_llm_client(self):
        """Get the appropriate LLM client based on stack config and available keys."""
        provider = settings.get_llm_provider()
        
        if provider == "anthropic" and settings.anthropic_api_key:
            try:
                import anthropic
                return anthropic.Anthropic(api_key=settings.anthropic_api_key)
            except ImportError:
                pass
        
        if provider == "openai" and settings.openai_api_key:
            try:
                from openai import OpenAI
                return OpenAI(api_key=settings.openai_api_key)
            except ImportError:
                pass
        
        return None
    
    async def process_message(self, message: str) -> dict:
        """Process a message and return response."""
        # Use workflow chaining if workflow_config is available
        if self.workflow_config:
            return await self.process_workflow_message(message)
        
        agent_name = self._route_message(message)
        
        # Get workspace context if available
        workspace_info = None
        if self.workspace:
            ws = self.workspace.get_service()
            workspace_info = {
                "type": self.workspace.workspace_type,
                "path": self.workspace.workspace_path,
                "file_tree": ws.get_file_tree(max_depth=2)
            }
        
        response = await self._run_agent(agent_name, message, workspace_info)
        
        return {
            "message": response["content"],
            "agent": agent_name,
            "artifacts": self._file_operations,
            "files_modified": [op["path"] for op in self._file_operations if op.get("path")],
            "status": "complete"
        }
    
    async def process_workflow_message(self, message: str) -> dict:
        """Process message through the full workflow pipeline."""
        if not self.workflow_config:
            raise ValueError("No workflow config available")
        
        # Get workspace context
        workspace_info = None
        if self.workspace:
            ws = self.workspace.get_service()
            workspace_info = {
                "type": self.workspace.workspace_type,
                "path": self.workspace.workspace_path,
                "file_tree": ws.get_file_tree(max_depth=2)
            }
        
        # Get execution order from connections
        execution_order = self._get_execution_order()
        
        # Map agent IDs to agent configs
        agent_id_to_config = self.workflow_config.agents
        
        # Map agent types to agent names
        agent_type_map = {
            "orchestrator": "OrchestratorAgent",
            "architect": "ArchitectAgent",
            "implementation": "ImplementationAgent",
            "reviewer": "ReviewerAgent",
            "tester": "BuildTestAgent",
            "debugger": "ImplementationAgent",
            "optimizer": "ReviewerAgent",
            "documenter": "ProductAgent",
            "custom": "ImplementationAgent"
        }
        
        # Execute agents in order
        all_outputs = []
        current_input = message
        last_agent_name = "Orchestrator"
        
        for agent_id in execution_order:
            agent_config = agent_id_to_config.get(agent_id, {})
            agent_type = agent_config.get("type", "custom")
            agent_name = agent_type_map.get(agent_type, "ImplementationAgent")
            agent_label = agent_config.get("label", agent_name)
            
            # Build context from previous agent outputs
            context = ""
            if all_outputs:
                context = "\n\n[Previous agent outputs:]\n" + "\n---\n".join(all_outputs[-3:])
            
            augmented_input = f"{current_input}{context}"
            
            # Run the agent
            response = await self._run_agent(agent_name, augmented_input, workspace_info, agent_config)
            
            # Store output for next agent
            output = response["content"]
            all_outputs.append(f"[{agent_label}]: {output[:500]}...")
            self._agent_outputs[agent_id] = output
            last_agent_name = agent_label
            
            # Use output as input for connected agents
            current_input = output
        
        # Final output is from the last agent
        final_output = current_input if current_input != message else "Workflow completed with no output"
        
        return {
            "message": final_output,
            "agent": last_agent_name,
            "workflow_id": self.workflow_config.workflow_id,
            "workflow_name": self.workflow_config.name,
            "agents_used": list(execution_order),
            "artifacts": self._file_operations,
            "files_modified": [op["path"] for op in self._file_operations if op.get("path")],
            "status": "complete"
        }
    
    async def stream_message(self, message: str) -> AsyncGenerator[dict, None]:
        """Stream response chunks."""
        agent_name = self._route_message(message)
        
        yield {
            "type": "status",
            "status": "processing",
            "agent": agent_name
        }
        
        # Get workspace context
        workspace_info = None
        if self.workspace:
            ws = self.workspace.get_service()
            workspace_info = {
                "type": self.workspace.workspace_type,
                "path": self.workspace.workspace_path,
                "file_tree": ws.get_file_tree(max_depth=2)
            }
        
        response = await self._run_agent(agent_name, message, workspace_info)
        
        # Stream response in chunks
        words = response["content"].split()
        chunk = ""
        for i, word in enumerate(words):
            chunk += word + " "
            if i % 5 == 4:
                yield {
                    "type": "chunk",
                    "content": chunk,
                    "agent": agent_name
                }
                chunk = ""
                await asyncio.sleep(0.05)
        
        if chunk:
            yield {
                "type": "chunk",
                "content": chunk,
                "agent": agent_name
            }
        
        # Stream file operations
        for op in self._file_operations:
            yield {
                "type": "file_operation",
                "operation": op["operation"],
                "path": op["path"],
                "agent": agent_name
            }
        
        yield {
            "type": "done",
            "agent": agent_name,
            "files_modified": [op["path"] for op in self._file_operations]
        }
    
    def _route_message(self, message: str) -> str:
        """Route message to appropriate agent based on content."""
        message_lower = message.lower()
        
        if any(kw in message_lower for kw in ["design", "architect", "structure", "component"]):
            return "ArchitectAgent"
        elif any(kw in message_lower for kw in ["requirement", "feature", "user story", "acceptance"]):
            return "ProductAgent"
        elif any(kw in message_lower for kw in ["review", "check", "quality", "standards"]):
            return "ReviewerAgent"
        elif any(kw in message_lower for kw in ["test", "build", "ci", "coverage"]):
            return "BuildTestAgent"
        elif any(kw in message_lower for kw in ["deploy", "infrastructure", "docker", "kubernetes"]):
            return "InfraAgent"
        else:
            return "ImplementationAgent"
    
    async def _run_agent(
        self, 
        agent_name: str, 
        message: str,
        workspace_info: Optional[dict] = None,
        workflow_agent_config: Optional[dict] = None
    ) -> dict:
        """Run the specified agent."""
        # Use workflow agent config if provided, else use stack config
        if workflow_agent_config:
            model = workflow_agent_config.get("model", self.stack_config.get("default_model", "gpt-4o-mini"))
            custom_prompt = workflow_agent_config.get("system_prompt", "")
        else:
            agent_config = self.stack_config.get("agents", {}).get(agent_name, {})
            model = agent_config.get("model", self.stack_config.get("default_model", "gpt-4o-mini"))
            custom_prompt = ""
        
        # Build system prompt
        system_prompt = self._build_system_prompt(agent_name, workspace_info)
        if custom_prompt:
            system_prompt = f"{custom_prompt}\n\n{system_prompt}"
        
        # Try to use real LLM
        client = self._get_llm_client()
        
        if client and settings.anthropic_api_key:
            try:
                response = await self._call_anthropic(client, system_prompt, message, model)
                return response
            except Exception as e:
                pass
        
        if client and settings.openai_api_key:
            try:
                response = await self._call_openai(client, system_prompt, message, model)
                return response
            except Exception as e:
                pass
        
        # Fallback if no LLM client is available or configured
        if not client:
             raise ValueError(f"LLM provider '{settings.get_llm_provider()}' is not configured. Please check your settings.")

        # If we reached here, it means we had a client but calls failed (which were caught above)
        # We should re-raise or raise a generic error
        raise RuntimeError("Failed to generate response from LLM provider.")
    
    def _build_system_prompt(self, agent_name: str, workspace_info: Optional[dict]) -> str:
        """Build system prompt with workspace context."""
        base_prompts = {
            "ArchitectAgent": "You are an expert software architect. Design systems with scalability, maintainability, and best practices in mind.",
            "ProductAgent": "You are a product manager. Define clear requirements, user stories, and acceptance criteria.",
            "ImplementationAgent": "You are an expert software developer. Write clean, efficient, and well-documented code.",
            "ReviewerAgent": "You are a code reviewer. Check for bugs, security issues, and adherence to best practices.",
            "BuildTestAgent": "You are a build and test engineer. Ensure code is tested and builds successfully.",
            "InfraAgent": "You are a DevOps engineer. Design robust infrastructure and deployment pipelines."
        }
        
        prompt = base_prompts.get(agent_name, "You are a helpful AI assistant.")
        
        if workspace_info:
            prompt += f"\n\nYou have access to a workspace:\n- Type: {workspace_info['type']}\n- Path: {workspace_info['path']}"
            
            if workspace_info.get("file_tree"):
                tree = workspace_info["file_tree"]
                prompt += f"\n- Files: {self._format_tree_summary(tree)}"
        
        prompt += "\n\nWhen providing code, be specific about file paths and complete implementations."
        
        return prompt
    
    def _format_tree_summary(self, tree: dict, depth: int = 0) -> str:
        """Format file tree as a summary string."""
        if depth > 2:
            return ""
        
        lines = []
        children = tree.get("children", [])[:20]  # Limit to first 20 items
        
        for item in children:
            prefix = "  " * depth
            name = item["name"]
            if item.get("is_dir"):
                lines.append(f"{prefix}{name}/")
            else:
                lines.append(f"{prefix}{name}")
        
        return "\n".join(lines)
    
    async def _call_anthropic(self, client, system_prompt: str, message: str, model: str) -> dict:
        """Call Anthropic API."""
        import asyncio
        
        # Map generic model names to Anthropic models
        model_map = {
            "gpt-4": "claude-3-5-sonnet-20241022",
            "gpt-4o": "claude-3-5-sonnet-20241022",
            "gpt-4o-mini": "claude-3-haiku-20240307",
            "gpt-3.5-turbo": "claude-3-haiku-20240307"
        }
        anthropic_model = model_map.get(model, model)
        
        response = await asyncio.to_thread(
            client.messages.create,
            model=anthropic_model,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": message}]
        )
        
        content = response.content[0].text if response.content else ""
        
        # Parse file operations from response
        self._parse_file_operations(content)
        
        return {"content": content, "model": anthropic_model}
    
    async def _call_openai(self, client, system_prompt: str, message: str, model: str) -> dict:
        """Call OpenAI API."""
        import asyncio
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=4096
        )
        
        content = response.choices[0].message.content if response.choices else ""
        
        # Parse file operations from response
        self._parse_file_operations(content)
        
        return {"content": content, "model": model}
    
    def _parse_file_operations(self, content: str):
        """Parse file operations from agent response (code blocks with file paths)."""
        import re
        
        # Look for code blocks with file paths
        file_pattern = r'```(?:python|javascript|typescript|tsx|jsx|css|html|yaml|json|go|rust)?\n?# (\S+)\n([\s\S]*?)```'
        
        for match in re.finditer(file_pattern, content):
            file_path = match.group(1)
            file_content = match.group(2)
            
            self._file_operations.append({
                "operation": "write",
                "path": file_path,
                "content": file_content
            })
    

    async def execute_file_operations(self) -> list[dict]:
        """Execute pending file operations on the workspace."""
        if not self.workspace:
            return []
        
        results = []
        ws = self.workspace.get_service()
        
        for op in self._file_operations:
            try:
                if op["operation"] == "write":
                    result = ws.write_file(op["path"], op["content"])
                    results.append({"success": True, **result})
                elif op["operation"] == "delete":
                    result = ws.delete_file(op["path"])
                    results.append({"success": True, **result})
            except Exception as e:
                results.append({"success": False, "path": op["path"], "error": str(e)})
        
        return results
