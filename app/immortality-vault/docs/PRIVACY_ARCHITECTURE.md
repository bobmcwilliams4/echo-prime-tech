# Immortality Vault V3 — Privacy Architecture

> Build #24413. This document is the authoritative statement of the Vault's trust model:
> who can reach what, how data is protected at rest, how consent governs capture and training,
> and what the fleet's sovereign key can and cannot touch. The evidence baseline is
> [`security/P0_AUDIT.md`](./security/P0_AUDIT.md); every closed control cites executable
> evidence in [`security/REMEDIATION_MATRIX.md`](./security/REMEDIATION_MATRIX.md).

---

## 1. Trust model in one sentence

A vault belongs to exactly one **owner**; nobody — not another family member, not another
Vault user, not an unauthenticated caller, and not the fleet's sovereign key operating through
the public API — can read that owner's private content without either being that owner
(Firebase identity) or holding an owner-issued, scoped, expiring token.

### Principals

| Principal | How identified | What they can reach |
|---|---|---|
| **Owner** | Firebase ID token; `uid` must equal the resource `user_id` | Everything in their own vault: memories, interviews, videos, voice, bloodline (incl. living relatives), personality, consent posture |
| **Invited family listener** | Owner-issued invite token (`/family/{memberId}/invite` → `/listen/{token}`) | Only the preserved stories the owner chose to share; no living-relative data, no raw media, no edit rights |
| **Bloodline viewer** | Firebase identity; `viewer` is forced to the verified uid server-side | Deceased/direct-line ancestors; **living relatives are redacted** unless the viewer is the owner |
| **Anonymous / public** | none | Only genuinely public routes: `/health`, `/stats` (aggregate counts), a `/listen/{token}` with a valid token |
| **Sovereign key (fleet)** | `X-Echo-API-Key` at the SDK gate | Aggregate-only caps `echo.immortality.health` / `echo.immortality.stats`. **No per-user data** — see §7 |

---

## 2. Per-user isolation

Isolation is enforced at three layers, deny-by-default:

1. **Transport / auth (F1 closed, P1).** `vault_auth.py` is deny-by-default middleware on the
   FastAPI app. Every sensitive route requires a valid Firebase token and checks that the
   token's `uid` owns the addressed resource. Before this, ~70 of ~80 endpoints trusted a
   caller-supplied `user_id`/`viewer` — a systemic BOLA/IDOR. Now:
   - The frontend attaches `Authorization: Bearer <idToken>` on every call
     (`vault-api.ts` `authHeader()` / `consentHeaders()`).
   - Bloodline `viewer` is **forced to the verified uid** server-side; a caller can no longer
     pass `?viewer=` to unmask living relatives.
   - Media/record URLs are **owner-signed HMAC** (`?tok=`) — a stream/image URL only works for
     the owner who minted it, and only until it expires.
   - Evidence: `tests/test_idor.py` 9/9 green; live prod `/memories/{uid}` and
     `/bloodline/{uid}/tree` return **401** without a token, while `/stats`→200 and
     `/listen/{bad}`→404 (public surface intact). `VAULT_AUTH_ENFORCE=1` on :8162.

2. **Data store.** Postgres schema `vault`; every row carries the owning `user_id`. Queries are
   scoped to the authenticated owner. Per-subject model artifacts live under
   `data/adapters/vault-<user_id>/` with path-guarded isolation (zero-cross-subject-leakage test
   in `test_p4_personas.py`).

3. **Media store.** Files under `data/{videos,voice_samples,bloodline_records}` are encrypted
   with **path-bound AAD** — the file's own path is authenticated data in the AES-GCM tag, so a
   blob cannot be decrypted as if it belonged to another path/owner even if moved. Cross-path
   swap is a fail-closed decrypt (`test_crypto_tamper.py`).

---

## 3. Encryption at rest

Three independent encryption domains, each with its own key.

### 3a. Media — IVENC2 AES-256-GCM

- Applies to videos, voice samples, and bloodline record images
  (`data/{videos,voice_samples,bloodline_records}`).
- Format: `IVENC2` container, AES-256-GCM, per-file nonce, **path-bound AAD**, atomic writes.
- The data-encryption key (DEK) is held in the **master vault**, not on disk beside the media.
- `VAULT_STRICT=1` (F4 closed): `decrypt_bytes()` **rejects** any non-`IVENC2` bytes rather than
  silently passing plaintext through. Before the flip, a scan of all media dirs found **0**
  non-IVENC2 files. This closes the plaintext-downgrade path.
- Integrity + key lifecycle proven (F8 closed): `test_crypto_rotation.py` 5/5 (old-key blobs
  still decrypt after rotation; new writes use the new key), `test_crypto_tamper.py` 6/6
  (byte-flip, tag-flip, cross-path-swap, truncation all fail closed).
- Rotation procedure: [`runbooks/KEY_ROTATION.md`](./runbooks/KEY_ROTATION.md).

### 3b. Database — pgcrypto

- Sensitive DB columns are encrypted with pgcrypto via `vault.pgp_encrypt_text`, key
  **`immortality_vault_pgcrypto`**, and auto-decrypted on read by
  `db_crypto.decrypt_known_fields`.
- Encrypted columns (F5 closed — all 6 write sites routed through encryption, existing rows
  backfilled): `memories.content`, `interviews.answer`, `family_records.ocr_text`,
  `personality_traits.evidence`, `eternal_messages.message_text`, `chat_messages.content`,
  `biometric_captures.data_json`.
- Encrypted values carry a `PGP:` prefix convention. **Caveat:** encryption is a code
  convention, not (yet) a schema-level constraint — new write paths must route through
  `vault.pgp_encrypt_text`. This is why the data inventory ([`DATA_INVENTORY.md`](./DATA_INVENTORY.md))
  enumerates every field and its state.

### 3c. Training corpus — IVENC2 + tmpfs-shred

- `data/training/<user_id>/sft.jsonl` is written **IVENC2-encrypted** (path-bound AAD). This
  closes F2, where the plaintext corpus previously reversed the DB encryption (it held decrypted
  persona prompts + personal memories in cleartext).
- The trainer **decrypts to `/dev/shm` (0600)** and **shreds the plaintext in a `finally`** —
  plaintext exists only in RAM, only during training. All 8 legacy files were migrated in place;
  a disk scan for signature phrases returns no matches, and every file begins `IVENC2\x00`.

---

## 4. Consent model

Consent is **fail-closed**: capture controls (camera, microphone, biometric upload) do not mount
unless the server's authorization posture explicitly allows them. The client's only source of
truth is `getConsentStatus()` — a successful `POST /consent` alone never unlocks capture.

### 4a. Capture consent (biometric — voice/video)

- Stored in `vault.biometric_consent`, gated by `consent_gate.py`.
- Subject status is one of `living | deceased | incapacitated`; method is
  `self_attested | guardian_attested | legal_authority`.
- For a **living** subject, self-attested consent is sufficient. For **deceased/incapacitated**
  subjects, consent requires a **human-verified `authority_verified` path** — models never
  auto-approve. Until a human verifies, capture stays `pending_human_review` and blocked.
- Revocation is first-class, with right-to-delete. A 403 from a capture endpoint fires a
  `vault-consent-invalidated` event so the UI re-checks and tears down capture controls.

### 4b. Training consent

- Separate gate `vault.training_consent` (P4 backend closed). `/training/build-dataset` returns
  **403 without active training consent**. Deceased/incapacitated subjects need human-verified
  legal authority to authorize training.
- A subject's data may train **only that subject's own authorized model** — never a shared or
  general model. This is the honest correction to the older public copy (tracked as C1).

### 4c. Known consent gap (OPEN — F7)

There is currently a **consent split-brain**: `vault.biometric_consent` (enforced) vs
`arcanum_sdk.persons_consent_log` (separate, unwired), and **no consent gate on text/bloodline
ingestion** of third-party subjects. The remediation (single authoritative consent store + a
gate on third-party text/bloodline ingestion) is **OPEN** in the matrix. Operators and reviewers
must treat third-party biographical ingestion as not-yet-consent-gated. See
[`runbooks/CONSENT.md`](./runbooks/CONSENT.md).

---

## 5. No-impersonation

- Each preserved person gets their **own per-subject QLoRA adapter** on base
  `Qwen/Qwen2.5-14B-Instruct`, under `data/adapters/vault-<user_id>/`, registered in
  `arcanum_sdk.personality_registry`.
- `/chat` routes to the subject's **own adapter** or returns an **honest refusal** — the base
  model is never allowed to impersonate a person it wasn't trained on. Ancestor chat
  (`/bloodline/{uid}/chat/{personKey}`) is grounded **only on the sourced records** and refuses
  when the record doesn't support an answer (returns a disclaimer, not a fabrication).
- The disable/retrain/delete lifecycle removes serving + artifacts + consent, audited
  (`test_p4_personas.py` 9/9).

---

## 6. Backup & break-glass boundary

- Backups: daily `pg_dump` under `/home/forge/backups/`, `echo-restic-vault.timer`, and
  `echo-vault-snapshot.timer`. See [`runbooks/BACKUP_RESTORE.md`](./runbooks/BACKUP_RESTORE.md).
- The break-glass snapshot copies **`master_vault.db` only** — **no biometric media leaves
  FORGE** (F6 closed, vault scope). The legacy `cf_echo_immortality_vault` schema and its
  R2-style keys were verified dead and dropped (backed up first); `r2_key` values are local
  paths inside the crypto boundary (a misnomer), with no live Cloudflare client.
- Residual follow-up (non-vault scope, tracked in F6): HAMMER-side ACL on the master-vault copy
  + fleet master-vault at-rest encryption.

---

## 7. What the sovereign key CAN and CANNOT reach

This is a deliberate design boundary — the Vault does **not** trust the fleet sovereign key as a
universal reader, because that would reopen the IDOR that P1 closed.

**CAN (privacy-safe, aggregate-only caps):**

- `echo.immortality.health` — service liveness / health.
- `echo.immortality.stats` — aggregate counts only (users, memories, interviews, family members,
  chat sessions). No per-user content, no identifiers.

**CANNOT:**

- Read any specific user's memories, interviews, videos, voice, bloodline, personality, or
  consent records.
- Bypass Firebase ownership on any per-user route.
- Mint media `?tok=` URLs for content it doesn't own.

Per-user private endpoints are **deliberately not exposed as caps** — the remediation matrix
records this explicitly: "sovereign-key would reopen IDOR." Operators needing per-user data must
act as the owner (owner-authenticated), and any such access is an incident-worthy exception (see
[`runbooks/INCIDENT_RESPONSE.md`](./runbooks/INCIDENT_RESPONSE.md)).

---

## 8. Threat-model summary

Full ranked findings with live evidence are in [`security/P0_AUDIT.md`](./security/P0_AUDIT.md)
§3 and tracked to closure in [`security/REMEDIATION_MATRIX.md`](./security/REMEDIATION_MATRIX.md).
Summary:

| # | Threat | Status |
|---|---|---|
| F1 | Systemic BOLA/IDOR (~70 unauth endpoints; caller-supplied `viewer`) | **CLOSED** — deny-by-default auth, forced viewer, signed media URLs; 9/9 IDOR tests + live 401s |
| F2 | Plaintext training corpus reversed DB encryption | **CLOSED** — IVENC2 corpus + tmpfs decrypt/shred |
| F3 | Plaintext voiceprints in `echo-tts-v2/refs/*.wav` | **STAGED, BLOCKED** on TTS incident #24546 (shim proven byte-identical, cutover deferred) |
| F4 | `VAULT_STRICT` unset → plaintext passthrough | **CLOSED** — `VAULT_STRICT=1`, 0 non-IVENC2 files pre-flip |
| F5 | Plaintext / unwired sensitive DB columns | **CLOSED** — all 6 write sites encrypted, rows backfilled |
| F6 | Break-glass export + legacy CF schema outside crypto boundary | **CLOSED (vault scope)** — legacy schema dropped, break-glass = master_vault.db only |
| F7 | Consent split-brain + no gate on text/bloodline ingestion | **OPEN** |
| F8 | IVENC2 integrity + key lifecycle unproven | **CLOSED** — rotation + tamper tests green |
| C1 | Public copy overclaims ("never used to train anything") | **OPEN** — correct copy to proven behavior |

**Residual risk explicitly accepted for now:** F1 live logged-in-owner E2E is not
browser-confirmed (low risk — Firebase verify is proven in prod consent/video routes, instant
rollback armed); F3/F4-adjacent voiceprints remain plaintext until #24546 clears; F7/C1 are open.
