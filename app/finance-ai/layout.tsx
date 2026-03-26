import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Finance AI — Personal & Business Finance Intelligence | Echo Prime Technologies',
  description: 'AI-powered finance tracking: portfolio analysis, budget management, spending anomaly detection, tax-loss harvesting, net worth tracking, and financial health scoring. 55 API endpoints.',
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Finance AI — Personal & Business Finance Intelligence | Echo Prime Technologies',
    description: 'AI-powered finance tracking: portfolio analysis, budget management, spending anomaly detection, tax-loss harvesting, net worth tracking, and financial health scoring. 55 API endpoints.',
  },
  alternates: { canonical: '/finance-ai' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
