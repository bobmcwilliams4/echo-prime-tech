import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Management — Echo Prime Technologies',
  description: 'Schedule, manage, and track service appointments with full lifecycle workflows. Create bookings, confirm jobs, and track completion status in one place.',
  openGraph: {
    title: 'Booking Management — Echo Prime Technologies',
    description: 'Full appointment scheduling and service booking management with status tracking.',
    url: 'https://echo-ept.com/office-ai/bookings',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
