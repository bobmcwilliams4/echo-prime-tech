#!/usr/bin/env node
// Smoke test for deploy drift tooling (no network deploy).
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
let passed = 0;
let failed = 0;

function check(name, ok, detail = '') {
  if (ok) {
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
    passed++;
  } else {
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

console.log('deploy-drift smoke tests\n');

execSync('node scripts/write-build-info.mjs', { cwd: ROOT, stdio: 'pipe' });
const infoPath = join(ROOT, 'public', 'build-info.json');
check('write-build-info creates file', existsSync(infoPath));

const info = JSON.parse(readFileSync(infoPath, 'utf8'));
check('build-info has commit_sha', typeof info.commit_sha === 'string' && info.commit_sha.length >= 7);
check('build-info has site_id', info.site_id === 'echo-ept.com');

const mainSha = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();

let driftStdout = '';
let driftExit = 0;
try {
  driftStdout = execSync('node scripts/check-deploy-drift.mjs', {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, MAIN_SHA: mainSha, EPT_SITE_URL: 'http://127.0.0.1:9' },
  });
} catch (e) {
  driftExit = e.status ?? 1;
  driftStdout = `${e.stdout || ''}${e.stderr || ''}`;
}
check('check-deploy-drift runs', driftStdout.includes('status') || driftStdout.includes('main_sha'));
check('drift check handles missing live build-info', driftExit === 1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);