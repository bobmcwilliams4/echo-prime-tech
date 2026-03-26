import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lead Detail — Echo Prime Technologies',
  description: 'View complete lead profiles with contact information, engagement history, call records, and custom fields. Edit lead details, add notes, update status, and initiate AI calls directly from the profile.',
  openGraph: {
    title: 'Lead Detail — Echo Prime Technologies',
    description: 'Full lead profile with contact info, call history, notes, and one-click AI calling.',
    url: 'https://echo-ept.com/closer/leads/detail',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
