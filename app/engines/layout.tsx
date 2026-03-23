import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engine Catalog — 5,486+ AI Engines | Echo Prime Technologies',
  description: 'Browse 5,486+ doctrine-hardened intelligence engines across 940+ domains. Tax, legal, cybersecurity, drilling, finance, medical, forensics, and hundreds more verticals. Court-defensible. Zero hallucination.',
  keywords: ['AI engines', 'doctrine engines', 'intelligence catalog', 'tax AI', 'legal AI', 'cybersecurity AI', 'oilfield AI', 'Echo Prime'],
  openGraph: {
    title: 'Engine Catalog — 5,486+ AI Engines',
    description: 'Browse 5,486+ doctrine-hardened intelligence engines across 940+ domains. Court-defensible AI. Zero hallucination.',
    url: 'https://echo-ept.com/engines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engine Catalog — 5,486+ AI Engines',
    description: 'Browse 5,486+ doctrine-hardened intelligence engines across 940+ domains. Court-defensible AI. Zero hallucination.',
  },
  alternates: { canonical: '/engines' },
};

export default function EnginesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
