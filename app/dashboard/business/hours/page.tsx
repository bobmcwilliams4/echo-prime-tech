'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { formatDate } from '../../../../lib/business-utils';
import { getHours, logHours, updateHours, approveHours, getEmployees, type HourEntry, type Employee } from '../../../../lib/business-api';
import { Clock, Plus, Search, CheckCircle, Check, Calendar, Timer, Pencil, X } from 'lucide-react';

const EMPTY_HOURS: Partial<HourEntry> = {
  employee_id: '', date: new Date().toISOString().split('T')[0], hours: 0, overtime: 0, notes: '',
};

export default function HoursPage() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HourEntry>>(EMPTY_HOURS);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [hoursData, empData] = await Promise.all([
        getHours({ employee_id: filterEmployee || undefined, start: filterStart || undefined, end: filterEnd || undefined }),
        getEmployees(),
      ]);
      setEntries(hoursData.hours || []);
      setEmployees(empData.employees || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  }, [filterEmployee, filterStart, filterEnd]);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) {
        await updateHours(editId, form);
      } else {
        await logHours(form);
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_HOURS);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setError('');
      await approveHours(id);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    }
  };

  const handleEdit = (entry: HourEntry) => {
    setEditId(entry.id);
    setForm({ ...entry });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY_HOURS);
    setShowModal(true);
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const totalRegular = entries.reduce((s, e) => s + (e.hours || 0), 0);
  const totalOvertime = entries.reduce((s, e) => s + (e.overtime || 0), 0);

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock size={28} style={{ color: 'var(--ept-accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-text)' }}>Time Tracking</h1>
        </div>
        <button onClick={handleAdd} className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Log Hours
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="underline text-sm">dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Employee</label>
          <select
            value={filterEmployee}
            onChange={e => setFilterEmployee(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>
            <Calendar size={12} className="inline mr-1" />Start
          </label>
          <input
            type="date"
            value={filterStart}
            onChange={e => setFilterStart(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>
            <Calendar size={12} className="inline mr-1" />End
          </label>
          <input
            type="date"
            value={filterEnd}
            onChange={e => setFilterEnd(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
        <button onClick={loadData} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Search size={14} /> Filter
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Timer size={14} style={{ color: 'var(--ept-text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Regular Hours</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{totalRegular.toFixed(1)}h</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={14} style={{ color: '#eab308' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Overtime</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#eab308' }}>{totalOvertime.toFixed(1)}h</div>
        </div>
        <div className="glass-card p-4 text-center col-span-2 md:col-span-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle size={14} style={{ color: 'var(--ept-accent)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Total</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{(totalRegular + totalOvertime).toFixed(1)}h</div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            No hours logged. <button onClick={handleAdd} className="underline" style={{ color: 'var(--ept-accent)' }}>Log some</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Employee</th>
                  <th className="text-left">Date</th>
                  <th className="text-right">Regular</th>
                  <th className="text-right">Overtime</th>
                  <th className="text-right hidden md:table-cell">Total</th>
                  <th className="text-center">Approved</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id}>
                    <td className="font-medium" style={{ color: 'var(--ept-text)' }}>{entry.employee_name || entry.employee_id}</td>
                    <td style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(entry.date)}</td>
                    <td className="text-right" style={{ color: 'var(--ept-text)' }}>{entry.hours}h</td>
                    <td className="text-right" style={{ color: entry.overtime > 0 ? '#eab308' : 'var(--ept-text-muted)' }}>{entry.overtime}h</td>
                    <td className="text-right hidden md:table-cell font-medium" style={{ color: 'var(--ept-text)' }}>{(entry.hours + entry.overtime).toFixed(1)}h</td>
                    <td className="text-center">
                      {entry.approved ? (
                        <CheckCircle size={18} className="inline-block" style={{ color: '#22c55e' }} />
                      ) : (
                        <button onClick={() => handleApprove(entry.id)} className="badge badge-success px-2 py-0.5 inline-flex items-center gap-1" title="Approve">
                          <Check size={12} /> Approve
                        </button>
                      )}
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleEdit(entry)} className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>
                        <Pencil size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr>
                  <td className="font-bold" style={{ color: 'var(--ept-text)' }} colSpan={2}>Totals</td>
                  <td className="text-right font-bold" style={{ color: 'var(--ept-text)' }}>{totalRegular.toFixed(1)}h</td>
                  <td className="text-right font-bold" style={{ color: '#eab308' }}>{totalOvertime.toFixed(1)}h</td>
                  <td className="text-right font-bold hidden md:table-cell" style={{ color: 'var(--ept-text)' }}>{(totalRegular + totalOvertime).toFixed(1)}h</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                {editId ? <Pencil size={18} /> : <Plus size={18} />}
                {editId ? 'Edit Hours' : 'Log Hours'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--ept-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Employee *</label>
                <select value={form.employee_id || ''} onChange={e => updateForm('employee_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                  <option value="">Select employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                  <Calendar size={12} /> Date *
                </label>
                <input type="date" value={form.date || ''} onChange={e => updateForm('date', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                    <Timer size={12} /> Regular Hours
                  </label>
                  <input type="number" step="0.25" min="0" value={form.hours || 0} onChange={e => updateForm('hours', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                    <Clock size={12} /> Overtime Hours
                  </label>
                  <input type="number" step="0.25" min="0" value={form.overtime || 0} onChange={e => updateForm('overtime', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
                <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.employee_id || !form.date} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
