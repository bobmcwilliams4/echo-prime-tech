'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Services that are LIVE — do NOT redirect
const EXEMPT_PREFIXES = [
  // ── Tier 1: Sellable NOW ──
  '/closer',             // AI Sales Agent (real backend)
  '/sentinel',           // Sentinel AI (2,660 engines)
  '/tax-returns',        // AI Tax Returns (real backend)
  '/voice',              // Voice Studio (3-tier TTS)
  '/grading',            // AI Collectibles Grading (eBay API)
  '/hephaestion-forge',  // Hephaestion Forge (code factory)
  '/engines',            // Intelligence Engines (real runtime)
  '/sdk',                // Echo SDK Gateway (real API)

  // ── Tier 2: Finishing ──
  '/title-intelligence', // Title Intelligence (landman pipeline)
  '/payments',           // Payment Processing
  '/county-records',     // County Records
  '/echocad',            // EchoCAD (real backend)
  '/daedalus-forge',     // Daedalus Forge (real backend)
  '/ecommerce',          // Ecommerce Store
  '/bree-assistant',     // Bree AI Assistant
  '/office-ai',          // Office AI Assistant
  '/security',           // Cyber Defense
  '/pentesting',         // Penetration Testing
  '/immortality-vault',  // Immortality Vault
  '/knowledge',          // Knowledge Systems
  '/vault',              // Digital Vault

  // ── Tier 4: Easy wins (bot pages) ──
  '/bots',               // Bot Factory
  '/x-bot',              // X/Twitter Bot
  '/reddit',             // Reddit Monitor
  '/linkedin',           // LinkedIn Bot
  '/scanner',            // Security Scanner
  '/websites',           // Website Builder
  '/price-alerts',       // Price & Market Alerts

  // ── Tier 5: New product pages ──
  '/call-center',        // AI Call Center
  '/gamer-companion',    // GGI Apex Predator
  '/home-ai',            // Echo Home AI
  '/intel-hub',          // Echo Intel Hub
  '/shepherd',           // Echo Shepherd AI
  '/project-manager',    // Echo Project Manager
  '/finance-ai',         // Echo Finance AI
  '/crm',                // Echo CRM
  '/helpdesk',           // Echo Helpdesk
  '/inventory',          // Echo Inventory
  '/surveillance',       // Prometheus Surveillance
  '/dark-web-intel',     // Dark Web Intelligence
  '/rewards',            // Echo Rewards
  '/permian',            // Permian Basin
  '/reviews',            // Reviews

  // ── Content pages ──
  '/blog',               // Blog articles
  '/changelog',          // Changelog
  '/news',               // News
  '/case-studies',       // Case Studies
  '/free',               // Free landing page

  // ── Infrastructure / User pages ──
  '/services',           // Professional Services
  '/dashboard',          // User Dashboard
  '/settings',           // Settings
  '/forums',             // Forums
  '/epocgs',             // AI Collectibles Grading (alt route)
  '/business-manager',   // Business Manager

  // ── BLOCKED (redirect to /coming-soon): ──
  // '/sec-intel'        — duplicate of /security, UI shell
  // '/crypto-trading'   — no execution engine, regulatory risk
  // '/scrapers'         — internal tool, looks shady
  // '/pipelines'        — internal infra, not customer product
  // '/orchestration'    — internal infra, 190 lines
  // '/sandbox'          — CTF training, not a product
];

// Utility/non-service pages — do NOT redirect
const EXEMPT_UTILITY = [
  '/',
  '/about',
  '/pricing',
  '/login',
  '/signup',
  '/support',
  '/coming-soon',
];

const EXEMPT_UTILITY_PREFIXES = [
  '/legal',
  '/checkout',
  '/admin',
  '/api',
];

function isExempt(pathname: string): boolean {
  // Exact utility matches
  if (EXEMPT_UTILITY.includes(pathname)) return true;

  // Prefix matches for live services
  for (const prefix of EXEMPT_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true;
  }

  // Prefix matches for utility pages
  for (const prefix of EXEMPT_UTILITY_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true;
  }

  return false;
}

export default function ComingSoonGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isExempt(pathname)) {
      router.replace('/coming-soon');
    }
  }, [pathname, router]);

  // If not exempt, render nothing while redirecting
  if (!isExempt(pathname)) {
    return null;
  }

  return <>{children}</>;
}
