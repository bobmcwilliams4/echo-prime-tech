'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

const NAV_ITEMS = [
  { href: '/closer', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard', exact: true },
  { href: '/closer/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Leads' },
  { href: '/closer/calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Calls' },
  { href: '/closer/campaigns', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', label: 'Campaigns' },
  { href: '/closer/scripts', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Scripts' },
  { href: '/closer/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics' },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function CloserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    const dark = h < 6 || h >= 18;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const currentPage = NAV_ITEMS.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href) && n.href !== '/closer') || NAV_ITEMS[0];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className="relative z-30 flex flex-col border-r transition-all duration-200 ease-out"
        style={{
          width: sidebarOpen ? 220 : 64,
          borderColor: 'var(--ept-border)',
          backgroundColor: 'var(--ept-card-bg)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center border-b" style={{ height: 64, borderColor: 'var(--ept-border)' }}>
          <Link href="/">
            <img
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="EPT"
              style={{
                height: sidebarOpen ? 36 : 28,
                width: 'auto',
                mixBlendMode: isDark ? 'screen' : 'multiply',
                transition: 'height 0.2s ease',
              }}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/closer';
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  padding: '10px 12px',
                  color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <NavIcon d={item.icon} />
                <span
                  className="truncate transition-all duration-200"
                  style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t py-3 px-3" style={{ borderColor: 'var(--ept-border)' }}>
          {sidebarOpen ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>Powered by</p>
              <p className="gradient-text text-[11px] font-semibold tracking-wider whitespace-nowrap">ECHO PRIME TECHNOLOGIES</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src={isDark ? '/logo-night.png' : '/logo-day.png'}
                alt="EPT"
                style={{ height: 18, width: 'auto', opacity: 0.4, mixBlendMode: isDark ? 'screen' : 'multiply' }}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 border-b"
          style={{ height: 64, borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ept-text-muted)' }}>
              AI Sales Agent
            </h1>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>
              {currentPage.label}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }} />
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#10b981' }}>Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-lg border" style={{ borderColor: 'var(--ept-border)' }} />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-opacity hover:opacity-70"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
