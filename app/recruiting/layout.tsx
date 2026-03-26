import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Recruiting — AI-Powered Applicant Tracking System',
  description: 'Hire faster with AI. Post jobs, track candidates through customizable pipelines, AI resume screening, interview scorecards, offer management, and talent pools. Greenhouse alternative starting at $29/mo.',
  openGraph: {
    title: 'Echo Recruiting — AI Applicant Tracking',
    description: 'AI-powered ATS with pipeline management, resume screening, scorecards, and offer tracking.',
    url: 'https://echo-ept.com/recruiting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Recruiting — AI Applicant Tracking',
    description: 'AI-powered ATS with pipeline management, resume screening, scorecards, and offer tracking.',
  },
  alternates: { canonical: '/recruiting' },
};

export default function RecruitingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
