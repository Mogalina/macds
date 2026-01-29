# Redstone SDK

Command-line SDK for the Redstone Multi-Agent Development Platform.

## Installation

```bash
pip install redstone-sdk
```

## Quick Start

```bash
# Authenticate with GitHub
redstone login

# Run a task
redstone run "Create a REST API for user management"

# Interactive chat
redstone chat

# List available stacks
redstone stack list

# Switch stack
redstone stack use architect-pro

# Browse community stacks
redstone registry browse
```

## Commands

| Command | Description |
|---------|-------------|
| `redstone login` | Authenticate with GitHub |
| `redstone logout` | Clear credentials |
| `redstone whoami` | Show current user |
| `redstone run "task"` | Execute a task |
| `redstone chat` | Interactive chat |
| `redstone stack list` | List stacks |
| `redstone stack use <slug>` | Set default stack |
| `redstone registry browse` | Browse community |
| `redstone usage` | Show usage stats |

## Configuration

Config stored in `~/.redstone/config.yaml`:

```yaml
api_url: https://api.redstone.dev
default_stack: speed-demon
```
