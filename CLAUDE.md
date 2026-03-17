# echo-ept.com — Claude Code Instructions

**READ `INTEGRATION_GUIDE.md` BEFORE MAKING ANY CHANGES.**

## Architecture

- **Framework**: Next.js 15.3, React 19, TypeScript 5.7
- **Output**: Static export (`output: 'export'` — NO server-side API routes)
- **Auth**: Firebase (email/password + Google OAuth)
- **Backend**: All logic in Cloudflare Workers
- **Deployment**: Push to `main` on `github.com/bobmcwilliams4/echo-prime-tech` → Vercel auto-deploys

## Navigation

**No sidebar.** Each page has its own **top nav bar**. Home page nav links in `app/page.tsx`:

```ts
const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];
```

## Theme — NEVER Hardcode Colors

Day/night auto-toggle. ALL colors via CSS variables:

```tsx
// Tailwind for layout:
className="p-6 rounded-xl border flex items-center gap-4"

// Inline styles for theme colors:
style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', color: 'var(--ept-text)' }}
```

| Variable | Day | Night | Usage |
|----------|-----|-------|-------|
| `--ept-bg` | #ffffff | #050508 | Page background |
| `--ept-text` | #0f172a | #e2e8f0 | Primary text |
| `--ept-text-secondary` | #475569 | #94a3b8 | Secondary text |
| `--ept-text-muted` | #94a3b8 | #64748b | Muted text |
| `--ept-accent` | #0d7377 | #14b8a6 | Buttons, highlights (teal) |
| `--ept-card-bg` | #ffffff | #0c1220 | Card backgrounds |
| `--ept-card-border` | #e2e8f0 | #1e293b | Card borders |
| `--ept-border` | #e2e8f0 | #1e293b | General borders |
| `--ept-surface` | #f1f5f9 | #0f172a | Input backgrounds |

## Hooks

```tsx
const { isDark, toggle } = useTheme();           // from lib/theme-context.tsx
const { user, loading, role, subscriptions } = useAuth();  // from lib/auth-context.tsx
```

## Auth Guard (protected pages)

```tsx
useEffect(() => {
  if (!loading && !user) router.push('/login');
}, [user, loading, router]);

if (loading || !user) return <Spinner />;
```

## Fonts

- **Inter** — body text, UI (default)
- **JetBrains Mono** — `font-mono` class for code
- No Orbitron on this site

## API Client Pattern

All API clients in `lib/*-api.ts` follow:

```ts
async function apiFetch(path: string, options: RequestInit = {}) {
  const { auth } = await import('./firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

## Existing API Clients (lib/)

| File | Worker | Purpose |
|------|--------|---------|
| `engine-cloud-api.ts` | echo-engine-runtime | Engine queries, pricing |
| `sentinel-cloud-api.ts` | echo-chat | Sentinel AI, Trinity, Cortex |
| `ept-api.ts` | ept-api | Users, services, subscriptions |
| `closer-api.ts` | billymc-api | AI Sales Agent |
| `daedalus-forge-api.ts` | daedalus-forge-api | Manufacturing AI |
| `hephaestion-forge-api.ts` | hephaestion-forge-api | Software factory AI |
| `echocad-api.ts` | echocad-api | CAD automation |
| `tax-return-api.ts` | tax-return-api | Tax returns |
| `use-tts.ts` | Echo Speak | TTS hook |

## Styling Quick Reference

| Element | Code |
|---------|------|
| Card | `className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}` |
| Primary button | `className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}` |
| Ghost button | `className="px-6 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}` |
| Page heading | `className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}` |
| Nav bar | `className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}` |
| Logo | `<Image src={isDark ? '/logo-night.png' : '/logo-day.png'} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />` |
| Spinner | `className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}` |
| Gradient text | `className="gradient-text font-extrabold"` |
| Fade-in | `className="animate-fade-up"` (delay variants: `animate-fade-up-delay-1` through `delay-5`) |

## Site-Wide Components (auto-included in layout)

- `ParticleBackground` — stars, nebula, matrix rain
- `EchoPrimeChat` — floating chat button (bottom-right)
- `AuthProvider` + `ThemeProvider` — context wrappers

Do NOT add these to individual pages.

## SENTINEL AI PROTOCOL (LOCKED — Commander Approval Required for Changes)

Sentinel (`/sentinel`) is the professional engine-backed intelligence interface. It is NOT a chatbot.

**Routing Rules:**
1. Sentinel requests (`site_id: 'echo-ept'`) route through `engine-router.ts` in echo-chat Worker FIRST
2. Title chain requests auto-detected via `parseTitleChainRequest()` → Landman Pipeline (async, with clue loops)
3. Tax/Legal/Cyber/Oilgas/Finance/Engineering/Medical queries → Engine Runtime doctrine blocks with IRC/case law/standards citations
4. NEVER use Groq for Sentinel domain queries — only trained adapters or Azure GPT-4.1
5. Only GENERAL queries may use trained adapters as primary source
6. Every answer MUST include document references or authority citations
7. Confidence stratification required: DEFENSIBLE / AGGRESSIVE / DISCLOSURE / HIGH_RISK

**Response Format (engine-backed):**
- Primary conclusion with confidence level
- Supporting authority citations (IRC sections, case law, NIST frameworks, etc.)
- Key factors and risk assessment
- Counter-arguments where applicable

**Title Chain Pipeline:**
- `parseTitleChainRequest()` detects natural language title requests
- Triggers `startAsyncInvestigation()` via landman-api.ts → async pipeline
- Progress polled every 3s via `getJobProgress()`
- Results rendered in `TitleChainReport` component (5 tabs: Summary, Run Sheet, Ownership, Gaps, Full Report)

**Markdown Rendering:**
- All assistant messages rendered via `MarkdownBlock` component with `sentinel-md` CSS class
- CSS styles in `globals.css` under `.sentinel-md .md-*` selectors

**Key Files:**
| File | Purpose |
|------|---------|
| `app/sentinel/page.tsx` | Main Sentinel AI chat page |
| `components/MarkdownBlock.tsx` | Markdown-to-HTML renderer |
| `components/TitleChainReport.tsx` | Professional title chain report (5 tabs) |
| `lib/sentinel-cloud-api.ts` | Echo Chat API client |
| `lib/landman-api.ts` | Landman Pipeline API client |
| `WORKERS/echo-chat/src/engine-router.ts` | Engine Runtime query + doctrine formatting |

**NO modifications to Sentinel chat architecture without explicit Commander approval.**
