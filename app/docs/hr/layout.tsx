import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo HR Documentation | Echo Prime Technologies',
  description: 'AI-powered human resources — employees, time tracking, leave management, payroll, and performance reviews. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['hr', 'echo prime', 'documentation', 'api', 'guide', 'hr'],
  openGraph: {
    title: 'Echo HR Docs — Echo Prime Technologies',
    description: 'AI-powered human resources — employees, time tracking, leave management, payroll, and performance reviews.',
    url: 'https://echo-ept.com/docs/hr',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo HR Documentation',
    description: 'AI-powered human resources — employees, time tracking, leave management, payroll, and performance reviews.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/hr',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
