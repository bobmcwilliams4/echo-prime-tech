import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Tracking — Echo Prime Technologies',
  description: 'Track and categorize business expenses across supplies, equipment, vehicles, insurance, marketing, and more. Monthly summaries with recurring expense management and vendor tracking.',
  openGraph: {
    title: 'Expense Tracking — Echo Prime Technologies',
    description: 'Business expense tracking with category filtering, monthly summaries, and vendor management.',
    url: 'https://echo-ept.com/dashboard/business/expenses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expense Tracking — Echo Prime Technologies',
    description: 'Business expense tracking with category filtering, monthly summaries, and vendor management.',
  },
  alternates: { canonical: '/dashboard/business/expenses' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
