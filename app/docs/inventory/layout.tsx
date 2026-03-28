import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Inventory Documentation | Echo Prime Technologies',
  description: 'Multi-warehouse inventory management with AI demand forecasting, purchase orders, and real-time stock movements. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['inventory', 'echo prime', 'documentation', 'api', 'guide', 'inventory'],
  openGraph: {
    title: 'Echo Inventory Docs — Echo Prime Technologies',
    description: 'Multi-warehouse inventory management with AI demand forecasting, purchase orders, and real-time stock movements.',
    url: 'https://echo-ept.com/docs/inventory',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Inventory Documentation',
    description: 'Multi-warehouse inventory management with AI demand forecasting, purchase orders, and real-time stock movements.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/inventory',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
