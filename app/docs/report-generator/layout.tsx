import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Report Generator Documentation | Echo Prime Technologies',
  description: 'AI-powered business intelligence reports with automated data collection and visualization. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['report-generator', 'echo prime', 'documentation', 'api', 'guide', 'report, generator'],
  openGraph: {
    title: 'Echo Report Generator Docs — Echo Prime Technologies',
    description: 'AI-powered business intelligence reports with automated data collection and visualization.',
    url: 'https://echo-ept.com/docs/report-generator',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Report Generator Documentation',
    description: 'AI-powered business intelligence reports with automated data collection and visualization.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/report-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
