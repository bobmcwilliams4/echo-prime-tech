# Immortality Vault — Standalone Product Spec

> **Mission (never forget).** The Immortality Vault was built by **Bobby Don McWilliams II** — the sovereign
> architect and founder of Echo Prime Technologies — for **his father, diagnosed with Alzheimer's**, to
> preserve him before the disease takes his memories. Every vault is someone's father, mother, grandparent.
> Treat this product as sacred. Capture speed matters; be gentle, never clinical, never salesy.

## THE ONE RULE — complete separation from EPT (Commander directive 2026-07-07)
The Immortality Vault is its **own brand and product**. It must be **completely separate from echo-ept.com**:
- **No Vault page ever links to an EPT route** (`/pricing`, `/engines`, `/docs`, `/login`, `/sentinel`, `/`, etc.).
- **No EPT branding** on Vault pages (no EPT logo, no `--ept-*` design tokens, no "Echo Prime Technologies"
  chrome in the visible UI — a quiet "by Echo Prime" credit in the footer is fine).
- Every entry/CTA stays **inside the Vault** (`/immortality-vault/*`) or goes to a Vault-owned endpoint.
- A **build-time guard** (`scripts/verify-vault-separation.js`, wired into `prebuild`) FAILS the build if any
  Vault file links to an EPT route or uses EPT tokens. **This is how "never again" is enforced — do not remove it.**

## Identity
Gold-on-black cinematic identity matching the intro film (the "ECHO OMEGA PRIME PRESENTS" gold serif on black,
golden ember, vault emblem). Palette: near-black warm grounds, gold `#d4b483`, warm ivory text. Display = an
elegant serif (Cormorant Garamond via next/font, self-hosted → CSP-safe). Reverent, timeless, memorial — NOT
corporate-tech. Always dark/cinematic (no light mode).

## Pages (all self-contained, gold/black)
1. **Landing** `/immortality-vault` (`page.tsx`) — hero, how-it-works/features, pricing, FAQ, CTA, footer.
   All CTAs → `/immortality-vault/app` (begin) or `#pricing` or `/immortality-vault/login`. Pricing "choose a
   plan" → Vault checkout (NOT `/pricing`). Remove stale tech brags (Cloudflare/D1/ElevenLabs — all migrated).
   **Brand-domain apex:** `immortalityvault.app/` is **HTTP 200** serving this same landing (not a 307).
   Static-export host split: `scripts/prepare-host-roots.mjs` moves EPT `index.html` → `ept-home.html` so `/`
   has no filesystem file; `vercel.json` host-rewrites vault hosts → `/immortality-vault` and everyone else
   → `/ept-home`. Verify with `npm run smoke:vault`.
2. **Login** `/immortality-vault/login` (`login/page.tsx`) — Vault-branded, uses the shared Firebase auth
   (`lib/firebase` signInWithGoogle/Email/Apple) so accounts work; redirects to `/immortality-vault/app`.
3. **App** `/immortality-vault/app` — already self-contained; its only outward hop is auth → repoint to the
   Vault login. Keep dark; optionally align accent to gold.

## Login + Payment through ECHO's own caps (Commander directive 2026-07-07)
- **Login:** shared Firebase (the ECHO auth every product uses) via a Vault-branded page — not an EPT page.
- **Payment:** Vault checkout through an ECHO payment cap — `echo.subscription.stripe.checkout_session`
  (tier 1) via a new Vault-backend endpoint `POST /billing/checkout {plan,email}` → returns a Stripe checkout
  URL; the pricing buttons redirect there. Billing portal via `echo.subscription.stripe.portal_session`.
  Plans: **Keeper $29 · Legacy $79 · Dynasty $199** (monthly). ⚠ Needs Vault Stripe products/prices created
  (Stripe account step) — plumb the endpoint; flag the product-creation step if not autonomously doable.

## The Voice Interview — the heart (Commander directive 2026-07-07)
When a user is interviewed, **Echo speaks each question aloud in his own voice, hears the user, and converses**:
- **Echo speaks (TTS):** synth each question with our own voice — `echo-tts-v2` (`vault-api /voice/synthesize`
  or `:7800`, voice `echo`). Strip Sentinel citation tags (`[n]`, `[general knowledge]`) before speaking.
- **Echo hears (STT):** browser Web Speech API `SpeechRecognition` (free, client-side) — mic button; the user
  answers by voice, transcript fills the answer + can be saved.
- **Echo converses:** the user can ask Echo questions and Echo answers — through Sentinel persona **`vault_guide`**
  (already upserted 2026-07-07) which KNOWS: the app, the process, Echo Prime, and the Commander's story
  (built for his dad with Alzheimer's). Two-way: Echo asks → listens → reflects → follows up; user can interject.
- Wire into `app/immortality-vault/app/components/InterviewPanel.tsx` (+ maybe a dedicated "Conversation" mode).
  Persona for the guide voice = `vault_guide`; the preserved-person chat still uses `build_persona` (their traits).

## Acceptance (each phase proven, not honor-system)
1. Separation: `verify-vault-separation.js` passes; `curl` every Vault page → zero EPT-route links; no `/pricing`
   bounce from any CTA. 2. Login: Vault login signs in via Firebase, lands in the app. 3. Payment: choosing a
   plan opens a Vault Stripe checkout (or clearly-flagged setup step). 4. Voice interview: question is spoken in
   Echo's voice; mic captures the answer; asking Echo "who made this?" → the true story, spoken aloud.
5. Intro: the approved **v2** (music tail) is the deployed intro.

## Status (2026-07-07, session auto_AUTO789)
- ✅ Intro v2 (music tail after last line) approved by Commander; web-optimized version to be swapped onto the site.
- ✅ Sentinel persona `vault_guide` upserted + verified (tells the dad/Alzheimer's story).
- ✅ Landing layout metadata de-EPT'd; SPEC written.
- ⏳ TODO: gold/black landing rewrite · Vault login page · repoint app auth · guard script · voice-interview
  wiring (TTS+STT+converse) · payment endpoint+checkout · deploy + verify all acceptance.
- Deploy: Vercel force-deploy (auto-deploy dead), gitSource ECHO-OMEGA-PRIME/echo-prime-tech@main, token vault
  `Vercel_Deploy_Token_v2`, project `prj_2TXVE8qVUP31WES235nOiz9SNpqA` team `team_zltGa4jWp6vVNl2t98Z35wu3`.
