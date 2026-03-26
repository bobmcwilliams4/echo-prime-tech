import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payroll — Echo Prime Technologies',
  description: 'Run and manage payroll with period-based processing, employee breakdowns, and approval workflows. Track gross pay, deductions, and net pay across payroll runs.',
  openGraph: {
    title: 'Payroll — Echo Prime Technologies',
    description: 'Payroll processing with period management, employee breakdowns, and approval tracking.',
    url: 'https://echo-ept.com/dashboard/business/payroll',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payroll — Echo Prime Technologies',
    description: 'Payroll processing with period management, employee breakdowns, and approval tracking.',
  },
  alternates: { canonical: '/dashboard/business/payroll' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
