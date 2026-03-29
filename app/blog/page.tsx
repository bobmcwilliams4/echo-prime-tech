'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import { BLOG_POSTS, CATEGORIES, formatDate } from './blog-data';
import NewsletterSignup from '../../components/NewsletterSignup';

export default function BlogPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let posts = activeCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [activeCategory, searchQuery]);

  const featured = BLOG_POSTS.filter(p => p.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/engines" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/sdk" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>SDK</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            The Echo Prime Blog
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Technical deep-dives on AI engineering, oilfield technology, tax intelligence, and building autonomous systems. Written by the team that builds it.
          </p>
        </div>

        {/* Featured Posts */}
        {activeCategory === 'All' && featured.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {featured.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="text-left p-8 rounded-2xl border transition-all hover:scale-[1.01] block"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                    Featured
                  </span>
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{post.category}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 leading-tight" style={{ color: 'var(--ept-text)' }}>{post.title}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{post.excerpt}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{formatDate(post.date)}</span>
                  <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{post.readTime} read</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Search + Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl text-sm outline-none border"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" strokeWidth="2" /></svg>
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--ept-text-muted)' }}>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: activeCategory === cat ? '#fff' : 'var(--ept-text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="text-left p-6 rounded-xl border transition-all hover:scale-[1.01] flex flex-col block"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? '#14b8a615' : '#0d737715', color: 'var(--ept-accent)' }}>
                  {post.category}
                </span>
                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{post.readTime}</span>
              </div>
              <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: 'var(--ept-text)' }}>{post.title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
                {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '...' : post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{formatDate(post.date)}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>Read &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 max-w-xl mx-auto">
          <NewsletterSignup />
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
            Built with 5,486+ intelligence engines, 607K+ doctrine blocks, and zero VC funding.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/free" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
            <Link href="/engines" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Explore Engines</Link>
            <Link href="/case-studies" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Case Studies</Link>
            <Link href="/sdk" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Developer SDK</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
