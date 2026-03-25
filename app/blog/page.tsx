'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import { BLOG_POSTS, CATEGORIES, formatDate } from './blog-data';

export default function BlogPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const filtered = useMemo(
    () => activeCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeCategory),
    [activeCategory],
  );

  const featured = BLOG_POSTS.filter(p => p.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
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
        <div className="mt-16 p-10 rounded-2xl text-center" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Stay ahead of the curve</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Get weekly technical deep-dives on AI engineering, oilfield automation, tax intelligence, and more. No spam, no fluff — just real insights from production systems.
          </p>
          {newsletterStatus === 'success' ? (
            <div className="py-4 px-6 rounded-xl inline-block" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>You&apos;re in! Watch your inbox for our next deep-dive.</p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newsletterEmail || !newsletterEmail.includes('@')) return;
                setNewsletterStatus('loading');
                try {
                  const res = await fetch('https://ept-api.bmcii1976.workers.dev/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: newsletterEmail, source: 'blog_newsletter', page: '/blog' }),
                  });
                  if (res.ok) {
                    setNewsletterStatus('success');
                    setNewsletterEmail('');
                  } else {
                    setNewsletterStatus('error');
                  }
                } catch {
                  setNewsletterStatus('error');
                }
              }}
              className="flex justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => { setNewsletterEmail(e.target.value); if (newsletterStatus === 'error') setNewsletterStatus('idle'); }}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: newsletterStatus === 'error' ? '#ef4444' : 'var(--ept-border)', color: 'var(--ept-text)' }}
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white whitespace-nowrap transition-opacity"
                style={{ backgroundColor: 'var(--ept-accent)', opacity: newsletterStatus === 'loading' ? 0.7 : 1 }}
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Something went wrong. Please try again.</p>
          )}
          <p className="text-xs mt-3" style={{ color: 'var(--ept-text-muted)' }}>Join 500+ engineers and operators. Unsubscribe anytime.</p>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
            Built with 5,486+ intelligence engines, 601K+ doctrine blocks, and zero VC funding.
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
