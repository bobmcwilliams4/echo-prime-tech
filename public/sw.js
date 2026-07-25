/* Immortality Vault — Service Worker (P3 slice 2)
 *
 * Background Sync bridge for resumable video uploads. When connectivity returns,
 * the browser fires a `sync` event for the `vault-upload` tag even if the tab was
 * backgrounded; we wake any open Vault client and tell it to drain its IndexedDB
 * upload queue. The client owns the drain because it holds the Firebase ID token
 * required by the API (a SW cannot mint one) — so this SW is a *trigger*, not the
 * uploader itself. Feature-detected + no-op where Background Sync is unsupported
 * (e.g. iOS Safari); the in-app `online`-event drain covers those browsers.
 *
 * No fetch handler on purpose: this SW must never intercept navigation/requests
 * for the rest of the site. Static file — CSP-safe, no inline eval.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

async function notifyClientsToDrain() {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of clients) {
    client.postMessage({ type: 'vault-drain' });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'vault-upload') {
    event.waitUntil(notifyClientsToDrain());
  }
});

// Allow a page to explicitly ask for a drain nudge (e.g. right after queuing).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'vault-drain-request') {
    event.waitUntil(notifyClientsToDrain());
  }
});
