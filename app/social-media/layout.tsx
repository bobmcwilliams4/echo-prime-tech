import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Social Media Manager — AI-Powered Scheduling & Analytics | Echo Prime Technology',
  description: 'Schedule posts across 8 platforms, manage campaigns, analyze engagement, and generate AI content. Content calendar, hashtag groups, team collaboration. Starting at $19/month.',
  keywords: ['social media manager', 'social media scheduling', 'post scheduler', 'Buffer alternative', 'Hootsuite alternative', 'social media analytics'],
  openGraph: {
    title: 'Echo Social Media Manager — AI-Powered Scheduling & Analytics',
    description: 'Schedule posts across 8 platforms, manage campaigns, analyze engagement, and generate AI content. Content calendar, hashtag groups, team collaboration. Starting at $19/month.',
    url: 'https://echo-ept.com/social-media',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Social Media Manager — AI-Powered Scheduling & Analytics | Echo Prime Technology',
    description: 'Schedule posts across 8 platforms, manage campaigns, analyze engagement, and generate AI content. Content calendar, hashtag groups, team collaboration. Starting at $19/month.',
  },
  alternates: { canonical: '/social-media' },
};

export default function SocialMediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
