import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Affiliate Documentation | Echo Prime Technologies',
  description: 'Multi-tier affiliate management — custom commissions, fraud detection, branded signup pages, click tracking, and AI performance insights. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['affiliate', 'echo prime', 'documentation', 'api', 'guide', 'affiliate'],
  openGraph: {
    title: 'Echo Affiliate Docs — Echo Prime Technologies',
    description: 'Multi-tier affiliate management — custom commissions, fraud detection, branded signup pages, click tracking, and AI performance insights.',
    url: 'https://echo-ept.com/docs/affiliate',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Affiliate Documentation',
    description: 'Multi-tier affiliate management — custom commissions, fraud detection, branded signup pages, click tracking, and AI performance insights.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/affiliate',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
