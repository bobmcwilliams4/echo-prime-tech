'use client';

/* Immortality Vault — the ONE cohesive gold line-icon set. Replaces every emoji
   across the app (sidebar nav, category tiles, emotions, controls, milestones).
   All 24×24, stroke=currentColor @1.5, round caps — callers set the gold. */

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

  // ── sidebar navigation ──
  dashboard: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="5" rx="1.5" /><rect x="13.5" y="11" width="7.5" height="10" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  interview: <><path d="M12 3a2.6 2.6 0 0 0-2.6 2.6v5.8a2.6 2.6 0 0 0 5.2 0V5.6A2.6 2.6 0 0 0 12 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></>,
  chat: <path d="M4 5h16v11H9l-4.5 3.5V5Z" />,
  ancestor: <><path d="M4 5h11v7H7l-3 2.4V5Z" /><path d="M9.5 12.4V14a1.8 1.8 0 0 0 1.8 1.8H16l4 3v-8.4A1.8 1.8 0 0 0 18.2 8.6H16" /></>,
  record: <><rect x="3" y="6.5" width="13" height="11" rx="2" /><path d="M16 10.4l5-2.8v8.8l-5-2.8" /></>,
  voice: <><path d="M4 10v4M8 6.5v11M12 4v16M16 8v8M20 10.5v3" /></>,
  memories: <><path d="M12 2.6l6.5 3.8v7.2L12 21.4 5.5 13.6V6.4L12 2.6Z" /><path d="M5.8 6.6 12 10l6.2-3.4M12 10v11" /></>,
  progress: <><path d="M4 20V4M4 20h16" /><path d="M8 20v-6M12 20V9M16 20v-8M20 20V6" /></>,
  personality: <><path d="M8 3c0 4 8 6 8 9s-8 5-8 9M16 3c0 4-8 6-8 9s8 5 8 9" /><path d="M9 7h6M9 17h6M10.5 12h3" /></>,
  briefing: <><circle cx="12" cy="13" r="4" /><path d="M12 3v3M4.5 8l1.6 1.6M19.5 8l-1.6 1.6M2.5 18h19M6 21h12" /></>,
  family_vault: <><circle cx="7" cy="7.5" r="2.1" /><circle cx="17" cy="7.5" r="2.1" /><circle cx="12" cy="11.5" r="2.1" /><path d="M3.5 18c0-2.2 1.6-3.7 3.5-3.7M17 14.3c1.9 0 3.5 1.5 3.5 3.7M8.5 19c0-2.3 1.6-3.9 3.5-3.9s3.5 1.6 3.5 3.9" /></>,
  bloodline: <><circle cx="12" cy="4.4" r="1.9" /><circle cx="6.4" cy="16.4" r="1.9" /><circle cx="17.6" cy="16.4" r="1.9" /><path d="M12 6.3v3.2M6.4 14.5v-2.6a1 1 0 0 1 1-1h9.2a1 1 0 0 1 1 1v2.6M12 9.5v2.4" /></>,
  facetime: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><circle cx="12" cy="9" r="2.2" /><path d="M8.5 16.5c.7-1.7 2-2.6 3.5-2.6s2.8.9 3.5 2.6" /></>,
  timeline: <><path d="M6 3v18" /><circle cx="6" cy="7" r="1.6" /><circle cx="6" cy="13" r="1.6" /><circle cx="6" cy="19" r="1.6" /><path d="M9.5 7h10M9.5 13h7M9.5 19h9" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,

  // ── voice / camera controls ──
  mic: <><path d="M12 3a2.6 2.6 0 0 0-2.6 2.6v5.8a2.6 2.6 0 0 0 5.2 0V5.6A2.6 2.6 0 0 0 12 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M17 8a5 5 0 0 1 0 8" /></>,
  camera: <><rect x="3" y="6.5" width="13" height="11" rx="2" /><path d="M16 10.4l5-2.8v8.8l-5-2.8" /></>,
  camera_off: <><path d="M3 6.5h11a2 2 0 0 1 2 2v.5M16 13.5v1a2 2 0 0 1-2 2H4a2 2 0 0 1-1-1.7" /><path d="M16 10.4l5-2.8v8.8l-2-1.1" /><path d="M3 3l18 18" /></>,
  spark: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,

  // ── ui glyphs ──
  close: <path d="M6 6l12 12M18 6L6 18" />,
  edit: <><path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z" /><path d="M13.5 6.5l4 4" /></>,
  history: <><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8" /><path d="M4 4v4h4" /><path d="M12 8v4l3 2" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrow_left: <path d="M15 5l-7 7 7 7" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.7 2.5M17 6h2.5A2.5 2.5 0 0 1 16.8 8.5M10 13.5V16M9 20h6M9.5 20a2.5 2.5 0 0 1 5 0" /></>,
  crystal: <><path d="M12 2.6l6.5 3.8v7.2L12 21.4 5.5 13.6V6.4L12 2.6Z" /><path d="M5.8 6.6 12 10l6.2-3.4M12 10v11" /></>,
  play: <path d="M8 5.5v13l11-6.5L8 5.5Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>,
  device: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10 18.5h4" /></>,
  waveform: <path d="M4 10v4M8 6.5v11M12 4v16M16 8v8M20 10.5v3" />,

  // ── emotions ──
  emo_joy: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4 4 0 0 0 7 0" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  emo_sadness: <><circle cx="12" cy="12" r="9" /><path d="M8.5 15.5a4 4 0 0 1 7 0" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  emo_nostalgia: <><path d="M3 16h18" /><circle cx="12" cy="16" r="4.5" /><path d="M12 5v2M6 8l1.2 1.2M18 8l-1.2 1.2" /></>,
  emo_pride: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M10 13.5V16M9 20h6M9.5 20a2.5 2.5 0 0 1 5 0" /></>,
  emo_concern: <><path d="M6 6c3-2.5 9-2.5 12 0s2 8-1.5 9.5S9 17 6.5 15.5 3 8.5 6 6Z" /><path d="M12 9v3M12 14.5h.01" /></>,
  emo_warmth: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>,
  emo_gratitude: <><path d="M12 20s-6.5-4-8.5-8.2C2 8.5 3.7 6 6.4 6c1.9 0 3 1.1 3.6 2.2M12 20s6.5-4 8.5-8.2C22 8.5 20.3 6 17.6 6c-1.9 0-3 1.1-3.6 2.2" /><path d="M12 8.2V20" /></>,
  emo_determination: <><path d="M4 20l7-15 3 8 2-3 4 10H4Z" /></>,
  emo_peace: <path d="M20 7c-6-1-9 2-10 5-1-2-3-3-6-2.5 2 3 5 3.5 6 3-1 3-1 5.5-1 7.5 1.5-2 3-4.5 5-6 3-2 5-4.5 6-7Z" />,
};

export const CATEGORY_ICON: Record<string, string> = {
  early_life: 'early_life', education: 'education', career: 'career', relationships: 'relationships',
  values: 'values', challenges: 'challenges', dreams: 'dreams', legacy: 'legacy', family: 'family',
  daily_life: 'daily_life', wisdom: 'wisdom', humor: 'humor',
};

export default function VaultIcon({ name, size = 24, strokeWidth = 1.5 }: { name: string; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {P[name] ?? P.spark}
    </svg>
  );
}
