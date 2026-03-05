import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentinel AI — Free Multi-Domain Intelligence Assistant | Echo Prime Technologies',
  description: 'Free AI assistant querying 2,632 engines across 210 domains. Tax, legal, cybersecurity, oilfield, finance — ask anything. 14 AI personalities, voice output, web search. Free tier available.',
  keywords: ['free AI assistant', 'Sentinel AI', 'multi-domain AI', 'intelligence engine', 'AI chat', 'Echo Prime', 'free AI tool'],
  openGraph: {
    title: 'Sentinel AI — Free Multi-Domain Intelligence',
    description: 'Free AI assistant with 2,632 engines across 210 domains. Tax, legal, cyber, oilfield — ask anything. Voice output. Free tier.',
    url: 'https://echo-ept.com/sentinel',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/sentinel' },
};

export default function SentinelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
