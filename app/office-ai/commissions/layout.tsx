import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Commissions — Echo Prime Technologies',
  description: 'Manage sales representatives and track commission payouts tied to invoices. Approve, pay, and audit commissions with full transparency across your sales team.',
  openGraph: {
    title: 'Sales Commissions — Echo Prime Technologies',
    description: 'Sales rep management with automated commission tracking, approvals, and payouts.',
    url: 'https://echo-ept.com/office-ai/commissions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Commissions — Echo Prime Technologies',
    description: 'Sales rep management with automated commission tracking, approvals, and payouts.',
  },
  alternates: { canonical: '/office-ai/commissions' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
