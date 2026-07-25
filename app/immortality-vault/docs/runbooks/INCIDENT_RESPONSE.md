# Runbook — Incident Response

> Build #24413. The playbook for a breach, a data-exposure suspicion, or a service degradation on
> the Immortality Vault. This product holds irreplaceable, deeply personal data — bias toward
> containment first, forensics second, and never toward "wait and see."

---

## 0. Severity & first move

| Sev | Trigger | First move |
|---|---|---|
| **SEV-1** | Confirmed or suspected unauthorized access to a user's private data; auth bypass; key/secret leak; data exfiltration | **Contain now** (§2), then §3 forensics. Escalate immediately (§6). |
| **SEV-2** | Service down / erroring for all users; crypto failing (decrypt errors); consent gate misbehaving | Stabilize (§4), assess blast radius, escalate if user-data integrity is in doubt. |
| **SEV-3** | Partial degradation (slow, one route failing, a timer stale) | Fix under [`OPERATOR.md`](./OPERATOR.md); log it. |

When in doubt, treat it as one level higher.

---

## 1. Triage — is private data actually exposed?

The single most important control (F1) is that every sensitive route requires a Firebase token +
ownership. Verify enforcement is live:

```bash
ssh forge
grep -E 'VAULT_AUTH_ENFORCE|VAULT_STRICT' /home/forge/echo-immortality-vault/.env.secrets
# both should be =1

# From anywhere (no token) — these MUST NOT return user data:
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/memories/ANYUID   # expect 401
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/bloodline/ANYUID/tree  # expect 401
# Public surface still works:
curl -s -o /dev/null -w '%{http_code}\n' https://vault-api.echo-op.com/stats           # expect 200
```

If a no-token call returns user data (not 401), you have an **active IDOR — SEV-1**. Contain
immediately (§2).

---

## 2. Contain (SEV-1)

Containment order — stop the bleeding before preserving evidence.

1. **If auth enforcement is off or bypassed:** the safest containment is to take the public API
   offline until fixed — the tunnel fronts a single service.
   ```bash
   ssh forge
   systemctl stop echo-immortality-vault     # public API goes dark (fail-closed)
   ```
   Do **not** "disable enforcement to keep it up" — enforcement is the control. Down-but-safe
   beats up-but-leaking for this product.

2. **If a key/secret leaked** (master-vault DEK, pgcrypto key, Firebase, Vercel token,
   `Vercel_Deploy_Token_v2`): rotate it immediately. Media DEK / pgcrypto → follow
   [`KEY_ROTATION.md`](./KEY_ROTATION.md). Service/API tokens → rotate in the vault and update
   `.env.secrets`, then restart.

3. **If exfiltration is suspected:** capture the current access logs (§3) before anything rolls
   or restarts them out of retention.

---

## 3. Forensics — preserve evidence

```bash
ssh forge
# Service logs (structured):
journalctl -u echo-immortality-vault --since "-6h" > /home/forge/backups/incident_$(date +%s)_journal.log

# Snapshot the current code + config for the record (do not overwrite):
cd /home/forge/echo-immortality-vault
cp app.py /home/forge/backups/incident_$(date +%s)_app.py

# DB state snapshot (encrypted values stay encrypted):
pg_dump -h localhost -U echo -d echo -n vault -F c \
  -f /home/forge/backups/incident_$(date +%s)_vault.dump
```

Determine: what was reachable, by whom, for how long. Cross-reference the tunnel/access logs with
the auth-enforcement state at the time. Record a timeline.

---

## 4. Degradation playbook (SEV-2)

| Symptom | Likely cause | Action |
|---|---|---|
| All routes 500 / service dead | Bad deploy, crash loop, dep down | `systemctl status echo-immortality-vault`; check `journalctl`; roll `app.py` from a `.pre_*_bak` ([`BACKUP_RESTORE.md`](./BACKUP_RESTORE.md) §4c); restart |
| `/health` 200 but sensitive routes hang | Blocking work in an async path / DB stall | Check Postgres reachability (`localhost:5432`); check for a stuck query; restart service if needed |
| Media decrypt errors / 500 on stream | DEK unresolvable, or `VAULT_STRICT` rejecting a plaintext file that shouldn't exist | Confirm the DEK resolves from master vault; do **not** disable `VAULT_STRICT` to paper over it — investigate why a non-IVENC2 file is being read |
| Consent gate blocking legitimate capture | Consent posture / gate bug | Check `vault.biometric_consent`; a fail-closed gate is correct — fix the data/logic, never bypass the gate |
| Voice synth / interview failing | TTS incident **#24546** (`echo-convai-tts` model won't load) | Known-blocked; this is expected until #24546 clears. Do not treat as a new incident |

---

## 5. Rollback commands (know these cold)

**Disable enforcement — LAST RESORT, and only to restore *availability*, never as a fix, and
never while a leak is suspected.** Removing these flags reopens the very exposures P1/P2 closed.

```bash
ssh forge
cd /home/forge/echo-immortality-vault
# Edit .env.secrets and remove the offending flag(s):
#   VAULT_AUTH_ENFORCE=1   → removing this REOPENS the IDOR (F1). Do not, unless auth itself is
#                            the outage AND no data is at risk AND you are actively fixing it.
#   VAULT_STRICT=1         → removing this reopens the plaintext-passthrough downgrade (F4).
nano .env.secrets
systemctl restart echo-immortality-vault
curl -s localhost:8162/health
```

Preferred rollback is **code**, not flags: restore `app.py` from a `.pre_*_bak` and restart.
Backend commits referenced in the matrix (F1 `5dbf1e3`, F2/F5 `e3d900f`, resumable `c60349c`,
P3 `b81912f`, P4 `7bcc5a5`) are the known-good points.

Deploy rollback (frontend): redeploy the last-known-good via `npm run deploy`. If a deploy was
interrupted and git is broken, first `mv .git__deploy_bak .git` (see [`OPERATOR.md`](./OPERATOR.md)).

---

## 6. Escalation

- **Bloodline / Commander authority:** the Vault is a bloodline mission system built for the
  Commander's father. Any SEV-1 touching user data is Commander-notify. Route through the fleet
  Telegram (`@Echoomegaprimebot`, Commander chat) and the queue with tag `awaiting-fc-decision`.
- **Legal-affecting incidents** (consent, deceased/incapacitated authority, a data-subject
  request during an incident): the legal workflow is human-gated — see #18960 (attorney sign-off)
  and #18963 (deceased/incapacitated authority). Do not improvise legal determinations.
- **Cross-service:** TTS/voice → incident #24546. Master-vault / fleet crypto → fleet security.

---

## 7. Post-incident

1. Root cause, not symptom. A workaround is debt — file it (`echo.prompts.add`).
2. Add a regression test that would have caught it (the matrix rule: no fix is "done" without
   executable evidence).
3. Update this runbook and the remediation matrix with the finding + evidence.
4. Rotate any secret that was exposed or that touched the incident path.
5. Record via `echo.builds.log` (kind `fix`), with the timeline and evidence.
