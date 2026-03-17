'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { formatCurrency } from '../../../lib/business-utils';
import { getSummary, getRevenue, getExpenseAnalytics, type AnalyticsSummary, type RevenueData, type ExpenseAnalytics } from '../../../lib/business-api';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseAnalytics | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [sumData, revData, expData] = await Promise.all([
        getSummary(),
        getRevenue(),
        getExpenseAnalytics(),
      ]);
      setSummary(sumData);
      setRevenue(revData);
      setExpenses(expData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (loadingData) return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={28} style={{ color: 'var(--ept-accent)' }} />
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Analytics</h1>
      </div>
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    </div>
  );

  const profit = (summary?.total_revenue || 0) - (summary?.total_expenses || 0);
  const maxRevenue = Math.max(...(revenue?.monthly || []).map(m => m.revenue), 1);
  const maxExpense = Math.max(...(expenses?.by_category || []).map(c => c.total), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={28} style={{ color: 'var(--ept-accent)' }} />
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Analytics</h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="underline text-sm">dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: formatCurrency(summary?.total_revenue || 0), color: '#22c55e', icon: TrendingUp, arrow: ArrowUpRight },
          { label: 'Expenses', value: formatCurrency(summary?.total_expenses || 0), color: '#ef4444', icon: DollarSign, arrow: ArrowDownRight },
          { label: 'Profit', value: formatCurrency(profit), color: profit >= 0 ? '#22c55e' : '#ef4444', icon: Activity, arrow: profit >= 0 ? ArrowUpRight : ArrowDownRight },
          { label: 'Bookings', value: String(summary?.monthly_bookings || 0), color: 'var(--ept-accent)', icon: Calendar, arrow: ArrowUpRight },
        ].map(card => (
          <div key={card.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</span>
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</span>
              <card.arrow size={14} style={{ color: card.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: 'var(--ept-accent)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Revenue Trend</h2>
          </div>
          {(revenue?.monthly && revenue.monthly.length > 0) ? (
            <div className="flex items-end gap-2" style={{ height: '180px' }}>
              {revenue.monthly.map((m, i) => {
                const pct = Math.max((m.revenue / maxRevenue) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>{formatCurrency(m.revenue)}</div>
                    <div
                      className="w-full rounded-t"
                      style={{ height: `${pct}%`, backgroundColor: 'var(--ept-accent)', minHeight: '4px' }}
                    />
                    <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{m.month.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-center py-8" style={{ color: 'var(--ept-text-muted)' }}>No revenue data</div>
          )}
          {revenue?.ytd !== undefined && (
            <div className="mt-3 text-sm font-medium text-right flex items-center justify-end gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
              <DollarSign size={14} /> YTD: {formatCurrency(revenue.ytd)}
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={16} style={{ color: 'var(--ept-accent)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Expenses by Category</h2>
          </div>
          {(expenses?.by_category && expenses.by_category.length > 0) ? (
            <div className="space-y-3">
              {expenses.by_category.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{cat.category}</span>
                    <span style={{ color: 'var(--ept-text-muted)' }}>{formatCurrency(cat.total)} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${Math.max((cat.total / maxExpense) * 100, 2)}%`, backgroundColor: 'var(--ept-accent)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center py-8" style={{ color: 'var(--ept-text-muted)' }}>No expense data</div>
          )}
          {expenses?.ytd !== undefined && (
            <div className="mt-3 text-sm font-medium text-right flex items-center justify-end gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
              <DollarSign size={14} /> YTD: {formatCurrency(expenses.ytd)}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Expense Trend */}
      {expenses?.monthly && expenses.monthly.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} style={{ color: '#ef4444' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Monthly Expense Trend</h2>
          </div>
          <div className="flex items-end gap-2" style={{ height: '150px' }}>
            {expenses.monthly.map((m, i) => {
              const maxExp = Math.max(...expenses.monthly.map(x => x.total), 1);
              const pct = Math.max((m.total / maxExp) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>{formatCurrency(m.total)}</div>
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${pct}%`, backgroundColor: '#ef4444', opacity: 0.7, minHeight: '4px' }}
                  />
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{m.month.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Outstanding AR */}
      {summary && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--ept-accent)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Quick Stats</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-xs flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                <Users size={12} /> Active Customers
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{summary.active_customers}</div>
            </div>
            <div>
              <div className="text-xs flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                <DollarSign size={12} /> Outstanding AR
              </div>
              <div className="text-lg font-bold" style={{ color: '#eab308' }}>{formatCurrency(summary.outstanding_ar)}</div>
            </div>
            <div>
              <div className="text-xs flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                <Calendar size={12} /> Monthly Bookings
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>{summary.monthly_bookings}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
