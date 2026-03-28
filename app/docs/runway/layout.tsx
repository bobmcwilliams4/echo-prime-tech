import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Runway Documentation | Echo Prime Technologies',
  description: 'AI creative studio for video generation, image editing, and multimedia production. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['runway', 'echo prime', 'documentation', 'api', 'guide', 'runway'],
  openGraph: {
    title: 'Echo Runway Docs — Echo Prime Technologies',
    description: 'AI creative studio for video generation, image editing, and multimedia production.',
    url: 'https://echo-ept.com/docs/runway',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Runway Documentation',
    description: 'AI creative studio for video generation, image editing, and multimedia production.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/runway',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
