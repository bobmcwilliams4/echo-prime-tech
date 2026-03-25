'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getLeads, createLead, updateLead, deleteLead, initiateCall, importLeads, getLeadCategories, renameLeadCategory, deleteLeadCategory, moveLeadsToCategory } from '../../../lib/closer-api';
import { Conversation } from '@11labs/client';

// ─── ConvAI Widget — Browser-based voice via ElevenLabs SDK ─────────────────

function ConvAIWidget({ agentId, userName, onEnd }: { agentId: string; userName: string; onEnd?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const conversationRef = useRef<any>(null);
  const startedRef = useRef(false);

  const startCall = useCallback(async () => {
    if (conversationRef.current || startedRef.current) return;
    startedRef.current = true;
    setStatus('connecting');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const conv = await Conversation.startSession({
        agentId,
        dynamicVariables: { user_name: userName || 'visitor' },
        onConnect: () => { setStatus('connected'); },
        onDisconnect: () => { setStatus('idle'); conversationRef.current = null; startedRef.current = false; onEnd?.(); },
        onModeChange: (p: { mode: 'speaking' | 'listening' }) => { setIsSpeaking(p.mode === 'speaking'); },
        onError: (msg: string) => { console.error('[ConvAI] Error:', msg); setStatus('error'); startedRef.current = false; },
      } as any);
      conversationRef.current = conv;
    } catch (err: unknown) {
      console.error('[ConvAI] Start failed:', err);
      setStatus('error');
      startedRef.current = false;
    }
  }, [agentId, userName, onEnd]);

  // Auto-start on mount
  useEffect(() => {
    startCall();
    return () => { conversationRef.current?.endSession?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusColor = isSpeaking ? '#ef4444' : status === 'connected' ? '#22c55e' : status === 'connecting' ? '#eab308' : '#64748b';
  const statusText = status === 'connecting' ? 'Connecting...' : status === 'connected' ? (isSpeaking ? 'AI Speaking...' : 'Listening — speak now') : status === 'error' ? 'Connection failed' : 'Starting...';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block', flexShrink: 0, animation: status === 'connected' && !isSpeaking ? 'pulse 2s infinite' : 'none' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{statusText}</span>
    </div>
  );
}

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
  category: string | null;
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
  category: string;
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
  category: '',
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

function IconUpload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

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

  // Call state
  const [callingId, setCallingId] = useState<string | null>(null);
  const [callSuccess, setCallSuccess] = useState<string | null>(null);

  // Browser voice call (ConvAI) state
  const [browserCallLead, setBrowserCallLead] = useState<Lead | null>(null);

  // Import modal state
  const [showImport, setShowImport] = useState(false);
  const [importDragging, setImportDragging] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, string>[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [importFolder, setImportFolder] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder management state
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [folderActionLoading, setFolderActionLoading] = useState(false);

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

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getLeadCategories();
      setCategories((data as any)?.categories ?? []);
    } catch { /* categories are optional */ }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchCategories();
  }, [fetchLeads, fetchCategories]);

  // ─── Filtering, Search, Sort ────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Category/folder filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === '__uncategorized__') {
        result = result.filter((l) => !l.category);
      } else {
        result = result.filter((l) => l.category === categoryFilter);
      }
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
  }, [leads, statusFilter, categoryFilter, searchQuery, sortMode]);

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
        category: formData.category.trim(),
      });
      setFormData({ ...EMPTY_FORM });
      setShowAddForm(false);
      await fetchLeads();
      await fetchCategories();
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
      category: lead.category || '',
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
        category: editData.category.trim(),
      });
      setEditingId(null);
      await fetchLeads();
      await fetchCategories();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update lead');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ─── Folder Management ──────────────────────────────────────────────────

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name || categories.includes(name)) return;
    // Create folder by assigning it to no leads — it will appear after we manually add it
    setCategories([...categories, name].sort());
    setNewFolderName('');
  };

  const handleRenameFolder = async (oldName: string) => {
    const name = renameValue.trim();
    if (!name || name === oldName) { setRenamingFolder(null); return; }
    setFolderActionLoading(true);
    try {
      await renameLeadCategory(oldName, name);
      await fetchLeads();
      await fetchCategories();
      setRenamingFolder(null);
      setRenameValue('');
    } catch (err: any) {
      setError(err?.message || 'Failed to rename folder');
    } finally {
      setFolderActionLoading(false);
    }
  };

  const handleDeleteFolder = async (name: string) => {
    if (!confirm(`Delete folder "${name}"? Leads will be moved to Uncategorized.`)) return;
    setFolderActionLoading(true);
    try {
      await deleteLeadCategory(name);
      await fetchLeads();
      await fetchCategories();
      if (categoryFilter === name) setCategoryFilter('all');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete folder');
    } finally {
      setFolderActionLoading(false);
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

  // ─── Call with AI Agent ─────────────────────────────────────────────────

  const handleCallLead = async (lead: Lead) => {
    if (!lead.phone) {
      setError('This lead has no phone number');
      return;
    }
    setCallingId(lead.id);
    setCallSuccess(null);
    try {
      await initiateCall({
        lead_id: lead.id,
        phone: lead.phone,
        name: `${lead.first_name} ${lead.last_name}`.trim(),
      });
      setCallSuccess(lead.id);
      setTimeout(() => setCallSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate call');
    } finally {
      setCallingId(null);
    }
  };

  // ─── Import Handlers ───────────────────────────────────────────────────

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
        else { current += ch; }
      }
      values.push(current.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ''; });
      return row;
    });
  };

  const handleImportFile = async (file: File) => {
    setImportFile(file);
    setImportError(null);
    setImportResult(null);
    setImportPreview([]);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'json' && ext !== 'csv') {
      setImportError('Only .json and .csv files are supported');
      setImportFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImportError('File too large (max 10MB)');
      setImportFile(null);
      return;
    }

    try {
      const text = await file.text();
      let rows: Record<string, string>[];
      if (ext === 'json') {
        const parsed = JSON.parse(text);
        rows = Array.isArray(parsed) ? parsed : parsed.leads || parsed.data || [parsed];
      } else {
        rows = parseCSV(text);
      }
      if (!rows.length) { setImportError('No leads found in file'); return; }
      setImportPreview(rows);
    } catch (err: any) {
      setImportError(err?.message || 'Failed to parse file');
      setImportFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImportFile(file);
  };

  const handleImportSubmit = async () => {
    if (!importPreview.length) return;
    setImportSubmitting(true);
    setImportError(null);
    try {
      const leadsToImport = importPreview.map((row) => ({
        first_name: row.first_name || row.firstname || row.first || row.name?.split(' ')[0] || '',
        last_name: row.last_name || row.lastname || row.last || row.surname || row.name?.split(' ').slice(1).join(' ') || '',
        phone: row.phone || row.phone_number || row.tel || row.mobile || row.cell || row.cell_phone || '',
        email: row.email || row.email_address || row.e_mail || '',
        company: row.company || row.organization || row.business || row.org || row.company_name || '',
        source: 'csv' as LeadSource,
        notes: row.notes || row.note || row.description || row.comment || row.comments || row.memo || row.remark || row.remarks || row.details || row.additional_info || row.info || row.additional_notes || '',
        priority: parseInt(row.priority || '5', 10) || 5,
        status: (row.status as LeadStatus) || 'new',
        category: importFolder !== 'none' ? importFolder : (row.category || row.folder || row.group || row.directory || row.list || ''),
      }));

      const result = await importLeads({ leads: leadsToImport });
      const imported = result?.created ?? result?.imported ?? leadsToImport.length;
      const skipped = result?.skipped ?? 0;
      const errorCount = typeof result?.errors === 'number' ? result.errors : (result?.errors?.length ?? 0);
      const errorDetails = result?.details?.errors ?? (Array.isArray(result?.errors) ? result.errors : []);
      setImportResult({ imported, skipped, errors: errorDetails.length ? errorDetails : (errorCount > 0 ? [{ reason: `${errorCount} leads failed` }] : []) });
      await fetchLeads();
    } catch (err: any) {
      setImportError(err?.message || 'Import failed');
    } finally {
      setImportSubmitting(false);
    }
  };

  const resetImport = () => {
    setShowImport(false);
    setImportFile(null);
    setImportPreview([]);
    setImportError(null);
    setImportResult(null);
    setImportDragging(false);
    setImportFolder('none');
  };

  const openImport = () => {
    setImportFile(null);
    setImportPreview([]);
    setImportError(null);
    setImportResult(null);
    setImportDragging(false);
    setShowImport(true);
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            data-tutorial="leads-import"
            onClick={openImport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--ept-text-secondary)',
              backgroundColor: 'transparent',
              border: '1px solid var(--ept-border)',
              borderRadius: 10,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--ept-accent)'; e.currentTarget.style.color = 'var(--ept-accent)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--ept-border)'; e.currentTarget.style.color = 'var(--ept-text-secondary)'; }}
          >
            <IconUpload />
            Import
          </button>
          <button
            data-tutorial="leads-add"
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
          data-tutorial="leads-form"
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
            <FormField label="First Name" value={formData.first_name} onChange={(v) => setFormData({ ...formData, first_name: v })} placeholder="John" data-tutorial="leads-first-name" />
            <FormField label="Last Name" value={formData.last_name} onChange={(v) => setFormData({ ...formData, last_name: v })} placeholder="Doe" />
          </div>

          {/* Row 2: Phone + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Phone *" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1 (555) 000-0000" required data-tutorial="leads-phone" />
            <FormField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="john@example.com" type="email" />
          </div>

          {/* Row 3: Company + Source + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
            <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} placeholder="e.g. Enterprise, SMB, VIP" data-tutorial="leads-category" />
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

      {/* ── Import Modal ────────────────────────────────────────────────── */}
      {showImport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowImport(false); resetImport(); } }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '85vh',
              overflow: 'auto',
              margin: 16,
              padding: 24,
              borderRadius: 16,
              backgroundColor: 'var(--ept-card-bg)',
              border: '1px solid var(--ept-card-border)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(20,184,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconUpload />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>Import Leads</h3>
                  <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', margin: 0 }}>Upload a JSON or CSV file</p>
                </div>
              </div>
              <button
                onClick={() => { setShowImport(false); resetImport(); }}
                style={{ background: 'none', border: 'none', color: 'var(--ept-text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <IconClose />
              </button>
            </div>

            {/* Result Banner */}
            {importResult && (
              <div
                style={{
                  padding: '12px 16px',
                  marginBottom: 16,
                  borderRadius: 10,
                  fontSize: 13,
                  backgroundColor: importResult.errors.length ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                  border: `1px solid ${importResult.errors.length ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                  color: importResult.errors.length ? '#ef4444' : '#22c55e',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {importResult.imported} imported, {importResult.skipped} skipped
                </div>
                {importResult.errors.length > 0 && (
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: 12 }}>
                    {importResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                    {importResult.errors.length > 5 && <li>...and {importResult.errors.length - 5} more</li>}
                  </ul>
                )}
              </div>
            )}

            {/* Drop Zone */}
            {!importPreview.length && !importResult && (
              <div
                onDragOver={(e) => { e.preventDefault(); setImportDragging(true); }}
                onDragLeave={() => setImportDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: 40,
                  borderRadius: 12,
                  border: `2px dashed ${importDragging ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
                  backgroundColor: importDragging ? 'rgba(20,184,166,0.06)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files?.[0]) handleImportFile(e.target.files[0]); }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ept-accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', margin: 0 }}>
                      {importDragging ? 'Drop file here' : 'Drag & drop your file here'}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', margin: '4px 0 0' }}>
                      or <span style={{ color: 'var(--ept-accent)', fontWeight: 600 }}>browse files</span> — JSON or CSV, max 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {importError && (
              <div style={{ padding: '10px 14px', marginTop: 12, fontSize: 12, color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                {importError}
              </div>
            )}

            {/* Preview Table */}
            {importPreview.length > 0 && !importResult && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>
                    Preview — {importPreview.length} lead{importPreview.length !== 1 ? 's' : ''} found
                  </span>
                  <button
                    onClick={resetImport}
                    style={{ fontSize: 11, color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Choose different file
                  </button>
                </div>
                <div style={{ overflow: 'auto', maxHeight: 240, borderRadius: 8, border: '1px solid var(--ept-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                        {Object.keys(importPreview[0]).slice(0, 6).map((col) => (
                          <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--ept-text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--ept-border)' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 8).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                          {Object.keys(importPreview[0]).slice(0, 6).map((col) => (
                            <td key={col} style={{ padding: '6px 10px', color: 'var(--ept-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                              {row[col] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {importPreview.length > 8 && (
                  <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 6, textAlign: 'center' }}>
                    ...and {importPreview.length - 8} more rows
                  </p>
                )}

                {/* Folder assignment for import */}
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-secondary)', whiteSpace: 'nowrap' }}>Import into folder:</label>
                  <select
                    value={importFolder}
                    onChange={(e) => setImportFolder(e.target.value)}
                    style={{
                      padding: '6px 10px', fontSize: 12, color: 'var(--ept-text)',
                      backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                      borderRadius: 6, outline: 'none', cursor: 'pointer', flex: 1, maxWidth: 200,
                    }}
                  >
                    <option value="none">Auto-detect from file</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="or type new folder..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        const val = (e.target as HTMLInputElement).value.trim();
                        setImportFolder(val);
                        if (!categories.includes(val)) setCategories([...categories, val].sort());
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    style={{
                      padding: '6px 10px', fontSize: 12, color: 'var(--ept-text)',
                      backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                      borderRadius: 6, outline: 'none', flex: 1, maxWidth: 180,
                    }}
                  />
                </div>

                <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', marginTop: 10, lineHeight: 1.5 }}>
                  Columns auto-mapped: <strong>first_name</strong>, <strong>last_name</strong>, <strong>phone</strong>, <strong>email</strong>, <strong>company</strong>, <strong>notes</strong> (or note, comment, memo, description, remark, details), <strong>category</strong> (or folder, group)
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => { setShowImport(false); resetImport(); }}
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
                {importResult ? 'Close' : 'Cancel'}
              </button>
              {importPreview.length > 0 && !importResult && (
                <button
                  onClick={handleImportSubmit}
                  disabled={importSubmitting}
                  style={{
                    padding: '8px 20px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: 'var(--ept-accent)',
                    border: 'none',
                    borderRadius: 8,
                    cursor: importSubmitting ? 'wait' : 'pointer',
                    opacity: importSubmitting ? 0.6 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {importSubmitting ? 'Importing...' : `Import ${importPreview.length} Lead${importPreview.length !== 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          </div>
        </div>
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
          data-tutorial="leads-status-filter"
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

        {/* Folder Dropdown */}
        <select
          data-tutorial="leads-category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
          <option value="all">All Folders</option>
          <option value="__uncategorized__">Uncategorized</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Manage Folders */}
        <button
          onClick={() => setShowFolderManager(!showFolderManager)}
          style={{
            padding: '7px 10px',
            fontSize: 11,
            fontWeight: 600,
            color: showFolderManager ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
            backgroundColor: 'var(--ept-surface)',
            border: `1px solid ${showFolderManager ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {showFolderManager ? 'Close' : 'Manage Folders'}
        </button>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ept-text-muted)' }}>
            <IconSearch />
          </div>
          <input
            data-tutorial="leads-search"
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

      {/* ── Folder Manager Panel ─────────────────────────────────────────── */}
      {showFolderManager && (
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: 'var(--ept-card-bg)',
            border: '1px solid var(--ept-card-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ept-accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>Folders</span>
              <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>({categories.length})</span>
            </div>
          </div>

          {/* Create new folder */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); }}
              placeholder="New folder name..."
              style={{
                flex: 1, padding: '8px 12px', fontSize: 12, color: 'var(--ept-text)',
                backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                borderRadius: 8, outline: 'none',
              }}
            />
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || categories.includes(newFolderName.trim())}
              style={{
                padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#fff',
                backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 8,
                cursor: !newFolderName.trim() ? 'not-allowed' : 'pointer',
                opacity: !newFolderName.trim() ? 0.5 : 1,
              }}
            >
              Create
            </button>
          </div>

          {/* Folder list */}
          {categories.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', textAlign: 'center', padding: '12px 0' }}>
              No folders yet. Create one above or assign a folder when importing leads.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {categories.map((cat) => {
                const count = leads.filter((l) => l.category === cat).length;
                const isRenaming = renamingFolder === cat;
                return (
                  <div
                    key={cat}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                      borderRadius: 8, backgroundColor: categoryFilter === cat ? 'rgba(20,184,166,0.08)' : 'transparent',
                      border: `1px solid ${categoryFilter === cat ? 'var(--ept-accent)' : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={categoryFilter === cat ? 'var(--ept-accent)' : 'var(--ept-text-muted)'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>

                    {isRenaming ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFolder(cat); if (e.key === 'Escape') setRenamingFolder(null); }}
                        onBlur={() => handleRenameFolder(cat)}
                        style={{
                          flex: 1, padding: '4px 8px', fontSize: 12, color: 'var(--ept-text)',
                          backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-accent)',
                          borderRadius: 4, outline: 'none',
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                        style={{
                          flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 13, fontWeight: 500, color: 'var(--ept-text)', padding: 0,
                        }}
                      >
                        {cat}
                      </button>
                    )}

                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)', fontWeight: 500, minWidth: 20, textAlign: 'right' }}>
                      {count}
                    </span>

                    {!isRenaming && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => { setRenamingFolder(cat); setRenameValue(cat); }}
                          title="Rename"
                          disabled={folderActionLoading}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ept-text-muted)', padding: 2, opacity: folderActionLoading ? 0.4 : 1 }}
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(cat)}
                          title="Delete folder"
                          disabled={folderActionLoading}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ept-text-muted)', padding: 2, opacity: folderActionLoading ? 0.4 : 1 }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
              gridTemplateColumns: '1.8fr 1.2fr 1.6fr 0.9fr 0.8fr 0.8fr 0.8fr 0.7fr 0.5fr',
              gap: 0,
              padding: '10px 16px',
              borderBottom: '1px solid var(--ept-border)',
              backgroundColor: 'var(--ept-surface)',
            }}
          >
            {['Name', 'Phone', 'Email', 'Status', 'Source', 'Category', 'Priority', 'Last Contact', ''].map((h) => (
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
                    gridTemplateColumns: '1.8fr 1.2fr 1.6fr 0.9fr 0.8fr 0.8fr 0.8fr 0.7fr 0.5fr',
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

                  {/* Category */}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: lead.category ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {lead.category || '--'}
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
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
                          <FormField label="Category" value={editData.category} onChange={(v) => setEditData({ ...editData, category: v })} placeholder="e.g. Enterprise, SMB, VIP" />
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
                          <DetailField label="Category" value={lead.category || '--'} />
                          <DetailField label="Priority" value={`${lead.priority || 5} / 10`} color={pColor} />
                          <DetailField label="Created" value={formatDate(lead.created_at)} />
                        </div>

                        {/* Notes */}
                        {lead.notes && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes</span>
                            <p style={{ fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{lead.notes}</p>
                          </div>
                        )}

                        {/* AI Agent Voice Call */}
                        <div
                          style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor: 'var(--ept-surface)',
                            border: browserCallLead?.id === lead.id ? '1px solid #22c55e' : '1px solid var(--ept-border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <IconPhone />
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                AI Agent
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {/* PRIMARY: Talk via Browser (ElevenLabs ConvAI — WORKS) */}
                              {browserCallLead?.id === lead.id ? (
                                <button
                                  onClick={() => setBrowserCallLead(null)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 14px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#fff',
                                    backgroundColor: '#ef4444',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                                  </svg>
                                  End Call
                                </button>
                              ) : (
                                <button
                                  onClick={() => { setBrowserCallLead(lead); }}
                                  disabled={lead.status === 'dnc'}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 14px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#fff',
                                    backgroundColor: '#22c55e',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: lead.status === 'dnc' ? 'not-allowed' : 'pointer',
                                    opacity: lead.status === 'dnc' ? 0.4 : 1,
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseOver={(e) => { if (lead.status !== 'dnc') e.currentTarget.style.opacity = '0.85'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.opacity = lead.status === 'dnc' ? '0.4' : '1'; }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                                  </svg>
                                  Talk via Browser
                                </button>
                              )}
                              {/* SECONDARY: Phone call (Twilio outbound) */}
                              <button
                                onClick={() => handleCallLead(lead)}
                                disabled={callingId === lead.id || !lead.phone || lead.status === 'dnc'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '6px 14px',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: callingId === lead.id ? '#fff' : callSuccess === lead.id ? '#fff' : 'var(--ept-text-secondary)',
                                  backgroundColor: callingId === lead.id ? '#6b7280' : callSuccess === lead.id ? '#059669' : 'transparent',
                                  border: callingId === lead.id || callSuccess === lead.id ? 'none' : '1px solid var(--ept-border)',
                                  borderRadius: 8,
                                  cursor: callingId === lead.id || !lead.phone || lead.status === 'dnc' ? 'not-allowed' : 'pointer',
                                  opacity: !lead.phone || lead.status === 'dnc' ? 0.4 : 1,
                                  transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => { if (lead.phone && lead.status !== 'dnc' && callingId !== lead.id) e.currentTarget.style.opacity = '0.85'; }}
                                onMouseOut={(e) => { e.currentTarget.style.opacity = !lead.phone || lead.status === 'dnc' ? '0.4' : '1'; }}
                              >
                                <IconPhone />
                                {callingId === lead.id ? 'Dialing...' : callSuccess === lead.id ? 'Called!' : 'Call Phone'}
                              </button>
                            </div>
                          </div>
                          {browserCallLead?.id === lead.id && (
                            <div style={{ padding: '8px 0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>AI AGENT ACTIVE</span>
                              </div>
                              <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Click the microphone button below to start the voice conversation. The AI agent knows the lead&apos;s name and will qualify them.
                              </p>
                              <ConvAIWidget
                                agentId="agent_7901khgqmsy8ey1rw38py5qxzxpa"
                                userName={`${lead.first_name} ${lead.last_name}`.trim() || 'visitor'}
                                onEnd={() => setBrowserCallLead(null)}
                              />
                            </div>
                          )}
                          {!browserCallLead || browserCallLead.id !== lead.id ? (
                            <>
                              {lead.status === 'dnc' && (
                                <p style={{ fontSize: 11, color: '#ef4444', margin: 0 }}>Lead is on Do Not Call list.</p>
                              )}
                              {lead.status !== 'dnc' && (
                                <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                  Use &quot;Talk via Browser&quot; for instant voice conversation, or &quot;Call Phone&quot; to ring {lead.phone || 'their number'}.
                                </p>
                              )}
                            </>
                          ) : null}
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

      {/* ConvAI widget is now rendered inline inside each lead card when active */}
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
  'data-tutorial': dataTutorial,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  'data-tutorial'?: string;
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
        data-tutorial={dataTutorial}
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
