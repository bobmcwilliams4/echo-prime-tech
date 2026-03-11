import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tax Return Preparation | Echo Prime Technologies',
  description: 'Professional tax preparation powered by 14 Tax Intelligence Engines. 1040 calculation, MACRS depreciation, QBI deduction, oil & gas IDC, partnership K-1 analysis. $150-$750.',
  keywords: ['AI tax preparation', 'tax return AI', 'MACRS depreciation', 'oil and gas taxes', 'QBI deduction', 'K-1 analysis', 'tax AI'],
  openGraph: {
    title: 'AI Tax Return Preparation',
    description: 'Professional tax prep with 14 Tax Intelligence Engines. 1040, MACRS, QBI, oil & gas IDC. $150-$750.',
    url: 'https://echo-ept.com/tax-returns',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/tax-returns' },
};

export default function TaxReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
