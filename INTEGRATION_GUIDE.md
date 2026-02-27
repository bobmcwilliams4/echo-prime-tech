# echo-ept.com — Page & Feature Integration Guide

## Quick Start: Add a New Page in 4 Steps

### Step 1: Create the API Client (if talking to a backend)

Create `lib/your-feature-api.ts`:

```ts
const API_BASE = 'https://your-worker.bmcii1976.workers.dev';

async function apiFetch(path: string, options: RequestInit = {}) {
  const { auth } = await import('./firebase');
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface YourItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export async function getItems(): Promise<{ items: YourItem[] }> {
  return apiFetch('/items');
}

export async function createItem(data: Partial<YourItem>): Promise<YourItem> {
  return apiFetch('/items', { method: 'POST', body: JSON.stringify(data) });
}
```

### Step 2: Create the Page

Create `app/your-feature/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getItems, YourItem } from '../../lib/your-feature-api';

export default function YourFeaturePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const [items, setItems] = useState<YourItem[]>([]);

  // Auth guard (remove if public page)
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Fetch data
  useEffect(() => {
    if (user) getItems().then(d => setItems(d.items)).catch(() => {});
  }, [user]);

  // Loading state
  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav Bar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between"
           style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT"
                 width={400} height={260} className="w-[160px] md:w-[200px] h-auto"
                 style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{user.email}</span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ color: 'var(--ept-text)' }}>Your Feature</h1>
        <p className="text-lg mb-12"
           style={{ color: 'var(--ept-text-secondary)' }}>Description of what this does.</p>

        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="p-6 rounded-xl border card-hover"
                 style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{item.name}</h3>
              <span className="text-xs font-semibold px-2 py-1 rounded"
                    style={{
                      backgroundColor: item.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)',
                      color: item.status === 'active' ? '#10b981' : '#fbbf24'
                    }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Add Navigation Link

Edit `app/page.tsx` — add to the `NAV_ITEMS` array in the home page:

```tsx
const NAV_ITEMS = [
  // ... existing items ...
  { label: 'Your Feature', href: '/your-feature' },
];
```

Nav items are plain `{ label: string, href: string }` objects — no icons, no badges.

### Step 4: Build & Deploy

```bash
cd O:\ECHO_OMEGA_PRIME\WEBSITES\echo-prime-tech
npm run build        # Must pass — static export generates all pages
git add .
git commit -m "Add your-feature page"
git push origin main # Vercel auto-deploys in ~60s
```

---

## Architecture Overview

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 15.3.0, React 19, TypeScript 5.7 |
| **Output** | Static export (`output: 'export'` — no server-side API routes) |
| **Auth** | Firebase Auth (email/password + Google OAuth) |
| **Theme** | Auto day/night via CSS variables (`.dark` class on `<html>`) |
| **Backend** | All logic in Cloudflare Workers — site is pure static HTML/JS |
| **Navigation** | Top nav bar per page (no sidebar) |
| **Deployment** | Push to `main` → Vercel auto-deploys |
| **GitHub** | `github.com/bobmcwilliams4/echo-prime-tech` |

---

## Theme System

### CSS Variables (use these — NEVER hardcode colors)

| Variable | Day | Night | Usage |
|----------|-----|-------|-------|
| `--ept-bg` | `#ffffff` | `#050508` | Page background |
| `--ept-bg-alt` | `#f8fafc` | `#0a0a10` | Alternate bg |
| `--ept-surface` | `#f1f5f9` | `#0f172a` | Surface/input bg |
| `--ept-surface-hover` | `#e2e8f0` | `#1e293b` | Surface hover |
| `--ept-border` | `#e2e8f0` | `#1e293b` | Borders |
| `--ept-text` | `#0f172a` | `#e2e8f0` | Primary text |
| `--ept-text-secondary` | `#475569` | `#94a3b8` | Secondary text |
| `--ept-text-muted` | `#94a3b8` | `#64748b` | Muted text |
| `--ept-accent` | `#0d7377` | `#14b8a6` | Primary accent (teal) |
| `--ept-accent-light` | `#0f9196` | `#2dd4bf` | Lighter accent |
| `--ept-card-bg` | `#ffffff` | `#0c1220` | Card background |
| `--ept-card-border` | `#e2e8f0` | `#1e293b` | Card border |
| `--ept-nav-bg` | `rgba(255,255,255,0.7)` | `rgba(5,5,8,0.7)` | Nav background |

### Theme Hook

```tsx
const { isDark, toggle } = useTheme();
```

- Auto-detects time of day on first visit (6am-6pm = day)
- Stores in `localStorage` as `'ept-theme'`
- Toggle button: `<button onClick={toggle}>{isDark ? '☀️' : '🌙'}</button>`

### Logo

```tsx
<Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT"
       width={400} height={260} className="w-[160px] md:w-[200px] h-auto"
       style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
```

---

## Fonts

| Font | Class | Usage |
|------|-------|-------|
| Inter | Default body font | Headings, body text, UI |
| JetBrains Mono | `font-mono` | Code blocks, terminal output |

Both imported via Google Fonts in `globals.css`.

---

## Styling Patterns

### Card

```tsx
<div className="p-6 rounded-xl border card-hover"
     style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Title</h3>
  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Description</p>
</div>
```

### Primary Button

```tsx
<button className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
        style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
  Action
</button>
```

### Ghost Button

```tsx
<button className="px-6 py-3 rounded-xl border font-semibold transition-all"
        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
  Secondary
</button>
```

### Section Heading

```tsx
<h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Title</h1>
<p className="mt-4 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>Subtitle</p>
```

### Status Badge

```tsx
<span className="text-xs font-semibold px-2 py-1 rounded"
      style={{
        backgroundColor: active ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)',
        color: active ? '#10b981' : '#fbbf24'
      }}>
  {active ? 'Active' : 'Pending'}
</span>
```

### Loading Spinner

```tsx
<div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
     style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
```

### Gradient Text

```tsx
<span className="gradient-text font-extrabold">Highlighted Text</span>
```

---

## Custom CSS Classes

| Class | Effect |
|-------|--------|
| `card-hover` | Lift-on-hover with shadow |
| `gradient-text` | Gradient text fill (accent colors) |
| `glow-sm` | Small glow around element |
| `glow-md` | Medium glow with two layers |
| `mesh-bg` | Animated mesh gradient background |
| `dot-grid` | Dot pattern background |
| `accent-line` | Horizontal gradient divider |
| `shimmer` | Shimmer loading animation |
| `scan-line` | Animated scan line effect |
| `pulse-ring` | Pulsing ring (live indicators) |
| `animate-fade-up` | Fade in + slide up |
| `animate-fade-up-delay-1` through `delay-5` | Staggered entrance (0.1s-0.5s) |

---

## Authentication

### Hook

```tsx
const { user, loading, role, subscriptions, signOut } = useAuth();
```

| Field | Type | Description |
|-------|------|-------------|
| `user` | `EPTUser \| null` | Firebase user |
| `loading` | `boolean` | Auth initializing |
| `role` | `'owner' \| 'user' \| null` | From backend |
| `subscriptions` | `string[]` | Subscribed service IDs |
| `signOut` | `() => Promise<void>` | Sign out |

### Auth Guard Pattern

```tsx
useEffect(() => {
  if (!loading && !user) router.push('/login');
}, [user, loading, router]);

if (loading || !user) return <Spinner />;
```

### Public Page (no guard needed)

Just skip the auth `useEffect` and the loading check. Use `useAuth()` only if you need user info optionally.

---

## Existing API Clients (`lib/`)

| File | Backend Worker | Purpose |
|------|---------------|---------|
| `engine-cloud-api.ts` | `echo-engine-runtime` | Engine queries, domain catalog, pricing |
| `sentinel-cloud-api.ts` | `echo-chat` | Sentinel AI, Trinity mode, Cortex memory |
| `ept-api.ts` | `ept-api` | Users, services, subscriptions |
| `closer-api.ts` | `billymc-api` | AI Sales Agent (leads, calls, campaigns) |
| `daedalus-forge-api.ts` | `daedalus-forge-api` | Manufacturing AI |
| `hephaestion-forge-api.ts` | `hephaestion-forge-api` | Software factory AI |
| `echocad-api.ts` | `echocad-api` | CAD automation |
| `tax-return-api.ts` | `tax-return-api` | Tax return preparation |
| `use-tts.ts` | Echo Speak | Text-to-speech hook |

All follow the same pattern: private `apiFetch()` with Firebase token injection, then exported typed functions.

---

## Existing Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home page with product showcase | No |
| `/engines` | Engine catalog (65 domains, 4 pricing tiers) | No |
| `/voice` | Voice studio (Echo Speak) | No |
| `/security` | Security sandbox (27 CTF challenges) | No |
| `/sentinel` | Sentinel AI chat | No |
| `/services` | Service selection for new users | No |
| `/pricing` | Pricing tiers | No |
| `/tax-returns` | Tax return preparation | Yes |
| `/dashboard` | User dashboard | Yes |
| `/admin` | Owner admin panel | Yes (owner) |
| `/login` | Sign in / sign up | No |
| `/closer` | AI Sales Agent (5 sub-routes) | Yes |
| `/daedalus-forge` | Manufacturing AI platform | Yes |
| `/hephaestion-forge` | Software factory AI | Yes |
| `/echocad` | CAD automation | Yes |
| `/orchestration` | Data pipeline management | Yes |
| `/pentesting` | Penetration testing tools | Yes |
| `/sandbox` | Security sandbox | Yes |
| `/knowledge` | Knowledge base browser | Yes |
| `/grading` | Collectibles grading | Yes |
| `/immortality-vault` | Digital consciousness | Yes |
| `/legal/privacy` | Privacy policy | No |
| `/legal/terms` | Terms of service | No |

---

## Site-Wide Components (auto-included)

These are in the root layout — do NOT add per page:

| Component | Location | Purpose |
|-----------|----------|---------|
| `AuthProvider` | `lib/auth-context.tsx` | Firebase auth state |
| `ThemeProvider` | `lib/theme-context.tsx` | Day/night theme |
| `ParticleBackground` | `components/ParticleBackground.tsx` | Stars, nebula, matrix rain |
| `EchoPrimeChat` | `components/echo-prime-chat.tsx` | Floating chat button (bottom-right) |

---

## Key Differences from echo-op.com

| Aspect | echo-op.com | echo-ept.com |
|--------|-------------|-------------|
| **Navigation** | Sidebar (always visible) | Top nav bar (per-page) |
| **Theme** | Dark only (magenta/orange) | Day/night auto-toggle (teal accent) |
| **Colors** | Hardcoded Tailwind classes | CSS variables (`var(--ept-*)`) |
| **Fonts** | Orbitron + Rajdhani | Inter + JetBrains Mono |
| **Auth** | Firebase + bloodline trust | Firebase + role-based |
| **Output** | Static export | Static export |
| **Framework** | Next.js 14.2 | Next.js 15.3 |
| **lib/ structure** | Organized (api/, services/, hooks/, types/) | Flat (one file per API client) |
| **Glass panels** | `.glass-panel` class | Card with `var(--ept-card-bg)` + border |

---

## Styling Rule: Tailwind + Inline Styles

```tsx
// Tailwind for layout/spacing
className="p-6 rounded-xl border flex items-center gap-4"

// Inline styles for theme-aware colors
style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }}
```

**NEVER hardcode colors** — always use `var(--ept-*)` variables so day/night works.

---

## File Checklist for a New Feature

- [ ] `lib/your-feature-api.ts` — API client with Firebase token auth
- [ ] `app/your-feature/page.tsx` — Page with `'use client'`, nav bar, auth guard
- [ ] `app/page.tsx` — Add to `NAV_ITEMS` array (if should appear in top nav)
- [ ] All colors use `var(--ept-*)` — no hardcoded hex values
- [ ] Auth guard present (if protected page)
- [ ] Loading spinner shown during auth check
- [ ] `npm run build` passes
- [ ] `git push origin main` (auto-deploys to echo-ept.com)
