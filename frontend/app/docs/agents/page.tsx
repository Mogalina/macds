import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function AgentsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight">Agents</h1>
                <p className="text-dark-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                    Redstone uses 7 specialized agents, each with distinct responsibilities and authority levels. Agents communicate through typed contracts and can escalate conflicts to higher-authority agents.
                </p>

                <section className="mb-10 sm:mb-12 md:mb-16">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-dark-900">Agent Overview</h2>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Architect Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-redstone-50 text-redstone-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 10</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">The highest authority agent. Defines system architecture, component boundaries, and enforces invariants.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Define module structure and dependencies</li>
                                    <li>• Establish architectural invariants</li>
                                    <li>• Review and validate major design decisions</li>
                                    <li>• Resolve conflicts between lower-authority agents</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Product Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 9</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">Translates user requirements into actionable specifications and acceptance criteria.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Parse and clarify user requests</li>
                                    <li>• Generate user stories and acceptance criteria</li>
                                    <li>• Prioritize features and scope changes</li>
                                    <li>• Validate deliverables match requirements</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Build Test Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 8</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">Executes builds and runs tests. Provides execution-grounded feedback.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Run build commands (npm, pip, cargo, etc.)</li>
                                    <li>• Execute test suites (pytest, jest, etc.)</li>
                                    <li>• Report build/test failures with context</li>
                                    <li>• Track code coverage metrics</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Integrator Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 8</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">Merges changes from multiple sources and resolves conflicts.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Merge code changes from concurrent work</li>
                                    <li>• Resolve merge conflicts intelligently</li>
                                    <li>• Ensure consistency across modules</li>
                                    <li>• Coordinate multi-agent outputs</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Reviewer Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 7</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">Reviews code for quality, security, and adherence to standards.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Code review for style and best practices</li>
                                    <li>• Security vulnerability detection</li>
                                    <li>• Performance issue identification</li>
                                    <li>• Documentation completeness checks</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Infra Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 6</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">Handles CI/CD configuration, infrastructure, and deployment.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Generate CI/CD pipelines (GitHub Actions, etc.)</li>
                                    <li>• Configure infrastructure as code</li>
                                    <li>• Manage environment variables and secrets</li>
                                    <li>• Handle deployment strategies</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-dark-900">Implementation Agent</h3>
                                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-bold w-fit">Authority: 5</span>
                            </div>
                            <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">The workhorse. Writes actual code following specifications from higher agents.</p>
                            <div className="text-xs sm:text-sm text-dark-500">
                                <strong className="text-dark-700">Responsibilities:</strong>
                                <ul className="mt-2 space-y-1 sm:space-y-1.5 pl-4">
                                    <li>• Implement features according to specs</li>
                                    <li>• Write unit and integration tests</li>
                                    <li>• Fix bugs based on test feedback</li>
                                    <li>• Refactor code when requested</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-dark-900">Authority & Conflict Resolution</h2>
                    <p className="text-dark-600 mb-3 sm:mb-4 text-sm sm:text-base">When agents disagree:</p>
                    <ol className="space-y-2 sm:space-y-3 text-dark-600 list-decimal list-inside pl-3 sm:pl-4 text-sm sm:text-base">
                        <li>Lower-authority agent must defer to higher-authority decisions</li>
                        <li>Equal-authority conflicts escalate to next higher agent</li>
                        <li>ArchitectAgent decisions are final</li>
                        <li>All conflicts are logged for human review</li>
                    </ol>
                </section>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-t border-gray-100">
                    <Link href="/docs/installation" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors text-sm sm:text-base">
                        <ArrowLeft className="w-4 h-4" /> Installation
                    </Link>
                    <Link href="/docs/stacks" className="btn-primary w-full sm:w-auto justify-center">
                        Stacks <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
