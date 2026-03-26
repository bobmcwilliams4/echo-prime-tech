import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Reviews — AI Review Management & Reputation Platform | Echo Prime Technology',
  description: 'Collect, manage, and showcase customer reviews with AI. Sentiment analysis, review request campaigns, embeddable widgets, competitor tracking, and reputation analytics. Starting at $14/mo.',
  openGraph: {
    title: 'Echo Reviews — AI Review Management & Reputation Platform',
    description: 'Turn happy customers into your best marketing. AI-powered review collection, sentiment analysis, and reputation management.',
    url: 'https://echo-ept.com/reviews',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Reviews — AI Review Management & Reputation Platform',
    description: 'Turn happy customers into your best marketing. AI-powered review collection, sentiment analysis, and reputation management.',
  },
  alternates: { canonical: '/reviews' },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
