import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo QR Menu — Digital Restaurant Menus & Table Ordering | Echo Prime Technology',
  description: 'Create beautiful QR code menus for your restaurant. Customers scan, browse, and order from their phone. Branded mobile-first menus, table ordering, scan analytics, multi-language support. Starting at $19/mo.',
  openGraph: {
    title: 'Echo QR Menu — Digital Restaurant Menus & Table Ordering',
    description: 'QR code menus for restaurants. Customers scan and order from their phone. Branded menus, table ordering, analytics.',
    url: 'https://echo-ept.com/qr-menu',
  },
  twitter: {
    card: 'summary',
    title: 'Echo QR Menu — Digital Restaurant Menus & Table Ordering',
    description: 'QR code menus for restaurants. Customers scan and order from their phone. Branded menus, table ordering, analytics.',
  },
  alternates: { canonical: '/qr-menu' },
};

export default function QrMenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
