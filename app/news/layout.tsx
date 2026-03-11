import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI News Aggregator | Multi-Source Intelligence Feed | Echo Prime Technologies',
  description: 'AI-powered news aggregation across 50+ sources. Real-time filtering, sentiment analysis, topic clustering, and custom alerts for industries that matter to you.',
  openGraph: {
    title: 'AI News Aggregator | Echo Prime Technologies',
    description: 'Multi-source AI news aggregation with sentiment analysis and custom alerts.',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
