'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import {
  LayoutDashboard, Brain, Briefcase, BarChart3,
  Cpu, ShoppingBag, CreditCard, Settings, ChevronLeft,
  Shield, Search, BookOpen, Zap, Gamepad2, Eye,
  Phone, Crosshair, Home, DollarSign, FolderKanban, Church,
  Headset, Users,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/sentinel', label: 'Sentinel AI', icon: Brain },
  { href: '/engines', label: 'Engines', icon: Cpu },
  { href: '/closer', label: 'AI Closer', icon: Phone },
  { href: '/call-center', label: 'Call Center', icon: Phone },
  { href: '/gamer-companion', label: 'GGI Apex Predator', icon: Gamepad2 },
  { href: '/home-ai', label: 'Home AI', icon: Home },
  { href: '/intel-hub', label: 'Intel Hub', icon: Crosshair, ownerOnly: true },
  { href: '/finance-ai', label: 'Finance AI', icon: DollarSign },
  { href: '/shepherd', label: 'Shepherd AI', icon: Church },
  { href: '/project-manager', label: 'Project Manager', icon: FolderKanban },
  { href: '/helpdesk', label: 'Helpdesk', icon: Headset },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/dashboard/business', label: 'Business Manager', icon: Briefcase },
  { href: '/dashboard/permian-pulse', label: 'Permian Pulse', icon: BarChart3, ownerOnly: true },
  { href: '/services', label: 'Services', icon: ShoppingBag },
  { href: '/sdk', label: 'SDK', icon: Zap },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/security', label: 'Security', icon: Shield },
  { href: '/surveillance', label: 'Surveillance', icon: Eye, ownerOnly: true },
  { href: '/scanner', label: 'Scanner', icon: Search },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role, displayName } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );
  if (!user) return null;

  const isOwner = role === 'owner';

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const visibleItems = NAV_ITEMS.filter(item => !item.ownerOnly || isOwner);

  // Business sub-routes have their own sidebar layout — don't render ours
  const hasOwnLayout = pathname.startsWith('/dashboard/business');

  if (hasOwnLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ── Top nav bar ── */}
      <nav
        className="border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
        data-tutorial="dashboard-nav"
      >
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="EPT"
            width={400}
            height={260}
            className="w-[120px] md:w-[160px] h-auto"
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold hidden sm:inline" style={{ color: 'var(--ept-text-muted)' }}>
            {displayName || user.email?.split('@')[0]}
          </span>
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border" style={{ borderColor: 'var(--ept-border)' }} />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              {(displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
      </nav>

      <div className="flex">
        {/* ── Left sidebar — desktop ── */}
        <aside
          className="hidden lg:flex flex-col w-60 fixed top-[57px] bottom-0 border-r overflow-y-auto no-print"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}
          data-tutorial="dashboard-sidebar"
        >
          <div className="p-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>
              Control Center
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {visibleItems.map(item => {
              const active = isActive(item.href, item.exact);
              return (
                <Link key={item.href} href={item.href} className={`sidebar-link${active ? ' active' : ''}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.ownerOnly && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ef444418', color: '#ef4444' }}>
                      OWNER
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
            <Link href="/" className="sidebar-link">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* ── Mobile bottom nav ── */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex overflow-x-auto scrollbar-hide no-print"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}
        >
          {visibleItems.slice(0, 6).map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] text-[10px]"
                style={{ color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}
              >
                <item.icon className="w-5 h-5 mb-0.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Main content ── */}
        <main className="flex-1 lg:ml-60 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
