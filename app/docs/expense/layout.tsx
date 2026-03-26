import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense Tracker Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Expense — AI-powered expense tracking with receipt scanning, automatic categorization, multi-currency support, approval workflows, and report generation.',
  openGraph: {
    title: 'Expense Tracker Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Expense — AI expense tracking with receipt scanning, auto-categorization, and report generation.',
    url: 'https://echo-ept.com/docs/expense',
  },
}

export default function ExpenseDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
