# Runbook — Operator (Day-2 Ops)

> Build #24413. Everything needed to run the Immortality Vault in production day to day: health
> checks, the SDK caps, restarting the service, where the logs are, common issues, and the deploy
> `.git__deploy_bak` gotcha. For incidents/breaches use [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md).

---

## 1. Service at a glance

| Thing | Value |
|---|---|
| Service | `echo-immortality-vault.service` (systemd, FORGE) |
| Command | `uvicorn app:app --host 0.0.0.0 --port 8162 --workers 2` |
| Code dir | FORGE `/home/forge/echo-immortality-vault/` |
| Entrypoint | `app.py` (~185 KB monolith) + modules (`bloodline_*`, `consent_gate`, `db_crypto`, `vault_crypto`, …) |
| Config / flags | `/home/forge/echo-immortality-vault/.env.secrets` |
| Public API | `https://vault-api.echo-op.com` (Cloudflare tunnel → FORGE :8162) |
| DB | Postgres `echo`, schema `vault`, FORGE `127.0.0.1:5432` |
| Media | `/home/forge/echo-immortality-vault/data/` (IVENC2) |
| Deps | Sentinel :8160 (LLM), echo-tts-v2 :7800 (TTS + refs) |
| Frontend | Vercel, `echo-ept.com/immortality-vault` (repo `echo-prime-tech`) |

**Feature flags that must be ON in prod:** `VAULT_AUTH_ENFORCE=1` (per-user ownership auth) and
`VAULT_STRICT=1` (no plaintext media at rest). Removing either reopens a closed security finding —
see [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md) §5.

---

## 2. Health checks

```bash
# Local (on FORGE):
ssh forge
curl -s localhost:8162/health                       # expect 200
systemctl status echo-immortality-vault --no-pager | tail -20

# Through the public tunnel:
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/health   # 200
curl -s https://vault-api.echo-op.com/stats                                     # aggregate counts

# Enforcement sanity (these MUST be 401 without a token):
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/memories/ANYUID        # 401
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/bloodline/ANYUID/tree  # 401
```

### Via SDK caps (aggregate-only, tier 0)

```
echo.immortality.health    # service liveness / health
echo.immortality.stats     # aggregate counts only (no per-user data)
```

These are the **only** caps exposed. Per-user private endpoints are deliberately not caps —
exposing them under the sovereign key would reopen the IDOR (see
[`../PRIVACY_ARCHITECTURE.md`](../PRIVACY_ARCHITECTURE.md) §7).

---

## 3. Restart / stop / start

```bash
ssh forge
systemctl restart echo-immortality-vault      # standard restart
systemctl stop echo-immortality-vault         # take the public API offline (fail-closed)
systemctl start echo-immortality-vault
systemctl status echo-immortality-vault --no-pager
```

> The service preloads under uvicorn with 2 workers. After a config/code change do a **full
> restart** (not a signal-only reload) so both workers pick up the new code — a partial reload can
> leave a stale worker serving old code.

---

## 4. Logs

```bash
ssh forge
journalctl -u echo-immortality-vault -f                 # live tail
journalctl -u echo-immortality-vault --since "-1h"      # last hour
journalctl -u echo-immortality-vault -p err --since today
```

Logging is structured. For a suspected data-exposure, capture logs to a file before they rotate —
see [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md) §3.

---

## 5. Tests (verification on FORGE)

```bash
ssh forge
cd /home/forge/echo-immortality-vault
python3 -m pytest tests/ -v                             # full suite, 44+ green baseline

# Targeted:
python3 -m pytest tests/test_idor.py -v                 # ownership/auth (F1) — 9/9
python3 -m pytest tests/test_crypto_rotation.py -v      # DEK rotation (F8) — 5/5
python3 -m pytest tests/test_crypto_tamper.py -v        # IVENC2 integrity — 6/6
python3 -m pytest tests/test_resumable_upload.py -v     # chunked upload — 6/6
python3 -m pytest tests/test_provenance_dedup.py -v     # evidence links — 3/3
python3 -m pytest tests/test_p3_slice3.py -v            # owner edits/timeline — 6/6
python3 -m pytest tests/test_p4_personas.py -v          # training consent/isolation — 9/9
```

Run the relevant suite after any backend change and before promoting. No change is "done" on a
self-report — attach passing tests + a live probe.

---

## 6. Deploy (frontend) + the `.git__deploy_bak` gotcha

Deploy is **gitless via the Vercel CLI** (`scripts/deploy.mjs`, run by `npm run deploy` from the
repo root). GitHub Actions are blocked for ECHO-OMEGA-PRIME and the Vercel git link is stale, so
the script attributes the deploy to the token account. `VERCEL_TOKEN` = vault
`Vercel_Deploy_Token_v2`.

**The gotcha:** the script renames `.git` → `.git__deploy_bak` during the deploy so it is
token-attributed, then restores it in a `finally`. If the deploy is **interrupted** (Ctrl-C,
crash, killed shell) after the rename but before the `finally`, `.git` is left as
`.git__deploy_bak` and **every git command fails** with "not a git repository."

**Fix:**
```bash
cd C:\Users\bobmc\echo-prime-tech
ls -a | grep git__deploy_bak        # if present and .git is missing:
mv .git__deploy_bak .git            # restore; git works again
```
Always check for a stray `.git__deploy_bak` if git suddenly reports the repo is missing right
after a deploy.

Production-deploy discipline: build → boot on staging → live-smoke green (empty/missing fields,
each surface, security headers, real 404) → promote → health-check → auto-rollback on red. Redeploy
the last-known-good on any red.

---

## 7. Common issues

| Symptom | Cause | Fix |
|---|---|---|
| `git` says "not a git repository" right after a deploy | Interrupted deploy left `.git__deploy_bak` | `mv .git__deploy_bak .git` (§6) |
| Voice synth / voice interview / cloning fails | TTS incident **#24546** (`echo-convai-tts` won't load, HF offline-cache miss) | Known-blocked; `voice_id` stays NULL until #24546 clears. Not a Vault bug |
| Sensitive route returns 401 for a logged-in user | Token missing/expired, or `uid` ≠ resource owner | Confirm the client attaches `Authorization: Bearer <idToken>`; re-auth; 401 for a cross-user id is correct |
| Media stream 500 / decrypt error | DEK unresolvable, or a non-IVENC2 file hit `VAULT_STRICT` | Confirm DEK resolves from master vault; investigate the stray plaintext file — **do not** disable `VAULT_STRICT` |
| Capture UI won't mount | Consent not active (fail-closed) | Check `GET /consent/{uid}` posture and `vault.biometric_consent`; this is correct behavior, not a bug |
| Stale worker serving old code | Signal-reload instead of full restart | `systemctl restart echo-immortality-vault` (full restart) |
| Backup timer stale / last run failed | Timer stopped / dependency issue | `systemctl list-timers`, restart the timer/service; see [`BACKUP_RESTORE.md`](./BACKUP_RESTORE.md) |
| `/stats` 200 but per-user routes all 401 | Working as designed | Public surface is intact; per-user needs owner auth |

---

## 8. Routine (day-2) checklist

- [ ] `/health` 200 local + through the tunnel.
- [ ] Enforcement flags on: `grep -E 'VAULT_AUTH_ENFORCE|VAULT_STRICT' .env.secrets` → both `=1`.
- [ ] No-token `/memories/ANYUID` → 401 (enforcement live).
- [ ] Backup timers scheduled + last run green; a recent `.dump` exists.
- [ ] No stray `.git__deploy_bak` in the repo.
- [ ] Dep services up: Sentinel :8160, Postgres :5432 (TTS :7800 known-degraded per #24546).
- [ ] Full pytest suite green after any change (44+).

---

## 9. Related docs

- Rotate keys: [`KEY_ROTATION.md`](./KEY_ROTATION.md)
- Backup / restore / drill: [`BACKUP_RESTORE.md`](./BACKUP_RESTORE.md)
- Breach / degradation: [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md)
- Consent lifecycle: [`CONSENT.md`](./CONSENT.md)
- Trust model: [`../PRIVACY_ARCHITECTURE.md`](../PRIVACY_ARCHITECTURE.md)
- Data inventory: [`../DATA_INVENTORY.md`](../DATA_INVENTORY.md)
