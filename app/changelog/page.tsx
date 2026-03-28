'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

interface ChangelogEntry {
  date: string;
  version?: string;
  title: string;
  type: 'feature' | 'improvement' | 'fix' | 'launch';
  description: string;
  highlights?: string[];
  link?: string;
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-03-27',
    version: 'v2026.21',
    title: '128 Blog Articles + 135 BreadcrumbSchema + 143 openGraph + Expanded Homepage Product Grid',
    type: 'launch',
    description: 'Major SEO and product discovery expansion: 128 blog articles (12 new competitive comparison articles), openGraph metadata on 143+ pages, Related cross-links on all 128 articles, 3 new categorized product grids on homepage (Marketing & Growth, Operations & HR, Hospitality & Retail — 30 additional products visible above-fold).',
    highlights: [
      '128 blog articles (12 new: timesheet, podcast, qr-menu, affiliate, link-shortener, calendar, okr, web-analytics, waitlist, proposals, signatures, reviews)',
      'All 128 blog articles now have Related article cross-links for internal SEO',
      'openGraph metadata added to 19 more product layout.tsx files (143+ total)',
      'FaqSchema added to affiliate, qr-menu, signatures pages (130+ total)',
      '24 broken blog cross-reference slugs fixed across all articles',
      'Homepage expanded: 3 new categorized product grids — 30 additional products visible (was 40, now 70)',
      'Blog article count updated across homepage (128 articles)',
      '329+ sitemap URLs, 134+ RSS feed items',
    ],
    link: '/blog',
  },
  {
    date: '2026-03-26',
    version: 'v2026.20',
    title: '98 Blog Articles + 81 FaqSchema + 80 BreadcrumbSchema + 271 Pages + 222 Sitemap URLs',
    type: 'launch',
    description: 'Massive SEO sprint: 98 blog articles, FaqSchema on 81 pages, BreadcrumbSchema on 80 pages, 4 redirect stubs expanded into full product pages, blog cross-links on 6 key pages, sitemap cleanup and expansion to 222 URLs.',
    highlights: [
      '98 blog articles across 5 categories (was 90)',
      '81 pages with FaqSchema JSON-LD (was 73)',
      '80 pages with BreadcrumbSchema JSON-LD (was 40)',
      '271 static pages generated (was 264)',
      '222 sitemap URLs (was 210)',
      '4 redirect stubs expanded: invoice, booking, hr, project-manager — each 150-170 lines with full features, pricing, FAQs',
      'Blog cross-links added to security, pentesting, tax-returns, permian, engines, sdk pages',
      '30+ product pages received inline FAQ sections',
      '105/105 layout.tsx files verified with SEO metadata',
      'Fixed duplicate /helpdesk sitemap entry',
    ],
    link: '/blog',
  },
  {
    date: '2026-03-26',
    version: 'v2026.19',
    title: '90 Blog Articles + 73 FaqSchema Pages + 40 BreadcrumbSchema Pages + 256 Static Pages',
    type: 'launch',
    description: 'Continued SEO and content expansion. 90 blog articles across 5 balanced categories, JSON-LD FaqSchema on all 73 FAQ pages for Google rich snippets, BreadcrumbSchema navigation on 40 key pages, 200 sitemap URLs, and 99 RSS items.',
    highlights: [
      '90 blog articles: Tax Intelligence (10), Security (11), Oilfield Tech (11), AI & Engineering (20), Product Updates (36)',
      '73 pages with FaqSchema JSON-LD for Google FAQ rich results',
      '40 pages with BreadcrumbSchema JSON-LD for breadcrumb rich results',
      '256 static pages (up from 252)',
      '200 sitemap URLs, 99 RSS feed items',
      'New tax articles: Estate Planning, Entity Selection (LLC/S-Corp/C-Corp), R&D Tax Credits',
      'New security articles: API Security Testing (OWASP Top 10), Cloud Security Posture Management (CSPM)',
    ],
    link: '/blog',
  },
  {
    date: '2026-03-26',
    version: 'v2026.18',
    title: '76 Blog Articles + 70+ FAQ Pages + FAQ Rich Snippets + Organization Schema',
    type: 'launch',
    description: 'Massive SEO and content expansion: 76 blog articles across 5 categories (up from 20), 70+ product pages with FAQ sections, FAQ JSON-LD structured data for Google rich snippets, enhanced Organization schema with contact information, and 37 SoftwareApplication JSON-LD entries.',
    highlights: [
      '76 blog articles: Tax Intelligence (7), Security (9), Oilfield Tech (11), AI & Engineering (17), Product Updates (32)',
      '70+ product pages with FAQ sections (6 Q&As each)',
      'FaqSchema component for Google FAQ rich snippets on all FAQ pages',
      'Enhanced Organization schema: address, phone, email, social links',
      '37 SoftwareApplication JSON-LD entries for product pages',
      '88 product page-level metadata layouts for SEO',
      'Full sitemap.xml with 170+ URLs',
      'RSS feed with 30+ articles',
      'About page: Technology Stack section + FAQ',
      'Category data quality fixes (removed orphan categories)',
    ],
    link: '/blog',
  },
  {
    date: '2026-03-26',
    version: 'v2026.17',
    title: '50+ New Product Pages + Complete Product Suite',
    type: 'launch',
    description: 'Expanded from 40 pages to 90+ with complete product coverage. New product pages for HR, Inventory, Finance AI, Project Manager, LMS, Surveys, Status Page, Knowledge Base, Helpdesk, Social Media, Email Marketing, Booking, Contracts, Forms, Link Shortener, Gamer Companion, Home AI, Intel Hub, and more.',
    highlights: [
      '50+ new product pages with consistent design language',
      'SEO metadata layouts for all product pages',
      'Cross-linked navigation between related products',
      'Coming Soon Guard for unreleased features',
      'Product Tutorial system with guided overlays',
    ],
    link: '/services',
  },
  {
    date: '2026-03-23',
    version: 'v2026.14',
    title: 'Conversion Funnel + 4 New Blog Articles + RSS Complete',
    type: 'launch',
    description: 'Full conversion funnel with /free landing page (feature comparison matrix, email capture, 6 free products) and /case-studies (6 industry deep-dives). 4 new blog articles targeting compliance, API evaluation, drilling AI, and revenue automation. RSS feed expanded to all 17 articles. Related articles on every blog post. Internal cross-linking across engines, blog, and conversion pages.',
    highlights: [
      '/free: Feature matrix comparing Free/Starter/Pro/Enterprise tiers',
      '/case-studies: Oil & Gas, Tax, Legal, Cybersecurity, Drilling, Sales',
      '4 new blog articles (17 total): compliance, API eval, drilling ops, revenue automation',
      'Auto-computed Related Articles on every blog post (tag + category scoring)',
      'RSS feed now includes all 17 blog articles + 9 changelog entries',
      'Cross-links between blog, engines, free tier, and case studies',
    ],
    link: '/free',
  },
  {
    date: '2026-03-21',
    version: 'v2026.13',
    title: 'Technical Blog + Newsletter + Lead Capture',
    type: 'launch',
    description: 'Launched the Echo Prime blog with 6 SEO-optimized technical articles spanning AI engineering, oilfield tech, tax intelligence, cybersecurity, and cloud architecture. Newsletter signup wired to live lead capture. RSS feed expanded with blog entries.',
    highlights: [
      '6 technical articles with full-length content (~1,200+ words each)',
      'Newsletter signup → /api/leads endpoint with D1 UPSERT',
      'Blog JSON-LD structured data (BlogPosting schema for all articles)',
      'RSS feed expanded with blog articles + Atom namespace',
      'Category filtering (AI & Engineering, Oilfield, Tax, Security, Product)',
      'Chat widget lead capture silently failing — now fixed',
    ],
    link: '/blog',
  },
  {
    date: '2026-03-21',
    title: 'Permian Basin AI & Legal Compliance',
    type: 'launch',
    description: 'Launched dedicated Permian Basin oilfield AI landing page with 9 specialized modules and full legal compliance suite — Privacy Policy, Terms of Service, and Cookie Policy.',
    highlights: [
      'Permian Basin AI: 9 specialized oilfield modules (Well Eval, Lease Analysis, Decline Curve, AFE Review, more)',
      'Privacy Policy: 13 sections covering CCPA, international transfers, data rights',
      'Terms of Service: 15 sections with Texas jurisdiction, AI output disclaimers',
      'Cookie Policy: 8 sections with third-party cookie disclosure table',
    ],
    link: '/permian',
  },
  {
    date: '2026-03-20',
    title: 'SDK Gateway v3.0 & Engine Marketplace',
    type: 'launch',
    description: 'Public developer SDK with TypeScript package, CLI tool, 17 API endpoints, and engine marketplace. Free tier includes 100 queries/day across all 5,486+ engines.',
    highlights: [
      'TypeScript SDK (@echo-omega-prime/sdk) on GitHub',
      'CLI tool with 45+ commands',
      'Engine Marketplace at /engines/marketplace',
      'Interactive API docs at /sdk/docs',
      'Developer portal at /sdk with quickstart guides',
    ],
    link: '/sdk',
  },
  {
    date: '2026-03-18',
    title: 'Echo Speak Cloud v2.0 — ConvoAI-Level Voice',
    type: 'feature',
    description: 'Major voice system upgrade with bidirectional WebSocket conversations, 4-layer emotion engine, cloud-native STT, and quota-aware multi-provider TTS orchestration.',
    highlights: [
      'Real-time voice conversations via WebSocket',
      '4-layer emotion intelligence (lexicon → trajectory → selection → placement)',
      'Cloud STT via Workers AI Whisper',
      'Multi-provider TTS blending (ElevenLabs + Edge)',
      'Durable Object session persistence',
    ],
    link: '/voice',
  },
  {
    date: '2026-03-16',
    title: '11 Autonomous Infrastructure Workers',
    type: 'feature',
    description: 'Deployed complete autonomous operations layer: service registry, alert routing, log aggregation, rate limiting, usage tracking, cron orchestration, API gateway, notification hub, secrets rotation, distributed tracing, and more.',
    highlights: [
      'Service Registry with auto-discovery (19 services)',
      'Alert Router with 4 rules and 2 channels',
      'API Gateway with key management and rate limiting',
      'Distributed Tracing with W3C Trace Context',
      'Secrets Rotator with HIBP breach checking',
    ],
  },
  {
    date: '2026-03-15',
    title: 'Sovereign Pricing Audit — 27 Price Adjustments',
    type: 'improvement',
    description: 'Complete pricing overhaul across all 16 services using 13 Laws of Sovereign Pricing framework. Optimized for market positioning, perceived value, and revenue maximization.',
    highlights: [
      'Annual billing toggle with 20% discount',
      'SDK Gateway tiers: Free / Pro $49 / Enterprise $299',
      'Closer AI tiers: $299 / $499 / $999',
      'Projected $847K-1.42M annual revenue at scale',
    ],
    link: '/pricing',
  },
  {
    date: '2026-03-13',
    title: 'Bot Fleet Capability Parity',
    type: 'feature',
    description: 'All 8 social media bot Workers now have all 10 mandatory capabilities: A/B testing, lead detection, content dedup, Secret Sauce Firewall, Grok AI images, abuse detection, Workers AI fallback, conversation history, subscriber management, and engagement analytics.',
    highlights: [
      'X Bot: 134+ tweets, post caps, Jaccard dedup',
      'LinkedIn Bot: 86 posts, DM auto-reply pipeline',
      'Telegram Bot: 32 personalities, Grok images',
      'Reddit, Slack, WhatsApp, Messenger, Instagram bots deployed',
    ],
  },
  {
    date: '2026-03-12',
    title: 'SDK Dashboard & 4 New Bot Workers',
    type: 'launch',
    description: 'Launched SDK self-service dashboard with API key management. Deployed Slack, Reddit, WhatsApp, and Messenger bot Workers. Knowledge Forge expanded to 1,562 docs across 218 categories.',
    highlights: [
      'SDK Dashboard: API key creation, usage tracking, quotas',
      'Slack Bot v1.1.0 with 5 slash commands',
      'Reddit Bot monitoring 11 subreddits',
      'Knowledge Forge: 1,562 docs, 7,139 chunks',
    ],
  },
  {
    date: '2026-03-09',
    title: 'BRAVO Inference Server v2.0 — Zero Cloud Cost',
    type: 'feature',
    description: 'Moved all AI inference from RunPod ($290/mo) to on-premise BRAVO node with RTX 3070. 10 LoRA adapters serving through permanent Cloudflare Tunnel.',
    highlights: [
      'Qwen2.5-7B base with 10 domain adapters',
      'TitleHound, Doctrine Generator, Landman, TaxLaw, Legal, Real Estate, Cyber, Engineering, Medical, Software',
      'Permanent tunnel: inference.echo-op.com',
      'Savings: $290/month → $0/month',
    ],
  },
  {
    date: '2026-03-07',
    title: 'Hephaestion Forge — 6,546 Engines Built',
    type: 'feature',
    description: 'Autonomous engine construction reached 6,546 engines across 1,091 batches in 20 sessions. Every domain of human knowledge getting its own intelligence engine.',
    highlights: [
      '6,546 named engines across 1,000+ domains',
      '13-stage build pipeline per engine',
      '100% success rate through pipeline',
      'Average ~1,500 lines per engine',
    ],
    link: '/engines',
  },
  {
    date: '2026-03-05',
    title: 'Revenue Optimization Sprint',
    type: 'improvement',
    description: 'Sentinel AI bug fixes, bot factory page, scraper factory page, annual billing, lead capture widget, and full site audit.',
    highlights: [
      'Bot Factory: 29 templates, $499-$1,499 pricing',
      'Scraper Factory: 23 templates, $399-$1,299 pricing',
      'Lead capture chat widget for anonymous visitors',
      'Sentinel AI: 5 critical bugs fixed',
    ],
    link: '/pricing',
  },
  {
    date: '2026-03-04',
    title: 'Full Checkout Pipeline',
    type: 'launch',
    description: 'End-to-end checkout flow: pricing → auth → Stripe checkout → success. 17 services with full pricing tiers operational.',
    highlights: [
      'Stripe checkout integration (test mode)',
      'Auth redirect flow preserves checkout intent',
      'Case-insensitive tier matching fixed',
    ],
    link: '/pricing',
  },
  {
    date: '2026-02-26',
    title: '4-Node Compute Cluster',
    type: 'feature',
    description: 'ALPHA, BRAVO, CHARLIE, and DELTA nodes networked. 24GB VRAM, 12+ cores, 64GB RAM, 5Gbps fiber. Cloud-first priority chain established.',
    highlights: [
      'ALPHA: i7-6700K, RTX 4060 + GTX 1080',
      'BRAVO: i7-11700F, RTX 3070 (inference)',
      'CHARLIE: Kali (security/OSINT)',
      'Cloudflare Workers → BRAVO → ALPHA priority',
    ],
  },
  {
    date: '2026-02-12',
    title: 'Engine Runtime — 2,660 Engines Live',
    type: 'feature',
    description: 'Intelligence engine fleet reached 2,660 engines with 472,998 doctrines across 210 domains. TIE Gold Standard: 20 mandatory components per engine.',
  },
  {
    date: '2025-12-01',
    title: 'Echo Prime Technologies Founded',
    type: 'launch',
    description: 'Bobby Don McWilliams II begins building the most advanced autonomous AI platform ever constructed by an independent founder. Zero VC funding. Built from scratch on edge infrastructure in Midland, Texas.',
  },
];

const TYPE_COLORS: Record<string, string> = {
  feature: '#3b82f6',
  improvement: '#22c55e',
  fix: '#f59e0b',
  launch: '#a855f7',
};

const TYPE_LABELS: Record<string, string> = {
  feature: 'New Feature',
  improvement: 'Improvement',
  fix: 'Bug Fix',
  launch: 'Launch',
};

export default function ChangelogPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Changelog', href: '/changelog' }]} />
      {/* Nav */}
      <nav
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={140}
            height={32}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            Pricing
          </Link>
          <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            SDK
          </Link>
          <Link href="/engines" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
            Engines
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 32px', textAlign: 'center' }}>
        <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)', marginBottom: 12 }}>
          Changelog
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ept-text-secondary)', marginBottom: 8 }}>
          What we shipped. No fluff, no buzzwords — just real engineering updates.
        </p>
        <p style={{ fontSize: 14, color: 'var(--ept-text-muted)' }}>
          Building since December 2025. 14+ months. Zero VC funding.
        </p>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        {CHANGELOG.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 24,
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: i < CHANGELOG.length - 1 ? '1px solid var(--ept-card-border)' : 'none',
            }}
          >
            {/* Date column */}
            <div style={{ minWidth: 100, flexShrink: 0, paddingTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text-muted)' }}>
                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', opacity: 0.6 }}>
                {entry.date.split('-')[0]}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: TYPE_COLORS[entry.type] + '22',
                    color: TYPE_COLORS[entry.type],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {TYPE_LABELS[entry.type]}
                </span>
                {entry.version && (
                  <span style={{ fontSize: 12, color: 'var(--ept-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {entry.version}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: 'var(--ept-text)' }}>
                {entry.link ? (
                  <Link href={entry.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </h3>

              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ept-text-secondary)', marginBottom: entry.highlights ? 12 : 0 }}>
                {entry.description}
              </p>

              {entry.highlights && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {entry.highlights.map((h, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 13,
                        padding: '3px 0',
                        color: 'var(--ept-text-secondary)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: 'var(--ept-accent)', fontSize: 10, flexShrink: 0 }}>&#9679;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '48px 24px 80px',
          textAlign: 'center',
          borderTop: '1px solid var(--ept-card-border)',
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Want to build with us?</h2>
        <p style={{ fontSize: 15, color: 'var(--ept-text-secondary)', marginBottom: 24 }}>
          Start free with 100 queries/day across 5,486+ intelligence engines.
        </p>
        <Link href="/sdk/signup">
          <button
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--ept-accent)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Get Your API Key
          </button>
        </Link>
      </section>
    </div>
  );
}
