import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Web Scrapers — Data Extraction at Scale | Echo Prime Technologies',
  description: '23 scraper templates across 4 categories. Web, government, social media, and bulk data harvesting with rate limiting and proxy rotation. $399-$1,299.',
  keywords: ['web scraper', 'data extraction', 'web crawler', 'government scraper', 'social media scraper', 'data harvesting'],
  openGraph: {
    title: 'Custom Web Scrapers — Data Extraction at Scale',
    description: '23 scraper templates. Web, government, social media data extraction with rate limiting. $399-$1,299.',
    url: 'https://echo-ept.com/scrapers',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/scrapers' },
};

export default function ScrapersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
