'use client'

import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'

export default function PaymentsPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()

  const features = [
    {
      title: 'Multi-Gateway Processing',
      description: 'Stripe + PayPal unified, automatic routing, failover for maximum uptime',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'Subscription Management',
      description: 'Recurring billing, plan upgrades/downgrades, automatic proration',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: 'Invoice Generation',
      description: 'Professional invoices, PDF export, automatic payment reminders',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Revenue Analytics',
      description: 'MRR tracking, churn analysis, LTV calculations, cohort reports, revenue forecasting',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Tax Compliance',
      description: 'Automatic tax calculation, multi-jurisdiction support, 1099 generation',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Refund & Dispute Management',
      description: 'Automated refund processing, chargeback defense, dispute tracking',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      )
    },
    {
      title: 'Payment Links',
      description: 'Shareable checkout links, embeddable widgets, QR code generation',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      title: 'Developer API',
      description: 'REST API, webhooks, SDKs in 5 languages, sandbox testing environment',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ]

  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      rate: '+ 2.9%',
      popular: false,
      features: [
        'Basic checkout pages',
        'Payment links',
        'Invoice generation',
        'Email receipts',
        'Standard reporting',
        'Community support'
      ]
    },
    {
      name: 'Business',
      price: '$49',
      period: '/month',
      rate: '+ 2.5%',
      features: [
        'Everything in Starter',
        'Subscription management',
        'Analytics dashboard',
        'Multi-currency support',
        'Tax automation',
        'Priority support',
        'Custom branding',
        'Webhook integrations'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      rate: 'Volume rates',
      popular: false,
      features: [
        'Everything in Business',
        'Custom processing rates',
        'Volume discounts',
        'Dedicated account manager',
        '99.99% SLA',
        'Advanced fraud detection',
        'White-label options',
        'Custom integrations'
      ]
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Connect Gateways',
      description: 'Link your Stripe and PayPal accounts in minutes'
    },
    {
      number: '02',
      title: 'Configure Plans',
      description: 'Set up pricing tiers, subscription intervals, tax rules'
    },
    {
      number: '03',
      title: 'Accept Payments',
      description: 'Share payment links, embed checkout, process transactions'
    },
    {
      number: '04',
      title: 'Track Revenue',
      description: 'Monitor MRR, analyze cohorts, forecast growth'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Navigation */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={40}
            height={40}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
          <span className="font-bold text-xl" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>
            Pricing
          </Link>
          {user ? (
            <Link href="/dashboard" className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="gradient-text font-extrabold text-5xl md:text-6xl mb-6">
          Unified Payments Platform
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Accept payments, manage subscriptions, automate invoicing, and track revenue — all from one powerful dashboard. Multi-gateway processing with automatic routing and failover.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/checkout?service=payments&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Start Free
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Everything You Need to Get Paid
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--ept-text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-xl border ${tier.popular ? 'ring-2' : ''}`}
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                ...(tier.popular ? { boxShadow: '0 0 0 2px var(--ept-accent)' } : {})
              }}
            >
              {tier.popular && (
                <div className="text-center mb-4">
                  <span
                    className="px-4 py-1 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {tier.name}
              </h3>
              <div className="mb-2">
                <span className="text-4xl font-bold" style={{ color: 'var(--ept-accent)' }}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span style={{ color: 'var(--ept-text-secondary)' }}>{tier.period}</span>
                )}
              </div>
              <p className="mb-6" style={{ color: 'var(--ept-text-muted)' }}>
                {tier.rate} per transaction
              </p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="var(--ept-accent)">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout?service=payments&tier=${tier.name.toLowerCase()}`}
                className="block w-full text-center px-6 py-3 rounded-xl font-semibold"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-text)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-border)'
                }}
              >
                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--ept-text-secondary)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ready to Get Paid?
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Start accepting payments in minutes. No setup fees, no monthly minimums.
        </p>
        <Link
          href="/checkout?service=payments&tier=starter"
          className="inline-block px-8 py-4 rounded-xl font-semibold text-lg"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          Start Free Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p style={{ color: 'var(--ept-text-muted)' }}>
          © 2026 Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
