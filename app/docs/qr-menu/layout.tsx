import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo QR Menu Documentation | Echo Prime Technologies',
  description: 'Digital restaurant menus via QR code — branded, multilingual, and analytics-powered. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['qr-menu', 'echo prime', 'documentation', 'api', 'guide', 'qr, menu'],
  openGraph: {
    title: 'Echo QR Menu Docs — Echo Prime Technologies',
    description: 'Digital restaurant menus via QR code — branded, multilingual, and analytics-powered.',
    url: 'https://echo-ept.com/docs/qr-menu',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo QR Menu Documentation',
    description: 'Digital restaurant menus via QR code — branded, multilingual, and analytics-powered.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/qr-menu',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
