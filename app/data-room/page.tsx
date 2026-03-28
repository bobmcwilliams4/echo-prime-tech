'use client'

import { useTheme } from '../../lib/theme-context'
import BreadcrumbSchema from '../../components/BreadcrumbSchema'
import TrialCTA from '@/components/TrialCTA'

function FaqSchema() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is a virtual data room?', acceptedAnswer: { '@type': 'Answer', text: 'A virtual data room (VDR) is a secure online repository for sharing confidential documents during M&A transactions, fundraising rounds, due diligence, and other sensitive business processes.' } },
      { '@type': 'Question', name: 'How does Echo Data Room compare to Intralinks or Datasite?', acceptedAnswer: { '@type': 'Answer', text: 'Echo Data Room provides enterprise-grade security features — granular permissions, NDA tracking, audit trails, and watermarking — plus AI-powered document analysis and Q&A suggestions, at a fraction of the cost of legacy VDR providers.' } },
      { '@type': 'Question', name: 'Is my data secure?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Documents are stored in Cloudflare R2 with encryption at rest and in transit. Access is controlled via granular per-user, per-document permissions with full audit logging of every view, download, and action.' } },
      { '@type': 'Question', name: 'Can I require NDAs before document access?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Rooms can require NDA signatures before granting access. Digital NDA records include signer name, email, company, IP address, and timestamp for legal compliance.' } },
      { '@type': 'Question', name: 'What AI features are included?', acceptedAnswer: { '@type': 'Answer', text: 'AI-powered document summarization for due diligence, completeness analysis of your document set, suggested answers for Q&A threads, and automatic document tagging and categorization.' } },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

export default function DataRoomPage() {
  const { isDark } = useTheme()
  const dark = isDark

  const features = [
    { icon: '🔐', title: 'Granular Permissions', desc: 'Control view, download, print, upload, and comment access per user per document. Folder-level restrictions and expiring access.' },
    { icon: '📝', title: 'NDA Tracking', desc: 'Require digital NDA signatures before granting room access. Full legal records with signer details, IP addresses, and timestamps.' },
    { icon: '📋', title: 'Complete Audit Trail', desc: 'Every document view, download, login, permission change, and Q&A interaction is logged with user, timestamp, and IP address.' },
    { icon: '🤖', title: 'AI Due Diligence', desc: 'AI analyzes your document set for completeness, identifies missing categories, flags risks, and recommends next steps.' },
    { icon: '💬', title: 'Q&A Module', desc: 'Structured question-and-answer threads tied to specific documents. AI suggests answers to accelerate due diligence.' },
    { icon: '🔗', title: 'Secure Access Links', desc: 'Generate expiring, usage-limited invitation links with configurable permissions. Require email verification and NDA acceptance.' },
    { icon: '📂', title: 'Folder Hierarchy', desc: 'Organize documents in nested folders with drag-and-drop ordering. Version control with change notes for every update.' },
    { icon: '💧', title: 'Dynamic Watermarking', desc: 'Automatically watermark viewed documents with viewer name and timestamp to prevent unauthorized sharing.' },
    { icon: '📊', title: 'Engagement Analytics', desc: 'Track who viewed what, when, and for how long. Daily analytics dashboards with visitor, view, and download metrics.' },
    { icon: '📄', title: 'Document Versioning', desc: 'Upload new versions with change notes while preserving complete version history. Always know which version is current.' },
    { icon: '🏷️', title: 'AI Auto-Tagging', desc: 'AI automatically categorizes and tags uploaded documents for faster organization and searchability.' },
    { icon: '📤', title: 'Export & Reporting', desc: 'Export audit logs, document indexes, and NDA records as CSV or JSON for compliance and reporting.' },
  ]

  const comparison = [
    { feature: 'Granular Permissions', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'NDA Tracking', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'Full Audit Trail', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'AI Document Analysis', echo: true, intralinks: false, datasite: false, firmex: false },
    { feature: 'AI Q&A Suggestions', echo: true, intralinks: false, datasite: false, firmex: false },
    { feature: 'AI Due Diligence Check', echo: true, intralinks: false, datasite: false, firmex: false },
    { feature: 'Dynamic Watermarking', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'Expiring Access Links', echo: true, intralinks: true, datasite: true, firmex: false },
    { feature: 'Document Versioning', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'Q&A Module', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'Engagement Analytics', echo: true, intralinks: true, datasite: true, firmex: false },
    { feature: 'CSV/JSON Export', echo: true, intralinks: true, datasite: true, firmex: true },
    { feature: 'Zero Infrastructure', echo: true, intralinks: false, datasite: false, firmex: false },
    { feature: 'API Access', echo: true, intralinks: false, datasite: false, firmex: false },
    { feature: 'Starting Price', echo: '$49/mo', intralinks: '$15K+/deal', datasite: '$10K+/deal', firmex: '$5K+/deal' },
  ]

  const tiers = [
    { name: 'Starter', price: 49, rooms: '3', storage: '10 GB', features: ['3 active rooms', '10 GB storage', 'Granular permissions', 'NDA tracking', 'Full audit trail', 'Q&A module', 'Expiring access links', 'Email support'] },
    { name: 'Professional', price: 149, rooms: '25', storage: '100 GB', features: ['Everything in Starter', '25 active rooms', '100 GB storage', 'AI document analysis', 'AI Q&A suggestions', 'Dynamic watermarking', 'Engagement analytics', 'Document versioning', 'CSV/JSON export', 'Priority support'] },
    { name: 'Enterprise', price: 399, rooms: 'Unlimited', storage: '1 TB', features: ['Everything in Professional', 'Unlimited rooms', '1 TB storage', 'AI due diligence checks', 'Custom watermarks', 'Custom NDA templates', 'API access', 'SSO integration', 'White-label branding', 'Dedicated account manager'] },
  ]

  const faqs = [
    { q: 'What is a virtual data room?', a: 'A virtual data room (VDR) is a secure online repository for sharing confidential documents during M&A transactions, fundraising, due diligence, and other sensitive processes.' },
    { q: 'How does it compare to Intralinks or Datasite?', a: 'Echo Data Room provides enterprise-grade security plus AI-powered analysis and Q&A — features legacy VDRs lack — at a fraction of the per-deal pricing.' },
    { q: 'Is my data secure?', a: 'Documents are stored in Cloudflare R2 with encryption at rest and in transit. Granular per-user, per-document permissions with full audit logging.' },
    { q: 'Can I require NDAs before access?', a: 'Yes. Rooms can require digital NDA signatures. Records include signer name, email, company, IP address, and timestamp.' },
    { q: 'What AI features are included?', a: 'AI document summarization, due diligence completeness analysis, Q&A answer suggestions, and automatic document tagging.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0a0a0a' : '#ffffff', color: dark ? '#e5e5e5' : '#1a1a1a' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Data Room — AI-Powered Virtual Data Room for Due Diligence</h1><p>Secure virtual data room for M&A transactions, fundraising, and due diligence. Features include granular per-user per-document permissions for view, download, print, and upload access. Digital NDA tracking with full legal records. Complete audit trail logging every document view, download, and login. AI-powered due diligence analysis for document completeness and risk identification. Structured Q&A module with AI-suggested answers. Secure expiring access links with email verification. Nested folder hierarchy with version control. Dynamic watermarking with viewer name and timestamp. Engagement analytics tracking who viewed what and for how long. Flat monthly pricing from $49/mo compared to $15K+ per deal for Intralinks.</p></div></noscript>
      <FaqSchema />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Data Room', href: '/data-room' }]} />

      <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: dark ? '#1a1a2e' : '#eef2ff', color: dark ? '#818cf8' : '#4f46e5', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          AI-Powered Virtual Data Room
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          Secure Deal Rooms with<br /><span style={{ color: '#6366f1' }}>AI Intelligence</span>
        </h1>
        <p style={{ fontSize: 18, color: dark ? '#a1a1aa' : '#6b7280', maxWidth: 650, margin: '0 auto 30px' }}>
          Share confidential documents securely. Track every view. Require NDAs. Let AI analyze your due diligence package.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/checkout?service=data-room&tier=professional" style={{ background: '#6366f1', color: '#fff', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Start Free Trial</a>
          <a href="#pricing" style={{ border: `2px solid ${dark ? '#374151' : '#d1d5db'}`, color: dark ? '#e5e5e5' : '#1a1a1a', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>View Pricing</a>
        </div>
      </section>

      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Enterprise Security Meets AI Intelligence</h2>
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
            <thead>
              <tr style={{ borderBottom: `2px solid ${dark ? '#333' : '#e5e7eb'}` }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 700 }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700, color: '#6366f1' }}>Echo</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>Intralinks</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>Datasite</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 700 }}>Firmex</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${dark ? '#262626' : '#f3f4f6'}` }}>
                  <td style={{ padding: '10px 8px' }}>{r.feature}</td>
                  {['echo', 'intralinks', 'datasite', 'firmex'].map((k) => {
                    const v = r[k as keyof typeof r]
                    return (
                      <td key={k} style={{ textAlign: 'center', padding: '10px 8px', color: typeof v === 'string' ? (k === 'echo' ? '#6366f1' : dark ? '#a1a1aa' : '#6b7280') : v ? '#10b981' : '#ef4444', fontWeight: typeof v === 'string' ? 700 : 400 }}>
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

      <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Transparent Pricing — No Per-Page Fees</h2>
        <p style={{ textAlign: 'center', color: dark ? '#a1a1aa' : '#6b7280', marginBottom: 40 }}>Legacy VDRs charge per page, per user, per deal. We charge one flat monthly fee.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{ background: dark ? '#141414' : '#fff', border: i === 1 ? '2px solid #6366f1' : `1px solid ${dark ? '#262626' : '#e5e7eb'}`, borderRadius: 16, padding: 32, position: 'relative' }}>
              {i === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', padding: '4px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: dark ? '#71717a' : '#9ca3af', marginBottom: 16 }}>{t.rooms} rooms / {t.storage}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800 }}>${t.price}</span>
                <span style={{ fontSize: 14, color: dark ? '#71717a' : '#9ca3af' }}>/month</span>
              </div>
              <a href={`/checkout?service=data-room&tier=${t.name.toLowerCase()}`} style={{ display: 'block', textAlign: 'center', background: i === 1 ? '#6366f1' : dark ? '#262626' : '#f3f4f6', color: i === 1 ? '#fff' : dark ? '#e5e5e5' : '#1a1a1a', padding: '12px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', marginBottom: 24 }}>Get Started</a>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {t.features.map((f, j) => (
                  <li key={j} style={{ padding: '6px 0', fontSize: 14, color: dark ? '#a1a1aa' : '#6b7280', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#6366f1', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
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
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Ready to Secure Your Deal Room?</h2>
        <p style={{ textAlign: 'center', color: dark ? '#a1a1aa' : '#6b7280', marginBottom: 24 }}>Start sharing documents securely in minutes. No credit card required.</p>
        <TrialCTA serviceId="echo-data-room" tier="starter" productName="Echo Data Room" />
      </section>
    </div>
  )
}
