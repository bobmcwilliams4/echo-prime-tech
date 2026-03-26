'use client';

/**
 * FAQ JSON-LD Schema Component
 * Renders structured data for Google FAQ rich results.
 * Use alongside visual FAQ sections to get rich snippets in search results.
 */
export default function FaqSchema({ faqs, name }: { faqs: { q: string; a: string }[]; name?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(name ? { name } : { name: 'Frequently Asked Questions' }),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
