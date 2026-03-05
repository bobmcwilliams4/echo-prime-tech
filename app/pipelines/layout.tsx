import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autonomous Data Pipelines — Extract, Transform, Deliver | Echo Prime Technologies',
  description: 'AI-powered data extraction systems that find, scrape, normalize, and deliver structured data from 50+ source types. County records, APIs, PDFs, web pages — all running 24/7. From $199/mo.',
  keywords: ['data pipelines', 'data extraction', 'web scraping', 'ETL automation', 'county records', 'autonomous data', 'AI data processing', 'Echo Prime'],
  openGraph: {
    title: 'Autonomous Data Pipelines — Extract, Transform, Deliver',
    description: 'AI data extraction from 50+ source types running 24/7. County records, APIs, PDFs, web pages. From $199/mo.',
    url: 'https://echo-ept.com/pipelines',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/pipelines' },
};

export default function PipelinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
