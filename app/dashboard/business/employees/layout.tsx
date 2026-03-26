import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Management — Echo Prime Technologies',
  description: 'Manage your workforce with employee profiles, role assignments, hourly rates, and hire date tracking. Search employees by name, email, or role with active/inactive status filtering.',
  openGraph: {
    title: 'Employee Management — Echo Prime Technologies',
    description: 'Workforce management with employee profiles, roles, rates, and status tracking.',
    url: 'https://echo-ept.com/dashboard/business/employees',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
