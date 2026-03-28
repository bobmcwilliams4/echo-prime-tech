'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Crypto Trading',
  tagline: 'AI-powered automated trading across 200+ pairs on 5 major exchanges with sub-50ms execution.',
  accent: '#f59e0b',
  productUrl: '/crypto-trading',
  workerUrl: 'echo-crypto-trader.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Crypto Trading is a fully automated AI trading platform that executes strategies across 200+ cryptocurrency pairs on Binance, Coinbase Pro, Kraken, KuCoin, and Bybit. The platform connects to your exchange via API keys with trade-only permissions — your funds never leave your exchange and we never have withdrawal access.',
    'The AI Signal Engine analyzes technical indicators (RSI, MACD, Bollinger Bands, Ichimoku), order book depth, funding rates, open interest, whale movements, and social sentiment to generate high-conviction trade signals with confidence scoring from 0-100. Strategies include grid trading, DCA bots, momentum scalping, and mean-reversion — all backtested against 5 years of market data before going live.',
    'Portfolio-level risk management protects your capital with per-trade stop-losses, trailing stops, daily drawdown caps, maximum position sizes, correlation-aware exposure limits, and automatic circuit breakers during extreme volatility. Tax-compliant Form 8949 reports are generated automatically with FIFO, LIFO, and specific identification cost basis methods.',
  ],
  gettingStarted: [
    { step: 1, title: 'Connect Your Exchange', desc: 'Link your exchange account via API keys with trade-only permissions. Supported exchanges: Binance, Coinbase Pro, Kraken, KuCoin, and Bybit. Setup takes under 3 minutes. We never request withdrawal permissions.' },
    { step: 2, title: 'Choose a Strategy', desc: 'Select from pre-built AI strategies (grid trading, DCA, momentum, mean-reversion) or configure custom parameters. Set your risk level (conservative, moderate, aggressive), target assets, position sizes, and stop-loss/take-profit levels. Backtest against historical data before going live.' },
    { step: 3, title: 'AI Executes 24/7', desc: 'The Engine Runtime monitors markets around the clock, executing trades when conditions align with your strategy. Receive real-time notifications via Telegram, Discord, or SMS for every trade. Every decision is logged with reasoning, entry/exit prices, and P&L impact.' },
    { step: 4, title: 'Monitor & Optimize', desc: 'Track real-time P&L across all connected exchanges. Review Sharpe ratio, max drawdown, win rate, and risk-adjusted returns. Compare performance against BTC, ETH, and S&P 500 benchmarks. Adjust strategy parameters based on performance data.' },
  ],
  features: [
    { title: 'Automated Trading Strategies', desc: 'Deploy AI-optimized grid trading, DCA, momentum scalping, and mean-reversion bots that execute 24/7 with configurable risk parameters. Every strategy includes automatic stop-loss, take-profit, and position sizing.' },
    { title: 'AI Signal Engine', desc: 'Machine learning models analyze technical indicators, order book depth, funding rates, open interest, whale movements, and social sentiment. Confidence scoring from 0-100 with historical accuracy tracking, updated every 15 minutes.' },
    { title: 'Risk Management Engine', desc: 'Portfolio-level risk controls including per-trade stop-losses, trailing stops, daily drawdown caps, maximum position sizes, correlation-aware exposure limits, and automatic circuit breakers during extreme volatility.' },
    { title: 'Multi-Exchange Execution', desc: 'Unified order routing across Binance, Coinbase Pro, Kraken, KuCoin, and Bybit finds the best price with smart order splitting for large positions. Sub-50ms latency-optimized execution.' },
    { title: 'Tax & Compliance Reports', desc: 'Automatic Form 8949-compatible tax reports with FIFO, LIFO, and specific identification cost basis. Wash sale detection, short-term vs long-term capital gains tracking, and DeFi yield income classification.' },
    { title: 'Portfolio Analytics', desc: 'Real-time P&L tracking with performance attribution by asset, strategy, and time period. Sharpe ratio, max drawdown, win rate, and risk-adjusted return metrics with benchmark comparisons.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/portfolio', desc: 'Get portfolio overview across all connected exchanges', auth: true },
    { method: 'GET', path: '/api/signals', desc: 'Retrieve current AI trade signals with confidence scores', auth: true },
    { method: 'POST', path: '/api/strategies', desc: 'Create or update a trading strategy configuration', auth: true },
    { method: 'GET', path: '/api/trades', desc: 'List trade history with P&L and reasoning', auth: true },
    { method: 'GET', path: '/api/risk', desc: 'Get current risk metrics and exposure analysis', auth: true },
    { method: 'GET', path: '/api/tax-report', desc: 'Generate Form 8949-compatible tax report', auth: true },
    { method: 'POST', path: '/api/exchanges', desc: 'Connect a new exchange via API keys', auth: true },
    { method: 'GET', path: '/api/analytics', desc: 'Get portfolio analytics including Sharpe ratio and benchmarks', auth: true },
  ],
  userGuide: [
    { title: 'Exchange Setup', id: 'exchange-setup', content: [
      'Navigate to Settings and select Add Exchange. Choose your exchange (Binance, Coinbase Pro, Kraken, KuCoin, or Bybit) and follow the instructions to generate an API key with trade-only permissions. Do not enable withdrawal permissions.',
      'Paste your API key and secret into the connection form. The system will verify connectivity and permissions before saving. You can connect multiple exchanges simultaneously for cross-exchange execution.',
      'Once connected, your balances and positions will sync automatically. The system polls exchange data every 5 seconds for real-time accuracy.',
    ]},
    { title: 'Strategy Configuration', id: 'strategy-config', content: [
      'Choose from pre-built strategy templates: Grid Trading (range-bound markets), DCA (dollar-cost averaging), Momentum Scalping (trend following), or Mean Reversion (pullback trading). Each template has sensible defaults.',
      'Customize parameters including target assets, position size (percentage of portfolio), maximum concurrent positions, stop-loss percentage, take-profit percentage, and trailing stop distance. Set your overall risk level to conservative, moderate, or aggressive.',
      'Use the backtesting engine to test your configuration against 5 years of historical data. Review simulated P&L, drawdown, and win rate before activating the strategy with real funds.',
    ]},
    { title: 'Risk Management', id: 'risk-management', content: [
      'Configure portfolio-level risk limits in the Risk Dashboard. Set maximum daily drawdown (defaults to 5%), maximum single-trade risk (defaults to 2%), and maximum total exposure per asset.',
      'Circuit breakers automatically halt all trading when daily drawdown exceeds your threshold or during extreme volatility events. You can manually resume trading or let the system auto-resume after conditions normalize.',
      'Review the correlation matrix to ensure your positions are not overexposed to correlated assets. The system warns when portfolio correlation exceeds safe thresholds.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Signal Generation', desc: 'ML models analyze RSI, MACD, Bollinger Bands, Ichimoku, order book depth, funding rates, and on-chain metrics to produce trade signals with 0-100 confidence scores updated every 15 minutes.' },
    { capability: 'Strategy Optimization', desc: 'AI continuously tunes strategy parameters based on recent market conditions and performance data, adapting grid ranges, DCA intervals, and momentum thresholds.' },
    { capability: 'Churn Prediction for Positions', desc: 'Predicts when a position is likely to reverse, recommending early exits or stop-loss adjustments based on deteriorating technical signals.' },
    { capability: 'Smart Order Routing', desc: 'Finds optimal execution across multiple exchanges, splitting large orders to minimize slippage and market impact while achieving best average price.' },
  ],
  troubleshooting: [
    { issue: 'Exchange connection fails', solution: 'Verify your API key has trade permissions enabled (not just read-only). Ensure IP whitelisting includes our server IPs listed in Settings. Regenerate the key if it has expired.' },
    { issue: 'Trades not executing', solution: 'Check that your strategy is set to Active (not Paused). Verify sufficient balance on the exchange. Review the Risk Dashboard to ensure circuit breakers are not engaged.' },
    { issue: 'Signals show low confidence', solution: 'Low confidence scores indicate uncertain market conditions. This is the system working as designed — it avoids trading when conviction is low. Consider widening your strategy parameters or waiting for clearer signals.' },
    { issue: 'Tax report missing trades', solution: 'Ensure all exchanges are connected and synced. Navigate to Settings and click Resync Trade History. Reports may take a few minutes to regenerate after resync.' },
  ],
  faq: [
    { q: 'Does Echo trade with my money directly?', a: 'No. Echo connects to your exchange via API keys with trade-only permissions. Your funds never leave your exchange. We never have withdrawal access. You maintain full custody at all times.' },
    { q: 'Which exchanges are supported?', a: 'Binance, Coinbase Pro, Kraken, KuCoin, and Bybit via API. Each connection uses read-only plus trade permissions — never withdrawal permissions.' },
    { q: 'What does the free tier include?', a: 'Portfolio tracking across 3 exchanges, 3 active price alerts, manual trade logging, and basic performance charts. Automated AI trading strategies require the Pro plan at $49/mo.' },
    { q: 'How are taxes handled?', a: 'Echo generates Form 8949-compatible tax reports with FIFO, LIFO, and specific identification cost basis methods. Wash sale detection and DeFi yield income classification are included. Integrates with Echo Tax Returns for seamless filing.' },
    { q: 'Can I set stop-losses and take-profits?', a: 'Yes. Every trade has configurable stop-loss and take-profit levels. Trailing stops adjust automatically as price moves in your favor. Portfolio-level risk limits prevent overexposure to any single asset.' },
    { q: 'What is the execution speed?', a: 'Sub-50ms execution with latency-optimized infrastructure co-located near exchange servers. Smart order routing splits large orders across exchanges for optimal pricing.' },
  ],
}

export default function CryptoTradingDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/crypto-trading' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
