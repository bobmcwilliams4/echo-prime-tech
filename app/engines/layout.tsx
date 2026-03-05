import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Catalog — 2,632 AI Engines | Echo Prime Technologies',
  description: 'Browse 2,632 doctrine-hardened intelligence engines across 210 domains. Tax, legal, cybersecurity, drilling, finance, medical, forensics, and 200+ more verticals. Court-defensible. Zero hallucination.',
  keywords: ['AI engines', 'doctrine engines', 'intelligence catalog', 'tax AI', 'legal AI', 'cybersecurity AI', 'oilfield AI', 'Echo Prime'],
  openGraph: {
    title: 'Engine Catalog — 2,632 AI Engines',
    description: 'Browse 2,632 doctrine-hardened intelligence engines across 210 domains. Court-defensible AI. Zero hallucination.',
    url: 'https://echo-ept.com/engines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/engines' },
};

export default function EnginesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
