'use client';

import { useEffect, useState } from 'react';
import type { AgenticStep, ExecutionPlan } from '@/lib/agentic-engine-api';

// ─── Types ───────────────────────────────────────────────────

interface AgenticProgressPanelProps {
  plan: ExecutionPlan | null;
  steps: AgenticStepDisplay[];
  status: string;
  elapsed: number;
  onCancel: () => void;
}

export interface AgenticStepDisplay {
  id: number;
  name: string;
  type: 'search' | 'analyze' | 'validate' | 'assemble' | 'enrich' | 'calculate';
  status: 'pending' | 'running' | 'complete' | 'failed' | 'skipped';
  duration_ms: number;
  summary?: string;
  error?: string;
}

// ─── Icons ───────────────────────────────────────────────────

const typeIcons: Record<string, string> = {
  search: '\u{1F50D}',
  analyze: '\u{1F9E0}',
  validate: '\u{2705}',
  assemble: '\u{1F4C4}',
  enrich: '\u{2728}',
  calculate: '\u{1F4CA}',
};

const statusColors: Record<string, string> = {
  pending: 'var(--ept-text-dim, #6b7280)',
  running: 'var(--ept-accent, #00e5ff)',
  complete: 'var(--ept-green, #10b981)',
  failed: 'var(--ept-red, #ef4444)',
  skipped: 'var(--ept-text-dim, #6b7280)',
};

// ─── Component ───────────────────────────────────────────────

export default function AgenticProgressPanel({ plan, steps, status, elapsed, onCancel }: AgenticProgressPanelProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const completedCount = steps.filter(s => s.status === 'complete').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const totalSteps = steps.length || plan?.estimated_steps || 0;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isRunning = !['complete', 'failed', 'cancelled'].includes(status);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerTitle}>
            <span style={styles.pulseIcon}>{isRunning ? '\u{26A1}' : '\u{2705}'}</span>
            Deep Analysis Mode
          </div>
          <div style={styles.headerMeta}>
            {plan?.strategy && <span style={styles.strategy}>{plan.strategy}</span>}
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.timer}>{formatDuration(elapsed)}</span>
          {isRunning && (
            <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
            background: failedCount > 0 ? 'var(--ept-yellow, #f59e0b)' : 'var(--ept-accent, #00e5ff)',
          }}
        />
      </div>
      <div style={styles.progressLabel}>
        {completedCount}/{totalSteps} steps complete
        {failedCount > 0 && <span style={styles.failedLabel}> ({failedCount} failed)</span>}
        {status === 'complete' && <span style={styles.doneLabel}> — Analysis Complete</span>}
      </div>

      {/* Status Badge */}
      <div style={styles.statusRow}>
        <span style={{ ...styles.statusBadge, background: getStatusBg(status), color: getStatusColor(status) }}>
          {status.toUpperCase()}
        </span>
        {plan?.complexity && (
          <span style={styles.complexityBadge}>
            Complexity: {plan.complexity}
          </span>
        )}
      </div>

      {/* Step List */}
      <div style={styles.stepList}>
        {steps.map((step) => (
          <div
            key={step.id}
            style={{
              ...styles.stepCard,
              borderLeftColor: statusColors[step.status] || statusColors.pending,
              opacity: step.status === 'skipped' ? 0.5 : 1,
            }}
            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
          >
            <div style={styles.stepHeader}>
              <span style={styles.stepIcon}>{typeIcons[step.type] || '\u{2699}'}</span>
              <span style={styles.stepName}>{step.name}</span>
              <span style={{ ...styles.stepStatus, color: statusColors[step.status] }}>
                {step.status === 'running' && <span style={styles.spinner} />}
                {step.status}
              </span>
              {step.duration_ms > 0 && (
                <span style={styles.stepDuration}>{(step.duration_ms / 1000).toFixed(1)}s</span>
              )}
            </div>

            {/* Expanded Detail */}
            {expandedStep === step.id && (step.summary || step.error) && (
              <div style={styles.stepDetail}>
                {step.summary && <div style={styles.stepSummary}>{step.summary}</div>}
                {step.error && <div style={styles.stepError}>{step.error}</div>}
              </div>
            )}
          </div>
        ))}

        {/* Placeholder steps if plan exists but steps haven't started */}
        {steps.length === 0 && plan?.steps.map((ps) => (
          <div key={ps.id} style={{ ...styles.stepCard, borderLeftColor: statusColors.pending, opacity: 0.5 }}>
            <div style={styles.stepHeader}>
              <span style={styles.stepIcon}>{typeIcons[ps.type] || '\u{2699}'}</span>
              <span style={styles.stepName}>{ps.name}</span>
              <span style={{ ...styles.stepStatus, color: statusColors.pending }}>pending</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
}

function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    planning: 'rgba(99,102,241,0.15)',
    executing: 'rgba(0,229,255,0.15)',
    validating: 'rgba(245,158,11,0.15)',
    assembling: 'rgba(139,92,246,0.15)',
    complete: 'rgba(16,185,129,0.15)',
    failed: 'rgba(239,68,68,0.15)',
    cancelled: 'rgba(107,114,128,0.15)',
  };
  return map[status] || 'rgba(107,114,128,0.15)';
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    planning: '#6366f1',
    executing: '#00e5ff',
    validating: '#f59e0b',
    assembling: '#8b5cf6',
    complete: '#10b981',
    failed: '#ef4444',
    cancelled: '#6b7280',
  };
  return map[status] || '#6b7280';
}

// ─── Styles ──────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    background: 'var(--ept-surface, #111827)',
    borderRadius: '12px',
    border: '1px solid var(--ept-border, #374151)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--ept-text, #e5e7eb)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pulseIcon: { fontSize: '18px' },
  headerMeta: { fontSize: '12px', color: 'var(--ept-text-dim, #6b7280)' },
  strategy: { fontStyle: 'italic' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  timer: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: 'var(--ept-accent, #00e5ff)',
    fontWeight: 600,
  },
  cancelBtn: {
    padding: '4px 12px',
    background: 'rgba(239,68,68,0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
  },
  progressTrack: {
    height: '4px',
    background: 'var(--ept-surface2, #1f2937)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: '12px',
    color: 'var(--ept-text-dim, #6b7280)',
  },
  failedLabel: { color: '#f59e0b' },
  doneLabel: { color: '#10b981', fontWeight: 600 },
  statusRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  statusBadge: {
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  complexityBadge: {
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    background: 'rgba(139,92,246,0.15)',
    color: '#8b5cf6',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  stepCard: {
    background: 'var(--ept-bg, #0a0e17)',
    border: '1px solid var(--ept-border, #374151)',
    borderLeft: '3px solid',
    borderRadius: '6px',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  },
  stepIcon: { fontSize: '14px', flexShrink: 0 },
  stepName: {
    flex: 1,
    fontWeight: 500,
    color: 'var(--ept-text, #e5e7eb)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  stepStatus: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  spinner: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  stepDuration: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: 'var(--ept-text-dim, #6b7280)',
    flexShrink: 0,
  },
  stepDetail: {
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid var(--ept-border, #374151)',
    fontSize: '12px',
  },
  stepSummary: {
    color: 'var(--ept-text-dim, #6b7280)',
    lineHeight: 1.5,
    maxHeight: '100px',
    overflow: 'auto',
  },
  stepError: {
    color: '#ef4444',
    lineHeight: 1.5,
  },
};
