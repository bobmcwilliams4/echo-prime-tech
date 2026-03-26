import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'County Records Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo County Records — automated county deed and property record search via ShadowGlass scraping engine, covering 80+ Texas counties.',
  openGraph: {
    title: 'County Records Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo County Records — automated deed and property record search covering 80+ Texas counties.',
    url: 'https://echo-ept.com/docs/county-records',
  },
}

export default function CountyRecordsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
