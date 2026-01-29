import Link from 'next/link'
import { ArrowLeft, ArrowRight, Zap, Download, Terminal } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function QuickStartPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Quick Start</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Get up and running with Redstone in under 5 minutes. This guide covers the fastest path to your first AI-assisted build.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 1: Install the CLI</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>npm install -g @redstone/cli</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 2: Authenticate</h2>
                    <p className="text-dark-600 mb-4">Connect your GitHub account for repository access:</p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>redstone auth login</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 3: Initialize a Project</h2>
                    <p className="text-dark-600 mb-4">Create a new project or initialize in an existing directory:</p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                        <code>redstone init my-project</code>
                    </div>
                    <p className="text-dark-500 text-sm">This creates a <code className="bg-gray-100 px-2 py-1 rounded text-dark-700">redstone.yaml</code> configuration file.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 4: Start Building</h2>
                    <p className="text-dark-600 mb-4">Use the chat interface to describe what you want:</p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>redstone chat "Build a REST API with user authentication"</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">What Happens Next?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <div className="w-10 h-10 rounded-xl bg-redstone-50 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-redstone-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Agents Activate</h3>
                            <p className="text-dark-500 text-sm">ProductAgent parses your request, ArchitectAgent designs the solution</p>
                        </div>
                        <div className="card">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                                <Terminal className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Code Generated</h3>
                            <p className="text-dark-500 text-sm">ImplementationAgent writes code, BuildTestAgent verifies it works</p>
                        </div>
                        <div className="card">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                                <Download className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-bold text-dark-900 mb-2">Ready to Ship</h3>
                            <p className="text-dark-500 text-sm">Reviewed, tested code is committed to your repository</p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/introduction" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Introduction
                    </Link>
                    <Link href="/docs/installation" className="btn-primary">
                        Installation <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
