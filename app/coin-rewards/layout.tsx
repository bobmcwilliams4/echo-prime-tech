import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Coin Rewards — AI-Powered Loyalty & Token Rewards Platform | Echo Prime Tech',
  description: 'Gamified loyalty program with AI-personalized rewards, token economy, referral multipliers, and engagement analytics. Boost retention with smart incentives.',
  keywords: ['loyalty program', 'rewards platform', 'token rewards', 'customer retention', 'gamification', 'referral program'],
  openGraph: { title: 'Echo Coin Rewards — AI Loyalty Platform', description: 'Token-based loyalty with AI personalization, gamification, and referral multipliers.', url: 'https://echo-ept.com/coin-rewards' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
