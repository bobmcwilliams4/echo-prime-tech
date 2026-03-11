'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

const SERVICE_ID = 'dark-web-intel';

/* ================================================================
   FEATURE CARDS — 8 dark web intelligence capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Dark Web Monitoring',
    desc: 'Continuous crawling of .onion sites, underground marketplaces, closed forums, and Tor hidden services. Our autonomous crawlers map dark web infrastructure, track vendor activity, and index threat actor communications — operating 24/7 across 2,500+ monitored sources with automated content classification and threat relevance scoring.',
    sources: ['Tor Hidden Services', '.onion Marketplaces', 'Closed Forums', 'IRC Channels', 'Paste Sites', 'Telegram Groups'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Breach Intelligence',
    desc: 'Real-time monitoring of credential leaks, stealer log dumps, combo lists, and breach databases. When your employees\' credentials appear in a new dump — whether from a corporate breach, infostealer malware, or credential stuffing database — you know within minutes, not months. Covers 15B+ leaked records with daily ingestion of new dumps.',
    sources: ['Stealer Logs', 'Combo Lists', 'Breach Databases', 'Genesis Market', 'Russian Market', 'DeHashed'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Paste Site Surveillance',
    desc: 'Automated keyword monitoring across Pastebin, Ghostbin, Rentry, dpaste, JustPaste.it, GitHub Gists, and 30+ additional paste platforms. Custom alert rules trigger on company names, domain mentions, employee emails, internal project codenames, API keys, database connection strings, and source code fragments. Historical archive search across 500M+ pastes.',
    sources: ['Pastebin', 'Ghostbin', 'Rentry', 'GitHub Gists', 'dpaste', 'JustPaste.it'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: 'IOC Extraction & Correlation',
    desc: 'Automatic extraction and enrichment of Indicators of Compromise from all dark web sources: IP addresses, domains, file hashes (MD5/SHA1/SHA256), cryptocurrency wallet addresses, CVE references, email addresses, and MITRE ATT&CK technique IDs. Cross-correlated against threat intelligence feeds, VirusTotal, Shodan, and our proprietary knowledge graph of 312K+ nodes.',
    sources: ['IPs & Domains', 'File Hashes', 'Crypto Wallets', 'CVE IDs', 'MITRE TTPs', 'Email Addresses'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Brand Protection',
    desc: 'Proactive monitoring for mentions of your company name, registered domains, executive names, employee PII, proprietary data, and trade secrets across the entire dark web ecosystem. Detect impersonation campaigns, phishing kit sales targeting your brand, lookalike domain registrations, and unauthorized distribution of your intellectual property before they reach customers.',
    sources: ['Brand Mentions', 'Domain Spoofing', 'Exec Impersonation', 'IP Theft', 'Phishing Kits', 'Lookalike Domains'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI Threat Scoring',
    desc: 'Machine learning models trained on millions of dark web data points classify, score, and prioritize every discovered threat. Automated severity assessment (Critical/High/Medium/Low), threat actor attribution, campaign correlation, trend analysis across time, and predictive modeling for emerging attack patterns. Eliminates analyst fatigue by surfacing only what matters.',
    sources: ['ML Classification', 'Severity Scoring', 'Actor Attribution', 'Campaign Tracking', 'Trend Analysis', 'Predictive Models'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Crypto Forensics',
    desc: 'Blockchain analysis and cryptocurrency transaction tracking across Bitcoin, Ethereum, Monero, and 40+ chains. Wallet clustering, mixer/tumbler detection, dark market payment correlation, ransomware payment tracing, and attribution of funds to known threat actors. Integration with Chainalysis-equivalent heuristics for identifying laundering patterns and exchange cashout points.',
    sources: ['Bitcoin', 'Ethereum', 'Monero', 'Wallet Clustering', 'Mixer Detection', 'Exchange Tracing'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
      </svg>
    ),
    title: 'Real-Time Alerting',
    desc: 'Instant notifications via Telegram bot, SMS (Twilio), email, Discord webhook, Slack, PagerDuty, and custom webhook endpoints. Alert routing based on severity — critical findings trigger immediate multi-channel notification within 60 seconds of discovery. Configurable escalation policies, alert deduplication, and daily/weekly digest reports for trend awareness.',
    sources: ['Telegram', 'SMS', 'Email', 'Discord', 'Slack', 'PagerDuty', 'Webhooks'],
  },
];

/* ================================================================
   HOW IT WORKS — 4-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Define Your Attack Surface',
    desc: 'Tell us what to protect: company names, domains, executive names, employee email patterns, proprietary terms, API key formats, internal project codenames, and cryptocurrency wallets. We build a custom monitoring profile in under 24 hours.',
  },
  {
    step: '02',
    title: 'Crawl & Ingest',
    desc: 'Our autonomous crawler network begins scanning 2,500+ dark web sources, paste sites, breach databases, and underground forums. Initial baseline report delivered within 48 hours showing historical exposure and active threats.',
  },
  {
    step: '03',
    title: 'AI Analysis & Scoring',
    desc: 'Every discovered artifact is processed through our ML pipeline: IOC extraction, threat scoring, actor attribution, campaign correlation, and deduplication. Only actionable intelligence reaches your team — no noise, no false positives.',
  },
  {
    step: '04',
    title: 'Alert & Respond',
    desc: 'Critical findings trigger real-time alerts across your configured channels within 60 seconds. Each alert includes threat context, recommended actions, IOC data for your SIEM/SOC, and links to the source intelligence. Monthly trend reports and quarterly threat landscape briefings included.',
  },
];

/* ================================================================
   INTELLIGENCE SOURCES
   ================================================================ */
const INTEL_SOURCES = [
  { category: 'Dark Web & Tor', items: ['Tor Hidden Services (.onion)', 'Dark Web Marketplaces', 'Closed Hacking Forums', 'Ransomware Leak Sites', 'Actor Communication Channels'] },
  { category: 'Paste Sites & Code Repos', items: ['Pastebin', 'Ghostbin', 'Rentry', 'GitHub Gists', 'GitLab Snippets', 'dpaste', 'JustPaste.it'] },
  { category: 'Breach & Credential Data', items: ['Stealer Log Dumps', 'Combo Lists', 'Credential Databases', 'Genesis Market Archives', 'Russian Market Archives', 'InfoStealer Outputs'] },
  { category: 'Communication Platforms', items: ['Telegram Groups', 'Discord Servers', 'IRC Channels', 'XMPP/Jabber', 'Encrypted Messaging Intercepts'] },
  { category: 'Blockchain & Crypto', items: ['Bitcoin Blockchain', 'Ethereum Network', 'Monero (where possible)', 'Exchange Deposits', 'Mixer/Tumbler Services', 'DeFi Protocol Activity'] },
  { category: 'Threat Intelligence Feeds', items: ['VirusTotal', 'Shodan', 'MITRE ATT&CK', 'STIX/TAXII Feeds', 'OSINT Aggregators', 'Government Advisories'] },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: '2,500+', label: 'Dark Web Sources' },
  { value: '15B+', label: 'Leaked Records Indexed' },
  { value: '<60s', label: 'Alert Delivery Time' },
  { value: '12', label: 'IOC Types Extracted' },
  { value: '500M+', label: 'Paste Archive' },
  { value: '40+', label: 'Blockchains Tracked' },
  { value: '24/7', label: 'Continuous Crawling' },
  { value: '99.7%', label: 'Threat Detection Rate' },
];

/* ================================================================
   PRICING TIERS
   ================================================================ */
const PRICING = [
  {
    tier: 'Starter',
    price: 999,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      '5 monitored brands/domains',
      'Daily paste site scanning',
      'Email breach alerts',
      'Basic IOC feed (IPs, domains, hashes)',
      'Weekly digest reports',
      'Email notifications',
      'Dashboard access',
      '30-day data retention',
    ],
  },
  {
    tier: 'Professional',
    price: 1999,
    interval: 'mo',
    popular: true,
    custom: false,
    features: [
      '25 monitored brands/domains',
      'Hourly scanning (paste + forums)',
      'Real-time multi-channel alerts',
      'Full IOC database with enrichment',
      'API access (REST + webhooks)',
      'Monthly analyst reports',
      'Crypto wallet tracking (10 wallets)',
      'Breach credential monitoring',
      'MITRE ATT&CK mapping',
      '1-year data retention',
    ],
  },
  {
    tier: 'Enterprise',
    price: null,
    interval: null,
    popular: false,
    custom: true,
    features: [
      'Unlimited brands/domains',
      '.onion deep crawling',
      'Dedicated threat analyst',
      'Custom integrations (SIEM, SOAR)',
      'SLA with guaranteed response times',
      'Threat actor profiling & attribution',
      'Crypto forensics (unlimited wallets)',
      'Executive protection monitoring',
      'Quarterly threat landscape briefings',
      'Custom ML model training',
      'On-prem deployment option',
      'Unlimited data retention',
    ],
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function DarkWebIntelPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleCheckout = (tierIndex: number) => {
    const tier = PRICING[tierIndex];
    if (tier.custom) {
      window.location.href = 'mailto:bob@echo-op.com?subject=Dark%20Web%20Intelligence%20-%20Enterprise%20Inquiry';
      return;
    }
    if (!user) {
      window.location.href = `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
      return;
    }
    window.location.href = `/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/security" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Cyber Defense</Link>
          <Link href="/pentesting" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pen Testing</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* --- Hero --- */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ef4444' }} /> Dark Web Intelligence &bull; Threat Monitoring &bull; IOC Extraction
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          See What&apos;s Hidden.<br />
          Act Before It Surfaces.<br />
          <span className="gradient-text">Own the Shadows.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered dark web monitoring, breach intelligence, paste site surveillance, IOC extraction, brand protection, cryptocurrency forensics, and real-time alerting &mdash; crawling <strong>2,500+ sources</strong> across the dark web, indexing <strong>15 billion+ leaked records</strong>, and delivering actionable threat intelligence in under <strong>60 seconds</strong>.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Monitoring Now
          </Link>
          <Link href="/security" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            Need Full Cyber Defense?
          </Link>
        </div>
        <div className="mt-4">
          <ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} />
        </div>
      </section>

      {/* --- Stats Grid --- */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Feature Grid (expandable) --- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>8 Intelligence Layers</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Each layer operates independently and feeds into a unified threat intelligence pipeline. From raw dark web data to actionable alerts &mdash; fully automated, continuously running.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const isExpanded = expandedFeature === i;
            return (
              <button key={i} onClick={() => setExpandedFeature(isExpanded ? null : i)} className="text-left p-5 rounded-2xl border transition-all hover:shadow-lg" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isExpanded ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: isExpanded ? '0 0 25px var(--ept-accent-glow)' : undefined,
                gridColumn: isExpanded ? 'span 2' : undefined,
                gridRow: isExpanded ? 'span 2' : undefined,
              }}>
                <div className="text-2xl mb-3" style={{ color: 'var(--ept-accent)' }}>{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? f.desc : f.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Sources & Methods</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.sources.map((s, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- Intelligence Sources --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Intelligence Sources</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Comprehensive coverage across the dark web ecosystem &mdash; automated, categorized, and continuously expanding.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {INTEL_SOURCES.map((cat, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--ept-accent)' }}>{cat.category}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((t, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Continuous dark web intelligence tailored to your threat surface</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map((tier, i) => (
            <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              boxShadow: tier.popular ? '0 0 40px var(--ept-accent-glow)' : 'none',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
              <div className="mb-6">
                {tier.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price.toLocaleString()}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(i)} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all" style={{
                backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                color: tier.popular ? '#fff' : 'var(--ept-accent)',
                border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
              }}>
                {tier.custom ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Why Not DIY --- */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>Why Not Build It In-House?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>DIY Dark Web Monitoring</h3>
              <ul className="space-y-2">
                {[
                  'Requires Tor infrastructure expertise',
                  'OPSEC risks — your IP exposed to threat actors',
                  'No historical breach data (15B+ records)',
                  'Manual IOC extraction is error-prone',
                  'No ML scoring — drowning in noise',
                  'Legal liability managing raw dark web data',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#ef4444' }}>&#x2717;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>Echo Prime Intelligence</h3>
              <ul className="space-y-2">
                {[
                  'Fully managed — zero infrastructure to maintain',
                  'Complete OPSEC isolation from your network',
                  '15B+ historical records already indexed',
                  'Automated IOC extraction across 12 types',
                  'AI scoring eliminates 98% of noise',
                  'We handle the legal complexity',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#22c55e' }}>&#x2713;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Cross-sell --- */}
      <section className="max-w-3xl mx-auto px-6 pb-12 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Complete Your Security Stack</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Dark web intelligence feeds directly into our Cyber Defense platform. Pair with 16-layer defensive monitoring and offensive penetration testing for full-spectrum threat management.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/security" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Cyber Defense</Link>
            <Link href="/pentesting" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Pen Testing</Link>
          </div>
        </div>
      </section>

      {/* --- Threat Intelligence Engine --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Threat Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our threat intelligence doctrine library &mdash; backed by engines covering MITRE ATT&CK, OSINT, malware analysis, and dark web threat actor intelligence.</p>
          <EngineQueryPanel
            domains={['CYBER', 'MALWARE', 'REVENG', 'INTELL', 'NET', 'DFIR']}
            title="Dark Web Threat Search"
            placeholder="Ask about threat actors, IOCs, TTPs, breach intelligence..."
            exampleQueries={[
              'How do ransomware groups operate on the dark web?',
              'What IOC types indicate credential theft campaigns?',
              'Cryptocurrency mixer detection techniques',
              'Paste site monitoring for leaked API keys',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine dark web intelligence with these capabilities for comprehensive threat management.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Cyber Defense', desc: 'AI-powered threat hunting, credential vault, SIEM operations, digital forensics, and compliance automation across 16 defensive layers.', href: '/security', price: 'From $499/mo' },
            { title: 'Penetration Testing', desc: 'Offensive security engagements with 300+ attack tools, 8 C2 frameworks, and red team operators who have never failed to breach a target.', href: '/pentesting', price: 'From $2,500' },
            { title: 'Bot Factory', desc: 'Custom monitoring bots for Telegram, Discord, and social platforms. Automate threat intel distribution to your security team.', href: '/bots', price: 'From $499' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Your data is already out there.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            The average organization discovers dark web exposure 287 days after the initial leak. Our AI finds it in under 60 seconds. Get your baseline threat report within 48 hours.
          </p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Threat Assessment
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/security" className="underline" style={{ color: 'var(--ept-accent)' }}>Cyber Defense</Link> | <Link href="/pentesting" className="underline" style={{ color: 'var(--ept-accent)' }}>Pen Testing</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}
