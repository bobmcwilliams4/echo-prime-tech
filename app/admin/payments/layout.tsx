import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Dashboard — Echo Prime Technologies',
  description: 'Monitor PayPal Business revenue, transaction history, customer analytics, and subscription metrics. View net revenue, refunds, outstanding invoices, and top customers in real time.',
  openGraph: {
    title: 'Payment Dashboard — Echo Prime Technologies',
    description: 'Real-time PayPal revenue analytics, transaction history, and customer insights for Echo Prime Technologies.',
    url: 'https://echo-ept.com/admin/payments',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
