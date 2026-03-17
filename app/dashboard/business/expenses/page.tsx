'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { getExpenses, createExpense, updateExpense, deleteExpense, type Expense } from '../../../../lib/business-api';
import { formatCurrency, formatDate } from '../../../../lib/business-utils';
import {
  DollarSign, Plus, RefreshCw, Receipt, Tag, Edit3, Trash2,
  AlertTriangle, Loader2, X, TrendingDown,
} from 'lucide-react';

const CATEGORIES = ['all', 'supplies', 'equipment', 'vehicle', 'insurance', 'marketing', 'rent', 'utilities', 'payroll_tax', 'software', 'other'] as const;

const CAT_BADGE: Record<string, string> = {
  supplies: 'badge-info',
  equipment: 'badge-purple',
  vehicle: 'badge-warning',
  insurance: 'badge-info',
  marketing: 'badge-purple',
  rent: 'badge-warning',
  utilities: 'badge-success',
  payroll_tax: 'badge-danger',
  software: 'badge-purple',
  other: 'badge-neutral',
};

const EMPTY_EXPENSE: Partial<Expense> = {
  category: 'supplies', description: '', amount: 0, expense_date: new Date().toISOString().split('T')[0],
  vendor: '', recurring: false, notes: '',
};

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [catFilter, setCatFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Expense>>(EMPTY_EXPENSE);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await getExpenses(catFilter !== 'all' ? catFilter : undefined);
      setExpenses(res.expenses || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoadingData(false);
    }
  }, [catFilter]);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) { await updateExpense(editId, form); } else { await createExpense(form); }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_EXPENSE);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteExpense(id); setDeleteConfirm(null); loadData(); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Delete failed'); }
  };

  const handleEdit = (exp: Expense) => { setEditId(exp.id); setForm({ ...exp }); setShowModal(true); };
  const handleAdd = () => { setEditId(null); setForm(EMPTY_EXPENSE); setShowModal(true); };
  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  // Monthly summaries
  const now = new Date();
  const monthTotals = [0, 1, 2].map(offset => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const total = expenses.filter(e => {
      const ed = new Date(e.expense_date);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);
    return { month: monthStr, total };
  });
  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ept-accent)' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--ept-text)' }}>
          <Receipt className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
          Expenses
        </h1>
        <button onClick={handleAdd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto underline text-sm">dismiss</button>
        </div>
      )}

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {monthTotals.map((m, i) => (
          <div key={i} className="glass-card p-4 rounded-xl">
            <div className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
              <TrendingDown className="w-3 h-3" /> {m.month}
            </div>
            <div className="text-xl font-bold" style={{ color: '#ef4444' }}>{formatCurrency(m.total)}</div>
          </div>
        ))}
        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
            <DollarSign className="w-3 h-3" /> Total (Filtered)
          </div>
          <div className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{formatCurrency(grandTotal)}</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border" style={{
            backgroundColor: catFilter === c ? 'var(--ept-accent)' : 'transparent',
            color: catFilter === c ? '#fff' : 'var(--ept-text-secondary)',
            borderColor: catFilter === c ? 'var(--ept-accent)' : 'var(--ept-border)',
          }}>
            {c === 'all' ? 'All' : c.replace('_', ' ').replace(/\b\w/g, x => x.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--ept-accent)' }} />
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No expenses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th className="hidden md:table-cell">Vendor</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(exp.expense_date)}</td>
                    <td>
                      <span className={`badge ${CAT_BADGE[exp.category] || 'badge-neutral'}`}>
                        <Tag className="w-3 h-3 mr-1 inline" />
                        {exp.category.replace('_', ' ')}
                      </span>
                      {exp.recurring && (
                        <RefreshCw className="w-3 h-3 ml-1.5 inline" style={{ color: 'var(--ept-text-muted)' }} />
                      )}
                    </td>
                    <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{exp.vendor}</td>
                    <td>{exp.description}</td>
                    <td className="text-right font-medium" style={{ color: '#ef4444' }}>{formatCurrency(exp.amount)}</td>
                    <td className="text-right">
                      <button onClick={() => handleEdit(exp)} className="text-xs font-medium mr-3 inline-flex items-center gap-1" style={{ color: 'var(--ept-accent)' }}>
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(exp.id)} className="text-xs font-medium inline-flex items-center gap-1" style={{ color: '#ef4444' }}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm mx-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
              Delete Expense?
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg mx-4 p-6 rounded-xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--ept-card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
              {editId ? <Edit3 className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} /> : <Plus className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />}
              {editId ? 'Edit Expense' : 'Add Expense'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category *</label><select value={form.category || 'supplies'} onChange={e => updateForm('category', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>{CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Date *</label><input type="date" value={form.expense_date || ''} onChange={e => updateForm('expense_date', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Description *</label><input value={form.description || ''} onChange={e => updateForm('description', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Amount *</label><input type="number" step="0.01" value={form.amount || 0} onChange={e => updateForm('amount', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Vendor</label><input value={form.vendor || ''} onChange={e => updateForm('vendor', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="recurring" checked={form.recurring || false} onChange={e => updateForm('recurring', e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="recurring" className="text-sm flex items-center gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
                  <RefreshCw className="w-3 h-3" /> Recurring expense
                </label>
              </div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label><textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.description || !form.amount} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
