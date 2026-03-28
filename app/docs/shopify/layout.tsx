import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Shopify Integration Documentation | Echo Prime Technologies',
  description: 'Seamless Shopify store management with AI-powered inventory, pricing, and order automation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['shopify', 'echo prime', 'documentation', 'api', 'guide', 'shopify'],
  openGraph: {
    title: 'Echo Shopify Integration Docs — Echo Prime Technologies',
    description: 'Seamless Shopify store management with AI-powered inventory, pricing, and order automation.',
    url: 'https://echo-ept.com/docs/shopify',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Shopify Integration Documentation',
    description: 'Seamless Shopify store management with AI-powered inventory, pricing, and order automation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/shopify',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
