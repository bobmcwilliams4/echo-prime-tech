import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Management — Echo Prime Technologies',
  description: 'Create, send, and manage PayPal invoices for Echo Prime Technologies clients. Track invoice status, send reminders, and manage line items from a centralized admin dashboard.',
  openGraph: {
    title: 'Invoice Management — Echo Prime Technologies',
    description: 'Create and manage PayPal invoices for EPT clients with status tracking and automated reminders.',
    url: 'https://echo-ept.com/admin/invoices',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
