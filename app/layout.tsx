import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { ThemeProvider } from '../lib/theme-context';
import EchoPrimeChat from '../components/echo-prime-chat';
import { ParticleBackground } from '../components/ParticleBackground';
import ComingSoonGuard from '../components/ComingSoonGuard';
import { GuidedTutorialProvider } from '../lib/guided-tutorial-context';
import GuidedOverlay from '../components/guided-overlay';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Echo Prime Technologies | AI Intelligence Engines, Sales Agents & Enterprise AI',
  description: '6,500+ AI engines across 1,000+ domains. AI sales agents, title intelligence, data pipelines, tax preparation, cybersecurity, and autonomous systems. Production-grade AI for industries that demand precision.',
  keywords: ['AI engines', 'AI sales agent', 'title intelligence', 'data pipelines', 'enterprise AI', 'autonomous systems', 'tax AI', 'cybersecurity AI', 'Echo Prime Technologies', 'oil and gas AI'],
  metadataBase: new URL('https://echo-ept.com'),
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Echo Prime Technologies — AI Engines, Sales Agents & Enterprise Intelligence',
    description: '6,500+ AI engines, autonomous sales agents, title intelligence, data pipelines, tax prep, and cybersecurity. Production-grade AI.',
    type: 'website',
    url: 'https://echo-ept.com',
    siteName: 'Echo Prime Technologies',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Prime Technologies — AI Engines & Enterprise Intelligence',
    description: '6,500+ AI engines across 1,000+ domains. Sales agents, title intelligence, data pipelines, tax prep, and cybersecurity.',
    images: ['/logo-day.png'],
  },
  robots: { index: true, follow: true },
  other: { 'theme-color': '#0a0e17', 'site-id': 'echo-ept.com' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://echo-ept.com/#organization',
      name: 'Echo Prime Technologies',
      url: 'https://echo-ept.com',
      logo: 'https://echo-ept.com/logo-day.png',
      description: 'AI-powered title intelligence, autonomous systems, and enterprise AI infrastructure for oil & gas, legal, and engineering industries.',
      foundingDate: '2024',
      founder: { '@type': 'Person', name: 'Bobby Don McWilliams II' },
      areaServed: 'US',
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: 'https://echo-ept.com/pricing' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://echo-ept.com/#website',
      url: 'https://echo-ept.com',
      name: 'Echo Prime Technologies',
      publisher: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'ShadowGlass Title Intelligence',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered chain of title search across 80+ Texas counties with 259,000+ indexed deed records. Automated mineral rights analysis, gap detection, and fractional interest calculations.',
      url: 'https://echo-ept.com/title-intelligence',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '200',
        highPrice: '1500',
        priceCurrency: 'USD',
        offerCount: 3,
      },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Sentinel AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Multi-domain AI intelligence system with 6,500+ engines, web search, knowledge retrieval, and real-time analysis across 1,000+ domains.',
      url: 'https://echo-ept.com/sentinel',
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AI Sales Agent (Closer AI)',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Autonomous AI voice closer with real-time STT, LLM reasoning, and natural TTS. Script engine with state machine, CRM with full lead pipeline.',
      url: 'https://echo-ept.com/closer',
      offers: { '@type': 'AggregateOffer', lowPrice: '299', highPrice: '999', priceCurrency: 'USD', offerCount: 3 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Data Pipelines',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Autonomous data extraction systems that find, extract, normalize, and deliver structured data from 50+ source types running 24/7.',
      url: 'https://echo-ept.com/pipelines',
      offers: { '@type': 'AggregateOffer', lowPrice: '199', highPrice: '499', priceCurrency: 'USD', offerCount: 3 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Intelligence Engines',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Purpose-built AI reasoning systems with deep domain expertise across 1,000+ verticals. 6,500+ engines with embedded knowledge blocks.',
      url: 'https://echo-ept.com/engines',
      offers: { '@type': 'AggregateOffer', lowPrice: '199', highPrice: '499', priceCurrency: 'USD', offerCount: 3 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'Service',
      name: 'AI Tax Return Preparation',
      description: 'AI-powered professional tax preparation with 14 Tax Intelligence Engines. IRS 1040, MACRS depreciation, QBI deduction, oil & gas IDC.',
      url: 'https://echo-ept.com/tax-returns',
      offers: { '@type': 'AggregateOffer', lowPrice: '150', highPrice: '750', priceCurrency: 'USD', offerCount: 5 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'Service',
      name: 'Penetration Testing',
      description: 'Full-scope offensive security: network, web, wireless, mobile, cloud, and Active Directory penetration testing with 300+ attack tools.',
      url: 'https://echo-ept.com/pentesting',
      offers: { '@type': 'AggregateOffer', lowPrice: '2500', highPrice: '7500', priceCurrency: 'USD', offerCount: 3 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'Service',
      name: 'Cyber Defense & Security Monitoring',
      description: 'Enterprise security operations: 24/7 threat monitoring, incident response, security architecture review, compliance assessment, and vulnerability management.',
      url: 'https://echo-ept.com/security',
      offers: { '@type': 'AggregateOffer', lowPrice: '499', highPrice: '2999', priceCurrency: 'USD', offerCount: 3 },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Echo SDK Gateway',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      description: 'One API, 6,500+ intelligence engines. Query domain-specific AI reasoning, search infinite memory, and access 12,000+ knowledge documents through a single authenticated endpoint.',
      url: 'https://echo-ept.com/sdk',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '299',
        priceCurrency: 'USD',
        offerCount: 3,
      },
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AI Collectibles Grading (EPOCGS)',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered collectibles grading with 25+ LLM ensemble, 50-agent research swarm, vision analysis, Comics Price Guide integration, and voice commentary.',
      url: 'https://echo-ept.com/grading',
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Immortality Vault',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      description: 'Digital consciousness preservation platform with guided interviews, voice cloning, and AI-powered conversational recall for families.',
      url: 'https://echo-ept.com/immortality-vault',
      provider: { '@id': 'https://echo-ept.com/#organization' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="alternate" type="application/rss+xml" title="Echo Prime Technologies Changelog" href="/feed.xml" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <ParticleBackground />
            <GuidedTutorialProvider>
              <ComingSoonGuard>
                {children}
              </ComingSoonGuard>
              <GuidedOverlay />
            </GuidedTutorialProvider>
            <EchoPrimeChat />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
