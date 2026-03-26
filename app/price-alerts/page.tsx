'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import ProductTutorialButton from '../../components/product-tutorial-button';

const SERVICE_ID = 'price-alerts';

/* ================================================================
   FEATURE CARDS — 6 price alert capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Price Monitoring',
    desc: 'Track real-time prices across 10,000+ assets including cryptocurrencies, stocks, commodities, and forex pairs. Our distributed monitoring infrastructure polls exchanges and market data feeds every second, aggregating prices from 50+ sources to deliver the most accurate market picture available. Supports custom asset lists, watchlists, and portfolio-weighted tracking.',
    sources: ['Binance', 'Coinbase', 'Kraken', 'NYSE', 'NASDAQ', 'CME'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
      </svg>
    ),
    title: 'Smart Alerts',
    desc: 'Configure custom alert thresholds with surgical precision. Set absolute price targets, percentage moves, volume spikes, RSI crossovers, moving average breaches, and multi-condition triggers. Supports trailing stops, time-weighted alerts, and cooldown periods to prevent alert fatigue. Each alert fires within 2 seconds of condition being met across all monitored exchanges simultaneously.',
    sources: ['Price Targets', '% Moves', 'Volume Spikes', 'RSI Crossover', 'MA Breach', 'Custom Logic'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI Trend Analysis',
    desc: 'Workers AI-powered market scoring that goes beyond simple price tracking. Our models analyze momentum, sentiment, on-chain metrics, order book depth, whale wallet movements, and social signal clustering to generate actionable trend scores for every tracked asset. Predictive confidence intervals updated every 15 minutes with backtested accuracy metrics.',
    sources: ['Momentum Score', 'Sentiment Index', 'On-Chain Metrics', 'Order Book Depth', 'Whale Tracking', 'Social Signals'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Telegram Integration',
    desc: 'Instant alert delivery via Telegram bot with rich formatting, interactive buttons, and inline charts. Receive price alerts, trend summaries, and portfolio updates directly in your Telegram chat or group. Supports mute schedules, priority filtering, and one-tap actions to acknowledge, snooze, or escalate alerts. Also available via Discord, Slack, SMS, email, and custom webhooks.',
    sources: ['Telegram Bot', 'Discord', 'Slack', 'SMS (Twilio)', 'Email', 'Webhooks'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
    title: 'Portfolio Tracking',
    desc: 'Connect multiple exchange accounts via API keys for unified portfolio monitoring. Real-time P&L calculation, cost basis tracking, tax lot identification, and performance attribution across all holdings. Automatic detection of deposits, withdrawals, trades, and staking rewards. Export-ready reports for tax preparation with FIFO/LIFO/HIFO cost basis methods.',
    sources: ['Multi-Exchange', 'Real-Time P&L', 'Cost Basis', 'Tax Reports', 'Staking Rewards', 'DeFi Positions'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Historical Data',
    desc: 'Access comprehensive historical price data with interactive charts, candlestick patterns, and technical indicators. Backtest alert strategies against years of historical data to optimize your thresholds before going live. Export datasets in CSV, JSON, or API format for quantitative analysis. Includes volume profiles, market microstructure data, and correlation matrices across asset classes.',
    sources: ['Candlestick Charts', 'Technical Indicators', 'Backtesting', 'CSV/JSON Export', 'Correlation Matrix', 'Volume Profiles'],
  },
];

/* ================================================================
   HOW IT WORKS — 3-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set Alerts',
    desc: 'Choose your assets, define price thresholds, percentage moves, or AI-driven conditions. Configure delivery channels — Telegram, Discord, SMS, email, or webhooks. Set cooldowns and priority levels. Takes under 2 minutes to configure your first watchlist.',
  },
  {
    step: '02',
    title: 'AI Monitors',
    desc: 'Our distributed monitoring infrastructure tracks prices across 50+ exchanges and data feeds in real-time. Workers AI scores every asset for trend strength, sentiment shifts, and anomaly detection. Your alerts are evaluated against live data every second — 24/7, 365 days a year.',
  },
  {
    step: '03',
    title: 'Get Notified',
    desc: 'When conditions are met, alerts fire within 2 seconds across all your configured channels. Each notification includes the current price, trigger condition, AI trend score, and one-tap actions. Daily and weekly digest summaries keep you informed on broader market movements without notification overload.',
  },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: '10,000+', label: 'Assets Tracked' },
  { value: '50+', label: 'Data Sources' },
  { value: '<2s', label: 'Alert Latency' },
  { value: '24/7', label: 'Monitoring' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '6', label: 'Alert Channels' },
];

/* ================================================================
   PRICING TIERS
   ================================================================ */
const PRICING = [
  {
    tier: 'Free',
    price: 0,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      '3 active alerts',
      'Daily price summaries',
      'Email notifications',
      'Basic price charts',
      '7-day historical data',
      'Community support',
    ],
  },
  {
    tier: 'Pro',
    price: 19.99,
    interval: 'mo',
    popular: true,
    custom: false,
    features: [
      'Unlimited alerts',
      'Real-time notifications (<2s)',
      'AI trend analysis & scoring',
      'Telegram + Discord + SMS delivery',
      'Multi-exchange portfolio tracking',
      'Custom webhook integrations',
      'Advanced technical indicators',
      'Backtesting engine',
      '5-year historical data',
      'Priority support',
    ],
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
const FAQS = [
  { q: 'How fast do alerts fire after a price condition is met?', a: 'Alerts fire within 2 seconds of the condition being met. Our distributed monitoring infrastructure polls 50+ exchanges and data feeds every second, so you never miss a critical move.' },
  { q: 'What assets can I monitor?', a: 'Over 10,000 assets including cryptocurrencies (BTC, ETH, altcoins), stocks, commodities, and forex pairs. We aggregate data from Binance, Coinbase, Kraken, NYSE, NASDAQ, CME, and dozens more sources.' },
  { q: 'What notification channels are supported?', a: 'Alerts are delivered via Telegram, Discord, Slack, SMS (Twilio), email, and custom webhooks. You can configure different channels for different alert priorities and set mute schedules for non-urgent notifications.' },
  { q: 'How does the AI trend analysis work?', a: 'Workers AI models analyze momentum, market sentiment, on-chain metrics, order book depth, whale wallet movements, and social signals to generate actionable trend scores. Predictive confidence intervals are updated every 15 minutes with backtested accuracy.' },
  { q: 'Can I connect my exchange accounts for portfolio tracking?', a: 'Yes. Connect multiple exchange accounts via read-only API keys for unified portfolio monitoring. We support real-time P&L, cost basis tracking (FIFO/LIFO/HIFO), tax lot identification, and automatic detection of deposits, withdrawals, and staking rewards.' },
  { q: 'Is the free plan really free forever?', a: 'Yes. The free tier includes 3 active alerts, daily price summaries, email notifications, and 7-day historical data with no time limit. Upgrade to Pro anytime for unlimited alerts, real-time notifications, and AI analysis.' },
];

export default function PriceAlertsPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleCheckout = (tierIndex: number) => {
    const tier = PRICING[tierIndex];
    if (tier.price === 0) {
      window.location.href = user ? '/dashboard' : '/signup';
      return;
    }
    if (!user) {
      window.location.href = `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
      return;
    }
    window.location.href = `/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Price Alerts', href: '/price-alerts' }]} />
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/crypto-trading" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Crypto Trading</Link>
          <Link href="/sec-intel" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>SEC Intel</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* --- Hero --- */}
      <section data-tutorial="alerts-hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} /> Real-Time Alerts &bull; AI Analysis &bull; Multi-Exchange
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          Real-Time<br />
          Price Alerts<br />
          <span className="gradient-text">AI-Powered.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered market monitoring across <strong>10,000+ assets</strong> with instant notifications via Telegram, Discord, SMS, and webhooks. Custom thresholds, trend scoring, portfolio tracking, and historical analysis &mdash; alerts fire in under <strong>2 seconds</strong>.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/dashboard' : '/signup'} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free &mdash; 3 Alerts Included
          </Link>
          <Link href="/crypto-trading" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            Need Full Crypto Trading?
          </Link>
        </div>
        <div className="mt-4">
          <ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} />
        </div>
      </section>

      {/* --- Stats Grid --- */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Feature Grid (expandable) --- */}
      <section data-tutorial="alerts-config" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>6 Alert Intelligence Layers</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            From raw market data to actionable alerts &mdash; each layer operates independently and feeds into a unified monitoring pipeline.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const isExpanded = expandedFeature === i;
            return (
              <button key={i} onClick={() => setExpandedFeature(isExpanded ? null : i)} className="text-left p-5 rounded-2xl border transition-all hover:shadow-lg" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isExpanded ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: isExpanded ? '0 0 25px var(--ept-accent-glow)' : undefined,
                gridColumn: isExpanded ? 'span 2' : undefined,
                gridRow: isExpanded ? 'span 2' : undefined,
              }}>
                <div className="text-2xl mb-3" style={{ color: 'var(--ept-accent)' }}>{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? f.desc : f.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Sources &amp; Methods</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.sources.map((s, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section data-tutorial="alerts-active" className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Start free, upgrade when you need real-time alerts and AI analysis</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((tier, i) => (
            <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              boxShadow: tier.popular ? '0 0 40px var(--ept-accent-glow)' : 'none',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono gradient-text">{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
                  {tier.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(i)} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all" style={{
                backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                color: tier.popular ? '#fff' : 'var(--ept-accent)',
                border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
              }}>
                {tier.price === 0 ? 'Start Free' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Market Intelligence Engine --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Market Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our market analysis doctrine library &mdash; backed by engines covering cryptocurrency, equities, commodities, and macroeconomic intelligence.</p>
          <EngineQueryPanel
            domains={['CRYPTO', 'FINANCE', 'ECON', 'TRADE']}
            title="Market Intelligence Search"
            placeholder="Ask about market trends, asset analysis, trading strategies..."
            exampleQueries={[
              'What technical indicators predict crypto breakouts?',
              'How do whale wallet movements affect BTC price?',
              'Best strategies for setting trailing stop alerts',
              'Correlation between DeFi TVL and token prices',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine price alerts with these capabilities for comprehensive market intelligence.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Crypto Trading', desc: 'Automated grid and momentum trading strategies on BTC, ETH, and altcoins. AI-optimized entry/exit with risk management.', href: '/crypto-trading', price: 'From $99/mo' },
            { title: 'SEC Intelligence', desc: 'AI-powered analysis of SEC filings — 10-K, 10-Q, 8-K, insider trades. Institutional-grade financial research.', href: '/sec-intel', price: 'From $199/mo' },
            { title: 'Bot Factory', desc: 'Custom trading bots, arbitrage engines, and market monitoring bots. Deploy on any exchange with custom strategies.', href: '/bots', price: 'From $499' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
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

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Never miss a price move again.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Start with 3 free alerts. Upgrade to Pro for unlimited real-time monitoring with AI trend analysis across 10,000+ assets.
          </p>
          <Link href="/checkout?service=price-alerts&tier=pro" className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Pro &mdash; $19.99/mo
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/crypto-trading" className="underline" style={{ color: 'var(--ept-accent)' }}>Crypto Trading</Link> | <Link href="/sec-intel" className="underline" style={{ color: 'var(--ept-accent)' }}>SEC Intel</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="price-alerts" productName="Price Alerts" />
    </div>
  );
}