import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Recruiting Documentation | Echo Prime Technologies',
  description: 'Full-cycle ATS with AI resume screening, customizable pipelines, scorecards, offer management, and talent pools. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['recruiting', 'echo prime', 'documentation', 'api', 'guide', 'recruiting'],
  openGraph: {
    title: 'Echo Recruiting Docs — Echo Prime Technologies',
    description: 'Full-cycle ATS with AI resume screening, customizable pipelines, scorecards, offer management, and talent pools.',
    url: 'https://echo-ept.com/docs/recruiting',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Recruiting Documentation',
    description: 'Full-cycle ATS with AI resume screening, customizable pipelines, scorecards, offer management, and talent pools.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/recruiting',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
