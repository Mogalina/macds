import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function CLIConfigPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight">Configuration</h1>
                <p className="text-dark-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                    Configure Redstone CLI with redstone.yaml and environment variables.
                </p>

                {/* redstone.yaml */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">redstone.yaml</h2>
                    <p className="text-dark-600 mb-4">
                        Project configuration file created by <code className="bg-gray-100 px-2 py-0.5 rounded">redstone init</code>.
                        Place in your project root.
                    </p>
                    <div className="card">
                        <h4 className="font-semibold text-dark-800 mb-3">Complete Example</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`# Project name
name: my-awesome-app

# Agent stack to use
stack: architect-pro

# Workspace configuration
workspace:
  type: github          # 'github' or 'local'
  repo: user/my-repo    # For GitHub workspaces
  branch: main          # Git branch
  path: .               # For local workspaces

# LLM provider settings
llm:
  provider: anthropic   # 'anthropic', 'openai', 'google'
  model: claude-3-5-sonnet-20241022
  temperature: 0.7
  max_tokens: 4096

# Agent behavior
agents:
  auto_apply: false     # Auto-apply file changes
  dry_run: false        # Preview mode
  verbose: true         # Show detailed output

# File patterns to ignore
ignore:
  - node_modules/
  - .git/
  - "*.log"
  - .env*

# Custom prompts for agents
prompts:
  architect: |
    Focus on clean architecture and SOLID principles.
  implementation: |
    Use TypeScript with strict mode. Follow ESLint rules.`}</pre>
                        </div>
                    </div>
                </section>

                {/* Configuration Options */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Configuration Reference</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3">stack</h4>
                            <p className="text-dark-500 text-sm mb-2">Agent stack to use for chat commands.</p>
                            <table className="w-full text-sm">
                                <tbody className="text-dark-600">
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">speed-demon</td>
                                        <td className="py-2">Fast responses, cheaper (GPT-4o-mini)</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">architect-pro</td>
                                        <td className="py-2">Quality code, best practices (Claude/GPT-4)</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">budget-builder</td>
                                        <td className="py-2">Cost-effective (GPT-3.5)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3">llm.provider</h4>
                            <p className="text-dark-500 text-sm mb-2">LLM provider to use.</p>
                            <table className="w-full text-sm">
                                <tbody className="text-dark-600">
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">anthropic</td>
                                        <td className="py-2">Claude models (recommended)</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">openai</td>
                                        <td className="py-2">GPT models</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="py-2 pr-4 font-medium">google</td>
                                        <td className="py-2">Gemini models</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3">agents.auto_apply</h4>
                            <p className="text-dark-500 text-sm">
                                When <code className="bg-gray-100 px-1 rounded">true</code>, file changes from agents are
                                automatically applied without confirmation. Default: <code className="bg-gray-100 px-1 rounded">false</code>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Environment Variables */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Environment Variables</h2>
                    <p className="text-dark-600 mb-4">
                        Set in your shell or <code className="bg-gray-100 px-2 py-0.5 rounded">.env</code> file.
                    </p>
                    <div className="card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-dark-700">Variable</th>
                                    <th className="pb-3 text-dark-700">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark-600">
                                <tr className="border-b">
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">REDSTONE_API_KEY</code></td>
                                    <td className="py-3">Your Redstone API key</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">ANTHROPIC_API_KEY</code></td>
                                    <td className="py-3">Anthropic API key for Claude</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code></td>
                                    <td className="py-3">OpenAI API key for GPT models</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">GOOGLE_API_KEY</code></td>
                                    <td className="py-3">Google API key for Gemini</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">REDSTONE_API_URL</code></td>
                                    <td className="py-3">Custom API endpoint (for self-hosted)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">GITHUB_TOKEN</code></td>
                                    <td className="py-3">GitHub personal access token</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Global Config */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Global Configuration</h2>
                    <p className="text-dark-600 mb-4">
                        Global settings are stored in <code className="bg-gray-100 px-2 py-0.5 rounded">~/.config/redstone/config.yaml</code>
                    </p>
                    <div className="card">
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`# ~/.config/redstone/config.yaml

# Default LLM provider
default_provider: anthropic

# Default stack for new projects
default_stack: architect-pro

# Editor for opening files
editor: code

# Output preferences
output:
  color: true
  format: pretty   # 'pretty', 'json', 'minimal'
  
# Telemetry (anonymous usage stats)
telemetry: true`}</pre>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
                    <Link href="/docs/cli/commands" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Commands
                    </Link>
                    <Link href="/docs/api" className="btn-primary w-full sm:w-auto justify-center">
                        API Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
