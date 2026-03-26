import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Revenue Engine — AI Revenue Optimization | Echo Prime Tech',
  description: 'AI-powered revenue optimization with dynamic pricing, churn prediction, upsell automation, and LTV forecasting. Maximize revenue per customer with machine learning.',
  keywords: ['revenue optimization', 'dynamic pricing', 'churn prediction', 'upsell automation', 'ltv forecasting', 'ai revenue', 'echo prime'],
  openGraph: {
    title: 'Echo Revenue Engine — AI Revenue Optimization',
    description: 'Dynamic pricing, churn prediction, upsell automation, and LTV forecasting powered by AI.',
    url: 'https://echo-ept.com/revenue-engine',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Revenue Engine — AI Revenue Optimization',
    description: 'Maximize revenue with AI-powered pricing, churn prediction, and upsell automation.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/revenue-engine',
  },
}

export default function RevenueEngineLayout({ children }: { children: React.ReactNode }) {
  return children
}
