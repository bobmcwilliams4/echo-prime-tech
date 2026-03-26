import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews — Echo Prime Technologies',
  description: 'Manage customer reviews and ratings with approval workflows. Monitor service quality through star ratings, review text, and service type categorization.',
  openGraph: {
    title: 'Customer Reviews — Echo Prime Technologies',
    description: 'Customer review management with ratings, approval workflows, and service feedback.',
    url: 'https://echo-ept.com/dashboard/business/reviews',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
