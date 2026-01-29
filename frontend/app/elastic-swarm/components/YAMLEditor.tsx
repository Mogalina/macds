'use client'

import { useState } from 'react'
import { X, Copy, Download, Upload, Check, AlertCircle } from 'lucide-react'

interface YAMLEditorProps {
    yaml: string
    onClose: () => void
    onImport: (config: any) => void
}

export default function YAMLEditor({ yaml, onClose, onImport }: YAMLEditorProps) {
    const [content, setContent] = useState(yaml)
    const [mode, setMode] = useState<'view' | 'edit'>('view')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/yaml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'elastic-swarm-workflow.yaml'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = () => {
        try {
            // Parse YAML/JSON content
            const config = JSON.parse(content)
            onImport(config)
            setError(null)
        } catch (e) {
            setError('Invalid configuration format. Please check your YAML/JSON.')
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target?.result as string
                setContent(text)
                setMode('edit')
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl m-4 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-dark-900">Workflow Configuration</h2>
                        <p className="text-sm text-dark-500">View or edit as YAML</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button
                                onClick={() => setMode('view')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'view' ? 'bg-white shadow text-dark-900' : 'text-dark-500'}`}
                            >
                                View
                            </button>
                            <button
                                onClick={() => setMode('edit')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'edit' ? 'bg-white shadow text-dark-900' : 'text-dark-500'}`}
                            >
                                Edit
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-4">
                    <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-auto">
                        {mode === 'view' ? (
                            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                                {content}
                            </pre>
                        ) : (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full bg-transparent text-sm text-gray-100 font-mono resize-none focus:outline-none"
                                spellCheck={false}
                            />
                        )}
                    </div>

                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label className="px-3 py-2 text-sm text-dark-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Import File
                            <input
                                type="file"
                                accept=".yaml,.yml,.json"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="px-3 py-2 text-sm text-dark-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-2 text-sm text-dark-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        {mode === 'edit' && (
                            <button
                                onClick={handleImport}
                                className="px-4 py-2 text-sm bg-redstone-600 text-white rounded-lg hover:bg-redstone-700 transition-colors"
                            >
                                Apply Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
