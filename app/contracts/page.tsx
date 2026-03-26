'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Contract Templates', desc: 'Create reusable templates with variable placeholders. NDA, MSA, SOW, employment, vendor — start from proven language instead of blank pages.' },
  { title: 'Clause Library', desc: 'Build a searchable library of standard clauses with risk levels (low/medium/high). Insert pre-approved language into any contract instantly.' },
  { title: 'Version Control', desc: 'Every edit creates a new version with change summary. Compare versions, roll back to any point, and see complete revision history.' },
  { title: 'Approval Workflows', desc: 'Sequential approval chains with order-based routing. Track who approved, when, and with what comments. Block signing until all approvals pass.' },
  { title: 'E-Signatures', desc: 'Token-based signing links — no account needed. Track IP, user agent, and timestamp for audit trails. Auto-execute when all parties sign.' },
  { title: 'Contract Lifecycle', desc: 'Full status tracking: draft, review, sent, active, expired, terminated. Auto-expire on end date. Renewal notices and auto-renew support.' },
  { title: 'AI Risk Analysis', desc: 'Engine Runtime analyzes contract terms, value, counterparty, and content to identify risk factors, missing clauses, and recommendations.' },
  { title: 'AI Clause Suggestions', desc: 'Get AI-recommended clauses based on contract type. Identifies gaps in your current draft and suggests standard protective language.' },
  { title: 'Comments & Redlining', desc: 'Inline comments with section references. Mark as resolved when addressed. Complete discussion thread per contract.' },
  { title: 'Expiry Calendar', desc: 'See all contracts expiring in the next 1-6 months. Renewal reminders based on configurable notice periods. Never miss a renewal deadline.' },
  { title: 'Value Pipeline', desc: 'Track total contract value by status: drafts, in review, active, expired. Know your pipeline and active commitment at a glance.' },
  { title: 'Contact Management', desc: 'Maintain a database of counterparties with company, role, email, phone. Link contacts to contracts for quick access and history.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', docusign: '$25/user', pandadoc: '$35/user', echo: '$19 flat' },
  { feature: 'E-Signatures', docusign: 'Yes (5/mo free)', pandadoc: 'Yes', echo: 'Unlimited' },
  { feature: 'Contract Templates', docusign: 'Yes', pandadoc: 'Yes', echo: 'Yes + variables' },
  { feature: 'Clause Library', docusign: 'No', pandadoc: 'No', echo: 'Built-in + risk levels' },
  { feature: 'Version Control', docusign: 'Basic', pandadoc: 'Yes', echo: 'Full history' },
  { feature: 'Approval Workflows', docusign: 'Enterprise', pandadoc: 'Yes', echo: 'All plans' },
  { feature: 'AI Risk Analysis', docusign: 'No', pandadoc: 'No', echo: 'Yes' },
  { feature: 'AI Clause Suggestions', docusign: 'No', pandadoc: 'No', echo: 'Yes' },
  { feature: 'Expiry Calendar', docusign: 'CLM add-on', pandadoc: 'No', echo: 'Built-in' },
  { feature: 'Auto-Expire/Renew', docusign: 'CLM add-on', pandadoc: 'No', echo: 'Built-in' },
  { feature: 'Comments', docusign: 'Yes', pandadoc: 'Yes', echo: 'Yes + resolve' },
  { feature: 'API Access', docusign: '$50+/mo', pandadoc: 'Enterprise', echo: 'All plans' },
];

export default function ContractsPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime Tech</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          AI-Powered Contract Management
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Contracts That Close.<br />Risk That Doesn&apos;t.
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Draft, negotiate, sign, and manage contracts with AI risk analysis, clause suggestions,
          e-signatures, version control, and renewal automation. Replace DocuSign + PandaDoc at 1/3 the cost.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold text-lg" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ n: '65+', l: 'API Endpoints' }, { n: '10', l: 'DB Tables' }, { n: '99.9%', l: 'Uptime (Edge)' }, { n: '$19/mo', l: 'Starting Price' }].map((s) => (
            <div key={s.l} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.n}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>End-to-End Contract Lifecycle</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>DocuSign</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>PandaDoc</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Contracts</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={r.feature} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.docusign}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.pandadoc}</td>
                  <td className="p-3 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: '$19', period: '/mo', features: ['10 contracts/mo', 'Unlimited e-signatures', 'Contract templates', 'Version control', 'Basic analytics', 'Expiry alerts'] },
            { name: 'Pro', price: '$49', period: '/mo', features: ['Unlimited contracts', 'Everything in Starter', 'Clause library', 'Approval workflows', 'AI risk analysis', 'AI clause suggestions', 'Comments & redlining', 'Priority support'], popular: true },
            { name: 'Business', price: '$129', period: '/mo', features: ['Everything in Pro', 'Multi-tenant / white-label', 'Custom integrations', 'Advanced analytics', 'API access', 'Dedicated support'] },
          ].map((p) => (
            <div key={p.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4"><span className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => <li key={f} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}
              </ul>
              <Link href="/signup" className="block text-center px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Paying Per Signature</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Get unlimited e-signatures, AI risk analysis, clause libraries, version control,
          and full contract lifecycle management for less than one DocuSign seat.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Managing Contracts</Link>
      </section>
    </div>
  );
}
