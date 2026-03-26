import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Echo Prime Technologies',
  description: '90+ technical deep-dives on AI engineering, oilfield technology, tax intelligence, cybersecurity, and building autonomous systems at scale. Written by the team that builds 5,486+ intelligence engines.',
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
                headline: 'Cloud Security Posture Management: Automated Misconfiguration Detection',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/cloud-security-posture-management-cspm-multi-cloud-2026',
                keywords: ['cloud security', 'CSPM', 'AWS security', 'misconfiguration'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'API Security Testing: Automated OWASP Top 10 Scanning',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/api-security-testing-owasp-top-10-automated-scanning-2026',
                keywords: ['API security', 'OWASP', 'penetration testing'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'R&D Tax Credit for Software Companies: Claim $250K+ Annually',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/r-and-d-tax-credit-software-companies-startups-2026',
                keywords: ['R&D tax credit', 'IRC 41', 'startup tax'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'LLC vs S-Corp vs C-Corp: AI-Powered Entity Selection',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/business-entity-selection-tax-optimization-llc-scorp-2026',
                keywords: ['LLC', 'S-Corp', 'entity selection', 'tax optimization'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Estate Planning with AI: Trust Administration and Wealth Transfer',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/estate-planning-ai-trust-administration-wealth-transfer-2026',
                keywords: ['estate planning', 'trust administration', 'wealth transfer'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Building Multi-Agent AI Systems for Production',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/building-multi-agent-ai-systems-production-2026',
                keywords: ['multi-agent AI', 'agent architecture', 'AI orchestration'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Edge Computing for AI Inference on Cloudflare Workers',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/edge-computing-ai-inference-cloudflare-workers-2026',
                keywords: ['edge computing', 'Cloudflare Workers', 'AI inference'],
              },
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
                headline: 'IRS Audit Defense: How AI Documentation Saves $50K+',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/irs-audit-defense-ai-documentation-guide-2026',
                keywords: ['IRS audit', 'tax defense', 'AI documentation'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'Zero Trust Security for Small Business: $0-$500/Month Implementation',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/zero-trust-security-small-business-implementation-2026',
                keywords: ['zero trust', 'small business security', 'NIST 800-207'],
              },
              {
                '@type': 'BlogPosting',
                headline: 'AI Artificial Lift Optimization: Cut LOE by 30% in the Permian Basin',
                datePublished: '2026-03-26',
                author: { '@type': 'Organization', name: 'Echo Prime Technologies' },
                url: 'https://echo-ept.com/blog/oilfield-production-optimization-ai-artificial-lift-2026',
                keywords: ['artificial lift', 'production optimization', 'Permian Basin'],
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
