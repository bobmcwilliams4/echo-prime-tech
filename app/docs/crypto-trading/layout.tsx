import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Crypto Trading Documentation | Echo Prime Technologies',
  description: 'AI-powered automated trading across 200+ pairs on 5 major exchanges with sub-50ms execution. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['crypto-trading', 'echo prime', 'documentation', 'api', 'guide', 'crypto, trading'],
  openGraph: {
    title: 'Echo Crypto Trading Docs — Echo Prime Technologies',
    description: 'AI-powered automated trading across 200+ pairs on 5 major exchanges with sub-50ms execution.',
    url: 'https://echo-ept.com/docs/crypto-trading',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Crypto Trading Documentation',
    description: 'AI-powered automated trading across 200+ pairs on 5 major exchanges with sub-50ms execution.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/crypto-trading',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
