import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Catalog — Echo Prime Technologies',
  description: 'Define and manage your service catalog with pricing, billing cycles, and categories. Configure flat-rate or custom pricing across AI, development, security, and consulting services.',
  openGraph: {
    title: 'Service Catalog — Echo Prime Technologies',
    description: 'Service catalog management with flexible pricing, categories, and billing cycles.',
    url: 'https://echo-ept.com/office-ai/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Catalog — Echo Prime Technologies',
    description: 'Service catalog management with flexible pricing, categories, and billing cycles.',
  },
  alternates: { canonical: '/office-ai/services' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
