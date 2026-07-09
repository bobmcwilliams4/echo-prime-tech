'use client';

/* Immortality Vault — gold line-icons that replace the emoji across the
   interview experience (category tiles + voice/camera controls). One cohesive
   set, stroked in currentColor so callers set the gold. */

import type { ReactNode } from 'react';

const P: Record<string, ReactNode> = {
  // ── 12 life categories ──
  early_life: <><path d="M12 21c0-5 0-7 2-9M12 21c0-4-2-6-5-6.5" /><path d="M14 12c3 0 5-2 5-5-3 0-5 2-5 5Z" /><path d="M7 14.5c-2-.3-3-1.8-3-4 2 .3 3 1.8 3 4Z" /></>,
  education: <><path d="M12 6 3 9.5l9 3.5 9-3.5L12 6Z" /><path d="M6 11v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" /></>,
  career: <><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5M3 12h18" /></>,
  relationships: <path d="M12 20s-7-4.3-9.2-9C1.3 8 3 5 6 5c2 0 3 1.2 3.8 2.4C10.6 6.2 11.7 5 13.8 5c3 0 4.7 3 3.2 6-2.2 4.7-5 7-5 9Z" />,
  values: <path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.8 6.4 20l1.5-6.3L3 9.5 9.4 9 12 3Z" />,
  challenges: <><path d="M3 19l6-11 4 6 2-3 6 8H3Z" /><circle cx="9" cy="7.5" r="1.4" /></>,
  dreams: <path d="M12 2.5l1.7 5.3L19 10l-5.3 1.7L12 16.5l-1.7-5.3L5 10l5.3-1.7L12 2.5Z" />,
  legacy: <><path d="M4 8l3.5 4L12 6l4.5 6L20 8l-1.5 9h-13L4 8Z" /><path d="M5.5 20h13" /></>,
  family: <><circle cx="8" cy="8" r="2.4" /><circle cx="16" cy="8" r="2.4" /><path d="M4 19c0-2.5 1.8-4.2 4-4.2s4 1.7 4 4.2M12 19c0-2.5 1.8-4.2 4-4.2s4 1.7 4 4.2" /></>,
  daily_life: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  wisdom: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></>,
  humor: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4 4 0 0 0 7 0" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  // ── voice / camera controls ──
  mic: <><path d="M12 3a2.6 2.6 0 0 0-2.6 2.6v5.8a2.6 2.6 0 0 0 5.2 0V5.6A2.6 2.6 0 0 0 12 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M17 8a5 5 0 0 1 0 8" /></>,
  camera: <><rect x="3" y="6.5" width="13" height="11" rx="2" /><path d="M16 10.4l5-2.8v8.8l-5-2.8" /></>,
  camera_off: <><path d="M3 6.5h11a2 2 0 0 1 2 2v.5M16 13.5v1a2 2 0 0 1-2 2H4a2 2 0 0 1-1-1.7" /><path d="M16 10.4l5-2.8v8.8l-2-1.1" /><path d="M3 3l18 18" /></>,
  spark: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,
};

export const CATEGORY_ICON: Record<string, string> = {
  early_life: 'early_life', education: 'education', career: 'career', relationships: 'relationships',
  values: 'values', challenges: 'challenges', dreams: 'dreams', legacy: 'legacy', family: 'family',
  daily_life: 'daily_life', wisdom: 'wisdom', humor: 'humor',
};

export default function VaultIcon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {P[name] ?? P.spark}
    </svg>
  );
}
