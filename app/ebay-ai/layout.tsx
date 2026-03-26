import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo eBay AI — Automated Listing, Pricing & Seller Intelligence | Echo Prime Tech',
  description: 'AI-powered eBay selling with automated listings, dynamic repricing, competitor analysis, inventory sync, and sales analytics. Sell smarter on eBay.',
  keywords: ['eBay automation', 'eBay AI', 'eBay seller tools', 'dynamic repricing', 'eBay listing tool', 'eBay analytics'],
  openGraph: { title: 'Echo eBay AI — Automated Seller Intelligence', description: 'AI-powered eBay selling with automated listings, dynamic repricing, and competitor analysis.', url: 'https://echo-ept.com/ebay-ai' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
