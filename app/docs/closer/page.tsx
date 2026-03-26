'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Closer AI',
  tagline: 'AI sales agent — persuasion techniques, objection handling, lead qualification, and deal closing.',
  accent: '#dc2626',
  productUrl: '/closer',
  workerUrl: 'https://billymc-api.bmcii1976.workers.dev',
  version: '2.0.0',

  overview: [
    'Echo Closer AI is a purpose-built AI sales agent that leverages 35+ proven persuasion techniques to engage prospects, handle objections in real time, and close deals at scale. Unlike generic chatbots that follow rigid scripts, Closer analyzes conversation dynamics, reads buying signals, and adapts its approach mid-conversation to maximize conversion rates. Every interaction is backed by decades of real-world sales methodology distilled into an intelligent engine.',
    'At its core, Closer combines advanced lead scoring with real-time conversation analysis. Inbound leads are automatically qualified based on behavioral signals, firmographic data, and engagement history. The AI identifies where each prospect sits in the buying journey and tailors its messaging accordingly — from initial discovery questions through final price negotiation. The result is a sales pipeline that moves faster with higher win rates and fewer dropped opportunities.',
    'Closer integrates directly into your existing sales workflow. Import your product catalog, configure pricing rules, and let the AI handle everything from first contact to signed deal. Built-in analytics track every conversation, measure technique effectiveness, and surface coaching insights for your human sales team. Whether you are a solo founder or managing a 50-person sales floor, Closer gives you an always-on closer that never misses a follow-up.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/closer and connect your business profile. The onboarding wizard walks you through initial configuration including timezone, currency, and notification preferences.' },
    { step: 2, title: 'Configure Products & Services', desc: 'Add your product catalog with pricing tiers, feature comparisons, and competitive differentiators. Closer uses this knowledge base to answer prospect questions accurately and position your offerings against alternatives.' },
    { step: 3, title: 'Customize AI Personality', desc: 'Choose from preset sales personas or build your own. Adjust tone (consultative, assertive, friendly), formality level, and persuasion intensity. Set guardrails for discount authority, competitor mentions, and compliance language.' },
    { step: 4, title: 'Import Your Leads', desc: 'Bulk import leads via CSV, connect your CRM via API, or paste individual contacts. Closer auto-enriches each lead with publicly available firmographic data and assigns an initial qualification score.' },
    { step: 5, title: 'Start Selling', desc: 'Launch your first campaign. Closer engages leads through your configured channels, handles objections autonomously, and escalates hot deals to your calendar for final close. Monitor everything from the real-time dashboard.' },
  ],

  features: [
    { title: '35+ Persuasion Techniques', desc: 'Proven psychological frameworks including reciprocity, scarcity, social proof, authority, commitment ladders, anchoring, loss aversion, and more. Each technique is contextually deployed based on conversation state and prospect profile.' },
    { title: 'Objection Handling', desc: 'Real-time objection detection and response generation. Closer identifies the root concern behind each objection — price, timing, authority, need, or trust — and selects the optimal reframe or evidence-based counter.' },
    { title: 'Lead Qualification', desc: 'Multi-dimensional scoring based on BANT (Budget, Authority, Need, Timeline), engagement signals, behavioral patterns, and firmographic fit. Leads are automatically segmented into hot, warm, and nurture tracks.' },
    { title: 'Conversation AI', desc: 'Natural language conversations that adapt in real time. The AI maintains context across multiple sessions, remembers previous objections, and progressively builds rapport through personalized callbacks and acknowledgments.' },
    { title: 'Deal Pipeline', desc: 'Visual pipeline management with automatic stage progression. Deals move from qualification through discovery, proposal, negotiation, and close based on conversation milestones and buyer commitment signals.' },
    { title: 'Follow-Up Automation', desc: 'Intelligent follow-up sequences triggered by conversation outcomes, time delays, and engagement signals. Never lose a deal to forgotten follow-ups — Closer tracks every open thread and re-engages at optimal intervals.' },
    { title: 'Product Knowledge Base', desc: 'Structured knowledge store for your entire product catalog, pricing, competitive comparisons, case studies, and testimonials. Closer pulls relevant proof points into conversations automatically.' },
    { title: 'Customer Profiling', desc: 'Dynamic prospect profiles that update with every interaction. Track communication preferences, decision-making style, key stakeholders, budget indicators, and historical engagement patterns.' },
    { title: 'Multi-Channel Sales', desc: 'Engage prospects across web chat, email, SMS, and API integrations. Conversations maintain continuity across channels so prospects never have to repeat themselves.' },
    { title: 'Performance Analytics', desc: 'Detailed metrics on conversion rates, average deal size, sales cycle length, technique effectiveness, and objection frequency. Identify what works and double down on winning patterns.' },
    { title: 'Team Leaderboard', desc: 'Gamified performance tracking for sales teams. Compare AI-assisted vs. manual close rates, track individual rep performance, and surface coaching opportunities based on conversation analysis.' },
    { title: 'CRM Integration', desc: 'Bi-directional sync with popular CRMs. Contacts, deals, activities, and notes flow automatically between Closer and your system of record. Supports webhook-based and API-based integrations.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/conversations', desc: 'Start a new sales conversation with a lead. Accepts lead profile, product context, and initial message.', auth: true },
    { method: 'GET', path: '/api/conversations/:id', desc: 'Retrieve full conversation history including AI analysis, objection log, and buying signals detected.', auth: true },
    { method: 'POST', path: '/api/conversations/:id/message', desc: 'Send a message in an active conversation. Returns AI response with technique annotations.', auth: true },
    { method: 'GET', path: '/api/leads', desc: 'List all leads with qualification scores, pipeline stage, and last activity timestamp. Supports filtering and pagination.', auth: true },
    { method: 'POST', path: '/api/leads', desc: 'Create or bulk import leads. Accepts single object or array. Auto-enrichment runs asynchronously after creation.', auth: true },
    { method: 'GET', path: '/api/products', desc: 'Retrieve the product knowledge base including pricing tiers, feature lists, and competitive positioning data.', auth: true },
    { method: 'GET', path: '/api/analytics/overview', desc: 'Dashboard analytics: conversion rates, pipeline value, average deal size, technique effectiveness, and trend data.', auth: true },
    { method: 'GET', path: '/api/pipeline', desc: 'Full deal pipeline with stage counts, weighted values, forecasted revenue, and stalled deal alerts.', auth: true },
  ],

  userGuide: [
    {
      title: 'Training Your AI Sales Agent',
      id: 'training',
      content: [
        'The effectiveness of Closer depends on the quality of its training data. Start by uploading your product documentation, pricing sheets, and competitive battle cards. The more context Closer has about your offerings, the more accurately it can answer prospect questions and position your value proposition.',
        'Next, review the persuasion technique configuration. Each technique can be enabled, disabled, or weighted based on your sales philosophy. If your brand is consultative, reduce assertive techniques and increase discovery-focused approaches. If you sell high-volume low-touch products, enable urgency and scarcity techniques for faster closes.',
        'Finally, feed Closer examples of successful conversations from your top reps. The AI learns from winning patterns — which objection responses led to closes, which discovery questions uncovered real pain, and which closing techniques had the highest conversion rates.',
      ],
    },
    {
      title: 'Managing Conversations',
      id: 'conversations',
      content: [
        'The conversation dashboard shows all active, paused, and completed conversations. Each conversation card displays the lead name, qualification score, current pipeline stage, and a real-time sentiment indicator. Click into any conversation to see the full transcript with AI annotations.',
        'AI annotations appear as colored badges next to each message — persuasion technique used (blue), objection detected (orange), buying signal (green), and risk flag (red). Use these annotations to understand how the AI is navigating each conversation and to identify coaching moments for your human team.',
        'You can take over any conversation at any point by clicking the "Human Takeover" button. The AI gracefully transitions and provides a handoff summary including key objections raised, decision criteria mentioned, and recommended next steps.',
      ],
    },
    {
      title: 'Lead Pipeline Management',
      id: 'pipeline',
      content: [
        'Closer organizes leads into a visual pipeline with customizable stages. Default stages include New Lead, Qualified, Discovery, Proposal, Negotiation, and Closed Won/Lost. Drag leads between stages manually or let the AI advance them automatically based on conversation milestones.',
        'Each stage has configurable automation rules. For example, leads in "Discovery" for more than 5 days can automatically trigger a re-engagement sequence. Leads that reach "Negotiation" can notify your sales manager for deal review. Stalled deals surface in the alerts panel with AI-recommended actions to get them moving again.',
      ],
    },
    {
      title: 'Customizing Persuasion Strategy',
      id: 'persuasion',
      content: [
        'The Persuasion Strategy panel lets you fine-tune how aggressively Closer sells. The intensity slider ranges from "Consultative" (ask-first, low pressure) to "Assertive" (direct closes, urgency creation). Most B2B companies perform best in the 40-60% range, while e-commerce and transactional sales benefit from higher intensity.',
        'You can also create segment-specific strategies. Enterprise leads might get a consultative approach with ROI-focused messaging, while SMB leads get a faster, benefit-focused approach. Strategy rules can be based on lead score, deal size, industry, or any custom field in your lead profiles.',
        'Review the Technique Effectiveness report weekly. It shows which persuasion techniques are driving conversions and which are causing drop-offs. Use these insights to continuously refine your strategy for maximum close rates.',
      ],
    },
    {
      title: 'Analytics & Performance',
      id: 'analytics',
      content: [
        'The Analytics dashboard provides four key views: Pipeline Health, Conversion Funnel, Technique Performance, and Team Comparison. Pipeline Health shows total value by stage, average time in each stage, and forecasted close dates. The Conversion Funnel tracks drop-off rates between stages and highlights the biggest bottlenecks.',
        'Technique Performance is unique to Closer — it measures the conversion impact of each persuasion technique across all conversations. See which techniques work best for different industries, deal sizes, and buyer personas. Export these insights to train your human sales team on AI-proven approaches.',
        'Team Comparison lets managers compare AI-only, AI-assisted, and human-only conversations side by side. Track metrics like response time, objection resolution rate, follow-up consistency, and close rate to quantify the ROI of AI-augmented selling.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Persuasion Engine', desc: 'Dynamically selects from 35+ persuasion techniques based on conversation context, prospect psychology, and deal stage. Techniques are layered and sequenced for maximum cumulative impact rather than applied in isolation.' },
    { capability: 'Objection Prediction', desc: 'Analyzes conversation patterns to predict objections before they surface. Pre-emptively addresses concerns through strategic framing, social proof insertion, and risk mitigation language.' },
    { capability: 'Lead Scoring', desc: 'Multi-signal qualification engine that scores leads across behavioral engagement, firmographic fit, conversation sentiment, and buying intent. Scores update in real time as new signals emerge.' },
    { capability: 'Sentiment Reading', desc: 'Continuous sentiment analysis throughout every conversation. Detects shifts in prospect mood, frustration signals, excitement indicators, and disengagement patterns. Adapts tone and approach automatically.' },
    { capability: 'Buying Signal Detection', desc: 'Identifies 40+ buying signals including timeline mentions, budget discussions, stakeholder introductions, feature-specific questions, and competitive comparison requests. Triggers appropriate closing sequences.' },
    { capability: 'Price Negotiation', desc: 'Intelligent negotiation engine with configurable discount authority. Uses anchoring, bundling, payment terms, and value reframing to protect margin while moving deals forward. Escalates to human when outside authority bounds.' },
    { capability: 'Follow-Up Timing', desc: 'Machine learning model that optimizes follow-up timing based on prospect behavior patterns, industry norms, and conversation recency. Sends messages when prospects are most likely to engage.' },
    { capability: 'Win/Loss Analysis', desc: 'Post-deal analysis that identifies the techniques, objection responses, and conversation patterns that led to wins versus losses. Feeds insights back into the persuasion engine for continuous improvement.' },
  ],

  troubleshooting: [
    { issue: 'AI responses feel too aggressive or pushy', solution: 'Lower the persuasion intensity slider in Settings > Persuasion Strategy. Move it toward the "Consultative" end. Also review which techniques are enabled — disable "Urgency Creation" and "Scarcity Framing" if they do not match your brand. Re-test with a sample conversation to verify the new tone.' },
    { issue: 'Lead scoring seems inaccurate or inconsistent', solution: 'Check your scoring weight configuration in Settings > Lead Scoring. The default weights may not match your ideal customer profile. Increase weight on the signals that matter most for your business (e.g., company size, engagement frequency) and decrease weight on less predictive signals. Re-score existing leads after updating weights.' },
    { issue: 'CRM integration not syncing properly', solution: 'Verify your API credentials in Settings > Integrations. Check that the webhook URL is accessible from external servers (not blocked by firewall). Review the sync log at /api/integrations/sync-log for specific error messages. Common issues include expired OAuth tokens and field mapping mismatches.' },
    { issue: 'Conversation history not loading or incomplete', solution: 'Conversation data is fetched in paginated batches. If history appears incomplete, scroll to trigger additional page loads. For API users, ensure you are following pagination cursors in the response. If data is genuinely missing, check the /api/conversations/:id/audit endpoint for deletion or archival events.' },
  ],

  faq: [
    { q: 'Can Closer AI fully replace my human sales team?', a: 'Closer is designed to augment your sales team, not replace it entirely. The AI handles high-volume prospecting, initial qualification, follow-ups, and objection handling autonomously. Complex enterprise deals, relationship-heavy accounts, and final contract negotiations benefit from human involvement. Most teams see the best results using Closer for the first 80% of the pipeline and humans for the final 20%.' },
    { q: 'How does Closer learn my specific products and pricing?', a: 'You upload your product catalog, pricing sheets, competitive battle cards, and example conversations during onboarding. Closer ingests this into a structured knowledge base and references it during live conversations. As you update products or pricing, changes reflect in conversations immediately. The AI also learns from successful closes — which value propositions and proof points resonate most with your buyers.' },
    { q: 'What happens when the AI encounters a question it cannot answer?', a: 'Closer has a configurable confidence threshold. When it cannot answer a question with sufficient confidence, it either gracefully defers ("Let me connect you with a specialist who can address that in detail") or escalates to a human rep via your configured notification channel. The unanswered question is logged for knowledge base improvement.' },
    { q: 'Is conversation data secure and private?', a: 'All conversations are encrypted in transit (TLS 1.3) and at rest (AES-256). Data is stored in isolated tenant environments on Cloudflare infrastructure. You retain full ownership of your data and can export or delete it at any time. Closer does not use your conversation data to train models for other customers.' },
    { q: 'How do I measure the ROI of Closer AI?', a: 'The Analytics dashboard includes a dedicated ROI calculator that tracks before/after metrics across your pipeline. Key indicators include leads processed per day, average response time, conversion rate by stage, average deal size, and sales cycle length. Most customers see measurable improvement within the first 30 days of deployment.' },
  ],
}

export default function CloserDocsPage() {
  return <ProductDoc {...data} />
}
