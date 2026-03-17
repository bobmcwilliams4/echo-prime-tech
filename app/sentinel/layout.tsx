import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentinel AI — Multi-Domain Intelligence | Echo Prime Technologies',
  description: 'Engine-backed AI intelligence across 1,000+ domains. Tax, legal, cybersecurity, oilfield, finance, engineering, and more. Doctrine-grounded answers with authority citations.',
  keywords: ['AI intelligence', 'multi-domain AI', 'tax AI', 'legal AI', 'Sentinel AI', 'doctrine engine', 'knowledge AI'],
  openGraph: {
    title: 'Sentinel AI — Multi-Domain Intelligence',
    description: 'Engine-backed AI across 1,000+ domains with authority citations. Tax, legal, cyber, oilfield, finance.',
    url: 'https://echo-ept.com/sentinel',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/sentinel' },
};

export default function SentinelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
