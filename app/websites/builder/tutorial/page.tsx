'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../../lib/theme-context';
import {
  TUTORIALS,
  QUICK_REFERENCE,
  type Tutorial,
  type TutorialStep,
} from '../../../../lib/builder-tutorial-data';

/* ═══════════════════════════════════════════════════════════════════════════
   WEBSITE BUILDER — INTERACTIVE TUTORIAL PAGE
   /websites/builder/tutorial — Public, no auth required
   11 tutorials, 57 steps, covering all 16 builder features.
   Gold accent (#C9A94E) matches the builder's dark UI.
   ═══════════════════════════════════════════════════════════════════════════ */

const GOLD = '#C9A94E';
const GOLD_DIM = 'rgba(201,169,78,.12)';
const GREEN = '#10b981';

// ── localStorage progress ──
const STORAGE_KEY = 'builder_tutorial_progress';
function getProgress(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, number[]>) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function isTutorialComplete(id: string, total: number, p: Record<string, number[]>): boolean {
  return (p[id]?.length || 0) >= total;
}

/* ── Illustration mini-components (builder-specific patterns) ── */

function IllFrame({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden', backgroundColor: 'var(--ept-surface)' }}>
      {children}
      {caption && (
        <div style={{ padding: '6px 10px', borderTop: '1px solid var(--ept-border)', fontSize: 9, color: 'var(--ept-text-muted)', textAlign: 'center', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function DashboardPanels({ panels }: { panels: { label: string; value: string; trend?: string }[] }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {panels.map((p, i) => (
        <div key={i} style={{ flex: 1, minWidth: 80, padding: '10px 14px', borderRadius: 8, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{p.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ept-text)', marginTop: 4 }}>{p.value}</div>
          {p.trend && <div style={{ fontSize: 10, color: p.trend === 'up' ? GREEN : '#ef4444', marginTop: 2 }}>{p.trend === 'up' ? '\u25B2' : '\u25BC'}</div>}
        </div>
      ))}
    </div>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center', padding: '8px 0' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '8px 14px', borderRadius: 8, backgroundColor: GOLD_DIM, border: `1px solid ${GOLD}44`, fontSize: 11, fontWeight: 600, color: 'var(--ept-text)', whiteSpace: 'nowrap' }}>{s}</div>
          {i < steps.length - 1 && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ margin: '0 2px', flexShrink: 0 }}>
              <path d="M8 6l4 4-4 4" stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function FormMockup({ fields }: { fields: { label: string; type?: string; placeholder?: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {fields.map((f, i) => (
        <div key={i}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{f.label}</label>
          {f.type === 'select' ? (
            <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: 'var(--ept-text-muted)' }}>{f.placeholder || 'Select...'} \u25BE</div>
          ) : f.type === 'textarea' ? (
            <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: 'var(--ept-text-muted)', minHeight: 48, lineHeight: 1.5 }}>{f.placeholder || ''}</div>
          ) : (
            <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', fontSize: 12, color: 'var(--ept-text-muted)' }}>{f.placeholder || 'Enter...'}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function TableMockup({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, backgroundColor: 'var(--ept-surface)' }}>
        {headers.map((h, i) => (
          <div key={i} style={{ padding: '6px 10px', fontSize: 9, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', borderRight: i < headers.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>{h}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, borderTop: '1px solid var(--ept-border)' }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{ padding: '8px 10px', fontSize: 11, color: 'var(--ept-text-secondary)', borderRight: ci < headers.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function BarChartSimple({ label, items }: { label?: string; items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div>
      {label && <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', width: 70, textAlign: 'right', flexShrink: 0 }}>{item.label}</span>
            <div style={{ flex: 1, height: 16, borderRadius: 4, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
              <div style={{ width: `${(item.value / max) * 100}%`, height: '100%', borderRadius: 4, backgroundColor: GOLD, transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text)', width: 30 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalMockup({ title, body, buttons }: { title: string; body?: string; buttons: string[] }) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid var(--ept-border)', overflow: 'hidden', maxWidth: 340, margin: '0 auto' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ept-text)' }}>{title}</span>
        <span style={{ fontSize: 16, color: 'var(--ept-text-muted)', cursor: 'pointer' }}>\u00D7</span>
      </div>
      {body && <div style={{ padding: 14, fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{body}</div>}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--ept-border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {buttons.map((b, i) => (
          <div key={i} style={{ padding: '7px 16px', borderRadius: 8, backgroundColor: i === buttons.length - 1 ? GOLD : 'var(--ept-surface)', color: i === buttons.length - 1 ? '#fff' : 'var(--ept-text-secondary)', fontSize: 12, fontWeight: 600, border: i === buttons.length - 1 ? 'none' : '1px solid var(--ept-border)' }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

function SettingsSections({ sections }: { sections: { title: string; items: { label: string; value: string }[] }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sections.map((sec, si) => (
        <div key={si}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{sec.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sec.items.map((item, ii) => (
              <div key={ii} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--ept-text)' }}>{item.label}</span>
                <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveStatus({ status, label, metrics }: { status: string; label: string; metrics: { label: string; value: string }[] }) {
  const isActive = status === 'active' || status === 'online';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: isActive ? GREEN : '#f59e0b', animation: isActive ? 'pulse 2s infinite' : 'none' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ flex: 1, minWidth: 80, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginTop: 2 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step Illustration Dispatcher ──

function StepIllustration({ step }: { step: TutorialStep }) {
  const cfg = step.illustrationConfig;
  const type = step.illustrationType;

  if (type === 'dashboard') {
    const panels = cfg.panels as { label: string; value: string; trend?: string }[];
    return panels ? <DashboardPanels panels={panels} /> : null;
  }
  if (type === 'flow') {
    const steps = cfg.steps as string[];
    return steps ? <FlowDiagram steps={steps} /> : null;
  }
  if (type === 'form') {
    const fields = cfg.fields as { label: string; type?: string; placeholder?: string }[];
    return fields ? <FormMockup fields={fields} /> : null;
  }
  if (type === 'table') {
    const headers = cfg.headers as string[];
    const rows = cfg.rows as string[][];
    return headers && rows ? <TableMockup headers={headers} rows={rows} /> : null;
  }
  if (type === 'chart') {
    const items = cfg.items as { label: string; value: number }[];
    const label = cfg.label as string | undefined;
    return items ? <BarChartSimple label={label} items={items} /> : null;
  }
  if (type === 'modal') {
    const title = cfg.title as string;
    const body = cfg.body as string | undefined;
    const buttons = cfg.buttons as string[];
    return title && buttons ? <ModalMockup title={title} body={body} buttons={buttons} /> : null;
  }
  if (type === 'settings') {
    const sections = cfg.sections as { title: string; items: { label: string; value: string }[] }[];
    return sections ? <SettingsSections sections={sections} /> : null;
  }
  if (type === 'live') {
    const status = cfg.status as string;
    const label = cfg.label as string;
    const metrics = cfg.metrics as { label: string; value: string }[];
    return status && metrics ? <LiveStatus status={status} label={label} metrics={metrics} /> : null;
  }
  return <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ept-text-muted)', fontSize: 12 }}>Interactive illustration</div>;
}

// ── Tutorial step viewer ──

function TutorialViewer({ tutorial, progress, onProgress }: { tutorial: Tutorial; progress: Record<string, number[]>; onProgress: (p: Record<string, number[]>) => void }) {
  const [step, setStep] = useState(0);
  const current = tutorial.steps[step];
  const completed = progress[tutorial.id] || [];
  const isStepDone = completed.includes(step);
  const allDone = completed.length >= tutorial.steps.length;

  function markDone() {
    const next = { ...progress };
    if (!next[tutorial.id]) next[tutorial.id] = [];
    if (!next[tutorial.id].includes(step)) next[tutorial.id] = [...next[tutorial.id], step];
    onProgress(next);
    saveProgress(next);
    if (step < tutorial.steps.length - 1) setStep(step + 1);
  }

  return (
    <div>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {tutorial.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 700,
              backgroundColor: i === step ? GOLD : completed.includes(i) ? GREEN : 'var(--ept-surface)',
              color: i === step || completed.includes(i) ? '#fff' : 'var(--ept-text-muted)',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {completed.includes(i) && i !== step ? '\u2713' : i + 1}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div style={{ borderRadius: 12, border: '1px solid var(--ept-border)', overflow: 'hidden', backgroundColor: 'var(--ept-card-bg)' }}>
        {/* Step header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
          <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>
            Step {step + 1} of {tutorial.steps.length}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>{current.title}</h3>
        </div>

        {/* Callout */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ept-border)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: GOLD, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>?</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ept-text-secondary)', margin: 0 }}>{current.callout}</p>
          </div>
        </div>

        {/* Illustration area */}
        <div style={{ padding: '16px 20px' }}>
          <StepIllustration step={current} />
        </div>

        {/* Example value */}
        {current.exampleValue && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: 'var(--ept-surface)', border: '1px dashed var(--ept-border)' }}>
              <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Example: </span>
              <span style={{ fontSize: 13, color: GOLD, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{current.exampleValue}</span>
            </div>
          </div>
        )}

        {/* Target hint */}
        {current.target && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--ept-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{'\uD83C\uDFAF'}</span>
              <span>Find this at: <strong style={{ color: 'var(--ept-text-secondary)' }}>{current.target}</strong></span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)', fontSize: 12, fontWeight: 600, cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.4 : 1 }}
          >
            \u2190 Previous
          </button>
          <button
            onClick={markDone}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: isStepDone ? GREEN : GOLD, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            {isStepDone ? '\u2713 Done' : step === tutorial.steps.length - 1 ? 'Complete Tutorial' : 'Got it \u2014 Next \u2192'}
          </button>
        </div>
      </div>

      {/* Completion banner */}
      {allDone && (
        <div style={{ marginTop: 16, padding: '16px 20px', borderRadius: 12, backgroundColor: `${GREEN}20`, border: `1px solid ${GREEN}50`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{'\uD83C\uDF89'}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Tutorial Complete!</div>
            <div style={{ fontSize: 12, color: 'var(--ept-text-secondary)' }}>You&apos;ve completed all {tutorial.steps.length} steps in &quot;{tutorial.title}&quot;</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function BuilderTutorialPage() {
  const { isDark } = useTheme();
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [showQuickRef, setShowQuickRef] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const tutorial = TUTORIALS.find(t => t.id === selectedTutorial);
  const totalSteps = TUTORIALS.reduce((sum, t) => sum + t.steps.length, 0);
  const completedSteps = Object.values(progress).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" style={{ height: 32, width: 'auto', mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--ept-border)' }} />
          <Link href="/websites" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Websites
          </Link>
          <span style={{ color: 'var(--ept-text-muted)', fontSize: 12 }}>/</span>
          <Link href="/websites/builder" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Builder
          </Link>
          <span style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>/ Tutorial</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/websites/builder" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: GOLD, color: '#fff', textDecoration: 'none' }}>
            Open Builder \u2192
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero + tutorial list view */}
        {!selectedTutorial && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
                Learn the Website Builder
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
                Step-by-step tutorials covering all 16 features &mdash; from AI generation to publishing.
                No coding experience required.
              </p>
              {completedSteps > 0 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div style={{ width: 200, height: 6, borderRadius: 3, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
                    <div style={{ width: `${(completedSteps / totalSteps) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: GREEN, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-muted)' }}>{completedSteps} / {totalSteps} steps</span>
                </div>
              )}
            </div>

            {/* Quick Reference accordion */}
            <div className="mb-8">
              <button
                onClick={() => setShowQuickRef(!showQuickRef)}
                className="w-full text-left p-4 rounded-xl border"
                style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 20 }}>\u26A1</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>Quick Reference</div>
                      <div style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>Common builder actions at a glance &mdash; {QUICK_REFERENCE.length} entries</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, color: 'var(--ept-text-muted)', transform: showQuickRef ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>\u25BC</span>
                </div>
              </button>
              {showQuickRef && (
                <div className="mt-2 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
                    {['Action', 'Where', 'How To'].map(h => (
                      <div key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
                    ))}
                  </div>
                  {QUICK_REFERENCE.map((ref, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: i < QUICK_REFERENCE.length - 1 ? '1px solid var(--ept-border)' : 'none' }}>
                      <div style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{ref.action}</div>
                      <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--ept-text-secondary)' }}>{ref.where}</div>
                      <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--ept-text-muted)' }}>{ref.howTo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New user CTA */}
            {completedSteps === 0 && (
              <div className="mb-8 p-5 rounded-xl border" style={{ borderColor: GOLD, backgroundColor: GOLD_DIM }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: 20 }}>{'\uD83D\uDE80'}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>New to the Builder? Start here.</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                  Start with Tutorial 1 for a 3-minute overview of the builder layout,
                  or jump straight to the Full Workflow for a guided build from start to publish.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setSelectedTutorial('welcome')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: GOLD, color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Start Tutorial 1 \u2192
                  </button>
                  <button
                    onClick={() => setSelectedTutorial('full-workflow')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border"
                    style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer' }}
                  >
                    Jump to Full Workflow
                  </button>
                </div>
              </div>
            )}

            {/* Tutorial grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TUTORIALS.map((t, i) => {
                const done = isTutorialComplete(t.id, t.steps.length, progress);
                const stepsDone = progress[t.id]?.length || 0;
                const isWorkflow = t.id === 'full-workflow';
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTutorial(t.id)}
                    className={`text-left p-5 rounded-xl border transition-all ${isWorkflow ? 'md:col-span-2' : ''}`}
                    style={{
                      borderColor: done ? GREEN : 'var(--ept-border)',
                      backgroundColor: 'var(--ept-card-bg)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {done && (
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', backgroundColor: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>\u2713</div>
                    )}
                    <div className="flex items-start gap-4">
                      <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--ept-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)' }}>TUTORIAL {i + 1}</span>
                          <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>\u00B7 {t.steps.length} steps \u00B7 ~{t.estimatedMinutes} min</span>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 4 }}>{t.title}</h3>
                        <p style={{ fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.5, marginBottom: stepsDone > 0 ? 8 : 0 }}>{t.subtitle}</p>
                        {stepsDone > 0 && !done && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, maxWidth: 120, height: 4, borderRadius: 2, backgroundColor: 'var(--ept-surface)', overflow: 'hidden' }}>
                              <div style={{ width: `${(stepsDone / t.steps.length) * 100}%`, height: '100%', borderRadius: 2, backgroundColor: GOLD }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{stepsDone}/{t.steps.length}</span>
                          </div>
                        )}
                        {t.route && (
                          <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                            Page: {t.route}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 text-center">
              <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', marginBottom: 12 }}>
                Need help? The <strong style={{ color: GOLD }}>?</strong> button is always available inside the builder.
              </p>
              <Link href="/websites/builder" className="inline-block px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: GOLD, color: '#fff', textDecoration: 'none' }}>
                Open Website Builder \u2192
              </Link>
            </div>
          </>
        )}

        {/* Tutorial detail view */}
        {tutorial && (
          <div>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="mb-6 flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              \u2190 Back to all tutorials
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'var(--ept-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{tutorial.icon}</div>
              <div>
                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{tutorial.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--ept-text-secondary)' }}>{tutorial.subtitle} \u00B7 {tutorial.steps.length} steps \u00B7 ~{tutorial.estimatedMinutes} min</p>
              </div>
            </div>

            {tutorial.route && (
              <div className="mb-6 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>This tutorial covers the</span>
                <Link href={tutorial.route} style={{ fontSize: 12, fontWeight: 600, color: GOLD, fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}>{tutorial.route}</Link>
                <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>page</span>
              </div>
            )}

            <TutorialViewer tutorial={tutorial} progress={progress} onProgress={setProgress} />

            {/* Cross-links for full-workflow */}
            {tutorial.id === 'full-workflow' && (
              <div className="mt-8">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Detailed Tutorials</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {TUTORIALS.filter(t => t.id !== 'full-workflow' && t.id !== 'welcome').map(t => {
                    const done = isTutorialComplete(t.id, t.steps.length, progress);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTutorial(t.id)}
                        className="p-3 rounded-lg border text-left"
                        style={{ borderColor: done ? GREEN : 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: 14 }}>{t.icon}</span>
                          {done && <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>\u2713</span>}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)' }}>{t.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--ept-text-muted)' }}>{t.steps.length} steps</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
