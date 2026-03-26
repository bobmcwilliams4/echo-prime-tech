import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Tracking — Echo Prime Technologies',
  description: 'Track and categorize business expenses across supplies, equipment, vehicles, insurance, and more. Log receipts, monitor recurring costs, and control spending.',
  openGraph: {
    title: 'Expense Tracking — Echo Prime Technologies',
    description: 'Categorized expense tracking with receipt logging and recurring cost management.',
    url: 'https://echo-ept.com/office-ai/expenses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expense Tracking — Echo Prime Technologies',
    description: 'Categorized expense tracking with receipt logging and recurring cost management.',
  },
  alternates: { canonical: '/office-ai/expenses' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
