'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getCampaigns, createCampaign, updateCampaign, getScripts } from '../../../lib/closer-api';

/* ──────────────────── Types ──────────────────── */

interface CampaignStats {
  total_leads: number;
  dialed: number;
  connected: number;
  qualified: number;
  appointments: number;
  cost: number;
}

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'outbound' | 'inbound' | 'blended';
  script_id: string;
  script_name?: string;
  max_concurrent: number;
  calls_per_hour: number;
  schedule_start?: string;
  schedule_end?: string;
  schedule_days?: string[];
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
}

interface Script {
  id: string;
  name: string;
}

type CampaignStatus = Campaign['status'];
type CampaignType = Campaign['type'];

/* ──────────────────── Constants ──────────────────── */

const STATUS_CONFIG: Record<CampaignStatus, { label: string; bg: string; text: string; pulse: boolean }> = {
  draft:     { label: 'Draft',     bg: 'var(--ept-surface)',  text: 'var(--ept-text-muted)', pulse: false },
  active:    { label: 'Active',    bg: 'rgba(16,185,129,0.15)', text: '#10b981', pulse: true },
  paused:    { label: 'Paused',    bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', pulse: false },
  completed: { label: 'Completed', bg: 'var(--ept-accent-glow)', text: 'var(--ept-accent)', pulse: false },
};

const TYPE_CONFIG: Record<CampaignType, { label: string; bg: string; text: string }> = {
  outbound: { label: 'Outbound', bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  inbound:  { label: 'Inbound',  bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
  blended:  { label: 'Blended',  bg: 'rgba(20,184,166,0.12)', text: '#14b8a6' },
};

const DAYS_OF_WEEK = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
];

const DEFAULT_STATS: CampaignStats = {
  total_leads: 0,
  dialed: 0,
  connected: 0,
  qualified: 0,
  appointments: 0,
  cost: 0,
};

/* ──────────────────── Helpers ──────────────────── */

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatCurrency(amount: number): string {
  return `$${(amount || 0).toFixed(2)}`;
}

function conversionRate(stats: CampaignStats): string {
  if (!stats.dialed || stats.dialed === 0) return '0%';
  return `${((stats.appointments / stats.dialed) * 100).toFixed(1)}%`;
}

/* ──────────────────── Sub-Components ──────────────────── */

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: config.text }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: config.text }}
          />
        </span>
      )}
      {config.label}
    </span>
  );
}

function TypeBadge({ type }: { type: CampaignType }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.outbound;
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'var(--ept-text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
          {label}
        </label>
        <span className="text-xs font-bold font-mono" style={{ color: 'var(--ept-text)' }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--ept-accent) ${((value - min) / (max - min)) * 100}%, var(--ept-border) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

/* ──────────────────── Campaign Card ──────────────────── */

function CampaignCard({
  campaign,
  onAction,
  actionLoading,
}: {
  campaign: Campaign;
  onAction: (id: string, action: string) => void;
  actionLoading: string | null;
}) {
  const stats = campaign.stats || DEFAULT_STATS;
  const isLoading = actionLoading === campaign.id;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: 'var(--ept-card-bg)',
        borderColor: campaign.status === 'active' ? '#10b981' : 'var(--ept-card-border)',
        boxShadow: campaign.status === 'active' ? '0 0 20px rgba(16,185,129,0.08)' : 'none',
      }}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="text-lg font-extrabold truncate"
              style={{ color: 'var(--ept-text)' }}
            >
              {campaign.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={campaign.status} />
              <TypeBadge type={campaign.type} />
            </div>
          </div>
        </div>

        {/* Script Name */}
        {campaign.script_name && (
          <div className="mt-3 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              style={{ color: 'var(--ept-text-muted)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs font-medium truncate" style={{ color: 'var(--ept-text-muted)' }}>
              {campaign.script_name}
            </span>
          </div>
        )}

        {/* Pacing Info */}
        <div className="mt-2 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            style={{ color: 'var(--ept-text-muted)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
            {campaign.calls_per_hour || 0} calls/hr, {campaign.max_concurrent || 1} concurrent
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="mx-5 my-3 py-3 px-4 rounded-lg grid grid-cols-3 gap-2"
        style={{ backgroundColor: 'var(--ept-surface)' }}
      >
        <StatItem label="Leads" value={formatNumber(stats.total_leads)} />
        <StatItem label="Dialed" value={formatNumber(stats.dialed)} />
        <StatItem label="Connected" value={formatNumber(stats.connected)} />
        <StatItem label="Qualified" value={formatNumber(stats.qualified)} />
        <StatItem label="Appts" value={formatNumber(stats.appointments)} />
        <StatItem label="Conv." value={conversionRate(stats)} />
      </div>

      {/* Cost Row */}
      <div className="mx-5 mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--ept-text-muted)' }}>
          Total Cost
        </span>
        <span className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>
          {formatCurrency(stats.cost)}
        </span>
      </div>

      {/* Action Buttons */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-t"
        style={{ borderColor: 'var(--ept-border)' }}
      >
        {campaign.status === 'draft' && (
          <button
            onClick={() => onAction(campaign.id, 'start')}
            disabled={isLoading}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#10b981' }}
          >
            {isLoading ? 'Starting...' : 'Start'}
          </button>
        )}
        {campaign.status === 'active' && (
          <button
            onClick={() => onAction(campaign.id, 'pause')}
            disabled={isLoading}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#f59e0b' }}
          >
            {isLoading ? 'Pausing...' : 'Pause'}
          </button>
        )}
        {campaign.status === 'paused' && (
          <button
            onClick={() => onAction(campaign.id, 'resume')}
            disabled={isLoading}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#10b981' }}
          >
            {isLoading ? 'Resuming...' : 'Resume'}
          </button>
        )}
        <button
          onClick={() => onAction(campaign.id, 'edit')}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-xs font-semibold border transition-opacity hover:opacity-70 disabled:opacity-50"
          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
        >
          Edit
        </button>
        <button
          onClick={() => onAction(campaign.id, 'stats')}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70 disabled:opacity-50"
          style={{ color: 'var(--ept-accent)' }}
        >
          View Stats
        </button>
      </div>
    </div>
  );
}

/* ──────────────────── New Campaign Form ──────────────────── */

interface FormState {
  name: string;
  script_id: string;
  type: CampaignType;
  max_concurrent: number;
  calls_per_hour: number;
  schedule_start: string;
  schedule_end: string;
  schedule_days: string[];
}

const INITIAL_FORM: FormState = {
  name: '',
  script_id: '',
  type: 'outbound',
  max_concurrent: 2,
  calls_per_hour: 30,
  schedule_start: '09:00',
  schedule_end: '17:00',
  schedule_days: ['mon', 'tue', 'wed', 'thu', 'fri'],
};

function NewCampaignForm({
  scripts,
  onSubmit,
  onCancel,
  submitting,
}: {
  scripts: Script[];
  onSubmit: (data: FormState) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter((d) => d !== day)
        : [...prev.schedule_days, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', boxShadow: '0 0 24px var(--ept-accent-glow)' }}
    >
      {/* Form Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--ept-border)' }}
      >
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
          New Campaign
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: 'var(--ept-text-muted)' }}
        >
          Cancel
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Row 1: Name + Script */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
              Campaign Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Q1 Insurance Outreach"
              required
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--ept-surface)',
                borderColor: 'var(--ept-border)',
                color: 'var(--ept-text)',
              }}
            />
          </div>

          {/* Script Dropdown */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>
              Script
            </label>
            <select
              value={form.script_id}
              onChange={(e) => updateField('script_id', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors appearance-none cursor-pointer"
              style={{
                backgroundColor: 'var(--ept-surface)',
                borderColor: 'var(--ept-border)',
                color: form.script_id ? 'var(--ept-text)' : 'var(--ept-text-muted)',
              }}
            >
              <option value="">Select a script...</option>
              {scripts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Campaign Type */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>
            Campaign Type
          </label>
          <div className="flex items-center gap-2">
            {(['outbound', 'inbound', 'blended'] as CampaignType[]).map((t) => {
              const selected = form.type === t;
              const cfg = TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateField('type', t)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all"
                  style={{
                    backgroundColor: selected ? cfg.bg : 'transparent',
                    borderColor: selected ? cfg.text : 'var(--ept-border)',
                    color: selected ? cfg.text : 'var(--ept-text-muted)',
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Pacing */}
        <div className="grid md:grid-cols-2 gap-4">
          <SliderInput
            label="Max Concurrent Lines"
            value={form.max_concurrent}
            min={1}
            max={5}
            step={1}
            unit="lines"
            onChange={(v) => updateField('max_concurrent', v)}
          />
          <SliderInput
            label="Calls Per Hour"
            value={form.calls_per_hour}
            min={10}
            max={60}
            step={5}
            unit="calls/hr"
            onChange={(v) => updateField('calls_per_hour', v)}
          />
        </div>

        {/* Row 4: Schedule */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>
            Schedule
          </label>
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            {/* Start Time */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>
                Start Time
              </label>
              <input
                type="time"
                value={form.schedule_start}
                onChange={(e) => updateField('schedule_start', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{
                  backgroundColor: 'var(--ept-surface)',
                  borderColor: 'var(--ept-border)',
                  color: 'var(--ept-text)',
                }}
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>
                End Time
              </label>
              <input
                type="time"
                value={form.schedule_end}
                onChange={(e) => updateField('schedule_end', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{
                  backgroundColor: 'var(--ept-surface)',
                  borderColor: 'var(--ept-border)',
                  color: 'var(--ept-text)',
                }}
              />
            </div>

            {/* Days of Week */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>
                Days
              </label>
              <div className="flex items-center gap-1">
                {DAYS_OF_WEEK.map((day) => {
                  const selected = form.schedule_days.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className="w-8 h-8 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        backgroundColor: selected ? 'var(--ept-accent-glow)' : 'var(--ept-surface)',
                        color: selected ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                        border: `1px solid ${selected ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
                      }}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !form.name.trim()}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--ept-accent)' }}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Creating...
              </span>
            ) : (
              'Create Campaign'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

/* ──────────────────── Empty State ──────────────────── */

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="rounded-xl border text-center py-16 px-6"
      style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: 'var(--ept-accent-glow)' }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          style={{ color: 'var(--ept-accent)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
        No campaigns created yet
      </h3>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--ept-text-muted)' }}>
        Create your first campaign to start reaching leads. Configure scripts, pacing, and schedules to automate your outreach.
      </p>
      <button
        onClick={onCreate}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--ept-accent)' }}
      >
        Create First Campaign
      </button>
    </div>
  );
}

/* ──────────────────── Main Page ──────────────────── */

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ── Fetch campaigns ── */
  const loadCampaigns = useCallback(async () => {
    try {
      setError(null);
      const data: any = await getCampaigns();
      const list: Campaign[] = Array.isArray(data) ? data : data?.campaigns ?? data?.data ?? [];
      setCampaigns(
        list.map((c: any) => ({
          ...c,
          stats: c.stats
            ? typeof c.stats === 'string'
              ? JSON.parse(c.stats)
              : c.stats
            : DEFAULT_STATS,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch scripts for dropdown ── */
  const loadScripts = useCallback(async () => {
    try {
      const data: any = await getScripts();
      const list: Script[] = Array.isArray(data) ? data : data?.scripts ?? data?.data ?? [];
      setScripts(list);
    } catch {
      setScripts([]);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
    loadScripts();
  }, [loadCampaigns, loadScripts]);

  /* ── Create campaign ── */
  const handleCreate = async (formData: FormState) => {
    setSubmitting(true);
    try {
      await createCampaign({
        name: formData.name.trim(),
        script_id: formData.script_id || null,
        type: formData.type,
        max_concurrent: formData.max_concurrent,
        calls_per_hour: formData.calls_per_hour,
        schedule_start: formData.schedule_start,
        schedule_end: formData.schedule_end,
        schedule_days: formData.schedule_days,
      });
      setShowForm(false);
      await loadCampaigns();
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Campaign actions (start, pause, resume, edit, stats) ── */
  const handleAction = async (campaignId: string, action: string) => {
    if (action === 'edit') {
      /* For now scroll to top and show form pre-filled in a future iteration */
      return;
    }
    if (action === 'stats') {
      /* Navigate or show stats modal — future iteration */
      return;
    }

    setActionLoading(campaignId);
    try {
      const statusMap: Record<string, CampaignStatus> = {
        start: 'active',
        pause: 'paused',
        resume: 'active',
      };
      const newStatus = statusMap[action];
      if (newStatus) {
        await updateCampaign(campaignId, { status: newStatus });
        await loadCampaigns();
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${action} campaign`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Campaigns
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Create and manage automated calling campaigns.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--ept-accent)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Campaign
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg border text-sm"
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            borderColor: 'rgba(239,68,68,0.3)',
            color: '#ef4444',
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold px-2 py-0.5 rounded hover:opacity-70 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* New Campaign Form */}
      {showForm && (
        <NewCampaignForm
          scripts={scripts}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : campaigns.length === 0 && !showForm ? (
        <EmptyState onCreate={() => setShowForm(true)} />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onAction={handleAction}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
