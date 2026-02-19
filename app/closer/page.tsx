'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { closerFetch, getDashboardStats } from '../../lib/closer-api';

/* ──────────────────── Types ──────────────────── */

interface DashboardStats {
  leads_today: number;
  calls_made: number;
  appointments_set: number;
  cost_today: number;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
}

interface Call {
  id: string;
  lead_name: string;
  duration_seconds: number;
  disposition: string;
  cost: number;
  created_at: string;
}

/* ──────────────────── Badge Configs ──────────────────── */

const LEAD_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new:              { bg: 'rgba(20,184,166,0.12)', text: '#14b8a6' },
  contacted:        { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  qualified:        { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  appointment_set:  { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e' },
  converted:        { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  lost:             { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
  dnc:              { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444' },
};

const DISPOSITION_COLORS: Record<string, { bg: string; text: string }> = {
  appointment_booked: { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e' },
  interested:         { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  callback:           { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  not_interested:     { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
  voicemail:          { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
};

/* ──────────────────── Helpers ──────────────────── */

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCost(amount: number): string {
  return `$${(amount || 0).toFixed(2)}`;
}

function formatLabel(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function StatusBadge({ value, colorMap }: { value: string; colorMap: Record<string, { bg: string; text: string }> }) {
  const colors = colorMap[value] || { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' };
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {formatLabel(value)}
    </span>
  );
}

/* ──────────────────── Page ──────────────────── */

export default function CloserDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [callsLoading, setCallsLoading] = useState(true);

  /* Fetch KPI stats */
  useEffect(() => {
    getDashboardStats()
      .then((data: any) => setStats({
        leads_today: data.leads_today ?? 0,
        calls_made: data.calls_made ?? 0,
        appointments_set: data.appointments_set ?? 0,
        cost_today: data.cost_today ?? 0,
      }))
      .catch(() => setStats({ leads_today: 0, calls_made: 0, appointments_set: 0, cost_today: 0 }))
      .finally(() => setStatsLoading(false));
  }, []);

  /* Fetch recent leads */
  useEffect(() => {
    closerFetch('/leads?limit=5&sort=created_at:desc')
      .then((data: any) => setLeads(Array.isArray(data) ? data : data?.leads ?? data?.data ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, []);

  /* Fetch recent calls */
  useEffect(() => {
    closerFetch('/calls?limit=5&sort=created_at:desc')
      .then((data: any) => setCalls(Array.isArray(data) ? data : data?.calls ?? data?.data ?? []))
      .catch(() => setCalls([]))
      .finally(() => setCallsLoading(false));
  }, []);

  /* ── KPI Cards ── */
  const kpis = [
    { label: 'Leads Today',       value: statsLoading ? '...' : String(stats?.leads_today ?? 0) },
    { label: 'Calls Made',        value: statsLoading ? '...' : String(stats?.calls_made ?? 0) },
    { label: 'Appointments Set',  value: statsLoading ? '...' : String(stats?.appointments_set ?? 0) },
    { label: 'Cost Today',        value: statsLoading ? '...' : formatCost(stats?.cost_today ?? 0) },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
          AI Sales Agent <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          Real-time overview of your leads, calls, and campaign performance.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="text-2xl font-extrabold font-mono gradient-text">
              {kpi.value}
            </div>
            <div
              className="text-xs uppercase tracking-wider mt-1 font-medium"
              style={{ color: 'var(--ept-text-muted)' }}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity — Two Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--ept-border)' }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
              Recent Leads
            </h2>
            <Link
              href="/closer/leads"
              className="text-[11px] font-semibold"
              style={{ color: 'var(--ept-accent)' }}
            >
              View All
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div
                  className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
                />
              </div>
            ) : leads.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                  No leads yet — import or add your first lead.
                </p>
                <Link
                  href="/closer/leads"
                  className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: 'var(--ept-accent)' }}
                >
                  Add Lead
                </Link>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between px-6 py-3"
                  style={{ borderColor: 'var(--ept-border)' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>
                      {lead.name || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                        {lead.phone || '—'}
                      </span>
                      {lead.source && (
                        <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                          via {lead.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge value={lead.status || 'new'} colorMap={LEAD_STATUS_COLORS} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--ept-border)' }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
              Recent Calls
            </h2>
            <Link
              href="/closer/calls"
              className="text-[11px] font-semibold"
              style={{ color: 'var(--ept-accent)' }}
            >
              View All
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
            {callsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div
                  className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
                />
              </div>
            ) : calls.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                  No calls yet — start a campaign to begin dialing.
                </p>
                <Link
                  href="/closer/campaigns"
                  className="inline-block mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: 'var(--ept-accent)' }}
                >
                  Start Campaign
                </Link>
              </div>
            ) : (
              calls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between px-6 py-3"
                  style={{ borderColor: 'var(--ept-border)' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--ept-text)' }}>
                      {call.lead_name || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                        {formatDuration(call.duration_seconds)}
                      </span>
                      <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                        {formatCost(call.cost)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge value={call.disposition || 'voicemail'} colorMap={DISPOSITION_COLORS} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-text)' }}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Add Lead',
              desc: 'Import a list or manually add a new prospect to your pipeline.',
              href: '/closer/leads',
              icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
            },
            {
              title: 'Start Campaign',
              desc: 'Create a calling campaign to automate outreach at scale.',
              href: '/closer/campaigns',
              icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
            },
            {
              title: 'View Analytics',
              desc: 'Dive into call performance, conversion rates, and cost breakdown.',
              href: '/closer/analytics',
              icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="card-hover p-6 rounded-xl border block group"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'var(--ept-accent-glow)' }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  style={{ color: 'var(--ept-accent)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--ept-text)' }}>
                {action.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
                {action.desc}
              </p>
              <span
                className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
                style={{ color: 'var(--ept-accent)' }}
              >
                Go
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
