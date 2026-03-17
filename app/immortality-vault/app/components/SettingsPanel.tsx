'use client';

import { useState, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER } from '../lib/constants';
import {
  getUser,
  updateUser,
  getStats,
  getVoiceProfiles,
  getMemories,
  getGamificationStats,
  type VaultUser,
  type VoiceProfile,
} from '../lib/vault-api';

interface Props {
  userId: string;
  userEmail: string;
}

interface NotificationPrefs {
  dailyBriefing: boolean;
  weeklyDigest: boolean;
  interviewReminders: boolean;
  achievementAlerts: boolean;
}

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

const INPUT_STYLE: React.CSSProperties = {
  background: '#0a0a0f',
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '6px 10px',
  color: '#e2e8f0',
  fontSize: 13,
  width: '100%',
  outline: 'none',
};

const INPUT_FOCUS_BORDER = ACCENT;

export default function SettingsPanel({ userId, userEmail }: Props) {
  const [user, setUser] = useState<VaultUser | null>(null);
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [exporting, setExporting] = useState(false);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // Notification preferences (persisted in localStorage)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    dailyBriefing: true,
    weeklyDigest: true,
    interviewReminders: true,
    achievementAlerts: true,
  });

  // Load user and voice profiles
  useEffect(() => {
    getUser(userId).then((u) => {
      setUser(u);
      setEditName(u.name || '');
      setEditEmail(u.email || '');
    }).catch(() => {});
    getVoiceProfiles(userId).then(d => setProfiles(d.profiles)).catch(() => {});
  }, [userId]);

  // Load notification prefs from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(`vault_notif_prefs_${userId}`);
    if (stored) {
      try {
        setNotifPrefs(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, [userId]);

  // Clear feedback after 4s
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const enterEditMode = useCallback(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || userEmail);
    }
    setEditing(true);
    setFeedback(null);
  }, [user, userEmail]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setFeedback(null);
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || userEmail);
    }
  }, [user, userEmail]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updates: Partial<{ name: string; email: string }> = {};
      const trimmedName = editName.trim();
      const trimmedEmail = editEmail.trim();
      if (trimmedName && trimmedName !== user.name) updates.name = trimmedName;
      if (trimmedEmail && trimmedEmail !== user.email) updates.email = trimmedEmail;

      if (Object.keys(updates).length === 0) {
        setEditing(false);
        setFeedback({ type: 'success', message: 'No changes to save.' });
        setSaving(false);
        return;
      }

      const updated = await updateUser(userId, updates);
      setUser(updated);
      setEditing(false);
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.';
      setFeedback({ type: 'error', message: msg });
    }
    setSaving(false);
  }, [user, userId, editName, editEmail]);

  const toggleNotifPref = useCallback((key: keyof NotificationPrefs) => {
    setNotifPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`vault_notif_prefs_${userId}`, JSON.stringify(next));
      }
      return next;
    });
  }, [userId]);

  const exportData = useCallback(async () => {
    setExporting(true);
    try {
      const [userData, statsData, memoriesData, gamData] = await Promise.all([
        getUser(userId).catch(() => null),
        getStats().catch(() => null),
        getMemories(userId, undefined, 1000).catch(() => ({ memories: [] })),
        getGamificationStats(userId).catch(() => null),
      ]);
      const bundle = {
        exported_at: new Date().toISOString(),
        user: userData,
        stats: statsData,
        memories: memoriesData.memories,
        gamification: gamData,
        voice_profiles: profiles,
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `immortality-vault-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* empty */ }
    setExporting(false);
  }, [userId, profiles]);

  const syncTime = typeof window !== 'undefined' ? localStorage.getItem('vault_last_sync') : null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: feedback.type === 'success' ? '#14532d' : '#7f1d1d',
            border: `1px solid ${feedback.type === 'success' ? '#16a34a' : '#dc2626'}`,
            color: feedback.type === 'success' ? '#86efac' : '#fca5a5',
          }}
        >
          {feedback.type === 'success' ? '\u2713' : '\u2717'} {feedback.message}
        </div>
      )}

      {/* Account Info */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Account</div>
          {!editing ? (
            <button
              onClick={enterEditMode}
              className="text-xs px-3 py-1 rounded-lg transition-colors hover:opacity-80"
              style={{ border: `1px solid ${BORDER}`, color: ACCENT }}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="text-xs px-3 py-1 rounded-lg transition-colors hover:opacity-80 disabled:opacity-40"
                style={{ border: `1px solid ${BORDER}`, color: '#94a3b8' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-3 py-1 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-40"
                style={{ background: ACCENT, color: '#fff' }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {/* Name Field */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Name</span>
            {editing ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Your name"
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = INPUT_FOCUS_BORDER; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            ) : (
              <span className="text-sm text-white">{user?.name || '\u2014'}</span>
            )}
          </div>

          {/* Email Field */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Email</span>
            {editing ? (
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                placeholder="you@example.com"
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = INPUT_FOCUS_BORDER; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            ) : (
              <span className="text-sm text-white">{userEmail}</span>
            )}
          </div>

          {/* Read-only fields */}
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Vault ID</span>
            <span className="text-xs font-mono text-gray-400">{userId}</span>
          </div>
          {user && (
            <>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Plan</span>
                <span className="text-xs font-semibold" style={{ color: ACCENT }}>{user.tier || 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Consciousness Score</span>
                <span className="text-xs font-bold" style={{ color: GOLD }}>{user.consciousness_score ?? 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Voice Status</span>
                <span className="text-xs" style={{ color: user.voice_clone_status === 'active' ? '#34d399' : '#94a3b8' }}>
                  {user.voice_clone_status || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Member Since</span>
                <span className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-3">Notification Preferences</div>
        <div className="space-y-3">
          {([
            { key: 'dailyBriefing' as const, label: 'Daily Briefing', desc: 'Morning summary of your vault activity' },
            { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Weekly progress report and stats' },
            { key: 'interviewReminders' as const, label: 'Interview Reminders', desc: 'Reminders to continue interviews' },
            { key: 'achievementAlerts' as const, label: 'Achievement Alerts', desc: 'Notify when you unlock achievements' },
          ]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white">{label}</div>
                <div className="text-[10px] text-gray-500">{desc}</div>
              </div>
              <button
                onClick={() => toggleNotifPref(key)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: notifPrefs[key] ? ACCENT : '#3f3f46',
                }}
                aria-label={`Toggle ${label}`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{
                    left: notifPrefs[key] ? 22 : 2,
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Profiles */}
      {profiles.length > 0 && (
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-sm text-gray-400 mb-3">Voice Profiles</div>
          <div className="space-y-2">
            {profiles.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0a0a0f' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{'\u{1F3A4}'}</span>
                  <div>
                    <div className="text-xs text-white">{p.sample_count} samples</div>
                    <div className="text-[10px] text-gray-500">Quality: {Math.round(p.quality_score * 100)}%</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                  background: p.clone_status === 'active' ? '#34d39920' : '#fbbf2420',
                  color: p.clone_status === 'active' ? '#34d399' : GOLD,
                }}>
                  {p.clone_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-3">Export Data</div>
        <p className="text-xs text-gray-500 mb-3">Download your entire vault &mdash; memories, interviews, family tree, and voice profiles.</p>
        <button
          onClick={exportData}
          disabled={exporting}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-40"
          style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
        >
          {exporting ? 'Exporting...' : '\u{1F4E6} Export Vault'}
        </button>
      </div>

      {/* Sync Status */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-2">Sync Status</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-gray-300">Connected to Cloudflare</span>
        </div>
        {syncTime && (
          <div className="text-[10px] text-gray-600 mt-1">Last sync: {syncTime}</div>
        )}
      </div>
    </div>
  );
}
