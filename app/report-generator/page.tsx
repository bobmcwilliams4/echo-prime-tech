'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO REPORT GENERATOR — AI-Powered Professional Report Pipeline
   Product page: hero, features, how-it-works, comparison, pricing, FAQ, footer CTA
   Backend: echo-report-generator.bmcii1976.workers.dev (8 endpoints, 2 D1 tables, v1.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Engine-Backed Intelligence', desc: 'Queries are matched against 5,500+ engines and 630K+ doctrine blocks. Every answer is grounded in real IRC sections, case law, NIST frameworks, and industry standards — never hallucinated.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { title: 'Professional PDF Reports', desc: 'Branded cover pages, executive summaries, reasoning chains, authority tables, risk assessments, and action items. Client-side PDF generation via html2pdf.js — zero server cost.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Two Report Modes', desc: 'DEFENSE mode matches doctrines in ~500ms for quick lookups. MEMO mode engages Claude LLM reasoning for ~30s expert-level analysis with adversary positions and appeals strategies.', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
  { title: 'Domain Detection', desc: '19 domain regex patterns auto-detect when a query should trigger engine analysis. Tax, legal, oilfield, cybersecurity, medical, engineering — the system knows which engine to ask.', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  { title: 'Chat Integration', desc: 'POST /chat/should-query-engine tells any chat widget when a user question needs engine backing. Intent classification + domain detection ensures only expert queries go to engines.', icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' },
  { title: 'Token-Based Sharing', desc: 'Every report gets a unique access token. Share reports via URL with view tracking and download counts. No login required for recipients — just the token.', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-6.364-6.364L4.5 8.688a4.5 4.5 0 006.364 6.364l4.5-4.5' },
  { title: 'Authority Citations', desc: 'Every doctrine block includes real IRC sections, case law references, NIST frameworks, API standards, and industry regulations. Fully auditable and defensible in professional contexts.', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { title: 'Risk Assessment', desc: 'Each report includes confidence levels, adversary positions, appeals strategies, and counter-arguments. Know exactly how defensible your position is before committing.', icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { title: 'R2 Cloud Storage', desc: 'All generated reports are stored in Cloudflare R2 with organized tenant/year/month/type paths. Retrieve any historical report instantly via its unique slug.', icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z' },
  { title: 'Batch Report Generation', desc: 'Generate multiple reports from a list of queries. Perfect for tax season, audit preparation, compliance reviews, or due diligence packages.', icon: 'M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-13.5-3h13.5M4.5 9.878a2.25 2.25 0 00-1.883 2.248v.882a2.25 2.25 0 001.883 2.248M4.5 9.878h15m-15 5.378h15M19.5 9.878a2.25 2.25 0 011.883 2.248v.882a2.25 2.25 0 01-1.883 2.248' },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Ask a Question', desc: 'Type any domain-specific question. The system auto-detects the relevant domain (tax, legal, cyber, oilfield, etc.).' },
  { step: '2', title: 'Engine Matching', desc: 'Your query hits the Engine Runtime which searches 5,500+ engines and 630K+ doctrine blocks for relevant expertise.' },
  { step: '3', title: 'Report Assembly', desc: 'Matched doctrines are assembled into a branded HTML report with cover page, executive summary, authority table, and action items.' },
  { step: '4', title: 'Download & Share', desc: 'Generate a PDF with one click. Share via token-based URL. Track views and downloads.' },
];

const COMPARISON = [
  { feature: 'Doctrine-backed answers', echo: true, westlaw: 'Partial', lexis: 'Partial', chatgpt: false },
  { feature: 'Real authority citations', echo: true, westlaw: true, lexis: true, chatgpt: false },
  { feature: 'Branded PDF reports', echo: true, westlaw: true, lexis: true, chatgpt: false },
  { feature: '19 auto-detected domains', echo: true, westlaw: 'Legal only', lexis: 'Legal only', chatgpt: 'General' },
  { feature: 'Adversary positions', echo: true, westlaw: false, lexis: false, chatgpt: false },
  { feature: 'Appeals strategies', echo: true, westlaw: false, lexis: false, chatgpt: false },
  { feature: 'Risk assessment scoring', echo: true, westlaw: false, lexis: false, chatgpt: false },
  { feature: 'Token-based sharing', echo: true, westlaw: false, lexis: false, chatgpt: 'Link sharing' },
  { feature: 'Chat widget integration', echo: true, westlaw: false, lexis: false, chatgpt: 'API only' },
  { feature: 'R2 cloud storage', echo: true, westlaw: 'Own cloud', lexis: 'Own cloud', chatgpt: false },
  { feature: 'Monthly cost', echo: '$29', westlaw: '$400+', lexis: '$350+', chatgpt: '$20' },
  { feature: 'API access', echo: '8 endpoints', westlaw: 'Enterprise', lexis: 'Enterprise', chatgpt: 'API only' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    desc: 'For individuals needing expert reports',
    features: ['50 reports/month', 'DEFENSE mode (~500ms)', '19 domain auto-detection', 'PDF generation', 'Token-based sharing', 'View/download tracking'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/mo',
    desc: 'Full intelligence reporting suite',
    features: ['500 reports/month', 'DEFENSE + MEMO modes', 'Claude LLM reasoning (~30s)', 'Adversary positions', 'Appeals strategies', 'Risk assessments', 'Batch generation', 'API access (8 endpoints)', 'R2 cloud storage'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$349',
    period: '/mo',
    desc: 'High-volume professional reporting',
    features: ['Unlimited reports', 'Everything in Professional', 'Custom branding', 'White-label PDFs', 'Dedicated support', 'Priority engine access', 'Custom domain patterns', 'Webhook notifications', 'Shared Brain integration'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  { q: 'How is this different from ChatGPT generating reports?', a: 'ChatGPT generates answers from its training data, which can hallucinate citations. Echo Report Generator queries 5,500+ engines containing 630K+ real doctrine blocks with verified IRC sections, case law, NIST frameworks, and industry standards. Every citation is real and auditable.' },
  { q: 'What domains are supported?', a: 'The system auto-detects 19 domains: tax, legal, oilfield, cybersecurity, medical, engineering, drilling, production, environmental, real estate, business, finance, insurance, compliance, safety, construction, mechanical, automotive, and aviation. Each domain has specialized engines with expert-level doctrines.' },
  { q: 'What is the difference between DEFENSE and MEMO modes?', a: 'DEFENSE mode matches your query directly against doctrine blocks in ~500ms — fast lookups for specific questions. MEMO mode engages Claude AI to synthesize a comprehensive expert analysis in ~30s, including adversary positions, appeals strategies, and cross-domain reasoning.' },
  { q: 'Can I embed report generation in my own app?', a: 'Yes. The API has 8 endpoints including POST /report/from-query for the full pipeline and POST /chat/should-query-engine for detecting when a chat message needs engine backing. Integrate with any frontend in minutes.' },
  { q: 'How are reports shared?', a: 'Every report gets a unique token-based URL. Recipients can view the full HTML report without logging in. View counts and download events are tracked. Reports are stored in Cloudflare R2 for instant retrieval.' },
  { q: 'Is the data secure?', a: 'Reports are stored in your dedicated R2 bucket with token-based access control. No report is publicly indexed. The Worker runs on Cloudflare\'s global edge network with encryption at rest and in transit.' },
];

export default function ReportGeneratorPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Report Generator', href: '/report-generator' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>5,500+ Engines</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>630K+ Doctrines</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>19 Domains</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>PDF Export</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          <span className="gradient-text">Intelligence Reports</span><br />Backed by Real Doctrine
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Ask any question across tax, legal, oilfield, cybersecurity, and 15 more domains. Get professional PDF reports with verified citations, risk assessments, adversary positions, and actionable recommendations.
        </p>
        <div className="flex gap-4 justify-center animate-fade-up-delay-2">
          <Link href="/checkout?service=report-generator&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Generate Your First Report</Link>
          <Link href="/sentinel" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>Try Sentinel AI</Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Intelligence Engines', value: '5,500+' },
            { label: 'Doctrine Blocks', value: '630K+' },
            { label: 'Auto-Detected Domains', value: '19' },
            { label: 'DEFENSE Mode Latency', value: '~500ms' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Professional-Grade Report Intelligence</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--ept-border)` }}>
                <th className="text-left p-3" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                <th className="text-center p-3 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Reports</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>Westlaw</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>LexisNexis</th>
                <th className="text-center p-3" style={{ color: 'var(--ept-text-muted)' }}>ChatGPT</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid var(--ept-border)` }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.westlaw, row.lexis, row.chatgpt].map((val, j) => (
                    <td key={j} className="text-center p-3">
                      {val === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : val === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-muted)' }}>{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING.map((p) => (
            <div key={p.name} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {p.popular && <div className="text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{p.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=report-generator&tier=${p.name.toLowerCase()}`} className="block text-center w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-text)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button className="w-full text-left p-5 flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{faq.q}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Guessing. Start Knowing.</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>5,500+ engines. 630K+ doctrines. Professional reports backed by real authority — not AI hallucinations.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout?service=report-generator&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
          <Link href="/sentinel" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>Try Sentinel AI</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
