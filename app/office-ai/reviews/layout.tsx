import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews — Echo Prime Technologies',
  description: 'Collect, moderate, and showcase customer reviews and ratings. Approve or remove reviews, filter by service type, and build your business reputation.',
  openGraph: {
    title: 'Customer Reviews — Echo Prime Technologies',
    description: 'Customer review management with moderation, ratings, and reputation tracking.',
    url: 'https://echo-ept.com/office-ai/reviews',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
