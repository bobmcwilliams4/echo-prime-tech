'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const LEGAL_PAGES = [
  {
    title: 'Terms of Service',
    href: '/legal/terms',
    description: 'Terms and conditions governing your use of Echo Prime Technologies products and services.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Privacy Policy',
    href: '/legal/privacy',
    description: 'How we collect, use, and protect your personal information and data.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Cookie Policy',
    href: '/legal/cookies',
    description: 'Information about how we use cookies and similar tracking technologies.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="8" r="1" fill="currentColor" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
        <circle cx="16" cy="13" r="1" fill="currentColor" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function LegalPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Legal', href: '/legal' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <Link href="/" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
          Back to Home
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Legal
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          Review our legal documents, policies, and terms governing the use of Echo Prime Technologies products and services.
        </p>

        <div className="grid gap-6">
          {LEGAL_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="p-6 rounded-xl border card-hover flex items-start gap-5 transition-all"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="mt-1 flex-shrink-0" style={{ color: 'var(--ept-accent)' }}>
                {page.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
                  {page.title}
                </h2>
                <p style={{ color: 'var(--ept-text-secondary)' }}>
                  {page.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
            Questions?
          </h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>
            If you have any questions about our legal documents or policies, please contact us at{' '}
            <a href="mailto:legal@echo-op.com" style={{ color: 'var(--ept-accent)' }}>legal@echo-op.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
