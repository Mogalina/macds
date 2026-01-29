/**
 * Redstone API Client
 * Handles all API communication with the backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string;
    subscription_tier: string;
}

export interface Workspace {
    id: number;
    name: string;
    type: 'github' | 'local';
    github_repo?: string;
    github_branch?: string;
    local_path?: string;
    last_synced_at?: string;
    created_at: string;
}

export interface FileItem {
    name: string;
    path: string;
    is_dir: boolean;
    size?: number;
    modified?: string;
    children?: FileItem[];
}

export interface ChatSession {
    id: number;
    title: string;
    workspace_id?: number;
    messages: ChatMessage[];
    created_at: string;
    updated_at?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    agent?: string;
    files_modified?: string[];
    timestamp?: string;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    description?: string;
    private: boolean;
    default_branch: string;
    language?: string;
    updated_at?: string;
}

export interface AgentTask {
    id: number;
    agent_name: string;
    status: string;
    files_modified: string[];
    started_at?: string;
    completed_at?: string;
}

export interface Workflow {
    id: number;
    name: string;
    description?: string;
    nodes: any[];
    edges: any[];
    global_settings?: any;
    is_public: boolean;
    is_template: boolean;
    created_at: string;
    updated_at?: string;
}

export interface BulkInsertFile {
    path: string;
    language: string;
    lines: number;
    size: number;
}

export interface BulkInsertResult {
    success: boolean;
    folder_path: string;
    indexed_files: number;
    skipped_files: number;
    total_size_kb: number;
    summary: string;
    files: BulkInsertFile[];
    errors: string[];
    context_prompt: string | null;
}

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
        localStorage.setItem('redstone_token', token);
    } else {
        localStorage.removeItem('redstone_token');
    }
}

export function getAuthToken(): string | null {
    if (authToken) return authToken;
    if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('redstone_token');
    }
    return authToken;
}

// API helper
interface ApiOptions extends RequestInit {
    skipGenericError?: boolean;
}

// Custom API Error
export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number,
        public detail?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function api<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        const errorMessage = error.detail || `HTTP ${response.status}`;

        if (typeof window !== 'undefined' && !options.skipGenericError) {
            window.dispatchEvent(new CustomEvent('redstone-error', {
                detail: { message: errorMessage }
            }));
        }

        throw new ApiError(errorMessage, response.status, error);
    }

    return response.json();
}

// Auth API
export const auth = {
    getGitHubAuthUrl(): string {
        return `${API_BASE}/github/auth`;
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            return await api<User>('/auth/me');
        } catch {
            return null;
        }
    },

    async getGitHubStatus(): Promise<{ connected: boolean; scopes?: string[] }> {
        return api('/github/status');
    },

    logout() {
        setAuthToken(null);
    }
};

// GitHub API
export const github = {
    async listRepos(page = 1, perPage = 30): Promise<{ repos: Repository[] }> {
        return api(`/github/repos?page=${page}&per_page=${perPage}`);
    },

    async getRepo(owner: string, repo: string): Promise<{ repo: Repository; branches: string[] }> {
        return api(`/github/repos/${owner}/${repo}`);
    },

    async getContents(owner: string, repo: string, path = '', ref?: string): Promise<{ contents: FileItem[] }> {
        const params = new URLSearchParams({ path });
        if (ref) params.set('ref', ref);
        return api(`/github/repos/${owner}/${repo}/contents?${params}`);
    },

    async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<{ content: string; sha: string }> {
        const params = new URLSearchParams({ path });
        if (ref) params.set('ref', ref);
        return api(`/github/repos/${owner}/${repo}/file?${params}`);
    }
};

// Workspaces API
export const workspaces = {
    async list(): Promise<{ workspaces: Workspace[] }> {
        return api('/workspaces');
    },

    async create(data: {
        name: string;
        type: 'github' | 'local';
        github_repo?: string;
        github_branch?: string;
        local_path?: string;
    }): Promise<Workspace> {
        return api('/workspaces', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async get(id: number): Promise<Workspace & { file_tree: FileItem }> {
        return api(`/workspaces/${id}`);
    },

    async delete(id: number, deleteFiles = false): Promise<void> {
        await api(`/workspaces/${id}?delete_files=${deleteFiles}`, { method: 'DELETE' });
    },

    async listFiles(id: number, path = ''): Promise<{ files: FileItem[] }> {
        return api(`/workspaces/${id}/files?path=${encodeURIComponent(path)}`);
    },

    async readFile(id: number, path: string): Promise<{ content: string; size: number }> {
        return api(`/workspaces/${id}/files/content?path=${encodeURIComponent(path)}`);
    },

    async writeFile(id: number, path: string, content: string): Promise<void> {
        await api(`/workspaces/${id}/files/content?path=${encodeURIComponent(path)}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        });
    },

    async deleteFile(id: number, path: string): Promise<void> {
        await api(`/workspaces/${id}/files?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
    },

    async sync(id: number): Promise<{ synced: boolean }> {
        return api(`/workspaces/${id}/git/sync`, { method: 'POST' });
    },

    async gitStatus(id: number): Promise<{ changes: { status: string; path: string }[]; has_changes: boolean }> {
        return api(`/workspaces/${id}/git/status`);
    },

    async commit(id: number, message: string, files?: string[]): Promise<{ committed: boolean }> {
        return api(`/workspaces/${id}/git/commit?message=${encodeURIComponent(message)}`, {
            method: 'POST',
            body: JSON.stringify(files || null)
        });
    },

    async push(id: number): Promise<{ pushed: boolean }> {
        return api(`/workspaces/${id}/git/push`, { method: 'POST' });
    },

    async search(id: number, query: string, filePattern = '*'): Promise<{ results: { path: string; matches: number; preview: string }[] }> {
        return api(`/workspaces/${id}/search?query=${encodeURIComponent(query)}&file_pattern=${encodeURIComponent(filePattern)}`);
    }
};

// Agents API
export const agents = {
    async chat(data: {
        content: string;
        stack_slug?: string;
        session_id?: number;
        workspace_id?: number;
        workflow_id?: number;
        apply_changes?: boolean;
    }): Promise<{
        message: string;
        agent: string;
        artifacts: any[];
        files_modified: string[];
        status: string;
    }> {
        return api('/agents/chat', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async listSessions(workspaceId?: number, options?: ApiOptions): Promise<ChatSession[]> {
        const params = workspaceId ? `?workspace_id=${workspaceId}` : '';
        return api(`/agents/sessions${params}`, options);
    },

    async createSession(title = 'New Chat', stackSlug = 'speed-demon', workspaceId?: number): Promise<{ id: number; title: string }> {
        const params = new URLSearchParams({ title, stack_slug: stackSlug });
        if (workspaceId) params.set('workspace_id', String(workspaceId));
        return api(`/agents/sessions?${params}`, { method: 'POST' });
    },

    async getSession(id: number): Promise<ChatSession> {
        return api(`/agents/sessions/${id}`);
    },

    async deleteSession(id: number): Promise<void> {
        await api(`/agents/sessions/${id}`, { method: 'DELETE' });
    },

    async getSessionTasks(sessionId: number): Promise<AgentTask[]> {
        return api(`/agents/sessions/${sessionId}/tasks`);
    },

    async bulkInsert(folderPath: string, options?: {
        sessionId?: number;
        maxFiles?: number;
        includeContent?: boolean;
    }): Promise<BulkInsertResult> {
        return api('/agents/bulk-insert', {
            method: 'POST',
            body: JSON.stringify({
                folder_path: folderPath,
                session_id: options?.sessionId,
                max_files: options?.maxFiles ?? 500,
                include_content: options?.includeContent ?? true
            })
        });
    }
};

// Elastic Swarm API
export const elasticSwarm = {
    async listWorkflows(options?: ApiOptions): Promise<Workflow[]> {
        return api('/elastic-swarm/workflows', options);
    },

    async getWorkflow(id: number): Promise<Workflow> {
        return api(`/elastic-swarm/workflows/${id}`);
    },

    async createWorkflow(data: {
        name: string;
        description?: string;
        nodes: any[];
        edges: any[];
        global_settings?: any;
    }): Promise<Workflow> {
        return api('/elastic-swarm/workflows', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateWorkflow(id: number, data: Partial<Workflow>): Promise<Workflow> {
        return api(`/elastic-swarm/workflows/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteWorkflow(id: number): Promise<void> {
        await api(`/elastic-swarm/workflows/${id}`, { method: 'DELETE' });
    },

    async importYaml(name: string, yamlContent: string): Promise<Workflow> {
        return api('/elastic-swarm/import-yaml', {
            method: 'POST',
            body: JSON.stringify({ name, yaml_content: yamlContent })
        });
    }
};

// WebSocket for streaming chat
export class ChatWebSocket {
    private ws: WebSocket | null = null;
    private clientId: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(
        private onMessage: (data: any) => void,
        private onConnect?: () => void,
        private onDisconnect?: () => void,
        private onError?: (error: Event) => void
    ) {
        this.clientId = Math.random().toString(36).substring(7);
    }

    connect() {
        const token = getAuthToken();
        const wsUrl = `${API_BASE.replace('http', 'ws')}/agents/ws/${this.clientId}${token ? `?token=${token}` : ''}`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.onConnect?.();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessage(data);
            } catch {
                console.error('Failed to parse WebSocket message');
            }
        };

        this.ws.onerror = (error) => {
            this.onError?.(error);
        };

        this.ws.onclose = () => {
            this.onDisconnect?.();
            this.attemptReconnect();
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            setTimeout(() => this.connect(), delay);
        }
    }

    send(data: {
        content: string;
        stack?: string;
        workspace_id?: number;
        apply_changes?: boolean;
    }) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket not connected');
        }
    }

    disconnect() {
        this.maxReconnectAttempts = 0; // Prevent reconnection
        this.ws?.close();
    }

    get isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

// Stacks API
export const stacks = {
    async list(): Promise<any[]> {
        return api('/stacks');
    },

    async listBuiltin(): Promise<any[]> {
        return api('/stacks/builtin');
    },

    async get(slug: string): Promise<any> {
        return api(`/stacks/${slug}`);
    }
};

// Registry API
export const registry = {
    async listStacks(query = '', sort = 'downloads'): Promise<any[]> {
        return api(`/registry/stacks?q=${encodeURIComponent(query)}&sort=${sort}`);
    },

    async listWorkflows(query = ''): Promise<any[]> {
        return api(`/registry/workflows?q=${encodeURIComponent(query)}`);
    }
};

// Config status
export async function getConfigStatus(): Promise<{
    llm_configured: boolean;
    llm_provider: string | null;
    github_configured: boolean;
    stripe_configured: boolean;
}> {
    return api('/config/status');
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
    return api('/health');
}
