import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function ContractsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Contracts</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Contracts are typed schemas that define how agents communicate. They ensure structured, predictable outputs instead of free-form text.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Why Contracts?</h2>
                    <ul className="space-y-4 text-dark-600">
                        <li className="flex items-start gap-4">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span><strong className="text-dark-900">Type Safety:</strong> Catch errors before they propagate through the workflow</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span><strong className="text-dark-900">Predictability:</strong> Know exactly what each agent will output</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span><strong className="text-dark-900">Debugging:</strong> Trace issues to specific contract violations</span>
                        </li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Example Contract</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <pre>{`interface ArchitectureDecision {
  component: string;
  pattern: "microservice" | "monolith" | "serverless";
  dependencies: string[];
  invariants: string[];
  rationale: string;
}`}</pre>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Built-in Contracts</h2>
                    <p className="text-dark-600 mb-4">Redstone includes contracts for common patterns:</p>
                    <ul className="space-y-2 text-dark-600 pl-6">
                        <li>• RequirementsSpec</li>
                        <li>• ArchitectureDecision</li>
                        <li>• CodeChange</li>
                        <li>• TestResult</li>
                        <li>• ReviewFeedback</li>
                    </ul>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/workflows" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Workflows
                    </Link>
                    <Link href="/docs/cli" className="btn-primary">
                        CLI Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
