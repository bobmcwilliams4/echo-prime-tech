'use client';

import { useState } from 'react';
import MarkdownBlock from './MarkdownBlock';
import type {
  PipelineResult,
  RunSheetRow,
  OwnershipEntry,
  GapEntry,
  RequirementEntry,
} from '../lib/landman-api';

interface TitleChainReportProps {
  result: PipelineResult;
  onClose?: () => void;
}

type Tab = 'summary' | 'runsheet' | 'ownership' | 'gaps' | 'title_report' | 'report';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'summary', label: 'Summary', icon: '📋' },
  { id: 'runsheet', label: 'Run Sheet', icon: '📜' },
  { id: 'ownership', label: 'Ownership', icon: '👥' },
  { id: 'gaps', label: 'Gaps & Req.', icon: '⚠️' },
  { id: 'title_report', label: 'Title Report', icon: '📑' },
  { id: 'report', label: 'Full Report', icon: '📄' },
];

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    stop: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
    critical: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
    warn: { bg: 'rgba(234,179,8,0.15)', text: '#facc15' },
    warning: { bg: 'rgba(234,179,8,0.15)', text: '#facc15' },
    info: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    low: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  };
  const c = colors[severity.toLowerCase()] || colors.info;
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {severity}
    </span>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className="p-3 rounded-lg border text-center"
      style={{ backgroundColor: 'rgba(12,18,32,0.6)', borderColor: 'rgba(30,41,59,0.4)' }}
    >
      <div
        className="text-2xl font-bold"
        style={{ color: accent ? 'var(--ept-accent)' : '#e2e8f0' }}
      >
        {value}
      </div>
      <div className="text-[11px] mt-1" style={{ color: '#64748b' }}>{label}</div>
    </div>
  );
}

function RunSheetTable({ rows }: { rows: RunSheetRow[] }) {
  if (!rows.length) return <p className="text-sm" style={{ color: '#64748b' }}>No run sheet data available.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(30,41,59,0.5)' }}>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>#</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Date</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Type</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>From</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>To</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Instrument</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Book/Page</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Interest</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid rgba(30,41,59,0.3)',
                backgroundColor: r.gap_flags?.length ? 'rgba(239,68,68,0.05)' : 'transparent',
              }}
            >
              <td className="p-2" style={{ color: '#94a3b8' }}>{r.event_order}</td>
              <td className="p-2 whitespace-nowrap" style={{ color: '#e2e8f0' }}>{r.event_date}</td>
              <td className="p-2" style={{ color: '#e2e8f0' }}>{r.doc_type}</td>
              <td className="p-2" style={{ color: '#e2e8f0' }}>{r.from_party}</td>
              <td className="p-2" style={{ color: '#e2e8f0' }}>{r.to_party}</td>
              <td className="p-2 font-mono text-[10px]" style={{ color: 'var(--ept-accent)' }}>{r.instrument_no}</td>
              <td className="p-2 font-mono text-[10px]" style={{ color: '#94a3b8' }}>{r.book_page}</td>
              <td className="p-2" style={{ color: '#e2e8f0' }}>{r.interest_conveyed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OwnershipTable({ entries }: { entries: OwnershipEntry[] }) {
  if (!entries.length) return <p className="text-sm" style={{ color: '#64748b' }}>No ownership data available.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(30,41,59,0.5)' }}>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Party</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Interest Type</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Fraction</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>Source Doc</th>
            <th className="text-left p-2 font-semibold" style={{ color: 'var(--ept-accent)' }}>As Of</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(30,41,59,0.3)' }}>
              <td className="p-2 font-medium" style={{ color: '#e2e8f0' }}>{e.party}</td>
              <td className="p-2" style={{ color: '#94a3b8' }}>{e.interest_type}</td>
              <td className="p-2 font-mono" style={{ color: 'var(--ept-accent)' }}>{e.fraction}</td>
              <td className="p-2 font-mono text-[10px]" style={{ color: '#94a3b8' }}>{e.source_doc}</td>
              <td className="p-2 whitespace-nowrap" style={{ color: '#94a3b8' }}>{e.as_of_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GapsList({ gaps, requirements }: { gaps: GapEntry[]; requirements: RequirementEntry[] }) {
  return (
    <div className="space-y-4">
      {gaps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: '#e2e8f0' }}>
            Title Gaps ({gaps.length})
          </h4>
          <div className="space-y-2">
            {gaps.map((g, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border"
                style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{g.party}</span>
                    <span className="text-xs mx-2" style={{ color: '#64748b' }}>{g.gap_type}</span>
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{g.description}</p>
                {g.suggested_cure && (
                  <p className="text-xs mt-1" style={{ color: 'var(--ept-accent)' }}>
                    Cure: {g.suggested_cure}
                  </p>
                )}
                {g.doc_refs?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {g.doc_refs.map((d, j) => (
                      <span key={j} className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'rgba(30,41,59,0.5)', color: '#94a3b8' }}>
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {requirements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: '#e2e8f0' }}>
            Requirements ({requirements.length})
          </h4>
          <div className="space-y-2">
            {requirements.map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border flex items-start gap-3"
                style={{ backgroundColor: 'rgba(12,18,32,0.6)', borderColor: 'rgba(30,41,59,0.4)' }}
              >
                <SeverityBadge severity={r.severity} />
                <div className="flex-1">
                  <span className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{r.type}</span>
                  <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{r.description}</p>
                  {r.doc_refs?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.doc_refs.map((d, j) => (
                        <span key={j} className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'rgba(30,41,59,0.5)', color: '#94a3b8' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.length === 0 && requirements.length === 0 && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm font-semibold" style={{ color: '#4ade80' }}>No gaps or requirements found</p>
          <p className="text-xs" style={{ color: '#64748b' }}>Title chain appears complete</p>
        </div>
      )}
    </div>
  );
}

export default function TitleChainReport({ result, onClose }: TitleChainReportProps) {
  const [tab, setTab] = useState<Tab>('summary');
  const [copied, setCopied] = useState(false);

  const copyReport = () => {
    navigator.clipboard.writeText(result.report || 'No report available');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const blob = new Blob([result.report || 'No report available'], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `title-chain-${result.tract_id || 'report'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadProfessionalReport = () => {
    if (!result.professional_report) return;
    const blob = new Blob([result.professional_report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MINERAL_TITLE_REPORT_${result.tract_id || 'report'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadVisualChain = () => {
    if (!result.visual_chain_html) return;
    const blob = new Blob([result.visual_chain_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `title-chain-visual-${result.tract_id || 'graph'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'rgba(12,18,32,0.8)', borderColor: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(12px)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(30,41,59,0.4)', backgroundColor: 'rgba(20,184,166,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔗</span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>
              Title Chain Analysis
            </h3>
            <p className="text-[11px]" style={{ color: '#64748b' }}>
              {result.tract_id || 'Unknown Tract'} &middot; {result.records_found} records &middot; {result.gaps?.length || 0} gaps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyReport}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{ borderColor: 'rgba(30,41,59,0.5)', color: copied ? '#4ade80' : '#94a3b8' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadReport}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{ borderColor: 'rgba(30,41,59,0.5)', color: '#94a3b8' }}
          >
            Download
          </button>
          {result.professional_report && (
            <button
              onClick={downloadProfessionalReport}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{ borderColor: 'rgba(20,184,166,0.3)', color: 'var(--ept-accent)' }}
            >
              Title Report
            </button>
          )}
          {result.visual_chain_html && (
            <button
              onClick={downloadVisualChain}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{ borderColor: 'rgba(20,184,166,0.3)', color: 'var(--ept-accent)' }}
            >
              Visual Chain
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: '#64748b' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ borderColor: 'rgba(30,41,59,0.4)' }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors"
            style={{
              color: tab === t.id ? 'var(--ept-accent)' : '#64748b',
              borderBottom: tab === t.id ? '2px solid var(--ept-accent)' : '2px solid transparent',
              backgroundColor: tab === t.id ? 'rgba(20,184,166,0.05)' : 'transparent',
            }}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {tab === 'summary' && (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Records Found" value={result.records_found} accent />
              <StatCard label="Evidence Count" value={result.evidence_count || 0} />
              <StatCard label="Title Gaps" value={result.gaps?.length || 0} />
              <StatCard label="Requirements" value={result.requirements?.length || 0} />
            </div>

            {/* Current Ownership Summary */}
            {result.ownership_table?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ept-accent)' }}>
                  Current Ownership
                </h4>
                <div className="space-y-1">
                  {result.ownership_table.slice(0, 8).map((o, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: '1px solid rgba(30,41,59,0.2)' }}>
                      <span style={{ color: '#e2e8f0' }}>{o.party}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: '#94a3b8' }}>{o.interest_type}</span>
                        <span className="font-mono font-semibold" style={{ color: 'var(--ept-accent)' }}>{o.fraction}</span>
                      </div>
                    </div>
                  ))}
                  {result.ownership_table.length > 8 && (
                    <button
                      onClick={() => setTab('ownership')}
                      className="text-xs mt-1"
                      style={{ color: 'var(--ept-accent)' }}
                    >
                      View all {result.ownership_table.length} entries &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Gap Summary */}
            {result.gaps?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#f87171' }}>
                  Gaps Found
                </h4>
                <div className="space-y-1">
                  {result.gaps.slice(0, 5).map((g, i) => (
                    <div key={i} className="text-xs flex items-start gap-2 py-1">
                      <span style={{ color: '#f87171' }}>!</span>
                      <span style={{ color: '#94a3b8' }}>{g.party}: {g.description}</span>
                    </div>
                  ))}
                  {result.gaps.length > 5 && (
                    <button
                      onClick={() => setTab('gaps')}
                      className="text-xs mt-1"
                      style={{ color: 'var(--ept-accent)' }}
                    >
                      View all {result.gaps.length} gaps &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="text-xs text-center pt-2" style={{ color: '#64748b' }}>
              Status: <span style={{ color: result.status === 'complete' ? '#4ade80' : 'var(--ept-accent)' }}>{result.status}</span>
            </div>
          </div>
        )}

        {tab === 'runsheet' && <RunSheetTable rows={result.run_sheet || []} />}
        {tab === 'ownership' && <OwnershipTable entries={result.ownership_table || []} />}
        {tab === 'gaps' && <GapsList gaps={result.gaps || []} requirements={result.requirements || []} />}

        {tab === 'title_report' && (
          <div>
            {result.professional_report ? (
              <div className="sentinel-md">
                <MarkdownBlock content={result.professional_report} />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">📑</div>
                <p className="text-sm" style={{ color: '#64748b' }}>Professional title report not available for this investigation.</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>Run a new investigation to generate the report.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'report' && (
          <div
            className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
            style={{ color: '#e2e8f0' }}
          >
            {result.report || 'No report generated.'}
          </div>
        )}
      </div>
    </div>
  );
}
