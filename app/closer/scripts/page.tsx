'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getScripts, createScript, updateScript } from '../../../lib/closer-api';

/* ──────────────────── Types ──────────────────── */

interface ScriptState {
  name: string;
  prompt: string;
  transitions: Record<string, string>;
}

interface Script {
  id: string;
  name: string;
  description: string;
  industry: string;
  personality: string;
  states: Record<string, ScriptState> | string;
  version: number;
  is_active: boolean;
  times_used?: number;
  success_rate?: number;
  created_at: string;
  updated_at: string;
}

/* ──────────────────── Constants ──────────────────── */

const INDUSTRIES = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'home_services', label: 'Home Services' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'solar', label: 'Solar' },
  { value: 'other', label: 'Other' },
];

const INDUSTRY_COLORS: Record<string, { bg: string; text: string }> = {
  insurance:          { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
  real_estate:        { bg: 'rgba(34,197,94,0.12)',   text: '#22c55e' },
  financial_services: { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  home_services:      { bg: 'rgba(168,85,247,0.12)',  text: '#a855f7' },
  automotive:         { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
  healthcare:         { bg: 'rgba(20,184,166,0.12)',  text: '#14b8a6' },
  solar:              { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
  other:              { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
};

const PLACEHOLDER_STATES = `{
  "GREETING": {
    "name": "Greeting",
    "prompt": "Introduce yourself warmly...",
    "transitions": {
      "positive": "CONSENT_CHECK",
      "negative": "OBJECTION_HANDLE"
    }
  },
  "CONSENT_CHECK": {
    "name": "Consent Check",
    "prompt": "Verify the prospect consents to the call...",
    "transitions": {
      "consented": "DISCOVERY",
      "refused": "WRAP_UP"
    }
  },
  "DISCOVERY": {
    "name": "Discovery",
    "prompt": "Ask qualifying questions...",
    "transitions": {
      "qualified": "QUALIFICATION",
      "not_fit": "WRAP_UP"
    }
  },
  "QUALIFICATION": {
    "name": "Qualification",
    "prompt": "Confirm budget, timeline, authority...",
    "transitions": {
      "ready": "BOOKING",
      "needs_nurture": "WRAP_UP"
    }
  },
  "BOOKING": {
    "name": "Booking",
    "prompt": "Schedule the appointment...",
    "transitions": {
      "booked": "WRAP_UP",
      "declined": "OBJECTION_HANDLE"
    }
  },
  "OBJECTION_HANDLE": {
    "name": "Objection Handling",
    "prompt": "Address objections empathetically...",
    "transitions": {
      "resolved": "DISCOVERY",
      "firm_no": "WRAP_UP"
    }
  },
  "WRAP_UP": {
    "name": "Wrap Up",
    "prompt": "Thank them and end the call...",
    "transitions": {}
  }
}`;

/* ──────────────────── Helpers ──────────────────── */

function formatLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseStates(states: Record<string, ScriptState> | string): Record<string, ScriptState> {
  if (typeof states === 'string') {
    try {
      return JSON.parse(states);
    } catch {
      return {};
    }
  }
  return states || {};
}

function getStateNames(states: Record<string, ScriptState> | string): string[] {
  const parsed = parseStates(states);
  return Object.keys(parsed);
}

/* ──────────────────── Page ──────────────────── */

export default function ScriptsPage() {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Create form state */
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createIndustry, setCreateIndustry] = useState('insurance');
  const [createPersonality, setCreatePersonality] = useState('');
  const [createStates, setCreateStates] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  /* Inline edit state */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editPersonality, setEditPersonality] = useState('');
  const [editStates, setEditStates] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ── Fetch ── */

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await getScripts();
      const list = Array.isArray(data) ? data : data?.scripts ?? data?.data ?? [];
      setScripts(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load scripts');
      setScripts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  /* ── Create ── */

  const handleCreate = async () => {
    if (!createName.trim()) {
      setCreateError('Script name is required');
      return;
    }

    let parsedStates: Record<string, any> = {};
    if (createStates.trim()) {
      try {
        parsedStates = JSON.parse(createStates);
      } catch {
        setCreateError('States JSON is invalid. Please check syntax.');
        return;
      }
    }

    setCreating(true);
    setCreateError(null);
    try {
      await createScript({
        name: createName.trim(),
        description: createDesc.trim(),
        industry: createIndustry,
        personality: createPersonality.trim(),
        states: parsedStates,
      });
      setCreateName('');
      setCreateDesc('');
      setCreateIndustry('insurance');
      setCreatePersonality('');
      setCreateStates('');
      setShowCreate(false);
      await fetchScripts();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create script');
    } finally {
      setCreating(false);
    }
  };

  /* ── Toggle Active ── */

  const handleToggleActive = async (script: Script) => {
    try {
      await updateScript(script.id, { is_active: !script.is_active });
      setScripts((prev) =>
        prev.map((s) => (s.id === script.id ? { ...s, is_active: !s.is_active } : s))
      );
    } catch {
      /* silently fail — user can retry */
    }
  };

  /* ── Edit ── */

  const startEdit = (script: Script) => {
    setEditingId(script.id);
    setEditName(script.name);
    setEditDesc(script.description || '');
    setEditIndustry(script.industry || 'other');
    setEditPersonality(script.personality || '');
    const parsed = parseStates(script.states);
    setEditStates(Object.keys(parsed).length > 0 ? JSON.stringify(parsed, null, 2) : '');
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      setEditError('Script name is required');
      return;
    }

    let parsedStates: Record<string, any> = {};
    if (editStates.trim()) {
      try {
        parsedStates = JSON.parse(editStates);
      } catch {
        setEditError('States JSON is invalid. Please check syntax.');
        return;
      }
    }

    setSaving(true);
    setEditError(null);
    try {
      await updateScript(editingId!, {
        name: editName.trim(),
        description: editDesc.trim(),
        industry: editIndustry,
        personality: editPersonality.trim(),
        states: parsedStates,
      });
      setEditingId(null);
      await fetchScripts();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update script');
    } finally {
      setSaving(false);
    }
  };

  /* ──────────────────── Render ──────────────────── */

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Sales <span className="gradient-text">Scripts</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Create and manage conversation state machines for your AI agent.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--ept-accent)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showCreate ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showCreate ? 'Cancel' : 'Create Script'}
        </button>
      </div>

      {/* Create Script Form */}
      {showCreate && (
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
        >
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
            New Script
          </h2>

          {createError && (
            <div className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              {createError}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                Script Name
              </label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g., Insurance Qualifier v2"
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                style={{
                  backgroundColor: 'var(--ept-surface)',
                  borderColor: 'var(--ept-border)',
                  color: 'var(--ept-text)',
                  '--tw-ring-color': 'var(--ept-accent)',
                } as any}
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                Industry
              </label>
              <select
                value={createIndustry}
                onChange={(e) => setCreateIndustry(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                style={{
                  backgroundColor: 'var(--ept-surface)',
                  borderColor: 'var(--ept-border)',
                  color: 'var(--ept-text)',
                  '--tw-ring-color': 'var(--ept-accent)',
                } as any}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
              Description
            </label>
            <input
              type="text"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              placeholder="Brief description of this script's purpose and target audience"
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
              style={{
                backgroundColor: 'var(--ept-surface)',
                borderColor: 'var(--ept-border)',
                color: 'var(--ept-text)',
                '--tw-ring-color': 'var(--ept-accent)',
              } as any}
            />
          </div>

          {/* Personality */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
              Personality (System Prompt)
            </label>
            <textarea
              value={createPersonality}
              onChange={(e) => setCreatePersonality(e.target.value)}
              placeholder="You are a friendly, professional sales agent. Be empathetic, listen actively, and guide the conversation toward scheduling an appointment. Never be pushy or aggressive."
              rows={4}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1 resize-y"
              style={{
                backgroundColor: 'var(--ept-surface)',
                borderColor: 'var(--ept-border)',
                color: 'var(--ept-text)',
                '--tw-ring-color': 'var(--ept-accent)',
              } as any}
            />
          </div>

          {/* States JSON */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
              States (JSON State Machine)
            </label>
            <textarea
              value={createStates}
              onChange={(e) => setCreateStates(e.target.value)}
              placeholder={PLACEHOLDER_STATES}
              rows={12}
              className="w-full rounded-lg border px-4 py-2.5 text-xs font-mono outline-none transition-colors focus:ring-1 resize-y"
              style={{
                backgroundColor: 'var(--ept-surface)',
                borderColor: 'var(--ept-border)',
                color: 'var(--ept-text)',
                '--tw-ring-color': 'var(--ept-accent)',
              } as any}
            />
            <p className="mt-1 text-[11px]" style={{ color: 'var(--ept-text-muted)' }}>
              Define conversation states. Each state has a name, prompt, and transitions to other states.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-70"
              style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !createName.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--ept-accent)' }}
            >
              {creating && (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              )}
              Create Script
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && scripts.length === 0 && (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--ept-accent-glow)' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
            No scripts created yet
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--ept-text-muted)' }}>
            Create your first sales script to power your AI agent. Define conversation states, transitions, and personality to guide every call.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--ept-accent)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Script
          </button>
        </div>
      )}

      {/* Script Cards */}
      {!loading && scripts.length > 0 && (
        <div className="space-y-4">
          {scripts.map((script) => {
            const isEditing = editingId === script.id;
            const stateNames = getStateNames(script.states);
            const industryColor = INDUSTRY_COLORS[script.industry] || INDUSTRY_COLORS.other;

            return (
              <div
                key={script.id}
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                {/* Card Header */}
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold truncate" style={{ color: 'var(--ept-text)' }}>
                          {script.name}
                        </h3>
                        <span
                          className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: industryColor.bg, color: industryColor.text }}
                        >
                          {formatLabel(script.industry || 'other')}
                        </span>
                        <span
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}
                        >
                          v{script.version || 1}
                        </span>
                      </div>
                      {script.description && (
                        <p className="mt-1.5 text-sm line-clamp-2" style={{ color: 'var(--ept-text-muted)' }}>
                          {script.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      {/* Active Toggle */}
                      <button
                        onClick={() => handleToggleActive(script)}
                        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
                        style={{ color: script.is_active ? '#22c55e' : 'var(--ept-text-muted)' }}
                        title={script.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        <div
                          className="relative w-9 h-5 rounded-full transition-colors"
                          style={{ backgroundColor: script.is_active ? '#22c55e' : 'var(--ept-border)' }}
                        >
                          <div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                            style={{ left: script.is_active ? 18 : 2 }}
                          />
                        </div>
                        {script.is_active ? 'Active' : 'Inactive'}
                      </button>

                      {/* Edit Button */}
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(script)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-opacity hover:opacity-70"
                          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-5 mt-3">
                    {typeof script.times_used === 'number' && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                          {script.times_used.toLocaleString()} calls
                        </span>
                      </div>
                    )}
                    {typeof script.success_rate === 'number' && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                          {(script.success_rate * 100).toFixed(1)}% success
                        </span>
                      </div>
                    )}
                  </div>

                  {/* State Pills */}
                  {stateNames.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {stateNames.map((state) => (
                        <span
                          key={state}
                          className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--ept-surface)',
                            color: 'var(--ept-text-muted)',
                            border: '1px solid var(--ept-border)',
                          }}
                        >
                          {state.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inline Editor */}
                {isEditing && (
                  <div
                    className="px-6 py-5 border-t space-y-5"
                    style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}
                  >
                    {editError && (
                      <div className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        {editError}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                          Script Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                          style={{
                            backgroundColor: 'var(--ept-card-bg)',
                            borderColor: 'var(--ept-border)',
                            color: 'var(--ept-text)',
                            '--tw-ring-color': 'var(--ept-accent)',
                          } as any}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                          Industry
                        </label>
                        <select
                          value={editIndustry}
                          onChange={(e) => setEditIndustry(e.target.value)}
                          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                          style={{
                            backgroundColor: 'var(--ept-card-bg)',
                            borderColor: 'var(--ept-border)',
                            color: 'var(--ept-text)',
                            '--tw-ring-color': 'var(--ept-accent)',
                          } as any}
                        >
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.value} value={ind.value}>
                              {ind.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1"
                        style={{
                          backgroundColor: 'var(--ept-card-bg)',
                          borderColor: 'var(--ept-border)',
                          color: 'var(--ept-text)',
                          '--tw-ring-color': 'var(--ept-accent)',
                        } as any}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                        Personality (System Prompt)
                      </label>
                      <textarea
                        value={editPersonality}
                        onChange={(e) => setEditPersonality(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1 resize-y"
                        style={{
                          backgroundColor: 'var(--ept-card-bg)',
                          borderColor: 'var(--ept-border)',
                          color: 'var(--ept-text)',
                          '--tw-ring-color': 'var(--ept-accent)',
                        } as any}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                        States (JSON State Machine)
                      </label>
                      <textarea
                        value={editStates}
                        onChange={(e) => setEditStates(e.target.value)}
                        rows={10}
                        className="w-full rounded-lg border px-4 py-2.5 text-xs font-mono outline-none transition-colors focus:ring-1 resize-y"
                        style={{
                          backgroundColor: 'var(--ept-card-bg)',
                          borderColor: 'var(--ept-border)',
                          color: 'var(--ept-text)',
                          '--tw-ring-color': 'var(--ept-accent)',
                        } as any}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-70"
                        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={saving || !editName.trim()}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--ept-accent)' }}
                      >
                        {saving && (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        )}
                        Save Changes
                      </button>
                    </div>
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
