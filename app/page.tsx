'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';
import { SmokeDivider } from '../components/ParticleBackground';
import ReadAloudButton from '../components/ReadAloudButton';

interface LiveStats {
  engines: string;
  categories: string;
  doctrines: string;
  industries: string[];
}

function useLiveStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({ engines: '5,400+', categories: '210+', doctrines: '619K+', industries: [] });
  useEffect(() => {
    fetch('https://echo-engine-runtime.bmcii1976.workers.dev/stats')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d: { ok?: boolean; total_engines?: number; total_doctrines?: number; categories?: { category: string; c: number }[] }) => {
        const e = d.total_engines || 0;
        const cats = d.categories || [];
        const c = cats.length;
        const doc = d.total_doctrines || 0;
        setStats({
          engines: e >= 1000 ? `${(e / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${e}+`,
          categories: String(c),
          doctrines: doc >= 1000 ? `${(doc / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${doc}+`,
          industries: cats.filter((cat: { category: string; c: number }) => cat.c >= 3).map((cat: { category: string }) => cat.category),
        });
      })
      .catch(() => {});
  }, []);
  return stats;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const CAPABILITIES = [
  {
    title: 'Intelligence Engines',
    description: 'Purpose-built AI reasoning systems with deep domain expertise. Each engine understands its vertical the way a senior analyst would — not a generic chatbot.',
    statKey: 'engines' as const,
    statLabel: 'Engines Live',
    icon: '⬡',
    link: '/engines',
  },
  {
    title: 'Edge Infrastructure',
    description: 'Globally distributed architecture with sub-50ms response times. No cold starts, no downtime, no single points of failure.',
    stat: '<50ms',
    statLabel: 'Global Latency',
    icon: '◇',
    link: '/services',
  },
  {
    title: 'Enterprise Security',
    description: 'Military-grade encryption, automated threat monitoring, zero-trust access control, and complete audit trails for every operation.',
    stat: '256-bit',
    statLabel: 'AES Encryption',
    icon: '⬟',
    link: '/security',
  },
  {
    title: 'Website Creation',
    description: 'Cutting-edge web applications built with Next.js 15, React 19, and serverless edge architecture. Auto-adaptive themes, real-time data dashboards, sub-second page loads, and zero-downtime deployments — every site is a living system, not a static page.',
    stat: '<1s',
    statLabel: 'Page Load Time',
    icon: '◉',
    link: '/websites',
  },
  {
    title: 'AI Sales Agent',
    description: 'Autonomous AI closers that work 24/7 — real-time voice conversations under 2 seconds, STT-to-LLM-to-TTS pipeline, state-machine script engine, CRM with full lead pipeline, infinite memory across every interaction, multi-channel outreach, live cost tracking, and sentiment analysis. White-label ready, multi-tenant SaaS. Zero local hardware required.',
    stat: '24/7',
    statLabel: 'Always Closing',
    icon: '⬣',
    link: '/closer',
  },
  {
    title: 'Echo Office AI',
    description: 'AI-powered office platform with conversational phone system, smart scheduling, invoicing, fleet management, employee tracking, and 22+ business modules. AI answers calls, books appointments, handles complaints, sends texts, and runs your back office — 24/7. White-label ready.',
    stat: '22+',
    statLabel: 'Business Modules',
    icon: '🏢',
    link: '/office-ai',
  },
  {
    title: 'AI Collectibles Grading',
    description: 'EPOCGS v3.0 — the most thorough AI grading pipeline in existence. Camera capture with auto border detection, 5-model vision ensemble, 50-agent research swarm, 4 doctrine engines (USPAP valuation, IP analysis, market data, historical context), adversarial debate hybrid, Trinity Council final grade, and Bree roast commentary with voice. Comics Price Guide API integrated.',
    stat: '25+',
    statLabel: 'LLMs Per Grade',
    icon: '⬡',
    link: '/grading',
  },
  {
    title: 'Tax Return Preparation',
    description: 'Professional income tax preparation powered by 14 AI Tax Intelligence Engines. IRS 1040 calculation with full bracket analysis, optimization suggestions, state tax estimates, MACRS depreciation, document OCR, strategy planning, and PTIN-certified preparer review. From simple W-2 returns to complex oil & gas taxation.',
    stat: '14',
    statLabel: 'TX Engines',
    icon: '▣',
    link: '/tax-returns',
  },
  {
    title: 'ShadowGlass Browser',
    description: 'Privacy-first desktop browser with 120+ anti-detection techniques, integrated Tor routing, proxy chaining, uncensored meta-search across 13 engines, autonomous web scraping, embedded Claude AI terminal, and Memory Cortex integration. Four privacy modes from Standard to Ghost. Built on Chromium via Electron.',
    stat: '120+',
    statLabel: 'Evasion Techniques',
    icon: '◆',
    link: '/services',
  },
  {
    title: 'EchoCAD',
    description: 'AI-native parametric CAD engine with 20 engineering alloys, 8 geometry primitives, Von Mises stress analysis, Lame pressure vessel calculations, RSS tolerance stackup, DFM scoring, BOM generation, and full OpenSCAD export. Engineering-grade material intelligence running serverless at the edge.',
    stat: '20',
    statLabel: 'Engineering Alloys',
    icon: '⬠',
    link: '/echocad',
  },
  {
    title: 'Daedalus Forge',
    description: 'AI manufacturing intelligence platform with a 50-stage pipeline, 15 specialized guilds, 80 AI agents, and Trinity Council governance. Covers 8 industry verticals from aerospace to medical devices with built-in compliance checking against AS9100, IATF 16949, ISO 13485, and more.',
    stat: '80',
    statLabel: 'AI Agents',
    icon: '⚒',
    link: '/daedalus-forge',
  },
  {
    title: 'Hephaestion Forge',
    description: 'Autonomous software factory with 12 specialized guilds, 60 AI agents, and a 40-stage build pipeline. Full-stack code generation, automated testing, CI/CD integration, and production monitoring. From concept to deployed application in hours, not months.',
    stat: '60',
    statLabel: 'Build Agents',
    icon: '⚡',
    link: '/hephaestion-forge',
  },
  {
    title: 'Immortality Vault',
    description: 'Digital consciousness preservation platform. Guided interviews capture memories, personality, and wisdom across 12 life categories. Ultra-realistic voice cloning with 19 emotional expressions. Family members converse with preserved loved ones anytime — text or voice.',
    stat: '216',
    statLabel: 'Interview Questions',
    icon: '🛡',
    link: '/immortality-vault',
  },
  {
    title: 'Bot Factory',
    description: 'Custom AI bots for every platform — X/Twitter, LinkedIn, Telegram, Discord, WhatsApp, Reddit, Facebook, and Instagram. Social media automation, crypto trading bots, arbitrage engines, congress-watching alerts, customer support, and more. 14 AI personalities, cron scheduling, analytics dashboards.',
    stat: '29',
    statLabel: 'Bot Templates',
    icon: '🤖',
    link: '/bots',
  },
  {
    title: 'Reddit Intelligence',
    description: 'Deep subreddit monitoring with sentiment tracking, trend detection, and community analytics. Track brand mentions, competitor activity, and emerging narratives across thousands of subreddits in real-time.',
    stat: '∞',
    statLabel: 'Subreddits',
    icon: '💬',
    link: '/reddit',
  },
  {
    title: 'X/Twitter AI Bot',
    description: 'Autonomous X/Twitter content engine with 14 AI personalities, AI image generation, engagement analytics, and intelligent scheduling. Posts original content, builds threads, and grows your audience 24/7.',
    stat: '14',
    statLabel: 'AI Personalities',
    icon: '🐦',
    link: '/x-bot',
  },
  {
    title: 'LinkedIn AI Engine',
    description: 'AI-powered LinkedIn content creation, lead generation, and professional networking automation. Profile optimization, InMail campaigns, engagement analytics, and network growth strategies.',
    stat: '24/7',
    statLabel: 'Lead Generation',
    icon: '💼',
    link: '/linkedin',
  },
  {
    title: 'Unified Payments',
    description: 'Accept payments via Stripe, PayPal, and cryptocurrency through a single API. Subscription billing, revenue analytics, multi-currency support, and white-label checkout. Built for SaaS and e-commerce.',
    stat: '3',
    statLabel: 'Payment Rails',
    icon: '💳',
    link: '/payments',
  },
  {
    title: 'REVENG Scanner',
    description: 'Full-spectrum reconnaissance and vulnerability scanner. Subdomain enumeration, port scanning, SSL/TLS analysis, DNS intelligence, web technology fingerprinting, HTTP header auditing, and automated vulnerability detection. Professional-grade OSINT in a single interface.',
    stat: '10+',
    statLabel: 'Scan Modules',
    icon: '🔍',
    link: '/scanner',
  },
  {
    title: 'SDK & Developer Portal',
    description: 'Access every Echo Prime capability through a unified REST API. OpenAPI spec, interactive playground, code samples in 6 languages, webhook support, and usage analytics. Build on top of 6,500+ engines and 700K+ knowledge blocks.',
    stat: '17+',
    statLabel: 'API Endpoints',
    icon: '🔗',
    link: '/sdk',
  },
  {
    title: 'Penetration Testing',
    description: 'Automated security assessment with network scanning, web application testing, API fuzzing, credential testing, and compliance reporting. OWASP Top 10 coverage, NIST framework mapping, and actionable remediation guidance.',
    stat: 'OWASP',
    statLabel: 'Top 10 Coverage',
    icon: '🛡',
    link: '/pentesting',
  },
  {
    title: 'Voice Studio',
    description: 'Text-to-speech with 6 AI voices, 19 emotional expressions, instant voice cloning from audio samples, speech-to-text transcription, and real-time voice conversations. ElevenLabs-powered with Edge TTS fallback. Sub-second latency.',
    stat: '6',
    statLabel: 'AI Voices',
    icon: '🎙',
    link: '/voice',
  },
  {
    title: 'Title Intelligence',
    description: 'AI chain-of-title analysis across 80+ Texas counties. 259K+ deed records, mineral rights tracing, gap detection, runsheet generation, and TitleHound AI for automated investigation. Built for landmen, attorneys, and oil & gas operators.',
    stat: '259K+',
    statLabel: 'Deed Records',
    icon: '📜',
    link: '/title-intelligence',
  },
];

const FALLBACK_INDUSTRIES = [
  'Oil & Gas', 'Legal', 'Tax & Accounting', 'Land & Title',
  'Cybersecurity', 'Finance', 'Healthcare', 'Construction',
  'Energy', 'Insurance', 'Government', 'Education',
];

const DIFFERENTIATORS = [
  { title: 'Not wrappers.', desc: 'Every engine has embedded domain knowledge — thousands of reasoning blocks built by specialists, not prompt templates.' },
  { title: 'Not demos.', desc: 'Production systems processing real workloads, 24/7. Battle-tested across adversarial evaluation suites.' },
  { title: 'Not generic.', desc: 'Each vertical gets its own engine with industry-specific logic, terminology, and compliance awareness.' },
  { title: 'Not fragile.', desc: 'Self-healing infrastructure with automatic failover, crash recovery, and distributed redundancy at every layer.' },
];

export default function HomePage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const live = useLiveStats();
  const capSection = useInView();
  const diffSection = useInView();
  const indSection = useInView();
  const ctaSection = useInView();

  return (
    <div className="min-h-screen transition-colors duration-600" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500" style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={600} height={400} className="w-[240px] md:w-[340px] h-auto transition-opacity duration-500" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Store', href: '/ecommerce' },
              { label: 'Services', href: '/services' },
              { label: 'Security', href: '/security' },
              { label: 'Pricing', href: '/pricing' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:opacity-100" style={{ color: 'var(--ept-text-secondary)' }}>{item.label}</Link>
            ))}
            <Link href="/sentinel" className="text-sm font-semibold transition-colors" style={{ color: 'var(--ept-accent)' }}>Sentinel AI</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-sm" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <Link href="/dashboard" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                )}
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-44 pb-32 px-6 mesh-bg overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--ept-hero-gradient)' }} />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
                <span className="relative w-2 h-2 rounded-full pulse-ring" style={{ backgroundColor: 'var(--ept-accent)' }} />
                Autonomous Intelligence Systems
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight animate-fade-up animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>
              AI that thinks
              <br />
              <span className="gradient-text">like an expert.</span>
            </h1>

            <p className="mt-8 text-xl leading-relaxed max-w-xl animate-fade-up animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
              We build domain-specific intelligence engines for industries that can&apos;t afford to be wrong. Over {live.engines} engines across {live.categories} verticals. Production-grade. Always on.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start animate-fade-up animate-fade-up-delay-3">
              <Link href="/pricing" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Start Building Free
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
              <a href="#capabilities" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border font-semibold transition-all hover:border-opacity-60" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                See What We Build
              </a>
              <a href="mailto:bob@echo-op.com?subject=Enterprise%20Inquiry%20-%20Echo%20Prime%20Technologies" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:opacity-80" style={{ backgroundColor: 'transparent', color: 'var(--ept-accent)', border: '1px solid var(--ept-accent)' }}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                Talk to Sales
              </a>
              <ReadAloudButton size="md" label="Listen" getText={() => {
                const el = document.querySelector('main, [role=main]') || document.body;
                const sections = el.querySelectorAll('h1, h2, p, [class*="description"]');
                return Array.from(sections).map(s => s.textContent?.trim()).filter(Boolean).join('. ').slice(0, 3000);
              }} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden glow-sm animate-fade-up animate-fade-up-delay-4" style={{ backgroundColor: 'var(--ept-border)' }}>
            {[
              { value: live.engines, label: 'Engines Deployed' },
              { value: live.categories, label: 'Industry Verticals' },
              { value: '<50ms', label: 'Global Response' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((s, i) => (
              <div key={i} className="p-8 text-center transition-colors duration-500 relative" style={{ backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-3xl md:text-4xl font-extrabold font-mono gradient-text">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products (revenue drivers) ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Start Building Today</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Most Popular Products</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Production-ready AI systems with free tiers and transparent pricing. No contracts.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Sales Agent', desc: 'Autonomous voice closer — STT, LLM reasoning, natural TTS. CRM with full lead pipeline. White-label SaaS.', price: '$299', interval: '/mo', href: '/closer', badge: 'Best Seller' },
              { title: 'Intelligence Engines', desc: '6,500+ domain-specific AI engines with embedded expertise. Tax, legal, oilfield, cyber — 1,000+ verticals.', price: '$199', interval: '/mo', href: '/engines', badge: null },
              { title: 'Title Intelligence', desc: 'AI chain of title across 80+ Texas counties. 259K+ deed records, mineral rights tracing, gap detection.', price: '$200', interval: '/mo', href: '/title-intelligence', badge: 'Oil & Gas' },
              { title: 'Sentinel AI', desc: 'Multi-domain AI assistant with web search, knowledge retrieval, and real-time analysis. 14 personalities.', price: 'Free', interval: ' tier', href: '/sentinel', badge: 'Try Free' },
            ].map((p, i) => (
              <Link key={i} href={p.href} className="group relative p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                {p.badge && (
                  <span className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{p.badge}</span>
                )}
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-extrabold font-mono gradient-text">{p.price}</span>
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{p.interval}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider transition-colors group-hover:opacity-80" style={{ color: 'var(--ept-accent)' }}>Get Started &rarr;</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--ept-accent)' }}>View all pricing &amp; plans &rarr;</Link>
          </div>
        </div>
      </section>

      <SmokeDivider />

      {/* ─── Capabilities ─── */}
      <section id="capabilities" className="py-28 px-6" ref={capSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Capabilities</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              What we build
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              End-to-end autonomous intelligence — from raw data ingestion to production-grade reasoning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, i) => {
              const inner = (
                <>
                  <div className="text-3xl mb-5 w-14 h-14 rounded-xl flex items-center justify-center font-light" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>{cap.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ept-text-muted)' }}>{cap.description}</p>
                  <div className="flex items-baseline gap-2 pt-4 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                    <span className="text-2xl font-extrabold font-mono gradient-text">{'statKey' in cap ? live[cap.statKey as keyof LiveStats] as string : cap.stat}</span>
                    <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--ept-text-muted)' }}>{cap.statLabel}</span>
                  </div>
                  {'link' in cap && <div className="mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Try it live →</div>}
                </>
              );
              const cls = `card-hover p-8 rounded-2xl border transition-all duration-700 block ${capSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
              const sty = { backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', transitionDelay: `${i * 100}ms` };
              return 'link' in cap ? (
                <Link key={i} href={(cap as any).link} className={cls} style={sty}>{inner}</Link>
              ) : (
                <div key={i} className={cls} style={sty}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      <SmokeDivider flip />

      {/* ─── Approach (replaces Technology — no secret sauce) ─── */}
      <section id="approach" className="py-28 px-6 mesh-bg" ref={diffSection.ref}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Our Approach</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Built different.
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              Most AI products are thin wrappers around a language model. We build something fundamentally different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <div
                key={i}
                className={`card-hover p-8 rounded-2xl border relative overflow-hidden transition-all duration-700 ${diffSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', transitionDelay: `${i * 120}ms` }}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: 'var(--ept-accent)' }} />
                <h3 className="text-2xl font-extrabold mb-3 gradient-text">{d.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{d.desc}</p>
              </div>
            ))}
          </div>

          <div className={`mt-16 p-10 rounded-2xl border glow-md relative overflow-hidden scan-line transition-all duration-700 ${diffSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', transitionDelay: '500ms' }}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: '8-step', label: 'Resolution Pipeline', desc: 'Every query goes through multi-stage analysis, not a single prompt.' },
                { value: 'Hybrid', label: 'Retrieval System', desc: 'Precision keyword search combined with semantic understanding.' },
                { value: 'Adversarial', label: 'Evaluation Suite', desc: 'Every engine stress-tested against edge cases before deployment.' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-3xl font-extrabold font-mono gradient-text mb-2">{item.value}</div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text)' }}>{item.label}</div>
                  <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SmokeDivider />

      {/* ─── Industries ─── */}
      <section id="industries" className="py-28 px-6" ref={indSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Industries</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Built for your vertical.
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              Every industry gets purpose-built engines with embedded domain expertise. Not one model fine-tuned {live.categories} ways — {live.categories} separate intelligence systems.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {(live.industries.length > 0 ? live.industries : FALLBACK_INDUSTRIES).map((industry, i) => (
              <div
                key={i}
                className={`card-hover px-6 py-4 rounded-xl border text-sm font-medium cursor-default transition-all duration-500 ${indSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)', transitionDelay: `${i * 60}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ept-accent)'; e.currentTarget.style.color = 'var(--ept-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ept-card-border)'; e.currentTarget.style.color = 'var(--ept-text-secondary)'; }}
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SmokeDivider flip />

      {/* ─── Testimonials Strip ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
            Trusted by professionals
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>
            4.9/5 average rating &middot; <Link href="/reviews" className="underline" style={{ color: 'var(--ept-accent)' }}>Read all reviews</Link>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'James T.', role: 'CPA', text: 'The tax engine caught two deductions my CPA missed. This isn\'t a ChatGPT wrapper — there\'s real domain expertise baked in.', stars: 5 },
              { name: 'Patricia L.', role: 'Landman, Permian Basin', text: 'Title intelligence saves me hours per runsheet. Pulls deed records from 80+ Texas counties and chains them automatically.', stars: 5 },
              { name: 'Sarah K.', role: 'Engineering Lead', text: 'Switched from a $2,400/mo enterprise AI to Echo Prime Pro. Better responses, faster, fraction of the cost.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= t.stars ? '#eab308' : 'var(--ept-text-muted)', fontSize: 14 }}>&#9733;</span>)}
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ept-text-secondary)' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="text-xs font-semibold" style={{ color: 'var(--ept-text)' }}>{t.name}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="contact" className="py-32 px-6 mesh-bg relative" ref={ctaSection.ref}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className={`max-w-3xl mx-auto text-center relative transition-all duration-700 ${ctaSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
            Ready to build<br />
            <span className="gradient-text">something real?</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
            We partner with organizations that need AI systems that actually work. If your industry demands precision, let&apos;s talk.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Go to Dashboard
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
            ) : (
              <>
                <Link href="/signup" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Get Started Free
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                  View Pricing
                </Link>
              </>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              30-day money-back guarantee
            </span>
            <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No credit card required</span>
            <a href="mailto:bob@echo-op.com" className="text-sm underline" style={{ color: 'var(--ept-accent)' }}>Enterprise inquiries</a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t py-16 px-6 transition-colors" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[180px] h-auto opacity-80 mb-4" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>Autonomous intelligence systems for industries that demand precision.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Products</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Engine Catalog', href: '/engines' },
                  { label: 'AI Closer', href: '/closer' },
                  { label: 'Bree AI Assistant', href: '/bree-assistant' },
                  { label: 'Business Manager', href: '/business-manager' },
                  { label: 'Data Pipelines', href: '/pipelines' },
                  { label: 'Title Intelligence', href: '/title-intelligence' },
                  { label: 'Tax Preparation', href: '/tax-returns' },
                  { label: 'Sentinel AI', href: '/sentinel' },
                  { label: 'Voice Studio', href: '/voice' },
                  { label: 'AI Grading', href: '/grading' },
                  { label: 'Knowledge Systems', href: '/knowledge' },
                  { label: 'EchoCAD', href: '/echocad' },
                  { label: 'Daedalus Forge', href: '/daedalus-forge' },
                  { label: 'Hephaestion Forge', href: '/hephaestion-forge' },
                  { label: 'Immortality Vault', href: '/immortality-vault' },
                  { label: 'SDK Gateway', href: '/sdk' },
                  { label: 'Bot Factory', href: '/bots' },
                  { label: 'Scraper Factory', href: '/scrapers' },
                  { label: 'REVENG Scanner', href: '/scanner' },
                  { label: 'Dark Web Intel', href: '/dark-web-intel' },
                  { label: 'Crypto Trading', href: '/crypto-trading' },
                  { label: 'Price Alerts', href: '/price-alerts' },
                  { label: 'SEC Intelligence', href: '/sec-intel' },
                  { label: 'Surveillance', href: '/surveillance' },
                  { label: 'News Intel', href: '/news' },
                  { label: 'Reddit Intel', href: '/reddit' },
                  { label: 'X Bot', href: '/x-bot' },
                  { label: 'eBay Automation', href: '/ebay' },
                  { label: 'LinkedIn AI', href: '/linkedin' },
                  { label: 'Payments', href: '/payments' },
                  { label: 'ShadowGlass', href: '/services' },
                  { label: 'Store', href: '/ecommerce' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Solutions</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'All Services', href: '/services' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'Rewards', href: '/rewards' },
                  { label: 'Cyber Defense', href: '/security' },
                  { label: 'Pen Testing', href: '/pentesting' },
                  { label: 'Website Builder', href: '/websites' },
                  { label: 'AI Orchestration', href: '/orchestration' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Company</h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/about" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>About Us</Link>
                <Link href="/changelog" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Changelog</Link>
                <a href="mailto:contact@echo-op.com" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>contact@echo-op.com</a>
                <a href="tel:+14325276112" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>(432) 527-6112 — Customer Service</a>
                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Midland, Texas</span>
                <Link href="/legal/privacy" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Privacy Policy</Link>
                <Link href="/legal/terms" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 text-center" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
