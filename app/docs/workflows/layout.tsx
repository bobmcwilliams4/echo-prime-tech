import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Workflows Documentation | Echo Prime Technologies',
  description: 'Visual workflow automation engine with multi-step execution, triggers, and integrations. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['workflows', 'echo prime', 'documentation', 'api', 'guide', 'workflows'],
  openGraph: {
    title: 'Echo Workflows Docs — Echo Prime Technologies',
    description: 'Visual workflow automation engine with multi-step execution, triggers, and integrations.',
    url: 'https://echo-ept.com/docs/workflows',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Workflows Documentation',
    description: 'Visual workflow automation engine with multi-step execution, triggers, and integrations.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/workflows',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
