<p align="center">
  <img src="public/logo-day.png" alt="Echo Prime Technologies" width="200" />
</p>

<h1 align="center">Echo Prime Technologies</h1>

<p align="center">
  <strong>The web platform for Echo Omega Prime -- AI intelligence engines, voice synthesis, security tools, and domain expertise at your fingertips.</strong>
</p>

<p align="center">
  <a href="https://echo-ept.com">Live Site</a> &middot;
  <a href="https://github.com/bobmcwilliams4/Echo-Omega-Prime">Core System</a> &middot;
  <a href="https://echo-op.com">Echo Omega Prime</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## Overview

Echo Prime Technologies (`echo-ept.com`) is the customer-facing web portal for the Echo Omega Prime AI ecosystem. It provides a unified interface for browsing 674+ domain intelligence engines, interacting with 14 AI personalities via chat, preparing tax returns, managing credentials, generating voice audio, running security assessments, and grading collectibles -- all backed by a fleet of Cloudflare Workers.

The site auto-deploys from this repository via Vercel on every push to `main`.

---

## Pages and Features

| Page | Route | Description |
|------|-------|-------------|
| **Homepage** | `/` | Animated hero, service overview, pricing tiers, CTA |
| **Engine Browser** | `/engines` | Search and explore 674 engines across 65 domains with tier filtering and live query testing |
| **Sentinel** | `/sentinel` | AI security companion with standard, swarm, and echo_prime modes; cortex memory integration |
| **Voice Lab** | `/voice` | 12-section voice studio: TTS, STT, cloning, dubbing, SSML editor, batch processing, analysis |
| **Tax Returns** | `/tax-returns` | AI-assisted tax preparation with IRC citation lookup and form generation |
| **Sales Closer** | `/closer` | AI-powered sales scripts, lead management, call logging, campaign analytics |
| **Collectibles Grading** | `/grading` | AI authentication and grading for comics, cards, coins, and memorabilia |
| **Knowledge System** | `/knowledge` | Search and explore the knowledge graph (5,387+ documents) |
| **Pentesting** | `/pentesting` | Security testing interfaces and vulnerability scanning tools |
| **Security Sandbox** | `/security` | 27 CTF challenges with interactive browser-based terminals |
| **Credential Vault** | `/vault` | Encrypted credential management with master password protection |
| **Orchestration** | `/orchestration` | View engine build pipeline, worker status, fleet coordination |
| **Website Builder** | `/websites` | Managed website builder with template system |
| **Pricing** | `/pricing` | Subscription tiers with Stripe checkout integration |
| **Dashboard** | `/dashboard` | User analytics, usage metrics, subscription management |
| **Admin** | `/admin` | User management, system analytics (role-restricted) |
| **Login / Signup** | `/login`, `/signup` | Firebase Authentication with email/password and Google OAuth |
| **Services** | `/services` | Detailed breakdown of all Echo Prime service offerings |
| **Legal** | `/legal/privacy`, `/legal/terms` | Privacy policy and terms of service |

---

## Architecture

```
echo-prime-tech/
  app/                     # Next.js 15 App Router
    page.tsx               # Homepage with animated hero
    engines/page.tsx       # Engine browser (14.2KB, live API queries)
    sentinel/page.tsx      # AI sentinel interface (12.9KB)
    voice/page.tsx         # Voice studio (27.9KB, 12 sections)
    grading/page.tsx       # Collectibles grading (29.7KB)
    pentesting/page.tsx    # Security tools (13.1KB)
    security/page.tsx      # CTF sandbox (11.9KB)
    closer/               # Sales Closer sub-app with 5 pages
    tax-returns/page.tsx   # Tax preparation
    ...                    # 20+ pages total
    layout.tsx             # Root layout with theme, auth, fonts
    globals.css            # Tailwind base + custom styles
  components/
    echo-prime-chat.tsx    # Embedded AI chat widget (all pages)
    ParticleBackground.tsx # Animated background effects
    ReadAloudButton.tsx    # TTS integration button
  lib/
    engine-cloud-api.ts    # Engine Runtime API client (266 lines)
    sentinel-cloud-api.ts  # Sentinel API client (392 lines)
    ept-api.ts             # EPT backend API client
    tax-return-api.ts      # Tax Return Worker API client
    closer-api.ts          # Closer API client
    firebase.ts            # Firebase Auth initialization
    auth-context.tsx       # Auth context provider (React)
    theme-context.tsx      # Day/night theme provider
    use-tts.ts             # TTS React hook
  public/
    logo-day.png           # Light theme logo
    logo-night.png         # Dark theme logo
    robots.txt             # SEO configuration
    sitemap.xml            # Sitemap for search engines
  scripts/
    verify-site.js         # Pre-build site identity verification
```

---

## API Integrations

The frontend connects to these Cloudflare Workers:

| Worker | Purpose | API Client |
|--------|---------|------------|
| **Echo Engine Runtime** | 674 engines, 30,626 doctrines, hybrid search | `engine-cloud-api.ts` |
| **Echo Engine Cloud** | Domain-specific engine queries, Stripe billing | `ept-api.ts` |
| **Echo Chat** | 14-personality AI chat with memory | embedded chat widget |
| **Echo Speak** | TTS, STT, voice cloning, dubbing | `use-tts.ts` |
| **Echo Tax Return** | Tax preparation and calculation | `tax-return-api.ts` |
| **Sentinel Memory** | Security threat tracking | `sentinel-cloud-api.ts` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, static export) |
| **UI** | React 19, Tailwind CSS 3.4 |
| **Language** | TypeScript 5.7 |
| **Auth** | Firebase Authentication (email + Google OAuth) |
| **Payments** | Stripe (checkout, billing portal, webhooks) |
| **Hosting** | Vercel (auto-deploy from GitHub) |
| **Backend** | Cloudflare Workers (Hono, D1, R2, KV, Vectorize) |
| **Voice** | Echo Speak v2 (Qwen3-TTS + Whisper + Demucs) |
| **Theme** | Auto day/night with manual toggle |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/bobmcwilliams4/echo-prime-tech.git
cd echo-prime-tech

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_ENGINE_RUNTIME_URL=https://echo-engine-runtime.bmcii1976.workers.dev
NEXT_PUBLIC_CHAT_URL=https://echo-chat.bmcii1976.workers.dev
```

See `lib/firebase.ts` and `lib/ept-api.ts` for full configuration.

---

## Deployment

Every push to `main` triggers an automatic Vercel deployment:

```
GitHub push --> Vercel build --> Static export --> CDN distribution
```

The site uses `output: 'export'` for static generation. There are no server-side API routes -- all dynamic functionality is handled by Cloudflare Workers.

---

## Related Repositories

| Repository | Description |
|------------|-------------|
| [Echo-Omega-Prime](https://github.com/bobmcwilliams4/Echo-Omega-Prime) | Core system -- engines, memory, fleet |
| [echo-chat](https://github.com/bobmcwilliams4/echo-chat) | 14-personality AI chat worker |
| [echo-knowledge-scout](https://github.com/bobmcwilliams4/echo-knowledge-scout) | Daily knowledge scanner |
| [echo-op.com](https://github.com/bobmcwilliams4/echo-op.com) | Flagship site |
| [shadowglass-browser](https://github.com/bobmcwilliams4/shadowglass-browser) | Privacy-first browser |

---

## Author

**Bobby Don McWilliams II** -- AI Systems Architect, Midland, Texas

- Email: bobmcwilliams4@outlook.com
- Web: [echo-ept.com](https://echo-ept.com) | [echo-op.com](https://echo-op.com)

## License

Proprietary
