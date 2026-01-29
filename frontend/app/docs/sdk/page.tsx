import Link from 'next/link'
import { ArrowLeft, ArrowRight, Package } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function SDKPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">SDK Reference</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Integrate Redstone into your applications with official SDKs.
                </p>

                {/* Installation */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Installation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3">npm</h4>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <code>npm install @redstone/sdk</code>
                            </div>
                        </div>
                        <div className="card">
                            <h4 className="font-semibold text-dark-800 mb-3">Python</h4>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-100">
                                <code>pip install redstone-sdk</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Start */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Quick Start</h2>

                    <div className="card mb-4">
                        <h4 className="font-semibold text-dark-800 mb-3">TypeScript / JavaScript</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`import { Redstone } from '@redstone/sdk'

// Initialize client
const redstone = new Redstone({
  apiKey: process.env.REDSTONE_API_KEY,
  // or use token from GitHub OAuth
  token: 'your-jwt-token'
})

// Simple chat
const response = await redstone.agents.chat({
  content: 'Create a React component for user profile',
  stack: 'architect-pro',
  workspaceId: 123
})

console.log(response.message)
console.log('Files created:', response.files_modified)

// With streaming
const stream = redstone.agents.stream({
  content: 'Build a REST API',
  workspaceId: 123
})

for await (const chunk of stream) {
  if (chunk.type === 'chunk') {
    process.stdout.write(chunk.content)
  } else if (chunk.type === 'file_operation') {
    console.log('\\nCreating:', chunk.path)
  }
}`}</pre>
                        </div>
                    </div>

                    <div className="card">
                        <h4 className="font-semibold text-dark-800 mb-3">Python</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`from redstone import Redstone

# Initialize client
client = Redstone(api_key=os.environ["REDSTONE_API_KEY"])

# Simple chat
response = client.agents.chat(
    content="Create a FastAPI endpoint for users",
    stack="architect-pro",
    workspace_id=123
)

print(response.message)
print("Files created:", response.files_modified)

# With streaming
for chunk in client.agents.stream(content="Build a REST API"):
    if chunk.type == "chunk":
        print(chunk.content, end="", flush=True)
    elif chunk.type == "file_operation":
        print(f"\\nCreating: {chunk.path}")`}</pre>
                        </div>
                    </div>
                </section>

                {/* Workspaces */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Working with Workspaces</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`// List workspaces
const { workspaces } = await redstone.workspaces.list()

// Create a workspace from GitHub
const workspace = await redstone.workspaces.create({
  name: 'my-project',
  type: 'github',
  github_repo: 'user/my-project',
  github_branch: 'main'
})

// Read a file
const { content } = await redstone.workspaces.readFile(
  workspace.id,
  'src/index.ts'
)

// Write a file
await redstone.workspaces.writeFile(
  workspace.id,
  'src/utils.ts',
  'export function helper() { ... }'
)

// Search files
const results = await redstone.workspaces.search(
  workspace.id,
  'TODO',
  '*.ts'
)

// Git operations
await redstone.workspaces.sync(workspace.id)     // pull
await redstone.workspaces.commit(workspace.id, 'Add feature')
await redstone.workspaces.push(workspace.id)`}</pre>
                        </div>
                    </div>
                </section>

                {/* WebSocket Streaming */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Real-time Streaming</h2>
                    <div className="card">
                        <h4 className="font-semibold text-dark-800 mb-3">Browser (React)</h4>
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`import { ChatWebSocket } from '@redstone/sdk'
import { useState, useEffect } from 'react'

function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([])
  const [ws, setWs] = useState<ChatWebSocket | null>(null)

  useEffect(() => {
    const socket = new ChatWebSocket(
      // On message
      (data) => {
        if (data.type === 'chunk') {
          setMessages(prev => [...prev, data.content])
        }
      },
      // On connect
      () => console.log('Connected'),
      // On disconnect
      () => console.log('Disconnected')
    )
    
    socket.connect()
    setWs(socket)
    
    return () => socket.disconnect()
  }, [])

  const sendMessage = (content: string) => {
    ws?.send({
      content,
      stack: 'speed-demon',
      workspace_id: 123,
      apply_changes: true
    })
  }

  return (
    <div>
      {messages.map((m, i) => <p key={i}>{m}</p>)}
    </div>
  )
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* Error Handling */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Error Handling</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`import { RedstoneError, RateLimitError, AuthError } from '@redstone/sdk'

try {
  const response = await redstone.agents.chat({ content: '...' })
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limited. Retry after:', error.retryAfter)
  } else if (error instanceof AuthError) {
    console.log('Authentication failed. Please login again.')
  } else if (error instanceof RedstoneError) {
    console.log('API error:', error.message, error.code)
  }
}`}</pre>
                        </div>
                    </div>
                </section>

                {/* TypeScript Types */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">TypeScript Types</h2>
                    <div className="card">
                        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                            <pre>{`import type {
  ChatRequest,
  ChatResponse,
  Workspace,
  FileItem,
  AgentTask,
  StreamChunk
} from '@redstone/sdk'

// All types are exported and fully typed
const request: ChatRequest = {
  content: 'Build a component',
  stack_slug: 'speed-demon',
  workspace_id: 123,
  apply_changes: true
}

const response: ChatResponse = await redstone.agents.chat(request)`}</pre>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/api" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> API Reference
                    </Link>
                    <Link href="/docs/guides/github" className="btn-primary">
                        GitHub Integration <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
