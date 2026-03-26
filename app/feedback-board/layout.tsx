import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Feedback Board — Feature Requests & Product Feedback | Echo Prime Technology',
  description: 'Public feedback boards with upvoting, roadmap, changelogs, and AI-powered insights. Canny & UserVoice alternative starting at $12/month.',
  keywords: ['feedback board', 'feature requests', 'product feedback', 'Canny alternative', 'UserVoice alternative', 'product roadmap'],
};

export default function FeedbackBoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
