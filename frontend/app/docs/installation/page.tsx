import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function InstallationPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Installation</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Install Redstone CLI and SDK to start building with AI agents.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Prerequisites</h2>
                    <ul className="space-y-3 text-dark-600">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full"></span>
                            Node.js 18 or higher
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full"></span>
                            npm, pnpm, or yarn
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full"></span>
                            GitHub account (for authentication)
                        </li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Install via npm</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>npm install -g @redstone/cli</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Install via pnpm</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>pnpm add -g @redstone/cli</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Verify Installation</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                        <code>redstone --version</code>
                    </div>
                    <p className="text-dark-500 text-sm">You should see the version number if installation was successful.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">SDK Installation (Optional)</h2>
                    <p className="text-dark-600 mb-4">For programmatic access, install the SDK in your project:</p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>npm install @redstone/sdk</code>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/quick-start" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Quick Start
                    </Link>
                    <Link href="/docs/agents" className="btn-primary">
                        Agents <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
