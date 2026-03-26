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
  '/invoice',            // Echo Invoice
  '/booking',            // Echo Booking
  '/forms',              // Echo Forms
  '/hr',                 // Echo HR
  '/contracts',          // Echo Contracts
  '/lms',                // Echo LMS
  '/email-sender',       // Echo Email Sender
  '/analytics',          // Echo Analytics
  '/email-marketing',    // Echo Email Marketing
  '/surveys',            // Echo Surveys
  '/knowledge-base',     // Echo Knowledge Base
  '/surveillance',       // Prometheus Surveillance
  '/dark-web-intel',     // Dark Web Intelligence
  '/rewards',            // Echo Rewards
  '/permian',            // Permian Basin
  '/reviews',            // Reviews
  '/workflow-automation', // Workflow Automation
  '/social-media',       // Social Media Manager
  '/documents',          // Document Manager
  '/status-page',        // Status Page
  '/live-chat',          // Live Chat
  '/link-shortener',     // Link Shortener
  '/feedback-board',     // Feedback Board
  '/newsletter',         // Echo Newsletter
  '/web-analytics',      // Echo Web Analytics
  '/waitlist',           // Echo Waitlist
  '/proposals',          // Echo Proposals
  '/affiliate',          // Echo Affiliate
  '/signatures',         // Echo Signatures
  '/qr-menu',            // Echo QR Menu
  '/podcast',            // Echo Podcast
  '/payroll',            // Echo Payroll
  '/calendar',           // Echo Calendar
  '/compliance',         // Echo Compliance
  '/recruiting',         // Echo Recruiting
  '/timesheet',          // Echo Timesheet
  '/feature-flags',      // Echo Feature Flags
  '/expense-management', // Echo Expense Management
  '/okr',                // Echo OKR
  '/subscription',       // Echo Subscription
  '/customer-success',   // Echo Customer Success
  '/data-room',          // Echo Data Room
  '/asset-manager',      // Echo Asset Manager
  '/vendor-manager',     // Echo Vendor Manager
  '/incident-manager',   // Echo Incident Manager
  '/whatsapp-bot',       // Echo WhatsApp Bot
  '/ab-testing',         // Echo A/B Testing
  '/telegram-bot',       // Echo Telegram Bot
  '/chat-ai',            // Echo Chat AI
  '/app-forge',          // Echo App Forge
  '/prompt-forge',       // Echo Prompt Forge
  '/agentic-engine',     // Echo Agentic Engine
  '/shopify',            // Echo Shopify
  '/graph-rag',          // Echo Graph RAG
  '/domain-harvester',   // Echo Domain Harvester
  '/drive-intelligence',  // Echo Drive Intelligence
  '/revenue-engine',     // Echo Revenue Engine
  '/swarm-brain',        // Echo Swarm Brain
  '/speak-cloud',        // Echo Speak Cloud
  '/memory-prime',       // Echo Memory Prime
  '/paypal-integration', // Echo PayPal Integration
  '/coin-rewards',       // Echo Coin Rewards
  '/model-host',         // Echo Model Host
  '/instagram-ai',       // Echo Instagram AI
  '/ebay-ai',            // Echo eBay AI
  '/mega-gateway',       // Echo MEGA Gateway
  '/phoenix-cloud',      // Echo Phoenix Cloud

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
