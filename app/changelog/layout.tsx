import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Latest Updates & Releases | Echo Prime Technologies',
  description: 'See what we shipped. Weekly releases, new engine deployments, platform upgrades, and feature launches at Echo Prime Technologies.',
  openGraph: { title: 'Changelog — Echo Prime Technologies', description: 'Weekly releases and platform updates from Echo Prime Technologies.', url: 'https://echo-ept.com/changelog' },
  twitter: { card: 'summary', title: 'Changelog — Echo Prime Technologies', description: 'Weekly releases and platform updates.' },
  alternates: { canonical: '/changelog' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
