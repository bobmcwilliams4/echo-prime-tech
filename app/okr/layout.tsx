import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo OKR — AI-Powered Goals & OKR Tracking for Teams',
  description: 'Set objectives, track key results, run check-ins, and align goals across teams. AI suggests OKRs and provides progress insights. Lattice/15Five alternative starting at $6/user/mo.',
  openGraph: {
    title: 'Echo OKR — AI Goal Tracking',
    description: 'Objectives and key results tracking with AI-powered suggestions, check-ins, and alignment trees.',
    url: 'https://echo-ept.com/okr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo OKR — AI Goal Tracking',
    description: 'Objectives and key results tracking with AI-powered suggestions, check-ins, and alignment trees.',
  },
  alternates: { canonical: '/okr' },
};

export default function OKRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
