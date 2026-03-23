'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

/* ═══════════════════════════════════════════════════════════════════════════════
   Case Studies — Real-world AI engine use cases across industries
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
      { metric: 'Cost per well', value: '$150K average savings' },
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

export default function CaseStudiesPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/engines" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/free" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
          Real Results
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          Case Studies
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          See how companies across oil &amp; gas, legal, tax, cybersecurity, and sales
          use Echo Prime&rsquo;s 5,486+ AI engines to automate expert-level analysis.
        </p>
      </section>

      {/* Industry Filter */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {['All', ...new Set(CASE_STUDIES.map(c => c.industry))].map(industry => (
            <span key={industry} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-default" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', borderColor: 'var(--ept-border)' }}>
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        {CASE_STUDIES.map((cs, index) => (
          <article key={cs.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
            {/* Header */}
            <div className="p-8 border-b" style={{ borderColor: 'var(--ept-border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cs.icon}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                    {cs.industry}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>{cs.title}</h2>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{cs.subtitle}</p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              {/* Problem */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#ef4444' }}>The Challenge</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cs.problem}</p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-accent)' }}>The Solution</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cs.solution}</p>
              </div>
            </div>

            {/* Engines Used */}
            <div className="px-8 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Engines Used</h3>
              <div className="flex flex-wrap gap-2">
                {cs.engines.map(engine => (
                  <span key={engine} className="px-3 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', border: '1px solid var(--ept-border)' }}>
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
              <Link href={cs.href} className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>
                Explore {cs.industry} Solutions &rarr;
              </Link>
              <Link href="/free" className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Try Free
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Ready to See Results Like These?
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Start with the free tier &mdash; no credit card required. Access 5,486+ engines,
          24,800+ knowledge documents, and 940+ domains today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/free" className="px-8 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.{' '}
          <Link href="/legal/privacy" className="underline">Privacy</Link> &middot;{' '}
          <Link href="/legal/terms" className="underline">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
