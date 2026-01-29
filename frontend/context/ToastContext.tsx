'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type: ToastType, duration?: number) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, message, type, duration }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    // Listen for custom events from non-React code (like api.ts)
    useEffect(() => {
        const handleApiError = (event: Event) => {
            const customEvent = event as CustomEvent
            addToast(customEvent.detail.message, 'error', 5000)
        }

        const handleApiSuccess = (event: Event) => {
            const customEvent = event as CustomEvent
            addToast(customEvent.detail.message, 'success', 3000)
        }

        window.addEventListener('redstone-error', handleApiError)
        window.addEventListener('redstone-success', handleApiSuccess)

        return () => {
            window.removeEventListener('redstone-error', handleApiError)
            window.removeEventListener('redstone-success', handleApiSuccess)
        }
    }, [addToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-fade-up min-w-[300px] max-w-md
                            ${toast.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-900' : ''}
                            ${toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-900' : ''}
                            ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-200 text-blue-900' : ''}
                            ${toast.type === 'warning' ? 'bg-yellow-50/90 border-yellow-200 text-yellow-900' : ''}
                        `}
                    >
                        <div className="shrink-0">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                        </div>
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
