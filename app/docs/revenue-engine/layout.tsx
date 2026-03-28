import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Revenue Engine Documentation | Echo Prime Technologies',
  description: 'AI-powered revenue optimization — pricing intelligence, conversion tracking, subscription analytics, and churn prediction. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['revenue-engine', 'echo prime', 'documentation', 'api', 'guide', 'revenue, engine'],
  openGraph: {
    title: 'Echo Revenue Engine Docs — Echo Prime Technologies',
    description: 'AI-powered revenue optimization — pricing intelligence, conversion tracking, subscription analytics, and churn prediction.',
    url: 'https://echo-ept.com/docs/revenue-engine',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Revenue Engine Documentation',
    description: 'AI-powered revenue optimization — pricing intelligence, conversion tracking, subscription analytics, and churn prediction.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/revenue-engine',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
