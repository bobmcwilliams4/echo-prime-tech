import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Echo Prime Technologies',
  description: 'Technical deep-dives on AI engineering, oilfield technology, tax intelligence, cybersecurity, and building autonomous systems at scale. Written by the team that builds 5,400+ intelligence engines.',
  openGraph: {
    title: 'Echo Prime Blog — AI Engineering & Autonomous Systems',
    description: 'Technical deep-dives on intelligence engines, oilfield AI, tax technology, and building production autonomous systems.',
    url: 'https://echo-ept.com/blog',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Prime Blog',
    description: 'Technical deep-dives on AI engineering, oilfield tech, tax intelligence, and autonomous systems.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/blog',
    types: { 'application/rss+xml': 'https://echo-ept.com/feed.xml' },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Echo Prime Technologies Blog',
            url: 'https://echo-ept.com/blog',
            description: 'Technical deep-dives on AI engineering, oilfield technology, tax intelligence, and autonomous systems.',
            publisher: {
              '@type': 'Organization',
              name: 'Echo Prime Technologies',
              url: 'https://echo-ept.com',
              founder: {
                '@type': 'Person',
                name: 'Bobby Don McWilliams II',
                jobTitle: 'Founder & CEO',
              },
            },
            blogPost: [
              {
                '@type': 'BlogPosting',
                headline: 'Why Intelligence Engines Beat Chatbot Wrappers for Enterprise AI',
                datePublished: '2026-03-21',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/why-intelligence-engines-beat-chatbot-wrappers',
                keywords: ['intelligence engines', 'enterprise AI', 'domain expertise'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'How AI is Transforming Title Examination in the Permian Basin',
                datePublished: '2026-03-19',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/ai-powered-title-examination-permian-basin',
                keywords: ['Permian Basin', 'title examination', 'oilfield AI'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Building Autonomous AI Agents That Actually Work in Production',
                datePublished: '2026-03-17',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/building-autonomous-ai-agents-2026',
                keywords: ['autonomous agents', 'production AI', 'AI operations'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'MACRS Depreciation Optimization with AI Tax Engines',
                datePublished: '2026-03-14',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/ai-tax-preparation-macrs-depreciation',
                keywords: ['MACRS depreciation', 'tax optimization', 'AI tax engines'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Zero-Trust Security Architecture for AI-First Companies',
                datePublished: '2026-03-11',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/zero-trust-ai-security-monitoring',
                keywords: ['zero-trust', 'AI security', 'cybersecurity'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Running 100+ Microservices on Cloudflare Workers: Architecture Lessons',
                datePublished: '2026-03-08',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/edge-computing-cloudflare-workers-ai',
                keywords: ['Cloudflare Workers', 'microservices', 'edge computing'],
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
