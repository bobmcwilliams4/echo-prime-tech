import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense Management — Echo Prime Tech',
  description: 'AI-powered expense tracking with receipt scanning, mileage logging, approval workflows, and real-time policy enforcement. Replace Expensify at a fraction of the cost.',
  openGraph: {
    title: 'Expense Management — Echo Prime Tech',
    description: 'AI-powered expense tracking with receipt scanning, mileage logging, approval workflows, and real-time policy enforcement.',
    url: 'https://echo-ept.com/expense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expense Management — Echo Prime Tech',
    description: 'AI-powered expense tracking with receipt scanning, mileage logging, approval workflows, and real-time policy enforcement.',
  },
  alternates: { canonical: '/expense' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
