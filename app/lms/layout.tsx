import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo LMS — AI-Powered Learning Management System | Echo Prime Technology',
  description: 'Build and sell online courses with AI-powered quiz generation, auto-certificates, progress tracking, and discussion forums. Starting at $19/month.',
  keywords: ['LMS', 'learning management system', 'online courses', 'AI education', 'course builder', 'quiz generator'],
  openGraph: {
    title: 'Echo LMS — AI-Powered Learning Management System',
    description: 'Build and sell online courses with AI-powered quiz generation, auto-certificates, progress tracking, and discussion forums. Starting at $19/month.',
    url: 'https://echo-ept.com/lms',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo LMS — AI-Powered Learning Management System | Echo Prime Technology',
    description: 'Build and sell online courses with AI-powered quiz generation, auto-certificates, progress tracking, and discussion forums. Starting at $19/month.',
  },
  alternates: { canonical: '/lms' },
};

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
