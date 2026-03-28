import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Diagnostics Documentation | Echo Prime Technologies',
  description: 'Real-time system health monitoring, performance profiling, and automated issue detection. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['diagnostics', 'echo prime', 'documentation', 'api', 'guide', 'diagnostics'],
  openGraph: {
    title: 'Echo Diagnostics Docs — Echo Prime Technologies',
    description: 'Real-time system health monitoring, performance profiling, and automated issue detection.',
    url: 'https://echo-ept.com/docs/diagnostics',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Diagnostics Documentation',
    description: 'Real-time system health monitoring, performance profiling, and automated issue detection.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/diagnostics',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
