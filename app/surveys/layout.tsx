import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Surveys — AI-Powered NPS, CSAT & Feedback | Echo Prime Technology',
  description: 'Collect customer feedback with AI-powered NPS, CSAT, and custom surveys. AI question generation, sentiment analysis, and real-time analytics. Starting at $12/month.',
  keywords: ['surveys', 'NPS', 'CSAT', 'customer feedback', 'AI surveys', 'survey tool'],
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Surveys — AI-Powered NPS, CSAT & Feedback | Echo Prime Technology',
    description: 'Collect customer feedback with AI-powered NPS, CSAT, and custom surveys. AI question generation, sentiment analysis, and real-time analytics. Starting at $12/month.',
  },
  alternates: { canonical: '/surveys' },
};

export default function SurveysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
