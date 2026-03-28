import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Analytics Documentation | Echo Prime Technologies',
  description: 'Unified analytics dashboard aggregating metrics from all Echo Omega Prime services. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['analytics', 'echo prime', 'documentation', 'api', 'guide', 'analytics'],
  openGraph: {
    title: 'Echo Analytics Docs — Echo Prime Technologies',
    description: 'Unified analytics dashboard aggregating metrics from all Echo Omega Prime services.',
    url: 'https://echo-ept.com/docs/analytics',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Analytics Documentation',
    description: 'Unified analytics dashboard aggregating metrics from all Echo Omega Prime services.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/analytics',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
