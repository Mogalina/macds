import Link from 'next/link'
import { Terminal, Command, Settings, ArrowRight, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function CLIReferencePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">CLI Reference</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    The Redstone CLI provides command-line access to all platform features.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Link href="/docs/cli/install" className="card group">
                        <div className="w-10 h-10 rounded-xl bg-redstone-50 flex items-center justify-center mb-4">
                            <Terminal className="w-5 h-5 text-redstone-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-2">Installation</h3>
                        <p className="text-dark-500 text-sm">Install and configure the CLI</p>
                    </Link>
                    <Link href="/docs/cli/commands" className="card group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                            <Command className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-2">Commands</h3>
                        <p className="text-dark-500 text-sm">All available CLI commands</p>
                    </Link>
                    <Link href="/docs/cli/config" className="card group">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                            <Settings className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-2">Configuration</h3>
                        <p className="text-dark-500 text-sm">redstone.yaml options</p>
                    </Link>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/contracts" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Contracts
                    </Link>
                    <Link href="/docs/api" className="btn-primary">
                        API Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
