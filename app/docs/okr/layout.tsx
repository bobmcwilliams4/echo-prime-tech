import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo OKR Documentation | Echo Prime Technologies',
  description: 'AI-powered Objectives and Key Results tracking with goal alignment and team performance. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['okr', 'echo prime', 'documentation', 'api', 'guide', 'okr'],
  openGraph: {
    title: 'Echo OKR Docs — Echo Prime Technologies',
    description: 'AI-powered Objectives and Key Results tracking with goal alignment and team performance.',
    url: 'https://echo-ept.com/docs/okr',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo OKR Documentation',
    description: 'AI-powered Objectives and Key Results tracking with goal alignment and team performance.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/okr',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
