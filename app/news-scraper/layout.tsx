import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Scraper — AI News Intelligence Pipeline | Echo Prime Technologies',
  description: 'AI-powered news aggregation and intelligence pipeline. Monitor industry news, extract insights, and get automated briefings from curated sources.',
  keywords: ['AI news aggregator', 'news intelligence', 'news scraper', 'industry monitoring', 'automated briefings', 'news pipeline'],
  openGraph: {
    title: 'News Scraper — AI News Intelligence Pipeline',
    description: 'AI news aggregation and intelligence pipeline with automated briefings from curated sources.',
    url: 'https://echo-ept.com/news-scraper',
  },
  twitter: {
    card: 'summary',
    title: 'News Scraper — AI News Intelligence',
    description: 'Monitor industry news, extract insights, get automated briefings from curated AI-powered sources.',
  },
  alternates: { canonical: '/news-scraper' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
