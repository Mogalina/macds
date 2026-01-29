import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function ElasticSwarmYAMLDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">YAML Configuration</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Elastic Swarm workflows can be defined declaratively using YAML for version control and sharing.
                </p>

                {/* Schema Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Schema Overview</h2>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                        <pre>{`version: "1.0"

elastic_swarm:
  # Global defaults for all agents
  global:
    default_provider: anthropic
    default_model: claude-3-5-sonnet-20241022
    temperature: 0.7
    max_tokens: 4096
    
  # Agent definitions
  agents:
    agent_id:
      type: orchestrator | architect | implementation | reviewer | tester | debugger | optimizer | documenter | custom
      label: "Display Name"
      provider: anthropic | openai | google | openrouter
      model: model-identifier
      temperature: 0.0 - 2.0
      system_prompt: "Optional custom instructions"
      
  # Data flow connections
  connections:
    - from: source_agent_id
      to: target_agent_id`}</pre>
                    </div>
                </section>

                {/* Global Settings */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Global Settings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Field</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Default</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">default_provider</td>
                                    <td className="py-3 px-4 text-dark-600">string</td>
                                    <td className="py-3 px-4 text-dark-500">anthropic</td>
                                    <td className="py-3 px-4 text-dark-600">Default LLM provider for agents</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">default_model</td>
                                    <td className="py-3 px-4 text-dark-600">string</td>
                                    <td className="py-3 px-4 text-dark-500">claude-3-5-sonnet-20241022</td>
                                    <td className="py-3 px-4 text-dark-600">Default model identifier</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">temperature</td>
                                    <td className="py-3 px-4 text-dark-600">float</td>
                                    <td className="py-3 px-4 text-dark-500">0.7</td>
                                    <td className="py-3 px-4 text-dark-600">Default temperature (0-2)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">max_tokens</td>
                                    <td className="py-3 px-4 text-dark-600">integer</td>
                                    <td className="py-3 px-4 text-dark-500">4096</td>
                                    <td className="py-3 px-4 text-dark-600">Default max output tokens</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Agent Configuration */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Agent Configuration</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Field</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Required</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">type</td>
                                    <td className="py-3 px-4"><span className="text-green-600">Yes</span></td>
                                    <td className="py-3 px-4 text-dark-600">Agent type (orchestrator, implementation, etc.)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">label</td>
                                    <td className="py-3 px-4"><span className="text-green-600">Yes</span></td>
                                    <td className="py-3 px-4 text-dark-600">Display name in the visual editor</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">provider</td>
                                    <td className="py-3 px-4"><span className="text-dark-400">No</span></td>
                                    <td className="py-3 px-4 text-dark-600">LLM provider (uses global default)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">model</td>
                                    <td className="py-3 px-4"><span className="text-dark-400">No</span></td>
                                    <td className="py-3 px-4 text-dark-600">Specific model (uses global default)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">temperature</td>
                                    <td className="py-3 px-4"><span className="text-dark-400">No</span></td>
                                    <td className="py-3 px-4 text-dark-600">Override global temperature</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-xs">system_prompt</td>
                                    <td className="py-3 px-4"><span className="text-dark-400">No</span></td>
                                    <td className="py-3 px-4 text-dark-600">Custom system instructions</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Supported Models */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Supported Models</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center text-xs font-bold text-orange-600">A</span>
                                Anthropic
                            </h4>
                            <ul className="text-sm text-dark-500 space-y-1 font-mono">
                                <li>claude-3-5-sonnet-20241022</li>
                                <li>claude-3-opus-20240229</li>
                                <li>claude-3-haiku-20240307</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-xs font-bold text-green-600">O</span>
                                OpenAI
                            </h4>
                            <ul className="text-sm text-dark-500 space-y-1 font-mono">
                                <li>gpt-4o</li>
                                <li>gpt-4o-mini</li>
                                <li>gpt-4-turbo</li>
                                <li>gpt-3.5-turbo</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">G</span>
                                Google
                            </h4>
                            <ul className="text-sm text-dark-500 space-y-1 font-mono">
                                <li>gemini-1.5-pro</li>
                                <li>gemini-1.5-flash</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-bold text-purple-600">R</span>
                                OpenRouter
                            </h4>
                            <ul className="text-sm text-dark-500 space-y-1 font-mono">
                                <li>anthropic/claude-3.5-sonnet</li>
                                <li>openai/gpt-4o</li>
                                <li>meta-llama/llama-3.1-405b</li>
                                <li>mistralai/mixtral-8x22b</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Full Example */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Complete Example</h2>
                    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                        <pre>{`version: "1.0"

elastic_swarm:
  global:
    default_provider: anthropic
    default_model: claude-3-5-sonnet-20241022
    temperature: 0.7
    max_tokens: 4096

  agents:
    coordinator:
      type: orchestrator
      label: "Project Coordinator"
      temperature: 0.5
      system_prompt: |
        You coordinate a team of specialized AI agents.
        Route tasks to the appropriate agent based on requirements.
        
    architect:
      type: architect
      label: "System Architect"
      model: claude-3-opus-20240229
      temperature: 0.3
      system_prompt: |
        Focus on scalable, maintainable system design.
        Consider security, performance, and future extensibility.
        
    frontend:
      type: implementation
      label: "Frontend Developer"
      provider: openai
      model: gpt-4o
      temperature: 0.7
      system_prompt: |
        Expert in React, Next.js, TypeScript, and modern CSS.
        Write clean, accessible, performant code.
        
    backend:
      type: implementation
      label: "Backend Developer"
      temperature: 0.7
      system_prompt: |
        Expert in Node.js, Python, databases, and APIs.
        Focus on security and efficiency.
        
    qa:
      type: reviewer
      label: "Quality Assurance"
      temperature: 0.2
      system_prompt: |
        Review all code for bugs, security issues, and best practices.
        Be thorough but constructive in feedback.

  connections:
    - from: coordinator
      to: architect
    - from: coordinator
      to: frontend
    - from: coordinator
      to: backend
    - from: architect
      to: qa
    - from: frontend
      to: qa
    - from: backend
      to: qa`}</pre>
                    </div>
                </section>

                {/* Import/Export */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Import &amp; Export</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Export from Visual Editor</h4>
                            <p className="text-dark-500 text-sm mb-2">
                                Click the <strong>YAML</strong> button in the toolbar to view and download your workflow as YAML.
                            </p>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Import via API</h4>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <pre>{`curl -X POST https://api.redstone.dev/elastic-swarm/import-yaml \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Workflow",
    "yaml_content": "version: 1.0\\n..."
  }'`}</pre>
                            </div>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">CLI Import</h4>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <code>redstone swarm import workflow.yaml</code>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/elastic-swarm/workflows" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Creating Workflows
                    </Link>
                    <Link href="/docs/api" className="btn-primary">
                        API Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
