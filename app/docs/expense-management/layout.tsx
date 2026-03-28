import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Expense Management Documentation | Echo Prime Technologies',
  description: 'AI-powered expense tracking with receipt scanning, policy enforcement, approval workflows, and spending analytics. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['expense-management', 'echo prime', 'documentation', 'api', 'guide', 'expense, management'],
  openGraph: {
    title: 'Echo Expense Management Docs — Echo Prime Technologies',
    description: 'AI-powered expense tracking with receipt scanning, policy enforcement, approval workflows, and spending analytics.',
    url: 'https://echo-ept.com/docs/expense-management',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Expense Management Documentation',
    description: 'AI-powered expense tracking with receipt scanning, policy enforcement, approval workflows, and spending analytics.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/expense-management',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
