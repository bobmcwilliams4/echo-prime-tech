import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Analytics — AI-Powered Business Intelligence Dashboard | Echo Prime Technologies',
  description: 'Real-time business analytics with AI insights, custom dashboards, event tracking, funnel analysis, and automated reports. Built on Cloudflare Workers. Starts at $19/mo.',
  keywords: ['analytics', 'business intelligence', 'AI analytics', 'dashboard', 'event tracking', 'funnel analysis'],
  openGraph: {
    title: 'Echo Analytics — AI-Powered Business Intelligence Dashboard',
    description: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection. One platform for infrastructure, product, and business metrics.',
    url: 'https://echo-ept.com/analytics',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Analytics — AI-Powered Business Intelligence',
    description: 'Real-time dashboards, fleet monitoring, revenue analytics, and AI anomaly detection. Starts at $19/mo.',
  },
  alternates: { canonical: '/analytics' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
