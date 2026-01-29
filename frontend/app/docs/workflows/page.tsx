import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function WorkflowsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Workflows</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Workflows define the order in which agents execute and how they communicate. Redstone uses DAG-based workflows for deterministic, reproducible builds.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Default Workflow</h2>
                    <p className="text-dark-600 mb-6">The standard workflow follows this execution order:</p>
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <ol className="space-y-4 text-dark-600">
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">1</span>
                                <span><strong className="text-dark-900">ProductAgent</strong> — Parses requirements</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">2</span>
                                <span><strong className="text-dark-900">ArchitectAgent</strong> — Designs solution</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">3</span>
                                <span><strong className="text-dark-900">ImplementationAgent</strong> — Writes code</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">4</span>
                                <span><strong className="text-dark-900">BuildTestAgent</strong> — Validates code</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">5</span>
                                <span><strong className="text-dark-900">ReviewerAgent</strong> — Reviews quality</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-redstone-100 text-redstone-600 flex items-center justify-center font-bold text-sm">6</span>
                                <span><strong className="text-dark-900">IntegratorAgent</strong> — Merges changes</span>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Feedback Loops</h2>
                    <p className="text-dark-600 mb-4">
                        When BuildTestAgent or ReviewerAgent finds issues, the workflow loops back to ImplementationAgent for fixes. This continues until all tests pass and quality checks succeed.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Custom Workflows</h2>
                    <p className="text-dark-600 mb-4">
                        Define custom workflows in your <code className="bg-gray-100 px-2 py-1 rounded text-dark-700">redstone.yaml</code> file to skip agents or add parallel execution.
                    </p>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/stacks" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Stacks
                    </Link>
                    <Link href="/docs/contracts" className="btn-primary">
                        Contracts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
