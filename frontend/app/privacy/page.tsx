import Link from 'next/link'
import Navbar from '../components/Navbar'
import RedstoneLogo from '../components/RedstoneLogo'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-10">
                <main className="max-w-4xl mx-auto px-6 py-24 sm:py-28 md:py-32 animate-fade-up">
                    <h1 className="text-5xl font-bold mb-3 text-dark-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-dark-400 mb-16 text-lg">Last updated: January 28, 2026</p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">1. Information We Collect</h2>
                            <p className="text-dark-600 leading-relaxed mb-4">We collect information you provide directly:</p>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li><strong>Account Information:</strong> GitHub username, email address, and profile picture when you sign in</li>
                                <li><strong>Usage Data:</strong> Chat messages, workflows, and stacks you create</li>
                                <li><strong>Payment Information:</strong> Processed securely through Stripe; we do not store card details</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li>To provide and improve the Service</li>
                                <li>To process transactions and send billing notifications</li>
                                <li>To respond to support requests</li>
                                <li>To analyze usage patterns and improve our AI agents</li>
                                <li>To send important updates about the Service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">3. Data Retention</h2>
                            <p className="text-dark-600 leading-relaxed">
                                We retain your data for as long as your account is active. Chat history is retained for 90 days by default. You can request deletion of your data at any time by contacting support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">4. Data Sharing</h2>
                            <p className="text-dark-600 leading-relaxed mb-4">We do not sell your personal information. We share data only with:</p>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li><strong>Service Providers:</strong> For payment processing (Stripe), infrastructure (cloud providers)</li>
                                <li><strong>AI Model Providers:</strong> Your prompts are sent to LLM providers (OpenAI, Anthropic, Google) to generate responses</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">5. AI and Your Data</h2>
                            <p className="text-dark-600 leading-relaxed">
                                When you use Redstone, your messages are processed by third-party AI models. We do not use your conversations to train our own models. Each AI provider has their own data policies which we encourage you to review.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">6. Security</h2>
                            <p className="text-dark-600 leading-relaxed">
                                We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits. However, no system is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">7. Your Rights</h2>
                            <p className="text-dark-600 leading-relaxed mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside text-dark-600 space-y-2 pl-4">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Export your data in a portable format</li>
                                <li>Opt out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">8. Cookies</h2>
                            <p className="text-dark-600 leading-relaxed">
                                We use essential cookies for authentication and session management. We do not use tracking cookies or third-party analytics that track you across sites.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">9. Changes to This Policy</h2>
                            <p className="text-dark-600 leading-relaxed">
                                We may update this policy periodically. We will notify you of significant changes via email or in-app notification.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 text-dark-900">10. Contact Us</h2>
                            <p className="text-dark-600 leading-relaxed">
                                For privacy-related questions or to exercise your rights, contact us at <a href="mailto:privacy@redstone.dev" className="text-redstone-600 hover:underline">privacy@redstone.dev</a>.
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
