import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Management — Echo Prime Technologies',
  description: 'Create, send, and track professional invoices with built-in service catalog. Manage payment terms, record payments, and monitor invoice status from draft to paid.',
  openGraph: {
    title: 'Invoice Management — Echo Prime Technologies',
    description: 'Professional invoicing with service catalog, payment tracking, and status management.',
    url: 'https://echo-ept.com/office-ai/invoices',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
