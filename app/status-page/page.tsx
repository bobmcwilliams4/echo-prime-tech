'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'M', title: 'Uptime Monitoring', desc: 'Monitor HTTP, TCP, and DNS endpoints with configurable intervals from 30 seconds' },
  { icon: 'P', title: 'Public Status Page', desc: 'Beautiful, branded status page with your logo, colors, and custom domain' },
  { icon: 'I', title: 'Incident Management', desc: 'Create, update, and resolve incidents with real-time timeline updates' },
  { icon: 'S', title: 'Scheduled Maintenance', desc: 'Announce planned maintenance windows with auto start/end and subscriber alerts' },
  { icon: 'N', title: 'Subscriber Notifications', desc: 'Email, SMS, and webhook notifications when services go down or incidents are created' },
  { icon: 'H', title: 'Uptime History', desc: '90-day uptime history with response time graphs and SLA compliance tracking' },
  { icon: 'G', title: 'Component Groups', desc: 'Organize services into groups — API, Website, Database, Third-Party, etc.' },
  { icon: 'A', title: 'API-First', desc: 'Full REST API for creating monitors, updating status, and managing incidents programmatically' },
  { icon: 'W', title: 'Webhook Alerts', desc: 'Send alerts to Slack, Discord, Teams, PagerDuty, or any webhook endpoint' },
  { icon: 'B', title: 'Badge Embeds', desc: 'Embed uptime badges in your README, docs, or website with real-time status' },
  { icon: 'R', title: 'Response Time Tracking', desc: 'Track average, P95, and P99 response times for every monitored endpoint' },
  { icon: 'C', title: 'Custom Domains', desc: 'Use your own domain (status.yourcompany.com) with free SSL certificate' },
];

const COMPARE = [
  ['Feature', 'Echo Status', 'StatusPage.io', 'BetterUptime'],
  ['Monitors', 'Unlimited', '10 (Starter)', '10 (Basic)'],
  ['Check interval', '30 seconds', '5 minutes', '3 minutes'],
  ['Public status page', 'Yes', 'Yes', 'Yes'],
  ['Custom domain', 'All plans', 'Business+', 'Business+'],
  ['Incident management', 'Yes', 'Yes', 'Yes'],
  ['Scheduled maintenance', 'Yes', 'Yes', 'Yes'],
  ['Email notifications', 'Yes', 'Yes', 'Yes'],
  ['Webhook alerts', 'Yes', 'Business+', 'Yes'],
  ['Uptime badges', 'Yes', 'Yes', 'Yes'],
  ['Response time tracking', 'Yes', 'Yes', 'Yes'],
  ['API access', 'All plans', 'All plans', 'All plans'],
  ['Starting price', '$9/mo', '$29/mo', '$20/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$9', per: '/mo', features: ['10 monitors', '1-minute checks', 'Public status page', 'Email alerts', 'Incident management', '90-day history'] },
  { name: 'Pro', price: '$29', per: '/mo', features: ['50 monitors', '30-second checks', 'Custom domain', 'Webhook alerts (Slack/Discord)', 'Scheduled maintenance', 'Priority support'], popular: true },
  { name: 'Business', price: '$79', per: '/mo', features: ['Unlimited monitors', '30-second checks', 'SMS notifications', 'Multiple status pages', 'SLA compliance reports', 'Dedicated support'] },
];

const FAQS = [
  { q: 'What can I monitor?', a: 'HTTP endpoints (websites, APIs), TCP ports, DNS records, SSL certificates, and cron jobs. Each monitor checks at configurable intervals from 30 seconds to 30 minutes. Multi-region checks detect localized outages.' },
  { q: 'How are subscribers notified?', a: 'Email, webhook, and Slack notifications when incidents are created, updated, or resolved. Subscribers manage their own preferences. You can also post updates to your public status page in real time.' },
  { q: 'Can I customize the status page?', a: 'Custom domain, logo, colors, and layout. Status pages are designed to match your brand. Include maintenance schedules, incident history, and uptime graphs.' },
  { q: 'What uptime metrics are shown?', a: '90-day uptime percentage, average response time, and incident history per component. Grouped components let you organize monitors by service, region, or team.' },
  { q: 'How do maintenance windows work?', a: 'Schedule maintenance in advance with start/end times and affected components. Subscribers are notified before maintenance begins. During the window, status shows "Under Maintenance" instead of triggering incident alerts.' },
  { q: 'Is there an API?', a: 'Full REST API for managing monitors, incidents, subscribers, and metrics programmatically. Integrate with your CI/CD pipeline to auto-create maintenance windows during deployments.' },
];

export default function StatusPagePage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Status Page — Uptime Monitoring & Public Status Pages</h1><p>Beautiful public status pages with real-time uptime monitoring. Features include HTTP, TCP, and DNS endpoint monitoring with configurable intervals from 30 seconds, branded public status pages with custom domain support, incident management with real-time timeline updates, scheduled maintenance windows with subscriber alerts, email, SMS, and webhook notifications, 90-day uptime history with response time graphs, component grouping for API, website, and database services, REST API for programmatic management, uptime badge embeds, P95 and P99 response time tracking, and free SSL certificates. Pricing from $9/mo compared to $29/mo for StatusPage.io.</p></div></noscript>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Status Page', href: '/status-page' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Status Page</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Beautiful public status pages. Real-time uptime monitoring.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=status-page&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Live Demo Banner */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>See It Live</h3>
          <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Our own status page is built with Echo Status Page</p>
          <a href="https://echo-status-page.bmcii1976.workers.dev" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>View Live Status Page</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for Uptime Transparency</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell === 'Unlimited' || cell.startsWith('All') || cell.startsWith('30')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=status-page&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Show Your Uptime?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Launch a beautiful status page for your customers in minutes.</p>
        <TrialCTA serviceId="echo-status-page" tier="starter" productName="Echo Status Page" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
