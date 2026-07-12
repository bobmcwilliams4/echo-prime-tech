'use client';
import FaqSchema from '../../components/FaqSchema';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import { startTrial } from '../../lib/trial-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import NewsletterSignup from '../../components/NewsletterSignup';

const PRICING_FAQS = [
  { q: 'What happens if I exceed my plan limits?', a: 'We notify you before you hit any limit. You can upgrade instantly from your dashboard with no downtime. Overages are never charged without your explicit approval — we pause the service and let you decide.' },
  { q: 'Can I switch between monthly and annual billing?', a: 'Yes. Switch anytime from your account settings. Moving to annual billing applies the 20% discount immediately. Moving to monthly takes effect at the end of your current annual term.' },
  { q: 'Do you offer refunds?', a: 'Every paid plan comes with a 30-day money-back guarantee. If you are not satisfied within the first 30 days, contact us for a full refund — no questions asked.' },
  { q: 'Can I use multiple services under one account?', a: 'Yes. One account manages all your subscriptions. Each service has its own dashboard section, but billing, user management, and analytics are unified. Bundle discounts are available for 3+ services.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards via Stripe, PayPal, Venmo, and Pay Later options. Enterprise clients can request NET 30 invoicing. All transactions are processed securely with PCI-compliant encryption.' },
  { q: 'Is there a contract or commitment?', a: 'No contracts on any self-service plan. Monthly plans can be cancelled anytime. Annual plans are billed upfront but include the 30-day money-back guarantee.' },
];

const ANNUAL_DISCOUNT = 0.20; // 20% off annual

const FALLBACK_SERVICES: Service[] = [
  { id: 'ai-closer', name: 'AI Sales Agent', tagline: 'Autonomous voice closer with full CRM', pricing: [
    { tier: 'Starter', price: 299, interval: 'mo', features: ['1 AI closer agent', '500 calls/mo', 'CRM dashboard', 'Branded website', 'Call recordings'], popular: false },
    { tier: 'Growth', price: 499, interval: 'mo', features: ['3 AI closer agents', '2,000 calls/mo', 'Custom scripts', 'Analytics dashboard', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: 999, interval: 'mo', features: ['Unlimited agents', 'Unlimited calls', 'White-label', 'Dedicated account manager', 'Custom integrations'], popular: false },
  ] },
  { id: 'engines', name: 'Intelligence Engines', tagline: '5,486+ domain-specific AI engines', pricing: [
    { tier: 'API Access', price: 199, interval: 'mo', features: ['100 queries/day', 'All engine categories', 'REST API', 'JSON responses'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['1,000 queries/day', 'Priority routing', 'Webhook callbacks', 'Custom doctrines', 'Dedicated support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited queries', 'Private deployment', 'Custom engines', 'SLA guarantee', 'On-premises option'], popular: false, custom: true },
  ] },
  { id: 'title-intelligence', name: 'Title Intelligence', tagline: 'AI chain of title across 80+ Texas counties', pricing: [
    { tier: 'Starter', price: 199, interval: 'mo', features: ['100 searches/mo', '80+ counties', 'Grantor/Grantee index', 'Export to CSV'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['Unlimited searches', 'AI gap detection', 'Chain of title reports', 'API access', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Bulk operations', 'Custom integrations', 'Dedicated account', 'On-site training'], popular: false, custom: true },
  ] },
  { id: 'sentinel', name: 'Sentinel AI', tagline: 'Multi-domain AI assistant', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['10 queries/day', 'Web search', 'General knowledge', 'Text responses'], popular: false },
    { tier: 'Pro', price: 29, interval: 'mo', features: ['Unlimited queries', '14 personalities', 'Document analysis', 'Voice responses', 'Memory'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Custom personalities', 'Private deployment', 'API access', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'bots', name: 'Custom Bots', tagline: 'AI-powered bots for social, trading & automation', pricing: [
    { tier: 'Starter', price: 499, interval: 'mo', features: ['1 custom bot', 'Basic AI personality', 'Scheduled posting', 'Analytics dashboard'], popular: false },
    { tier: 'Professional', price: 1499, interval: 'mo', features: ['3 custom bots', 'Advanced AI + memory', 'Multi-platform', 'Trading strategies', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited bots', 'Custom trading algos', 'White-label', 'Dedicated engineer'], popular: false, custom: true },
  ] },
  { id: 'price-alerts', name: 'Price Alerts', tagline: 'Real-time price monitoring across markets', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['5 alerts', 'Email notifications', 'Crypto & stocks', 'Daily summary'], popular: false },
    { tier: 'Pro', price: 19, interval: 'mo', features: ['Unlimited alerts', 'SMS + Telegram + webhook', 'Commodities & forex', 'Priority delivery'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Custom integrations', 'API access', 'Bulk alert management', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'reddit', name: 'Reddit Intelligence', tagline: 'Subreddit monitoring, trend detection, and community analytics', pricing: [
    { tier: 'Starter', price: 99, interval: 'mo', features: ['10 subreddits', 'Keyword alerts', 'Daily digests', 'Sentiment tracking'], popular: false },
    { tier: 'Professional', price: 299, interval: 'mo', features: ['Unlimited subreddits', 'Real-time alerts', 'Competitor tracking', 'API access', 'Historical data'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Custom ML models', 'Influencer mapping', 'Bulk exports', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'x-bot', name: 'X/Twitter Bot', tagline: 'AI-powered X/Twitter content engine with multi-personality posting', pricing: [
    { tier: 'Starter', price: 199, interval: 'mo', features: ['3 posts/day', '5 AI personalities', 'Basic analytics', 'Content calendar'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['Unlimited posts', '14 personalities', 'AI image generation', 'Engagement analytics', 'Thread builder'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Multi-account', 'Custom personalities', 'White-label', 'API access'], popular: false, custom: true },
  ] },
  { id: 'linkedin', name: 'LinkedIn AI', tagline: 'AI-powered LinkedIn content, lead generation, and professional networking', pricing: [
    { tier: 'Starter', price: 199, interval: 'mo', features: ['3 posts/week', 'AI content generator', 'Basic analytics', 'Profile optimization'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['Daily posts', 'Lead generation', 'InMail automation', 'Engagement analytics', 'Network mapping'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Multi-profile', 'Custom AI voice', 'CRM integration', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'payments', name: 'Payments Platform', tagline: 'Unified payment processing with Stripe, PayPal, and crypto', pricing: [
    { tier: 'Starter', price: 0, interval: 'mo', features: ['Stripe + PayPal', '2.9% + 30¢ per txn', 'Basic dashboard', 'Email receipts'], popular: false },
    { tier: 'Professional', price: 49, interval: 'mo', features: ['+ Crypto payments', '2.5% + 30¢ per txn', 'Subscription billing', 'Revenue analytics', 'Webhook alerts'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Custom rates', 'Multi-currency', 'White-label checkout', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'voice', name: 'Voice Studio', tagline: 'AI voice synthesis, cloning, and speech-to-text', pricing: [
    { tier: 'Starter', price: 49, interval: 'mo', features: ['6 AI voices', '50,000 characters/mo', 'MP3 export', 'Basic emotion tags'], popular: false },
    { tier: 'Professional', price: 149, interval: 'mo', features: ['Custom voice cloning', '500,000 characters/mo', 'Streaming TTS', 'STT transcription', '19 emotion tags'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited characters', 'Multi-language', 'White-label API', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'office-ai', name: 'Echo Office AI', tagline: 'AI phone system + office management + business operations — 22 modules in one platform', pricing: [
    { tier: 'Starter', price: 49, interval: 'mo', features: ['1 business, 5 users', 'AI Phone Answering', 'Voicemail AI + Transcription', 'SMS & Text AI (100/mo)', 'Invoicing & Billing', 'Online Bookings', 'Customer Directory', 'Expense Tracking'], popular: false },
    { tier: 'Professional', price: 149, interval: 'mo', features: ['3 businesses, 25 users', 'Full Conversational AI (8 modules)', 'AI Receptionist + Outbound Calls', 'Sentiment Analysis + Call Scoring', 'Route & Fleet Management', 'Inventory + AR/AP', 'Employee Mgmt + Timesheets', 'Analytics Dashboard'], popular: true },
    { tier: 'Enterprise', price: 399, interval: 'mo', features: ['Unlimited businesses & users', 'All 22 modules included', 'Unlimited AI phone lines', 'Custom AI voice & persona', 'Payroll + Reviews', 'White-label branding', 'Full API access', 'SLA guarantee + 24/7 support'], popular: false },
  ] },
  { id: 'pentesting', name: 'Pen Testing', tagline: 'Automated penetration testing and vulnerability assessment', pricing: [
    { tier: 'Starter', price: 999, interval: 'mo', features: ['Monthly scan', '1 domain', 'OWASP Top 10', 'PDF report'], popular: false },
    { tier: 'Professional', price: 2999, interval: 'mo', features: ['Weekly scans', '10 domains', 'API testing', 'Remediation guidance', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Continuous testing', 'Red team exercises', 'Compliance reporting', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'knowledge', name: 'Knowledge Systems', tagline: 'Enterprise knowledge graphs with semantic search and AI reasoning', pricing: [
    { tier: 'Starter', price: 199, interval: 'mo', features: ['10K documents', 'Semantic search', 'Auto-categorization', 'API access'], popular: false },
    { tier: 'Professional', price: 499, interval: 'mo', features: ['100K documents', 'Knowledge graph', 'Custom embeddings', 'RAG pipeline', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited documents', 'Private deployment', 'Custom models', 'SLA guarantee'], popular: false, custom: true },
  ] },
  { id: 'home-ai', name: 'Echo Home AI', tagline: 'Whole-home intelligence — devices, bills, tutoring, robots, energy', pricing: [
    { tier: 'Starter', price: 15, interval: 'mo', features: ['20 devices', 'Basic automation', '1 voice line', 'Bill tracking'], popular: false },
    { tier: 'Family', price: 30, interval: 'mo', features: ['50 devices', 'Homework tutoring (2 kids)', 'Full bill management', 'Robot control', 'Family tasks'], popular: true },
    { tier: 'Premium', price: 50, interval: 'mo', features: ['100 devices', 'Unlimited tutoring', 'Energy optimization', 'Multi-property (2)', 'Priority support'], popular: false },
    { tier: 'Estate', price: 100, interval: 'mo', features: ['Unlimited devices', 'Unlimited everything', 'Multi-property', 'Dedicated account manager'], popular: false },
  ] },
  { id: 'shepherd', name: 'Echo Shepherd AI', tagline: 'Ministry platform — sermons, CRM, tithing, worship, volunteers', pricing: [
    { tier: 'Shepherd', price: 49, interval: 'mo', features: ['1 campus', '200 members', 'Sermon builder', 'Basic CRM', 'Scripture engine'], popular: false },
    { tier: 'Flock', price: 149, interval: 'mo', features: ['1 campus', '500 members', 'Full CRM', 'Worship planning', 'Giving reports', 'Volunteer mgmt'], popular: true },
    { tier: 'Congregation', price: 349, interval: 'mo', features: ['3 campuses', '2,000 members', 'All features', 'Analytics', 'Small groups'], popular: false },
    { tier: 'Cathedral', price: 799, interval: 'mo', features: ['Unlimited campuses', 'Unlimited members', 'White-label', 'API access', 'Priority support'], popular: false },
  ] },
  { id: 'intel-hub', name: 'Echo Intel Hub', tagline: 'Digital intelligence — messages, traffic, apps, contacts, anomaly AI', pricing: [
    { tier: 'Personal', price: 30, interval: 'mo', features: ['1 device', 'Message capture', 'App tracking', 'Basic alerts', '30-day retention'], popular: false },
    { tier: 'Family', price: 60, interval: 'mo', features: ['5 devices', 'Keyword watchlist', 'DNS detection', 'Network analysis', '90-day retention', 'SMS alerts'], popular: true },
    { tier: 'Enterprise', price: 150, interval: 'mo', features: ['Unlimited devices', 'Anomaly AI', 'Custom alerts', 'Kill switch', '1-year retention', 'API access'], popular: false },
  ] },
  { id: 'call-center', name: 'AI Call Center', tagline: 'Enterprise call center — queues, AI agents, wallboard, supervisor', pricing: [
    { tier: 'Team', price: 299, interval: 'mo', features: ['5 queues', '10 AI agents', 'Basic routing', 'Call recording', 'Dashboard'], popular: false },
    { tier: 'Business', price: 799, interval: 'mo', features: ['20 queues', '50 AI agents', 'Skills routing', 'Supervisor dashboard', 'SMS', 'Analytics'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited queues', '100+ AI agents', 'Predictive dialer', 'White-label', 'Full API', 'SLA guarantee'], popular: false },
  ] },
  { id: 'gamer-companion', name: 'Gamer Companion', tagline: 'AI gaming assistant — overlay, strategy, builds, voice commands', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['Basic strategy tips', '3 game profiles', 'Community guides'], popular: false },
    { tier: 'Pro', price: 10, interval: 'mo', features: ['Real-time overlay', 'Screen analysis AI', 'Unlimited profiles', 'Build optimizer', 'Voice commands'], popular: true },
    { tier: 'Team', price: 25, interval: 'mo', features: ['Everything in Pro', 'Team analytics', 'Shared strategies', 'Tournament prep', 'API access'], popular: false },
  ] },
  { id: 'crm', name: 'AI CRM', tagline: 'AI-powered customer relationship management with lead scoring', pricing: [
    { tier: 'Solo', price: 29, interval: 'mo', features: ['500 contacts', '1 pipeline', 'Deal board', 'Activity tracking', 'Notes & tags'], popular: false },
    { tier: 'Growth', price: 79, interval: 'mo', features: ['5,000 contacts', 'AI lead scoring', '5 pipelines', 'Revenue analytics', 'Email events', 'Weekly AI digest'], popular: true },
    { tier: 'Enterprise', price: 199, interval: 'mo', features: ['Unlimited contacts', 'Unlimited pipelines', 'Full AI suite', 'Webhooks', 'API access', 'Priority support'], popular: false },
  ] },
  { id: 'helpdesk', name: 'AI Helpdesk', tagline: 'Smart ticket routing, AI auto-categorization, SLA tracking', pricing: [
    { tier: 'Starter', price: 29, interval: 'mo', features: ['Up to 3 agents', '500 tickets/mo', 'Email channel', 'Basic SLA', 'Knowledge base'], popular: false },
    { tier: 'Professional', price: 79, interval: 'mo', features: ['10 agents', 'Unlimited tickets', 'All channels', 'AI categorization', 'AI suggestions', 'CSAT surveys'], popular: true },
    { tier: 'Enterprise', price: 199, interval: 'mo', features: ['Unlimited agents', 'Custom SLA', 'Full AI suite', 'Webhooks', 'API access', 'Custom branding'], popular: false },
  ] },
  { id: 'email-sender', name: 'Echo Email', tagline: 'Transactional email, drip sequences, AI subject lines', pricing: [
    { tier: 'Starter', price: 9, interval: 'mo', features: ['10K emails/mo', 'Transactional email', '5 templates', 'Delivery analytics', 'Bounce handling'], popular: false },
    { tier: 'Growth', price: 29, interval: 'mo', features: ['50K emails/mo', 'Broadcast campaigns', 'Drip sequences', 'AI subject optimizer', 'A/B testing'], popular: true },
    { tier: 'Scale', price: 99, interval: 'mo', features: ['500K emails/mo', 'Multi-tenant', 'Dedicated IP', 'Priority delivery', 'Custom webhooks'], popular: false },
  ] },
  { id: 'appointments', name: 'Echo Appointments', tagline: 'AI scheduling with no-show prediction and utilization analytics', pricing: [
    { tier: 'Solo', price: 19, interval: 'mo', features: ['1 provider', '1 location', 'Online booking', 'Email reminders', 'Calendar view'], popular: false },
    { tier: 'Team', price: 49, interval: 'mo', features: ['10 providers', '3 locations', 'AI no-show prediction', 'Provider utilization', 'Recurring appointments'], popular: true },
    { tier: 'Business', price: 129, interval: 'mo', features: ['Unlimited providers', 'Unlimited locations', 'Full AI suite', 'Revenue tracking', 'API access'], popular: false },
  ] },
  { id: 'invoicing', name: 'Echo Invoicing', tagline: 'AI-powered invoicing with payment prediction', pricing: [
    { tier: 'Starter', price: 15, interval: 'mo', features: ['50 invoices/mo', 'Professional templates', 'Payment tracking', 'Auto reminders', 'Tax calculation'], popular: false },
    { tier: 'Professional', price: 39, interval: 'mo', features: ['500 invoices/mo', 'Recurring billing', 'AI payment prediction', 'Multi-currency', 'Aging reports'], popular: true },
    { tier: 'Business', price: 99, interval: 'mo', features: ['Unlimited invoices', 'Revenue reports', 'Batch generation', 'Webhook events', 'API access'], popular: false },
  ] },
  { id: 'hr-management', name: 'Echo HR', tagline: 'AI-powered HR with performance reviews and compensation analytics', pricing: [
    { tier: 'Startup', price: 25, interval: 'mo', features: ['25 employees', 'Employee directory', 'Time-off tracking', 'Org chart', 'Document storage'], popular: false },
    { tier: 'Growth', price: 69, interval: 'mo', features: ['100 employees', 'AI performance reviews', 'Compensation analytics', 'Custom positions', 'Turnover reports'], popular: true },
    { tier: 'Enterprise', price: 179, interval: 'mo', features: ['Unlimited employees', 'Full AI suite', 'Headcount reports', 'API access', 'Priority support'], popular: false },
  ] },
  { id: 'project-management', name: 'Echo Projects', tagline: 'AI project management with Kanban boards and sprint planning', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['3 projects', '2 boards', 'Basic tasks', 'Labels & tags', 'Comments'], popular: false },
    { tier: 'Team', price: 15, interval: 'mo', features: ['Unlimited projects', 'Sprint planning', 'Time tracking', 'AI task analysis', 'Burndown charts'], popular: true },
    { tier: 'Business', price: 39, interval: 'mo', features: ['Everything in Team', 'Workload reports', 'Story points', 'Webhooks', 'API access'], popular: false },
  ] },
  { id: 'documents', name: 'Echo Documents', tagline: 'AI document management with version history and sharing', pricing: [
    { tier: 'Starter', price: 12, interval: 'mo', features: ['5 GB storage', 'Version history', 'Folder organization', 'Public sharing', 'Search'], popular: false },
    { tier: 'Team', price: 29, interval: 'mo', features: ['50 GB storage', 'AI summarization', 'Team collaboration', 'Access controls', 'Activity log'], popular: true },
    { tier: 'Business', price: 79, interval: 'mo', features: ['Unlimited storage', 'Full AI suite', 'Custom branding', 'Webhooks', 'API access'], popular: false },
  ] },
  { id: 'workflows', name: 'Echo Workflows', tagline: 'Visual workflow automation with AI analysis and webhooks', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['5 workflows', 'Manual triggers', 'Basic actions', 'Run history', 'Email notifications'], popular: false },
    { tier: 'Pro', price: 29, interval: 'mo', features: ['50 workflows', 'Cron + webhook triggers', 'AI analysis steps', 'Conditional logic', 'Full logs'], popular: true },
    { tier: 'Business', price: 99, interval: 'mo', features: ['Unlimited workflows', 'Multi-step chains', 'API triggers', 'Custom integrations', 'Priority support'], popular: false },
  ] },
  { id: 'inventory', name: 'Echo Inventory', tagline: 'AI inventory management with demand forecasting', pricing: [
    { tier: 'Starter', price: 19, interval: 'mo', features: ['500 SKUs', '1 warehouse', 'Stock tracking', 'Low-stock alerts', 'Barcode scanning'], popular: false },
    { tier: 'Growth', price: 49, interval: 'mo', features: ['5,000 SKUs', '5 warehouses', 'AI demand forecasting', 'Purchase orders', 'Supplier management'], popular: true },
    { tier: 'Enterprise', price: 149, interval: 'mo', features: ['Unlimited SKUs', 'Unlimited warehouses', 'Full AI suite', 'Webhooks', 'API access'], popular: false },
  ] },
  { id: 'finance', name: 'Echo Finance', tagline: 'AI personal finance with auto-categorization and budgets', pricing: [
    { tier: 'Free', price: 0, interval: 'mo', features: ['3 accounts', 'Manual transactions', 'Basic budgets', 'Monthly reports'], popular: false },
    { tier: 'Pro', price: 9, interval: 'mo', features: ['Unlimited accounts', 'AI categorization', 'Savings goals', 'Net worth tracking', 'Trend analysis'], popular: true },
    { tier: 'Family', price: 19, interval: 'mo', features: ['Multi-user', 'Bill reminders', 'Tax export', 'All AI features', 'Priority support'], popular: false },
  ] },
  { id: 'lms', name: 'Echo LMS', tagline: 'AI course builder with quiz generation and certificates', pricing: [
    { tier: 'Starter', price: 19, interval: 'mo', features: ['5 courses', '50 students', 'AI quiz generation', 'Certificates', 'Discussion forums'], popular: false },
    { tier: 'Pro', price: 49, interval: 'mo', features: ['25 courses', '500 students', 'AI course outlines', 'Custom branding', 'Full analytics'], popular: true },
    { tier: 'Business', price: 149, interval: 'mo', features: ['Unlimited courses', 'Unlimited students', 'Multi-tenant', 'API access', 'Priority support'], popular: false },
  ] },
  { id: 'hephaestion-forge', name: 'Hephaestion Forge', tagline: 'AI code factory — describe a service, get a tested, security-scanned repo', description: 'A 13-stage build pipeline with 4 quality gates turns a plain-English spec into a production repo (Python, TypeScript, JavaScript, Rust, Go) with tests, lint, security scan, and code review. Priced per deliverable, metered in build credits.', pricing: [
    { tier: 'Starter', price: 99, interval: 'mo', features: ['50 build credits/mo (~10–25 builds)', 'All 5 languages', '3 archetypes', 'Quality gates: lint + security + code review', 'Download full repo', 'Community support'], popular: false },
    { tier: 'Pro', price: 299, interval: 'mo', features: ['250 build credits/mo (~50–150 builds)', 'All 6 project types + 8 design patterns', 'Priority pipeline', 'GitHub push', 'API access', 'Priority support'], popular: true },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited builds', 'Private forge deployment', 'Custom archetypes', 'On-prem option', 'SLA 99.9%', 'Dedicated engineer'], popular: false, custom: true },
  ] },
  { id: 'daedalus-forge', name: 'Daedalus', tagline: 'Conversational CAD → manufacturing — describe a part, get drawings, DFM, and an indicative quote', description: 'Daedalus Design turns plain English into dimensioned drawings, GD&T, FEA, tolerance optimization, BOM, and standards-compliant shop drawings. Daedalus Forge runs the full 50-stage pipeline to DFM, CNC toolpaths, compliance gates, and an indicative manufacturing quote. AI output requires review by a qualified engineer — not a PE-stamped deliverable.', pricing: [
    { tier: 'Design', price: 149, interval: 'mo', features: ['40 design credits/mo', 'Plain-English → dimensioned 2D drawings', 'Parametric design + built-in FEA', 'Tolerance optimization + BOM', 'ASME Y14.5 / ISO 128 / DIN compliance', 'STEP/DXF export'], popular: false },
    { tier: 'Pro', price: 449, interval: 'mo', features: ['120 design credits/mo', 'Full 50-stage design→manufacturing pipeline', 'All 12 materials + 6 CNC machines', 'DFM review + CNC toolpaths', 'Indicative manufacturing quotes', 'API access', 'Priority support'], popular: true },
    { tier: 'Compliance', price: 1299, interval: 'mo', features: ['Everything in Pro', 'Oil & gas + aerospace domains', 'API 6A / NACE MR0175 compliance gates', 'Audit-trail exports', 'Supplier cross-reference', 'Priority engineering support'], popular: false },
    { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited designs', 'Private / air-gapped deployment', 'Custom materials & machines', 'Supplier integration', 'SLA guarantees'], popular: false, custom: true },
  ] },
];

export default function PricingPage() {
  const { user, role, loading } = useAuth();
  const { isDark } = useTheme();
  const isOwner = role === 'owner';
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [trialLoading, setTrialLoading] = useState<string | null>(null);
  const [trialSuccess, setTrialSuccess] = useState<string | null>(null);
  const [trialError, setTrialError] = useState<string | null>(null);

  const getDisplayPrice = (monthlyPrice: number | null): number | null => {
    if (monthlyPrice === null || monthlyPrice === 0) return monthlyPrice;
    if (billingCycle === 'annual') return Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT));
    return monthlyPrice;
  };

  const getAnnualSavings = (monthlyPrice: number | null): number => {
    if (monthlyPrice === null || monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * ANNUAL_DISCOUNT);
  };

  useEffect(() => {
    getServices()
      .then(d => { setServices(d.services); if (d.services.length > 0) setActiveService(d.services[0].id); })
      .catch(() => { setServices(FALLBACK_SERVICES); setActiveService(FALLBACK_SERVICES[0].id); });
  }, []);

  // Auto-start trial after redirect from signup (handles /pricing?trial=sentinel&tier=pro)
  const trialAutoStarted = useRef(false);
  useEffect(() => {
    if (trialAutoStarted.current || !user || loading) return;
    const params = new URLSearchParams(window.location.search);
    const trialService = params.get('trial');
    const trialTier = params.get('tier');
    if (trialService && trialTier) {
      trialAutoStarted.current = true;
      handleTrial(trialService, trialTier);
      // Clean URL without reload
      window.history.replaceState({}, '', '/pricing');
    }
  }, [user, loading]);

  const current = services.find(s => s.id === activeService);

  const handleCheckout = async (serviceId: string, tier: { tier: string; price: number | null; custom?: boolean }) => {
    // Owner/Commander never pays — all services auto-granted at Enterprise
    if (isOwner) return;
    if (tier.custom || tier.price === null) { window.location.href = `mailto:bob@echo-op.com?subject=Enterprise%20${encodeURIComponent(serviceId)}%20Inquiry`; return; }
    const checkoutUrl = `/checkout?service=${encodeURIComponent(serviceId)}&tier=${encodeURIComponent(tier.tier.toLowerCase())}`;
    if (!user) { window.location.href = `/signup?redirect=${encodeURIComponent(checkoutUrl)}`; return; }
    window.location.href = checkoutUrl;
  };

  const handleTrial = async (serviceId: string, tierName: string) => {
    if (!user) { window.location.href = `/signup?redirect=${encodeURIComponent(`/pricing?trial=${serviceId}&tier=${tierName}`)}`; return; }
    const key = `${serviceId}-${tierName}`;
    setTrialLoading(key);
    setTrialError(null);
    try {
      const res = await startTrial({ email: user.email!, name: user.displayName || '', service_id: serviceId, tier: tierName });
      if (res.ok) {
        setTrialSuccess(key);
        setTrialLoading(null);
      } else {
        setTrialError(res.error || 'Trial could not be started');
        setTrialLoading(null);
      }
    } catch {
      setTrialError('Network error — please try again');
      setTrialLoading(null);
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Can I switch plans anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle. No lock-in contracts.' } },
      { '@type': 'Question', name: 'Do you offer a free trial?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Every paid plan includes a 14-day free trial with no credit card required. Some services also have permanent free tiers. Start any trial directly from the pricing page.' } },
      { '@type': 'Question', name: 'What payment methods do you accept?', acceptedAnswer: { '@type': 'Answer', text: 'We accept all major credit/debit cards via Stripe, PayPal, Venmo, and Pay Later. Enterprise clients can request invoicing with NET 30 terms.' } },
      { '@type': 'Question', name: 'How does the AI engine pricing work?', acceptedAnswer: { '@type': 'Answer', text: 'Engine queries are priced per-use or via monthly subscriptions. Each query hits our doctrine cache first (free, under 200ms), then semantic retrieval, then deep analysis.' } },
      { '@type': 'Question', name: 'Is there a setup fee?', acceptedAnswer: { '@type': 'Answer', text: 'No setup fees for any self-service plan. Enterprise and custom deployments may include onboarding costs depending on scope.' } },
      { '@type': 'Question', name: 'Can I combine multiple services?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Our services are designed to work together. Data Pipelines feed into Title Intelligence, engines power the AI Closer, and Sentinel monitors everything. Contact us for bundle pricing.' } },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Pricing - Echo Prime Technologies</h1>
          <p>Transparent pricing for all Echo Prime products including AI Sales Agent, Intelligence Engines, Collectibles Grading, Surveillance, EchoCAD, Office AI, and more. Free tiers available with no credit card required. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <FaqSchema faqs={PRICING_FAQS} name="Echo Prime Technology Pricing FAQ" />
      <BreadcrumbSchema items={[{name:'Home',href:'/'},{name:'Pricing',href:'/pricing'}]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Pricing</div>
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Simple, transparent pricing</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Every service has clear tiers. No hidden fees. Scale up or down anytime.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              30-day money-back guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Cancel anytime
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              PayPal &amp; Venmo accepted
            </span>
          </div>
          <div className="mt-4"><ReadAloudButton label="Read pricing" getText={() => {
            const el = document.querySelector('.max-w-6xl');
            return el?.textContent?.trim().slice(0, 3000) || '';
          }} /></div>

          {/* Billing cycle toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-medium" style={{ color: billingCycle === 'monthly' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>Monthly</span>
            <button
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-colors"
              style={{ backgroundColor: billingCycle === 'annual' ? 'var(--ept-accent)' : 'var(--ept-surface)' }}
              aria-label="Toggle annual billing"
            >
              <span
                className="absolute top-0.5 w-6 h-6 rounded-full transition-all shadow-sm"
                style={{
                  backgroundColor: '#fff',
                  left: billingCycle === 'annual' ? '30px' : '2px',
                }}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: billingCycle === 'annual' ? 'var(--ept-text)' : 'var(--ept-text-muted)' }}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold animate-fade-up" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Service tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {services.map(svc => (
            <button key={svc.id} onClick={() => setActiveService(svc.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{
              backgroundColor: activeService === svc.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: activeService === svc.id ? '#fff' : 'var(--ept-text-secondary)',
            }}>
              {svc.name}
            </button>
          ))}
        </div>

        {/* Pricing cards */}
        {current && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{current.name}</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>{current.tagline}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {current.pricing.map((tier, i) => (
                <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
                }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
                  )}
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                  <div className="mb-6">
                    {tier.price !== null ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono gradient-text">${getDisplayPrice(tier.price)}</span>
                          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{billingCycle === 'annual' ? 'mo' : tier.interval}</span>
                        </div>
                        {billingCycle === 'annual' && tier.price > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs line-through" style={{ color: 'var(--ept-text-muted)' }}>${tier.price}/mo</span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>Save ${getAnnualSavings(tier.price)}/yr</span>
                          </div>
                        )}
                        {billingCycle === 'annual' && tier.price > 0 && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>
                            Billed ${(getDisplayPrice(tier.price) ?? 0) * 12}/yr
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(current.id, tier)} disabled={isOwner || checkingOut === `${current.id}-${tier.tier}`} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                    backgroundColor: isOwner ? '#059669' : tier.popular ? 'var(--ept-accent)' : 'transparent',
                    color: isOwner ? '#fff' : tier.popular ? '#fff' : 'var(--ept-accent)',
                    border: isOwner ? 'none' : tier.popular ? 'none' : '1px solid var(--ept-accent)',
                    cursor: isOwner ? 'default' : undefined,
                  }}>
                    {isOwner ? 'Active — Enterprise' : checkingOut === `${current.id}-${tier.tier}` ? 'Redirecting...' : tier.custom ? 'Contact Sales' : tier.price === 0 ? 'Start Free' : 'Get Started'}
                  </button>
                  {isOwner && (
                    <p className="text-center text-[10px] mt-2" style={{ color: '#10b981' }}>Owner — all services included</p>
                  )}
                  {!isOwner && !tier.custom && tier.price !== null && tier.price > 0 && (
                    <p className="text-center text-[10px] mt-2" style={{ color: 'var(--ept-text-muted)' }}>30-day money-back guarantee</p>
                  )}
                  {!isOwner && !tier.custom && tier.price !== null && tier.price > 0 && (
                    trialSuccess === `${current.id}-${tier.tier}` ? (
                      <p className="text-center text-[10px] mt-1 font-semibold" style={{ color: '#10b981' }}>Trial activated! Check your email.</p>
                    ) : (
                      <button
                        onClick={() => handleTrial(current.id, tier.tier.toLowerCase())}
                        disabled={!!trialLoading}
                        className="w-full text-center text-[11px] mt-1 underline cursor-pointer bg-transparent border-none"
                        style={{ color: 'var(--ept-accent)', opacity: trialLoading === `${current.id}-${tier.tier}` ? 0.5 : 1 }}
                      >
                        {trialLoading === `${current.id}-${tier.tier}` ? 'Starting trial...' : 'or start 14-day free trial'}
                      </button>
                    )
                  )}
                  {trialError && trialLoading === null && (
                    <p className="text-center text-[10px] mt-1" style={{ color: '#ef4444' }}>{trialError}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="mt-20 mb-12">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5,486+', label: 'AI Engines', sub: 'Domain-specific intelligence' },
              { value: '259K+', label: 'Records Indexed', sub: '80+ Texas counties' },
              { value: '99.9%', label: 'Uptime SLA', sub: 'Enterprise reliability' },
              { value: '<200ms', label: 'Avg Response', sub: 'Doctrine cache layer' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{s.label}</div>
                <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: 'var(--ept-text)' }}>Compare All Services</h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>See which services fit your needs at a glance</p>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[800px] text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="text-left p-4 font-semibold sticky left-0 z-10" style={{ color: 'var(--ept-text)', backgroundColor: 'var(--ept-bg)' }}>Feature</th>
                  {services.map(svc => (
                    <th key={svc.id} className="p-4 text-center font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <button onClick={() => setActiveService(svc.id)} className="hover:underline">{svc.name}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Starting Price', values: (svcs: Service[]) => svcs.map(s => { const p = s.pricing[0]?.price; return p === 0 ? 'Free' : p !== null ? `$${getDisplayPrice(p)}/mo` : 'Custom'; }) },
                  { label: 'AI-Powered', values: (svcs: Service[]) => svcs.map(s => ['sentinel','engines','ai-closer','bots','title-intelligence','voice','grading','hephaestion-forge'].includes(s.id)) },
                  { label: 'REST API Access', values: (svcs: Service[]) => svcs.map(s => !['sentinel'].includes(s.id) || s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('api')))) },
                  { label: 'Custom Integrations', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('custom')))) },
                  { label: 'Analytics Dashboard', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('analytics') || f.toLowerCase().includes('dashboard')))) },
                  { label: 'Enterprise / SLA', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.custom || t.features.some(f => f.toLowerCase().includes('sla') || f.toLowerCase().includes('enterprise')))) },
                  { label: 'Free Tier Available', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.price === 0)) },
                  { label: 'Priority Support', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('priority')))) },
                  { label: 'White-Label Option', values: (svcs: Service[]) => svcs.map(s => s.pricing.some(t => t.features.some(f => f.toLowerCase().includes('white-label') || f.toLowerCase().includes('white label')))) },
                ].map((row, ri) => {
                  const vals = row.values(services);
                  return (
                    <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? 'var(--ept-card-bg)' : 'transparent' }}>
                      <td className="p-4 font-medium sticky left-0 z-10" style={{ color: 'var(--ept-text-secondary)', backgroundColor: ri % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-bg)' }}>{row.label}</td>
                      {vals.map((v, ci) => (
                        <td key={ci} className="p-4 text-center">
                          {typeof v === 'string' ? (
                            <span className="font-mono font-bold text-sm" style={{ color: 'var(--ept-accent)' }}>{v}</span>
                          ) : v ? (
                            <svg className="w-5 h-5 mx-auto" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <span className="text-lg" style={{ color: 'var(--ept-text-muted)' }}>&mdash;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle. No lock-in contracts.' },
              { q: 'Do you offer a free trial?', a: 'Many services have free tiers or trial periods. Sentinel AI, Grading, and the Knowledge systems all offer free access to get started.' },
              { q: 'What payment methods do you accept?', a: 'We accept PayPal, Venmo, and Pay Later options. Enterprise clients can request invoicing with NET 30 terms.' },
              { q: 'Is there a setup fee?', a: 'No setup fees for any self-service plan. Enterprise and custom deployments may include onboarding costs depending on scope.' },
              { q: 'How does the AI engine pricing work?', a: 'Engine queries are priced per-use or via monthly subscriptions. Each query hits our doctrine cache first (free, <200ms), then semantic retrieval, then deep analysis. Most queries resolve at the cache layer.' },
              { q: 'How does annual billing save me money?', a: 'Annual billing gives you 20% off every service. You pay for 12 months upfront at the discounted rate. Switch between monthly and annual using the toggle above to compare pricing.' },
              { q: 'Can I combine multiple services?', a: 'Absolutely. Our services are designed to work together. Data Pipelines feed into Title Intelligence, engines power the AI Closer, and Sentinel monitors everything. Contact us for bundle pricing.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{item.q}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle CTA */}
        <div className="max-w-3xl mx-auto mb-16 p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Need the full stack?</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Bundle Engines + Bots + Scrapers + Pipelines + Title Intelligence + Dark Web Intel + Crypto Trading for a custom enterprise rate. Get everything at a steep discount.
          </p>
          <a href="mailto:bob@echo-op.com?subject=Enterprise%20Bundle%20Inquiry" className="inline-block px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Bundle Pricing
          </a>
        </div>

        <section className="py-16 px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
          <div className="space-y-6">
            {PRICING_FAQS.map(faq => (
              <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 px-6">
          <div className="max-w-xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>

        <div className="text-center pb-8">
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> or email <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
