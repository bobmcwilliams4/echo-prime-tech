import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Closer Settings — Echo Prime Technologies',
  description: 'Configure your AI Closer with business profile, voice selection, calling schedules, Twilio integration, recording preferences, and DNC compliance settings. Fine-tune every aspect of your autonomous sales agent.',
  openGraph: {
    title: 'Closer Settings — Echo Prime Technologies',
    description: 'Configure AI Closer voice, calling hours, Twilio integration, and compliance settings.',
    url: 'https://echo-ept.com/closer/settings',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
