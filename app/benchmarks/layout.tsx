import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Benchmarks & Metrics — Echo Prime Technologies',
  description: 'Real production benchmarks: <50ms API response, zero cold starts, 5,500+ AI engines, 64K+ GOLD doctrines. Performance comparisons vs AWS Lambda, ChatGPT, and traditional platforms.',
  keywords: ['benchmarks', 'performance metrics', 'API latency', 'cold start', 'AI engines', 'doctrine quality', 'edge computing benchmarks', 'cloudflare workers performance'],
  openGraph: {
    title: 'Benchmarks & Metrics — Echo Prime Technologies',
    description: 'Real production benchmarks: <50ms API response, zero cold starts, 5,500+ AI engines, 64K+ GOLD doctrines.',
    url: 'https://echo-ept.com/benchmarks',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benchmarks & Metrics — Echo Prime Technologies',
    description: 'Real production benchmarks: <50ms response, zero cold starts, 5,500+ AI engines.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/benchmarks',
  },
};

export default function BenchmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
