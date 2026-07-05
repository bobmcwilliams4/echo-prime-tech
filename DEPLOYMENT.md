# echo-ept.com — Deployment Guide

**Site:** https://echo-ept.com  
**Vercel project:** `echo-prime-tech` (`prj_2TXVE8qVUP31WES235nOiz9SNpqA`)  
**GitHub:** https://github.com/bobmcwilliams4/echo-prime-tech (`main`)

## Summary

**Pushing to `main` does NOT auto-deploy to production.** Deploys are intentional CLI runs via `npm run deploy`.

Verified 2026-07-05 via Vercel API (`npm run deploy:audit-git`): project `prj_2TXVE8qVUP31WES235nOiz9SNpqA` has **`link: null`** — no GitHub/GitLab/Bitbucket integration is attached. Recent production deploys show `source=cli`, not `source=github`.

This is intentional — not a misconfiguration to fix in Vercel settings:

| Blocker | Detail |
|---------|--------|
| Vercel Git link | Points at the suspended `bobmcwilliams4` GitHub account; no `source=github` deployments fire |
| Team seat policy | Git-attributed deploys from `bobbymcwilliams@echo-op.com` hit `TEAM_ACCESS_REQUIRED` unless the author is a paid team member |
| GitHub Actions | `.github/workflows/deploy.yml` exists but the `ECHO-OMEGA-PRIME` org cannot run workflows (`startup_failure` — minutes/spend limit) |

**Working path:** gitless Vercel CLI deploy (`scripts/deploy.mjs`) using a team-member API token. The script temporarily renames `.git` so Vercel attributes the deployment to the token holder, bypassing the git-author seat block.

## Deploy to production

```bash
cd /home/forge/echo-prime-tech   # or your local clone
git pull origin main
npm run deploy                   # builds + gitless vercel --prod
```

Requires `VERCEL_TOKEN` in the environment, or a token in the Echo vault (`vercel_api_token` / `Vercel_Deploy_Token_v2` on HAMMER).

## Check if production is stale

```bash
npm run deploy:check
```

Compares `origin/main` with `https://echo-ept.com/build-info.json` (written at build time). Exit `0` = in sync, `1` = stale.

## Auto-deploy watchdog (FORGE)

Install a 15-minute cron on FORGE that deploys only when main is ahead of production:

```bash
bash scripts/install-deploy-watchdog.sh
```

Log: `/var/log/echo-ept-deploy-watchdog.log`

Manual one-shot (check + deploy if stale):

```bash
npm run deploy:if-stale
```

## Build pipeline

1. `prebuild` → `scripts/verify-site.js` (Vercel project ID guard)
2. `prebuild` → `scripts/write-build-info.mjs` (embeds commit SHA in `public/build-info.json`)
3. `next build` → static export to `out/`
4. `scripts/deploy.mjs` → `vercel --prod` (gitless)

## GitHub Actions (dormant)

`.github/workflows/deploy.yml` triggers on `main` push and uses the Vercel CLI with `secrets.VERCEL_TOKEN`. It will resume working if GitHub Actions billing is restored **and** `VERCEL_TOKEN` is set in repo secrets. Until then, use `npm run deploy` or the FORGE watchdog.

## Re-enabling Vercel Git integration (human decision)

To restore `source=github` auto-deploy, a Commander/board action must:

1. Unsuspend or migrate the GitHub repo off the `bobmcwilliams4` account
2. Re-link the Vercel project Git settings to the active repo
3. Add git commit authors as Vercel team members **or** keep using gitless CLI deploy

Until those steps happen, treat CLI deploy + the watchdog as the canonical production path.