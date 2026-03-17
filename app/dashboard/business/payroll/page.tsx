'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { formatCurrency, getStatusBadge } from '../../../../lib/business-utils';
import { getPayrollRuns, createPayrollRun, getPayrollRun, approvePayrollRun, type PayrollRun, type PayrollItem } from '../../../../lib/business-api';
import { Wallet, Plus, DollarSign, Calendar, Download, CheckCircle, Clock, AlertTriangle, Eye, X } from 'lucide-react';

export default function PayrollPage() {
  const { user, loading } = useAuth();
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [saving, setSaving] = useState(false);

  const loadRuns = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getPayrollRuns();
      setRuns(data.runs || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load payroll runs');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadRuns(); }, [user, loadRuns]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError('');
      await createPayrollRun({ period_start: periodStart, period_end: periodEnd });
      setShowCreateModal(false);
      setPeriodStart('');
      setPeriodEnd('');
      loadRuns();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      setError('');
      const data = await getPayrollRun(id);
      setSelectedRun(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setError('');
      await approvePayrollRun(id);
      loadRuns();
      if (selectedRun?.id === id) handleViewDetail(id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    }
  };

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wallet size={28} style={{ color: 'var(--ept-accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Payroll</h1>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> New Payroll Run
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <AlertTriangle size={18} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="underline text-sm">dismiss</button>
        </div>
      )}

      {/* Runs List */}
      <div className="glass-card overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : runs.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            No payroll runs found. <button onClick={() => setShowCreateModal(true)} className="underline" style={{ color: 'var(--ept-accent)' }}>Create one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Period</th>
                  <th className="text-left">Status</th>
                  <th className="text-right hidden md:table-cell">Gross</th>
                  <th className="text-right hidden md:table-cell">Deductions</th>
                  <th className="text-right">Net</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => {
                  const badge = getStatusBadge(run.status);
                  return (
                    <tr key={run.id}>
                      <td style={{ color: 'var(--ept-text)' }}>
                        <div className="font-medium flex items-center gap-2">
                          <Calendar size={14} style={{ color: 'var(--ept-text-muted)' }} />
                          {run.period_start} to {run.period_end}
                        </div>
                      </td>
                      <td><span className={badge.className}>{badge.label}</span></td>
                      <td className="text-right hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{formatCurrency(run.gross_total)}</td>
                      <td className="text-right hidden md:table-cell" style={{ color: '#ef4444' }}>{formatCurrency(run.deductions_total)}</td>
                      <td className="text-right font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(run.net_total)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleViewDetail(run.id)} className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>
                            <Eye size={12} /> View
                          </button>
                          {run.status === 'draft' && (
                            <button onClick={() => handleApprove(run.id)} className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: '#22c55e' }}>
                              <CheckCircle size={12} /> Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail View */}
      {selectedRun && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
              <Download size={18} style={{ color: 'var(--ept-accent)' }} />
              Payroll: {selectedRun.period_start} to {selectedRun.period_end}
            </h2>
            <button onClick={() => setSelectedRun(null)} className="btn-outline px-3 py-1 rounded-lg text-xs flex items-center gap-1">
              <X size={14} /> Close
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Gross Total', value: formatCurrency(selectedRun.gross_total), color: 'var(--ept-text)', icon: DollarSign },
              { label: 'Deductions', value: formatCurrency(selectedRun.deductions_total), color: '#ef4444', icon: AlertTriangle },
              { label: 'Net Total', value: formatCurrency(selectedRun.net_total), color: '#22c55e', icon: CheckCircle },
            ].map(card => (
              <div key={card.label} className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <card.icon size={14} style={{ color: 'var(--ept-text-muted)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Items table */}
          {loadingDetail ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : (selectedRun.items && selectedRun.items.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="text-left">Employee</th>
                    <th className="text-right">Reg Hrs</th>
                    <th className="text-right">OT Hrs</th>
                    <th className="text-right hidden md:table-cell">Rate</th>
                    <th className="text-right">Gross</th>
                    <th className="text-right hidden md:table-cell">Deductions</th>
                    <th className="text-right">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRun.items.map((item: PayrollItem) => (
                    <tr key={item.id}>
                      <td className="font-medium" style={{ color: 'var(--ept-text)' }}>{item.employee_name || item.employee_id}</td>
                      <td className="text-right" style={{ color: 'var(--ept-text-secondary)' }}>{item.regular_hours}</td>
                      <td className="text-right" style={{ color: item.overtime_hours > 0 ? '#eab308' : 'var(--ept-text-muted)' }}>{item.overtime_hours}</td>
                      <td className="text-right hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>${item.hourly_rate}/hr</td>
                      <td className="text-right" style={{ color: 'var(--ept-text)' }}>{formatCurrency(item.gross_pay)}</td>
                      <td className="text-right hidden md:table-cell" style={{ color: '#ef4444' }}>{formatCurrency(item.deductions)}</td>
                      <td className="text-right font-medium" style={{ color: '#22c55e' }}>{formatCurrency(item.net_pay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-center py-4" style={{ color: 'var(--ept-text-muted)' }}>No employee breakdown available.</div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCreateModal(false)}>
          <div className="glass-card w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                <Wallet size={18} /> Create Payroll Run
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ color: 'var(--ept-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                  <Calendar size={12} /> Period Start *
                </label>
                <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                  <Calendar size={12} /> Period End *
                </label>
                <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowCreateModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleCreate} disabled={saving || !periodStart || !periodEnd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
