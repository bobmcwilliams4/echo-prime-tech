import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts Receivable & Payable — Echo Prime Technologies',
  description: 'Manage accounts receivable aging with bucket-based tracking for outstanding invoices. Monitor 0-30, 31-60, 61-90, and 90+ day aging buckets with distribution visualizations.',
  openGraph: {
    title: 'Accounts Receivable & Payable — Echo Prime Technologies',
    description: 'AR aging buckets, outstanding invoice tracking, and payment distribution insights.',
    url: 'https://echo-ept.com/dashboard/business/ar-ap',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accounts Receivable & Payable — Echo Prime Technologies',
    description: 'AR aging buckets, outstanding invoice tracking, and payment distribution insights.',
  },
  alternates: { canonical: '/dashboard/business/ar-ap' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
