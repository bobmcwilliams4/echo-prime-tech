import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Booking Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Booking — AI-powered appointment scheduling with calendars, booking pages, reminders, payments, and resource management. API reference, user guides, and troubleshooting.',
  openGraph: {
    title: 'Echo Booking Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Booking — AI-powered appointment scheduling with calendars, booking pages, reminders, payments, and resource management.',
    url: 'https://echo-ept.com/docs/booking',
  },
}

export default function BookingDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
