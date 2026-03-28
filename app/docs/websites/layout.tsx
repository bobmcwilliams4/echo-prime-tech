import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Website Builder Documentation | Echo Prime Technologies',
  description: 'AI-powered website creation with templates, hosting, and one-click deployment. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['websites', 'echo prime', 'documentation', 'api', 'guide', 'websites'],
  openGraph: {
    title: 'Echo Website Builder Docs — Echo Prime Technologies',
    description: 'AI-powered website creation with templates, hosting, and one-click deployment.',
    url: 'https://echo-ept.com/docs/websites',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Website Builder Documentation',
    description: 'AI-powered website creation with templates, hosting, and one-click deployment.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/websites',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
