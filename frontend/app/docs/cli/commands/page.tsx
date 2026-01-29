import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function CLICommandsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight">CLI Commands</h1>
                <p className="text-dark-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                    Complete reference for all Redstone CLI commands.
                </p>

                {/* Authentication */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Authentication</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone auth login</code>
                            <p className="text-dark-500 text-sm mb-3">Authenticate with GitHub OAuth. Opens browser for authentication.</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                                <pre>{`$ redstone auth login
Opening browser for authentication...
✓ Successfully logged in as @username`}</pre>
                            </div>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone auth logout</code>
                            <p className="text-dark-500 text-sm">Sign out and clear stored credentials.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone auth status</code>
                            <p className="text-dark-500 text-sm">Display current authentication status.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone auth token</code>
                            <p className="text-dark-500 text-sm">Print the current API token (for use in scripts).</p>
                        </div>
                    </div>
                </section>

                {/* Project Management */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Project Management</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone init [name]</code>
                            <p className="text-dark-500 text-sm mb-3">Initialize a new Redstone project in the current directory.</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                                <pre>{`$ redstone init my-app
Creating redstone.yaml...
✓ Project initialized

$ cat redstone.yaml
name: my-app
stack: speed-demon
workspace:
  type: local
  path: .`}</pre>
                            </div>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone config list</code>
                            <p className="text-dark-500 text-sm">Show all configuration options.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone config set &lt;key&gt; &lt;value&gt;</code>
                            <p className="text-dark-500 text-sm mb-3">Set a configuration option.</p>
                            <div className="text-dark-600 text-xs mt-2">
                                <strong>Examples:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li><code className="bg-gray-100 px-1 rounded">redstone config set stack architect-pro</code></li>
                                    <li><code className="bg-gray-100 px-1 rounded">redstone config set llm.provider anthropic</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workspace Commands */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Workspace</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone workspace list</code>
                            <p className="text-dark-500 text-sm">List all workspaces.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone workspace add &lt;path|repo&gt;</code>
                            <p className="text-dark-500 text-sm mb-3">Add a workspace from local path or GitHub repository.</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                                <pre>{`# Local directory
$ redstone workspace add ./my-project

# GitHub repository
$ redstone workspace add github:user/repo

✓ Workspace added: my-project (id: 123)`}</pre>
                            </div>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone workspace select &lt;id|name&gt;</code>
                            <p className="text-dark-500 text-sm">Set the active workspace for commands.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone workspace sync</code>
                            <p className="text-dark-500 text-sm">Sync GitHub workspace (pull latest changes).</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone workspace status</code>
                            <p className="text-dark-500 text-sm">Show git status for current workspace.</p>
                        </div>
                    </div>
                </section>

                {/* Chat & AI */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Chat & AI Agents</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone chat &lt;message&gt;</code>
                            <p className="text-dark-500 text-sm mb-3">Send a message to AI agents. Responses stream to terminal.</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                                <pre>{`$ redstone chat "Create a REST API with Express"

[ArchitectAgent] I'll design the API structure...

Creating files:
  ✓ src/index.js
  ✓ src/routes/api.js
  ✓ package.json

Done! Run 'npm install && npm start' to begin.`}</pre>
                            </div>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone chat --interactive</code>
                            <p className="text-dark-500 text-sm">Start an interactive chat session (REPL mode).</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone chat --dry-run &lt;message&gt;</code>
                            <p className="text-dark-500 text-sm">Preview changes without applying them.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone chat --stack &lt;slug&gt; &lt;message&gt;</code>
                            <p className="text-dark-500 text-sm">Use a specific agent stack for the request.</p>
                        </div>
                    </div>
                </section>

                {/* Git Integration */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Git Integration</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone commit &lt;message&gt;</code>
                            <p className="text-dark-500 text-sm">Stage all changes and commit with message.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone push</code>
                            <p className="text-dark-500 text-sm">Push commits to GitHub.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone commit --ai</code>
                            <p className="text-dark-500 text-sm mb-3">Auto-generate commit message using AI.</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                                <pre>{`$ redstone commit --ai
Analyzing changes...
Generated message: "Add user authentication with JWT tokens"
Commit? [Y/n] y
✓ Committed`}</pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stacks */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Stack Management</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone stacks list</code>
                            <p className="text-dark-500 text-sm">List available agent stacks.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone stacks info &lt;slug&gt;</code>
                            <p className="text-dark-500 text-sm">Show details about a specific stack.</p>
                        </div>
                        <div className="card">
                            <code className="text-redstone-600 font-mono text-sm block mb-2">redstone stacks use &lt;slug&gt;</code>
                            <p className="text-dark-500 text-sm">Set the default stack for the project.</p>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
                    <Link href="/docs/cli/install" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Installation
                    </Link>
                    <Link href="/docs/cli/config" className="btn-primary w-full sm:w-auto justify-center">
                        Configuration <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
