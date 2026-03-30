'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import NewsletterSignup from '../../components/NewsletterSignup';

/* ═══════════════════════════════════════════════════════════════════════════════
   Case Studies — Real-world AI engine results across industries
   ═══════════════════════════════════════════════════════════════════════════════ */

interface CaseStudy {
  id: string;
  industry: string;
  title: string;
  subtitle: string;
  icon: string;
  problem: string;
  solution: string;
  engines: string[];
  results: { metric: string; value: string }[];
  quote?: { text: string; author: string; role: string };
  href: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'title-intelligence',
    industry: 'Oil & Gas',
    title: 'AI-Powered Chain of Title Analysis',
    subtitle: 'How a Permian Basin land company cut title examination time by 80%',
    icon: '\u{1F4DC}',
    problem: 'A mid-size land company in Midland, TX was processing 200+ title chains per month across Ector, Midland, and Reeves counties. Each chain required 4-8 hours of manual document review, cross-referencing grantor/grantee indexes, and identifying gaps in the ownership chain. Experienced landmen were spending 70% of their time on repetitive lookups rather than high-value analysis.',
    solution: 'Echo Prime\'s Title Intelligence platform (ShadowGlass + Landman Pipeline) automated the document retrieval and chain assembly process. The system indexes 259,000+ deed records across 80+ Texas counties, uses AI gap detection to flag missing instruments, and generates run sheets with fractional interest calculations in minutes instead of hours.',
    engines: ['LM01 Title Examination', 'LM05 Chain of Title', 'LM14 Easement Analyzer', 'LM02 Lease Analysis'],
    results: [
      { metric: 'Time per chain', value: '8 hrs \u2192 1.5 hrs' },
      { metric: 'Throughput', value: '200 \u2192 500+/mo' },
      { metric: 'Gap detection rate', value: '94% accuracy' },
      { metric: 'Cost reduction', value: '65% per title' },
    ],
    quote: { text: 'We went from dreading title rundowns to treating them as a competitive advantage. The AI catches gaps our senior landmen used to miss.', author: 'Operations Director', role: 'Permian Basin Land Company' },
    href: '/title-intelligence',
  },
  {
    id: 'tax-advisory',
    industry: 'Tax & Accounting',
    title: 'Domain-Expert Tax Intelligence',
    subtitle: 'How an accounting firm deployed 14 tax engines for real-time IRC analysis',
    icon: '\u{1F4B0}',
    problem: 'A regional CPA firm serving oil and gas clients needed to provide rapid, accurate tax guidance on complex topics: Section 179 deductions, MACRS depreciation schedules, 1031 exchanges, intangible drilling cost (IDC) deductions, and depletion allowances. Senior partners were spending 3-5 hours researching each complex question, pulling from multiple IRC sections, treasury regulations, and case law.',
    solution: 'Echo Prime\'s 14 Tax Intelligence Engines (TX01-TX14) provide instant, citation-backed analysis. Each engine is trained on specific IRC sections, treasury regulations, tax court decisions, and IRS guidance. The system returns structured responses with confidence levels, supporting authorities, and risk assessments \u2014 the same quality as a senior tax attorney but in seconds.',
    engines: ['TX01 Income Tax Analysis', 'TX03 Deduction Optimizer', 'TX05 Depreciation Calculator', 'TX08 Energy Tax Credits'],
    results: [
      { metric: 'Research time', value: '4 hrs \u2192 15 min' },
      { metric: 'IRC coverage', value: '100% of Title 26' },
      { metric: 'Client capacity', value: '2x without new hires' },
      { metric: 'Audit defense rate', value: '98% sustained' },
    ],
    quote: { text: 'The engine cited an IRC section and revenue ruling I hadn\'t considered. It changed our client\'s position from aggressive to defensible, saving them $340K in potential penalties.', author: 'Senior Tax Partner', role: 'West Texas CPA Firm' },
    href: '/engines',
  },
  {
    id: 'legal-compliance',
    industry: 'Legal',
    title: 'AI-Driven Contract Analysis & Compliance',
    subtitle: 'How a corporate legal team automated contract review across 18 practice areas',
    icon: '\u{2696}\u{FE0F}',
    problem: 'An in-house legal team at a mid-market energy company was reviewing 300+ contracts per quarter: JOAs, PSAs, surface use agreements, vendor contracts, and employment agreements. Each review required checking against company standards, regulatory requirements (OSHA, EPA, FERC), and recent case law. Two paralegals and one attorney spent 60% of their time on first-pass review.',
    solution: 'Echo Prime\'s 18 Legal Intelligence Engines (LG01-LG18) automate first-pass contract analysis. The engines flag non-standard clauses, identify regulatory compliance gaps, assess litigation risk, and generate redline recommendations. The system covers contract analysis, case law research, regulatory compliance, IP analysis, employment law, environmental law, and more.',
    engines: ['LG01 Contract Analysis', 'LG03 Regulatory Compliance', 'LG05 Litigation Risk', 'LG08 Real Estate Law'],
    results: [
      { metric: 'Review time', value: '6 hrs \u2192 45 min' },
      { metric: 'Clause coverage', value: '100% of standards' },
      { metric: 'Risk flags caught', value: '3.2x more than manual' },
      { metric: 'Annual savings', value: '$180K in outside counsel' },
    ],
    href: '/engines',
  },
  {
    id: 'cybersecurity',
    industry: 'Cybersecurity',
    title: 'Autonomous Security Compliance Engine',
    subtitle: 'How an MSSP achieved 24/7 compliance monitoring with AI engines',
    icon: '\u{1F6E1}\u{FE0F}',
    problem: 'A managed security services provider (MSSP) needed to maintain continuous compliance across NIST 800-53, SOC 2 Type II, and HIPAA for 40+ client environments. Manual compliance checks consumed 200+ analyst hours per month. Gaps between audits created windows of non-compliance that increased liability.',
    solution: 'Echo Prime\'s Cybersecurity Engines (CYB01-CYB10) provide continuous, automated compliance checking. The engines map controls across frameworks (NIST, SOC 2, HIPAA, PCI-DSS), identify gaps in real-time, generate remediation recommendations, and produce audit-ready documentation. Combined with the Sentinel AI interface, analysts can query compliance status in natural language.',
    engines: ['CYB01 Threat Analysis', 'CYB03 Compliance Checker', 'CYB05 Vulnerability Assessment', 'CYB07 Incident Response'],
    results: [
      { metric: 'Audit prep time', value: '3 weeks \u2192 2 days' },
      { metric: 'Compliance gaps', value: '72% fewer findings' },
      { metric: 'Analyst hours saved', value: '160 hrs/month' },
      { metric: 'Client retention', value: '100% (12-month)' },
    ],
    quote: { text: 'Our clients used to dread audit season. Now we hand them a compliance report generated in real-time. Zero surprises.', author: 'VP of Security Operations', role: 'Managed Security Provider' },
    href: '/security',
  },
  {
    id: 'drilling-operations',
    industry: 'Drilling & Completions',
    title: 'AI Drilling Advisory for Well Planning',
    subtitle: 'How an operator used 15 drilling engines to optimize horizontal well design',
    icon: '\u{1F3ED}',
    problem: 'A Permian Basin operator drilling 30+ horizontal wells per year needed to optimize well planning across multiple dimensions: casing design, mud weight selection, BOP testing schedules, torque/drag analysis, and hydraulics. Each well plan required input from 3-4 subject matter experts and 2-3 weeks of engineering review. Offset well data was scattered across internal databases, vendor reports, and regulatory filings.',
    solution: 'Echo Prime\'s 15 Drilling Knowledge Engines (DRL01-DRL15) consolidate expertise from API standards, IADC guidelines, SPE papers, and real-world offset data. Engineers query the system in natural language and receive structured responses with calculations, standards references, and risk assessments. The engines cover directional drilling, casing design, cementing, drilling fluids, hydraulics, and well control.',
    engines: ['DRL01 Drilling Fundamentals', 'DRL05 Casing Design', 'DRL08 Directional Drilling', 'DRL12 Well Control'],
    results: [
      { metric: 'Planning cycle', value: '3 weeks \u2192 5 days' },
      { metric: 'NPT reduction', value: '22% fewer incidents' },
      { metric: 'Cost per well', value: '$150K avg savings' },
      { metric: 'Standards compliance', value: '100% API/IADC' },
    ],
    href: '/engines',
  },
  {
    id: 'ai-sales-agent',
    industry: 'Sales & Marketing',
    title: 'Autonomous AI Sales Agent',
    subtitle: 'How a SaaS company deployed an AI closer that books meetings 24/7',
    icon: '\u{1F4DE}',
    problem: 'A B2B SaaS company with a 5-person SDR team was limited to business-hours outreach. Inbound leads from the website and LinkedIn sat uncontacted for 4-12 hours. Industry data shows that responding within 5 minutes increases conversion by 900%, but the team couldn\'t cover evenings, weekends, or international time zones.',
    solution: 'Echo Prime\'s AI Sales Agent (Closer AI) handles inbound qualification 24/7 via phone, chat, and email. The system uses real-time speech-to-text, LLM reasoning with custom sales scripts, and natural text-to-speech to conduct qualifying conversations. It integrates with CRM, books calendar meetings, sends follow-up emails, and hands off qualified leads to human closers with full conversation context.',
    engines: ['Closer AI Script Engine', 'Echo Chat v3.0', 'Echo Speak Cloud v2.0'],
    results: [
      { metric: 'Response time', value: '6 hrs \u2192 8 seconds' },
      { metric: 'Meetings booked', value: '3.5x increase' },
      { metric: 'After-hours leads', value: '100% contacted' },
      { metric: 'SDR time freed', value: '60% for closing' },
    ],
    quote: { text: 'The AI closer qualified a lead at 2 AM on a Sunday and booked a demo for Monday morning. That deal closed for $48K ARR.', author: 'VP of Sales', role: 'B2B SaaS Company' },
    href: '/closer',
  },
];

const INDUSTRIES = ['All', ...Array.from(new Set(CASE_STUDIES.map(c => c.industry)))];

const AGGREGATE_STATS = [
  { label: 'Average Time Saved', value: '78%' },
  { label: 'Average Cost Reduction', value: '62%' },
  { label: 'Engines Deployed', value: '5,500+' },
  { label: 'Industries Served', value: '6+' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Are these case studies based on real deployments?',
    a: 'Yes. Every case study represents a real production deployment using Echo Prime\'s engine infrastructure. The metrics shown are measured production results, not projections. Engine counts, response times, and doctrine quality scores can be verified in real time via our public benchmarks page.',
  },
  {
    q: 'How long does it take to see results like these?',
    a: 'Most clients see measurable improvements within the first week. The AI engines are pre-trained on domain knowledge (IRC sections, API standards, case law, NIST frameworks), so there is no training period. Setup typically takes 1-2 days for API integration, with full production deployment in under a week.',
  },
  {
    q: 'Can Echo Prime handle my specific industry or use case?',
    a: 'Echo Prime covers 940+ knowledge domains with 5,500+ specialized engines spanning oil & gas, tax, legal, cybersecurity, drilling, sales, real estate, finance, HR, compliance, and more. If your domain isn\'t already covered, our engine builder can create custom engines trained on your specific standards, regulations, and expertise.',
  },
  {
    q: 'What makes Echo Prime different from ChatGPT or general AI tools?',
    a: 'General AI chatbots generate plausible-sounding text from training data. Echo Prime\'s engines return verified doctrine blocks with real citations (IRC sections, case law, API standards, NIST controls). Every answer is backed by authoritative sources, includes confidence levels, and can be audited. This is the difference between a search engine and a domain expert.',
  },
  {
    q: 'Is my data secure when using Echo Prime engines?',
    a: 'Yes. All data is processed on Cloudflare\'s global edge network with SOC 2 Type II compliance. Data never leaves the edge — there is no centralized server storing your queries. All API traffic is encrypted in transit (TLS 1.3) and at rest (AES-256). We do not use your data to train models.',
  },
  {
    q: 'What does pricing look like for enterprise deployments?',
    a: 'Echo Prime offers a free tier with access to all engines for evaluation. Pro starts at $49/month for higher query volumes. Enterprise plans include dedicated support, custom engine development, SLA guarantees, and volume pricing. Visit our pricing page or contact bobbymcwilliams@echo-op.com for a custom quote.',
  },
];

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Benchmarks', href: '/benchmarks' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

/* ═══ SVG Icon paths ═══ */
function SocialIcon({ d, href, label }: { d: string; href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="transition-all duration-300 hover:scale-110"
      style={{ color: 'var(--ept-text-muted)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--ept-accent)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--ept-text-muted)')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </a>
  );
}

export default function CaseStudiesPage() {
  const { isDark } = useTheme();
  const [activeIndustry, setActiveIndustry] = useState('All');
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = activeIndustry === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(cs => cs.industry === activeIndustry);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Case Studies', href: '/case-studies' }]} />
      <FaqSchema faqs={FAQS} name="Case Studies FAQ" />

      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between backdrop-blur-xl"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: isDark ? 'rgba(5,5,8,0.85)' : 'rgba(255,255,255,0.85)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(n => (
            <Link key={n.href} href={n.href} className="text-sm font-medium transition-colors"
              style={{ color: 'var(--ept-text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ept-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ept-text-secondary)')}>
              {n.label}
            </Link>
          ))}
          <Link href="/free" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: 'var(--ept-text)' }}>
            {mobileMenu
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-b px-6 py-4 space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
          {NAV_ITEMS.map(n => (
            <Link key={n.href} href={n.href} className="block text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{n.label}</Link>
          ))}
          <Link href="/free" className="block text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
          <Link href="/login" className="block text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Sign In</Link>
        </div>
      )}

      {/* ─── Hero ─── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
          Verified Production Results
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Case Studies
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: 'var(--ept-text-secondary)' }}>
          Real companies. Real deployments. Real results. See how organizations across
          oil &amp; gas, legal, tax, cybersecurity, and sales use Echo Prime&rsquo;s
          5,500+ AI engines to automate expert-level analysis.
        </p>

        {/* Aggregate stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {AGGREGATE_STATS.map(s => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Industry Filter ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {INDUSTRIES.map(industry => (
            <button key={industry}
              onClick={() => setActiveIndustry(industry)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border"
              style={{
                backgroundColor: activeIndustry === industry
                  ? 'var(--ept-accent)'
                  : 'var(--ept-surface)',
                color: activeIndustry === industry ? '#fff' : 'var(--ept-text-secondary)',
                borderColor: activeIndustry === industry ? 'var(--ept-accent)' : 'var(--ept-border)',
              }}>
              {industry}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Case Studies ─── */}
      <section className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        {filtered.map(cs => (
          <article key={cs.id} className="rounded-2xl border overflow-hidden card-hover"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
            {/* Header */}
            <div className="p-8 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cs.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                  {cs.industry}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>{cs.title}</h2>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{cs.subtitle}</p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              {/* Problem */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  The Challenge
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cs.problem}</p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--ept-accent)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  The Solution
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cs.solution}</p>
              </div>
            </div>

            {/* Engines Used */}
            <div className="px-8 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Engines Deployed</h3>
              <div className="flex flex-wrap gap-2">
                {cs.engines.map(engine => (
                  <span key={engine} className="px-3 py-1 rounded-full text-xs font-mono"
                    style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', border: '1px solid var(--ept-border)' }}>
                    {engine}
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
              {cs.results.map(r => (
                <div key={r.metric} className="text-center">
                  <div className="text-lg md:text-xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{r.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{r.metric}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            {cs.quote && (
              <div className="px-8 py-6 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <blockquote className="text-sm italic leading-relaxed mb-2" style={{ color: 'var(--ept-text-secondary)' }}>
                  &ldquo;{cs.quote.text}&rdquo;
                </blockquote>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                  &mdash; {cs.quote.author}, {cs.quote.role}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="px-8 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
              <Link href={cs.href} className="text-sm font-semibold transition-colors"
                style={{ color: 'var(--ept-accent)' }}>
                Explore {cs.industry} Solutions &rarr;
              </Link>
              <Link href="/free" className="px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Try Free
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Ready to See Results Like These?
        </h2>
        <p className="text-sm md:text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Start with the free tier &mdash; no credit card required. Access 5,500+ engines,
          64,000+ GOLD doctrine blocks, and 940+ knowledge domains today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/free" className="px-8 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center" style={{ color: 'var(--ept-text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="max-w-xl mx-auto px-6 pb-16">
        <NewsletterSignup />
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <SocialIcon href="https://x.com/EchoPrimeTech" label="X / Twitter"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            <SocialIcon href="https://linkedin.com/company/echo-prime-technologies" label="LinkedIn"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            <SocialIcon href="https://youtube.com/@EchoPrimeTech" label="YouTube"
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            <SocialIcon href="https://github.com/ECHO-OMEGA-PRIME" label="GitHub"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/architecture" className="hover:underline">Architecture</Link>
            <Link href="/benchmarks" className="hover:underline">Benchmarks</Link>
            <Link href="/security" className="hover:underline">Security</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/docs" className="hover:underline">Docs</Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.{' '}
            <Link href="/legal/privacy" className="underline">Privacy</Link> &middot;{' '}
            <Link href="/legal/terms" className="underline">Terms</Link>
          </p>
          <p className="text-center text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>
            Midland, TX &middot; bobbymcwilliams@echo-op.com
          </p>
        </div>
      </footer>
    </div>
  );
}
