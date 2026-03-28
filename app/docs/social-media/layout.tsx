import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Social Media Manager Documentation — User Manual & API Reference | Echo Prime Tech',
  description: 'Complete documentation for Echo Social Media Manager — AI-powered social media management for 8 platforms with post scheduling, bulk cross-posting, campaigns, content calendar, hashtag groups, and engagement analytics.',
  openGraph: {
    title: 'Echo Social Media Manager Documentation — User Manual & API Reference | Echo Prime Tech',
    description: 'Complete documentation for Echo Social Media Manager — AI-powered social media management for Twitter/X, LinkedIn, Instagram, Facebook, Reddit, TikTok, YouTube, and Threads.',
    url: 'https://echo-ept.com/docs/social-media',
  },
}

export default function SocialMediaDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
