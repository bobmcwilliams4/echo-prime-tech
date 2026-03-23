import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer SDK — Build with 5,486+ AI Engines | Echo Prime Technologies',
  description: 'Integrate AI intelligence engines into your applications via REST API. TypeScript/Python SDKs, interactive playground, comprehensive docs. Free tier available.',
  openGraph: { title: 'Developer SDK — Build with 5,486+ AI Engines', description: 'Integrate AI engines via REST API. TypeScript/Python SDKs. Free tier.', url: 'https://echo-ept.com/sdk' },
  twitter: { card: 'summary_large_image', title: 'Echo Prime Developer SDK', description: 'Build with 5,486+ AI engines. TypeScript/Python SDKs, REST API, playground.' },
  alternates: { canonical: '/sdk' },
};

export default function SDKLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
