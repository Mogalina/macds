'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import {
    ReactFlow,
    ReactFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    Panel,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
    Plus,
    Save,
    FileCode,
    Download,
    Upload,
    Trash2,
    Play,
    Layout,
    Settings,
    X,
    Crown,
    Zap,
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
import RedstoneLogo from '../components/RedstoneLogo'
import Navbar from '../components/Navbar'
import AgentNode from './components/AgentNode'
import YAMLEditor from './components/YAMLEditor'
import ConfigPanel from './components/ConfigPanel'

// Node types registration
const nodeTypes = {
    agentNode: AgentNode,
}

// Initial empty workflow
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Agent types with colors and icons
const AGENT_TYPES: { id: string; name: string; color: string; icon: LucideIcon }[] = [
    { id: 'orchestrator', name: 'Orchestrator', color: '#FF6B6B', icon: Target },
    { id: 'architect', name: 'Architect', color: '#4ECDC4', icon: Compass },
    { id: 'implementation', name: 'Implementation', color: '#45B7D1', icon: Code2 },
    { id: 'reviewer', name: 'Reviewer', color: '#96CEB4', icon: Eye },
    { id: 'tester', name: 'Tester', color: '#FFEAA7', icon: FlaskConical },
    { id: 'debugger', name: 'Debugger', color: '#DDA0DD', icon: Bug },
    { id: 'optimizer', name: 'Optimizer', color: '#98D8C8', icon: Gauge },
    { id: 'documenter', name: 'Documenter', color: '#F7DC6F', icon: BookOpen },
    { id: 'custom', name: 'Custom', color: '#B19CD9', icon: Sparkles },
]

// LLM Providers
const LLM_PROVIDERS = {
    anthropic: {
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
    },
    openai: {
        name: 'OpenAI',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
    },
    google: {
        name: 'Google',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash']
    },
    openrouter: {
        name: 'OpenRouter',
        models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.1-405b-instruct']
    },
}

// Templates
const TEMPLATES = [
    {
        id: 'full-stack',
        name: 'Full-Stack Builder',
        description: 'Complete workflow for full-stack apps',
        nodes: [
            { id: '1', type: 'agentNode', position: { x: 250, y: 50 }, data: { agentType: 'orchestrator', label: 'Orchestrator', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic', temperature: 0.7 } },
            { id: '2', type: 'agentNode', position: { x: 100, y: 200 }, data: { agentType: 'architect', label: 'Architect', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic', temperature: 0.5 } },
            { id: '3', type: 'agentNode', position: { x: 400, y: 200 }, data: { agentType: 'implementation', label: 'Coder', model: 'gpt-4o', provider: 'openai', temperature: 0.7 } },
            { id: '4', type: 'agentNode', position: { x: 250, y: 350 }, data: { agentType: 'reviewer', label: 'Reviewer', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic', temperature: 0.3 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
            { id: 'e1-3', source: '1', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
            { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
            { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
    },
    {
        id: 'code-review',
        name: 'Code Review Pipeline',
        description: 'Multi-perspective code review',
        nodes: [
            { id: '1', type: 'agentNode', position: { x: 250, y: 50 }, data: { agentType: 'orchestrator', label: 'Coordinator', model: 'gpt-4o-mini', provider: 'openai', temperature: 0.5 } },
            { id: '2', type: 'agentNode', position: { x: 100, y: 200 }, data: { agentType: 'reviewer', label: 'Security', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic', temperature: 0.3 } },
            { id: '3', type: 'agentNode', position: { x: 400, y: 200 }, data: { agentType: 'optimizer', label: 'Performance', model: 'gpt-4o', provider: 'openai', temperature: 0.5 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
            { id: 'e1-3', source: '1', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
    },
    {
        id: 'rapid',
        name: 'Rapid Prototyper',
        description: 'Fast prototyping workflow',
        nodes: [
            { id: '1', type: 'agentNode', position: { x: 200, y: 100 }, data: { agentType: 'implementation', label: 'Speed Coder', model: 'gpt-4o-mini', provider: 'openai', temperature: 0.8 } },
            { id: '2', type: 'agentNode', position: { x: 200, y: 250 }, data: { agentType: 'tester', label: 'Quick Test', model: 'gpt-3.5-turbo', provider: 'openai', temperature: 0.5 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
    },
]

function ElasticSwarmFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [workflowName, setWorkflowName] = useState('My Workflow')
    const [showYAMLEditor, setShowYAMLEditor] = useState(false)
    const [showConfigPanel, setShowConfigPanel] = useState(true)
    const [showTemplates, setShowTemplates] = useState(false)
    const [showAgentPicker, setShowAgentPicker] = useState(false)
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const nodeIdCounter = useRef(1)

    // Handle edge connections
    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge({
                ...connection,
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { strokeWidth: 2 },
            }, eds))
        },
        [setEdges]
    )

    // Add new agent node
    const addAgentNode = (agentType: string) => {
        const agent = AGENT_TYPES.find(a => a.id === agentType)
        if (!agent) return

        const newNode: Node = {
            id: `${nodeIdCounter.current++}`,
            type: 'agentNode',
            position: {
                x: 100 + Math.random() * 300,
                y: 100 + Math.random() * 200
            },
            data: {
                agentType: agent.id,
                label: agent.name,
                model: 'claude-3-5-sonnet-20241022',
                provider: 'anthropic',
                temperature: 0.7,
                systemPrompt: '',
            },
        }
        setNodes((nds) => [...nds, newNode])
        setShowAgentPicker(false)
    }

    // Delete selected node
    const deleteSelectedNode = () => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
            setSelectedNode(null)
        }
    }

    // Update node data
    const updateNodeData = (nodeId: string, data: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        )
    }

    // Load template
    const loadTemplate = (templateId: string) => {
        const template = TEMPLATES.find(t => t.id === templateId)
        if (template) {
            setNodes(template.nodes)
            setEdges(template.edges)
            setWorkflowName(template.name)
            nodeIdCounter.current = template.nodes.length + 1
        }
        setShowTemplates(false)
    }

    // Generate YAML from current workflow
    const generateYAML = () => {
        const config = {
            version: '1.0',
            elastic_swarm: {
                global: {
                    default_provider: 'anthropic',
                    default_model: 'claude-3-5-sonnet-20241022',
                    temperature: 0.7,
                    max_tokens: 4096,
                },
                agents: {} as Record<string, any>,
                connections: [] as any[],
            }
        }

        nodes.forEach(node => {
            config.elastic_swarm.agents[node.id] = {
                type: node.data.agentType,
                label: node.data.label,
                provider: node.data.provider,
                model: node.data.model,
                temperature: node.data.temperature || 0.7,
                system_prompt: node.data.systemPrompt || '',
            }
        })

        edges.forEach(edge => {
            config.elastic_swarm.connections.push({
                from: edge.source,
                to: edge.target,
            })
        })

        // Convert to YAML string (simplified)
        return JSON.stringify(config, null, 2)
    }

    // Handle node selection
    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNode(node)
    }, [])

    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [])

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header Navbar */}
            <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-6">
                    <a href="/" className="flex items-center">
                        <RedstoneLogo className="w-7 h-7 sm:w-8 sm:h-8" />
                    </a>
                    <nav className="hidden md:flex items-center gap-4">
                        <a href="/stacks" className="text-sm text-dark-600 hover:text-redstone-600 transition-colors">Stacks</a>
                        <a href="/elastic-swarm" className="text-sm text-redstone-600 font-medium">Elastic Swarm</a>
                        <a href="/registry" className="text-sm text-dark-600 hover:text-redstone-600 transition-colors">Registry</a>
                        <a href="/docs" className="text-sm text-dark-600 hover:text-redstone-600 transition-colors">Docs</a>
                        <a href="/billing" className="text-sm text-dark-600 hover:text-redstone-600 transition-colors">Pricing</a>
                    </nav>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <a href="/auth/login" className="hidden md:block text-sm text-dark-600 hover:text-dark-900 transition-colors">Sign In</a>
                    <a href="/chat" className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-redstone-600 text-white rounded-lg hover:bg-redstone-700 transition-colors font-medium">
                        <span className="hidden sm:inline">Start Building</span>
                        <span className="sm:hidden">Build</span>
                    </a>
                </div>
            </header>

            {/* Top Toolbar */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-redstone-600" />
                        <span className="font-bold text-dark-900 text-sm sm:text-base hidden sm:block">Elastic Swarm</span>
                    </div>
                    <input
                        type="text"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-redstone-500 w-28 sm:w-auto"
                    />
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setShowAgentPicker(!showAgentPicker)}
                        className="md:hidden px-2 py-1.5 text-xs text-dark-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden xs:inline">Agents</span>
                    </button>
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-dark-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                    >
                        <Layout className="w-4 h-4" />
                        <span className="hidden sm:inline">Templates</span>
                    </button>
                    <button
                        onClick={() => setShowYAMLEditor(true)}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-dark-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                    >
                        <FileCode className="w-4 h-4" />
                        <span className="hidden sm:inline">YAML</span>
                    </button>
                    <button
                        onClick={() => setShowConfigPanel(!showConfigPanel)}
                        className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1 sm:gap-2 ${showConfigPanel ? 'bg-gray-100 text-dark-900' : 'text-dark-600 hover:bg-gray-100'}`}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Config</span>
                    </button>
                    <div className="hidden sm:block w-px h-6 bg-gray-200" />
                    <button className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm bg-dark-900 text-white rounded-lg hover:bg-dark-800 transition-colors flex items-center gap-1 sm:gap-2">
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                    </button>
                    <button className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm bg-redstone-600 text-white rounded-lg hover:bg-redstone-700 transition-colors flex items-center gap-1 sm:gap-2">
                        <Play className="w-4 h-4" />
                        <span className="hidden sm:inline">Run</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Agent Sidebar - Desktop */}
                <div className="hidden md:block w-56 lg:w-64 bg-white border-r border-gray-200 p-3 lg:p-4 overflow-y-auto flex-shrink-0">
                    <h3 className="font-semibold text-dark-900 mb-3 text-sm">Add Agent</h3>
                    <div className="space-y-1.5 lg:space-y-2">
                        {AGENT_TYPES.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => addAgentNode(agent.id)}
                                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs lg:text-sm rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <span className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${agent.color}20` }}>
                                    <agent.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" style={{ color: agent.color }} />
                                </span>
                                <span className="font-medium text-dark-800 truncate">{agent.name}</span>
                            </button>
                        ))}
                    </div>

                    {selectedNode && (
                        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-dark-900 mb-3 text-sm">Selected Agent</h3>
                            <div className="space-y-2 lg:space-y-3">
                                <div>
                                    <label className="text-xs text-dark-500 block mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={String(selectedNode.data.label || '')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                                        className="w-full px-2 py-1.5 text-xs lg:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-redstone-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-500 block mb-1">Provider</label>
                                    <select
                                        value={String(selectedNode.data.provider || 'anthropic')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { provider: e.target.value, model: LLM_PROVIDERS[e.target.value as keyof typeof LLM_PROVIDERS].models[0] })}
                                        className="w-full px-2 py-1.5 text-xs lg:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-redstone-500"
                                    >
                                        {Object.entries(LLM_PROVIDERS).map(([key, provider]) => (
                                            <option key={key} value={key}>{provider.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-dark-500 block mb-1">Model</label>
                                    <select
                                        value={String(selectedNode.data.model || '')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { model: e.target.value })}
                                        className="w-full px-2 py-1.5 text-xs lg:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-redstone-500"
                                    >
                                        {LLM_PROVIDERS[selectedNode.data.provider as keyof typeof LLM_PROVIDERS]?.models.map((model) => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-dark-500 block mb-1">Temperature: {String(selectedNode.data.temperature || 0.7)}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={Number(selectedNode.data.temperature) || 0.7}
                                        onChange={(e) => updateNodeData(selectedNode.id, { temperature: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-500 block mb-1">System Prompt</label>
                                    <textarea
                                        value={String(selectedNode.data.systemPrompt || '')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { systemPrompt: e.target.value })}
                                        placeholder="Custom instructions..."
                                        className="w-full px-2 py-1.5 text-xs lg:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-redstone-500 h-16 lg:h-20 resize-none"
                                    />
                                </div>
                                <button
                                    onClick={deleteSelectedNode}
                                    className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Agent
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Agent Sidebar (Overlay) */}
                {showAgentPicker && (
                    <div className="md:hidden absolute inset-0 z-40 bg-black/30" onClick={() => setShowAgentPicker(false)}>
                        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto animate-in slide-in-from-left" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-dark-900 text-sm">Add Agent</h3>
                                <button onClick={() => setShowAgentPicker(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {AGENT_TYPES.map((agent) => (
                                    <button
                                        key={agent.id}
                                        onClick={() => { addAgentNode(agent.id); setShowAgentPicker(false); }}
                                        className="w-full px-3 py-2 text-left text-sm rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                                    >
                                        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}20` }}>
                                            <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
                                        </span>
                                        <span className="font-medium text-dark-800">{agent.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* React Flow Canvas */}
                <div className="flex-1 min-w-0" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-gray-50"
                        defaultEdgeOptions={{
                            style: { strokeWidth: 2, stroke: '#94a3b8' },
                            markerEnd: { type: MarkerType.ArrowClosed },
                        }}
                    >
                        <Controls className="bg-white border border-gray-200 rounded-lg !left-2 !bottom-2" />
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />

                        {nodes.length === 0 && (
                            <Panel position="top-center" className="mt-10 sm:mt-20">
                                <div className="text-center p-4 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 mx-4 min-w-[350px]">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-redstone-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-redstone-600" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">Create Your Agent Swarm</h3>
                                    <p className="text-dark-500 mb-4 text-xs sm:text-sm max-w-xs">
                                        Add agents from the sidebar and connect them to build your custom workflow.
                                    </p>
                                    <div className="flex gap-2 justify-center flex-wrap">
                                        <button
                                            onClick={() => setShowTemplates(true)}
                                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-redstone-600 text-white rounded-lg hover:bg-redstone-700 transition-colors"
                                        >
                                            Start from Template
                                        </button>
                                    </div>
                                </div>
                            </Panel>
                        )}
                    </ReactFlow>
                </div>

                {/* Config Panel - Desktop */}
                {showConfigPanel && (
                    <div className="hidden lg:block">
                        <ConfigPanel
                            nodes={nodes}
                            edges={edges}
                            workflowName={workflowName}
                            onClose={() => setShowConfigPanel(false)}
                        />
                    </div>
                )}

                {/* Config Panel - Mobile/Tablet (Bottom Sheet) */}
                {showConfigPanel && (
                    <div className="lg:hidden absolute inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-3 flex items-center justify-between">
                            <h3 className="font-semibold text-dark-900">Configuration</h3>
                            <button onClick={() => setShowConfigPanel(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-dark-500 text-xs mb-1">Workflow</div>
                                    <div className="font-medium text-dark-900">{workflowName}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-dark-500 text-xs mb-1">Total Agents</div>
                                    <div className="font-medium text-dark-900">{nodes.length}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-dark-500 text-xs mb-1">Connections</div>
                                    <div className="font-medium text-dark-900">{edges.length}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-dark-500 text-xs mb-1">Providers</div>
                                    <div className="font-medium text-dark-900">
                                        {new Set(nodes.map(n => n.data.provider)).size}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-dark-900">Workflow Templates</h2>
                            <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TEMPLATES.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => loadTemplate(template.id)}
                                    className="p-4 text-left border border-gray-200 rounded-xl hover:border-redstone-300 hover:bg-redstone-50/50 transition-all"
                                >
                                    <h3 className="font-semibold text-dark-900 mb-1">{template.name}</h3>
                                    <p className="text-sm text-dark-500 mb-2">{template.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-dark-400">
                                        <span>{template.nodes.length} agents</span>
                                        <span>•</span>
                                        <span>{template.edges.length} connections</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* YAML Editor Modal */}
            {showYAMLEditor && (
                <YAMLEditor
                    yaml={generateYAML()}
                    onClose={() => setShowYAMLEditor(false)}
                    onImport={(config) => {
                        // Parse and load config
                        setShowYAMLEditor(false)
                    }}
                />
            )}
        </div>
    )
}

export default function ElasticSwarmPage() {
    // Check for subscription (in real app, check against API)
    const [hasAccess, setHasAccess] = useState(true) // For demo, assume access

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Crown className="w-10 h-10 text-amber-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-4">Elastic Swarm is a Pro Feature</h1>
                    <p className="text-dark-500 mb-8">
                        Create custom AI agent workflows with drag-and-drop visual editing.
                        Upgrade to Pro to unlock Elastic Swarm.
                    </p>
                    <a href="/billing" className="btn-primary inline-flex">
                        Upgrade to Pro
                    </a>
                </div>
            </div>
        )
    }

    return (
        <ReactFlowProvider>
            <ElasticSwarmFlow />
        </ReactFlowProvider>
    )
}
