import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Playground — Live API Testing | Echo Prime Technologies',
  description: 'Test Echo SDK endpoints live in your browser. Send requests, see responses, and explore 64+ API endpoints interactively. No setup required.',
  keywords: ['API playground', 'SDK testing', 'live API', 'Echo SDK playground', 'API explorer'],
  openGraph: {
    title: 'SDK Playground — Live API Testing',
    description: 'Test Echo SDK endpoints live in your browser. No setup required.',
    url: 'https://echo-ept.com/sdk/playground',
  },
  twitter: {
    card: 'summary',
    title: 'SDK Playground — Echo Prime Technologies',
    description: 'Test Echo SDK endpoints live in your browser. No setup required.',
  },
  alternates: { canonical: '/sdk/playground' },
};

export default function SDKPlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
