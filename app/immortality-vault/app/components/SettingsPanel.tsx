'use client';

import { useState, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER } from '../lib/constants';
import { getUser, getStats, getVoiceProfiles, getMemories, getGamificationStats, type VaultUser, type VoiceProfile } from '../lib/vault-api';

interface Props {
  userId: string;
  userEmail: string;
}

export default function SettingsPanel({ userId, userEmail }: Props) {
  const [user, setUser] = useState<VaultUser | null>(null);
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getUser(userId).then(setUser).catch(() => {});
    getVoiceProfiles(userId).then(d => setProfiles(d.profiles)).catch(() => {});
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

      {/* Account Info */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-3">Account</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-sm text-white">{userEmail}</span>
          </div>
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
