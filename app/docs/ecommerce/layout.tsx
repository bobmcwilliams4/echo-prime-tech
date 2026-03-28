import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Commerce Documentation | Echo Prime Technologies',
  description: 'AI-powered e-commerce platform with product catalog, cart, and order management. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['ecommerce', 'echo prime', 'documentation', 'api', 'guide', 'ecommerce'],
  openGraph: {
    title: 'Echo Commerce Docs — Echo Prime Technologies',
    description: 'AI-powered e-commerce platform with product catalog, cart, and order management.',
    url: 'https://echo-ept.com/docs/ecommerce',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Commerce Documentation',
    description: 'AI-powered e-commerce platform with product catalog, cart, and order management.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/ecommerce',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
