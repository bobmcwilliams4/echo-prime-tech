import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo News Scraper Documentation | Echo Prime Technologies',
  description: 'Automated news and content scraping across RSS feeds, web sources, and social platforms — continuously feeding articles, summaries, and metadata into Knowledge Forge for indexing and discovery. — Complete user guide, API reference, and getting started tutorials.',
  keywords: ['news-scraper', 'echo prime', 'documentation', 'api', 'guide', 'news, scraper'],
  openGraph: {
    title: 'Echo News Scraper Docs — Echo Prime Technologies',
    description: 'Automated news and content scraping across RSS feeds, web sources, and social platforms — continuously feeding articles, summaries, and metadata into Knowledge Forge for indexing and discovery.',
    url: 'https://echo-ept.com/docs/news-scraper',
    siteName: 'Echo Prime Technologies',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Echo News Scraper Documentation',
    description: 'Automated news and content scraping across RSS feeds, web sources, and social platforms — continuously feeding articles, summaries, and metadata into Knowledge Forge for indexing and discovery.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/docs/news-scraper',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
