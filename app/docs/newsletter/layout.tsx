import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Newsletter Documentation | Echo Prime Technologies',
  description: 'Full-lifecycle email newsletter platform — build lists, automate drip sequences, and track every open and click. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['newsletter', 'echo prime', 'documentation', 'api', 'guide', 'newsletter'],
  openGraph: {
    title: 'Echo Newsletter Docs — Echo Prime Technologies',
    description: 'Full-lifecycle email newsletter platform — build lists, automate drip sequences, and track every open and click.',
    url: 'https://echo-ept.com/docs/newsletter',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Newsletter Documentation',
    description: 'Full-lifecycle email newsletter platform — build lists, automate drip sequences, and track every open and click.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/newsletter',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
