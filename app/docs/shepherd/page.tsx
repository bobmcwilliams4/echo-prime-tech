'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Shepherd',
  tagline: 'AI-powered customer onboarding assistant — guided setup, progress tracking, checklists, and adaptive learning for every new user.',
  accent: '#8b5cf6',
  productUrl: '/bree-assistant',
  workerUrl: 'https://bree-customer-service.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Shepherd is an AI-powered customer onboarding assistant that guides new users through product setup, feature discovery, and first-value milestones. Instead of dropping customers into a complex dashboard with no direction, Shepherd creates a personalized onboarding journey based on the customer\'s industry, business size, and goals.',
    'The assistant reduces time-to-value by 60% and cuts support tickets during the first 30 days by 45%. It adapts in real time — if a user struggles with a step, Shepherd offers alternative instructions, video walkthroughs, or connects them with a live support agent. Every onboarding journey is tracked, measured, and optimized.',
    'Shepherd integrates with every Echo Prime product. Whether a customer signs up for Office AI, Security Suite, Sentinel, or any other platform product, Shepherd handles the onboarding experience end-to-end: account setup, data import, feature configuration, first task completion, and graduation to self-service.',
  ],

  gettingStarted: [
    { step: 1, title: 'Automatic Activation', desc: 'Shepherd activates automatically when a new user signs up for any Echo Prime product. No manual setup required — the onboarding journey begins immediately after account creation.' },
    { step: 2, title: 'Profile Assessment', desc: 'Shepherd asks 3-5 quick questions about your industry, team size, and primary goals. This information customizes the onboarding checklist and prioritizes features relevant to your use case.' },
    { step: 3, title: 'Guided Setup Checklist', desc: 'A step-by-step checklist walks you through essential configuration: importing data, connecting integrations, customizing settings, and completing your first core task.' },
    { step: 4, title: 'First-Value Milestone', desc: 'Shepherd guides you to complete one meaningful action — send your first invoice, run your first scan, or make your first AI call. This "aha moment" demonstrates the platform\'s value within minutes.' },
    { step: 5, title: 'Graduation', desc: 'Once all checklist items are complete, Shepherd transitions to an on-demand assistant. It remains available in the help panel for questions but no longer interrupts your workflow with prompts.' },
  ],

  features: [
    { title: 'Personalized Onboarding', desc: 'Onboarding checklists are customized based on industry, business size, and stated goals. A cleaning company sees different steps than a law firm.' },
    { title: 'Progress Tracking', desc: 'Visual progress bar and checklist show exactly where the user is in their onboarding journey. Administrators can view team-wide onboarding completion rates.' },
    { title: 'Adaptive Guidance', desc: 'If a user gets stuck on a step, Shepherd detects the delay and offers alternative instructions, a video walkthrough, or a live chat connection.' },
    { title: 'Multi-Product Support', desc: 'Works across all Echo Prime products. A single Shepherd instance manages onboarding for Office AI, Security Suite, Sentinel, and every other platform product.' },
    { title: 'In-Context Help', desc: 'Contextual tooltips and help panels appear on the exact page and feature the user needs help with. No searching through docs — the answer is right where you need it.' },
    { title: 'Milestone Celebrations', desc: 'Congratulatory messages and progress badges mark key milestones. Positive reinforcement keeps users engaged through the entire onboarding process.' },
    { title: 'Admin Dashboard', desc: 'Admins see onboarding analytics: completion rates, drop-off points, average time-to-value, and which steps cause the most support tickets.' },
    { title: 'Automated Follow-Ups', desc: 'If a user abandons onboarding, Shepherd sends email reminders with direct links to resume from exactly where they left off.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/onboarding/status', desc: 'Get the current onboarding status for a user: completed steps, remaining steps, progress percentage, and estimated time to completion.', auth: true },
    { method: 'POST', path: '/api/onboarding/start', desc: 'Start or restart an onboarding journey for a user. Accepts product ID and optional profile assessment answers.', auth: true },
    { method: 'POST', path: '/api/onboarding/complete-step', desc: 'Mark a specific onboarding step as complete. Triggers the next step in the checklist and updates progress.', auth: true },
    { method: 'GET', path: '/api/onboarding/analytics', desc: 'Admin endpoint: retrieve onboarding analytics across all users — completion rates, drop-off points, and time-to-value metrics.', auth: true },
    { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status and onboarding engine availability.', auth: false },
  ],

  userGuide: [
    {
      title: 'Following the Onboarding Checklist',
      id: 'checklist',
      content: [
        'The onboarding checklist appears as a panel on the right side of your dashboard. Each item has a title, description, and action button. Click the action button to navigate directly to the page where you complete that step.',
        'Steps are ordered by importance and dependency. Some steps unlock only after prerequisites are completed. The progress bar at the top updates in real time as you check off items.',
        'If you need to skip a step, click "Skip for now." Skipped steps remain in the checklist and Shepherd will remind you about them periodically until they are completed or dismissed.',
      ],
    },
    {
      title: 'Getting Help During Onboarding',
      id: 'getting-help',
      content: [
        'If you are stuck on any step, click the help icon next to the step title. Shepherd provides three levels of assistance: written instructions, a video walkthrough, and a live chat connection to a support agent.',
        'The AI assistant in the bottom-right corner can answer questions about any feature at any time. Type your question in natural language and Shepherd responds with step-by-step guidance specific to your current context.',
        'For complex issues, Shepherd can schedule a one-on-one onboarding call with our team. Enterprise customers receive a dedicated onboarding specialist for their entire team.',
      ],
    },
    {
      title: 'Admin Onboarding Analytics',
      id: 'admin-analytics',
      content: [
        'Administrators access onboarding analytics from Settings > Onboarding. The dashboard shows: overall completion rate, average time-to-value, step-by-step drop-off analysis, and support ticket correlation.',
        'Use this data to identify where users struggle most. If 40% of users abandon at the "Import Customers" step, it signals that the CSV import needs improvement or better documentation.',
        'Export onboarding reports for team reviews or investor updates. The data demonstrates user activation metrics and product-market fit indicators.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Adaptive Learning', desc: 'Shepherd tracks user behavior to detect confusion or hesitation. If a user visits the same page multiple times without completing an action, Shepherd proactively offers help.' },
    { capability: 'Personalization Engine', desc: 'Industry, business size, and stated goals customize every aspect of onboarding — from the checklist order to the language used in tooltips and the examples shown in tutorials.' },
    { capability: 'Predictive Drop-Off', desc: 'ML model predicts which users are at risk of abandoning onboarding based on engagement patterns. Triggers proactive outreach before the user disengages.' },
    { capability: 'Natural Language Support', desc: 'Users can ask questions in natural language at any point during onboarding. Shepherd understands context — if you ask "how do I add my team?" while on the invoicing page, it knows you mean the Team module.' },
  ],

  troubleshooting: [
    { issue: 'Onboarding checklist not appearing', solution: 'The checklist appears automatically for new accounts. If it is missing, navigate to Settings > Onboarding and click "Restart Onboarding." If still missing, clear your browser cache and refresh.' },
    { issue: 'Step marked complete but still showing incomplete', solution: 'Some steps require server-side verification (e.g., successful integration connection). If the step does not update within 30 seconds, refresh the page. If it persists, the integration may have failed silently — check Settings > Integrations for error messages.' },
    { issue: 'Shepherd notifications are too frequent', solution: 'Adjust notification frequency in Settings > Onboarding > Preferences. Options are: Proactive (default), Minimal (only reminders for abandoned steps), and Silent (checklist only, no notifications).' },
  ],

  faq: [
    { q: 'Is Shepherd available for all Echo Prime products?', a: 'Yes. Shepherd provides onboarding for every Echo Prime product including Office AI, Security Suite, Sentinel AI, Closer AI, and all platform tools. Each product has its own customized onboarding journey.' },
    { q: 'Can I skip the onboarding process?', a: 'Yes. Click "Skip Onboarding" at the top of the checklist panel. You can restart onboarding at any time from Settings > Onboarding. We recommend completing it — users who finish onboarding are 3x more likely to become long-term customers.' },
    { q: 'Does Shepherd work on mobile?', a: 'Yes. The onboarding checklist and AI assistant are fully responsive and work on any mobile browser. Steps that require desktop features (like CSV import) will note that in the step description.' },
    { q: 'How long does onboarding typically take?', a: 'Most users complete onboarding in 15-30 minutes depending on the product. Office AI onboarding (with data import) averages 25 minutes. Security Suite onboarding averages 15 minutes. You can pause and resume at any time.' },
    { q: 'Can administrators customize the onboarding checklist?', a: 'Enterprise plans include custom onboarding configuration. Administrators can add company-specific steps, reorder the checklist, add custom training videos, and set mandatory steps that must be completed before accessing certain features.' },
  ],
}

export default function ShepherdDocsPage() {
  return <ProductDoc {...data} />
}
