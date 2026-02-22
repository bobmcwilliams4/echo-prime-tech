import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Collectibles Grading — Cards, Comics & Memorabilia | Echo Prime Technologies',
  description: 'AI-powered collectibles grading and authentication. Sports cards, trading cards, comics, coins, stamps, and memorabilia. Machine vision analysis with 99.2% accuracy. PSA/BGS comparable results.',
  keywords: ['collectibles grading', 'AI grading', 'card grading', 'sports cards', 'comic grading', 'authentication', 'Echo Prime'],
  openGraph: {
    title: 'AI Collectibles Grading',
    description: 'AI-powered collectibles grading with machine vision. Sports cards, comics, coins, and more. 99.2% accuracy.',
    url: 'https://echo-ept.com/grading',
  },
};

export default function GradingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
