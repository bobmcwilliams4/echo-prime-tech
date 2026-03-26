import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Management — Echo Prime Technologies',
  description: 'Manage residential and commercial customers with full contact details, payment terms, and tax exemption tracking. Search, add, edit, and organize your customer database.',
  openGraph: {
    title: 'Customer Management — Echo Prime Technologies',
    description: 'Customer database management for residential and commercial accounts.',
    url: 'https://echo-ept.com/dashboard/business/customers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Management — Echo Prime Technologies',
    description: 'Customer database management for residential and commercial accounts.',
  },
  alternates: { canonical: '/dashboard/business/customers' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
