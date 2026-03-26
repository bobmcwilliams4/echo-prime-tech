import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immortality Vault App — Echo Prime Technologies',
  description: 'Preserve your memories, voice, and wisdom for future generations with the Immortality Vault. Record life interviews across 12 categories, clone your voice with AI, and create a living digital legacy.',
  openGraph: {
    title: 'Immortality Vault App — Echo Prime Technologies',
    description: 'Preserve your memories, clone your voice, and build a digital legacy for future generations.',
    url: 'https://echo-ept.com/immortality-vault/app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immortality Vault App — Echo Prime Technologies',
    description: 'Preserve your memories, clone your voice, and build a digital legacy for future generations.',
  },
  alternates: { canonical: '/immortality-vault/app' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
