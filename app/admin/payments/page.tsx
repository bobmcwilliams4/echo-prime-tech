'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import {
  getRevenueSummary,
  listTransactions,
  listCustomers,
  type PayPalSummary,
  type PayPalTransaction,
  type PayPalCustomer,
} from '@/lib/paypal-api';

export default function PaymentsPage() {
  const { user, loading, role } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const [summary, setSummary] = useState<PayPalSummary | null>(null);
  const [transactions, setTransactions] = useState<PayPalTransaction[]>([]);
  const [customers, setCustomers] = useState<PayPalCustomer[]>([]);
  const [period, setPeriod] = useState(30);
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && role !== 'owner') router.push('/');
  }, [user, loading, role, router]);

  useEffect(() => {
    if (!user || role !== 'owner') return;
    loadData();
  }, [user, role, period, statusFilter]);

  async function loadData() {
    setLoadingData(true);
    setError('');
    try {
      const [s, t, c] = await Promise.all([
        getRevenueSummary(period),
        listTransactions({ status: statusFilter || undefined, limit: 50 }),
        listCustomers(20),
      ]);
      setSummary(s);
      setTransactions(t.transactions);
      setCustomers(c.customers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment data');
    } finally {
      setLoadingData(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={120} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <span className="text-sm font-mono" style={{ color: 'var(--ept-text-muted)' }}>/admin/payments</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>Admin</Link>
          <Link href="/admin/invoices" className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--ept-accent)' }}>Invoices</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Payment Dashboard</h1>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>PayPal Business revenue, transactions, and customer analytics.</p>

        {error && (
          <div className="p-4 rounded-xl border mb-6" style={{ borderColor: '#ef4444', backgroundColor: isDark ? '#1c1017' : '#fef2f2', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {[7, 30, 90, 365].map(d => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: period === d ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: period === d ? '#fff' : 'var(--ept-text-secondary)',
              }}
            >
              {d === 365 ? '1 Year' : `${d}d`}
            </button>
          ))}
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : summary && (
          <>
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Revenue', value: fmt(summary.revenue.total), sub: `${summary.revenue.transaction_count} transactions` },
                { label: 'Net Revenue', value: fmt(summary.net_revenue), sub: `After ${fmt(summary.fees.total)} fees` },
                { label: 'Refunds', value: fmt(summary.refunds.total), sub: `${summary.refunds.count} refunds` },
                { label: 'Active Subs', value: String(summary.subscriptions.active), sub: `${fmt(summary.subscriptions.mrr)} MRR` },
              ].map((card, i) => (
                <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{card.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Outstanding Invoices Banner */}
            {summary.outstanding_invoices.count > 0 && (
              <div className="p-4 rounded-xl border mb-8 flex items-center justify-between" style={{ borderColor: 'var(--ept-accent)', backgroundColor: isDark ? '#0a1f1f' : '#f0fdfa' }}>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--ept-accent)' }}>
                    {summary.outstanding_invoices.count} Outstanding Invoice{summary.outstanding_invoices.count > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{fmt(summary.outstanding_invoices.total)} awaiting payment</p>
                </div>
                <Link href="/admin/invoices" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  View Invoices
                </Link>
              </div>
            )}

            {/* Transaction History */}
            <div className="rounded-xl border overflow-hidden mb-8" style={{ borderColor: 'var(--ept-card-border)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Transactions</h2>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm rounded-lg px-3 py-1.5 border"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                >
                  <option value="">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="REFUND">Refunds</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                      {['ID', 'Type', 'Amount', 'Fee', 'Net', 'Status', 'Customer', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No transactions found</td></tr>
                    ) : transactions.map(tx => (
                      <tr key={tx.id} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>{tx.paypal_id?.slice(0, 12)}...</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.type === 'REFUND' ? 'bg-red-500/10 text-red-400' : tx.type === 'CAPTURE' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{fmt(tx.amount)}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{fmt(tx.fee)}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--ept-text-secondary)' }}>{fmt(tx.net)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--ept-text-secondary)' }}>{tx.customer_email || '—'}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Top Customers</h2>
                {summary.top_customers.length === 0 ? (
                  <p style={{ color: 'var(--ept-text-muted)' }}>No customers yet</p>
                ) : (
                  <div className="space-y-3">
                    {summary.top_customers.slice(0, 8).map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--ept-text)' }}>{c.name || c.email}</p>
                          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.invoice_count} invoices, {c.subscription_count} subs</p>
                        </div>
                        <p className="font-bold" style={{ color: 'var(--ept-accent)' }}>{fmt(c.total_spent)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Recent Customers</h2>
                {customers.length === 0 ? (
                  <p style={{ color: 'var(--ept-text-muted)' }}>No customers yet</p>
                ) : (
                  <div className="space-y-3">
                    {customers.slice(0, 8).map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--ept-text)' }}>{c.name || c.email}</p>
                          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Since {new Date(c.first_seen).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold" style={{ color: 'var(--ept-text-secondary)' }}>{fmt(c.total_spent)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
