import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website Development — AI-Powered Web Solutions | Echo Prime Technologies',
  description: 'Professional website development powered by AI. Next.js, React, Cloudflare Workers, Vercel deployment. From single-page sites to full enterprise platforms with AI integration.',
  keywords: ['website development', 'AI websites', 'Next.js development', 'Cloudflare Workers', 'Echo Prime'],
  openGraph: {
    title: 'Website Development — AI-Powered Web Solutions',
    description: 'Professional website development powered by AI. Next.js, React, Cloudflare Workers, and Vercel.',
    url: 'https://echo-ept.com/websites',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/websites' },
};

export default function WebsitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
