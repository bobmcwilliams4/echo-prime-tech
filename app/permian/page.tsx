'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

// ════════════════════════════════════════════════════════════════
// ECHO PRIME TECHNOLOGIES — Permian Basin Oilfield AI
// Purpose-built AI for oil & gas operators, landmen, and engineers
// ════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Title Intel', href: '/title-intelligence' },
  { label: 'Closer AI', href: '/closer' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const CAPABILITIES = [
  {
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // layers
    title: 'Title Intelligence',
    description: 'Automated chain of title across 98 Texas counties. AI searches grantor-grantee indexes, resolves name variations, detects gaps, and builds defensible run sheets — in hours, not weeks.',
    stat: '259K+ deed records',
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', // chart
    title: 'Well Production Analytics',
    description: 'Production forecasting, decline curve analysis, EUR calculations, and lease operating expense optimization. Feed in RRC data and get actionable intelligence — not raw tables.',
    stat: '140+ oilfield engines',
  },
  {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', // document
    title: 'Lease & Contract Analysis',
    description: 'AI reads and interprets OGLs, JOAs, PSAs, farmouts, and division orders. Identifies problematic clauses, Pugh clause implications, force majeure triggers, and overconveyance risks.',
    stat: '59 instrument types',
  },
  {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', // globe
    title: 'Regulatory Compliance',
    description: 'Track RRC filings, H-15 severance reports, P-4 production reports, W-2 completion reports, and environmental permits. AI monitors deadlines and flags non-compliance before it becomes a fine.',
    stat: 'RRC + EPA + TCEQ',
  },
  {
    icon: 'M17.657 18.657A8 8 0 016.343 7.343S2 9.172 2 12s.686 5.657 2.343 7.657m5.314-14.314A8 8 0 0118 12a8 8 0 01-2.343 5.657m-9.314 0A8 8 0 0112 4a8 8 0 014.657 1.343', // target
    title: 'Drilling & Completions',
    description: 'Mud weight optimization, torque-and-drag modeling, casing design validation, cement job analysis, and frac design review. 30+ drilling knowledge engines with real field data.',
    stat: '30+ drilling engines',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // currency
    title: 'Revenue & Tax Intelligence',
    description: 'Severance tax optimization, IDC deduction strategy, percentage depletion calculations, 1031 exchange analysis for mineral interests, and Section 199A pass-through deductions.',
    stat: '14 tax engines',
  },
];

const COMPARISON = [
  { metric: 'Title search turnaround', manual: '1-8 weeks', echo: '2-8 hours' },
  { metric: 'Cost per title opinion', manual: '$3,000-$15,000', echo: '$200-$500' },
  { metric: 'Production decline analysis', manual: '2-3 days (spreadsheet)', echo: 'Real-time' },
  { metric: 'Lease clause review', manual: 'Attorney @ $400/hr', echo: 'Instant AI + flag' },
  { metric: 'RRC compliance monitoring', manual: 'Manual calendar tracking', echo: 'Automated alerts' },
  { metric: 'County coverage', manual: 'One county at a time', echo: '98 TX counties' },
  { metric: 'Mineral interest calc', manual: 'Spreadsheet + guesswork', echo: 'Exact rational math' },
  { metric: 'Gap detection', manual: 'Examiner experience', echo: 'Algorithmic + AI' },
];

const TIERS = [
  {
    name: 'Operator',
    price: '$499',
    period: 'per month',
    features: [
      '50 engine queries/day',
      'Title Intelligence (5 searches/mo)',
      'Production analytics dashboard',
      'RRC compliance alerts',
      'Lease clause analysis',
      'Email support',
    ],
    cta: 'Start Free Trial',
    accent: false,
  },
  {
    name: 'Producer',
    price: '$1,500',
    period: 'per month',
    features: [
      'Unlimited engine queries',
      'Unlimited title searches',
      'Full Landman Pipeline access',
      'Drilling & completions engines',
      'Revenue optimization + tax engines',
      'API access',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    accent: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    features: [
      'Everything in Producer',
      'Dedicated account manager',
      'Custom engine deployment',
      'White-label reports',
      'On-premise option',
      'SLA guarantees',
      'Multi-team seats',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    accent: false,
  },
];

const STATS = [
  { value: '5,486+', label: 'AI Engines' },
  { value: '259K+', label: 'Deed Records' },
  { value: '98', label: 'TX Counties' },
  { value: '<50ms', label: 'Response Time' },
];

const TESTIMONIAL_SCENARIOS = [
  {
    role: 'Independent Operator',
    location: 'Midland, TX',
    quote: 'We were spending $8,000 per title opinion and waiting 3 weeks. Now we get defensible run sheets in under a day for a fraction of the cost.',
  },
  {
    role: 'Landman',
    location: 'Odessa, TX',
    quote: 'The chain of title automation handles name variations and probate links that would take me hours to trace manually. It caught a gap I would have missed.',
  },
  {
    role: 'Petroleum Engineer',
    location: 'Pecos, TX',
    quote: 'Having decline curve analysis and frac design review powered by real doctrine — not generic AI — means I can trust the output for field decisions.',
  },
];

export default function PermianBasinPage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'capabilities' | 'compare' | 'pricing'>('capabilities');

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500" style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={600} height={400} className="w-[180px] md:w-[260px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:opacity-100" style={{ color: 'var(--ept-text-secondary)' }}>{item.label}</Link>
            ))}
            <Link href="/sentinel" className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>Sentinel AI</Link>
          </div>
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        {/* ─── Hero ─── */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-20">
          <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest mb-6 animate-fade-up" style={{ backgroundColor: isDark ? '#0d948815' : '#0d737715', color: 'var(--ept-accent)', border: '1px solid var(--ept-accent)' }}>
            BUILT IN MIDLAND, TX — FOR THE PERMIAN BASIN
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-up">
            <span className="gradient-text">Oilfield AI</span>
            <br />
            <span style={{ color: 'var(--ept-text)' }}>That Speaks Your Language</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
            5,486+ intelligence engines purpose-built for oil &amp; gas. Title chains in hours, not weeks.
            Production analytics powered by real doctrine. Built by a 30-year Permian Basin veteran
            who knows the difference between a pooling clause and a Pugh clause.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up-delay-2">
            <Link href="/pricing" className="px-8 py-4 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Start Free Trial
            </Link>
            <Link href="/title-intelligence" className="px-8 py-4 rounded-xl font-semibold border transition-transform hover:scale-105" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Run a Title Search
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up-delay-3">
            {STATS.map(s => (
              <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Who This Is For ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3" style={{ color: 'var(--ept-text)' }}>Built for Permian Basin Professionals</h2>
          <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Whether you run wells, examine titles, or engineer completions — we built tools that replace spreadsheets, cut turnaround times, and give you defensible answers.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { role: 'Operators & Producers', desc: 'Production forecasting, LOE optimization, regulatory compliance, revenue intelligence' },
              { role: 'Landmen & Title Examiners', desc: 'Chain of title, run sheets, mineral interest calculations, gap detection' },
              { role: 'Petroleum Engineers', desc: 'Decline curves, frac design review, casing analysis, mud weight optimization' },
              { role: 'Oil & Gas Attorneys', desc: 'Lease interpretation, JOA analysis, force majeure review, curative work' },
            ].map(p => (
              <div key={p.role} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--ept-text)' }}>{p.role}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Tab Navigation ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="flex justify-center gap-2 mb-10">
            {(['capabilities', 'compare', 'pricing'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--ept-accent)' : 'var(--ept-surface)',
                  color: activeTab === tab ? '#fff' : 'var(--ept-text-secondary)',
                }}
              >
                {tab === 'capabilities' ? 'Capabilities' : tab === 'compare' ? 'Manual vs AI' : 'Pricing'}
              </button>
            ))}
          </div>

          {/* ─── Capabilities Tab ─── */}
          {activeTab === 'capabilities' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPABILITIES.map(cap => (
                <div key={cap.title} className="p-6 rounded-xl border card-hover group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720' }}>
                    <svg className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={cap.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{cap.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ept-text-secondary)' }}>{cap.description}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: isDark ? '#14b8a615' : '#0d737712', color: 'var(--ept-accent)' }}>{cap.stat}</span>
                </div>
              ))}
            </div>
          )}

          {/* ─── Comparison Tab ─── */}
          {activeTab === 'compare' && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Workflow</th>
                    <th className="text-center p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Traditional</th>
                    <th className="text-center p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Prime AI</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.metric} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                      <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.metric}</td>
                      <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.manual}</td>
                      <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── Pricing Tab ─── */}
          {activeTab === 'pricing' && (
            <div className="grid md:grid-cols-3 gap-6">
              {TIERS.map(tier => (
                <div
                  key={tier.name}
                  className="p-6 rounded-xl border relative"
                  style={{
                    backgroundColor: 'var(--ept-card-bg)',
                    borderColor: tier.accent ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    borderWidth: tier.accent ? '2px' : '1px',
                  }}
                >
                  {tier.accent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold" style={{ color: tier.accent ? 'var(--ept-accent)' : 'var(--ept-text)' }}>{tier.price}</span>
                  </div>
                  <p className="text-xs mb-5" style={{ color: 'var(--ept-text-muted)' }}>{tier.period}</p>
                  <ul className="space-y-2.5 mb-6">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.name === 'Enterprise' ? '/support' : `/checkout?service=permian&tier=${tier.name.toLowerCase()}`}
                    className="block w-full text-center px-4 py-3 rounded-xl font-semibold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: tier.accent ? 'var(--ept-accent)' : 'transparent',
                      color: tier.accent ? '#fff' : 'var(--ept-text-secondary)',
                      border: tier.accent ? 'none' : '1px solid var(--ept-border)',
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Use Case Scenarios ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>From the Field</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIAL_SCENARIOS.map(t => (
              <div key={t.role} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--ept-text-secondary)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{t.role}</p>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Permian Basin Coverage ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="rounded-xl border p-8 md:p-12" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
                  Deep Coverage Where It Matters
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
                  We started in Midland because this is home. Our courthouse record database
                  covers the core Permian Basin counties with the highest density, and extends
                  across 98 Texas counties total.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Midland', 'Ector', 'Reeves', 'Ward',
                    'Pecos', 'Martin', 'Loving', 'Crane',
                    'Upton', 'Andrews', 'Gaines', 'Howard',
                  ].map(county => (
                    <div key={county} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {county} County
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: 'var(--ept-text-muted)' }}>+ 86 additional Texas counties</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Deed Records Indexed', value: '259,000+' },
                  { label: 'Instrument Types Classified', value: '59' },
                  { label: 'Oilfield AI Engines', value: '140+' },
                  { label: 'Domain Categories', value: '940+' },
                  { label: 'Doctrine Blocks', value: '529,000+' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{row.label}</span>
                    <span className="font-bold text-sm" style={{ color: 'var(--ept-accent)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Not a Wrapper ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Not a ChatGPT Wrapper</h2>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Generic AI gives you generic answers. Our engines embed real domain expertise —
            IRC sections, RRC rules, Texas Estates Code, COGCC regulations, PRMS standards,
            and decades of oilfield doctrine. Every response cites its authority. Every calculation
            uses exact math, not floating-point approximations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Embedded Doctrine', desc: 'Real legal and engineering reasoning' },
              { label: 'Authority Citations', desc: 'IRC, RRC, case law in every response' },
              { label: 'Exact Math', desc: 'Rational fractions, not float rounding' },
              { label: 'Zero Cold Starts', desc: 'Edge-deployed, sub-50ms globally' },
            ].map(d => (
              <div key={d.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--ept-accent)' }}>{d.label}</p>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-xl border p-8 md:p-12" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
              Ready to Modernize Your Oilfield Operations?
            </h2>
            <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Start with a free title search or explore our 5,486+ intelligence engines.
              No sales calls. No 6-month implementations. Just results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing" className="px-8 py-4 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
                View Pricing
              </Link>
              <Link href="/sentinel" className="px-8 py-4 rounded-xl font-semibold border transition-transform hover:scale-105" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                Try Sentinel AI Free
              </Link>
            </div>
            <p className="text-xs mt-6" style={{ color: 'var(--ept-text-muted)' }}>
              Built in Midland, TX by Echo Prime Technologies &mdash; echo-ept.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
