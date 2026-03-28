import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Domain Harvester Documentation | Echo Prime Technologies',
  description: 'AI-powered domain intelligence for WHOIS monitoring, brand protection, DNS tracking, and expiring domain discovery. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['domain-harvester', 'echo prime', 'documentation', 'api', 'guide', 'domain, harvester'],
  openGraph: {
    title: 'Echo Domain Harvester Docs — Echo Prime Technologies',
    description: 'AI-powered domain intelligence for WHOIS monitoring, brand protection, DNS tracking, and expiring domain discovery.',
    url: 'https://echo-ept.com/docs/domain-harvester',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Domain Harvester Documentation',
    description: 'AI-powered domain intelligence for WHOIS monitoring, brand protection, DNS tracking, and expiring domain discovery.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/domain-harvester',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
