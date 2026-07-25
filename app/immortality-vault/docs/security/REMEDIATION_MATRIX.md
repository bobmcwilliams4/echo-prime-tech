# Immortality Vault V3 — Remediation Matrix (living)

> Build #24413. Findings from [`P0_AUDIT.md`](./P0_AUDIT.md). Each row is closed only with **executable evidence**
> (a passing test / live probe), not a code-written claim. Updated as phases land.

| ID | Finding | Fix | Owner phase | Status | Evidence |
|----|---------|-----|-------------|--------|----------|
| F1 | Systemic BOLA/IDOR — ~70 unauth endpoints; `viewer` is caller-supplied | `vault_auth.py` deny-by-default middleware enforces Firebase token + ownership on every sensitive route; forces bloodline `viewer`=verified uid; owner-signed HMAC `?tok=` media URLs; frontend attaches `Authorization: Bearer <idToken>` on all calls | **P1** | **CLOSED 2026-07-25** | **9/9 IDOR pytest green** (`tests/test_idor.py`); **live prod**: `/memories/{uid}` & `/bloodline/{uid}/tree` no-token → **401** (were open), `/stats`→200 & `/listen/{bad}`→404 (public intact), service active/no-crash. Backend `5dbf1e3`, frontend `43331f8`, `VAULT_AUTH_ENFORCE=1` on :8162. Residual: live logged-in-owner E2E not browser-confirmed (low risk — firebase verify proven in prod consent/video routes; instant rollback armed) |
| F2 | Plaintext training corpus `data/training/<user>/sft.jsonl` reverses DB encryption | Encrypt training artifacts at rest (IVENC2) or generate ephemerally in tmpfs + shred; never persist decrypted corpus | P2/P4 | OPEN | pending: disk scan finds no plaintext personal text |
| F3 | Plaintext voiceprints `echo-tts-v2/refs/*.wav` | Encrypt voice refs at rest; decrypt in-memory for synth | P2 | OPEN | pending: refs scan shows IVENC2 |
| F4 | `VAULT_STRICT` unset → plaintext-passthrough downgrade | Set `VAULT_STRICT=1`; `decrypt_bytes()` rejects non-magic media | P2 | OPEN | pending: passthrough test raises |
| F5 | Plaintext DB cols `family_records.ocr_text`, `personality_traits.evidence`; unwired `eternal_messages.message_text`, `chat_messages.content`, `biometric_captures.data_json` | Route all through `pgp_encrypt_text`; backfill existing rows; add read-path strictness | P2 | OPEN | pending: `count(NOT PGP:%)`=0 on sensitive cols |
| F6 | Decrypted break-glass export to HAMMER; legacy `cf_echo_immortality_vault` + R2 `r2_key` | Encrypt/access-control the break-glass copy; verify + purge legacy CF schema and R2 objects | P2/P6 | OPEN | pending: export encrypted; legacy purge receipt |
| F7 | Consent split-brain + no consent gate on text/bloodline ingestion | Single authoritative consent store; gate text/bloodline ingestion of third-party subjects | P1/P4 | OPEN | pending: unauth/ungated ingestion test fails closed |
| C1 | Live public copy "family-controlled / never used to train anything" is untrue | Fix behavior (F1,F2) then correct copy: subject data trains only that subject's own authorized model with explicit consent | P4/P10 | OPEN | pending: copy matches proven behavior |

**Legend:** OPEN → IN-PROGRESS → CLOSED (with evidence link). No row moves to CLOSED on a self-report.
