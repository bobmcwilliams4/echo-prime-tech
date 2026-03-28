import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Analytics Documentation | Echo Prime Technologies',
  description: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection — infrastructure, product, and business metrics in one platform. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['analytics-engine', 'echo prime', 'documentation', 'api', 'guide', 'analytics, engine'],
  openGraph: {
    title: 'Echo Analytics Docs — Echo Prime Technologies',
    description: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection — infrastructure, product, and business metrics in one platform.',
    url: 'https://echo-ept.com/docs/analytics-engine',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Analytics Documentation',
    description: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection — infrastructure, product, and business metrics in one platform.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/analytics-engine',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
