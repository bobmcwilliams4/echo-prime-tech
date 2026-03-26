import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Forms — AI-Powered Form Builder & Survey System | Echo Prime Tech',
  description: 'Create forms, surveys, quizzes, and registrations with AI-powered question suggestions, response analysis, and real-time analytics. Starting at $9/mo.',
  keywords: ['form builder', 'survey tool', 'quiz maker', 'AI forms', 'online forms', 'data collection', 'feedback surveys'],
  openGraph: {
    title: 'Echo Forms — AI-Powered Form Builder & Survey System',
    description: 'Build smarter forms with AI question suggestions, automatic response analysis, quiz scoring, and real-time analytics.',
    url: 'https://echo-ept.com/forms',
    type: 'website',
  },
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
