import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Data Pipeline Documentation | Echo Prime Technologies',
  description: 'Serverless data ingestion, transformation, and routing across your entire data stack. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['pipelines', 'echo prime', 'documentation', 'api', 'guide', 'pipelines'],
  openGraph: {
    title: 'Echo Data Pipeline Docs — Echo Prime Technologies',
    description: 'Serverless data ingestion, transformation, and routing across your entire data stack.',
    url: 'https://echo-ept.com/docs/pipelines',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Data Pipeline Documentation',
    description: 'Serverless data ingestion, transformation, and routing across your entire data stack.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/pipelines',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
