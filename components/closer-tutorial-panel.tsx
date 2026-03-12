'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { TUTORIALS, QUICK_REFERENCE, CONTEXT_TRIGGERS, type Tutorial, type TutorialStep } from '../lib/closer-tutorial-data';
import { useGuidedTutorial } from '../lib/guided-tutorial-context';
import { getAvailableGuidedTutorials } from '../lib/guided-steps';

// ─── localStorage helpers ───
const STORAGE_KEY = 'closer_tutorial_progress';
const DISMISSED_KEY = 'closer_tutorial_dismissed';
const CONTEXT_SEEN_KEY = 'closer_context_seen';

function getProgress(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, number[]>) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function getContextSeen(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CONTEXT_SEEN_KEY) || '[]'); } catch { return []; }
}
function saveContextSeen(s: string[]) {
  if (typeof window !== 'undefined') localStorage.setItem(CONTEXT_SEEN_KEY, JSON.stringify(s));
}

// ─── Illustration Renderers ───
function IllFrame({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--ept-border)', marginBottom: 8 }}>
      <div style={{ padding: '12px 14px', backgroundColor: 'var(--ept-surface)', minHeight: 80 }}>{children}</div>
      {caption && <div style={{ padding: '6px 14px', fontSize: 11, color: 'var(--ept-text-muted)', borderTop: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>{caption}</div>}
    </div>
  );
}

function KpiRow({ kpis }: { kpis: { label: string; value: string; color?: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(kpis.length, 5)}, 1fr)`, gap: 6 }}>
      {kpis.map((k, i) => (
        <div key={i} style={{ padding: '6px 8px', borderRadius: 6, backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: k.color || 'var(--ept-text)', marginTop: 2 }}>{k.value}</div>
        </div>
      ))}
    </div>
  );
}

function FlowDiagram({ steps }: { steps: { label: string; icon: string; desc: string; color?: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ textAlign: 'center', padding: '8px 6px', borderRadius: 8, backgroundColor: 'var(--ept-card-bg)', border: `1px solid ${s.color || 'var(--ept-border)'}`, minWidth: 56 }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ept-text)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 7, color: 'var(--ept-text-muted)', marginTop: 1 }}>{s.desc}</div>
          </div>
          {i < steps.length - 1 && <div style={{ color: 'var(--ept-text-muted)', fontSize: 14 }}>→</div>}
        </div>
      ))}
    </div>
  );
}

function FormMockup({ fields, highlight, addButton }: { fields: { label: string; value: string; type: string; required?: boolean }[]; highlight?: number; addButton?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {fields.map((f, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--ept-text-secondary)', marginBottom: 2 }}>
            {f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}
          </div>
          <div style={{
            padding: '5px 8px', borderRadius: 6, fontSize: 10, color: 'var(--ept-text)',
            backgroundColor: 'var(--ept-surface)', border: `1.5px solid ${highlight === i ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
            minHeight: f.type === 'textarea' ? 40 : 'auto', whiteSpace: f.type === 'textarea' ? 'pre-wrap' : 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {f.value}
            {highlight === i && <span style={{ display: 'inline-block', width: 1, height: 12, backgroundColor: 'var(--ept-accent)', marginLeft: 2, animation: 'blink 1s infinite' }} />}
          </div>
        </div>
      ))}
      {addButton && (
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, color: 'var(--ept-accent)', border: '1px dashed var(--ept-accent)', textAlign: 'center', cursor: 'pointer' }}>
          {addButton}
        </div>
      )}
    </div>
  );
}

function TableMockup({ headers, rows, filterLabel, highlightLast }: { headers: string[]; rows: string[][]; filterLabel?: string; highlightLast?: boolean }) {
  return (
    <div>
      {filterLabel && (
        <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)', marginBottom: 6, backgroundColor: 'var(--ept-card-bg)' }}>
          {filterLabel} ▾
        </div>
      )}
      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--ept-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, backgroundColor: 'var(--ept-surface)', borderBottom: '1px solid var(--ept-border)' }}>
          {headers.map((h, i) => <div key={i} style={{ padding: '4px 6px', fontSize: 8, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase' }}>{h}</div>)}
        </div>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, 1fr)`, borderBottom: ri < rows.length - 1 ? '1px solid var(--ept-border)' : 'none', backgroundColor: highlightLast && ri === rows.length - 1 ? 'rgba(16,185,129,0.08)' : 'var(--ept-card-bg)' }}>
            {row.map((c, ci) => <div key={ci} style={{ padding: '4px 6px', fontSize: 9, color: 'var(--ept-text)', fontWeight: highlightLast && ri === rows.length - 1 ? 700 : 400 }}>{c}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalMockup({ title, items, actionButton }: { title: string; items?: { name: string; checked: boolean }[]; actionButton?: string }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden' }}>
      <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)' }}>{title}</div>
      </div>
      {items && (
        <div style={{ padding: '6px 10px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', fontSize: 9, color: 'var(--ept-text)' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${it.checked ? 'var(--ept-accent)' : 'var(--ept-border)'}`, backgroundColor: it.checked ? 'var(--ept-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, flexShrink: 0 }}>
                {it.checked && '✓'}
              </div>
              {it.name}
            </div>
          ))}
        </div>
      )}
      {actionButton && (
        <div style={{ padding: '6px 10px', borderTop: '1px solid var(--ept-border)' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, fontSize: 9, fontWeight: 600, backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{actionButton}</div>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ height: Math.max(4, (d.value / max) * 44), backgroundColor: d.color, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
          <div style={{ fontSize: 7, color: 'var(--ept-text-muted)', marginTop: 2 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function ComparisonChart({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((it, i) => (
        <div key={i} style={{ textAlign: 'center', padding: '10px 16px', borderRadius: 8, border: `2px solid ${it.color}`, backgroundColor: 'var(--ept-card-bg)', minWidth: 80 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: it.color }}>{it.value}</div>
          <div style={{ fontSize: 9, color: 'var(--ept-text-secondary)', marginTop: 2 }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function LiveCallMockup({ calls }: { calls: { name: string; duration: string; status: string; transcript: string }[] }) {
  return (
    <div>
      {calls.map((c, i) => (
        <div key={i} style={{ borderRadius: 8, border: '1px solid #10b981', backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden' }}>
          <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--ept-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text)' }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>{c.duration}</span>
          </div>
          <div style={{ padding: '8px 10px', fontSize: 9, color: 'var(--ept-text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
            {c.transcript}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationMockup({ message, icon }: { message: string; icon: string }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 8, border: '2px solid #10b981', backgroundColor: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)', lineHeight: 1.3 }}>{message}</div>
    </div>
  );
}

function SettingsMockup({ config }: { config: Record<string, unknown> }) {
  const type = config.type as string;
  if (type === 'toggle') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text)' }}>{config.label as string}</div>
          <div style={{ fontSize: 8, color: config.enabled ? '#10b981' : 'var(--ept-text-muted)', marginTop: 1 }}>{config.desc as string}</div>
        </div>
        <div style={{ width: 32, height: 18, borderRadius: 9, backgroundColor: config.enabled ? (config.color as string || '#10b981') : '#64748b', position: 'relative', transition: 'background-color 0.2s' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: config.enabled ? 16 : 2, transition: 'left 0.2s' }} />
        </div>
      </div>
    );
  }
  if (type === 'voice-picker') {
    const voices = config.voices as { name: string; desc: string; selected: boolean }[];
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {voices.map((v, i) => (
          <div key={i} style={{ padding: '6px 10px', borderRadius: 6, border: `1.5px solid ${v.selected ? 'var(--ept-accent)' : 'var(--ept-border)'}`, backgroundColor: v.selected ? 'rgba(20,184,166,0.08)' : 'var(--ept-card-bg)', cursor: 'pointer', textAlign: 'center', flex: 1, minWidth: 70 }}>
            <div style={{ fontSize: 10, fontWeight: v.selected ? 700 : 400, color: 'var(--ept-text)' }}>{v.name}</div>
            <div style={{ fontSize: 8, color: 'var(--ept-text-muted)' }}>{v.desc}</div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'personality') {
    const opts = config.options as string[];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {opts.map((o, i) => (
          <div key={i} style={{ padding: '5px 10px', borderRadius: 6, fontSize: 9, border: `1.5px solid ${o === config.selected ? 'var(--ept-accent)' : 'var(--ept-border)'}`, backgroundColor: o === config.selected ? 'rgba(20,184,166,0.08)' : 'var(--ept-card-bg)', color: 'var(--ept-text)', fontWeight: o === config.selected ? 600 : 400, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${o === config.selected ? 'var(--ept-accent)' : 'var(--ept-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {o === config.selected && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ept-accent)' }} />}
            </div>
            {o}
          </div>
        ))}
      </div>
    );
  }
  if (type === 'hours-grid') {
    const h = config.highlighted as { days: string[]; start: string; end: string };
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <div style={{ display: 'flex', gap: 3 }}>
        {allDays.map(d => (
          <div key={d} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--ept-text-muted)', marginBottom: 3 }}>{d}</div>
            <div style={{ height: 28, borderRadius: 4, backgroundColor: h.days.includes(d) ? 'rgba(16,185,129,0.3)' : 'var(--ept-surface)', border: `1px solid ${h.days.includes(d) ? '#10b981' : 'var(--ept-border)'}` }} />
            {h.days.includes(d) && <div style={{ fontSize: 6, color: '#10b981', marginTop: 1 }}>{h.start.replace(':00', '')}</div>}
          </div>
        ))}
      </div>
    );
  }
  if (type === 'filters') {
    const filters = config.filters as { label: string; value: string }[];
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {filters.map((f, i) => (
          <div key={i} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 9, border: '1px solid var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'rgba(20,184,166,0.08)' }}>
            {f.label}: {f.value} ▾
          </div>
        ))}
      </div>
    );
  }
  if (type === 'integration') {
    const opts = config.options as string[];
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {opts.map((o, i) => (
          <div key={i} style={{ padding: '6px 10px', borderRadius: 6, border: `1.5px solid ${o === config.connected ? '#10b981' : 'var(--ept-border)'}`, backgroundColor: o === config.connected ? 'rgba(16,185,129,0.08)' : 'var(--ept-card-bg)', fontSize: 9, color: 'var(--ept-text)', textAlign: 'center', flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{o}</div>
            {o === config.connected && <div style={{ fontSize: 7, color: '#10b981', marginTop: 2 }}>Connected ✓</div>}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function StepIllustration({ step }: { step: TutorialStep }) {
  const cfg = step.illustrationConfig;
  switch (step.illustrationType) {
    case 'dashboard': {
      const type = cfg.type as string;
      if (type === 'hero' || (!type && cfg.kpis)) return <KpiRow kpis={cfg.kpis as { label: string; value: string; color?: string }[]} />;
      if (type === 'button-highlight') return (
        <div style={{ padding: 8, borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: cfg.position === 'top-right' ? 'flex-end' : 'center', marginBottom: 8 }}>
            <div style={{ padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--ept-accent)', color: '#fff', boxShadow: '0 0 12px rgba(20,184,166,0.4)' }}>{cfg.buttonText as string}</div>
          </div>
          {cfg.context ? <div style={{ fontSize: 9, color: 'var(--ept-text-secondary)', textAlign: 'center' }}>{String(cfg.context)}</div> : null}
        </div>
      );
      if (type === 'notification') return <NotificationMockup message={cfg.message as string} icon={cfg.icon as string} />;
      if (type === 'detail') return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(cfg.sections as string[]).map((s, i) => (
            <div key={i} style={{ padding: '5px 10px', borderRadius: 4, fontSize: 9, border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-card-bg)' }}>{s}</div>
          ))}
        </div>
      );
      return null;
    }
    case 'flow': return <FlowDiagram steps={cfg.steps as { label: string; icon: string; desc: string; color?: string }[]} />;
    case 'form': return <FormMockup fields={cfg.fields as { label: string; value: string; type: string; required?: boolean }[]} highlight={cfg.highlight as number | undefined} addButton={cfg.addButton as string | undefined} />;
    case 'table': return <TableMockup headers={cfg.headers as string[]} rows={cfg.rows as string[][]} filterLabel={cfg.filterLabel as string | undefined} highlightLast={cfg.highlightLast as boolean | undefined} />;
    case 'modal': return <ModalMockup title={cfg.title as string} items={cfg.items as { name: string; checked: boolean }[] | undefined} actionButton={cfg.actionButton as string | undefined} />;
    case 'chart': {
      const type = cfg.type as string;
      if (type === 'bar') return <BarChart data={cfg.data as { label: string; value: number; color: string }[]} />;
      if (type === 'comparison') return <ComparisonChart items={cfg.items as { label: string; value: string; color: string }[]} />;
      if (cfg.metrics) return <KpiRow kpis={(cfg.metrics as { label: string; value: string; trend: string }[]).map(m => ({ label: m.label, value: m.value, color: m.trend.startsWith('+') ? '#10b981' : '#ef4444' }))} />;
      return null;
    }
    case 'settings': return <SettingsMockup config={cfg} />;
    case 'live': return <LiveCallMockup calls={cfg.activeCalls as { name: string; duration: string; status: string; transcript: string }[]} />;
    default: return null;
  }
}

// ─── Main Component ───
const GUIDED_TUTORIALS = getAvailableGuidedTutorials();

export default function CloserTutorialPanel() {
  const pathname = usePathname();
  const { startGuided, active: guidedActive } = useGuidedTutorial();
  const [open, setOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [view, setView] = useState<'list' | 'quickref' | 'tutorial'>('list');
  const [lightboxStep, setLightboxStep] = useState<TutorialStep | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load progress
  useEffect(() => { setProgress(getProgress()); }, []);

  // Context triggers — auto-open on first visit
  useEffect(() => {
    if (!pathname || open) return;
    const trigger = CONTEXT_TRIGGERS[pathname];
    if (!trigger) return;
    const seen = getContextSeen();
    if (seen.includes(pathname)) return;
    // Auto-open after short delay
    const t = setTimeout(() => {
      const tut = TUTORIALS.find(t => t.id === trigger.tutorialId);
      if (tut) {
        setSelectedTutorial(tut);
        setCurrentStep(trigger.stepIndex);
        setView('tutorial');
        setOpen(true);
        saveContextSeen([...seen, pathname]);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [pathname, open]);

  // Keyboard nav
  useEffect(() => {
    if (!open || view !== 'tutorial' || !selectedTutorial) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentStep(s => Math.min(s + 1, selectedTutorial.steps.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentStep(s => Math.max(s - 1, 0));
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, view, selectedTutorial]);

  const markStepComplete = useCallback((tutId: string, stepIdx: number) => {
    setProgress(prev => {
      const next = { ...prev };
      if (!next[tutId]) next[tutId] = [];
      if (!next[tutId].includes(stepIdx)) next[tutId] = [...next[tutId], stepIdx];
      saveProgress(next);
      return next;
    });
  }, []);

  const isTutorialComplete = (tutId: string) => {
    const tut = TUTORIALS.find(t => t.id === tutId);
    if (!tut) return false;
    const done = progress[tutId] || [];
    return done.length >= tut.steps.length;
  };

  const goNext = () => {
    if (!selectedTutorial) return;
    markStepComplete(selectedTutorial.id, currentStep);
    if (currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const goPrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const openTutorial = (tut: Tutorial, step = 0) => {
    setSelectedTutorial(tut);
    setCurrentStep(step);
    setView('tutorial');
  };

  const step = selectedTutorial?.steps[currentStep];

  return (
    <>
      {/* Floating ? Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Tutorials & Help"
          style={{
            position: 'fixed', right: 16, bottom: 80, zIndex: 9998,
            width: 44, height: 44, borderRadius: '50%',
            backgroundColor: 'var(--ept-accent)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(20,184,166,0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ?
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: isMobile ? '100%' : 380,
            zIndex: 9999, backgroundColor: 'var(--ept-bg)',
            borderLeft: '1px solid var(--ept-border)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
            animation: isMobile ? 'slideUp 0.25s ease-out' : 'slideIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ept-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ept-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {view === 'tutorial' && (
                <button onClick={() => { setView('list'); setSelectedTutorial(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ept-text-secondary)', padding: 0 }}>←</button>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>
                {view === 'tutorial' && selectedTutorial ? selectedTutorial.title : 'Closer AI Tutorials'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ept-text-muted)', padding: '0 4px' }}>×</button>
          </div>

          {/* Tab Bar */}
          {view !== 'tutorial' && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--ept-border)' }}>
              {(['list', 'quickref'] as const).map(tab => (
                <button key={tab} onClick={() => setView(tab)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: view === tab ? 700 : 400,
                  color: view === tab ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  borderBottom: view === tab ? '2px solid var(--ept-accent)' : '2px solid transparent',
                  backgroundColor: 'transparent', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid',
                  cursor: 'pointer',
                }}>
                  {tab === 'list' ? 'Tutorials' : 'Quick Reference'}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {/* Tutorial List */}
            {view === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TUTORIALS.map(tut => {
                  const done = progress[tut.id] || [];
                  const total = tut.steps.length;
                  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
                  const complete = isTutorialComplete(tut.id);
                  return (
                    <button
                      key={tut.id}
                      onClick={() => openTutorial(tut)}
                      style={{
                        padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                        border: `1px solid ${complete ? '#10b981' : 'var(--ept-border)'}`,
                        backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{tut.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text)' }}>{tut.title}</div>
                            <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 1 }}>{tut.subtitle}</div>
                          </div>
                        </div>
                        {complete && <span style={{ fontSize: 14, color: '#10b981' }}>✓</span>}
                      </div>
                      <div style={{ marginTop: 8, height: 3, borderRadius: 2, backgroundColor: 'var(--ept-surface)' }}>
                        <div style={{ height: '100%', borderRadius: 2, backgroundColor: complete ? '#10b981' : 'var(--ept-accent)', width: `${pct}%`, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{done.length}/{total} steps</span>
                        {GUIDED_TUTORIALS.includes(tut.id) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpen(false); startGuided(tut.id); }}
                            disabled={guidedActive}
                            style={{
                              padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                              border: 'none', backgroundColor: 'var(--ept-accent)', color: '#fff',
                              cursor: guidedActive ? 'not-allowed' : 'pointer',
                              opacity: guidedActive ? 0.5 : 1,
                            }}
                          >
                            Interactive
                          </button>
                        )}
                        <span>{tut.estimatedMinutes} min</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Reference */}
            {view === 'quickref' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_REFERENCE.map((qr, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ept-text)' }}>{qr.action}</div>
                    <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginTop: 2 }}>
                      <strong>{qr.where}</strong> → {qr.howTo}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tutorial Steps */}
            {view === 'tutorial' && selectedTutorial && step && (
              <div>
                {/* Step dots */}
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 14 }}>
                  {selectedTutorial.steps.map((_, i) => {
                    const isComplete = (progress[selectedTutorial.id] || []).includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        style={{
                          width: i === currentStep ? 20 : 8, height: 8, borderRadius: 4,
                          backgroundColor: i === currentStep ? 'var(--ept-accent)' : isComplete ? '#10b981' : 'var(--ept-surface)',
                          border: `1px solid ${i === currentStep ? 'var(--ept-accent)' : isComplete ? '#10b981' : 'var(--ept-border)'}`,
                          cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Step counter */}
                <div style={{ fontSize: 10, color: 'var(--ept-text-muted)', textAlign: 'center', marginBottom: 12 }}>
                  Step {currentStep + 1} of {selectedTutorial.steps.length}
                </div>

                {/* Step title */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)', margin: '0 0 8px' }}>{step.title}</h3>

                {/* Illustration (tap to enlarge) */}
                <div onClick={() => setLightboxStep(step)} style={{ cursor: 'zoom-in' }} title="Tap to enlarge">
                  <IllFrame>
                    <StepIllustration step={step} />
                  </IllFrame>
                </div>

                {/* Callout */}
                <div style={{
                  padding: '10px 14px', borderRadius: 8, marginTop: 10,
                  backgroundColor: 'rgba(20,184,166,0.06)',
                  borderLeft: '3px solid var(--ept-accent)',
                }}>
                  <div style={{ fontSize: 12, color: 'var(--ept-text)', lineHeight: 1.5 }}>{step.callout}</div>
                </div>

                {/* Example value */}
                {step.exampleValue && (
                  <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                    <div style={{ fontSize: 9, color: 'var(--ept-text-muted)', marginBottom: 2 }}>Example:</div>
                    <div style={{ fontSize: 11, color: 'var(--ept-text)', fontFamily: 'monospace' }}>{step.exampleValue}</div>
                  </div>
                )}

                {/* Go to page link */}
                {step.target && (
                  <a
                    href={step.target}
                    style={{
                      display: 'block', marginTop: 8, padding: '6px 10px', borderRadius: 6,
                      fontSize: 10, color: 'var(--ept-accent)', textDecoration: 'none', textAlign: 'center',
                      border: '1px solid var(--ept-accent)', backgroundColor: 'rgba(20,184,166,0.06)',
                    }}
                  >
                    Go to this page →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer nav */}
          {view === 'tutorial' && selectedTutorial && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ept-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--ept-card-bg)' }}>
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                style={{
                  padding: '6px 16px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-card-bg)',
                  color: currentStep === 0 ? 'var(--ept-text-muted)' : 'var(--ept-text)',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>
              <button
                onClick={goNext}
                style={{
                  padding: '6px 16px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  border: 'none',
                  backgroundColor: currentStep === selectedTutorial.steps.length - 1 ? '#10b981' : 'var(--ept-accent)',
                  color: '#fff', cursor: 'pointer',
                }}
              >
                {currentStep === selectedTutorial.steps.length - 1 ? 'Complete ✓' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxStep && (
        <div
          onClick={() => setLightboxStep(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 600, maxHeight: '80vh',
              overflowY: 'auto', borderRadius: 16,
              backgroundColor: 'var(--ept-bg)',
              border: '1px solid var(--ept-border)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              cursor: 'default',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ept-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)' }}>{lightboxStep.title}</div>
              <button onClick={() => setLightboxStep(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--ept-text-muted)', cursor: 'pointer', padding: '0 4px' }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <StepIllustration step={lightboxStep} />
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--ept-border)' }}>
              <div style={{ fontSize: 12, color: 'var(--ept-text-secondary)', lineHeight: 1.5 }}>{lightboxStep.callout}</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(380px); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </>
  );
}
