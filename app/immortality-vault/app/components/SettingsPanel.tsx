'use client';

import { useState, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED } from '../lib/constants';
import VaultIcon from './VaultIcon';
import PrivacyPanel from './PrivacyPanel';
import {
  getUser,
  updateUser,
  getVoiceProfiles,
  getTrainingConsent,
  grantTrainingConsent,
  revokeTrainingConsent,
  disableModel,
  deleteModel,
  type VaultUser,
  type VoiceProfile,
  type TrainingConsentStatus,
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
  background: '#0f0c09',
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

  /* ── P4: preservation-model governance ──
   * The subject's OWN model is trained only WITH recorded consent. The owner
   * can grant/revoke that consent and disable or fully delete the model. When
   * a subject's adapter exists but is disabled, /chat honestly refuses. */
  const [consent, setConsent] = useState<TrainingConsentStatus | null>(null);
  const [consentLoading, setConsentLoading] = useState(true);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [modelBusy, setModelBusy] = useState<null | 'grant' | 'revoke' | 'disable' | 'delete'>(null);
  const [pendingDestructive, setPendingDestructive] = useState<null | 'disable' | 'delete'>(null);
  const [modelFeedback, setModelFeedback] = useState<FeedbackState>(null);

  const loadConsent = useCallback(async () => {
    setConsentLoading(true);
    setConsentError(null);
    try {
      setConsent(await getTrainingConsent(userId));
    } catch (e) {
      setConsentError(e instanceof Error ? e.message : 'Could not load model status.');
      setConsent(null);
    }
    setConsentLoading(false);
  }, [userId]);

  useEffect(() => { loadConsent(); }, [loadConsent]);

  useEffect(() => {
    if (!modelFeedback) return;
    const t = setTimeout(() => setModelFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [modelFeedback]);

  const doGrant = useCallback(async () => {
    setModelBusy('grant');
    setModelFeedback(null);
    try {
      await grantTrainingConsent(userId);
      await loadConsent();
      setModelFeedback({ type: 'success', message: 'Training consent granted. Only this person’s own model will be trained.' });
    } catch (e) {
      setModelFeedback({ type: 'error', message: e instanceof Error ? e.message : 'Could not grant consent.' });
    }
    setModelBusy(null);
  }, [userId, loadConsent]);

  const doRevoke = useCallback(async () => {
    setModelBusy('revoke');
    setModelFeedback(null);
    try {
      await revokeTrainingConsent(userId);
      await loadConsent();
      setModelFeedback({ type: 'success', message: 'Training consent revoked. No further training will occur.' });
    } catch (e) {
      setModelFeedback({ type: 'error', message: e instanceof Error ? e.message : 'Could not revoke consent.' });
    }
    setModelBusy(null);
  }, [userId, loadConsent]);

  const doDisable = useCallback(async () => {
    setModelBusy('disable');
    setModelFeedback(null);
    try {
      await disableModel(userId);
      setPendingDestructive(null);
      await loadConsent();
      setModelFeedback({ type: 'success', message: 'Model disabled. Chat will now honestly decline rather than answer as this person.' });
    } catch (e) {
      setModelFeedback({ type: 'error', message: e instanceof Error ? e.message : 'Could not disable the model.' });
    }
    setModelBusy(null);
  }, [userId, loadConsent]);

  const doDelete = useCallback(async () => {
    setModelBusy('delete');
    setModelFeedback(null);
    try {
      const res = await deleteModel(userId);
      setPendingDestructive(null);
      await loadConsent();
      setModelFeedback({
        type: 'success',
        message: `Model deleted — serving removed, ${res.cancelled_jobs} job(s) cancelled, ${res.artifacts_removed.length} artifact(s) removed, consent revoked.`,
      });
    } catch (e) {
      setModelFeedback({ type: 'error', message: e instanceof Error ? e.message : 'Could not delete the model.' });
    }
    setModelBusy(null);
  }, [userId, loadConsent]);

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
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0f0c09' }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: ACCENT, display: 'flex' }}><VaultIcon name="voice" size={16} /></span>
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

      {/* Preservation Model (P4) */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-1" style={{ color: ACCENT }}>
          <VaultIcon name="personality" size={17} />
          <span className="text-sm font-semibold" style={{ color: IVORY }}>Preservation model</span>
        </div>
        <p className="text-xs mb-4" style={{ color: MUTED, lineHeight: 1.6 }}>
          With your consent, we train a model on <span style={{ color: IVORY }}>this person’s own words only</span> — so the
          chat sounds like them. Nothing is trained without consent, and you can turn it off or delete it at any time.
        </p>

        {/* Model action feedback */}
        {modelFeedback && (
          <div
            className="px-3 py-2 rounded-lg text-xs mb-3"
            role="status"
            style={{
              background: modelFeedback.type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(230,160,122,0.08)',
              border: `1px solid ${modelFeedback.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(230,160,122,0.35)'}`,
              color: modelFeedback.type === 'success' ? '#7fe0b8' : '#e6a07a',
            }}
          >
            {modelFeedback.message}
          </div>
        )}

        {consentLoading ? (
          <div className="py-4 flex justify-center">
            <div className="w-5 h-5 rounded-full animate-spin" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
          </div>
        ) : consentError ? (
          <div className="text-xs" style={{ color: '#e6a07a' }}>{consentError}</div>
        ) : (
          <>
            {/* Status row */}
            <div className="flex items-center justify-between p-3 rounded-lg mb-3" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
              <div className="min-w-0">
                <div className="text-xs" style={{ color: IVORY }}>Training consent</div>
                {consent?.reason && <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{consent.reason}</div>}
                <div className="flex flex-wrap gap-2 mt-1.5 text-[10px]" style={{ color: 'rgba(169,158,139,0.75)' }}>
                  {consent?.subject_status && <span>status: {consent.subject_status}</span>}
                  {consent?.model_version && <span className="font-mono">model: {consent.model_version}</span>}
                  {consent?.granted_at && <span>granted: {new Date(consent.granted_at).toLocaleDateString()}</span>}
                </div>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-1"
                style={{
                  background: consent?.training_allowed ? 'rgba(52,211,153,0.14)' : 'rgba(169,158,139,0.12)',
                  color: consent?.training_allowed ? '#34d399' : MUTED,
                }}
              >
                <VaultIcon name={consent?.training_allowed ? 'check' : 'lock'} size={11} />
                {consent?.training_allowed ? 'Allowed' : 'Not allowed'}
              </span>
            </div>

            {/* Grant / Revoke */}
            <div className="flex flex-wrap gap-2 mb-4">
              {consent?.training_allowed ? (
                <button
                  onClick={doRevoke}
                  disabled={modelBusy !== null}
                  className="px-4 py-2 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40 inline-flex items-center gap-1.5"
                  style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
                >
                  <VaultIcon name="lock" size={13} /> {modelBusy === 'revoke' ? 'Revoking…' : 'Revoke training consent'}
                </button>
              ) : (
                <button
                  onClick={doGrant}
                  disabled={modelBusy !== null}
                  className="px-4 py-2 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40 inline-flex items-center gap-1.5"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
                >
                  <VaultIcon name="check" size={13} /> {modelBusy === 'grant' ? 'Granting…' : 'Grant training consent'}
                </button>
              )}
            </div>

            {/* Destructive controls — inline confirm (no browser confirm dialog) */}
            <div className="pt-3" style={{ borderTop: `1px solid ${HAIR}` }}>
              <div className="text-[10px] font-semibold uppercase mb-2" style={{ color: GOLD_DEEP, letterSpacing: '0.12em' }}>Danger zone</div>
              {pendingDestructive ? (
                <div className="p-3 rounded-lg" style={{ background: 'rgba(230,160,122,0.06)', border: '1px solid rgba(230,160,122,0.35)' }}>
                  <p className="text-xs mb-3" style={{ color: '#e6c8b4', lineHeight: 1.6 }}>
                    {pendingDestructive === 'disable'
                      ? 'Disable this person’s model? The chat will honestly decline instead of answering as them. You can re-enable it later.'
                      : 'Permanently delete this person’s model? This stops serving, cancels any training, revokes consent, and removes the stored model. This cannot be undone.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={pendingDestructive === 'disable' ? doDisable : doDelete}
                      disabled={modelBusy !== null}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40"
                      style={{ background: '#7f1d1d', border: '1px solid #b45454', color: '#fca5a5' }}
                    >
                      {modelBusy === pendingDestructive
                        ? (pendingDestructive === 'disable' ? 'Disabling…' : 'Deleting…')
                        : (pendingDestructive === 'disable' ? 'Yes, disable model' : 'Yes, delete permanently')}
                    </button>
                    <button
                      onClick={() => setPendingDestructive(null)}
                      disabled={modelBusy !== null}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40"
                      style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setPendingDestructive('disable'); setModelFeedback(null); }}
                    disabled={modelBusy !== null}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40"
                    style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: MUTED }}
                  >
                    Disable model
                  </button>
                  <button
                    onClick={() => { setPendingDestructive('delete'); setModelFeedback(null); }}
                    disabled={modelBusy !== null}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40"
                    style={{ background: 'transparent', border: '1px solid rgba(230,160,122,0.35)', color: '#e6a07a' }}
                  >
                    Delete model
                  </button>
                </div>
              )}
            </div>

            {/* Voice model — honestly marked not-yet-available */}
            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${HAIR}` }}>
              <div className="flex items-center gap-2">
                <span style={{ color: MUTED, display: 'flex' }}><VaultIcon name="voice" size={15} /></span>
                <div>
                  <div className="text-xs" style={{ color: IVORY }}>Voice model</div>
                  <div className="text-[10px]" style={{ color: MUTED }}>Consent-gated voice preservation</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{ background: 'rgba(245,196,81,0.10)', color: GOLD_BRIGHT }}>
                <VaultIcon name="clock" size={11} /> Coming soon
              </span>
            </div>
          </>
        )}
      </div>

      {/* Your data & privacy (P6) — data summary, full export, verifiable deletion */}
      <PrivacyPanel userId={userId} />

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
