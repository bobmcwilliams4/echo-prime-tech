import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Finance AI Documentation — Intelligent Financial Management',
  description: 'AI-powered bookkeeping, cash flow forecasting, tax compliance monitoring, and financial reporting. 95%+ transaction categorization accuracy with IRC-backed tax optimization.',
  keywords: ['finance AI', 'AI bookkeeping', 'cash flow forecasting', 'tax compliance', 'financial automation', 'accounting AI', 'business finance'],
  openGraph: {
    title: 'Echo Finance AI Documentation',
    description: 'AI-powered financial management: bookkeeping, forecasting, tax compliance, and reporting with Intelligence Engine backing.',
    url: 'https://echo-ept.com/docs/finance-ai',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Finance AI — Intelligent Financial Management',
    description: 'AI bookkeeping, cash flow forecasting, tax compliance monitoring, and financial reporting.',
  },
  alternates: { canonical: '/docs/finance-ai' },
};

export default function FinanceAiDocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
