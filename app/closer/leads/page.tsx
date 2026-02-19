'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getLeads, createLead, updateLead, deleteLead } from '../../../lib/closer-api';

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'appointment_set' | 'converted' | 'lost' | 'dnc';
type LeadSource = 'manual' | 'website' | 'referral' | 'csv' | 'api';
type SortMode = 'newest' | 'oldest' | 'priority';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  priority: number;
  notes: string;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface LeadFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company: string;
  source: LeadSource;
  notes: string;
  priority: number;
  status: LeadStatus;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'appointment_set', label: 'Appointment Set' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
  { value: 'dnc', label: 'DNC' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'csv', label: 'CSV Import' },
  { value: 'api', label: 'API' },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Highest Priority' },
];

const STATUS_COLORS: Record<LeadStatus, { color: string; bg: string; label: string }> = {
  new:             { color: 'var(--ept-accent)', bg: 'rgba(13,115,119,0.10)', label: 'New' },
  contacted:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', label: 'Contacted' },
  qualified:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Qualified' },
  appointment_set: { color: '#10b981', bg: 'rgba(16,185,129,0.10)', label: 'Appt Set' },
  converted:       { color: '#059669', bg: 'rgba(5,150,105,0.10)', label: 'Converted' },
  lost:            { color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Lost' },
  dnc:             { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'DNC' },
};

const EMPTY_FORM: LeadFormData = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  company: '',
  source: 'manual',
  notes: '',
  priority: 5,
  status: 'new',
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function formatDate(d: string | null): string {
  if (!d) return '--';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '--';
    const now = new Date();
    const diff = now.getTime() - dt.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: dt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  } catch {
    return '--';
  }
}

function priorityColor(p: number): string {
  if (p >= 8) return '#ef4444';
  if (p >= 6) return '#f59e0b';
  if (p >= 4) return 'var(--ept-accent)';
  return '#6b7280';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const { user } = useAuth();

  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({ ...EMPTY_FORM });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Expanded lead detail
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<LeadFormData>({ ...EMPTY_FORM });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Data Fetching ──────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    try {
      setError(null);
      const data = await getLeads();
      const list: Lead[] = Array.isArray(data) ? data : (data as any)?.leads ?? (data as any)?.results ?? [];
      setLeads(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ─── Filtering, Search, Sort ────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Search filter (name, phone, email, company)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        const fullName = `${l.first_name} ${l.last_name}`.toLowerCase();
        return (
          fullName.includes(q) ||
          (l.phone || '').toLowerCase().includes(q) ||
          (l.email || '').toLowerCase().includes(q) ||
          (l.company || '').toLowerCase().includes(q)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortMode === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortMode === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return (b.priority || 0) - (a.priority || 0);
    });

    return result;
  }, [leads, statusFilter, searchQuery, sortMode]);

  // ─── Create Lead ────────────────────────────────────────────────────────

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);
    try {
      await createLead({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        source: formData.source,
        notes: formData.notes.trim(),
        priority: formData.priority,
        status: 'new',
      });
      setFormData({ ...EMPTY_FORM });
      setShowAddForm(false);
      await fetchLeads();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create lead');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ─── Update Lead ────────────────────────────────────────────────────────

  const startEditing = (lead: Lead) => {
    setEditingId(lead.id);
    setEditData({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      company: lead.company || '',
      source: lead.source || 'manual',
      notes: lead.notes || '',
      priority: lead.priority || 5,
      status: lead.status || 'new',
    });
    setExpandedId(lead.id);
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setEditSubmitting(true);
    try {
      await updateLead(editingId, {
        first_name: editData.first_name.trim(),
        last_name: editData.last_name.trim(),
        phone: editData.phone.trim(),
        email: editData.email.trim(),
        company: editData.company.trim(),
        source: editData.source,
        notes: editData.notes.trim(),
        priority: editData.priority,
        status: editData.status,
      });
      setEditingId(null);
      await fetchLeads();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update lead');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ─── Delete Lead ────────────────────────────────────────────────────────

  const handleDeleteLead = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteLead(id);
      if (expandedId === id) setExpandedId(null);
      if (editingId === id) setEditingId(null);
      await fetchLeads();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete lead');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Row Toggle ─────────────────────────────────────────────────────────

  const toggleExpand = (id: string) => {
    if (editingId === id) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ─── Render: Loading ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid var(--ept-accent)',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: 12, color: 'var(--ept-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Loading leads...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Render: Page ───────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header Row ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', letterSpacing: '-0.01em' }}>Leads</h2>
          <span style={{ fontSize: 11, color: 'var(--ept-text-muted)', fontWeight: 500 }}>
            {filteredLeads.length}{leads.length !== filteredLeads.length ? ` / ${leads.length}` : ''} total
          </span>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setFormData({ ...EMPTY_FORM }); setFormError(null); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            backgroundColor: 'var(--ept-accent)',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            letterSpacing: '0.03em',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {showAddForm ? <IconClose /> : <IconPlus />}
          {showAddForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: '10px 16px',
            fontSize: 12,
            color: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}>
            <IconClose />
          </button>
        </div>
      )}

      {/* ── Add Lead Form ─────────────────────────────────────────────────── */}
      {showAddForm && (
        <form
          onSubmit={handleCreateLead}
          style={{
            padding: 20,
            borderRadius: 14,
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--ept-accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: '0.02em' }}>New Lead</span>
          </div>

          {/* Row 1: Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="First Name" value={formData.first_name} onChange={(v) => setFormData({ ...formData, first_name: v })} placeholder="John" />
            <FormField label="Last Name" value={formData.last_name} onChange={(v) => setFormData({ ...formData, last_name: v })} placeholder="Doe" />
          </div>

          {/* Row 2: Phone + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Phone *" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1 (555) 000-0000" required />
            <FormField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="john@example.com" type="email" />
          </div>

          {/* Row 3: Company + Source */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Company" value={formData.company} onChange={(v) => setFormData({ ...formData, company: v })} placeholder="Acme Corp" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                style={{
                  padding: '8px 10px',
                  fontSize: 13,
                  color: 'var(--ept-text)',
                  backgroundColor: 'var(--ept-surface)',
                  border: '1px solid var(--ept-border)',
                  borderRadius: 8,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'auto',
                }}
              >
                {SOURCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Priority: {formData.priority}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              style={{ accentColor: priorityColor(formData.priority), width: '100%' }}
            />
          </div>

          {/* Row 5: Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional context about this lead..."
              rows={3}
              style={{
                padding: '8px 10px',
                fontSize: 13,
                color: 'var(--ept-text)',
                backgroundColor: 'var(--ept-surface)',
                border: '1px solid var(--ept-border)',
                borderRadius: 8,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Form Error */}
          {formError && (
            <div style={{ fontSize: 12, color: '#ef4444', padding: '6px 10px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
              {formError}
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setFormError(null); }}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--ept-text-muted)',
                backgroundColor: 'transparent',
                border: '1px solid var(--ept-border)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              style={{
                padding: '8px 20px',
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                backgroundColor: 'var(--ept-accent)',
                border: 'none',
                borderRadius: 8,
                cursor: formSubmitting ? 'wait' : 'pointer',
                opacity: formSubmitting ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {formSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      )}

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          padding: '12px 16px',
          borderRadius: 12,
          backgroundColor: 'var(--ept-card-bg)',
          border: '1px solid var(--ept-card-border)',
        }}
      >
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
          style={{
            padding: '7px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--ept-text)',
            backgroundColor: 'var(--ept-surface)',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            outline: 'none',
            cursor: 'pointer',
            appearance: 'auto',
            minWidth: 140,
          }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ept-text-muted)' }}>
            <IconSearch />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email, company..."
            style={{
              width: '100%',
              padding: '7px 10px 7px 30px',
              fontSize: 12,
              color: 'var(--ept-text)',
              backgroundColor: 'var(--ept-surface)',
              border: '1px solid var(--ept-border)',
              borderRadius: 8,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ept-text-muted)', cursor: 'pointer', padding: 2 }}
            >
              <IconClose />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          style={{
            padding: '7px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--ept-text)',
            backgroundColor: 'var(--ept-surface)',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            outline: 'none',
            cursor: 'pointer',
            appearance: 'auto',
            minWidth: 130,
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Refresh */}
        <button
          onClick={() => { setLoading(true); fetchLeads(); }}
          title="Refresh"
          style={{
            padding: '7px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--ept-text-muted)',
            backgroundColor: 'var(--ept-surface)',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--ept-accent)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--ept-text-muted)')}
        >
          Refresh
        </button>
      </div>

      {/* ── Empty State ───────────────────────────────────────────────────── */}
      {filteredLeads.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            borderRadius: 14,
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
            gap: 12,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ept-text-muted)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ept-text-secondary)' }}>
            {searchQuery || statusFilter !== 'all' ? 'No leads match your filters.' : 'No leads yet.'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', maxWidth: 300, textAlign: 'center', lineHeight: 1.5 }}>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or status filter.'
              : 'Add your first lead or import a CSV to get started.'}
          </p>
          {!showAddForm && !searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 8,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                backgroundColor: 'var(--ept-accent)',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <IconPlus /> Add First Lead
            </button>
          )}
        </div>
      )}

      {/* ── Lead Table ────────────────────────────────────────────────────── */}
      {filteredLeads.length > 0 && (
        <div
          style={{
            borderRadius: 14,
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.3fr 1.8fr 1fr 0.8fr 1fr 0.8fr 0.6fr',
              gap: 0,
              padding: '10px 16px',
              borderBottom: '1px solid var(--ept-border)',
              backgroundColor: 'var(--ept-surface)',
            }}
          >
            {['Name', 'Phone', 'Email', 'Status', 'Source', 'Priority', 'Last Contact', ''].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filteredLeads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isEditing = editingId === lead.id;
            const isDeleting = deletingId === lead.id;
            const statusInfo = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
            const pColor = priorityColor(lead.priority || 5);
            const pVal = Math.max(1, Math.min(10, lead.priority || 5));

            return (
              <div key={lead.id}>
                {/* Row */}
                <div
                  onClick={() => toggleExpand(lead.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.3fr 1.8fr 1fr 0.8fr 1fr 0.8fr 0.6fr',
                    gap: 0,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--ept-border)',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s',
                    backgroundColor: isExpanded ? 'var(--ept-accent-glow)' : 'transparent',
                    alignItems: 'center',
                  }}
                  onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--ept-surface)'; }}
                  onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {/* Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                    <IconChevron open={isExpanded} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ept-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.first_name || ''} {lead.last_name || ''}
                    </span>
                    {lead.company && (
                      <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.company}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <span style={{ fontSize: 12, color: 'var(--ept-text-secondary)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.phone || '--'}
                  </span>

                  {/* Email */}
                  <span style={{ fontSize: 12, color: 'var(--ept-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.email || '--'}
                  </span>

                  {/* Status Badge */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: statusInfo.color,
                      backgroundColor: statusInfo.bg,
                      borderRadius: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                      width: 'fit-content',
                    }}
                  >
                    {statusInfo.label}
                  </span>

                  {/* Source */}
                  <span style={{ fontSize: 11, color: 'var(--ept-text-muted)', textTransform: 'capitalize' }}>
                    {lead.source || '--'}
                  </span>

                  {/* Priority Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: 'var(--ept-surface)', overflow: 'hidden', maxWidth: 60 }}>
                      <div style={{ width: `${pVal * 10}%`, height: '100%', borderRadius: 2, backgroundColor: pColor, transition: 'width 0.3s ease' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: pColor, minWidth: 14, textAlign: 'right' }}>{pVal}</span>
                  </div>

                  {/* Last Contact */}
                  <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>
                    {formatDate(lead.last_contact || lead.updated_at)}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditing(lead)}
                      title="Edit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: '1px solid var(--ept-border)',
                        backgroundColor: 'transparent',
                        color: 'var(--ept-text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = 'var(--ept-accent)'; e.currentTarget.style.borderColor = 'var(--ept-accent)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = 'var(--ept-text-muted)'; e.currentTarget.style.borderColor = 'var(--ept-border)'; }}
                    >
                      <IconEdit />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Delete lead "${lead.first_name} ${lead.last_name}"?`)) handleDeleteLead(lead.id); }}
                      title="Delete"
                      disabled={isDeleting}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: '1px solid var(--ept-border)',
                        backgroundColor: 'transparent',
                        color: 'var(--ept-text-muted)',
                        cursor: isDeleting ? 'wait' : 'pointer',
                        opacity: isDeleting ? 0.4 : 1,
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = 'var(--ept-text-muted)'; e.currentTarget.style.borderColor = 'var(--ept-border)'; }}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '16px 20px 20px 40px',
                      borderBottom: '1px solid var(--ept-border)',
                      backgroundColor: 'var(--ept-accent-glow)',
                    }}
                  >
                    {isEditing ? (
                      /* ── Inline Edit Form ─────────────────────────────── */
                      <form onSubmit={handleUpdateLead} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: '0.02em' }}>Editing Lead</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                          <FormField label="First Name" value={editData.first_name} onChange={(v) => setEditData({ ...editData, first_name: v })} />
                          <FormField label="Last Name" value={editData.last_name} onChange={(v) => setEditData({ ...editData, last_name: v })} />
                          <FormField label="Phone" value={editData.phone} onChange={(v) => setEditData({ ...editData, phone: v })} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                          <FormField label="Email" value={editData.email} onChange={(v) => setEditData({ ...editData, email: v })} type="email" />
                          <FormField label="Company" value={editData.company} onChange={(v) => setEditData({ ...editData, company: v })} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</label>
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value as LeadStatus })}
                              style={{
                                padding: '7px 10px',
                                fontSize: 12,
                                color: 'var(--ept-text)',
                                backgroundColor: 'var(--ept-surface)',
                                border: '1px solid var(--ept-border)',
                                borderRadius: 8,
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'auto',
                              }}
                            >
                              {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source</label>
                            <select
                              value={editData.source}
                              onChange={(e) => setEditData({ ...editData, source: e.target.value as LeadSource })}
                              style={{
                                padding: '7px 10px',
                                fontSize: 12,
                                color: 'var(--ept-text)',
                                backgroundColor: 'var(--ept-surface)',
                                border: '1px solid var(--ept-border)',
                                borderRadius: 8,
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'auto',
                              }}
                            >
                              {SOURCE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              Priority: {editData.priority}
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={editData.priority}
                              onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                              style={{ accentColor: priorityColor(editData.priority), width: '100%', marginTop: 4 }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
                          <textarea
                            value={editData.notes}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            rows={3}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              color: 'var(--ept-text)',
                              backgroundColor: 'var(--ept-surface)',
                              border: '1px solid var(--ept-border)',
                              borderRadius: 8,
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: '7px 14px',
                              fontSize: 11,
                              fontWeight: 500,
                              color: 'var(--ept-text-muted)',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--ept-border)',
                              borderRadius: 8,
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={editSubmitting}
                            style={{
                              padding: '7px 18px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#fff',
                              backgroundColor: 'var(--ept-accent)',
                              border: 'none',
                              borderRadius: 8,
                              cursor: editSubmitting ? 'wait' : 'pointer',
                              opacity: editSubmitting ? 0.6 : 1,
                            }}
                          >
                            {editSubmitting ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* ── Read-Only Detail ──────────────────────────────── */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                          <DetailField label="Full Name" value={`${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '--'} />
                          <DetailField label="Phone" value={lead.phone || '--'} mono />
                          <DetailField label="Email" value={lead.email || '--'} />
                          <DetailField label="Company" value={lead.company || '--'} />
                          <DetailField label="Source" value={lead.source || '--'} capitalize />
                          <DetailField label="Priority" value={`${lead.priority || 5} / 10`} color={pColor} />
                          <DetailField label="Created" value={formatDate(lead.created_at)} />
                          <DetailField label="Updated" value={formatDate(lead.updated_at)} />
                        </div>

                        {/* Notes */}
                        {lead.notes && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</span>
                            <p style={{ fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{lead.notes}</p>
                          </div>
                        )}

                        {/* Call History Placeholder */}
                        <div
                          style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor: 'var(--ept-surface)',
                            border: '1px solid var(--ept-border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <IconPhone />
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Call History
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', lineHeight: 1.5 }}>
                            No calls recorded for this lead yet. Initiate a call from the Calls page or via a campaign.
                          </p>
                        </div>

                        {/* Detail Actions */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => startEditing(lead)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '7px 14px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: 'var(--ept-accent)',
                              backgroundColor: 'var(--ept-accent-glow)',
                              border: '1px solid var(--ept-accent)',
                              borderRadius: 8,
                              cursor: 'pointer',
                              transition: 'opacity 0.15s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                          >
                            <IconEdit /> Edit Lead
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete lead "${lead.first_name} ${lead.last_name}"?`)) handleDeleteLead(lead.id); }}
                            disabled={isDeleting}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '7px 14px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#ef4444',
                              backgroundColor: 'rgba(239,68,68,0.06)',
                              border: '1px solid rgba(239,68,68,0.25)',
                              borderRadius: 8,
                              cursor: isDeleting ? 'wait' : 'pointer',
                              opacity: isDeleting ? 0.5 : 1,
                              transition: 'opacity 0.15s',
                            }}
                          >
                            <IconTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '8px 10px',
          fontSize: 13,
          color: 'var(--ept-text)',
          backgroundColor: 'var(--ept-surface)',
          border: '1px solid var(--ept-border)',
          borderRadius: 8,
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ept-accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--ept-border)')}
      />
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
  capitalize,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
  color?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: color || 'var(--ept-text)',
          fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
          textTransform: capitalize ? 'capitalize' : 'none',
        }}
      >
        {value}
      </span>
    </div>
  );
}
