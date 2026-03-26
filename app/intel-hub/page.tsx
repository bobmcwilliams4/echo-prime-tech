'use client';
import FaqSchema from '../../components/FaqSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

/* ==============================================================================
   ECHO INTEL HUB — Digital Intelligence & Monitoring Platform
   Product page: hero, features, dashboard preview, pricing, FAQ, footer CTA
   Backend: echo-intel-hub.bmcii1976.workers.dev (47+ endpoints, 13 D1 tables, v2.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Message Monitoring', desc: 'Capture SMS, iMessage, and app messages with full metadata. Flag, annotate, and search across all conversations.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'Network Traffic Analysis', desc: 'Real-time DNS and HTTP traffic capture with domain classification, bandwidth tracking, and timeline visualization.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'App Usage Intelligence', desc: 'Track app sessions across iOS and Android. See active time, open counts, background usage, and data consumption per app.', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { title: 'Contact Intelligence', desc: 'Build profiles of frequent contacts with communication frequency, relationship scoring, and anomaly detection.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Keyword Watchlist', desc: 'Define sensitive keywords and phrases. Get instant alerts when they appear in messages, searches, or browsing activity.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { title: 'Anomaly Detection', desc: 'AI-powered behavioral analysis flags unusual patterns — new contacts, late-night activity, location changes, and app installs.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { title: 'Real-Time Alerts', desc: 'Configurable push, email, and SMS alerts. Priority levels from informational to critical. Acknowledgement tracking.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Kill Switch', desc: 'Emergency data purge with one click. Instantly wipe all stored intelligence data when operational security demands it.', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  { title: 'Data Export', desc: 'Export all intelligence data as JSON with date filtering. Full audit trail, compliance-ready reports, and scheduled exports.', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'DNS App Detection', desc: 'Identify apps by their DNS footprints. Detect hidden apps, VPN usage, and encrypted messaging services automatically.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { title: 'Threat Intelligence', desc: 'Ingest IOCs (domains, IPs, hashes, emails). Auto-correlate threats with your traffic and DNS data. Real-time threat scoring.', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { title: 'Geofencing', desc: 'Create virtual perimeters with GPS coordinates. Get instant alerts when devices enter or leave zones. Haversine-accurate distance calculation.', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
  { title: 'Breach Monitoring', desc: 'Monitor email addresses and domains for data breaches. Automated breach report ingestion with severity tracking and instant alerts.', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
  { title: 'Intelligence Reports', desc: 'Daily, weekly, and threat summary reports. Risk scoring with color-coded levels. Top talkers, top domains, and trend analysis.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
];

const DASHBOARD_TABS = [
  { name: 'Messages', desc: 'Full message inbox with search, flagging, and thread view' },
  { name: 'Traffic', desc: 'Real-time network activity with domain classification' },
  { name: 'Apps', desc: 'App usage sessions with active time and data consumption' },
  { name: 'Contacts', desc: 'Contact profiles with communication frequency analysis' },
  { name: 'DNS', desc: 'DNS query log with app detection and domain categorization' },
  { name: 'Alerts', desc: 'Alert inbox with priority levels and acknowledgement' },
  { name: 'Watchlist', desc: 'Keyword and phrase monitoring configuration' },
  { name: 'Settings', desc: 'Kill switch, data retention, export, and purge controls' },
  { name: 'Threats', desc: 'IOC database with auto-correlation against your traffic' },
  { name: 'Geofences', desc: 'Virtual perimeter zones with enter/exit event history' },
  { name: 'Breaches', desc: 'Monitored emails/domains with breach report timeline' },
  { name: 'Reports', desc: 'Daily, weekly, and threat intelligence summaries' },
];

const PRICING = [
  {
    tier: 'Personal',
    price: 29.99,
    features: [
      '1 device monitored',
      'Message capture & search',
      'App usage tracking',
      'Basic anomaly alerts',
      'Contact intelligence',
      '30-day data retention',
    ],
    cta: 'Get Started',
    href: '/checkout?service=intel-hub&tier=personal',
    popular: false,
  },
  {
    tier: 'Family',
    price: 59.99,
    features: [
      'Up to 5 devices',
      'Everything in Personal',
      'Keyword watchlist (50 terms)',
      'DNS app detection',
      'Network traffic analysis',
      '90-day data retention',
      'Email + SMS alerts',
    ],
    cta: 'Start Free Trial',
    href: '/checkout?service=intel-hub&tier=family',
    popular: true,
  },
  {
    tier: 'Enterprise',
    price: 149.99,
    features: [
      'Unlimited devices',
      'Everything in Family',
      'Advanced anomaly AI',
      'Custom alert rules',
      'Scheduled exports',
      '1-year data retention',
      'Kill switch',
      'Threat intel feeds + breach monitoring',
      'Geofencing with GPS alerts',
      'API access (47+ endpoints)',
      'Daily/weekly intelligence reports',
      'Priority support',
    ],
    cta: 'Contact Sales',
    href: 'mailto:bob@echo-op.com',
    popular: false,
  },
];

const USE_CASES = [
  { title: 'Parental Monitoring', desc: 'Know what your kids are doing online. Monitor messages, apps, and contacts without being intrusive. Set keyword alerts for cyberbullying, drugs, or predatory behavior.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Corporate Security', desc: 'Monitor company devices for data leaks, unauthorized app installs, and policy violations. Full audit trail for compliance. Kill switch for lost devices.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Investigative Research', desc: 'Build communication profiles, trace contact networks, identify behavioral patterns. Export evidence-grade data with timestamps and metadata.', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
];

const FAQS = [
  { q: 'What devices are supported?', a: 'Currently iOS (via MDM profile or proxy) and any device that routes through our DNS resolver. Android support is in beta. Corporate MDM integration works with Jamf, Intune, and Mosyle.' },
  { q: 'Is this legal?', a: 'Monitoring devices you own or manage (children\'s devices, company-issued phones) is legal in most jurisdictions. You are responsible for complying with local laws. We provide consent templates for corporate deployments.' },
  { q: 'How is data stored?', a: 'All data is encrypted at rest in Cloudflare D1 and cached in KV for performance. Data never leaves Cloudflare\'s global network. You control retention periods and can purge all data instantly via the kill switch.' },
  { q: 'Can the monitored person detect it?', a: 'DNS-level monitoring is invisible to the end user. Proxy-based message capture requires a configuration profile. For parental monitoring, we recommend transparency — the platform includes age-appropriate notification templates.' },
  { q: 'What happens if I hit the kill switch?', a: 'All stored messages, traffic logs, contacts, app data, and alerts are permanently deleted within seconds. This action is irreversible. A confirmation code is required to prevent accidental activation.' },
  { q: 'How does threat intelligence work?', a: 'You can ingest indicators of compromise (IOCs) — malicious domains, IPs, file hashes, and emails. The system automatically cross-references these against your actual traffic and DNS data, creating alerts when a known threat is contacted by a monitored device.' },
  { q: 'What is geofencing used for?', a: 'Create virtual boundaries around locations (school, home, work). When a monitored device enters or leaves a zone, you get an instant alert. Uses Haversine formula for accurate GPS distance calculation.' },
  { q: 'How do intelligence reports work?', a: 'Daily reports summarize all activity: messages, traffic, DNS, alerts, and threat correlations. Weekly reports include risk scoring (LOW to CRITICAL based on alert volume and threat hits) and trend analysis. All reports are available on-demand via API.' },
];

function IntelHubContent() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Intelligence Hub', href: '/intel-hub' }]} />
      <ProductTutorialButton tutorialId="settings" productName="Intel Hub" />

      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/services" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Services</Link>
          <Link href="/checkout?service=intel-hub&tier=personal" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">Echo Intel Hub</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>Digital Intelligence & Monitoring Platform</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Monitor devices, analyze network traffic, track app usage, and detect anomalies — all from one encrypted, cloud-native dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/checkout?service=intel-hub&tier=family" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">27 API Endpoints</span>
          <span className="text-sm">8 D1 Tables</span>
          <span className="text-sm">Real-Time Alerts</span>
          <span className="text-sm">Kill Switch</span>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>8-Tab Intelligence Dashboard</h2>
        <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Every angle of digital activity in one unified view. Messages, traffic, apps, contacts, DNS, alerts, watchlist, and settings.
        </p>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex overflow-x-auto border-b" style={{ borderColor: 'var(--ept-border)' }}>
            {DASHBOARD_TABS.map((tab, i) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(i)}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors"
                style={{
                  color: activeTab === i ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  borderBottom: activeTab === i ? '2px solid var(--ept-accent)' : '2px solid transparent',
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(13,115,119,0.08)' }}>
              <span className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{DASHBOARD_TABS[activeTab].name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{DASHBOARD_TABS[activeTab].name}</h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>{DASHBOARD_TABS[activeTab].desc}</p>
            <Link
              href="https://echo-op.com/intel"
              target="_blank"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}
            >
              View Live Dashboard
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Digital Intelligence</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          From message monitoring to anomaly detection — every tool you need to understand digital activity.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built For</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Three core use cases, one platform.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={uc.icon} />
              </svg>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{uc.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="pricing">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Simple, <span className="gradient-text">Transparent</span> Pricing
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-device surprises. No data caps. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border relative"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: p.popular ? (isDark ? '0 0 40px rgba(20,184,166,0.12)' : '0 0 40px rgba(13,115,119,0.08)') : 'none',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>{p.tier}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="block w-full text-center py-3 rounded-xl font-semibold text-sm"
                style={{
                  backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent',
                  color: p.popular ? '#fff' : 'var(--ept-text-secondary)',
                  border: p.popular ? 'none' : '1px solid var(--ept-border)',
                }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Questions & Answers</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                style={{ backgroundColor: 'var(--ept-card-bg)' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{faq.q}</span>
                <svg className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Engine Query ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--ept-text)' }}>Intelligence Doctrine</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>Query our security and intelligence engines for OSINT methodologies, surveillance best practices, and digital forensics guidance.</p>
          <EngineQueryPanel
            domains={['SEC', 'CYB']}
            title="Intel Doctrine Search"
            placeholder="Ask about OSINT, digital forensics, network monitoring..."
            exampleQueries={[
              'OSINT methodology for social media investigations',
              'Network traffic analysis for anomaly detection',
              'Digital forensics evidence preservation',
              'Mobile device monitoring legal frameworks',
            ]}
            showStats
          />
        </div>
      </section>

      {/* ── Related Services ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Your Security Stack</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Pair Intel Hub with these services for full-spectrum awareness</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Dark Web Intel', desc: 'Monitor dark web marketplaces and forums for leaked credentials, brand mentions, and threat intelligence.', href: '/dark-web-intel', price: 'From $199/mo' },
            { title: 'Security & Pentesting', desc: 'Vulnerability scanning, penetration testing, and continuous security monitoring for your infrastructure.', href: '/pentesting', price: 'From $499/mo' },
            { title: 'Sentinel AI', desc: 'AI-powered threat analysis backed by 5,486+ intelligence engines with doctrine-grade reasoning.', href: '/sentinel', price: 'Free tier available' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div
          className="p-10 md:p-16 rounded-2xl border text-center"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', boxShadow: isDark ? '0 0 60px rgba(20,184,166,0.08)' : 'none' }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            See Everything. <span className="gradient-text">Miss Nothing.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Start monitoring in minutes. Full dashboard, real-time alerts, AI anomaly detection. No hardware required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/checkout?service=intel-hub&tier=family" className="px-8 py-4 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Start Free Trial</Link>
            <Link href="mailto:bob@echo-op.com" className="px-8 py-4 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function IntelHubPage() {
  return <SubscriptionGate serviceId="intel-hub"><IntelHubContent /></SubscriptionGate>;
}
