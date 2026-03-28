import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Timesheet Documentation | Echo Prime Technologies',
  description: 'AI-powered time tracking — timers, project budgets, team approvals, and invoice generation. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['timesheet', 'echo prime', 'documentation', 'api', 'guide', 'timesheet'],
  openGraph: {
    title: 'Echo Timesheet Docs — Echo Prime Technologies',
    description: 'AI-powered time tracking — timers, project budgets, team approvals, and invoice generation.',
    url: 'https://echo-ept.com/docs/timesheet',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Timesheet Documentation',
    description: 'AI-powered time tracking — timers, project budgets, team approvals, and invoice generation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/timesheet',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
