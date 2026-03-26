import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Routing & Dispatch — Echo Prime Technologies',
  description: 'Plan optimized delivery and service routes for your fleet. Assign drivers, track stop completion, and manage daily dispatch schedules with time windows.',
  openGraph: {
    title: 'Driver Routing & Dispatch — Echo Prime Technologies',
    description: 'Fleet route planning, driver dispatch, and stop tracking for service businesses.',
    url: 'https://echo-ept.com/office-ai/driver-routing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Driver Routing & Dispatch — Echo Prime Technologies',
    description: 'Fleet route planning, driver dispatch, and stop tracking for service businesses.',
  },
  alternates: { canonical: '/office-ai/driver-routing' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
