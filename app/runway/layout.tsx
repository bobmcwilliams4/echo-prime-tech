import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Runway — AI Fashion Content Platform | 3D Runway in the Browser',
  description: 'Real-time 3D fashion runway in the browser. AI content creation for fashion brands — model photos, runway videos, social media assets. Zero GPU servers. Under $35/month infrastructure.',
  keywords: ['AI fashion', '3D runway', 'fashion content creation', 'virtual fashion show', 'AI model photos', 'fashion video', 'Shopify integration', 'Echo Runway'],
  openGraph: {
    title: 'Echo Runway — AI Fashion Content Platform',
    description: 'Real-time 3D fashion runway in the browser. AI-generated model photos, runway videos, and social media assets. Zero GPU cost.',
    url: 'https://echo-ept.com/runway',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Runway' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Runway — AI Fashion Content Platform',
    description: 'Real-time 3D fashion runway in the browser. AI content creation for fashion brands. Zero GPU servers.',
  },
  alternates: { canonical: '/runway' },
};

export default function RunwayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
