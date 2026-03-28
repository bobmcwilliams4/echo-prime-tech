'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Customer Success',
  tagline: 'AI-powered customer health scoring, retention playbooks, and churn prediction for SaaS teams.',
  accent: '#10b981',
  productUrl: '/customer-success',
  workerUrl: 'echo-customer-success.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Customer Success is a comprehensive AI-powered platform for SaaS customer success teams. It provides real-time composite health scores from 5 signal categories — usage, engagement, support tickets, NPS/CSAT, and payment behavior — with configurable weights per organization. The platform replaces expensive enterprise tools like Gainsight ($2,500/mo) and ChurnZero ($1,200/mo) at a fraction of the cost.',
    'Automated retention playbooks trigger on health score drops, contract expiry windows, NPS changes, usage declines, or any custom condition. Template-based onboarding with step tracking and auto-completion detection ensures new customers get started successfully. Expansion tracking identifies upsell and cross-sell opportunities with confidence scoring and ARR potential.',
    'AI-powered churn prediction analyzes account health trends, usage patterns, support history, and engagement signals to predict churn risk and recommend specific retention actions for each at-risk account. Daily automated snapshots, stale account detection, and contract expiry warnings keep your team proactive rather than reactive.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Organization', desc: 'Sign up and create your organization. Import your customer accounts via CSV upload or API integration. Each account gets an automatic health score based on available data.' },
    { step: 2, title: 'Configure Health Weights', desc: 'Customize the weight of each signal category for your health scores. Default weights are: Usage 30%, Engagement 25%, Support 20%, NPS 15%, Payment 10%. Adjust per your business priorities.' },
    { step: 3, title: 'Set Up Playbooks', desc: 'Create retention playbooks triggered by specific conditions — health score drops below a threshold, contract expiry within 90 days, NPS decreases, or custom triggers. Playbooks can be manual or fully automated.' },
    { step: 4, title: 'Assign CSMs', desc: 'Assign customer success managers to accounts. View workload distribution across your team and track performance metrics per CSM.' },
  ],
  features: [
    { title: 'AI Health Scoring', desc: 'Real-time composite health scores from 5 signal categories (usage, engagement, support, NPS/CSAT, payment) with configurable weights per organization. Scores update automatically as new signals arrive.' },
    { title: 'Retention Playbooks', desc: 'Automated and manual playbooks triggered by health drops, contract expiry, NPS changes, usage declines, or custom conditions. Unlimited playbooks with conditional logic and escalation paths.' },
    { title: 'Onboarding Automation', desc: 'Template-based onboarding with step tracking, auto-completion detection, and progress dashboards. Ensure every new customer completes critical setup milestones.' },
    { title: 'Expansion Tracking', desc: 'Identify and track upsell and cross-sell opportunities with AI confidence scoring and ARR potential estimates. Never miss a revenue expansion opportunity.' },
    { title: 'AI Churn Prediction', desc: 'Engine-powered churn risk analysis that examines health trends, usage patterns, support history, and engagement signals. Provides specific retention recommendations per at-risk account.' },
    { title: 'Risk Alerts', desc: 'Automatic alerts when health scores cross configurable thresholds. Severity levels (low, medium, high, critical) with recommended actions for each alert.' },
    { title: 'NPS & CSAT Surveys', desc: 'Built-in survey collection with automatic health score updates and trend analysis. Track sentiment changes over time for every account.' },
    { title: 'Touchpoint Logging', desc: 'Track every customer interaction — calls, emails, meetings, reviews — with sentiment analysis. Build a complete history of your customer relationship.' },
    { title: 'CSM Assignment', desc: 'Assign customer success managers with workload visibility and performance tracking. Balance account distribution across your team.' },
    { title: 'Net Revenue Retention', desc: 'Daily NRR snapshots with expansion, contraction, and churn breakdowns. Trend analysis shows how retention metrics evolve over time.' },
    { title: 'Daily Cron Intelligence', desc: 'Automated daily health snapshots, stale account detection, and contract expiry warnings. Your team starts each day knowing exactly where to focus.' },
    { title: 'Export & Reporting', desc: 'Export accounts, health data, and revenue metrics as CSV or JSON for any analysis tool or executive reporting.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/accounts', desc: 'List all customer accounts with health scores', auth: true },
    { method: 'POST', path: '/api/accounts', desc: 'Create a new customer account', auth: true },
    { method: 'GET', path: '/api/accounts/:id/health', desc: 'Get detailed health breakdown for an account', auth: true },
    { method: 'POST', path: '/api/health/signal', desc: 'Submit a health signal (usage, engagement, support, NPS, payment)', auth: true },
    { method: 'GET', path: '/api/playbooks', desc: 'List all retention playbooks', auth: true },
    { method: 'POST', path: '/api/playbooks', desc: 'Create a new playbook with trigger conditions', auth: true },
    { method: 'GET', path: '/api/nrr', desc: 'Get net revenue retention metrics and snapshots', auth: true },
    { method: 'GET', path: '/api/export', desc: 'Export accounts and health data as CSV or JSON', auth: true },
  ],
  userGuide: [
    { title: 'Health Score Configuration', id: 'health-config', content: [
      'Navigate to Settings and select Health Score Weights. Each organization can set custom weights for the 5 signal categories: Usage, Engagement, Support, NPS, and Payment. The default distribution is 30/25/20/15/10.',
      'Health scores range from 0 to 100. Accounts above 70 are considered healthy (green), 40-70 are at risk (yellow), and below 40 are critical (red). These thresholds are configurable per organization.',
      'Scores recalculate in real-time as new signals arrive via API, webhook, or manual entry. Historical health data is retained for trend analysis and churn prediction.',
    ]},
    { title: 'Creating Playbooks', id: 'playbooks', content: [
      'Go to Playbooks and click Create New. Define a trigger condition: health score drops below a value, contract expires within N days, NPS changes by more than a threshold, usage declines by a percentage, or a custom API event.',
      'Add steps to the playbook: send an email, create a task for the CSM, schedule a call, trigger a webhook, or escalate to management. Each step can have a delay (e.g., wait 3 days before the next step).',
      'Set the playbook to manual (CSM approves each step) or fully automated (steps execute without intervention). Monitor playbook effectiveness in the Analytics dashboard.',
    ]},
    { title: 'Expansion Opportunities', id: 'expansion', content: [
      'The Expansion dashboard shows accounts with upsell or cross-sell potential. AI scores each opportunity with a confidence percentage and estimated ARR impact.',
      'Filter by confidence level, ARR potential, current plan, or account health. Assign opportunities to sales reps or CSMs for follow-up with one click.',
      'Track conversion rates from opportunity identification through closed deals. Use this data to refine your expansion strategy over time.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Composite Health Scoring', desc: 'AI weighs 5 signal categories (usage, engagement, support, NPS, payment) with configurable weights to produce a single health score per account, updated in real-time.' },
    { capability: 'Churn Prediction', desc: 'Analyzes health trends, usage patterns, support history, and engagement signals to predict which accounts are most likely to churn and recommends specific retention actions.' },
    { capability: 'Retention Recommendations', desc: 'AI suggests specific actions for at-risk accounts based on the root cause of health decline — whether it is a usage drop, support escalation, or payment issue.' },
    { capability: 'Expansion Scoring', desc: 'Identifies upsell and cross-sell opportunities by analyzing usage patterns, feature adoption, and account growth signals with confidence-scored ARR potential.' },
  ],
  troubleshooting: [
    { issue: 'Health score not updating', solution: 'Verify that health signals are being submitted via the API or webhook integration. Check the signal log in Account Details to confirm data is arriving. Ensure the signal category matches one of the 5 configured types.' },
    { issue: 'Playbook not triggering', solution: 'Confirm the playbook is set to Active (not Draft or Paused). Check that the trigger condition matches the current account state. Review the Playbook Execution Log for error details.' },
    { issue: 'NRR metrics look incorrect', solution: 'NRR calculations require accurate contract values. Verify that account ARR values are set correctly in Account Settings. NRR snapshots are taken daily — changes may not reflect until the next snapshot.' },
    { issue: 'CSV export is empty', solution: 'Ensure you have selected a date range and at least one data type (accounts, health, revenue). Check that your account has export permissions in the role settings.' },
  ],
  faq: [
    { q: 'What is AI health scoring?', a: 'Our AI analyzes five signal categories — usage, engagement, support tickets, NPS/CSAT, and payment behavior — with configurable weights per organization to produce a real-time composite health score for every account.' },
    { q: 'How does it compare to Gainsight?', a: 'Echo Customer Success provides the core features — health scoring, playbooks, onboarding, expansion tracking, and AI recommendations — at a fraction of Gainsight\'s enterprise pricing ($39/mo vs $2,500/mo), with zero infrastructure to manage.' },
    { q: 'Can I customize health score weights?', a: 'Yes. Each organization can set custom weights for usage, engagement, support, NPS, and payment. Default is 30/25/20/15/10 but fully adjustable via the API or settings dashboard.' },
    { q: 'Does it integrate with existing tools?', a: 'Yes. The webhook system and REST API integrate with CRMs, support desks, billing systems, and anything with an API. Service bindings connect to the Echo ecosystem for AI analysis and email automation.' },
    { q: 'What playbooks are included?', a: 'Create unlimited custom playbooks triggered by health drops, contract expiry, NPS changes, usage declines, or any custom condition. Playbooks can be manual or fully automated.' },
    { q: 'How does churn prediction work?', a: 'The AI engine analyzes health trends, usage patterns, support history, and engagement signals to predict churn risk and recommend specific retention actions for each at-risk account.' },
  ],
}

export default function CustomerSuccessDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/customer-success' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
