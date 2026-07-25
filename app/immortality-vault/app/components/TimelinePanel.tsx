'use client';

/* Immortality Vault — Timeline (P3 slice 3)
   A calm, year-ordered vertical timeline of life events derived from the
   owner's memories. Gold-on-black to match the vault identity; crafted SVG
   markers (never emoji). Every event is honestly tagged "inferred" because the
   year + label are derived from the memory rather than explicitly stated. */

import { useState, useEffect } from 'react';
import { ACCENT, GOLD, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED, CATEGORIES } from '../lib/constants';
import { getTimeline, type TimelineEvent } from '../lib/vault-api';
import VaultIcon, { CATEGORY_ICON } from './VaultIcon';

interface Props {
  userId: string;
  onNavigate?: (panel: string) => void;
}

export default function TimelinePanel({ userId, onNavigate }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [span, setSpan] = useState<{ from: number | null; to: number | null }>({ from: null, to: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTimeline(userId)
      .then(data => {
        if (cancelled) return;
        setEvents([...(data.events || [])].sort((a, b) => a.year - b.year));
        setSpan(data.span || { from: null, to: null });
      })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Your timeline could not be loaded.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const spanLabel = span.from != null && span.to != null
    ? (span.from === span.to ? String(span.from) : `${span.from} – ${span.to}`)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: IVORY, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Timeline</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            The shape of a life, drawn from your memories.{spanLabel ? ` ${spanLabel}` : ''}
          </p>
        </div>
        <span className="flex-shrink-0 flex items-center" style={{ color: GOLD_DEEP }}><VaultIcon name="timeline" size={26} /></span>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full animate-spin mx-auto" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
        </div>
      ) : error ? (
        <div className="text-center py-10 rounded-2xl" role="alert" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-sm" style={{ color: '#e6a07a' }}>{error}</div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-3 flex justify-center" style={{ color: GOLD }}><VaultIcon name="timeline" size={34} /></div>
          <div className="text-sm" style={{ color: MUTED }}>Your timeline grows as you share more.</div>
        </div>
      ) : (
        <ol className="space-y-3 border-l-2 pl-6 ml-2" style={{ borderColor: HAIR, listStyle: 'none' }}>
          {events.map((ev, i) => {
            const cat = CATEGORIES.find(c => c.id === ev.category);
            return (
              <li key={`${ev.memory_id}-${ev.year}-${i}`} className="relative">
                {/* node marker on the rail */}
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ left: -31, top: 14, width: 18, height: 18, background: BG_INSET, border: `1.5px solid ${ACCENT}`, color: ACCENT }}
                  aria-hidden
                >
                  <VaultIcon name={cat ? (CATEGORY_ICON[cat.id] || 'spark') : 'spark'} size={10} />
                </span>

                <div className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: ACCENT, letterSpacing: 1 }}>{ev.year}</span>
                    {cat && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: 'rgba(245,196,81,0.10)', color: MUTED }}>
                        <VaultIcon name={CATEGORY_ICON[cat.id] || 'spark'} size={11} /> {cat.name}
                      </span>
                    )}
                    {ev.evidence_video_id && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: 'rgba(245,196,81,0.10)', color: MUTED }} title="A recorded answer backs this event">
                        <VaultIcon name="record" size={11} /> video
                      </span>
                    )}
                    {ev.derived && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(169,158,139,0.12)', color: MUTED }} title="This year was inferred from your memory, not stated directly">
                        inferred
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#d6cbb6' }}>{ev.label}</p>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('memories')}
                      className="mt-2 text-[11px] inline-flex items-center gap-1 transition hover:brightness-125"
                      style={{ color: MUTED }}
                      title="Open this in your Memories"
                      aria-label={`View the source memory for ${ev.label} in Memories`}
                    >
                      <VaultIcon name="memories" size={12} /> View in Memories
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
