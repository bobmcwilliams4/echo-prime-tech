import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge Marketplace — AI Engine Template Store | Echo Prime Technologies',
  description: 'Browse and deploy AI engine templates with 632K+ doctrines. One-click deploy, doctrine packs, quality tiers, seller dashboard, and bundle deals.',
  keywords: ['AI marketplace', 'engine templates', 'AI engine store', 'doctrine packs', 'AI templates marketplace', 'knowledge engine'],
  openGraph: {
    title: 'Forge Marketplace — AI Engine Template Store',
    description: 'Browse and deploy AI engine templates with 632K+ doctrines. One-click deploy and bundle deals.',
    url: 'https://echo-ept.com/forge-marketplace',
  },
  twitter: {
    card: 'summary',
    title: 'Forge Marketplace — AI Engine Store',
    description: 'AI engine templates with 632K+ doctrines. One-click deploy, quality tiers, seller dashboard.',
  },
  alternates: { canonical: '/forge-marketplace' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
