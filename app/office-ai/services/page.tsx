'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Briefcase, Plus, Edit3, ToggleLeft, ToggleRight, X, Clock,
  DollarSign, Tag, AlertCircle, Search,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  active: boolean;
}

const CATEGORIES = ['cleaning', 'maintenance', 'repair', 'consultation', 'installation', 'custom'] as const;

const CAT_BADGE: Record<string, string> = {
  cleaning: 'badge-info', maintenance: 'badge-warning', repair: 'badge-danger',
  consultation: 'badge-purple', installation: 'badge-success', custom: 'badge-info',
};

const DEMO_SERVICES: Service[] = [
  { id: '1', name: 'Deep Clean - Residential', description: 'Full home deep cleaning service including carpets, windows, and appliances', category: 'cleaning', price: 250, duration: 180, active: true },
  { id: '2', name: 'HVAC Maintenance', description: 'Annual HVAC system inspection, filter replacement, and tune-up', category: 'maintenance', price: 150, duration: 120, active: true },
  { id: '3', name: 'Plumbing Repair', description: 'General plumbing repair services for residential and commercial', category: 'repair', price: 125, duration: 90, active: true },
  { id: '4', name: 'Business Consultation', description: 'One-on-one business strategy and operations consultation', category: 'consultation', price: 200, duration: 60, active: true },
  { id: '5', name: 'Security System Install', description: 'Full security system installation with cameras and monitoring setup', category: 'installation', price: 500, duration: 240, active: false },
  { id: '6', name: 'Custom Project', description: 'Custom project scoped to client requirements', category: 'custom', price: 0, duration: 0, active: true },
];

const EMPTY_SERVICE: Partial<Service> = {
  name: '', description: '', category: 'cleaning', price: 0, duration: 60, active: true,
};

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(DEMO_SERVICES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Service>>(EMPTY_SERVICE);

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);

  if (loading || !user) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>;

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setEditId(null); setForm(EMPTY_SERVICE); setShowModal(true); };
  const handleEdit = (s: Service) => { setEditId(s.id); setForm(s); setShowModal(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setServices(prev => prev.map(s => s.id === editId ? { ...s, ...form } as Service : s));
    } else {
      const newService: Service = { ...form, id: Date.now().toString(), active: true } as Service;
      setServices(prev => [...prev, newService]);
    }
    setShowModal(false);
    setForm(EMPTY_SERVICE);
    setEditId(null);
  };

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const activeCount = services.filter(s => s.active).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
            <Briefcase size={28} style={{ color: 'var(--ept-accent)' }} />
            Service Catalog
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Manage your service offerings, pricing, and availability
          </p>
        </div>
        <button onClick={handleAdd} className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', value: services.length, icon: Briefcase, color: 'var(--ept-accent)' },
          { label: 'Active', value: activeCount, icon: ToggleRight, color: 'var(--ept-success)' },
          { label: 'Inactive', value: services.length - activeCount, icon: ToggleLeft, color: 'var(--ept-text-muted)' },
          { label: 'Categories', value: new Set(services.map(s => s.category)).size, icon: Tag, color: 'var(--ept-info)' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={16} style={{ color: stat.color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ept-text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
          />
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
          <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
          No services found.{' '}
          <button onClick={handleAdd} className="underline" style={{ color: 'var(--ept-accent)' }}>Add one</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => (
            <div key={service.id} className="glass-card p-5 card-hover" style={{ opacity: service.active ? 1 : 0.6 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{service.name}</h3>
                  <span className={`badge ${CAT_BADGE[service.category] || 'badge-info'} mt-1`}>
                    {service.category}
                  </span>
                </div>
                <button onClick={() => toggleActive(service.id)} title={service.active ? 'Deactivate' : 'Activate'}>
                  {service.active
                    ? <ToggleRight size={22} style={{ color: 'var(--ept-success)' }} />
                    : <ToggleLeft size={22} style={{ color: 'var(--ept-text-muted)' }} />
                  }
                </button>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--ept-text-secondary)' }}>{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>
                    <DollarSign size={14} />
                    {service.price > 0 ? `$${service.price}` : 'Custom'}
                  </span>
                  {service.duration > 0 && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      <Clock size={12} />
                      {service.duration}min
                    </span>
                  )}
                </div>
                <button onClick={() => handleEdit(service)} className="btn-outline flex items-center gap-1 px-2 py-1 rounded-lg text-xs">
                  <Edit3 size={12} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                {editId ? <Edit3 size={20} style={{ color: 'var(--ept-accent)' }} /> : <Plus size={20} style={{ color: 'var(--ept-accent)' }} />}
                {editId ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Service Name *</label>
                <input value={form.name || ''} onChange={e => updateForm('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Description</label>
                <textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category</label>
                <select value={form.category || 'cleaning'} onChange={e => updateForm('category', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.price || 0} onChange={e => updateForm('price', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Duration (min)</label>
                  <input type="number" min="0" step="15" value={form.duration || 0} onChange={e => updateForm('duration', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={!form.name} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
