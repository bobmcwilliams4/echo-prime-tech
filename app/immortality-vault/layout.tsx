import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immortality Vault | Preserve Your Legacy Forever — Echo Prime Technologies',
  description: 'Your loved ones never truly leave. Capture their voice, memories, personality, and wisdom — then talk to them anytime. Digital consciousness preservation by Echo Prime Technologies.',
  keywords: ['immortality vault', 'digital legacy', 'voice cloning', 'consciousness preservation', 'memory capture', 'AI voice', 'digital twin', 'family history'],
  openGraph: {
    title: 'Immortality Vault — Preserve Your Legacy Forever',
    description: 'Capture voice, memories, personality, and wisdom. Then talk to your loved ones anytime.',
    type: 'website',
    url: 'https://echo-ept.com/immortality-vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immortality Vault — Preserve Your Legacy Forever',
    description: 'Capture voice, memories, personality, and wisdom. Then talk to your loved ones anytime.',
  },
  alternates: { canonical: '/immortality-vault' },
};

export default function IVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
