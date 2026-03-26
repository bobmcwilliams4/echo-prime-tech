import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful — Echo Prime Technologies',
  description: 'Your payment has been processed and your subscription is now active. Access your Echo Prime Technologies dashboard to start using your services immediately.',
  openGraph: {
    title: 'Payment Successful — Echo Prime Technologies',
    description: 'Payment confirmed. Your Echo Prime Technologies subscription is now active.',
    url: 'https://echo-ept.com/checkout/success',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payment Successful — Echo Prime Technologies',
    description: 'Payment confirmed. Your Echo Prime Technologies subscription is now active.',
  },
  alternates: { canonical: '/checkout/success' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
