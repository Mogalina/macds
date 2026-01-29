'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { Search, Download, ArrowRight, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import RedstoneLogo from '../components/RedstoneLogo'
import { registry } from '@/lib/api'

interface RegistryStack {
    id: number
    name: string
    slug: string
    description: string
    downloads: number
    owner: string
}

export default function RegistryPage() {
    const [stacks, setStacks] = useState<RegistryStack[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'downloads' | 'recent'>('downloads')

    useEffect(() => {
        async function fetchStacks() {
            setLoading(true)
            try {
                const data = await registry.listStacks(searchQuery, sortBy)
                setStacks(data)
            } catch (error) {
                console.error('Failed to fetch registry stacks:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStacks()
    }, [searchQuery, sortBy])

    const filteredStacks = useMemo(() => {
        // Server already filters, but we can do client-side filtering for instant feedback
        const query = searchQuery.toLowerCase().trim()
        if (!query) return stacks
        return stacks.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query) ||
            s.owner?.toLowerCase().includes(query)
        )
    }, [stacks, searchQuery])

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-redstone-500/20">
            <Navbar />

            <div className="pt-10">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32 animate-fade-up">
                    <div className="text-center mb-10 sm:mb-16 md:mb-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-dark-900">Community Registry</h1>
                        <p className="text-dark-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed px-2">
                            Discover and use stacks shared by other developers.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-4xl mx-auto">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-redstone-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search stacks by name, description, or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-full text-dark-900 placeholder-dark-400 focus:outline-none focus:border-redstone-200 focus:bg-white transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'downloads' | 'recent')}
                                className="h-full px-8 py-4 bg-white border-2 border-gray-100 rounded-full text-dark-700 font-medium focus:outline-none focus:border-redstone-200 cursor-pointer hover:border-gray-200 appearance-none pr-12"
                            >
                                <option value="downloads">Most Downloads</option>
                                <option value="recent">Most Recent</option>
                            </select>
                            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-8 h-8 border-4 border-redstone-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredStacks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredStacks.map((stack, i) => (
                                <div key={stack.id} className="card group hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-bold text-xl text-dark-900 group-hover:text-redstone-600 transition-colors">{stack.name}</h3>
                                        <div className="flex items-center gap-1 text-xs font-semibold bg-gray-50 text-dark-600 px-2.5 py-1 rounded-full border border-gray-100">
                                            <Download className="w-3 h-3" />
                                            {stack.downloads.toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-dark-500 text-sm mb-6 leading-relaxed line-clamp-2">{stack.description}</p>

                                    <div className="flex items-center justify-between text-sm mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-redstone-100 to-orange-100 flex items-center justify-center text-[10px] font-bold text-redstone-700">
                                                {stack.owner[0].toUpperCase()}
                                            </div>
                                            <span className="text-dark-400 font-medium">@{stack.owner}</span>
                                        </div>
                                        <Link
                                            href={`/chat?stack=${stack.slug}`}
                                            className="text-redstone-600 hover:text-redstone-700 font-semibold flex items-center gap-1 text-sm bg-redstone-50 px-3 py-1.5 rounded-full group-hover:bg-redstone-100 transition-colors"
                                        >
                                            Use
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Search className="w-8 h-8 text-dark-300" />
                            </div>
                            <p className="text-dark-900 font-medium mb-2">No stacks found matching "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-redstone-600 hover:text-redstone-700 text-sm font-semibold hover:underline"
                            >
                                Clear search and browse all
                            </button>
                        </div>
                    )}
                </main>

                <footer className="border-t border-gray-100 py-20 px-6 mt-12 bg-gray-50/50">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <RedstoneLogo className="opacity-80 w-[24px] h-[24px]" />
                            <span className="text-dark-500 font-medium text-sm">© 2026 Redstone Inc.</span>
                        </div>
                        <div className="flex items-center gap-8 text-dark-500 text-sm font-medium">
                            <Link href="/docs" className="hover:text-redstone-600 transition-colors">Docs</Link>
                            <Link href="/billing" className="hover:text-redstone-600 transition-colors">Pricing</Link>
                            <Link href="/privacy" className="hover:text-redstone-600 transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-redstone-600 transition-colors">Terms</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
