import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Tracking — Echo Prime Technologies',
  description: 'Log and approve employee work hours with regular and overtime tracking. Filter by employee and date range with summary totals and approval workflows.',
  openGraph: {
    title: 'Time Tracking — Echo Prime Technologies',
    description: 'Employee time tracking with regular hours, overtime, and approval workflows.',
    url: 'https://echo-ept.com/dashboard/business/hours',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
