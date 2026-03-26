import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Waitlist — Viral Launch Pages & Referral Waitlists | Echo Prime Technology',
  description: 'Build viral waitlists for your product launch. Referral tracking, position boosting, milestone rewards, embeddable widgets, and analytics. Starting at $9/mo.',
  openGraph: {
    title: 'Echo Waitlist — Viral Launch Pages & Referral Waitlists',
    description: 'Turn signups into growth. Referral-powered waitlists with position tracking and milestone rewards.',
    url: 'https://echo-ept.com/waitlist',
  },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
