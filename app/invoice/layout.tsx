import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Invoice — AI-Powered Invoicing & Billing | Echo Prime',
  description: 'AI-powered invoicing with recurring billing, estimates, expense tracking, late payment prediction, and aging reports. Replace QuickBooks and FreshBooks at 1/5th the cost.',
  openGraph: {
    title: 'Echo Invoice — AI-Powered Invoicing & Billing',
    description: 'Smart invoicing with recurring billing, AI late payment prediction, expense tracking, estimates, and profit/loss reports.',
    url: 'https://echo-ept.com/invoice',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Invoice — AI-Powered Invoicing & Billing',
    description: 'Smart invoicing with recurring billing, AI late payment prediction, expense tracking, estimates, and profit/loss reports.',
  },
  alternates: { canonical: '/invoice' },
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
