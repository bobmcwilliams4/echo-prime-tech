#!/usr/bin/env node
/**
 * smoke:vault — Immortality Vault apex + separation checks
 *
 * Asserts the production acceptance criteria from iv-resolve-root-307:
 *   curl https://immortalityvault.app/  →  HTTP 200 (no 307) AND body contains
 *   "Preserve Your Legacy" (vault marker; EPT root does not contain it).
 *
 * Also validates static-export host-root plumbing when `out/` is present.
 *
 * Usage:
 *   npm run smoke:vault              # local config + optional out/ + prod
 *   SMOKE_VAULT_SKIP_PROD=1 npm run smoke:vault
 *   SMOKE_VAULT_PROD_ONLY=1 npm run smoke:vault
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'out');
const PROD = process.env.SMOKE_VAULT_URL || 'https://immortalityvault.app';
const SKIP_PROD = process.env.SMOKE_VAULT_SKIP_PROD === '1';
const PROD_ONLY = process.env.SMOKE_VAULT_PROD_ONLY === '1';

let passed = 0;
let failed = 0;
const failures = [];

function ok(name, detail = '') {
  passed += 1;
  console.log(`  ✅  ${name}${detail ? ` — ${detail}` : ''}`);
}
function fail(name, detail = '') {
  failed += 1;
  failures.push(`${name}: ${detail}`);
  console.error(`  ❌  ${name}${detail ? ` — ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n▸ ${title}`);
}

/* ── 1. Separation guard ─────────────────────────────────────────── */
function checkSeparation() {
  section('Vault separation (verify-vault-separation.js)');
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'verify-vault-separation.js')], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (r.status === 0) ok('separation guard', (r.stdout || '').trim().split('\n').pop());
  else fail('separation guard', (r.stderr || r.stdout || 'exit ' + r.status).trim().slice(0, 300));
}

/* ── 2. vercel.json host rewrites (not 307 redirects) ────────────── */
function checkVercelConfig() {
  section('vercel.json host apex routing');
  const raw = readFileSync(join(ROOT, 'vercel.json'), 'utf8');
  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch (e) {
    fail('vercel.json parse', String(e));
    return;
  }
  const rewrites = cfg.rewrites || [];
  const redirects = cfg.redirects || [];

  const vaultRewrites = rewrites.filter(
    (r) =>
      r.source === '/' &&
      Array.isArray(r.has) &&
      r.has.some(
        (h) =>
          h.type === 'host' &&
          (h.value === 'immortalityvault.app' || h.value === 'www.immortalityvault.app'),
      ) &&
      String(r.destination || '').includes('immortality-vault'),
  );
  if (vaultRewrites.length >= 2) ok('host rewrites for apex + www', `${vaultRewrites.length} rules → /immortality-vault`);
  else fail('host rewrites for apex + www', `expected 2, found ${vaultRewrites.length}`);

  const eptDefault = rewrites.find(
    (r) => r.source === '/' && !r.has && String(r.destination || '').includes('ept-home'),
  );
  if (eptDefault) ok('default apex rewrite', eptDefault.destination);
  else fail('default apex rewrite', 'missing / → /ept-home (required once index.html is relocated)');

  const vaultRedirects = redirects.filter(
    (r) =>
      r.source === '/' &&
      Array.isArray(r.has) &&
      r.has.some(
        (h) =>
          h.type === 'host' &&
          String(h.value || '').includes('immortalityvault'),
      ),
  );
  if (vaultRedirects.length === 0) ok('no vault host 307/308 redirects', 'apex is rewrite-served (200)');
  else fail('no vault host 307/308 redirects', `still have ${vaultRedirects.length} host redirect(s)`);
}

/* ── 3. package.json build wires prepare-host-roots ──────────────── */
function checkBuildWire() {
  section('build pipeline wire-up');
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const build = pkg.scripts?.build || '';
  if (build.includes('prepare-host-roots')) ok('build runs prepare-host-roots', build);
  else fail('build runs prepare-host-roots', `scripts.build = ${JSON.stringify(build)}`);
  if (pkg.scripts?.['smoke:vault']) ok('smoke:vault script present');
  else fail('smoke:vault script present', 'missing package.json scripts.smoke:vault');
  if (existsSync(join(ROOT, 'scripts', 'prepare-host-roots.mjs'))) ok('prepare-host-roots.mjs present');
  else fail('prepare-host-roots.mjs present', 'file missing');
}

/* ── 4. Local out/ (when built) ──────────────────────────────────── */
function checkLocalOut() {
  section('local static export (out/)');
  if (!existsSync(OUT)) {
    console.log('  ↷  out/ not present — skip local export checks (run npm run build first)');
    return;
  }
  if (existsSync(join(OUT, 'index.html'))) {
    fail(
      'out/index.html relocated',
      'apex index.html still present — prepare-host-roots did not run or failed',
    );
  } else {
    ok('out/index.html relocated', 'apex free for host rewrites');
  }
  const ept = join(OUT, 'ept-home.html');
  if (existsSync(ept)) {
    const body = readFileSync(ept, 'utf8');
    if (/Echo Prime Technologies/i.test(body) && !/Preserve Your Legacy/i.test(body)) {
      ok('ept-home.html is EPT root', 'has EPT title/marker, no vault marker');
    } else if (/Echo Prime Technologies/i.test(body)) {
      ok('ept-home.html is EPT root', 'contains Echo Prime Technologies');
    } else {
      fail('ept-home.html is EPT root', 'missing EPT marker');
    }
  } else {
    fail('ept-home.html is EPT root', 'file missing');
  }

  const vaultPaths = [
    join(OUT, 'immortality-vault.html'),
    join(OUT, 'immortality-vault', 'index.html'),
  ];
  const vaultPath = vaultPaths.find((p) => existsSync(p));
  if (!vaultPath) {
    fail('vault landing in out/', 'immortality-vault.html not found');
  } else {
    const body = readFileSync(vaultPath, 'utf8');
    if (/Preserve Your Legacy/i.test(body)) ok('vault landing marker', vaultPath.replace(OUT + '/', ''));
    else fail('vault landing marker', 'missing "Preserve Your Legacy"');
    if (/Immortality Vault/i.test(body)) ok('vault title present in HTML');
    else fail('vault title present in HTML', 'missing Immortality Vault');
  }

  if (existsSync(join(OUT, '.host-roots.json'))) ok('host-roots marker written');
  else fail('host-roots marker written', 'out/.host-roots.json missing');
}

/* ── 5. Production apex ──────────────────────────────────────────── */
async function checkProd() {
  section(`production apex (${PROD}/)`);
  if (SKIP_PROD) {
    console.log('  ↷  SMOKE_VAULT_SKIP_PROD=1 — skipping live curl');
    return;
  }
  try {
    const res = await fetch(PROD + '/', { redirect: 'manual' });
    const status = res.status;
    const location = res.headers.get('location') || '';
    if (status === 200) ok('HTTP 200 (no redirect)', `status=${status}`);
    else if ([301, 302, 307, 308].includes(status)) {
      fail('HTTP 200 (no redirect)', `got ${status} → ${location}`);
    } else {
      fail('HTTP 200 (no redirect)', `status=${status}`);
    }

    // Follow once for body inspection if redirected (still report fail above)
    let body = '';
    if (status === 200) {
      body = await res.text();
    } else if (location) {
      const abs = location.startsWith('http') ? location : new URL(location, PROD).href;
      const res2 = await fetch(abs, { redirect: 'follow' });
      body = await res2.text();
    }

    if (/Preserve Your Legacy/i.test(body)) ok('body contains "Preserve Your Legacy"');
    else fail('body contains "Preserve Your Legacy"', 'vault marker not found (EPT root or empty?)');

    const title = (body.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
    if (/Immortality Vault/i.test(title) && /Preserve Your Legacy/i.test(title)) {
      ok('document title', title.trim());
    } else if (/Preserve Your Legacy/i.test(body)) {
      // Soft: marker is definitive per acceptance; title is live-verify nice-to-have
      console.log(`  ⚠  title is ${JSON.stringify(title.trim())} (marker present — acceptable)`);
    } else {
      fail('document title', title || '(none)');
    }

    // Negative: must not be pure EPT homepage without vault marker
    if (/Echo Prime Technologies/i.test(body) && !/Preserve Your Legacy/i.test(body)) {
      fail('not EPT homepage', 'body looks like echo-ept root');
    } else {
      ok('not EPT-only homepage');
    }
  } catch (e) {
    fail('production fetch', String(e));
  }
}

async function main() {
  console.log('smoke:vault — Immortality Vault apex + separation\n');
  if (!PROD_ONLY) {
    checkSeparation();
    checkVercelConfig();
    checkBuildWire();
    checkLocalOut();
  }
  await checkProd();

  console.log(`\n── results: ${passed} passed, ${failed} failed ──`);
  if (failed) {
    console.error('\nFailures:');
    for (const f of failures) console.error('  •', f);
    process.exit(1);
  }
  console.log('\n✅  smoke:vault green');
}

main();
