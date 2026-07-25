'use client';

/* Immortality Vault — Upload Sync Manager (P3 slice 2)
 *
 * Renders nothing. Wires the durable resumable-upload drain at the app level:
 *   1. startAutoDrain() — drain on load + on every `online` event (works
 *      everywhere, including browsers without Background Sync).
 *   2. Registers /sw.js (scoped to the vault) and, when supported, a
 *      `vault-upload` Background Sync so a backgrounded tab is woken to drain
 *      when connectivity returns. The SW only *triggers* the drain (postMessage
 *      → this client), because the client holds the Firebase token the API needs.
 *
 * Every capability is feature-detected and fails soft — the core upload path
 * keeps working with none of it.
 */

import { useEffect } from 'react';
import { drainQueue, startAutoDrain } from '../lib/resumable-uploader';

export default function UploadSyncManager() {
  useEffect(() => {
    // In-app drain (load + online). Covers all browsers.
    const stopAutoDrain = startAutoDrain();

    // Service worker + Background Sync (progressive enhancement).
    let onSwMessage: ((e: MessageEvent) => void) | null = null;
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      onSwMessage = (e: MessageEvent) => {
        if (e.data && e.data.type === 'vault-drain') void drainQueue();
      };
      navigator.serviceWorker.addEventListener('message', onSwMessage);

      navigator.serviceWorker
        .register('/sw.js', { scope: '/immortality-vault/' })
        .then(async (reg) => {
          // Register a one-off Background Sync where supported (Chromium). iOS
          // Safari / Firefox lack `reg.sync` → silently skip.
          const syncMgr = (reg as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }).sync;
          if (syncMgr) {
            try { await syncMgr.register('vault-upload'); } catch { /* transient — in-app drain still covers it */ }
          }
        })
        .catch(() => { /* SW unavailable — in-app drain still covers it */ });
    }

    return () => {
      stopAutoDrain();
      if (onSwMessage && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
      }
    };
  }, []);

  return null;
}
