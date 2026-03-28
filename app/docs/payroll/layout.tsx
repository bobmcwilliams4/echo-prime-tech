import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Payroll Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Payroll — AI-powered payroll processing with federal and state tax calculations across all 50 states, pay run lifecycle, YTD tracking, benefits administration, and tax filing support for 941/W-2/1099.',
  openGraph: {
    title: 'Echo Payroll Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Payroll — AI-powered payroll processing with federal and state tax calculations across all 50 states, pay run lifecycle, YTD tracking, benefits administration, and tax filing support.',
    url: 'https://echo-ept.com/docs/payroll',
  },
}

export default function PayrollDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
