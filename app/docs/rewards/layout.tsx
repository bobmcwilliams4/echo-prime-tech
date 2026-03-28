import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Coin Rewards Documentation | Echo Prime Technologies',
  description: 'Earn coins for every Echo interaction. Stake for up to 15% APY. Climb from Bronze to Sovereign. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['rewards', 'echo prime', 'documentation', 'api', 'guide', 'rewards'],
  openGraph: {
    title: 'Echo Coin Rewards Docs — Echo Prime Technologies',
    description: 'Earn coins for every Echo interaction. Stake for up to 15% APY. Climb from Bronze to Sovereign.',
    url: 'https://echo-ept.com/docs/rewards',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Coin Rewards Documentation',
    description: 'Earn coins for every Echo interaction. Stake for up to 15% APY. Climb from Bronze to Sovereign.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/rewards',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
