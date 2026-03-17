'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getArAging, type ArAgingData } from '../../../lib/business-api';
import { formatCurrency, formatDate } from '../../../lib/business-utils';
import { BarChart3, DollarSign, Clock, AlertTriangle, FileText, TrendingUp } from 'lucide-react';

function getBucketBadge(label: string): string {
  if (label.includes('Current') || label.includes('0-30') || label === '0-30') return 'badge-success';
  if (label.includes('31-60') || label === '31-60') return 'badge-warning';
  if (label.includes('61-90') || label === '61-90') return 'badge-warning';
  if (label.includes('90') || label.includes('91')) return 'badge-danger';
  return 'badge-success';
}

function getRowColor(days: number): string {
  if (days <= 30) return '#22c55e';
  if (days <= 60) return '#eab308';
  if (days <= 90) return '#f97316';
  return '#ef4444';
}

function getBucketAccent(label: string): string {
  if (label.includes('Current') || label.includes('0-30') || label === '0-30') return '#22c55e';
  if (label.includes('31-60') || label === '31-60') return '#eab308';
  if (label.includes('61-90') || label === '61-90') return '#f97316';
  if (label.includes('90') || label.includes('91')) return '#ef4444';
  return '#22c55e';
}

const BUCKET_ICONS = [DollarSign, Clock, AlertTriangle, AlertTriangle] as const;

export default function ArApPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<ArAgingData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await getArAging();
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const totalOutstanding = data?.buckets?.reduce((sum, b) => sum + b.total, 0) || 0;
  const totalInvoices = data?.buckets?.reduce((sum, b) => sum + b.count, 0) || 0;

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--ept-text)' }}>
          <BarChart3 className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
          Accounts Receivable Aging
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
          {formatCurrency(totalOutstanding)} outstanding across {totalInvoices} invoices
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-sm underline">dismiss</button>
        </div>
      )}

      {loadingData ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : !data ? (
        <div className="glass-card p-8 text-center rounded-xl" style={{ color: 'var(--ept-text-muted)' }}>
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No aging data available.</p>
        </div>
      ) : (
        <>
          {/* Aging Buckets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(data.buckets || []).map((bucket, idx) => {
              const accent = getBucketAccent(bucket.label);
              const Icon = BUCKET_ICONS[Math.min(idx, BUCKET_ICONS.length - 1)];
              return (
                <div key={idx} className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                    <span className="text-xs font-semibold" style={{ color: accent }}>{bucket.label}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: accent }}>{formatCurrency(bucket.total)}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>
                    {bucket.count} invoice{bucket.count !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total bar */}
          {data.buckets && data.buckets.length > 0 && totalOutstanding > 0 && (
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Distribution</span>
              </div>
              <div className="rounded-lg overflow-hidden h-3 flex" style={{ backgroundColor: 'var(--ept-surface)' }}>
                {data.buckets.map((bucket, idx) => {
                  const pct = (bucket.total / totalOutstanding) * 100;
                  if (pct <= 0) return null;
                  const accent = getBucketAccent(bucket.label);
                  return (
                    <div
                      key={idx}
                      style={{ width: `${pct}%`, backgroundColor: accent, opacity: 0.8 }}
                      title={`${bucket.label}: ${formatCurrency(bucket.total)} (${pct.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Invoice Detail Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderBottomColor: 'var(--ept-border)' }}>
              <FileText className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Outstanding Invoices</h2>
            </div>
            {(data.invoices || []).length === 0 ? (
              <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No outstanding invoices.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Invoice</th>
                      <th className="text-left">Customer</th>
                      <th className="text-left hidden md:table-cell">Issue Date</th>
                      <th className="text-left hidden md:table-cell">Due Date</th>
                      <th className="text-center">Days Out</th>
                      <th className="text-left hidden lg:table-cell">Bucket</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices
                      .sort((a, b) => b.days_outstanding - a.days_outstanding)
                      .map((inv, idx) => {
                        const rowColor = getRowColor(inv.days_outstanding);
                        const badgeCls = getBucketBadge(inv.bucket);
                        return (
                          <tr key={idx}>
                            <td className="font-medium" style={{ color: 'var(--ept-text)' }}>{inv.invoice_number}</td>
                            <td style={{ color: 'var(--ept-text)' }}>{inv.customer_name}</td>
                            <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(inv.issue_date)}</td>
                            <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(inv.due_date)}</td>
                            <td className="text-center">
                              <span className="font-semibold" style={{ color: rowColor }}>{inv.days_outstanding}</span>
                            </td>
                            <td className="hidden lg:table-cell">
                              <span className={`badge ${badgeCls}`}>{inv.bucket}</span>
                            </td>
                            <td className="text-right font-medium" style={{ color: rowColor }}>{formatCurrency(inv.amount)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
