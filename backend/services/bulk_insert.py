"""
Bulk Insert Service - Handles indexing and processing of large folders with multiple files.
"""
import os
import asyncio
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field

# Supported file extensions for indexing
CODE_EXTENSIONS = {
    '.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.cpp', '.c', '.h', '.hpp',
    '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala', '.cs', '.vue',
    '.html', '.css', '.scss', '.sass', '.less'
}

DOC_EXTENSIONS = {
    '.md', '.txt', '.rst', '.yaml', '.yml', '.json', '.toml', '.xml', '.env'
}

CONFIG_EXTENSIONS = {
    '.gitignore', '.dockerignore', 'Dockerfile', '.editorconfig',
    'Makefile', 'package.json', 'pyproject.toml', 'requirements.txt',
    'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle'
}

# Directories to skip
SKIP_DIRS = {
    'node_modules', '.git', '__pycache__', '.venv', 'venv', 'env',
    '.next', 'build', 'dist', '.cache', 'coverage', '.pytest_cache',
    'target', 'vendor', '.idea', '.vscode', '.DS_Store'
}

# Max file size to process (1MB)
MAX_FILE_SIZE = 1024 * 1024

# Max files to process in a single request
MAX_FILES = 500


@dataclass
class IndexedFile:
    """Represents an indexed file."""
    path: str
    relative_path: str
    extension: str
    size: int
    content: str
    line_count: int
    language: str
    

@dataclass
class BulkInsertResult:
    """Result of bulk insert operation."""
    folder_path: str
    total_files: int
    indexed_files: int
    skipped_files: int
    total_size: int
    files: list[IndexedFile] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    summary: str = ""


def detect_language(extension: str) -> str:
    """Detect programming language from file extension."""
    lang_map = {
        '.py': 'python',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript-react',
        '.jsx': 'javascript-react',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.h': 'c-header',
        '.hpp': 'cpp-header',
        '.go': 'go',
        '.rs': 'rust',
        '.rb': 'ruby',
        '.php': 'php',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.cs': 'csharp',
        '.vue': 'vue',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.md': 'markdown',
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.xml': 'xml',
        '.sql': 'sql',
    }
    return lang_map.get(extension.lower(), 'text')


def is_supported_file(path: Path) -> bool:
    """Check if file is supported for indexing."""
    suffix = path.suffix.lower()
    name = path.name
    
    # Check by extension
    if suffix in CODE_EXTENSIONS or suffix in DOC_EXTENSIONS:
        return True
    
    # Check by name for extensionless files
    if name in CONFIG_EXTENSIONS:
        return True
    
    return False


def should_skip_dir(dir_name: str) -> bool:
    """Check if directory should be skipped."""
    return dir_name in SKIP_DIRS or dir_name.startswith('.')


async def read_file_content(file_path: Path) -> tuple[str, int]:
    """Read file content asynchronously."""
    try:
        loop = asyncio.get_event_loop()
        content = await loop.run_in_executor(
            None, 
            lambda: file_path.read_text(encoding='utf-8', errors='ignore')
        )
        line_count = content.count('\n') + 1
        return content, line_count
    except Exception as e:
        return f"[Error reading file: {str(e)}]", 0


async def index_folder(
    folder_path: str,
    max_files: int = MAX_FILES,
    include_content: bool = True
) -> BulkInsertResult:
    """
    Index all files in a folder for context injection.
    
    Args:
        folder_path: Path to folder to index
        max_files: Maximum number of files to process
        include_content: Whether to include file contents
        
    Returns:
        BulkInsertResult with indexed files
    """
    result = BulkInsertResult(
        folder_path=folder_path,
        total_files=0,
        indexed_files=0,
        skipped_files=0,
        total_size=0
    )
    
    folder = Path(folder_path)
    
    if not folder.exists():
        result.errors.append(f"Folder not found: {folder_path}")
        return result
    
    if not folder.is_dir():
        result.errors.append(f"Not a directory: {folder_path}")
        return result
    
    # Collect all files first
    files_to_process: list[Path] = []
    
    for root, dirs, files in os.walk(folder):
        # Filter out directories to skip
        dirs[:] = [d for d in dirs if not should_skip_dir(d)]
        
        for file_name in files:
            file_path = Path(root) / file_name
            
            if is_supported_file(file_path):
                # Check file size
                try:
                    size = file_path.stat().st_size
                    if size <= MAX_FILE_SIZE:
                        files_to_process.append(file_path)
                        result.total_files += 1
                    else:
                        result.skipped_files += 1
                except:
                    result.skipped_files += 1
            else:
                result.skipped_files += 1
    
    # Limit files
    if len(files_to_process) > max_files:
        files_to_process = files_to_process[:max_files]
        result.errors.append(f"Truncated to {max_files} files (folder contained more)")
    
    # Process files concurrently
    async def process_file(file_path: Path) -> Optional[IndexedFile]:
        try:
            size = file_path.stat().st_size
            relative_path = str(file_path.relative_to(folder))
            extension = file_path.suffix.lower()
            
            if include_content:
                content, line_count = await read_file_content(file_path)
            else:
                content = ""
                line_count = 0
            
            return IndexedFile(
                path=str(file_path),
                relative_path=relative_path,
                extension=extension,
                size=size,
                content=content,
                line_count=line_count,
                language=detect_language(extension)
            )
        except Exception as e:
            result.errors.append(f"Error processing {file_path}: {str(e)}")
            return None
    
    # Process all files
    tasks = [process_file(f) for f in files_to_process]
    indexed_files = await asyncio.gather(*tasks)
    
    # Filter out None results
    for indexed_file in indexed_files:
        if indexed_file:
            result.files.append(indexed_file)
            result.indexed_files += 1
            result.total_size += indexed_file.size
    
    # Generate summary
    language_counts: dict[str, int] = {}
    for f in result.files:
        language_counts[f.language] = language_counts.get(f.language, 0) + 1
    
    top_languages = sorted(language_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    result.summary = (
        f"Indexed {result.indexed_files} files ({result.total_size / 1024:.1f} KB) "
        f"from {folder_path}. "
        f"Languages: {', '.join(f'{l}({c})' for l, c in top_languages)}"
    )
    
    return result


def generate_context_prompt(result: BulkInsertResult, max_context_length: int = 100000) -> str:
    """
    Generate a context prompt from indexed files for chat.
    
    Args:
        result: BulkInsertResult from indexing
        max_context_length: Maximum length of context in characters
        
    Returns:
        Formatted context string for injection into chat
    """
    context_parts = [
        f"## Project Context: {result.folder_path}",
        f"Total files: {result.indexed_files}",
        "",
        "### File Structure:",
    ]
    
    # Add file tree
    for f in result.files:
        context_parts.append(f"- {f.relative_path} ({f.language}, {f.line_count} lines)")
    
    context_parts.append("")
    context_parts.append("### File Contents:")
    
    current_length = sum(len(p) for p in context_parts)
    
    # Add file contents up to max length
    for f in result.files:
        file_header = f"\n\n#### {f.relative_path}\n```{f.language}\n"
        file_footer = "\n```"
        
        estimated_length = len(file_header) + len(f.content) + len(file_footer)
        
        if current_length + estimated_length > max_context_length:
            # Truncate or skip
            remaining = max_context_length - current_length - len(file_header) - len(file_footer) - 100
            if remaining > 500:
                truncated_content = f.content[:remaining] + "\n... [truncated]"
                context_parts.append(file_header + truncated_content + file_footer)
            break
        else:
            context_parts.append(file_header + f.content + file_footer)
            current_length += estimated_length
    
    return "\n".join(context_parts)
