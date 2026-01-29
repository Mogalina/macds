import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function StacksDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Stacks</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Stacks are pre-configured combinations of LLM providers that power your agents. Choose a stack based on your priorities: speed, cost, or quality.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Available Stacks</h2>
                    <div className="space-y-6">
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark-900">Speed Demon</h3>
                                <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-bold">Free Tier</span>
                            </div>
                            <p className="text-dark-600 mb-4">Optimized for fast responses. Uses GPT-4o-mini and Claude 3 Haiku.</p>
                            <div className="text-sm text-dark-500">
                                <strong className="text-dark-700">Best for:</strong> Quick prototypes, simple tasks, learning
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark-900">Architect Pro</h3>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">Developer Tier</span>
                            </div>
                            <p className="text-dark-600 mb-4">Balanced performance. GPT-4o for coding, Claude 3.5 Sonnet for reasoning.</p>
                            <div className="text-sm text-dark-500">
                                <strong className="text-dark-700">Best for:</strong> Production apps, complex features, startups
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark-900">Full Stack Elite</h3>
                                <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-bold">Team Tier</span>
                            </div>
                            <p className="text-dark-600 mb-4">Maximum quality. Claude 3.5 Opus + GPT-4 Turbo with extended context.</p>
                            <div className="text-sm text-dark-500">
                                <strong className="text-dark-700">Best for:</strong> Enterprise apps, complex architectures, mission-critical systems
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Custom Stacks</h2>
                    <p className="text-dark-600 mb-4">
                        Team tier users can create custom stacks with any combination of supported models. Configure which model powers each agent.
                    </p>
                    <Link href="/docs/guides/custom-stacks" className="text-redstone-600 hover:underline font-medium">
                        Learn how to create custom stacks →
                    </Link>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/agents" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Agents
                    </Link>
                    <Link href="/docs/workflows" className="btn-primary">
                        Workflows <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
