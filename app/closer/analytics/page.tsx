'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getDashboardStats, getCostAnalytics } from '../../../lib/closer-api';

/* ──────────────────── Types ──────────────────── */

interface DashboardStats {
  total_calls: number;
  connection_rate: number;
  qualification_rate: number;
  appointments_booked: number;
  avg_call_duration: number;
  cost_per_appointment: number;
  leads_today?: number;
  calls_made?: number;
  appointments_set?: number;
  cost_today?: number;
}

interface CostBreakdown {
  twilio: number;
  deepgram: number;
  elevenlabs: number;
  llm: number;
  total: number;
  avg_per_call: number;
}

interface DispositionStat {
  disposition: string;
  count: number;
  percentage: number;
}

interface HourlyStat {
  hour: number;
  count: number;
}

interface ScriptPerf {
  script_id: string;
  script_name: string;
  calls: number;
  appointments: number;
  success_rate: number;
}

interface CostAnalytics {
  costs: CostBreakdown;
  dispositions: DispositionStat[];
  hourly: HourlyStat[];
  scripts: ScriptPerf[];
}

/* ──────────────────── Constants ──────────────────── */

type DateRange = 'today' | '7d' | '30d' | 'all';

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'all', label: 'All Time' },
];

const DISPOSITION_COLORS: Record<string, string> = {
  appointment_booked: '#22c55e',
  interested:         '#3b82f6',
  callback:           '#f59e0b',
  not_interested:     '#6b7280',
  voicemail:          '#8b5cf6',
  no_answer:          '#94a3b8',
  busy:               '#f97316',
  dnc:                '#ef4444',
  wrong_number:       '#ec4899',
  transferred:        '#14b8a6',
};

const SERVICE_META: Record<string, { label: string; color: string; icon: string }> = {
  twilio:     { label: 'Twilio (Telephony)',  color: '#ef4444', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  deepgram:   { label: 'Deepgram (STT)',      color: '#3b82f6', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  elevenlabs: { label: 'ElevenLabs (TTS)',    color: '#a855f7', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
  llm:        { label: 'LLM (AI Model)',      color: '#f59e0b', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V19a2 2 0 01-2 2H7a2 2 0 01-2-2v-4.5' },
};

/* ──────────────────── Helpers ──────────────────── */

function formatCost(amount: number): string {
  return `$${(amount || 0).toFixed(2)}`;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

/* ──────────────────── Page ──────────────────── */

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [range, setRange] = useState<DateRange>('7d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [costData, setCostData] = useState<CostAnalytics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [costLoading, setCostLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [costError, setCostError] = useState<string | null>(null);

  /* ── Fetch Dashboard Stats ── */

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data: any = await getDashboardStats();
      setStats({
        total_calls:          data.total_calls ?? data.calls_made ?? 0,
        connection_rate:      data.connection_rate ?? 0,
        qualification_rate:   data.qualification_rate ?? 0,
        appointments_booked:  data.appointments_booked ?? data.appointments_set ?? 0,
        avg_call_duration:    data.avg_call_duration ?? 0,
        cost_per_appointment: data.cost_per_appointment ?? 0,
        leads_today:          data.leads_today ?? 0,
        calls_made:           data.calls_made ?? 0,
        appointments_set:     data.appointments_set ?? 0,
        cost_today:           data.cost_today ?? 0,
      });
    } catch (err: any) {
      setStatsError(err.message || 'Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ── Fetch Cost Analytics ── */

  const fetchCosts = useCallback(async () => {
    setCostLoading(true);
    setCostError(null);
    try {
      const data: any = await getCostAnalytics(`range=${range}`);
      setCostData({
        costs: {
          twilio:       data.costs?.twilio ?? 0,
          deepgram:     data.costs?.deepgram ?? 0,
          elevenlabs:   data.costs?.elevenlabs ?? 0,
          llm:          data.costs?.llm ?? 0,
          total:        data.costs?.total ?? 0,
          avg_per_call: data.costs?.avg_per_call ?? 0,
        },
        dispositions: Array.isArray(data.dispositions) ? data.dispositions : [],
        hourly:       Array.isArray(data.hourly) ? data.hourly : [],
        scripts:      Array.isArray(data.scripts) ? data.scripts : [],
      });
    } catch (err: any) {
      setCostError(err.message || 'Failed to load cost analytics');
    } finally {
      setCostLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  /* ── Derived values ── */

  const costs = costData?.costs ?? { twilio: 0, deepgram: 0, elevenlabs: 0, llm: 0, total: 0, avg_per_call: 0 };
  const costTotal = costs.total || (costs.twilio + costs.deepgram + costs.elevenlabs + costs.llm);
  const dispositions = costData?.dispositions ?? [];
  const hourly = costData?.hourly ?? [];
  const scripts = costData?.scripts ?? [];

  const maxDisposition = Math.max(...dispositions.map((d) => d.count), 1);
  const maxHourly = Math.max(...hourly.map((h) => h.count), 1);

  const hasData = stats && (stats.total_calls > 0 || (stats.calls_made ?? 0) > 0);

  /* ── KPI Cards ── */

  const kpis = [
    {
      label: 'Total Calls',
      value: statsLoading ? '...' : String(stats?.total_calls ?? stats?.calls_made ?? 0),
    },
    {
      label: 'Connection Rate',
      value: statsLoading ? '...' : formatPercent(stats?.connection_rate ?? 0),
    },
    {
      label: 'Qualification Rate',
      value: statsLoading ? '...' : formatPercent(stats?.qualification_rate ?? 0),
    },
    {
      label: 'Appointments Booked',
      value: statsLoading ? '...' : String(stats?.appointments_booked ?? stats?.appointments_set ?? 0),
    },
    {
      label: 'Avg Call Duration',
      value: statsLoading ? '...' : formatDuration(stats?.avg_call_duration ?? 0),
    },
    {
      label: 'Cost / Appointment',
      value: statsLoading ? '...' : formatCost(stats?.cost_per_appointment ?? 0),
    },
  ];

  /* ──────────────────── Render ──────────────────── */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Performance metrics and cost tracking for your AI sales agent.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--ept-border)' }}>
          {DATE_RANGES.map((dr) => (
            <button
              key={dr.value}
              onClick={() => setRange(dr.value)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: range === dr.value ? 'var(--ept-accent)' : 'var(--ept-card-bg)',
                color: range === dr.value ? '#ffffff' : 'var(--ept-text-muted)',
              }}
            >
              {dr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error States */}
      {statsError && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
          Stats: {statsError}
        </div>
      )}
      {costError && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
          Costs: {costError}
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border"
            style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
          >
            <div className="text-xl font-extrabold font-mono gradient-text leading-tight">
              {kpi.value}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider mt-1.5 font-semibold"
              style={{ color: 'var(--ept-text-muted)' }}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state when no data */}
      {!statsLoading && !costLoading && !hasData && (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--ept-accent-glow)' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
            No analytics data yet
          </h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Make your first calls to start tracking performance. Analytics will populate automatically as your AI agent makes and receives calls.
          </p>
        </div>
      )}

      {/* Cost Breakdown Section */}
      {(hasData || costLoading) && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
            Cost Breakdown
          </h2>

          {costLoading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Total Cost Card */}
              <div
                className="p-6 rounded-xl border flex flex-col justify-between"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div>
                  <div
                    className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                    style={{ color: 'var(--ept-text-muted)' }}
                  >
                    Total Spend
                  </div>
                  <div className="text-3xl font-extrabold font-mono gradient-text">
                    {formatCost(costTotal)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                      Avg per call
                    </span>
                    <span className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>
                      {formatCost(costs.avg_per_call)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Per-Service Breakdown */}
              <div
                className="md:col-span-2 p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div
                  className="text-[10px] uppercase tracking-wider font-semibold mb-4"
                  style={{ color: 'var(--ept-text-muted)' }}
                >
                  Per-Service Costs
                </div>
                <div className="space-y-3">
                  {(['twilio', 'deepgram', 'elevenlabs', 'llm'] as const).map((service) => {
                    const meta = SERVICE_META[service];
                    const amount = costs[service] ?? 0;
                    const pct = costTotal > 0 ? (amount / costTotal) * 100 : 0;

                    return (
                      <div key={service}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke={meta.color} viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                            </svg>
                            <span className="text-xs font-semibold" style={{ color: 'var(--ept-text)' }}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-medium" style={{ color: 'var(--ept-text-muted)' }}>
                              {pct.toFixed(1)}%
                            </span>
                            <span className="text-sm font-bold font-mono" style={{ color: 'var(--ept-text)' }}>
                              {formatCost(amount)}
                            </span>
                          </div>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'var(--ept-surface)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 0.5)}%`,
                              backgroundColor: meta.color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Section */}
      {hasData && !costLoading && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
            Performance
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Dispositions */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: 'var(--ept-border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
                  Call Dispositions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {dispositions.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--ept-text-muted)' }}>
                    No disposition data yet.
                  </p>
                ) : (
                  dispositions.map((d) => {
                    const color = DISPOSITION_COLORS[d.disposition] || '#6b7280';
                    const pct = maxDisposition > 0 ? (d.count / maxDisposition) * 100 : 0;
                    return (
                      <div key={d.disposition}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: 'var(--ept-text)' }}>
                            {formatLabel(d.disposition)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                              {d.count}
                            </span>
                            <span className="text-[10px] font-mono" style={{ color }}>
                              {(d.percentage * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'var(--ept-surface)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 1)}%`, backgroundColor: color, opacity: 0.75 }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Calls by Hour */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: 'var(--ept-border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
                  Calls by Hour
                </h3>
              </div>
              <div className="p-6 space-y-1.5 max-h-[360px] overflow-y-auto">
                {hourly.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--ept-text-muted)' }}>
                    No hourly data yet.
                  </p>
                ) : (
                  hourly.map((h) => {
                    const pct = maxHourly > 0 ? (h.count / maxHourly) * 100 : 0;
                    return (
                      <div key={h.hour} className="flex items-center gap-3">
                        <span
                          className="text-[10px] font-mono font-medium w-12 text-right shrink-0"
                          style={{ color: 'var(--ept-text-muted)' }}
                        >
                          {formatHour(h.hour)}
                        </span>
                        <div
                          className="flex-1 h-4 rounded overflow-hidden"
                          style={{ backgroundColor: 'var(--ept-surface)' }}
                        >
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 1)}%`,
                              backgroundColor: 'var(--ept-accent)',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <span
                          className="text-[10px] font-mono font-medium w-8 shrink-0"
                          style={{ color: 'var(--ept-text-muted)' }}
                        >
                          {h.count}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Script Performance Comparison */}
          {scripts.length > 1 && (
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: 'var(--ept-border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text)' }}>
                  Script Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                      <th className="text-left text-[10px] font-bold uppercase tracking-wider px-6 py-3" style={{ color: 'var(--ept-text-muted)' }}>
                        Script
                      </th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-wider px-6 py-3" style={{ color: 'var(--ept-text-muted)' }}>
                        Total Calls
                      </th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-wider px-6 py-3" style={{ color: 'var(--ept-text-muted)' }}>
                        Appointments
                      </th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-wider px-6 py-3" style={{ color: 'var(--ept-text-muted)' }}>
                        Success Rate
                      </th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-wider px-6 py-3 w-40" style={{ color: 'var(--ept-text-muted)' }}>
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scripts.map((s, idx) => {
                      const successPct = (s.success_rate * 100);
                      return (
                        <tr
                          key={s.script_id}
                          style={{ borderBottom: idx < scripts.length - 1 ? '1px solid var(--ept-border)' : undefined }}
                        >
                          <td className="px-6 py-3">
                            <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
                              {s.script_name}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-sm font-mono" style={{ color: 'var(--ept-text)' }}>
                              {s.calls.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-sm font-mono gradient-text font-bold">
                              {s.appointments.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span
                              className="text-sm font-mono font-bold"
                              style={{ color: successPct >= 20 ? '#22c55e' : successPct >= 10 ? '#f59e0b' : '#ef4444' }}
                            >
                              {successPct.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div
                              className="h-2 rounded-full overflow-hidden w-full"
                              style={{ backgroundColor: 'var(--ept-surface)' }}
                            >
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(successPct, 1)}%`,
                                  backgroundColor: successPct >= 20 ? '#22c55e' : successPct >= 10 ? '#f59e0b' : '#ef4444',
                                  opacity: 0.75,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
