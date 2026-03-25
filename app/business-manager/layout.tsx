import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Manager — AI-Powered Business Operations | Echo Prime Technologies',
  description: 'Complete business management platform with invoicing, payroll, inventory, CRM, scheduling, and AI-powered analytics for small to mid-size businesses.',
  keywords: ['business management', 'invoicing', 'payroll', 'inventory', 'CRM', 'business AI', 'small business software'],
  openGraph: {
    title: 'Business Manager — AI-Powered Business Operations',
    description: 'Complete business management with invoicing, payroll, inventory, CRM, scheduling, and AI analytics.',
    url: 'https://echo-ept.com/business-manager',
    type: 'website',
  },
  alternates: { canonical: 'https://echo-ept.com/business-manager' },
};

export default function BusinessManagerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
