'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Book, Layers, GitBranch, Terminal, Zap, Users, FileText, ArrowRight } from 'lucide-react'
import RedstoneLogo from '../components/RedstoneLogo'

const DOCS_SECTIONS = [
    {
        title: 'Getting Started',
        icon: Zap,
        items: [
            { title: 'Introduction', href: '/docs/introduction' },
            { title: 'Quick Start', href: '/docs/quick-start' },
            { title: 'Installation', href: '/docs/installation' },
        ]
    },
    {
        title: 'Core Concepts',
        icon: Layers,
        items: [
            { title: 'Agents', href: '/docs/agents' },
            { title: 'Stacks', href: '/docs/stacks' },
            { title: 'Workflows', href: '/docs/workflows' },
            { title: 'Contracts', href: '/docs/contracts' },
        ]
    },
    {
        title: 'Elastic Swarm',
        icon: Users,
        items: [
            { title: 'Overview', href: '/docs/elastic-swarm' },
            { title: 'Creating Workflows', href: '/docs/elastic-swarm/workflows' },
            { title: 'YAML Configuration', href: '/docs/elastic-swarm/yaml' },
        ]
    },
    {
        title: 'Guides',
        icon: Book,
        items: [
            { title: 'Building a REST API', href: '/docs/guides/rest-api' },
            { title: 'Creating Custom Stacks', href: '/docs/guides/custom-stacks' },
            { title: 'GitHub Integration', href: '/docs/guides/github' },
        ]
    },
    {
        title: 'CLI Reference',
        icon: Terminal,
        items: [
            { title: 'Installation', href: '/docs/cli/install' },
            { title: 'Commands', href: '/docs/cli/commands' },
            { title: 'Configuration', href: '/docs/cli/config' },
        ]
    },
    {
        title: 'API Reference',
        icon: FileText,
        items: [
            { title: 'Authentication', href: '/docs/api/auth' },
            { title: 'Agents', href: '/docs/api/agents' },
            { title: 'Workspaces', href: '/docs/api/workspaces' },
            { title: 'Stacks', href: '/docs/api/stacks' },
            { title: 'Registry', href: '/docs/api/registry' },
        ]
    },
    {
        title: 'SDK',
        icon: GitBranch,
        items: [
            { title: 'TypeScript / JavaScript', href: '/docs/sdk' },
            { title: 'Python', href: '/docs/sdk#python' },
            { title: 'WebSocket Streaming', href: '/docs/sdk#streaming' },
        ]
    },
]

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32 animate-fade-up">
                <div className="text-center mb-10 sm:mb-16 md:mb-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight">Documentation</h1>
                    <p className="text-dark-500 text-base sm:text-lg md:text-xl max-w-xl mx-auto font-light px-2">
                        Learn how to build with Redstone's multi-agent development platform
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
                    <Link href="/docs/quick-start" className="card group">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-redstone-50 border border-redstone-100 flex items-center justify-center group-hover:bg-redstone-100 transition-colors">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-redstone-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-dark-900">Quick Start</h3>
                        </div>
                        <p className="text-dark-500 text-xs sm:text-sm leading-relaxed">Get up and running in 5 minutes</p>
                    </Link>

                    <Link href="/docs/agents" className="card group">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-dark-900">Understanding Agents</h3>
                        </div>
                        <p className="text-dark-500 text-xs sm:text-sm leading-relaxed">Learn about the 7 specialized agents</p>
                    </Link>

                    <Link href="/docs/cli/commands" className="card group sm:col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-dark-900">CLI Reference</h3>
                        </div>
                        <p className="text-dark-500 text-xs sm:text-sm leading-relaxed">Command-line interface documentation</p>
                    </Link>
                </div>

                {/* All Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
                    {DOCS_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-redstone-50 flex items-center justify-center">
                                    <section.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-redstone-600" />
                                </div>
                                <h2 className="font-bold text-dark-900 text-sm sm:text-base">{section.title}</h2>
                            </div>
                            <ul className="space-y-2 sm:space-y-3">
                                {section.items.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-dark-500 hover:text-redstone-600 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 py-1 group"
                                        >
                                            <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t border-gray-100 py-10 sm:py-16 md:py-20 px-4 sm:px-6 mt-8 sm:mt-12 bg-gray-50/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <RedstoneLogo className="opacity-80 w-[22px] h-[22px]" />
                        <span className="text-dark-500 font-medium text-xs sm:text-sm">© 2026 Redstone Inc.</span>
                    </div>
                    <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-dark-500 text-xs sm:text-sm font-medium">
                        <Link href="/docs" className="hover:text-redstone-600 transition-colors">Docs</Link>
                        <Link href="/billing" className="hover:text-redstone-600 transition-colors">Pricing</Link>
                        <Link href="/privacy" className="hover:text-redstone-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-redstone-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
