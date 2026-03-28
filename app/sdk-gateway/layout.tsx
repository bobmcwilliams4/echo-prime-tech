import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Gateway — Unified API Gateway for AI Services | Echo Prime Technologies',
  description: 'Single API gateway routing to 50+ AI microservices. Authentication, rate limiting, usage tracking, and SDK generation. Built on Cloudflare Workers.',
  keywords: ['API gateway', 'SDK gateway', 'AI API', 'microservices gateway', 'unified API', 'Cloudflare Workers API'],
  openGraph: {
    title: 'SDK Gateway — Unified API Gateway for AI Services',
    description: 'Single API gateway routing to 50+ AI microservices with auth, rate limiting, and SDK generation.',
    url: 'https://echo-ept.com/sdk-gateway',
  },
  twitter: {
    card: 'summary',
    title: 'SDK Gateway — Unified AI API Gateway',
    description: 'Route to 50+ AI microservices through one endpoint. Auth, rate limiting, usage tracking built in.',
  },
  alternates: { canonical: '/sdk-gateway' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
