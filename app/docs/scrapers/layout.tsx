import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Scraper Orchestrator Documentation | Echo Prime Technologies',
  description: 'Intelligent web scraping fleet with anti-detection, rate limiting, and structured data extraction. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['scrapers', 'echo prime', 'documentation', 'api', 'guide', 'scrapers'],
  openGraph: {
    title: 'Echo Scraper Orchestrator Docs — Echo Prime Technologies',
    description: 'Intelligent web scraping fleet with anti-detection, rate limiting, and structured data extraction.',
    url: 'https://echo-ept.com/docs/scrapers',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Scraper Orchestrator Documentation',
    description: 'Intelligent web scraping fleet with anti-detection, rate limiting, and structured data extraction.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/scrapers',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
