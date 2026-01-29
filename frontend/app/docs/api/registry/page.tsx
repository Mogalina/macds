import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function APIRegistryPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Registry API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Browse, install, and publish custom agents and stacks to the Redstone community registry.
                </p>

                {/* Browse Agents */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Browse Agents</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/agents</code>
                            </div>
                            <p className="text-dark-500 mb-3">List published agents with pagination and filtering.</p>
                            <div className="text-dark-600 text-sm mb-3">
                                <strong>Query Parameters:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    <li><code className="bg-gray-100 px-1 rounded">page</code> - Page number (default: 1)</li>
                                    <li><code className="bg-gray-100 px-1 rounded">per_page</code> - Items per page (default: 20, max: 100)</li>
                                    <li><code className="bg-gray-100 px-1 rounded">category</code> - Filter by category</li>
                                    <li><code className="bg-gray-100 px-1 rounded">sort</code> - Sort by: downloads, stars, updated, created</li>
                                </ul>
                            </div>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "agents": [
    {
      "id": "agent_react-pro",
      "name": "React Pro Agent",
      "description": "Specialized React/TypeScript agent",
      "author": "octocat",
      "version": "1.2.0",
      "downloads": 15420,
      "stars": 342,
      "category": "frontend",
      "tags": ["react", "typescript", "hooks"],
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "per_page": 20
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/agents/:id</code>
                            </div>
                            <p className="text-dark-500 mb-3">Get detailed information about a specific agent.</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "id": "agent_react-pro",
  "name": "React Pro Agent",
  "description": "Specialized React/TypeScript agent with hooks expertise",
  "long_description": "This agent specializes in...",
  "author": "octocat",
  "version": "1.2.0",
  "versions": ["1.2.0", "1.1.0", "1.0.0"],
  "downloads": 15420,
  "stars": 342,
  "repository": "https://github.com/octocat/react-pro-agent",
  "license": "MIT",
  "config": {
    "model": "claude-3-5-sonnet-20241022",
    "system_prompt": "You are a React expert...",
    "tools": ["file_read", "file_write", "search"]
  },
  "readme": "# React Pro Agent\\n\\n...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`}</pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Browse Stacks */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Browse Stacks</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/stacks</code>
                            </div>
                            <p className="text-dark-500 mb-3">List published community stacks.</p>
                            <div className="text-dark-600 text-sm">
                                Same pagination and filtering options as agents endpoint.
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/stacks/:id</code>
                            </div>
                            <p className="text-dark-500">Get detailed information about a specific stack.</p>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Search Registry</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/registry/search</code>
                        </div>
                        <p className="text-dark-500 mb-3">Search across all agents and stacks.</p>
                        <div className="text-dark-600 text-sm mb-3">
                            <strong>Query Parameters:</strong>
                            <ul className="list-disc list-inside mt-1">
                                <li><code className="bg-gray-100 px-1 rounded">q</code> - Search query (required)</li>
                                <li><code className="bg-gray-100 px-1 rounded">type</code> - Filter by: agent, stack, or all</li>
                                <li><code className="bg-gray-100 px-1 rounded">category</code> - Filter by category</li>
                            </ul>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`// GET /registry/search?q=react&type=agent

{
  "results": [
    {
      "type": "agent",
      "id": "agent_react-pro",
      "name": "React Pro Agent",
      "description": "Specialized React/TypeScript agent",
      "score": 0.95
    }
  ],
  "total": 12,
  "query": "react"
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Install */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Install Items</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                            <code className="text-dark-700 font-mono text-sm">/registry/install</code>
                        </div>
                        <p className="text-dark-500 mb-3">Install an agent or stack to your account.</p>
                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Request</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-3">
                            <pre>{`{
  "type": "agent",
  "id": "agent_react-pro",
  "version": "1.2.0"  // optional, latest if not specified
}`}</pre>
                        </div>
                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Response</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "installed": true,
  "id": "agent_react-pro",
  "version": "1.2.0",
  "message": "Agent installed successfully"
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Publish */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Publish to Registry</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/publish</code>
                            </div>
                            <p className="text-dark-500 mb-3">Publish an agent or stack to the registry. <span className="text-amber-600">Requires Pro tier or higher.</span></p>
                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">Publish Agent</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-3">
                                <pre>{`{
  "type": "agent",
  "name": "My Custom Agent",
  "description": "Short description for listings",
  "long_description": "Detailed markdown description...",
  "version": "1.0.0",
  "category": "backend",
  "tags": ["nodejs", "express", "api"],
  "license": "MIT",
  "repository": "https://github.com/you/my-agent",
  "config": {
    "model": "claude-3-5-sonnet-20241022",
    "system_prompt": "You are an expert in...",
    "temperature": 0.7
  }
}`}</pre>
                            </div>
                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">Publish Stack</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "type": "stack",
  "name": "Full-Stack Pro",
  "description": "Complete stack for full-stack development",
  "version": "1.0.0",
  "category": "fullstack",
  "config": {
    "default_model": "claude-3-5-sonnet-20241022",
    "agents": {
      "ArchitectAgent": { ... },
      "ImplementationAgent": { ... }
    }
  }
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">PUT</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/:type/:id</code>
                            </div>
                            <p className="text-dark-500">Update a published item. Requires a new version number.</p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                                <code className="text-dark-700 font-mono text-sm">/registry/:type/:id</code>
                            </div>
                            <p className="text-dark-500">Unpublish an item. Only the author can unpublish.</p>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Categories</h2>
                    <div className="card">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="bg-gray-100 px-3 py-2 rounded">frontend</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">backend</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">fullstack</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">mobile</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">devops</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">database</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">testing</div>
                            <div className="bg-gray-100 px-3 py-2 rounded">security</div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api/stacks" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Stacks API
                    </Link>
                    <Link href="/docs/sdk" className="btn-primary">
                        SDK Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
