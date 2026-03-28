'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import TrialCTA from '@/components/TrialCTA';

/*  ═══════════════════════════════════════════════════════════════════
    Echo CRM — AI-Powered Customer Relationship Management
    Backend: echo-crm.bmcii1976.workers.dev (72 endpoints, 12 D1 tables, v1.0)
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Contact Management', desc: 'Full contact database with search, filtering, lead status, custom fields, and company associations.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { title: 'Company Tracking', desc: 'Track companies with industry, size, revenue, and see all associated contacts and deals at a glance.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Deal Pipeline', desc: 'Visual pipeline board with drag-and-drop stages, probability tracking, and weighted pipeline value.', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
  { title: 'AI Lead Scoring', desc: 'Automatic lead scoring using rule-based criteria plus AI analysis via our Intelligence Engine Runtime.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Activity Tracking', desc: 'Log calls, emails, meetings, and tasks. Track upcoming activities and overdue follow-ups.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Email Event Tracking', desc: 'Webhook receiver for email opens, clicks, and bounces. Know when prospects engage with your emails.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Pipeline Analytics', desc: 'Win rate, weighted pipeline, stage conversion, and deal velocity. See your sales funnel in real-time.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Revenue Analytics', desc: 'Monthly revenue trends, average deal size, sales cycle length, and forecasting.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Bulk Import/Export', desc: 'Import up to 500 contacts at once via JSON. Export your entire contact database anytime.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { title: 'Notes & Comments', desc: 'Rich notes on contacts, companies, and deals. Full activity log with audit trail.', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { title: 'Custom Fields & Tags', desc: 'Add unlimited custom fields to contacts, companies, and deals. Organize with color-coded tags.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { title: 'Weekly AI Digest', desc: 'Monday morning cron sends a pipeline summary to Shared Brain — open deals, wins, overdue activities, new contacts.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const COMPARISON = [
  { feature: 'Price (per month)', echo: '$29', competitor1: '$45/user', competitor2: '$25/user', competitor3: '$14.90/user' },
  { feature: 'AI Lead Scoring', echo: 'Built-in', competitor1: 'Enterprise only', competitor2: 'Einstein ($$$)', competitor3: 'No' },
  { feature: 'Deal Pipeline Board', echo: 'Yes', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'Yes' },
  { feature: 'Email Event Tracking', echo: 'Yes', competitor1: 'Yes', competitor2: 'Yes', competitor3: 'Add-on' },
  { feature: 'Revenue Analytics', echo: 'All tiers', competitor1: 'Pro+', competitor2: 'Enterprise', competitor3: 'Pro' },
  { feature: 'API Access', echo: '72 endpoints', competitor1: 'Pro+', competitor2: 'Yes', competitor3: 'Pro' },
  { feature: 'Custom Fields', echo: 'Unlimited', competitor1: '1,000', competitor2: 'By edition', competitor3: 'Pro' },
  { feature: 'Setup Time', echo: '5 minutes', competitor1: '1-2 weeks', competitor2: '2-4 weeks', competitor3: '1 day' },
];

const PRICING = [
  { tier: 'Solo', price: 29, features: ['500 contacts', '1 pipeline', 'Deal board view', 'Activity tracking', 'Notes & tags', 'Contact import/export', 'Email events'], cta: 'Start Free Trial', href: '/checkout?service=crm&tier=solo', popular: false },
  { tier: 'Team', price: 79, features: ['5,000 contacts', '5 pipelines', 'AI lead scoring', 'Pipeline analytics', 'Revenue analytics', 'Custom fields', 'Weekly AI digest', 'Bulk import'], cta: 'Start Free Trial', href: '/checkout?service=crm&tier=team', popular: true },
  { tier: 'Business', price: 199, features: ['Unlimited contacts', 'Unlimited pipelines', 'Advanced AI scoring', 'Full analytics suite', 'API access (72 endpoints)', 'Priority support', 'Custom integrations', 'Data export'], cta: 'Contact Sales', href: '/checkout?service=crm&tier=business', popular: false },
];

const FAQS = [
  { q: 'How does AI lead scoring work?', a: 'Echo CRM combines rule-based scoring (you define criteria like "has email = +10 points") with AI analysis via our Intelligence Engine Runtime. The AI evaluates lead quality based on title, source, engagement history, and company association — not just demographics.' },
  { q: 'Can I import contacts from my existing CRM?', a: 'Yes. Export contacts as JSON and use our bulk import endpoint (up to 500 per batch). We handle deduplication and validation automatically.' },
  { q: 'What deal pipeline stages are available?', a: 'You create custom pipelines with as many stages as you need. Each stage has a probability percentage and "rotting days" timer so you know when deals are going stale.' },
  { q: 'How does the weekly digest work?', a: 'Every Monday at 8am UTC, Echo CRM calculates your open pipeline value, weekly wins, overdue activities, and new contacts. This summary is posted to the Shared Brain so your AI assistants have context on your sales health.' },
  { q: 'Is there a mobile app?', a: 'Echo CRM is API-first with 72 REST endpoints. Any mobile app framework can integrate directly. We also have a responsive web dashboard coming soon.' },
  { q: 'What about data security?', a: 'All data is stored in Cloudflare D1 with edge encryption. Rate limiting prevents abuse. No data leaves the Cloudflare network. We never sell or share your customer data.' },
];

export default function CRMPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'CRM', href: '/crm' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="crm-hero" className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          72 API Endpoints &middot; 12 D1 Tables &middot; AI-Powered
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Echo CRM</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>AI That Sells For You</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Stop paying $45/user/month for HubSpot. Echo CRM gives you deal pipelines, AI lead scoring, activity tracking, and revenue analytics — starting at $29/month flat.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=crm&tier=team" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>72</strong> API Endpoints</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>12</strong> D1 Tables</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>0ms</strong> Cold Start</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" data-tutorial="crm-features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Close Deals</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Echo CRM vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo CRM</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>HubSpot</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Salesforce</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Pipedrive</th>
            </tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor1}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor2}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section data-tutorial="crm-pricing" className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
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

      {/* CTA */}
      <section className="py-20 px-6 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Close More Deals?</h2>
        <p className="text-lg mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Join the teams switching from HubSpot and Salesforce to Echo CRM — faster, smarter, and 77% cheaper.</p>
        <TrialCTA serviceId="echo-crm" tier="team" productName="Echo CRM" />
      </section>
    </main>
  );
}
