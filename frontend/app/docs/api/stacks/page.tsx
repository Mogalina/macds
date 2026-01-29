import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function APIStacksPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Stacks API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Manage LLM configurations and agent stacks. Stacks define which models and settings agents use.
                </p>

                {/* List Stacks */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">List Stacks</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/stacks</code>
                        </div>
                        <p className="text-dark-500 mb-3">List all available stacks (built-in and custom).</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`[
  {
    "id": 1,
    "slug": "speed-demon",
    "name": "Speed Demon",
    "description": "Fast responses with GPT-4o-mini",
    "is_builtin": true,
    "config": {
      "default_model": "gpt-4o-mini",
      "temperature": 0.7,
      "agents": {
        "ArchitectAgent": { "model": "gpt-4o-mini" },
        "ImplementationAgent": { "model": "gpt-4o-mini" }
      }
    }
  },
  {
    "id": 2,
    "slug": "architect-pro",
    "name": "Architect Pro",
    "description": "Quality-focused with Claude/GPT-4",
    "is_builtin": true
  }
]`}</pre>
                        </div>
                    </div>
                </section>

                {/* Get Stack */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Get Stack Details</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                            <code className="text-dark-700 font-mono text-sm">/stacks/:slug</code>
                        </div>
                        <p className="text-dark-500 mb-3">Get detailed configuration for a specific stack.</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "id": 2,
  "slug": "architect-pro",
  "name": "Architect Pro",
  "description": "Quality-focused development stack",
  "is_builtin": true,
  "config": {
    "default_model": "claude-3-5-sonnet-20241022",
    "fallback_model": "gpt-4o",
    "temperature": 0.5,
    "max_tokens": 8192,
    "agents": {
      "ArchitectAgent": {
        "model": "claude-3-5-sonnet-20241022",
        "temperature": 0.3,
        "system_prompt": "Focus on clean architecture..."
      },
      "ImplementationAgent": {
        "model": "claude-3-5-sonnet-20241022",
        "temperature": 0.7
      },
      "ReviewerAgent": {
        "model": "gpt-4o",
        "temperature": 0.2
      }
    }
  },
  "usage": {
    "total_requests": 15420,
    "avg_response_time_ms": 2340
  }
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Create Stack */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Create Custom Stack</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                            <code className="text-dark-700 font-mono text-sm">/stacks</code>
                        </div>
                        <p className="text-dark-500 mb-3">Create a custom stack with your own configuration. <span className="text-amber-600">Requires Pro or Team tier.</span></p>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Request</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-3">
                            <pre>{`{
  "name": "My Custom Stack",
  "slug": "my-custom-stack",  // optional, auto-generated if not provided
  "description": "Optimized for React development",
  "config": {
    "default_model": "claude-3-5-sonnet-20241022",
    "temperature": 0.6,
    "max_tokens": 4096,
    "agents": {
      "ArchitectAgent": {
        "model": "claude-3-5-sonnet-20241022",
        "system_prompt": "Specialize in React architecture with TypeScript"
      },
      "ImplementationAgent": {
        "model": "gpt-4o",
        "temperature": 0.8,
        "system_prompt": "Write React components with hooks and TypeScript"
      }
    }
  }
}`}</pre>
                        </div>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Response</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "id": 42,
  "slug": "my-custom-stack",
  "name": "My Custom Stack",
  "is_builtin": false,
  "owner_id": 123,
  "created_at": "2024-01-20T10:00:00Z"
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Update Stack */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Update Stack</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">PUT</span>
                            <code className="text-dark-700 font-mono text-sm">/stacks/:slug</code>
                        </div>
                        <p className="text-dark-500 mb-3">Update a custom stack. Only the owner can update their stacks. Built-in stacks cannot be modified.</p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "name": "My Updated Stack",
  "description": "Now with better prompts",
  "config": {
    "default_model": "gpt-4o",
    "agents": {
      "ImplementationAgent": {
        "temperature": 0.9
      }
    }
  }
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Delete Stack */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Delete Stack</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                            <code className="text-dark-700 font-mono text-sm">/stacks/:slug</code>
                        </div>
                        <p className="text-dark-500">Delete a custom stack. Projects using this stack will fall back to the default.</p>
                    </div>
                </section>

                {/* Stack Configuration Reference */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Configuration Reference</h2>
                    <div className="card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-dark-700">Field</th>
                                    <th className="pb-3 text-dark-700">Type</th>
                                    <th className="pb-3 text-dark-700">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark-600">
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">default_model</code></td>
                                    <td className="py-2 pr-4">string</td>
                                    <td className="py-2">Default model for all agents</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">fallback_model</code></td>
                                    <td className="py-2 pr-4">string</td>
                                    <td className="py-2">Model to use if default fails</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">temperature</code></td>
                                    <td className="py-2 pr-4">float</td>
                                    <td className="py-2">0.0-2.0, controls randomness</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">max_tokens</code></td>
                                    <td className="py-2 pr-4">integer</td>
                                    <td className="py-2">Maximum response length</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4"><code className="bg-gray-100 px-1 rounded">agents</code></td>
                                    <td className="py-2 pr-4">object</td>
                                    <td className="py-2">Per-agent configuration overrides</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Available Models */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Supported Models</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Anthropic</h4>
                            <ul className="text-sm text-dark-600 space-y-1">
                                <li>claude-3-5-sonnet-20241022</li>
                                <li>claude-3-opus-20240229</li>
                                <li>claude-3-haiku-20240307</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">OpenAI</h4>
                            <ul className="text-sm text-dark-600 space-y-1">
                                <li>gpt-4o</li>
                                <li>gpt-4o-mini</li>
                                <li>gpt-4-turbo</li>
                                <li>gpt-3.5-turbo</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Google</h4>
                            <ul className="text-sm text-dark-600 space-y-1">
                                <li>gemini-1.5-pro</li>
                                <li>gemini-1.5-flash</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api/workspaces" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Workspaces API
                    </Link>
                    <Link href="/docs/api/registry" className="btn-primary">
                        Registry API <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
