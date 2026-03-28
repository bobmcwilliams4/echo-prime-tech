import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Feedback Board — Feature Requests & Product Feedback | Echo Prime Technology',
  description: 'Public feedback boards with upvoting, roadmap, changelogs, and AI-powered insights. Canny & UserVoice alternative starting at $12/month.',
  keywords: ['feedback board', 'feature requests', 'product feedback', 'Canny alternative', 'UserVoice alternative', 'product roadmap'],
  openGraph: {
    title: 'Echo Feedback Board — Feature Requests & Product Feedback',
    description: 'Public feedback boards with upvoting, roadmap, changelogs, and AI-powered insights. Canny & UserVoice alternative starting at $12/month.',
    url: 'https://echo-ept.com/feedback-board',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Feedback Board — Feature Requests & Product Feedback | Echo Prime Technology',
    description: 'Public feedback boards with upvoting, roadmap, changelogs, and AI-powered insights. Canny & UserVoice alternative starting at $12/month.',
  },
  alternates: { canonical: '/feedback-board' },
};

export default function FeedbackBoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
