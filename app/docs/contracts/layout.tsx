import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Contracts Documentation | Echo Prime Technologies',
  description: 'End-to-end contract lifecycle management — templates, clause library, e-signatures, approval workflows, and AI risk analysis. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['contracts', 'echo prime', 'documentation', 'api', 'guide', 'contracts'],
  openGraph: {
    title: 'Echo Contracts Docs — Echo Prime Technologies',
    description: 'End-to-end contract lifecycle management — templates, clause library, e-signatures, approval workflows, and AI risk analysis.',
    url: 'https://echo-ept.com/docs/contracts',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Contracts Documentation',
    description: 'End-to-end contract lifecycle management — templates, clause library, e-signatures, approval workflows, and AI risk analysis.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/contracts',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
