import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo PayPal Integration Documentation | Echo Prime Technologies',
  description: 'Complete PayPal business integration — payments, subscriptions, invoicing, and payout management via unified API. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['paypal-integration', 'echo prime', 'documentation', 'api', 'guide', 'paypal, integration'],
  openGraph: {
    title: 'Echo PayPal Integration Docs — Echo Prime Technologies',
    description: 'Complete PayPal business integration — payments, subscriptions, invoicing, and payout management via unified API.',
    url: 'https://echo-ept.com/docs/paypal-integration',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo PayPal Integration Documentation',
    description: 'Complete PayPal business integration — payments, subscriptions, invoicing, and payout management via unified API.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/paypal-integration',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
