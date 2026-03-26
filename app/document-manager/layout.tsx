import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Document Manager — Echo Prime Tech',
  description: 'AI-powered document management with version control, full-text search, OCR, e-signatures, and automated workflows. Replace SharePoint at a fraction of the cost.',
  openGraph: {
    title: 'Document Manager — Echo Prime Tech',
    description: 'AI-powered document management with version control, full-text search, OCR, e-signatures, and automated workflows.',
    url: 'https://echo-ept.com/document-manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Document Manager — Echo Prime Tech',
    description: 'AI-powered document management with version control, full-text search, OCR, e-signatures, and automated workflows.',
  },
  alternates: { canonical: '/document-manager' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
