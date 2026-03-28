import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Asset Manager Documentation | Echo Prime Technologies',
  description: 'Track every asset with automatic depreciation, maintenance scheduling, AI condition assessments, and tax forecasting — all in one platform. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['asset-manager', 'echo prime', 'documentation', 'api', 'guide', 'asset, manager'],
  openGraph: {
    title: 'Echo Asset Manager Docs — Echo Prime Technologies',
    description: 'Track every asset with automatic depreciation, maintenance scheduling, AI condition assessments, and tax forecasting — all in one platform.',
    url: 'https://echo-ept.com/docs/asset-manager',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Asset Manager Documentation',
    description: 'Track every asset with automatic depreciation, maintenance scheduling, AI condition assessments, and tax forecasting — all in one platform.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/asset-manager',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
