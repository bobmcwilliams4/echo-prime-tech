import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments | Echo Prime Technologies',
  description: 'Manage your Echo Prime Technologies subscriptions and payments. View billing history, update payment methods, and manage your account.',
  openGraph: {
    title: 'Payments',
    description: 'Manage your Echo Prime Technologies subscriptions and payments. View billing history, update payment methods, and manage your account.',
    url: 'https://echo-ept.com/payments',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payments | Echo Prime Technologies',
    description: 'Manage your Echo Prime Technologies subscriptions and payments. View billing history, update payment methods, and manage your account.',
  },
  alternates: { canonical: '/payments' },
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
