import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Model Host Documentation | Echo Prime Technologies',
  description: 'Deploy and serve AI models at the edge with automatic scaling and inference optimization. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['model-host', 'echo prime', 'documentation', 'api', 'guide', 'model, host'],
  openGraph: {
    title: 'Echo Model Host Docs — Echo Prime Technologies',
    description: 'Deploy and serve AI models at the edge with automatic scaling and inference optimization.',
    url: 'https://echo-ept.com/docs/model-host',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Model Host Documentation',
    description: 'Deploy and serve AI models at the edge with automatic scaling and inference optimization.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/model-host',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
