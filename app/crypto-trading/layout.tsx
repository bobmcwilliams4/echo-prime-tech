import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Crypto Trading | Automated Grid & Momentum Strategies | Echo Prime Technologies',
  description: 'AI-powered cryptocurrency trading with automated strategies across 200+ pairs on 5 exchanges. Grid trading, DCA, momentum, and risk management with sub-50ms execution. Your funds never leave your exchange.',
  openGraph: {
    title: 'AI Crypto Trading | Echo Prime Technologies',
    description: 'Automated crypto trading with AI signal engine, risk management, and tax reporting across 200+ pairs on 5 exchanges.',
    url: 'https://echo-ept.com/crypto-trading',
  },
  twitter: {
    card: 'summary',
    title: 'AI Crypto Trading — Fully Automated',
    description: 'AI-powered trading across 200+ pairs on 5 exchanges. Grid, DCA, momentum strategies with sub-50ms execution.',
  },
  alternates: { canonical: '/crypto-trading' },
};

export default function CryptoTradingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
