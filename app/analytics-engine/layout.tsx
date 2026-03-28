import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Analytics Engine — Fleet Intelligence & Growth Metrics | Echo Prime Technologies',
  description: 'Unified analytics across 5,500+ engines, 600K+ doctrines, 80K+ brain messages, and 90+ Cloudflare Workers. Real-time fleet scoring, growth trends, and AI-powered insights with automated 6-hour snapshots.',
  openGraph: {
    title: 'Echo Analytics Engine — Fleet Intelligence & Growth Metrics',
    description: 'Unified analytics across 5,500+ engines, 600K+ doctrines, 80K+ brain messages, and 90+ Cloudflare Workers. Real-time fleet scoring, growth trends, and AI-powered insights with automated 6-hour snapshots.',
    url: 'https://echo-ept.com/analytics-engine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Analytics Engine — Fleet Intelligence & Growth Metrics | Echo Prime Technologies',
    description: 'Unified analytics across 5,500+ engines, 600K+ doctrines, and 90+ Workers. Real-time fleet scoring, growth trends, and AI-powered insights.',
  },
  alternates: { canonical: '/analytics-engine' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
