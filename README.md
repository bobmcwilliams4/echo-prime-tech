# Echo Prime Technologies -- Commercial Product Platform

![Next.js 15](https://img.shields.io/badge/Next.js-15.3-000000?style=flat-square&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.183-000000?style=flat-square&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.9-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production-brightgreen?style=flat-square)

> The customer-facing commercial storefront for Echo Prime Technologies. 49 pages showcasing 6,500+ AI intelligence engines, security tools, voice synthesis, manufacturing AI, tax returns, title intelligence, and enterprise SaaS products -- with day/night theme, Firebase auth, 3D visualizations, and deep Cloudflare Worker integrations.

**Live at:** [echo-ept.com](https://echo-ept.com)

---

## Overview

echo-ept.com is the production storefront where Echo Prime Technologies sells AI products and services to customers. It is a statically-exported Next.js 15 application with 49 pages, automatic day/night theme switching via CSS custom properties, Firebase authentication (email + Google OAuth), role-based access control, subscription gating, checkout flows, and admin panels.

Every page connects to live Cloudflare Worker backends for real-time engine queries, AI chat with 14 personas, sales agent automation, manufacturing design, and more. The site features a particle background with stars, nebula effects, and matrix rain animation, a floating AI chat button on every page, and TTS read-aloud integration.

## Architecture

```
+------------------------------------------------------------------+
|                     echo-ept.com (Vercel)                         |
|              Next.js 15 / React 19 / TypeScript 5.7               |
|                Static Export (output: 'export')                    |
+------------------------------------------------------------------+
|  +----------+ +-----------+ +----------+ +---------------------+  |
|  | Engines  | | Sentinel  | |  Closer  | | Hephaestion Forge   |  |
|  | Market   | |  AI Chat  | | AI Sales | | Software Factory    |  |
|  +----+-----+ +-----+-----+ +----+-----+ +---------+-----------+  |
|       |              |            |                 |              |
|  +----+--------------+------------+-----------------+------------+ |
|  |    ParticleBackground + EchoPrimeChat + ReadAloudButton       | |
|  |    lib/*-api.ts API Clients + AuthContext + ThemeContext       | |
|  +------------------------------+--------------------------------+ |
+-----------------------------  --+----------------------------------+
                                  | HTTPS + Firebase Auth tokens
          +-----------------------+------------------------+
          |                       |                        |
+---------+-------+  +-----------+---------+  +------------+------+
| echo-engine-    |  | echo-chat           |  | ept-api           |
| runtime         |  | (14 AI personas)    |  | (users/subs/roles)|
| 6,500+ engines  |  | Sentinel, Trinity   |  | Firebase admin    |
+-----------------+  +---------------------+  +-------------------+
          |                       |                        |
+---------+-------+  +-----------+---------+  +------------+------+
| hephaestion-    |  | daedalus-forge      |  | billymc-api       |
| forge           |  | (Manufacturing AI)  |  | (AI Sales Agent)  |
| Software Factory|  | 50-stage pipeline   |  | Closer platform   |
+-----------------+  +---------------------+  +-------------------+
          |                       |
+---------+-------+  +-----------+---------+
| echo-speak-cloud|  | echo-knowledge-     |
| (3-tier TTS)    |  | forge (5,387 docs)  |
+-----------------+  +---------------------+
```

## Features

### Product Pages

- **Engines Marketplace** -- Browse, search, and query 6,500+ AI intelligence engines across 1,000+ domains with live stats, pricing tiers, and interactive query panel
- **Bots** -- Social media bot showcase (X/Twitter, LinkedIn, Telegram, Discord)
- **Scrapers** -- Data extraction and web scraping service catalog
- **Pipelines** -- Autonomous data pipeline orchestration tools
- **Security** -- Enterprise security products and monitoring solutions
- **Pentesting** -- Penetration testing and vulnerability assessment services
- **Voice** -- Text-to-speech synthesis with ElevenLabs + Qwen3-TTS integration
- **Websites** -- Website builder with AI-assisted design tools
- **Tax Returns** -- AI-powered tax return preparation (14 engines, TX01-TX14)
- **Title Intelligence** -- Land title examination, chain-of-title analysis, gap detection
- **EchoCAD** -- AI-assisted CAD automation and design
- **Knowledge Forge** -- 5,387-document knowledge base query interface
- **Grading** -- Collectibles and card grading AI system
- **Immortality Vault** -- Digital legacy and memory preservation platform

### AI Forges

- **Hephaestion Forge** -- 13-stage AI software factory with 42+ LLM providers, 15 project archetypes
- **Daedalus Forge** -- Manufacturing AI with 50-stage pipeline, 15 guilds, CNC programming, engineering calculators

### Sentinel AI

- **Sentinel Chat** -- 14 AI personalities (Echo, Bree, GS343, Prometheus, Phoenix, Commander, and more)
- **Trinity Integration** -- Multi-model AI orchestration
- **Cortex Memory** -- Persistent conversation memory

### Closer AI (Sales Platform)

Full embedded sales automation platform with 10 sub-routes:
- Demo, leads, lead detail, campaigns, calls, live calls, call review, appointments, analytics, scripts, tutorial, settings

### Commerce

- **Pricing** -- Tiered subscription plans with feature comparison
- **Checkout** -- Stripe-integrated payment flow with success confirmation
- **Rewards** -- Customer loyalty and rewards program
- **Admin Panel** -- Payment management, invoice tracking, user administration

### Platform

- **Dashboard** -- Authenticated user dashboard
- **Orchestration** -- Multi-agent AI orchestration control
- **Sandbox** -- Interactive testing environment
- **Vault** -- Credential and secret management
- **Login / Signup** -- Firebase authentication with Google OAuth
- **Legal** -- Terms of service and privacy policy

## Pages & Routes (49)

| Route | Description |
|-------|-------------|
| `/` | Landing page -- capabilities, live stats, industry verticals, how-it-works |
| `/engines` | Engine marketplace with search, filtering, live query panel |
| `/bots` | Social media bot catalog |
| `/scrapers` | Data extraction services |
| `/pipelines` | Data pipeline orchestration |
| `/security` | Enterprise security products |
| `/pentesting` | Penetration testing services |
| `/voice` | TTS voice synthesis |
| `/websites` | Website builder platform |
| `/websites/builder` | AI-assisted website builder |
| `/tax-returns` | AI tax return preparation |
| `/title-intelligence` | Land title analysis and examination |
| `/echocad` | CAD automation AI |
| `/knowledge` | Knowledge Forge query interface |
| `/grading` | Collectibles grading AI |
| `/immortality-vault` | Digital legacy platform |
| `/immortality-vault/app` | Vault application interface |
| `/hephaestion-forge` | Software factory AI |
| `/daedalus-forge` | Manufacturing AI |
| `/sentinel` | AI chat with 14 personas |
| `/closer` | AI sales platform overview |
| `/closer/demo` | Sales demo environment |
| `/closer/leads` | Lead management |
| `/closer/leads/detail` | Lead detail view |
| `/closer/campaigns` | Campaign management |
| `/closer/calls` | Call history |
| `/closer/calls/live` | Live call monitoring |
| `/closer/calls/review` | Call review and scoring |
| `/closer/appointments` | Appointment management |
| `/closer/analytics` | Sales analytics |
| `/closer/scripts` | Sales script library |
| `/closer/tutorial` | Platform tutorial |
| `/closer/settings` | Closer configuration |
| `/pricing` | Subscription plans and comparison |
| `/services` | Services overview |
| `/checkout` | Payment flow |
| `/checkout/success` | Payment confirmation |
| `/rewards` | Loyalty program |
| `/orchestration` | Multi-agent AI orchestration |
| `/sandbox` | Testing environment |
| `/vault` | Secret management |
| `/dashboard` | User dashboard |
| `/admin` | Admin panel |
| `/admin/payments` | Payment management |
| `/admin/invoices` | Invoice tracking |
| `/login` | Authentication |
| `/signup` | Registration |
| `/legal/terms` | Terms of service |
| `/legal/privacy` | Privacy policy |

## Key Components

| Component | Purpose |
|-----------|---------|
| `ParticleBackground` | Stars, nebula, matrix rain animation (auto-included in layout) |
| `EchoPrimeChat` | Floating AI chat button, bottom-right on all pages |
| `NebulaCoreScene` | Three.js 3D scene for product showcases |
| `AgenticProgressPanel` | Real-time agentic task tracking display |
| `EngineQueryPanel` | Interactive engine query interface |
| `DocumentViewer` | PDF and DOCX rendering (pdfjs-dist + mammoth) |
| `ReadAloudButton` | TTS read-aloud integration |
| `SubscriptionGate` | Paywall and subscription guard component |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.3 | React framework, static export |
| React | 19.0 | UI component library |
| TypeScript | 5.7 | Type-safe development |
| Three.js | 0.183 | 3D WebGL visualizations |
| React Three Fiber | 9.5 | React renderer for Three.js |
| React Three Drei | 10.7 | Three.js helper components |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| Firebase | 12.9 | Auth (email + Google OAuth) |
| pdfjs-dist | 5.5 | PDF document rendering |
| mammoth | 1.11 | DOCX document parsing |
| Vercel Analytics | 1.6 | Performance monitoring |
| Vercel Speed Insights | 1.3 | Core Web Vitals tracking |

## Theme System

Automatic day/night toggle using CSS custom properties. All colors are applied via `var(--ept-*)` tokens -- never hardcoded.

| Variable | Day | Night | Usage |
|----------|-----|-------|-------|
| `--ept-bg` | #ffffff | #050508 | Page background |
| `--ept-text` | #0f172a | #e2e8f0 | Primary text |
| `--ept-text-secondary` | #475569 | #94a3b8 | Secondary text |
| `--ept-accent` | #0d7377 | #14b8a6 | Buttons, highlights (teal) |
| `--ept-card-bg` | #ffffff | #0c1220 | Card backgrounds |
| `--ept-card-border` | #e2e8f0 | #1e293b | Card borders |
| `--ept-surface` | #f1f5f9 | #0f172a | Input backgrounds |

Fonts: **Inter** (body), **JetBrains Mono** (code). No Orbitron on this site.

## API Clients

| File | Worker | Purpose |
|------|--------|---------|
| `engine-cloud-api.ts` | echo-engine-runtime | Engine queries, domain stats, pricing |
| `sentinel-cloud-api.ts` | echo-chat | AI chat, 14 personas, Sentinel/Trinity/Cortex |
| `ept-api.ts` | ept-api | Users, subscriptions, roles |
| `closer-api.ts` | billymc-api | AI sales agent, leads, campaigns |
| `daedalus-forge-api.ts` | daedalus-forge | Manufacturing AI, engineering calcs |
| `hephaestion-forge-api.ts` | hephaestion-forge | Software factory, 13-stage pipeline |
| `echocad-api.ts` | echocad-api | CAD automation |
| `tax-return-api.ts` | tax-return-api | Tax return preparation |
| `use-tts.ts` | echo-speak-cloud | Text-to-speech React hook |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/bobmcwilliams4/echo-prime-tech.git
cd echo-prime-tech
npm install
```

### Development

```bash
npm run dev
# Application runs on http://localhost:3000
```

### Production Build

```bash
npm run build    # Runs verify-site.js pre-build, generates static export
npm start        # Serves the production build
```

## Deployment

Auto-deploys from the `main` branch via Vercel. Push to `main` = production deploy.

Pre-build validation runs `scripts/verify-site.js` to enforce site identity.

| Component | Service |
|-----------|---------|
| Frontend Hosting | Vercel (static export, auto-deploy) |
| Backend Workers | Cloudflare Workers (9+ integrated) |
| Authentication | Firebase (echo-prime-ai) |
| Payments | Stripe (via ept-api Worker) |
| DNS | Cloudflare |
| Analytics | Vercel Analytics + Speed Insights |

## Connected Workers

| Worker | Purpose |
|--------|---------|
| echo-engine-runtime | 6,500+ intelligence engines across 1,000+ domains |
| echo-chat | 14 AI personality conversations (Sentinel AI) |
| ept-api | User management, subscriptions, roles |
| billymc-api | AI sales agent and Closer platform |
| daedalus-forge | Manufacturing AI with 50-stage pipeline |
| hephaestion-forge | Software factory with 13-stage pipeline |
| echo-speak-cloud | 3-tier TTS voice synthesis |
| echo-knowledge-forge | 5,387 knowledge documents |
| echo-landman-pipeline | Title research and land analysis |

## Part of ECHO OMEGA PRIME

This is the **commercial storefront** for **[ECHO OMEGA PRIME](https://echo-op.com)** -- a distributed autonomous AI platform spanning 31+ Cloudflare Workers, 4 compute nodes, 6,500+ intelligence engines, and 312K+ knowledge graph nodes.

All products and services available at echo-ept.com are powered by the ECHO OMEGA PRIME infrastructure.

**Built by Echo Prime Technologies** | [echo-ept.com](https://echo-ept.com)

---

*Proprietary software. All rights reserved.*
