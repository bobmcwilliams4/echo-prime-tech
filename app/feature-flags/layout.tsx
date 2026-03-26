import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Feature Flags — Ship Faster with Controlled Rollouts',
  description: 'Feature flags with boolean, percentage, and targeted rollouts. Targeting rules, user overrides, audit trail, and real-time evaluation. LaunchDarkly alternative starting at $19/mo.',
  openGraph: {
    title: 'Echo Feature Flags — Controlled Rollouts',
    description: 'Boolean, percentage, and targeted feature flags with rules engine, audit trail, and instant evaluation.',
    url: 'https://echo-ept.com/feature-flags',
  },
};

export default function FeatureFlagsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
