'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo CRM',
  tagline: 'AI-powered customer relationship management — contacts, deals, pipelines, and automation.',
  accent: '#2563eb',
  productUrl: '/crm',
  workerUrl: 'https://echo-crm.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo CRM is a comprehensive AI-powered customer relationship management platform built for modern sales teams and growing businesses. It centralizes every contact, deal, and interaction in one intelligent workspace — eliminating spreadsheet chaos and giving your team a single source of truth for every customer relationship.',
    'Powered by machine learning models trained on millions of sales interactions, Echo CRM goes beyond simple record-keeping. Intelligent lead scoring automatically prioritizes your hottest prospects, deal prediction surfaces at-risk opportunities before they stall, and smart automation handles repetitive follow-ups so your team can focus on closing. Every pipeline stage, custom field, and automation rule is fully configurable to match your exact sales process.',
    'From first touch to closed-won and beyond, Echo CRM provides complete visibility into your revenue engine. Real-time dashboards track pipeline velocity, conversion rates, and team performance. Activity timelines capture every email, call, and meeting automatically. And with a full REST API, webhook triggers, and native integrations, Echo CRM fits seamlessly into your existing tech stack.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/crm with your email or Google account. Your workspace is provisioned instantly with a sample pipeline and demo contacts to explore.' },
    { step: 2, title: 'Import Your Contacts', desc: 'Upload contacts via CSV, connect your email provider for automatic sync, or use the API to migrate from your existing CRM. Echo CRM deduplicates and enriches records automatically during import.' },
    { step: 3, title: 'Set Up Your Pipeline', desc: 'Configure deal stages to match your sales process — from lead to qualification to proposal to closed. Drag-and-drop stage ordering, custom win probabilities, and stage-specific required fields keep your pipeline clean.' },
    { step: 4, title: 'Configure Automation Rules', desc: 'Create automation workflows that trigger on deal stage changes, inactivity thresholds, or field updates. Auto-assign leads, send follow-up reminders, update deal owners, and notify Slack channels without writing code.' },
    { step: 5, title: 'Start Tracking & Closing', desc: 'Log activities, move deals through your pipeline, and let AI scoring guide your priorities. Monitor real-time dashboards to track team performance, pipeline health, and revenue forecasts.' },
  ],

  features: [
    { title: 'Contact Management', desc: 'Centralized contact database with custom fields, tags, company associations, and full interaction history. Merge duplicates, segment audiences, and search across every field instantly.' },
    { title: 'Deal Pipeline', desc: 'Visual Kanban-style pipeline with drag-and-drop deal movement, weighted probabilities per stage, and customizable deal properties. Multiple pipelines supported for different product lines or teams.' },
    { title: 'Lead Scoring AI', desc: 'Machine learning model scores every lead from 0-100 based on engagement signals, firmographic data, and behavioral patterns. Scores update in real time as new activity is logged.' },
    { title: 'Email Integration', desc: 'Two-way email sync with Gmail and Outlook. Emails automatically linked to contact records. Track opens, clicks, and replies. Send templated sequences directly from the CRM.' },
    { title: 'Task Automation', desc: 'Rule-based automation engine that triggers actions on deal stage changes, time-based conditions, or field updates. Create tasks, send notifications, update fields, and assign owners automatically.' },
    { title: 'Activity Timeline', desc: 'Chronological feed of every interaction per contact and deal — emails, calls, meetings, notes, and stage changes. Filter by activity type and team member for focused review.' },
    { title: 'Custom Fields', desc: 'Add unlimited custom fields to contacts, deals, and companies. Support for text, number, date, dropdown, multi-select, currency, and formula field types with validation rules.' },
    { title: 'Team Permissions', desc: 'Role-based access control with admin, manager, and rep roles. Field-level visibility, record ownership rules, and team-based pipeline access keep data secure and organized.' },
    { title: 'Report Builder', desc: 'Drag-and-drop report builder with 20+ chart types. Pre-built templates for pipeline velocity, conversion funnels, rep leaderboards, and revenue forecasts. Schedule reports via email.' },
    { title: 'Import/Export', desc: 'Bulk import contacts and deals via CSV with intelligent field mapping. Export any filtered view or report to CSV, Excel, or JSON. Scheduled exports for data warehouse sync.' },
    { title: 'Webhook Triggers', desc: 'Fire webhooks on any CRM event — new contact, deal stage change, task completion, score threshold. JSON payloads with full record data for real-time integrations.' },
    { title: 'Mobile Access', desc: 'Fully responsive interface optimized for phones and tablets. Log calls on the go, scan business cards, update deal stages, and receive push notifications for assigned tasks.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/contacts', desc: 'List all contacts with pagination, filtering by tags, company, score range, and custom field values.', auth: true },
    { method: 'POST', path: '/api/contacts', desc: 'Create a new contact with name, email, phone, company, tags, and custom field values. Returns the created record with assigned ID.', auth: true },
    { method: 'GET', path: '/api/contacts/:id', desc: 'Retrieve a single contact by ID including all fields, tags, deal associations, and recent activity.', auth: true },
    { method: 'PUT', path: '/api/contacts/:id', desc: 'Update an existing contact. Supports partial updates — only send the fields you want to change.', auth: true },
    { method: 'GET', path: '/api/deals', desc: 'List all deals with filtering by pipeline, stage, owner, value range, and expected close date.', auth: true },
    { method: 'POST', path: '/api/deals', desc: 'Create a new deal with title, value, pipeline, stage, contact associations, and custom properties.', auth: true },
    { method: 'PUT', path: '/api/deals/:id', desc: 'Update a deal record. Stage changes trigger automation rules and webhook events automatically.', auth: true },
    { method: 'DELETE', path: '/api/deals/:id', desc: 'Delete a deal and its associated activities. Contact records are preserved. Irreversible action.', auth: true },
    { method: 'GET', path: '/api/pipeline/:id/stages', desc: 'Retrieve all stages for a pipeline with deal counts, total value, and weighted forecast per stage.', auth: true },
    { method: 'GET', path: '/api/search', desc: 'Full-text search across contacts, deals, companies, and notes. Returns ranked results with match highlights.', auth: true },
  ],

  userGuide: [
    {
      title: 'Managing Contacts',
      id: 'managing-contacts',
      content: [
        'Contacts are the foundation of Echo CRM. Every person you interact with — leads, customers, partners, vendors — lives in the contact database with a complete profile including custom fields, tags, company associations, and a full activity timeline.',
        'To add a contact, click the "+ Contact" button or use the quick-add shortcut (Ctrl+K). Fill in the required fields (name and at least one of email/phone), add optional tags for segmentation, and associate the contact with a company record. Duplicate detection runs automatically and will prompt you to merge if a match is found.',
        'Use the filter bar to segment your contact list by any field, tag, lead score range, or last activity date. Save frequently used filters as named views for one-click access. Bulk actions let you tag, assign, export, or delete multiple contacts at once.',
      ],
    },
    {
      title: 'Deal Pipeline',
      id: 'deal-pipeline',
      content: [
        'The deal pipeline is your visual command center for tracking revenue opportunities from first qualification to close. Each pipeline consists of customizable stages that represent your sales process, with deals displayed as cards you can drag between stages.',
        'Create a new deal from any contact record or directly from the pipeline view. Every deal tracks a title, monetary value, expected close date, owner, associated contacts, and custom properties. As deals move through stages, the weighted pipeline value updates in real time on your dashboard.',
        'You can create multiple pipelines for different product lines, regions, or teams. Each pipeline has independent stages, automation rules, and reporting. Pipeline settings let you configure required fields per stage, stage-specific win probabilities, and automatic stale-deal alerts.',
      ],
    },
    {
      title: 'Lead Scoring',
      id: 'lead-scoring',
      content: [
        'Echo CRM\'s AI lead scoring model assigns every contact a score from 0 to 100 based on their likelihood to convert. The score considers engagement signals (email opens, page visits, form submissions), firmographic data (company size, industry, role), and behavioral patterns learned from your historical win/loss data.',
        'Scores update automatically as new activity is logged. High-score leads surface to the top of your contact list and can trigger automation rules — for example, auto-assigning any lead scoring above 80 to a senior rep and sending a Slack notification.',
        'You can customize scoring weights in Settings > Lead Scoring. Increase the weight of signals that matter most to your business, add negative scoring rules for disqualifying behaviors, and set score thresholds that map to your lead qualification stages.',
      ],
    },
    {
      title: 'Automations',
      id: 'automations',
      content: [
        'The automation engine lets you build if-this-then-that workflows without code. Each automation has a trigger (the event that starts it), optional conditions (filters that must be true), and one or more actions (what happens when triggered).',
        'Common automations include: auto-assigning new leads based on territory or round-robin, creating follow-up tasks when a deal sits in a stage too long, sending email notifications when a deal is won or lost, and updating custom fields based on activity patterns.',
        'Build automations from the Automations tab using the visual builder. Test automations in sandbox mode before activating them in production. The automation log shows every execution with timestamps, trigger details, and action results for debugging.',
      ],
    },
    {
      title: 'Reports & Analytics',
      id: 'reports-analytics',
      content: [
        'Echo CRM\'s reporting suite gives you real-time visibility into pipeline health, team performance, and revenue trends. The dashboard home screen shows key metrics — total pipeline value, deals won this month, conversion rate, and average deal cycle time.',
        'Use the Report Builder to create custom reports with drag-and-drop fields, filters, and chart types. Group by any field, apply date ranges, and compare periods. Pre-built report templates cover pipeline velocity, stage conversion funnels, rep leaderboards, lead source ROI, and forecast accuracy.',
        'Schedule any report for daily, weekly, or monthly email delivery to stakeholders. Export reports to CSV, Excel, or PDF. Pin your most-used reports to the dashboard for at-a-glance monitoring throughout the day.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Lead Scoring', desc: 'Machine learning model trained on your historical conversion data scores every lead 0-100 in real time. Factors include engagement recency, email interaction patterns, firmographic fit, and behavioral signals across your website and CRM.' },
    { capability: 'Deal Prediction', desc: 'Predictive model analyzes deal velocity, stage duration, activity frequency, and historical patterns to forecast win probability and expected close date. At-risk deals are flagged automatically with specific risk factors identified.' },
    { capability: 'Email Sentiment Analysis', desc: 'Natural language processing analyzes inbound and outbound email tone, urgency, and sentiment. Negative sentiment trends trigger alerts so reps can intervene before relationships deteriorate.' },
    { capability: 'Contact Enrichment', desc: 'Automatically enriches contact records with publicly available data — company size, industry, job title, social profiles, and technographic information. Keeps records current with periodic re-enrichment scans.' },
    { capability: 'Churn Detection', desc: 'Monitors customer engagement patterns — declining login frequency, reduced support interactions, negative feedback signals — to identify accounts at risk of churning before they disengage completely.' },
    { capability: 'Smart Scheduling', desc: 'AI analyzes recipient timezone, past response patterns, and calendar availability to recommend optimal times for emails, calls, and meetings. Increases response rates by timing outreach to each contact\'s peak engagement windows.' },
  ],

  troubleshooting: [
    { issue: 'CSV import fails or skips rows', solution: 'Ensure your CSV is UTF-8 encoded with headers in the first row. Required fields (name, email or phone) must be present for every row. Check for special characters in field values and remove any BOM markers. Download the error report after import to see which rows were skipped and why.' },
    { issue: 'Email sync not working', solution: 'Verify your email provider connection in Settings > Integrations. For Gmail, re-authorize if your Google token has expired. For Outlook, ensure the Echo CRM app is approved in your Azure AD admin portal. Check that the sync email address matches your CRM user email. Allow up to 15 minutes for initial sync to complete.' },
    { issue: 'Lead scores not updating', solution: 'Lead scores recalculate when new activity is logged. If scores appear stale, check that your email sync and web tracking are active — these are the primary signal sources. Verify scoring rules in Settings > Lead Scoring haven\'t been accidentally disabled. Force a full rescore from the admin panel if needed.' },
    { issue: 'Pipeline stages not saving', solution: 'Pipeline stage edits require admin or manager role permissions. Check your role in Settings > Team. If you have the correct role, ensure no required fields are missing from the stage configuration. Clear your browser cache and retry. If the issue persists, check the browser console for API errors and contact support.' },
  ],

  faq: [
    { q: 'How many contacts can I store in Echo CRM?', a: 'There is no hard limit on contact records. Free plans include up to 1,000 contacts, Pro plans support up to 100,000, and Enterprise plans have unlimited contacts. All plans include full search, filtering, and segmentation regardless of volume.' },
    { q: 'Can I import data from another CRM?', a: 'Yes. Echo CRM supports CSV import with intelligent field mapping that auto-detects common CRM export formats from Salesforce, HubSpot, Pipedrive, and Zoho. For large migrations (100K+ records), use the API for bulk import with automatic deduplication and enrichment.' },
    { q: 'Does Echo CRM integrate with my email provider?', a: 'Echo CRM offers native two-way sync with Gmail and Microsoft Outlook. Emails are automatically matched to contact records, tracked for opens and clicks, and displayed in the activity timeline. IMAP/SMTP connections are available for other email providers.' },
    { q: 'How does the AI lead scoring work?', a: 'The scoring model analyzes engagement signals (email opens, website visits, form fills), firmographic data (company size, industry), and behavioral patterns from your historical conversion data. Scores range from 0-100 and update in real time. You can customize scoring weights and thresholds in Settings.' },
    { q: 'Is my data secure in Echo CRM?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Echo CRM runs on Cloudflare\'s global edge network with SOC 2 compliance. Role-based access control, audit logging, and API key management ensure your customer data stays protected. Data residency options are available for Enterprise plans.' },
  ],
}

export default function EchoCrmDocsPage() {
  return <ProductDoc {...data} />
}
