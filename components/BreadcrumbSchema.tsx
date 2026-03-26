'use client';

/**
 * Breadcrumb JSON-LD Schema Component
 * Renders structured data for Google breadcrumb rich results.
 * Pass an array of { name, href } objects representing the breadcrumb trail.
 */
export default function BreadcrumbSchema({ items }: { items: { name: string; href: string }[] }) {
  const last = items[items.length - 1];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: last ? `${last.name} — Echo Prime Technologies` : 'Echo Prime Technologies',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://echo-ept.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
