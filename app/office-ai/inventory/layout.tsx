import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Management — Echo Prime Technologies',
  description: 'Track supplies, equipment, and materials with real-time stock levels and reorder alerts. Manage vendors, unit costs, and restock operations across all categories.',
  openGraph: {
    title: 'Inventory Management — Echo Prime Technologies',
    description: 'Real-time inventory tracking with reorder alerts, vendor management, and stock levels.',
    url: 'https://echo-ept.com/office-ai/inventory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inventory Management — Echo Prime Technologies',
    description: 'Real-time inventory tracking with reorder alerts, vendor management, and stock levels.',
  },
  alternates: { canonical: '/office-ai/inventory' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
