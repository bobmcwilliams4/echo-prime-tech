import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Price Alerts | Crypto & Stock Monitoring | Echo Prime Technologies',
  description: 'Real-time AI price alerts for crypto and stocks. Custom thresholds, trend detection, volatility warnings, and multi-channel notifications via email, SMS, and Telegram.',
  openGraph: {
    title: 'AI Price Alerts | Echo Prime Technologies',
    description: 'Real-time AI price alerts for crypto and stocks with custom thresholds and multi-channel notifications.',
    url: 'https://echo-ept.com/price-alerts',
  },
};

export default function PriceAlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
