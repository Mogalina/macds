import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'

export default function CustomStacksGuidePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32">
                <h1 className="text-5xl font-bold mb-6 text-dark-900 tracking-tight">Creating Custom Stacks</h1>
                <p className="text-dark-600 text-xl mb-12 leading-relaxed">
                    Team tier users can create custom stacks with any combination of supported LLMs.
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Supported Models</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">OpenAI</h3>
                            <ul className="text-dark-500 text-sm space-y-1">
                                <li>• GPT-4o</li>
                                <li>• GPT-4o-mini</li>
                                <li>• GPT-4 Turbo</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">Anthropic</h3>
                            <ul className="text-dark-500 text-sm space-y-1">
                                <li>• Claude 3.5 Sonnet</li>
                                <li>• Claude 3.5 Opus</li>
                                <li>• Claude 3 Haiku</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">Google</h3>
                            <ul className="text-dark-500 text-sm space-y-1">
                                <li>• Gemini 2.0 Pro</li>
                                <li>• Gemini 2.0 Flash</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-dark-900 mb-2">DeepSeek</h3>
                            <ul className="text-dark-500 text-sm space-y-1">
                                <li>• DeepSeek R1</li>
                                <li>• DeepSeek Coder</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Creating a Stack</h2>
                    <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
                        <pre>{`# redstone.yaml
name: my-custom-stack

agents:
  architect:
    model: claude-3.5-opus
    temperature: 0.2
  product:
    model: gpt-4o
  implementation:
    model: deepseek-coder
    temperature: 0.1
  build-test:
    model: claude-3-haiku
  reviewer:
    model: claude-3.5-sonnet
  infra:
    model: gpt-4o-mini
  integrator:
    model: claude-3.5-sonnet`}</pre>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-dark-900">Best Practices</h2>
                    <ul className="space-y-3 text-dark-600">
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span>Use high-capability models (Opus, GPT-4) for ArchitectAgent</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span>Use fast models (Haiku, Flash) for BuildTestAgent</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-redstone-500 rounded-full mt-2"></span>
                            <span>Lower temperature (0.1-0.2) for code generation</span>
                        </li>
                    </ul>
                </section>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/docs/stacks" className="text-dark-500 hover:text-redstone-600 flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Stacks
                    </Link>
                    <Link href="/docs/guides/rest-api" className="btn-primary">
                        REST API Guide <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
