'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Layers, Zap, Shield, GitBranch, ArrowRight, Check, Plus, LucideIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import { stacks as stacksApi } from '@/lib/api'

// Icon mapping for stacks
const ICON_MAP: Record<string, LucideIcon> = {
    'architect-pro': Layers,
    'speed-demon': Zap,
    'full-stack': GitBranch,
    'security-first': Shield,
    'budget-builder': Layers,
}

interface BuiltinStack {
    name: string
    slug: string
    description: string
    config: any
    tier_required: string
}

const TIER_BADGE: Record<string, { text: string; class: string }> = {
    free: { text: 'Free', class: 'bg-green-100 text-green-700' },
    developer: { text: 'Developer', class: 'bg-blue-100 text-blue-700' },
    team: { text: 'Team', class: 'bg-purple-100 text-purple-700' },
}

export default function StacksPage() {
    const [builtinStacks, setBuiltinStacks] = useState<BuiltinStack[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStack, setSelectedStack] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStacks() {
            try {
                const data = await stacksApi.listBuiltin()
                setBuiltinStacks(data)
            } catch (error) {
                console.error('Failed to fetch builtin stacks:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStacks()
    }, [])

    return (
        <div className="min-h-screen font-sans selection:bg-redstone-500/20">
            <Navbar />

            <div className="pt-10">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                    <div className="text-center mb-10 sm:mb-16 md:mb-20 animate-fade-up">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-dark-900">Agent Stacks</h1>
                        <p className="text-dark-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed px-2">
                            Pre-configured agent combinations optimized for different development workflows.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 sm:mb-12 animate-fade-up delay-100 px-2 overflow-hidden no-scrollbar">
                        <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-dark-900 text-white rounded-full text-xs sm:text-sm font-medium shadow-lg hover:scale-105 transition-transform whitespace-nowrap">Builtin Stacks</button>
                        <button className="px-4 sm:px-6 py-2 sm:py-2.5 hover:bg-gray-100 rounded-full text-xs sm:text-sm text-dark-600 font-medium transition-colors whitespace-nowrap">My Stacks</button>
                        <button className="px-4 sm:px-6 py-2 sm:py-2.5 hover:bg-gray-100 rounded-full text-xs sm:text-sm text-dark-600 font-medium transition-colors whitespace-nowrap">Community</button>
                    </div>

                    {/* Stack Grid */}
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-8 h-8 border-4 border-redstone-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
                            {builtinStacks.map((stack: BuiltinStack, i: number) => {
                                const badge = TIER_BADGE[stack.tier_required] || TIER_BADGE.free
                                const IconComponent = ICON_MAP[stack.slug] || Layers
                                const agents = stack.config?.agents ? Object.keys(stack.config.agents) : []
                                const models = agents.length > 0
                                    ? Array.from(new Set(Object.values(stack.config.agents).map((a: any) => a.model?.split('/')[1] || a.model)))
                                    : []
                                return (
                                    <div
                                        key={stack.slug}
                                        className={`card group cursor-pointer border-2 transition-all duration-300 ${selectedStack === stack.slug ? 'border-redstone-500 ring-4 ring-redstone-500/10' : 'border-transparent hover:border-gray-200'} animate-fade-up`}
                                        style={{ animationDelay: `${i * 100}ms` }}
                                        onClick={() => setSelectedStack(selectedStack === stack.slug ? null : stack.slug)}
                                    >
                                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100`}>
                                                    <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-redstone-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg sm:text-xl text-dark-900">{stack.name}</h3>
                                                    <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-semibold uppercase tracking-wide mt-1 inline-block ${badge.class}`}>{badge.text}</span>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedStack === stack.slug ? 'bg-redstone-600 border-redstone-600' : 'border-gray-200 group-hover:border-redstone-300'}`}>
                                                {selectedStack === stack.slug && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                                            </div>
                                        </div>

                                        <p className="text-dark-500 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{stack.description}</p>

                                        <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-dark-600">
                                                <span className="font-medium text-dark-400">Models:</span>
                                                <span className="truncate">{models.join(', ') || 'Default'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-dark-600">
                                                <span className="font-medium text-dark-400">Agents:</span>
                                                <span>{agents.length} agents swarming</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Selected Stack Actions */}
                    <div className={`fixed bottom-4 sm:bottom-8 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:left-auto sm:right-auto transition-all duration-500 z-50 ${selectedStack ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-full p-2 sm:p-2 sm:pl-6 flex items-center justify-between sm:justify-start gap-3 sm:gap-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]">
                            <span className="text-dark-600 font-medium text-xs sm:text-base hidden sm:block">Ready to deploy?</span>
                            <Link href={`/chat?stack=${selectedStack}`} className="btn-primary py-2.5 sm:py-3 px-5 sm:px-8 text-xs sm:text-sm inline-flex items-center whitespace-nowrap shadow-xl shadow-redstone-600/30 flex-1 sm:flex-none justify-center">
                                Use Stack
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Create Custom */}
                    <div className="text-center pt-4 sm:pt-8">
                        <Link href="/elastic-swarm" className="inline-flex items-center gap-2 text-dark-500 hover:text-redstone-600 font-medium transition-colors text-sm sm:text-base">
                            <Plus className="w-4 h-4" />
                            Create Custom Stack
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    )
}
