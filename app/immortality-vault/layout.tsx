import type { Metadata } from 'next';
import IntroSplash from './IntroSplash';

export const metadata: Metadata = {
  title: 'Immortality Vault — Preserve Your Legacy Forever',
  description: 'Your loved ones never truly leave. Capture their voice, memories, personality, and wisdom — then talk with them anytime. The Immortality Vault preserves a whole person, forever.',
  keywords: ['immortality vault', 'digital legacy', 'voice cloning', 'consciousness preservation', 'memory capture', 'AI voice', 'digital twin', 'family history', 'legacy preservation'],
  metadataBase: new URL('https://immortalityvault.app'),
  openGraph: {
    title: 'Immortality Vault — Preserve Your Legacy Forever',
    description: 'Capture voice, memories, personality, and wisdom. Then talk with your loved ones anytime.',
    type: 'website',
    url: 'https://immortalityvault.app',
    siteName: 'Immortality Vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immortality Vault — Preserve Your Legacy Forever',
    description: 'Capture voice, memories, personality, and wisdom. Then talk with your loved ones anytime.',
  },
  // Apex is host-rewritten to this landing on immortalityvault.app (see
  // scripts/prepare-host-roots.mjs + vercel.json rewrites). Canonical is the brand domain root.
  alternates: { canonical: 'https://immortalityvault.app/' },
};

export default function IVLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroSplash />
      {children}
    </>
  );
}
