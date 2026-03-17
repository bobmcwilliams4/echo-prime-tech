'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Receipt, Calculator, TrendingUp, DollarSign, Calendar,
  AlertCircle, CheckCircle, Clock,
} from 'lucide-react';

interface QuarterlyPayment {
  quarter: string;
  dueDate: string;
  estimated: number;
  paid: number;
  status: 'paid' | 'due' | 'overdue' | 'upcoming';
}

const DEMO_QUARTERS: QuarterlyPayment[] = [
  { quarter: 'Q1 2026', dueDate: '2026-04-15', estimated: 3200, paid: 3200, status: 'paid' },
  { quarter: 'Q2 2026', dueDate: '2026-06-15', estimated: 3450, paid: 3450, status: 'paid' },
  { quarter: 'Q3 2026', dueDate: '2026-09-15', estimated: 3100, paid: 0, status: 'due' },
  { quarter: 'Q4 2026', dueDate: '2026-01-15', estimated: 3500, paid: 0, status: 'upcoming' },
];

const STATUS_BADGE: Record<string, string> = {
  paid: 'badge-success', due: 'badge-warning', overdue: 'badge-danger', upcoming: 'badge-info',
};

export default function TaxesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quarters, setQuarters] = useState<QuarterlyPayment[]>(DEMO_QUARTERS);

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);

  if (loading || !user) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>;

  const ytdRevenue = 184500;
  const ytdExpenses = 72300;
  const taxableIncome = ytdRevenue - ytdExpenses;
  const effectiveRate = 24.5;
  const estimatedQuarterly = Math.round(taxableIncome * (effectiveRate / 100) / 4);
  const totalPaid = quarters.reduce((sum, q) => sum + q.paid, 0);
  const totalEstimated = quarters.reduce((sum, q) => sum + q.estimated, 0);

  const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
          <Receipt size={28} style={{ color: 'var(--ept-accent)' }} />
          Tax Management
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
          Track estimated taxes, quarterly payments, and tax projections
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Est. Quarterly Tax', value: fmt(estimatedQuarterly), icon: Calculator, color: 'var(--ept-accent)' },
          { label: 'YTD Revenue', value: fmt(ytdRevenue), icon: TrendingUp, color: 'var(--ept-success)' },
          { label: 'YTD Expenses', value: fmt(ytdExpenses), icon: DollarSign, color: 'var(--ept-danger)' },
          { label: 'Effective Tax Rate', value: `${effectiveRate}%`, icon: Receipt, color: 'var(--ept-info)' },
        ].map(card => (
          <div key={card.label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={18} style={{ color: card.color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Tax Projection */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: 'var(--ept-text)' }}>
          <TrendingUp size={16} style={{ color: 'var(--ept-accent)' }} />
          Annual Tax Projection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Projected Taxable Income</div>
            <div className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{fmt(taxableIncome)}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Total Estimated Tax</div>
            <div className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{fmt(totalEstimated)}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Remaining Balance</div>
            <div className="text-xl font-bold" style={{ color: totalEstimated - totalPaid > 0 ? 'var(--ept-danger)' : 'var(--ept-success)' }}>
              {fmt(totalEstimated - totalPaid)}
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Payment Tracker */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: 'var(--ept-text)' }}>
          <Calendar size={16} style={{ color: 'var(--ept-accent)' }} />
          Quarterly Payment Tracker
        </h2>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th style={{ color: 'var(--ept-text-muted)' }}>Quarter</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Due Date</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Estimated</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Paid</th>
                <th style={{ color: 'var(--ept-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map(q => (
                <tr key={q.quarter}>
                  <td className="font-medium" style={{ color: 'var(--ept-text)' }}>{q.quarter}</td>
                  <td style={{ color: 'var(--ept-text-secondary)' }}>{q.dueDate}</td>
                  <td style={{ color: 'var(--ept-text)' }}>{fmt(q.estimated)}</td>
                  <td style={{ color: q.paid > 0 ? 'var(--ept-success)' : 'var(--ept-text-muted)' }}>{fmt(q.paid)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[q.status]}`}>
                      {q.status === 'paid' && <CheckCircle size={10} className="inline mr-1" />}
                      {q.status === 'overdue' && <AlertCircle size={10} className="inline mr-1" />}
                      {q.status === 'due' && <Clock size={10} className="inline mr-1" />}
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(20,184,166,0.08)', borderColor: 'rgba(20,184,166,0.2)', color: 'var(--ept-accent)' }}>
        <AlertCircle size={18} className="shrink-0" />
        <span className="text-sm">Tax estimates are projections based on current revenue and expense data. Consult your tax professional for accurate filings.</span>
      </div>
    </div>
  );
}
