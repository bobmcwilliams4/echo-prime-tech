'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import ProductTutorialButton from '../../components/product-tutorial-button';

const SERVICE_ID = 'crypto-trading';

/* ================================================================
   FEATURE CARDS — 8 autonomous trading capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Grid Trading Engine',
    desc: 'Automated grid placement across 6 major trading pairs — BTC-USDC, ETH-USDC, SOL-USDC, DOGE-USDC, LINK-USDC, and AVAX-USDC. Dynamic grid spacing adapts to volatility, auto-adjusts range boundaries on breakouts, and captures profits on every micro-reversal. Configurable grid density (5-100 levels), position sizing per grid line, and compound-profit reinvestment mode.',
    tags: ['BTC', 'ETH', 'SOL', 'DOGE', 'LINK', 'AVAX'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Momentum Strategy',
    desc: 'AI-powered trend detection using multi-timeframe analysis (1m, 5m, 15m, 1h, 4h), RSI divergence, MACD crossovers, Bollinger Band squeeze detection, and volume profile analysis. Entry signals confirmed by at least 3 independent indicators before execution. Dynamic trailing stops lock in profits during strong trends while protecting against reversals. Win rate targets above 60% with risk-reward ratios of 1:2 minimum.',
    tags: ['Trend Detection', 'RSI', 'MACD', 'Bollinger Bands', 'Volume Profile', 'Multi-Timeframe'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Portfolio Management',
    desc: 'Multi-pair position management with intelligent risk allocation and automated rebalancing. Kelly Criterion-based position sizing calculates optimal allocation per trade. Portfolio-level drawdown monitoring pauses all strategies if total equity drops beyond configured thresholds. Correlation analysis prevents overexposure to correlated assets. Daily portfolio snapshots stored for audit and performance review.',
    tags: ['Multi-Pair', 'Risk Allocation', 'Rebalancing', 'Kelly Criterion', 'Correlation', 'Snapshots'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: 'Real-Time Market Data',
    desc: 'Live orderbook depth, candlestick charts (1m through monthly), and trade-level tick data from Coinbase Advanced Trade API. WebSocket streaming for sub-second price updates. Level 2 orderbook analysis identifies support/resistance walls, large hidden orders, and spoofing patterns. Historical data archive for backtesting with tick-level precision going back 2+ years across all supported pairs.',
    tags: ['Orderbook', 'Candlesticks', 'WebSocket', 'Level 2', 'Tick Data', 'Coinbase'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Risk Management',
    desc: 'Comprehensive risk controls at every level: per-trade stop-loss and take-profit orders, per-pair maximum position size, portfolio-wide maximum drawdown limits, daily loss caps, and maximum open positions. Automatic circuit breaker halts all trading during extreme volatility (>5% move in 5 minutes). Position sizing based on account equity percentage ensures no single trade risks more than your configured threshold.',
    tags: ['Stop-Loss', 'Take-Profit', 'Max Drawdown', 'Circuit Breaker', 'Position Sizing', 'Daily Loss Cap'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
    title: 'Backtesting Engine',
    desc: 'Historical performance analysis with tick-level precision across 2+ years of data. Test any strategy configuration against real market conditions before deploying live capital. Monte Carlo simulation generates 10,000 randomized scenarios to stress-test edge cases. Walk-forward optimization prevents curve fitting. Reports include maximum drawdown, Sharpe ratio, Sortino ratio, win rate, profit factor, and equity curve visualization.',
    tags: ['Historical Analysis', 'Monte Carlo', 'Walk-Forward', 'Sharpe Ratio', 'Profit Factor', 'Equity Curve'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
      </svg>
    ),
    title: 'Alert System',
    desc: 'Instant notifications via Telegram bot, Discord webhook, email, and custom webhook endpoints for every trade execution, signal generation, risk event, and portfolio milestone. Configurable alert severity — critical events (circuit breaker, max drawdown) trigger multi-channel notification within seconds. Daily P&L summary, weekly performance digest, and monthly strategy report delivered automatically.',
    tags: ['Telegram', 'Discord', 'Email', 'Webhooks', 'Daily P&L', 'Weekly Digest'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Performance Analytics',
    desc: 'Comprehensive P&L tracking with realized and unrealized gains broken down by pair, strategy, and time period. Key metrics calculated in real time: win rate, average win/loss, Sharpe ratio, Sortino ratio, Calmar ratio, maximum drawdown, recovery factor, and profit factor. Full trade history with entry/exit timestamps, fill prices, slippage analysis, and fee accounting. Exportable CSV and API access for custom analysis.',
    tags: ['P&L Tracking', 'Win Rate', 'Sharpe Ratio', 'Trade History', 'Slippage Analysis', 'CSV Export'],
  },
];

/* ================================================================
   HOW IT WORKS — 4-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect',
    desc: 'Link your Coinbase Advanced Trade API keys with read-only or trade permissions. Your keys are encrypted at rest with AES-256 and never leave our edge infrastructure. Supports sub-account isolation for dedicated trading capital.',
  },
  {
    step: '02',
    title: 'Configure',
    desc: 'Set your trading pairs, strategy parameters (grid spacing, momentum thresholds), risk limits (max drawdown, daily loss cap, position sizing), and alert channels. Start with our battle-tested defaults or customize every parameter.',
  },
  {
    step: '03',
    title: 'Deploy',
    desc: 'Your AI trading bot begins executing with your parameters on Cloudflare edge infrastructure — sub-50ms to exchange, 99.9% uptime, zero cold starts. Paper trading mode available for risk-free strategy validation before going live.',
  },
  {
    step: '04',
    title: 'Monitor',
    desc: 'Real-time dashboard shows live positions, P&L, trade history, and strategy performance. Telegram and webhook alerts keep you informed of every trade and risk event. Adjust parameters on the fly — changes take effect within seconds.',
  },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: '6', label: 'Trading Pairs' },
  { value: '<50ms', label: 'Execution Latency' },
  { value: '24/7', label: 'Autonomous Trading' },
  { value: '2+', label: 'Years Backtest Data' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '10K+', label: 'Monte Carlo Sims' },
  { value: 'AES-256', label: 'Key Encryption' },
  { value: '60%+', label: 'Target Win Rate' },
];

/* ================================================================
   PRICING TIERS
   ================================================================ */
const PRICING = [
  {
    tier: 'Starter',
    price: 99,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      '2 trading pairs (BTC, ETH)',
      'Grid strategy only',
      'Daily performance reports',
      'Email alerts',
      'Basic risk controls',
      '30-day backtest history',
      'Dashboard access',
      'Email support',
    ],
  },
  {
    tier: 'Professional',
    price: 299,
    interval: 'mo',
    popular: true,
    custom: false,
    features: [
      'All 6 trading pairs',
      'Grid + Momentum strategies',
      'Real-time Telegram & webhook alerts',
      'Advanced risk management',
      'Custom strategy parameters',
      'Full backtest engine (2+ years)',
      'Monte Carlo simulation',
      'Priority support',
      'API access',
      'Performance analytics export',
    ],
  },
  {
    tier: 'Institutional',
    price: 999,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      'Unlimited trading pairs',
      'Custom strategy development',
      'Dedicated infrastructure',
      'White-label dashboard',
      'Full API access',
      'Multi-exchange support',
      'Custom risk models',
      'Dedicated account manager',
      'SLA with guaranteed uptime',
      'On-prem deployment option',
      'Custom backtesting datasets',
      'Institutional-grade reporting',
    ],
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function CryptoTradingPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleCheckout = (tierIndex: number) => {
    const tier = PRICING[tierIndex];
    if (!user) {
      window.location.href = `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
      return;
    }
    window.location.href = `/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/engines" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/bots" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Bots</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* --- Hero --- */}
      <section data-tutorial="crypto-hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} /> Grid Trading &bull; Momentum Strategy &bull; 24/7 Autonomous
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          Autonomous Crypto<br />
          Trading That Never<br />
          <span className="gradient-text">Sleeps.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered grid and momentum strategies across <strong>6 major pairs</strong> on Coinbase Advanced Trade. Sub-50ms execution, comprehensive risk management, real-time alerts, and full backtesting &mdash; running <strong>24/7</strong> on Cloudflare edge infrastructure with <strong>99.9% uptime</strong>.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? `/checkout?service=${SERVICE_ID}&tier=starter` : `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=starter`} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Trading
          </Link>
          <Link href="/pricing" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            View All Plans
          </Link>
        </div>
        <div className="mt-4">
          <ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} />
        </div>
      </section>

      {/* --- Stats Grid --- */}
      <section data-tutorial="crypto-dashboard" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Feature Grid (expandable) --- */}
      <section data-tutorial="crypto-strategies" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>8 Trading Capabilities</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Each module operates independently within a unified trading pipeline. From market data ingestion to trade execution and performance tracking &mdash; fully automated, continuously running.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
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
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Key Features</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.tags.map((s, j) => (
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

      {/* --- Supported Pairs --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Supported Trading Pairs</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>All pairs traded against USDC on Coinbase Advanced Trade with institutional-grade liquidity and sub-50ms execution.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { pair: 'BTC-USDC', name: 'Bitcoin', desc: 'The gold standard of crypto. Highest liquidity, tightest spreads. Ideal for grid trading in ranging markets and momentum trading during macro trends.' },
            { pair: 'ETH-USDC', name: 'Ethereum', desc: 'DeFi ecosystem backbone. High correlation with BTC but with additional alpha from network upgrades, staking yields, and L2 adoption cycles.' },
            { pair: 'SOL-USDC', name: 'Solana', desc: 'High-performance L1 with significant volatility. Excellent for momentum strategies during narrative-driven moves and grid trading during accumulation phases.' },
            { pair: 'DOGE-USDC', name: 'Dogecoin', desc: 'Meme coin with massive retail following. Social sentiment-driven moves create predictable momentum patterns. Grid trading captures frequent oscillations.' },
            { pair: 'LINK-USDC', name: 'Chainlink', desc: 'Oracle infrastructure leader. Correlated with DeFi activity and smart contract adoption. Steady range-bound behavior ideal for grid strategies.' },
            { pair: 'AVAX-USDC', name: 'Avalanche', desc: 'Subnet-enabled L1 with institutional adoption. Lower correlation to BTC creates diversification benefits in multi-pair portfolio strategies.' },
          ].map((p, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{p.pair}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{p.name}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{p.desc}</p>
            </div>
          ))}
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
      <section data-tutorial="crypto-pricing" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Autonomous crypto trading tailored to your risk profile and capital size</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                  <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price.toLocaleString()}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
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
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Why Automated Trading --- */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>Why Automated Trading?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>Manual Trading</h3>
              <ul className="space-y-2">
                {[
                  'Emotions drive buy/sell decisions',
                  'Can only monitor 1-2 pairs at a time',
                  'Sleep means missed opportunities',
                  'Inconsistent position sizing',
                  'No backtesting before risking capital',
                  'Slow reaction to market moves',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#ef4444' }}>&#x2717;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>Echo Prime Trading Bot</h3>
              <ul className="space-y-2">
                {[
                  'Emotion-free algorithmic execution',
                  'Monitors all 6 pairs simultaneously',
                  '24/7 operation — never misses a trade',
                  'Consistent Kelly Criterion sizing',
                  'Full backtesting with Monte Carlo sims',
                  'Sub-50ms execution on every signal',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#22c55e' }}>&#x2713;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Cross-sell --- */}
      <section className="max-w-3xl mx-auto px-6 pb-12 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Complete Your Trading Stack</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Pair autonomous trading with custom monitoring bots, real-time data pipelines, and AI intelligence engines for a comprehensive crypto operations platform.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/bots" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Bot Factory</Link>
            <Link href="/pipelines" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Data Pipelines</Link>
          </div>
        </div>
      </section>

      {/* --- Trading Intelligence Engine --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Trading Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our crypto and finance doctrine library &mdash; backed by engines covering market microstructure, technical analysis, risk management, and DeFi protocols.</p>
          <EngineQueryPanel
            domains={['CRYPTO', 'FINANCE', 'DEFI', 'TRADING']}
            title="Crypto Trading Search"
            placeholder="Ask about trading strategies, risk management, market analysis..."
            exampleQueries={[
              'How does grid trading work in ranging markets?',
              'What is the Kelly Criterion for position sizing?',
              'Momentum strategy indicators for crypto',
              'Risk management for automated trading bots',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine autonomous trading with these capabilities for a comprehensive crypto operations platform.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Bot Factory', desc: 'Custom AI bots for Telegram, Discord, and social platforms. Automated alerts, congress-watching, arbitrage signals, and market monitoring bots.', href: '/bots', price: 'From $499' },
            { title: 'Data Pipelines', desc: 'Autonomous data extraction, transformation, and delivery. Real-time market feeds, on-chain analytics, and custom data aggregation.', href: '/pipelines', price: 'From $199/mo' },
            { title: 'Intelligence Engines', desc: '5,486+ domain-specific AI engines including crypto, DeFi, finance, and trading verticals with embedded expert reasoning.', href: '/engines', price: 'From $199/mo' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>The market never sleeps. Neither should your trading.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Every minute you&apos;re not in the market is a missed opportunity. Our AI trading bot executes grid and momentum strategies 24/7 with institutional-grade risk management. Start with paper trading to validate before going live.
          </p>
          <Link href={user ? `/checkout?service=${SERVICE_ID}&tier=starter` : `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=starter`} className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Trading Now
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/bots" className="underline" style={{ color: 'var(--ept-accent)' }}>Bot Factory</Link> | <Link href="/pipelines" className="underline" style={{ color: 'var(--ept-accent)' }}>Pipelines</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="crypto-trading" productName="Crypto Trading" />
    </div>
  );
}
