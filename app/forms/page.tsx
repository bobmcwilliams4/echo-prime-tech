'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Drag-and-Drop Builder', desc: 'Create forms with text, number, email, select, multi-select, checkbox, date, file upload, rating, and more. JSON-based field definitions for maximum flexibility.' },
  { title: 'Quiz & Scoring', desc: 'Build scored quizzes with correct_value per field and automatic point calculation. Perfect for assessments, certifications, and lead qualification.' },
  { title: 'Conditional Logic', desc: 'Show or hide fields based on previous answers. Build branching surveys that adapt to each respondent for higher completion rates.' },
  { title: 'Multi-Tenant', desc: 'Full tenant isolation with configurable limits: max forms, max responses per form, plan-based feature gating. Perfect for SaaS white-labeling.' },
  { title: 'AI Question Suggestions', desc: 'Engine Runtime analyzes your form topic and existing fields to suggest additional questions, improving data collection quality.' },
  { title: 'AI Response Analysis', desc: 'Get AI-powered insights from collected responses — sentiment analysis, common themes, outlier detection, and actionable recommendations.' },
  { title: 'Custom Themes', desc: 'Brand every form with custom colors, fonts, logos, and CSS. Theme JSON gives you complete visual control over the respondent experience.' },
  { title: 'Webhook Integrations', desc: 'Trigger webhooks on response submission with signed payloads. Connect to Slack, email, CRMs, or any HTTP endpoint. Per-form webhook configuration.' },
  { title: 'Template Library', desc: 'Start from pre-built templates: contact forms, feedback surveys, job applications, event registrations, quizzes. Clone and customize in seconds.' },
  { title: 'Response Analytics', desc: 'Track response count, daily trends, average completion time, field-level distribution, conversion rate (views vs. completions), and quiz score distribution.' },
  { title: 'Public Share Links', desc: 'Each form gets a unique slug URL. Set start/end dates, response limits, and authentication requirements. Embeddable on any website.' },
  { title: 'CSV/JSON Export', desc: 'Export all responses with metadata, IP addresses, user agents, completion times, and scores. Ready for spreadsheet analysis or data pipelines.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', typeform: '$29/mo', google: 'Free (limits)', echo: '$9 flat' },
  { feature: 'Responses/Mo', typeform: '100', google: 'Unlimited', echo: '1,000+' },
  { feature: 'AI Question Suggestions', typeform: 'No', google: 'No', echo: 'Yes' },
  { feature: 'AI Response Analysis', typeform: 'No', google: 'No', echo: 'Yes' },
  { feature: 'Quiz Scoring', typeform: 'Yes', google: 'Basic', echo: 'Full (weighted)' },
  { feature: 'Conditional Logic', typeform: 'Yes', google: 'Basic', echo: 'Yes' },
  { feature: 'Webhooks', typeform: 'Yes', google: 'Apps Script', echo: 'Built-in (signed)' },
  { feature: 'Custom Themes', typeform: 'Yes', google: 'Limited', echo: 'Full JSON' },
  { feature: 'Template Library', typeform: 'Yes', google: 'Yes', echo: 'Yes + clone' },
  { feature: 'Multi-Tenant / White-Label', typeform: 'Enterprise only', google: 'No', echo: 'Built-in' },
  { feature: 'Response Export', typeform: 'CSV', google: 'Sheets', echo: 'CSV + JSON' },
  { feature: 'API Access', typeform: '$59+/mo', google: 'Free', echo: 'All plans' },
];

export default function FormsPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      {/* Nav */}
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          AI-Powered Forms & Surveys
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Build Smarter Forms.<br />Get Better Data.
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Create forms, surveys, quizzes, and registrations with AI-powered question suggestions,
          automatic response analysis, and real-time analytics. From contact forms to complex assessments —
          all for a fraction of what Typeform charges.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold text-lg" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '50+', l: 'API Endpoints' },
            { n: '12+', l: 'Field Types' },
            { n: '99.9%', l: 'Uptime (Edge)' },
            { n: '$9/mo', l: 'Starting Price' },
          ].map((s) => (
            <div key={s.l} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.n}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Collect Data</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Typeform</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Google Forms</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Forms</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={r.feature} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.typeform}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.google}</td>
                  <td className="p-3 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: '$9', period: '/mo', features: ['5 forms', '100 responses/form', 'All field types', 'Basic analytics', 'Custom themes', 'Public share links'] },
            { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited forms', '10,000 responses/form', 'AI question suggestions', 'AI response analysis', 'Webhooks', 'Template library', 'CSV/JSON export', 'Priority support'], popular: true },
            { name: 'Business', price: '$79', period: '/mo', features: ['Everything in Pro', 'Unlimited responses', 'White-label / multi-tenant', 'Custom integrations', 'Advanced analytics', 'API access', 'Dedicated support'] },
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

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Paying Typeform Prices for Basic Forms</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Get AI-powered form building, response analysis, quiz scoring, and real-time analytics
          at a fraction of the cost. Deploy in minutes on Cloudflare&apos;s global edge network.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Building Forms Free</Link>
      </section>
    </div>
  );
}
