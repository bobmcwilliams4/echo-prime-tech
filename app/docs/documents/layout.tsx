import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Documents Documentation | Echo Prime Technologies',
  description: 'Cloud document management with version control, sharing, and AI-powered organization. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['documents', 'echo prime', 'documentation', 'api', 'guide', 'documents'],
  openGraph: {
    title: 'Echo Documents Docs — Echo Prime Technologies',
    description: 'Cloud document management with version control, sharing, and AI-powered organization.',
    url: 'https://echo-ept.com/docs/documents',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Documents Documentation',
    description: 'Cloud document management with version control, sharing, and AI-powered organization.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/documents',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
