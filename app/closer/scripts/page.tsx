'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { getScripts, createScript, updateScript, generateScripts } from '../../../lib/closer-api';

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

/* Visual builder step type */
interface VisualStep {
  key: string;       /* internal key e.g. GREETING */
  name: string;      /* display name e.g. "Greeting" */
  prompt: string;    /* AI instructions */
  transitions: { label: string; target: string }[];
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

const PERSONALITY_PRESETS = [
  { label: 'Friendly Professional', value: 'You are a warm, professional sales agent. Be empathetic, listen actively, and guide the conversation naturally. Never be pushy or aggressive. Use the prospect\'s name when possible.' },
  { label: 'Consultative Expert', value: 'You are a knowledgeable consultant who asks thoughtful questions to understand needs. Focus on solving problems rather than selling. Build trust through expertise and genuine interest.' },
  { label: 'High-Energy Closer', value: 'You are an enthusiastic, confident sales professional. Be positive and energetic while remaining respectful. Create urgency naturally and always drive toward the next step.' },
  { label: 'Custom', value: '' },
];

const DEFAULT_STEPS: VisualStep[] = [
  {
    key: 'GREETING',
    name: 'Greeting',
    prompt: 'Introduce yourself warmly, state who you are and why you are calling. Ask if now is a good time to talk briefly.',
    transitions: [
      { label: 'Prospect is interested', target: 'CONSENT_CHECK' },
      { label: 'Prospect objects', target: 'OBJECTION_HANDLE' },
    ],
  },
  {
    key: 'CONSENT_CHECK',
    name: 'Consent Check',
    prompt: 'Verify the prospect consents to continue the conversation. Explain briefly what the call is about and how it can benefit them.',
    transitions: [
      { label: 'Consented', target: 'DISCOVERY' },
      { label: 'Refused', target: 'WRAP_UP' },
    ],
  },
  {
    key: 'DISCOVERY',
    name: 'Discovery Questions',
    prompt: 'Ask open-ended qualifying questions to understand their needs, pain points, and current situation. Listen carefully and take notes.',
    transitions: [
      { label: 'Qualified prospect', target: 'QUALIFICATION' },
      { label: 'Not a good fit', target: 'WRAP_UP' },
    ],
  },
  {
    key: 'QUALIFICATION',
    name: 'Qualification',
    prompt: 'Confirm budget, timeline, and decision-making authority. Summarize what you have learned and connect it to your solution.',
    transitions: [
      { label: 'Ready to book', target: 'BOOKING' },
      { label: 'Needs more nurturing', target: 'WRAP_UP' },
    ],
  },
  {
    key: 'BOOKING',
    name: 'Book Appointment',
    prompt: 'Offer specific appointment times. Confirm the date, time, and what will be discussed. Get their email for a calendar invite.',
    transitions: [
      { label: 'Appointment booked', target: 'WRAP_UP' },
      { label: 'Declined booking', target: 'OBJECTION_HANDLE' },
    ],
  },
  {
    key: 'OBJECTION_HANDLE',
    name: 'Objection Handling',
    prompt: 'Address their concerns empathetically. Acknowledge their objection, ask clarifying questions, and provide relevant information to overcome it.',
    transitions: [
      { label: 'Objection resolved', target: 'DISCOVERY' },
      { label: 'Firm no', target: 'WRAP_UP' },
    ],
  },
  {
    key: 'WRAP_UP',
    name: 'Wrap Up',
    prompt: 'Thank them for their time. If an appointment was booked, confirm the details. If not, leave the door open for future contact. End professionally.',
    transitions: [],
  },
];

/* ──────────────────── Helpers ──────────────────── */

function formatLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseStates(states: Record<string, ScriptState> | string): Record<string, ScriptState> {
  if (typeof states === 'string') {
    try { return JSON.parse(states); } catch { return {}; }
  }
  return states || {};
}

function getStateNames(states: Record<string, ScriptState> | string): string[] {
  return Object.keys(parseStates(states));
}

function nameToKey(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'STEP';
}

function stepsToStates(steps: VisualStep[]): Record<string, ScriptState> {
  const states: Record<string, ScriptState> = {};
  for (const step of steps) {
    const transitions: Record<string, string> = {};
    for (const t of step.transitions) {
      if (t.label.trim() && t.target) {
        const tKey = t.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        transitions[tKey] = t.target;
      }
    }
    states[step.key] = { name: step.name, prompt: step.prompt, transitions };
  }
  return states;
}

function statesToSteps(states: Record<string, ScriptState>): VisualStep[] {
  const keys = Object.keys(states);
  if (keys.length === 0) return [];
  return keys.map((key) => {
    const s = states[key];
    const transitions = Object.entries(s.transitions || {}).map(([label, target]) => ({
      label: label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      target: target as string,
    }));
    return { key, name: s.name || key, prompt: s.prompt || '', transitions };
  });
}

/* ──────────────────── Visual Step Builder Component ──────────────────── */

function StepBuilder({
  steps,
  onChange,
}: {
  steps: VisualStep[];
  onChange: (steps: VisualStep[]) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const updateStep = (idx: number, patch: Partial<VisualStep>) => {
    const next = steps.map((s, i) => {
      if (i !== idx) return s;
      const updated = { ...s, ...patch };
      /* auto-update key when name changes */
      if (patch.name !== undefined) {
        const newKey = nameToKey(patch.name);
        /* update all transitions pointing to old key */
        const oldKey = s.key;
        if (newKey !== oldKey) {
          updated.key = newKey;
          return updated;
        }
      }
      return updated;
    });
    /* if key changed, update all references */
    if (patch.name !== undefined) {
      const oldKey = steps[idx].key;
      const newKey = next[idx].key;
      if (oldKey !== newKey) {
        for (let i = 0; i < next.length; i++) {
          next[i] = {
            ...next[i],
            transitions: next[i].transitions.map((t) => ({
              ...t,
              target: t.target === oldKey ? newKey : t.target,
            })),
          };
        }
      }
    }
    onChange(next);
  };

  const addStep = () => {
    const num = steps.length + 1;
    const newStep: VisualStep = {
      key: `STEP_${num}`,
      name: `Step ${num}`,
      prompt: '',
      transitions: [],
    };
    onChange([...steps, newStep]);
    setExpandedIdx(steps.length);
  };

  const removeStep = (idx: number) => {
    const removedKey = steps[idx].key;
    const next = steps.filter((_, i) => i !== idx).map((s) => ({
      ...s,
      transitions: s.transitions.filter((t) => t.target !== removedKey),
    }));
    onChange(next);
    setExpandedIdx(null);
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
    setExpandedIdx(target);
  };

  const addTransition = (stepIdx: number) => {
    const step = steps[stepIdx];
    updateStep(stepIdx, {
      transitions: [...step.transitions, { label: '', target: '' }],
    });
  };

  const updateTransition = (stepIdx: number, tIdx: number, patch: Partial<{ label: string; target: string }>) => {
    const step = steps[stepIdx];
    const transitions = step.transitions.map((t, i) => (i === tIdx ? { ...t, ...patch } : t));
    updateStep(stepIdx, { transitions });
  };

  const removeTransition = (stepIdx: number, tIdx: number) => {
    const step = steps[stepIdx];
    updateStep(stepIdx, { transitions: step.transitions.filter((_, i) => i !== tIdx) });
  };

  const allKeys = steps.map((s) => s.key);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Conversation Steps ({steps.length})
        </span>
        <button
          onClick={addStep}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600,
            color: '#fff', backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 6, cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Step
        </button>
      </div>

      {steps.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', borderRadius: 10, border: '1px dashed var(--ept-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', margin: 0 }}>
            No steps yet. Click "Add Step" or use a template to get started.
          </p>
        </div>
      )}

      {steps.map((step, idx) => {
        const isOpen = expandedIdx === idx;
        return (
          <div
            key={step.key + idx}
            style={{
              borderRadius: 10,
              border: `1px solid ${isOpen ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
              backgroundColor: 'var(--ept-card-bg)',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Step header — always visible */}
            <div
              onClick={() => setExpandedIdx(isOpen ? null : idx)}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 14px', cursor: 'pointer',
                gap: 10, userSelect: 'none',
              }}
            >
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 700,
                backgroundColor: 'var(--ept-accent)', color: '#fff', flexShrink: 0,
              }}>
                {idx + 1}
              </span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ept-text)' }}>
                {step.name || `Step ${idx + 1}`}
              </span>
              <span style={{ fontSize: 10, color: 'var(--ept-text-muted)', fontWeight: 500 }}>
                {step.transitions.length} transition{step.transitions.length !== 1 ? 's' : ''}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--ept-text-muted)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Step body — expanded */}
            {isOpen && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--ept-border)' }}>
                <div style={{ paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {/* Step Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                      Step Name
                    </label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(idx, { name: e.target.value })}
                      placeholder="e.g., Greeting, Discovery, Booking..."
                      style={{
                        width: '100%', padding: '8px 10px', fontSize: 13, color: 'var(--ept-text)',
                        backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                        borderRadius: 8, outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* AI Instructions */}
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                      AI Instructions
                    </label>
                    <textarea
                      value={step.prompt}
                      onChange={(e) => updateStep(idx, { prompt: e.target.value })}
                      placeholder="Tell the AI what to say and do during this step of the conversation..."
                      rows={3}
                      style={{
                        width: '100%', padding: '8px 10px', fontSize: 13, color: 'var(--ept-text)',
                        backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                        borderRadius: 8, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5,
                      }}
                    />
                    <p style={{ fontSize: 10, color: 'var(--ept-text-muted)', marginTop: 2 }}>
                      Write natural instructions — the AI will follow them during the call.
                    </p>
                  </div>

                  {/* Transitions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        What Happens Next?
                      </label>
                      <button
                        onClick={() => addTransition(idx)}
                        style={{
                          fontSize: 10, fontWeight: 600, color: 'var(--ept-accent)', background: 'none',
                          border: 'none', cursor: 'pointer', padding: '2px 6px',
                        }}
                      >
                        + Add Outcome
                      </button>
                    </div>

                    {step.transitions.length === 0 && (
                      <div style={{
                        padding: 12, borderRadius: 8, border: '1px dashed var(--ept-border)',
                        textAlign: 'center',
                      }}>
                        <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', margin: 0 }}>
                          {idx === steps.length - 1
                            ? 'This is the final step — no transitions needed. (The call ends here.)'
                            : 'Add outcomes to connect this step to the next one. Click "+ Add Outcome" above.'}
                        </p>
                      </div>
                    )}

                    {step.transitions.map((t, tIdx) => (
                      <div
                        key={tIdx}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                          padding: '6px 8px', borderRadius: 8, backgroundColor: 'var(--ept-surface)',
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', whiteSpace: 'nowrap' }}>
                          IF
                        </span>
                        <input
                          type="text"
                          value={t.label}
                          onChange={(e) => updateTransition(idx, tIdx, { label: e.target.value })}
                          placeholder="e.g., Prospect agrees, Says no..."
                          style={{
                            flex: 1, padding: '6px 8px', fontSize: 12, color: 'var(--ept-text)',
                            backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)',
                            borderRadius: 6, outline: 'none', fontFamily: 'inherit',
                          }}
                        />
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', whiteSpace: 'nowrap' }}>
                          GO TO
                        </span>
                        <select
                          value={t.target}
                          onChange={(e) => updateTransition(idx, tIdx, { target: e.target.value })}
                          style={{
                            width: 160, padding: '6px 8px', fontSize: 12, color: 'var(--ept-text)',
                            backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)',
                            borderRadius: 6, outline: 'none',
                          }}
                        >
                          <option value="">— Select step —</option>
                          {allKeys.filter((k) => k !== step.key).map((k) => {
                            const targetStep = steps.find((s) => s.key === k);
                            return (
                              <option key={k} value={k}>
                                {targetStep?.name || k}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          onClick={() => removeTransition(idx, tIdx)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 24, height: 24, borderRadius: 6, border: 'none',
                            backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444',
                            cursor: 'pointer', flexShrink: 0,
                          }}
                          title="Remove outcome"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--ept-border)', paddingTop: 10 }}>
                  <button
                    onClick={() => moveStep(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6,
                      border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)',
                      color: idx === 0 ? 'var(--ept-text-muted)' : 'var(--ept-text-secondary)',
                      cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.4 : 1,
                    }}
                  >
                    ↑ Move Up
                  </button>
                  <button
                    onClick={() => moveStep(idx, 1)}
                    disabled={idx === steps.length - 1}
                    style={{
                      padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6,
                      border: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)',
                      color: idx === steps.length - 1 ? 'var(--ept-text-muted)' : 'var(--ept-text-secondary)',
                      cursor: idx === steps.length - 1 ? 'default' : 'pointer', opacity: idx === steps.length - 1 ? 0.4 : 1,
                    }}
                  >
                    ↓ Move Down
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => removeStep(idx)}
                    style={{
                      padding: '4px 8px', fontSize: 10, fontWeight: 600, borderRadius: 6,
                      border: '1px solid rgba(239,68,68,0.25)', backgroundColor: 'rgba(239,68,68,0.06)',
                      color: '#ef4444', cursor: 'pointer',
                    }}
                  >
                    Delete Step
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────── Upload Zone ──────────────────── */

type UploadStatus = 'idle' | 'reading' | 'generating' | 'done' | 'error';

function ScriptUploadZone({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<{ total: number; scripts: Array<{ name: string }> } | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function extractText(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'txt') {
      return file.text();
    }

    if (ext === 'pdf') {
      setProgress('Extracting text from PDF...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      // Use bundled worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(' ');
        pages.push(text);
      }
      return pages.join('\n\n');
    }

    if (ext === 'docx' || ext === 'doc') {
      setProgress('Extracting text from document...');
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    throw new Error(`Unsupported file type: .${ext}`);
  }

  async function handleFile(file: File) {
    const allowed = ['pdf', 'docx', 'doc', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      setError(`Unsupported file type. Use: ${allowed.join(', ')}`);
      setStatus('error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum 20MB.');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('reading');
    setError('');
    setResult(null);

    try {
      const text = await extractText(file);
      if (text.trim().length < 50) {
        setError('Could not extract enough text from this file. Try a different format.');
        setStatus('error');
        return;
      }

      setStatus('generating');
      setProgress(`AI is analyzing "${file.name}" and generating scripts...`);

      const data = await generateScripts(text, file.name);
      setResult({ total: data.total, scripts: data.scripts });
      setStatus('done');
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to generate scripts');
      setStatus('error');
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }

  function reset() {
    setStatus('idle');
    setFileName('');
    setProgress('');
    setResult(null);
    setError('');
  }

  if (status === 'done' && result) {
    return (
      <div style={{
        borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', padding: 20,
        backgroundColor: 'rgba(34,197,94,0.06)', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(34,197,94,0.15)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>
              {result.total} script{result.total !== 1 ? 's' : ''} generated from "{fileName}"
            </p>
            <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', margin: '2px 0 0' }}>
              {result.scripts.map(s => s.name).join(' · ')}
            </p>
          </div>
          <button onClick={reset} style={{
            padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 6,
            border: '1px solid var(--ept-border)', backgroundColor: 'transparent',
            color: 'var(--ept-text-muted)', cursor: 'pointer',
          }}>
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  if (status === 'reading' || status === 'generating') {
    return (
      <div style={{
        borderRadius: 12, border: '1px solid var(--ept-accent)', padding: 32,
        backgroundColor: 'var(--ept-card-bg)', textAlign: 'center',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--ept-accent)',
          borderTopColor: 'transparent', animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', margin: 0 }}>
          {status === 'reading' ? 'Reading document...' : 'AI is generating scripts...'}
        </p>
        <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', margin: '6px 0 0' }}>
          {progress || `Processing "${fileName}"`}
        </p>
        {status === 'generating' && (
          <p style={{ fontSize: 11, color: 'var(--ept-text-muted)', margin: '8px 0 0' }}>
            This may take 30-60 seconds for large documents
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        borderRadius: 12,
        border: `2px dashed ${dragOver ? 'var(--ept-accent)' : error ? 'rgba(239,68,68,0.4)' : 'var(--ept-border)'}`,
        padding: '24px 32px',
        backgroundColor: dragOver ? 'rgba(13,115,119,0.06)' : 'var(--ept-card-bg)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={onFileSelect}
        style={{ display: 'none' }}
      />
      <div style={{
        width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px', backgroundColor: 'rgba(13,115,119,0.1)',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', margin: 0 }}>
        Upload a script document
      </p>
      <p style={{ fontSize: 12, color: 'var(--ept-text-muted)', margin: '4px 0 0' }}>
        Drop a PDF, DOCX, or TXT file — AI will auto-generate scripts from it
      </p>
      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', margin: '8px 0 0', fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
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
  const [createSteps, setCreateSteps] = useState<VisualStep[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [personalityPreset, setPersonalityPreset] = useState('Friendly Professional');

  /* Inline edit state */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editPersonality, setEditPersonality] = useState('');
  const [editSteps, setEditSteps] = useState<VisualStep[]>([]);
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
    if (createSteps.length === 0) {
      setCreateError('Add at least one conversation step');
      return;
    }
    const missingPrompt = createSteps.find((s) => !s.prompt.trim());
    if (missingPrompt) {
      setCreateError(`Step "${missingPrompt.name}" needs AI instructions`);
      return;
    }

    setCreating(true);
    setCreateError(null);
    try {
      await createScript({
        name: createName.trim(),
        description: createDesc.trim(),
        industry: createIndustry,
        personality: createPersonality.trim(),
        states: stepsToStates(createSteps),
      });
      setCreateName('');
      setCreateDesc('');
      setCreateIndustry('insurance');
      setCreatePersonality('');
      setCreateSteps([]);
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
      /* silently fail */
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
    setEditSteps(Object.keys(parsed).length > 0 ? statesToSteps(parsed) : []);
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

    setSaving(true);
    setEditError(null);
    try {
      await updateScript(editingId!, {
        name: editName.trim(),
        description: editDesc.trim(),
        industry: editIndustry,
        personality: editPersonality.trim(),
        states: stepsToStates(editSteps),
      });
      setEditingId(null);
      await fetchScripts();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update script');
    } finally {
      setSaving(false);
    }
  };

  /* ── Use Template ── */

  const useTemplate = () => {
    setCreateSteps([...DEFAULT_STEPS]);
    const preset = PERSONALITY_PRESETS[0];
    if (!createPersonality.trim()) {
      setCreatePersonality(preset.value);
      setPersonalityPreset(preset.label);
    }
  };

  /* ──────────────────── Render ──────────────────── */

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Sales <span className="gradient-text">Scripts</span>
          </h1>
          <p style={{ marginTop: 4, fontSize: 13, color: 'var(--ept-text-muted)' }}>
            Build conversation flows for your AI agent — no coding required.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600,
            color: '#fff', backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 10, cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showCreate ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showCreate ? 'Cancel' : 'Create Script'}
        </button>
      </div>

      {/* Upload Zone */}
      <ScriptUploadZone onComplete={fetchScripts} />

      {/* Create Script Form */}
      {showCreate && (
        <div
          style={{
            borderRadius: 12, border: '1px solid var(--ept-card-border)', padding: 24,
            backgroundColor: 'var(--ept-card-bg)', display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Script
            </h2>
            <button
              onClick={useTemplate}
              style={{
                fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6,
                border: '1px solid var(--ept-accent)', color: 'var(--ept-accent)',
                backgroundColor: 'transparent', cursor: 'pointer',
              }}
            >
              Use Default Template
            </button>
          </div>

          {createError && (
            <div style={{ padding: '8px 14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 13 }}>
              {createError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Script Name
              </label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g., Insurance Qualifier v2"
                style={{
                  width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)',
                  backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                  borderRadius: 8, outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>
            {/* Industry */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Industry
              </label>
              <select
                value={createIndustry}
                onChange={(e) => setCreateIndustry(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)',
                  backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                  borderRadius: 8, outline: 'none',
                }}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Description
            </label>
            <input
              type="text"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              placeholder="Brief description of this script's purpose"
              style={{
                width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)',
                backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                borderRadius: 8, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Personality */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AI Personality
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {PERSONALITY_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setPersonalityPreset(p.label);
                      if (p.value) setCreatePersonality(p.value);
                    }}
                    style={{
                      padding: '2px 8px', fontSize: 10, fontWeight: 600, borderRadius: 4,
                      border: `1px solid ${personalityPreset === p.label ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
                      backgroundColor: personalityPreset === p.label ? 'var(--ept-accent)' : 'transparent',
                      color: personalityPreset === p.label ? '#fff' : 'var(--ept-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={createPersonality}
              onChange={(e) => { setCreatePersonality(e.target.value); setPersonalityPreset('Custom'); }}
              placeholder="Describe how the AI should behave on calls — tone, style, approach..."
              rows={3}
              style={{
                width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)',
                backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)',
                borderRadius: 8, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5,
              }}
            />
          </div>

          {/* Visual Step Builder */}
          <StepBuilder steps={createSteps} onChange={setCreateSteps} />

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={() => setShowCreate(false)}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500, borderRadius: 8,
                border: '1px solid var(--ept-border)', backgroundColor: 'transparent',
                color: 'var(--ept-text-muted)', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !createName.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600,
                color: '#fff', backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 8,
                cursor: creating || !createName.trim() ? 'not-allowed' : 'pointer',
                opacity: creating || !createName.trim() ? 0.5 : 1,
              }}
            >
              {creating && (
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
              )}
              Create Script
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--ept-accent)',
              borderTopColor: 'transparent', animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && scripts.length === 0 && (
        <div
          style={{
            borderRadius: 12, border: '1px solid var(--ept-card-border)', padding: 48,
            backgroundColor: 'var(--ept-card-bg)', textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', backgroundColor: 'rgba(13,115,119,0.1)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ept-text)' }}>
            No scripts yet
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ept-text-muted)', maxWidth: 400, margin: '0 auto 20px' }}>
            Scripts tell your AI agent how to handle calls — what to say, what questions to ask, and how to book appointments.
          </p>
          <button
            onClick={() => { setShowCreate(true); useTemplate(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600,
              color: '#fff', backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 10, cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Script
          </button>
        </div>
      )}

      {/* Script Cards */}
      {!loading && scripts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {scripts.map((script) => {
            const isEditing = editingId === script.id;
            const stateNames = getStateNames(script.states);
            const industryColor = INDUSTRY_COLORS[script.industry] || INDUSTRY_COLORS.other;

            return (
              <div
                key={script.id}
                style={{
                  borderRadius: 12, border: '1px solid var(--ept-card-border)',
                  backgroundColor: 'var(--ept-card-bg)', overflow: 'hidden',
                }}
              >
                {/* Card Header */}
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)', margin: 0 }}>
                          {script.name}
                        </h3>
                        <span
                          style={{
                            display: 'inline-block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                            padding: '2px 8px', borderRadius: 99, backgroundColor: industryColor.bg, color: industryColor.text,
                          }}
                        >
                          {formatLabel(script.industry || 'other')}
                        </span>
                        <span
                          style={{
                            fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
                            padding: '2px 8px', borderRadius: 99, backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)',
                          }}
                        >
                          v{script.version || 1}
                        </span>
                      </div>
                      {script.description && (
                        <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ept-text-muted)', lineHeight: 1.4 }}>
                          {script.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16, flexShrink: 0 }}>
                      {/* Active Toggle */}
                      <button
                        onClick={() => handleToggleActive(script)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.05em', background: 'none', border: 'none',
                          cursor: 'pointer', color: script.is_active ? '#22c55e' : 'var(--ept-text-muted)',
                        }}
                      >
                        <div style={{ position: 'relative', width: 36, height: 20, borderRadius: 10, backgroundColor: script.is_active ? '#22c55e' : 'var(--ept-border)', transition: 'background-color 0.2s' }}>
                          <div style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', left: script.is_active ? 18 : 2, transition: 'left 0.2s' }} />
                        </div>
                        {script.is_active ? 'Active' : 'Inactive'}
                      </button>

                      {/* Edit Button */}
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(script)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600,
                            borderRadius: 6, border: '1px solid var(--ept-border)', backgroundColor: 'transparent',
                            color: 'var(--ept-text-muted)', cursor: 'pointer',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                    {typeof script.times_used === 'number' && (
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--ept-text-muted)' }}>
                        {script.times_used.toLocaleString()} calls
                      </span>
                    )}
                    {typeof script.success_rate === 'number' && (
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--ept-text-muted)' }}>
                        {(script.success_rate * 100).toFixed(1)}% success
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--ept-text-muted)' }}>
                      {stateNames.length} step{stateNames.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* State Pills */}
                  {stateNames.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                      {stateNames.map((state, i) => (
                        <span
                          key={state}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                            padding: '2px 8px', borderRadius: 4,
                            backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)',
                            border: '1px solid var(--ept-border)',
                          }}
                        >
                          <span style={{ color: 'var(--ept-accent)', fontWeight: 700 }}>{i + 1}</span>
                          {state.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inline Editor */}
                {isEditing && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--ept-border)', backgroundColor: 'var(--ept-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {editError && (
                      <div style={{ padding: '8px 14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 13 }}>
                        {editError}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                          Script Name
                        </label>
                        <input
                          type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)', backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 8, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                          Industry
                        </label>
                        <select
                          value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)', backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 8, outline: 'none' }}
                        >
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.value} value={ind.value}>{ind.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        Description
                      </label>
                      <input
                        type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)', backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 8, outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ept-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        AI Personality
                      </label>
                      <textarea
                        value={editPersonality} onChange={(e) => setEditPersonality(e.target.value)} rows={3}
                        style={{ width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--ept-text)', backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-border)', borderRadius: 8, outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
                      />
                    </div>

                    {/* Visual Step Builder for Edit */}
                    <StepBuilder steps={editSteps} onChange={setEditSteps} />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        onClick={cancelEdit}
                        style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, borderRadius: 8, border: '1px solid var(--ept-border)', backgroundColor: 'transparent', color: 'var(--ept-text-muted)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={saving || !editName.trim()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600,
                          color: '#fff', backgroundColor: 'var(--ept-accent)', border: 'none', borderRadius: 8,
                          cursor: saving ? 'wait' : 'pointer', opacity: saving || !editName.trim() ? 0.5 : 1,
                        }}
                      >
                        {saving && <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />}
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
