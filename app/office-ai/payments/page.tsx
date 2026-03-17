'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  CreditCard, DollarSign, ArrowUpRight, CheckCircle, XCircle,
  Clock, Filter, X, Plus, Search, RefreshCw,
} from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  customer: string;
  amount: number;
  method: 'card' | 'cash' | 'check' | 'ach' | 'paypal';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  reference: string;
}

const DEMO_PAYMENTS: Payment[] = [
  { id: '1', date: '2026-03-14', customer: 'Johnson Residence', amount: 450, method: 'card', status: 'completed', reference: 'INV-1042' },
  { id: '2', date: '2026-03-14', customer: 'Smith Office Complex', amount: 1200, method: 'ach', status: 'completed', reference: 'INV-1041' },
  { id: '3', date: '2026-03-13', customer: 'Garcia Family', amount: 250, method: 'cash', status: 'completed', reference: 'INV-1040' },
  { id: '4', date: '2026-03-13', customer: 'Downtown Clinic', amount: 875, method: 'check', status: 'pending', reference: 'INV-1039' },
  { id: '5', date: '2026-03-12', customer: 'Permian Realty', amount: 2100, method: 'card', status: 'completed', reference: 'INV-1038' },
  { id: '6', date: '2026-03-12', customer: 'Brown & Associates', amount: 600, method: 'paypal', status: 'refunded', reference: 'INV-1037' },
  { id: '7', date: '2026-03-11', customer: 'Mesa Verde HOA', amount: 3400, method: 'ach', status: 'completed', reference: 'INV-1036' },
  { id: '8', date: '2026-03-11', customer: 'Quick Stop #12', amount: 175, method: 'card', status: 'failed', reference: 'INV-1035' },
];

const STATUS_BADGE: Record<string, string> = {
  completed: 'badge-success', pending: 'badge-warning', failed: 'badge-danger', refunded: 'badge-info',
};

const STATUS_ICON: Record<string, typeof CheckCircle> = {
  completed: CheckCircle, pending: Clock, failed: XCircle, refunded: RefreshCw,
};

const METHOD_LABEL: Record<string, string> = {
  card: 'Credit Card', cash: 'Cash', check: 'Check', ach: 'ACH Transfer', paypal: 'PayPal',
};

export default function PaymentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments] = useState<Payment[]>(DEMO_PAYMENTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);

  if (loading || !user) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>;

  const filtered = payments.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.customer.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  // Method breakdown
  const methodTotals: Record<string, number> = {};
  payments.filter(p => p.status === 'completed').forEach(p => { methodTotals[p.method] = (methodTotals[p.method] || 0) + p.amount; });
  const methodEntries = Object.entries(methodTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
            <CreditCard size={28} style={{ color: 'var(--ept-accent)' }} />
            Payments
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Track incoming payments and payment methods
          </p>
        </div>
        <button className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={18} style={{ color: 'var(--ept-success)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Completed</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ept-success)' }}>{fmt(totalCompleted)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} style={{ color: '#eab308' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Pending</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#eab308' }}>{fmt(totalPending)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} style={{ color: 'var(--ept-accent)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Total Transactions</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{payments.length}</div>
        </div>
      </div>

      {/* Method Breakdown */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Payment Method Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {methodEntries.map(([method, total]) => {
            const pct = totalCompleted > 0 ? Math.round((total / totalCompleted) * 100) : 0;
            return (
              <div key={method} className="p-3 rounded-lg flex-1 min-w-[140px]" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>{METHOD_LABEL[method] || method}</div>
                <div className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{fmt(total)}</div>
                <div className="text-xs" style={{ color: 'var(--ept-accent)' }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: 'var(--ept-text-muted)' }} />
          {['all', 'completed', 'pending', 'failed', 'refunded'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusFilter === s ? 'btn-glow' : 'btn-outline'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ept-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th style={{ color: 'var(--ept-text-muted)' }}>Date</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Customer</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Reference</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Amount</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Method</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: 'var(--ept-text-muted)' }}>No payments match your filters.</td></tr>
              ) : filtered.map(p => {
                const Icon = STATUS_ICON[p.status] || CheckCircle;
                return (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--ept-text-secondary)' }}>{p.date}</td>
                    <td className="font-medium" style={{ color: 'var(--ept-text)' }}>{p.customer}</td>
                    <td className="font-mono text-xs" style={{ color: 'var(--ept-text-muted)' }}>{p.reference}</td>
                    <td className="font-semibold" style={{ color: 'var(--ept-text)' }}>{fmt(p.amount)}</td>
                    <td style={{ color: 'var(--ept-text-secondary)' }}>{METHOD_LABEL[p.method]}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[p.status]} flex items-center gap-1 w-fit`}>
                        <Icon size={10} />
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
