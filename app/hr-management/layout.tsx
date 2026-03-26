import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI HR Management — Echo Prime Technologies',
  description: 'AI-powered HR for growing teams. Employee directory, time-off management, AI performance reviews, compensation analytics, org charts. Flat-rate pricing from $25/month.',
  keywords: ['HR management', 'AI HR', 'human resources software', 'BambooHR alternative', 'performance reviews', 'employee management'],
  openGraph: {
    title: 'AI HR Management — Echo Prime Technologies',
    description: 'AI-powered HR for growing teams. Employee directory, time-off management, AI performance reviews, compensation analytics, org charts.',
    url: 'https://echo-ept.com/hr-management',
  },
};

export default function HRManagementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
