'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import RedstoneLogo from './RedstoneLogo'
import { auth, type User } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        checkAuth()
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function checkAuth() {
        try {
            const currentUser = await auth.getCurrentUser()
            setUser(currentUser)
        } catch (error) {
            console.error('Failed to check auth:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        auth.logout()
        setUser(null)
        setIsProfileOpen(false)
        router.push('/')
        router.refresh()
    }

    return (
        <>
            <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
                <nav className="glass-pill px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-6 md:gap-8 max-w-5xl w-full mx-auto pointer-events-auto transition-all duration-300">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-redstone-600/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                            <RedstoneLogo className="relative z-10 w-[28px] h-[28px] sm:w-8 sm:h-8" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg tracking-tight text-dark-900">Redstone</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link href="/stacks" className="text-dark-600 hover:text-redstone-600 transition-colors text-sm font-medium">Stacks</Link>
                        <Link href="/elastic-swarm" className="text-dark-600 hover:text-redstone-600 transition-colors text-sm font-medium">Elastic Swarm</Link>
                        <Link href="/registry" className="text-dark-600 hover:text-redstone-600 transition-colors text-sm font-medium">Registry</Link>
                        <Link href="/docs" className="text-dark-600 hover:text-redstone-600 transition-colors text-sm font-medium">Docs</Link>
                        <Link href="/billing" className="text-dark-600 hover:text-redstone-600 transition-colors text-sm font-medium">Pricing</Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                        ) : user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                >
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.username}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-redstone-100 flex items-center justify-center text-redstone-600">
                                            <UserIcon size={16} />
                                        </div>
                                    )}
                                    <ChevronDown size={14} className={`text-dark-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up p-2">
                                        <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-semibold text-dark-900 truncate">{user.username}</p>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login" className="hidden md:flex btn-secondary !px-4 !py-2 lg:!px-5 lg:!py-2.5 !text-xs !bg-gray-50/50 hover:!bg-white">
                                Sign In
                            </Link>
                        )}

                        <Link href="/chat" className="btn-primary !px-4 !py-2 sm:!px-5 sm:!py-2.5 !text-xs shadow-lg shadow-redstone-500/20">
                            <span className="hidden sm:inline">Start Building</span>
                            <span className="sm:hidden">Build</span>
                        </Link>
                        <button
                            className="md:hidden p-2 text-dark-600 hover:text-redstone-600 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 sm:pt-32 px-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-4 sm:gap-6 text-xl sm:text-2xl font-light tracking-tight text-dark-900">
                        {user && (
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                {user.avatar_url ? (
                                    <Image
                                        src={user.avatar_url}
                                        alt={user.username}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-redstone-100 flex items-center justify-center text-redstone-600">
                                        <UserIcon size={24} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-dark-400 font-medium">Signed in as</p>
                                    <p className="font-semibold">{user.username}</p>
                                </div>
                            </div>
                        )}

                        <Link href="/stacks" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Stacks</Link>
                        <Link href="/elastic-swarm" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Elastic Swarm</Link>
                        <Link href="/registry" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Registry</Link>
                        <Link href="/docs" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Docs</Link>
                        <Link href="/billing" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                        <hr className="border-gray-200 my-2" />

                        {user ? (
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 py-2 text-left"
                            >
                                <LogOut size={20} />
                                Log out
                            </button>
                        ) : (
                            <Link href="/auth/login" className="hover:text-redstone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
