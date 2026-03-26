import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payroll Management — Echo Prime Technologies',
  description: 'Run payroll with automated pay calculations based on logged hours and rates. Create payroll runs, review line items, approve payments, and export reports.',
  openGraph: {
    title: 'Payroll Management — Echo Prime Technologies',
    description: 'Automated payroll runs with hour-based pay calculation, approvals, and exports.',
    url: 'https://echo-ept.com/office-ai/payroll',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
