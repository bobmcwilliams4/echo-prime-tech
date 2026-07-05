#!/usr/bin/env node
// Embeds the git commit SHA into the static export so production drift is detectable.
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'public', 'build-info.json');

function resolveSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const sha = resolveSha();
let shortSha = sha;
if (sha.length >= 7 && sha !== 'unknown') shortSha = sha.slice(0, 7);

const info = {
  site_id: 'echo-ept.com',
  commit_sha: sha,
  commit_short: shortSha,
  built_at: new Date().toISOString(),
  deploy_method: process.env.VERCEL ? 'vercel' : 'local',
};

mkdirSync(join(ROOT, 'public'), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(info, null, 2)}\n`);
console.log(`build-info: ${shortSha} → public/build-info.json`);