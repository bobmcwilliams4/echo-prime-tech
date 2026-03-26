import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Tracking & Timesheets — Echo Prime Technologies',
  description: 'Log employee hours, track overtime, and manage timesheet approvals. Filter by employee and date range for accurate payroll preparation.',
  openGraph: {
    title: 'Time Tracking & Timesheets — Echo Prime Technologies',
    description: 'Employee time tracking with overtime logging and timesheet approval workflows.',
    url: 'https://echo-ept.com/office-ai/hours',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Tracking & Timesheets — Echo Prime Technologies',
    description: 'Employee time tracking with overtime logging and timesheet approval workflows.',
  },
  alternates: { canonical: '/office-ai/hours' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
