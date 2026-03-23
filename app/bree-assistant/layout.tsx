import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bree AI Assistant | Echo Prime Technologies',
  description: 'Warm, empathetic AI assistant with voice conversations, 14 personality modes, and deep knowledge across 940+ domains. Your personal AI companion.',
  keywords: ['AI assistant', 'Bree AI', 'voice AI', 'personal AI', 'AI companion', 'conversational AI'],
  openGraph: {
    title: 'Bree AI Assistant',
    description: 'Warm, empathetic AI assistant with voice conversations and 14 personality modes.',
    url: 'https://echo-ept.com/bree-assistant',
    images: [{ url: '/logo-day.png', width: 600, height: 400, alt: 'Echo Prime Technologies' }],
  },
  alternates: { canonical: '/bree-assistant' },
};

export default function BreeAssistantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
