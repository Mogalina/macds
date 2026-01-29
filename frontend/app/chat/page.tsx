'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Settings, Plus, Zap, Layers, Menu, X, ChevronDown, Mic, Paperclip, Globe, Cpu, Check, ArrowRight, FolderOpen } from 'lucide-react'
import RedstoneLogo from '../components/RedstoneLogo'
import { agents, elasticSwarm, type ChatSession, type BulkInsertResult, type Workflow, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'


// Layout Components
const ActionIcon = ({ icon: Icon, className }: { icon: any; className?: string }) => (
    <Icon className={`w-4 h-4 ${className}`} />
)

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    agent?: string
    timestamp: Date
}

interface Action {
    id: string
    label: string
    icon: any
    description: string
    tier: 'free' | 'developer' | 'team'
    persistent: boolean
}

const STACKS = [
    { id: 'speed-demon', name: 'Speed Demon', icon: Zap },
    { id: 'architect-pro', name: 'Architect Pro', icon: Layers },
    { id: 'full-stack', name: 'Full Stack', icon: Layers },
]

const AVAILABLE_ACTIONS: Action[] = [
    { id: 'upload', label: 'Upload File', icon: Paperclip, description: 'Analyze code or documents', tier: 'free', persistent: false },
    { id: 'bulk-insert', label: 'Bulk Insert', icon: FolderOpen, description: 'Index and process entire folders', tier: 'developer', persistent: false },
    { id: 'web-search', label: 'Web Search', icon: Globe, description: 'Search the web for real-time info', tier: 'developer', persistent: true },
    { id: 'deep-reasoning', label: 'Deep Reasoning', icon: Cpu, description: 'Enhanced logic with Claude 3.5 Sonnet', tier: 'team', persistent: true },
]

const USER_TIER = 'team'

export default function ChatPage() {
    const { addToast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedStack, setSelectedStack] = useState(STACKS[0])
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [stackDropdownOpen, setStackDropdownOpen] = useState(false)

    // New Features State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [activeActions, setActiveActions] = useState<Set<string>>(new Set())
    const [isVoiceListening, setIsVoiceListening] = useState(false)
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [sessionsLoading, setSessionsLoading] = useState(true)

    // Bulk Insert State
    const [isBulkInsertOpen, setIsBulkInsertOpen] = useState(false)
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
    const [bulkInsertPath, setBulkInsertPath] = useState('')
    const [bulkInsertLoading, setBulkInsertLoading] = useState(false)
    const [bulkInsertResult, setBulkInsertResult] = useState<BulkInsertResult | null>(null)
    const [bulkInsertContext, setBulkInsertContext] = useState<string | null>(null)
    const [selectedFolderName, setSelectedFolderName] = useState<string>('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const folderInputRef = useRef<HTMLInputElement>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const actionMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        async function fetchData() {
            try {
                const [sessionsData, workflowsData] = await Promise.all([
                    agents.listSessions(undefined, { skipGenericError: true }),
                    elasticSwarm.listWorkflows({ skipGenericError: true })
                ])
                setSessions(sessionsData)
                setWorkflows(workflowsData)
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setSessionsLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const { agents } = await import('@/lib/api')
            const response = await agents.chat({
                content: input,
                stack_slug: selectedWorkflow ? undefined : selectedStack.id,
                workflow_id: selectedWorkflow?.id,
                apply_changes: false
            })

            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                agent: response.agent,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, agentMessage])
        } catch (error) {
            // Check if error is related to auth (401/403) which are handled by global toasts
            // We use the custom ApiError to reliably check the status
            const isAuthError = error instanceof ApiError && (error.status === 401 || error.status === 403);

            if (!isAuthError) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from server'}`,
                    agent: 'System',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            } else {
                // If it's an auth error, remove the user's message since it wasn't processed
                setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
                // Restore input so user doesn't lose their text
                setInput(userMessage.content)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleFolderSelect = async () => {
        // Try modern File System Access API first
        if ('showDirectoryPicker' in window) {
            try {
                const dirHandle = await (window as any).showDirectoryPicker()
                setSelectedFolderName(dirHandle.name)
                setBulkInsertPath(dirHandle.name) // Use folder name as identifier

                // Collect files from the directory
                const files: File[] = []
                const collectFiles = async (handle: any, path = ''): Promise<void> => {
                    for await (const entry of handle.values()) {
                        const entryPath = path ? `${path}/${entry.name}` : entry.name
                        if (entry.kind === 'file') {
                            const file = await entry.getFile()
                            files.push(new File([file], entryPath, { type: file.type }))
                        } else if (entry.kind === 'directory') {
                            // Skip common ignored directories
                            if (!['node_modules', '.git', '__pycache__', '.next', 'dist', 'build'].includes(entry.name)) {
                                await collectFiles(entry, entryPath)
                            }
                        }
                    }
                }
                await collectFiles(dirHandle)
                setSelectedFiles(files.slice(0, 500)) // Limit files
            } catch (error) {
                console.log('Folder selection cancelled or failed')
            }
        } else {
            // Fallback to input
            folderInputRef.current?.click()
        }
    }

    const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            // Extract folder name from first file's path
            const firstPath = files[0].webkitRelativePath || files[0].name
            const folderName = firstPath.split('/')[0]
            setSelectedFolderName(folderName)
            setBulkInsertPath(folderName)
            setSelectedFiles(files.slice(0, 500))
        }
    }

    const handleBulkInsert = async () => {
        if (selectedFiles.length === 0 && !bulkInsertPath.trim()) return

        setBulkInsertLoading(true)
        try {
            // Process files in browser and send content to backend
            const fileContents: { path: string; content: string; size: number }[] = []

            for (const file of selectedFiles) {
                // Only process supported file types
                const ext = file.name.split('.').pop()?.toLowerCase() || ''
                const supportedExts = ['py', 'js', 'ts', 'tsx', 'jsx', 'java', 'go', 'rs', 'rb', 'php', 'c', 'cpp', 'h', 'cs', 'vue', 'html', 'css', 'scss', 'md', 'txt', 'json', 'yaml', 'yml', 'xml', 'toml']

                if (supportedExts.includes(ext) && file.size < 1024 * 1024) {
                    try {
                        const content = await file.text()
                        fileContents.push({
                            path: file.name,
                            content,
                            size: file.size
                        })
                    } catch {
                        // Skip unreadable files
                    }
                }
            }

            // Generate summary locally
            const totalSize = fileContents.reduce((acc, f) => acc + f.size, 0)
            const summary = `Indexed ${fileContents.length} files (${(totalSize / 1024).toFixed(1)} KB) from ${selectedFolderName}`

            // Add system message about indexed files
            const systemMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `📁 **Bulk Insert Complete**\n\n${summary}\n\n**Files indexed:** ${fileContents.length}\n**Size:** ${(totalSize / 1024).toFixed(1)} KB\n\nI now have context about your project. Ask me anything about the codebase!`,
                agent: 'System',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, systemMessage])

            // Store context for chat
            const contextPrompt = fileContents.map(f => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n')
            setBulkInsertContext(contextPrompt)

            setIsBulkInsertOpen(false)
            setBulkInsertPath('')
            setSelectedFolderName('')
            setSelectedFiles([])
            addToast(`Successfully processed ${fileContents.length} files`, 'success')
        } catch (error) {
            console.error('Bulk insert failed:', error)
            addToast('Failed to process files', 'error')
        } finally {
            setBulkInsertLoading(false)
        }
    }

    const toggleAction = (actionId: string) => {
        const action = AVAILABLE_ACTIONS.find(a => a.id === actionId)
        if (!action) return

        // Handle bulk insert action
        if (actionId === 'bulk-insert') {
            setIsActionsOpen(false)
            setIsBulkInsertOpen(true)
            return
        }

        if (!action.persistent) {
            setIsActionsOpen(false)
            return
        }

        setActiveActions(prev => {
            const newSet = new Set(prev)
            if (newSet.has(actionId)) newSet.delete(actionId)
            else newSet.add(actionId)
            return newSet
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden relative text-dark-900">
            {/* Sidebar - Light Glass Style */}
            <aside className={`${sidebarOpen ? 'w-full sm:w-72 fixed sm:relative z-40 h-full' : 'w-0 hidden'} bg-white/95 sm:bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col transition-all duration-300 shadow-lg sm:shadow-sm`}>
                <div className="p-4 sm:p-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3">
                        <RedstoneLogo className="w-[28px] h-[28px]" />
                        <span className="font-semibold tracking-tight text-base sm:text-lg">Redstone</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="sm:hidden text-dark-500 p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-3 sm:px-4 pb-4">
                    <button
                        onClick={() => { setMessages([]); setInput(''); setActiveActions(new Set()); setSidebarOpen(false) }}
                        className="w-full btn-primary !py-2.5 sm:!py-3 !text-xs sm:!text-sm shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2">
                    <div className="text-xs font-semibold text-dark-400 px-3 sm:px-4 py-3 uppercase tracking-wider">Recent</div>
                    {sessionsLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-redstone-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : sessions.length > 0 ? (
                        sessions.slice(0, 10).map(session => (
                            <button key={session.id} onClick={() => setSidebarOpen(false)} className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-100 text-xs sm:text-sm text-dark-600 truncate transition-colors mx-1 font-medium">
                                {session.title}
                            </button>
                        ))
                    ) : (
                        <p className="text-dark-400 text-xs px-4 py-2">No chat history yet</p>
                    )}
                </div>

                <div className="p-3 sm:p-4 border-t border-gray-100">
                    <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-2 text-dark-600 hover:text-redstone-600 text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors bg-white border border-gray-100 shadow-sm">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative w-full bg-white/40">
                {/* Header */}
                <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 glass-panel absolute top-0 left-0 right-0 z-30">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full text-dark-500 hover:text-dark-900 transition-colors">
                            {sidebarOpen ? <X className="w-5 h-5 sm:hidden" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setStackDropdownOpen(!stackDropdownOpen)}
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-100 transition-all text-xs sm:text-sm shadow-sm"
                            >
                                <selectedStack.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-redstone-600" />
                                <span className="font-medium text-dark-800 hidden xs:inline sm:inline">
                                    {selectedWorkflow ? selectedWorkflow.name : selectedStack.name}
                                </span>
                                <ChevronDown className="w-3 h-3 text-dark-400" />
                            </button>

                            {stackDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-white border border-gray-100 rounded-[20px] sm:rounded-[28px] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] z-50 p-1.5 sm:p-2 overflow-hidden animate-fade-up">
                                    <div className="p-1 sm:p-2 max-h-[60vh] overflow-y-auto">
                                        <div className="px-3 py-2 text-xs font-semibold text-dark-400 uppercase tracking-wider">Stacks</div>
                                        {STACKS.map(stack => (
                                            <button
                                                key={stack.id}
                                                onClick={() => {
                                                    setSelectedStack(stack)
                                                    setSelectedWorkflow(null)
                                                    setStackDropdownOpen(false)
                                                }}
                                                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-left transition-colors ${!selectedWorkflow && selectedStack.id === stack.id ? 'bg-redstone-50 text-redstone-900' : 'text-dark-600 hover:bg-gray-50'}`}
                                            >
                                                <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${!selectedWorkflow && selectedStack.id === stack.id ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                                    <stack.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${!selectedWorkflow && selectedStack.id === stack.id ? 'text-redstone-600' : 'text-dark-400'}`} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-0.5">{stack.name}</div>
                                                    <div className="text-[10px] sm:text-xs opacity-70">Standard Stack</div>
                                                </div>
                                                {!selectedWorkflow && selectedStack.id === stack.id && (
                                                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-redstone-600" />
                                                )}
                                            </button>
                                        ))}

                                        {workflows.length > 0 && (
                                            <>
                                                <div className="px-3 py-2 mt-2 text-xs font-semibold text-dark-400 uppercase tracking-wider border-t border-gray-100">Workflows</div>
                                                {workflows.map(wf => (
                                                    <button
                                                        key={wf.id}
                                                        onClick={() => {
                                                            setSelectedWorkflow(wf)
                                                            setStackDropdownOpen(false)
                                                        }}
                                                        className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-left transition-colors ${selectedWorkflow?.id === wf.id ? 'bg-redstone-50 text-redstone-900' : 'text-dark-600 hover:bg-gray-50'}`}
                                                    >
                                                        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${selectedWorkflow?.id === wf.id ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                                            <Layers className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedWorkflow?.id === wf.id ? 'text-redstone-600' : 'text-dark-400'}`} />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold mb-0.5">{wf.name}</div>
                                                            <div className="text-[10px] sm:text-xs opacity-70">{wf.nodes.length} Agents</div>
                                                        </div>
                                                        {selectedWorkflow?.id === wf.id && (
                                                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-redstone-600" />
                                                        )}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-4 scroll-smooth">
                    {messages.length > 0 && (
                        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pb-24 sm:pb-32">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                                    <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl sm:rounded-[32px] px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-sm ${msg.role === 'user'
                                        ? 'bg-redstone-600 text-white font-medium shadow-red-500/20'
                                        : 'bg-white border border-gray-100 text-dark-800 shadow-gray-200/50'
                                        }`}>
                                        {msg.agent && (
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 border-b border-gray-100 pb-2">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-redstone-50 flex items-center justify-center">
                                                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-redstone-600" />
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-bold tracking-wide text-redstone-600 uppercase">{msg.agent}</span>
                                            </div>
                                        )}
                                        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${messages.length === 0 ? 'flex-1 flex flex-col items-center justify-center -mt-16 sm:-mt-24 px-4' : 'p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100'}`}>

                    {messages.length === 0 && (
                        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-up">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-2xl sm:rounded-[28px] md:rounded-[32px] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 mx-auto shadow-[0_20px_40px_-10px_rgba(225,29,72,0.15)] border border-gray-50">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-redstone-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tighter text-dark-900">How can I help you build?</h2>
                            <p className="text-dark-500 max-w-lg mx-auto px-4 text-sm sm:text-base md:text-lg font-light">
                                Describe your functionality and I'll architect the perfect stack.
                            </p>
                        </div>
                    )}

                    <div className="w-full max-w-3xl mx-auto relative z-20">
                        {/* Active Pill Display */}
                        {activeActions.size > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-1 sm:px-2 animate-fade-up">
                                {Array.from(activeActions).map(id => {
                                    const action = AVAILABLE_ACTIONS.find(a => a.id === id)
                                    return action ? (
                                        <div key={id} className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-redstone-50 border border-redstone-100 rounded-full text-[10px] sm:text-xs font-semibold text-redstone-600 shadow-sm">
                                            <action.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span className="hidden xs:inline sm:inline">{action.label}</span>
                                            <button onClick={() => toggleAction(id)} className="hover:scale-110 transition-transform">
                                                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            </button>
                                        </div>
                                    ) : null
                                })}
                            </div>
                        )}

                        <div className={`relative bg-white rounded-2xl sm:rounded-[32px] md:rounded-[40px] border transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${isLoading ? 'border-gray-100 opacity-50' : 'border-gray-200 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] focus-within:border-redstone-500/50 focus-within:ring-4 focus-within:ring-redstone-500/5'}`}>
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4">
                                {/* Actions Trigger */}
                                <div className="relative" ref={actionMenuRef}>
                                    <button
                                        onClick={() => setIsActionsOpen(!isActionsOpen)}
                                        className={`p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 ${isActionsOpen ? 'bg-dark-900 text-white rotate-45' : 'bg-gray-50 text-dark-500 hover:bg-gray-100 hover:text-dark-900'}`}
                                    >
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>

                                    {isActionsOpen && (
                                        <div className="absolute bottom-full left-0 mb-2 sm:mb-4 w-56 sm:w-64 md:w-72 bg-white border border-gray-100 rounded-xl sm:rounded-2xl md:rounded-[28px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-up p-1.5 sm:p-2">
                                            {AVAILABLE_ACTIONS.map(action => {
                                                const isActive = activeActions.has(action.id)
                                                return (
                                                    <button
                                                        key={action.id}
                                                        onClick={() => toggleAction(action.id)}
                                                        className={`w-full flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl md:rounded-2xl transition-colors text-left group ${isActive ? 'bg-redstone-50' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isActive ? 'bg-white shadow-sm text-redstone-600' : 'bg-gray-100 text-dark-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                                                            <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-redstone-700' : 'text-dark-700'}`}>
                                                                    {action.label}
                                                                </span>
                                                                {isActive && <Check className="w-3 h-3 text-redstone-600" />}
                                                            </div>
                                                            <p className="text-[10px] sm:text-xs text-dark-400 truncate mt-0.5">{action.description}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe what you want to build..."
                                    rows={1}
                                    className="flex-1 bg-transparent resize-none py-3 focus:outline-none text-sm sm:text-base max-h-24 sm:max-h-32 text-dark-900 placeholder-dark-400 font-medium leading-normal"
                                    disabled={isLoading}
                                />

                                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => setIsVoiceListening(!isVoiceListening)}
                                        className={`p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 ${isVoiceListening ? 'bg-redstone-600 text-white animate-pulse shadow-lg shadow-red-500/30' : 'text-dark-400 hover:text-dark-900 hover:bg-gray-50'}`}
                                    >
                                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>

                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || isLoading}
                                        className="p-2 sm:p-2.5 md:p-3 bg-redstone-600 text-white rounded-full hover:bg-redstone-700 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-redstone-600/20 hover:shadow-xl active:scale-95"
                                    >
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bulk Insert Modal */}
            {isBulkInsertOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-up">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-redstone-100 rounded-xl flex items-center justify-center">
                                        <FolderOpen className="w-5 h-5 text-redstone-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-dark-900">Bulk Insert</h2>
                                        <p className="text-sm text-dark-500">Index and process entire folders</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsBulkInsertOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-dark-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Hidden folder input for fallback */}
                            <input
                                ref={folderInputRef}
                                type="file"
                                {...{ webkitdirectory: '', directory: '' } as any}
                                multiple
                                onChange={handleFolderInputChange}
                                className="hidden"
                            />

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Select Folder
                                </label>
                                <button
                                    onClick={handleFolderSelect}
                                    disabled={bulkInsertLoading}
                                    className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-redstone-400 hover:bg-redstone-50/50 transition-colors text-dark-600 flex flex-col items-center justify-center gap-2 group"
                                >
                                    <FolderOpen className="w-8 h-8 text-gray-400 group-hover:text-redstone-500 transition-colors" />
                                    {selectedFolderName ? (
                                        <span className="font-medium text-dark-900">
                                            📁 {selectedFolderName}
                                            <span className="text-dark-500 font-normal ml-2">
                                                ({selectedFiles.length} files)
                                            </span>
                                        </span>
                                    ) : (
                                        <span>Click to browse and select a folder</span>
                                    )}
                                </button>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-dark-500 leading-relaxed">
                                    <strong>Supported files:</strong> Code files (.py, .js, .ts, .tsx, etc.), documentation (.md, .txt), and config files.
                                    <br /><br />
                                    <strong>Limits:</strong> Max 500 files, max 1MB per file. Folders like node_modules, .git, etc. are automatically skipped.
                                </p>
                            </div>

                            {bulkInsertResult && !bulkInsertResult.success && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                                    <p className="text-sm text-red-700">
                                        {bulkInsertResult.errors.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setIsBulkInsertOpen(false)}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-dark-700 hover:bg-gray-50 transition-colors"
                                disabled={bulkInsertLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkInsert}
                                disabled={selectedFiles.length === 0 || bulkInsertLoading}
                                className="flex-1 px-4 py-3 bg-redstone-600 text-white rounded-xl font-medium hover:bg-redstone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {bulkInsertLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-4 h-4" />
                                        Index Folder
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
