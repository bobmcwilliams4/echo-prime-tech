import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Echo Prime Technologies',
  description: 'Echo Prime Technologies administration panel. Manage users, services, engines, and system configuration.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Admin Panel — Echo Prime Technologies',
    url: 'https://echo-ept.com/admin',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
