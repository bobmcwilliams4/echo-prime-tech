import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Calendar — AI-Powered Scheduling & Booking | Echo Prime Technologies',
  description: 'Smart scheduling with public booking pages, availability management, buffer times, team calendars, ICS export, and AI scheduling suggestions. Cal.com alternative starting at $9/mo.',
  openGraph: {
    title: 'Echo Calendar — AI-Powered Scheduling & Booking',
    description: 'Public booking pages, smart slot calculation, team calendars, and automated reminders.',
    url: 'https://echo-ept.com/calendar',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Calendar — AI-Powered Scheduling & Booking',
    description: 'Public booking pages, smart availability, AI scheduling suggestions, and automated reminders. Starts at $9/mo.',
  },
  alternates: { canonical: '/calendar' },
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
