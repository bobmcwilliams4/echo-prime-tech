'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const SDK_NAV = [
  { label: 'Overview', href: '/sdk' },
  { label: 'Quick Start', href: '/sdk/quickstart' },
  { label: 'API Docs', href: '/sdk/docs' },
  { label: 'Playground', href: '/sdk/playground' },
  { label: 'Pricing', href: '/sdk/pricing' },
  { label: 'API Keys', href: '/sdk/signup' },
];

export default function SDKLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ept-bg)' }}>
      <nav
        style={{
          borderBottom: '1px solid var(--ept-card-border)',
          background: 'var(--ept-surface)',
          position: 'sticky',
          top: 64,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
          }}
        >
          {SDK_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '12px 16px',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--ept-accent)' : 'var(--ept-text)',
                  opacity: active ? 1 : 0.7,
                  borderBottom: active
                    ? '2px solid var(--ept-accent)'
                    : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
