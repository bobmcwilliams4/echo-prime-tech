import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentinel AI — Professional Intelligence Interface | Echo Prime Technologies',
  description: 'Engine-backed AI intelligence for tax, legal, cybersecurity, oilfield, and 200+ domains. Doctrine-hardened responses with authority citations. Not a chatbot.',
  keywords: ['AI intelligence', 'doctrine AI', 'tax AI advisor', 'legal AI', 'cybersecurity AI', 'oilfield AI', 'sentinel AI'],
  openGraph: {
    title: 'Sentinel AI — Engine-Backed Intelligence',
    description: 'Doctrine-hardened AI for tax, legal, cyber, oilfield, and 200+ domains. Authority citations on every response.',
    url: 'https://echo-ept.com/sentinel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentinel AI — Engine-Backed Intelligence',
    description: 'AI intelligence backed by 5,400+ engines. Tax, legal, cyber, oilfield. Not a chatbot.',
  },
  alternates: { canonical: '/sentinel' },
};

export default function SentinelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
