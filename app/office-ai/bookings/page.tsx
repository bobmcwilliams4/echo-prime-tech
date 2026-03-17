'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import {
  getBookings, createBooking, updateBooking, updateBookingStatus,
  getCustomers, getServiceItems,
  type Booking, type Customer, type ServiceItem,
} from '../../../lib/business-api';
import { formatCurrency, formatDate, getStatusBadge } from '../../../lib/business-utils';
import {
  Calendar, Plus, Search, Check, Clock, X, Eye, Edit3,
  ChevronRight, MapPin, FileText, Loader2,
} from 'lucide-react';

const STATUSES = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;

const NEXT_STATUS: Record<string, { label: string; next: string }[]> = {
  pending: [{ label: 'Confirm', next: 'confirmed' }, { label: 'Cancel', next: 'cancelled' }],
  confirmed: [{ label: 'Start Job', next: 'in_progress' }, { label: 'Cancel', next: 'cancelled' }],
  in_progress: [{ label: 'Complete', next: 'completed' }],
  completed: [],
  cancelled: [],
};

const EMPTY_BOOKING: Partial<Booking> = {
  customer_id: '', service_id: '', date: '', time: '09:00',
  address: '', city: '', state: 'TX', zip: '', notes: '', quoted_price: 0,
};

export default function BookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Booking>>(EMPTY_BOOKING);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<Booking | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [bRes, cRes, sRes] = await Promise.all([
        getBookings(statusFilter !== 'all' ? statusFilter : undefined),
        getCustomers(),
        getServiceItems(),
      ]);
      setBookings(bRes.bookings || []);
      setCustomers(cRes.customers || []);
      setServices(sRes.services || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoadingData(false);
    }
  }, [statusFilter]);

  useEffect(() => { if (user) loadData(); }, [user, loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) {
        await updateBooking(editId, form);
      } else {
        await createBooking(form);
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_BOOKING);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      loadData();
      if (detail?.id === id) setDetail(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Status update failed');
    }
  };

  const handleEdit = (b: Booking) => {
    setEditId(b.id);
    setForm({ ...b });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY_BOOKING);
    setShowModal(true);
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  if (loading || !user) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ept-accent)' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--ept-text)' }}>
          <Calendar className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
          Bookings
        </h1>
        <button onClick={handleAdd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto underline text-sm">dismiss</button>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border"
            style={{
              backgroundColor: statusFilter === s ? 'var(--ept-accent)' : 'transparent',
              color: statusFilter === s ? '#fff' : 'var(--ept-text-secondary)',
              borderColor: statusFilter === s ? 'var(--ept-accent)' : 'var(--ept-border)',
            }}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--ept-accent)' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            No bookings found. <button onClick={handleAdd} className="underline" style={{ color: 'var(--ept-accent)' }}>Create one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="hidden md:table-cell">Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const badge = getStatusBadge(b.status);
                  const actions = NEXT_STATUS[b.status] || [];
                  return (
                    <tr key={b.id} className="cursor-pointer" onClick={() => setDetail(b)}>
                      <td>{b.customer_name || 'Unknown'}</td>
                      <td className="hidden md:table-cell" style={{ color: 'var(--ept-text-secondary)' }}>{b.service_name || '-'}</td>
                      <td style={{ color: 'var(--ept-text-secondary)' }}>{formatDate(b.date)} {b.time}</td>
                      <td>
                        <span className={badge.className}>{badge.label}</span>
                      </td>
                      <td className="text-right font-medium">{formatCurrency(b.quoted_price)}</td>
                      <td className="text-right" onClick={e => e.stopPropagation()}>
                        {actions.map(a => (
                          <button key={a.next} onClick={() => handleStatusChange(b.id, a.next)} className="text-xs font-medium ml-2 inline-flex items-center gap-1" style={{ color: a.next === 'cancelled' ? '#ef4444' : 'var(--ept-accent)' }}>
                            {a.next === 'cancelled' ? <X className="w-3 h-3" /> : a.next === 'completed' ? <Check className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            {a.label}
                          </button>
                        ))}
                        <button onClick={() => handleEdit(b)} className="text-xs font-medium ml-2 inline-flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setDetail(null)}>
          <div className="w-full max-w-md mx-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
              <Eye className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />
              Booking Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Customer</span><span style={{ color: 'var(--ept-text)' }}>{detail.customer_name}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Service</span><span style={{ color: 'var(--ept-text)' }}>{detail.service_name}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Date / Time</span><span style={{ color: 'var(--ept-text)' }}>{formatDate(detail.date)} {detail.time}</span></div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--ept-text-muted)' }}>Status</span>
                <span className={getStatusBadge(detail.status).className}>{getStatusBadge(detail.status).label}</span>
              </div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Price</span><span className="font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(detail.quoted_price)}</span></div>
              <div className="flex justify-between items-start">
                <span style={{ color: 'var(--ept-text-muted)' }}>Address</span>
                <span className="text-right flex items-center gap-1" style={{ color: 'var(--ept-text)' }}>
                  <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--ept-text-muted)' }} />
                  {detail.address}, {detail.city}, {detail.state} {detail.zip}
                </span>
              </div>
              {detail.notes && (
                <div className="pt-2 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--ept-text-muted)' }}>
                    <FileText className="w-3 h-3" /> Notes
                  </div>
                  <div style={{ color: 'var(--ept-text-secondary)' }}>{detail.notes}</div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setDetail(null)} className="btn-outline px-4 py-2 rounded-lg text-sm">Close</button>
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
              {editId ? 'Edit Booking' : 'New Booking'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Customer *</label>
                <select value={form.customer_id || ''} onChange={e => updateForm('customer_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                  <option value="">Select customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Service *</label>
                <select value={form.service_id || ''} onChange={e => { updateForm('service_id', e.target.value); const svc = services.find(s => s.id === e.target.value); if (svc) updateForm('quoted_price', svc.base_price); }} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                  <option value="">Select service...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.base_price)})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Date *</label>
                  <input type="date" value={form.date || ''} onChange={e => updateForm('date', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Time</label>
                  <input type="time" value={form.time || '09:00'} onChange={e => updateForm('time', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Address</label>
                <input value={form.address || ''} onChange={e => updateForm('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>City</label><input value={form.city || ''} onChange={e => updateForm('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>State</label><input value={form.state || 'TX'} onChange={e => updateForm('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>ZIP</label><input value={form.zip || ''} onChange={e => updateForm('zip', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} /></div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Quoted Price</label>
                <input type="number" step="0.01" value={form.quoted_price || 0} onChange={e => updateForm('quoted_price', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
                <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.customer_id || !form.service_id || !form.date} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
