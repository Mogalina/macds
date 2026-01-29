'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            localStorage.setItem('redstone_token', token)
            router.push('/chat')
        } else {
            router.push('/auth/login')
        }
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-redstone-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-dark-500">Logging you in...</p>
            </div>
        </div>
    )
}
