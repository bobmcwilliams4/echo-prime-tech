import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices — Echo Prime Technologies',
  description: 'Create, send, and manage invoices with line items, payment tracking, and status management. Support for multiple payment methods, terms, and invoice preview with print capabilities.',
  openGraph: {
    title: 'Invoices — Echo Prime Technologies',
    description: 'Invoice management with creation, payment tracking, and multi-status workflows.',
    url: 'https://echo-ept.com/dashboard/business/invoices',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
