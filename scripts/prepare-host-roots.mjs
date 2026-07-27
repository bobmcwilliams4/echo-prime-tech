#!/usr/bin/env node
/**
 * prepare-host-roots.mjs
 *
 * Static-export host split for multi-domain apex routing.
 *
 * Problem: Next `output: 'export'` writes a real `out/index.html` (EPT homepage).
 * On Vercel static hosting, an existing file for `/` wins over host-scoped
 * rewrites — so immortalityvault.app/ always served the EPT root even when
 * vercel.json rewrote `/` → `/immortality-vault`. Host redirects (307) worked
 * but left the apex without a title/content (acceptance requires 200 + vault).
 *
 * Fix: after `next build`, move the EPT apex off `/` into `ept-home.html` so
 * `/` has no filesystem match. vercel.json host rewrites then serve:
 *   immortalityvault.app  →  /immortality-vault  (200, vault HTML)
 *   everything else       →  /ept-home           (200, EPT HTML)
 *
 * Wired into package.json `build` (post next build). Do not remove.
 */
import {
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'out');

function die(msg) {
  console.error(`❌  prepare-host-roots: ${msg}`);
  process.exit(1);
}

function moveIfExists(src, dest) {
  if (!existsSync(src)) return false;
  mkdirSync(join(dest, '..'), { recursive: true });
  if (existsSync(dest)) {
    // Overwrite stale target from a prior partial run
    renameSync(dest, `${dest}.bak_prepare_host_roots`);
  }
  renameSync(src, dest);
  return true;
}

if (!existsSync(OUT)) {
  die(`missing ${OUT} — run next build first`);
}

// Next static export (trailingSlash: false) emits apex as index.html + index.txt
const apexHtml = join(OUT, 'index.html');
const apexTxt = join(OUT, 'index.txt');
const eptHomeHtml = join(OUT, 'ept-home.html');
const eptHomeTxt = join(OUT, 'ept-home.txt');

// Vault landing must exist for the host rewrite destination
const vaultCandidates = [
  join(OUT, 'immortality-vault.html'),
  join(OUT, 'immortality-vault', 'index.html'),
];
const vaultHtml = vaultCandidates.find((p) => existsSync(p));
if (!vaultHtml) {
  die('vault landing HTML missing (immortality-vault.html or immortality-vault/index.html)');
}

const vaultBody = readFileSync(vaultHtml, 'utf8');
if (!/Preserve Your Legacy/i.test(vaultBody)) {
  die(`vault HTML at ${vaultHtml} lacks "Preserve Your Legacy" marker`);
}

// Idempotent: already prepared (e.g. postbuild after build already ran this)
if (!existsSync(apexHtml) && existsSync(eptHomeHtml)) {
  console.log('✅  prepare-host-roots: already applied (ept-home.html present, no index.html)');
  process.exit(0);
}

if (!existsSync(apexHtml)) {
  die('out/index.html missing — unexpected export layout (and ept-home.html not present)');
}

// Relocate EPT apex so `/` is free for host rewrites
const movedHtml = moveIfExists(apexHtml, eptHomeHtml);
const movedTxt = moveIfExists(apexTxt, eptHomeTxt);
if (!movedHtml) die('failed to move out/index.html → out/ept-home.html');

// Also handle rare directory-style apex (trailingSlash: true)
const apexDir = join(OUT, 'index');
if (existsSync(apexDir) && statSync(apexDir).isDirectory()) {
  const destDir = join(OUT, 'ept-home');
  if (!existsSync(destDir)) {
    renameSync(apexDir, destDir);
  }
}

// Ensure no residual apex index.html remains (would defeat rewrites)
if (existsSync(apexHtml)) {
  die('out/index.html still present after move — aborting to avoid EPT apex leak');
}

// Marker file for smoke:vault / operators
writeFileSync(
  join(OUT, '.host-roots.json'),
  JSON.stringify(
    {
      preparedAt: new Date().toISOString(),
      eptHome: 'ept-home.html',
      vaultHome: existsSync(join(OUT, 'immortality-vault.html'))
        ? 'immortality-vault.html'
        : 'immortality-vault/index.html',
      note: 'Apex / is intentionally empty; vercel.json host rewrites serve ept-home or vault.',
    },
    null,
    2,
  ),
);

console.log('✅  prepare-host-roots: EPT apex → /ept-home.html; / free for host rewrites');
console.log(`    vault destination: ${vaultHtml.replace(OUT + '/', '')}`);
console.log(`    moved: index.html${movedTxt ? ' + index.txt' : ''}`);
