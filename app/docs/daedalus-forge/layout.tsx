import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daedalus Forge Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for Daedalus Forge — manufacturing AI assistant for process optimization, quality control, predictive maintenance, supply chain intelligence, and production scheduling.',
  openGraph: {
    title: 'Daedalus Forge Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for Daedalus Forge — manufacturing AI for process optimization, quality control, predictive maintenance, and production scheduling.',
    url: 'https://echo-ept.com/docs/daedalus-forge',
  },
}

export default function DaedalusForgeDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
