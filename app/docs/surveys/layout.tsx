import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Surveys Documentation | Echo Prime Technologies',
  description: 'Intelligent survey platform with NPS, CSAT, and custom feedback collection — powered by AI analysis. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['surveys', 'echo prime', 'documentation', 'api', 'guide', 'surveys'],
  openGraph: {
    title: 'Echo Surveys Docs — Echo Prime Technologies',
    description: 'Intelligent survey platform with NPS, CSAT, and custom feedback collection — powered by AI analysis.',
    url: 'https://echo-ept.com/docs/surveys',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Surveys Documentation',
    description: 'Intelligent survey platform with NPS, CSAT, and custom feedback collection — powered by AI analysis.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/surveys',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
