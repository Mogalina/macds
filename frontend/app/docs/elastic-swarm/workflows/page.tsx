import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function ElasticSwarmWorkflowsDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Creating Workflows</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Learn how to build effective AI agent workflows using the visual editor.
                </p>

                {/* Workflow Concepts */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Workflow Concepts</h2>
                    <div className="space-y-6 text-dark-600">
                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-2">Nodes (Agents)</h3>
                            <p className="text-sm">
                                Each node represents an AI agent with its own configuration. Agents can be different types
                                (Orchestrator, Implementation, Reviewer, etc.) and use different LLM models.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-2">Edges (Connections)</h3>
                            <p className="text-sm">
                                Edges define how data flows between agents. An edge from Agent A to Agent B means
                                A's output can be used as input for B.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-2">Directed Acyclic Graph (DAG)</h3>
                            <p className="text-sm">
                                Workflows are structured as DAGs - meaning data flows in one direction without cycles.
                                This ensures predictable execution order.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Common Patterns */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Common Workflow Patterns</h2>

                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-3">1. Hub and Spoke</h3>
                            <p className="text-dark-600 text-sm mb-3">
                                Central orchestrator coordinates multiple specialized agents.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs">
                                <pre className="text-dark-600">{`            ┌──────────────┐
            │ Orchestrator │
            └──────┬───────┘
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌───────────┐ ┌─────────┐ ┌──────────┐
│ Architect │ │  Coder  │ │ Reviewer │
└───────────┘ └─────────┘ └──────────┘`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-3">2. Pipeline</h3>
                            <p className="text-dark-600 text-sm mb-3">
                                Sequential processing where each agent's output feeds the next.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs">
                                <pre className="text-dark-600">{`┌───────────┐   ┌───────┐   ┌────────┐   ┌──────────┐
│ Architect │ → │ Coder │ → │ Tester │ → │ Reviewer │
└───────────┘   └───────┘   └────────┘   └──────────┘`}</pre>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="font-semibold text-dark-900 mb-3">3. Diamond (Merge)</h3>
                            <p className="text-dark-600 text-sm mb-3">
                                Multiple agents work in parallel, results merge at a single point.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs">
                                <pre className="text-dark-600">{`       ┌─────────────┐
       │ Coordinator │
       └──────┬──────┘
      ┌───────┴───────┐
      ▼               ▼
┌──────────┐     ┌──────────┐
│ Security │     │   Perf   │
└─────┬────┘     └────┬─────┘
      └───────┬───────┘
              ▼
        ┌────────────┐
        │ Aggregator │
        └────────────┘`}</pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Best Practices</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-900 mb-2">Use Specialized Agents</h4>
                            <p className="text-dark-500 text-sm">
                                Rather than one large agent, use specialized agents for specific tasks.
                                A dedicated security reviewer will catch more issues than a generic agent.
                            </p>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-900 mb-2">Match Models to Tasks</h4>
                            <p className="text-dark-500 text-sm">
                                Use powerful models (Claude 3 Opus, GPT-4) for complex reasoning.
                                Use faster models (GPT-4o-mini, Haiku) for simpler tasks.
                            </p>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-900 mb-2">Add Orchestration</h4>
                            <p className="text-dark-500 text-sm">
                                Include an Orchestrator agent for complex workflows.
                                It can route requests and coordinate parallel work.
                            </p>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-900 mb-2">Keep Workflows Focused</h4>
                            <p className="text-dark-500 text-sm">
                                Create different workflows for different use cases rather than one massive workflow.
                                This makes them easier to maintain and debug.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example Workflow */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Example: Full-Stack Builder</h2>
                    <div className="card">
                        <p className="text-dark-600 text-sm mb-4">
                            This workflow coordinates architecture, implementation, and review for full-stack applications:
                        </p>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`# Elastic Swarm Workflow: Full-Stack Builder

agents:
  orchestrator:
    type: orchestrator
    model: claude-3-5-sonnet-20241022
    provider: anthropic
    temperature: 0.5
    
  architect:
    type: architect
    model: claude-3-5-sonnet-20241022
    provider: anthropic
    temperature: 0.3
    system_prompt: "Focus on scalable, maintainable architecture..."
    
  frontend_dev:
    type: implementation
    model: gpt-4o
    provider: openai
    temperature: 0.7
    system_prompt: "Expert in React, TypeScript, modern CSS..."
    
  backend_dev:
    type: implementation
    model: claude-3-5-sonnet-20241022
    provider: anthropic
    temperature: 0.7
    system_prompt: "Expert in Node.js, Python, APIs..."
    
  reviewer:
    type: reviewer
    model: claude-3-5-sonnet-20241022
    provider: anthropic
    temperature: 0.2

connections:
  - from: orchestrator
    to: architect
  - from: orchestrator
    to: frontend_dev
  - from: orchestrator
    to: backend_dev
  - from: architect
    to: reviewer
  - from: frontend_dev
    to: reviewer
  - from: backend_dev
    to: reviewer`}</pre>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/elastic-swarm" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Elastic Swarm
                    </Link>
                    <Link href="/docs/elastic-swarm/yaml" className="btn-primary">
                        YAML Reference <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
