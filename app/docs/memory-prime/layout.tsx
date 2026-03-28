import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Memory Prime Documentation | Echo Prime Technologies',
  description: '9-pillar permanent memory archive powering cross-session continuity across all Echo AI instances — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['memory-prime', 'echo prime', 'documentation', 'api', 'guide', 'memory, prime'],
  openGraph: {
    title: 'Echo Memory Prime Docs — Echo Prime Technologies',
    description: '9-pillar permanent memory archive powering cross-session continuity across all Echo AI instances',
    url: 'https://echo-ept.com/docs/memory-prime',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Memory Prime Documentation',
    description: '9-pillar permanent memory archive powering cross-session continuity across all Echo AI instances',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/memory-prime',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
