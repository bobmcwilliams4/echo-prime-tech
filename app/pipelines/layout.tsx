import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Pipelines — Autonomous ETL & Real-Time Processing | Echo Prime Technologies',
  description: 'Autonomous data extraction, transformation, and delivery from 50+ source types. Real-time processing, enrichment, and structured output. $199-$499/mo.',
  keywords: ['data pipeline', 'ETL', 'data processing', 'data extraction', 'real-time data', 'data automation'],
  openGraph: {
    title: 'Data Pipelines — Autonomous ETL & Real-Time Processing',
    description: 'Autonomous data extraction from 50+ source types. Real-time processing and structured output. $199-$499/mo.',
    url: 'https://echo-ept.com/pipelines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/pipelines' },
};

export default function PipelinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
