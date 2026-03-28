import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Drive Intelligence Documentation | Echo Prime Technologies',
  description: 'AI-powered file system analysis for classification, duplicate detection, sensitive data discovery, and compliance scanning. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['drive-intelligence', 'echo prime', 'documentation', 'api', 'guide', 'drive, intelligence'],
  openGraph: {
    title: 'Echo Drive Intelligence Docs — Echo Prime Technologies',
    description: 'AI-powered file system analysis for classification, duplicate detection, sensitive data discovery, and compliance scanning.',
    url: 'https://echo-ept.com/docs/drive-intelligence',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Drive Intelligence Documentation',
    description: 'AI-powered file system analysis for classification, duplicate detection, sensitive data discovery, and compliance scanning.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/drive-intelligence',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
