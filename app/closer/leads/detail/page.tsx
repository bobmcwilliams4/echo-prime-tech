'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { getLead, updateLead, deleteLead, getCalls, initiateCall } from '../../../../lib/closer-api';

/* ─── Types ─── */
interface LeadDetail {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  priority?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  assigned_to?: string;
  custom_fields?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  last_contacted_at?: string;
}

interface CallRecord {
  id: string;
  direction: string;
  status: string;
  duration_seconds?: number;
  sentiment?: string;
  outcome?: string;
  created_at: string;
}

/* ─── Helpers ─── */
function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'new': return { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' };
    case 'contacted': return { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' };
    case 'qualified': return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' };
    case 'proposal': return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' };
    case 'won': return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' };
    case 'lost': return { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' };
    default: return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
  }
}

function priorityLabel(p?: string): { label: string; color: string } {
  switch (p) {
    case 'high': return { label: 'High', color: '#ef4444' };
    case 'medium': return { label: 'Medium', color: '#f59e0b' };
    case 'low': return { label: 'Low', color: '#22c55e' };
    default: return { label: p || 'Normal', color: 'var(--ept-text-muted)' };
  }
}

function sentimentColor(s: string): string {
  if (s === 'positive') return '#22c55e';
  if (s === 'negative') return '#ef4444';
  return '#f59e0b';
}

/* ─── Inner Component ─── */
function LeadDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const leadId = searchParams.get('id') || '';

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [calling, setCalling] = useState(false);

  const loadLead = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    try {
      const leadData = await getLead(leadId);
      setLead(leadData);
      setEditNotes(leadData.notes || '');
      setEditStatus(leadData.status || 'new');
      const callsData = await getCalls(`lead_id=${leadId}`).catch(() => ({ calls: [] }));
      setCalls(callsData?.calls || callsData || []);
    } catch {
      /* lead not found */
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    if (!authLoading && user) loadLead();
  }, [authLoading, user, loadLead]);

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      await updateLead(lead.id, { notes: editNotes, status: editStatus });
      setLead({ ...lead, notes: editNotes, status: editStatus });
      setEditing(false);
    } catch { /* handle error */ }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!lead || !confirm('Delete this lead? This cannot be undone.')) return;
    try {
      await deleteLead(lead.id);
      router.push('/closer/leads');
    } catch { /* handle error */ }
  };

  const handleCall = async () => {
    if (!lead?.phone) return;
    setCalling(true);
    try {
      await initiateCall({ lead_id: lead.id, phone: lead.phone });
      router.push('/closer/calls/live');
    } catch { /* handle error */ }
    finally { setCalling(false); }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!leadId || !lead) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>Lead not found</p>
        <button onClick={() => router.push('/closer/leads')} className="mt-4 px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Back to Leads
        </button>
      </div>
    );
  }

  const badge = statusColor(lead.status);
  const priority = priorityLabel(lead.priority);
  const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/closer/leads')} className="p-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
          &#8592;
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold truncate" style={{ color: 'var(--ept-text)' }}>{lead.name}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ backgroundColor: badge.bg, color: badge.text }}>
              {lead.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Added {formatDate(lead.created_at)} &middot; Priority: <span style={{ color: priority.color, fontWeight: 600 }}>{priority.label}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {lead.phone && (
            <button
              onClick={handleCall}
              disabled={calling}
              className="px-5 py-2 rounded-xl font-semibold flex items-center gap-2"
              style={{ backgroundColor: '#22c55e', color: '#fff', opacity: calling ? 0.6 : 1 }}
            >
              {calling ? 'Connecting...' : 'Call'}
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-xl border font-medium"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Contact Information</h3>
          {[
            { label: 'Phone', value: lead.phone },
            { label: 'Email', value: lead.email },
            { label: 'Company', value: lead.company },
            { label: 'Source', value: lead.source },
            { label: 'Last Contacted', value: formatDate(lead.last_contacted_at) },
          ].map((r) => (
            <div key={r.label} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{r.label}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{r.value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Tags & Labels</h3>
          {lead.tags && lead.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No tags</p>
          )}
          <h3 className="text-sm font-semibold pt-2" style={{ color: 'var(--ept-text-muted)' }}>Assigned To</h3>
          <p className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{lead.assigned_to || 'Unassigned'}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Notes</h3>
          {editing && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>Status:</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="px-3 py-1 rounded-lg text-sm border"
                style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          )}
        </div>
        {editing ? (
          <>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg border resize-none text-sm"
              style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              placeholder="Add notes about this lead..."
            />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: '#ef4444' }}>
                Delete Lead
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <p className="leading-relaxed text-sm" style={{ color: lead.notes ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
            {lead.notes || 'No notes yet. Click Edit to add notes.'}
          </p>
        )}
      </div>

      {/* Call History */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text-muted)' }}>
            Call History ({calls.length})
          </h3>
        </div>
        {calls.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No calls yet</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
            {calls.map((c) => {
              const cb = statusColor(c.status);
              return (
                <button
                  key={c.id}
                  onClick={() => router.push(`/closer/calls/review?id=${c.id}`)}
                  className="w-full px-5 py-3 flex items-center gap-4 hover:opacity-80 transition-opacity text-left"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: c.direction === 'outbound' ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.15)', color: c.direction === 'outbound' ? '#3b82f6' : '#22c55e' }}>
                    {c.direction === 'outbound' ? '\u2197' : '\u2199'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>
                      {c.direction === 'outbound' ? 'Outbound' : 'Inbound'} Call
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      {formatDate(c.created_at)}
                    </p>
                  </div>
                  {c.duration_seconds != null && (
                    <span className="text-xs font-mono" style={{ color: 'var(--ept-text-secondary)' }}>
                      {Math.floor(c.duration_seconds / 60)}:{(c.duration_seconds % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: cb.bg, color: cb.text }}>
                    {c.status}
                  </span>
                  {c.sentiment && (
                    <span className="text-xs" style={{ color: sentimentColor(c.sentiment) }}>
                      {c.sentiment}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page Wrapper (Suspense for useSearchParams) ─── */
export default function LeadDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <LeadDetailInner />
    </Suspense>
  );
}
