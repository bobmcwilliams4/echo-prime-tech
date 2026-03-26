'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const FEATURES = [
  { icon: '🕵️', title: 'Real-Time Dark Web Monitoring', desc: 'Continuous surveillance across Tor networks, I2P, and dark web forums — 24/7 automated threat ingestion from 16 scraper sources.' },
  { icon: '🔑', title: 'Credential Leak Detection', desc: 'Instant alerts when employee credentials, API keys, or customer PII appear in breach dumps, paste sites, or underground markets.' },
  { icon: '🛡️', title: 'Brand Impersonation Alerts', desc: 'Detect typosquatting domains, fake social profiles, and counterfeit storefronts targeting your brand before they cause damage.' },
  { icon: '🎭', title: 'Threat Actor Profiling', desc: 'AI-generated intelligence profiles on ransomware groups, APT actors, and cybercriminal organizations targeting your sector.' },
  { icon: '📡', title: 'IOC Feed (STIX/TAXII)', desc: 'Machine-readable indicators of compromise — IPs, hashes, domains — delivered via STIX/TAXII for direct SIEM ingestion. 4,752 active IOCs.' },
  { icon: '💀', title: 'Ransomware Group Tracking', desc: 'Track 200+ active ransomware groups including victim announcements, negotiation leaks, and infrastructure changes in real time.' },
  { icon: '⚡', title: 'Data Breach Early Warning', desc: 'Get notified hours or days before breaches go public. Our sensors monitor criminal forums where stolen data is first listed.' },
  { icon: '📋', title: 'Paste Site Monitoring', desc: 'Automated scanning of Pastebin, Ghostbin, and 40+ paste services for leaked credentials, code, and sensitive internal data.' },
  { icon: '🧅', title: 'Tor Hidden Service Scanning', desc: 'Direct .onion network access to monitor hidden marketplaces, forums, and services for mentions of your organization.' },
  { icon: '👤', title: 'Executive Protection', desc: 'Personal threat monitoring for C-suite and key personnel — doxxing attempts, personal data leaks, and physical threat indicators.' },
  { icon: '🔗', title: 'Supply Chain Threat Intel', desc: 'Extend visibility to your vendor ecosystem. Detect when third-party suppliers are compromised before lateral movement reaches you.' },
  { icon: '🚨', title: 'Automated Takedown Requests', desc: 'One-click legal takedown workflows for infringing content, phishing sites, and impersonation accounts across 50+ platforms.' },
];

const COMPARISON = [
  { feature: 'Dark Web Coverage', echo: '16 scraper sources + Tor', rf: 'Broad (expensive)', fp: 'Broad (expensive)', ds: 'Moderate' },
  { feature: 'IOC Feed Format', echo: 'STIX/TAXII + REST', rf: 'STIX/TAXII', fp: 'STIX/TAXII', ds: 'REST only' },
  { feature: 'Ransomware Tracking', echo: '200+ groups', rf: '150+ groups', fp: '100+ groups', ds: '80+ groups' },
  { feature: 'Automated Takedowns', echo: 'Included', rf: 'Add-on cost', fp: 'Not available', ds: 'Add-on cost' },
  { feature: 'Executive Protection', echo: 'All tiers', rf: 'Enterprise only', fp: 'Enterprise only', ds: 'Enterprise only' },
  { feature: 'Starting Price', echo: '$149/mo', rf: '$25,000+/yr', fp: '$30,000+/yr', ds: '$20,000+/yr' },
  { feature: 'API Access', echo: 'All paid tiers', rf: 'Enterprise only', fp: 'Defender+', ds: 'Paid add-on' },
  { feature: 'SMB Accessible', echo: 'Yes', rf: 'No', fp: 'No', ds: 'No' },
];

const PRICING = [
  {
    name: 'Monitor',
    price: '$149',
    period: '/mo',
    desc: 'Essential dark web visibility for growing businesses.',
    popular: false,
    features: ['Dark web keyword monitoring', '5 brand keywords', 'Credential leak alerts', 'Weekly threat digest', 'Paste site monitoring', 'Email alerts'],
    cta: 'Start Monitoring',
  },
  {
    name: 'Defender',
    price: '$399',
    period: '/mo',
    desc: 'Full threat intelligence suite for security-conscious teams.',
    popular: true,
    features: ['Everything in Monitor', '25 brand keywords', 'IOC feed (STIX/TAXII)', 'Threat actor profiles', 'Ransomware group tracking', 'Executive protection (3 people)', 'Automated takedown requests', 'API access', 'Slack + webhook alerts'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Command',
    price: '$799',
    period: '/mo',
    desc: 'Enterprise-grade intelligence without enterprise pricing.',
    popular: false,
    features: ['Everything in Defender', 'Unlimited keywords', 'Supply chain monitoring (10 vendors)', 'Executive protection (10 people)', 'Dedicated threat analyst', 'Custom IOC rules', 'SIEM integration support', 'SLA: 1-hour alert response'],
    cta: 'Get Command',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Tailored intelligence for large organizations and MSSPs.',
    popular: false,
    features: ['Unlimited everything', 'White-label portal', 'Unlimited supply chain coverage', 'On-prem deployment option', 'Dedicated SOC integration', 'Custom scraper development', '24/7 analyst hotline', 'SLA: 15-minute response'],
    cta: 'Contact Sales',
  },
];

const FAQS = [
  {
    q: 'How does dark web monitoring actually work?',
    a: 'Our system operates 16 automated scrapers that continuously crawl Tor hidden services, I2P networks, dark web forums, paste sites, and criminal marketplaces. When your monitored keywords — brand names, email domains, executive names, or IP ranges — appear in scraped content, our AI classifies the threat severity and triggers an alert within minutes. We currently track 3,816 active threats and 3,800 intel items across these sources.',
  },
  {
    q: 'What data sources do you monitor?',
    a: 'We monitor Tor .onion sites including major dark web forums and marketplaces, I2P network services, 40+ paste sites (Pastebin, Ghostbin, etc.), criminal hacking forums, ransomware leak sites, initial access broker marketplaces, and underground credential trading channels. Our 16 scraper sources are continuously expanded as new threat infrastructure emerges.',
  },
  {
    q: 'Is this compliant with privacy regulations like GDPR and CCPA?',
    a: 'Yes. We only collect data from publicly accessible sources on the dark web — we do not access private communications or conduct any unlawful interception. Our data retention policies are GDPR-compliant, with configurable retention windows and right-to-erasure support. We are SOC 2 Type II certified and can provide compliance documentation for your audit requirements.',
  },
  {
    q: 'How do you handle false positives?',
    a: 'Our AI triage layer achieves a false positive rate below 4% by using contextual analysis alongside keyword matching. Alerts are scored on a 1-10 severity scale with the reasoning exposed. You can tune sensitivity per keyword and provide feedback on false positives — this feeds back into our model to improve accuracy for your specific context over time.',
  },
  {
    q: 'How quickly will I be notified if my credentials appear in a breach?',
    a: 'On the Defender and Command tiers, alerts are delivered within 15 minutes of detection via your configured channels (email, Slack, webhook, or SMS). Monitor tier delivers alerts within 2 hours. In our testing, we surface new credential dumps an average of 47 hours before they appear on public breach notification services like Have I Been Pwned.',
  },
  {
    q: 'Can the IOC feed integrate directly with our SIEM or firewall?',
    a: 'Yes. We deliver IOCs via standard STIX 2.1 / TAXII 2.1 protocol, making integration native with Splunk, Microsoft Sentinel, IBM QRadar, Palo Alto XSOAR, and most modern SIEM/SOAR platforms. We also expose a REST API for custom integrations. The feed contains 4,752 active IOCs including malicious IPs, file hashes, domains, and URLs, updated continuously.',
  },
];

const STATS = [
  { value: '3,816', label: 'Tracked Threats' },
  { value: '4,752', label: 'Active IOCs' },
  { value: '16', label: 'Scraper Sources' },
  { value: '3,800+', label: 'Intel Items' },
];

export default function DarkWebIntelPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Dark Web Intel', href: '/dark-web-intel' }]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Tech"
            width={140}
            height={36}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--ept-text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/checkout?service=dark-web-intel&tier=starter"
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
          style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(13,115,119,0.06)' }}>
          DARK WEB INTELLIGENCE v1.0.0
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--ept-text)' }}>
          See What Attackers See<br />
          <span style={{ color: 'var(--ept-accent)' }}>Before They Act</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered dark web monitoring, breach detection, and brand protection. 3,816 tracked threats. 4,752 IOCs. 16 scraper sources. Real-time alerts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=dark-web-intel&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <Link href="#pricing"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="p-6 rounded-xl border text-center"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Full-Spectrum Threat Intelligence
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          From credential leaks to ransomware groups — every vector covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          How We Compare
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          Enterprise-grade intelligence at a fraction of legacy vendor cost.
        </p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Prime</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Recorded Future</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Flashpoint</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Digital Shadows</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature}
                  style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)', borderTop: '1px solid var(--ept-card-border)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.rf}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.fp}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{row.ds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Transparent Pricing
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          No contracts. No per-seat fees. Cancel anytime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map(tier => (
            <div key={tier.name}
              className="p-6 rounded-xl border flex flex-col"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: tier.popular ? '0 0 0 1px var(--ept-accent)' : 'none',
              }}>
              {tier.popular && (
                <div className="text-xs font-bold px-3 py-1 rounded-full mb-4 self-start"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  MOST POPULAR
                </div>
              )}
              <div className="font-bold text-lg mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{tier.price}</span>
                <span className="text-sm mb-1" style={{ color: 'var(--ept-text-muted)' }}>{tier.period}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{tier.desc}</p>
              <ul className="flex-1 space-y-2 mb-6">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={tier.name === 'Enterprise' ? '/support' : `/checkout?service=dark-web-intel&tier=${tier.name.toLowerCase()}`}
                className="block text-center px-4 py-3 rounded-xl font-semibold text-sm"
                style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-accent)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                }}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold"
                style={{ color: 'var(--ept-text)' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ color: 'var(--ept-accent)', fontSize: '1.25rem', lineHeight: 1 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 text-center border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Your data is already on the dark web.
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          The question is whether you know about it. Start your free 14-day trial — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=dark-web-intel&tier=starter"
            className="px-8 py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <Link href="/security"
            className="px-8 py-4 rounded-xl font-semibold text-lg border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Security Suite
          </Link>
        </div>
      </section>
    </div>
  );
}
