'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import { getServiceItems, createServiceItem, updateServiceItem, deleteServiceItem, ServiceItem } from '../../../lib/business-api';
import {
  Briefcase, Plus, Edit3, ToggleLeft, ToggleRight, X, Clock,
  DollarSign, Tag, Search, Save, Trash2, RefreshCw,
} from 'lucide-react';

const CATEGORIES = ['ai-platform', 'development', 'marketing', 'hosting', 'finance', 'security', 'support', 'consulting'] as const;

const CAT_LABELS: Record<string, string> = {
  'ai-platform': 'AI Platform', development: 'Development', marketing: 'Marketing',
  hosting: 'Hosting & Cloud', finance: 'Finance', security: 'Security',
  support: 'Support', consulting: 'Consulting',
};

const CYCLE_LABELS: Record<string, string> = {
  monthly: '/mo', annually: '/yr', 'one-time': 'one-time', 'per-project': 'per project', 'per-unit': 'per unit',
};

const CYCLE_COLORS: Record<string, string> = {
  monthly: '#14b8a6', annually: '#6366f1', 'one-time': '#f59e0b', 'per-project': '#8b5cf6', 'per-unit': '#ec4899',
};

type BillingCycle = 'monthly' | 'annually' | 'one-time' | 'per-project' | 'per-unit';

const EMPTY_SERVICE: Partial<ServiceItem> = {
  name: '', description: '', category: 'ai-platform', base_price: 0, pricing_type: 'flat',
  duration_minutes: 0, billing_cycle: 'monthly', active: true, sort_order: 50,
};

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCycle, setFilterCycle] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ServiceItem>>(EMPTY_SERVICE);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);

  const loadServices = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getServiceItems();
      setServices((data as any).services || []);
    } catch {
      setServices([]);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { if (user) loadServices(); }, [user, loadServices]);

  if (loading || !user || loadingData) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const filtered = services.filter(s => {
    if (filterCycle !== 'all' && s.billing_cycle !== filterCycle) return false;
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const monthlyServices = services.filter(s => s.billing_cycle === 'monthly' && s.active);
  const oneTimeServices = services.filter(s => (s.billing_cycle === 'one-time' || s.billing_cycle === 'per-project') && s.active);
  const monthlyRevenuePotential = monthlyServices.reduce((acc, s) => acc + s.base_price, 0);

  const handleAdd = () => { setEditId(null); setForm(EMPTY_SERVICE); setShowModal(true); };
  const handleEdit = (s: ServiceItem) => { setEditId(s.id); setForm(s); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || saving) return;
    setSaving(true);
    try {
      if (editId) {
        await updateServiceItem(editId, form);
      } else {
        await createServiceItem(form);
      }
      await loadServices();
      setShowModal(false);
      setForm(EMPTY_SERVICE);
      setEditId(null);
    } catch { /* */ }
    finally { setSaving(false); }
  };

  const handleToggle = async (s: ServiceItem) => {
    await updateServiceItem(s.id, { active: !s.active } as any);
    await loadServices();
  };

  const handleDelete = async (s: ServiceItem) => {
    await deleteServiceItem(s.id);
    await loadServices();
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const activeCount = services.filter(s => s.active).length;
  const usedCategories = [...new Set(services.map(s => s.category))];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
            <Briefcase size={28} style={{ color: 'var(--ept-accent)' }} />
            Service Catalog
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            {services.length} services &middot; {activeCount} active &middot; ${monthlyRevenuePotential.toLocaleString()}/mo potential MRR
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadServices} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Monthly Recurring', value: monthlyServices.length, sub: `$${monthlyRevenuePotential.toLocaleString()}/mo`, color: '#14b8a6' },
          { label: 'One-Time / Project', value: oneTimeServices.length, sub: `${oneTimeServices.length} offerings`, color: '#f59e0b' },
          { label: 'Total Active', value: activeCount, sub: `of ${services.length}`, color: 'var(--ept-accent)' },
          { label: 'Categories', value: usedCategories.length, sub: usedCategories.slice(0, 3).map(c => CAT_LABELS[c] || c).join(', '), color: '#6366f1' },
          { label: 'Avg Price', value: `$${Math.round(services.reduce((a, s) => a + s.base_price, 0) / (services.length || 1))}`, sub: 'across catalog', color: '#ec4899' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ept-text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
        <select
          value={filterCycle} onChange={e => setFilterCycle(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        >
          <option value="all">All Billing</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annual</option>
          <option value="one-time">One-Time</option>
          <option value="per-project">Per Project</option>
          <option value="per-unit">Per Unit</option>
        </select>
        <select
          value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
        </select>
      </div>

      {/* Monthly Recurring Section */}
      {filterCycle === 'all' && !search && filterCategory === 'all' && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--ept-text-muted)' }}>
            <RefreshCw size={14} style={{ color: '#14b8a6' }} /> Monthly Recurring Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {monthlyServices.map(service => (
              <ServiceCard key={service.id} service={service} onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* One-Time & Project Section */}
      {filterCycle === 'all' && !search && filterCategory === 'all' && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--ept-text-muted)' }}>
            <DollarSign size={14} style={{ color: '#f59e0b' }} /> One-Time & Project Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.filter(s => s.billing_cycle !== 'monthly' && s.active).map(service => (
              <ServiceCard key={service.id} service={service} onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Filtered Results (when any filter is active) */}
      {(filterCycle !== 'all' || search || filterCategory !== 'all') && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </h2>
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', color: 'var(--ept-text-muted)' }}>
              <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
              No services match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(service => (
                <ServiceCard key={service.id} service={service} onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                {editId ? <Edit3 size={20} style={{ color: 'var(--ept-accent)' }} /> : <Plus size={20} style={{ color: 'var(--ept-accent)' }} />}
                {editId ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Service Name *</label>
                <input value={form.name || ''} onChange={e => updateForm('name', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Description</label>
                <textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category</label>
                  <select value={form.category || 'ai-platform'} onChange={e => updateForm('category', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Billing Cycle</label>
                  <select value={form.billing_cycle || 'monthly'} onChange={e => updateForm('billing_cycle', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annual</option>
                    <option value="one-time">One-Time</option>
                    <option value="per-project">Per Project</option>
                    <option value="per-unit">Per Unit</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.base_price || 0} onChange={e => updateForm('base_price', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Duration (min)</label>
                  <input type="number" min="0" step="15" value={form.duration_minutes || 0} onChange={e => updateForm('duration_minutes', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>Cancel</button>
              <button onClick={handleSave} disabled={!form.name || saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: !form.name || saving ? 0.5 : 1 }}>
                <Save size={14} /> {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Service Card Component ── */

function ServiceCard({ service, onEdit, onToggle, onDelete }: {
  service: ServiceItem;
  onEdit: (s: ServiceItem) => void;
  onToggle: (s: ServiceItem) => void;
  onDelete: (s: ServiceItem) => void;
}) {
  const cycleColor = CYCLE_COLORS[service.billing_cycle] || 'var(--ept-accent)';
  const cycleLabel = CYCLE_LABELS[service.billing_cycle] || service.billing_cycle;
  const catLabel = CAT_LABELS[service.category] || service.category;

  return (
    <div className="p-4 rounded-xl border transition-all hover:shadow-md" style={{
      backgroundColor: 'var(--ept-card-bg)',
      borderColor: service.active ? 'var(--ept-card-border)' : 'var(--ept-border)',
      opacity: service.active ? 1 : 0.5,
    }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--ept-text)' }}>{service.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${cycleColor}20`, color: cycleColor }}>
              {cycleLabel}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>
              {catLabel}
            </span>
          </div>
        </div>
        <button onClick={() => onToggle(service)} title={service.active ? 'Deactivate' : 'Activate'} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {service.active
            ? <ToggleRight size={22} style={{ color: '#10b981' }} />
            : <ToggleLeft size={22} style={{ color: 'var(--ept-text-muted)' }} />
          }
        </button>
      </div>
      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--ept-text-secondary, var(--ept-text-muted))' }}>{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-base font-bold" style={{ color: 'var(--ept-accent)' }}>
          <DollarSign size={16} />
          {service.base_price > 0 ? service.base_price.toLocaleString() : 'Custom'}
          {service.base_price > 0 && <span className="text-xs font-normal" style={{ color: 'var(--ept-text-muted)' }}>{cycleLabel !== 'one-time' ? cycleLabel : ''}</span>}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(service)} className="p-1.5 rounded-lg border transition-all hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)', background: 'none', cursor: 'pointer' }} title="Edit">
            <Edit3 size={12} />
          </button>
          <button onClick={() => onDelete(service)} className="p-1.5 rounded-lg border transition-all hover:opacity-70" style={{ borderColor: 'var(--ept-border)', color: '#ef4444', background: 'none', cursor: 'pointer' }} title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
