import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import RedstoneLogo from '../components/RedstoneLogo'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-10">
                <main className="max-w-4xl mx-auto px-6 py-24 sm:py-28 md:py-32 animate-fade-up">
                    <h1 className="text-5xl font-bold mb-3 text-dark-900 tracking-tight">Terms of Service</h1>
                    <p className="text-dark-400 mb-16 text-lg">Last updated: January 28, 2026</p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">1. Acceptance of Terms</h2>
                            <p className="text-dark-600 leading-relaxed">
                                By accessing and using Redstone ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, you should not use this Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">2. Description of Service</h2>
                            <p className="text-dark-600 leading-relaxed">
                                Redstone is a multi-agent development platform that uses AI agents to assist with software development tasks. The Service includes web-based chat interfaces, command-line tools, and API access for interacting with AI agents.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">3. User Accounts</h2>
                            <p className="text-dark-600 leading-relaxed mb-4">
                                To access certain features, you must create an account using GitHub OAuth. You are responsible for:
                            </p>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li>Maintaining the confidentiality of your account</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">4. Acceptable Use</h2>
                            <p className="text-dark-600 leading-relaxed mb-4">You agree not to use the Service to:</p>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li>Generate malicious code, malware, or security exploits</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights of others</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Abuse or overload our infrastructure</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">5. Subscription and Billing</h2>
                            <p className="text-dark-600 leading-relaxed">
                                Paid subscriptions are billed monthly or annually. You may cancel at any time, and cancellation will take effect at the end of your current billing period. Refunds are available within 14 days of purchase for annual plans.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">6. Intellectual Property</h2>
                            <p className="text-dark-600 leading-relaxed">
                                You retain ownership of all code and content you create using the Service. Redstone retains all rights to the platform, including the AI agents, infrastructure, and documentation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">7. Limitation of Liability</h2>
                            <p className="text-dark-600 leading-relaxed">
                                The Service is provided "as is" without warranties of any kind. Redstone shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">8. Changes to Terms</h2>
                            <p className="text-dark-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">9. Contact</h2>
                            <p className="text-dark-600 leading-relaxed">
                                For questions about these Terms, please contact us at <a href="mailto:legal@redstone.dev" className="text-redstone-600 hover:underline">legal@redstone.dev</a>.
                            </p>
                        </section>
                    </div>
                </main>
            </div>

            <footer className="border-t border-gray-100 py-20 px-6 mt-12 bg-gray-50/50">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <RedstoneLogo className="opacity-80 w-[22px] h-[22px]" />
                        <span className="text-dark-500 font-medium text-sm">© 2026 Redstone Inc.</span>
                    </div>
                    <div className="flex items-center gap-8 text-dark-500 text-sm font-medium">
                        <Link href="/docs" className="hover:text-redstone-600 transition-colors">Docs</Link>
                        <Link href="/billing" className="hover:text-redstone-600 transition-colors">Pricing</Link>
                        <Link href="/privacy" className="hover:text-redstone-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-redstone-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
