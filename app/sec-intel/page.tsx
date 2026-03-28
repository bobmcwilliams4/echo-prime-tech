'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

const FAQS = [
  {
    q: 'What types of SEC filings does the platform monitor?',
    a: 'We track all major SEC filing types in real time, including 10-K annual reports, 10-Q quarterly reports, 8-K current reports, Form 4 insider transactions, 13F institutional holdings, S-1 registration statements, and proxy statements. Our pipeline ingests filings within seconds of their appearance on EDGAR.',
  },
  {
    q: 'How does the insider trading detection engine work?',
    a: 'Our engine cross-references Form 4 filings with historical trading patterns, executive compensation data, and corporate event timelines. It flags anomalous clusters of insider activity — such as unusual volume, coordinated sells before earnings, or trades that deviate from established 10b5-1 plan schedules — and assigns a risk score from 1 to 100.',
  },
  {
    q: 'How quickly do real-time alerts arrive after a filing is published?',
    a: 'Alerts are delivered within 15 seconds of a filing hitting the SEC EDGAR system. You can receive notifications via webhook, email, SMS, or directly within your dashboard. Custom filters let you watch specific tickers, filing types, or insider names so you only see what matters.',
  },
  {
    q: 'What data sources power the SEC Intelligence pipeline?',
    a: 'We pull from the SEC EDGAR full-text search API, XBRL structured financial data, CUSIP/CIK cross-reference databases, institutional 13F aggregation feeds, and proprietary NLP extraction of material events from 8-K narratives. All sources are refreshed continuously with sub-minute latency.',
  },
  {
    q: 'Does the platform help with regulatory compliance requirements?',
    a: 'Yes. The compliance module tracks beneficial ownership thresholds (Section 13 reporting), short-swing profit rules (Section 16b), and Regulation FD disclosure obligations. It generates audit-ready reports that map each flagged event to the relevant SEC rule, helping compliance teams respond faster and reduce regulatory risk.',
  },
  {
    q: 'Can I integrate SEC Intelligence data with my trading platform or analytics tools?',
    a: 'Absolutely. We offer a REST API and WebSocket feed that deliver structured filing data, parsed financials, and alert events in JSON format. Pre-built connectors are available for Bloomberg Terminal, Alpaca, Interactive Brokers, and custom Python/Node.js clients. API keys are provisioned instantly from your dashboard.',
  },
];

export default function SecIntelPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>SEC Intelligence - Echo Prime Technologies</h1>
          <p>Real-time SEC filing surveillance, insider trading detection, and compliance analytics powered by AI-driven pipelines. Monitor 10-K, 10-Q, 8-K, Form 4, and 13F filings with sub-15-second latency. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'SEC Intel', href: '/sec-intel' }]} />
      <FaqSchema faqs={FAQS} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/engines" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/services" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Services</Link>
          <Link href="/security" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Security</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto animate-fade-up">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          SEC Intelligence
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Real-time SEC filing surveillance, insider trading detection, and compliance analytics — powered by AI-driven pipelines that never sleep.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Started
          </Link>
          <Link href="/pricing" className="px-6 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Filing Monitor', desc: 'Track 10-K, 10-Q, 8-K, Form 4, 13F, and every other SEC filing type in real time with sub-15-second latency.' },
            { title: 'Insider Detection', desc: 'AI-powered anomaly scoring on insider transactions — flagging unusual clusters, timing deviations, and coordinated activity.' },
            { title: 'Compliance Engine', desc: 'Automated Section 13, Section 16b, and Reg FD compliance tracking with audit-ready reporting.' },
            { title: 'Real-Time Alerts', desc: 'Webhook, email, and SMS alerts triggered within seconds. Filter by ticker, filing type, insider, or custom criteria.' },
            { title: 'XBRL Analytics', desc: 'Structured financial data extraction from XBRL filings — revenue, EPS, debt ratios — ready for analysis.' },
            { title: 'API & Integrations', desc: 'REST API and WebSocket feeds with pre-built connectors for Bloomberg, Alpaca, IBKR, and custom platforms.' },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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

      {/* Footer CTA */}
      <section className="py-16 px-6 text-center">
        <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
        </p>
      </section>
    </div>
  );
}
