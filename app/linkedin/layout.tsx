import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkedIn AI Bot | Professional Content & Lead Generation | Echo Prime Technologies',
  description: 'AI-powered LinkedIn automation. Professional content generation, thought leadership posts, engagement analytics, and lead nurturing. 11 content categories.',
  openGraph: {
    title: 'LinkedIn AI Bot | Echo Prime Technologies',
    description: 'AI-powered LinkedIn content generation and professional engagement automation.',
    url: 'https://echo-ept.com/linkedin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn AI Bot | Echo Prime Technologies',
    description: 'AI-powered LinkedIn content generation and professional engagement automation.',
  },
  alternates: { canonical: '/linkedin' },
};

export default function LinkedInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
