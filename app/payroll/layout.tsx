import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Payroll — AI-Powered Payroll Processing | Echo Prime Technologies',
  description: 'Run payroll in minutes with automatic tax calculations, direct deposit, compliance tracking, and AI cost forecasting. Gusto alternative starting at $19/mo + $4/employee.',
  openGraph: {
    title: 'Echo Payroll — AI-Powered Payroll Processing',
    description: 'Automated payroll with federal & state tax calculations, pay stubs, compliance, and AI insights.',
    url: 'https://echo-ept.com/payroll',
  },
};

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
