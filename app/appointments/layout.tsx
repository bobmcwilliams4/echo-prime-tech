import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Appointment Scheduling — Echo Prime Technologies',
  description: 'AI-powered scheduling for service businesses. Online booking, provider management, automated reminders, no-show prediction, utilization analytics. Starts at $19/month.',
  keywords: ['appointment scheduling', 'online booking', 'AI scheduling', 'Calendly alternative', 'booking software', 'service business scheduling'],
  openGraph: {
    title: 'AI Appointment Scheduling — Echo Prime Technologies',
    description: 'AI-powered scheduling for service businesses. Online booking, provider management, automated reminders, no-show prediction, utilization analytics.',
    url: 'https://echo-ept.com/appointments',
  },
  twitter: {
    card: 'summary',
    title: 'AI Appointment Scheduling — Echo Prime Technologies',
    description: 'Online booking, provider management, automated reminders, and AI no-show prediction. Starts at $19/mo.',
  },
  alternates: { canonical: '/appointments' },
};

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
