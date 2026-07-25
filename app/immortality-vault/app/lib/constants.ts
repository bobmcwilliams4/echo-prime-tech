/* Immortality Vault — Shared Constants
   Black + bright-gold identity (matches the gold-on-black intro film + landing).
   ACCENT is the primary bright gold; every panel imports these tokens, so the
   palette is defined once, here. Icon fields are ICON KEYS (rendered by
   <VaultIcon name=…/>), never emoji. */

export const API = 'https://vault-api.echo-op.com';

/* ── palette: bright gold on warm near-black ── */
export const ACCENT = '#f5c451';        // primary bright gold
export const GOLD = '#fbbf24';          // bright gold (headline accents)
export const GOLD_BRIGHT = '#ffe08a';   // highlight
export const GOLD_DEEP = '#c69749';     // deep gold (borders, secondary)
export const BG_DARK = '#0a0807';       // warm near-black (page)
export const BG_CARD = '#14100c';       // card
export const BG_CARD2 = '#1c1710';      // elevated card / hover
export const BG_INSET = '#0f0c09';      // inset track / recessed
export const BORDER = 'rgba(245,196,81,0.16)';  // gold hairline
export const HAIR = 'rgba(245,196,81,0.10)';     // fainter divider
export const IVORY = '#f0e7d6';         // primary text
export const MUTED = '#a99e8b';         // secondary text

export const CATEGORIES = [
  { id: 'early_life', name: 'Early Life', icon: 'early_life' },
  { id: 'education', name: 'Education', icon: 'education' },
  { id: 'career', name: 'Career', icon: 'career' },
  { id: 'relationships', name: 'Relationships', icon: 'relationships' },
  { id: 'values', name: 'Values', icon: 'values' },
  { id: 'challenges', name: 'Challenges', icon: 'challenges' },
  { id: 'dreams', name: 'Dreams', icon: 'dreams' },
  { id: 'legacy', name: 'Legacy', icon: 'legacy' },
  { id: 'family', name: 'Family', icon: 'family' },
  { id: 'daily_life', name: 'Daily Life', icon: 'daily_life' },
  { id: 'wisdom', name: 'Wisdom', icon: 'wisdom' },
  { id: 'humor', name: 'Humor', icon: 'humor' },
] as const;

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'interview', label: 'Interview', icon: 'interview' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'ancestor', label: 'Ancestor Chat', icon: 'ancestor' },
  { id: 'record', label: 'Record Video', icon: 'record' },
  { id: 'voice', label: 'Voice Clone', icon: 'voice' },
  { id: 'memories', label: 'Memories', icon: 'memories' },
  { id: 'timeline', label: 'Timeline', icon: 'timeline' },
  { id: 'progress', label: 'Progress', icon: 'progress' },
  { id: 'personality', label: 'Personality', icon: 'personality' },
  { id: 'briefing', label: 'Daily Briefing', icon: 'briefing' },
  { id: 'family', label: 'Family Vault', icon: 'family_vault' },
  { id: 'bloodline', label: 'Bloodline', icon: 'bloodline' },
  { id: 'facetime', label: 'FaceTime', icon: 'facetime' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const;

/* emotion → icon key (rendered via <VaultIcon/>) */
export const EMOTION_ICONS: Record<string, string> = {
  joy: 'emo_joy', sadness: 'emo_sadness', love: 'relationships', nostalgia: 'emo_nostalgia',
  pride: 'emo_pride', wisdom: 'wisdom', humor: 'humor', concern: 'emo_concern',
  excitement: 'spark', neutral: 'chat', warmth: 'emo_warmth', gratitude: 'emo_gratitude',
  determination: 'emo_determination', peace: 'emo_peace',
};

export const LEVEL_THRESHOLDS = [
  { min: 0, label: 'Newcomer', color: '#a99e8b' },
  { min: 20, label: 'Seeker', color: '#d8b25a' },
  { min: 40, label: 'Keeper', color: '#e6c060' },
  { min: 60, label: 'Guardian', color: '#f5c451' },
  { min: 80, label: 'Immortal', color: '#ffe08a' },
] as const;
