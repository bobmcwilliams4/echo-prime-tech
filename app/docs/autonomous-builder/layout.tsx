import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Autonomous Builder Documentation | Echo Prime Technologies',
  description: 'Self-operating execution engine — automatic QA bug fixing, worker warming, thin page generation, and fleet-wide upgrades. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['autonomous-builder', 'echo prime', 'documentation', 'api', 'guide', 'autonomous, builder'],
  openGraph: {
    title: 'Echo Autonomous Builder Docs — Echo Prime Technologies',
    description: 'Self-operating execution engine — automatic QA bug fixing, worker warming, thin page generation, and fleet-wide upgrades.',
    url: 'https://echo-ept.com/docs/autonomous-builder',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Autonomous Builder Documentation',
    description: 'Self-operating execution engine — automatic QA bug fixing, worker warming, thin page generation, and fleet-wide upgrades.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/autonomous-builder',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
