import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Echo Prime Technologies',
  description: 'Complete your purchase of Echo Prime Technologies AI services. Secure checkout powered by PayPal.',
  openGraph: {
    title: 'Checkout — Echo Prime Technologies',
    description: 'Complete your purchase of Echo Prime Technologies AI services. Secure checkout powered by PayPal.',
    url: 'https://echo-ept.com/checkout',
  },
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
