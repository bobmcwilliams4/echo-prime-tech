import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts Receivable & Payable — Echo Prime Technologies',
  description: 'Track accounts receivable and payable aging with color-coded buckets. Monitor outstanding balances, aging invoices, and cash flow health at a glance.',
  openGraph: {
    title: 'Accounts Receivable & Payable — Echo Prime Technologies',
    description: 'AR/AP aging reports with real-time outstanding balance tracking and cash flow monitoring.',
    url: 'https://echo-ept.com/office-ai/ar-ap',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
