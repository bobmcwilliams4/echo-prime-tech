import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Management — Echo Prime Technologies',
  description: 'Manage your workforce with role-based staff profiles, hourly rates, and hire date tracking. Add, edit, and organize employees across all departments.',
  openGraph: {
    title: 'Employee Management — Echo Prime Technologies',
    description: 'Staff management with role assignments, hourly rates, and employee profiles.',
    url: 'https://echo-ept.com/office-ai/employees',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
