# Immortality Vault V3 — Data Inventory

> Build #24413. Every store the Vault touches, every sensitive field, its classification, and
> retention. Derived from [`security/P0_AUDIT.md`](./security/P0_AUDIT.md) §1/§3/§4 and the
> closures in [`security/REMEDIATION_MATRIX.md`](./security/REMEDIATION_MATRIX.md) (F2, F4, F5, F6).
>
> **Classification legend**
> - **ENCRYPTED (media)** — IVENC2 AES-256-GCM at rest, path-bound AAD, DEK in master vault.
> - **ENCRYPTED (db)** — pgcrypto via `vault.pgp_encrypt_text`, key `immortality_vault_pgcrypto`,
>   auto-decrypt on read; `PGP:` prefix convention (code-enforced, not a schema constraint).
> - **ENCRYPTED (corpus)** — IVENC2 at rest; decrypt to tmpfs (0600) + shred at train time.
> - **PLAINTEXT** — stored in the clear (flagged; each has a status note).
> - **AGGREGATE** — non-identifying counts / derived, not per-person content.
> - **METADATA** — structural fields (ids, timestamps, mime, size) that are not free-text PII.

---

## 1. Stores

| Store | Location | Contents | At-rest protection |
|---|---|---|---|
| Postgres schema `vault` | FORGE `127.0.0.1:5432`, db `echo`, schema `vault` (26 tables) | All structured data (users, memories, interviews, family, bloodline, personality, consent, video/voice metadata) | pgcrypto on sensitive columns (see §3); rest = row-scoped by `user_id` |
| Media store | FORGE `/home/forge/echo-immortality-vault/data/{videos,voice_samples,bloodline_records}` | Videos, voice samples, bloodline record/portrait images | **ENCRYPTED (media)** IVENC2; `VAULT_STRICT=1` rejects non-IVENC2 |
| Training corpus | FORGE `.../data/training/<user_id>/sft.jsonl` | Per-subject SFT dataset (persona prompt + memories) | **ENCRYPTED (corpus)** IVENC2; tmpfs decrypt + shred (F2 closed) |
| Adapters | FORGE `.../data/adapters/vault-<user_id>/` | Per-subject QLoRA adapters on Qwen2.5-14B-Instruct | Per-subject path-guarded isolation; artifacts derived from consented data |
| Voice refs | FORGE `/home/forge/echo-tts-v2/refs/*.wav` | Reference voice clips (biometric) — separate service | **PLAINTEXT** (F3 STAGED/BLOCKED — encrypt-on-load shim proven byte-identical; cutover blocked on TTS #24546) |
| Backups | FORGE `/home/forge/backups/` | pg_dump, per-file `.pre_*_bak`, restic, snapshot | See [`runbooks/BACKUP_RESTORE.md`](./runbooks/BACKUP_RESTORE.md); break-glass = master_vault.db only |
| Master vault | FORGE (fleet) `master_vault.db` | The media DEK + pgcrypto key material + service secrets | Fleet vault; break-glass decrypt-export to HAMMER (F6 residual: HAMMER ACL + at-rest encryption) |
| Registries (fleet) | `arcanum_sdk.personality_registry`, `arcanum_sdk.person_voice_samples` | Persona registration, voice sample references | Fleet-managed |
| **Legacy CF schema** | `cf_echo_immortality_vault` | Pre-migration D1 mirror | **DROPPED** (F6 closed) — verified dead (0 code/pg_depend refs), pg_dump backed up, `DROP SCHEMA CASCADE` |

---

## 2. Sensitive fields — database (schema `vault`)

| Table.column | Classification | Notes / status |
|---|---|---|
| `memories.content` | ENCRYPTED (db) | Core personal memory text; pgcrypto from the start |
| `interviews.answer` | ENCRYPTED (db) | Spoken/typed interview answers; pgcrypto |
| `family_records.ocr_text` | ENCRYPTED (db) | OCR extracted from bloodline documents; **F5 closed** — backfilled 21→0 plaintext |
| `personality_traits.evidence` | ENCRYPTED (db) | Supporting quote/evidence for an extracted trait; **F5 closed** — backfilled 2→0 plaintext |
| `eternal_messages.message_text` | ENCRYPTED (db) | Messages left for family; **F5 closed** — write site now routed through `vault.pgp_encrypt_text` |
| `chat_messages.content` | ENCRYPTED (db) | Conversation content with the preserved person; **F5 closed** — write site encrypted |
| `biometric_captures.data_json` | ENCRYPTED (db) | Biometric capture payload (facial/voice-derived features); **F5 closed** — write site encrypted |
| `memory_corrections.*` (P3) | ENCRYPTED (db) | Append-only owner edits; original evidence-of-record kept byte-unchanged |
| video transcription (P3) | ENCRYPTED (db) | Persisted transcript of a recorded answer |

> **Invariant:** encryption here is enforced by routing every write through
> `vault.pgp_encrypt_text` and reading through `db_crypto.decrypt_known_fields`. It is a **code
> convention (`PGP:` prefix), not a schema constraint** — any new write path to these columns
> MUST use the encrypt helper or it will land plaintext. This is the single most important
> maintenance invariant in the data model.

### Non-encrypted DB fields (by design)

| Field kind | Classification | Why |
|---|---|---|
| `user_id`, row ids, foreign keys | METADATA | Ownership scoping; not free-text PII |
| Firebase `uid` / account email | METADATA / identity | Needed for auth + ownership; identity, not content |
| Timestamps (`created_at`, `edited_at`, …) | METADATA | Ordering, provenance, TTL |
| `video_recordings` mime/size/duration, `r2_key` (local path), `interview_id`, `question_id` | METADATA | Structural; the media bytes themselves are encrypted at rest |
| Bloodline `name`, dates, places, `is_direct_line`, `living`, `confidence`, `sources` | Mixed (see §5) | Ancestry facts; living-relative fields are access-controlled, not encrypted |
| Category / emotion / importance / keywords | METADATA | Derived tags for retrieval |

---

## 3. Sensitive fields — media & derived artifacts

| Artifact | Store | Classification | Retention |
|---|---|---|---|
| Interview / recorded-answer videos | `data/videos` | ENCRYPTED (media) | Held for the life of the vault; deleted on owner delete / consent withdrawal |
| Voice samples (for cloning) | `data/voice_samples` | ENCRYPTED (media) | Held while voice profile active; removed on retrain/delete lifecycle |
| Bloodline record & portrait images | `data/bloodline_records` | ENCRYPTED (media) | Held for the life of the vault |
| Resumable-upload chunks (in flight) | tmpfs (RAM) | Transient, RAM-only | Staged in tmpfs, encrypted (IVENC2) at finalize; **TTL sweep** removes abandoned uploads |
| Training SFT corpus | `data/training/<user_id>` | ENCRYPTED (corpus) | Regenerated per training run; decrypted copy exists only in `/dev/shm` during a run, shredded in `finally` |
| Per-subject adapter | `data/adapters/vault-<user_id>` | Derived model | Removed by disable/retrain/delete lifecycle (serving + artifacts + consent) |
| Voice reference clips | `echo-tts-v2/refs/*.wav` | **PLAINTEXT** (biometric) | F3 encrypt cutover staged, blocked on #24546 — treat as sensitive plaintext until cleared |

---

## 4. Consent records

| Store | Classification | Retention |
|---|---|---|
| `vault.biometric_consent` | Consent record (subject status, method, granted, authority_verified, pending_human_review) | Retained as the audit trail; revocation + right-to-delete are first-class |
| `vault.training_consent` | Consent record gating `/training/build-dataset` | Retained; revoked → training blocked (403) |
| `arcanum_sdk.persons_consent_log` | **Separate, unwired (F7 OPEN)** | Consent split-brain to be consolidated |

---

## 5. Access-controlled (not encrypted) — bloodline living relatives

Living-relative privacy is enforced by **access control**, not encryption: the tree redacts
living relatives unless the viewer is the owner. Post-F1, `viewer` is **forced to the verified
uid** server-side, so redaction can no longer be bypassed with a query param. Deceased/direct-line
ancestor facts are shown to authorized viewers; `refuted_legends` and `living_redacted` counts are
surfaced as stats.

---

## 6. Aggregate / public data

| Data | Exposure | Classification |
|---|---|---|
| `/health` | Public | Liveness only |
| `/stats`, `echo.immortality.stats` | Public / sovereign cap | AGGREGATE counts (users, memories, interviews, family_members, chat_sessions) — no per-user content |
| `echo.immortality.health` | Sovereign cap | Health only |
| `/listen/{token}` | Token-scoped | Only the stories the owner shared via an invite token |

---

## 7. Retention & deletion summary

- **Owner-initiated deletion / consent withdrawal** removes the subject's serving adapter,
  training artifacts, and consent records (audited), and is the mechanism for right-to-delete.
- **In-flight upload chunks** are RAM-only and TTL-swept; nothing durable is written until
  finalize (encrypted).
- **Training plaintext** never persists — it lives only in `/dev/shm` during a run and is
  shredded in a `finally`.
- **Backups** retain encrypted DB dumps and per-file `.pre_*_bak` snapshots; the break-glass
  export is master_vault.db only (no biometric media). Backup retention/rotation is governed by
  the restic/snapshot timers — see [`runbooks/BACKUP_RESTORE.md`](./runbooks/BACKUP_RESTORE.md).
- **Legacy CF schema** has been fully purged (F6).

---

## 8. Open data-privacy items (do not represent as done)

- **F3** — voice refs at `echo-tts-v2/refs/*.wav` remain **plaintext**; encrypt-on-load cutover
  blocked on TTS incident #24546.
- **F7** — consent split-brain; no consent gate on third-party **text/bloodline** ingestion. A
  third party's biographical data can currently be written via `/memories`, `/bloodline/**`,
  `/interview` without a dedicated consent gate. OPEN.
- **C1** — public copy ("never used to train anything") does not match proven behavior (subject
  data trains that subject's own authorized model with consent). Copy correction OPEN.
- **F6 residual (non-vault)** — HAMMER-side ACL on the master-vault copy + fleet master-vault
  at-rest encryption.
