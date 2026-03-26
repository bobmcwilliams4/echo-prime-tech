'use client'

import { useState } from 'react'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { createPaymentLink } from '../../lib/paypal-api'
import ProductTutorialButton from '../../components/product-tutorial-button'
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

/* ─── Payment Link Generator ─────────────────────────────────────────────── */

function PaymentLinkGenerator() {
  const { isDark } = useTheme()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [link, setLink] = useState<{ url: string; orderId: string; amount: number } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    const num = parseFloat(amount)
    if (!num || num < 1) { setError('Enter an amount of at least $1.00'); return }
    setLoading(true)
    setError('')
    setLink(null)
    try {
      const result = await createPaymentLink({ amount: num, description: description || undefined })
      setLink({ url: result.payment_url, orderId: result.order_id, amount: result.amount })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create payment link')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!link) return
    navigator.clipboard.writeText(link.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Payments', href: '/payments' }]} />
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
        Payment Link Generator
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
        Create a shareable payment link. Your customer clicks the link, pays via PayPal, Venmo, or card — you get paid instantly.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: 'var(--ept-text-muted)' }}>$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-lg text-lg font-mono"
                style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Description (optional)</label>
            <input
              type="text"
              placeholder="e.g. Invoice #1234, Consulting Fee"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !amount}
            className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            {loading ? 'Generating...' : 'Generate Payment Link'}
          </button>
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>
              {error}
            </div>
          )}
        </div>

        {/* Result / QR Code */}
        <div className="flex flex-col items-center justify-center min-h-[280px] rounded-lg p-6"
          style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
          {link ? (
            <>
              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: '#fff' }}>
                <QRCodeSVG
                  value={link.url}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#0d7377"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs font-mono text-center break-all mb-3 max-w-[260px]" style={{ color: 'var(--ept-text-muted)' }}>
                {link.url}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-semibold border"
                  style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  Open
                </a>
              </div>
              <p className="text-[10px] mt-3" style={{ color: 'var(--ept-text-muted)' }}>
                Order: {link.orderId} | ${link.amount.toFixed(2)} USD
              </p>
            </>
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--ept-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                Enter an amount to generate a QR code and payment link
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {[
          { label: 'PayPal', desc: 'Balance or linked bank' },
          { label: 'Venmo', desc: 'Send via Venmo app' },
          { label: 'Card', desc: 'Visa, Mastercard, Amex' },
        ].map((m, i) => (
          <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
            <p className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{m.label}</p>
            <p className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Quick Amount Cards ─────────────────────────────────────────────────── */

function QuickPayLinks() {
  const [links, setLinks] = useState<Record<number, { url: string; loading: boolean; error: string }>>({})

  async function generateQuick(amount: number, desc: string) {
    setLinks(prev => ({ ...prev, [amount]: { url: '', loading: true, error: '' } }))
    try {
      const result = await createPaymentLink({ amount, description: desc })
      setLinks(prev => ({ ...prev, [amount]: { url: result.payment_url, loading: false, error: '' } }))
    } catch (e) {
      setLinks(prev => ({ ...prev, [amount]: { url: '', loading: false, error: e instanceof Error ? e.message : 'Failed' } }))
    }
  }

  const quickAmounts = [
    { amount: 25, label: '$25', desc: 'Quick consultation' },
    { amount: 50, label: '$50', desc: 'Standard support' },
    { amount: 100, label: '$100', desc: 'Priority support' },
    { amount: 250, label: '$250', desc: 'Deep analysis session' },
    { amount: 500, label: '$500', desc: 'Custom integration' },
    { amount: 1000, label: '$1,000', desc: 'Enterprise setup' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {quickAmounts.map(q => {
        const state = links[q.amount]
        return (
          <div key={q.amount} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ept-accent)' }}>{q.label}</p>
            <p className="text-[10px] mb-3" style={{ color: 'var(--ept-text-muted)' }}>{q.desc}</p>
            {state?.url ? (
              <a href={state.url} target="_blank" rel="noopener noreferrer"
                className="block px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Pay Now
              </a>
            ) : (
              <button
                onClick={() => generateQuick(q.amount, q.desc)}
                disabled={state?.loading}
                className="w-full px-3 py-1.5 rounded-lg text-[10px] font-semibold border disabled:opacity-50"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                {state?.loading ? '...' : 'Generate'}
              </button>
            )}
            {state?.error && <p className="text-[9px] mt-1 text-red-400">{state.error}</p>}
          </div>
        )
      })}
    </div>
  )
}

/* ─── FAQs ───────────────────────────────────────────────────────────────── */

const FAQS = [
  { q: 'Which payment processors do you support?', a: 'Echo Payments integrates with Stripe, PayPal, Square, and direct ACH/wire transfers. Add multiple processors per account and route payments based on amount, currency, or customer location.' },
  { q: 'How does subscription billing work?', a: 'Create subscription plans with any billing cycle (weekly, monthly, annual, custom). Automatic invoice generation, failed payment retry logic, grace periods, and proration on plan changes. Dunning management recovers 15-25% of failed payments.' },
  { q: 'What currencies are supported?', a: 'Over 135 currencies. Multi-currency invoicing with automatic exchange rate conversion. Customers pay in their local currency while you receive settlement in USD, EUR, or GBP.' },
  { q: 'Is it PCI compliant?', a: 'Yes. Echo Payments never touches raw card numbers. All payment processing goes through PCI-DSS Level 1 certified processors (Stripe, PayPal). We store only tokenized references. Your PCI scope stays minimal.' },
  { q: 'Can I create custom checkout pages?', a: 'Yes. Embeddable payment forms with your branding, hosted checkout pages, and payment link generation. All work on mobile. No coding required for basic checkout — full API available for custom integrations.' },
  { q: 'What reporting is available?', a: 'Real-time revenue dashboards with MRR, ARR, churn rate, ARPU, and LTV. Transaction search with filters. Exportable to CSV. Automated daily/weekly revenue summary emails.' },
];

/* ─── Main Page ──────────────────────────────────────────────────────────── */

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
      title: 'Payment Links & QR Codes',
      description: 'Shareable checkout links, embeddable widgets, QR code generation for in-person or remote payments',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
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
        'Payment links & QR codes',
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
    { number: '01', title: 'Connect Gateways', description: 'Link your Stripe and PayPal accounts in minutes' },
    { number: '02', title: 'Configure Plans', description: 'Set up pricing tiers, subscription intervals, tax rules' },
    { number: '03', title: 'Accept Payments', description: 'Share payment links, embed checkout, process transactions' },
    { number: '04', title: 'Track Revenue', description: 'Monitor MRR, analyze cohorts, forecast growth' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <ProductTutorialButton tutorialId="payments" productName="Payment Processing" />
      {/* Navigation */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={400}
            height={260}
            className="w-[160px] md:w-[200px] h-auto"
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
            Pricing
          </Link>
          {user ? (
            <Link href="/dashboard" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/checkout?service=payments&tier=starter" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section data-tutorial="payments-hero" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="gradient-text font-extrabold text-5xl md:text-6xl mb-6">
          Unified Payments Platform
        </h1>
        <p className="text-xl mb-4 max-w-3xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Accept payments, manage subscriptions, automate invoicing, and track revenue — all from one powerful dashboard. Multi-gateway processing with automatic routing and failover.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {['PayPal', 'Venmo', 'Credit Card', 'Debit Card', 'Pay Later', 'QR Code'].map(m => (
            <span key={m} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              {m}
            </span>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/checkout?service=payments&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Start Free
          </Link>
          <a
            href="#payment-links"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          >
            Try Payment Links
          </a>
        </div>
      </section>

      {/* Payment Links & QR Code Generator */}
      <section id="payment-links" data-tutorial="payments-providers" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ color: 'var(--ept-text)' }}>
          Payment Links & QR Codes
        </h2>
        <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Generate a payment link in seconds. Share it via email, text, or social media — or print the QR code for in-person payments. Customers pay with PayPal, Venmo, or any card.
        </p>
        <PaymentLinkGenerator />

        {/* Quick Pay Amounts */}
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Quick Pay Amounts</h3>
          <QuickPayLinks />
        </div>
      </section>

      {/* Features Grid */}
      <section data-tutorial="payments-subscriptions" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Everything You Need to Get Paid
        </h2>
        <div data-tutorial="payments-analytics" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                {feature.description}
              </p>
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

      {/* Pricing */}
      <section data-tutorial="payments-pricing" className="max-w-7xl mx-auto px-6 py-20">
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
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{feature}</span>
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

      {/* Accepted Payment Methods */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
          Accepted Payment Methods
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'PayPal', color: '#003087' },
            { name: 'Venmo', color: '#3D95CE' },
            { name: 'Visa', color: '#1A1F71' },
            { name: 'Mastercard', color: '#EB001B' },
            { name: 'Amex', color: '#006FCF' },
            { name: 'Discover', color: '#FF6000' },
            { name: 'Apple Pay', color: '#000000' },
            { name: 'Google Pay', color: '#4285F4' },
            { name: 'Pay Later', color: '#003087' },
            { name: 'ACH / Bank', color: '#2E7D32' },
            { name: 'Wire Transfer', color: '#5C6BC0' },
            { name: 'Crypto (BTC)', color: '#F7931A' },
          ].map((pm) => (
            <div key={pm.name} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: pm.color }}>
                {pm.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--ept-text)' }}>{pm.name}</p>
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
      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Payments Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['FIN', 'BUS']}
          title="Ask the Payments Intelligence Engine"
          placeholder="Ask about payment processing, compliance..."
          exampleQueries={['PCI DSS compliance requirements', 'Stripe vs PayPal fee comparison', 'How to handle payment disputes']}
        />
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-12 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p style={{ color: 'var(--ept-text-muted)' }}>
          © 2026 Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
