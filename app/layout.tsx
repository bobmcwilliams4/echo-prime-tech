import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { ThemeProvider } from '../lib/theme-context';
import EchoPrimeChat from '../components/echo-prime-chat';
import { ParticleBackground } from '../components/ParticleBackground';

export const metadata: Metadata = {
  title: 'Echo Prime Technologies | Autonomous Intelligence Systems',
  description: 'Enterprise AI infrastructure, autonomous intelligence engines, and next-generation data systems. Built for industries that demand precision.',
  keywords: ['AI', 'autonomous systems', 'intelligence engines', 'enterprise AI', 'data infrastructure', 'Echo Prime'],
  metadataBase: new URL('https://echo-ept.com'),
  alternates: { canonical: '/' },
  icons: {
    icon: '/logo-sym-night.png',
    apple: '/logo-sym-night.png',
  },
  openGraph: {
    title: 'Echo Prime Technologies',
    description: 'Autonomous Intelligence Systems — 800+ engines across 59 verticals.',
    type: 'website',
    url: 'https://echo-ept.com',
    siteName: 'Echo Prime Technologies',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Prime Technologies',
    description: 'Autonomous Intelligence Systems — 800+ engines across 59 verticals.',
    images: ['/logo-day.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <ParticleBackground />
            {children}
            <EchoPrimeChat />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
