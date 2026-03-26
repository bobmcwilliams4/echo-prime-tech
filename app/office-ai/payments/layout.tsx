import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Tracking — Echo Prime Technologies',
  description: 'Record and monitor payment collections across credit card, cash, check, ACH, and PayPal. Track payment status, filter by method, and link payments to invoices.',
  openGraph: {
    title: 'Payment Tracking — Echo Prime Technologies',
    description: 'Multi-method payment tracking with status monitoring and invoice linking.',
    url: 'https://echo-ept.com/office-ai/payments',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payment Tracking — Echo Prime Technologies',
    description: 'Multi-method payment tracking with status monitoring and invoice linking.',
  },
  alternates: { canonical: '/office-ai/payments' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
