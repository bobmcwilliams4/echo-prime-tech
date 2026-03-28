'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Landman Pipeline — AI-Powered Title Intelligence Platform
    Backend: echo-landman-pipeline.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Chain of Title Analysis', desc: 'AI traces ownership from patent to present across centuries of deed records. Identifies gaps, breaks, and clouded titles automatically.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { title: 'Run Sheet Generation', desc: 'Automated run sheets with mineral interest calculations, working interest chains, and overriding royalty details. Accuracy verified against county records.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Ownership Mapping', desc: 'Visual ownership graph showing how interests flow through conveyances, reservations, and probate proceedings. Interactive zoom and filter.', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { title: 'Gap & Risk Detection', desc: 'AI identifies missing instruments, unreleased liens, probate gaps, tax sale exposures, and other title defects. Risk-scored for severity.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { title: 'County Record Access', desc: 'Direct access to 259K+ deed records across 33+ Texas counties via ShadowGlass. Automated document retrieval and OCR processing.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Lease Analysis', desc: 'AI-powered oil and gas lease examination. Identifies retained acreage, pooling provisions, Pugh clauses, depth limitations, and shut-in provisions.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Division Order Calc', desc: 'Compute decimal interests through complex conveyance chains. Handles overriding royalties, net revenue interests, and multi-layer reservations.', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { title: 'Doctrine-Backed Intelligence', desc: 'Every answer backed by 632K+ legal doctrines from the Engine Runtime. Real IRC sections, case law, and regulatory citations — never fabricated.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Async Job Processing', desc: 'Complex title investigations run as async jobs with real-time progress updates. Poll every 3 seconds or receive webhook notifications on completion.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Water Rights Analysis', desc: 'Specialized engine for surface and produced water rights. Tracks permits, allocations, and compliance across Texas regulatory frameworks.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { title: 'Multi-Engine Orchestration', desc: 'Title queries automatically fan out to LM01-LM22 landman engines plus LG01-LG18 legal engines. Cross-domain synthesis for complete answers.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { title: 'Budget Estimation', desc: 'AI estimates title examination costs based on county, tract complexity, chain length, and instrument count. Helps landmen quote projects accurately.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const COMPARISON = [
  { feature: 'Price', echo: '$99/mo', competitor1: '$500+/mo', competitor2: '$200/user/mo', competitor3: 'Per-report' },
  { feature: 'AI Title Analysis', echo: 'Built-in (22 engines)', competitor1: 'No', competitor2: 'Basic', competitor3: 'No' },
  { feature: 'County Records', echo: '259K+ (33 counties)', competitor1: 'Manual lookup', competitor2: 'API access', competitor3: 'Manual' },
  { feature: 'Chain of Title', echo: 'Automated + AI', competitor1: 'Manual', competitor2: 'Semi-auto', competitor3: 'Manual' },
  { feature: 'Legal Doctrine Backing', echo: '632K+ doctrines', competitor1: 'None', competitor2: 'None', competitor3: 'None' },
  { feature: 'Division Order Calc', echo: 'AI-assisted', competitor1: 'Spreadsheet', competitor2: 'Yes', competitor3: 'Spreadsheet' },
  { feature: 'Water Rights', echo: 'Specialized engine', competitor1: 'No', competitor2: 'No', competitor3: 'No' },
  { feature: 'Setup Time', echo: '5 minutes', competitor1: '2-4 weeks', competitor2: '1 week', competitor3: '1 day' },
];

const PRICING = [
  { tier: 'Starter', price: 99, features: ['5 title searches/month', 'Basic chain of title', 'Run sheet generation', 'Gap detection', 'County record access', 'Email support'], cta: 'Start Free Trial', href: '/checkout?service=landman-pipeline&tier=starter', popular: false },
  { tier: 'Professional', price: 299, features: ['50 title searches/month', 'Full chain of title', 'Advanced run sheets', 'Risk scoring', 'Lease analysis engine', 'Division order calc', 'Water rights engine', 'Priority support'], cta: 'Start Free Trial', href: '/checkout?service=landman-pipeline&tier=professional', popular: true },
  { tier: 'Enterprise', price: 799, features: ['Unlimited searches', 'All 22 landman engines', 'All 18 legal engines', 'Custom county additions', 'API access', 'Bulk processing', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', href: '/checkout?service=landman-pipeline&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What counties are covered?', a: 'Currently 33+ Texas counties including Ector, Midland, Reeves, Martin, Howard, Upton, Crane, Ward, Winkler, and Loving — the heart of the Permian Basin. We\'re actively adding more counties every month via our ShadowGlass scraper network.' },
  { q: 'How accurate is the AI title analysis?', a: 'The AI is backed by 632,000+ legal doctrines across 22 landman-specific engines and 18 legal engines. Every answer includes real citations to IRC sections, case law, and regulatory frameworks. We test with a 100-question battery — 99% GOLD pass rate.' },
  { q: 'Can it handle complex mineral interest chains?', a: 'Yes. The division order calculator handles multi-layer reservations, overriding royalties, carried interests, farmout agreements, and participating area definitions. It traces ownership through probate, divorce, and corporate transfers.' },
  { q: 'How does async processing work?', a: 'Complex title investigations are submitted as async jobs. You receive a job ID immediately and can poll for progress every 3 seconds. Results include a 5-tab report: Summary, Run Sheet, Ownership Graph, Gaps & Risks, and Full Report.' },
  { q: 'Is this replacing human landmen?', a: 'No — it\'s augmenting them. The AI handles the tedious research and calculation work, while the landman focuses on judgment calls, client relationships, and courthouse runs. Think of it as giving every landman a research team of 40 engines.' },
  { q: 'What about mineral rights vs surface rights?', a: 'The pipeline handles both. Our LM13 Water Rights engine specializes in surface water rights, while the title analysis engines handle mineral rights chains. The platform understands Texas split-estate doctrine.' },
];

export default function LandmanPipelinePage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Landman Pipeline', href: '/landman-pipeline' }]} />
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

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          22 Landman Engines &middot; 259K+ Records &middot; 33+ Counties
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Landman Pipeline</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>AI Title Intelligence</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          The Permian Basin&apos;s first AI-powered title examination platform. Chain of title, run sheets, division orders, and gap detection — backed by 632K+ legal doctrines across 40 specialized engines.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=landman-pipeline&tier=professional" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/sentinel" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Try Sentinel AI</Link>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>259K+</strong> Records</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>40</strong> AI Engines</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>632K</strong> Doctrines</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Built by a Landman, For Landmen</h2>
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

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Landman Pipeline vs. Traditional Tools</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Landman Pipeline</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>TitleTrac</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>DrillingInfo</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Manual Process</th>
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

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
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

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Give Your Title Work an AI Research Team</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>40 AI engines. 632K legal doctrines. 259K county records. All working for you. Start examining titles faster today.</p>
        <Link href="/checkout?service=landman-pipeline&tier=professional" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
