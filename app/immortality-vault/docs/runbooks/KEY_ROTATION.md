# Runbook — Key Rotation

> Build #24413. How to rotate the Immortality Vault's two at-rest keys — the **media DEK**
> (IVENC2 AES-256-GCM) and the **pgcrypto key** (`immortality_vault_pgcrypto`) — without losing
> access to data written under the old key. Backed by F8 (crypto rotation/tamper tests) in
> [`../security/REMEDIATION_MATRIX.md`](../security/REMEDIATION_MATRIX.md).
>
> **Golden rule:** rotation is **additive**. Old-`key_id` blobs must keep decrypting after a
> rotation; only *new* writes use the new key. Never delete an old key until you have proven
> every blob written under it has been re-encrypted (or you have accepted that those blobs become
> permanently unreadable). This is verified — `test_crypto_rotation.py` 5/5 proves old-key blobs
> decrypt post-rotation and new writes use the new key.

---

## 0. Preconditions

- Backend work is done **on FORGE**. `ssh forge`.
- Take a fresh backup first — see [`BACKUP_RESTORE.md`](./BACKUP_RESTORE.md). At minimum a
  `pg_dump` (for pgcrypto rotation) and confirm the latest restic/snapshot ran.
- Confirm the service is healthy before you start: `curl -s localhost:8162/health`.
- Know your rollback: the old key must remain resolvable in the master vault throughout.

---

## 1. Media DEK rotation (IVENC2)

The DEK lives in the **master vault** (never on disk beside the media). IVENC2 blobs are tagged
with the `key_id` they were written under; the `vault_crypto` rotate API adds a new active key and
leaves old keys resolvable so existing blobs still decrypt.

### 1a. Rotate

```bash
ssh forge
cd /home/forge/echo-immortality-vault

# Use the vault_crypto rotation entry-point (added in F8). Confirm the exact
# invocation for the current build:
python3 -c "import vault_crypto, inspect; print([n for n in dir(vault_crypto) if 'rot' in n.lower()])"
python3 -c "import vault_crypto, inspect; print(inspect.getdoc(vault_crypto.rotate_key))"

# Rotate: mint a new DEK, mark it active, keep the previous key_id resolvable.
python3 -c "import vault_crypto; print(vault_crypto.rotate_key())"
```

The new key becomes the active write key; the previous `key_id` stays registered for decrypt.

### 1b. Verify (mandatory)

```bash
# 1) New writes use the new key: write a probe blob, confirm its key_id is the new one.
# 2) Old blobs still decrypt: pick an existing file and decrypt it end-to-end.
python3 -m pytest tests/test_crypto_rotation.py -v     # expect 5/5
python3 -m pytest tests/test_crypto_tamper.py -v       # expect 6/6 (fail-closed integrity)

# 3) Live smoke: an owner-authenticated media fetch still returns bytes (not 500).
#    Do this against a known test owner via the app / an owner-signed ?tok= URL.
```

### 1c. (Optional) re-encrypt old blobs forward

Only if you intend to retire the old key. Re-read + re-write each media file so it is re-tagged
with the new `key_id`, then confirm no blob references the old key before removing it. Do this in
a maintenance window; keep the old key resolvable until the sweep is proven complete.

---

## 2. pgcrypto key rotation (`immortality_vault_pgcrypto`)

Sensitive DB columns are encrypted via `vault.pgp_encrypt_text` under key
`immortality_vault_pgcrypto` and decrypted by `db_crypto.decrypt_known_fields`. Rotating this key
means re-encrypting the affected column values, because pgcrypto values are not `key_id`-tagged
the way IVENC2 blobs are.

### 2a. Back up first (non-negotiable)

```bash
ssh forge
pg_dump -h localhost -U echo -d echo -n vault -F c \
  -f /home/forge/backups/vault_pre_pgcrypto_rotate_$(date +%Y%m%d_%H%M%S).dump
```

### 2b. Rotate the key material

1. Add the **new** pgcrypto key to the master vault (new secret name/version), keeping the old key
   available.
2. For each encrypted column (`memories.content`, `interviews.answer`, `family_records.ocr_text`,
   `personality_traits.evidence`, `eternal_messages.message_text`, `chat_messages.content`,
   `biometric_captures.data_json`): decrypt each `PGP:`-prefixed value with the **old** key and
   re-encrypt with `vault.pgp_encrypt_text` under the **new** key. Do this transactionally,
   per-table, inside a maintenance window.
3. Flip the service config to use the new key for future reads/writes and restart.

> Perform the re-encryption through the backend helper (`db_crypto` / `vault.pgp_encrypt_text`)
> so the `PGP:` convention and decrypt-on-read path stay consistent. Do **not** hand-roll SQL
> that writes raw pgcrypto bytes.

### 2c. Verify

```bash
# No plaintext leaked and every value round-trips under the new key:
ssh forge
# per column: count PGP-prefixed vs total should match (all encrypted), and a
# sample decrypt returns the expected cleartext.
python3 -m pytest tests/ -v      # full suite, expect 44+ green
curl -s localhost:8162/health    # 200
# owner-authenticated read of a memory / interview answer returns readable text.
```

---

## 3. Rollback

- **Media DEK:** rotation is additive and non-destructive — if the new active key misbehaves,
  point the active write key back to the previous key_id (both remain resolvable). No data loss.
- **pgcrypto:** if re-encryption fails midway, restore the pre-rotation `pg_dump` from §2a and
  revert the service to the old key. This is why the backup is non-negotiable.

---

## 4. What to record after a rotation

Log to the build registry (`echo.builds.log`) with the new `key_id`/version, the tables touched,
counts re-encrypted, and the verification evidence (test output + live smoke). Never record a
rotation as done on a self-report — attach the passing test + a live decrypt.
