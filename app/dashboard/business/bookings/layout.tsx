import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookings — Echo Prime Technologies',
  description: 'Schedule and manage service bookings with full lifecycle tracking. Create, confirm, start, and complete jobs with customer details, service selection, pricing, and address management.',
  openGraph: {
    title: 'Bookings — Echo Prime Technologies',
    description: 'Service booking management with scheduling, status tracking, and job lifecycle control.',
    url: 'https://echo-ept.com/dashboard/business/bookings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bookings — Echo Prime Technologies',
    description: 'Service booking management with scheduling, status tracking, and job lifecycle control.',
  },
  alternates: { canonical: '/dashboard/business/bookings' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
