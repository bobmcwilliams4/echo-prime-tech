'use client';

/* ==============================================================================
   MORE FROM ECHO PRIME — a quiet, premium cross-promotion of the other Echo
   Prime products, in the Vault's black+gold key. NOT an ad: a slim strip of
   cards with a crafted SVG mark each, one-line pitch, and a gold hairline.
   Dismissible (remembered in localStorage). Opens each service in a new tab.
   Only links guard-safe echo-op.com services — never echo-ept.com (the
   vault-separation guard forbids EPT links, by design).
   ============================================================================== */

import { useState, useEffect, type ReactNode } from 'react';
import { ACCENT, GOLD_DEEP, BG_CARD, BG_CARD2, BORDER, HAIR, IVORY, MUTED } from '../lib/constants';

const DISMISS_KEY = 'vault_morefrom_dismissed_v1';

/* crafted, on-brand line-marks (no emoji) — 24×24, currentColor gold */
const MARKS: Record<string, ReactNode> = {
  story: <><path d="M12 6.5C10.5 5 8.3 4.4 4.8 4.4v12.7c3.5 0 5.7.6 7.2 2.1 1.5-1.5 3.7-2.1 7.2-2.1V4.4C15.7 4.4 13.5 5 12 6.5Z" /><path d="M12 6.5v12.7" /><path d="M7 9h2.5M7 12h2.5" /></>,
  numerology: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" strokeOpacity="0.5" /><circle cx="12" cy="12" r="2.3" /></>,
  device: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10 18.5h4" /><path d="M9.5 8.5l1.8 1.8 3.2-3.4" /></>,
  spark: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,
};

function Mark({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {MARKS[name] ?? MARKS.spark}
    </svg>
  );
}

const SERVICES = [
  { mark: 'story', name: 'Life Story', pitch: 'Turn a lifetime of memories into a written story.', url: 'https://story.echo-op.com' },
  { mark: 'numerology', name: 'Numerology', pitch: 'Discover what your numbers reveal about you.', url: 'https://numerology.echo-op.com' },
  { mark: 'device', name: 'Device Lab', pitch: 'Certified refurbished devices, restored & guaranteed.', url: 'https://devices.echo-op.com' },
];

export default function MoreFromEcho() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try { setDismissed(localStorage.getItem(DISMISS_KEY) === '1'); }
    catch { setDismissed(false); }
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <section className="rounded-2xl p-5" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span style={{ width: 20, height: 1, background: GOLD_DEEP }} />
          <span className="text-[11px] uppercase font-semibold" style={{ letterSpacing: '0.22em', color: GOLD_DEEP }}>More from Echo Prime</span>
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="rounded-md p-1 transition hover:brightness-125" style={{ color: MUTED, border: `1px solid ${HAIR}` }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SERVICES.map(s => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-xl p-3.5 transition hover:-translate-y-0.5"
            style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}
          >
            <span className="flex-shrink-0 inline-flex items-center justify-center rounded-lg" style={{ width: 38, height: 38, color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${HAIR}` }}>
              <Mark name={s.mark} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: IVORY }}>
                {s.name}
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: GOLD_DEEP }} aria-hidden><path d="M7 17L17 7M9 7h8v8" /></svg>
              </span>
              <span className="block text-xs mt-0.5" style={{ color: MUTED, lineHeight: 1.45 }}>{s.pitch}</span>
            </span>
          </a>
        ))}
      </div>

      <a
        href="https://echo-op.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3.5 transition hover:brightness-125"
        style={{ color: ACCENT }}
      >
        Explore everything Echo Prime builds
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
    </section>
  );
}
