import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal — Privacy & Terms | Echo Prime Technologies',
  description: 'Echo Prime Technologies legal documents including privacy policy, terms of service, and acceptable use policy.',
  openGraph: {
    title: 'Legal — Echo Prime Technologies',
    description: 'Echo Prime Technologies legal documents including privacy policy, terms of service, and acceptable use policy.',
    url: 'https://echo-ept.com/legal',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal — Echo Prime Technologies',
    description: 'Echo Prime Technologies legal documents including privacy policy, terms of service, and acceptable use policy.',
  },
  alternates: { canonical: '/legal' },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
