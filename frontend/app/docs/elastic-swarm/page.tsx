import Link from 'next/link'
import { ArrowLeft, ArrowRight, Zap, Play, FileCode, Layout, Settings, Users } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function ElasticSwarmDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-redstone-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-dark-900 tracking-tight">Elastic Swarm</h1>
                        <p className="text-dark-500">Visual AI Agent Workflow Builder</p>
                    </div>
                </div>

                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Create custom AI agent teams with drag-and-drop visual editing. Configure each agent with your preferred LLM
                    from OpenRouter, Anthropic, OpenAI, or Google. Export workflows as YAML for version control and sharing.
                </p>

                {/* Pro Badge */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-12 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-amber-900">Pro Feature</p>
                        <p className="text-amber-700 text-sm">Elastic Swarm requires a Pro or Team subscription.</p>
                    </div>
                </div>

                {/* Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Overview</h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-dark-600 leading-relaxed mb-4">
                            Elastic Swarm is a visual workflow builder that lets you create custom AI agent &quot;teams&quot; or &quot;swarms&quot;.
                            Each agent in your workflow can be configured with:
                        </p>
                        <ul className="space-y-2 text-dark-600 mb-6">
                            <li className="flex items-start gap-2">
                                <span className="text-redstone-600 font-bold">•</span>
                                <span><strong>Agent Type</strong> - Orchestrator, Architect, Implementation, Reviewer, Tester, etc.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-redstone-600 font-bold">•</span>
                                <span><strong>LLM Provider</strong> - Choose from Anthropic, OpenAI, Google, or OpenRouter</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-redstone-600 font-bold">•</span>
                                <span><strong>Model</strong> - Select the specific model (Claude, GPT-4o, Gemini, Llama, etc.)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-redstone-600 font-bold">•</span>
                                <span><strong>Temperature</strong> - Control creativity vs. determinism</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-redstone-600 font-bold">•</span>
                                <span><strong>System Prompt</strong> - Custom instructions for the agent</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Key Features */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                <Layout className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-dark-900 mb-2">Visual Editor</h3>
                            <p className="text-dark-500 text-sm">
                                Drag-and-drop canvas with intuitive node connections.
                                Visualize your workflow at a glance.
                            </p>
                        </div>
                        <div className="card">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-dark-900 mb-2">Multi-LLM Support</h3>
                            <p className="text-dark-500 text-sm">
                                Mix and match models from different providers.
                                Use GPT-4o for code, Claude for review.
                            </p>
                        </div>
                        <div className="card">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                                <FileCode className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-dark-900 mb-2">YAML Export</h3>
                            <p className="text-dark-500 text-sm">
                                Export workflows as YAML for version control,
                                sharing, and programmatic editing.
                            </p>
                        </div>
                        <div className="card">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                                <Play className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-dark-900 mb-2">Instant Execution</h3>
                            <p className="text-dark-500 text-sm">
                                Execute your workflow directly from the editor.
                                See agents collaborate in real-time.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Getting Started */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Getting Started</h2>
                    <div className="space-y-4">
                        <div className="card flex items-start gap-4">
                            <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-redstone-600 font-bold">1</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-800 mb-1">Navigate to Elastic Swarm</h4>
                                <p className="text-dark-500 text-sm">
                                    Go to <Link href="/elastic-swarm" className="text-redstone-600 hover:underline">/elastic-swarm</Link> from
                                    the main navigation or dashboard.
                                </p>
                            </div>
                        </div>
                        <div className="card flex items-start gap-4">
                            <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-redstone-600 font-bold">2</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-800 mb-1">Start from a Template or Scratch</h4>
                                <p className="text-dark-500 text-sm">
                                    Choose a starter template like "Full-Stack Builder" or add agents manually from the sidebar.
                                </p>
                            </div>
                        </div>
                        <div className="card flex items-start gap-4">
                            <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-redstone-600 font-bold">3</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-800 mb-1">Configure Each Agent</h4>
                                <p className="text-dark-500 text-sm">
                                    Click on an agent node to configure its LLM provider, model, temperature, and system prompt.
                                </p>
                            </div>
                        </div>
                        <div className="card flex items-start gap-4">
                            <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-redstone-600 font-bold">4</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-800 mb-1">Connect Agents</h4>
                                <p className="text-dark-500 text-sm">
                                    Drag from one agent's output handle to another's input to create data flow connections.
                                </p>
                            </div>
                        </div>
                        <div className="card flex items-start gap-4">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 font-bold">5</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-800 mb-1">Save and Execute</h4>
                                <p className="text-dark-500 text-sm">
                                    Save your workflow and click Execute to start a chat session with your custom agent team.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Agent Types */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Agent Types</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Purpose</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Best Model</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Orchestrator</span></td>
                                    <td className="py-3 px-4 text-dark-600">Coordinates other agents, routes tasks</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">claude-3-5-sonnet</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">Architect</span></td>
                                    <td className="py-3 px-4 text-dark-600">System design and architecture planning</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">claude-3-opus</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Implementation</span></td>
                                    <td className="py-3 px-4 text-dark-600">Writes production code</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">gpt-4o</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Reviewer</span></td>
                                    <td className="py-3 px-4 text-dark-600">Code review and quality checks</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">claude-3-5-sonnet</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Tester</span></td>
                                    <td className="py-3 px-4 text-dark-600">Testing and validation</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">gpt-4o-mini</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Debugger</span></td>
                                    <td className="py-3 px-4 text-dark-600">Bug fixing and debugging</td>
                                    <td className="py-3 px-4 font-mono text-xs text-dark-500">claude-3-5-sonnet</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Navigate */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Documentation
                    </Link>
                    <Link href="/docs/elastic-swarm/workflows" className="btn-primary">
                        Creating Workflows <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
