import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function GitHubGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">GitHub Integration</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Connect Redstone to your GitHub repositories for seamless code management.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Connecting Your Account</h2>
                    <p className="text-dark-600 mb-4">
                        When you sign in with GitHub, Redstone requests the following permissions:
                    </p>
                    <ul className="space-y-3 text-dark-600 pl-6">
                        <li>• <strong className="text-dark-900">repo</strong> — Read/write access to repositories</li>
                        <li>• <strong className="text-dark-900">user:email</strong> — Read email addresses</li>
                        <li>• <strong className="text-dark-900">workflow</strong> — Manage GitHub Actions</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Features</h2>
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">Commit Changes</h3>
                            <p className="text-dark-500">Agents can commit code directly to your repository with meaningful commit messages.</p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">Create Pull Requests</h3>
                            <p className="text-dark-500">Automatically create PRs with detailed descriptions and linked issues.</p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">CI/CD Integration</h3>
                            <p className="text-dark-500">InfraAgent can create and manage GitHub Actions workflows.</p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">Issue Management</h3>
                            <p className="text-dark-500">Create issues, add labels, and link commits to issues.</p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Branch Strategy</h2>
                    <p className="text-dark-600 mb-4">
                        By default, Redstone creates feature branches for each task:
                    </p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>redstone/feature-name-timestamp</code>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/guides/rest-api" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> REST API Guide
                    </Link>
                    <div></div>
                </div>
            </main>
        </div>
    )
}
