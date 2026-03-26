import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Affiliate — AI Affiliate & Referral Program Manager | Echo Prime Technology',
  description: 'Launch and manage affiliate programs with AI-powered fraud detection, multi-tier commissions, branded signup pages, click tracking, payout automation, and performance analytics. Starting at $29/mo.',
  openGraph: {
    title: 'Echo Affiliate — AI Affiliate & Referral Program Manager',
    description: 'Launch affiliate programs in minutes. Multi-tier commissions, fraud detection, branded portals, and AI performance insights.',
    url: 'https://echo-ept.com/affiliate',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Affiliate — AI Affiliate & Referral Program Manager',
    description: 'Launch affiliate programs in minutes. Multi-tier commissions, fraud detection, branded portals, and AI performance insights.',
  },
  alternates: { canonical: '/affiliate' },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
