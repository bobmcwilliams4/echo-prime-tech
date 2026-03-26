'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import FaqSchema from '../../components/FaqSchema';

// ═══════════════════════════════════════════════════════════════
// SERVICE CATALOG — Mirrors ept-api SERVICES with ecommerce metadata
// ═══════════════════════════════════════════════════════════════

interface ServiceTier {
  tier: string;
  price: number | null;
  interval: string;
  features: string[];
  popular?: boolean;
  custom?: boolean;
  per_call?: number;
  included_calls?: number;
}

interface EcomService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
  badge?: string;
  pricing: ServiceTier[];
  learnMore: string;
  workerHealthy: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'ai', label: 'AI & Intelligence' },
  { id: 'bots', label: 'Bots & Automation' },
  { id: 'security', label: 'Security' },
  { id: 'monitoring', label: 'Intelligence & Monitoring' },
  { id: 'data', label: 'Data & Knowledge' },
  { id: 'creative', label: 'Creative & Media' },
  { id: 'professional', label: 'Professional Services' },
];

const SERVICES: EcomService[] = [
  {
    id: 'ai-closer', name: 'AI Sales Agent (Closer)', tagline: 'Your 24/7 AI closer that never sleeps',
    description: 'Autonomous AI voice closer with real-time STT, LLM reasoning, and natural TTS. Handles cold calls, follow-ups, objection handling. Replaces SDR teams.',
    icon: '\u2B23', category: 'ai', badge: 'Best Seller',
    pricing: [
      { tier: 'Starter', price: 299, interval: 'month', features: ['100 calls/mo', '$0.35/call after', '1 campaign', 'Basic analytics'] },
      { tier: 'Growth', price: 499, interval: 'month', features: ['500 calls/mo', '$0.30/call after', '5 campaigns', 'CRM integration', 'Script engine'], popular: true },
      { tier: 'Enterprise', price: 999, interval: 'month', features: ['2,000 calls/mo', 'Custom voice cloning', 'API access', 'White-label'] },
    ],
    learnMore: '/closer', workerHealthy: true,
  },
  {
    id: 'intelligence-engines', name: 'Intelligence Engines', tagline: 'AI that thinks like a senior analyst',
    description: '5,486+ purpose-built AI reasoning systems across 940+ domains. Deep embedded expertise — not a wrapper. Tax, legal, oilfield, medical, finance, cybersecurity, and more.',
    icon: '\u2B21', category: 'ai', badge: 'Flagship',
    pricing: [
      { tier: 'API Access', price: 199, interval: 'month', features: ['10K queries/mo', 'Standard engines', 'REST API'] },
      { tier: 'Professional', price: 499, interval: 'month', features: ['100K queries/mo', 'All 5,486+ engines', 'Priority queue', 'Batch processing'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited queries', 'Custom engines', 'Dedicated infra'], custom: true },
    ],
    learnMore: '/engines', workerHealthy: true,
  },
  {
    id: 'cyber-defense', name: 'Cyber Defense Suite', tagline: 'AI-powered defensive security',
    description: 'Continuous threat monitoring, credential breach detection, phishing defense, vulnerability scanning, digital forensics. 90+ defense tools orchestrated by AI.',
    icon: '\u2B1F', category: 'security',
    pricing: [
      { tier: 'Essential', price: 299, interval: 'month', features: ['Threat monitoring', 'Vuln scanning', 'Breach detection'] },
      { tier: 'Advanced', price: 599, interval: 'month', features: ['24/7 SOC', 'SIEM integration', 'Incident response', 'Compliance'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Dedicated SOC', 'Digital forensics', 'SOC2/HIPAA'], custom: true },
    ],
    learnMore: '/security', workerHealthy: true,
  },
  {
    id: 'penetration-testing', name: 'Penetration Testing', tagline: 'Find every vulnerability before attackers do',
    description: 'Full-scope offensive security: network, web, wireless, mobile, cloud, AD. Red team operations with 300+ attack tools.',
    icon: '\u2694', category: 'security',
    pricing: [
      { tier: 'Standard', price: 2500, interval: 'engagement', features: ['External network', 'Web app test', 'OWASP Top 10', 'Report'] },
      { tier: 'Comprehensive', price: 7500, interval: 'engagement', features: ['Internal + external', 'AD attack sim', 'Social engineering', 'Wireless'], popular: true },
      { tier: 'Red Team', price: null, interval: 'engagement', features: ['Full adversary sim', 'Physical security', 'Cloud infra'], custom: true },
    ],
    learnMore: '/pentesting', workerHealthy: true,
  },
  {
    id: 'shadowglass-browser', name: 'ShadowGlass Browser', tagline: 'Privacy-first browser with 120+ evasion techniques',
    description: 'Chromium-based desktop browser with Tor routing, proxy chaining, 13-engine meta-search, autonomous scraping, embedded Claude AI terminal.',
    icon: '\u25C6', category: 'security', badge: 'Unique',
    pricing: [
      { tier: 'Personal', price: 29, interval: 'month', features: ['120+ evasion techniques', 'Shadow mode', 'Echo Search'] },
      { tier: 'Professional', price: 99, interval: 'month', features: ['Tor + .onion', 'Ghost mode', 'Dark web search', 'Claude AI terminal'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited seats', 'Custom evasion profiles'], custom: true },
    ],
    learnMore: '/services', workerHealthy: true,
  },
  {
    id: 'data-pipelines', name: 'Data Pipelines', tagline: 'Autonomous data extraction at scale',
    description: 'Systems that find, extract, normalize, and deliver structured data from thousands of sources — running 24/7 without human intervention.',
    icon: '\u25C8', category: 'data',
    pricing: [
      { tier: 'Starter', price: 199, interval: 'month', features: ['5 data sources', '10K records/mo', 'Daily sync'] },
      { tier: 'Professional', price: 499, interval: 'month', features: ['25 sources', '100K records/mo', 'Real-time sync', 'API delivery'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited sources', 'Custom scrapers', 'SLA'], custom: true },
    ],
    learnMore: '/pipelines', workerHealthy: true,
  },
  {
    id: 'knowledge-systems', name: 'Knowledge Systems', tagline: "Your organization's second brain",
    description: '170,000+ knowledge chunks, 575 categories, semantic vector search, auto-categorization. Hybrid retrieval combining precision and understanding.',
    icon: '\u25B3', category: 'data',
    pricing: [
      { tier: 'Team', price: 149, interval: 'month', features: ['5K documents', 'Semantic search', 'Auto-categorization'] },
      { tier: 'Business', price: 399, interval: 'month', features: ['50K documents', 'Knowledge graph', 'AI summarization', 'API'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'Custom embeddings', 'On-premise'], custom: true },
    ],
    learnMore: '/knowledge', workerHealthy: true,
  },
  {
    id: 'landman-intelligence', name: 'Landman Intelligence', tagline: 'AI-powered title research & mineral rights',
    description: 'Chain of title, ownership graphs, 4 No-Gaps Gates, run sheet generation, mineral interest tracking. TitleHound AI across 80+ Texas counties.',
    icon: '\u26F0', category: 'data', badge: 'Industry First',
    pricing: [
      { tier: 'Starter', price: 199, interval: 'month', features: ['5 title searches/mo', '80+ counties', 'Chain of title report'] },
      { tier: 'Professional', price: 499, interval: 'month', features: ['25 searches/mo', 'No-Gaps analysis', 'Title graph', 'Bulk API'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'TitleHound AI', 'White-label reports'], custom: true },
    ],
    learnMore: '/sentinel', workerHealthy: true,
  },
  {
    id: 'voice-ai', name: 'Voice AI & TTS', tagline: 'Voices that sound human, at scale',
    description: 'Custom voice cloning, emotion-aware TTS, real-time voice synthesis for AI agents, IVR systems, and content creation. Sub-200ms latency.',
    icon: '\u25C7', category: 'creative',
    pricing: [
      { tier: 'Creator', price: 29, interval: 'month', features: ['100K characters/mo', '3 voices', 'Emotion tags'] },
      { tier: 'Professional', price: 99, interval: 'month', features: ['500K characters/mo', '10 voices', 'Voice cloning', 'Real-time'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'Custom models', 'On-premise'], custom: true },
    ],
    learnMore: '/voice', workerHealthy: true,
  },
  {
    id: 'immortality-vault', name: 'Immortality Vault', tagline: 'Preserve your legacy forever',
    description: 'Digital consciousness preservation. Voice cloning, personality capture, family tree, ancestor chat, daily briefings. Talk to loved ones across time.',
    icon: '\uD83E\uDDEC', category: 'creative', badge: 'Innovative',
    pricing: [
      { tier: 'Free', price: 0, interval: 'month', features: ['1 profile', '50 questions', 'Text chat only'] },
      { tier: 'Legacy', price: 19, interval: 'month', features: ['5 profiles', 'Voice chat', '1 voice clone', 'Family tree'], popular: true },
      { tier: 'Dynasty', price: 49, interval: 'month', features: ['Unlimited profiles', 'Real-time voice', 'Unlimited clones', 'API'] },
    ],
    learnMore: '/immortality-vault', workerHealthy: true,
  },
  {
    id: 'collectibles-grading', name: 'Collectibles Grading', tagline: 'AI-powered comic & collectible auth',
    description: '5-model AI consensus grading. CGC-scale accuracy, defect detection, multi-source pricing from GoCollect, Heritage Auctions, and eBay.',
    icon: '\u2B50', category: 'creative',
    pricing: [
      { tier: 'Collector', price: 19, interval: 'month', features: ['25 grades/mo', 'CGC scale', 'Defect detection'] },
      { tier: 'Dealer', price: 79, interval: 'month', features: ['200 grades/mo', 'Batch grading', '5 AI providers', 'Multi-source pricing'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'Custom models', 'White-label'], custom: true },
    ],
    learnMore: '/grading', workerHealthy: true,
  },
  {
    id: 'tax-return-prep', name: 'Tax Return Preparation', tagline: 'AI-powered professional tax prep',
    description: '14 AI Tax Intelligence Engines. IRS 1040 calculation, bracket analysis, optimization suggestions, MACRS depreciation, document OCR.',
    icon: '\u25A3', category: 'professional',
    pricing: [
      { tier: 'Basic', price: 150, interval: 'one-time', features: ['W-2 only', 'Federal 1040', 'Standard deduction', 'E-file'] },
      { tier: 'Standard', price: 250, interval: 'one-time', features: ['W-2 + 1099s', 'Itemized deductions', 'AI optimization'], popular: true },
      { tier: 'Business', price: 600, interval: 'one-time', features: ['Self-employment', 'Schedule C/SE', 'QBI deduction', 'MACRS'] },
    ],
    learnMore: '/tax-returns', workerHealthy: true,
  },
  // ═══════════════════════════════════════════════════════════════
  // BOTS & AUTOMATION
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'bot-factory', name: 'Bot Factory', tagline: 'Custom AI bots for any platform',
    description: '29 bot templates across Discord, X/Twitter, Telegram, LinkedIn, Slack, Reddit, WhatsApp. 14 AI personalities, autonomous posting, engagement tracking.',
    icon: '\uD83E\uDD16', category: 'bots', badge: 'Popular',
    pricing: [
      { tier: 'Single Bot', price: 499, interval: 'one-time', features: ['1 platform bot', '14 AI personalities', 'Autonomous posting', 'Analytics dashboard'] },
      { tier: 'Multi-Platform', price: 1499, interval: 'one-time', features: ['3 platform bots', 'Cross-platform memory', 'A/B testing', 'Lead detection'], popular: true },
      { tier: 'Enterprise Fleet', price: null, interval: 'one-time', features: ['All platforms', 'Custom personalities', 'White-label', 'Dedicated support'], custom: true },
    ],
    learnMore: '/bots', workerHealthy: true,
  },
  {
    id: 'scraper-factory', name: 'Scraper & Harvester Factory', tagline: 'Industrial-scale data extraction',
    description: '23 scraper templates — web, government, social, market data. Proxy rotation, anti-detection, structured output. Runs 24/7 on edge infrastructure.',
    icon: '\uD83D\uDD77', category: 'bots',
    pricing: [
      { tier: 'Standard', price: 399, interval: 'one-time', features: ['1 custom scraper', 'Rate limiting', 'Structured output', 'Cron scheduling'] },
      { tier: 'Professional', price: 1299, interval: 'one-time', features: ['3 scrapers', 'Proxy rotation', 'Anti-detection', 'API delivery'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'one-time', features: ['Unlimited scrapers', 'Custom pipelines', 'SLA'], custom: true },
    ],
    learnMore: '/scrapers', workerHealthy: true,
  },
  {
    id: 'x-twitter-bot', name: 'X/Twitter AI Bot', tagline: 'Autonomous social presence on X',
    description: 'AI-powered X bot with autonomous posting, mention monitoring, engagement tracking, A/B testing, Grok AI images. 14 personality modes.',
    icon: '\uD835\uDD4F', category: 'bots',
    pricing: [
      { tier: 'Starter', price: 199, interval: 'month', features: ['8 posts/day', 'Auto-replies', 'Content scheduling', 'Basic analytics'] },
      { tier: 'Growth', price: 399, interval: 'month', features: ['Unlimited posts', 'A/B testing', 'AI images', 'Lead detection', 'Multi-personality'], popular: true },
      { tier: 'Agency', price: 799, interval: 'month', features: ['5 accounts', 'White-label', 'Campaign management', 'API access'] },
    ],
    learnMore: '/x-bot', workerHealthy: true,
  },
  {
    id: 'linkedin-bot', name: 'LinkedIn AI Engine', tagline: 'Professional thought leadership on autopilot',
    description: 'Autonomous LinkedIn posting, comment engagement, DM auto-reply, lead detection from conversations. 11 professional content categories.',
    icon: '\uD83D\uDCBC', category: 'bots',
    pricing: [
      { tier: 'Professional', price: 249, interval: 'month', features: ['3 posts/day', 'Comment engagement', 'Lead scoring', 'Analytics'] },
      { tier: 'Enterprise', price: 499, interval: 'month', features: ['Unlimited posts', 'DM automation', 'CRM integration', 'Article publishing'], popular: true },
      { tier: 'Agency', price: null, interval: 'month', features: ['Multi-account', 'White-label', 'Team management'], custom: true },
    ],
    learnMore: '/linkedin', workerHealthy: true,
  },
  {
    id: 'reddit-bot', name: 'Reddit Intelligence Bot', tagline: 'Monitor and engage across subreddits',
    description: 'Subreddit monitoring, keyword-triggered replies, autonomous posting, karma tracking. Content adaptation per community.',
    icon: '\uD83D\uDDE3', category: 'bots',
    pricing: [
      { tier: 'Starter', price: 149, interval: 'month', features: ['5 subreddits', 'Keyword monitoring', 'Auto-replies', 'Analytics'] },
      { tier: 'Professional', price: 349, interval: 'month', features: ['25 subreddits', 'Autonomous posting', 'Sentiment tracking', 'Lead detection'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'Custom workflows', 'API access'], custom: true },
    ],
    learnMore: '/reddit', workerHealthy: true,
  },
  // ═══════════════════════════════════════════════════════════════
  // INTELLIGENCE & MONITORING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'price-alerts', name: 'Price & Market Alerts', tagline: 'Never miss a market move',
    description: 'Real-time price monitoring for crypto, stocks, commodities. Custom alert rules, trend detection, portfolio tracking. Supports BTC, ETH, SOL, and 100+ assets.',
    icon: '\uD83D\uDCB0', category: 'monitoring',
    pricing: [
      { tier: 'Free', price: 0, interval: 'month', features: ['3 alerts', 'Email notifications', 'Daily summary'] },
      { tier: 'Trader', price: 29, interval: 'month', features: ['50 alerts', 'SMS + Telegram', 'Trend detection', 'Portfolio tracking'], popular: true },
      { tier: 'Professional', price: 99, interval: 'month', features: ['Unlimited alerts', 'API webhooks', 'Custom strategies', 'Multi-exchange'] },
    ],
    learnMore: '/price-alerts', workerHealthy: true,
  },
  // ═══════════════════════════════════════════════════════════════
  // AI & INTELLIGENCE (additional)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'office-ai', name: 'Office AI Platform', tagline: 'AI-powered office productivity suite',
    description: 'Complete AI office: document generation, meeting transcription, email automation, project management, calendar optimization. Replaces 10 SaaS subscriptions.',
    icon: '\uD83C\uDFE2', category: 'ai',
    pricing: [
      { tier: 'Team', price: 99, interval: 'month', features: ['5 users', 'Document AI', 'Meeting transcription', 'Email automation'] },
      { tier: 'Business', price: 299, interval: 'month', features: ['25 users', 'All features', 'CRM integration', 'Custom workflows'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited users', 'On-premise', 'SSO'], custom: true },
    ],
    learnMore: '/office-ai', workerHealthy: true,
  },
  // ═══════════════════════════════════════════════════════════════
  // SECURITY (additional)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'reveng-scanner', name: 'REVENG Scanner', tagline: 'Find what others miss',
    description: '10+ scan modules: port scanning, service enumeration, vulnerability detection, SSL analysis, DNS reconnaissance, subdomain discovery. Professional reporting.',
    icon: '\uD83D\uDD0D', category: 'security',
    pricing: [
      { tier: 'Basic', price: 99, interval: 'month', features: ['5 scans/day', '5 modules', 'PDF reports', 'Email alerts'] },
      { tier: 'Professional', price: 299, interval: 'month', features: ['Unlimited scans', 'All 10+ modules', 'API access', 'Scheduled scans'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Dedicated infra', 'Custom modules', 'SLA'], custom: true },
    ],
    learnMore: '/scanner', workerHealthy: true,
  },
  // ═══════════════════════════════════════════════════════════════
  // PROFESSIONAL SERVICES (additional)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'sdk-portal', name: 'SDK & Developer Portal', tagline: 'Build on the ECHO platform',
    description: '17+ API endpoints, OpenAPI documentation, playground, code examples. Access Intelligence Engines, Knowledge Forge, and Shared Brain via REST API.',
    icon: '\uD83D\uDD17', category: 'professional',
    pricing: [
      { tier: 'Free', price: 0, interval: 'month', features: ['1K API calls/mo', 'Playground access', 'Documentation', 'Community support'] },
      { tier: 'Developer', price: 49, interval: 'month', features: ['25K API calls/mo', 'All endpoints', 'Webhooks', 'Priority support'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Unlimited', 'Dedicated keys', 'SLA'], custom: true },
    ],
    learnMore: '/sdk', workerHealthy: true,
  },
  {
    id: 'unified-payments', name: 'Unified Payments', tagline: 'Accept payments everywhere',
    description: 'Stripe + PayPal integration, subscription management, invoicing, revenue analytics. One dashboard for all payment processing.',
    icon: '\uD83D\uDCB3', category: 'professional',
    pricing: [
      { tier: 'Starter', price: 29, interval: 'month', features: ['Stripe integration', 'Invoice generation', 'Payment links', 'Basic analytics'] },
      { tier: 'Business', price: 99, interval: 'month', features: ['Stripe + PayPal', 'Subscriptions', 'Revenue analytics', 'Webhook management'], popular: true },
      { tier: 'Enterprise', price: null, interval: 'month', features: ['Custom gateways', 'Multi-currency', 'White-label'], custom: true },
    ],
    learnMore: '/payments', workerHealthy: true,
  },
];

const COMMANDER_EMAILS = [
  'bmcii1976@gmail.com', 'bobmcwilliams4@outlook.com', 'bobbymcwilliams@echo-op.com',
  'bob@echo-op.com', 'billy@echo-op.com', 'bobby@echo-op.com',
];

function formatPrice(price: number | null, interval: string): string {
  if (price === null) return 'Contact Us';
  if (price === 0) return 'Free';
  const formatted = price >= 1000 ? `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K` : `$${price}`;
  if (interval === 'month') return `${formatted}/mo`;
  if (interval === 'one-time') return formatted;
  if (interval === 'engagement') return `From ${formatted}`;
  return formatted;
}

function getStartingPrice(service: EcomService): { price: number | null; interval: string } {
  const paid = service.pricing.filter(p => p.price !== null && p.price > 0);
  if (paid.length === 0) {
    const free = service.pricing.find(p => p.price === 0);
    if (free) return { price: 0, interval: free.interval };
    return { price: null, interval: 'month' };
  }
  paid.sort((a, b) => (a.price || 0) - (b.price || 0));
  return { price: paid[0].price, interval: paid[0].interval };
}

function getPopularTier(service: EcomService): ServiceTier | undefined {
  return service.pricing.find(p => p.popular) || service.pricing[1] || service.pricing[0];
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ProductCard({ service, onBuy, onViewDetails }: { service: EcomService; onBuy: (s: EcomService, tier: ServiceTier) => void; onViewDetails: (s: EcomService) => void }) {
  const [expanded, setExpanded] = useState(false);
  const popular = getPopularTier(service);
  const starting = getStartingPrice(service);

  return (
    <div data-tutorial="ecommerce-hero"
      className="rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
      style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
    >
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'E-Commerce', href: '/ecommerce' }]} />
      {/* Badge */}
      {service.badge && (
        <div className="px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
          {service.badge}
        </div>
      )}

      {/* Header */}
      <div className="p-5 flex-1">
        <div data-tutorial="ecommerce-service" className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{service.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--ept-text)' }}>{service.name}</h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ept-accent)' }}>{service.tagline}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
          {service.description}
        </p>

        {/* Starting Price */}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--ept-text-muted)' }}>Starting at</span>
          <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            {formatPrice(starting.price, starting.interval)}
          </div>
        </div>

        {/* Tier selector (expanded) */}
        {expanded && (
          <div data-tutorial="ecommerce-tier" className="space-y-3 mb-4 animate-fade-up">
            {service.pricing.map((tier) => (
              <button
                key={tier.tier}
                onClick={() => onBuy(service, tier)}
                className="w-full text-left p-3 rounded-xl border transition-all hover:shadow-md"
                style={{
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  backgroundColor: tier.popular ? 'rgba(20,184,166,0.08)' : 'var(--ept-surface)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                    {tier.tier}
                    {tier.popular && <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Popular</span>}
                  </span>
                  <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>
                    {formatPrice(tier.price, tier.interval)}
                  </span>
                </div>
                <ul className="text-xs space-y-0.5" style={{ color: 'var(--ept-text-muted)' }}>
                  {tier.features.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                  {tier.features.length > 3 && <li>+{tier.features.length - 3} more</li>}
                </ul>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-5 pt-0 space-y-2">
        {!expanded ? (
          <>
            <button
              onClick={() => {
                if (popular && popular.price !== null) {
                  onBuy(service, popular);
                } else {
                  setExpanded(true);
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
            >
              {popular?.price === null ? 'Contact Sales' : popular?.price === 0 ? 'Get Started Free' : 'Buy Now'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setExpanded(true)}
                className="flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:opacity-80"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                View Plans
              </button>
              <Link
                href={service.learnMore}
                className="flex-1 px-4 py-2 rounded-xl border text-sm font-medium text-center transition-all hover:opacity-80"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                Learn More
              </Link>
            </div>
          </>
        ) : (
          <button
            onClick={() => setExpanded(false)}
            className="w-full px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:opacity-80"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
          >
            Collapse
          </button>
        )}
      </div>
    </div>
  );
}

const FAQS = [
  { q: 'Can I migrate from Shopify?', a: 'Yes. Export your Shopify products as CSV and use our bulk import endpoint. Products, variants, images, and categories transfer in minutes. Customer data and order history can be imported via API.' },
  { q: 'How does AI product description generation work?', a: 'Provide a product name and basic details, and AI generates SEO-optimized descriptions, bullet points, and meta tags. Customize tone (professional, casual, luxury) and length. Generate descriptions in 20+ languages.' },
  { q: 'What payment methods are supported?', a: 'Stripe, PayPal, and direct bank transfer out of the box. Support for Apple Pay, Google Pay, and Buy Now Pay Later via Stripe integration. Multi-currency with automatic conversion.' },
  { q: 'Is there inventory management?', a: 'Yes. Real-time stock tracking, low-stock alerts, variant-level inventory (size, color, etc.), and backorder support. Integrates with Echo Inventory for multi-warehouse management.' },
  { q: 'Can I sell digital products?', a: 'Yes. Upload digital files (PDFs, software, courses) with secure download links that expire after a configurable number of downloads or time period. License key generation available.' },
  { q: 'How does the storefront work?', a: 'API-first headless commerce — use our embeddable widgets for a no-code storefront, or build a fully custom frontend with our REST API. SEO-optimized product pages with schema markup included.' },
];

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function EcommercePage() {
  const { isDark, toggle } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');

  const filtered = useMemo(() => {
    let result = [...SERVICES];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(s => s.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (getStartingPrice(a).price ?? 99999) - (getStartingPrice(b).price ?? 99999));
        break;
      case 'price-high':
        result.sort((a, b) => (getStartingPrice(b).price ?? 0) - (getStartingPrice(a).price ?? 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Keep original order (featured first via badge)
        result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  function handleBuy(service: EcomService, tier: ServiceTier) {
    if (tier.custom || tier.price === null) {
      window.location.href = `mailto:bob@echo-op.com?subject=Enterprise%20Inquiry%20-%20${encodeURIComponent(service.name)}`;
      return;
    }

    // Commander bypass
    if (user && COMMANDER_EMAILS.includes(user.email || '')) {
      router.push(`/checkout?service=${service.id}&tier=${tier.tier.toLowerCase()}`);
      return;
    }

    if (!user) {
      router.push(`/signup?redirect=${encodeURIComponent(`/checkout?service=${service.id}&tier=${tier.tier.toLowerCase()}`)}`);
    } else {
      router.push(`/checkout?service=${service.id}&tier=${tier.tier.toLowerCase()}`);
    }
  }

  function handleViewDetails(service: EcomService) {
    router.push(service.learnMore);
  }

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { all: SERVICES.length };
    for (const s of SERVICES) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <FaqSchema faqs={FAQS} />
      {/* Nav Bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="Echo Prime Technologies"
              width={140}
              height={36}
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            />
          </Link>
          <span className="text-sm font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Store</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <button onClick={toggle} className="p-2 rounded-lg hover:opacity-80" style={{ color: 'var(--ept-text-muted)' }}>{isDark ? '\u2600' : '\u263E'}</button>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-12 md:py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          The <span className="gradient-text">AI Store</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Production-ready AI services built by a 30-year industry veteran. No wrappers. No vaporware. Real intelligence engines, battle-tested and ready to deploy.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-5 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--ept-surface)',
              borderColor: 'var(--ept-border)',
              color: 'var(--ept-text)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
              style={{ color: 'var(--ept-text-muted)' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 mt-6 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>{SERVICES.length}</strong> Products</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>5,486+</strong> AI Engines</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>99.9%</strong> Uptime</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>0</strong> Cold Starts</span>
        </div>
      </section>

      {/* Category Tabs + Sort */}
      <section className="px-6 max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeCategory === cat.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
                  color: activeCategory === cat.id ? '#fff' : 'var(--ept-text-secondary)',
                  borderColor: 'var(--ept-border)',
                }}
              >
                {cat.label} ({categoryCount[cat.id] || 0})
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-xl border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 max-w-7xl mx-auto pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>No products match your search.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div data-tutorial="ecommerce-filter" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(service => (
              <ProductCard
                key={service.id}
                service={service}
                onBuy={handleBuy}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Enterprise CTA */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Need a Custom Solution?
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
            Bundle multiple products, get dedicated infrastructure, or request a custom AI engine built for your specific domain.
          </p>
          <a
            href="mailto:bob@echo-op.com?subject=Enterprise%20Bundle%20Inquiry"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
          >
            Contact Sales
          </a>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="px-6 py-10 border-t" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>14 months</div>
            <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Continuous development</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>Zero VC</div>
            <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>100% self-funded</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>Global Edge</div>
            <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Sub-50ms worldwide</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>Midland, TX</div>
            <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Built in the Permian Basin</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Commerce Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['BUS', 'FIN']}
          title="Ask the Commerce Intelligence Engine"
          placeholder="Ask about ecommerce, payments, fulfillment..."
          exampleQueries={['Best practices for subscription billing', 'How to reduce cart abandonment', 'Payment processor fee comparison']}
        />
      </section>

      {/* FAQs */}
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

      <footer className="px-6 py-8 border-t text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved. |{' '}
          <Link href="/legal/terms" className="hover:underline" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link> |{' '}
          <Link href="/legal/privacy" className="hover:underline" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link> |{' '}
          <Link href="/support" className="hover:underline" style={{ color: 'var(--ept-text-secondary)' }}>Support</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="ecommerce" productName="Ecommerce Store" />
    </div>
  );
}
