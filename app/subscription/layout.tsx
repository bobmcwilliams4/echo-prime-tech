import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Subscription — AI-Powered Subscription Billing for SaaS',
  description: 'Manage subscription plans, billing cycles, usage metering, and revenue analytics. AI churn prediction and revenue forecasting. Stripe Billing / Chargebee alternative starting at $29/mo.',
  openGraph: {
    title: 'Echo Subscription — AI Billing & Revenue Platform',
    description: 'Subscription billing with plans, usage metering, proration, dunning, and AI revenue insights.',
    url: 'https://echo-ept.com/subscription',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Subscription — AI Billing & Revenue Platform',
    description: 'Subscription billing with plans, usage metering, proration, dunning, and AI revenue insights.',
  },
  alternates: { canonical: '/subscription' },
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
