/* Immortality Vault — Durable Capture Queue (IndexedDB)
 *
 * P3 slice 2: a recording's chunks (Blobs) are persisted to IndexedDB the moment
 * MediaRecorder hands them over, keyed by (capture_uuid, index). Even if the tab
 * closes, the network drops, or the API blips mid-upload, nothing is lost — the
 * resumable uploader re-reads status and re-sends only the missing indexes, and
 * a capture is only removed from IndexedDB AFTER a successful server finalize.
 *
 * Static-export / CSP-safe: pure IndexedDB, no inline eval, no external deps.
 */

const DB_NAME = 'vault-upload-queue';
const DB_VERSION = 1;
const STORE_CAPTURES = 'captures';
const STORE_CHUNKS = 'chunks';

export type CaptureStatus = 'recording' | 'pending' | 'uploading';

/** Metadata describing one durable capture (one recording). */
export interface CaptureMeta {
  /** Client UUID matching [A-Za-z0-9._-]{1,200} — the server's capture key. */
  capture_uuid: string;
  user_id: string;
  question_id?: string;
  interview_id?: string;
  /** Null until the recorder stops and we know the final chunk count. */
  total_chunks: number | null;
  duration_seconds?: number;
  mime_type?: string;
  status: CaptureStatus;
  created_at: number;
}

/** What the caller supplies to start a durable capture. */
export type EnqueueCaptureInput = Pick<CaptureMeta, 'capture_uuid' | 'user_id'> &
  Partial<Pick<CaptureMeta, 'question_id' | 'interview_id' | 'mime_type' | 'duration_seconds'>>;

interface ChunkRecord {
  capture_uuid: string;
  index: number;
  blob: Blob;
}

let dbPromise: Promise<IDBDatabase> | null = null;

/** True only in a browser with IndexedDB (guards SSR / static-export build). */
export function isUploadQueueSupported(): boolean {
  return typeof indexedDB !== 'undefined';
}

/** Mint a fresh capture_uuid matching the server's [A-Za-z0-9._-]{1,200}. */
export function mintCaptureUuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `cap-${crypto.randomUUID()}`;
    }
  } catch { /* fall through */ }
  return `cap-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_CAPTURES)) {
        db.createObjectStore(STORE_CAPTURES, { keyPath: 'capture_uuid' });
      }
      if (!db.objectStoreNames.contains(STORE_CHUNKS)) {
        const chunks = db.createObjectStore(STORE_CHUNKS, { keyPath: ['capture_uuid', 'index'] });
        chunks.createIndex('by_capture', 'capture_uuid', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  });
  return dbPromise;
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction error'));
  });
}

function reqResult<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

/* ─── Public API ─────────────────────────────────────────────────────── */

/** Register a new capture before its first chunk arrives. Idempotent per uuid. */
export async function enqueueCapture(input: EnqueueCaptureInput): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_CAPTURES, 'readwrite');
  const meta: CaptureMeta = {
    capture_uuid: input.capture_uuid,
    user_id: input.user_id,
    question_id: input.question_id,
    interview_id: input.interview_id,
    mime_type: input.mime_type,
    duration_seconds: input.duration_seconds,
    total_chunks: null,
    status: 'recording',
    created_at: Date.now(),
  };
  tx.objectStore(STORE_CAPTURES).put(meta);
  await txDone(tx);
}

/** Persist one recorder chunk. Safe to call repeatedly for the same index. */
export async function putChunk(captureUuid: string, index: number, blob: Blob): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_CHUNKS, 'readwrite');
  const rec: ChunkRecord = { capture_uuid: captureUuid, index, blob };
  tx.objectStore(STORE_CHUNKS).put(rec);
  await txDone(tx);
}

/** Finalize the recording: record the final chunk count and flip to 'pending'
 *  so the drain loop will pick it up. Optionally patch late-known metadata. */
export async function markTotal(
  captureUuid: string,
  total: number,
  patch?: Partial<Pick<CaptureMeta, 'duration_seconds' | 'mime_type'>>,
): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_CAPTURES, 'readwrite');
  const store = tx.objectStore(STORE_CAPTURES);
  const existing = await reqResult(store.get(captureUuid) as IDBRequest<CaptureMeta | undefined>);
  if (existing) {
    existing.total_chunks = total;
    existing.status = 'pending';
    if (patch?.duration_seconds != null) existing.duration_seconds = patch.duration_seconds;
    if (patch?.mime_type) existing.mime_type = patch.mime_type;
    store.put(existing);
  }
  await txDone(tx);
}

/** Update a capture's status (e.g. 'uploading' while a drain runs). */
export async function setCaptureStatus(captureUuid: string, status: CaptureStatus): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_CAPTURES, 'readwrite');
  const store = tx.objectStore(STORE_CAPTURES);
  const existing = await reqResult(store.get(captureUuid) as IDBRequest<CaptureMeta | undefined>);
  if (existing) {
    existing.status = status;
    store.put(existing);
  }
  await txDone(tx);
}

/** One capture's metadata, or null if it's gone. */
export async function getCapture(captureUuid: string): Promise<CaptureMeta | null> {
  const db = await openDb();
  const tx = db.transaction(STORE_CAPTURES, 'readonly');
  const res = await reqResult(tx.objectStore(STORE_CAPTURES).get(captureUuid) as IDBRequest<CaptureMeta | undefined>);
  return res ?? null;
}

/** Every capture that has been fully recorded (total known) and not yet
 *  finalized on the server. Sorted oldest-first so retries drain in order. */
export async function listPending(): Promise<CaptureMeta[]> {
  const db = await openDb();
  const tx = db.transaction(STORE_CAPTURES, 'readonly');
  const all = await reqResult(tx.objectStore(STORE_CAPTURES).getAll() as IDBRequest<CaptureMeta[]>);
  return all
    .filter(c => c.total_chunks != null && (c.status === 'pending' || c.status === 'uploading'))
    .sort((a, b) => a.created_at - b.created_at);
}

/** The chunk indexes currently held locally for a capture (ascending). */
export async function getChunkIndexes(captureUuid: string): Promise<number[]> {
  const db = await openDb();
  const tx = db.transaction(STORE_CHUNKS, 'readonly');
  const idx = tx.objectStore(STORE_CHUNKS).index('by_capture');
  const keys = await reqResult(idx.getAllKeys(IDBKeyRange.only(captureUuid)) as IDBRequest<IDBValidKey[]>);
  // keyPath is [capture_uuid, index] → each key is a [uuid, index] tuple.
  return keys
    .map(k => (Array.isArray(k) ? Number(k[1]) : Number(k)))
    .sort((a, b) => a - b);
}

/** Read one stored chunk's bytes, or null if absent. */
export async function getChunkBlob(captureUuid: string, index: number): Promise<Blob | null> {
  const db = await openDb();
  const tx = db.transaction(STORE_CHUNKS, 'readonly');
  const rec = await reqResult(
    tx.objectStore(STORE_CHUNKS).get([captureUuid, index]) as IDBRequest<ChunkRecord | undefined>,
  );
  return rec ? rec.blob : null;
}

/** Remove a capture and ALL its chunks. Only ever called after a successful
 *  server finalize — this is the single point a capture leaves durable storage. */
export async function removeCapture(captureUuid: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([STORE_CAPTURES, STORE_CHUNKS], 'readwrite');
  tx.objectStore(STORE_CAPTURES).delete(captureUuid);
  const chunkStore = tx.objectStore(STORE_CHUNKS);
  const idx = chunkStore.index('by_capture');
  const keys = await reqResult(idx.getAllKeys(IDBKeyRange.only(captureUuid)) as IDBRequest<IDBValidKey[]>);
  for (const k of keys) chunkStore.delete(k);
  await txDone(tx);
}
