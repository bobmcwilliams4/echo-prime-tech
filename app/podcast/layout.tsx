import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Podcast — AI-Powered Podcast Hosting | Echo Prime Technologies',
  description: 'Host, distribute, and grow your podcast with AI-generated show notes, RSS feeds, embeddable players, download analytics, and subscriber management. Buzzsprout alternative starting at $9/mo.',
  openGraph: {
    title: 'Echo Podcast — AI-Powered Podcast Hosting',
    description: 'Host, distribute, and grow your podcast with AI show notes, RSS feeds, analytics, and embeddable players.',
    url: 'https://echo-ept.com/podcast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Podcast — AI-Powered Podcast Hosting',
    description: 'Host, distribute, and grow your podcast with AI show notes, RSS feeds, analytics, and embeddable players.',
  },
  alternates: { canonical: '/podcast' },
};

export default function PodcastLayout({ children }: { children: React.ReactNode }) {
  return children;
}
