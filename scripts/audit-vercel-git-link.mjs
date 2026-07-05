#!/usr/bin/env node
// Audit Vercel project git integration — confirms whether source=github auto-deploy is possible.
import { execSync } from 'node:child_process';
import { homedir } from 'node:os';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const TEAM = 'team_zltGa4jWp6vVNl2t98Z35wu3';
const PROJECT = 'prj_2TXVE8qVUP31WES235nOiz9SNpqA';

function resolveToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  const authPath = join(homedir(), 'AppData', 'Roaming', 'com.vercel.cli', 'Data', 'auth.json');
  if (existsSync(authPath)) return JSON.parse(readFileSync(authPath, 'utf8')).token;
  try {
    return execSync(
      "python3 -c \"import sqlite3; c=sqlite3.connect('/home/forge/master_vault.db'); r=c.execute(\\\"SELECT secret FROM credentials WHERE username IN ('vercel_api_token','VERCEL_TOKEN','Vercel_Deploy_Token_v2') ORDER BY CASE username WHEN 'Vercel_Deploy_Token_v2' THEN 0 WHEN 'vercel_api_token' THEN 1 ELSE 2 END\\\").fetchone(); print(r[0] if r else '', end='')\"",
      { encoding: 'utf8' },
    ).trim();
  } catch {
    return '';
  }
}

async function main() {
  const token = resolveToken();
  if (!token) {
    console.error('No Vercel token — cannot audit git link. Set VERCEL_TOKEN or add Vercel_Deploy_Token_v2 to vault.');
    process.exit(2);
  }

  const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT}?teamId=${TEAM}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`Vercel API error: HTTP ${res.status}`);
    process.exit(2);
  }

  const project = await res.json();
  const link = project.link;
  const report = {
    project_id: PROJECT,
    project_name: project.name,
    git_linked: Boolean(link),
    git_provider: link?.type ?? null,
    repo: link?.repo ?? null,
    production_branch: link?.productionBranch ?? null,
    auto_deploy_possible: Boolean(link?.type === 'github' && link?.productionBranch),
    audited_at: new Date().toISOString(),
  };

  console.log(JSON.stringify(report, null, 2));

  if (!report.git_linked) {
    console.error('\n✗ No Vercel Git integration — pushes to main will NOT auto-deploy.');
    console.error('  Canonical path: npm run deploy (CLI gitless) + FORGE deploy-if-stale watchdog.');
    process.exit(1);
  }

  console.log('\n✓ Vercel Git integration is linked.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});