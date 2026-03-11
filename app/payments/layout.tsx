import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments | Echo Prime Technologies',
  description: 'Manage your Echo Prime Technologies subscriptions and payments. View billing history, update payment methods, and manage your account.',
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
