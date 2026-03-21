'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getSettings } from '../../lib/business-api';

/* ── Service Health Monitor ── */

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'checking';
  latency?: number;
}

const BUSINESS_API_URL = 'https://echo-business-api.bmcii1976.workers.dev';
const ECHO_CHAT_URL = 'https://echo-chat.bmcii1976.workers.dev';

function useServiceStatus(interval = 60000) {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Business API', status: 'checking' },
    { name: 'AI Chat', status: 'checking' },
    { name: 'Voice AI', status: 'checking' },
  ]);

  const checkServices = useCallback(async () => {
    const results: ServiceStatus[] = [];

    try {
      const t0 = Date.now();
      const res = await fetch(`${BUSINESS_API_URL}/health`, { signal: AbortSignal.timeout(5000) });
      results.push({ name: 'Business API', status: res.ok ? 'online' : 'offline', latency: Date.now() - t0 });
    } catch {
      results.push({ name: 'Business API', status: 'offline' });
    }

    try {
      const t0 = Date.now();
      const res = await fetch(`${ECHO_CHAT_URL}/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        results.push({ name: 'AI Chat', status: data.status === 'healthy' ? 'online' : 'offline', latency: Date.now() - t0 });
      } else {
        results.push({ name: 'AI Chat', status: 'offline' });
      }
    } catch {
      results.push({ name: 'AI Chat', status: 'offline' });
    }

    try {
      const t0 = Date.now();
      const res = await fetch('https://echo-speak-cloud.bmcii1976.workers.dev/health', { signal: AbortSignal.timeout(8000) });
      results.push({ name: 'Voice AI', status: res.ok ? 'online' : 'offline', latency: Date.now() - t0 });
    } catch {
      results.push({ name: 'Voice AI', status: 'offline' });
    }

    setServices(results);
  }, []);

  useEffect(() => {
    checkServices();
    const id = setInterval(checkServices, interval);
    return () => clearInterval(id);
  }, [checkServices, interval]);

  return services;
}

/* ── Status Dot ── */

function StatusDot({ status, pulse }: { status: 'online' | 'offline' | 'checking'; pulse?: boolean }) {
  const color = status === 'online' ? '#10b981' : status === 'offline' ? '#ef4444' : '#f59e0b';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
      {pulse && status === 'online' && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: color, opacity: 0.4,
          animation: 'statusPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        }} />
      )}
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'block' }} />
    </span>
  );
}

/* ── SVG Nav Icon ── */

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ── Navigation Configuration ── */

interface NavSection {
  title: string;
  items: { href: string; icon: string; label: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { href: '/office-ai/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
      { href: '/office-ai/invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Invoices' },
      { href: '/office-ai/quotes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'Quotes' },
      { href: '/office-ai/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Bookings' },
      { href: '/office-ai/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Customers' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/office-ai/expenses', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z', label: 'Expenses' },
      { href: '/office-ai/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics' },
      { href: '/office-ai/ar-ap', icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5', label: 'AR / AP' },
      { href: '/office-ai/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Payments' },
    ],
  },
  {
    title: 'Team',
    items: [
      { href: '/office-ai/employees', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Employees' },
      { href: '/office-ai/hours', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Hours' },
      { href: '/office-ai/payroll', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Payroll' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/office-ai/inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Inventory' },
      { href: '/office-ai/services', icon: 'M11.42 15.17l-1.42-.86a2 2 0 00-2.11.06L4 17l3.59-5.48a2 2 0 00-.22-2.44L4 5l3.89 2.63a2 2 0 002.11.06l1.42-.86a2 2 0 012.11.06l1.42.86a2 2 0 002.11-.06L20 5l-3.37 4.08a2 2 0 00.22 2.44L20 17l-3.89-2.63a2 2 0 00-2.11-.06l-1.42.86a2 2 0 01-2.11.06z', label: 'Services' },
      { href: '/office-ai/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', label: 'Reviews' },
      { href: '/office-ai/driver-routing', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', label: 'Driver Routing' },
    ],
  },
  {
    title: 'Sales & Support',
    items: [
      { href: '/office-ai/sales-calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Sales Calls' },
      { href: '/office-ai/phone-support', icon: 'M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414', label: 'Phone Support' },
      { href: '/office-ai/taxes', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', label: 'Taxes' },
      { href: '/office-ai/commissions', icon: 'M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9', label: 'Commissions' },
    ],
  },
  {
    title: 'AI',
    items: [
      { href: '/office-ai/ai-assistant', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'AI Assistant' },
      { href: '/office-ai/modules', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', label: 'Modules' },
    ],
  },
];

const SETTINGS_ITEM = {
  href: '/office-ai/settings',
  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  label: 'Settings',
};

/* ── Main Shell ── */

const PUBLIC_PATHS = ['/office-ai'];
const ALWAYS_ON_MODULES = new Set(['dashboard', 'modules']);

export default function OfficeAIShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enabledModules, setEnabledModules] = useState<Set<string> | null>(null);
  const services = useServiceStatus(60000);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Load enabled modules from settings
  useEffect(() => {
    if (!user) return;
    getSettings().then((data: any) => {
      const mods = data?.enabled_modules;
      if (mods && Array.isArray(mods) && mods.length > 0) {
        setEnabledModules(new Set(mods));
      }
      // null = show all (no config saved yet)
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!loading && !user && !isPublicPath) router.push('/login');
  }, [user, loading, router, pathname, isPublicPath]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Public pages without auth — render children directly
  if (!loading && !user && isPublicPath) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // Filter nav sections based on enabled modules
  const filteredSections = useMemo(() => {
    if (!enabledModules) return NAV_SECTIONS; // no config yet = show all
    return NAV_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const moduleId = item.href.replace('/office-ai/', '');
        return ALWAYS_ON_MODULES.has(moduleId) || enabledModules.has(moduleId);
      }),
    })).filter(section => section.items.length > 0);
  }, [enabledModules]);

  // Find current page label
  const allItems = filteredSections.flatMap(s => s.items);
  const currentPage = allItems.find(n => pathname.startsWith(n.href)) || allItems[0];

  function isActive(href: string): boolean {
    if (href === '/office-ai/dashboard') return pathname === '/office-ai/dashboard';
    return pathname.startsWith(href);
  }

  /* ── Desktop sidebar ── */
  const sidebar = (
    <aside
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
      className="relative z-30 hidden md:flex flex-col border-r transition-all duration-200 ease-out"
      style={{ width: sidebarOpen ? 220 : 64, borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center border-b" style={{ height: 64, borderColor: 'var(--ept-border)' }}>
        <Link href="/" title="Back to Home">
          <img src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" style={{ height: sidebarOpen ? 40 : 32, width: 'auto', transition: 'height 0.2s ease' }} />
        </Link>
      </div>

      {/* Back to dashboard */}
      <Link href="/dashboard" title={!sidebarOpen ? 'Main Dashboard' : undefined} className="flex items-center gap-3 mx-2 mt-2 mb-1 rounded-xl text-sm transition-all duration-150" style={{ padding: '8px 12px', color: 'var(--ept-text-muted)', backgroundColor: 'transparent' }}>
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span className="truncate transition-all duration-200 whitespace-nowrap" style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden', fontSize: 12 }}>Main Dashboard</span>
      </Link>
      <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)' }} />

      {/* Nav sections */}
      <nav className="flex-1 py-1 overflow-y-auto overflow-x-hidden">
        {filteredSections.map((section) => (
          <div key={section.title} style={{ marginBottom: 6 }}>
            {sidebarOpen && (
              <p className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>
                {section.title}
              </p>
            )}
            {!sidebarOpen && (
              <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)', opacity: 0.4 }} />
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} title={!sidebarOpen ? item.label : undefined} className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm transition-all duration-150" style={{ padding: '10px 12px', color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent', fontWeight: active ? 600 : 400 }}>
                  <NavIcon d={item.icon} />
                  <span className="truncate transition-all duration-200" style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {/* Settings */}
        <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)', opacity: 0.4 }} />
        {(() => {
          const active = isActive(SETTINGS_ITEM.href);
          return (
            <Link href={SETTINGS_ITEM.href} title={!sidebarOpen ? SETTINGS_ITEM.label : undefined} className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm transition-all duration-150" style={{ padding: '10px 12px', color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent', fontWeight: active ? 600 : 400 }}>
              <NavIcon d={SETTINGS_ITEM.icon} />
              <span className="truncate transition-all duration-200" style={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0, overflow: 'hidden' }}>{SETTINGS_ITEM.label}</span>
            </Link>
          );
        })()}
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
            <img src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" style={{ height: 18, width: 'auto', opacity: 0.4 }} />
          </div>
        )}
      </div>
    </aside>
  );

  /* ── Mobile sidebar ── */
  const mobileSidebar = (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} aria-hidden />
      )}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col border-r md:hidden transition-transform duration-200"
        style={{
          width: 280,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderColor: 'var(--ept-border)',
          backgroundColor: 'var(--ept-card-bg)',
        }}
      >
        <div className="flex items-center justify-between border-b px-4" style={{ height: 64, borderColor: 'var(--ept-border)' }}>
          <Link href="/">
            <img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" style={{ height: 28, width: 'auto' }} />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1" style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <Link href="/dashboard" className="flex items-center gap-3 mx-3 mt-2 mb-1 rounded-xl text-sm" style={{ padding: '10px 12px', color: 'var(--ept-text-muted)' }} onClick={() => setMobileOpen(false)}>
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span style={{ fontSize: 12 }}>Main Dashboard</span>
        </Link>
        <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)' }} />

        <nav className="flex-1 py-1 overflow-y-auto px-1">
          {filteredSections.map((section) => (
            <div key={section.title} style={{ marginBottom: 6 }}>
              <p className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>
                {section.title}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm" style={{ padding: '10px 12px', color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent', fontWeight: active ? 600 : 400 }} onClick={() => setMobileOpen(false)}>
                    <NavIcon d={item.icon} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="mx-3 my-1" style={{ height: 1, backgroundColor: 'var(--ept-border)', opacity: 0.4 }} />
          {(() => {
            const active = isActive(SETTINGS_ITEM.href);
            return (
              <Link href={SETTINGS_ITEM.href} className="flex items-center gap-3 mx-2 my-0.5 rounded-xl text-sm" style={{ padding: '10px 12px', color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: active ? 'var(--ept-accent-glow)' : 'transparent', fontWeight: active ? 600 : 400 }} onClick={() => setMobileOpen(false)}>
                <NavIcon d={SETTINGS_ITEM.icon} />
                <span className="truncate">{SETTINGS_ITEM.label}</span>
              </Link>
            );
          })()}
        </nav>

        <div className="border-t py-3 px-3" style={{ borderColor: 'var(--ept-border)' }}>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--ept-text-muted)' }}>Powered by</p>
            <p className="gradient-text text-[11px] font-semibold tracking-wider">ECHO PRIME TECHNOLOGIES</p>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {sidebar}
      {mobileSidebar}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 border-b" style={{ height: 64, borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile hamburger */}
            <button className="md:hidden p-1" onClick={() => setMobileOpen(true)} style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <Link href="/" className="hidden md:block"><img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" style={{ height: 32, width: 'auto' }} /></Link>
            <div className="hidden md:block" style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ept-text-muted)' }}>AI Office Assistant</h1>
            <span className="hidden md:inline text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>{currentPage?.label}</span>
            <div className="hidden md:block" style={{ width: 1, height: 20, backgroundColor: 'var(--ept-border)' }} />
            <div className="hidden lg:flex items-center gap-3">
              {services.map(svc => (
                <div key={svc.name} className="flex items-center gap-1.5" title={svc.latency ? `${svc.name}: ${svc.latency}ms` : svc.name}>
                  <StatusDot status={svc.status} pulse={svc.status === 'online'} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{
                    color: svc.status === 'online' ? '#10b981' : svc.status === 'offline' ? '#ef4444' : '#f59e0b',
                  }}>
                    {svc.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:opacity-70" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }} title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}>
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="var(--ept-accent)" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="var(--ept-accent)" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
            <span className="hidden md:inline text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-lg border" style={{ borderColor: 'var(--ept-border)' }} />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <button onClick={handleSignOut} className="text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-opacity hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Sign Out</button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Echo Prime AI Copilot */}
      <OfficeAICopilot />

      <style>{`
        @keyframes statusPing {
          0% { transform: scale(1); opacity: 0.4; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes echoBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

/* ── Office AI Copilot Floating Widget ── */

interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function OfficeAICopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setLoading(true);
    try {
      const res = await fetch(`${ECHO_CHAT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, personality: 'belle', site_id: 'office-ai' }),
      });
      const data = await res.json();
      const reply = data?.response || data?.message || data?.content || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Echo AI Assistant"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 52, height: 52, borderRadius: 16,
          backgroundColor: 'var(--ept-accent)', color: '#fff',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.35)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
      >
        EP
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 50,
      width: 380, maxHeight: 520,
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--ept-border)',
      backgroundColor: 'var(--ept-card-bg)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: 'var(--ept-accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          }}>EP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ept-text)' }}>Echo Prime</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Office Intelligence</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ept-text-muted)', cursor: 'pointer', padding: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 300, maxHeight: 360 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>&#9889;</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-secondary)', marginBottom: 4 }}>Echo Office AI</p>
            <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', lineHeight: 1.6 }}>
              Ask about invoices, payroll, scheduling, inventory, taxes, analytics, or any business operation.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
              fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              backgroundColor: msg.role === 'user' ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--ept-text)',
              border: msg.role === 'assistant' ? '1px solid var(--ept-border)' : 'none',
            }}>
              {msg.content}
            </div>
            <span style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 2, padding: '0 4px' }}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ept-accent)', opacity: 0.6, animation: `echoBounce 1s ${i * 0.15}s infinite` }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--ept-border)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about your business..."
          style={{
            flex: 1, padding: '8px 12px', fontSize: 12,
            color: 'var(--ept-text)', backgroundColor: 'var(--ept-surface)',
            border: '1px solid var(--ept-border)', borderRadius: 10,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 34, height: 34, borderRadius: 10, border: 'none',
            backgroundColor: 'var(--ept-accent)', color: '#fff',
            cursor: loading || !input.trim() ? 'default' : 'pointer',
            opacity: loading || !input.trim() ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
}
