import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reddit AI Monitor | Subreddit Intelligence & Engagement | Echo Prime Technologies',
  description: 'AI-powered Reddit monitoring. Track keywords, subreddits, and sentiment in real-time. Automated engagement, competitor tracking, and trend detection.',
  openGraph: {
    title: 'Reddit AI Monitor | Echo Prime Technologies',
    description: 'AI-powered Reddit monitoring with keyword tracking, sentiment analysis, and trend detection.',
    url: 'https://echo-ept.com/reddit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reddit AI Monitor | Echo Prime Technologies',
    description: 'AI-powered Reddit monitoring with keyword tracking, sentiment analysis, and trend detection.',
  },
  alternates: { canonical: '/reddit' },
};

export default function RedditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
