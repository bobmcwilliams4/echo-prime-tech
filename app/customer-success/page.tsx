'use client'

import { useTheme } from '../../lib/theme-context'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

function FaqSchema() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AI health scoring?', acceptedAnswer: { '@type': 'Answer', text: 'Our AI analyzes five signal categories — usage, engagement, support tickets, NPS/CSAT, and payment behavior — with configurable weights per organization to produce a real-time composite health score for every account.' } },
      { '@type': 'Question', name: 'How does it compare to Gainsight?', acceptedAnswer: { '@type': 'Answer', text: 'Echo Customer Success provides the core features that matter — health scoring, playbooks, onboarding, expansion tracking, and AI recommendations — at a fraction of Gainsight\'s enterprise pricing, with zero infrastructure to manage.' } },
      { '@type': 'Question', name: 'Can I customize health score weights?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Each organization can set custom weights for usage, engagement, support, NPS, and payment categories. Default is 30/25/20/15/10 but fully adjustable via the API.' } },
      { '@type': 'Question', name: 'Does it integrate with my existing tools?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The webhook system and REST API integrate with CRMs, support desks, billing systems, and any tool with an API. Service bindings connect to the Echo ecosystem for AI analysis and email automation.' } },
      { '@type': 'Question', name: 'What playbooks are included?', acceptedAnswer: { '@type': 'Answer', text: 'Create unlimited custom playbooks triggered by health score drops, contract expiry windows, NPS changes, usage declines, or any custom condition. Playbooks can be manual or fully automated.' } },
      { '@type': 'Question', name: 'How does churn prediction work?', acceptedAnswer: { '@type': 'Answer', text: 'Our AI engine analyzes account health trends, usage patterns, support history, and engagement signals to predict churn risk and recommend specific retention actions for each at-risk account.' } },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

export default function CustomerSuccessPage() {
  const { isDark } = useTheme()
  const dark = isDark

  const features = [
    { icon: '💓', title: 'AI Health Scoring', desc: 'Real-time composite health scores from 5 signal categories with configurable weights per organization.' },
    { icon: '🎯', title: 'Retention Playbooks', desc: 'Automated and manual playbooks triggered by health drops, contract expiry, NPS changes, or custom conditions.' },
    { icon: '🚀', title: 'Onboarding Automation', desc: 'Template-based onboarding with step tracking, auto-completion detection, and progress dashboards.' },
    { icon: '📈', title: 'Expansion Tracking', desc: 'Identify and track upsell/cross-sell opportunities with confidence scoring and ARR potential.' },
    { icon: '⚠️', title: 'Risk Alerts', desc: 'Automatic alerts when health scores cross thresholds, with severity levels and recommended actions.' },
    { icon: '🤖', title: 'AI Churn Prediction', desc: 'Engine-powered churn risk analysis with specific retention recommendations per account.' },
    { icon: '📊', title: 'NPS & CSAT Surveys', desc: 'Built-in survey collection with auto health score updates and trend analysis.' },
    { icon: '📞', title: 'Touchpoint Logging', desc: 'Track every customer interaction — calls, emails, meetings, reviews — with sentiment analysis.' },
    { icon: '👤', title: 'CSM Assignment', desc: 'Assign customer success managers to accounts with workload visibility and performance tracking.' },
    { icon: '📉', title: 'Net Revenue Retention', desc: 'Daily NRR snapshots with expansion/contraction/churn breakdowns and trend analysis.' },
    { icon: '🔄', title: 'Daily Cron Intelligence', desc: 'Automated daily health snapshots, stale account detection, and contract expiry warnings.' },
    { icon: '📤', title: 'Export & Reporting', desc: 'Export accounts, health data, and revenue metrics as CSV or JSON for any analysis tool.' },
  ]

  const comparison = [
    { feature: 'AI Health Scoring', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'Configurable Health Weights', echo: true, gainsight: true, totango: false, churnzero: false },
    { feature: 'Automated Playbooks', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'Onboarding Templates', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'AI Churn Prediction', echo: true, gainsight: true, totango: false, churnzero: true },
    { feature: 'AI Retention Recommendations', echo: true, gainsight: false, totango: false, churnzero: false },
    { feature: 'NPS/CSAT Collection', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'Expansion Tracking', echo: true, gainsight: true, totango: true, churnzero: false },
    { feature: 'Touchpoint Logging', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'Net Revenue Retention', echo: true, gainsight: true, totango: false, churnzero: false },
    { feature: 'Daily Automated Snapshots', echo: true, gainsight: false, totango: false, churnzero: false },
    { feature: 'Contract Expiry Alerts', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'CSV/JSON Export', echo: true, gainsight: true, totango: true, churnzero: true },
    { feature: 'Zero Infrastructure', echo: true, gainsight: false, totango: false, churnzero: false },
    { feature: 'Starting Price', echo: '$39/mo', gainsight: '$2,500/mo', totango: '$249/mo', churnzero: '$1,200/mo' },
  ]

  const tiers = [
    { name: 'Starter', price: 39, accounts: '50', features: ['Health scoring (5 signals)', 'Onboarding templates', 'Touchpoint logging', 'NPS/CSAT surveys', 'Risk alerts', 'CSV export', 'Email support'] },
    { name: 'Growth', price: 99, accounts: '500', features: ['Everything in Starter', 'Automated playbooks', 'Expansion tracking', 'AI churn prediction', 'CSM assignment & workload', 'NRR analytics', 'Custom health weights', 'API access', 'Priority support'] },
    { name: 'Enterprise', price: 249, accounts: 'Unlimited', features: ['Everything in Growth', 'AI retention recommendations', 'Portfolio health analysis', 'Multi-org support', 'Webhook integrations', 'Daily cron intelligence', 'Custom triggers', 'SSO & role-based access', 'Dedicated success manager'] },
  ]

  const faqs = [
    { q: 'What is AI health scoring?', a: 'Our AI analyzes five signal categories — usage, engagement, support tickets, NPS/CSAT, and payment behavior — with configurable weights per organization to produce a real-time composite health score for every account.' },
    { q: 'How does it compare to Gainsight?', a: 'Echo Customer Success provides the core features — health scoring, playbooks, onboarding, expansion tracking, and AI recommendations — at a fraction of Gainsight\'s enterprise pricing, with zero infrastructure to manage.' },
    { q: 'Can I customize health score weights?', a: 'Yes. Each organization can set custom weights for usage, engagement, support, NPS, and payment. Default is 30/25/20/15/10 but fully adjustable via API.' },
    { q: 'Does it integrate with my existing tools?', a: 'Yes. The webhook system and REST API integrate with CRMs, support desks, billing systems, and anything with an API.' },
    { q: 'What playbooks are included?', a: 'Create unlimited custom playbooks triggered by health drops, contract expiry, NPS changes, usage declines, or any custom condition. Manual or fully automated.' },
    { q: 'How does churn prediction work?', a: 'Our AI engine analyzes health trends, usage patterns, support history, and engagement signals to predict churn risk and recommend specific retention actions.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0a0a0a' : '#ffffff', color: dark ? '#e5e5e5' : '#1a1a1a' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Customer Success — AI-Powered Customer Health & Retention</h1><p>AI health scoring, automated playbooks, onboarding tracking, and churn prediction for SaaS customer success teams. Features include real-time composite health scores from 5 signal categories with configurable weights, automated retention playbooks triggered by health drops or contract expiry, template-based onboarding with step tracking and auto-completion, expansion opportunity tracking with upsell confidence scoring, automatic risk alerts with severity levels, AI-powered churn prediction with retention recommendations, NPS and CSAT survey collection, touchpoint logging with sentiment analysis, CSM assignment with workload visibility, net revenue retention analytics with daily snapshots, and CSV/JSON export. Pricing from $39/mo compared to $2,500/mo for Gainsight.</p></div></noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Customer Success', href: '/customer-success' }]} />
      <FaqSchema />

      {/* Hero */}
      <section data-tutorial="cs-hero" style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: dark ? '#1a2a1a' : '#ecfdf5', color: dark ? '#4ade80' : '#059669', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          AI-Powered Customer Success
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          Keep Customers <span style={{ color: '#10b981' }}>Healthy</span>,<br />
          Grow Revenue <span style={{ color: '#10b981' }}>Predictably</span>
        </h1>
        <p style={{ fontSize: 18, color: dark ? '#a1a1aa' : '#6b7280', maxWidth: 650, margin: '0 auto 30px' }}>
          AI health scoring, automated playbooks, onboarding tracking, and churn prediction — everything you need to retain and expand your customer base.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/checkout?service=customer-success&tier=growth" style={{ background: '#10b981', color: '#fff', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
            Start Free Trial
          </a>
          <a href="#pricing" style={{ border: `2px solid ${dark ? '#374151' : '#d1d5db'}`, color: dark ? '#e5e5e5' : '#1a1a1a', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
            View Pricing
          </a>
        </div>
      </section>

      {/* Features */}
      <section data-tutorial="cs-features" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Everything You Need to Drive Retention</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: dark ? '#141414' : '#f9fafb', border: `1px solid ${dark ? '#262626' : '#e5e7eb'}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>How We Compare</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${dark ? '#333' : '#e5e7eb'}` }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 700 }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700, color: '#10b981' }}>Echo</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>Gainsight</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>Totango</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>ChurnZero</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${dark ? '#262626' : '#f3f4f6'}` }}>
                  <td style={{ padding: '10px 8px' }}>{r.feature}</td>
                  {['echo', 'gainsight', 'totango', 'churnzero'].map((k) => {
                    const v = r[k as keyof typeof r]
                    return (
                      <td key={k} style={{ textAlign: 'center', padding: '10px 8px', color: typeof v === 'string' ? (k === 'echo' ? '#10b981' : dark ? '#a1a1aa' : '#6b7280') : v ? '#10b981' : '#ef4444', fontWeight: typeof v === 'string' ? 700 : 400 }}>
                        {typeof v === 'string' ? v : v ? '✓' : '✗'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" data-tutorial="cs-pricing" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Simple, Transparent Pricing</h2>
        <p style={{ textAlign: 'center', color: dark ? '#a1a1aa' : '#6b7280', marginBottom: 40 }}>No per-seat fees. No hidden costs. Pay for what you need.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{ background: dark ? '#141414' : '#fff', border: i === 1 ? '2px solid #10b981' : `1px solid ${dark ? '#262626' : '#e5e7eb'}`, borderRadius: 16, padding: 32, position: 'relative' }}>
              {i === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '4px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: dark ? '#71717a' : '#9ca3af', marginBottom: 16 }}>Up to {t.accounts} accounts</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800 }}>${t.price}</span>
                <span style={{ fontSize: 14, color: dark ? '#71717a' : '#9ca3af' }}>/month</span>
              </div>
              <a href={`/checkout?service=customer-success&tier=${t.name.toLowerCase()}`} style={{ display: 'block', textAlign: 'center', background: i === 1 ? '#10b981' : dark ? '#262626' : '#f3f4f6', color: i === 1 ? '#fff' : dark ? '#e5e5e5' : '#1a1a1a', padding: '12px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', marginBottom: 24 }}>
                Get Started
              </a>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.features.map((f, j) => (
                  <li key={j} style={{ padding: '6px 0', fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 20px 80px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <details key={i} style={{ borderBottom: `1px solid ${dark ? '#262626' : '#e5e7eb'}`, padding: '16px 0' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>{f.q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', lineHeight: 1.7 }}>{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  )
}
