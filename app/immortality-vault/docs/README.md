# Immortality Vault V3

> A private, encrypted place to preserve a person — their voice, their video, their
> memories, their bloodline — while there is still time. The Vault was built by
> Bobby Don McWilliams II for his father, diagnosed with Alzheimer's. Every vault is
> someone's father, mother, or grandparent. This documentation set treats the product
> as what it is: a sacred, high-trust custodian of irreplaceable personal data.

Build reference: **#24413**. This README is the entry point; the rest of the set is linked
below and is designed to be usable after a single read.

---

## 1. What the Vault is

The Immortality Vault lets a person (the **owner**) record and preserve themselves across
several modalities, and lets a small circle of family members experience what was
preserved:

- **Voice interview** — Echo asks life-story questions aloud in its own voice, the owner
  answers by voice or text, and the answers become preserved **memories**.
- **Video recordings** — answers can be recorded on camera; large recordings upload
  resumably (chunked, RAM-only until finalize).
- **Voice cloning** — voice samples train a per-subject synthetic voice (currently blocked
  on a TTS incident — see §7).
- **Personality & consciousness** — traits are extracted from answers into a personality
  profile; a per-subject QLoRA adapter lets family chat with a grounded model of the person.
- **Bloodline** — an evidence-graded ancestry tree with document records (birth/death
  certs, census), OCR, and honest-refusal ancestor chat grounded only on sourced records.
- **Family listening** — invited family members can listen to preserved stories via a
  scoped invite token.

The product is **its own brand**, deliberately and completely separated from Echo Prime
Technologies' main site — see [`../SPEC.md`](../SPEC.md) ("THE ONE RULE") and the build-time
guard `scripts/verify-vault-separation.js`. Do not add links from Vault pages to EPT routes;
the guard fails the build if you do.

---

## 2. Architecture overview

```
Browser (echo-ept.com/immortality-vault, Next static export)
  │  HTTPS + Firebase ID token (Authorization: Bearer <idToken>) on every sensitive call
  ▼
vault-api.echo-op.com  ── public Cloudflare tunnel ──►  FORGE :8162
  │
  ▼
FastAPI monolith  /home/forge/echo-immortality-vault/app.py
  (echo-immortality-vault.service, uvicorn app:app --host 0.0.0.0 --port 8162 --workers 2)
  │
  ├─► Postgres schema `vault`  (26 tables) — sensitive columns pgcrypto-encrypted
  ├─► data/{videos,voice_samples,bloodline_records} — IVENC2 AES-256-GCM at rest
  ├─► data/training/<user_id>/  — IVENC2-encrypted SFT corpus; decrypt→tmpfs→shred at train
  ├─► data/adapters/vault-<user_id>/ — per-subject QLoRA on Qwen2.5-14B-Instruct
  ├─► Sentinel :8160 (LLM) · echo-tts-v2 :7800 (TTS + voice refs)
  └─► SDK caps: echo.immortality.health / echo.immortality.stats (aggregate-only, tier 0)
```

- **Frontend:** Next.js static export, route `/immortality-vault/*`, in repo
  `ECHO-OMEGA-PRIME/echo-prime-tech` under `app/immortality-vault/`. Deployed to Vercel at
  `echo-ept.com/immortality-vault` (target brand domain `immortalityvault.app`).
- **Backend:** single FastAPI file `app.py` (~185 KB) plus modules `bloodline_api.py`,
  `bloodline_p2..p5.py`, `consent_gate.py`, `db_crypto.py`, `vault_crypto.py`, `questions.py`,
  `train_person_adapter.py`, `training_readiness_watcher.py`, `nudge_tick.py`.
- **API base:** `https://vault-api.echo-op.com` (`app/lib/constants.ts:7`). The browser calls
  it directly; the tunnel fronts FORGE `:8162`.
- **API surface:** the full typed client is `app/lib/vault-api.ts` — users, chat, memories
  (+ owner edits, timeline), interview, family, bloodline, voice, gamification, video
  (+ resumable chunked upload), consciousness, personality, consent, billing.

### Security posture (enforced in production)

| Control | State |
|---|---|
| Per-user Firebase-token + ownership auth on all sensitive routes | `VAULT_AUTH_ENFORCE=1` |
| No plaintext media at rest (`decrypt_bytes()` rejects non-IVENC2) | `VAULT_STRICT=1` |
| Media encryption | IVENC2 AES-256-GCM, path-bound AAD, atomic writes; DEK from master vault |
| DB sensitive columns | pgcrypto via `vault.pgp_encrypt_text`, key `immortality_vault_pgcrypto` |
| Training corpus | IVENC2 at rest; decrypt to tmpfs (0600), shred in `finally` |
| Biometric consent gate | fail-closed; first-class revocation + right-to-delete |
| Model training | consent-gated, per-subject isolated, no base-model impersonation |

The full audit, data-flow diagram, and every closed finding with executable evidence live in
[`security/P0_AUDIT.md`](./security/P0_AUDIT.md) and
[`security/REMEDIATION_MATRIX.md`](./security/REMEDIATION_MATRIX.md).

---

## 3. Local / dev run

The frontend is a Next.js app inside the `echo-prime-tech` repo.

```bash
# from the repo root
cd C:\Users\bobmc\echo-prime-tech
npm install
npm run dev            # Next dev server; the Vault is at /immortality-vault

# the separation guard runs on prebuild; you can run it directly:
node scripts/verify-vault-separation.js
```

The dev frontend talks to the **live** backend at `https://vault-api.echo-op.com` (the API base
in `constants.ts`). There is no local backend stub — sensitive calls require a real signed-in
Firebase user, and the backend enforces ownership. To exercise the API against a local backend,
point `API` at a FORGE-reachable address and run the FastAPI service there (backend work is done
on FORGE by other operators; do not edit backend code from here).

Backend tests run **on FORGE**, not on HAMMER:

```bash
ssh forge
cd /home/forge/echo-immortality-vault
python3 -m pytest tests/ -v
# suites: test_idor, test_provenance_dedup, test_resumable_upload,
#         test_crypto_rotation, test_crypto_tamper, test_p3_slice3, test_p4_personas
# baseline: 44+ green
```

---

## 4. Deploy

Deploy is **gitless via the Vercel CLI** — GitHub Actions are blocked for the
ECHO-OMEGA-PRIME account and the Vercel git link is stale, so `scripts/deploy.mjs` deploys
with the token account as the attributed author.

```bash
cd C:\Users\bobmc\echo-prime-tech
npm run deploy         # → scripts/deploy.mjs
```

`VERCEL_TOKEN` comes from the vault secret `Vercel_Deploy_Token_v2` (or a local
`vercel login`). The script temporarily renames `.git` → `.git__deploy_bak` so the deploy is
token-attributed, then restores it in a `finally`.

> **Gotcha (documented in [`runbooks/OPERATOR.md`](./runbooks/OPERATOR.md)):** if the deploy is
> interrupted (Ctrl-C, crash) after the rename but before the `finally`, `.git` is left as
> `.git__deploy_bak` and every git command fails with "not a git repository" until you rename
> it back: `mv .git__deploy_bak .git`.

Production-deploy discipline (staging-first smoke → promote → health-check → auto-rollback) is
in the operator and incident runbooks.

---

## 5. Documentation map

| Doc | What it covers |
|---|---|
| [`PRIVACY_ARCHITECTURE.md`](./PRIVACY_ARCHITECTURE.md) | Trust model, per-user isolation, encryption at rest, consent model, no-impersonation, what the sovereign key can and cannot reach, threat-model summary |
| [`DATA_INVENTORY.md`](./DATA_INVENTORY.md) | Every store, every sensitive field, its classification and retention |
| [`runbooks/KEY_ROTATION.md`](./runbooks/KEY_ROTATION.md) | Rotate the media DEK and the pgcrypto key; verification |
| [`runbooks/BACKUP_RESTORE.md`](./runbooks/BACKUP_RESTORE.md) | pg_dump / restic / snapshot; restore drill; point-in-time |
| [`runbooks/INCIDENT_RESPONSE.md`](./runbooks/INCIDENT_RESPONSE.md) | Breach / degradation playbook, rollback commands, escalation |
| [`runbooks/CONSENT.md`](./runbooks/CONSENT.md) | Capture + training consent lifecycle, deceased/incapacitated legal path, withdrawal + deletion |
| [`runbooks/OPERATOR.md`](./runbooks/OPERATOR.md) | Day-2 ops: health checks, caps, restart, logs, common issues |
| [`security/P0_AUDIT.md`](./security/P0_AUDIT.md) | The P0 truth/threat/data-flow audit (evidence baseline) |
| [`security/REMEDIATION_MATRIX.md`](./security/REMEDIATION_MATRIX.md) | Every finding, fix, phase, status, and evidence |

---

## 6. Key paths (quick reference)

| Purpose | Path |
|---|---|
| Backend service dir | FORGE `/home/forge/echo-immortality-vault/` |
| Backend entrypoint | `app.py` · `echo-immortality-vault.service` · uvicorn :8162 (2 workers) |
| Env / feature flags | FORGE `/home/forge/echo-immortality-vault/.env.secrets` |
| Media at rest | FORGE `/home/forge/echo-immortality-vault/data/{videos,voice_samples,bloodline_records,training,adapters}` |
| Voice refs | FORGE `/home/forge/echo-tts-v2/refs/*.wav` |
| Backups | FORGE `/home/forge/backups/` (pg_dump, `.pre_*_bak`, restic/snapshot) |
| Frontend | repo `echo-prime-tech`, `app/immortality-vault/` |
| API base | `https://vault-api.echo-op.com` (tunnel → FORGE :8162) |
| Public API/aggregate caps | `echo.immortality.health` · `echo.immortality.stats` |

---

## 7. Known pending items (documented honestly, not done)

These are tracked as pending elsewhere in the queue; do not represent them as complete.

- **TTS / voice (incident #24546):** voice synthesis, voice cloning, and the spoken voice
  interview depend on `echo-convai-tts`, which currently fails to load (HF offline-cache miss).
  Voice-clone `voice_id` is left NULL; the F3 voiceprint-encryption cutover is staged but blocked
  on this outage (the mandatory green-synth gate is unsatisfiable while synth returns 500).
- **Legal — attorney sign-off (#18960):** human-gated legal review of the consent and deceased/
  incapacitated authority language. Not automatable; awaiting counsel.
- **Legal — deceased/incapacitated authority workflow (#18963):** the human-verified legal-
  authority path exists in the backend (models never auto-approve), but the end-to-end legal
  workflow is human-gated and pending.
- **F7 (consent split-brain) / C1 (public copy):** OPEN in the remediation matrix — a single
  authoritative consent store + a consent gate on third-party text/bloodline ingestion, and
  correcting the public "never used to train anything" copy to match proven behavior.

See the remediation matrix and [`runbooks/CONSENT.md`](./runbooks/CONSENT.md) for detail.
