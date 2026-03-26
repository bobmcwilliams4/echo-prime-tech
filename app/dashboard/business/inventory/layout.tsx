import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Management — Echo Prime Technologies',
  description: 'Track inventory across hardware, software, networking, peripherals, and office supplies. Monitor stock levels, reorder points, unit costs, and vendor information with restock capabilities.',
  openGraph: {
    title: 'Inventory Management — Echo Prime Technologies',
    description: 'Inventory tracking with stock levels, reorder alerts, and vendor management.',
    url: 'https://echo-ept.com/dashboard/business/inventory',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
