import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Terminal } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function CLIInstallPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">CLI Installation</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Install the Redstone CLI to build with AI agents from your terminal.
                </p>

                {/* Quick Install */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Quick Install</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs">npm</span>
                                npm
                            </h4>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                <code>npm install -g @redstone/cli</code>
                            </div>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-xs">pnpm</span>
                                pnpm
                            </h4>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                <code>pnpm add -g @redstone/cli</code>
                            </div>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">yarn</span>
                                yarn
                            </h4>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                <code>yarn global add @redstone/cli</code>
                            </div>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">bun</span>
                                bun
                            </h4>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                <code>bun add -g @redstone/cli</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Shell Script */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">One-Line Install (Unix/macOS)</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <code>curl -fsSL https://redstone.dev/install.sh | sh</code>
                        </div>
                        <p className="text-dark-500 text-sm mt-3">
                            This script will detect your package manager and install the CLI automatically.
                        </p>
                    </div>
                </section>

                {/* Verify Installation */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Verify Installation</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`$ redstone --version
redstone/1.0.0 darwin-arm64 node-v20.0.0

$ redstone --help
Redstone CLI - Multi-Agent Coding Development System

USAGE
  $ redstone [COMMAND]

COMMANDS
  auth      Authenticate with Redstone
  chat      Chat with AI agents
  commit    Commit changes with optional AI message
  config    Manage CLI configuration
  init      Initialize a new project
  stacks    Manage agent stacks
  workspace Manage workspaces`}</pre>
                        </div>
                    </div>
                </section>

                {/* Setup */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Initial Setup</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-redstone-600 font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-dark-800 mb-2">Authenticate with GitHub</h4>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100 mb-2">
                                        <code>redstone auth login</code>
                                    </div>
                                    <p className="text-dark-500 text-sm">Opens browser for GitHub OAuth authentication.</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-redstone-600 font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-dark-800 mb-2">Configure LLM Provider</h4>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100 mb-2">
                                        <pre>{`# Set your preferred provider
redstone config set llm.provider anthropic

# Add your API key
export ANTHROPIC_API_KEY=sk-ant-...`}</pre>
                                    </div>
                                    <p className="text-dark-500 text-sm">Or use OpenAI, Google, or OpenRouter.</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-redstone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-redstone-600 font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-dark-800 mb-2">Initialize Your Project</h4>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100 mb-2">
                                        <pre>{`cd my-project
redstone init`}</pre>
                                    </div>
                                    <p className="text-dark-500 text-sm">Creates redstone.yaml config file in your project.</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-dark-800 mb-2">Start Building!</h4>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100 mb-2">
                                        <code>redstone chat "Create a REST API with Express"</code>
                                    </div>
                                    <p className="text-dark-500 text-sm">You're ready to build with AI agents.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Requirements */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Requirements</h2>
                    <div className="card">
                        <ul className="space-y-3 text-dark-600">
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span><strong>Node.js 18+</strong> or higher</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span><strong>Git</strong> for workspace sync</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span><strong>LLM API key</strong> (Anthropic, OpenAI, or Google)</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Updating */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Updating the CLI</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`# npm
npm update -g @redstone/cli

# Check for updates
redstone update

# Or reinstall latest
npm install -g @redstone/cli@latest`}</pre>
                        </div>
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Troubleshooting</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Command not found</h4>
                            <p className="text-dark-500 text-sm mb-2">
                                Make sure your global npm/yarn bin is in your PATH:
                            </p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <pre>{`# npm
export PATH="$(npm config get prefix)/bin:$PATH"

# yarn
export PATH="$(yarn global bin):$PATH"`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-2">Permission errors</h4>
                            <p className="text-dark-500 text-sm mb-2">
                                If you get EACCES errors, configure npm to use a different directory:
                            </p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <pre>{`mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH`}</pre>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/cli" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> CLI Overview
                    </Link>
                    <Link href="/docs/cli/commands" className="btn-primary">
                        Commands <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
