import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Forge Marketplace Documentation | Echo Prime Technologies',
  description: 'The app store for AI expertise. Browse, compare, and subscribe to 5,500+ domain-specific Intelligence Engines — from tax law to oilfield drilling to cybersecurity — with previews, ratings, and instant deployment. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['forge-marketplace', 'echo prime', 'documentation', 'api', 'guide', 'forge, marketplace'],
  openGraph: {
    title: 'Echo Forge Marketplace Docs — Echo Prime Technologies',
    description: 'The app store for AI expertise. Browse, compare, and subscribe to 5,500+ domain-specific Intelligence Engines — from tax law to oilfield drilling to cybersecurity — with previews, ratings, and instant deployment.',
    url: 'https://echo-ept.com/docs/forge-marketplace',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Forge Marketplace Documentation',
    description: 'The app store for AI expertise. Browse, compare, and subscribe to 5,500+ domain-specific Intelligence Engines — from tax law to oilfield drilling to cybersecurity — with previews, ratings, and instant deployment.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/forge-marketplace',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
