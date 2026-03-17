/* ─── Business Manager Utility Functions ─── */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === '1') return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return phone;
}

export function getStatusBadge(status: string): { className: string; label: string } {
  const map: Record<string, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    in_progress: 'badge-purple',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    draft: 'badge-neutral',
    sent: 'badge-info',
    partial: 'badge-warning',
    paid: 'badge-success',
    overdue: 'badge-danger',
    void: 'badge-neutral',
    approved: 'badge-success',
    active: 'badge-success',
    inactive: 'badge-neutral',
  };
  const label = status.replace(/_/g, ' ');
  return {
    className: `badge ${map[status] || 'badge-neutral'}`,
    label: label.charAt(0).toUpperCase() + label.slice(1),
  };
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `EPT-${y}${m}-${rand}`;
}

export function generateQuoteNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `Q-${y}${m}-${rand}`;
}

export function calculateAge(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/* ─── Tech Services Catalog for Invoicing ─── */
export interface ServiceCatalogItem {
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  // Web Development
  { name: 'Static Website (5 pages)', description: 'Professional 5-page Next.js website with responsive design', basePrice: 2500, category: 'Web Development' },
  { name: 'Dynamic Web Application', description: 'Full-stack web app with auth, database, API integration', basePrice: 7500, category: 'Web Development' },
  { name: 'E-Commerce Platform', description: 'Online store with Stripe payments, product management, checkout', basePrice: 10000, category: 'Web Development' },
  { name: 'Landing Page', description: 'Single-page marketing site with CTA optimization', basePrice: 1200, category: 'Web Development' },
  { name: 'Website Maintenance (monthly)', description: 'Updates, security patches, content changes, hosting', basePrice: 299, category: 'Web Development' },

  // AI & Automation
  { name: 'AI Chatbot Integration', description: 'Custom AI chatbot with personality, memory, multi-platform', basePrice: 3000, category: 'AI & Automation' },
  { name: 'AI Sales Agent (Closer)', description: '24/7 autonomous sales agent with voice, CRM integration', basePrice: 5000, category: 'AI & Automation' },
  { name: 'Custom Intelligence Engine', description: 'Domain-specific AI engine with doctrine blocks, semantic search', basePrice: 8000, category: 'AI & Automation' },
  { name: 'Voice AI Integration', description: 'TTS/STT with ElevenLabs, voice cloning, phone integration', basePrice: 4000, category: 'AI & Automation' },
  { name: 'Workflow Automation', description: 'Custom automation pipeline for business processes', basePrice: 3500, category: 'AI & Automation' },

  // Bots & Social Media
  { name: 'Social Media Bot (single platform)', description: 'Autonomous posting bot for X, LinkedIn, Telegram, or Discord', basePrice: 1500, category: 'Bots & Social Media' },
  { name: 'Social Media Bot Bundle (3 platforms)', description: 'Multi-platform bot suite with cross-posting', basePrice: 3500, category: 'Bots & Social Media' },
  { name: 'Discord Community Bot', description: 'Full-featured Discord bot with AI, moderation, commands', basePrice: 2000, category: 'Bots & Social Media' },
  { name: 'Social Media Management (monthly)', description: 'Content creation, scheduling, analytics across platforms', basePrice: 799, category: 'Bots & Social Media' },

  // Data & Scraping
  { name: 'Web Scraper (custom)', description: 'Custom data extraction from websites with anti-detection', basePrice: 1500, category: 'Data & Scraping' },
  { name: 'Data Pipeline Setup', description: 'ETL pipeline with scheduling, transformation, storage', basePrice: 3000, category: 'Data & Scraping' },
  { name: 'API Integration', description: 'Connect and sync data between third-party services', basePrice: 2000, category: 'Data & Scraping' },
  { name: 'Database Design & Migration', description: 'Schema design, data migration, optimization', basePrice: 2500, category: 'Data & Scraping' },

  // Security & Infrastructure
  { name: 'Security Audit', description: 'Comprehensive security assessment with remediation plan', basePrice: 3000, category: 'Security & Infrastructure' },
  { name: 'Penetration Testing', description: 'Full-scope pentest with detailed report', basePrice: 5000, category: 'Security & Infrastructure' },
  { name: 'Cloudflare Worker Deployment', description: 'Serverless edge application with D1/R2/KV', basePrice: 2000, category: 'Security & Infrastructure' },
  { name: 'Infrastructure Setup', description: 'Cloud infrastructure, DNS, SSL, monitoring, CI/CD', basePrice: 3500, category: 'Security & Infrastructure' },
  { name: 'Domain & Email Setup', description: 'Domain registration, DNS config, professional email', basePrice: 500, category: 'Security & Infrastructure' },

  // Integrations
  { name: 'Twilio Phone Integration', description: 'Phone number, voice calls, SMS, ConvoAI', basePrice: 2000, category: 'Integrations' },
  { name: 'Payment Gateway (Stripe)', description: 'Checkout, subscriptions, webhooks, dashboard', basePrice: 1500, category: 'Integrations' },
  { name: 'CRM Integration', description: 'Connect to HubSpot, Salesforce, or custom CRM', basePrice: 2500, category: 'Integrations' },
  { name: 'Email Marketing Setup', description: 'Automated email sequences, templates, analytics', basePrice: 1200, category: 'Integrations' },

  // Consulting & Support
  { name: 'Technical Consulting (hourly)', description: 'Expert consultation on architecture, AI, security', basePrice: 250, category: 'Consulting & Support' },
  { name: 'Training Session (2 hours)', description: 'Custom training on platform, tools, or technology', basePrice: 500, category: 'Consulting & Support' },
  { name: 'Priority Support (monthly)', description: '24/7 priority support with SLA', basePrice: 499, category: 'Consulting & Support' },
];

export const SERVICE_CATEGORIES = [...new Set(SERVICE_CATALOG.map(s => s.category))];
