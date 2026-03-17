'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { getSummary, type AnalyticsSummary, type Booking } from '../../../lib/business-api';
import StatCard from '../../../components/business/StatCard';
import DataTable, { type Column } from '../../../components/business/DataTable';
import { formatCurrency, formatDate, getStatusBadge } from '../../../lib/business-utils';
import {
  DollarSign, Users, CalendarDays, AlertTriangle,
  FileText, BarChart3, Plus, ClipboardList,
} from 'lucide-react';

export default function BusinessDashboardPage() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      getSummary()
        .then(setSummary)
        .catch(e => setError(e.message));
    }
  }, [user]);

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookingColumns: Column<any>[] = [
    { key: 'customer_name', label: 'Customer', render: (b) => <span style={{ color: 'var(--ept-text)' }}>{b.customer_name || 'Unknown'}</span> },
    { key: 'service_name', label: 'Service', render: (b: Booking & { service_name?: string }) => <span style={{ color: 'var(--ept-text-secondary)' }}>{b.service_name || '-'}</span> },
    { key: 'date', label: 'Date', render: (b) => <span style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(b.date)}</span> },
    {
      key: 'status', label: 'Status',
      render: (b) => {
        const badge = getStatusBadge(b.status);
        return <span className={badge.className}>{badge.label}</span>;
      },
    },
    { key: 'quoted_price', label: 'Price', align: 'right', render: (b) => <span className="font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(b.quoted_price)}</span> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>
          Business Dashboard
        </h1>
        <div className="flex gap-2">
          <Link href="/office-ai/bookings" className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            <Plus className="w-4 h-4" /> Booking
          </Link>
          <Link href="/office-ai/invoices" className="btn-outline inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Invoice
          </Link>
          <Link href="/office-ai/quotes" className="btn-outline hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Quote
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* KPI Cards with counting animation */}
      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={summary.total_revenue}
            prefix="$"
            decimals={2}
            icon={<DollarSign className="w-5 h-5" />}
            color="var(--ept-success)"
            chart={[3200, 4100, 3800, 5200, 4900, 6100, summary.total_revenue > 0 ? summary.total_revenue / 100 : 0]}
          />
          <StatCard
            label="Active Customers"
            value={summary.active_customers}
            icon={<Users className="w-5 h-5" />}
            color="var(--ept-accent)"
            chart={[5, 8, 12, 10, 15, 18, summary.active_customers]}
          />
          <StatCard
            label="Monthly Bookings"
            value={summary.monthly_bookings}
            icon={<CalendarDays className="w-5 h-5" />}
            color="var(--ept-info, #3b82f6)"
            chart={[2, 5, 3, 7, 6, 9, summary.monthly_bookings]}
          />
          <StatCard
            label="Outstanding AR"
            value={summary.outstanding_ar}
            prefix="$"
            decimals={2}
            icon={<AlertTriangle className="w-5 h-5" />}
            color={summary.outstanding_ar > 0 ? 'var(--ept-danger)' : 'var(--ept-success)'}
          />
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: 'var(--ept-surface)' }} />
              <div className="h-8 w-32 rounded" style={{ backgroundColor: 'var(--ept-surface)' }} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Recent Bookings */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Recent Bookings</h2>
          <Link href="/office-ai/bookings" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>
            View All &rarr;
          </Link>
        </div>
        {summary?.recent_bookings ? (
          <DataTable
            columns={bookingColumns}
            data={summary.recent_bookings as any[]}
            emptyMessage="No recent bookings."
          />
        ) : !error ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-12 rounded animate-pulse" style={{ backgroundColor: 'var(--ept-surface)' }} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Booking', href: '/office-ai/bookings', icon: CalendarDays, color: 'var(--ept-accent)' },
          { label: 'New Invoice', href: '/office-ai/invoices', icon: FileText, color: 'var(--ept-info, #3b82f6)' },
          { label: 'New Quote', href: '/office-ai/quotes', icon: ClipboardList, color: 'var(--ept-purple, #a855f7)' },
          { label: 'Analytics', href: '/office-ai/analytics', icon: BarChart3, color: 'var(--ept-success)' },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="glass-card p-4 text-center card-hover"
          >
            <div className="flex justify-center mb-2">
              <link.icon className="w-7 h-7" style={{ color: link.color }} />
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{link.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
