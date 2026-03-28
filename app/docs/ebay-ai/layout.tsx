import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo eBay AI Documentation | Echo Prime Technologies',
  description: 'AI-powered eBay selling: automated listings, dynamic repricing, competitor intelligence, and sales analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['ebay-ai', 'echo prime', 'documentation', 'api', 'guide', 'ebay, ai'],
  openGraph: {
    title: 'Echo eBay AI Docs — Echo Prime Technologies',
    description: 'AI-powered eBay selling: automated listings, dynamic repricing, competitor intelligence, and sales analytics.',
    url: 'https://echo-ept.com/docs/ebay-ai',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo eBay AI Documentation',
    description: 'AI-powered eBay selling: automated listings, dynamic repricing, competitor intelligence, and sales analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/ebay-ai',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
