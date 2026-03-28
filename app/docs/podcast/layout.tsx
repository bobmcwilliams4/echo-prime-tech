import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Podcast Documentation | Echo Prime Technologies',
  description: 'Full-stack podcast hosting with RSS 2.0 feeds, R2 audio streaming, embeddable players, and AI show notes — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['podcast', 'echo prime', 'documentation', 'api', 'guide', 'podcast'],
  openGraph: {
    title: 'Echo Podcast Docs — Echo Prime Technologies',
    description: 'Full-stack podcast hosting with RSS 2.0 feeds, R2 audio streaming, embeddable players, and AI show notes',
    url: 'https://echo-ept.com/docs/podcast',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Podcast Documentation',
    description: 'Full-stack podcast hosting with RSS 2.0 feeds, R2 audio streaming, embeddable players, and AI show notes',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/podcast',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
