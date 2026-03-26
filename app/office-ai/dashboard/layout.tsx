import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Dashboard — Echo Prime Technologies',
  description: 'Central business operations dashboard with real-time KPIs, revenue summaries, recent bookings, and quick-access links to all Office AI modules.',
  openGraph: {
    title: 'Business Dashboard — Echo Prime Technologies',
    description: 'Real-time business KPIs, revenue summaries, and operational overview in one dashboard.',
    url: 'https://echo-ept.com/office-ai/dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Dashboard — Echo Prime Technologies',
    description: 'Real-time business KPIs, revenue summaries, and operational overview in one dashboard.',
  },
  alternates: { canonical: '/office-ai/dashboard' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
