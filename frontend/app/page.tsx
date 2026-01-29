'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Zap, GitBranch, Layers, Terminal, ArrowRight, Sparkles, Shield, Users } from 'lucide-react'
import Navbar from './components/Navbar'
import RedstoneLogo from './components/RedstoneLogo'

export default function Home() {
    const [hoveredStack, setHoveredStack] = useState<string | null>(null)

    const stacks = [
        { id: 'architect-pro', name: 'Architect Pro', desc: 'System design & large codebases', icon: Layers, color: 'text-purple-400' },
        { id: 'speed-demon', name: 'Speed Demon', desc: 'Fast iteration & prototyping', icon: Zap, color: 'text-yellow-400' },
        { id: 'full-stack', name: 'Full Stack', desc: 'Balanced production apps', icon: GitBranch, color: 'text-blue-400' },
        { id: 'security-first', name: 'Security First', desc: 'Security-focused development', icon: Shield, color: 'text-redstone-500' },
    ]

    return (
        <main className="min-h-screen font-sans selection:bg-redstone-500/30">
            <Navbar />

            {/* Hero */}
            <section className="pt-28 sm:pt-36 md:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6 sm:mb-8 md:mb-12 animate-float">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-redstone-500" />
                        <span className="text-xs sm:text-sm text-redstone-700 tracking-wide font-medium">Multi-Agent Development Platform</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-[0.95] sm:leading-[0.9] text-dark-900">
                        Build with<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-redstone-600 to-red-500 animate-fade-up inline-block pr-1 pb-2">Intelligence</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-dark-500 max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 leading-relaxed font-light px-2">
                        Orchestrate AI agents to architect, implement, review, and deploy your software stack.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full px-4 sm:px-0">
                        <Link href="/chat" className="btn-primary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5">
                            Launch Redstone
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <Link href="/docs" className="btn-secondary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5">
                            Documentation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stacks Preview */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight text-dark-900">Choose Your Stack</h2>
                            <p className="text-dark-500 text-sm sm:text-base md:text-lg max-w-md">Pre-configured agent combinations optimized for high-velocity environments.</p>
                        </div>
                        <Link href="/stacks" className="text-dark-900 hover:text-redstone-600 inline-flex items-center gap-2 transition-colors font-medium text-sm sm:text-base">
                            View all stacks <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stacks.map((stack) => (
                            <div
                                key={stack.id}
                                className="card group cursor-pointer h-full flex flex-col justify-between"
                                onMouseEnter={() => setHoveredStack(stack.id)}
                                onMouseLeave={() => setHoveredStack(null)}
                            >
                                <div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                                        <stack.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${stack.color}`} />
                                    </div>
                                    <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 tracking-tight text-dark-900">{stack.name}</h3>
                                    <p className="text-dark-500 leading-relaxed text-xs sm:text-sm font-light">{stack.desc}</p>
                                </div>
                                <div className="mt-4 sm:mt-6 md:mt-8 flex items-center text-xs sm:text-sm font-medium text-dark-300 group-hover:text-redstone-600 transition-colors">
                                    Configured <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-redstone-50 flex items-center justify-center mb-4 sm:mb-6">
                                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-redstone-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 tracking-tight text-dark-900">Chat or CLI</h3>
                            <p className="text-dark-500 leading-relaxed text-sm sm:text-base">
                                Interact via web chat or install the SDK for terminal access. Full parity between interfaces.
                            </p>
                        </div>

                        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 sm:mb-6">
                                <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 tracking-tight text-dark-900">GitHub Native</h3>
                            <p className="text-dark-500 leading-relaxed text-sm sm:text-base">
                                Connect repos for direct commits, PR reviews, and issue tracking directly from the agent.
                            </p>
                        </div>

                        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all sm:col-span-2 md:col-span-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4 sm:mb-6">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 tracking-tight text-dark-900">Community Registry</h3>
                            <p className="text-dark-500 leading-relaxed text-sm sm:text-base">
                                Share and discover stacks. Remix existing configurations to build your perfect workflow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <RedstoneLogo className="opacity-80 w-[28px] h-[28px]" />
                        <span className="text-dark-400 text-xs sm:text-sm font-medium">© 2026 Redstone Inc.</span>
                    </div>
                    <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-dark-500 text-xs sm:text-sm font-medium">
                        <Link href="/docs" className="hover:text-redstone-600 transition-colors">Documentation</Link>
                        <Link href="/billing" className="hover:text-redstone-600 transition-colors">Pricing</Link>
                        <Link href="/privacy" className="hover:text-redstone-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-redstone-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
