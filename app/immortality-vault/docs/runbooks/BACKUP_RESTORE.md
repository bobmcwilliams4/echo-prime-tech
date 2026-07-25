# Runbook — Backup & Restore

> Build #24413. What is backed up, how, and how to restore it — including a restore drill and
> the point-in-time picture. Backups are the last line under a bad deploy, a bad key rotation, or
> a corruption event. Referenced by F6 in
> [`../security/REMEDIATION_MATRIX.md`](../security/REMEDIATION_MATRIX.md).

---

## 1. What is backed up

| Mechanism | What | Where | Cadence |
|---|---|---|---|
| `pg_dump` | Postgres schema `vault` (all structured data, pgcrypto values stay encrypted) | FORGE `/home/forge/backups/*.dump` | Ad-hoc before risky ops; automated per snapshot timer |
| `.pre_*_bak` | Per-file backup of `app.py` (and staged files) taken before each edit | FORGE alongside the file / in `/home/forge/backups/` | On every backend change |
| `echo-restic-vault.timer` | restic backup of `master_vault.db` | FORGE (restic repo) | Daily |
| `echo-vault-snapshot.timer` | decrypt-export of `master_vault.db` to a HAMMER break-glass sqlite | FORGE → HAMMER | Per timer |

**Crypto-boundary note (F6):** the break-glass snapshot copies **`master_vault.db` only** — **no
biometric media leaves FORGE**. `r2_key` values in the DB are local paths inside the crypto
boundary (a misnomer from the CF era), not remote objects. Encrypted media (IVENC2) and the
encrypted DB dumps stay on FORGE. The decrypted master-vault copy on HAMMER is outside this
service's crypto boundary — the residual F6 follow-up (HAMMER ACL + at-rest encryption of that
copy) is tracked separately.

> Note: media at rest (`data/{videos,voice_samples,bloodline_records}`) is IVENC2-encrypted on
> FORGE. Confirm the current backup coverage of the `data/` tree before relying on it for media
> recovery — if `data/` is not in a scheduled backup, add it (encrypted) or accept that media
> recovery depends on the FORGE disk. **TODO for the operator: verify whether `data/` media is in
> a scheduled restic/snapshot set; the timers above are named for the master vault + DB.**

---

## 2. Check backups are current

```bash
ssh forge
systemctl list-timers 'echo-restic-vault.timer' 'echo-vault-snapshot.timer'
systemctl status echo-restic-vault.service --no-pager | tail -20
ls -lt /home/forge/backups/ | head -20        # newest pg_dumps + .pre_*_bak
```

Green = timers scheduled, last run succeeded, and a recent `.dump` exists. A stale timer or a
failed last-run is a degradation to fix before any risky operation.

---

## 3. Take a manual backup (before a risky op)

```bash
ssh forge
# Full vault schema dump (custom format, restorable selectively):
pg_dump -h localhost -U echo -d echo -n vault -F c \
  -f /home/forge/backups/vault_manual_$(date +%Y%m%d_%H%M%S).dump

# Trigger the restic run out of band if you want an immediate master-vault backup:
systemctl start echo-restic-vault.service
```

---

## 4. Restore

### 4a. Postgres `vault` schema from a pg_dump

```bash
ssh forge
# Inspect the dump first:
pg_restore -l /home/forge/backups/<file>.dump | head

# Restore into the live db (DESTRUCTIVE to schema vault — do in a maintenance window).
# Prefer restoring into a scratch schema/db first to verify, then cut over.
pg_restore -h localhost -U echo -d echo --clean --if-exists -n vault \
  /home/forge/backups/<file>.dump
```

Safer path: restore into a **scratch database**, verify row counts and a sample decrypt, then
promote. pgcrypto values restore encrypted and decrypt normally as long as the pgcrypto key is
unchanged (if you also rotated the key, follow [`KEY_ROTATION.md`](./KEY_ROTATION.md)).

### 4b. master_vault.db

Restore from the restic repo (`restic restore`) or the HAMMER break-glass copy. The break-glass
copy is the emergency path when FORGE is unavailable — it is decrypted, so treat it as
highly sensitive and re-secure/rotate afterward.

### 4c. `app.py` from a `.pre_*_bak`

```bash
ssh forge
cd /home/forge/echo-immortality-vault
cp app.py app.py.rollback_$(date +%s)          # keep the bad version for forensics
cp <path>/app.py.pre_<tag>_bak app.py
systemctl restart echo-immortality-vault
curl -s localhost:8162/health                   # confirm 200
```

---

## 5. Restore drill (do this periodically; do not skip)

1. Pick the latest `vault_*.dump`.
2. Create a scratch db: `createdb -h localhost -U echo echo_restore_drill`.
3. `pg_restore -h localhost -U echo -d echo_restore_drill -n vault <file>.dump`.
4. Verify: row counts per key table match the source within expected drift; a sample
   `memories.content` / `interviews.answer` decrypts to readable text via the backend helper;
   `family_records.ocr_text` decrypts.
5. Drop the scratch db: `dropdb -h localhost -U echo echo_restore_drill`.
6. Record the drill result (date, dump used, verification) via `echo.builds.log`.

A backup you have never restored is not a backup. Run the drill on a schedule.

---

## 6. Point-in-time

- **Granularity:** the current picture is **snapshot-based** (daily restic + snapshot timers +
  ad-hoc pg_dumps), not continuous WAL archiving. Recovery point = the most recent good dump/
  snapshot. Worst-case data loss window = the time since the last successful backup.
- If a tighter RPO is required, add WAL archiving / continuous archiving for the `echo` cluster
  and document the archive location here. **TODO: confirm whether PITR/WAL archiving is enabled
  for the FORGE Postgres cluster; if not, the RPO is one backup interval.**
- Always take a manual pg_dump immediately before any key rotation, schema migration, or
  destructive maintenance so you have a precise pre-op recovery point.
