import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Finance Documentation | Echo Prime Technologies',
  description: 'AI-powered personal finance: multi-account tracking, auto-categorization, budgets, goals, and spending insights. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['finance', 'echo prime', 'documentation', 'api', 'guide', 'finance'],
  openGraph: {
    title: 'Echo Finance Docs — Echo Prime Technologies',
    description: 'AI-powered personal finance: multi-account tracking, auto-categorization, budgets, goals, and spending insights.',
    url: 'https://echo-ept.com/docs/finance',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Finance Documentation',
    description: 'AI-powered personal finance: multi-account tracking, auto-categorization, budgets, goals, and spending insights.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/finance',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
