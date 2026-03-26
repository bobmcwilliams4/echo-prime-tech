import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A/B Testing Engine Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for the Echo A/B Testing Engine — multi-variant experiments, statistical significance, conversion tracking, and automated winner selection for websites and apps.',
  openGraph: {
    title: 'A/B Testing Engine Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for the Echo A/B Testing Engine — multi-variant experiments, statistical significance, conversion tracking, and automated winner selection.',
    url: 'https://echo-ept.com/docs/ab-testing',
  },
}

export default function AbTestingDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
