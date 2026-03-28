import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Phoenix Cloud Documentation | Echo Prime Technologies',
  description: 'Disaster recovery and system resurrection platform ensuring Echo systems survive any failure — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['phoenix-cloud', 'echo prime', 'documentation', 'api', 'guide', 'phoenix, cloud'],
  openGraph: {
    title: 'Echo Phoenix Cloud Docs — Echo Prime Technologies',
    description: 'Disaster recovery and system resurrection platform ensuring Echo systems survive any failure',
    url: 'https://echo-ept.com/docs/phoenix-cloud',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Phoenix Cloud Documentation',
    description: 'Disaster recovery and system resurrection platform ensuring Echo systems survive any failure',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/phoenix-cloud',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
