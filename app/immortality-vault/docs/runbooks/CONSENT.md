# Runbook — Consent

> Build #24413. The consent lifecycle for the Immortality Vault: capturing consent for biometric
> capture (voice/video), consent for model training, the deceased/incapacitated legal-authority
> path, and withdrawal + deletion. Consent here is **fail-closed** — capture and training do not
> proceed unless the server explicitly authorizes them.

---

## 1. Principles

- **Fail-closed.** Camera, microphone, and biometric-upload controls only mount when the server's
  authorization posture (`getConsentStatus`) explicitly allows them. A successful `POST /consent`
  alone never unlocks capture — the client must re-fetch the posture (`vault-api.ts` enforces
  this).
- **Identity-bound.** Consent endpoints require the signed-in user's Firebase token, and the
  `uid` must match the subject `user_id`. The client refuses to send if `auth.currentUser.uid`
  does not equal the target (`consentHeaders()`), and never accepts a caller-provided alternate
  identifier or falls back to email/local storage.
- **Models never self-authorize.** For deceased/incapacitated subjects, no model or automated path
  can grant consent — a human must verify legal authority.
- **Data may train only its own subject's model.** A subject's data trains **only that subject's
  own authorized model**, with explicit consent — never a shared/general model.

---

## 2. Capture consent (biometric — voice / video)

Stored in `vault.biometric_consent`, gated by `consent_gate.py`.

### Fields (see `ConsentCaptureInput` / `ConsentCaptureResponse` in `vault-api.ts`)

- `subject_status`: `living | deceased | incapacitated`
- `media_type`: `voice | video | any`
- `consenter_name`, `consenter_relationship`, `consenter_email`
- `legal_authority_type` (for deceased/incapacitated)
- Response records: `method` (`self_attested | guardian_attested | legal_authority`), `granted`,
  `authority_verified`, `pending_human_review`, and top-level `active`.

### Lifecycle

1. **Record consent:** `POST /consent` with the input above (owner-authenticated).
2. **Re-fetch posture:** `GET /consent/{user_id}` → `ConsentPosture` with per-media
   `{allowed, reason}`, `records`, `deletion_requested`. This is the **only** source of truth for
   mounting capture UI.
3. **Living subject:** self-attested consent is sufficient → `active: true`, capture unlocks.
4. **Deceased / incapacitated subject:** requires human-verified legal authority →
   `pending_human_review: true`, `authority_verified: false`, capture stays **blocked** until a
   human verifies (see §4).
5. **Enforcement at capture time:** `/voice/profiles` and `/video/upload` (and chunked variants)
   return **403** when consent is not active; the client fires a `vault-consent-invalidated`
   event so the UI tears capture controls back down.

---

## 3. Training consent

Separate gate `vault.training_consent` (P4 backend, `test_p4_personas.py` 9/9).

- `/training/build-dataset/{user_id}` returns **403 without active training consent**.
- Deceased/incapacitated subjects need **human-verified legal authority** to authorize training —
  same fail-closed rule as capture.
- The trained artifact is a **per-subject** adapter (`data/adapters/vault-<user_id>/`), used only
  to represent that subject; `/chat` routes to the subject's own adapter or returns an **honest
  refusal** (no base-model impersonation).
- Training consent, like capture consent, is revocable — see §5.

---

## 4. Deceased / incapacitated legal-authority path

- The backend has a **human-only `authority_verified`** path: for a deceased or incapacitated
  subject, consent (capture and/or training) is `pending_human_review` until a human with verified
  legal authority (executor, guardian, power-of-attorney, next-of-kin per applicable law) is
  confirmed. **Models never auto-approve this.**
- **This path is legally human-gated and NOT fully closed:**
  - **#18960 — attorney sign-off:** the consent and authority language awaits legal review. Do not
    represent the legal framing as final.
  - **#18963 — deceased/incapacitated authority workflow:** the end-to-end legal workflow (how
    authority is documented, verified, and recorded) is human-gated and pending.
- Operator rule: when a deceased/incapacitated consent request appears in `pending_human_review`,
  do **not** flip `authority_verified` from an automated context. Route it to the human legal
  path and record the verification evidence. Improvising a legal determination is out of bounds
  (see [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md) §6).

---

## 5. Withdrawal & deletion (right-to-delete)

- **Revocation** is first-class in `vault.biometric_consent` and `vault.training_consent`.
  Revoking consent immediately blocks the corresponding capability (capture → 403; training →
  403 on next build).
- **Right-to-delete:** the disable/retrain/delete lifecycle removes the subject's **serving
  adapter, training artifacts, and consent records**, audited (`test_p4_personas.py`). The
  original media/memories are removed per the owner's deletion request; the `deletion_requested`
  flag surfaces in the consent posture.
- After a deletion, verify: the adapter is unregistered from `personality_registry`, the
  `data/adapters/vault-<user_id>/` artifacts are gone, `data/training/<user_id>/` is cleared, and
  media files for the subject are removed. Retain the consent/deletion audit record itself as the
  proof-of-action trail.

---

## 6. Known consent gap — F7 (OPEN)

Document this honestly; it is not fixed:

- **Consent split-brain:** `vault.biometric_consent` (enforced) vs
  `arcanum_sdk.persons_consent_log` (separate, unwired). To be consolidated into a single
  authoritative store.
- **No consent gate on text / bloodline ingestion of third-party subjects.** A third party's
  biographical data can currently be written via `/memories`, `/bloodline/**`, `/interview`
  **without** a dedicated consent gate. The remediation (gate third-party text/bloodline ingestion
  to fail closed) is **OPEN** in [`../security/REMEDIATION_MATRIX.md`](../security/REMEDIATION_MATRIX.md).
- **C1 (public copy):** the live "never used to train anything" claim is untrue as written and
  must be corrected to the proven behavior (subject data trains only that subject's own authorized
  model, with explicit consent). OPEN.

Until F7 closes, operators and reviewers must treat third-party biographical ingestion as
**not-yet-consent-gated** and flag any third-party subject data accordingly.
