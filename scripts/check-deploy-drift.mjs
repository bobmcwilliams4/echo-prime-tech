#!/usr/bin/env node
// Compare origin/main with the commit SHA currently live on echo-ept.com.
// Exit 0 = in sync, 1 = stale (main ahead of prod), 2 = error/unknown.
import { execSync } from 'node:child_process';

const SITE = process.env.EPT_SITE_URL || 'https://echo-ept.com';
const BUILD_INFO_URL = `${SITE.replace(/\/$/, '')}/build-info.json`;

function fetchLiveSha() {
  const res = fetch(BUILD_INFO_URL, { headers: { Accept: 'application/json' } });
  return res.then(async (r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status} from ${BUILD_INFO_URL}`);
    const data = await r.json();
    if (!data.commit_sha || data.commit_sha === 'unknown') {
      throw new Error('build-info.json missing commit_sha');
    }
    return data.commit_sha;
  });
}

function resolveMainSha() {
  if (process.env.MAIN_SHA) return process.env.MAIN_SHA;
  try {
    execSync('git fetch origin main --quiet', { stdio: 'ignore' });
  } catch {
    // offline or no remote — fall back to local main
  }
  try {
    return execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim();
  } catch {
    return execSync('git rev-parse main', { encoding: 'utf8' }).trim();
  }
}

function isAncestor(ancestor, descendant) {
  try {
    execSync(`git merge-base --is-ancestor ${ancestor} ${descendant}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const mainSha = resolveMainSha();
  let liveSha;
  try {
    liveSha = await fetchLiveSha();
  } catch (err) {
    console.error(`Cannot read live build-info: ${err.message}`);
    console.error(`Production may predate build-info.json — treat as STALE until next deploy.`);
    console.log(JSON.stringify({ status: 'unknown', main_sha: mainSha, live_sha: null }));
    process.exit(1);
  }

  const same = mainSha === liveSha;
  const liveIsAhead = isAncestor(mainSha, liveSha) && mainSha !== liveSha;
  const mainIsAhead = isAncestor(liveSha, mainSha) && mainSha !== liveSha;

  const report = {
    status: same ? 'in_sync' : mainIsAhead ? 'stale' : liveIsAhead ? 'prod_ahead' : 'diverged',
    main_sha: mainSha,
    main_short: mainSha.slice(0, 7),
    live_sha: liveSha,
    live_short: liveSha.slice(0, 7),
    build_info_url: BUILD_INFO_URL,
  };
  console.log(JSON.stringify(report, null, 2));

  if (same) {
    console.log('✓ Production matches origin/main');
    process.exit(0);
  }
  if (mainIsAhead) {
    console.error(`✗ STALE: origin/main (${report.main_short}) is ahead of production (${report.live_short})`);
    console.error('  Run: npm run deploy');
    process.exit(1);
  }
  if (liveIsAhead) {
    console.error(`⚠ Production (${report.live_short}) is ahead of origin/main (${report.main_short}) — local main may need pull`);
    process.exit(1);
  }
  console.error(`✗ DIVERGED: main=${report.main_short} live=${report.live_short}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});