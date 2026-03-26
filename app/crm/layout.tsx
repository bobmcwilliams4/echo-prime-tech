import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo CRM — AI-Powered Customer Relationship Management | Echo Prime Technologies',
  description: 'AI-powered CRM with deal pipelines, lead scoring, contact management, activity tracking, and revenue analytics. Built on Cloudflare Workers. Starts at $29/mo.',
  keywords: ['CRM', 'AI CRM', 'customer relationship management', 'sales pipeline', 'lead scoring', 'deal tracking'],
  openGraph: {
    title: 'Echo CRM — AI-Powered Customer Relationship Management',
    description: 'AI-powered CRM with deal pipelines, lead scoring, contact management, activity tracking, and revenue analytics.',
    url: 'https://echo-ept.com/crm',
  },
  twitter: {
    card: 'summary',
    title: 'Echo CRM — AI-Powered CRM',
    description: 'Deal pipelines, AI lead scoring, activity tracking, and revenue analytics. HubSpot alternative starting at $29/mo.',
  },
  alternates: { canonical: '/crm' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
