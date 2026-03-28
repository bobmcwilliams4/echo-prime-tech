'use client'

import { useTheme } from '../../lib/theme-context'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TrialCTA from '@/components/TrialCTA'

function FaqSchema() {
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'What depreciation methods are supported?', acceptedAnswer: { '@type': 'Answer', text: 'Straight-line and double-declining balance methods are built in, with automatic daily depreciation calculations. MACRS support coming soon.' } },
    { '@type': 'Question', name: 'Can I track maintenance schedules?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Schedule preventive and corrective maintenance, track costs, set next-due dates, and get AI-powered condition assessments for each asset.' } },
    { '@type': 'Question', name: 'Does it support barcode/QR scanning?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Each asset can have a barcode and QR code assigned. Use any barcode scanner or phone camera to look up asset details instantly.' } },
    { '@type': 'Question', name: 'How does AI condition assessment work?', acceptedAnswer: { '@type': 'Answer', text: 'Our AI engine analyzes asset age, maintenance history, condition reports, and manufacturer data to assess current condition and recommend maintenance actions.' } },
    { '@type': 'Question', name: 'Can I track insurance policies?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Manage insurance policies, link them to specific assets, track premiums, deductibles, and coverage amounts. Get alerts before policies expire.' } },
  ] }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

export default function AssetManagerPage() {
  const { isDark } = useTheme()
  const dark = isDark

  const features = [
    { icon: '📦', title: 'Asset Registry', desc: 'Track every asset with custom fields, tags, serial numbers, manufacturers, models, and photos. Auto-generated asset tags.' },
    { icon: '📉', title: 'Depreciation Tracking', desc: 'Automatic straight-line and declining-balance depreciation with daily cron updates. Book value always current.' },
    { icon: '🔧', title: 'Maintenance Scheduling', desc: 'Schedule preventive maintenance, track costs, set next-due dates. Never miss a service interval again.' },
    { icon: '🤖', title: 'AI Condition Assessment', desc: 'AI analyzes age, maintenance history, and condition to recommend repairs and predict remaining useful life.' },
    { icon: '🏢', title: 'Location Tracking', desc: 'Track assets across buildings, floors, rooms, and GPS coordinates. Full assignment and transfer history.' },
    { icon: '🛡️', title: 'Insurance Management', desc: 'Manage policies, link to assets, track premiums and coverage. Alerts before policies expire.' },
    { icon: '📊', title: 'Portfolio Analytics', desc: 'Dashboard with total value, depreciation, by-category/location breakdowns, upcoming maintenance, and warranty alerts.' },
    { icon: '🔄', title: 'Check In/Out', desc: 'Track asset assignments with condition-before and condition-after logging. Auto-update assigned users.' },
    { icon: '💰', title: 'Valuations', desc: 'Record market valuations, book values, and replacement costs. Track value changes over time.' },
    { icon: '🗑️', title: 'Disposal Workflow', desc: 'Structured disposal process — sold, donated, recycled, or scrapped — with value capture and audit trail.' },
    { icon: '📋', title: 'AI Tax Forecast', desc: 'AI analyzes your asset portfolio to forecast depreciation impact and recommend tax-optimal strategies.' },
    { icon: '📤', title: 'Export & Reporting', desc: 'Export all assets, maintenance records, and reports as CSV or JSON. Custom field support in exports.' },
  ]

  const comparison = [
    { feature: 'Asset Registry', echo: true, assetpanda: true, snipeit: true, uptimize: true },
    { feature: 'Auto Depreciation', echo: true, assetpanda: true, snipeit: false, uptimize: true },
    { feature: 'Maintenance Scheduling', echo: true, assetpanda: false, snipeit: false, uptimize: true },
    { feature: 'AI Condition Assessment', echo: true, assetpanda: false, snipeit: false, uptimize: false },
    { feature: 'AI Tax Forecast', echo: true, assetpanda: false, snipeit: false, uptimize: false },
    { feature: 'Insurance Tracking', echo: true, assetpanda: true, snipeit: false, uptimize: false },
    { feature: 'Check In/Out', echo: true, assetpanda: true, snipeit: true, uptimize: false },
    { feature: 'Location + GPS', echo: true, assetpanda: true, snipeit: true, uptimize: true },
    { feature: 'Barcode/QR', echo: true, assetpanda: true, snipeit: true, uptimize: false },
    { feature: 'Custom Fields', echo: true, assetpanda: true, snipeit: true, uptimize: true },
    { feature: 'Valuation History', echo: true, assetpanda: false, snipeit: false, uptimize: true },
    { feature: 'API Access', echo: true, assetpanda: true, snipeit: true, uptimize: false },
    { feature: 'Zero Infrastructure', echo: true, assetpanda: false, snipeit: false, uptimize: false },
    { feature: 'Starting Price', echo: '$29/mo', assetpanda: '$1,500/yr', snipeit: 'Free/Self-host', uptimize: '$2,000/yr' },
  ]

  const tiers = [
    { name: 'Starter', price: 29, assets: '100', features: ['100 assets', 'Auto depreciation', 'Location tracking', 'Barcode/QR support', 'Check in/out', 'Maintenance records', 'CSV export', 'Email support'] },
    { name: 'Business', price: 79, assets: '1,000', features: ['Everything in Starter', '1,000 assets', 'AI condition assessment', 'Insurance tracking', 'Valuation history', 'Custom fields', 'Portfolio dashboard', 'API access', 'Priority support'] },
    { name: 'Enterprise', price: 199, assets: 'Unlimited', features: ['Everything in Business', 'Unlimited assets', 'AI tax forecast', 'Multi-location', 'Disposal workflows', 'Advanced analytics', 'SSO integration', 'Dedicated support'] },
  ]

  const faqs = [
    { q: 'What depreciation methods are supported?', a: 'Straight-line and double-declining balance, with automatic daily calculations via cron. MACRS support is on the roadmap.' },
    { q: 'Can I track maintenance schedules?', a: 'Yes. Schedule preventive and corrective maintenance, track costs, set next-due dates, and get AI condition assessments.' },
    { q: 'Does it support barcode/QR scanning?', a: 'Each asset can have a barcode and QR code. Use any scanner or phone camera for instant lookup.' },
    { q: 'How does AI condition assessment work?', a: 'AI analyzes asset age, maintenance history, condition reports, and manufacturer data to recommend maintenance and predict useful life.' },
    { q: 'Can I track insurance policies?', a: 'Yes. Manage policies, link to assets, track premiums/deductibles/coverage. Alerts before expiry.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0a0a0a' : '#ffffff', color: dark ? '#e5e5e5' : '#1a1a1a' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Asset Manager — AI-Powered Asset Lifecycle Management</h1><p>Track every asset with automatic depreciation, maintenance scheduling, and AI condition assessments. Features include comprehensive asset registry with custom fields, tags, serial numbers, and photos. Automatic straight-line and declining-balance depreciation with daily cron updates. Preventive maintenance scheduling with cost tracking. AI condition assessment analyzing age, maintenance history, and manufacturer data. Location tracking across buildings, floors, rooms, and GPS coordinates. Insurance policy management with expiry alerts. Portfolio analytics dashboard with total value and depreciation breakdowns. Check in/out tracking with condition logging. Market valuation history and replacement cost tracking. Structured disposal workflow. AI tax forecast for depreciation impact. Pricing from $29/mo compared to $1,500/yr for Asset Panda.</p></div></noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Asset Manager', href: '/asset-manager' }]} />
      <FaqSchema />
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: dark ? '#1a2a1a' : '#ecfdf5', color: dark ? '#f59e0b' : '#d97706', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>AI-Powered Asset Management</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          Track Every Asset.<br /><span style={{ color: '#f59e0b' }}>Depreciate Automatically.</span>
        </h1>
        <p style={{ fontSize: 18, color: dark ? '#a1a1aa' : '#6b7280', maxWidth: 650, margin: '0 auto 30px' }}>
          Asset registry, depreciation tracking, maintenance scheduling, and AI condition assessments — all in one platform.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/checkout?service=asset-manager&tier=business" style={{ background: '#f59e0b', color: '#000', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Start Free Trial</a>
          <a href="#pricing" style={{ border: `2px solid ${dark ? '#374151' : '#d1d5db'}`, color: dark ? '#e5e5e5' : '#1a1a1a', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>View Pricing</a>
        </div>
      </section>

      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Complete Asset Lifecycle Management</h2>
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

      <section style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>How We Compare</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ borderBottom: `2px solid ${dark ? '#333' : '#e5e7eb'}` }}>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Feature</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', color: '#f59e0b', fontWeight: 700 }}>Echo</th>
              <th style={{ textAlign: 'center', padding: '12px 8px' }}>Asset Panda</th>
              <th style={{ textAlign: 'center', padding: '12px 8px' }}>Snipe-IT</th>
              <th style={{ textAlign: 'center', padding: '12px 8px' }}>UpTimize</th>
            </tr></thead>
            <tbody>{comparison.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${dark ? '#262626' : '#f3f4f6'}` }}>
                <td style={{ padding: '10px 8px' }}>{r.feature}</td>
                {['echo', 'assetpanda', 'snipeit', 'uptimize'].map((k) => { const v = r[k as keyof typeof r]; return (
                  <td key={k} style={{ textAlign: 'center', padding: '10px 8px', color: typeof v === 'string' ? (k === 'echo' ? '#f59e0b' : dark ? '#a1a1aa' : '#6b7280') : v ? '#10b981' : '#ef4444', fontWeight: typeof v === 'string' ? 700 : 400 }}>{typeof v === 'string' ? v : v ? '✓' : '✗'}</td>
                ); })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Simple Pricing, Powerful Features</h2>
        <p style={{ textAlign: 'center', color: dark ? '#a1a1aa' : '#6b7280', marginBottom: 40 }}>No per-asset surcharges. No implementation fees.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{ background: dark ? '#141414' : '#fff', border: i === 1 ? '2px solid #f59e0b' : `1px solid ${dark ? '#262626' : '#e5e7eb'}`, borderRadius: 16, padding: 32, position: 'relative' }}>
              {i === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', padding: '4px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: dark ? '#71717a' : '#9ca3af', marginBottom: 16 }}>Up to {t.assets} assets</p>
              <div style={{ marginBottom: 24 }}><span style={{ fontSize: 40, fontWeight: 800 }}>${t.price}</span><span style={{ fontSize: 14, color: dark ? '#71717a' : '#9ca3af' }}>/month</span></div>
              <a href={`/checkout?service=asset-manager&tier=${t.name.toLowerCase()}`} style={{ display: 'block', textAlign: 'center', background: i === 1 ? '#f59e0b' : dark ? '#262626' : '#f3f4f6', color: i === 1 ? '#000' : dark ? '#e5e5e5' : '#1a1a1a', padding: '12px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', marginBottom: 24 }}>Get Started</a>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{t.features.map((f, j) => (
                <li key={j} style={{ padding: '6px 0', fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', display: 'flex', alignItems: 'flex-start', gap: 8 }}><span style={{ color: '#f59e0b', flexShrink: 0 }}>✓</span> {f}</li>
              ))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 20px 80px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <details key={i} style={{ borderBottom: `1px solid ${dark ? '#262626' : '#e5e7eb'}`, padding: '16px 0' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>{f.q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', lineHeight: 1.7 }}>{f.a}</p>
          </details>
        ))}
      </section>
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Ready to Track Your Assets?</h2>
        <p style={{ textAlign: 'center', color: dark ? '#a1a1aa' : '#6b7280', marginBottom: 32 }}>Start managing your asset lifecycle with a free trial.</p>
        <TrialCTA serviceId="echo-asset-manager" tier="starter" productName="Echo Asset Manager" />
      </section>
    </div>
  )
}
