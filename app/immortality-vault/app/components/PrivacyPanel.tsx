'use client';

/* Immortality Vault — P6 "Your data & privacy" (#24413)
 *
 * Three calm, honest surfaces for the vault owner:
 *   1. Data summary   — what the vault currently holds, in plain language.
 *   2. Export         — pull a complete machine-readable copy, downloaded locally.
 *   3. Danger zone    — irreversibly delete the preserved person, with a typed
 *                       confirm token (NO browser confirm()) and a verifiable
 *                       receipt afterwards.
 *
 * Tone: gentle but honest. Deleting a vault erases a preserved person, so the
 * copy treats it with gravity and never hides the encrypted-backup rotation
 * truth. Rendered as a section inside SettingsPanel to stay cohesive. */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import {
  ACCENT, GOLD, GOLD_BRIGHT, GOLD_DEEP, BG_CARD, BG_INSET, BORDER, HAIR, IVORY, MUTED,
} from '../lib/constants';
import VaultIcon from './VaultIcon';
import {
  exportVault,
  getPrivacySettings,
  deleteAccount,
  normalizeDataCounts,
  type PrivacySettings,
  type PrivacyDataCount,
  type AccountDeletionReceipt,
} from '../lib/vault-api';

interface Props {
  userId: string;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

/* Friendly, sentence-case labels for known store keys; unknown keys are
 * title-cased so the summary is always readable rather than raw snake_case. */
const STORE_LABELS: Record<string, string> = {
  memories: 'Memories',
  interviews: 'Interview answers',
  interview_answers: 'Interview answers',
  voice_samples: 'Voice recordings',
  voice_profiles: 'Voice profiles',
  videos: 'Video recordings',
  media: 'Photos & media',
  family_members: 'Family members',
  annotations: 'Family recollections',
  memorials: 'Memorials',
  chats: 'Conversations',
  chat_sessions: 'Conversations',
  achievements: 'Achievements',
};

function labelFor(store: string): string {
  if (STORE_LABELS[store]) return STORE_LABELS[store];
  return store
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PrivacyPanel({ userId }: Props) {
  const router = useRouter();
  const { signOut } = useAuth();

  /* ── posture (data summary) ── */
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setSettings(await getPrivacySettings(userId));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load your privacy summary.');
      setSettings(null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  /* ── export ── */
  const [exporting, setExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!exportFeedback) return;
    const t = setTimeout(() => setExportFeedback(null), 6000);
    return () => clearTimeout(t);
  }, [exportFeedback]);

  const doExport = useCallback(async () => {
    setExporting(true);
    setExportFeedback(null);
    try {
      const data = await exportVault(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `immortality-vault-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const valid = data.inventory_validation?.valid;
      setExportFeedback({
        type: 'success',
        message: valid
          ? 'Complete export downloaded. Every expected record was included.'
          : 'Export downloaded. Some records could not be verified — see the file for details.',
      });
    } catch (e) {
      setExportFeedback({ type: 'error', message: e instanceof Error ? e.message : 'The export could not be prepared.' });
    }
    setExporting(false);
  }, [userId]);

  /* ── deletion (danger zone) ── */
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<AccountDeletionReceipt | null>(null);

  const canDelete = confirmText.trim() === 'DELETE' && !deleting;

  const doDelete = useCallback(async () => {
    if (confirmText.trim() !== 'DELETE') return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAccount(userId);
      setReceipt(res.receipt);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'The vault could not be deleted. Nothing was removed.');
    }
    setDeleting(false);
  }, [userId, confirmText]);

  const finishAndLeave = useCallback(async () => {
    try { await signOut(); } catch { /* leave regardless */ }
    router.push('/immortality-vault');
  }, [signOut, router]);

  const counts: PrivacyDataCount[] = normalizeDataCounts(settings?.data_counts).filter((c) => (c.count ?? 0) > 0);
  const retentionNotice = settings?.backup_retention_notice;
  const exportAvailable = settings?.export_available !== false; // default to available unless told otherwise

  /* ── After a successful deletion, the vault is gone: show only the receipt. ── */
  if (receipt) {
    return (
      <section aria-labelledby="pv-receipt-heading" className="space-y-4">
        <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: '1px solid rgba(52,211,153,0.28)' }}>
          <div className="flex items-center gap-2 mb-1" style={{ color: '#7fe0b8' }}>
            <VaultIcon name="check" size={18} />
            <h3 id="pv-receipt-heading" className="text-sm font-semibold" style={{ color: IVORY }}>
              This vault has been permanently deleted
            </h3>
          </div>
          <p className="text-xs mb-4" style={{ color: MUTED, lineHeight: 1.7 }}>
            The preserved record has been removed. This is your receipt — proof of exactly what was cleared. You may
            wish to save it for your records.
          </p>

          <div className="rounded-lg p-4 mb-4" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt style={{ color: MUTED }}>Receipt ID</dt>
                <dd className="font-mono break-all text-right" style={{ color: IVORY }}>{receipt.receipt_id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: MUTED }}>Deleted at</dt>
                <dd style={{ color: IVORY }}>{new Date(receipt.deleted_at).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: MUTED }}>Preservation model</dt>
                <dd style={{ color: IVORY }}>{receipt.persona_removed ? 'Removed' : 'None to remove'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: MUTED }}>Pending training jobs cancelled</dt>
                <dd style={{ color: IVORY }}>{receipt.cancelled_pending_training_jobs}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: MUTED }}>Consent withdrawn</dt>
                <dd style={{ color: IVORY }}>{receipt.consent_withdrawn ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>

          {receipt.stores?.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] font-semibold uppercase mb-2" style={{ color: GOLD_DEEP, letterSpacing: '0.12em' }}>
                Records removed
              </div>
              <ul className="space-y-1.5">
                {receipt.stores.map((s) => (
                  <li key={s.store} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg" style={{ background: BG_INSET }}>
                    <span style={{ color: IVORY }}>{labelFor(s.store)}</span>
                    <span className="font-mono" style={{ color: MUTED }}>{s.rows_or_files_removed}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {receipt.media_removed?.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] font-semibold uppercase mb-2" style={{ color: GOLD_DEEP, letterSpacing: '0.12em' }}>
                Media removed ({receipt.media_removed.length})
              </div>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {receipt.media_removed.map((m, i) => (
                  <li key={`${m}-${i}`} className="text-[11px] font-mono break-all px-3 py-1.5 rounded" style={{ background: BG_INSET, color: MUTED }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {receipt.backup_retention_notice && (
            <div className="rounded-lg p-3 mb-4 text-[11px]" style={{ background: 'rgba(245,196,81,0.06)', border: `1px solid ${HAIR}`, color: MUTED, lineHeight: 1.7 }}>
              <div className="flex items-start gap-2">
                <span style={{ color: GOLD_BRIGHT, display: 'flex', flexShrink: 0, marginTop: 1 }}><VaultIcon name="clock" size={13} /></span>
                <span>{receipt.backup_retention_notice}</span>
              </div>
            </div>
          )}

          <button
            onClick={finishAndLeave}
            className="px-5 py-2.5 rounded-full text-xs font-semibold transition hover:brightness-110 inline-flex items-center gap-1.5"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
          >
            <VaultIcon name="arrow_left" size={13} /> Return to the landing page
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="pv-heading" className="space-y-4">
      <div className="flex items-center gap-2" style={{ color: ACCENT }}>
        <VaultIcon name="lock" size={17} />
        <h3 id="pv-heading" className="text-sm font-semibold" style={{ color: IVORY }}>Your data &amp; privacy</h3>
      </div>

      {/* ── 1. Data summary ── */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm mb-1" style={{ color: IVORY }}>What this vault holds</div>
        <p className="text-xs mb-4" style={{ color: MUTED, lineHeight: 1.7 }}>
          This is everything preserved here for you, in plain terms. You are always in control of it — you can take a
          copy at any time, and you can remove it entirely.
        </p>

        {loading ? (
          <div className="py-4 flex justify-center items-center gap-2" aria-live="polite">
            <div className="w-5 h-5 rounded-full animate-spin" style={{ border: `2px solid ${HAIR}`, borderTopColor: ACCENT }} />
            <span className="sr-only">Loading your data summary…</span>
          </div>
        ) : loadError ? (
          <div className="text-xs" role="alert" style={{ color: '#e6a07a' }}>
            {loadError}{' '}
            <button onClick={load} className="underline hover:brightness-110" style={{ color: ACCENT }}>Try again</button>
          </div>
        ) : counts.length === 0 ? (
          <div className="text-xs" style={{ color: MUTED }}>Nothing is stored in this vault yet.</div>
        ) : (
          <ul className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {counts.map((c) => (
              <li key={c.store} className="px-3 py-2.5 rounded-lg" style={{ background: BG_INSET, border: `1px solid ${HAIR}` }}>
                <div className="text-lg font-semibold" style={{ color: GOLD_BRIGHT }}>{c.count.toLocaleString()}</div>
                <div className="text-[11px]" style={{ color: MUTED }}>{c.label || labelFor(c.store)}</div>
              </li>
            ))}
          </ul>
        )}

        {retentionNotice && !loading && !loadError && (
          <div className="rounded-lg p-3 mt-4 text-[11px]" style={{ background: 'rgba(245,196,81,0.06)', border: `1px solid ${HAIR}`, color: MUTED, lineHeight: 1.7 }}>
            <div className="flex items-start gap-2">
              <span style={{ color: GOLD_BRIGHT, display: 'flex', flexShrink: 0, marginTop: 1 }}><VaultIcon name="clock" size={13} /></span>
              <span>{retentionNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Export / download ── */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm mb-1" style={{ color: IVORY }}>Download everything</div>
        <p className="text-xs mb-4" style={{ color: MUTED, lineHeight: 1.7 }}>
          Take a complete, machine-readable copy of this vault — memories, interviews, media references, consent, and
          history — as a single JSON file saved to your device. Yours to keep, forever.
        </p>

        {exportFeedback && (
          <div
            className="px-3 py-2 rounded-lg text-xs mb-3"
            role="status"
            style={{
              background: exportFeedback.type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(230,160,122,0.08)',
              border: `1px solid ${exportFeedback.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(230,160,122,0.35)'}`,
              color: exportFeedback.type === 'success' ? '#7fe0b8' : '#e6a07a',
            }}
          >
            {exportFeedback.message}
          </div>
        )}

        <button
          onClick={doExport}
          disabled={exporting || !exportAvailable}
          className="px-5 py-2.5 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40 inline-flex items-center gap-1.5"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}
        >
          <VaultIcon name="crystal" size={13} /> {exporting ? 'Preparing your copy…' : 'Download everything'}
        </button>
        {!exportAvailable && (
          <div className="text-[11px] mt-2" style={{ color: MUTED }}>Export is temporarily unavailable. Please try again shortly.</div>
        )}
      </div>

      {/* ── 3. Danger zone ── */}
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: '1px solid rgba(230,160,122,0.35)' }}>
        <div className="text-[10px] font-semibold uppercase mb-2" style={{ color: '#e6a07a', letterSpacing: '0.12em' }}>
          Danger zone
        </div>
        <div className="text-sm mb-1" style={{ color: IVORY }}>Delete this vault permanently</div>
        <p className="text-xs mb-3" style={{ color: '#e6c8b4', lineHeight: 1.7 }}>
          This erases a preserved person. Every memory, interview, recording, and the model trained on their words will
          be removed and cannot be recovered. Please consider downloading a copy first. If you are certain, this is how
          it is done — plainly and completely.
        </p>

        {retentionNotice && (
          <p className="text-[11px] mb-4" style={{ color: MUTED, lineHeight: 1.7 }}>
            {retentionNotice}
          </p>
        )}

        {deleteError && (
          <div className="px-3 py-2 rounded-lg text-xs mb-3" role="alert" style={{ background: 'rgba(230,160,122,0.08)', border: '1px solid rgba(230,160,122,0.35)', color: '#e6a07a' }}>
            {deleteError}
          </div>
        )}

        <label htmlFor="pv-confirm" className="block text-xs mb-1.5" style={{ color: MUTED }}>
          To confirm, type <span className="font-mono font-semibold" style={{ color: '#e6a07a' }}>DELETE</span> below.
        </label>
        <input
          id="pv-confirm"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-describedby="pv-confirm-help"
          placeholder="DELETE"
          disabled={deleting}
          className="w-full mb-1 rounded-lg outline-none disabled:opacity-40"
          style={{ background: BG_INSET, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: IVORY, fontSize: 13 }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#e6a07a'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
        />
        <div id="pv-confirm-help" className="text-[10px] mb-4" style={{ color: MUTED }}>
          The button unlocks only when the word matches exactly.
        </div>

        <button
          onClick={doDelete}
          disabled={!canDelete}
          aria-disabled={!canDelete}
          className="px-5 py-2.5 rounded-full text-xs font-semibold transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          style={{ background: '#7f1d1d', border: '1px solid #b45454', color: '#fca5a5' }}
        >
          <VaultIcon name="lock" size={13} /> {deleting ? 'Deleting the vault…' : 'Permanently delete this vault'}
        </button>
      </div>
    </section>
  );
}
