'use client'

import { useState } from 'react'
import { X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Node, Edge } from '@xyflow/react'

interface ConfigPanelProps {
    nodes: Node[]
    edges: Edge[]
    workflowName: string
    onClose: () => void
}

export default function ConfigPanel({ nodes, edges, workflowName, onClose }: ConfigPanelProps) {
    const [copied, setCopied] = useState(false)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        summary: true,
        agents: true,
        connections: false,
        json: false,
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Generate configuration object
    const generateConfig = () => {
        return {
            name: workflowName,
            version: '1.0',
            agents: nodes.map(node => ({
                id: node.id,
                type: node.data.agentType,
                label: node.data.label,
                provider: node.data.provider,
                model: node.data.model,
                temperature: node.data.temperature || 0.7,
                systemPrompt: node.data.systemPrompt || null,
            })),
            connections: edges.map(edge => ({
                from: edge.source,
                to: edge.target,
            })),
        }
    }

    const config = generateConfig()

    const handleCopy = async () => {
        await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Group agents by provider
    const agentsByProvider = nodes.reduce((acc, node) => {
        const provider = node.data.provider as string || 'anthropic'
        if (!acc[provider]) acc[provider] = []
        acc[provider].push(node)
        return acc
    }, {} as Record<string, Node[]>)

    const providerNames: Record<string, string> = {
        anthropic: 'Anthropic',
        openai: 'OpenAI',
        google: 'Google',
        openrouter: 'OpenRouter',
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-dark-900">Configuration</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Summary Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('summary')}
                        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium text-sm text-dark-900">Summary</span>
                        {expandedSections.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.summary && (
                        <div className="p-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-dark-500">Workflow</span>
                                <span className="font-medium text-dark-900">{workflowName}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-dark-500">Total Agents</span>
                                <span className="font-medium text-dark-900">{nodes.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-dark-500">Connections</span>
                                <span className="font-medium text-dark-900">{edges.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-dark-500">Providers</span>
                                <span className="font-medium text-dark-900">{Object.keys(agentsByProvider).length}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Agents Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('agents')}
                        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium text-sm text-dark-900">Agents by Provider</span>
                        {expandedSections.agents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.agents && (
                        <div className="p-3 space-y-3">
                            {Object.entries(agentsByProvider).map(([provider, providerNodes]) => (
                                <div key={provider}>
                                    <div className="text-xs font-medium text-dark-500 mb-1.5">
                                        {providerNames[provider] || provider} ({providerNodes.length})
                                    </div>
                                    <div className="space-y-1">
                                        {providerNodes.map(node => (
                                            <div
                                                key={node.id}
                                                className="text-sm bg-gray-50 px-2 py-1.5 rounded flex items-center justify-between"
                                            >
                                                <span className="text-dark-700">{node.data.label as string}</span>
                                                <span className="text-[10px] text-dark-400 font-mono">
                                                    {(node.data.model as string)?.split('-').slice(-2).join('-')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {nodes.length === 0 && (
                                <p className="text-sm text-dark-400 text-center py-2">No agents added yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Connections Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('connections')}
                        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium text-sm text-dark-900">Data Flow</span>
                        {expandedSections.connections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.connections && (
                        <div className="p-3">
                            {edges.length > 0 ? (
                                <div className="space-y-1">
                                    {edges.map(edge => {
                                        const sourceNode = nodes.find(n => n.id === edge.source)
                                        const targetNode = nodes.find(n => n.id === edge.target)
                                        return (
                                            <div
                                                key={edge.id}
                                                className="text-sm text-dark-600 flex items-center gap-2"
                                            >
                                                <span className="font-medium">{sourceNode?.data.label as string || edge.source}</span>
                                                <span className="text-dark-400">→</span>
                                                <span className="font-medium">{targetNode?.data.label as string || edge.target}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-dark-400 text-center py-2">No connections yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* JSON Config Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('json')}
                        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium text-sm text-dark-900">JSON Config</span>
                        {expandedSections.json ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.json && (
                        <div className="p-3">
                            <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-100 overflow-x-auto max-h-60">
                                <pre>{JSON.stringify(config, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleCopy}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Configuration'}
                </button>
            </div>
        </div>
    )
}
