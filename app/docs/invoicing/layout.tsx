import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Invoicing Documentation | Echo Prime Technologies',
  description: 'AI-powered invoicing and billing: professional invoices, recurring billing, payment tracking, and AI payment prediction. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['invoicing', 'echo prime', 'documentation', 'api', 'guide', 'invoicing'],
  openGraph: {
    title: 'Echo Invoicing Docs — Echo Prime Technologies',
    description: 'AI-powered invoicing and billing: professional invoices, recurring billing, payment tracking, and AI payment prediction.',
    url: 'https://echo-ept.com/docs/invoicing',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Invoicing Documentation',
    description: 'AI-powered invoicing and billing: professional invoices, recurring billing, payment tracking, and AI payment prediction.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/invoicing',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
