import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function RestAPIGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Building a REST API</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Learn how to build a complete REST API using Redstone agents.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 1: Initialize Project</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto mb-4">
                        <code>redstone init my-api</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 2: Describe Your API</h2>
                    <p className="text-dark-600 mb-4">Start a chat session and describe what you want:</p>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <code>redstone chat "Build a REST API for a todo app with CRUD operations, user authentication using JWT, and PostgreSQL database"</code>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 3: Review Architecture</h2>
                    <p className="text-dark-600 mb-4">
                        The ArchitectAgent will propose an architecture. Review and approve:
                    </p>
                    <ul className="space-y-2 text-dark-600 pl-6">
                        <li>• Express.js or Fastify framework</li>
                        <li>• JWT authentication middleware</li>
                        <li>• PostgreSQL with Prisma ORM</li>
                        <li>• RESTful endpoint structure</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Step 4: Generated Output</h2>
                    <p className="text-dark-600 mb-4">Redstone will generate:</p>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <ul className="space-y-2 text-dark-600 font-mono text-sm">
                            <li>📁 src/routes/</li>
                            <li>📁 src/middleware/</li>
                            <li>📁 src/models/</li>
                            <li>📄 prisma/schema.prisma</li>
                            <li>📄 tests/</li>
                            <li>📄 Dockerfile</li>
                        </ul>
                    </div>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/guides/custom-stacks" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Custom Stacks
                    </Link>
                    <Link href="/docs/guides/github" className="btn-primary">
                        GitHub Integration <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
