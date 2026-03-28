import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Document Delivery — Print, PDF, Email & SMS Documents | Echo Prime Technologies',
  description: 'Universal document delivery system: generate branded invoices, estimates, and reports as HTML, PDF, email, or SMS. Token-based sharing, R2 cloud storage, and company branding customization.',
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Document Delivery — Print, PDF, Email & SMS Documents | Echo Prime Technologies',
    description: 'Universal document delivery: branded invoices, estimates, reports as PDF, email, or SMS with token-based sharing and R2 cloud storage.',
  },
  alternates: { canonical: '/document-delivery' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
