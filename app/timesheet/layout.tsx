import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Timesheet — AI-Powered Time Tracking for Teams',
  description: 'Track time, manage projects, generate invoices from billable hours, and get AI productivity insights. Toggl/Harvest alternative starting at $5/user/mo.',
  openGraph: {
    title: 'Echo Timesheet — AI Time Tracking',
    description: 'Time tracking with project budgets, weekly timesheets, invoice generation, and AI productivity insights.',
    url: 'https://echo-ept.com/timesheet',
  },
};

export default function TimesheetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
