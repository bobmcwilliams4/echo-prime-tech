import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Marketplace — 5,400+ AI Intelligence Engines | Echo Prime Technologies',
  description: 'Browse and deploy from 5,400+ specialized AI engines across 450+ domains. Tax, legal, oilfield, medical, cybersecurity, finance, and more. API access included.',
  openGraph: { title: 'Engine Marketplace — 5,400+ AI Engines', description: 'Browse specialized AI engines across 450+ domains. Production-ready intelligence for any industry.', url: 'https://echo-ept.com/engines/marketplace' },
  twitter: { card: 'summary_large_image', title: 'Engine Marketplace — 5,400+ AI Engines', description: 'Specialized AI engines across 450+ domains.' },
  alternates: { canonical: '/engines/marketplace' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
