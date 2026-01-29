import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Redstone - Multi-Agent Development Platform',
    description: 'Build software with AI agents. Configure stacks, define workflows, ship faster.',
}

import { ToastProvider } from '@/context/ToastContext'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-white text-dark-900 antialiased relative">
                <ToastProvider>
                    <div className="redstone-bg" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </ToastProvider>
            </body>
        </html>
    )
}
