'use client';

/* Immortality Vault — Grounded Memory-Chat (P5)
 *
 * A reverent conversation with the preserved person's own memories. The single
 * non-negotiable here is HONESTY: every answer is shown together with the
 * provenance of what it was built from, grouped into three plain classes —
 *   • Sourced fact        — a stored memory (its id + snippet are shown)
 *   • Family recollection — a loved one's annotation (author + relationship)
 *   • Inference           — reasoning over the above, clearly flagged
 * When the record has nothing to answer with, we show the gentle decline the
 * backend returns (never a fabricated answer). Distinct from Ancestor Chat,
 * which converses with a family member's persona. */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED,
} from '../lib/constants';
import {
  memoryChat, synthesizeSpeech, getVoiceProfiles,
  type MemoryChatResponse, type MemoryCitation, type MemoryCitationClass,
} from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';
import VaultIcon from './VaultIcon';

interface Props {
  userId: string;
}

interface Turn {
  role: 'user' | 'assistant';
  content: string;
  data?: MemoryChatResponse;   // present on assistant turns
  failed?: boolean;
}

const GENTLE_DECLINE = "I don't have a memory about that yet. Try asking about a moment, a person, or a time in their life that was recorded.";

const CLASS_ORDER: MemoryCitationClass[] = ['sourced_fact', 'family_recollection', 'inference'];

const CLASS_META: Record<MemoryCitationClass, { label: string; icon: string; color: string; note: string }> = {
  sourced_fact: { label: 'Sourced fact', icon: 'memories', color: ACCENT, note: 'Drawn directly from a preserved memory' },
  family_recollection: { label: 'Family recollection', icon: 'family', color: GOLD_BRIGHT, note: 'Shared by a loved one' },
  inference: { label: 'Inference', icon: 'wisdom', color: MUTED, note: 'Reasoned from the record — not a direct memory' },
};

function shortId(id: string) { return id.length > 10 ? `${id.slice(0, 8)}…` : id; }

/* ── One provenance chip, styled per class ── */
function CitationChip({ c }: { c: MemoryCitation }) {
  const meta = CLASS_META[c.class] ?? CLASS_META.inference;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: meta.color }}>
        <VaultIcon name={meta.icon} size={13} />
        <span className="font-semibold" style={{ letterSpacing: '0.02em' }}>{meta.label}</span>
        {c.class === 'sourced_fact' && c.memory_id && (
          <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,196,81,0.10)', color: MUTED }} title={`Memory ${c.memory_id}`}>
            #{shortId(c.memory_id)}
          </span>
        )}
        {c.class === 'family_recollection' && c.author && (
          <span className="ml-auto text-[10px]" style={{ color: MUTED }}>
            {c.author}{c.relationship ? ` · ${c.relationship}` : ''}
          </span>
        )}
        {c.class === 'inference' && (
          <span className="ml-auto text-[10px] italic" style={{ color: MUTED }}>reasoning</span>
        )}
      </div>
      {c.snippet && (
        <p className="leading-relaxed" style={{ color: '#d6cbb6' }}>
          &ldquo;{c.snippet}&rdquo;
        </p>
      )}
      {(c.category || c.created_at) && (
        <div className="mt-1 flex items-center gap-2 text-[10px]" style={{ color: 'rgba(169,158,139,0.7)' }}>
          {c.category && <span>{c.category}</span>}
          {c.created_at && <span>{new Date(c.created_at).toLocaleDateString()}</span>}
        </div>
      )}
    </div>
  );
}

/* ── The grounded provenance block under an answer ── */
function Provenance({ data }: { data: MemoryChatResponse }) {
  const groups = CLASS_ORDER
    .map(cls => ({ cls, items: (data.citations || []).filter(c => c.class === cls) }))
    .filter(g => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid ${HAIR}` }}>
      <div className="text-[10px] font-semibold uppercase" style={{ color: GOLD_DEEP, letterSpacing: '0.14em' }}>
        Grounded in
      </div>
      {groups.map(({ cls, items }) => {
        const meta = CLASS_META[cls];
        return (
          <div key={cls} className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: meta.color }}>
              <VaultIcon name={meta.icon} size={12} />
              <span className="font-semibold">{meta.label}</span>
              <span style={{ color: MUTED }}>· {items.length}</span>
              <span className="text-[10px] italic" style={{ color: 'rgba(169,158,139,0.7)' }}>— {meta.note}</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: '1fr' }}>
              {items.map((c, i) => <CitationChip key={`${cls}-${i}`} c={c} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Subtle confidence indicator ── */
function Confidence({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="mt-2 flex items-center gap-2" title={`Answer confidence: ${pct}%`}>
      <span className="text-[10px]" style={{ color: 'rgba(169,158,139,0.7)' }}>confidence</span>
      <div className="h-1 rounded-full overflow-hidden" style={{ width: 64, background: 'rgba(245,196,81,0.12)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD})` }} />
      </div>
      <span className="text-[10px] font-mono" style={{ color: MUTED }}>{pct}%</span>
    </div>
  );
}

export default function MemoryChatPanel({ userId }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cloneVoiceRef = useRef<string | undefined>(undefined);

  // The person speaks in their OWN cloned voice when one is ready; otherwise
  // the answer is read in Echo's fallback voice.
  useEffect(() => {
    getVoiceProfiles(userId)
      .then(d => {
        const ready = (d.profiles || []).find(p => p.clone_status === 'ready' && p.voice_id);
        cloneVoiceRef.current = ready?.voice_id;
      })
      .catch(() => { /* no clone yet */ });
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setTurns(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const data = await memoryChat(userId, q);
      const answer = data.unsupported
        ? (data.answer?.trim() || GENTLE_DECLINE)
        : (data.answer?.trim() || GENTLE_DECLINE);
      setTurns(prev => [...prev, { role: 'assistant', content: answer, data }]);
    } catch {
      setTurns(prev => [...prev, {
        role: 'assistant',
        content: 'I had trouble reaching the memories just now. Please try again in a moment.',
        failed: true,
      }]);
    }
    setLoading(false);
  }, [input, loading, userId]);

  const speak = async (text: string, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      const blob = await synthesizeSpeech(text, undefined, cloneVoiceRef.current);
      await playAudioBlob(blob);
    } catch { /* silent */ }
    setPlayingIdx(null);
  };

  const SUGGESTIONS = [
    'What did they love most?',
    'Tell me about their childhood.',
    'What advice did they give?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="rounded-t-2xl px-5 py-4" style={{ background: `linear-gradient(135deg, ${BG_CARD2}, ${BG_INSET})`, border: `1px solid ${BORDER}`, borderBottom: 'none' }}>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 38, height: 38, color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${BORDER}` }}>
            <VaultIcon name="chat" size={19} />
          </span>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Memory Chat</h2>
            <p className="text-[11px]" style={{ color: MUTED }}>
              Grounded only in what was preserved — every answer shows where it came from, and gently declines when the record is silent.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}>
        {turns.length === 0 && !loading && (
          <div className="py-10 text-center">
            <div className="mb-3 flex justify-center" style={{ color: GOLD_DEEP }}><VaultIcon name="memories" size={34} /></div>
            <p className="text-sm mb-4" style={{ color: MUTED }}>Ask about a memory, a person, or a moment in their life.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-3 py-1.5 rounded-full text-xs transition hover:brightness-110"
                  style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => {
          if (t.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}>
                  {t.content}
                </div>
              </div>
            );
          }
          const unsupported = t.data?.unsupported;
          return (
            <div key={i} className="flex justify-start">
              <div
                className="max-w-[88%] w-full rounded-2xl px-4 py-3 text-sm"
                style={{
                  background: BG_INSET,
                  color: '#e6ddcc',
                  border: `1px solid ${unsupported ? 'rgba(169,158,139,0.28)' : BORDER}`,
                }}
              >
                {unsupported ? (
                  /* Honest gentle decline — never dressed up as a real answer. */
                  <div className="flex items-start gap-2" style={{ color: MUTED }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: GOLD_DEEP }}><VaultIcon name="crystal" size={15} /></span>
                    <div>
                      <div className="text-[10px] font-semibold uppercase mb-1" style={{ color: GOLD_DEEP, letterSpacing: '0.14em' }}>No memory found</div>
                      <p className="leading-relaxed italic">{t.content}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 leading-relaxed">{t.content}</p>
                      {!t.failed && (
                        <button
                          onClick={() => speak(t.content, i)}
                          disabled={playingIdx !== null}
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10"
                          style={{ color: ACCENT }}
                          aria-label="Read this answer aloud"
                        >
                          {playingIdx === i
                            ? <span className="block w-3 h-3 rounded-sm animate-pulse" style={{ background: ACCENT }} />
                            : <VaultIcon name="speaker" size={15} />}
                        </button>
                      )}
                    </div>
                    {t.data && <Provenance data={t.data} />}
                    {t.data && !t.failed && <Confidence value={t.data.confidence} />}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: BG_INSET, color: MUTED, border: `1px solid ${BORDER}` }}>
              <span className="animate-pulse">Searching the memories…</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="flex gap-2 p-3 rounded-b-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a memory…"
          aria-label="Ask a memory"
          className="flex-1 bg-transparent border rounded-full px-4 py-2 text-sm placeholder-gray-500 outline-none transition"
          style={{ borderColor: BORDER, color: IVORY }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-5 py-2 rounded-full text-sm font-semibold transition disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
