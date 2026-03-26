import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Coin Rewards Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Coin Rewards — loyalty and rewards system with point earning, redemption marketplace, tier management, referral tracking, and partner integrations.',
  openGraph: {
    title: 'Echo Coin Rewards Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Coin Rewards — loyalty rewards with point earning, redemption marketplace, and tier management.',
    url: 'https://echo-ept.com/docs/coin-rewards',
  },
}

export default function CoinRewardsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
