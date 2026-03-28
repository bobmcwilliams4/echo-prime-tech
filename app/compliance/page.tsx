'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '🛡️', title: 'Framework Templates', desc: 'SOC2, HIPAA, GDPR, ISO 27001 with pre-built controls — one click to adopt any framework.' },
  { icon: '📋', title: 'Control Tracking', desc: 'Track implementation status across all controls with ownership, due dates, and risk levels.' },
  { icon: '📎', title: 'Evidence Collection', desc: 'Attach documents, screenshots, and audit artifacts to controls with expiration tracking.' },
  { icon: '📊', title: 'Compliance Dashboard', desc: 'Real-time compliance scoring across all frameworks with drill-down by category.' },
  { icon: '🔍', title: 'AI Gap Analysis', desc: 'AI-powered gap analysis identifies critical missing controls and prioritizes remediation.' },
  { icon: '⚠️', title: 'Risk Register', desc: 'Track risks with likelihood/impact scoring, mitigation plans, and automatic risk matrix.' },
  { icon: '📝', title: 'Policy Management', desc: 'Draft, version, approve, and track acknowledgements on compliance policies.' },
  { icon: '🏢', title: 'Vendor Management', desc: 'Track vendor risk tiers, SOC2/HIPAA/GDPR compliance status, and contract expiry.' },
  { icon: '✅', title: 'Assessment Tracking', desc: 'Plan and track internal/external audits with findings, recommendations, and scoring.' },
  { icon: '📈', title: 'Audit Readiness Score', desc: 'Know exactly how ready you are with evidence coverage and ownership metrics.' },
  { icon: '📤', title: 'Export & Reporting', desc: 'Export full compliance data as CSV or JSON for auditors and stakeholders.' },
  { icon: '🤖', title: 'AI Recommendations', desc: 'Engine-backed intelligence suggests controls, policies, and remediations for your industry.' },
];

const COMPARISON = [
  { feature: 'SOC2 Framework', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'HIPAA Framework', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'GDPR Framework', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'ISO 27001', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'AI Gap Analysis', echo: true, vanta: false, drata: false, sprinto: false },
  { feature: 'Evidence Collection', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'Risk Register', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'Vendor Management', echo: true, vanta: true, drata: true, sprinto: false },
  { feature: 'Policy Management', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'Multi-Org / Multi-Tenant', echo: true, vanta: false, drata: false, sprinto: false },
  { feature: 'Bulk Control Updates', echo: true, vanta: false, drata: false, sprinto: false },
  { feature: 'Assessment Tracking', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'CSV/JSON Export', echo: true, vanta: true, drata: true, sprinto: true },
  { feature: 'Starting Price', echo: '$49/mo', vanta: '$10K/yr', drata: '$10K/yr', sprinto: '$8K/yr' },
];

const TIERS = [
  { name: 'Starter', price: '$49', period: '/mo', desc: 'For startups beginning their compliance journey.', features: ['1 framework', 'Up to 50 controls', 'Evidence collection', 'Compliance dashboard', 'CSV export', 'Email support'] },
  { name: 'Business', price: '$149', period: '/mo', desc: 'For growing companies managing multiple frameworks.', features: ['Unlimited frameworks', 'Unlimited controls', 'AI gap analysis', 'Risk register', 'Vendor management', 'Policy management', 'Assessment tracking', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$399', period: '/mo', desc: 'For organizations with complex compliance needs.', features: ['Everything in Business', 'Multi-org / multi-tenant', 'AI recommendations engine', 'Bulk operations', 'Audit readiness scoring', 'Custom framework import', 'Dedicated account manager', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'Which compliance frameworks are included?', a: 'Echo Compliance comes with SOC2 Type II (19 controls), HIPAA Security Rule (15 controls), GDPR (15 controls), and ISO 27001:2022 (15 controls) pre-built. Enterprise plans support custom framework import.' },
  { q: 'How does the AI gap analysis work?', a: 'Our AI engine analyzes your control implementation status, evidence coverage, vendor risk, and policy state. It identifies the most critical gaps, prioritizes them by severity, and provides actionable remediation steps.' },
  { q: 'Can I manage compliance for multiple organizations?', a: 'Yes. Enterprise plans support multi-tenant compliance management — perfect for MSPs, consultancies, and holding companies managing compliance across multiple entities.' },
  { q: 'How does the audit readiness score work?', a: 'The readiness score considers control implementation percentage, evidence coverage, ownership assignment, and overall risk posture to give you a clear picture of how prepared you are for an audit.' },
  { q: 'Can I export data for my auditors?', a: 'Absolutely. Export your full compliance posture as CSV (for spreadsheets) or JSON (for integrations). The export includes all controls, evidence, risks, policies, and vendor data.' },
  { q: 'How does this compare to Vanta or Drata?', a: 'Echo Compliance provides the same framework coverage at a fraction of the cost. Plus, we include AI gap analysis, multi-org support, and bulk operations that competitors charge extra for or don\'t offer at all.' },
];

export default function CompliancePage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Compliance', href: '/compliance' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=compliance&tier=business" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          SOC2 / HIPAA / GDPR / ISO 27001
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Compliance Management,<br /><span className="gradient-text">Powered by AI</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Automate your compliance journey. Pre-built frameworks, AI-powered gap analysis,
          evidence tracking, risk registers, and audit readiness scoring — all at a fraction of
          the cost of Vanta or Drata.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=compliance&tier=business" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            See Features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Compliance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Enterprise compliance features at startup-friendly pricing.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderColor: 'var(--ept-border)' }}>
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
                <th className="py-3 px-4 font-semibold">Vanta</th>
                <th className="py-3 px-4 font-semibold">Drata</th>
                <th className="py-3 px-4 font-semibold">Sprinto</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.vanta === 'boolean' ? (row.vanta ? '✅' : '❌') : row.vanta}</td>
                  <td className="py-3 px-4 text-center">{typeof row.drata === 'boolean' ? (row.drata ? '✅' : '❌') : row.drata}</td>
                  <td className="py-3 px-4 text-center">{typeof row.sprinto === 'boolean' ? (row.sprinto ? '✅' : '❌') : row.sprinto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No hidden fees. No per-seat charges. No annual minimums.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <div key={i} className={`p-8 rounded-xl border ${t.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(t.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {t.popular && <div className="text-xs font-bold uppercase mb-4 tracking-wider" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-2xl font-bold mb-1">{t.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold">{t.price}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{t.period}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{t.desc}</p>
              <ul className="space-y-2 mb-8">
                {t.features.map((f, j) => (
                  <li key={j} className="text-sm flex items-start gap-2">
                    <span style={{ color: 'var(--ept-accent)' }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=compliance&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">Ready to Automate Compliance?</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>
          Join companies saving thousands by managing compliance with AI instead of spreadsheets.
        </p>
        <TrialCTA serviceId="echo-compliance" tier="starter" productName="Echo Compliance" />
      </section>
    </div>
  );
}
