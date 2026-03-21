import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Web Scrapers — Government, Social, Market Data | Echo Prime Technologies',
  description: '23 scraper templates across 4 categories. Government records, social media, market data extraction. Starting at $399.',
  openGraph: { title: 'Custom Web Scrapers — 23 Templates', description: '23 scraper templates. Government, social media, market data. Starting at $399.', url: 'https://echo-ept.com/scrapers' },
  twitter: { card: 'summary_large_image', title: 'Custom Web Scrapers — 23 Templates', description: 'Government, social media, market data scraping. Starting at $399.' },
  alternates: { canonical: '/scrapers' },
};

export default function ScrapersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
