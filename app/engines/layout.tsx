import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Catalog — 6,500+ AI Engines | Echo Prime Technologies',
  description: 'Browse 6,500+ doctrine-hardened intelligence engines across 1,000+ domains. Tax, legal, cybersecurity, drilling, finance, medical, forensics, and hundreds more verticals. Court-defensible. Zero hallucination.',
  keywords: ['AI engines', 'doctrine engines', 'intelligence catalog', 'tax AI', 'legal AI', 'cybersecurity AI', 'oilfield AI', 'Echo Prime'],
  openGraph: {
    title: 'Engine Catalog — 6,500+ AI Engines',
    description: 'Browse 6,500+ doctrine-hardened intelligence engines across 1,000+ domains. Court-defensible AI. Zero hallucination.',
    url: 'https://echo-ept.com/engines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/engines' },
};

export default function EnginesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
