import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Price Alerts Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Price Alerts — cryptocurrency and stock price monitoring with custom thresholds, multi-channel notifications, portfolio tracking, and market pattern detection.',
  openGraph: {
    title: 'Price Alerts Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Price Alerts — crypto and stock price monitoring with custom thresholds and multi-channel notifications.',
    url: 'https://echo-ept.com/docs/price-alerts',
  },
}

export default function PriceAlertsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
