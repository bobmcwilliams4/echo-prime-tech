/* Immortality Vault — Shared Constants */

export const API = 'https://echo-immortality-vault.bmcii1976.workers.dev';
export const ACCENT = '#c084fc';
export const GOLD = '#fbbf24';
export const BG_DARK = '#0a0a0f';
export const BG_CARD = '#111118';
export const BORDER = '#2a2a3a';

export const CATEGORIES = [
  { id: 'early_life', name: 'Early Life', icon: '\u{1F331}' },
  { id: 'education', name: 'Education', icon: '\u{1F4DA}' },
  { id: 'career', name: 'Career', icon: '\u{1F4BC}' },
  { id: 'relationships', name: 'Relationships', icon: '\u{2764}\u{FE0F}' },
  { id: 'values', name: 'Values', icon: '\u{2B50}' },
  { id: 'challenges', name: 'Challenges', icon: '\u{1F3D4}\u{FE0F}' },
  { id: 'dreams', name: 'Dreams', icon: '\u{2728}' },
  { id: 'legacy', name: 'Legacy', icon: '\u{1F451}' },
  { id: 'family', name: 'Family', icon: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}' },
  { id: 'daily_life', name: 'Daily Life', icon: '\u{2600}\u{FE0F}' },
  { id: 'wisdom', name: 'Wisdom', icon: '\u{1F9E0}' },
  { id: 'humor', name: 'Humor', icon: '\u{1F604}' },
] as const;

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '\u{1F3E0}' },
  { id: 'interview', label: 'Interview', icon: '\u{1F399}\u{FE0F}' },
  { id: 'chat', label: 'Chat', icon: '\u{1F4AC}' },
  { id: 'ancestor', label: 'Ancestor Chat', icon: '\u{1F54A}\u{FE0F}' },
  { id: 'record', label: 'Record Video', icon: '\u{1F4F9}' },
  { id: 'voice', label: 'Voice Clone', icon: '\u{1F3A4}' },
  { id: 'memories', label: 'Memories', icon: '\u{1F50D}' },
  { id: 'progress', label: 'Progress', icon: '\u{1F4CA}' },
  { id: 'briefing', label: 'Daily Briefing', icon: '\u{2600}\u{FE0F}' },
  { id: 'family', label: 'Family Vault', icon: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}' },
  { id: 'facetime', label: 'FaceTime', icon: '\u{1F4F1}' },
  { id: 'settings', label: 'Settings', icon: '\u{2699}\u{FE0F}' },
] as const;

export const EMOTION_ICONS: Record<string, string> = {
  joy: '\u{1F60A}', sadness: '\u{1F622}', love: '\u{2764}\u{FE0F}', nostalgia: '\u{1F305}', pride: '\u{1F3C6}',
  wisdom: '\u{1F9E0}', humor: '\u{1F604}', concern: '\u{1F4AD}', excitement: '\u{2728}', neutral: '\u{1F4AC}',
  warmth: '\u{1F31F}', gratitude: '\u{1F64F}', determination: '\u{1F4AA}', peace: '\u{1F54A}\u{FE0F}',
};

export const LEVEL_THRESHOLDS = [
  { min: 0, label: 'Newcomer', color: '#94a3b8' },
  { min: 20, label: 'Seeker', color: '#60a5fa' },
  { min: 40, label: 'Keeper', color: '#a78bfa' },
  { min: 60, label: 'Guardian', color: '#f59e0b' },
  { min: 80, label: 'Immortal', color: '#fbbf24' },
] as const;
