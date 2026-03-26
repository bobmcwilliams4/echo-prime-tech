import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo HR — AI-Powered Employee & HR Management | Echo Prime Tech',
  description: 'Employee management, time tracking, leave requests, payroll, performance reviews, onboarding, and AI retention risk prediction. Starting at $29/mo.',
  keywords: ['HR software', 'employee management', 'payroll', 'time tracking', 'leave management', 'performance reviews', 'HRIS'],
  openGraph: {
    title: 'Echo HR — AI-Powered Employee & HR Management',
    description: 'Complete HR platform with AI-powered retention risk prediction and performance insights.',
    url: 'https://echo-ept.com/hr',
    type: 'website',
  },
};

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
