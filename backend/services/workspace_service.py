"""
Workspace Service - Manages workspaces for agent file operations.
"""
import os
import shutil
from pathlib import Path
from typing import Optional, List
from datetime import datetime

from backend.config import get_settings

settings = get_settings()


class WorkspaceService:
    """
    Service for managing workspaces.
    Provides a unified interface for file operations across GitHub and local workspaces.
    """
    
    def __init__(self, workspace_path: str):
        self.workspace_path = Path(workspace_path)
        self._validate_path()
    
    def _validate_path(self):
        """Ensure the workspace path is valid and within allowed directories."""
        # Resolve to absolute path
        resolved = self.workspace_path.resolve()
        
        # Check it's within allowed base paths
        allowed_bases = [
            settings.workspaces_path.resolve(),
            Path("/tmp/redstone-workspaces").resolve()
        ]
        
        # Allow any path for local workspaces (user-specified)
        # But ensure it exists
        if not any(str(resolved).startswith(str(base)) for base in allowed_bases):
            # For user-specified local paths, just ensure it exists
            if not resolved.exists():
                raise ValueError(f"Workspace path does not exist: {resolved}")
    
    @classmethod
    def create_workspace_directory(cls, workspace_id: int, workspace_type: str) -> Path:
        """Create a new workspace directory."""
        base_path = settings.workspaces_path / workspace_type / str(workspace_id)
        base_path.mkdir(parents=True, exist_ok=True)
        return base_path
    
    def list_files(
        self, 
        subpath: str = "",
        include_hidden: bool = False,
        max_depth: int = 3
    ) -> List[dict]:
        """
        List files and directories in the workspace.
        Returns a tree structure with file metadata.
        """
        target = self.workspace_path / subpath
        if not target.exists():
            return []
        
        result = []
        self._list_recursive(target, result, 0, max_depth, include_hidden)
        return result
    
    def _list_recursive(
        self, 
        path: Path, 
        result: List[dict], 
        depth: int, 
        max_depth: int,
        include_hidden: bool
    ):
        """Recursively list directory contents."""
        if depth > max_depth:
            return
        
        try:
            for item in sorted(path.iterdir()):
                if not include_hidden and item.name.startswith('.'):
                    continue
                
                # Skip common large/unnecessary directories
                if item.name in ['node_modules', '__pycache__', '.git', 'venv', '.venv']:
                    continue
                
                rel_path = str(item.relative_to(self.workspace_path))
                
                entry = {
                    "name": item.name,
                    "path": rel_path,
                    "is_dir": item.is_dir(),
                    "size": item.stat().st_size if item.is_file() else None,
                    "modified": datetime.fromtimestamp(item.stat().st_mtime).isoformat()
                }
                
                if item.is_dir():
                    entry["children"] = []
                    self._list_recursive(item, entry["children"], depth + 1, max_depth, include_hidden)
                
                result.append(entry)
        except PermissionError:
            pass
    
    def read_file(self, rel_path: str) -> dict:
        """Read file contents."""
        file_path = self.workspace_path / rel_path
        
        # Security check - ensure path is within workspace
        if not str(file_path.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Path traversal not allowed")
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {rel_path}")
        
        if not file_path.is_file():
            raise ValueError(f"Not a file: {rel_path}")
        
        # Check file size (limit to 1MB for text files)
        if file_path.stat().st_size > 1024 * 1024:
            raise ValueError("File too large (max 1MB)")
        
        try:
            content = file_path.read_text(encoding='utf-8')
            return {
                "path": rel_path,
                "content": content,
                "size": len(content),
                "encoding": "utf-8"
            }
        except UnicodeDecodeError:
            # Binary file
            return {
                "path": rel_path,
                "content": None,
                "size": file_path.stat().st_size,
                "encoding": "binary",
                "error": "Binary file - cannot display content"
            }
    
    def write_file(self, rel_path: str, content: str, create_dirs: bool = True) -> dict:
        """Write content to a file."""
        file_path = self.workspace_path / rel_path
        
        # Security check
        if not str(file_path.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Path traversal not allowed")
        
        if create_dirs:
            file_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_path.write_text(content, encoding='utf-8')
        
        return {
            "path": rel_path,
            "size": len(content),
            "written": True
        }
    
    def delete_file(self, rel_path: str) -> dict:
        """Delete a file or directory."""
        file_path = self.workspace_path / rel_path
        
        # Security check
        if not str(file_path.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Path traversal not allowed")
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {rel_path}")
        
        if file_path.is_dir():
            shutil.rmtree(file_path)
        else:
            file_path.unlink()
        
        return {"path": rel_path, "deleted": True}
    
    def create_directory(self, rel_path: str) -> dict:
        """Create a directory."""
        dir_path = self.workspace_path / rel_path
        
        # Security check
        if not str(dir_path.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Path traversal not allowed")
        
        dir_path.mkdir(parents=True, exist_ok=True)
        
        return {"path": rel_path, "created": True}
    
    def move_file(self, from_path: str, to_path: str) -> dict:
        """Move or rename a file/directory."""
        src = self.workspace_path / from_path
        dst = self.workspace_path / to_path
        
        # Security checks
        if not str(src.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Source path traversal not allowed")
        if not str(dst.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Destination path traversal not allowed")
        
        if not src.exists():
            raise FileNotFoundError(f"Source not found: {from_path}")
        
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        
        return {"from": from_path, "to": to_path, "moved": True}
    
    def copy_file(self, from_path: str, to_path: str) -> dict:
        """Copy a file/directory."""
        src = self.workspace_path / from_path
        dst = self.workspace_path / to_path
        
        # Security checks
        if not str(src.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Source path traversal not allowed")
        if not str(dst.resolve()).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Destination path traversal not allowed")
        
        if not src.exists():
            raise FileNotFoundError(f"Source not found: {from_path}")
        
        dst.parent.mkdir(parents=True, exist_ok=True)
        
        if src.is_dir():
            shutil.copytree(str(src), str(dst))
        else:
            shutil.copy2(str(src), str(dst))
        
        return {"from": from_path, "to": to_path, "copied": True}
    
    def search_files(
        self, 
        pattern: str, 
        file_pattern: str = "*",
        max_results: int = 100
    ) -> List[dict]:
        """Search for files containing a pattern."""
        import re
        
        results = []
        regex = re.compile(pattern, re.IGNORECASE)
        
        for file_path in self.workspace_path.rglob(file_pattern):
            if len(results) >= max_results:
                break
            
            if not file_path.is_file():
                continue
            
            # Skip binary files and large files
            if file_path.stat().st_size > 512 * 1024:  # 512KB
                continue
            
            try:
                content = file_path.read_text(encoding='utf-8')
                matches = list(regex.finditer(content))
                
                if matches:
                    rel_path = str(file_path.relative_to(self.workspace_path))
                    results.append({
                        "path": rel_path,
                        "matches": len(matches),
                        "preview": self._get_match_preview(content, matches[0])
                    })
            except (UnicodeDecodeError, PermissionError):
                continue
        
        return results
    
    def _get_match_preview(self, content: str, match, context_chars: int = 50) -> str:
        """Get a preview of a match with surrounding context."""
        start = max(0, match.start() - context_chars)
        end = min(len(content), match.end() + context_chars)
        preview = content[start:end]
        
        if start > 0:
            preview = "..." + preview
        if end < len(content):
            preview = preview + "..."
        
        return preview.replace("\n", " ")
    
    def get_file_tree(self, max_depth: int = 3) -> dict:
        """Get the full file tree as a nested structure."""
        return {
            "name": self.workspace_path.name,
            "path": "",
            "is_dir": True,
            "children": self.list_files(max_depth=max_depth)
        }
