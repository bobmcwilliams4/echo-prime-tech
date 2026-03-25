import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Call Center — Enterprise Voice AI Platform | Echo Prime Technologies',
  description: 'AI-powered call center handling thousands of concurrent calls. Intelligent queue routing, predictive dialer, real-time wallboard, AI agents that never sleep. Replace your entire call center operation.',
  keywords: ['AI call center', 'virtual call center', 'AI phone agent', 'predictive dialer', 'call center automation', 'IVR AI', 'call queue management', 'call center software'],
  openGraph: {
    title: 'AI Call Center — Handle 10,000+ Concurrent Calls',
    description: 'Enterprise AI call center with intelligent routing, predictive dialing, real-time monitoring, and AI agents that handle calls 24/7.',
    url: 'https://echo-ept.com/call-center',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime AI Call Center' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Call Center — 10,000+ Concurrent Calls',
    description: 'Enterprise AI call center. Intelligent routing. Predictive dialer. Real-time wallboard. AI agents 24/7.',
  },
  alternates: { canonical: '/call-center' },
};

export default function CallCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
