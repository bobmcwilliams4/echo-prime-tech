import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quote Generator — Echo Prime Technologies',
  description: 'Generate professional quotes with built-in service catalog and configurable validity periods. Send quotes to customers and convert approved quotes directly into invoices.',
  openGraph: {
    title: 'Quote Generator — Echo Prime Technologies',
    description: 'Professional quote generation with service catalog and one-click invoice conversion.',
    url: 'https://echo-ept.com/office-ai/quotes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quote Generator — Echo Prime Technologies',
    description: 'Professional quote generation with service catalog and one-click invoice conversion.',
  },
  alternates: { canonical: '/office-ai/quotes' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
