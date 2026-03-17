'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

export default function ComingSoonPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Caution stripe top bar */}
      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #111 20px, #111 40px)',
      }} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <Link href="/" className="px-5 py-2 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Back to Home
        </Link>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Hard hat icon */}
        <div className="animate-fade-up" style={{ marginBottom: 32, fontSize: 64 }}>
          🚧
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up" style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 900,
          color: 'var(--ept-text)',
          lineHeight: 1.1,
          marginBottom: 16,
          letterSpacing: '-0.03em',
        }}>
          Under Construction
        </h1>

        <p className="animate-fade-up" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
          color: 'var(--ept-text-secondary)',
          maxWidth: 600,
          margin: '0 auto 48px',
          lineHeight: 1.6,
        }}>
          Our crew is working hard to bring this to you. Check back soon — this service is being built with the same precision we put into everything.
        </p>

        {/* Construction crew image */}
        <div className="animate-fade-up" style={{ marginBottom: 56, position: 'relative' }}>
          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', border: '3px solid #f59e0b' }}>
            <Image
              src="/coming-soon-crew-v2.png"
              alt="Echo Prime construction crew hard at work"
              width={1024}
              height={768}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
            {/* Caution tape overlay at bottom of image */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 28,
              background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #111 20px, #111 40px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#111', fontSize: 11, fontWeight: 900, letterSpacing: 6, textTransform: 'uppercase' }}>
                Caution — Under Construction — Caution
              </span>
            </div>
          </div>
        </div>

        {/* Status cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 740, margin: '0 auto 48px' }}>
          {[
            { icon: '🔧', label: 'Building', detail: 'Core features in progress' },
            { icon: '🧪', label: 'Testing', detail: 'Quality assurance phase' },
            { icon: '🚀', label: 'Launch', detail: 'Coming very soon' },
          ].map((item) => (
            <div key={item.label} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, color: 'var(--ept-text-muted)' }}>{item.detail}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="px-8 py-3 rounded-xl font-semibold text-base" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Explore Available Services
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold text-base" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>

        {/* Tagline */}
        <p style={{ marginTop: 48, fontSize: 14, color: 'var(--ept-text-muted)', fontStyle: 'italic' }}>
          Built with precision in Midland, Texas. Every service we launch is production-grade, battle-tested, and built to last.
        </p>
      </main>

      {/* Caution stripe bottom bar */}
      <div style={{
        height: 12,
        background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #111 20px, #111 40px)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }} />
    </div>
  );
}
