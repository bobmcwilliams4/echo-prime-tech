import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Booking — AI-Powered Appointment Scheduling | Echo Prime',
  description: 'AI-powered appointment scheduling with smart availability, no-show prediction, waitlists, recurring bookings, and staff management. Replace Calendly and Acuity at a fraction of the cost.',
  openGraph: {
    title: 'Echo Booking — AI-Powered Appointment Scheduling',
    description: 'Smart scheduling with real-time availability, AI no-show prediction, waitlists, recurring appointments, and multi-location support.',
    url: 'https://echo-ept.com/booking',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Booking — AI-Powered Appointment Scheduling',
    description: 'Let clients book 24/7, sync calendars, collect payments upfront, and eliminate no-shows with automated reminders.',
  },
  alternates: { canonical: '/booking' },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
