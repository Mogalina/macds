import Link from 'next/link'
import { ArrowLeft, ArrowRight, Copy } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function APIAgentsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Agents API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Interact with AI agents programmatically. Send messages, stream responses, and manage chat sessions.
                </p>

                {/* Chat Endpoint */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Send Message</h2>
                    <div className="card mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                            <code className="text-dark-700 font-mono text-sm">/agents/chat</code>
                        </div>
                        <p className="text-dark-500 mb-4">Send a message to agents and receive a response. Optionally attach a workspace for file operations.</p>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Request Body</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                            <pre>{`{
  "content": "Build a REST API with Express.js",
  "stack_slug": "architect-pro",      // optional, default: "speed-demon"
  "session_id": 123,                  // optional, for conversation history
  "workspace_id": 456,                // optional, for file operations
  "apply_changes": true               // optional, execute file changes
}`}</pre>
                        </div>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Response</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`{
  "message": "I'll create a REST API structure...",
  "agent": "ArchitectAgent",
  "artifacts": [],
  "files_modified": ["src/index.js", "src/routes/api.js"],
  "status": "complete"
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Sessions */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Chat Sessions</h2>
                    <div className="space-y-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/agents/sessions</code>
                            </div>
                            <p className="text-dark-500 mb-3">List all chat sessions for the authenticated user.</p>
                            <div className="text-sm text-dark-600">
                                <strong>Query Parameters:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    <li><code className="bg-gray-100 px-1 rounded">workspace_id</code> - Filter by workspace</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                                <code className="text-dark-700 font-mono text-sm">/agents/sessions</code>
                            </div>
                            <p className="text-dark-500 mb-3">Create a new chat session.</p>
                            <div className="text-sm text-dark-600">
                                <strong>Query Parameters:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    <li><code className="bg-gray-100 px-1 rounded">title</code> - Session title (default: "New Chat")</li>
                                    <li><code className="bg-gray-100 px-1 rounded">workspace_id</code> - Attach to workspace</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                <code className="text-dark-700 font-mono text-sm">/agents/sessions/:id</code>
                            </div>
                            <p className="text-dark-500">Get session details with message history.</p>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span>
                                <code className="text-dark-700 font-mono text-sm">/agents/sessions/:id</code>
                            </div>
                            <p className="text-dark-500">Delete a chat session.</p>
                        </div>
                    </div>
                </section>

                {/* WebSocket */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">WebSocket Streaming</h2>
                    <div className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">WS</span>
                            <code className="text-dark-700 font-mono text-sm">/agents/ws/:client_id</code>
                        </div>
                        <p className="text-dark-500 mb-4">Stream agent responses in real-time via WebSocket.</p>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Connection</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                            <pre>{`ws://localhost:8000/agents/ws/client123?token=JWT_TOKEN`}</pre>
                        </div>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Send Message</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                            <pre>{`{
  "content": "Create a login component",
  "stack": "speed-demon",
  "workspace_id": 123,
  "apply_changes": true
}`}</pre>
                        </div>

                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">Receive Events</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`// Status update
{ "type": "status", "status": "thinking", "agent": "Orchestrator" }

// Content chunk
{ "type": "chunk", "content": "I'll create a login...", "agent": "ImplementationAgent" }

// File operation
{ "type": "file_operation", "operation": "write", "path": "src/Login.tsx" }

// Complete
{ "type": "complete" }`}</pre>
                        </div>
                    </div>
                </section>

                {/* SDK Example */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">SDK Usage</h2>
                    <div className="card">
                        <h4 className="font-semibold text-dark-800 mb-2 text-sm">TypeScript/JavaScript</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`import { agents, ChatWebSocket } from '@redstone/sdk'

// Simple chat
const response = await agents.chat({
  content: "Build a REST API",
  workspace_id: 123,
  apply_changes: true
})
console.log(response.message)

// Streaming with WebSocket
const ws = new ChatWebSocket(
  (data) => {
    if (data.type === 'chunk') {
      process.stdout.write(data.content)
    }
  }
)
ws.connect()
ws.send({ content: "Create a user model" })`}</pre>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api/auth" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Authentication
                    </Link>
                    <Link href="/docs/api/stacks" className="btn-primary">
                        Stacks API <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
