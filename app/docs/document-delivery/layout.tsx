import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Document Delivery Documentation | Echo Prime Technologies',
  description: 'Universal document generation, viewing, and delivery via Print, PDF, Email, and SMS. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['document-delivery', 'echo prime', 'documentation', 'api', 'guide', 'document, delivery'],
  openGraph: {
    title: 'Echo Document Delivery Docs — Echo Prime Technologies',
    description: 'Universal document generation, viewing, and delivery via Print, PDF, Email, and SMS.',
    url: 'https://echo-ept.com/docs/document-delivery',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Document Delivery Documentation',
    description: 'Universal document generation, viewing, and delivery via Print, PDF, Email, and SMS.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/document-delivery',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
