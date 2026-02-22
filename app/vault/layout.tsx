import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commander Vault | Echo Prime Technologies',
  description: 'Secure credential management vault with AES-256-GCM encryption, Argon2id key derivation, and comprehensive audit logging.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Commander Vault — Echo Prime Technologies',
    url: 'https://echo-ept.com/vault',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/vault' },
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
