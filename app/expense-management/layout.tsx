import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Expense — AI-Powered Expense Management for Teams',
  description: 'Expense tracking with AI receipt scanning, policy enforcement, approval workflows, mileage & per diem, budget tracking, and reimbursement management. Expensify alternative starting at $6/user/mo.',
  openGraph: {
    title: 'Echo Expense — AI Expense Management',
    description: 'Expense reports, receipt scanning, policy enforcement, and reimbursement management for teams.',
    url: 'https://echo-ept.com/expense-management',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Expense — AI Expense Management',
    description: 'Expense reports, receipt scanning, policy enforcement, and reimbursement management for teams.',
  },
  alternates: { canonical: '/expense-management' },
};

export default function ExpenseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
