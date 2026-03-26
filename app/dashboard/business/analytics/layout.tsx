import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Analytics — Echo Prime Technologies',
  description: 'Track revenue trends, expense breakdowns, and key performance indicators for your business. Real-time analytics with monthly comparisons, profit margins, and customer activity insights.',
  openGraph: {
    title: 'Business Analytics — Echo Prime Technologies',
    description: 'Revenue trends, expense breakdowns, and KPI tracking for your business.',
    url: 'https://echo-ept.com/dashboard/business/analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Analytics — Echo Prime Technologies',
    description: 'Revenue trends, expense breakdowns, and KPI tracking for your business.',
  },
  alternates: { canonical: '/dashboard/business/analytics' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
