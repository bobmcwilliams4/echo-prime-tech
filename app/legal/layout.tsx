import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal — Privacy & Terms | Echo Prime Technologies',
  description: 'Echo Prime Technologies legal documents including privacy policy, terms of service, and acceptable use policy.',
  openGraph: {
    title: 'Legal — Echo Prime Technologies',
    url: 'https://echo-ept.com/legal',
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
