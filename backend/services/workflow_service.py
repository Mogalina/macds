"""
Elastic Swarm Workflow Service
Handles workflow CRUD, YAML generation/parsing, and validation
"""

import yaml
import re
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.models import Workflow, User


# Available LLM providers and models
LLM_PROVIDERS = {
    "anthropic": {
        "name": "Anthropic",
        "models": [
            {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet", "context": 200000},
            {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "context": 200000},
            {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku", "context": 200000},
        ]
    },
    "openai": {
        "name": "OpenAI",
        "models": [
            {"id": "gpt-4o", "name": "GPT-4o", "context": 128000},
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "context": 128000},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "context": 128000},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "context": 16385},
        ]
    },
    "google": {
        "name": "Google",
        "models": [
            {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "context": 1000000},
            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "context": 1000000},
        ]
    },
    "openrouter": {
        "name": "OpenRouter",
        "models": [
            {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet (OR)", "context": 200000},
            {"id": "openai/gpt-4o", "name": "GPT-4o (OR)", "context": 128000},
            {"id": "google/gemini-pro-1.5", "name": "Gemini 1.5 Pro (OR)", "context": 1000000},
            {"id": "meta-llama/llama-3.1-405b-instruct", "name": "Llama 3.1 405B", "context": 131072},
            {"id": "mistralai/mixtral-8x22b-instruct", "name": "Mixtral 8x22B", "context": 65536},
        ]
    }
}

# Available agent types
AGENT_TYPES = [
    {"id": "orchestrator", "name": "Orchestrator", "description": "Coordinates other agents", "color": "#FF6B6B"},
    {"id": "architect", "name": "Architect", "description": "System design and architecture", "color": "#4ECDC4"},
    {"id": "implementation", "name": "Implementation", "description": "Writes code", "color": "#45B7D1"},
    {"id": "reviewer", "name": "Reviewer", "description": "Code review and quality", "color": "#96CEB4"},
    {"id": "tester", "name": "Tester", "description": "Testing and validation", "color": "#FFEAA7"},
    {"id": "debugger", "name": "Debugger", "description": "Bug fixing and debugging", "color": "#DDA0DD"},
    {"id": "optimizer", "name": "Optimizer", "description": "Performance optimization", "color": "#98D8C8"},
    {"id": "documenter", "name": "Documenter", "description": "Documentation generation", "color": "#F7DC6F"},
    {"id": "custom", "name": "Custom Agent", "description": "User-defined agent", "color": "#B19CD9"},
]

# Starter workflow templates
WORKFLOW_TEMPLATES = [
    {
        "id": "full-stack-builder",
        "name": "Full-Stack Builder",
        "description": "Complete workflow for building full-stack applications",
        "nodes": [
            {"id": "1", "type": "agentNode", "position": {"x": 250, "y": 50}, "data": {"agentType": "orchestrator", "label": "Orchestrator", "model": "claude-3-5-sonnet-20241022", "provider": "anthropic"}},
            {"id": "2", "type": "agentNode", "position": {"x": 100, "y": 200}, "data": {"agentType": "architect", "label": "Architect", "model": "claude-3-5-sonnet-20241022", "provider": "anthropic"}},
            {"id": "3", "type": "agentNode", "position": {"x": 400, "y": 200}, "data": {"agentType": "implementation", "label": "Coder", "model": "gpt-4o", "provider": "openai"}},
            {"id": "4", "type": "agentNode", "position": {"x": 250, "y": 350}, "data": {"agentType": "reviewer", "label": "Reviewer", "model": "claude-3-5-sonnet-20241022", "provider": "anthropic"}},
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
            {"id": "e1-3", "source": "1", "target": "3"},
            {"id": "e2-4", "source": "2", "target": "4"},
            {"id": "e3-4", "source": "3", "target": "4"},
        ]
    },
    {
        "id": "code-review-pipeline",
        "name": "Code Review Pipeline",
        "description": "Automated code review with multiple perspectives",
        "nodes": [
            {"id": "1", "type": "agentNode", "position": {"x": 250, "y": 50}, "data": {"agentType": "orchestrator", "label": "Coordinator", "model": "gpt-4o-mini", "provider": "openai"}},
            {"id": "2", "type": "agentNode", "position": {"x": 100, "y": 200}, "data": {"agentType": "reviewer", "label": "Security Review", "model": "claude-3-5-sonnet-20241022", "provider": "anthropic"}},
            {"id": "3", "type": "agentNode", "position": {"x": 400, "y": 200}, "data": {"agentType": "optimizer", "label": "Performance Review", "model": "gpt-4o", "provider": "openai"}},
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
            {"id": "e1-3", "source": "1", "target": "3"},
        ]
    },
    {
        "id": "rapid-prototyper",
        "name": "Rapid Prototyper",
        "description": "Fast prototyping with minimal overhead",
        "nodes": [
            {"id": "1", "type": "agentNode", "position": {"x": 200, "y": 100}, "data": {"agentType": "implementation", "label": "Speed Coder", "model": "gpt-4o-mini", "provider": "openai"}},
            {"id": "2", "type": "agentNode", "position": {"x": 200, "y": 250}, "data": {"agentType": "tester", "label": "Quick Tester", "model": "gpt-3.5-turbo", "provider": "openai"}},
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
        ]
    },
]


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug


def nodes_to_yaml(nodes: List[Dict], edges: List[Dict], global_settings: Dict = None) -> str:
    """Convert workflow nodes and edges to YAML configuration."""
    workflow_config = {
        "version": "1.0",
        "elastic_swarm": {
            "global": global_settings or {
                "default_provider": "anthropic",
                "default_model": "claude-3-5-sonnet-20241022",
                "temperature": 0.7,
                "max_tokens": 4096,
            },
            "agents": {},
            "connections": []
        }
    }
    
    # Build agents section
    for node in nodes:
        data = node.get("data", {})
        agent_id = node.get("id")
        workflow_config["elastic_swarm"]["agents"][agent_id] = {
            "type": data.get("agentType", "custom"),
            "label": data.get("label", "Agent"),
            "provider": data.get("provider", "anthropic"),
            "model": data.get("model", "claude-3-5-sonnet-20241022"),
            "temperature": data.get("temperature", 0.7),
            "system_prompt": data.get("systemPrompt", ""),
        }
    
    # Build connections section
    for edge in edges:
        workflow_config["elastic_swarm"]["connections"].append({
            "from": edge.get("source"),
            "to": edge.get("target"),
        })
    
    return yaml.dump(workflow_config, default_flow_style=False, sort_keys=False)


def yaml_to_nodes(yaml_content: str) -> tuple[List[Dict], List[Dict], Dict]:
    """Parse YAML configuration to nodes and edges."""
    try:
        config = yaml.safe_load(yaml_content)
        swarm = config.get("elastic_swarm", {})
        global_settings = swarm.get("global", {})
        agents = swarm.get("agents", {})
        connections = swarm.get("connections", [])
        
        nodes = []
        x_offset = 100
        y_offset = 100
        
        for idx, (agent_id, agent_config) in enumerate(agents.items()):
            nodes.append({
                "id": agent_id,
                "type": "agentNode",
                "position": {"x": x_offset + (idx % 3) * 200, "y": y_offset + (idx // 3) * 150},
                "data": {
                    "agentType": agent_config.get("type", "custom"),
                    "label": agent_config.get("label", f"Agent {agent_id}"),
                    "provider": agent_config.get("provider", "anthropic"),
                    "model": agent_config.get("model", "claude-3-5-sonnet-20241022"),
                    "temperature": agent_config.get("temperature", 0.7),
                    "systemPrompt": agent_config.get("system_prompt", ""),
                }
            })
        
        edges = []
        for idx, conn in enumerate(connections):
            edges.append({
                "id": f"e{conn['from']}-{conn['to']}",
                "source": str(conn["from"]),
                "target": str(conn["to"]),
            })
        
        return nodes, edges, global_settings
    except Exception as e:
        raise ValueError(f"Invalid YAML configuration: {str(e)}")


def validate_workflow(nodes: List[Dict], edges: List[Dict]) -> Dict[str, Any]:
    """Validate workflow structure and return any issues."""
    issues = []
    
    if not nodes:
        issues.append({"type": "error", "message": "Workflow must have at least one agent"})
    
    node_ids = {node["id"] for node in nodes}
    
    # Check edges reference valid nodes
    for edge in edges:
        if edge["source"] not in node_ids:
            issues.append({"type": "error", "message": f"Edge references non-existent source: {edge['source']}"})
        if edge["target"] not in node_ids:
            issues.append({"type": "error", "message": f"Edge references non-existent target: {edge['target']}"})
    
    # Check for cycles (basic check)
    # A more complete implementation would use topological sort
    
    return {
        "valid": len([i for i in issues if i["type"] == "error"]) == 0,
        "issues": issues
    }


class WorkflowService:
    """Service for managing Elastic Swarm workflows."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_llm_providers(self) -> Dict:
        """Get available LLM providers and models."""
        return LLM_PROVIDERS
    
    def get_agent_types(self) -> List[Dict]:
        """Get available agent types."""
        return AGENT_TYPES
    
    def get_templates(self) -> List[Dict]:
        """Get starter workflow templates."""
        return WORKFLOW_TEMPLATES
    
    def create_workflow(
        self,
        user_id: int,
        name: str,
        description: str = "",
        nodes: List[Dict] = None,
        edges: List[Dict] = None,
        global_settings: Dict = None,
    ) -> Workflow:
        """Create a new workflow."""
        nodes = nodes or []
        edges = edges or []
        
        # Validate
        validation = validate_workflow(nodes, edges)
        if not validation["valid"]:
            raise ValueError(validation["issues"])
        
        # Generate YAML
        yaml_config = nodes_to_yaml(nodes, edges, global_settings)
        
        # Create workflow
        slug = generate_slug(name)
        
        # Ensure unique slug
        existing = self.db.query(Workflow).filter(Workflow.slug == slug).first()
        if existing:
            slug = f"{slug}-{user_id}"
        
        workflow = Workflow(
            user_id=user_id,
            name=name,
            slug=slug,
            description=description,
            nodes=nodes,
            edges=edges,
            global_settings=global_settings or {},
            yaml_config=yaml_config,
        )
        
        self.db.add(workflow)
        self.db.commit()
        self.db.refresh(workflow)
        
        return workflow
    
    def get_workflows(self, user_id: int) -> List[Workflow]:
        """Get all workflows for a user."""
        return self.db.query(Workflow).filter(
            (Workflow.user_id == user_id) | (Workflow.is_template == True)
        ).order_by(Workflow.created_at.desc()).all()
    
    def get_workflow(self, workflow_id: int, user_id: int) -> Optional[Workflow]:
        """Get a specific workflow."""
        return self.db.query(Workflow).filter(
            Workflow.id == workflow_id,
            (Workflow.user_id == user_id) | (Workflow.is_public == True) | (Workflow.is_template == True)
        ).first()
    
    def update_workflow(
        self,
        workflow_id: int,
        user_id: int,
        name: str = None,
        description: str = None,
        nodes: List[Dict] = None,
        edges: List[Dict] = None,
        global_settings: Dict = None,
    ) -> Optional[Workflow]:
        """Update a workflow."""
        workflow = self.db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()
        
        if not workflow:
            return None
        
        if name:
            workflow.name = name
        if description is not None:
            workflow.description = description
        if nodes is not None:
            workflow.nodes = nodes
        if edges is not None:
            workflow.edges = edges
        if global_settings is not None:
            workflow.global_settings = global_settings
        
        # Regenerate YAML if nodes/edges changed
        if nodes is not None or edges is not None:
            workflow.yaml_config = nodes_to_yaml(
                workflow.nodes,
                workflow.edges,
                workflow.global_settings
            )
        
        self.db.commit()
        self.db.refresh(workflow)
        
        return workflow
    
    def delete_workflow(self, workflow_id: int, user_id: int) -> bool:
        """Delete a workflow."""
        workflow = self.db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()
        
        if not workflow:
            return False
        
        self.db.delete(workflow)
        self.db.commit()
        
        return True
    
    def import_yaml(self, user_id: int, yaml_content: str, name: str) -> Workflow:
        """Import workflow from YAML."""
        nodes, edges, global_settings = yaml_to_nodes(yaml_content)
        
        return self.create_workflow(
            user_id=user_id,
            name=name,
            nodes=nodes,
            edges=edges,
            global_settings=global_settings,
        )
    
    def export_yaml(self, workflow_id: int, user_id: int) -> Optional[str]:
        """Export workflow as YAML."""
        workflow = self.get_workflow(workflow_id, user_id)
        if not workflow:
            return None
        
        return workflow.yaml_config or nodes_to_yaml(
            workflow.nodes or [],
            workflow.edges or [],
            workflow.global_settings
        )
