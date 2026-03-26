import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quotes — Echo Prime Technologies',
  description: 'Create and manage service quotes with line items, validity periods, and conversion to invoices. Track quote status from draft through approval with customer-specific pricing.',
  openGraph: {
    title: 'Quotes — Echo Prime Technologies',
    description: 'Service quote management with line items, approval tracking, and invoice conversion.',
    url: 'https://echo-ept.com/dashboard/business/quotes',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
