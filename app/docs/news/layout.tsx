import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo News Intelligence Documentation | Echo Prime Technologies',
  description: 'AI-curated news aggregation with topic tracking, sentiment analysis, and smart briefings. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['news', 'echo prime', 'documentation', 'api', 'guide', 'news'],
  openGraph: {
    title: 'Echo News Intelligence Docs — Echo Prime Technologies',
    description: 'AI-curated news aggregation with topic tracking, sentiment analysis, and smart briefings.',
    url: 'https://echo-ept.com/docs/news',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo News Intelligence Documentation',
    description: 'AI-curated news aggregation with topic tracking, sentiment analysis, and smart briefings.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/news',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
