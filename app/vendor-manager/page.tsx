'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  {
    q: 'How does AI vendor risk assessment work?',
    a: 'Our AI analyzes financial stability, operational capacity, compliance history, and reputational signals to produce a composite risk score with actionable recommendations — updated continuously as new data comes in.',
  },
  {
    q: 'Can purchase orders auto-approve below a threshold?',
    a: 'Yes. Set an approval threshold per organization — any PO at or below that amount is auto-approved instantly. Higher-value POs route to the designated approver for review.',
  },
  {
    q: 'Does it track diversity and minority certifications?',
    a: 'Absolutely. Track minority-owned, woman-owned, veteran-owned, and small business certifications per vendor. Run reports on diversity spend to meet compliance goals.',
  },
  {
    q: 'How does contract renewal tracking work?',
    a: 'Set renewal notice windows per contract. The daily cron flags contracts approaching expiry so you never miss a renewal deadline or auto-renew you wanted to cancel.',
  },
  {
    q: 'Can I export vendor data?',
    a: 'Export vendors, contracts, spend records, and purchase orders in CSV or JSON format. Filter by date range, vendor, category, or status before exporting.',
  },
  {
    q: 'What integrations are available?',
    a: 'Service bindings to Echo Engine Runtime for AI analysis, Shared Brain for cross-system intelligence, and Email Sender for automated notifications. API-first design connects to any ERP or accounting system.',
  },
]

const features = [
  { title: 'Vendor Lifecycle', desc: 'Full onboarding-to-offboarding management with 29-field vendor profiles, contacts, and custom fields.' },
  { title: 'AI Risk Assessment', desc: 'Financial, operational, compliance, and reputational risk scoring with automatic risk level classification.' },
  { title: 'Purchase Orders', desc: 'Create, approve, and track POs with auto-approval thresholds, line items, tax, and shipping calculations.' },
  { title: 'Contract Management', desc: 'Track contract value, SLA terms, auto-renewal, and expiry dates with proactive renewal alerts.' },
  { title: 'Performance Reviews', desc: 'Score vendors on quality, delivery, communication, and pricing — automatically updates vendor performance rating.' },
  { title: 'Spend Analytics', desc: 'Track spend by vendor, category, and time period with daily automated snapshots and trend analysis.' },
  { title: 'Compliance Tracking', desc: 'Manage insurance, licenses, certifications, and W-9s with expiry monitoring and verification workflow.' },
  { title: 'Diversity Reporting', desc: 'Track minority, woman, veteran-owned, and small business status for procurement diversity goals.' },
  { title: 'AI Vendor Analysis', desc: 'One-click AI analysis surfaces risk factors, performance patterns, and optimization opportunities per vendor.' },
  { title: 'Approval Workflows', desc: 'Configurable approval limits per user, auto-approval thresholds per org, and full audit trail.' },
  { title: 'Dashboard & KPIs', desc: 'Real-time dashboard with total spend, vendor count, at-risk vendors, pending POs, and expiring contracts.' },
  { title: 'Export & Reporting', desc: 'CSV and JSON export for vendors, contracts, spend, and POs with date range and status filters.' },
]

const comparison = [
  { feature: 'Vendor profiles', echo: '29-field + custom', ariba: 'Enterprise', coupa: 'Enterprise', precoro: 'Basic' },
  { feature: 'AI risk scoring', echo: '4-dimension AI', ariba: 'Manual', coupa: 'Add-on', precoro: 'No' },
  { feature: 'Purchase orders', echo: 'Full + auto-approve', ariba: 'Full', coupa: 'Full', precoro: 'Full' },
  { feature: 'Contract tracking', echo: 'Renewal alerts', ariba: 'Full', coupa: 'Add-on', precoro: 'Basic' },
  { feature: 'Performance reviews', echo: '4-category scoring', ariba: 'Scorecards', coupa: 'Add-on', precoro: 'No' },
  { feature: 'Spend analytics', echo: 'Real-time + daily cron', ariba: 'Full', coupa: 'Full', precoro: 'Basic' },
  { feature: 'Compliance docs', echo: 'Expiry monitoring', ariba: 'Full', coupa: 'Add-on', precoro: 'No' },
  { feature: 'Diversity tracking', echo: '4 cert types', ariba: 'Full', coupa: 'Full', precoro: 'No' },
  { feature: 'Approval workflows', echo: 'Threshold + per-user', ariba: 'Complex', coupa: 'Complex', precoro: 'Basic' },
  { feature: 'AI analysis', echo: 'Engine-backed', ariba: 'Limited', coupa: 'AI-assisted', precoro: 'No' },
  { feature: 'API / integrations', echo: 'REST + service bindings', ariba: 'ERP only', coupa: 'API + ERP', precoro: 'Limited' },
  { feature: 'Export', echo: 'CSV + JSON', ariba: 'CSV', coupa: 'CSV + PDF', precoro: 'CSV' },
  { feature: 'Setup time', echo: '< 5 minutes', ariba: 'Months', coupa: 'Weeks', precoro: 'Days' },
  { feature: 'Starting price', echo: '$29/mo', ariba: '$50K+/yr', coupa: '$30K+/yr', precoro: '$35/user/mo' },
]

export default function VendorManagerPage() {
  const { isDark } = useTheme()
  const dark = isDark

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Vendor Manager — AI-Powered Vendor & Procurement Management</h1><p>AI-powered vendor lifecycle management from onboarding to performance review. Features include 29-field vendor profiles, AI risk assessment across financial, operational, compliance, and reputational dimensions, purchase order creation with auto-approval thresholds, contract tracking with renewal alerts, vendor performance reviews with 4-category scoring, spend analytics with daily automated snapshots, compliance document management with expiry monitoring, diversity certification tracking, and full CSV/JSON export. Pricing from $29/mo compared to $50K+/yr for SAP Ariba and $30K+/yr for Coupa.</p></div></noscript>
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>

        {/* Hero */}
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Echo Vendor Manager
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>
            AI-powered vendor lifecycle management — from onboarding to performance review.
            Risk assessment, purchase orders, contracts, compliance, and spend analytics in one platform.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=vendor-manager&tier=starter" style={{ padding: '14px 32px', background: '#10b981', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Start Free Trial
            </a>
            <a href="#pricing" style={{ padding: '14px 32px', border: '2px solid #10b981', color: '#10b981', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Everything You Need to Manage Vendors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#10b981' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#10b981', fontWeight: 800 }}>Echo</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>SAP Ariba</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Coupa</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Precoro</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#10b981', fontWeight: 700 }}>{row.echo}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.ariba}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.coupa}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.precoro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['50 vendors', '100 POs/month', 'Basic risk scoring', 'Spend tracking', 'CSV export', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$79', period: '/mo', features: ['500 vendors', 'Unlimited POs', 'AI risk assessment', 'Performance reviews', 'Contract management', 'Compliance tracking', 'API access', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited vendors', 'Unlimited everything', 'AI vendor analysis', 'Diversity reporting', 'Custom fields', 'Approval workflows', 'Service bindings', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? '2px solid #10b981' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ opacity: 0.6 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={`/checkout?service=vendor-manager&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? '#10b981' : 'transparent', color: plan.popular ? '#fff' : '#10b981', border: plan.popular ? 'none' : '2px solid #10b981', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (
            <details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary>
              <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </section>
      </div>
    </>
  )
}
