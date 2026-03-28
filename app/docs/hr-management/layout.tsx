import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo HR Management Documentation | Echo Prime Technologies',
  description: 'AI-powered people management: employee directory, time-off tracking, performance reviews, org charts, and compensation analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['hr-management', 'echo prime', 'documentation', 'api', 'guide', 'hr, management'],
  openGraph: {
    title: 'Echo HR Management Docs — Echo Prime Technologies',
    description: 'AI-powered people management: employee directory, time-off tracking, performance reviews, org charts, and compensation analytics.',
    url: 'https://echo-ept.com/docs/hr-management',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo HR Management Documentation',
    description: 'AI-powered people management: employee directory, time-off tracking, performance reviews, org charts, and compensation analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/hr-management',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
