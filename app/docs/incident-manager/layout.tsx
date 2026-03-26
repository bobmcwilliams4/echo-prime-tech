import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Incident Manager Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Incident Manager — incident timeline tracking, automated escalation, on-call scheduling, post-mortem generation, and SLA monitoring.',
  openGraph: {
    title: 'Incident Manager Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Incident Manager — incident tracking, escalation automation, post-mortems, and SLA monitoring.',
    url: 'https://echo-ept.com/docs/incident-manager',
  },
}

export default function IncidentManagerDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
