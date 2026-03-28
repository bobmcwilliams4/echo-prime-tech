import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Appointments Documentation | Echo Prime Technologies',
  description: 'Online booking, automated reminders, no-show prediction, and provider scheduling — the AI-powered appointment system that fills your calendar. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['appointments', 'echo prime', 'documentation', 'api', 'guide', 'appointments'],
  openGraph: {
    title: 'Echo Appointments Docs — Echo Prime Technologies',
    description: 'Online booking, automated reminders, no-show prediction, and provider scheduling — the AI-powered appointment system that fills your calendar.',
    url: 'https://echo-ept.com/docs/appointments',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Appointments Documentation',
    description: 'Online booking, automated reminders, no-show prediction, and provider scheduling — the AI-powered appointment system that fills your calendar.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/appointments',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
