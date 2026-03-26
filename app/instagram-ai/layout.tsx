import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Instagram AI — Automated Content, Analytics & Growth Platform | Echo Prime Tech',
  description: 'AI-powered Instagram management with automated posting, hashtag optimization, engagement analytics, story scheduling, and competitor tracking. Grow your Instagram on autopilot.',
  keywords: ['Instagram automation', 'Instagram AI', 'social media management', 'Instagram analytics', 'Instagram scheduler', 'hashtag optimization'],
  openGraph: { title: 'Echo Instagram AI — Automated Growth Platform', description: 'AI-powered Instagram management with automated posting, analytics, and competitor tracking.', url: 'https://echo-ept.com/instagram-ai' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
