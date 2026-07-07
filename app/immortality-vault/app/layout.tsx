import type { Metadata } from 'next';
import InstallPrompt from './components/InstallPrompt';

export const metadata: Metadata = {
  title: 'Immortality Vault',
  description: 'Preserve the voice, memories, personality, and wisdom of the ones you love — guided gently, in conversation — so your family can talk with them for generations.',
  manifest: '/immortality-vault/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Immortality Vault',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/immortality-vault/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Immortality Vault',
    description: 'Preserve their voice, memories, and presence — then talk with them anytime.',
    url: 'https://immortalityvault.app/immortality-vault/app',
    siteName: 'Immortality Vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immortality Vault',
    description: 'Preserve their voice, memories, and presence — then talk with them anytime.',
  },
  alternates: { canonical: 'https://immortalityvault.app/immortality-vault/app' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}
