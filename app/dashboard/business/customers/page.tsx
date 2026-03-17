'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, type Customer } from '../../../../lib/business-api';
import { formatPhone } from '../../../../lib/business-utils';
import {
  Users, Plus, Search, Phone, Mail, MapPin, Edit3, Trash2,
  Building2, User, AlertTriangle, Loader2, X,
} from 'lucide-react';

const EMPTY_CUSTOMER: Partial<Customer> = {
  first_name: '', last_name: '', email: '', phone: '', address: '', city: '', state: 'TX', zip: '',
  type: 'residential', company_name: '', payment_terms: 'net_30', tax_exempt: false,
  contact_person: '', contact_email: '', contact_phone: '', notes: '',
};

export default function CustomersPage() {
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Customer>>(EMPTY_CUSTOMER);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getCustomers(search || undefined);
      setCustomers(data.customers || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoadingData(false);
    }
  }, [search]);

  useEffect(() => { if (user) loadCustomers(); }, [user, loadCustomers]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (editId) {
        await updateCustomer(editId, form);
      } else {
        await createCustomer(form);
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_CUSTOMER);
      loadCustomers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: Customer) => {
    setEditId(c.id);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      setDeleteConfirm(null);
      loadCustomers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleAdd = () => {
    setEditId(null);
    setForm(EMPTY_CUSTOMER);
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
          <Users className="w-7 h-7" style={{ color: 'var(--ept-accent)' }} />
          Customers
        </h1>
        <button onClick={handleAdd} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto underline text-sm">dismiss</button>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ept-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadCustomers()}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
        <button onClick={loadCustomers} className="btn-outline px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Search className="w-4 h-4" /> Search
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loadingData ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--ept-accent)' }} />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            No customers found. <button onClick={handleAdd} className="underline" style={{ color: 'var(--ept-accent)' }}>Add one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hidden md:table-cell">Type</th>
                  <th className="hidden lg:table-cell">Email</th>
                  <th className="hidden lg:table-cell">Phone</th>
                  <th className="hidden xl:table-cell">City</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-medium" style={{ color: 'var(--ept-text)' }}>{c.first_name} {c.last_name}</div>
                      {c.company_name && <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.company_name}</div>}
                    </td>
                    <td className="hidden md:table-cell">
                      <span className={`badge ${c.type === 'commercial' ? 'badge-info' : 'badge-success'}`}>
                        {c.type === 'commercial' ? <Building2 className="w-3 h-3 mr-1 inline" /> : <User className="w-3 h-3 mr-1 inline" />}
                        {c.type}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
                        <Mail className="w-3 h-3" /> {c.email}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
                        <Phone className="w-3 h-3" /> {formatPhone(c.phone)}
                      </span>
                    </td>
                    <td className="hidden xl:table-cell">
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--ept-text-secondary)' }}>
                        <MapPin className="w-3 h-3" /> {c.city}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleEdit(c)} className="text-xs font-medium mr-3 inline-flex items-center gap-1" style={{ color: 'var(--ept-accent)' }}>
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(c.id)} className="text-xs font-medium inline-flex items-center gap-1" style={{ color: '#ef4444' }}>
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
              Delete Customer?
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
          <div className="w-full max-w-lg mx-4 p-6 rounded-xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
              {editId ? <Edit3 className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} /> : <Plus className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} />}
              {editId ? 'Edit Customer' : 'Add Customer'}
            </h3>

            {/* Type Toggle */}
            <div className="flex gap-2 mb-4">
              {(['residential', 'commercial'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => updateForm('type', t)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2"
                  style={{
                    backgroundColor: form.type === t ? 'var(--ept-accent)' : 'transparent',
                    color: form.type === t ? '#fff' : 'var(--ept-text-secondary)',
                    borderColor: form.type === t ? 'var(--ept-accent)' : 'var(--ept-border)',
                  }}
                >
                  {t === 'residential' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  {t === 'residential' ? 'Person' : 'Business'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>First Name *</label>
                  <input value={form.first_name || ''} onChange={e => updateForm('first_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Last Name *</label>
                  <input value={form.last_name || ''} onChange={e => updateForm('last_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              {form.type === 'commercial' && (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Company Name</label>
                    <input value={form.company_name || ''} onChange={e => updateForm('company_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Payment Terms</label>
                      <select value={form.payment_terms || 'net_30'} onChange={e => updateForm('payment_terms', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                        <option value="due_on_receipt">Due on Receipt</option>
                        <option value="net_15">Net 15</option>
                        <option value="net_30">Net 30</option>
                        <option value="net_45">Net 45</option>
                        <option value="net_60">Net 60</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <input type="checkbox" id="tax_exempt" checked={form.tax_exempt || false} onChange={e => updateForm('tax_exempt', e.target.checked)} className="w-4 h-4 rounded" />
                      <label htmlFor="tax_exempt" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Tax Exempt</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Contact Person</label>
                      <input value={form.contact_person || ''} onChange={e => updateForm('contact_person', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Contact Email</label>
                      <input value={form.contact_email || ''} onChange={e => updateForm('contact_email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Contact Phone</label>
                      <input value={form.contact_phone || ''} onChange={e => updateForm('contact_phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Email</label>
                  <input type="email" value={form.email || ''} onChange={e => updateForm('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Phone</label>
                  <input value={form.phone || ''} onChange={e => updateForm('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Address</label>
                <input value={form.address || ''} onChange={e => updateForm('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>City</label>
                  <input value={form.city || ''} onChange={e => updateForm('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>State</label>
                  <input value={form.state || 'TX'} onChange={e => updateForm('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>ZIP</label>
                  <input value={form.zip || ''} onChange={e => updateForm('zip', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</label>
                <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.first_name || !form.last_name} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
