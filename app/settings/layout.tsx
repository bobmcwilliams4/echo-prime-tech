import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings | Echo Prime Technologies',
  description: 'Access Echo Prime account settings, billing, subscriptions, security, and profile controls.',
  openGraph: {
    title: 'Echo Prime Technologies Account Settings',
    description: 'Manage account settings, billing, subscriptions, security, and profile controls.',
    url: 'https://echo-ept.com/settings',
  },
  alternates: { canonical: '/settings' },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
