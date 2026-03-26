import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Invoicing & Billing — Echo Prime Technologies',
  description: 'AI-powered invoicing for freelancers and small businesses. Professional invoices, recurring billing, payment tracking, multi-currency, AI payment prediction. Starts at $15/month.',
  keywords: ['invoicing', 'AI invoicing', 'billing software', 'invoice generator', 'recurring billing', 'FreshBooks alternative', 'QuickBooks alternative'],
  openGraph: {
    title: 'AI Invoicing & Billing — Echo Prime Technologies',
    description: 'AI-powered invoicing for freelancers and small businesses. Professional invoices, recurring billing, payment tracking, multi-currency, AI payment prediction.',
    url: 'https://echo-ept.com/invoicing',
  },
};

export default function InvoicingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
