# Echo Prime Technologies

The web platform for Echo Omega Prime — a Next.js application at [echo-ept.com](https://echo-ept.com). Browse AI intelligence engines, access domain-specific tools, manage subscriptions, and interact with the Echo ecosystem.

## Features

- **Engine Browser** — Explore 674+ domain intelligence engines across 178 verticals
- **AI Chat** — 14-personality AI chat with voice synthesis
- **Tax Preparation** — AI-assisted tax returns with IRC citation lookup
- **Sales Closer** — AI-powered sales scripts and lead management
- **Collectibles Grading** — AI authentication and grading for comics and collectibles
- **Knowledge System** — Search and explore the knowledge graph
- **Voice Lab** — Multi-personality text-to-speech with emotional control
- **Security Tools** — Pentesting and vulnerability scanning interfaces
- **Credential Vault** — Encrypted credential management with master password
- **Admin Dashboard** — User management, analytics, subscription tracking
- **Stripe Billing** — Subscription tiers with checkout and billing portal

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication
- **Payments**: Stripe
- **API**: Cloudflare Workers backend (ept-api)
- **Deployment**: Vercel
- **Voice**: ElevenLabs TTS integration

## Getting Started

```bash
git clone https://github.com/bobmcwilliams4/echo-prime-tech.git
cd echo-prime-tech
npm install
npm run dev
```

Requires Firebase and Stripe configuration. See `lib/firebase.ts` and `lib/ept-api.ts`.

## Author

**Bobby Don McWilliams II** · bobmcwilliams4@outlook.com · [echo-ept.com](https://echo-ept.com)

## License

Proprietary
