'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '../../lib/theme-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import FaqSchema from '../../components/FaqSchema';

/* ── Bot Categories ── */

interface BotExample {
  name: string;
  icon: string;
  desc: string;
  features: string[];
  tag: string;
  tagColor: string;
}

interface BotCategory {
  id: string;
  label: string;
  icon: string;
  desc: string;
  bots: BotExample[];
}

const BOT_CATEGORIES: BotCategory[] = [
  {
    id: 'social',
    label: 'Social Media Bots',
    icon: '📱',
    desc: 'Automated posting, engagement, and community management across every platform.',
    bots: [
      { name: 'X / Twitter Bot', icon: '🐦', desc: 'Scheduled posts, auto-replies, thread generators, sentiment monitoring, follower analytics', features: ['AI content generation', 'Scheduled posting (cron)', 'Auto-reply with context', 'Hashtag strategy', 'Engagement tracking'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'LinkedIn Bot', icon: '💼', desc: 'Professional content, approval queue, connection management, thought leadership', features: ['Professional tone AI', 'Content approval queue', 'Connection auto-accept', 'Post analytics', 'Lead gen integration'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Telegram Bot', icon: '✈️', desc: 'Group management, command handlers, inline queries, payment processing', features: ['Multi-group management', 'Custom commands', 'Inline query search', 'Voice message STT', 'Payment integration'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Discord Bot', icon: '🎮', desc: 'Server moderation, role management, music, mini-games, AI chat', features: ['Slash commands', 'Auto-moderation', 'Role assignment', 'Ticket system', 'AI personality chat'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'WhatsApp Bot', icon: '💬', desc: 'Business messaging, catalog browsing, order tracking, customer support', features: ['Business API', 'Quick replies', 'Catalog integration', 'Order notifications', 'Multi-language'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Reddit Bot', icon: '🔴', desc: 'Subreddit monitoring, auto-commenting, karma farming, content curation', features: ['Subreddit monitoring', 'Keyword triggers', 'Content scheduling', 'Karma tracking', 'Cross-posting'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Facebook / Messenger Bot', icon: '📘', desc: 'Page management, Messenger flows, ad integration, lead capture', features: ['Messenger chatbot', 'Lead gen forms', 'Ad automation', 'Comment moderation', 'Page insights'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Instagram Bot', icon: '📸', desc: 'Story posting, DM automation, hashtag research, follower growth', features: ['Story scheduler', 'DM auto-reply', 'Hashtag analysis', 'Follower analytics', 'Content calendar'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'trading',
    label: 'Trading & Arbitrage Bots',
    icon: '📈',
    desc: 'Automated trading strategies across crypto, forex, and traditional markets.',
    bots: [
      { name: 'Crypto Arbitrage Bot', icon: '⚡', desc: 'Cross-exchange price arbitrage, triangular arb, DEX/CEX spread capture', features: ['Multi-exchange scanning', 'Triangular arbitrage', 'DEX-CEX bridging', 'Gas optimization', 'Profit tracking'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Grid Trading Bot', icon: '📊', desc: 'Grid strategy with dynamic spacing, DCA on dips, profit-taking on rallies', features: ['Dynamic grid spacing', 'Multi-pair support', 'Auto-DCA', 'Profit tracking', 'Safety floor'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Momentum Bot', icon: '🚀', desc: 'Trend-following with RSI, MACD, EMA crossovers, volume confirmation', features: ['Technical indicators', 'Multi-timeframe', 'Volume analysis', 'Trailing stops', 'Backtesting'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Sniper Bot', icon: '🎯', desc: 'New token launches, liquidity pool sniping, first-buyer advantage', features: ['Mempool monitoring', 'Gas bidding', 'Rug detection', 'Auto-sell triggers', 'Multi-chain'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Market Making Bot', icon: '🏦', desc: 'Bid-ask spread capture, order book depth management, inventory balancing', features: ['Spread optimization', 'Order book analysis', 'Inventory management', 'Fee optimization', 'Risk controls'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Copy Trading Bot', icon: '🔄', desc: 'Mirror top traders, whale wallet tracking, position sizing', features: ['Wallet tracking', 'Position mirroring', 'Configurable sizing', 'PnL dashboard', 'Multiple sources'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Forex Trading Bot', icon: '💱', desc: 'Major pairs, news-based trading, economic calendar integration', features: ['Major/minor pairs', 'News sentiment', 'Economic calendar', 'Risk management', 'MT4/MT5 bridge'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'NFT Floor Sweeper', icon: '🖼️', desc: 'Floor price monitoring, auto-buy undervalued NFTs, collection analytics', features: ['Floor monitoring', 'Rarity scoring', 'Auto-bid', 'Collection analytics', 'Multi-marketplace'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Customer Bots',
    icon: '🏢',
    desc: 'Customer service, sales automation, scheduling, and CRM integration.',
    bots: [
      { name: 'AI Sales Agent', icon: '📞', desc: 'Autonomous phone calls, lead qualification, appointment booking, CRM sync', features: ['Voice AI calling', 'Lead scoring', 'Appointment booking', 'CRM integration', 'Call analytics'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Customer Support Bot', icon: '🎧', desc: 'Multi-channel support, ticket routing, knowledge base queries, escalation', features: ['Multi-channel', 'Auto-routing', 'KB search', 'Escalation rules', 'CSAT tracking'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Scheduling Bot', icon: '📅', desc: 'Calendar management, booking pages, availability sync, reminders', features: ['Calendar sync', 'Booking pages', 'Timezone handling', 'Reminders', 'Buffer times'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Email Outreach Bot', icon: '📧', desc: 'Cold email sequences, personalization, follow-up automation, open tracking', features: ['Email sequences', 'AI personalization', 'A/B testing', 'Open/click tracking', 'Bounce handling'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Review Manager Bot', icon: '⭐', desc: 'Review monitoring, auto-responses, sentiment analysis, reputation score', features: ['Multi-platform', 'Auto-respond', 'Sentiment analysis', 'Alert system', 'Report generation'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring & Alert Bots',
    icon: '🔔',
    desc: 'Real-time monitoring, alerting, and automated responses for infrastructure and markets.',
    bots: [
      { name: 'Server Monitor Bot', icon: '🖥️', desc: 'Uptime checks, response time tracking, error alerting, auto-restart', features: ['HTTP/TCP checks', 'Response time graphs', 'Multi-channel alerts', 'Auto-restart', 'Status page'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Price Alert Bot', icon: '💰', desc: 'Crypto/stock price alerts, percentage moves, volume spikes, custom triggers', features: ['Multi-asset tracking', 'Custom thresholds', 'Volume alerts', 'Whale detection', 'Portfolio tracking'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Security Sentinel Bot', icon: '🛡️', desc: 'CVE monitoring, breach detection, vulnerability alerts, compliance checks', features: ['CVE feed tracking', 'Breach notifications', 'Port scanning', 'SSL expiry alerts', 'Compliance checks'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'News & Intelligence Bot', icon: '📰', desc: 'RSS aggregation, keyword monitoring, breaking news alerts, summary digest', features: ['Multi-source RSS', 'Keyword triggers', 'AI summaries', 'Digest scheduling', 'Topic clusters'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'automation',
    label: 'Automation & Integration Bots',
    icon: '⚙️',
    desc: 'Workflow automation, data sync, and cross-platform integration bots.',
    bots: [
      { name: 'Webhook Relay Bot', icon: '🔗', desc: 'Route webhooks between services, transform payloads, retry on failure', features: ['Multi-destination', 'Payload transform', 'Retry logic', 'Logging', 'Rate limiting'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Data Sync Bot', icon: '🔄', desc: 'Keep databases, CRMs, and spreadsheets in sync automatically', features: ['Bi-directional sync', 'Conflict resolution', 'Scheduled runs', 'Audit trail', 'Field mapping'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'CI/CD Bot', icon: '🚢', desc: 'Build notifications, deploy approvals, test results, rollback triggers', features: ['Build alerts', 'Deploy gates', 'Test summaries', 'Rollback buttons', 'Multi-repo'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Form / Survey Bot', icon: '📝', desc: 'Conversational forms, survey collection, data validation, export to CRM', features: ['Conversational UI', 'Logic branching', 'Validation rules', 'CRM export', 'Analytics'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
];

const FAQS = [
  { q: 'What platforms do your bots support?', a: 'We build bots for Discord, Slack, Telegram, X (Twitter), LinkedIn, Reddit, WhatsApp, Facebook Messenger, Instagram, and more. If a platform has an API, we can build a bot for it.' },
  { q: 'Can I customize my bot\'s personality and behavior?', a: 'Every bot is fully customizable. Choose from 14 pre-built AI personalities or define your own tone, vocabulary, and response style. You control the voice, the rules, and the boundaries.' },
  { q: 'How do autonomous posting schedules work?', a: 'Bots run on Cloudflare Workers with cron triggers, posting on schedules you define — hourly, daily, or based on custom logic like trending topics or engagement windows. All schedules are adjustable in real time.' },
  { q: 'Does the bot handle content moderation?', a: 'Yes. Every bot includes configurable moderation filters for spam, profanity, off-topic content, and custom blacklists. Escalation rules route flagged content to a human reviewer when needed.' },
  { q: 'What analytics and reporting do I get?', a: 'Each bot comes with an analytics dashboard tracking engagement rates, response times, audience growth, sentiment trends, and conversion metrics. Reports export to CSV or integrate directly with your CRM.' },
  { q: 'Can one bot manage multiple platforms at once?', a: 'Absolutely. Our Professional and Enterprise tiers support multi-platform bots that post, respond, and sync across all connected channels from a single control panel with unified analytics.' },
];

const PRICING_TIERS = [
  { tier: 'Starter', price: 499, interval: 'one-time', features: ['1 bot, 1 platform', 'Basic AI personality', 'Cloudflare Workers hosting', 'D1 database + KV cache', '30 days support'], popular: false },
  { tier: 'Professional', price: 1499, interval: 'one-time', features: ['1 bot, multi-platform', 'Advanced AI + 14 personalities', 'Cron scheduling', 'Analytics dashboard', 'CRM integration', '90 days support'], popular: true },
  { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited bots', 'Custom AI training', 'White-label', 'SLA guarantee', 'Dedicated engineer', 'Priority support'], popular: false, custom: true },
];

export default function BotsPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('social');
  const currentCategory = BOT_CATEGORIES.find(c => c.id === activeCategory) || BOT_CATEGORIES[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'AI Bots', href: '/bots' }]} />
      <FaqSchema faqs={FAQS} />
      <ProductTutorialButton tutorialId="bots" productName="Custom Bots" />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={36} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Bot Factory</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sentinel" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Sentinel AI</Link>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Home</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div data-tutorial="bots-hero" className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(20,184,166,0.1)', color: 'var(--ept-accent)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
            {BOT_CATEGORIES.reduce((t, c) => t + c.bots.length, 0)} Bot Templates Available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Custom <span className="gradient-text">AI Bot</span> Factory
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            We build autonomous bots for any platform. Social media, trading, arbitrage, customer service, monitoring — every bot powered by AI, deployed on Cloudflare Workers, running 24/7.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/checkout?service=bots&tier=professional" className="px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Get Started
            </Link>
            <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold border transition-transform hover:scale-105" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {BOT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: activeCategory === cat.id ? '#fff' : 'var(--ept-text-secondary)',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-center mb-8">
          <p className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>{currentCategory.icon} {currentCategory.label}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{currentCategory.desc}</p>
        </div>

        {/* Bot Grid */}
        <div data-tutorial="bots-templates" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {currentCategory.bots.map(bot => (
            <div
              key={bot.name}
              className="p-6 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{bot.icon}</span>
                  <h3 className="font-bold" style={{ color: 'var(--ept-text)' }}>{bot.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: bot.tagColor }}>
                  {bot.tag}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{bot.desc}</p>
              <ul className="space-y-1.5">
                {bot.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div data-tutorial="bots-features" className="rounded-2xl border p-8 mb-16" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold text-center mb-8" style={{ color: 'var(--ept-text)' }}>
            How We Build Your Bot
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Spec & Design', desc: 'Define platform, features, AI personality, and integration points.' },
              { step: '02', title: 'Build & Train', desc: 'Custom code on Cloudflare Workers + fine-tuned AI models for your domain.' },
              { step: '03', title: 'Deploy & Test', desc: 'Zero-downtime deployment, load testing, edge-distributed globally.' },
              { step: '04', title: 'Monitor & Iterate', desc: 'Analytics dashboard, error tracking, continuous AI improvement.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                  {s.step}
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div data-tutorial="bots-pricing" className="mb-16">
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: 'var(--ept-text)' }}>Bot Build Pricing</h2>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>One-time build fee. Hosting included on Cloudflare Workers (free tier covers most bots).</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING_TIERS.map(t => (
              <div
                key={t.tier}
                className="p-6 rounded-xl border relative"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: t.popular ? '0 0 30px rgba(20,184,166,0.15)' : undefined,
                }}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--ept-text)' }}>{t.tier}</h3>
                <div className="mb-4">
                  {t.custom ? (
                    <span className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${t.price?.toLocaleString()}</span>
                      <span className="text-sm ml-1" style={{ color: 'var(--ept-text-muted)' }}>{t.interval}</span>
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.custom ? 'mailto:bob@echo-op.com?subject=Enterprise%20Bot%20Build' : `/checkout?service=bots&tier=${t.tier.toLowerCase()}`}
                  className="block w-full text-center py-2.5 rounded-xl font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent',
                    color: t.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: t.popular ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  {t.custom ? 'Contact Us' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Ready to Automate?</h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Tell us what you need — we&apos;ll design, build, and deploy your custom AI bot within days.
          </p>
          <Link href="/checkout?service=bots&tier=professional" className="inline-flex px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Start Your Bot Project
          </Link>
        </div>
      </div>

      {/* FAQ */}
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

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Bot Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['SE', 'AI']}
          title="Ask the Bot Intelligence Engine"
          placeholder="Ask about bot development, automation, APIs..."
          exampleQueries={['Best practices for Discord bot rate limiting', 'How to handle webhook retries', 'OAuth2 bot token management']}
        />
      </section>
    </div>
  );
}
