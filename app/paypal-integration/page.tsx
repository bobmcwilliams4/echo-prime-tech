'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does PayPal integration work?', answer: 'Connect your PayPal business account in minutes. Our API wraps PayPal REST APIs with AI enrichment — automatic categorization, fraud scoring, reconciliation, and analytics. Accept one-time payments, subscriptions, and invoices through a unified interface.' },
  { question: 'What AI features are included?', answer: 'AI fraud detection scores every transaction (0-100 risk score). Auto-categorization tags payments by type. Smart reconciliation matches PayPal transactions to your invoices automatically. Churn prediction identifies at-risk subscribers.' },
  { question: 'Can it handle subscriptions?', answer: 'Yes. Create subscription plans with flexible billing cycles, trial periods, and upgrade/downgrade paths. AI monitors subscriber health and triggers retention workflows when churn risk rises.' },
  { question: 'Does it work with other payment processors?', answer: 'PayPal is the primary integration. Stripe support is available via our separate Payments product. Both feed into the same analytics dashboard for unified financial intelligence.' },
]

const features = [
  { title: 'One-Click Connect', desc: 'OAuth2 connection to your PayPal Business account. No API keys to manage. Automatic webhook setup for real-time transaction notifications.' },
  { title: 'AI Fraud Detection', desc: 'Every transaction scored 0-100 for fraud risk. Behavioral analysis, velocity checks, device fingerprinting, and geographic anomaly detection.' },
  { title: 'Auto-Reconciliation', desc: 'AI matches PayPal transactions to your invoices, orders, and subscriptions automatically. Flag discrepancies and missing payments.' },
  { title: 'Subscription Management', desc: 'Create plans with custom billing cycles, trials, and pricing tiers. Automated dunning for failed payments. Upgrade/downgrade paths.' },
  { title: 'Invoice Generation', desc: 'Send professional PayPal invoices via API. Track views, payments, and reminders. Bulk invoice generation for recurring clients.' },
  { title: 'Smart Categorization', desc: 'AI auto-tags transactions by category — subscriptions, one-time sales, refunds, fees, transfers. Custom rules for your business.' },
  { title: 'Payout Management', desc: 'Mass payouts to vendors, affiliates, and contractors. Batch processing with status tracking and automatic retry on failures.' },
  { title: 'Financial Analytics', desc: 'Revenue dashboards with MRR, ARR, net revenue, fees, refund rates, and growth trends. Export to accounting software.' },
  { title: 'Webhook Events', desc: 'Real-time notifications for payments, refunds, disputes, and subscription events. Route to Slack, email, or any HTTP endpoint.' },
  { title: 'Dispute Management', desc: 'AI assists with PayPal dispute responses. Auto-gather evidence from order history. Track resolution rates and dispute trends.' },
  { title: 'Multi-Currency', desc: 'Accept payments in 25+ currencies. Automatic conversion tracking and forex fee analysis. Currency-specific reporting.' },
  { title: 'Checkout Integration', desc: 'Embeddable PayPal checkout buttons and hosted payment pages. Custom branding. Mobile-optimized payment flows.' },
]

const comparison = [
  { feature: 'AI fraud scoring', echo: '0-100 per transaction', stripe: 'Radar (add-on)', square: 'Basic', paypal_native: 'Seller protection' },
  { feature: 'Auto-reconciliation', echo: 'AI invoice matching', stripe: 'Manual', square: 'Manual', paypal_native: 'No' },
  { feature: 'Smart categorization', echo: 'AI auto-tag', stripe: 'No', square: 'Basic categories', paypal_native: 'Manual' },
  { feature: 'Subscription billing', echo: 'Plans + dunning + AI', stripe: 'Billing (add-on)', square: 'Limited', paypal_native: 'Basic plans' },
  { feature: 'Financial analytics', echo: 'MRR/ARR/growth', stripe: 'Dashboard', square: 'Dashboard', paypal_native: 'Reports' },
  { feature: 'Dispute assistance', echo: 'AI evidence gathering', stripe: 'Manual', square: 'Manual', paypal_native: 'Resolution center' },
  { feature: 'Mass payouts', echo: 'Batch + retry', stripe: 'Connect payouts', square: 'No', paypal_native: 'Payouts API' },
  { feature: 'Webhook routing', echo: 'Slack + email + HTTP', stripe: 'Webhooks', square: 'Webhooks', paypal_native: 'Webhooks' },
  { feature: 'Multi-currency', echo: '25+ currencies', stripe: '135+ currencies', square: 'Limited', paypal_native: '25+ currencies' },
  { feature: 'Managed infrastructure', echo: 'Cloudflare edge', stripe: 'Cloud', square: 'Cloud', paypal_native: 'Cloud' },
  { feature: 'Starting price', echo: '$19/mo', stripe: '2.9% + 30¢', square: '2.6% + 10¢', paypal_native: '2.99% + 49¢' },
]

export default function PayPalIntegrationPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#0070ba'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'PayPal Integration', href: '/paypal-integration' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #0070ba, #003087)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo PayPal Integration</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered PayPal integration with fraud detection, auto-reconciliation, subscription management, and financial analytics. Accept payments smarter, not harder.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=paypal-integration&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Smarter Payments With AI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Stripe</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Square</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>PayPal Native</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.stripe}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.square}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.paypal_native}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['1 PayPal account', '1,000 transactions/mo', 'Basic fraud scoring', 'Invoice generation', 'Transaction dashboard', 'Email support'], cta: 'starter' },
              { tier: 'Business', price: '$69', period: '/mo', features: ['3 PayPal accounts', '10K transactions/mo', 'AI fraud detection', 'Auto-reconciliation', 'Subscription management', 'Financial analytics', 'Webhook routing', 'Priority support'], cta: 'business', popular: true },
              { tier: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited accounts', 'Unlimited transactions', 'Dispute AI assistant', 'Mass payouts', 'Multi-currency analytics', 'Custom fraud rules', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=paypal-integration&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
