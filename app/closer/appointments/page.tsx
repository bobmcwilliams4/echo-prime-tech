'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../../../lib/closer-api';

// ─── Types ───────────────────────────────────────────────────────────────────

type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
type AppointmentType = 'phone' | 'in-person' | 'video';
type InterestLevel = 'hot' | 'warm' | 'cold' | 'qualified';

interface Appointment {
  id: string;
  lead_id?: string;
  lead_name: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  company?: string;
  appointment_time?: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  interest_level?: InterestLevel;
  agent_name?: string;
  call_id?: string;
  notes: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface AppointmentFormData {
  lead_name: string;
  phone: string;
  email: string;
  company: string;
  date: string;
  time: string;
  type: AppointmentType;
  interest_level: InterestLevel | '';
  notes: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_FILTERS: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

const STATUS_STYLES: Record<AppointmentStatus, { color: string; bg: string; label: string }> = {
  scheduled:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', label: 'Scheduled' },
  confirmed:  { color: '#10b981', bg: 'rgba(16,185,129,0.10)', label: 'Confirmed' },
  completed:  { color: 'var(--ept-accent)', bg: 'rgba(20,184,166,0.10)', label: 'Completed' },
  cancelled:  { color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Cancelled' },
  no_show:    { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'No Show' },
};

const TYPE_STYLES: Record<AppointmentType, { color: string; bg: string; label: string }> = {
  phone:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', label: 'Phone' },
  'in-person': { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'In-Person' },
  video:       { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', label: 'Video' },
};

const INTEREST_STYLES: Record<InterestLevel, { color: string; bg: string; label: string; icon: string }> = {
  hot:       { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Hot', icon: '\u{1F525}' },
  warm:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Warm', icon: '\u2600' },
  cold:      { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Cold', icon: '\u2744' },
  qualified: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Qualified', icon: '\u2713' },
};

const EMPTY_FORM: AppointmentFormData = {
  lead_name: '',
  phone: '',
  email: '',
  company: '',
  date: '',
  time: '',
  type: 'phone',
  interest_level: '',
  notes: '',
};

// ─── SVG Icons ──────────────────────────────────────────────────────────────

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

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ept-text-muted)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" /><line x1="12" y1="18" x2="12" y2="18.01" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
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

// ─── Utility ────────────────────────────────────────────────────────────────

function formatDateTime(date: string, time: string): string {
  if (!date) return '--';
  try {
    const dt = new Date(`${date}T${time || '00:00'}`);
    if (isNaN(dt.getTime())) return date;
    return dt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + dt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return date;
  }
}

function isUpcoming(date: string, time: string, status: AppointmentStatus): boolean {
  if (status === 'completed' || status === 'cancelled' || status === 'no_show') return false;
  try {
    const dt = new Date(`${date}T${time || '23:59'}`);
    return dt.getTime() >= Date.now();
  } catch {
    return false;
  }
}

function todayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AppointmentsPage() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

  const [showBookForm, setShowBookForm] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({ ...EMPTY_FORM });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<AppointmentFormData>({ ...EMPTY_FORM });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ─── Data Fetching ──────────────────────────────────────────────────────

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const data = await getAppointments();
      const raw: any[] = Array.isArray(data) ? data : (data as any)?.appointments ?? (data as any)?.results ?? [];
      // Normalize backend fields → frontend fields
      const list: Appointment[] = raw.map((a: any) => {
        const name = a.lead_name || [a.first_name, a.last_name].filter(Boolean).join(' ') || 'Unknown';
        const apptTime = a.appointment_time || '';
        return {
          ...a,
          lead_name: name,
          email: a.email || '',
          company: a.company || '',
          date: a.date || (apptTime ? apptTime.slice(0, 10) : ''),
          time: a.time || (apptTime ? apptTime.slice(11, 16) : ''),
          interest_level: a.interest_level || undefined,
        };
      });
      setAppointments(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ─── Filtering + Sorting ────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...appointments];
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }
    result.sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const db = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return da - db;
    });
    return result;
  }, [appointments, statusFilter]);

  const upcoming = useMemo(() => filtered.filter((a) => isUpcoming(a.date, a.time, a.status)), [filtered]);
  const past = useMemo(() => filtered.filter((a) => !isUpcoming(a.date, a.time, a.status)), [filtered]);

  // ─── Create ─────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lead_name.trim()) { setFormError('Lead name is required.'); return; }
    if (!formData.date) { setFormError('Date is required.'); return; }
    if (!formData.time) { setFormError('Time is required.'); return; }

    setFormSubmitting(true);
    setFormError(null);
    try {
      await createAppointment({
        lead_name: formData.lead_name.trim(),
        phone: formData.phone.trim(),
        appointment_time: `${formData.date}T${formData.time}:00`,
        duration_minutes: 30,
        type: formData.type,
        notes: [
          formData.notes.trim(),
          formData.email ? `Email: ${formData.email.trim()}` : '',
          formData.company ? `Company: ${formData.company.trim()}` : '',
        ].filter(Boolean).join('\n'),
        interest_level: formData.interest_level || undefined,
        status: 'scheduled',
      });
      setFormData({ ...EMPTY_FORM });
      setShowBookForm(false);
      await fetchAppointments();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create appointment');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ─── Update ─────────────────────────────────────────────────────────────

  const startEditing = (appt: Appointment) => {
    setEditingId(appt.id);
    setEditData({
      lead_name: appt.lead_name || '',
      phone: appt.phone || '',
      email: appt.email || '',
      company: appt.company || '',
      date: appt.date || '',
      time: appt.time || '',
      type: appt.type || 'phone',
      interest_level: appt.interest_level || '',
      notes: appt.notes || '',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setEditSubmitting(true);
    try {
      await updateAppointment(editingId, {
        lead_name: editData.lead_name.trim(),
        phone: editData.phone.trim(),
        date: editData.date,
        time: editData.time,
        type: editData.type,
        notes: editData.notes.trim(),
      });
      setEditingId(null);
      await fetchAppointments();
    } catch (err: any) {
      setError(err?.message || 'Failed to update appointment');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ─── Status Change ──────────────────────────────────────────────────────

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    setActionLoading(id);
    try {
      await updateAppointment(id, { status });
      await fetchAppointments();
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAppointment(id);
      if (editingId === id) setEditingId(null);
      await fetchAppointments();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete appointment');
    } finally {
      setDeletingId(null);
    }
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
          Loading appointments...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Render: Page ───────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          Appointments
        </h2>
        <button
          onClick={() => { setShowBookForm(!showBookForm); setFormData({ ...EMPTY_FORM, date: todayString() }); setFormError(null); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
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
          {showBookForm ? <IconClose /> : <IconPlus />}
          {showBookForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {/* ── Status Filter Pills ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((sf) => {
          const active = statusFilter === sf.value;
          return (
            <button
              key={sf.value}
              onClick={() => setStatusFilter(sf.value)}
              style={{
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                color: active ? '#fff' : 'var(--ept-text-secondary)',
                backgroundColor: active ? 'var(--ept-accent)' : 'var(--ept-surface)',
                border: active ? '1px solid var(--ept-accent)' : '1px solid var(--ept-border)',
                borderRadius: 20,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
              }}
            >
              {sf.label}
            </button>
          );
        })}
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
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

      {/* ── Book Appointment Form ───────────────────────────────────────── */}
      {showBookForm && (
        <form
          onSubmit={handleCreate}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: '0.02em' }}>Book New Appointment</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Lead Name *" value={formData.lead_name} onChange={(v) => setFormData({ ...formData, lead_name: v })} placeholder="John Doe" required />
            <FormField label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1 (555) 000-0000" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="john@company.com" type="email" />
            <FormField label="Company" value={formData.company} onChange={(v) => setFormData({ ...formData, company: v })} placeholder="Acme Corp" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Date *" value={formData.date} onChange={(v) => setFormData({ ...formData, date: v })} type="date" required />
            <FormField label="Time *" value={formData.time} onChange={(v) => setFormData({ ...formData, time: v })} type="time" required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
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
                <option value="phone">Phone</option>
                <option value="in-person">In-Person</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interest</label>
              <select
                value={formData.interest_level}
                onChange={(e) => setFormData({ ...formData, interest_level: e.target.value as InterestLevel | '' })}
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
                <option value="">Unknown</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="qualified">Qualified</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Agenda, preparation notes, special instructions..."
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

          {formError && (
            <div style={{ fontSize: 12, color: '#ef4444', padding: '6px 10px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
              {formError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={() => { setShowBookForm(false); setFormError(null); }}
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
              {formSubmitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      )}

      {/* ── Empty State ─────────────────────────────────────────────────── */}
      {filtered.length === 0 && (
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
          <IconCalendar />
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ept-text-secondary)' }}>
            {statusFilter !== 'all' ? 'No appointments match this filter.' : 'No appointments yet.'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', maxWidth: 320, textAlign: 'center', lineHeight: 1.5 }}>
            {statusFilter !== 'all'
              ? 'Try selecting a different status filter above.'
              : 'Book your first appointment to start managing your schedule.'}
          </p>
          {!showBookForm && statusFilter === 'all' && (
            <button
              onClick={() => { setShowBookForm(true); setFormData({ ...EMPTY_FORM, date: todayString() }); }}
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
              <IconPlus /> Book Your First Appointment
            </button>
          )}
        </div>
      )}

      {/* ── Upcoming Section ────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Upcoming ({upcoming.length})
            </span>
          </div>
          {upcoming.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              editingId={editingId}
              editData={editData}
              editSubmitting={editSubmitting}
              deletingId={deletingId}
              actionLoading={actionLoading}
              onStartEdit={startEditing}
              onEditChange={setEditData}
              onEditSubmit={handleUpdate}
              onEditCancel={() => setEditingId(null)}
              onConfirm={(id) => changeStatus(id, 'confirmed')}
              onCancel={(id) => changeStatus(id, 'cancelled')}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      {upcoming.length > 0 && past.length > 0 && (
        <div style={{ borderTop: '1px solid var(--ept-border)', margin: '4px 0' }} />
      )}

      {/* ── Past Section ────────────────────────────────────────────────── */}
      {past.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ept-text-muted)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Past ({past.length})
            </span>
          </div>
          {past.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              editingId={editingId}
              editData={editData}
              editSubmitting={editSubmitting}
              deletingId={deletingId}
              actionLoading={actionLoading}
              onStartEdit={startEditing}
              onEditChange={setEditData}
              onEditSubmit={handleUpdate}
              onEditCancel={() => setEditingId(null)}
              onConfirm={(id) => changeStatus(id, 'confirmed')}
              onCancel={(id) => changeStatus(id, 'cancelled')}
              onDelete={handleDelete}
              isPast
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Appointment Card ───────────────────────────────────────────────────────

function buildGoogleCalendarUrl(appt: Appointment): string {
  const dt = appt.appointment_time || `${appt.date}T${appt.time}:00`;
  const start = dt.replace(/[-:]/g, '').replace('T', 'T').split('.')[0];
  // Add 30 min for end time
  const startDate = new Date(dt);
  startDate.setMinutes(startDate.getMinutes() + 30);
  const end = startDate.toISOString().replace(/[-:]/g, '').split('.')[0];
  const title = encodeURIComponent(`Call: ${appt.lead_name || 'Lead'}`);
  const details = encodeURIComponent(
    [appt.notes, appt.phone ? `Phone: ${appt.phone}` : '', appt.email ? `Email: ${appt.email}` : '', appt.company ? `Company: ${appt.company}` : ''].filter(Boolean).join('\n')
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&sf=true&output=xml`;
}

interface AppointmentCardProps {
  appt: Appointment;
  editingId: string | null;
  editData: AppointmentFormData;
  editSubmitting: boolean;
  deletingId: string | null;
  actionLoading: string | null;
  onStartEdit: (appt: Appointment) => void;
  onEditChange: (data: AppointmentFormData) => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onEditCancel: () => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  isPast?: boolean;
}

function AppointmentCard({
  appt,
  editingId,
  editData,
  editSubmitting,
  deletingId,
  actionLoading,
  onStartEdit,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onConfirm,
  onCancel,
  onDelete,
  isPast,
}: AppointmentCardProps) {
  const isEditing = editingId === appt.id;
  const isDeleting = deletingId === appt.id;
  const isActionLoading = actionLoading === appt.id;
  const statusInfo = STATUS_STYLES[appt.status] || STATUS_STYLES.scheduled;
  const typeInfo = TYPE_STYLES[appt.type] || TYPE_STYLES.phone;

  if (isEditing) {
    return (
      <form
        onSubmit={onEditSubmit}
        style={{
          padding: 20,
          borderRadius: 14,
          backgroundColor: 'var(--ept-card-bg)',
          border: '1px solid var(--ept-card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: '0.02em' }}>Editing Appointment</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Lead Name" value={editData.lead_name} onChange={(v) => onEditChange({ ...editData, lead_name: v })} required />
          <FormField label="Phone" value={editData.phone} onChange={(v) => onEditChange({ ...editData, phone: v })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Email" value={editData.email} onChange={(v) => onEditChange({ ...editData, email: v })} type="email" />
          <FormField label="Company" value={editData.company} onChange={(v) => onEditChange({ ...editData, company: v })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <FormField label="Date" value={editData.date} onChange={(v) => onEditChange({ ...editData, date: v })} type="date" required />
          <FormField label="Time" value={editData.time} onChange={(v) => onEditChange({ ...editData, time: v })} type="time" required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</label>
            <select
              value={editData.type}
              onChange={(e) => onEditChange({ ...editData, type: e.target.value as AppointmentType })}
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
              <option value="phone">Phone</option>
              <option value="in-person">In-Person</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interest</label>
            <select
              value={editData.interest_level}
              onChange={(e) => onEditChange({ ...editData, interest_level: e.target.value as InterestLevel | '' })}
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
              <option value="">Unknown</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="qualified">Qualified</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</label>
          <textarea
            value={editData.notes}
            onChange={(e) => onEditChange({ ...editData, notes: e.target.value })}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            onClick={onEditCancel}
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
    );
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        backgroundColor: 'var(--ept-card-bg)',
        border: '1px solid var(--ept-card-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity: isPast ? 0.75 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {/* Top row: name + badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)' }}>{appt.lead_name || 'Unnamed'}</span>
          {appt.company && (
            <span style={{ fontSize: 11, color: 'var(--ept-text-secondary)', fontWeight: 500 }}>
              {appt.company}
            </span>
          )}
          {appt.agent_name && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', fontSize: 9, fontWeight: 600, color: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.10)', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Booked by {appt.agent_name}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Interest level badge */}
          {appt.interest_level && INTEREST_STYLES[appt.interest_level] && (() => {
            const il = INTEREST_STYLES[appt.interest_level!];
            return (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 10px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: il.color,
                  backgroundColor: il.bg,
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {il.icon} {il.label}
              </span>
            );
          })()}
          {/* Type badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 600,
              color: typeInfo.color,
              backgroundColor: typeInfo.bg,
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {typeInfo.label}
          </span>
          {/* Status badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 600,
              color: statusInfo.color,
              backgroundColor: statusInfo.bg,
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Contact info row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        {appt.phone && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ept-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            <IconPhone /> {appt.phone}
          </span>
        )}
        {appt.email && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ept-text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            {appt.email}
          </span>
        )}
      </div>

      {/* Date/time row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ept-text-secondary)', fontSize: 12 }}>
        <IconClock />
        <span>{formatDateTime(appt.date, appt.time)}</span>
      </div>

      {/* Notes */}
      {appt.notes && (
        <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
          {appt.notes}
        </p>
      )}

      {/* Actions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {appt.status === 'scheduled' && (
          <button
            onClick={() => onConfirm(appt.id)}
            disabled={isActionLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 8,
              cursor: isActionLoading ? 'wait' : 'pointer',
              opacity: isActionLoading ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <IconCheck /> {isActionLoading ? 'Confirming...' : 'Confirm'}
          </button>
        )}
        {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
          <button
            onClick={() => onCancel(appt.id)}
            disabled={isActionLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: '#6b7280',
              backgroundColor: 'rgba(107,114,128,0.08)',
              border: '1px solid rgba(107,114,128,0.25)',
              borderRadius: 8,
              cursor: isActionLoading ? 'wait' : 'pointer',
              opacity: isActionLoading ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <IconClose /> Cancel
          </button>
        )}
        <button
          onClick={() => onStartEdit(appt)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--ept-accent)',
            backgroundColor: 'transparent',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--ept-accent)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--ept-border)'; }}
        >
          <IconEdit /> Edit
        </button>
        <button
          onClick={() => window.open(buildGoogleCalendarUrl(appt), '_blank')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: '#3b82f6',
            backgroundColor: 'transparent',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--ept-border)'; }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Google Cal
        </button>
        <button
          onClick={() => { if (confirm(`Delete appointment for "${appt.lead_name}"?`)) onDelete(appt.id); }}
          disabled={isDeleting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: '#ef4444',
            backgroundColor: 'transparent',
            border: '1px solid var(--ept-border)',
            borderRadius: 8,
            cursor: isDeleting ? 'wait' : 'pointer',
            opacity: isDeleting ? 0.5 : 1,
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--ept-border)'; }}
        >
          <IconTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

// ─── Form Field ─────────────────────────────────────────────────────────────

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
