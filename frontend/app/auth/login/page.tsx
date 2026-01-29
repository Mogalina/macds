'use client'

import Link from 'next/link'
import { GitBranch, Shield, Zap, ArrowRight } from 'lucide-react'
import RedstoneLogo from '../../components/RedstoneLogo'

export default function LoginPage() {
    const handleGitHubLogin = () => {
        window.location.href = 'http://localhost:8000/auth/login'
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md animate-fade-up">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <RedstoneLogo className="w-[40px] h-[40px]" />
                        <span className="font-bold text-xl text-dark-900">Redstone</span>
                    </Link>

                    <h1 className="text-4xl font-bold mb-3 text-dark-900 tracking-tight">Welcome back</h1>
                    <p className="text-dark-500 mb-10 text-lg font-light">
                        Sign in to access your stacks, workflows, and chat history.
                    </p>

                    <button
                        onClick={handleGitHubLogin}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-dark-900 text-white rounded-full font-semibold hover:bg-dark-800 hover:scale-[1.02] transition-all shadow-lg shadow-dark-900/20"
                    >
                        <GitBranch className="w-5 h-5" />
                        Continue with GitHub
                    </button>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-dark-400 font-medium">or</span>
                        </div>
                    </div>

                    <Link
                        href="/chat"
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-full font-medium text-dark-700 hover:bg-gray-100 hover:border-gray-200 transition-all"
                    >
                        Continue without account
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <p className="text-dark-400 text-sm text-center mt-10">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-redstone-600 hover:underline font-medium">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-redstone-600 hover:underline font-medium">Privacy Policy</Link>
                    </p>
                </div>
            </div>

            {/* Right - Features */}
            <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-12 border-l border-gray-100">
                <div className="max-w-md animate-fade-up delay-200">
                    <h2 className="text-2xl font-bold mb-10 text-dark-900 tracking-tight">Why sign in with GitHub?</h2>

                    <div className="space-y-8">
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-redstone-50 border border-redstone-100 flex items-center justify-center shrink-0">
                                <GitBranch className="w-6 h-6 text-redstone-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 text-dark-900">Repository Access</h3>
                                <p className="text-dark-500 text-sm leading-relaxed">Push commits, create PRs, and manage issues directly from Redstone.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 text-dark-900">Persistent Sessions</h3>
                                <p className="text-dark-500 text-sm leading-relaxed">Your chat history, custom stacks, and workflows are saved and synced.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 text-dark-900">Secure & Private</h3>
                                <p className="text-dark-500 text-sm leading-relaxed">We only request the permissions we need. Your code stays yours.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
