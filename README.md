# echo-prime-tech

**Echo Prime Technologies -- Commercial Product Platform (echo-ept.com)**

The customer-facing storefront for Echo Prime Technologies. A full-featured Next.js 15 application with 25+ pages showcasing AI engines, security tools, voice synthesis, manufacturing AI, tax intelligence, and more. Features day/night theme auto-toggle, Firebase auth, and deep Cloudflare Worker integrations.

Live at: [echo-ept.com](https://echo-ept.com)

---

## Architecture

```
+-------------------------------------------------------------+
|                  echo-ept.com (Vercel)                       |
|               Next.js 15 / React 19 / TS 5.7                |
+-------------------------------------------------------------+
|  +---------+ +----------+ +---------+ +------------------+  |
|  | Engines | | Sentinel | | Closer  | | Hephaestion      |  |
|  | Market  | | AI Panel | | Sales   | | Forge            |  |
|  +----+----+ +----+-----+ +----+----+ +------+-----------+  |
|       |            |            |             |              |
|  +----+------------+------------+-------------+-----------+  |
|  |           lib/ -- API Clients + Auth + Theme           |  |
|  +------------------------+-------------------------------+  |
+---------------------------+----------------------------------+
                            | HTTPS + Firebase Auth
        +-------------------+-------------------+
        |                   |                   |
+-------+--------+ +-------+--------+ +--------+-------+
| echo-engine-   | | echo-chat      | |  ept-api       |
| runtime        | | (Sentinel AI)  | |  (users/subs)  |
| 2,632 engines  | | 14 personas    | |  Firebase      |
+----------------+ +----------------+ +----------------+
```

## Features (25+ Pages)

Engines Marketplace, Bots, Scrapers, Closer AI Sales, Pipelines, Security, Pentesting, Title Intelligence, Sentinel AI, Pricing, Services, Tax Returns, Voice TTS, Knowledge Forge, Hephaestion Forge, Daedalus Forge, EchoCAD, Grading, Immortality Vault, Orchestration, Sandbox, Websites, Rewards, Dashboard, Admin, Checkout, Login/Signup, Legal.

### Key Components

- **ParticleBackground** -- Stars, nebula, matrix rain animation
- **EchoPrimeChat** -- Floating AI chat button (bottom-right)
- **NebulaCoreScene** -- Three.js 3D scene
- **AgenticProgressPanel** -- Real-time agentic task tracking
- **EngineQueryPanel** -- Interactive engine query interface
- **DocumentViewer** -- PDF/document rendering
- **ReadAloudButton** -- TTS integration
- **SubscriptionGate** -- Paywall component

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|  
| Next.js | 15.3 | React framework, static export |
| React | 19.0 | UI library |
| TypeScript | 5.7 | Type safety |
| Three.js / R3F | 0.183 | 3D visualizations |
| Tailwind CSS | 3.4 | Utility-first styling |
| Firebase | 12.9 | Auth (email + Google OAuth) |
| pdfjs-dist | 5.5 | PDF rendering |
| mammoth | 1.11 | DOCX parsing |
| Vercel Analytics | 1.6 | Performance monitoring |

## Getting Started

```bash
git clone https://github.com/ECHO-OMEGA-PRIME/echo-prime-tech.git
cd echo-prime-tech
npm install
npm run dev
```

## Environment Variables

Create `.env.local` with Firebase config and Worker API URLs.

## Theme System

Automatic day/night toggle with CSS custom properties (--ept-bg, --ept-text, --ept-accent, --ept-card-bg, --ept-card-border).

## Connected Workers

echo-engine-runtime, echo-chat, ept-api, billymc-api, daedalus-forge, hephaestion-forge, echo-speak-cloud, echo-knowledge-forge, echo-landman-pipeline.

## Deployment

Auto-deploys from main branch via Vercel. Push to main = production deploy.

---

**License:** Proprietary -- Echo Prime Technologies. All rights reserved.
