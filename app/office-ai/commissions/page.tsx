'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import {
  getSalesReps, createSalesRep, updateSalesRep, deleteSalesRep,
  getCommissions, createCommission, approveCommission, payCommission,
  getCustomers, getInvoices,
  type SalesRep, type Commission, type Customer, type Invoice,
} from '../../../lib/business-api';
import { formatCurrency } from '../../../lib/business-utils';
import {
  Handshake, Plus, UserPlus, DollarSign, CheckCircle, Clock,
  Trash2, Edit3, Save, X, ChevronDown,
} from 'lucide-react';

type View = 'reps' | 'commissions' | 'add-rep' | 'add-commission';

export default function CommissionsPage() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('reps');
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [totals, setTotals] = useState({ pending: 0, approved: 0, paid: 0 });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Add rep form
  const [repForm, setRepForm] = useState({ name: '', email: '', phone: '', commission_rate: 10, notes: '' });
  const [savingRep, setSavingRep] = useState(false);

  // Add commission form
  const [commForm, setCommForm] = useState({ rep_id: 0, customer_id: 0, invoice_id: 0, invoice_total: 0, notes: '' });
  const [savingComm, setSavingComm] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [repsData, commData] = await Promise.all([
        getSalesReps(),
        getCommissions(),
      ]);
      setReps(repsData.sales_reps);
      setCommissions(commData.commissions);
      setTotals(commData.totals);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadFormData = useCallback(async () => {
    try {
      const [custData, invData] = await Promise.all([
        getCustomers(),
        getInvoices('paid'),
      ]);
      setCustomers(custData.customers || []);
      setInvoices(invData.invoices || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleAddRep = async () => {
    if (!repForm.name.trim()) return;
    setSavingRep(true);
    try {
      await createSalesRep({ ...repForm, commission_rate: repForm.commission_rate });
      setRepForm({ name: '', email: '', phone: '', commission_rate: 10, notes: '' });
      setView('reps');
      await loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingRep(false);
    }
  };

  const handleAddCommission = async () => {
    if (!commForm.rep_id || !commForm.invoice_total) return;
    setSavingComm(true);
    try {
      await createCommission({
        rep_id: commForm.rep_id,
        customer_id: commForm.customer_id || undefined,
        invoice_id: commForm.invoice_id || undefined,
        invoice_total: commForm.invoice_total,
        notes: commForm.notes || undefined,
      });
      setCommForm({ rep_id: 0, customer_id: 0, invoice_id: 0, invoice_total: 0, notes: '' });
      setView('commissions');
      await loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingComm(false);
    }
  };

  const handleApprove = async (id: number) => {
    try { await approveCommission(id); await loadData(); } catch { /* ignore */ }
  };

  const handlePay = async (id: number) => {
    try { await payCommission(id); await loadData(); } catch { /* ignore */ }
  };

  const handleDeleteRep = async (id: number) => {
    try { await deleteSalesRep(id); await loadData(); } catch { /* ignore */ }
  };

  if (loading || !user || loadingData) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Handshake className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Sales & Commissions</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('reps')} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: view === 'reps' ? 'var(--ept-accent)' : 'var(--ept-border)', color: view === 'reps' ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: view === 'reps' ? 'rgba(20,184,166,0.1)' : 'transparent' }}>
            Sales Reps
          </button>
          <button onClick={() => setView('commissions')} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: view === 'commissions' ? 'var(--ept-accent)' : 'var(--ept-border)', color: view === 'commissions' ? 'var(--ept-accent)' : 'var(--ept-text-muted)', backgroundColor: view === 'commissions' ? 'rgba(20,184,166,0.1)' : 'transparent' }}>
            Commissions
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Pending</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{formatCurrency(totals.pending)}</div>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4" style={{ color: '#3b82f6' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Approved</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{formatCurrency(totals.approved)}</div>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4" style={{ color: '#10b981' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Paid Out</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{formatCurrency(totals.paid)}</div>
        </div>
      </div>

      {/* === SALES REPS VIEW === */}
      {view === 'reps' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Sales Representatives</h2>
            <button onClick={() => setView('add-rep')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              <UserPlus className="w-4 h-4" /> Add Rep
            </button>
          </div>

          {reps.length === 0 ? (
            <div className="p-12 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <Handshake className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--ept-text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>No sales reps yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Add your first sales representative to start tracking commissions.</p>
              <button onClick={() => setView('add-rep')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                <UserPlus className="w-4 h-4" /> Add First Rep
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reps.map(rep => (
                <div key={rep.id} className="flex items-center gap-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    {rep.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{rep.name}</div>
                    <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      {rep.email || 'No email'} {rep.phone ? `· ${rep.phone}` : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{rep.commission_rate}% rate</div>
                    <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      Earned: {formatCurrency(rep.total_earned)} · Paid: {formatCurrency(rep.total_paid)}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteRep(rep.id)} className="p-2 rounded-lg hover:opacity-70 shrink-0" style={{ color: '#ef4444' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === ADD REP FORM === */}
      {view === 'add-rep' && (
        <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Add Sales Rep</h2>
            <button onClick={() => setView('reps')} className="p-1" style={{ color: 'var(--ept-text-muted)' }}><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Name *</label>
              <input value={repForm.name} onChange={e => setRepForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="John Smith" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Email</label>
              <input value={repForm.email} onChange={e => setRepForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="john@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Phone</label>
              <input value={repForm.phone} onChange={e => setRepForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="(432) 555-1234" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Commission Rate (%)</label>
              <input type="number" value={repForm.commission_rate} onChange={e => setRepForm(f => ({ ...f, commission_rate: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} min={0} max={100} step={0.5} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
            <textarea value={repForm.notes} onChange={e => setRepForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="How does this rep find customers? Territory? etc." />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddRep} disabled={savingRep || !repForm.name.trim()} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: savingRep || !repForm.name.trim() ? 0.5 : 1 }}>
              <Save className="w-4 h-4" /> {savingRep ? 'Saving...' : 'Save Rep'}
            </button>
            <button onClick={() => setView('reps')} className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* === COMMISSIONS VIEW === */}
      {view === 'commissions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Commission Ledger</h2>
            <button onClick={() => { setView('add-commission'); loadFormData(); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              <Plus className="w-4 h-4" /> Record Commission
            </button>
          </div>

          {commissions.length === 0 ? (
            <div className="p-12 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <DollarSign className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--ept-text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>No commissions recorded</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>When a sales rep brings in a customer and you get paid, record the commission here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Rep</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Customer</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Invoice</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Rate</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Commission</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Status</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                      <td className="py-3 px-3 font-medium" style={{ color: 'var(--ept-text)' }}>{c.rep_name}</td>
                      <td className="py-3 px-3" style={{ color: 'var(--ept-text-secondary)' }}>{c.customer_name || c.company_name || '-'}</td>
                      <td className="py-3 px-3 text-right font-mono" style={{ color: 'var(--ept-text-secondary)' }}>{formatCurrency(c.invoice_total)}</td>
                      <td className="py-3 px-3 text-right" style={{ color: 'var(--ept-text-muted)' }}>{c.commission_rate}%</td>
                      <td className="py-3 px-3 text-right font-semibold" style={{ color: 'var(--ept-accent)' }}>{formatCurrency(c.commission_amount)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{
                          backgroundColor: c.status === 'paid' ? 'rgba(16,185,129,0.15)' : c.status === 'approved' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                          color: c.status === 'paid' ? '#10b981' : c.status === 'approved' ? '#3b82f6' : '#f59e0b',
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          {c.status === 'pending' && (
                            <button onClick={() => handleApprove(c.id)} title="Approve" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: '#3b82f6' }}>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {(c.status === 'pending' || c.status === 'approved') && (
                            <button onClick={() => handlePay(c.id)} title="Mark Paid" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: '#10b981' }}>
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === ADD COMMISSION FORM === */}
      {view === 'add-commission' && (
        <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Record Commission</h2>
            <button onClick={() => setView('commissions')} className="p-1" style={{ color: 'var(--ept-text-muted)' }}><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Sales Rep *</label>
              <select value={commForm.rep_id} onChange={e => setCommForm(f => ({ ...f, rep_id: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                <option value={0}>Select rep...</option>
                {reps.map(r => <option key={r.id} value={r.id}>{r.name} ({r.commission_rate}%)</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Customer</label>
              <select value={commForm.customer_id} onChange={e => setCommForm(f => ({ ...f, customer_id: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                <option value={0}>Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}{c.company_name ? ` (${c.company_name})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Invoice Total ($) *</label>
              <input type="number" value={commForm.invoice_total || ''} onChange={e => setCommForm(f => ({ ...f, invoice_total: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="5000.00" min={0} step={0.01} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Estimated Commission</label>
              <div className="px-3 py-2 rounded-lg border text-sm font-semibold" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}>
                {commForm.rep_id && commForm.invoice_total
                  ? formatCurrency(commForm.invoice_total * ((reps.find(r => r.id === commForm.rep_id)?.commission_rate || 10) / 100))
                  : '$0.00'}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
            <textarea value={commForm.notes} onChange={e => setCommForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} placeholder="What customer/deal is this for?" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddCommission} disabled={savingComm || !commForm.rep_id || !commForm.invoice_total} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: savingComm || !commForm.rep_id || !commForm.invoice_total ? 0.5 : 1 }}>
              <Save className="w-4 h-4" /> {savingComm ? 'Saving...' : 'Record Commission'}
            </button>
            <button onClick={() => setView('commissions')} className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
