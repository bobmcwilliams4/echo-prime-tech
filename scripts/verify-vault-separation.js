/* ============================================================================
   verify-vault-separation.js  —  build-time guard (Commander directive 2026-07-07)

   The Immortality Vault is a STANDALONE product. It must never link back to
   echo-ept.com or wear EPT branding. This script scans every Vault source file
   and FAILS the build (exit 1) if it finds a link to an EPT route, an EPT design
   token, or the EPT logo. Wired into `prebuild` — do NOT remove it. If this ever
   fires, fix the link to stay inside /immortality-vault/*; don't disable the guard.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'app', 'immortality-vault');

// EPT routes a Vault page must never navigate to. (/immortality-vault/* is fine —
// these patterns require the route name to immediately follow the opening quote.)
const EPT_ROUTES = ['pricing', 'engines', 'docs', 'sentinel', 'closer', 'blog', 'about',
  'contact', 'title-intelligence', 'grading', 'tax-returns', 'tax', 'security', 'sdk',
  'pentesting', 'pipelines', 'builder', 'build', 'login', 'signup', 'account'];

const RULES = [
  { name: 'link to EPT route', re: new RegExp('(?:href|to)\\s*=\\s*["\'`]\\/(?:' + EPT_ROUTES.join('|') + ')(?=["\'`/?#])') },
  { name: 'push/replace to EPT route', re: new RegExp('(?:push|replace)\\(\\s*["\'`]\\/(?:' + EPT_ROUTES.join('|') + ')(?=["\'`/?#])') },
  { name: 'link to EPT homepage (bare "/")', re: /(?:href|to)\s*=\s*["'`]\/["'`]/ },
  { name: 'navigation to echo-ept.com', re: /(?:href\s*=|window\.location[^=\n]*=|(?:push|replace|assign)\()\s*["'`]https?:\/\/(?:www\.)?echo-ept\.com/ },
  { name: 'EPT design token (--ept-*)', re: /--ept-/ },
  { name: 'EPT logo asset', re: /logo-(?:day|night)/ },
];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

const violations = [];
for (const file of walk(ROOT)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        violations.push({ file: path.relative(path.join(__dirname, '..'), file), line: i + 1, rule: rule.name, text: line.trim().slice(0, 120) });
      }
    }
  });
}

if (violations.length) {
  console.error('\n❌  VAULT SEPARATION VIOLATION — the Immortality Vault must not link to EPT.\n');
  for (const v of violations) console.error(`   ${v.file}:${v.line}  [${v.rule}]\n      ${v.text}`);
  console.error(`\n   ${violations.length} violation(s). Point the link inside /immortality-vault/* (or a Vault-owned`);
  console.error('   endpoint). Do NOT disable this guard. See app/immortality-vault/SPEC.md.\n');
  process.exit(1);
}
console.log('✅  Vault separation verified — no EPT links or branding in /immortality-vault.');
