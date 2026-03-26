import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tax Returns Documentation — User Manual & AI Guide | Echo Prime Tech',
  description: 'Complete documentation for Echo Tax Returns — AI-powered tax preparation and filing with IRC cross-referencing, deduction optimization, entity structuring analysis, and multi-year planning.',
  openGraph: {
    title: 'Tax Returns Documentation — User Manual & AI Guide | Echo Prime Tech',
    description: 'Complete documentation for Echo Tax Returns — AI tax preparation with IRC cross-referencing, deduction optimization, and multi-year planning.',
    url: 'https://echo-ept.com/docs/tax-returns',
  },
}

export default function TaxReturnsDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
