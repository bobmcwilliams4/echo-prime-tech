import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Analytics — Echo Prime Technologies',
  description: 'AI-powered business analytics with revenue tracking, expense breakdowns, and trend analysis. Get real-time KPIs and actionable insights to drive smarter decisions.',
  openGraph: {
    title: 'Business Analytics — Echo Prime Technologies',
    description: 'Real-time revenue tracking, expense analytics, and trend insights for your business.',
    url: 'https://echo-ept.com/office-ai/analytics',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
