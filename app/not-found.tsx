'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold font-mono gradient-text mb-6">404</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>
          Page not found
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--ept-text-muted)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--ept-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-text-muted)' }}>Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Engines', href: '/engines' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Blog', href: '/blog' },
              { label: 'SDK', href: '/sdk' },
              { label: 'Sentinel AI', href: '/sentinel' },
              { label: 'Security', href: '/security' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
