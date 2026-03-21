import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShadowGlass Scanner — Privacy-First Browser AI | Echo Prime Technologies',
  description: 'AI-powered browser with 120+ anti-detection measures, Tor routing, built-in scraping, and Claude AI terminal.',
  openGraph: { title: 'ShadowGlass Scanner — Privacy-First Browser AI', description: '120+ anti-detection measures, Tor routing, AI scraping, Claude terminal.', url: 'https://echo-ept.com/scanner' },
  twitter: { card: 'summary_large_image', title: 'ShadowGlass Scanner', description: 'Privacy-first browser AI. 120+ anti-detection. Tor. Built-in scraping.' },
  alternates: { canonical: '/scanner' },
};

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
