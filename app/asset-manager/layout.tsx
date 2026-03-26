import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asset Manager — Echo Prime Tech',
  description: 'AI-powered asset tracking, depreciation management, maintenance scheduling, and portfolio analytics. Replace spreadsheets and expensive CMMS tools.',
  openGraph: {
    title: 'Asset Manager — Echo Prime Tech',
    description: 'AI-powered asset tracking with depreciation, maintenance scheduling, and portfolio analytics.',
    url: 'https://echo-ept.com/asset-manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asset Manager — Echo Prime Tech',
    description: 'AI-powered asset tracking with depreciation, maintenance scheduling, and portfolio analytics.',
  },
  alternates: { canonical: '/asset-manager' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
