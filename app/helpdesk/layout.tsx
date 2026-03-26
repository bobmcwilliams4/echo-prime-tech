import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Helpdesk — AI Customer Support Platform | Echo Prime',
  description: 'AI-powered helpdesk with smart ticket routing, SLA tracking, knowledge base, canned responses, CSAT surveys, and multi-channel support. Replace Zendesk at 1/10th the cost.',
  openGraph: {
    title: 'Echo Helpdesk — AI Customer Support Platform',
    description: 'Smart ticketing, SLA tracking, AI auto-responses, knowledge base, multi-channel support.',
    url: 'https://echo-ept.com/helpdesk',
  },
};

export default function HelpdeskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
