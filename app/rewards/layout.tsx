import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rewards Program — Earn Credits & Discounts | Echo Prime Technologies',
  description: 'Earn rewards credits on every purchase. Referral bonuses, loyalty tiers, and exclusive discounts on AI engines, sales agents, data pipelines, and enterprise services.',
  keywords: ['AI rewards', 'loyalty program', 'referral bonus', 'Echo Prime rewards', 'AI credits'],
  openGraph: {
    title: 'Rewards Program — Echo Prime Technologies',
    description: 'Earn credits on every purchase. Referral bonuses, loyalty tiers, and exclusive discounts on AI services.',
    url: 'https://echo-ept.com/rewards',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewards Program — Echo Prime Technologies',
    description: 'Earn credits on every purchase. Referral bonuses, loyalty tiers, and exclusive discounts on AI services.',
  },
  alternates: { canonical: '/rewards' },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
