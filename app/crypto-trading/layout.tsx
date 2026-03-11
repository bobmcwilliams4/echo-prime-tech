import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Crypto Trading | Automated Grid & Momentum Strategies | Echo Prime Technologies',
  description: 'AI-powered cryptocurrency trading with grid and momentum strategies. Real-time market analysis, automated execution, risk management. BTC, ETH, and 50+ pairs supported.',
  openGraph: {
    title: 'AI Crypto Trading | Echo Prime Technologies',
    description: 'Automated crypto trading with AI-powered grid and momentum strategies across 50+ pairs.',
  },
};

export default function CryptoTradingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
