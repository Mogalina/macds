'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Zap, HelpCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import RedstoneLogo from '../components/RedstoneLogo'

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'forever',
        features: [
            'Local mode only',
            '3 agents',
            'Community stacks',
            '100 requests/month',
        ],
        cta: 'Get Started',
        href: '/chat',
    },
    {
        id: 'developer',
        name: 'Developer',
        price: 19,
        period: 'per month',
        popular: true,
        features: [
            'GitHub integration',
            '7 agents',
            'Custom stacks',
            '1,000 requests/month',
            'Priority support',
        ],
        cta: 'Start Free Trial',
        href: '/auth/login?plan=developer',
    },
    {
        id: 'team',
        name: 'Team',
        price: 49,
        period: 'per month',
        features: [
            'Everything in Developer',
            'Unlimited agents',
            'Private registry',
            '5,000 requests/month',
            'Team sharing',
            'API access',
        ],
        cta: 'Start Free Trial',
        href: '/auth/login?plan=team',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        period: 'custom',
        features: [
            'Everything in Team',
            'Self-hosted option',
            'SLA guarantee',
            'Unlimited requests',
            'Dedicated support',
            'Custom integrations',
        ],
        cta: 'Contact Sales',
        href: '/contact',
    },
]

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-redstone-500/20">
            <Navbar />

            <div className="pt-10">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 md:py-32 animate-fade-up">
                    <div className="text-center mb-10 sm:mb-16 md:mb-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-dark-900">Simple, transparent pricing</h1>
                        <p className="text-dark-500 text-base sm:text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed px-2">
                            Start free and scale as you grow. No hidden fees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {PLANS.map((plan, i) => (
                            <div
                                key={plan.id}
                                className={`card relative flex flex-col transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'border-redstone-500 ring-4 ring-redstone-500/5 shadow-xl shadow-redstone-500/10' : 'border-gray-200 hover:shadow-xl'} animate-fade-up`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-redstone-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-redstone-600/30">
                                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                                        Popular
                                    </div>
                                )}

                                <div className="mb-4 sm:mb-6 md:mb-8">
                                    <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-dark-900">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        {plan.price !== null ? (
                                            <>
                                                <span className="text-3xl sm:text-4xl font-extrabold text-dark-900">${plan.price}</span>
                                                <span className="text-dark-500 text-xs sm:text-sm font-medium">/{plan.period}</span>
                                            </>
                                        ) : (
                                            <span className="text-2xl sm:text-3xl font-extrabold text-dark-900">Custom</span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-2.5 sm:space-y-4 flex-1 mb-4 sm:mb-6 md:mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-redstone-100 text-redstone-600' : 'bg-gray-100 text-dark-500'}`}>
                                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            </div>
                                            <span className="text-dark-600 leading-tight pt-0.5">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.href}
                                    className={`block text-center py-2.5 sm:py-3 md:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95 ${plan.popular
                                        ? 'bg-redstone-600 text-white hover:bg-redstone-700 shadow-redstone-600/20'
                                        : 'bg-white border-2 border-gray-100 text-dark-900 hover:border-dark-900 hover:bg-dark-900 hover:text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 sm:mt-16 md:mt-24 max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-dark-900 tracking-tight">Frequently Asked</h2>
                        <div className="grid gap-3 sm:gap-4 md:gap-6">
                            {[
                                { q: 'What counts as a request?', a: 'Each message sent to agents counts as one request. Multi-agent workflows may use multiple requests.' },
                                { q: 'Can I switch plans?', a: 'Yes, upgrade or downgrade anytime. Changes take effect on your next billing cycle.' },
                                { q: 'Do you offer refunds?', a: 'Yes, we offer a 14-day money-back guarantee for annual plans.' },
                            ].map((faq) => (
                                <div key={faq.q} className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                                    <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-dark-900 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-dark-400 shrink-0" />
                                        {faq.q}
                                    </h3>
                                    <p className="text-dark-500 leading-relaxed pl-6 sm:pl-7 text-xs sm:text-sm md:text-base">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <footer className="border-t border-gray-100 py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <RedstoneLogo className="opacity-80 w-[22px] h-[22px]" />
                        <span className="text-dark-500 font-medium text-xs sm:text-sm">© 2026 Redstone Inc.</span>
                    </div>
                    <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-dark-500 text-xs sm:text-sm font-medium">
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
