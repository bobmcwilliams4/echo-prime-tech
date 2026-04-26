/**
 * Centralised API origin resolver — v10-D33.4 frontend client refactor.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_API_ORIGIN` (forge.echo-op.com or sdk.echo-op.com when set)
 *      → used as the host; the original worker subdomain becomes a path prefix.
 *   2. `NEXT_PUBLIC_<WORKER>_BASE` per-worker override (escape hatch).
 *   3. Legacy fallback: `https://<worker>.bmcii1976.workers.dev` (current prod).
 *
 * The legacy default is intentional: D33.5 (named cloudflared tunnel) must land
 * before forge.echo-op.com / sdk.echo-op.com resolve to a real origin. Until
 * then `.env.production` does NOT set NEXT_PUBLIC_API_ORIGIN and prod stays on
 * workers.dev. Flip via Vercel env vars when D33.5 is verified live.
 */

const LEGACY_HOST = 'bmcii1976.workers.dev';

function envLookup(name: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

function envKeyForWorker(worker: string): string {
  return `NEXT_PUBLIC_${worker.toUpperCase().replace(/-/g, '_')}_BASE`;
}

/**
 * Resolve the base URL for a given Cloudflare worker subdomain.
 *
 * @param worker e.g. "daedalus-forge", "ept-api", "echo-engine-runtime"
 * @param channel optional: "forge" | "sdk" — picks which origin env to layer
 *                under when `NEXT_PUBLIC_API_ORIGIN` isn't set but a channel-
 *                specific one is. Defaults to "forge".
 */
export function getApiBase(worker: string, channel: 'forge' | 'sdk' = 'forge'): string {
  const perWorker = envLookup(envKeyForWorker(worker));
  if (perWorker) return perWorker.replace(/\/+$/, '');

  const channelOrigin = envLookup(`NEXT_PUBLIC_${channel.toUpperCase()}_ORIGIN`);
  const globalOrigin = envLookup('NEXT_PUBLIC_API_ORIGIN');
  const origin = channelOrigin || globalOrigin;
  if (origin) return `${origin.replace(/\/+$/, '')}/${worker}`;

  return `https://${worker}.${LEGACY_HOST}`;
}

/**
 * Resolve a websocket base URL for a given worker.
 * Mirrors getApiBase but emits wss:// against the resolved host.
 */
export function getWsBase(worker: string, channel: 'forge' | 'sdk' = 'forge'): string {
  const http = getApiBase(worker, channel);
  return http.replace(/^https?:/, http.startsWith('https') ? 'wss:' : 'ws:');
}
