'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import {
  PipelineConfig,
  DataSourceType,
  PipelineRun,
  SourceHealthResult,
  DATA_SOURCE_TYPES,
  SCHEDULE_OPTIONS,
  TRANSFORM_OPTIONS,
  getUserPipelines,
  savePipeline,
  deletePipeline,
  getPipelineRuns,
  addPipelineRun,
  createBlankPipeline,
  testSourceHealth,
} from '../../lib/pipeline-api';

const SERVICE_ID = 'data-pipelines';

const FAQS = [
  { q: 'What types of data sources can your pipelines extract from?', a: 'We support 50+ source types including county clerk databases, public filings, government records, REST APIs, websites, market data feeds, SEC filings, and custom endpoints. Our autonomous extraction handles login-protected sites, CAPTCHA-gated portals, and paginated results.' },
  { q: 'How does the pipeline handle data quality and errors?', a: 'Every pipeline includes automated data quality gates: schema validation, completeness checks, deduplication, and anomaly detection. Failed records are quarantined for review while healthy data flows through. Error rates, latency, and throughput are tracked in real-time.' },
  { q: 'Can I build custom pipelines without writing code?', a: 'Yes. The Pipeline Builder provides a no-code interface where you select a source type, configure connection parameters, set a sync schedule, and choose transformations. For advanced users, custom transformation scripts and webhook integrations are also supported.' },
  { q: 'What delivery formats are supported?', a: 'Extracted data can be delivered via REST API, webhooks, CSV/JSON file export, database replication (PostgreSQL, MySQL), or direct R2/S3 bucket delivery. Real-time streaming and batch modes are both available depending on your plan.' },
  { q: 'How is my data secured?', a: 'All data is encrypted at rest and in transit. API keys are managed through our secure vault system. We maintain audit logging on every pipeline operation. Enterprise plans include SOC2-ready compliance features and dedicated infrastructure isolation.' },
  { q: 'What happens if a data source goes down or changes its structure?', a: 'Our pipelines include automatic retry logic with exponential backoff, change detection for site structure modifications, and instant alert notifications when a source becomes unreachable. We monitor all active sources 24/7 and can adapt extractors within hours of detected changes.' },
];

// ── Tab types ────────────────────────────────────────────────
type MainTab = 'overview' | 'builder';
type BuilderView = 'dashboard' | 'create' | 'detail';
type CreateStep = 'source' | 'config' | 'schedule' | 'review';

// ── Inline SVG icons (no icon library) ───────────────────────
function RefreshIcon() {
  return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
}
function CheckIcon() {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
function TrashIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
}
function PlusIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function ArrowLeftIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
}
function PlayIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>;
}
function PauseIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>;
}

// ── Status badge helper ──────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: '#065f4620', text: '#10b981' },
    paused: { bg: '#f59e0b20', text: '#f59e0b' },
    draft: { bg: '#64748b20', text: '#94a3b8' },
    success: { bg: '#065f4620', text: '#10b981' },
    partial: { bg: '#f59e0b20', text: '#f59e0b' },
    failed: { bg: '#ef444420', text: '#ef4444' },
  };
  const c = colors[status] || colors.draft;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════
// Pipeline Builder App
// ══════════════════════════════════════════════════════════════

function PipelineBuilderApp() {
  const [view, setView] = useState<BuilderView>('dashboard');
  const [pipelines, setPipelines] = useState<PipelineConfig[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineConfig | null>(null);
  const [runs, setRuns] = useState<PipelineRun[]>([]);

  // Source health cache
  const [sourceHealth, setSourceHealth] = useState<Record<string, SourceHealthResult>>({});
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState<Set<string>>(new Set());

  // Create wizard state
  const [createStep, setCreateStep] = useState<CreateStep>('source');
  const [draft, setDraft] = useState<PipelineConfig>(createBlankPipeline());

  const loadPipelines = useCallback(() => {
    setPipelines(getUserPipelines());
    setRuns(getPipelineRuns());
  }, []);

  useEffect(() => { loadPipelines(); }, [loadPipelines]);

  const [healthCheckedAt, setHealthCheckedAt] = useState<Record<string, number>>({});
  const [allChecking, setAllChecking] = useState(false);

  const handleCheckHealth = async (sourceId: string) => {
    setHealthLoading(prev => new Set(prev).add(sourceId));
    const result = await testSourceHealth(sourceId);
    setSourceHealth(prev => ({ ...prev, [sourceId]: result }));
    setHealthCheckedAt(prev => ({ ...prev, [sourceId]: Date.now() }));
    setHealthLoading(prev => { const n = new Set(prev); n.delete(sourceId); return n; });
  };

  const handleCheckAll = async () => {
    setAllChecking(true);
    const sources = DATA_SOURCE_TYPES.filter(s => s.workerUrl);
    await Promise.allSettled(sources.map(s => handleCheckHealth(s.id)));
    setAllChecking(false);
  };

  // Auto-check all sources on first mount
  useEffect(() => {
    const sources = DATA_SOURCE_TYPES.filter(s => s.workerUrl);
    if (sources.length > 0 && Object.keys(sourceHealth).length === 0) {
      handleCheckAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setDraft(createBlankPipeline());
    setCreateStep('source');
    setView('create');
  };

  const openDetail = (p: PipelineConfig) => {
    setSelectedPipeline(p);
    setView('detail');
  };

  const handleSave = () => {
    savePipeline(draft);
    loadPipelines();
    setView('dashboard');
  };

  const handleDelete = (id: string) => {
    deletePipeline(id);
    loadPipelines();
    setView('dashboard');
  };

  const handleToggleStatus = (p: PipelineConfig) => {
    const updated = { ...p, status: p.status === 'active' ? 'paused' as const : 'active' as const };
    savePipeline(updated);
    loadPipelines();
    if (selectedPipeline?.id === p.id) setSelectedPipeline(updated);
  };

  const simulateRun = (p: PipelineConfig) => {
    const run: PipelineRun = {
      id: `run_${Date.now()}`,
      pipelineId: p.id,
      startedAt: new Date().toISOString(),
      finishedAt: new Date(Date.now() + 5000 + Math.random() * 10000).toISOString(),
      status: Math.random() > 0.15 ? 'success' : 'partial',
      recordsProcessed: Math.floor(50 + Math.random() * 500),
      errors: Math.floor(Math.random() * 5),
      duration: `${(5 + Math.random() * 10).toFixed(1)}s`,
    };
    addPipelineRun(run);
    const updated = { ...p, lastRun: run.finishedAt, recordsTotal: p.recordsTotal + run.recordsProcessed, errorCount: p.errorCount + run.errors };
    savePipeline(updated);
    loadPipelines();
    if (selectedPipeline?.id === p.id) setSelectedPipeline(updated);
  };

  // ── Dashboard View ─────────────────────────────────────────
  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Data Pipelines', href: '/pipelines' }]} />
      <FaqSchema faqs={FAQS} />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Your Pipelines</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{pipelines.length} pipeline{pipelines.length !== 1 ? 's' : ''} configured</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            <PlusIcon /> New Pipeline
          </button>
        </div>

        {pipelines.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-4xl mb-4">&#x1F4E6;</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>No pipelines yet</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Create your first data pipeline to start extracting structured data from government records, financial filings, news feeds, and more.</p>
            <button onClick={openCreate} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Create First Pipeline</button>
          </div>
        ) : (
          <div className="space-y-3">
            {pipelines.map(p => {
              const src = DATA_SOURCE_TYPES.find(s => s.id === p.sourceType);
              const pipelineRuns = runs.filter(r => r.pipelineId === p.id);
              const lastRun = pipelineRuns[0];
              return (
                <div key={p.id} className="p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.005]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }} onClick={() => openDetail(p)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{src?.icon || '\u2699\uFE0F'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm" style={{ color: 'var(--ept-text)' }}>{p.name || 'Untitled Pipeline'}</h3>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>
                          {src?.name || p.sourceType} &middot; {SCHEDULE_OPTIONS.find(s => s.value === p.schedule)?.label || p.schedule} &middot; {p.outputFormat.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm font-mono font-bold" style={{ color: 'var(--ept-text)' }}>{p.recordsTotal.toLocaleString()}</div>
                        <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>records</div>
                      </div>
                      {lastRun && (
                        <div>
                          <StatusBadge status={lastRun.status} />
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{lastRun.duration}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Runs */}
        {runs.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Recent Runs</h3>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                    {['Pipeline', 'Status', 'Records', 'Errors', 'Duration', 'Finished'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {runs.slice(0, 10).map(r => {
                    const pl = pipelines.find(p => p.id === r.pipelineId);
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                        <td className="px-4 py-2" style={{ color: 'var(--ept-text)' }}>{pl?.name || r.pipelineId}</td>
                        <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-2 font-mono" style={{ color: 'var(--ept-text)' }}>{r.recordsProcessed}</td>
                        <td className="px-4 py-2 font-mono" style={{ color: r.errors > 0 ? '#ef4444' : 'var(--ept-text-muted)' }}>{r.errors}</td>
                        <td className="px-4 py-2 font-mono" style={{ color: 'var(--ept-text-muted)' }}>{r.duration}</td>
                        <td className="px-4 py-2" style={{ color: 'var(--ept-text-muted)' }}>{new Date(r.finishedAt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ Data Source Health — Rich Dashboard ═══ */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          {/* Dashboard header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }} />
                Data Source Health Monitor
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>
                {(() => {
                  const sources = DATA_SOURCE_TYPES.filter(s => s.workerUrl);
                  const checked = sources.filter(s => sourceHealth[s.id]);
                  const online = checked.filter(s => sourceHealth[s.id]?.ok);
                  if (checked.length === 0) return 'Initializing health probes...';
                  const avgLat = checked.length > 0 ? Math.round(checked.reduce((a, s) => a + (sourceHealth[s.id]?.latency || 0), 0) / checked.length) : 0;
                  return `${online.length}/${sources.length} endpoints healthy \u00B7 ${avgLat}ms avg response`;
                })()}
              </p>
            </div>
            <button onClick={handleCheckAll} disabled={allChecking} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              {allChecking ? (
                <><span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} /> Probing...</>
              ) : (
                <><RefreshIcon /> Refresh All</>
              )}
            </button>
          </div>

          {/* Aggregate stats row */}
          {(() => {
            const sources = DATA_SOURCE_TYPES.filter(s => s.workerUrl);
            const checked = sources.filter(s => sourceHealth[s.id]);
            const online = checked.filter(s => sourceHealth[s.id]?.ok);
            const pct = sources.length > 0 ? (online.length / sources.length) * 100 : 0;
            const barColor = pct >= 100 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';
            const latencies = checked.map(s => sourceHealth[s.id]?.latency || 0).filter(l => l > 0);
            const minLat = latencies.length ? Math.min(...latencies) : 0;
            const maxLat = latencies.length ? Math.max(...latencies) : 0;
            const avgLat = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--ept-text-muted)' }}>Uptime</div>
                  <div className="text-lg font-extrabold" style={{ color: barColor }}>{Math.round(pct)}%</div>
                  <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ backgroundColor: 'var(--ept-card-border)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--ept-text-muted)' }}>Avg Latency</div>
                  <div className="text-lg font-extrabold font-mono" style={{ color: avgLat < 200 ? '#10b981' : avgLat < 500 ? '#f59e0b' : '#ef4444' }}>{avgLat}<span className="text-[10px] font-normal">ms</span></div>
                  <div className="text-[9px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Range: {minLat}-{maxLat}ms</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--ept-text-muted)' }}>Online</div>
                  <div className="text-lg font-extrabold" style={{ color: '#10b981' }}>{online.length}<span className="text-xs font-normal" style={{ color: 'var(--ept-text-muted)' }}>/{sources.length}</span></div>
                  <div className="text-[9px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{sources.length - online.length === 0 ? 'All systems go' : `${sources.length - online.length} degraded`}</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--ept-text-muted)' }}>Workers</div>
                  <div className="text-lg font-extrabold" style={{ color: 'var(--ept-accent)' }}>{sources.length}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>Cloudflare Edge</div>
                </div>
              </div>
            );
          })()}

          {/* Source cards — expandable */}
          <div className="space-y-3">
            {DATA_SOURCE_TYPES.filter(s => s.workerUrl).map(src => {
              const h = sourceHealth[src.id];
              const loading = healthLoading.has(src.id);
              const checkedAt = healthCheckedAt[src.id];
              const isOnline = h?.ok;
              const latency = h?.latency || 0;
              const latencyColor = latency < 100 ? '#10b981' : latency < 300 ? '#22d3ee' : latency < 500 ? '#f59e0b' : '#ef4444';
              const latencyLabel = latency < 100 ? 'Excellent' : latency < 300 ? 'Fast' : latency < 500 ? 'Normal' : 'Slow';
              const maxLatency = 1000;
              const latencyPct = Math.min((latency / maxLatency) * 100, 100);
              const isExpanded = expandedSource === src.id;
              const d = h?.data || {};

              // Extract notable stats from health response
              const stats: { label: string; value: string; color?: string }[] = [];
              if (h?.version) stats.push({ label: 'Version', value: `v${h.version}` });
              if (d.threats) stats.push({ label: 'Threats', value: Number(d.threats).toLocaleString(), color: '#ef4444' });
              if (d.iocs) stats.push({ label: 'IOCs', value: Number(d.iocs).toLocaleString(), color: '#f59e0b' });
              if (d.sources) stats.push({ label: 'Sources', value: String(d.sources) });
              if (d.filings) stats.push({ label: 'Filings', value: String(d.filings) });
              if (d.processed) stats.push({ label: 'Processed', value: String(d.processed) });
              if (d.watched_companies) stats.push({ label: 'Watching', value: `${d.watched_companies} companies` });
              if (d.pending_alerts) stats.push({ label: 'Pending Alerts', value: String(d.pending_alerts), color: '#f59e0b' });
              if (d.filing_types) stats.push({ label: 'Filing Types', value: String(d.filing_types) });
              if (d.total_articles) stats.push({ label: 'Articles', value: Number(d.total_articles).toLocaleString() });
              if (d.articles_24h) stats.push({ label: 'Last 24h', value: `${d.articles_24h} new` });
              if (d.monitored_subreddits) stats.push({ label: 'Subreddits', value: String(d.monitored_subreddits) });
              if (d.total_posts) stats.push({ label: 'Posts Tracked', value: String(d.total_posts) });
              if (d.total_alerts) stats.push({ label: 'Alerts', value: String(d.total_alerts), color: '#f59e0b' });
              if (d.active_alerts) stats.push({ label: 'Active Alerts', value: String(d.active_alerts), color: '#22d3ee' });
              if (d.types) stats.push({ label: 'Doc Types', value: String(d.types) });
              if (d.records !== undefined) stats.push({ label: 'Records', value: Number(d.records).toLocaleString() });
              if (d.mode) stats.push({ label: 'Mode', value: String(d.mode) });
              if (d.scrape_interval_min) stats.push({ label: 'Interval', value: `${d.scrape_interval_min}min` });
              if (d.ransomware_groups !== undefined) stats.push({ label: 'Ransomware Groups', value: String(d.ransomware_groups) });
              if (d.uptime_ms !== undefined) stats.push({ label: 'Uptime', value: `${(Number(d.uptime_ms) / 1000).toFixed(1)}s` });
              if (d.database) stats.push({ label: 'Database', value: String(d.database) });
              const counties = d.counties as string[] | undefined;
              const platforms = d.platforms as string[] | undefined;

              return (
                <div
                  key={src.id}
                  className="rounded-xl border overflow-hidden transition-all"
                  style={{
                    backgroundColor: 'var(--ept-surface)',
                    borderColor: h ? (isOnline ? '#10b98130' : '#ef444430') : 'var(--ept-card-border)',
                  }}
                >
                  {/* Main row — always visible */}
                  <div
                    className="p-4 cursor-pointer transition-colors"
                    onClick={() => setExpandedSource(isExpanded ? null : src.id)}
                    style={{ borderLeft: `3px solid ${h ? (isOnline ? '#10b981' : '#ef4444') : 'var(--ept-card-border)'}` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{src.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{src.name}</span>
                            {h?.version && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: 'var(--ept-card-border)', color: 'var(--ept-text-muted)' }}>v{h.version}</span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: 'var(--ept-accent)' + '20', color: 'var(--ept-accent)' }}>{src.category}</span>
                          </div>
                          {/* Inline stats preview */}
                          {stats.length > 0 && (
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              {stats.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                                  {s.label}: <span className="font-bold font-mono" style={{ color: s.color || 'var(--ept-text-secondary)' }}>{s.value}</span>
                                </span>
                              ))}
                              {stats.length > 3 && (
                                <span className="text-[9px]" style={{ color: 'var(--ept-accent)' }}>+{stats.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side: status + latency + controls */}
                      <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                        {/* Latency chip */}
                        {h && isOnline && (
                          <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono font-extrabold" style={{ color: latencyColor }}>{latency}ms</div>
                            <div className="text-[9px]" style={{ color: latencyColor }}>{latencyLabel}</div>
                          </div>
                        )}
                        {/* Status dot + label */}
                        <div className="flex items-center gap-1.5">
                          {loading ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
                          ) : h ? (
                            <span className="relative flex h-3.5 w-3.5">
                              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: '#10b981' }} />}
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5" style={{ backgroundColor: isOnline ? '#10b981' : '#ef4444' }} />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: 'var(--ept-card-border)' }} />
                          )}
                          <span className="text-[10px] font-bold hidden sm:inline" style={{ color: h ? (isOnline ? '#10b981' : '#ef4444') : 'var(--ept-text-muted)' }}>
                            {loading ? 'PROBING' : h ? (isOnline ? 'ONLINE' : 'DOWN') : 'PENDING'}
                          </span>
                        </div>
                        {/* Expand chevron */}
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Latency progress bar — full width */}
                    {h && isOnline && (
                      <div className="mt-3">
                        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-card-border)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${latencyPct}%`, backgroundColor: latencyColor }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid var(--ept-card-border)' }}>
                      {/* Down alert */}
                      {h && !isOnline ? (
                        <div className="mb-3 p-3 rounded-lg text-xs font-medium flex items-center gap-2" style={{ backgroundColor: '#ef444412', color: '#ef4444' }}>
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                          Endpoint unreachable — service may be cold-starting or temporarily unavailable
                        </div>
                      ) : null}

                      {/* Description */}
                      <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--ept-text-secondary)' }}>
                        {src.description}
                      </p>

                      {/* Stats grid */}
                      {stats.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                          {stats.map((s, i) => (
                            <div key={i} className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                              <div className="text-[9px] font-bold uppercase" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
                              <div className="text-xs font-bold font-mono mt-0.5" style={{ color: s.color || 'var(--ept-text)' }}>{s.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {/* Counties / platforms list */}
                      {counties && counties.length > 0 ? (
                        <div className="mb-3">
                          <div className="text-[9px] font-bold uppercase mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Covered Counties ({counties.length})</div>
                          <div className="flex flex-wrap gap-1">
                            {counties.map(c => (
                              <span key={c} className="px-2 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: 'var(--ept-accent)' + '15', color: 'var(--ept-accent)' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {platforms && platforms.length > 0 ? (
                        <div className="mb-3">
                          <div className="text-[9px] font-bold uppercase mb-1.5" style={{ color: 'var(--ept-text-muted)' }}>Connected Platforms ({platforms.length})</div>
                          <div className="flex flex-wrap gap-1">
                            {platforms.map(p => (
                              <span key={p} className="px-2 py-0.5 rounded text-[9px] font-mono font-bold capitalize" style={{ backgroundColor: 'var(--ept-accent)' + '15', color: 'var(--ept-accent)' }}>{p.replace(/_/g, ' ')}</span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* Last arsenal push (dark web specific) */}
                      {d.last_arsenal_push && typeof d.last_arsenal_push === 'object' ? (
                        <div className="mb-3 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                          <div className="text-[9px] font-bold uppercase mb-1" style={{ color: 'var(--ept-text-muted)' }}>Last Intel Push</div>
                          <div className="flex items-center gap-3 text-[10px]">
                            <span style={{ color: 'var(--ept-text-secondary)' }}>Type: <span className="font-mono font-bold">{String((d.last_arsenal_push as Record<string, unknown>).push_type || 'N/A')}</span></span>
                            <span style={{ color: 'var(--ept-text-secondary)' }}>Items: <span className="font-mono font-bold">{String((d.last_arsenal_push as Record<string, unknown>).item_count || 0)}</span></span>
                            <span style={{ color: 'var(--ept-text-secondary)' }}>Status: <span className="font-mono font-bold" style={{ color: (d.last_arsenal_push as Record<string, unknown>).status === 'success' ? '#10b981' : '#f59e0b' }}>{String((d.last_arsenal_push as Record<string, unknown>).status || 'unknown')}</span></span>
                          </div>
                        </div>
                      ) : null}

                      {/* Service info line */}
                      {h?.service ? (
                        <div className="flex items-center gap-2 text-[10px] mb-3" style={{ color: 'var(--ept-text-muted)' }}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" /></svg>
                          Worker: <span className="font-mono font-bold">{h.service}</span>
                        </div>
                      ) : null}

                      {/* Footer — recheck + timestamp */}
                      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--ept-card-border)' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCheckHealth(src.id); }}
                          disabled={loading}
                          className="text-[10px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-40"
                          style={{ color: 'var(--ept-accent)' }}
                        >
                          <RefreshIcon /> Recheck Now
                        </button>
                        <div className="flex items-center gap-3">
                          {d.timestamp ? (
                            <span className="text-[9px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                              Server: {new Date(String(d.timestamp)).toLocaleTimeString()}
                            </span>
                          ) : null}
                          {checkedAt ? (
                            <span className="text-[9px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                              Checked: {new Date(checkedAt).toLocaleTimeString()}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Create Wizard View ─────────────────────────────────────
  if (view === 'create') {
    const steps: CreateStep[] = ['source', 'config', 'schedule', 'review'];
    const stepIndex = steps.indexOf(createStep);
    const selectedSource = DATA_SOURCE_TYPES.find(s => s.id === draft.sourceType);

    return (
      <div className="space-y-6">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>
          <ArrowLeftIcon /> Back to Dashboard
        </button>

        <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>Create New Pipeline</h2>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => { if (i <= stepIndex) setCreateStep(s); }} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{
                backgroundColor: i <= stepIndex ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: i <= stepIndex ? '#fff' : 'var(--ept-text-muted)',
              }}>
                {i < stepIndex ? '\u2713' : i + 1}
              </button>
              <span className="text-xs font-medium capitalize hidden md:inline" style={{ color: i === stepIndex ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px" style={{ backgroundColor: 'var(--ept-border)' }} />}
            </div>
          ))}
        </div>

        {/* Step: Source Selection */}
        {createStep === 'source' && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Choose a data source type for your pipeline.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {DATA_SOURCE_TYPES.map(src => (
                <button key={src.id} onClick={() => { setDraft(d => ({ ...d, sourceType: src.id, sourceConfig: {} })); setCreateStep('config'); }} className="p-5 rounded-xl border text-left transition-all hover:scale-[1.01]" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: draft.sourceType === src.id ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: draft.sourceType === src.id ? '0 0 15px var(--ept-accent-glow)' : 'none',
                }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{src.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{src.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>{src.category}</span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{src.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Configuration */}
        {createStep === 'config' && selectedSource && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{selectedSource.icon}</span>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{selectedSource.name}</h3>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{selectedSource.description}</p>
              </div>
            </div>
            <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ept-text)' }}>Pipeline Name *</label>
                <input type="text" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Reeves County Daily Deeds" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              {selectedSource.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.label}{f.required ? ' *' : ''}</label>
                  <input type="text" value={draft.sourceConfig[f.key] || ''} onChange={e => setDraft(d => ({ ...d, sourceConfig: { ...d.sourceConfig, [f.key]: e.target.value } }))} placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ept-text)' }}>Output Format</label>
                <div className="flex gap-2">
                  {(['json', 'csv', 'webhook', 'api'] as const).map(fmt => (
                    <button key={fmt} onClick={() => setDraft(d => ({ ...d, outputFormat: fmt }))} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all" style={{
                      backgroundColor: draft.outputFormat === fmt ? 'var(--ept-accent)' : 'transparent',
                      color: draft.outputFormat === fmt ? '#fff' : 'var(--ept-text-muted)',
                      borderColor: draft.outputFormat === fmt ? 'var(--ept-accent)' : 'var(--ept-border)',
                    }}>{fmt.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              {(draft.outputFormat === 'webhook' || draft.outputFormat === 'api') && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ept-text)' }}>Output URL</label>
                  <input type="url" value={draft.outputUrl} onChange={e => setDraft(d => ({ ...d, outputUrl: e.target.value }))} placeholder="https://your-api.com/webhook" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCreateStep('source')} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Back</button>
              <button onClick={() => setCreateStep('schedule')} disabled={!draft.name} className="px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-40" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Next: Schedule</button>
            </div>
          </div>
        )}

        {/* Step: Schedule & Transforms */}
        {createStep === 'schedule' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>Schedule</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SCHEDULE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setDraft(d => ({ ...d, schedule: opt.value }))} className="px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left" style={{
                    backgroundColor: draft.schedule === opt.value ? 'var(--ept-accent)' : 'transparent',
                    color: draft.schedule === opt.value ? '#fff' : 'var(--ept-text-secondary)',
                    borderColor: draft.schedule === opt.value ? 'var(--ept-accent)' : 'var(--ept-border)',
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>Transformations</h3>
              <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Select processing steps to apply to extracted data.</p>
              <div className="space-y-2">
                {TRANSFORM_OPTIONS.map(t => {
                  const active = draft.transformations.includes(t.id);
                  return (
                    <button key={t.id} onClick={() => setDraft(d => ({ ...d, transformations: active ? d.transformations.filter(x => x !== t.id) : [...d.transformations, t.id] }))} className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all" style={{
                      backgroundColor: active ? 'var(--ept-accent)' + '10' : 'transparent',
                      borderColor: active ? 'var(--ept-accent)' : 'var(--ept-border)',
                    }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: active ? 'var(--ept-accent)' : 'var(--ept-surface)', color: '#fff' }}>
                        {active && <CheckIcon />}
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{t.label}</div>
                        <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{t.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCreateStep('config')} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Back</button>
              <button onClick={() => setCreateStep('review')} className="px-6 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Next: Review</button>
            </div>
          </div>
        )}

        {/* Step: Review & Create */}
        {createStep === 'review' && selectedSource && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>Pipeline Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div style={{ color: 'var(--ept-text-muted)' }}>Name</div>
                  <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{draft.name}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ept-text-muted)' }}>Source</div>
                  <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{selectedSource.icon} {selectedSource.name}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ept-text-muted)' }}>Schedule</div>
                  <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{SCHEDULE_OPTIONS.find(s => s.value === draft.schedule)?.label}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ept-text-muted)' }}>Output</div>
                  <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{draft.outputFormat.toUpperCase()}{draft.outputUrl ? ` \u2192 ${draft.outputUrl}` : ''}</div>
                </div>
              </div>
              {Object.keys(draft.sourceConfig).length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--ept-text-muted)' }}>Source Configuration</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(draft.sourceConfig).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: 'var(--ept-text-muted)' }}>{selectedSource.fields.find(f => f.key === k)?.label || k}</div>
                        <div className="font-mono" style={{ color: 'var(--ept-text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {draft.transformations.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--ept-text-muted)' }}>Transformations</div>
                  <div className="flex flex-wrap gap-2">
                    {draft.transformations.map(t => (
                      <span key={t} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                        {TRANSFORM_OPTIONS.find(o => o.id === t)?.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCreateStep('schedule')} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Back</button>
              <button onClick={handleSave} className="px-8 py-2.5 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Create Pipeline</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Detail View ────────────────────────────────────────────
  if (view === 'detail' && selectedPipeline) {
    const src = DATA_SOURCE_TYPES.find(s => s.id === selectedPipeline.sourceType);
    const pipelineRuns = runs.filter(r => r.pipelineId === selectedPipeline.id);
    const successRate = pipelineRuns.length > 0
      ? Math.round((pipelineRuns.filter(r => r.status === 'success').length / pipelineRuns.length) * 100)
      : 0;

    return (
      <div className="space-y-6">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>
          <ArrowLeftIcon /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{src?.icon || '\u2699\uFE0F'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: 'var(--ept-text)' }}>{selectedPipeline.name || 'Untitled'}</h2>
                <StatusBadge status={selectedPipeline.status} />
              </div>
              <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{src?.name} &middot; Created {new Date(selectedPipeline.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => simulateRun(selectedPipeline)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              <PlayIcon /> Run Now
            </button>
            <button onClick={() => handleToggleStatus(selectedPipeline)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              {selectedPipeline.status === 'active' ? <><PauseIcon /> Pause</> : <><PlayIcon /> Resume</>}
            </button>
            <button onClick={() => handleDelete(selectedPipeline.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <TrashIcon /> Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Records', value: selectedPipeline.recordsTotal.toLocaleString() },
            { label: 'Total Errors', value: selectedPipeline.errorCount.toString() },
            { label: 'Runs', value: pipelineRuns.length.toString() },
            { label: 'Success Rate', value: `${successRate}%` },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Configuration */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div><span style={{ color: 'var(--ept-text-muted)' }}>Schedule:</span> <span className="font-mono" style={{ color: 'var(--ept-text)' }}>{SCHEDULE_OPTIONS.find(s => s.value === selectedPipeline.schedule)?.label}</span></div>
            <div><span style={{ color: 'var(--ept-text-muted)' }}>Output:</span> <span className="font-mono" style={{ color: 'var(--ept-text)' }}>{selectedPipeline.outputFormat.toUpperCase()}</span></div>
            <div><span style={{ color: 'var(--ept-text-muted)' }}>Transforms:</span> <span className="font-mono" style={{ color: 'var(--ept-text)' }}>{selectedPipeline.transformations.length || 'None'}</span></div>
            {Object.entries(selectedPipeline.sourceConfig).filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><span style={{ color: 'var(--ept-text-muted)' }}>{k}:</span> <span className="font-mono" style={{ color: 'var(--ept-text)' }}>{v}</span></div>
            ))}
          </div>
        </div>

        {/* Run History */}
        {pipelineRuns.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Run History</h3>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                    {['Status', 'Records', 'Errors', 'Duration', 'Started', 'Finished'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pipelineRuns.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                      <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-2 font-mono" style={{ color: 'var(--ept-text)' }}>{r.recordsProcessed}</td>
                      <td className="px-4 py-2 font-mono" style={{ color: r.errors > 0 ? '#ef4444' : 'var(--ept-text-muted)' }}>{r.errors}</td>
                      <td className="px-4 py-2 font-mono" style={{ color: 'var(--ept-text-muted)' }}>{r.duration}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--ept-text-muted)' }}>{new Date(r.startedAt).toLocaleString()}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--ept-text-muted)' }}>{new Date(r.finishedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════

function PipelinesPageContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [tab, setTab] = useState<MainTab>('overview');
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find(s => s.id === SERVICE_ID);
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup?redirect=/pipelines'; return; }
    const tier = service?.pricing[tierIndex];
    if (!tier || tier.custom) { window.location.href = 'mailto:bob@echo-op.com?subject=Enterprise%20Data%20Pipelines%20Inquiry'; return; }
    setCheckingOut(tier.tier);
    try {
      const { url } = await createCheckout(SERVICE_ID, tier.tier);
      window.location.href = url;
    } catch {
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Data Pipelines — Automated Data Integration</h1><p>Build automated data pipelines with visual configuration. Connect REST APIs, databases, file systems, webhooks, and cloud storage as data sources. Apply transformations including JSON extraction, CSV parsing, deduplication, filtering, AI enrichment, and schema validation. Schedule pipelines on cron intervals or trigger on demand. Monitor pipeline health with execution history, success rates, and record counts. Features include multi-source ingestion, configurable transformations, scheduled execution, real-time monitoring, and export to any destination.</p></div></noscript>
      <ProductTutorialButton tutorialId="pipelines" productName="Data Pipelines" />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* Tab Bar */}
      <div className="border-b px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          {[
            { id: 'overview' as MainTab, label: 'Overview' },
            { id: 'builder' as MainTab, label: 'Pipeline Builder' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="py-3 text-sm font-semibold border-b-2 transition-all" style={{
              borderColor: tab === t.id ? 'var(--ept-accent)' : 'transparent',
              color: tab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── Overview Tab ── */}
      {tab === 'overview' && (
        <>
          {/* Hero */}
          <section data-tutorial="pipelines-hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Data Pipelines</div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Autonomous Data<br /><span className="gradient-text">Extraction at Scale</span></h1>
            <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Systems that find, extract, normalize, and deliver structured data from thousands of sources &mdash; running 24/7 without human intervention.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button onClick={() => setTab('builder')} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Extracting</button>
              <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>View Pricing</Link>
            </div>
            <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('.max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
          </section>

          {/* Stats */}
          <section className="max-w-4xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Records Processed', value: '259K+' },
                { label: 'Data Sources', value: '50+' },
                { label: 'Counties Covered', value: '80+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section data-tutorial="pipelines-features" className="max-w-6xl mx-auto px-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Built for Production Data at Scale</h2>
            <div className="grid md:grid-cols-4 gap-5">
              {[
                { icon: '\u26A1', title: 'Autonomous Extraction', desc: 'Systems that find, extract, and normalize data from thousands of sources without human intervention.' },
                { icon: '\uD83C\uDF10', title: 'Multi-Source Ingestion', desc: 'County records, public filings, market data, government databases, API aggregation. 50+ source types.' },
                { icon: '\uD83D\uDD04', title: 'Real-Time Sync', desc: 'Configurable sync intervals from real-time to daily. Automatic change detection and delta updates.' },
                { icon: '\uD83E\uDDE9', title: 'Custom Transformations', desc: 'ETL pipelines that clean, normalize, deduplicate, and enrich your data with custom schemas.' },
                { icon: '\uD83D\uDCE6', title: 'Flexible Delivery', desc: 'REST API, webhooks, CSV/JSON export, database replication, or direct bucket delivery.' },
                { icon: '\uD83D\uDEE1\uFE0F', title: 'Data Quality Gates', desc: 'Automated validation, schema enforcement, completeness checks, and anomaly detection.' },
                { icon: '\uD83D\uDCC8', title: 'Pipeline Analytics', desc: 'Track records processed, error rates, latency, throughput, and data freshness.' },
                { icon: '\uD83D\uDD12', title: 'Enterprise Security', desc: 'Encrypted at rest and in transit. API key management, audit logging, SOC2-ready.' },
              ].map((f, i) => (
                <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section data-tutorial="pipelines-types" className="max-w-5xl mx-auto px-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Oil & Gas Land Records', desc: 'Extract deed records, mineral rights, leases, and assignments from 80+ county clerk databases. 259K+ records processed.' },
                { title: 'Competitive Intelligence', desc: 'Monitor competitor websites, pricing changes, product launches, job postings, and press releases in real-time.' },
                { title: 'Financial Data Aggregation', desc: 'Consolidate market data, SEC filings, earnings reports, and alternative data sources into a unified feed.' },
                { title: 'Government & Public Records', desc: 'Business filings, court records, property records, permits, and licensing data from state and federal databases.' },
              ].map((uc, i) => (
                <div key={i} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{uc.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{uc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          {service && (
            <section data-tutorial="pipelines-pricing" className="max-w-5xl mx-auto px-6 pb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
              <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>{service.tagline}</p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {service.pricing.map((tier, i) => (
                  <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                    backgroundColor: 'var(--ept-card-bg)',
                    borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
                  }}>
                    {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
                    <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                    <div className="mb-6">
                      {tier.price !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price}</span>
                          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                          <span style={{ color: 'var(--ept-accent)' }}><CheckIcon /></span>{f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleCheckout(i)} disabled={checkingOut === tier.tier} className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                      backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                      color: tier.popular ? '#fff' : 'var(--ept-accent)',
                      border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                    }}>
                      {checkingOut === tier.tier ? 'Redirecting...' : tier.custom ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
            <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Stop building scrapers from scratch</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Get production-grade data pipelines running in minutes, not months.</p>
              <button onClick={() => setTab('builder')} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Open Pipeline Builder</button>
            </div>
          </section>
        </>
      )}

      {/* ── Builder Tab ── */}
      {tab === 'builder' && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <PipelineBuilderApp />
        </section>
      )}
      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Data Pipeline Engine
        </h2>
        <EngineQueryPanel
          domains={['SE', 'DATA']}
          title="Ask the Data Pipeline Engine"
          placeholder="Ask about ETL, data extraction, normalization..."
          exampleQueries={['Best practices for web scraping at scale', 'How to handle rate limiting in data pipelines', 'Data normalization techniques']}
        />
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}

export default function PipelinesPage() {
  return <SubscriptionGate serviceId="data-pipelines"><PipelinesPageContent /></SubscriptionGate>;
}
