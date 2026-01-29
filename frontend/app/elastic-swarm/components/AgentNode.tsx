'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import {
    Target,
    Compass,
    Code2,
    Eye,
    FlaskConical,
    Bug,
    Gauge,
    BookOpen,
    Sparkles,
    LucideIcon
} from 'lucide-react'

// Agent types with colors
const AGENT_COLORS: Record<string, string> = {
    orchestrator: '#FF6B6B',
    architect: '#4ECDC4',
    implementation: '#45B7D1',
    reviewer: '#96CEB4',
    tester: '#FFEAA7',
    debugger: '#DDA0DD',
    optimizer: '#98D8C8',
    documenter: '#F7DC6F',
    custom: '#B19CD9',
}

const AGENT_ICONS: Record<string, LucideIcon> = {
    orchestrator: Target,
    architect: Compass,
    implementation: Code2,
    reviewer: Eye,
    tester: FlaskConical,
    debugger: Bug,
    optimizer: Gauge,
    documenter: BookOpen,
    custom: Sparkles,
}

const PROVIDER_BADGES: Record<string, { color: string; label: string }> = {
    anthropic: { color: '#D97706', label: 'Anthropic' },
    openai: { color: '#10A37F', label: 'OpenAI' },
    google: { color: '#4285F4', label: 'Google' },
    openrouter: { color: '#6366F1', label: 'OpenRouter' },
}

function AgentNode({ data, selected }: NodeProps) {
    const agentType = data.agentType as string || 'custom'
    const color = AGENT_COLORS[agentType] || AGENT_COLORS.custom
    const IconComponent = AGENT_ICONS[agentType] || AGENT_ICONS.custom
    const provider = PROVIDER_BADGES[data.provider as string] || PROVIDER_BADGES.anthropic

    return (
        <div
            className={`
                bg-white rounded-xl shadow-lg border-2 transition-all duration-200
                ${selected ? 'ring-2 ring-redstone-500 ring-offset-2' : ''}
            `}
            style={{
                borderColor: color,
                minWidth: 180,
            }}
        >
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />

            {/* Header */}
            <div
                className="px-3 py-2 rounded-t-lg flex items-center gap-2"
                style={{ backgroundColor: `${color}20` }}
            >
                <IconComponent className="w-4 h-4" style={{ color }} />
                <span className="font-semibold text-sm text-dark-900 truncate">
                    {data.label as string || 'Agent'}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                        style={{ backgroundColor: provider.color }}
                    >
                        {provider.label}
                    </span>
                </div>
                <div className="text-[11px] text-dark-500 truncate font-mono">
                    {data.model as string || 'claude-3-5-sonnet'}
                </div>
                {typeof data.temperature === 'number' && (
                    <div className="text-[10px] text-dark-400">
                        temp: {String(data.temperature)}
                    </div>
                )}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
        </div>
    )
}

export default memo(AgentNode)
