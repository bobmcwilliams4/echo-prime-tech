import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appointment Manager — Echo Prime Technologies',
  description: 'Manage sales appointments booked by AI Closer with calendar views, status tracking, and lead details. Schedule, confirm, reschedule, or cancel appointments with full CRM integration.',
  openGraph: {
    title: 'Appointment Manager — Echo Prime Technologies',
    description: 'Manage AI-booked sales appointments with calendar views, status tracking, and CRM integration.',
    url: 'https://echo-ept.com/closer/appointments',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
