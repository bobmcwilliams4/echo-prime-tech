import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Payments Documentation | Echo Prime Technologies',
  description: 'Unified payment processing with PayPal, Stripe, and cryptocurrency support. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['payments', 'echo prime', 'documentation', 'api', 'guide', 'payments'],
  openGraph: {
    title: 'Echo Payments Docs — Echo Prime Technologies',
    description: 'Unified payment processing with PayPal, Stripe, and cryptocurrency support.',
    url: 'https://echo-ept.com/docs/payments',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Payments Documentation',
    description: 'Unified payment processing with PayPal, Stripe, and cryptocurrency support.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/payments',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
