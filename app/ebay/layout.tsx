import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eBay Seller Tools | AI Listing Optimization & Analytics | Echo Prime Technologies',
  description: 'AI-powered eBay selling tools. Automated listing optimization, competitive pricing analysis, inventory management, and sales analytics.',
  openGraph: {
    title: 'eBay Seller Tools | Echo Prime Technologies',
    description: 'AI-powered eBay listing optimization, pricing analysis, and inventory management.',
  },
};

export default function EbayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
