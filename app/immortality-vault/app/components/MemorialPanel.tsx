'use client';

/* Immortality Vault — Memorial (P5)
 *
 * Composes a reverent, reproducible memorial from the preserved person's
 * consented record. The result is content-hashed with a source manifest, so it
 * is verifiably reproducible and consent-scoped — we surface that plainly. The
 * owner controls which memories may appear in a shared memorial via a per-memory
 * share toggle. Past memorials composed on this device can be re-opened.
 *
 * Markdown is rendered by a tiny, dependency-free, XSS-safe renderer (no
 * dangerouslySetInnerHTML) so the page stays CSP-safe under static export. */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED,
} from '../lib/constants';
import {
  createMemorial, getMemorial, setMemorialShare, getMemories,
  type MemorialResult, type Memory,
} from '../lib/vault-api';
import VaultIcon from './VaultIcon';

interface Props {
  userId: string;
}

interface MemorialStub {
  memorial_id: string;
  title?: string;
  created_at: string;
  content_sha256: string;
}

const goldBtn = `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`;

/* ─── Tiny, safe markdown → React (headings, lists, quotes, hr, inline) ─── */

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  // Split on **bold**, *italic*, and `code`, keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, i) => {
    const key = `${keyPrefix}-${i}`;
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={key} style={{ color: IVORY, fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith('*') && p.endsWith('*')) {
      return <em key={key} style={{ color: '#e6ddcc' }}>{p.slice(1, -1)}</em>;
    }
    if (p.startsWith('`') && p.endsWith('`')) {
      return <code key={key} className="px-1 rounded font-mono text-[0.9em]" style={{ background: BG_INSET, color: GOLD_BRIGHT }}>{p.slice(1, -1)}</code>;
    }
    return <span key={key}>{p}</span>;
  });
}

function renderMarkdown(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let k = 0;

  const flushList = () => {
    if (list.length === 0) return;
    const items = [...list];
    list = [];
    out.push(
      <ul key={`ul-${k++}`} className="list-disc pl-5 space-y-1 my-3" style={{ color: '#d6cbb6' }}>
        {items.map((it, i) => <li key={i} className="leading-relaxed">{parseInline(it, `li-${k}-${i}`)}</li>)}
      </ul>,
    );
  };
  const flushPara = () => {
    if (para.length === 0) return;
    const text = para.join(' ');
    para = [];
    out.push(<p key={`p-${k++}`} className="leading-relaxed my-3" style={{ color: '#d6cbb6' }}>{parseInline(text, `p-${k}`)}</p>);
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushList(); flushPara(); continue; }
    if (/^#{1,6}\s/.test(line)) {
      flushList(); flushPara();
      const level = (line.match(/^#+/) || ['#'])[0].length;
      const content = line.replace(/^#+\s/, '');
      const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-sm'];
      out.push(
        <div
          key={`h-${k++}`}
          className={`${sizes[level - 1]} font-semibold mt-5 mb-2`}
          style={{ color: level <= 2 ? IVORY : GOLD, fontFamily: level <= 2 ? 'Cormorant Garamond, Georgia, serif' : undefined }}
        >
          {parseInline(content, `h-${k}`)}
        </div>,
      );
    } else if (/^(---|\*\*\*|___)\s*$/.test(line)) {
      flushList(); flushPara();
      out.push(<hr key={`hr-${k++}`} className="my-5" style={{ borderColor: HAIR }} />);
    } else if (/^>\s?/.test(line)) {
      flushList(); flushPara();
      out.push(
        <blockquote key={`bq-${k++}`} className="pl-4 my-3 italic leading-relaxed" style={{ borderLeft: `2px solid ${GOLD_DEEP}`, color: MUTED }}>
          {parseInline(line.replace(/^>\s?/, ''), `bq-${k}`)}
        </blockquote>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-*]\s+/, ''));
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushList(); flushPara();
  return out;
}

/* ─── Reproducibility badge ─── */
function ReproBadge({ m }: { m: MemorialResult }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      {m.reproducible && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.3)', color: '#7fe0b8' }}>
          <VaultIcon name="check" size={12} /> Reproducible
        </span>
      )}
      {m.consent_scoped && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(245,196,81,0.10)', border: `1px solid ${BORDER}`, color: ACCENT }}>
          <VaultIcon name="lock" size={12} /> Consent-scoped
        </span>
      )}
      {m.content_sha256 && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-mono" style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }} title={m.content_sha256}>
          sha256 {m.content_sha256.slice(0, 10)}…
        </span>
      )}
    </div>
  );
}

export default function MemorialPanel({ userId }: Props) {
  const [memorial, setMemorial] = useState<MemorialResult | null>(null);
  const [creating, setCreating] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [past, setPast] = useState<MemorialStub[]>([]);

  // Memories + their share state
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loadingMems, setLoadingMems] = useState(true);
  const [savingShare, setSavingShare] = useState<string | null>(null);

  const pastKey = `vault_memorials_${userId}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(pastKey);
      if (raw) setPast(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [pastKey]);

  useEffect(() => {
    getMemories(userId, undefined, 200)
      .then(d => setMemories(d.memories || []))
      .catch(() => {})
      .finally(() => setLoadingMems(false));
  }, [userId]);

  const rememberStub = useCallback((m: MemorialResult) => {
    const stub: MemorialStub = { memorial_id: m.memorial_id, title: m.title || title || undefined, created_at: m.created_at || new Date().toISOString(), content_sha256: m.content_sha256 };
    setPast(prev => {
      const next = [stub, ...prev.filter(p => p.memorial_id !== stub.memorial_id)].slice(0, 20);
      if (typeof window !== 'undefined') localStorage.setItem(pastKey, JSON.stringify(next));
      return next;
    });
  }, [pastKey, title]);

  const create = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const m = await createMemorial(userId, title.trim() || undefined);
      setMemorial(m);
      rememberStub(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not compose the memorial. Please try again.');
    }
    setCreating(false);
  }, [userId, title, rememberStub]);

  const reopen = useCallback(async (id: string) => {
    setOpening(id);
    setError(null);
    try {
      const m = await getMemorial(userId, id);
      setMemorial(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not re-open that memorial.');
    }
    setOpening(null);
  }, [userId]);

  const toggleShare = useCallback(async (mem: Memory) => {
    const next = !mem.shareable;
    setSavingShare(mem.id);
    // Optimistic; revert on failure.
    setMemories(prev => prev.map(x => x.id === mem.id ? { ...x, shareable: next } : x));
    try {
      await setMemorialShare(userId, mem.id, next);
    } catch {
      setMemories(prev => prev.map(x => x.id === mem.id ? { ...x, shareable: !next } : x));
    }
    setSavingShare(null);
  }, [userId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Memorial</h2>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          A reverent tribute composed from the memories that were preserved — reproducible, and scoped to what consent allows.
        </p>
      </div>

      {error && (
        <div className="px-4 py-2.5 rounded-lg text-sm" role="alert" style={{ background: 'rgba(230,160,122,0.08)', border: '1px solid rgba(230,160,122,0.35)', color: '#e6a07a' }}>
          {error}
        </div>
      )}

      {/* Compose */}
      <div className="p-5 rounded-2xl" style={{ background: `radial-gradient(120% 100% at 50% 0%, ${BG_CARD2}, ${BG_CARD})`, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-3" style={{ color: ACCENT }}>
          <VaultIcon name="memorial" size={20} />
          <span className="text-sm font-semibold" style={{ color: IVORY }}>Compose a memorial</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional) — e.g. In Loving Memory"
            aria-label="Memorial title"
            className="flex-1 rounded-lg px-3 py-2 text-sm placeholder-gray-600 outline-none focus:ring-1 focus:ring-amber-400/40"
            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
          />
          <button
            onClick={create}
            disabled={creating}
            className="px-5 py-2 rounded-full text-sm font-semibold transition hover:brightness-110 disabled:opacity-40 inline-flex items-center justify-center gap-1.5"
            style={{ background: goldBtn, color: '#20160a' }}
          >
            <VaultIcon name="memorial" size={15} /> {creating ? 'Composing…' : 'Create memorial'}
          </button>
        </div>
      </div>

      {/* Rendered memorial */}
      {memorial && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="px-6 py-4 flex items-start justify-between gap-3" style={{ background: `linear-gradient(135deg, ${BG_CARD2}, ${BG_INSET})`, borderBottom: `1px solid ${HAIR}` }}>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 34, height: 34, color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${BORDER}` }}>
                <VaultIcon name="memorial" size={17} />
              </span>
              <div className="text-[11px]" style={{ color: MUTED }}>
                Memorial <span className="font-mono">#{memorial.memorial_id.slice(0, 8)}</span>
                {memorial.created_at && <> · {new Date(memorial.created_at).toLocaleDateString()}</>}
              </div>
            </div>
            <ReproBadge m={memorial} />
          </div>
          <article className="px-6 py-6" style={{ background: BG_CARD }}>
            {renderMarkdown(memorial.content)}
          </article>
        </div>
      )}

      {/* Past memorials (composed on this device) */}
      {past.length > 0 && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 mb-3" style={{ color: GOLD_DEEP }}>
            <VaultIcon name="history" size={16} />
            <span className="text-sm font-semibold" style={{ color: IVORY }}>Past memorials</span>
          </div>
          <div className="space-y-2">
            {past.map(p => (
              <button
                key={p.memorial_id}
                onClick={() => reopen(p.memorial_id)}
                disabled={opening === p.memorial_id}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition hover:brightness-110 disabled:opacity-50"
                style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}
              >
                <span style={{ color: ACCENT }}><VaultIcon name="memorial" size={16} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: IVORY }}>{p.title || 'Memorial'}</div>
                  <div className="text-[10px]" style={{ color: MUTED }}>{new Date(p.created_at).toLocaleString()}</div>
                </div>
                <span className="text-[11px]" style={{ color: MUTED }}>{opening === p.memorial_id ? 'Opening…' : 'Re-open'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Per-memory share controls */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-1" style={{ color: GOLD_DEEP }}>
          <VaultIcon name="family_vault" size={16} />
          <span className="text-sm font-semibold" style={{ color: IVORY }}>What may be shared</span>
        </div>
        <p className="text-xs mb-3" style={{ color: MUTED }}>
          Choose which memories a shared memorial is allowed to include. Everything is private until you turn it on.
        </p>
        {loadingMems ? (
          <div className="text-center py-6">
            <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-sm text-center py-6" style={{ color: MUTED }}>No memories yet to share.</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {memories.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
                <p className="flex-1 text-xs leading-relaxed line-clamp-2" style={{ color: '#d6cbb6' }}>
                  {m.content.length > 160 ? m.content.slice(0, 160) + '…' : m.content}
                </p>
                <button
                  onClick={() => toggleShare(m)}
                  disabled={savingShare === m.id}
                  className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0 disabled:opacity-60"
                  style={{ background: m.shareable ? ACCENT : '#3f3f46' }}
                  role="switch"
                  aria-checked={!!m.shareable}
                  aria-label={m.shareable ? 'Sharing enabled for this memory' : 'Sharing disabled for this memory'}
                >
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: m.shareable ? 22 : 2 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
