'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import {
  LayoutDashboard, Users, CalendarDays, FileText, Receipt,
  DollarSign, Clock, UserCog, BarChart3, Star, Settings, CreditCard,
  Package, ClipboardList, Sparkles, ArrowLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/business', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/business/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/dashboard/business/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/business/quotes', label: 'Quotes', icon: ClipboardList },
  { href: '/dashboard/business/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/business/expenses', label: 'Expenses', icon: Receipt },
  { href: '/dashboard/business/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/business/ar-ap', label: 'AR / AP', icon: DollarSign },
  { href: '/dashboard/business/employees', label: 'Employees', icon: UserCog },
  { href: '/dashboard/business/hours', label: 'Hours', icon: Clock },
  { href: '/dashboard/business/payroll', label: 'Payroll', icon: CreditCard },
  { href: '/dashboard/business/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/business/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/business/settings', label: 'Settings', icon: Settings },
];

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );
  if (!user) return null;

  const isActive = (href: string) => {
    if (href === '/dashboard/business') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Desktop sidebar — fixed, below main site nav */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed top-16 bottom-0 border-r overflow-y-auto no-print"
        style={{ backgroundColor: 'var(--ept-sidebar-bg, var(--ept-card-bg))', borderColor: 'var(--ept-border)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />
            <span className="font-bold" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
          </div>
          <p className="text-xs mt-1 truncate" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link${active ? ' active' : ''}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <Link href="/dashboard" className="sidebar-link">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex overflow-x-auto scrollbar-hide no-print"
        style={{ backgroundColor: 'var(--ept-sidebar-bg, var(--ept-card-bg))', borderColor: 'var(--ept-border)' }}
      >
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] text-xs"
              style={{ color: active ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
