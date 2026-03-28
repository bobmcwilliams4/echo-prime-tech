import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Live Chat — AI-Powered Website Chat Widget | Echo Prime Technology',
  description: 'Embeddable live chat widget with AI-powered responses, visitor tracking, team inbox, and canned responses. Intercom & Drift alternative starting at $19/month.',
  keywords: ['live chat', 'website chat widget', 'customer messaging', 'Intercom alternative', 'Drift alternative', 'AI chat support'],
  openGraph: {
    title: 'Echo Live Chat — AI-Powered Website Chat Widget',
    description: 'Embeddable live chat widget with AI-powered responses, visitor tracking, team inbox, and canned responses. Intercom & Drift alternative starting at $19/month.',
    url: 'https://echo-ept.com/live-chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Live Chat — AI-Powered Website Chat Widget | Echo Prime Technology',
    description: 'Embeddable live chat widget with AI-powered responses, visitor tracking, team inbox, and canned responses. Intercom & Drift alternative starting at $19/month.',
  },
  alternates: { canonical: '/live-chat' },
};

export default function LiveChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
