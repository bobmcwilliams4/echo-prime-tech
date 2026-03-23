import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS, getPostBySlug, getAllSlugs } from '../blog-data';
import ArticleContent from './article-content';

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Echo Prime Technologies`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://echo-ept.com/blog/${post.slug}`,
      siteName: 'Echo Prime Technologies',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://echo-ept.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'Echo Prime Technologies',
              url: 'https://echo-ept.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Echo Prime Technologies',
              url: 'https://echo-ept.com',
            },
            url: `https://echo-ept.com/blog/${post.slug}`,
            keywords: post.tags.join(', '),
            articleSection: post.category,
            wordCount: post.content.split(/\s+/).length,
            timeRequired: `PT${parseInt(post.readTime)}M`,
          }),
        }}
      />
      <ArticleContent post={post} />
    </>
  );
}
