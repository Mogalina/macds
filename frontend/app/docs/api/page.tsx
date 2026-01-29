import Link from 'next/link'
import { Key, Users, Layers, Database, FolderGit2, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function APIReferencePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">API Reference</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Programmatic access to all Redstone features via REST API.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Base URL</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>https://api.redstone.dev/v1</code>
                    </div>
                    <p className="text-dark-500 mt-3 text-sm">
                        For local development: <code className="bg-gray-100 px-2 py-0.5 rounded">http://localhost:8000</code>
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Authentication</h2>
                    <p className="text-dark-600 mb-4">
                        Include your JWT token in the Authorization header for authenticated requests:
                    </p>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>Authorization: Bearer YOUR_JWT_TOKEN</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Endpoints</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/docs/api/auth" className="card group">
                            <div className="w-10 h-10 rounded-xl bg-redstone-50 flex items-center justify-center mb-4">
                                <Key className="w-5 h-5 text-redstone-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Authentication</h3>
                            <p className="text-dark-500 text-sm">GitHub OAuth flow and token management</p>
                        </Link>
                        <Link href="/docs/api/agents" className="card group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Agents</h3>
                            <p className="text-dark-500 text-sm">Chat with AI agents, WebSocket streaming</p>
                        </Link>
                        <Link href="/docs/api/workspaces" className="card group">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                                <FolderGit2 className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Workspaces</h3>
                            <p className="text-dark-500 text-sm">Manage repos, file operations, git commands</p>
                        </Link>
                        <Link href="/docs/api/stacks" className="card group">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                                <Layers className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Stacks</h3>
                            <p className="text-dark-500 text-sm">LLM configurations and agent settings</p>
                        </Link>
                        <Link href="/docs/api/registry" className="card group">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                                <Database className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Registry</h3>
                            <p className="text-dark-500 text-sm">Browse and publish custom agents</p>
                        </Link>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Rate Limits</h2>
                    <div className="card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-dark-700">Tier</th>
                                    <th className="pb-3 text-dark-700">Requests/min</th>
                                    <th className="pb-3 text-dark-700">Chat tokens/month</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark-600">
                                <tr className="border-b">
                                    <td className="py-3">Free</td>
                                    <td className="py-3">60</td>
                                    <td className="py-3">100,000</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3">Pro</td>
                                    <td className="py-3">300</td>
                                    <td className="py-3">1,000,000</td>
                                </tr>
                                <tr>
                                    <td className="py-3">Enterprise</td>
                                    <td className="py-3">Custom</td>
                                    <td className="py-3">Unlimited</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Error Codes</h2>
                    <div className="card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-dark-700">Code</th>
                                    <th className="pb-3 text-dark-700">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark-600">
                                <tr className="border-b">
                                    <td className="py-2"><code>400</code></td>
                                    <td className="py-2">Bad request - Invalid parameters</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2"><code>401</code></td>
                                    <td className="py-2">Unauthorized - Missing or invalid token</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2"><code>403</code></td>
                                    <td className="py-2">Forbidden - Insufficient permissions</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2"><code>404</code></td>
                                    <td className="py-2">Not found - Resource doesn't exist</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2"><code>429</code></td>
                                    <td className="py-2">Rate limit exceeded</td>
                                </tr>
                                <tr>
                                    <td className="py-2"><code>500</code></td>
                                    <td className="py-2">Internal server error</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/cli/config" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> CLI Configuration
                    </Link>
                </div>
            </main>
        </div>
    )
}
