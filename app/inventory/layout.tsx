import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Inventory — AI Inventory Management | Echo Prime',
  description: 'AI-powered inventory management with multi-warehouse tracking, purchase orders, demand forecasting, barcode scanning, and low-stock alerts. Replace Fishbowl and inFlow at 1/5th the cost.',
  openGraph: {
    title: 'Echo Inventory — AI Inventory Management',
    description: 'Multi-warehouse stock tracking, AI demand forecasting, purchase orders, barcode/SKU management.',
    url: 'https://echo-ept.com/inventory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Inventory — AI Inventory Management',
    description: 'Multi-warehouse stock tracking, AI demand forecasting, purchase orders, barcode/SKU management.',
  },
  alternates: { canonical: '/inventory' },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
