import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Vendor Manager — AI-Powered Vendor & Procurement Management | Echo Prime Technologies',
  description: 'Streamline vendor lifecycle management with AI-powered risk assessment, automated purchase orders, performance scoring, contract tracking, and spend analytics. From $29/mo.',
  openGraph: {
    title: 'Echo Vendor Manager — AI-Powered Vendor & Procurement Management',
    description: 'Streamline vendor lifecycle management with AI-powered risk assessment, automated purchase orders, performance scoring, contract tracking, and spend analytics.',
    url: 'https://echo-ept.com/vendor-manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Vendor Manager — AI-Powered Vendor & Procurement Management',
    description: 'Streamline vendor lifecycle management with AI-powered risk assessment, automated purchase orders, performance scoring, contract tracking, and spend analytics.',
  },
  alternates: { canonical: '/vendor-manager' },
}

export default function VendorManagerLayout({ children }: { children: React.ReactNode }) {
  return children
}
