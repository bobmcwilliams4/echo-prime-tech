import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Personal Finance — Echo Prime Technologies',
  description: 'AI-powered personal finance with multi-account tracking, smart transaction categorization, budget monitoring, savings goals, and net worth tracking. Free tier available.',
  keywords: ['personal finance', 'AI finance', 'budget tracker', 'Mint alternative', 'expense tracking', 'financial dashboard', 'savings goals'],
  openGraph: {
    title: 'AI Personal Finance — Echo Prime Technologies',
    description: 'AI-powered personal finance with multi-account tracking, auto-categorization, budgets, and net worth tracking.',
    url: 'https://echo-ept.com/finance',
  },
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
