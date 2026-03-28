import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Calendar Documentation | Echo Prime Technologies',
  description: 'Smart scheduling automation — public booking pages, intelligent availability, ICS export, team calendars, and AI scheduling suggestions. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['calendar', 'echo prime', 'documentation', 'api', 'guide', 'calendar'],
  openGraph: {
    title: 'Echo Calendar Docs — Echo Prime Technologies',
    description: 'Smart scheduling automation — public booking pages, intelligent availability, ICS export, team calendars, and AI scheduling suggestions.',
    url: 'https://echo-ept.com/docs/calendar',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Calendar Documentation',
    description: 'Smart scheduling automation — public booking pages, intelligent availability, ICS export, team calendars, and AI scheduling suggestions.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/calendar',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
