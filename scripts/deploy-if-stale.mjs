#!/usr/bin/env node
// FORGE watchdog entrypoint: deploy only when origin/main is ahead of production.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  return r.status ?? 1;
}

const drift = run('node', ['scripts/check-deploy-drift.mjs']);
if (drift === 0) {
  console.log('No deploy needed — production is current.');
  process.exit(0);
}
if (drift === 2) {
  console.error('Drift check failed — not deploying.');
  process.exit(2);
}

console.log('Deploying stale production...');
const deploy = run('node', ['scripts/deploy.mjs']);
process.exit(deploy);