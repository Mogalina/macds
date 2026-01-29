import webbrowser
import time
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.markdown import Markdown
from rich import print as rprint

from redstone_sdk.client import RedstoneClient
from redstone_sdk.config import Config, get_token, save_token, clear_token

app = typer.Typer(
    name="redstone",
    help="Redstone CLI - Multi-Agent Development Platform",
    add_completion=False,
)
console = Console()

# ─────────────────────────────────────────────────────────────────────────────
# Auth Commands
# ─────────────────────────────────────────────────────────────────────────────

@app.command()
def login():
    """Authenticate with GitHub."""
    config = Config.load()
    login_url = f"{config.api_url}/auth/login"
    
    console.print(f"[cyan]Opening browser for GitHub login...[/]")
    console.print(f"[dim]If browser doesn't open, visit: {login_url}[/]")
    
    webbrowser.open(login_url)
    
    token = typer.prompt("Paste your token after login")
    save_token(token)
    
    # Verify token
    try:
        client = RedstoneClient(config, token)
        user = client.get_me()
        console.print(f"[green]✓[/] Logged in as [bold]{user['username']}[/]")
    except Exception as e:
        console.print(f"[red]✗ Login failed: {e}[/]")
        clear_token()

@app.command()
def logout():
    """Clear stored credentials."""
    clear_token()
    console.print("[green]✓[/] Logged out")

@app.command()
def whoami():
    """Show current user."""
    token = get_token()
    if not token:
        console.print("[yellow]Not logged in. Run `redstone login`[/]")
        return
    
    try:
        client = RedstoneClient()
        user = client.get_me()
        console.print(f"[bold]{user['username']}[/] ({user['subscription_tier']})")
    except Exception as e:
        console.print(f"[red]Error: {e}[/]")

# ─────────────────────────────────────────────────────────────────────────────
# Stack Commands
# ─────────────────────────────────────────────────────────────────────────────

stack_app = typer.Typer(help="Manage agent stacks")
app.add_typer(stack_app, name="stack")

@stack_app.command("list")
def stack_list():
    """List available stacks."""
    client = RedstoneClient()
    
    table = Table(title="Available Stacks")
    table.add_column("Name", style="cyan")
    table.add_column("Slug", style="dim")
    table.add_column("Tier", style="green")
    table.add_column("Focus")
    
    for stack in client.list_builtin_stacks():
        table.add_row(
            stack["name"],
            stack["slug"],
            stack.get("tier_required", "free"),
            stack["config"].get("focus", "-")
        )
    
    console.print(table)

@stack_app.command("use")
def stack_use(slug: str):
    """Set default stack."""
    config = Config.load()
    config.default_stack = slug
    config.save()
    console.print(f"[green]✓[/] Default stack set to [bold]{slug}[/]")

@stack_app.command("show")
def stack_show(slug: str):
    """Show stack details."""
    client = RedstoneClient()
    stack = client.get_stack(slug)
    
    console.print(Panel(
        f"[bold]{stack['name']}[/]\n\n{stack.get('description', '')}\n\n"
        f"[dim]Models:[/] {', '.join(m for m in stack.get('config', {}).get('agents', {}).values() if isinstance(m, dict) for m in [m.get('model', '')] if m)}",
        title=f"Stack: {slug}"
    ))

# ─────────────────────────────────────────────────────────────────────────────
# Workflow Commands (Elastic Swarm)
# ─────────────────────────────────────────────────────────────────────────────

workflow_app = typer.Typer(help="Manage Elastic Swarm workflows")
app.add_typer(workflow_app, name="workflow")

@workflow_app.command("list")
def workflow_list():
    """List your workflows."""
    client = RedstoneClient()
    workflows = client.list_workflows()
    
    if not workflows:
        console.print("[yellow]No workflows found. Create one with the Elastic Swarm UI or YAML import.[/]")
        return
    
    table = Table(title="Your Workflows")
    table.add_column("ID", style="dim")
    table.add_column("Name", style="cyan")
    table.add_column("Agents", justify="right")
    table.add_column("Description")
    
    for wf in workflows:
        table.add_row(
            str(wf["id"]),
            wf["name"],
            str(len(wf.get("nodes", []))),
            (wf.get("description", "") or "-")[:40]
        )
    
    console.print(table)

@workflow_app.command("get")
def workflow_get(workflow_id: int):
    """Show workflow details."""
    client = RedstoneClient()
    wf = client.get_workflow(workflow_id)
    
    console.print(Panel(
        f"[bold]{wf['name']}[/]\n\n"
        f"[dim]Description:[/] {wf.get('description', 'No description')}\n\n"
        f"[dim]Agents:[/]",
        title=f"Workflow {wf['id']}"
    ))
    
    for node in wf.get("nodes", []):
        data = node.get("data", {})
        console.print(f"  • {data.get('label', 'Agent')} ({data.get('agentType', 'custom')}) - {data.get('model', 'gpt-4o-mini')}")

@workflow_app.command("create")
def workflow_create(
    name: str = typer.Option(..., "--name", "-n", help="Workflow name"),
    file: str = typer.Option(..., "--file", "-f", help="YAML file path")
):
    """Create workflow from YAML file."""
    with open(file, 'r') as f:
        yaml_content = f.read()
    
    client = RedstoneClient()
    wf = client.import_workflow_yaml(name, yaml_content)
    console.print(f"[green]✓[/] Created workflow '[bold]{wf['name']}[/]' (id: {wf['id']})")

@workflow_app.command("delete")
def workflow_delete(workflow_id: int):
    """Delete a workflow."""
    client = RedstoneClient()
    client.delete_workflow(workflow_id)
    console.print(f"[green]✓[/] Deleted workflow {workflow_id}")

@workflow_app.command("export")
def workflow_export(
    workflow_id: int,
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Output file path")
):
    """Export workflow as YAML."""
    client = RedstoneClient()
    result = client.export_workflow_yaml(workflow_id)
    
    yaml_content = result.get("yaml", result) if isinstance(result, dict) else result
    
    if output:
        with open(output, 'w') as f:
            f.write(yaml_content)
        console.print(f"[green]✓[/] Exported to {output}")
    else:
        console.print(yaml_content)

# ─────────────────────────────────────────────────────────────────────────────
# Workflow Commands (Elastic Swarm)
# ─────────────────────────────────────────────────────────────────────────────

workflow_app = typer.Typer(help="Manage Elastic Swarm workflows")
app.add_typer(workflow_app, name="workflow")

@workflow_app.command("list")
def workflow_list():
    """List your workflows."""
    client = RedstoneClient()
    workflows = client.list_workflows()
    
    if not workflows:
        console.print("[yellow]No workflows found. Create one with the Elastic Swarm UI or YAML import.[/]")
        return
    
    table = Table(title="Your Workflows")
    table.add_column("ID", style="dim")
    table.add_column("Name", style="cyan")
    table.add_column("Agents", justify="right")
    table.add_column("Description")
    
    for wf in workflows:
        table.add_row(
            str(wf["id"]),
            wf["name"],
            str(len(wf.get("nodes", []))),
            (wf.get("description", "") or "-")[:40]
        )
    
    console.print(table)

@workflow_app.command("get")
def workflow_get(workflow_id: int):
    """Show workflow details."""
    client = RedstoneClient()
    wf = client.get_workflow(workflow_id)
    
    console.print(Panel(
        f"[bold]{wf['name']}[/]\n\n"
        f"[dim]Description:[/] {wf.get('description', 'No description')}\n\n"
        f"[dim]Agents:[/]",
        title=f"Workflow {wf['id']}"
    ))
    
    for node in wf.get("nodes", []):
        data = node.get("data", {})
        console.print(f"  • {data.get('label', 'Agent')} ({data.get('agentType', 'custom')}) - {data.get('model', 'gpt-4o-mini')}")

@workflow_app.command("create")
def workflow_create(
    name: str = typer.Option(..., "--name", "-n", help="Workflow name"),
    file: str = typer.Option(..., "--file", "-f", help="YAML file path")
):
    """Create workflow from YAML file."""
    with open(file, 'r') as f:
        yaml_content = f.read()
    
    client = RedstoneClient()
    wf = client.import_workflow_yaml(name, yaml_content)
    console.print(f"[green]✓[/] Created workflow '[bold]{wf['name']}[/]' (id: {wf['id']})")

@workflow_app.command("delete")
def workflow_delete(workflow_id: int):
    """Delete a workflow."""
    client = RedstoneClient()
    client.delete_workflow(workflow_id)
    console.print(f"[green]✓[/] Deleted workflow {workflow_id}")

@workflow_app.command("export")
def workflow_export(
    workflow_id: int,
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Output file path")
):
    """Export workflow as YAML."""
    client = RedstoneClient()
    result = client.export_workflow_yaml(workflow_id)
    
    yaml_content = result.get("yaml", result) if isinstance(result, dict) else result
    
    if output:
        with open(output, 'w') as f:
            f.write(yaml_content)
        console.print(f"[green]✓[/] Exported to {output}")
    else:
        console.print(yaml_content)

# ─────────────────────────────────────────────────────────────────────────────
# Chat Commands
# ─────────────────────────────────────────────────────────────────────────────

@app.command()
def run(
    task: str = typer.Argument(..., help="Task description"),
    stack: Optional[str] = typer.Option(None, "--stack", "-s", help="Stack to use"),
    workflow: Optional[int] = typer.Option(None, "--workflow", "-w", help="Workflow ID to use instead of stack")
):
    """Run a task with agents."""
    config = Config.load()
    client = RedstoneClient()
    
    if workflow:
        console.print(f"[dim]Using workflow ID: {workflow}[/]")
        with console.status("[cyan]Agents working...[/]"):
            response = client.chat(task, workflow_id=workflow)
    else:
        stack_slug = stack or config.default_stack
        console.print(f"[dim]Using stack: {stack_slug}[/]")
        with console.status("[cyan]Agents working...[/]"):
            response = client.chat(task, stack_slug)
    
    agent_name = response.get('agent', 'Agent')
    if response.get('workflow_name'):
        console.print(f"\n[bold cyan]{response['workflow_name']} - {agent_name}:[/]")
    else:
        console.print(f"\n[bold cyan]{agent_name}:[/]")
    
    console.print(Markdown(response["message"]))
    
    if response.get("files_modified"):
        console.print(f"\n[green]📁 Files modified:[/] {', '.join(response['files_modified'])}")

@app.command()
def chat():
    """Start interactive chat session."""
    config = Config.load()
    client = RedstoneClient()
    
    console.print(Panel(
        f"[bold]Redstone Chat[/]\n"
        f"Stack: {config.default_stack}\n"
        f"Type 'exit' to quit, '/stack <name>' to switch stacks",
        style="cyan"
    ))
    
    current_stack = config.default_stack
    
    while True:
        try:
            user_input = console.input("\n[bold green]You>[/] ")
        except (KeyboardInterrupt, EOFError):
            break
        
        if not user_input.strip():
            continue
        
        if user_input.lower() == "exit":
            break
        
        if user_input.startswith("/stack "):
            current_stack = user_input.split(" ", 1)[1]
            console.print(f"[dim]Switched to stack: {current_stack}[/]")
            continue
        
        with console.status("[cyan]Thinking...[/]"):
            response = client.chat(user_input, current_stack)
        
        console.print(f"\n[bold cyan]{response.get('agent', 'Agent')}:[/]")
        console.print(Markdown(response["message"]))
    
    console.print("\n[dim]Goodbye![/]")

# ─────────────────────────────────────────────────────────────────────────────
# Registry Commands
# ─────────────────────────────────────────────────────────────────────────────

registry_app = typer.Typer(help="Browse and publish to registry")
app.add_typer(registry_app, name="registry")

@registry_app.command("browse")
def registry_browse(query: str = ""):
    """Browse community stacks."""
    client = RedstoneClient()
    stacks = client.browse_registry(query)
    
    table = Table(title="Community Stacks")
    table.add_column("Name", style="cyan")
    table.add_column("Owner", style="dim")
    table.add_column("Downloads", justify="right")
    
    for stack in stacks:
        table.add_row(stack["name"], f"@{stack['owner']}", str(stack["downloads"]))
    
    console.print(table)

@registry_app.command("pull")
def registry_pull(slug: str):
    """Pull a stack from registry."""
    client = RedstoneClient()
    stack = client.pull_stack(slug)
    console.print(f"[green]✓[/] Pulled [bold]{stack['name']}[/]")

# ─────────────────────────────────────────────────────────────────────────────
# Info Commands
# ─────────────────────────────────────────────────────────────────────────────

@app.command()
def usage():
    """Show current usage stats."""
    client = RedstoneClient()
    data = client.get_usage()
    
    console.print(Panel(
        f"[bold]Subscription:[/] {data['tier']}\n"
        f"[bold]Requests:[/] {data['requests_used']} / {data['requests_limit'] or '∞'}\n"
        f"[bold]Tokens:[/] {data['tokens_used']:,}\n"
        f"[bold]Cost:[/] ${data['cost_usd']:.2f}",
        title="Usage"
    ))

@app.command()
def version():
    """Show version."""
    from redstone_sdk import __version__
    console.print(f"Redstone SDK v{__version__}")

if __name__ == "__main__":
    app()
