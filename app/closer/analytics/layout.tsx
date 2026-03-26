import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Analytics Dashboard — Echo Prime Technologies',
  description: 'Track AI Closer performance with real-time analytics including call volume, connection rates, appointment conversions, and per-call cost breakdowns. Visualize hourly trends and disposition distributions.',
  openGraph: {
    title: 'Sales Analytics Dashboard — Echo Prime Technologies',
    description: 'Real-time AI sales analytics with call metrics, cost breakdowns, and conversion tracking.',
    url: 'https://echo-ept.com/closer/analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Analytics Dashboard — Echo Prime Technologies',
    description: 'Real-time AI sales analytics with call metrics, cost breakdowns, and conversion tracking.',
  },
  alternates: { canonical: '/closer/analytics' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
