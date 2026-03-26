import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Proposals — AI Proposal & Quote Builder | Echo Prime Technology',
  description: 'Create stunning proposals that close deals. AI content generation, branded templates, e-signatures, client portal with view tracking, pricing tables, and analytics. Starting at $19/mo.',
  openGraph: {
    title: 'Echo Proposals — AI Proposal & Quote Builder',
    description: 'Create, send, and track professional proposals. AI-generated content, e-signatures, and real-time analytics.',
    url: 'https://echo-ept.com/proposals',
  },
  twitter: {
    card: 'summary',
    title: 'Echo Proposals — AI Proposal & Quote Builder',
    description: 'Create, send, and track professional proposals. AI-generated content, e-signatures, and real-time analytics.',
  },
  alternates: { canonical: '/proposals' },
};

export default function ProposalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
