import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Domain Harvester — Domain Monitoring & Brand Protection | Echo Prime Tech',
  description: 'Monitor domains, track WHOIS changes, detect brand impersonation, and discover expiring domains. AI-powered domain intelligence for brand protection and opportunity discovery.',
  keywords: ['domain monitoring', 'brand protection', 'whois tracking', 'domain intelligence', 'expiring domains', 'dns monitoring', 'echo prime'],
  openGraph: {
    title: 'Echo Domain Harvester — Domain Monitoring & Brand Protection',
    description: 'AI-powered domain monitoring, WHOIS tracking, brand protection, and expiring domain discovery.',
    url: 'https://echo-ept.com/domain-harvester',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Domain Harvester — Domain Monitoring & Brand Protection',
    description: 'AI-powered domain monitoring, WHOIS tracking, and brand protection.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/domain-harvester',
  },
}

export default function DomainHarvesterLayout({ children }: { children: React.ReactNode }) {
  return children
}
