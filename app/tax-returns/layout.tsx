import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tax Return Preparation — 14 Tax Intelligence Engines | Echo Prime Technologies',
  description: 'Professional income tax preparation powered by 14 AI Tax Intelligence Engines. IRS 1040, MACRS depreciation, QBI deduction, oil & gas IDC, document OCR, and PTIN-certified preparer review. From $150.',
  keywords: ['AI tax preparation', 'tax returns', 'IRS 1040', 'tax intelligence', 'oil and gas taxes', 'MACRS depreciation', 'QBI deduction', 'Echo Prime'],
  openGraph: {
    title: 'AI Tax Return Preparation — 14 Tax Intelligence Engines',
    description: 'Professional tax prep powered by 14 AI Tax Intelligence Engines. Simple W-2 to complex oil & gas taxation. From $150.',
    url: 'https://echo-ept.com/tax-returns',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/tax-returns' },
};

export default function TaxReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
