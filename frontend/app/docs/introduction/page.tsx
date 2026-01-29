import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, GitBranch, Terminal } from 'lucide-react'


export default function IntroductionPage() {
    return (
        <div className="min-h-screen bg-white">


            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-dark-900 tracking-tight">Introduction to Redstone</h1>

                <p className="text-dark-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                    Redstone is a multi-agent development platform that orchestrates specialized AI agents to help you build software faster. Instead of a single AI assistant, Redstone uses a team of 7 agents, each with specific roles and authority levels.
                </p>

                <div className="card mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-dark-900">What Makes Redstone Different?</h2>
                    <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-dark-600">
                        <li className="flex gap-2 sm:gap-3 md:gap-4">
                            <span className="text-redstone-600 font-bold text-base sm:text-lg shrink-0">1.</span>
                            <div className="text-sm sm:text-base">
                                <strong className="text-dark-900">Hierarchical Agents</strong> — 7 specialized agents with authority levels from 10 (Architect) to 5 (Implementation). Higher authority agents can override lower ones.
                            </div>
                        </li>
                        <li className="flex gap-2 sm:gap-3 md:gap-4">
                            <span className="text-redstone-600 font-bold text-base sm:text-lg shrink-0">2.</span>
                            <div className="text-sm sm:text-base">
                                <strong className="text-dark-900">Contract-Driven</strong> — All agent communication uses typed contracts. No unstructured outputs that cause confusion.
                            </div>
                        </li>
                        <li className="flex gap-2 sm:gap-3 md:gap-4">
                            <span className="text-redstone-600 font-bold text-base sm:text-lg shrink-0">3.</span>
                            <div className="text-sm sm:text-base">
                                <strong className="text-dark-900">Execution Grounded</strong> — Agents run real builds and tests, not just generate code. Feedback loops until it actually works.
                            </div>
                        </li>
                        <li className="flex gap-2 sm:gap-3 md:gap-4">
                            <span className="text-redstone-600 font-bold text-base sm:text-lg shrink-0">4.</span>
                            <div className="text-sm sm:text-base">
                                <strong className="text-dark-900">Configurable Stacks</strong> — Choose which LLMs power each agent. Optimize for speed, cost, or quality.
                            </div>
                        </li>
                    </ul>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-dark-900">The Agent Hierarchy</h2>
                <div className="overflow-x-auto mb-8 sm:mb-10 md:mb-12 rounded-xl sm:rounded-2xl border border-gray-100 -mx-4 sm:mx-0">
                    <table className="w-full text-xs sm:text-sm min-w-[500px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-dark-500 font-semibold">Agent</th>
                                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-dark-500 font-semibold">Authority</th>
                                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-dark-500 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody className="text-dark-600">
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">ArchitectAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">10</td><td className="py-3 sm:py-4 px-4 sm:px-6">System design, invariants, component boundaries</td></tr>
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">ProductAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">9</td><td className="py-3 sm:py-4 px-4 sm:px-6">Requirements, user stories, acceptance criteria</td></tr>
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">BuildTestAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">8</td><td className="py-3 sm:py-4 px-4 sm:px-6">Build execution, test running, coverage</td></tr>
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">IntegratorAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">8</td><td className="py-3 sm:py-4 px-4 sm:px-6">Merge changes, resolve conflicts</td></tr>
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">ReviewerAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">7</td><td className="py-3 sm:py-4 px-4 sm:px-6">Code review, standards enforcement</td></tr>
                            <tr className="border-b border-gray-50"><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">InfraAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">6</td><td className="py-3 sm:py-4 px-4 sm:px-6">CI/CD, infrastructure, deployment</td></tr>
                            <tr><td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-dark-900">ImplementationAgent</td><td className="py-3 sm:py-4 px-4 sm:px-6 text-redstone-600 font-bold">5</td><td className="py-3 sm:py-4 px-4 sm:px-6">Write code following specs</td></tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-dark-900">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                    <div className="card">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-redstone-50 flex items-center justify-center mb-3 sm:mb-4">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-redstone-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-1.5 sm:mb-2 text-sm sm:text-base">1. You Describe</h3>
                        <p className="text-dark-500 text-xs sm:text-sm">Tell Redstone what you want to build in natural language</p>
                    </div>
                    <div className="card">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center mb-3 sm:mb-4">
                            <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-1.5 sm:mb-2 text-sm sm:text-base">2. Agents Collaborate</h3>
                        <p className="text-dark-500 text-xs sm:text-sm">Agents work together following the workflow DAG</p>
                    </div>
                    <div className="card sm:col-span-2 md:col-span-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 flex items-center justify-center mb-3 sm:mb-4">
                            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-dark-900 mb-1.5 sm:mb-2 text-sm sm:text-base">3. Code Ships</h3>
                        <p className="text-dark-500 text-xs sm:text-sm">Tested, reviewed code ready for production</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-t border-gray-100">
                    <div></div>
                    <Link href="/docs/quick-start" className="btn-primary w-full sm:w-auto justify-center">
                        Quick Start <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
