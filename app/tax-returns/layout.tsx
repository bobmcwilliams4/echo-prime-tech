import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tax Return Preparation — 14 Tax Engines | Echo Prime Technologies',
  description: 'AI-powered tax preparation with 14 specialized tax engines. 1040 calculation, MACRS depreciation, deduction optimization, IRC compliance. Catches deductions human CPAs miss.',
  keywords: ['AI tax preparation', 'tax return AI', 'MACRS depreciation', '1040 AI', 'tax optimization AI', 'deduction finder'],
  openGraph: {
    title: 'AI Tax Preparation — 14 Specialized Tax Engines',
    description: 'AI tax preparation that catches deductions CPAs miss. 14 specialized engines. IRC-compliant.',
    url: 'https://echo-ept.com/tax-returns',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tax Preparation — 14 Specialized Tax Engines',
    description: 'AI tax preparation that catches deductions CPAs miss. IRC-compliant. MACRS depreciation.',
  },
  alternates: { canonical: '/tax-returns' },
};

export default function TaxReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
