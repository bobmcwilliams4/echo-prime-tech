'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Services that are LIVE — do NOT redirect
const EXEMPT_PREFIXES = [
  '/closer',             // AI Sales Agent
  '/bots',               // Bot Factory
  '/scrapers',           // Scraper & Harvester Factory
  '/ecommerce',          // Ecommerce Store
  '/business-manager',   // Business Manager
  '/grading',            // AI Collectibles Grading
  '/epocgs',             // AI Collectibles Grading (alt route)
  '/office-ai',          // Auto Prime Office AI Assistant
  '/immortality-vault',  // Immortality Vault
  '/engines',            // Intelligence Engines
  '/sentinel',           // Sentinel AI
  '/tax-returns',        // AI Tax Returns
  '/title-intelligence', // Title Intelligence
  '/security',           // Cyber Defense
  '/pentesting',         // Penetration Testing
  '/sdk',                // Echo SDK Gateway
  '/knowledge',          // Knowledge Systems
  '/pipelines',          // Data Pipelines
  '/dark-web-intel',     // Dark Web Intelligence
  '/crypto-trading',     // Crypto Trading
  '/price-alerts',       // Price & Market Alerts
  '/reddit',             // Reddit Monitor
  '/voice',              // Voice Studio
  '/echocad',            // EchoCAD
  '/daedalus-forge',     // Daedalus Forge
  '/hephaestion-forge',  // Hephaestion Forge
  '/bree-assistant',     // Bree AI Assistant
  '/x-bot',              // X/Twitter Bot
  '/linkedin',           // LinkedIn Bot
  '/payments',           // Payment Processing
  '/scanner',            // Security Scanner
  '/websites',           // Website Builder
  '/orchestration',      // Orchestration
  '/county-records',     // County Records
  '/vault',              // Digital Vault
  '/sandbox',            // AI Sandbox
  '/services',           // Professional Services
  '/sec-intel',          // Security Intelligence
  '/rewards',            // Rewards
  '/dashboard',          // User Dashboard
  '/settings',           // Settings
  '/forums',             // Forums
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
