import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Email Sender — Transactional & Marketing Email Platform | Echo Prime Technologies',
  description: 'Send transactional and marketing emails with AI-powered subject line optimization, drip sequences, bounce handling, and delivery analytics. Multi-tenant. Starts at $9/mo.',
  keywords: ['email sender', 'transactional email', 'email marketing', 'drip campaigns', 'email API', 'email delivery'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
