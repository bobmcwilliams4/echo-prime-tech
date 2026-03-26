import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Link Shortener — URL Shortening with Click Analytics | Echo Prime Technology',
  description: 'Shorten URLs with custom slugs, track clicks by geo/device/referrer, generate QR codes, and set link expiration. Bitly alternative starting at $9/month.',
  keywords: ['URL shortener', 'link shortener', 'click analytics', 'Bitly alternative', 'Short.io alternative', 'QR code generator'],
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Link Shortener — URL Shortening with Click Analytics | Echo Prime Technology',
    description: 'Shorten URLs with custom slugs, track clicks by geo/device/referrer, generate QR codes, and set link expiration. Bitly alternative starting at $9/month.',
  },
  alternates: { canonical: '/link-shortener' },
};

export default function LinkShortenerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
