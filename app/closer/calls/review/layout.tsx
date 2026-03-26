import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Call Review — Echo Prime Technologies',
  description: 'Deep-dive into individual AI Closer call recordings with full event timelines, transcripts, sentiment scores, and outcome analysis. Replay calls and review AI performance for continuous improvement.',
  openGraph: {
    title: 'Call Review — Echo Prime Technologies',
    description: 'Review individual AI sales calls with transcripts, event timelines, and sentiment analysis.',
    url: 'https://echo-ept.com/closer/calls/review',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Call Review — Echo Prime Technologies',
    description: 'Review individual AI sales calls with transcripts, event timelines, and sentiment analysis.',
  },
  alternates: { canonical: '/closer/calls/review' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
