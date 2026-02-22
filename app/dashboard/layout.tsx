import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Control Center | Echo Prime Technologies',
  description: 'Your Echo Prime control center. Monitor engine activity, manage subscriptions, view analytics, and access all intelligence services from a unified dashboard.',
  openGraph: {
    title: 'Dashboard — Control Center',
    description: 'Monitor engine activity, manage subscriptions, and access all Echo Prime intelligence services.',
    url: 'https://echo-ept.com/dashboard',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
