import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Quickstart Guide | Echo Prime Technologies',
  description: 'Get started with the Echo SDK in 5 minutes. Install the package, configure your API key, and make your first engine query. TypeScript examples included.',
  keywords: ['SDK quickstart', 'getting started', 'Echo SDK setup', 'API tutorial', 'TypeScript SDK'],
  openGraph: {
    title: 'SDK Quickstart Guide — Get Started in 5 Minutes',
    description: 'Install the Echo SDK, configure your API key, and make your first engine query.',
    url: 'https://echo-ept.com/sdk/quickstart',
  },
  twitter: {
    card: 'summary',
    title: 'SDK Quickstart — Echo Prime Technologies',
    description: 'Get started with the Echo SDK in 5 minutes. TypeScript examples included.',
  },
  alternates: { canonical: '/sdk/quickstart' },
};

export default function SDKQuickstartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
