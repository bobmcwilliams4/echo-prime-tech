import type { Metadata } from 'next';

// The McWilliams Family Archive is private command-center content — it lives at
// echo-op.com (Commander's command center), NOT echo-ept.com (the public storefront).
// This layout overrides the root metadataBase (https://echo-ept.com) so every
// canonical / OpenGraph / Twitter URL for this page resolves to the true path.
export const metadata: Metadata = {
  title: 'The McWilliams Bloodline Archive — ECHO OMEGA PRIME',
  description: 'Seven confirmed generations tracing the Parker, Custer, Castleberry, Sellers, Wall, and Hollmig bloodlines across the Texas frontier — Commander Bobby Don McWilliams II genealogy registry.',
  keywords: ['McWilliams family', 'genealogy', 'Parker bloodline', 'Custer bloodline', 'Castleberry', 'Sellers', 'family archive', 'ECHO OMEGA PRIME'],
  metadataBase: new URL('https://echo-op.com'),
  alternates: {
    canonical: 'https://echo-op.com/family-tree',
  },
  openGraph: {
    title: 'The McWilliams Bloodline Archive',
    description: 'Seven confirmed generations across the Texas frontier — Parker · Custer · Castleberry · Sellers · Wall · Hollmig.',
    url: 'https://echo-op.com/family-tree',
    siteName: 'ECHO OMEGA PRIME',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The McWilliams Bloodline Archive',
    description: 'Seven confirmed generations across the Texas frontier — Parker · Custer · Castleberry · Sellers · Wall · Hollmig.',
  },
  other: { 'site-id': 'echo-op.com' },
  robots: { index: false, follow: false },
};

export default function FamilyTreeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
