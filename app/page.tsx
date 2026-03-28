'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';
import { SmokeDivider } from '../components/ParticleBackground';
import ReadAloudButton from '../components/ReadAloudButton';
import { Menu, X } from 'lucide-react';

interface LiveStats {
  engines: string;
  categories: string;
  doctrines: string;
  industries: string[];
}

function useLiveStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({ engines: '5,486+', categories: '940+', doctrines: '607K+', industries: [] });
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
    title: 'Echo Home AI',
    description: 'Whole-home intelligence platform. Control 40+ smart device brands, track bills, tutor kids on homework, dispatch robot vacuums and mowers, optimize energy usage, screen phone calls — all through one AI-powered dashboard with voice control.',
    stat: '40+',
    statLabel: 'Device Brands',
    icon: '⌂',
    link: '/home-ai',
  },
  {
    title: 'Echo Shepherd AI',
    description: 'The pastor\'s autonomous ministry platform. AI sermon builder with scripture engine across 9+ denominations, congregation CRM, tithing and donation tracking, worship planning with 15K+ songs, volunteer scheduling, small groups, pastoral care — everything a church needs.',
    stat: '9+',
    statLabel: 'Denominations',
    icon: '✟',
    link: '/shepherd',
  },
  {
    title: 'GGI Apex Predator',
    description: 'AI gaming companion that auto-detects 45+ games, reads the screen in real-time, and coaches you — or takes full autonomous control. 8 play modes from passive observation to superhuman play. Steam Overlay integration, per-game settings, spray training, pro mimicry, and a full safety layer.',
    stat: '45+',
    statLabel: 'Games',
    icon: '⊕',
    link: '/gamer-companion',
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
    title: 'Scraper Factory',
    description: 'Web scraping platform with 23 templates across government records, social media, market data, and competitive intelligence. Rotating proxies, CAPTCHA solving, and anti-detection. Runs on autopilot.',
    stat: '23',
    statLabel: 'Templates',
    icon: '⬠',
    link: '/scrapers',
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
    title: 'REVENG Scanner',
    description: 'Full-spectrum reconnaissance and vulnerability scanner. Subdomain enumeration, port scanning, SSL/TLS analysis, DNS intelligence, web technology fingerprinting, HTTP header auditing, and automated vulnerability detection. Professional-grade OSINT in a single interface.',
    stat: '10+',
    statLabel: 'Scan Modules',
    icon: '🔍',
    link: '/scanner',
  },
  {
    title: 'SDK & Developer Portal',
    description: 'Access every Echo Prime capability through a unified REST API. OpenAPI spec, interactive playground, code samples in 6 languages, webhook support, and usage analytics. Build on top of 5,486+ engines and 607K+ doctrine blocks.',
    stat: '17+',
    statLabel: 'API Endpoints',
    icon: '🔗',
    link: '/sdk',
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
    title: 'Daedalus Forge',
    description: 'AI manufacturing intelligence with 50 pipeline stages, 1,200 trained agents, and 15 production guilds across 8 operational domains. CNC program generation, predictive maintenance, digital twin simulation, quality control AI, and ISO/FDA compliance automation.',
    stat: '1,200',
    statLabel: 'AI Agents',
    icon: '🏭',
    link: '/daedalus-forge',
  },
  {
    title: 'EchoCAD',
    description: 'AI-powered CAD automation — describe your design in natural language and get production-ready engineering drawings. Parametric generation, structural analysis, tolerance optimization, BOM generation, and ASME/ISO standards compliance. Exports to DXF, DWG, STEP, and more.',
    stat: '10',
    statLabel: 'Export Formats',
    icon: '📐',
    link: '/echocad',
  },
  {
    title: 'Dark Web Intelligence',
    description: 'Real-time dark web monitoring across 16 scraper sources. 3,800+ threat intel items, 4,752 active IOCs, credential leak detection, ransomware group tracking, brand impersonation alerts, and STIX/TAXII feed for SIEM ingestion.',
    stat: '4,752',
    statLabel: 'Active IOCs',
    icon: '🕵',
    link: '/dark-web-intel',
  },
  {
    title: 'Echo Coin Rewards',
    description: 'Blockchain loyalty program on Base (Coinbase L2). Earn coins by using Echo products, stake for 8-15% APY, unlock 6 membership tiers with multipliers up to 3x. Deflationary 2% burn rate, 180-day halving, and governance voting.',
    stat: '6',
    statLabel: 'Reward Tiers',
    icon: '🪙',
    link: '/rewards',
  },
  {
    title: 'Hephaestion Forge',
    description: 'AI software factory with a 13-stage pipeline and 6 quality gates. Full-stack app generation, API scaffolding, database design, test suites, CI/CD setup, code review, security audits, and documentation — across 15 project types and 5 languages.',
    stat: '13',
    statLabel: 'Pipeline Stages',
    icon: '⚒',
    link: '/hephaestion-forge',
  },
  {
    title: 'Website Builder AI',
    description: 'Describe your website in plain English and get a production-ready site. Powered by 30 free LLM workers for intelligent design, SEO optimization, responsive layouts, and one-click deployment. E-commerce, blog, and CMS built in.',
    stat: '30',
    statLabel: 'AI Workers',
    icon: '🌐',
    link: '/websites',
  },
  {
    title: 'Prometheus Surveillance',
    description: 'Codename ARGUS PANOPTES. 6 intelligence modules — GPS tracking, cell tower analysis, carrier intelligence, physical surveillance coordination, active intercept, and IP intelligence. 23 capabilities for authorized investigations.',
    stat: '23',
    statLabel: 'Capabilities',
    icon: '👁',
    link: '/surveillance',
  },
  {
    title: 'Title Intelligence',
    description: 'AI chain-of-title analysis across 80+ Texas counties. 259K+ deed records, mineral rights tracing, gap detection, runsheet generation, and TitleHound AI for automated investigation. Built for landmen, attorneys, and oil & gas operators.',
    stat: '259K+',
    statLabel: 'Deed Records',
    icon: '📜',
    link: '/title-intelligence',
  },
  {
    title: 'Knowledge Scout',
    description: 'AI research agent monitoring 7+ sources — GitHub, Reddit, arXiv, Hacker News, RSS feeds — for emerging trends, tools, and breakthroughs. Daily automated intelligence reports with relevance scoring.',
    stat: '7+',
    statLabel: 'Sources',
    icon: '🔬',
    link: '/knowledge-scout',
  },
  {
    title: 'Arcanum Templates',
    description: '194+ sovereign build templates and megaprompts for AI systems. Search, combine, and deploy proven architectures instantly. Every completed build is ingested back — the library grows with every project.',
    stat: '194+',
    statLabel: 'Templates',
    icon: '📚',
    link: '/arcanum',
  },
  {
    title: 'Fleet Commander',
    description: 'Manage and orchestrate 200+ Cloudflare Workers from one dashboard. Real-time health monitoring, auto-scaling, deployment coordination, cost analytics, service mesh, and dependency graphs.',
    stat: '200+',
    statLabel: 'Workers',
    icon: '🚀',
    link: '/fleet-commander',
  },
  {
    title: 'Tool Discovery',
    description: 'Search and integrate from 37,475+ MCP tools across 1,873 servers. Semantic search, tool ratings, health monitoring, compatibility matrix, and one-click integration into any AI workflow.',
    stat: '37K+',
    statLabel: 'MCP Tools',
    icon: '🔧',
    link: '/tool-discovery',
  },
  {
    title: 'Forge Marketplace',
    description: 'AI engine template store with 632K+ doctrines. Browse quality-tiered engine templates, one-click deploy, bundle deals, seller dashboard, and doctrine packs for every industry vertical.',
    stat: '632K+',
    statLabel: 'Doctrines',
    icon: '🏪',
    link: '/forge-marketplace',
  },
  {
    title: 'News Intelligence',
    description: 'AI-powered news aggregation and intelligence pipeline. Monitor industry news from curated sources, extract insights with NLP, and receive automated daily briefings with trend analysis.',
    stat: '24/7',
    statLabel: 'Monitoring',
    icon: '📰',
    link: '/news-scraper',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              { label: 'Permian', href: '/permian' },
              { label: 'Store', href: '/ecommerce' },
              { label: 'Services', href: '/services' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: 'Blog', href: '/blog' },
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
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: mobileMenuOpen ? 'var(--ept-border)' : 'transparent' }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Permian', href: '/permian' },
              { label: 'Store', href: '/ecommerce' },
              { label: 'Services', href: '/services' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: 'Blog', href: '/blog' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-2.5 px-3 rounded-lg transition-colors hover:opacity-80"
                style={{ color: 'var(--ept-text-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sentinel"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors"
              style={{ color: 'var(--ept-accent)' }}
            >
              Sentinel AI
            </Link>
            <div className="mt-2 pt-3" style={{ borderTop: '1px solid var(--ept-border)' }}>
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  Get Started
                </Link>
              )}
            </div>
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
              <Link href="/free" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
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
              { title: 'Intelligence Engines', desc: '5,486+ domain-specific AI engines with embedded expertise. Tax, legal, oilfield, cyber — 940+ verticals.', price: '$199', interval: '/mo', href: '/engines', badge: null },
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
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ept-text)' }}>Business Suite</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'CRM', price: '$29', href: '/crm' },
                { label: 'Helpdesk', price: '$29', href: '/helpdesk' },
                { label: 'Contracts', price: '$19', href: '/contracts' },
                { label: 'Appointments', price: '$19', href: '/appointments' },
                { label: 'Invoicing', price: '$15', href: '/invoicing' },
                { label: 'HR', price: '$25', href: '/hr-management' },
                { label: 'Inventory', price: '$19', href: '/inventory' },
                { label: 'Forms', price: 'Free', href: '/forms' },
                { label: 'LMS', price: '$19', href: '/lms' },
                { label: 'Email', price: '$9', href: '/email-sender' },
                { label: 'Live Chat', price: '$19', href: '/live-chat' },
                { label: 'Workflows', price: 'Free', href: '/workflows' },
                { label: 'Projects', price: 'Free', href: '/project-management' },
                { label: 'Documents', price: '$12', href: '/documents' },
                { label: 'Finance', price: 'Free', href: '/finance' },
              ].map((p) => (
                <Link key={p.href} href={p.href} className="p-3 rounded-xl border text-center transition-all hover:scale-[1.03] card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{p.label}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--ept-accent)' }}>{p.price}/mo</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-10 mb-8">
            <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ept-text)' }}>Marketing &amp; Growth</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Email Marketing', price: '$19', href: '/email-marketing' },
                { label: 'Newsletter', price: '$12', href: '/newsletter' },
                { label: 'Social Media', price: '$29', href: '/social-media' },
                { label: 'Surveys', price: 'Free', href: '/surveys' },
                { label: 'Reviews', price: '$19', href: '/reviews' },
                { label: 'Feedback Board', price: 'Free', href: '/feedback-board' },
                { label: 'Affiliate', price: '$29', href: '/affiliate' },
                { label: 'Waitlist', price: 'Free', href: '/waitlist' },
                { label: 'Link Shortener', price: 'Free', href: '/link-shortener' },
                { label: 'Web Analytics', price: 'Free', href: '/web-analytics' },
                { label: 'A/B Testing', price: '$19', href: '/ab-testing' },
                { label: 'Status Page', price: 'Free', href: '/status-page' },
              ].map((p) => (
                <Link key={p.href} href={p.href} className="p-3 rounded-xl border text-center transition-all hover:scale-[1.03] card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{p.label}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--ept-accent)' }}>{p.price}/mo</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 mb-8">
            <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ept-text)' }}>Operations &amp; HR</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Payroll', price: '$39', href: '/payroll' },
                { label: 'Recruiting', price: '$29', href: '/recruiting' },
                { label: 'Timesheet', price: '$15', href: '/timesheet' },
                { label: 'Calendar', price: '$15', href: '/calendar' },
                { label: 'Compliance', price: '$39', href: '/compliance' },
                { label: 'OKR Tracking', price: '$19', href: '/okr' },
                { label: 'Expense Mgmt', price: '$15', href: '/expense-management' },
                { label: 'Knowledge Base', price: 'Free', href: '/knowledge-base' },
                { label: 'Signatures', price: '$15', href: '/signatures' },
                { label: 'Proposals', price: '$25', href: '/proposals' },
                { label: 'Feature Flags', price: '$19', href: '/feature-flags' },
                { label: 'Podcast', price: '$12', href: '/podcast' },
              ].map((p) => (
                <Link key={p.href} href={p.href} className="p-3 rounded-xl border text-center transition-all hover:scale-[1.03] card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{p.label}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--ept-accent)' }}>{p.price}/mo</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 mb-8">
            <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ept-text)' }}>Hospitality &amp; Retail</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'QR Menu', price: '$19', href: '/qr-menu' },
                { label: 'Booking', price: '$19', href: '/booking' },
                { label: 'Live Chat', price: '$19', href: '/live-chat' },
                { label: 'Payments', price: '$0', href: '/payments' },
                { label: 'Store', price: '$29', href: '/ecommerce' },
                { label: 'Subscription', price: '$19', href: '/subscription' },
              ].map((p) => (
                <Link key={p.href} href={p.href} className="p-3 rounded-xl border text-center transition-all hover:scale-[1.03] card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{p.label}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--ept-accent)' }}>{p.price}/mo</div>
                </Link>
              ))}
            </div>
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

      {/* ─── Latest from the Blog ─── */}
      <section className="py-20 px-6" ref={useInView(0.1).ref}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Latest from the Blog</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Technical deep-dives on AI engineering, oilfield tech, tax intelligence, and security</p>
            </div>
            <Link href="/blog" className="text-sm font-semibold hidden md:block" style={{ color: 'var(--ept-accent)' }}>View all 128 articles &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'IRS Audit Defense: How AI Documentation Saves $50K+', href: '/blog/irs-audit-defense-ai-documentation-guide-2026', category: 'Tax Intelligence', time: '14 min' },
              { title: 'AI Artificial Lift Optimization: Cut LOE by 30%', href: '/blog/oilfield-production-optimization-ai-artificial-lift-2026', category: 'Oilfield Tech', time: '13 min' },
              { title: 'Zero Trust Security for Small Business: $0-$500/Month', href: '/blog/zero-trust-security-small-business-implementation-2026', category: 'Security', time: '14 min' },
            ].map(post => (
              <Link key={post.href} href={post.href} className="p-5 rounded-xl border transition-all hover:scale-[1.01] block" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? '#14b8a615' : '#0d737715', color: 'var(--ept-accent)' }}>{post.category}</span>
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{post.time}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--ept-text)' }}>{post.title}</h3>
                <span className="text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>Read article &rarr;</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/blog" className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>View all 128 articles &rarr;</Link>
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
                  { label: 'Echo Home AI', href: '/home-ai' },
                  { label: 'Echo Shepherd AI', href: '/shepherd' },
                  { label: 'GGI Apex Predator', href: '/gamer-companion' },
                  { label: 'Engine Catalog', href: '/engines' },
                  { label: 'AI Closer', href: '/closer' },
                  { label: 'Call Center', href: '/call-center' },
                  { label: 'Project Management', href: '/project-management' },
                  { label: 'Echo CRM', href: '/crm' },
                  { label: 'Helpdesk', href: '/helpdesk' },
                  { label: 'Inventory', href: '/inventory' },
                  { label: 'Invoicing', href: '/invoicing' },
                  { label: 'Appointments', href: '/appointments' },
                  { label: 'Email Sender', href: '/email-sender' },
                  { label: 'Analytics', href: '/analytics' },
                  { label: 'Finance AI', href: '/finance' },
                  { label: 'Forms', href: '/forms' },
                  { label: 'HR Management', href: '/hr-management' },
                  { label: 'Contracts', href: '/contracts' },
                  { label: 'LMS', href: '/lms' },
                  { label: 'Email Marketing', href: '/email-marketing' },
                  { label: 'Surveys', href: '/surveys' },
                  { label: 'Knowledge Base', href: '/knowledge-base' },
                  { label: 'Workflows', href: '/workflows' },
                  { label: 'Social Media', href: '/social-media' },
                  { label: 'Documents', href: '/documents' },
                  { label: 'Status Page', href: '/status-page' },
                  { label: 'Live Chat', href: '/live-chat' },
                  { label: 'Link Shortener', href: '/link-shortener' },
                  { label: 'Feedback Board', href: '/feedback-board' },
                  { label: 'Newsletter', href: '/newsletter' },
                  { label: 'Web Analytics', href: '/web-analytics' },
                  { label: 'Title Intelligence', href: '/title-intelligence' },
                  { label: 'Permian Basin AI', href: '/permian' },
                  { label: 'Tax Preparation', href: '/tax-returns' },
                  { label: 'Sentinel AI', href: '/sentinel' },
                  { label: 'Voice Studio', href: '/voice' },
                  { label: 'AI Grading', href: '/grading' },
                  { label: 'Knowledge Systems', href: '/knowledge' },
                  { label: 'Immortality Vault', href: '/immortality-vault' },
                  { label: 'SDK Gateway', href: '/sdk' },
                  { label: 'Bot Factory', href: '/bots' },
                  { label: 'REVENG Scanner', href: '/scanner' },
                  { label: 'Price Alerts', href: '/price-alerts' },
                  { label: 'Reddit Intel', href: '/reddit' },
                  { label: 'X Bot', href: '/x-bot' },
                  { label: 'LinkedIn AI', href: '/linkedin' },
                  { label: 'Payments', href: '/payments' },
                  { label: 'Office AI', href: '/office-ai' },
                  { label: 'Daedalus Forge', href: '/daedalus-forge' },
                  { label: 'EchoCAD', href: '/echocad' },
                  { label: 'Dark Web Intel', href: '/dark-web-intel' },
                  { label: 'Echo Coin', href: '/rewards' },
                  { label: 'Hephaestion Forge', href: '/hephaestion-forge' },
                  { label: 'Website Builder', href: '/websites' },
                  { label: 'Surveillance', href: '/surveillance' },
                  { label: 'Store', href: '/ecommerce' },
                  { label: 'Proposals', href: '/proposals' },
                  { label: 'Affiliate', href: '/affiliate' },
                  { label: 'Signatures', href: '/signatures' },
                  { label: 'QR Menu', href: '/qr-menu' },
                  { label: 'Podcast', href: '/podcast' },
                  { label: 'Payroll', href: '/payroll' },
                  { label: 'Calendar', href: '/calendar' },
                  { label: 'Compliance', href: '/compliance' },
                  { label: 'Recruiting', href: '/recruiting' },
                  { label: 'Timesheet', href: '/timesheet' },
                  { label: 'Feature Flags', href: '/feature-flags' },
                  { label: 'Expense Management', href: '/expense-management' },
                  { label: 'OKR', href: '/okr' },
                  { label: 'Subscription', href: '/subscription' },
                  { label: 'Customer Success', href: '/customer-success' },
                  { label: 'Data Room', href: '/data-room' },
                  { label: 'Asset Manager', href: '/asset-manager' },
                  { label: 'Vendor Manager', href: '/vendor-manager' },
                  { label: 'Incident Manager', href: '/incident-manager' },
                  { label: 'WhatsApp Bot', href: '/whatsapp-bot' },
                  { label: 'A/B Testing', href: '/ab-testing' },
                  { label: 'Telegram Bot', href: '/telegram-bot' },
                  { label: 'Chat AI', href: '/chat-ai' },
                  { label: 'App Forge', href: '/app-forge' },
                  { label: 'Prompt Forge', href: '/prompt-forge' },
                  { label: 'Agentic Engine', href: '/agentic-engine' },
                  { label: 'Shopify', href: '/shopify' },
                  { label: 'Graph RAG', href: '/graph-rag' },
                  { label: 'Domain Harvester', href: '/domain-harvester' },
                  { label: 'Drive Intelligence', href: '/drive-intelligence' },
                  { label: 'Revenue Engine', href: '/revenue-engine' },
                  { label: 'Swarm Brain', href: '/swarm-brain' },
                  { label: 'Speak Cloud', href: '/speak-cloud' },
                  { label: 'Memory Prime', href: '/memory-prime' },
                  { label: 'PayPal Integration', href: '/paypal-integration' },
                  { label: 'Coin Rewards', href: '/coin-rewards' },
                  { label: 'Model Host', href: '/model-host' },
                  { label: 'Instagram AI', href: '/instagram-ai' },
                  { label: 'eBay AI', href: '/ebay-ai' },
                  { label: 'MEGA Gateway', href: '/mega-gateway' },
                  { label: 'Phoenix Cloud', href: '/phoenix-cloud' },
                  { label: 'Report Generator', href: '/report-generator' },
                  { label: 'Analytics Engine', href: '/analytics-engine' },
                  { label: 'Document Delivery', href: '/document-delivery' },
                  { label: 'Autonomous Builder', href: '/autonomous-builder' },
                  { label: 'Diagnostics Agent', href: '/diagnostics' },
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
                  { label: 'Cyber Defense', href: '/security' },
                  { label: 'Pen Testing', href: '/pentesting' },
                  { label: 'County Records', href: '/county-records' },
                  { label: 'Case Studies', href: '/case-studies' },
                  { label: 'Reviews', href: '/reviews' },
                  { label: 'Free Tools', href: '/free' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Company</h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/about" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>About Us</Link>
                <Link href="/blog" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Blog</Link>
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
