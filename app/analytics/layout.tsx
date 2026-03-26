import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Analytics — AI-Powered Business Intelligence Dashboard | Echo Prime Technologies',
  description: 'Real-time business analytics with AI insights, custom dashboards, event tracking, funnel analysis, and automated reports. Built on Cloudflare Workers. Starts at $19/mo.',
  keywords: ['analytics', 'business intelligence', 'AI analytics', 'dashboard', 'event tracking', 'funnel analysis'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
