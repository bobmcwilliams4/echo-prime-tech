import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permian Basin AI — Oilfield Intelligence | Echo Prime Technologies',
  description: 'AI-powered oilfield intelligence for the Permian Basin. Well evaluation, lease analysis, decline curve forecasting, AFE review, and 5 more specialized modules. Built by a 30-year oilfield veteran.',
  keywords: ['Permian Basin AI', 'oilfield intelligence', 'well evaluation', 'lease analysis', 'decline curve', 'AFE review', 'oil and gas technology', 'title examination'],
  openGraph: {
    title: 'Permian Basin AI — Oilfield Intelligence',
    description: 'AI-powered oilfield intelligence for the Permian Basin. 9 specialized modules: well evaluation, lease analysis, decline curve forecasting, AFE review, and more.',
    url: 'https://echo-ept.com/permian',
    siteName: 'Echo Prime Technologies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Permian Basin AI — Oilfield Intelligence',
    description: 'AI-powered oilfield intelligence built by a 30-year Permian Basin veteran. 9 specialized modules for operators and landmen.',
  },
  alternates: {
    canonical: 'https://echo-ept.com/permian',
  },
};

export default function PermianLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Permian Basin AI by Echo Prime Technologies',
            url: 'https://echo-ept.com/permian',
            description: 'AI-powered oilfield intelligence platform with 9 specialized modules for Permian Basin operators, landmen, and engineers.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              lowPrice: '199',
              highPrice: '999',
            },
            provider: {
              '@type': 'Organization',
              name: 'Echo Prime Technologies',
              url: 'https://echo-ept.com',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
