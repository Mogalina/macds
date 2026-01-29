import Link from 'next/link'
import { ArrowLeft, ArrowRight, FolderGit2 } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function APIWorkspacesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Workspaces API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Manage workspaces for GitHub repositories and local directories. Enable agents to read and write files.
                </p>

                {/* Workspace CRUD */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Workspace Management</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces</code>
                            </div>
                            <p className="text-dark-500 mb-3">List all workspaces for the authenticated user.</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "workspaces": [
    {
      "id": 1,
      "name": "my-project",
      "type": "github",
      "github_repo": "user/my-project",
      "github_branch": "main",
      "last_synced_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces</code>
                            </div>
                            <p className="text-dark-500 mb-3">Create a new workspace. Clones GitHub repo or links to local directory.</p>

                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">GitHub Workspace</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-3">
                                <pre>{`{
  "name": "my-project",
  "type": "github",
  "github_repo": "user/my-project",
  "github_branch": "main"
}`}</pre>
                            </div>

                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">Local Workspace</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "name": "local-project",
  "type": "local",
  "local_path": "/Users/you/projects/my-app"
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id</code>
                            </div>
                            <p className="text-dark-500">Get workspace details including file tree.</p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id</code>
                            </div>
                            <p className="text-dark-500">Delete a workspace. Optionally delete cloned files.</p>
                            <div className="text-sm text-dark-600 mt-2">
                                <strong>Query:</strong> <code className="bg-gray-100 px-1 rounded">delete_files=true</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* File Operations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">File Operations</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/files</code>
                            </div>
                            <p className="text-dark-500 mb-2">List files and directories.</p>
                            <div className="text-sm text-dark-600">
                                <strong>Query:</strong> <code className="bg-gray-100 px-1 rounded">path=/src</code>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/files/content</code>
                            </div>
                            <p className="text-dark-500 mb-2">Read file content.</p>
                            <div className="text-sm text-dark-600 mb-3">
                                <strong>Query:</strong> <code className="bg-gray-100 px-1 rounded">path=src/index.ts</code>
                            </div>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "path": "src/index.ts",
  "content": "export function main() {...}",
  "size": 1234,
  "encoding": "utf-8"
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">PUT</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/files/content</code>
                            </div>
                            <p className="text-dark-500 mb-2">Write file content. Creates parent directories if needed.</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`// Query: ?path=src/utils/helpers.ts
{
  "content": "export function formatDate(d: Date) {...}"
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/files</code>
                            </div>
                            <p className="text-dark-500">Delete a file or directory.</p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/search</code>
                            </div>
                            <p className="text-dark-500 mb-2">Search file contents.</p>
                            <div className="text-sm text-dark-600">
                                <strong>Query:</strong> <code className="bg-gray-100 px-1 rounded">query=TODO&file_pattern=*.ts</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Git Operations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Git Operations</h2>
                    <p className="text-dark-600 mb-4">Available only for GitHub workspaces.</p>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/git/sync</code>
                            </div>
                            <p className="text-dark-500">Pull latest changes from remote.</p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/git/status</code>
                            </div>
                            <p className="text-dark-500 mb-2">Get git status (modified/added/deleted files).</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "has_changes": true,
  "changes": [
    { "status": "M", "path": "src/index.ts" },
    { "status": "A", "path": "src/utils.ts" }
  ]
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/git/commit</code>
                            </div>
                            <p className="text-dark-500 mb-2">Stage and commit changes.</p>
                            <div className="text-sm text-dark-600">
                                <strong>Query:</strong> <code className="bg-gray-100 px-1 rounded">message=Add user authentication</code>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/workspaces/:id/git/push</code>
                            </div>
                            <p className="text-dark-500">Push commits to GitHub.</p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api/stacks" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Stacks API
                    </Link>
                    <Link href="/docs/api/registry" className="btn-primary">
                        Registry API <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
