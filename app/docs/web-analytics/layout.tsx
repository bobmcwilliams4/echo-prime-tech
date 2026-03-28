import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Web Analytics Documentation | Echo Prime Technologies',
  description: 'Privacy-first, cookie-free analytics with a <1KB tracking script and real-time dashboards — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['web-analytics', 'echo prime', 'documentation', 'api', 'guide', 'web, analytics'],
  openGraph: {
    title: 'Echo Web Analytics Docs — Echo Prime Technologies',
    description: 'Privacy-first, cookie-free analytics with a <1KB tracking script and real-time dashboards',
    url: 'https://echo-ept.com/docs/web-analytics',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Web Analytics Documentation',
    description: 'Privacy-first, cookie-free analytics with a <1KB tracking script and real-time dashboards',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/web-analytics',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
