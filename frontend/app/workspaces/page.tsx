'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import {
    workspaces as workspacesApi,
    github,
    auth,
    type Workspace,
    type Repository,
    type FileItem
} from '@/lib/api'

export default function WorkspacesPage() {
    const router = useRouter()
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [repos, setRepos] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [showNewModal, setShowNewModal] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
    const [fileTree, setFileTree] = useState<FileItem | null>(null)
    const [githubConnected, setGithubConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // New workspace form
    const [newWorkspace, setNewWorkspace] = useState({
        type: 'github' as 'github' | 'local',
        name: '',
        github_repo: '',
        github_branch: 'main',
        local_path: ''
    })
    const [creating, setCreating] = useState(false)

    const fetchWorkspaces = useCallback(async () => {
        try {
            const data = await workspacesApi.list()
            setWorkspaces(data.workspaces)
        } catch (err) {
            console.error('Failed to fetch workspaces:', err)
        }
    }, [])

    const fetchGitHubStatus = useCallback(async () => {
        try {
            const status = await auth.getGitHubStatus()
            setGithubConnected(status.connected)

            if (status.connected) {
                const data = await github.listRepos()
                setRepos(data.repos)
            }
        } catch {
            setGithubConnected(false)
        }
    }, [])

    useEffect(() => {
        async function init() {
            setLoading(true)
            await Promise.all([fetchWorkspaces(), fetchGitHubStatus()])
            setLoading(false)
        }
        init()
    }, [fetchWorkspaces, fetchGitHubStatus])

    const handleCreateWorkspace = async () => {
        if (creating) return
        setCreating(true)
        setError(null)

        try {
            const created = await workspacesApi.create({
                name: newWorkspace.name || (newWorkspace.type === 'github' ? newWorkspace.github_repo : 'Local Workspace'),
                type: newWorkspace.type,
                github_repo: newWorkspace.type === 'github' ? newWorkspace.github_repo : undefined,
                github_branch: newWorkspace.type === 'github' ? newWorkspace.github_branch : undefined,
                local_path: newWorkspace.type === 'local' ? newWorkspace.local_path : undefined
            })

            setWorkspaces(prev => [...prev, created])
            setShowNewModal(false)
            setNewWorkspace({ type: 'github', name: '', github_repo: '', github_branch: 'main', local_path: '' })
        } catch (err: any) {
            setError(err.message || 'Failed to create workspace')
        } finally {
            setCreating(false)
        }
    }

    const handleDeleteWorkspace = async (id: number) => {
        if (!confirm('Are you sure you want to delete this workspace?')) return

        try {
            await workspacesApi.delete(id)
            setWorkspaces(prev => prev.filter(w => w.id !== id))
            if (selectedWorkspace?.id === id) {
                setSelectedWorkspace(null)
                setFileTree(null)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete workspace')
        }
    }

    const selectWorkspace = async (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        try {
            const data = await workspacesApi.get(workspace.id)
            setFileTree(data.file_tree)
        } catch (err) {
            console.error('Failed to fetch workspace:', err)
        }
    }

    const openInChat = (workspace: Workspace) => {
        router.push(`/chat?workspace=${workspace.id}`)
    }

    const connectGitHub = () => {
        localStorage.setItem('auth_return_url', '/workspaces')
        window.location.href = auth.getGitHubAuthUrl()
    }

    const renderFileTree = (item: FileItem, depth = 0): React.ReactNode => {
        if (depth > 3) return null

        return (
            <div key={item.path} style={{ paddingLeft: depth * 16 }}>
                <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded text-sm">
                    {item.is_dir ? (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                    <span className={item.is_dir ? 'font-medium' : ''}>{item.name}</span>
                </div>
                {item.is_dir && item.children?.map(child => renderFileTree(child, depth + 1))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-20">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-dark-900">Workspaces</h1>
                            <p className="text-dark-600 mt-1">Manage your development workspaces</p>
                        </div>
                        <button
                            onClick={() => setShowNewModal(true)}
                            className="px-4 py-2 bg-redstone-500 text-white rounded-lg hover:bg-redstone-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Workspace
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                            <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">×</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-redstone-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Workspace List */}
                            <div className="lg:col-span-1 space-y-4">
                                <h2 className="font-semibold text-dark-700 mb-4">Your Workspaces</h2>

                                {workspaces.length === 0 ? (
                                    <div className="text-center py-8 text-dark-500 border-2 border-dashed rounded-lg">
                                        <svg className="w-12 h-12 mx-auto mb-3 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p>No workspaces yet</p>
                                        <p className="text-sm">Create one to get started</p>
                                    </div>
                                ) : (
                                    workspaces.map(workspace => (
                                        <div
                                            key={workspace.id}
                                            onClick={() => selectWorkspace(workspace)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedWorkspace?.id === workspace.id
                                                    ? 'border-redstone-500 bg-redstone-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    {workspace.type === 'github' ? (
                                                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium text-dark-900">{workspace.name}</h3>
                                                        <p className="text-sm text-dark-500">
                                                            {workspace.type === 'github' ? workspace.github_repo : 'Local'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }}
                                                    className="text-gray-400 hover:text-red-500 p-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Workspace Details */}
                            <div className="lg:col-span-2">
                                {selectedWorkspace ? (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                                            <div>
                                                <h2 className="font-semibold text-dark-900">{selectedWorkspace.name}</h2>
                                                {selectedWorkspace.github_repo && (
                                                    <p className="text-sm text-dark-500">
                                                        {selectedWorkspace.github_repo} • {selectedWorkspace.github_branch}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => openInChat(selectedWorkspace)}
                                                className="px-4 py-2 bg-redstone-500 text-white rounded-lg hover:bg-redstone-600 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Open in Chat
                                            </button>
                                        </div>

                                        <div className="p-4 max-h-96 overflow-y-auto">
                                            <h3 className="text-sm font-medium text-dark-700 mb-2">Files</h3>
                                            {fileTree ? (
                                                <div className="font-mono text-sm">
                                                    {fileTree.children?.map(item => renderFileTree(item))}
                                                </div>
                                            ) : (
                                                <p className="text-dark-500">Loading...</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed rounded-lg h-full flex items-center justify-center text-dark-500 min-h-[300px]">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 mx-auto mb-3 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                            <p>Select a workspace to view details</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* New Workspace Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">Create Workspace</h2>

                        {/* Type Selection */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setNewWorkspace(prev => ({ ...prev, type: 'github' }))}
                                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${newWorkspace.type === 'github'
                                        ? 'border-redstone-500 bg-redstone-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <p className="font-medium">GitHub Repository</p>
                            </button>
                            <button
                                onClick={() => setNewWorkspace(prev => ({ ...prev, type: 'local' }))}
                                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${newWorkspace.type === 'local'
                                        ? 'border-redstone-500 bg-redstone-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-8 h-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <p className="font-medium">Local Directory</p>
                            </button>
                        </div>

                        {newWorkspace.type === 'github' ? (
                            githubConnected ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Repository</label>
                                        <select
                                            value={newWorkspace.github_repo}
                                            onChange={e => setNewWorkspace(prev => ({
                                                ...prev,
                                                github_repo: e.target.value,
                                                name: e.target.value.split('/')[1] || ''
                                            }))}
                                            className="w-full border rounded-lg px-3 py-2"
                                        >
                                            <option value="">Select a repository</option>
                                            {repos.map(repo => (
                                                <option key={repo.id} value={repo.full_name}>
                                                    {repo.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Branch</label>
                                        <input
                                            type="text"
                                            value={newWorkspace.github_branch}
                                            onChange={e => setNewWorkspace(prev => ({ ...prev, github_branch: e.target.value }))}
                                            placeholder="main"
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-dark-600 mb-4">Connect GitHub to access your repositories</p>
                                    <button
                                        onClick={connectGitHub}
                                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 mx-auto"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        Connect GitHub
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Directory Path</label>
                                    <input
                                        type="text"
                                        value={newWorkspace.local_path}
                                        onChange={e => setNewWorkspace(prev => ({ ...prev, local_path: e.target.value }))}
                                        placeholder="/Users/you/projects/my-project"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    <p className="text-xs text-dark-500 mt-1">
                                        Enter the absolute path to your project directory
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Workspace Name</label>
                                    <input
                                        type="text"
                                        value={newWorkspace.name}
                                        onChange={e => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="My Project"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowNewModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateWorkspace}
                                disabled={creating || (newWorkspace.type === 'github' ? !newWorkspace.github_repo : !newWorkspace.local_path)}
                                className="flex-1 px-4 py-2 bg-redstone-500 text-white rounded-lg hover:bg-redstone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
