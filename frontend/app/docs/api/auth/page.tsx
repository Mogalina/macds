import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function APIAuthPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Authentication API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Authenticate users via GitHub OAuth and manage API keys for programmatic access.
                </p>

                {/* OAuth Flow */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">GitHub OAuth Flow</h2>
                    <p className="text-dark-600 mb-4">
                        Redstone uses GitHub OAuth for authentication. The flow works as follows:
                    </p>

                    <div className="card mb-4">
                        <h4 className="font-semibold text-dark-800 mb-3">1. Initiate OAuth</h4>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/github/auth</code>
                        </div>
                        <p className="text-dark-500 mb-3">Redirects user to GitHub authorization page.</p>
                        <div className="text-dark-600 text-sm">
                            <strong>Query Parameters:</strong>
                            <ul className="list-disc list-inside mt-1">
                                <li><code className="bg-gray-100 px-1 rounded">redirect_uri</code> - URL to redirect after auth (optional)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <h4 className="font-semibold text-dark-800 mb-3">2. OAuth Callback</h4>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/github/callback</code>
                        </div>
                        <p className="text-dark-500 mb-3">Handles GitHub's OAuth callback. Exchanges code for access token and creates/updates user account.</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`// Redirects to:
{frontend_url}/auth/callback?token=JWT_TOKEN

// Or on error:
{frontend_url}/auth/callback?error=access_denied`}</pre>
                        </div>
                    </div>

                    <div className="card">
                        <h4 className="font-semibold text-dark-800 mb-3">3. Check Auth Status</h4>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/github/status</code>
                        </div>
                        <p className="text-dark-500 mb-3">Check if user has connected their GitHub account and token is valid.</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "connected": true,
  "scopes": ["repo", "user:email"],
  "username": "octocat"
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Current User */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">User Information</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/auth/me</code>
                            </div>
                            <p className="text-dark-500 mb-3">Get current authenticated user information.</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "id": 123,
  "username": "octocat",
  "email": "octocat@github.com",
  "avatar_url": "https://avatars.githubusercontent.com/u/583231",
  "subscription_tier": "pro",
  "github_connected": true,
  "created_at": "2024-01-15T10:30:00Z"
}`}</pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Keys */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">API Keys</h2>
                    <p className="text-dark-600 mb-4">
                        Generate API keys for programmatic access. Keys can be scoped and set to expire.
                    </p>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/auth/keys</code>
                            </div>
                            <p className="text-dark-500 mb-3">List all API keys for the authenticated user.</p>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "keys": [
    {
      "id": "key_abc123",
      "name": "CI/CD Pipeline",
      "prefix": "rs_...xyz",
      "scopes": ["agents:chat", "workspaces:read"],
      "expires_at": "2024-12-31T23:59:59Z",
      "last_used_at": "2024-01-20T14:30:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/auth/keys</code>
                            </div>
                            <p className="text-dark-500 mb-3">Create a new API key.</p>
                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">Request</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-3">
                                <pre>{`{
  "name": "Production Server",
  "scopes": ["agents:chat", "workspaces:*"],
  "expires_in_days": 90  // optional, null for no expiry
}`}</pre>
                            </div>
                            <h4 className="font-semibold text-dark-800 mb-2 text-sm">Response</h4>
                            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                                <pre>{`{
  "id": "key_def456",
  "name": "Production Server",
  "key": "rs_live_xxxxxxxxxxxxxxxx",  // Only shown once!
  "scopes": ["agents:chat", "workspaces:*"],
  "expires_at": "2024-04-15T00:00:00Z"
}`}</pre>
                            </div>
                            <p className="text-amber-600 text-sm mt-3">
                                ⚠️ The full API key is only returned once. Store it securely.
                            </p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                                <code className="text-dark-700 font-mono text-sm">/auth/keys/:id</code>
                            </div>
                            <p className="text-dark-500">Revoke an API key. Takes effect immediately.</p>
                        </div>
                    </div>
                </section>

                {/* Scopes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Available Scopes</h2>
                    <div className="card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-dark-700">Scope</th>
                                    <th className="pb-3 text-dark-700">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark-600">
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">agents:chat</code></td>
                                    <td className="py-2">Send messages to agents</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">workspaces:read</code></td>
                                    <td className="py-2">Read workspace files</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">workspaces:write</code></td>
                                    <td className="py-2">Write and delete files</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">workspaces:*</code></td>
                                    <td className="py-2">Full workspace access</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">stacks:read</code></td>
                                    <td className="py-2">View stacks</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">stacks:write</code></td>
                                    <td className="py-2">Create/modify custom stacks</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Using Tokens */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Using API Keys</h2>
                    <div className="card">
                        <p className="text-dark-600 mb-3">Include your API key in the Authorization header:</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`curl -X POST https://api.redstone.dev/agents/chat \\
  -H "Authorization: Bearer rs_live_xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Create a REST API"}'`}</pre>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> API Overview
                    </Link>
                    <Link href="/docs/api/agents" className="btn-primary">
                        Agents API <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
