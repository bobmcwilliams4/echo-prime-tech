'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import ProductTutorialButton from '../../components/product-tutorial-button';
import FaqSchema from '../../components/FaqSchema';

const SERVICE_ID = 'crypto-trading';

/* ================================================================
   FEATURE CARDS — 6 crypto trading capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Automated Trading Strategies',
    desc: 'Deploy AI-optimized trading strategies across BTC, ETH, and 200+ altcoins. Grid trading, DCA, momentum scalping, and mean-reversion bots execute 24/7 with configurable risk parameters. Backtested against 5 years of market data before going live. Every strategy includes automatic stop-loss, take-profit, and position sizing.',
    sources: ['Grid Trading', 'DCA Bots', 'Momentum', 'Mean Reversion', 'Scalping', 'Swing'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Risk Management Engine',
    desc: 'Portfolio-level risk controls prevent catastrophic losses. Per-trade stop-loss limits, daily drawdown caps, maximum position sizes, and correlation-aware exposure limits work together to protect your capital. Automatic circuit breakers halt trading during extreme volatility events. Real-time risk scoring updated every second across all open positions.',
    sources: ['Stop-Loss', 'Trailing Stops', 'Drawdown Caps', 'Position Sizing', 'Circuit Breakers', 'Correlation Limits'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI Signal Engine',
    desc: 'Machine learning models analyze technical indicators (RSI, MACD, Bollinger Bands, Ichimoku), order book depth, funding rates, open interest, whale movements, and social sentiment to generate high-conviction trade signals. Confidence scoring from 0-100 with historical accuracy tracking. Signals update every 15 minutes across all supported pairs.',
    sources: ['Technical Analysis', 'Order Book', 'Funding Rates', 'Whale Tracking', 'Sentiment', 'On-Chain'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Multi-Exchange Execution',
    desc: 'Connect Binance, Coinbase Pro, Kraken, KuCoin, and Bybit via API keys with trade-only permissions. Unified order routing finds the best price across exchanges with smart order splitting for large positions. Latency-optimized execution infrastructure co-located near exchange servers. Your funds never leave your exchange — we never request withdrawal permissions.',
    sources: ['Binance', 'Coinbase Pro', 'Kraken', 'KuCoin', 'Bybit', 'Smart Routing'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Tax & Compliance Reports',
    desc: 'Automatic trade logging with Form 8949-compatible tax reports for every transaction. Cost basis calculation supports FIFO, LIFO, and specific identification methods. Integrates directly with Echo Tax Returns for seamless filing. Wash sale detection, short-term vs long-term capital gains tracking, and DeFi yield income classification included.',
    sources: ['Form 8949', 'FIFO/LIFO', 'Wash Sale Detection', 'Cap Gains', 'DeFi Income', 'Tax Integration'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
    title: 'Portfolio Analytics',
    desc: 'Real-time P&L tracking across all connected exchanges with performance attribution by asset, strategy, and time period. Sharpe ratio, max drawdown, win rate, and risk-adjusted return metrics updated continuously. Compare your performance against BTC, ETH, and S&P 500 benchmarks. Export-ready reports for investors and auditors.',
    sources: ['Real-Time P&L', 'Sharpe Ratio', 'Drawdown Analysis', 'Win Rate', 'Benchmarks', 'Export'],
  },
];

/* ================================================================
   HOW IT WORKS — 3-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Exchange',
    desc: 'Link your exchange account via API keys with trade-only permissions. We support Binance, Coinbase Pro, Kraken, KuCoin, and Bybit. Setup takes under 3 minutes. Your funds never leave your exchange — we never have withdrawal access.',
  },
  {
    step: '02',
    title: 'Choose Strategy',
    desc: 'Select from pre-built AI strategies or configure custom parameters. Set your risk level (conservative, moderate, aggressive), choose target assets, define position sizes, and configure stop-loss/take-profit levels. Backtest against historical data before going live.',
  },
  {
    step: '03',
    title: 'AI Executes 24/7',
    desc: 'Our Engine Runtime monitors markets around the clock, executing trades when conditions align with your strategy. Real-time notifications via Telegram, Discord, or SMS for every trade. Full transparency — every decision logged with reasoning, entry/exit prices, and P&L impact.',
  },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: '200+', label: 'Trading Pairs' },
  { value: '5', label: 'Exchanges' },
  { value: '<50ms', label: 'Execution Speed' },
  { value: '24/7', label: 'AI Monitoring' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '100%', label: 'Your Custody' },
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
    features: [
      'Portfolio tracking (3 exchanges)',
      'Price alerts (3 active)',
      'Manual trade logging',
      'Basic performance charts',
      'Community support',
    ],
  },
  {
    tier: 'Pro',
    price: 49,
    interval: 'mo',
    popular: true,
    features: [
      'Automated AI trading strategies',
      'Unlimited exchange connections',
      'Real-time trade execution (<50ms)',
      'AI signal engine with confidence scoring',
      'Advanced risk management controls',
      'Telegram + Discord + SMS alerts',
      'Tax report generation (Form 8949)',
      'Backtesting engine (5-year data)',
      'Portfolio analytics & benchmarks',
      'Priority support',
    ],
  },
];

/* ================================================================
   FAQS
   ================================================================ */
const FAQS = [
  { q: 'Does Echo trade with my money?', a: 'No. Echo Crypto connects to your exchange account via API keys with trade-only permissions. Your funds never leave your exchange. We never have withdrawal access. You maintain full custody at all times.' },
  { q: 'Which exchanges are supported?', a: 'Binance, Coinbase Pro, Kraken, KuCoin, and Bybit via API. More exchanges added regularly. Each exchange connection uses read-only + trade permissions — never withdrawal permissions.' },
  { q: 'How does the AI trading strategy work?', a: 'Our Engine Runtime analyzes technical indicators (RSI, MACD, Bollinger Bands, volume profiles), order book depth, funding rates, and on-chain metrics. Strategies range from conservative DCA to aggressive momentum trading. You choose your risk level.' },
  { q: 'Can I set stop-losses and take-profits?', a: 'Yes. Every trade has configurable stop-loss and take-profit levels. Trailing stops adjust automatically as price moves in your favor. Portfolio-level risk limits prevent overexposure to any single asset.' },
  { q: 'What about taxes?', a: 'Echo Crypto generates tax reports (Form 8949 compatible) for all trades. Cost basis calculation supports FIFO, LIFO, and specific identification methods. Integrates with Echo Tax Returns for seamless filing.' },
  { q: 'Is there a free tier?', a: 'Yes. The free tier includes portfolio tracking, price alerts, and manual trade logging for up to 3 exchange connections. Automated trading strategies start at the Pro plan ($49/mo).' },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function CryptoTradingPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>AI-Powered Crypto Trading — Fully Automated | Echo Prime Technologies</h1><p>Automated trading strategies across 200+ pairs on 5 major exchanges with sub-50ms execution. Features include automated grid trading, DCA bots, momentum scalping, and mean-reversion strategies. AI signal engine analyzes technical indicators, order book depth, funding rates, and on-chain metrics. Portfolio-level risk management with stop-loss, trailing stops, drawdown caps, and circuit breakers. Multi-exchange execution on Binance, Coinbase Pro, Kraken, KuCoin, and Bybit. Tax-compliant Form 8949 reports with FIFO, LIFO, and specific identification methods. Free tier for portfolio tracking; Pro plan at $49/mo for automated AI trading.</p></div></noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Crypto Trading', href: '/crypto-trading' }]} />
      <FaqSchema faqs={FAQS} />
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/price-alerts" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Price Alerts</Link>
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
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} /> AI Trading &bull; Multi-Exchange &bull; Full Custody
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          AI-Powered<br />
          Crypto Trading<br />
          <span className="gradient-text">Fully Automated.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          Automated trading strategies across <strong>200+ pairs</strong> on 5 major exchanges. AI signal engine, risk management, and tax reporting &mdash; execution in under <strong>50ms</strong>. Your funds never leave your exchange.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/dashboard' : '/signup'} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free &mdash; Portfolio Tracking Included
          </Link>
          <Link href="/price-alerts" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            Just Need Price Alerts?
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
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>6 Trading Intelligence Layers</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            From market signals to automated execution &mdash; each layer operates independently and feeds into a unified trading pipeline.
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
      <section className="max-w-4xl mx-auto px-6 pb-20">
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
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Start free with portfolio tracking, upgrade to Pro for automated AI trading</p>
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
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Crypto Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our crypto analysis doctrine library &mdash; backed by engines covering cryptocurrency markets, DeFi protocols, on-chain analytics, and trading strategies.</p>
          <EngineQueryPanel
            domains={['CRYPTO', 'FINANCE', 'TRADE']}
            title="Crypto Intelligence Search"
            placeholder="Ask about trading strategies, market analysis, DeFi protocols..."
            exampleQueries={[
              'Best grid trading parameters for BTC in a ranging market?',
              'How to set trailing stops for momentum trades?',
              'DeFi yield farming risk assessment framework',
              'Tax implications of crypto-to-crypto trades',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine crypto trading with these capabilities for comprehensive market intelligence.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Price Alerts', desc: 'Real-time alerts across 10,000+ assets with AI trend scoring. Telegram, Discord, SMS, and webhook delivery in under 2 seconds.', href: '/price-alerts', price: 'From $19.99/mo' },
            { title: 'SEC Intelligence', desc: 'AI-powered analysis of SEC filings — 10-K, 10-Q, 8-K, insider trades. Institutional-grade financial research.', href: '/sec-intel', price: 'From $199/mo' },
            { title: 'Tax Returns', desc: 'AI-assisted tax preparation with crypto trade integration. Form 8949, cost basis tracking, and DeFi income classification.', href: '/tax-returns', price: 'From $99' },
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
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Everything you need to know about Echo Crypto Trading.</p>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left p-5 rounded-2xl border transition-all"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: openFaq === i ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
                <svg
                  className="w-5 h-5 flex-shrink-0 transition-transform"
                  style={{ color: 'var(--ept-accent)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openFaq === i && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{faq.a}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Start trading smarter today.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Free portfolio tracking to get started. Upgrade to Pro for automated AI trading strategies across 200+ pairs on 5 major exchanges.
          </p>
          <Link href="/checkout?service=crypto-trading&tier=pro" className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Pro &mdash; $49/mo
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/price-alerts" className="underline" style={{ color: 'var(--ept-accent)' }}>Price Alerts</Link> | <Link href="/sec-intel" className="underline" style={{ color: 'var(--ept-accent)' }}>SEC Intel</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="crypto-trading" productName="Crypto Trading" />
    </div>
  );
}
