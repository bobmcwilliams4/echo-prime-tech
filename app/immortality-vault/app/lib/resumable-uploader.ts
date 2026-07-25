/* Immortality Vault — Resumable Uploader (P3 slice 2)
 *
 * Drives a durable capture from IndexedDB up to the server:
 *   status → upload only the MISSING indexes (exponential backoff) → finalize
 *   (handle 409 incomplete_upload by re-sending `missing`, then finalize again)
 *   → on a 200 record, removeCapture() and resolve.
 *
 * A capture is only ever removed from IndexedDB after a successful finalize, so
 * nothing is lost across reloads, offline periods, or transient API failures.
 * `drainQueue()` runs uploadCapture for every pending capture and is safe to call
 * on app load, on the `online` event, and from the service-worker sync handler.
 */

import {
  getUploadStatus, uploadVideoChunk, finalizeVideoUpload, IncompleteUploadError, type VideoMeta,
} from './vault-api';
import {
  getCapture, getChunkIndexes, getChunkBlob, removeCapture, listPending, setCaptureStatus,
  isUploadQueueSupported, type CaptureMeta,
} from './upload-queue';

/** Recommended chunk size (server contract). Recorder timeslices are already
 *  ≤ this; exported for callers that want to re-slice a single large blob. */
export const CHUNK_SIZE = 5 * 1024 * 1024;

const MAX_ATTEMPTS = 6;       // per-chunk / transient-op retries
const BASE_DELAY_MS = 1000;   // exponential backoff base
const MAX_DELAY_MS = 30_000;  // backoff ceiling
const FINALIZE_ROUNDS = 4;    // re-send-missing → finalize rounds

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Retry a transient op with exponential backoff + jitter. Never retries an
 *  IncompleteUploadError — that is handled one level up (re-send the missing). */
async function withBackoff<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof IncompleteUploadError) throw err;
      lastErr = err;
      if (attempt < MAX_ATTEMPTS - 1) {
        const backoff = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
        await delay(backoff + Math.random() * 250);
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** Upload every locally-held index the server is missing. */
async function sendMissing(meta: CaptureMeta, captureUuid: string, missing: number[]): Promise<void> {
  for (const idx of missing) {
    const blob = await getChunkBlob(captureUuid, idx);
    if (!blob) continue; // not held locally — server-side finalize will report it again
    await withBackoff(() => uploadVideoChunk(meta.user_id, captureUuid, idx, blob));
  }
}

/**
 * Push one durable capture to completion. Returns the server video record on
 * success, or null if the capture is unknown / not finished recording. Throws
 * only on a hard, non-recoverable failure (caller should LEAVE it queued).
 */
export async function uploadCapture(captureUuid: string): Promise<VideoMeta | null> {
  const meta = await getCapture(captureUuid);
  if (!meta || meta.total_chunks == null) return null; // still recording or gone
  const total = meta.total_chunks;

  await setCaptureStatus(captureUuid, 'uploading').catch(() => {});

  // 1. What does the server already hold?
  let received: number[] = [];
  try {
    const status = await withBackoff(() => getUploadStatus(meta.user_id, captureUuid));
    if (status.finalized) {
      // Already assembled server-side (idempotent finalize returns the record).
      const record = await withBackoff(() => finalizeVideoUpload(meta.user_id, captureUuid, finalizeOpts(meta, total)))
        .catch(() => null);
      await removeCapture(captureUuid);
      return record;
    }
    received = status.received || [];
  } catch {
    received = []; // status unavailable → assume nothing landed; chunk POST is idempotent
  }

  // 2. Upload every index we hold that the server does not.
  const serverHas = new Set(received);
  const localIndexes = await getChunkIndexes(captureUuid);
  const missing = localIndexes.filter(i => !serverHas.has(i));
  await sendMissing(meta, captureUuid, missing);

  // 3. Finalize, re-sending anything the server still says is missing.
  let record: VideoMeta | null = null;
  for (let round = 0; round < FINALIZE_ROUNDS; round++) {
    try {
      record = await withBackoff(() => finalizeVideoUpload(meta.user_id, captureUuid, finalizeOpts(meta, total)));
      break;
    } catch (err) {
      if (err instanceof IncompleteUploadError) {
        await sendMissing(meta, captureUuid, err.missing);
        continue;
      }
      throw err;
    }
  }
  if (!record) throw new Error('Finalize did not complete after retries');

  // 4. Only now is it safe to drop the capture from durable storage.
  await removeCapture(captureUuid);
  return record;
}

function finalizeOpts(meta: CaptureMeta, total: number) {
  return {
    total_chunks: total,
    ...(meta.question_id && { question_id: meta.question_id }),
    ...(meta.interview_id && { interview_id: meta.interview_id }),
    ...(meta.duration_seconds != null && { duration_seconds: meta.duration_seconds }),
    ...(meta.mime_type && { mime_type: meta.mime_type }),
  };
}

let draining = false;

/**
 * Attempt to upload every pending capture. Safe to call repeatedly and
 * concurrently (a re-entrant call no-ops while one is in flight). A capture that
 * fails is LEFT queued (status reset to 'pending') for the next drain.
 */
export async function drainQueue(): Promise<void> {
  if (draining || !isUploadQueueSupported()) return;
  draining = true;
  try {
    const pending = await listPending();
    for (const c of pending) {
      try {
        await uploadCapture(c.capture_uuid);
      } catch {
        await setCaptureStatus(c.capture_uuid, 'pending').catch(() => {});
      }
    }
  } catch {
    /* IndexedDB unavailable — nothing to drain */
  } finally {
    draining = false;
  }
}

let autoDrainWired = false;

/**
 * Wire automatic draining: drain now (app load) and again whenever connectivity
 * returns (`online`). Idempotent — wiring more than once is a no-op. Returns a
 * cleanup fn that removes the listener.
 */
export function startAutoDrain(): () => void {
  if (typeof window === 'undefined' || !isUploadQueueSupported()) return () => {};
  const onOnline = () => { void drainQueue(); };
  if (!autoDrainWired) {
    autoDrainWired = true;
    window.addEventListener('online', onOnline);
  }
  void drainQueue();
  return () => {
    window.removeEventListener('online', onOnline);
    autoDrainWired = false;
  };
}
