'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAuthToken } from '@/lib/api'

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const token = searchParams.get('token')
        const error = searchParams.get('error')

        if (error) {
            console.error('Auth error:', error)
            router.push('/login?error=' + encodeURIComponent(error))
            return
        }

        if (token) {
            setAuthToken(token)
            // Redirect to chat or previous page
            const returnUrl = localStorage.getItem('auth_return_url') || '/chat'
            localStorage.removeItem('auth_return_url')
            router.push(returnUrl)
        } else {
            router.push('/login?error=no_token')
        }
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-redstone-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-dark-600">Completing login...</p>
            </div>
        </div>
    )
}
