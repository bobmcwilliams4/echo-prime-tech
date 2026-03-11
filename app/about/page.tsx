'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
];

const STATS = [
  { value: '2,600+', label: 'AI Engines' },
  { value: '210+', label: 'Domains' },
  { value: '449K+', label: 'Doctrine Blocks' },
  { value: '99.9%', label: 'Uptime' },
];

const VALUES = [
  {
    title: 'Speed Over Everything',
    description: 'Sub-50ms responses globally. Zero cold starts. Built on edge infrastructure that puts intelligence closer to you, not in a distant data center.',
    icon: 'zap',
  },
  {
    title: 'Real Expertise, Not Wrappers',
    description: 'Every engine embeds genuine domain knowledge from specialists — not prompt templates. Doctrine-backed reasoning that stands up to professional scrutiny.',
    icon: 'shield',
  },
  {
    title: 'Autonomous by Design',
    description: 'Systems that self-monitor, self-heal, and self-improve. We don\'t build tools that need babysitting. We build infrastructure that runs 24/7 without intervention.',
    icon: 'cpu',
  },
  {
    title: 'Edge-Native Architecture',
    description: 'Deployed globally on edge infrastructure. No single point of failure. Your data processed where it\'s needed, with enterprise-grade reliability.',
    icon: 'globe',
  },
  {
    title: 'Independent & Bootstrapped',
    description: 'Zero VC funding. Zero corporate overhead. Every dollar of revenue goes back into building better technology. We answer to customers, not investors.',
    icon: 'users',
  },
  {
    title: 'Built in Texas',
    description: 'Born in Midland, Texas — the heart of the Permian Basin. Our oilfield heritage taught us that reliability isn\'t optional and downtime costs real money.',
    icon: 'building',
  },
];

const TIMELINE = [
  { year: '2024', event: 'Founded by Bobby Don McWilliams II after 30 years in the oilfield industry' },
  { year: '2025', event: 'First intelligence engines deployed — Tax, Legal, and Landman domains' },
  { year: '2025', event: 'ShadowGlass privacy browser launched with 120+ anti-detection measures' },
  { year: '2026', event: 'Scaled to 2,600+ engines across 210 domains with 449K+ doctrine blocks' },
  { year: '2026', event: 'AI Closer, Hephaestion Forge, and Daedalus Forge enter production' },
  { year: '2026', event: 'Full autonomous operations — bots, scrapers, monitoring across all platforms' },
];

function IconSvg({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const props = { className, style, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 };
  switch (name) {
    case 'zap':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'shield':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    case 'cpu':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
    case 'globe':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
    case 'users':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    case 'building':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case 'arrow-right':
      return <svg {...props} className={className} style={style}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
    case 'chevron-right':
      return <svg {...props} className={className} style={style}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
    default:
      return null;
  }
}

export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={140}
            height={36}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--ept-text-secondary)' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>About Echo Prime Technologies</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--ept-text)' }}>
            Intelligence Infrastructure<br />
            <span className="gradient-text">Built Different</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--ept-text-secondary)' }}>
            We build autonomous AI systems that embed real domain expertise — not API wrappers, not prompt templates.
            2,600+ specialized engines across 210 domains, running on global edge infrastructure with zero cold starts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }}>
                BM
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Bobby Don McWilliams II</h2>
                <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Founder & CEO</p>
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                  After three decades in the West Texas oilfield — from roughnecking to production optimization — Bobby taught himself
                  to code and spent 14 months building Echo Prime Technologies from scratch. No computer science degree. No VC funding.
                  No corporate backing. Just relentless engineering and domain expertise earned the hard way.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  The oilfield taught him that systems need to work at 3 AM when nobody&apos;s watching. That downtime costs real money.
                  That the difference between a good solution and a great one is whether it survives contact with reality.
                  He built Echo Prime with that philosophy: autonomous, reliable, and battle-tested.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>What We Believe</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Principles that guide every engine we build, every system we deploy, and every customer we serve.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(value => (
              <div key={value.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20, 184, 166, 0.15)' : 'rgba(13, 115, 119, 0.1)' }}>
                  <IconSvg name={value.icon} className="w-6 h-6" style={{ color: 'var(--ept-accent)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{value.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Our Journey</h2>
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-16 flex-shrink-0 text-sm font-bold pt-1" style={{ color: 'var(--ept-accent)' }}>{item.year}</div>
                <div className="flex-1 p-4 rounded-lg border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>What We Build</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            From specialized AI engines to autonomous sales agents, every product is built to run independently and deliver real results.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Intelligence Engines', desc: '2,600+ domain-specific reasoning systems', href: '/engines' },
              { name: 'AI Closer', desc: 'Autonomous sales agent with <2s voice response', href: '/closer' },
              { name: 'Hephaestion Forge', desc: 'AI code factory — 13-stage build pipeline', href: '/hephaestion-forge' },
              { name: 'ShadowGlass', desc: 'Privacy browser with 120+ anti-detection measures', href: '/services' },
              { name: 'Custom Bots', desc: 'Discord, X, Telegram, LinkedIn — 14 AI personalities', href: '/bots' },
              { name: 'Data Pipelines', desc: 'ETL, enrichment, real-time processing', href: '/pipelines' },
            ].map(product => (
              <Link key={product.name} href={product.href} className="p-5 rounded-xl border text-left flex items-center justify-between group card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div>
                  <div className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{product.name}</div>
                  <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{product.desc}</div>
                </div>
                <IconSvg name="chevron-right" className="w-5 h-5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--ept-accent)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Build Something?</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Explore our engines, try Sentinel AI, or talk to us about custom solutions. No sales calls required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/engines" className="px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Explore Engines <IconSvg name="arrow-right" className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-xl font-semibold border flex items-center justify-center gap-2" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            &copy; 2026 Echo Prime Technologies. Built in Midland, TX.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-sm hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
            <Link href="/legal/terms" className="text-sm hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
            <Link href="/pricing" className="text-sm hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
