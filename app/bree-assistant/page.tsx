'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ══════════════════════════════════════════════════════════════════════════════
   BREE AI → Redirects to Office AI (same product, customized for Clean Brees)
   Live deployments: cleanbrees.echo-ept.com, rah-midland.com, jp.echo-op.com
   ══════════════════════════════════════════════════════════════════════════════ */

export default function BreeAssistantPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/office-ai'), 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
      </nav>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>💖</div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Bree AI is now part of
          <br />
          <span className="gradient-text">Echo Office AI</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
          Everything Bree can do — and more — is now available in our full AI Office Platform.
          Same personality, same voice, same emotional intelligence. Plus invoicing, fleet management,
          call transcription, and 22+ business modules.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/office-ai" className="px-8 py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Go to Echo Office AI
          </Link>
        </div>

        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ept-accent)' }}>Live Deployments</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: 'Clean Brees', domain: 'cleanbrees.echo-ept.com' },
              { name: 'Right At Home', domain: 'rah-midland.com' },
              { name: 'JP Services', domain: 'jp.echo-op.com' },
            ].map(site => (
              <div key={site.domain} className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--ept-border)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{site.name}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{site.domain}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          Redirecting to Office AI in a few seconds...
        </p>
      </main>
    </div>
  );
}
