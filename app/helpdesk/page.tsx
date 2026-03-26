'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Smart Ticket Routing', desc: 'AI auto-assigns tickets based on agent skills, workload, and availability. Round-robin, least-loaded, and skill-based assignment.' },
  { title: 'SLA Management', desc: 'Configure SLA policies per priority level. Track first-response and resolution times. Automatic breach alerts before deadlines hit.' },
  { title: 'AI Auto-Categorization', desc: 'Engine Runtime analyzes incoming tickets to auto-detect category, priority, and customer sentiment. Zero manual triage.' },
  { title: 'AI Suggested Responses', desc: 'Get intelligent response suggestions based on ticket context, conversation history, and knowledge base articles.' },
  { title: 'Knowledge Base', desc: 'Build a searchable self-service portal. Track article views and helpfulness. AI references KB articles when suggesting responses.' },
  { title: 'Multi-Channel Support', desc: 'Handle tickets from email, chat, social media, phone, and web forms — all in one unified inbox.' },
  { title: 'Ticket Board View', desc: 'Kanban-style board grouped by status (Open, Pending, In Progress, Waiting, Resolved, Closed) with priority sorting.' },
  { title: 'Canned Responses', desc: 'Pre-built response templates with keyboard shortcuts. Track usage to optimize your most effective replies.' },
  { title: 'CSAT Surveys', desc: 'Automatic satisfaction surveys after ticket resolution. Track per-agent and per-category satisfaction scores.' },
  { title: 'Automation Engine', desc: 'Create rules that auto-assign, auto-tag, auto-escalate, or auto-respond based on ticket conditions and triggers.' },
  { title: 'Merge & Link Tickets', desc: 'Merge duplicate tickets, link related issues. Full conversation history preserved across merges.' },
  { title: 'Analytics Dashboard', desc: '5 dashboards: overview, by-channel, by-agent, by-category, and 30-day trends. Track resolution times and satisfaction.' },
];

const COMPARISON = [
  { feature: 'AI Auto-Categorization', echo: true, zendesk: 'Add-on', freshdesk: 'Enterprise only' },
  { feature: 'AI Response Suggestions', echo: true, zendesk: '$50/agent extra', freshdesk: 'No' },
  { feature: 'SLA Breach Alerts', echo: true, zendesk: true, freshdesk: 'Pro+' },
  { feature: 'Knowledge Base', echo: true, zendesk: true, freshdesk: true },
  { feature: 'Multi-Channel', echo: true, zendesk: true, freshdesk: true },
  { feature: 'Automation Rules', echo: true, zendesk: 'Professional+', freshdesk: 'Pro+' },
  { feature: 'CSAT Surveys', echo: true, zendesk: true, freshdesk: 'Pro+' },
  { feature: 'Ticket Merging', echo: true, zendesk: true, freshdesk: true },
  { feature: 'Webhook Integrations', echo: true, zendesk: true, freshdesk: 'Enterprise' },
  { feature: 'Starting Price', echo: '$29/mo', zendesk: '$55/agent/mo', freshdesk: '$49/agent/mo' },
];

const PRICING = [
  { name: 'Starter', price: '$29', period: '/mo', features: ['Up to 3 agents', '500 tickets/mo', 'Email channel', 'Basic SLA', 'Knowledge base', 'Canned responses'] },
  { name: 'Professional', price: '$79', period: '/mo', features: ['Up to 10 agents', 'Unlimited tickets', 'All channels', 'Advanced SLA', 'AI categorization', 'AI suggestions', 'Automations', 'CSAT surveys', 'Analytics'] },
  { name: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited agents', 'Unlimited tickets', 'All channels', 'Custom SLA', 'Full AI suite', 'Custom automations', 'Webhooks', 'API access', 'Priority support', 'Custom branding'] },
];

const FAQS = [
  { q: 'How does AI categorization work?', a: 'When a ticket is created, our Engine Runtime analyzes the subject and description to automatically detect the category, subcategory, priority level, and customer sentiment. This eliminates manual triage and routes tickets to the right team instantly.' },
  { q: 'Can I migrate from Zendesk or Freshdesk?', a: 'Yes. Our CSV import supports up to 500 contacts per batch. We also support webhook integration so you can forward tickets from your existing system during migration.' },
  { q: 'What channels are supported?', a: 'Email, live chat, social media (Twitter, Facebook, Instagram), phone/voicemail, and web forms. All channels feed into one unified inbox.' },
  { q: 'How do SLA policies work?', a: 'You configure first-response and resolution time targets per priority level. The system automatically tracks deadlines, sends breach alerts, and reports SLA compliance metrics.' },
  { q: 'Is there a self-service portal?', a: 'Yes. The built-in knowledge base lets you publish articles that customers can search before opening tickets. AI also references these articles when suggesting agent responses.' },
  { q: 'Can I try it free?', a: 'Contact us for a 14-day free trial with full Professional features. No credit card required.' },
];

export default function HelpdeskPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI-POWERED CUSTOMER SUPPORT</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          <span className="gradient-text">Echo Helpdesk</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Smart ticketing, AI auto-responses, SLA tracking, and multi-channel support.
          Replace Zendesk at a fraction of the cost.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: '80+', label: 'API Endpoints' },
            { val: '15', label: 'Database Tables' },
            { val: '5', label: 'Analytics Dashboards' },
            { val: '6', label: 'Support Channels' },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need for World-Class Support</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Echo vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Helpdesk</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Zendesk</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Freshdesk</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-3 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo === true ? 'Included' : row.echo}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.zendesk === true ? 'Yes' : row.zendesk}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.freshdesk === true ? 'Yes' : row.freshdesk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>No per-agent fees on Starter. No hidden costs. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2 ring-[--ept-accent]' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
                {i === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="rounded-xl border p-4 group" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <span className="text-lg transition-transform group-open:rotate-45" style={{ color: 'var(--ept-text-muted)' }}>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: `1px solid var(--ept-card-border)` }}>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Transform Your Support?</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Join hundreds of businesses using Echo Helpdesk to deliver faster, smarter customer support.</p>
          <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
}
