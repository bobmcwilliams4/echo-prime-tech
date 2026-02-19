# AI Sales Agent — Integration Guide for Echo Prime Technologies Website

**Version:** 1.1
**Date:** 2026-02-19
**Website:** https://echo-ept.com
**Support:** bob@echo-op.com | customerservice@echo-op.com

---

## Source Code & Deployment

| Item | Location |
|------|----------|
| **GitHub Repo** | `https://github.com/bobmcwilliams4/echo-prime-tech.git` |
| **Local Source** | `O:\ECHO_OMEGA_PRIME\WEBSITES\echo-prime-tech\` |
| **Branch** | `main` |
| **Auto-Deploy** | Push to `main` → Vercel builds and deploys automatically |
| **Backend API** | `https://ept-api.bmcii1976.workers.dev` (Cloudflare Worker) |
| **Backend Source** | `O:\ECHO_OMEGA_PRIME\WORKERS\ept-api\` |

### How to Deploy Changes

```bash
cd O:\ECHO_OMEGA_PRIME\WEBSITES\echo-prime-tech
git add .
git commit -m "description of changes"
git push origin main
# Vercel auto-deploys within ~60 seconds
```

### How to Deploy Backend API Changes

```bash
cd O:\ECHO_OMEGA_PRIME\WORKERS\ept-api
npx wrangler deploy
```

---

## Overview

The AI Sales Agent (voice closer) integrates into the Echo Prime Technologies website at **https://echo-ept.com/closer**. The product is white-label — "BillyMC" was the first client deployment; all new users get a clean, unbranded interface.

---

## Architecture

```
Frontend (echo-ept.com)          Backend (Cloudflare Workers)
┌─────────────────────┐         ┌──────────────────────────────┐
│ /closer              │ ───────▶│ ept-api.bmcii1976.workers.dev│
│ (Next.js static)     │         │ - User auth + subscriptions  │
│                      │         └──────────────────────────────┘
│ /closer/dashboard    │
│ /closer/leads        │ ───────▶┌──────────────────────────────┐
│ /closer/calls        │         │ billymc-api.bmcii1976.workers │
│ /closer/campaigns    │         │ - 47 REST endpoints          │
│ /closer/scripts      │         │ - D1: billymc database       │
│ /closer/analytics    │         │ - R2: recordings + artifacts  │
└─────────────────────┘         │ - KV: cache                  │
                                └──────────┬───────────────────┘
                                           │ service binding
                                ┌──────────▼───────────────────┐
                                │ billymc-voice.bmcii1976.workers│
                                │ - Durable Objects (per-call)  │
                                │ - Twilio Media Streams (WS)   │
                                │ - Deepgram STT (Nova2)        │
                                │ - Azure GPT-5.2-chat LLM      │
                                │ - ElevenLabs TTS v3           │
                                └───────────────────────────────┘
```

---

## Backend API Endpoints

### billymc-api (`https://billymc-api.bmcii1976.workers.dev`)

**Authentication:** Firebase JWT token in `Authorization: Bearer <token>` header, OR API key in `X-Echo-API-Key` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/signup` | Create user account |
| POST | `/auth/login` | Authenticate |
| GET | `/leads` | List leads |
| POST | `/leads` | Create lead |
| GET | `/leads/:id` | Get lead detail |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |
| POST | `/leads/import` | Bulk import leads (CSV) |
| GET | `/calls` | List calls |
| GET | `/calls/:id` | Call detail (transcript, recording) |
| GET | `/calls/:id/events` | Call events timeline |
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns` | Create campaign |
| GET | `/campaigns/:id` | Campaign detail |
| PUT | `/campaigns/:id` | Update campaign |
| GET | `/scripts` | List sales scripts |
| POST | `/scripts` | Create script |
| GET | `/scripts/:id` | Script detail |
| PUT | `/scripts/:id` | Update script |
| GET | `/appointments` | List appointments |
| GET | `/analytics/dashboard` | Real-time KPIs |
| GET | `/analytics/costs` | Cost breakdown by service |
| GET | `/dnc/check/:phone` | Check Do-Not-Call list |
| POST | `/dnc` | Add number to DNC |

### billymc-voice (`https://billymc-voice.bmcii1976.workers.dev`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/voice/health` | Voice service health |
| POST | `/voice/outbound` | Initiate outbound call |
| POST | `/voice/inbound` | Inbound call webhook (Twilio) |
| WS | `/voice/stream/:callId` | Twilio Media Streams WebSocket |
| WS | `/voice/live/:callId` | Live transcript WebSocket (frontend) |
| GET | `/voice/call/:callId` | Call status |
| GET | `/voice/calls` | List active calls |
| GET | `/voice/events/:callId` | Call event log |

---

## Frontend Integration Rules

### 1. Authentication

All closer pages MUST use the shared Firebase auth context:

```tsx
import { useAuth } from '../../lib/auth-context';

export default function CloserPage() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) { redirect('/login'); return null; }

  // User is authenticated — render page
}
```

The Firebase project is `echo-prime-ai`. Tokens are obtained via `auth.currentUser.getIdToken()`.

### 2. API Client Pattern

Create API calls using the Firebase ID token:

```tsx
async function closerFetch(path: string, options: RequestInit = {}) {
  const { auth } = await import('../../lib/firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  return fetch(`https://billymc-api.bmcii1976.workers.dev${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }).then(r => r.json());
}
```

### 3. Design System — MANDATORY

Every page MUST use the EPT CSS variable system. **Never hardcode colors.**

```css
/* Always use these variables */
var(--ept-bg)              /* Page background */
var(--ept-text)            /* Primary text */
var(--ept-text-secondary)  /* Secondary text */
var(--ept-text-muted)      /* Muted/caption text */
var(--ept-accent)          /* Gold accent (#C9A94E day, #D4AF37 night) */
var(--ept-accent-glow)     /* Accent with transparency for backgrounds */
var(--ept-surface)         /* Elevated surface */
var(--ept-card-bg)         /* Card backgrounds */
var(--ept-card-border)     /* Card borders */
var(--ept-border)          /* General borders */
var(--ept-nav-bg)          /* Navigation background */
```

**Day/Night theme** switches automatically at 6am/6pm. All colors auto-adapt via CSS variables. Do NOT add separate dark mode logic — it's handled globally.

### 4. Component Patterns

Cards:
```tsx
<div className="p-6 rounded-xl border" style={{
  backgroundColor: 'var(--ept-card-bg)',
  borderColor: 'var(--ept-card-border)'
}}>
```

Buttons (primary):
```tsx
<button className="px-5 py-2.5 rounded-lg font-semibold" style={{
  backgroundColor: 'var(--ept-accent)',
  color: '#fff'
}}>
```

Stat values:
```tsx
<span className="text-2xl font-extrabold font-mono gradient-text">42</span>
```

### 5. Page Structure

Every closer sub-page lives under `/closer/`:

```
/closer              → Main dashboard (leads overview, active calls, KPIs)
/closer/leads        → Lead management table
/closer/leads/[id]   → Lead detail
/closer/calls        → Call history
/closer/calls/[id]   → Call detail with transcript + recording
/closer/campaigns    → Campaign management
/closer/scripts      → Script library
/closer/analytics    → Performance metrics + cost tracking
/closer/settings     → Closer-specific settings
```

### 6. File Location

All closer frontend code goes in:
```
O:\ECHO_OMEGA_PRIME\WEBSITES\echo-prime-tech\app\closer\
```

### 7. Logos

- **Day mode logo:** `/logo-day.png` (dark navy hexagon, gold accents — use on light backgrounds)
- **Night mode logo:** `/logo-night.png` (deep blue hexagon, gold text — use on dark backgrounds)
- Apply `style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}` for transparent rendering

---

## CORS Configuration

The `billymc-api` worker MUST have these origins in its CORS config:

```
https://echo-ept.com
https://www.echo-ept.com
http://localhost:3000
```

Currently configured origins: `billy.echo-op.com`, `billymc.echo-op.com`, `echo-op.com`, `localhost:3000`

**ACTION REQUIRED:** Add `echo-ept.com` and `www.echo-ept.com` to the billymc-api CORS whitelist in `O:\ECHO_OMEGA_PRIME\WORKERS\billymc-api\src\index.js`, then redeploy.

---

## White-Label Rules

1. **NO "BillyMC" branding** in any user-facing UI — that was the first client's name
2. Use **"AI Sales Agent"** or **"AI Closer"** as the product name
3. Each tenant gets their own leads, calls, campaigns, scripts — isolated by user ID
4. The script engine, voice settings, and CRM are per-user configurable
5. Future: multi-tenant with organization-level isolation

---

## D1 Database Schema (billymc)

**Database ID:** `3e75bee5-8fbd-451f-b5e4-c45ac8971842`

| Table | Purpose |
|-------|---------|
| `users` | Tenant accounts (uid, email, role) |
| `leads` | Lead records (name, phone, email, company, status, priority) |
| `calls` | Call metadata (twilio_sid, direction, duration, transcript, cost) |
| `call_events` | Per-call transcription events (speaker, content, confidence) |
| `scripts` | Sales scripts (states, personality, objection_handlers) |
| `campaigns` | Campaign settings (lead_filter, schedule, pacing) |
| `appointments` | Booked appointments |
| `dnc_list` | Do-Not-Call enforcement |
| `billing_events` | Cost tracking per service (Twilio, Deepgram, ElevenLabs, LLM) |
| `audit_log` | Full audit trail |
| `emails` | Email integration |

---

## Voice Pipeline

```
Inbound/Outbound Call
  → Twilio Media Streams (WebSocket, mulaw 8kHz)
  → Deepgram STT Nova2 (real-time transcription)
  → Azure GPT-5.2-chat (reasoning + response generation)
     ↳ Fallback: GPT-4.1 (eastus)
  → ElevenLabs TTS v3 Turbo (voice synthesis)
     ↳ Voice ID: onwK4e9ZLuTAKqWW03F9
  → Twilio (audio back to caller)
```

**Latency target:** < 2 seconds end-to-end (STT → LLM → TTS)

**Barge-in:** If the lead starts talking mid-response, the agent stops within 150ms.

**Turn-taking:** Context-aware pauses (800ms for greetings, 400ms for warm goodbyes).

---

## Secrets (all configured on billymc-voice Worker)

| Secret | Status |
|--------|--------|
| `TWILIO_PHONE_NUMBER` | SET (+1 432 Midland TX) |
| `TWILIO_ACCOUNT_SID` | SET |
| `TWILIO_AUTH_TOKEN` | SET |
| `DEEPGRAM_API_KEY` | SET |
| `ELEVENLABS_API_KEY` | SET |
| `AZURE_API_KEY` | SET (GPT-4.1 eastus) |
| `AZURE_PRIME_KEY` | SET (GPT-5.2-chat eastus2) |
| `CARTESIA_API_KEY` | SET |
| `CARTESIA_VOICE_ID` | SET |
| `OPENAI_API_KEY` | SET |

All 10 secrets configured. Voice pipeline is fully operational.

---

## Do's and Don'ts

### DO:
- Use the EPT CSS variable system for all styling
- Use Firebase auth context (`useAuth()`) for authentication
- Use the API client pattern with Firebase ID tokens
- Follow the `/closer/*` URL structure
- Keep all state in the billymc D1 database via the API
- Support both day and night themes
- Use `font-mono` for numbers/stats, `gradient-text` for emphasis
- Test with both light and dark themes
- Add new pages as `app/closer/[pagename]/page.tsx`

### DON'T:
- Don't hardcode colors — always use CSS variables
- Don't expose the tech stack (Cloudflare, D1, R2) in user-facing UI
- Don't use "BillyMC" anywhere in the UI — use "AI Sales Agent"
- Don't bypass Firebase auth — every API call must include a token
- Don't add custom fonts — use the existing Geist Sans/Mono
- Don't create separate dark mode CSS — the variable system handles it
- Don't store secrets in code — use Cloudflare Worker secrets
- Don't call the billymc-voice worker directly from the frontend (go through billymc-api)
- Don't import from echo-op.com codebase — keep EPT self-contained

---

## Quick Start

1. Clone the repo: `git clone https://github.com/bobmcwilliams4/echo-prime-tech.git`
2. Install deps: `npm install`
3. Copy `.env.local` with Firebase keys
4. Create your page: `app/closer/page.tsx`
5. Use auth: `const { user } = useAuth();`
6. Call API: `fetch('https://billymc-api.bmcii1976.workers.dev/leads', { headers: { Authorization: 'Bearer ' + token } })`
7. Style with CSS vars: `style={{ color: 'var(--ept-text)' }}`
8. Test: `npm run dev`
9. Deploy: `git push origin main` (Vercel auto-deploys)

---

## Contact

- **Technical:** bob@echo-op.com
- **Support:** customerservice@echo-op.com
- **Website:** https://echo-ept.com
