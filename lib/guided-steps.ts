import type { GuidedStep } from './guided-tutorial-context';

/* ─────────────────────────────────────────────────────────
   GUIDED STEP DEFINITIONS
   Maps each tutorial to a sequence of interactive steps
   targeting real UI elements via data-tutorial selectors.

   PRODUCT TUTORIALS (52 products):
   - Engines, Closer (6 sub-tutorials), Grading, Tax Returns,
     Title Intelligence, Security, Pentesting, SDK, Knowledge,
     Pipelines, Bots, Scrapers, Immortality Vault, Dark Web Intel,
     Crypto Trading, Price Alerts, Reddit, Voice, EchoCAD,
     Daedalus Forge, Hephaestion Forge, Office AI, Bree Assistant,
     X Bot, LinkedIn, Payments, Scanner, E-Commerce, Websites,
     Orchestration, County Records, Vault, Sandbox, Services,
     Call Center, Home AI, Shepherd AI, Intel Hub, A/B Testing,
     Incident Manager, Gamer Companion, WhatsApp Bot, Telegram Bot,
     CRM, Booking, Invoice, Inventory, Payroll, Document Manager,
     Expense Tracker, Customer Success, Data Room
───────────────────────────────────────────────────────── */

function makeSteps(
  tutorialId: string,
  defs: Omit<GuidedStep, 'tutorialId' | 'stepNumber' | 'totalSteps'>[]
): GuidedStep[] {
  return defs.map((d, i) => ({
    ...d,
    tutorialId,
    stepNumber: i + 1,
    totalSteps: defs.length,
  }));
}

const GUIDED_STEPS: Record<string, GuidedStep[]> = {

  /* ═══════════════════════════════════════════════════════
     INTELLIGENCE ENGINES (/engines)
     ═══════════════════════════════════════════════════════ */
  'engines': makeSteps('engines', [
    {
      id: 'engines-observe',
      route: '/engines',
      selector: '[data-tutorial="engines-hero"]',
      action: 'observe',
      title: 'Welcome to Intelligence Engines',
      callout: 'This is the Intelligence Engines catalog. Over 6,500 AI reasoning engines across 1,000+ domains — each with embedded expert knowledge. Browse, search, and try any engine.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'engines-search',
      route: '/engines',
      selector: '[data-tutorial="engines-search"]',
      action: 'type',
      title: 'Search for an Engine',
      callout: 'Type a topic to find engines. Try "oil and gas", "tax deductions", "cybersecurity", or any domain you need expertise in.',
      exampleValue: 'oil and gas',
      tooltipPosition: 'bottom',
    },
    {
      id: 'engines-tier-filter',
      route: '/engines',
      selector: '[data-tutorial="engines-tier-filter"]',
      action: 'click',
      title: 'Filter by Tier',
      callout: 'Filter engines by tier: Free, Starter, Professional, or Enterprise. Free engines are available to everyone — great for testing.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'engines-domain-card',
      route: '/engines',
      selector: '[data-tutorial="engines-domain-card"]',
      action: 'click',
      title: 'Explore a Domain',
      callout: 'Click any domain card to see all engines in that category. Each domain has multiple specialized engines with deep expertise.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'engines-try-query',
      route: '/engines',
      selector: '[data-tutorial="engines-try-query"]',
      action: 'click',
      title: 'Try an Engine Query',
      callout: 'Click "Try It" on any engine to test it with a real question. The engine returns expert-level analysis with citations and confidence levels.',
      tooltipPosition: 'left',
    },
    {
      id: 'engines-pricing',
      route: '/engines',
      selector: '[data-tutorial="engines-pricing"]',
      action: 'observe',
      title: 'View Pricing Plans',
      callout: 'Scroll down to see pricing tiers. Start with the free tier to test engines, then upgrade for higher query limits and priority routing.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Settings
     ═══════════════════════════════════════════════════════ */
  'settings': makeSteps('settings', [
    {
      id: 'settings-tab-business',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-tab-business"]',
      action: 'click',
      title: 'Open Business Settings',
      callout: 'Click the Business tab to configure your company information. This is where you set your company name and timezone.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'settings-company-name',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-company-name"]',
      action: 'type',
      title: 'Enter Company Name',
      callout: 'Type your company name here. This appears on caller ID and in reports.',
      exampleValue: 'West Texas Solar',
      tooltipPosition: 'right',
    },
    {
      id: 'settings-timezone',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-timezone"]',
      action: 'select',
      title: 'Select Timezone',
      callout: 'Choose your timezone. This controls when the AI is allowed to make calls — it will never call outside your business hours.',
      tooltipPosition: 'right',
    },
    {
      id: 'settings-tab-voice',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-tab-voice"]',
      action: 'click',
      title: 'Open Voice Settings',
      callout: 'Click the Voice tab to choose how your AI agent sounds on calls.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'settings-voice-preset',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-voice-preset"]',
      action: 'click',
      title: 'Choose AI Voice',
      callout: 'Pick a voice for your AI caller. Bobby is warm and works great for B2B sales. Alice sounds professional for services. Click any voice to preview it.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'settings-tab-calling',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-tab-calling"]',
      action: 'click',
      title: 'Open Calling Settings',
      callout: 'Click the Calling tab to set up caller ID, recording, and business hours.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'settings-recording',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-recording"]',
      action: 'toggle',
      title: 'Enable Call Recording',
      callout: 'Toggle this ON to record every call. Recordings appear in your Calls tab so you can review what the AI said. Highly recommended.',
      tooltipPosition: 'right',
    },
    {
      id: 'settings-save',
      route: '/closer/settings',
      selector: '[data-tutorial="settings-save"]',
      action: 'click',
      title: 'Save Your Settings',
      callout: 'Click Save to apply all your changes. You can always come back and adjust these later.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Scripts
     ═══════════════════════════════════════════════════════ */
  'scripts': makeSteps('scripts', [
    {
      id: 'scripts-observe',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-page"]',
      action: 'observe',
      title: 'What is a Script?',
      callout: 'A script tells your AI exactly what to say on a call — the opener, questions to ask, and how to handle objections. You build it once, then the AI follows it on every call.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'scripts-create',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-create"]',
      action: 'click',
      title: 'Create a New Script',
      callout: 'Click "Create Script" to start building your first AI call script. You will name it and configure the conversation flow.',
      tooltipPosition: 'left',
    },
    {
      id: 'scripts-name',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-name"]',
      action: 'type',
      title: 'Name Your Script',
      callout: 'Give your script a descriptive name. You may build 5-10 scripts over time, so name it something memorable.',
      exampleValue: 'Solar Opener v2',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="scripts-form"]'],
    },
    {
      id: 'scripts-description',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-description"]',
      action: 'type',
      title: 'Add a Description',
      callout: 'Briefly describe what this script is for. This helps you remember the purpose when you have multiple scripts.',
      exampleValue: 'First contact for West Texas solar leads',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="scripts-form"]'],
    },
    {
      id: 'scripts-industry',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-industry"]',
      action: 'select',
      title: 'Select Your Industry',
      callout: 'Pick the industry that best matches your business. The AI uses this to tailor its language and approach.',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="scripts-form"]'],
    },
    {
      id: 'scripts-next-step',
      route: '/closer/scripts',
      selector: '[data-tutorial="scripts-next-btn"]',
      action: 'click',
      title: 'Continue to Steps',
      callout: 'Click Next to move to the conversation steps builder. This is where you define what the AI actually says on the call.',
      tooltipPosition: 'top',
      alsoAllow: ['[data-tutorial="scripts-form"]'],
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Leads
     ═══════════════════════════════════════════════════════ */
  'leads': makeSteps('leads', [
    {
      id: 'leads-add',
      route: '/closer/leads',
      selector: '[data-tutorial="leads-add"]',
      action: 'click',
      title: 'Add Your First Lead',
      callout: 'Click "Add Lead" to add someone the AI should call. Use this for individual referrals or high-value prospects.',
      tooltipPosition: 'left',
    },
    {
      id: 'leads-first-name',
      route: '/closer/leads',
      selector: '[data-tutorial="leads-first-name"]',
      action: 'type',
      title: 'Enter Lead Name',
      callout: 'Type the lead\'s first name. The AI uses this to personalize the call — "Hi Marcus, this is..."',
      exampleValue: 'Marcus',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="leads-form"]'],
    },
    {
      id: 'leads-phone',
      route: '/closer/leads',
      selector: '[data-tutorial="leads-phone"]',
      action: 'type',
      title: 'Enter Phone Number',
      callout: 'Phone number is REQUIRED — this is the number the AI dials. Everything else helps with personalization.',
      exampleValue: '(432) 555-0192',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="leads-form"]'],
    },
    {
      id: 'leads-status-filter',
      route: '/closer/leads',
      selector: '[data-tutorial="leads-status-filter"]',
      action: 'select',
      title: 'Filter by Status',
      callout: 'Use the status filter to see only your hot leads, unconverted leads, or appointments. Statuses update automatically as the AI calls.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'leads-search',
      route: '/closer/leads',
      selector: '[data-tutorial="leads-search"]',
      action: 'type',
      title: 'Search Your Leads',
      callout: 'Type a name, company, or phone number to quickly find a specific lead in your list.',
      exampleValue: 'Marcus',
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Campaigns
     ═══════════════════════════════════════════════════════ */
  'campaigns': makeSteps('campaigns', [
    {
      id: 'campaigns-observe',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-page"]',
      action: 'observe',
      title: 'What is a Campaign?',
      callout: 'A campaign connects your leads to a script and tells the AI when to call and how many calls per hour. Think of it as a calling job you assign to your AI agent.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'campaigns-create',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-create"]',
      action: 'click',
      title: 'Create a Campaign',
      callout: 'Click "New Campaign" to set up your first calling campaign. You will need at least one script and some leads before this works.',
      tooltipPosition: 'left',
    },
    {
      id: 'campaigns-name',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-name"]',
      action: 'type',
      title: 'Name Your Campaign',
      callout: 'Give the campaign a descriptive name. Include the target market and time period so you can track performance.',
      exampleValue: 'West Texas Solar Q2',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="campaigns-form"]'],
    },
    {
      id: 'campaigns-script',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-script"]',
      action: 'select',
      title: 'Assign a Script',
      callout: 'Select which script the AI follows during calls. If you don\'t see any scripts, go build one first in the Scripts tab.',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="campaigns-form"]'],
    },
    {
      id: 'campaigns-cph',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-cph"]',
      action: 'click',
      title: 'Set Calls Per Hour',
      callout: 'Start with 5-10 calls per hour. Too many simultaneous calls can hurt your connection rates. You can increase this later.',
      tooltipPosition: 'right',
      alsoAllow: ['[data-tutorial="campaigns-form"]'],
    },
    {
      id: 'campaigns-submit',
      route: '/closer/campaigns',
      selector: '[data-tutorial="campaigns-submit"]',
      action: 'click',
      title: 'Create the Campaign',
      callout: 'Click to create the campaign. It starts as Draft — you control when the AI begins calling by toggling it to Active.',
      tooltipPosition: 'top',
      alsoAllow: ['[data-tutorial="campaigns-form"]'],
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Calls
     ═══════════════════════════════════════════════════════ */
  'calls': makeSteps('calls', [
    {
      id: 'calls-observe',
      route: '/closer/calls',
      selector: '[data-tutorial="calls-page"]',
      action: 'observe',
      title: 'Your Call History',
      callout: 'This page shows every call the AI has made — duration, status, transcript, coaching notes, and cost breakdown. Use the filters to find specific calls.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'calls-direction-filter',
      route: '/closer/calls',
      selector: '[data-tutorial="calls-direction-filter"]',
      action: 'select',
      title: 'Filter by Direction',
      callout: 'Filter calls by direction: Outbound (AI called them) or Inbound (they called you). Most calls will be outbound from your campaigns.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'calls-status-filter',
      route: '/closer/calls',
      selector: '[data-tutorial="calls-status-filter"]',
      action: 'select',
      title: 'Filter by Status',
      callout: 'Filter by call outcome: Completed, No Answer, Voicemail, Busy, etc. Focus on Completed calls to review what the AI said.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'calls-date-filter',
      route: '/closer/calls',
      selector: '[data-tutorial="calls-date-filter"]',
      action: 'select',
      title: 'Filter by Date',
      callout: 'Narrow down calls by date range — Today, Last 7 Days, or All Time. Great for comparing performance across periods.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'calls-row',
      route: '/closer/calls',
      selector: '[data-tutorial="calls-row"]',
      action: 'click',
      title: 'Open a Call Record',
      callout: 'Click any call row to expand it and see the full transcript, coaching notes from the AI, and a cost breakdown of that specific call.',
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CLOSER AI — Analytics
     ═══════════════════════════════════════════════════════ */
  'analytics': makeSteps('analytics', [
    {
      id: 'analytics-observe',
      route: '/closer/analytics',
      selector: '[data-tutorial="analytics-page"]',
      action: 'observe',
      title: 'Your Performance Dashboard',
      callout: 'Analytics shows your key numbers: appointments booked, connection rate, average call duration, and cost per appointment. Cost/Appointment is your most important metric — lower is better.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'analytics-range',
      route: '/closer/analytics',
      selector: '[data-tutorial="analytics-range"]',
      action: 'click',
      title: 'Change Date Range',
      callout: 'Switch between Today, Last 7 Days, Last 30 Days, and All Time to compare how your campaigns perform across different periods.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'analytics-kpis',
      route: '/closer/analytics',
      selector: '[data-tutorial="analytics-kpis"]',
      action: 'observe',
      title: 'Key Metrics at a Glance',
      callout: 'These 5 numbers tell the whole story. Total Calls, Connected, Appointments, Connection Rate, and Cost/Appointment. Watch these daily to know if your AI agent is performing.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'analytics-cost',
      route: '/closer/analytics',
      selector: '[data-tutorial="analytics-cost"]',
      action: 'observe',
      title: 'Cost Breakdown',
      callout: 'Your total AI cost broken down by component: Deepgram (speech-to-text), ElevenLabs (AI voice), and LLM (AI brain). Normal is $0.10-0.30 per call.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     EPOCGS COLLECTIBLES GRADING (/grading)
     ═══════════════════════════════════════════════════════ */
  'grading': makeSteps('grading', [
    {
      id: 'grading-observe',
      route: '/grading',
      selector: '[data-tutorial="grading-hero"]',
      action: 'observe',
      title: 'AI Collectibles Grading',
      callout: 'EPOCGS uses 25+ AI models to grade collectibles — comics, cards, coins, stamps, and more. Upload a photo and get an instant professional-grade assessment with CGC-scale ratings.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'grading-type-select',
      route: '/grading',
      selector: '[data-tutorial="grading-type-select"]',
      action: 'click',
      title: 'Select Collectible Type',
      callout: 'Choose what you are grading: comic books, trading cards, coins, stamps, vinyl records, or one of 19 other collectible categories.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'grading-upload',
      route: '/grading',
      selector: '[data-tutorial="grading-upload"]',
      action: 'click',
      title: 'Upload Your Item',
      callout: 'Click to upload a photo of your collectible. Take a clear, well-lit photo showing the front cover or face. The AI analyzes condition, centering, edges, corners, and surface quality.',
      tooltipPosition: 'right',
    },
    {
      id: 'grading-grade-scale',
      route: '/grading',
      selector: '[data-tutorial="grading-grade-scale"]',
      action: 'observe',
      title: 'Understanding the Grade Scale',
      callout: 'Grades follow the CGC 10-point scale: 10.0 (Gem Mint), 9.8 (Near Mint/Mint), 9.6 (Near Mint+), down to 0.5 (Poor). Higher grades mean dramatically higher value.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'left',
    },
    {
      id: 'grading-defects',
      route: '/grading',
      selector: '[data-tutorial="grading-defects"]',
      action: 'observe',
      title: 'Defect Analysis',
      callout: 'The AI identifies 27 types of defects: spine stress, color break, foxing, creasing, and more. Each defect is mapped to its impact on the final grade.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     TAX RETURNS (/tax-returns)
     ═══════════════════════════════════════════════════════ */
  'tax-returns': makeSteps('tax-returns', [
    {
      id: 'tax-observe',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-hero"]',
      action: 'observe',
      title: 'AI Tax Return Preparation',
      callout: 'Powered by 14 Tax Intelligence Engines with deep IRS knowledge. Upload your documents, answer a few questions, and the AI prepares your return with optimization recommendations.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'tax-tab-overview',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-tab-overview"]',
      action: 'click',
      title: 'Start with the Overview',
      callout: 'The Overview tab shows what the system can do: 1040 filing, Schedule C/E/D, MACRS depreciation, QBI deduction, oil & gas IDC, and more.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'tax-tab-intake',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-tab-intake"]',
      action: 'click',
      title: 'Begin Your Return',
      callout: 'Click the Intake tab to start. You will enter your filing status, dependents, and basic information. The AI walks you through each section.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'tax-doc-upload',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-doc-upload"]',
      action: 'click',
      title: 'Upload Tax Documents',
      callout: 'Upload your W-2s, 1099s, and other tax documents. The AI reads them automatically using OCR and extracts all relevant data — no manual entry needed.',
      tooltipPosition: 'right',
    },
    {
      id: 'tax-income-categories',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-income-categories"]',
      action: 'observe',
      title: 'Income Categories',
      callout: 'Review your income sources: wages, self-employment, rental, investments, oil & gas royalties, and more. The AI identifies optimization opportunities in each category.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'tax-deductions',
      route: '/tax-returns',
      selector: '[data-tutorial="tax-deductions"]',
      action: 'observe',
      title: 'Deduction Finder',
      callout: 'The AI scans for every possible deduction: home office, vehicle, depreciation, business expenses, charitable giving, and industry-specific deductions like IDC for oil & gas.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     TITLE INTELLIGENCE (/title-intelligence)
     ═══════════════════════════════════════════════════════ */
  'title-intelligence': makeSteps('title-intelligence', [
    {
      id: 'title-observe',
      route: '/title-intelligence',
      selector: '[data-tutorial="title-hero"]',
      action: 'observe',
      title: 'AI Title Intelligence',
      callout: 'Search 259,000+ deed records across 80+ Texas counties. Get instant chain of title, ownership analysis, gap detection, and fractional interest calculations.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'title-county',
      route: '/title-intelligence',
      selector: '[data-tutorial="title-county"]',
      action: 'select',
      title: 'Select a County',
      callout: 'Choose the Texas county to search. Reeves, Ector, Midland, and Loving have the most records. More counties are being added weekly.',
      tooltipPosition: 'right',
    },
    {
      id: 'title-search',
      route: '/title-intelligence',
      selector: '[data-tutorial="title-search"]',
      action: 'type',
      title: 'Enter Search Terms',
      callout: 'Enter a grantor name, grantee name, legal description (Section/Block), or instrument number to find matching deeds.',
      exampleValue: 'Section 270 Block 8',
      tooltipPosition: 'right',
    },
    {
      id: 'title-run-search',
      route: '/title-intelligence',
      selector: '[data-tutorial="title-run-search"]',
      action: 'click',
      title: 'Run the Search',
      callout: 'Click Search to query the database. Results include document type, recording date, parties, and legal descriptions. Click any result for full details.',
      tooltipPosition: 'left',
    },
    {
      id: 'title-chain',
      route: '/title-intelligence',
      selector: '[data-tutorial="title-chain"]',
      action: 'observe',
      title: 'Chain of Title View',
      callout: 'The Chain of Title shows ownership history from the original patent to present. Gaps are highlighted in red — these need investigation before closing.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SECURITY (/security)
     ═══════════════════════════════════════════════════════ */
  'security': makeSteps('security', [
    {
      id: 'security-observe',
      route: '/security',
      selector: '[data-tutorial="security-hero"]',
      action: 'observe',
      title: 'Cyber Defense & Security',
      callout: 'Enterprise-grade security operations: 24/7 threat monitoring, incident response, vulnerability management, and compliance assessment. AI-powered detection with human-grade analysis.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'security-services',
      route: '/security',
      selector: '[data-tutorial="security-services"]',
      action: 'observe',
      title: 'Browse Security Services',
      callout: 'Choose from threat monitoring, incident response, security architecture review, compliance assessment, and vulnerability management. Each service includes detailed scope and deliverables.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'security-pricing',
      route: '/security',
      selector: '[data-tutorial="security-pricing"]',
      action: 'observe',
      title: 'View Pricing',
      callout: 'Security services range from $499/mo for monitoring to $2,999/mo for full SOC operations. All plans include AI-powered detection and expert analysis.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     PENTESTING (/pentesting)
     ═══════════════════════════════════════════════════════ */
  'pentesting': makeSteps('pentesting', [
    {
      id: 'pentest-observe',
      route: '/pentesting',
      selector: '[data-tutorial="pentest-hero"]',
      action: 'observe',
      title: 'Penetration Testing',
      callout: 'Full-scope offensive security testing: network, web application, wireless, mobile, cloud, and Active Directory. 300+ attack tools with professional reporting.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'pentest-scope',
      route: '/pentesting',
      selector: '[data-tutorial="pentest-scope"]',
      action: 'observe',
      title: 'Testing Scope Options',
      callout: 'Select your testing scope: External (public-facing), Internal (inside network), Web App (OWASP Top 10), Wireless, or Full Red Team engagement.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'pentest-pricing',
      route: '/pentesting',
      selector: '[data-tutorial="pentest-pricing"]',
      action: 'observe',
      title: 'Engagement Pricing',
      callout: 'Penetration testing starts at $2,500 for basic assessments up to $7,500 for comprehensive red team engagements. Each includes a detailed findings report with remediation guidance.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SDK GATEWAY (/sdk)
     ═══════════════════════════════════════════════════════ */
  'sdk': makeSteps('sdk', [
    {
      id: 'sdk-observe',
      route: '/sdk',
      selector: '[data-tutorial="sdk-hero"]',
      action: 'observe',
      title: 'Echo SDK Gateway',
      callout: 'One API, 6,500+ intelligence engines. Query domain-specific AI, search infinite memory, and access 12,000+ knowledge documents through a single endpoint.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'sdk-endpoints',
      route: '/sdk',
      selector: '[data-tutorial="sdk-endpoints"]',
      action: 'observe',
      title: 'Browse API Endpoints',
      callout: 'The SDK provides 17 endpoints: engine queries, brain memory, knowledge search, credential vault, and worker proxy. Each endpoint includes request/response examples.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'sdk-code-example',
      route: '/sdk',
      selector: '[data-tutorial="sdk-code-example"]',
      action: 'click',
      title: 'Copy Code Example',
      callout: 'Click to copy a working code example. Paste it into your project to start making API calls immediately. Examples available in JavaScript, Python, and cURL.',
      tooltipPosition: 'left',
    },
    {
      id: 'sdk-pricing',
      route: '/sdk',
      selector: '[data-tutorial="sdk-pricing"]',
      action: 'observe',
      title: 'API Pricing',
      callout: 'Free tier includes 100 queries/day. Starter ($49/mo) gets 5,000 queries. Professional ($149/mo) gets 50,000 queries with priority routing.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     KNOWLEDGE FORGE (/knowledge)
     ═══════════════════════════════════════════════════════ */
  'knowledge': makeSteps('knowledge', [
    {
      id: 'knowledge-observe',
      route: '/knowledge',
      selector: '[data-tutorial="knowledge-hero"]',
      action: 'observe',
      title: 'Knowledge Forge',
      callout: 'Search 12,000+ expert documents across 175+ categories. From IRC tax code to NIST frameworks, legal precedents to engineering standards — all semantically indexed.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'knowledge-search',
      route: '/knowledge',
      selector: '[data-tutorial="knowledge-search"]',
      action: 'type',
      title: 'Search the Knowledge Base',
      callout: 'Type a question or topic to search. The system uses semantic search — it understands meaning, not just keywords. Try "MACRS depreciation rules" or "OWASP injection prevention".',
      exampleValue: 'MACRS depreciation',
      tooltipPosition: 'bottom',
    },
    {
      id: 'knowledge-categories',
      route: '/knowledge',
      selector: '[data-tutorial="knowledge-categories"]',
      action: 'click',
      title: 'Browse by Category',
      callout: 'Click a category to browse all documents in that topic. Categories include Tax Law, Cybersecurity, Oil & Gas, Legal, Engineering, and 170+ more.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'knowledge-document',
      route: '/knowledge',
      selector: '[data-tutorial="knowledge-document"]',
      action: 'click',
      title: 'Open a Document',
      callout: 'Click any search result to read the full document. Each document includes source attribution, relevance score, and related documents.',
      tooltipPosition: 'right',
    },
    {
      id: 'knowledge-stats',
      route: '/knowledge',
      selector: '[data-tutorial="knowledge-stats"]',
      action: 'observe',
      title: 'Knowledge Statistics',
      callout: '75,000+ searchable chunks, 175+ categories, 312,000 graph nodes, and sub-50ms query latency. The knowledge base grows daily as new documents are ingested.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     DATA PIPELINES (/pipelines)
     ═══════════════════════════════════════════════════════ */
  'pipelines': makeSteps('pipelines', [
    {
      id: 'pipelines-observe',
      route: '/pipelines',
      selector: '[data-tutorial="pipelines-hero"]',
      action: 'observe',
      title: 'Autonomous Data Pipelines',
      callout: 'Build automated data extraction systems that find, extract, normalize, and deliver structured data from 50+ source types. Runs 24/7 with zero human intervention.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'pipelines-source',
      route: '/pipelines',
      selector: '[data-tutorial="pipelines-source"]',
      action: 'click',
      title: 'Select Data Source',
      callout: 'Choose where to extract data from: websites, APIs, databases, documents, social media, government records, and more. Each source type has a specialized extraction engine.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'pipelines-config',
      route: '/pipelines',
      selector: '[data-tutorial="pipelines-config"]',
      action: 'observe',
      title: 'Configure Your Pipeline',
      callout: 'Set extraction frequency (real-time, hourly, daily), output format (JSON, CSV, database), and transformation rules. The AI auto-suggests the best configuration for each source.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'right',
    },
    {
      id: 'pipelines-pricing',
      route: '/pipelines',
      selector: '[data-tutorial="pipelines-pricing"]',
      action: 'observe',
      title: 'Pipeline Pricing',
      callout: 'Starter ($199/mo) for 5 pipelines, Professional ($349/mo) for 25 pipelines, Enterprise ($499/mo) for unlimited. All plans include monitoring and auto-restart on failures.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     BOT FACTORY (/bots)
     ═══════════════════════════════════════════════════════ */
  'bots': makeSteps('bots', [
    {
      id: 'bots-observe',
      route: '/bots',
      selector: '[data-tutorial="bots-hero"]',
      action: 'observe',
      title: 'Custom AI Bot Factory',
      callout: '29 bot templates across 5 categories. Social media automation, trading bots, business assistants, monitoring systems, and workflow automation. Each bot runs on Cloudflare Workers with zero downtime.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'bots-category',
      route: '/bots',
      selector: '[data-tutorial="bots-category"]',
      action: 'click',
      title: 'Browse Bot Categories',
      callout: 'Filter by category: Social Media (8 bots), Trading (8 bots), Business (5 bots), Monitoring (4 bots), or Automation (4 bots). Click a category to see templates.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'bots-template',
      route: '/bots',
      selector: '[data-tutorial="bots-template"]',
      action: 'click',
      title: 'Select a Bot Template',
      callout: 'Click any bot template to see its full capabilities, included features, and customization options. Each template is production-ready and battle-tested.',
      tooltipPosition: 'right',
    },
    {
      id: 'bots-pricing',
      route: '/bots',
      selector: '[data-tutorial="bots-pricing"]',
      action: 'observe',
      title: 'Bot Pricing',
      callout: 'Standard bots start at $499 (one-time setup). Premium bots with custom AI personality and multi-platform support are $1,499. Enterprise custom builds available.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SCRAPER FACTORY (/scrapers)
     ═══════════════════════════════════════════════════════ */
  'scrapers': makeSteps('scrapers', [
    {
      id: 'scrapers-observe',
      route: '/scrapers',
      selector: '[data-tutorial="scrapers-hero"]',
      action: 'observe',
      title: 'Custom Data Scrapers',
      callout: '23 scraper templates across 4 categories. Web scraping, government records, social media extraction, and data harvesting. Each runs autonomously on schedule.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'scrapers-category',
      route: '/scrapers',
      selector: '[data-tutorial="scrapers-category"]',
      action: 'click',
      title: 'Browse Scraper Categories',
      callout: 'Filter by category: Web (6 scrapers), Government/Legal (6), Social/Market (5), or Harvesters (6). Each category targets different data sources.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'scrapers-template',
      route: '/scrapers',
      selector: '[data-tutorial="scrapers-template"]',
      action: 'click',
      title: 'Select a Scraper Template',
      callout: 'Click a template to see what data it extracts, output formats, and scheduling options. All scrapers include rate limiting and proxy rotation for reliability.',
      tooltipPosition: 'right',
    },
    {
      id: 'scrapers-pricing',
      route: '/scrapers',
      selector: '[data-tutorial="scrapers-pricing"]',
      action: 'observe',
      title: 'Scraper Pricing',
      callout: 'Standard scrapers from $399 (one-time). Premium with custom parsing, multiple sources, and API delivery at $1,299. Enterprise custom builds available.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     IMMORTALITY VAULT (/immortality-vault)
     ═══════════════════════════════════════════════════════ */
  'immortality-vault': makeSteps('immortality-vault', [
    {
      id: 'vault-iv-observe',
      route: '/immortality-vault',
      selector: '[data-tutorial="iv-hero"]',
      action: 'observe',
      title: 'Immortality Vault',
      callout: 'Preserve your voice, personality, and life stories in AI. Through guided interviews and voice cloning, create a digital version of yourself that your family can talk to forever.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'vault-iv-interview',
      route: '/immortality-vault',
      selector: '[data-tutorial="iv-interview"]',
      action: 'click',
      title: 'Start an Interview',
      callout: 'Click to begin a guided interview session. The AI asks questions about your life — childhood, career, family, values, and favorite memories. Each session captures more of who you are.',
      tooltipPosition: 'right',
    },
    {
      id: 'vault-iv-voice',
      route: '/immortality-vault',
      selector: '[data-tutorial="iv-voice"]',
      action: 'click',
      title: 'Record Your Voice',
      callout: 'Record voice samples so the AI can clone your voice with 19 emotional variations — laughing, whispering, excited, thoughtful. Your digital self will sound exactly like you.',
      tooltipPosition: 'right',
    },
    {
      id: 'vault-iv-memories',
      route: '/immortality-vault',
      selector: '[data-tutorial="iv-memories"]',
      action: 'observe',
      title: 'Browse Memories',
      callout: 'Review all captured memories organized by life chapter. Each memory includes audio, transcript, and AI-generated context. The more you share, the more complete your digital preservation becomes.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     DARK WEB INTELLIGENCE (/dark-web-intel)
     ═══════════════════════════════════════════════════════ */
  'dark-web-intel': makeSteps('dark-web-intel', [
    {
      id: 'darkweb-observe',
      route: '/dark-web-intel',
      selector: '[data-tutorial="darkweb-hero"]',
      action: 'observe',
      title: 'Dark Web Intelligence',
      callout: '24/7 monitoring of dark web marketplaces, forums, and paste sites. AI-powered threat scoring identifies risks to your organization before they become incidents.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'darkweb-features',
      route: '/dark-web-intel',
      selector: '[data-tutorial="darkweb-features"]',
      action: 'observe',
      title: 'Intelligence Capabilities',
      callout: '8 capabilities: Dark Web Monitoring, Breach Intelligence, Paste Surveillance, IOC Extraction, Brand Protection, AI Threat Scoring, Crypto Forensics, and Real-Time Alerting.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'darkweb-sources',
      route: '/dark-web-intel',
      selector: '[data-tutorial="darkweb-sources"]',
      action: 'observe',
      title: 'Intelligence Sources',
      callout: 'We monitor 6 source categories: dark web markets, forums, paste sites, Telegram channels, breach databases, and cryptocurrency transactions.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'darkweb-engine',
      route: '/dark-web-intel',
      selector: '[data-tutorial="darkweb-engine"]',
      action: 'click',
      title: 'Query the Intelligence Engine',
      callout: 'Use the engine query panel to ask specific questions about threats, breaches, or indicators of compromise. The AI provides analysis backed by real dark web intelligence.',
      tooltipPosition: 'left',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CRYPTO TRADING (/crypto-trading)
     ═══════════════════════════════════════════════════════ */
  'crypto-trading': makeSteps('crypto-trading', [
    {
      id: 'crypto-observe',
      route: '/crypto-trading',
      selector: '[data-tutorial="crypto-hero"]',
      action: 'observe',
      title: 'AI Crypto Trading',
      callout: 'Automated cryptocurrency trading with Grid and Momentum strategies. AI analyzes markets 24/7, executes trades, manages risk, and tracks your portfolio — all autonomously.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'crypto-features',
      route: '/crypto-trading',
      selector: '[data-tutorial="crypto-features"]',
      action: 'observe',
      title: 'Trading Features',
      callout: '8 features: Grid Trading, Momentum Strategy, Portfolio Management, Real-Time Data, Risk Management, Backtesting, Smart Alerts, and Performance Analytics.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'crypto-engine',
      route: '/crypto-trading',
      selector: '[data-tutorial="crypto-engine"]',
      action: 'click',
      title: 'Ask the Trading AI',
      callout: 'Use the engine query panel to ask about market conditions, trading strategies, or specific cryptocurrencies. The AI provides analysis with risk assessments.',
      tooltipPosition: 'left',
    },
    {
      id: 'crypto-pricing',
      route: '/crypto-trading',
      selector: '[data-tutorial="crypto-pricing"]',
      action: 'observe',
      title: 'Trading Plans',
      callout: 'Starter ($99/mo) for basic grid trading, Professional for advanced strategies with backtesting, Enterprise for custom strategies and dedicated support.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     PRICE ALERTS (/price-alerts)
     ═══════════════════════════════════════════════════════ */
  'price-alerts': makeSteps('price-alerts', [
    {
      id: 'alerts-observe',
      route: '/price-alerts',
      selector: '[data-tutorial="alerts-hero"]',
      action: 'observe',
      title: 'Smart Price Alerts',
      callout: 'Monitor cryptocurrency prices in real-time with AI-powered trend analysis. Get instant alerts via Telegram when prices hit your targets or when the AI detects significant patterns.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'alerts-features',
      route: '/price-alerts',
      selector: '[data-tutorial="alerts-features"]',
      action: 'observe',
      title: 'Alert Features',
      callout: '6 features: Price Monitoring, Smart Alerts, AI Trend Analysis, Telegram Integration, Portfolio Tracking, and Historical Data. Set up in minutes, monitors 24/7.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'alerts-pricing',
      route: '/price-alerts',
      selector: '[data-tutorial="alerts-pricing"]',
      action: 'observe',
      title: 'Alert Plans',
      callout: 'Free tier monitors 3 assets with daily alerts. Pro ($19.99/mo) gets unlimited assets, real-time alerts, and AI trend predictions. Enterprise adds custom indicators.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     REDDIT MONITOR (/reddit)
     ═══════════════════════════════════════════════════════ */
  'reddit-monitor': makeSteps('reddit-monitor', [
    {
      id: 'reddit-observe',
      route: '/reddit',
      selector: '[data-tutorial="reddit-hero"]',
      action: 'observe',
      title: 'Reddit Intelligence Monitor',
      callout: 'AI-powered Reddit monitoring for brand mentions, sentiment analysis, trend detection, and market signals. Track subreddits, keywords, and influencers automatically.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'reddit-features',
      route: '/reddit',
      selector: '[data-tutorial="reddit-features"]',
      action: 'observe',
      title: 'Monitoring Features',
      callout: '8 features: Subreddit Monitoring, Sentiment Analysis, Trend Detection, Brand Monitoring, Crypto/Stock Signals, Keyword Alerts, Influencer Tracking, and Data Export.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'reddit-pricing',
      route: '/reddit',
      selector: '[data-tutorial="reddit-pricing"]',
      action: 'observe',
      title: 'Monitoring Plans',
      callout: 'Starter ($99/mo) monitors 5 subreddits with daily reports. Professional ($299/mo) gets 25 subreddits with real-time alerts. Enterprise includes custom integrations.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     VOICE STUDIO (/voice)
     ═══════════════════════════════════════════════════════ */
  'voice': makeSteps('voice', [
    {
      id: 'voice-observe',
      route: '/voice',
      selector: '[data-tutorial="voice-hero"]',
      action: 'observe',
      title: 'Echo Voice Studio',
      callout: 'Full-featured voice studio: text-to-speech, voice cloning, audio isolation, speech-to-speech, transcription, and more. 12 sections covering every voice AI capability.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'voice-section-tabs',
      route: '/voice',
      selector: '[data-tutorial="voice-section-tabs"]',
      action: 'click',
      title: 'Browse Voice Sections',
      callout: 'Click a section tab: TTS, Projects, Cloning, Library, Sound Effects, Voice Design, Audio Isolation, Speech-to-Speech, Transcribe, Dialogue, Dubbing, or API.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'voice-text-input',
      route: '/voice',
      selector: '[data-tutorial="voice-text-input"]',
      action: 'type',
      title: 'Enter Text to Speak',
      callout: 'Type or paste any text you want converted to speech. The AI generates natural-sounding audio with emotion, pacing, and pronunciation controls.',
      exampleValue: 'Hello, welcome to Echo Prime Technologies.',
      tooltipPosition: 'right',
    },
    {
      id: 'voice-select',
      route: '/voice',
      selector: '[data-tutorial="voice-select"]',
      action: 'click',
      title: 'Choose a Voice',
      callout: 'Select from 6 built-in voices (Echo, Bree, Prometheus, Phoenix, GS343, Commander) or use a cloned voice. Each voice has unique personality and emotion range.',
      tooltipPosition: 'right',
    },
    {
      id: 'voice-sliders',
      route: '/voice',
      selector: '[data-tutorial="voice-sliders"]',
      action: 'observe',
      title: 'Adjust Voice Parameters',
      callout: 'Fine-tune with sliders: Stability (consistency), Similarity (voice match), Style (expressiveness), and Speed. Higher stability = more consistent, higher style = more emotional.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'left',
    },
    {
      id: 'voice-generate',
      route: '/voice',
      selector: '[data-tutorial="voice-generate"]',
      action: 'click',
      title: 'Generate Speech',
      callout: 'Click Generate to create the audio. It typically takes 1-3 seconds. You can then play, download, or save the audio to your library.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     ECHOCAD (/echocad)
     ═══════════════════════════════════════════════════════ */
  'echocad': makeSteps('echocad', [
    {
      id: 'echocad-observe',
      route: '/echocad',
      selector: '[data-tutorial="echocad-hero"]',
      action: 'observe',
      title: 'EchoCAD Engineering Platform',
      callout: 'AI-powered parametric CAD with engineering calculators, material database, and manufacturing analysis. 6 tabs covering everything from design to production.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'echocad-tabs',
      route: '/echocad',
      selector: '[data-tutorial="echocad-tabs"]',
      action: 'click',
      title: 'Explore the Tabs',
      callout: 'Navigate between Dashboard, Materials, Design Studio, Engineering, Manufacturing, and AI Copilot. Each tab provides specialized tools for that stage of the design process.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'echocad-materials',
      route: '/echocad',
      selector: '[data-tutorial="echocad-materials"]',
      action: 'click',
      title: 'Browse Materials',
      callout: 'Search materials by category: steel, aluminum, titanium, copper, nickel, polymer, specialty, precious, and oilfield grades. Each material includes full mechanical properties.',
      tooltipPosition: 'right',
    },
    {
      id: 'echocad-calculator',
      route: '/echocad',
      selector: '[data-tutorial="echocad-calculator"]',
      action: 'click',
      title: 'Engineering Calculators',
      callout: '12 calculators: stress, pressure vessel, fatigue life, beam deflection, thread analysis, weld strength, bolt preload, tolerance stack, DFM score, thermal, weight estimation, and NACE compliance.',
      tooltipPosition: 'right',
    },
    {
      id: 'echocad-primitives',
      route: '/echocad',
      selector: '[data-tutorial="echocad-primitives"]',
      action: 'click',
      title: 'Create 3D Primitives',
      callout: 'Build parts from 15 parametric primitives: cylinder, box, sphere, ring, cone, pipe, hex, flange, I-beam, and more. Set exact dimensions and the AI generates the geometry.',
      tooltipPosition: 'left',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     DAEDALUS FORGE (/daedalus-forge)
     ═══════════════════════════════════════════════════════ */
  'daedalus-forge': makeSteps('daedalus-forge', [
    {
      id: 'daedalus-observe',
      route: '/daedalus-forge',
      selector: '[data-tutorial="daedalus-hero"]',
      action: 'observe',
      title: 'Daedalus Manufacturing Forge',
      callout: 'AI-powered manufacturing intelligence: CNC programming, stress analysis, DFM scoring, cost estimation, and production planning across 8 industry verticals.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'daedalus-domains',
      route: '/daedalus-forge',
      selector: '[data-tutorial="daedalus-domains"]',
      action: 'observe',
      title: 'Engineering Domains',
      callout: '8 specialized domains: Oilfield, Aerospace, Automotive, Marine, Military, Nuclear, Medical, and General Manufacturing. Each domain has industry-specific standards and tolerances.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'daedalus-chat',
      route: '/daedalus-forge',
      selector: '[data-tutorial="daedalus-chat"]',
      action: 'type',
      title: 'Describe Your Part',
      callout: 'Type a description of what you need manufactured. Include material, dimensions, tolerances, and quantity. The AI generates CNC code, cost estimates, and DFM recommendations.',
      exampleValue: 'API 5CT L80 casing coupling, 7 inch OD',
      tooltipPosition: 'right',
    },
    {
      id: 'daedalus-forge-btn',
      route: '/daedalus-forge',
      selector: '[data-tutorial="daedalus-forge-btn"]',
      action: 'click',
      title: 'Start the Forge',
      callout: 'Click to initiate the full 50-stage manufacturing analysis pipeline. The forge generates complete fabrication documentation including G-code, setup sheets, and QC checklists.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     HEPHAESTION FORGE (/hephaestion-forge)
     ═══════════════════════════════════════════════════════ */
  'hephaestion-forge': makeSteps('hephaestion-forge', [
    {
      id: 'heph-observe',
      route: '/hephaestion-forge',
      selector: '[data-tutorial="heph-hero"]',
      action: 'observe',
      title: 'Hephaestion Code Forge',
      callout: 'AI code factory that builds complete applications from a description. 13-stage pipeline, 6 forge modes, 15 project archetypes. Ships production-ready code with tests and docs.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'heph-mode',
      route: '/hephaestion-forge',
      selector: '[data-tutorial="heph-mode"]',
      action: 'click',
      title: 'Select Forge Mode',
      callout: '6 modes: Standard (balanced), Apex (max quality), Lightspeed (fastest), Fortress (security-first), Architect (planning-heavy), Fleet (parallel builds). Choose based on your priority.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'heph-chat',
      route: '/hephaestion-forge',
      selector: '[data-tutorial="heph-chat"]',
      action: 'type',
      title: 'Describe Your Project',
      callout: 'Tell the forge what you want built. Be specific about features, tech stack, and requirements. Example: "Build a Discord bot with slash commands, SQLite storage, and 14 AI personalities."',
      exampleValue: 'Build a REST API with user auth and CRUD',
      tooltipPosition: 'right',
    },
    {
      id: 'heph-stages',
      route: '/hephaestion-forge',
      selector: '[data-tutorial="heph-stages"]',
      action: 'observe',
      title: 'Watch the 13 Stages',
      callout: 'Track progress through all 13 stages: Requirements → Architecture → Scaffold → Core → API → UI → Data → Testing → Docs → Deploy → Security → Quality → Final. Each stage produces real artifacts.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'left',
    },
    {
      id: 'heph-guilds',
      route: '/hephaestion-forge',
      selector: '[data-tutorial="heph-guilds"]',
      action: 'observe',
      title: 'Guild Activity',
      callout: '6 specialized guilds work on your project: Architect, Backend, Frontend, Quality, Infrastructure, and Documentation. Watch which guilds are active at each stage.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'right',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     OFFICE AI (/office-ai)
     ═══════════════════════════════════════════════════════ */
  'office-ai': makeSteps('office-ai', [
    {
      id: 'office-observe',
      route: '/office-ai',
      selector: '[data-tutorial="office-hero"]',
      action: 'observe',
      title: 'AI Office Management',
      callout: 'Complete office management platform: smart invoicing, booking, CRM, route optimization, fleet management, expense tracking, AI chat, and analytics. Run your entire office with AI.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'office-features',
      route: '/office-ai',
      selector: '[data-tutorial="office-features"]',
      action: 'observe',
      title: 'Browse Features',
      callout: '8 core features: Smart Invoicing (auto-generate), Booking (online scheduling), Customer CRM (lead tracking), Route Optimization (fleet), Fleet Management, Expense Tracking, AI Chat, and Analytics.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'office-how-it-works',
      route: '/office-ai',
      selector: '[data-tutorial="office-how-it-works"]',
      action: 'observe',
      title: 'How It Works',
      callout: 'Follow the setup flow: Connect your business data, configure AI preferences, and the system handles scheduling, invoicing, customer communication, and reporting automatically.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'office-pricing',
      route: '/office-ai',
      selector: '[data-tutorial="office-pricing"]',
      action: 'observe',
      title: 'Office AI Pricing',
      callout: 'Choose the plan that fits your business size. Each tier includes more team members, integrations, and AI capabilities.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     BREE AI ASSISTANT (/bree-assistant)
     ═══════════════════════════════════════════════════════ */
  'bree-assistant': makeSteps('bree-assistant', [
    {
      id: 'bree-observe',
      route: '/bree-assistant',
      selector: '[data-tutorial="bree-hero"]',
      action: 'observe',
      title: 'Bree AI Office Assistant',
      callout: 'Bree is your AI receptionist and office assistant. She handles phone calls, schedules appointments, answers customer questions, and manages your front desk — 24/7 with a warm, natural voice.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'bree-demo',
      route: '/bree-assistant',
      selector: '[data-tutorial="bree-demo"]',
      action: 'click',
      title: 'Try a Demo Conversation',
      callout: 'Click a demo scenario to see how Bree handles real conversations: customer service calls, appointment scheduling, FAQ handling, and more. Watch the typewriter effect showing her responses.',
      tooltipPosition: 'right',
    },
    {
      id: 'bree-voice-widget',
      route: '/bree-assistant',
      selector: '[data-tutorial="bree-voice-widget"]',
      action: 'click',
      title: 'Talk to Bree',
      callout: 'Click the voice widget to have a live voice conversation with Bree. She uses ElevenLabs voice synthesis for natural, warm responses with under 2-second latency.',
      tooltipPosition: 'left',
    },
    {
      id: 'bree-capabilities',
      route: '/bree-assistant',
      selector: '[data-tutorial="bree-capabilities"]',
      action: 'observe',
      title: 'Bree\'s Capabilities',
      callout: 'Bree handles: inbound calls, appointment scheduling, FAQ responses, lead qualification, message taking, call transfers, after-hours support, and multi-language communication.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'bree-roi',
      route: '/bree-assistant',
      selector: '[data-tutorial="bree-roi"]',
      action: 'observe',
      title: 'ROI Calculator',
      callout: 'See how much Bree saves your business. A human receptionist costs $35,000+/year. Bree costs a fraction and works 24/7 without breaks, vacations, or sick days.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     X/TWITTER BOT (/x-bot)
     ═══════════════════════════════════════════════════════ */
  'x-bot': makeSteps('x-bot', [
    {
      id: 'xbot-observe',
      route: '/x-bot',
      selector: '[data-tutorial="xbot-hero"]',
      action: 'observe',
      title: 'Autonomous X/Twitter Bot',
      callout: 'AI-powered Twitter automation: autonomous posting, engagement tracking, Grok AI images, 14 AI personalities, and analytics. Grows your X presence while you focus on business.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'xbot-features',
      route: '/x-bot',
      selector: '[data-tutorial="xbot-features"]',
      action: 'observe',
      title: 'Bot Features',
      callout: '8 features: AI Content Generation, Grok Image Generation, Smart Scheduling, Thread Generation, Engagement Automation, Analytics Dashboard, Multi-Account Support, and Content Calendar.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'xbot-process',
      route: '/x-bot',
      selector: '[data-tutorial="xbot-process"]',
      action: 'observe',
      title: 'How It Works',
      callout: 'Follow the 6-step onboarding: Connect your X account, set content preferences, define posting schedule, review AI-generated content, approve and launch, then track analytics.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'xbot-pricing',
      route: '/x-bot',
      selector: '[data-tutorial="xbot-pricing"]',
      action: 'observe',
      title: 'Bot Plans',
      callout: 'Compare pricing tiers: Starter for basic automation, Professional for full AI content with images, Enterprise for multi-account and custom AI personality.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     LINKEDIN BOT (/linkedin)
     ═══════════════════════════════════════════════════════ */
  'linkedin-bot': makeSteps('linkedin-bot', [
    {
      id: 'linkedin-observe',
      route: '/linkedin',
      selector: '[data-tutorial="linkedin-hero"]',
      action: 'observe',
      title: 'LinkedIn AI Automation',
      callout: 'AI-powered LinkedIn presence: thought leadership content, professional networking, lead generation, and engagement automation. Build your professional brand on autopilot.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'linkedin-features',
      route: '/linkedin',
      selector: '[data-tutorial="linkedin-features"]',
      action: 'observe',
      title: 'Automation Features',
      callout: '8 features: AI Content Creation, Smart Scheduling, Connection Automation, Lead Generation, Analytics, Approval Workflow, Company Page Management, and CRM Integration.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'linkedin-engine',
      route: '/linkedin',
      selector: '[data-tutorial="linkedin-engine"]',
      action: 'click',
      title: 'Query the LinkedIn Engine',
      callout: 'Use the engine panel to ask about LinkedIn strategies, content optimization, or lead generation tactics. The AI provides actionable advice backed by professional network data.',
      tooltipPosition: 'left',
    },
    {
      id: 'linkedin-pricing',
      route: '/linkedin',
      selector: '[data-tutorial="linkedin-pricing"]',
      action: 'observe',
      title: 'LinkedIn Bot Plans',
      callout: 'Compare tiers: basic content automation, full lead generation with CRM integration, or enterprise multi-account management with custom content strategies.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     PAYMENTS (/payments)
     ═══════════════════════════════════════════════════════ */
  'payments': makeSteps('payments', [
    {
      id: 'payments-observe',
      route: '/payments',
      selector: '[data-tutorial="payments-hero"]',
      action: 'observe',
      title: 'Payment Link Generator',
      callout: 'Generate PayPal payment links instantly. Enter an amount and description, and get a shareable link with QR code. Perfect for invoicing, donations, or quick payments.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'payments-amount',
      route: '/payments',
      selector: '[data-tutorial="payments-amount"]',
      action: 'type',
      title: 'Enter Payment Amount',
      callout: 'Type the amount you want to charge in USD. This will be the exact amount shown on the PayPal checkout page.',
      exampleValue: '149.99',
      tooltipPosition: 'right',
    },
    {
      id: 'payments-description',
      route: '/payments',
      selector: '[data-tutorial="payments-description"]',
      action: 'type',
      title: 'Add a Description',
      callout: 'Describe what the payment is for. This appears on the PayPal receipt and helps you track what was purchased.',
      exampleValue: 'Echo Prime Starter Plan - Monthly',
      tooltipPosition: 'right',
    },
    {
      id: 'payments-generate',
      route: '/payments',
      selector: '[data-tutorial="payments-generate"]',
      action: 'click',
      title: 'Generate Payment Link',
      callout: 'Click to generate your PayPal payment link and QR code. The link is live immediately — share it via email, text, or social media.',
      tooltipPosition: 'top',
    },
    {
      id: 'payments-copy',
      route: '/payments',
      selector: '[data-tutorial="payments-copy"]',
      action: 'click',
      title: 'Copy or Open Link',
      callout: 'Copy the link to your clipboard to share it, or click "Open in PayPal" to verify the checkout page. The QR code can be scanned with any phone camera.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SECURITY SCANNER (/scanner)
     ═══════════════════════════════════════════════════════ */
  'scanner': makeSteps('scanner', [
    {
      id: 'scanner-observe',
      route: '/scanner',
      selector: '[data-tutorial="scanner-hero"]',
      action: 'observe',
      title: 'Security Scanner',
      callout: 'Comprehensive security scanning: DNS, SSL/TLS, HTTP headers, DMARC, SPF, DKIM, certificates, and more. Enter any URL and get an instant security assessment.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'scanner-url',
      route: '/scanner',
      selector: '[data-tutorial="scanner-url"]',
      action: 'type',
      title: 'Enter URL to Scan',
      callout: 'Type the URL you want to scan. The scanner checks 12 security categories and returns a comprehensive report with severity ratings and remediation steps.',
      exampleValue: 'https://example.com',
      tooltipPosition: 'right',
    },
    {
      id: 'scanner-start',
      route: '/scanner',
      selector: '[data-tutorial="scanner-start"]',
      action: 'click',
      title: 'Start the Scan',
      callout: 'Click to begin the security scan. It typically takes 10-30 seconds depending on the target. Results appear in real-time as each analyzer completes.',
      tooltipPosition: 'left',
    },
    {
      id: 'scanner-results',
      route: '/scanner',
      selector: '[data-tutorial="scanner-results"]',
      action: 'observe',
      title: 'Review Results',
      callout: '12 analyzers check: DNS records, HTTP headers, SSL/TLS configuration, DMARC/SPF/DKIM email security, certificate validity, cipher suites, protocol versions, and best practices compliance.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'scanner-pricing',
      route: '/scanner',
      selector: '[data-tutorial="scanner-pricing"]',
      action: 'observe',
      title: 'Scanner Plans',
      callout: 'Free tier gets 3 scans/day. Pro plans include scheduled monitoring, historical tracking, API access, and automated remediation recommendations.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     E-COMMERCE (/ecommerce)
     ═══════════════════════════════════════════════════════ */
  'ecommerce': makeSteps('ecommerce', [
    {
      id: 'ecommerce-observe',
      route: '/ecommerce',
      selector: '[data-tutorial="ecommerce-hero"]',
      action: 'observe',
      title: 'Echo Services Marketplace',
      callout: 'Browse and purchase all Echo Prime services in one place. Filter by category, compare pricing tiers, and subscribe to the services your business needs.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'ecommerce-filter',
      route: '/ecommerce',
      selector: '[data-tutorial="ecommerce-filter"]',
      action: 'click',
      title: 'Filter by Category',
      callout: 'Click a category to filter: AI, Bots, Security, Integrations, and more. Each category shows available services with pricing and feature comparison.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'ecommerce-service',
      route: '/ecommerce',
      selector: '[data-tutorial="ecommerce-service"]',
      action: 'click',
      title: 'Select a Service',
      callout: 'Click any service card to see full details: features, pricing tiers, and what\'s included. Health status indicators show real-time service availability.',
      tooltipPosition: 'right',
    },
    {
      id: 'ecommerce-tier',
      route: '/ecommerce',
      selector: '[data-tutorial="ecommerce-tier"]',
      action: 'click',
      title: 'Choose a Pricing Tier',
      callout: 'Select the tier that fits your needs. Each tier includes different feature levels, usage limits, and support options. Click "Select Plan" to proceed to checkout.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     WEBSITE BUILDER (/websites)
     ═══════════════════════════════════════════════════════ */
  'websites': makeSteps('websites', [
    {
      id: 'websites-observe',
      route: '/websites',
      selector: '[data-tutorial="websites-hero"]',
      action: 'observe',
      title: 'AI Website Builder',
      callout: 'Choose from 20+ professionally designed templates across 10 categories. Describe your vision, customize the design, and publish. AI handles the code — you focus on content.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'websites-category',
      route: '/websites',
      selector: '[data-tutorial="websites-category"]',
      action: 'click',
      title: 'Browse Template Categories',
      callout: 'Filter by category: Business, Creative, Commerce, Local, Content, Industry, App, Cause, Marketing, and more. Each category has templates optimized for that use case.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'websites-template',
      route: '/websites',
      selector: '[data-tutorial="websites-template"]',
      action: 'click',
      title: 'Preview a Template',
      callout: 'Click any template card to see a preview. Each template includes responsive design, SEO optimization, and customizable sections. Choose the closest match to your vision.',
      tooltipPosition: 'right',
    },
    {
      id: 'websites-process',
      route: '/websites',
      selector: '[data-tutorial="websites-process"]',
      action: 'observe',
      title: 'Build Process',
      callout: '4 steps: Describe/Pick your template, Customize the design and content, Preview the live site, then Publish to your domain. The AI generates all the code automatically.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'websites-pricing',
      route: '/websites',
      selector: '[data-tutorial="websites-pricing"]',
      action: 'observe',
      title: 'Website Plans',
      callout: 'Compare our pricing against Wix, Squarespace, and Webflow. Echo websites include AI customization, SEO optimization, and hosting — often at lower cost than competitors.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     AI ORCHESTRATION (/orchestration)
     ═══════════════════════════════════════════════════════ */
  'orchestration': makeSteps('orchestration', [
    {
      id: 'orch-observe',
      route: '/orchestration',
      selector: '[data-tutorial="orch-hero"]',
      action: 'observe',
      title: 'Multi-Model AI Orchestration',
      callout: 'Route AI requests across 30+ models intelligently. Auto-failover, cost optimization, and smart routing ensure you always get the best response at the lowest cost.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'orch-features',
      route: '/orchestration',
      selector: '[data-tutorial="orch-features"]',
      action: 'observe',
      title: 'Orchestration Features',
      callout: '6 features: 30+ AI Models, Smart Routing, Auto-Failover, Cost Optimization, Usage Analytics, and Enterprise Security. One API endpoint handles everything.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'orch-code',
      route: '/orchestration',
      selector: '[data-tutorial="orch-code"]',
      action: 'click',
      title: 'Copy Integration Code',
      callout: 'Click to copy the integration code. Drop it into any project to start using multi-model AI. The orchestrator handles model selection, failover, and cost optimization automatically.',
      tooltipPosition: 'left',
    },
    {
      id: 'orch-pricing',
      route: '/orchestration',
      selector: '[data-tutorial="orch-pricing"]',
      action: 'observe',
      title: 'Orchestration Plans',
      callout: 'Starter for basic routing, Professional for smart model selection and analytics, Enterprise for dedicated models and SLA guarantees.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     COUNTY RECORDS (/county-records)
     ═══════════════════════════════════════════════════════ */
  'county-records': makeSteps('county-records', [
    {
      id: 'county-observe',
      route: '/county-records',
      selector: '[data-tutorial="county-hero"]',
      action: 'observe',
      title: 'County Records Search',
      callout: 'Search genealogy and land deed records across Texas counties. Unified search with tab navigation for genealogy records, deed documents, and data sources.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'county-tabs',
      route: '/county-records',
      selector: '[data-tutorial="county-tabs"]',
      action: 'click',
      title: 'Select Search Type',
      callout: 'Choose your search: Unified (both), Genealogy (family records), Deeds (land records), or Sources (data origin). Each tab has specialized search fields.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'county-search-fields',
      route: '/county-records',
      selector: '[data-tutorial="county-search-fields"]',
      action: 'type',
      title: 'Enter Search Criteria',
      callout: 'Fill in search fields: surname, county, record type, grantor/grantee name, date range. The more fields you fill, the more precise your results.',
      exampleValue: 'McWilliams',
      tooltipPosition: 'right',
    },
    {
      id: 'county-search-btn',
      route: '/county-records',
      selector: '[data-tutorial="county-search-btn"]',
      action: 'click',
      title: 'Run Search',
      callout: 'Click Search to query the records database. Results show matching documents with recording dates, parties, and legal descriptions. Click any result for full details.',
      tooltipPosition: 'left',
    },
    {
      id: 'county-filters',
      route: '/county-records',
      selector: '[data-tutorial="county-filters"]',
      action: 'click',
      title: 'Apply Record Filters',
      callout: 'Use filter chips to narrow results by record type: Deeds, Mortgages, Releases, Probate, Liens, Surveys, Leases, Easements, or Assignments.',
      tooltipPosition: 'bottom',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     CREDENTIAL VAULT (/vault)
     ═══════════════════════════════════════════════════════ */
  'vault': makeSteps('vault', [
    {
      id: 'vault-observe',
      route: '/vault',
      selector: '[data-tutorial="vault-hero"]',
      action: 'observe',
      title: 'Secure Credential Vault',
      callout: 'Enterprise-grade credential management with AES-256 encryption, master password protection, and cloud backup. Store API keys, passwords, tokens, and secrets securely.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'vault-unlock',
      route: '/vault',
      selector: '[data-tutorial="vault-unlock"]',
      action: 'type',
      title: 'Enter Master Password',
      callout: 'Type your master password to unlock the vault. This is the only password you need to remember — it encrypts everything else. The vault auto-locks after 15 minutes of inactivity.',
      tooltipPosition: 'right',
    },
    {
      id: 'vault-tabs',
      route: '/vault',
      selector: '[data-tutorial="vault-tabs"]',
      action: 'click',
      title: 'Navigate Vault Sections',
      callout: '5 tabs: Credentials (passwords), Keychain (API keys/tokens), Backups (cloud sync), Stats (vault health), and Audit (access history). Each section manages different credential types.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'vault-credentials',
      route: '/vault',
      selector: '[data-tutorial="vault-credentials"]',
      action: 'observe',
      title: 'Manage Credentials',
      callout: 'View, search, add, edit, and delete stored credentials. Each entry shows service name, username, strength score, and last used date. Click any entry to view or copy the password.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'vault-audit',
      route: '/vault',
      selector: '[data-tutorial="vault-audit"]',
      action: 'observe',
      title: 'Audit Trail',
      callout: 'Every vault access is logged: who accessed what, when, and from where. The audit trail is append-only and tamper-proof — critical for security compliance.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SECURITY SANDBOX (/sandbox)
     ═══════════════════════════════════════════════════════ */
  'sandbox': makeSteps('sandbox', [
    {
      id: 'sandbox-observe',
      route: '/sandbox',
      selector: '[data-tutorial="sandbox-hero"]',
      action: 'observe',
      title: 'Security Sandbox',
      callout: 'Learn offensive and defensive security through hands-on challenges. Build HTTP requests, exploit vulnerabilities, submit flags, and run defense scans — all in a safe environment.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'sandbox-tabs',
      route: '/sandbox',
      selector: '[data-tutorial="sandbox-tabs"]',
      action: 'click',
      title: 'Choose Your Mode',
      callout: '3 tabs: Challenges (offense — exploit vulnerabilities), Defense (scan and protect), and Logs (request history). Start with Challenges to learn attack techniques.',
      tooltipPosition: 'bottom',
    },
    {
      id: 'sandbox-challenge',
      route: '/sandbox',
      selector: '[data-tutorial="sandbox-challenge"]',
      action: 'click',
      title: 'Select a Challenge',
      callout: 'Choose from 9 categories: Injection, XSS, Auth, SSRF, Access Control, Path Traversal, Crypto, File Upload, and API Security. Each challenge has difficulty rating and point value.',
      tooltipPosition: 'right',
    },
    {
      id: 'sandbox-request-builder',
      route: '/sandbox',
      selector: '[data-tutorial="sandbox-request-builder"]',
      action: 'observe',
      title: 'HTTP Request Builder',
      callout: 'Build custom HTTP requests: choose method (GET/POST/PUT/DELETE), set URL, add headers, and write request body. Send the request and analyze the response to find flags.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'left',
    },
    {
      id: 'sandbox-flag',
      route: '/sandbox',
      selector: '[data-tutorial="sandbox-flag"]',
      action: 'type',
      title: 'Submit Your Flag',
      callout: 'When you find the flag hidden in the challenge, paste it here and click Submit. Correct flags earn points and unlock harder challenges. Hints available if you get stuck.',
      exampleValue: 'FLAG{example_flag}',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     SERVICES (/services)
     ═══════════════════════════════════════════════════════ */
  'services': makeSteps('services', [
    {
      id: 'services-observe',
      route: '/services',
      selector: '[data-tutorial="services-hero"]',
      action: 'observe',
      title: 'Service Selection',
      callout: 'Browse and select the Echo Prime services you want. Toggle services on/off, review what\'s included, and proceed to checkout. Your selections are saved automatically.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'services-toggle',
      route: '/services',
      selector: '[data-tutorial="services-toggle"]',
      action: 'click',
      title: 'Toggle a Service',
      callout: 'Click a service card to toggle it on or off. Selected services show a checkmark. You can combine multiple services for a bundled solution.',
      tooltipPosition: 'right',
    },
    {
      id: 'services-save',
      route: '/services',
      selector: '[data-tutorial="services-save"]',
      action: 'click',
      title: 'Save and Continue',
      callout: 'Click Save to confirm your service selections and proceed to checkout. You can adjust your selections anytime from your dashboard.',
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     DASHBOARD (/dashboard)
     ═══════════════════════════════════════════════════════ */
  'dashboard': makeSteps('dashboard', [
    {
      id: 'dashboard-welcome',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-welcome"]',
      action: 'observe',
      title: 'Welcome to Your Dashboard',
      callout: 'This is your Echo Prime control center. From here you can access all your services, monitor usage, and manage your account.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'dashboard-sidebar',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-sidebar"]',
      action: 'observe',
      title: 'Navigation Sidebar',
      callout: 'Use the sidebar to quickly navigate between Sentinel AI, Engines, Business Manager, and all other services. On mobile, this appears as a bottom tab bar.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'right',
    },
    {
      id: 'dashboard-sentinel',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-sentinel"]',
      action: 'observe',
      title: 'Sentinel AI',
      callout: 'Your primary intelligence interface. 932+ engines across 65 domains with three query modes: Standard, Swarm, and Echo Prime personality mode.',
      autoAdvance: true,
      autoAdvanceDelay: 5000,
      tooltipPosition: 'bottom',
    },
    {
      id: 'dashboard-usage',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-usage"]',
      action: 'observe',
      title: 'Usage Stats',
      callout: 'Track your plan, queries used, remaining balance, and available modes at a glance. Upgrade anytime from the Pricing page.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
    {
      id: 'dashboard-services',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-services"]',
      action: 'observe',
      title: 'Your Services',
      callout: 'Active services appear here as quick-access cards. Click any card to open that service directly.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
    {
      id: 'dashboard-available',
      route: '/dashboard',
      selector: '[data-tutorial="dashboard-available"]',
      action: 'observe',
      title: 'Available Services',
      callout: 'Browse and activate additional services. Each one integrates seamlessly with your dashboard and Sentinel AI.',
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      tooltipPosition: 'top',
    },
  ]),

  /* ═══════════════════════════════════════════════════════
     ECHO CALL CENTER (/call-center)
     ═══════════════════════════════════════════════════════ */
  'call-center': makeSteps('call-center', [
    { id: 'cc-hero', route: '/call-center', selector: '[data-tutorial="cc-hero"]', action: 'observe', title: 'Echo Call Center', callout: 'AI-powered call center with queue routing, supervisor dashboards, gamification, and workflow automation. 230+ REST endpoints and 65 database tables.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'cc-features', route: '/call-center', selector: '[data-tutorial="cc-features"]', action: 'observe', title: 'Feature Highlights', callout: 'Explore queue routing (5 strategies), VIP contacts, callbacks, voicemails, scripts engine, CRM webhooks, SLA alerts, TCPA compliance, and more.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'cc-pricing', route: '/call-center', selector: '[data-tutorial="cc-pricing"]', action: 'click', title: 'View Pricing', callout: 'Check out the pricing tiers — Starter, Professional, and Enterprise. Each includes a free trial.', tooltipPosition: 'bottom' },
    { id: 'cc-comparison', route: '/call-center', selector: '[data-tutorial="cc-comparison"]', action: 'observe', title: 'How We Compare', callout: 'See how Echo Call Center stacks up against Five9, Talkdesk, and Aircall across 13 features.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'top' },
    { id: 'cc-faq', route: '/call-center', selector: '[data-tutorial="cc-faq"]', action: 'click', title: 'FAQ', callout: 'Common questions about setup, integrations, and capabilities. Click any question to expand.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     ECHO HOME AI (/home-ai)
     ═══════════════════════════════════════════════════════ */
  'home-ai': makeSteps('home-ai', [
    { id: 'home-hero', route: '/home-ai', selector: '[data-tutorial="home-hero"]', action: 'observe', title: 'Echo Home AI', callout: 'Whole-home intelligence — control 40+ smart device brands, tutor kids, manage bills, dispatch robots, and optimize energy from one AI dashboard.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'home-devices', route: '/home-ai', selector: '[data-tutorial="home-devices"]', action: 'observe', title: 'Device Control', callout: 'Add and manage smart lights, thermostats, locks, cameras, robot vacuums, mowers, and more — all unified.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'home-education', route: '/home-ai', selector: '[data-tutorial="home-education"]', action: 'observe', title: 'Education Module', callout: 'Assign homework, generate AI test prep, track scores, and monitor student progress — built-in tutoring.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'home-security', route: '/home-ai', selector: '[data-tutorial="home-security"]', action: 'observe', title: 'Security Systems', callout: 'Arm/disarm your home, control locks, view cameras, and review activity logs — all from one interface.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'home-pricing', route: '/home-ai', selector: '[data-tutorial="home-pricing"]', action: 'click', title: 'View Plans', callout: 'Choose a plan and start automating your home. Free trial available on all tiers.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     ECHO SHEPHERD AI (/shepherd)
     ═══════════════════════════════════════════════════════ */
  'shepherd': makeSteps('shepherd', [
    { id: 'shepherd-hero', route: '/shepherd', selector: '[data-tutorial="shepherd-hero"]', action: 'observe', title: 'Echo Shepherd AI', callout: 'Church management powered by AI — member care, sermon planning, giving, curriculum, and communications for any denomination.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'shepherd-giving', route: '/shepherd', selector: '[data-tutorial="shepherd-giving"]', action: 'observe', title: 'Online Giving', callout: 'Recurring donations, campaigns, text-to-give, and automated tax statements — making generosity frictionless.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'shepherd-curriculum', route: '/shepherd', selector: '[data-tutorial="shepherd-curriculum"]', action: 'observe', title: 'Curriculum & Study', callout: 'AI-generated Bible studies, group assignments, and progress tracking — discipleship made easy.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'shepherd-comms', route: '/shepherd', selector: '[data-tutorial="shepherd-comms"]', action: 'observe', title: 'Communications', callout: 'Send announcements, manage prayer requests, and celebrate answered prayers — keep your congregation connected.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'shepherd-pricing', route: '/shepherd', selector: '[data-tutorial="shepherd-pricing"]', action: 'click', title: 'Get Started', callout: 'Plans start at $29/mo for small churches. 21 denomination configs included.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     ECHO INTEL HUB (/intel-hub)
     ═══════════════════════════════════════════════════════ */
  'intel-hub': makeSteps('intel-hub', [
    { id: 'intel-hero', route: '/intel-hub', selector: '[data-tutorial="intel-hero"]', action: 'observe', title: 'Echo Intel Hub', callout: 'Digital intelligence platform — threat intel, geofencing, breach monitoring, and automated risk reports.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'intel-threats', route: '/intel-hub', selector: '[data-tutorial="intel-threats"]', action: 'observe', title: 'Threat Intelligence', callout: 'Ingest IOCs, check indicators, and correlate threats across your infrastructure in real-time.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'intel-geo', route: '/intel-hub', selector: '[data-tutorial="intel-geo"]', action: 'observe', title: 'Geofencing', callout: 'Define GPS zones, track entry/exit events, and set up location-based alerts with haversine distance.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'intel-breach', route: '/intel-hub', selector: '[data-tutorial="intel-breach"]', action: 'observe', title: 'Breach Monitoring', callout: 'Monitor emails and domains for data breaches. Get reports with risk scoring and remediation steps.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'bottom' },
    { id: 'intel-pricing', route: '/intel-hub', selector: '[data-tutorial="intel-pricing"]', action: 'click', title: 'Choose Plan', callout: 'Personal, Business, and Enterprise tiers. All include a kill switch and anomaly detection.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     A/B TESTING (/ab-testing)
     ═══════════════════════════════════════════════════════ */
  'ab-testing': makeSteps('ab-testing', [
    { id: 'ab-hero', route: '/ab-testing', selector: '[data-tutorial="ab-hero"]', action: 'observe', title: 'Echo A/B Testing', callout: 'Bayesian A/B testing with AI optimization. Get results 3-5x faster than traditional tools with revenue tracking.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'ab-features', route: '/ab-testing', selector: '[data-tutorial="ab-features"]', action: 'observe', title: 'Testing Features', callout: 'Split tests, multivariate tests, feature flags, visual editor, and server-side testing via REST API.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'ab-comparison', route: '/ab-testing', selector: '[data-tutorial="ab-comparison"]', action: 'observe', title: 'How We Compare', callout: 'Compare against Optimizely, VWO, and Google Optimize across 12 dimensions.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'top' },
    { id: 'ab-pricing', route: '/ab-testing', selector: '[data-tutorial="ab-pricing"]', action: 'click', title: 'Start Testing', callout: 'From $29/mo for 5 experiments. Growth plan includes AI suggestions and multivariate tests.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     INCIDENT MANAGER (/incident-manager)
     ═══════════════════════════════════════════════════════ */
  'incident-manager': makeSteps('incident-manager', [
    { id: 'im-hero', route: '/incident-manager', selector: '[data-tutorial="im-hero"]', action: 'observe', title: 'Echo Incident Manager', callout: 'From alert to post-mortem in one platform. AI escalation, timeline tracking, and blameless post-mortems.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'im-features', route: '/incident-manager', selector: '[data-tutorial="im-features"]', action: 'observe', title: 'Incident Features', callout: 'Full lifecycle management — P1-P4 severity, auto-escalation, timeline tracking, and metrics dashboards.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'im-comparison', route: '/incident-manager', selector: '[data-tutorial="im-comparison"]', action: 'observe', title: 'vs PagerDuty & OpsGenie', callout: 'See how Echo stacks up on escalation, post-mortems, metrics, and pricing.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'top' },
    { id: 'im-pricing', route: '/incident-manager', selector: '[data-tutorial="im-pricing"]', action: 'click', title: 'Start Free Trial', callout: 'Plans from $19/mo. Professional includes AI escalation rules and MTTR/MTTD metrics.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     GAMER COMPANION (/gamer-companion)
     ═══════════════════════════════════════════════════════ */
  'gamer-companion': makeSteps('gamer-companion', [
    { id: 'gc-hero', route: '/gamer-companion', selector: '[data-tutorial="gc-hero"]', action: 'observe', title: 'GGI Apex Predator', callout: 'AI-powered gaming companion — real-time overlays, build optimization, match analysis, and coaching across 50+ games.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'gc-features', route: '/gamer-companion', selector: '[data-tutorial="gc-features"]', action: 'observe', title: 'Core Features', callout: 'Aim training, team comms analysis, meta tracking, replay review, and streaming integration.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'gc-pricing', route: '/gamer-companion', selector: '[data-tutorial="gc-pricing"]', action: 'click', title: 'Choose Your Tier', callout: 'Free tier available. Pro unlocks AI coaching, match analysis, and real-time overlays.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     WHATSAPP BOT (/whatsapp-bot)
     ═══════════════════════════════════════════════════════ */
  'whatsapp-bot': makeSteps('whatsapp-bot', [
    { id: 'wa-hero', route: '/whatsapp-bot', selector: '[data-tutorial="wa-hero"]', action: 'observe', title: 'Echo WhatsApp Bot', callout: '14 AI personalities, 2,600+ knowledge engines, lead capture, broadcasts, and product catalogs — all on WhatsApp.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'wa-features', route: '/whatsapp-bot', selector: '[data-tutorial="wa-features"]', action: 'observe', title: 'Bot Features', callout: 'Domain-aware routing, Shared Brain memory, Knowledge Forge access, and HMAC webhook security.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'wa-comparison', route: '/whatsapp-bot', selector: '[data-tutorial="wa-comparison"]', action: 'observe', title: 'vs WATI & ManyChat', callout: 'Compare AI capabilities, knowledge engines, memory, and performance.', autoAdvance: true, autoAdvanceDelay: 4000, tooltipPosition: 'top' },
    { id: 'wa-pricing', route: '/whatsapp-bot', selector: '[data-tutorial="wa-pricing"]', action: 'click', title: 'Get Started', callout: 'From $49/mo with 1,000 messages. Professional includes all 14 personalities and product catalogs.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     TELEGRAM BOT (/telegram-bot)
     ═══════════════════════════════════════════════════════ */
  'telegram-bot': makeSteps('telegram-bot', [
    { id: 'tg-hero', route: '/telegram-bot', selector: '[data-tutorial="tg-hero"]', action: 'observe', title: 'Echo Telegram Bot', callout: '32 AI personalities, 18 slash commands, voice transcription, crypto feeds, and community moderation.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'tg-features', route: '/telegram-bot', selector: '[data-tutorial="tg-features"]', action: 'observe', title: 'Bot Capabilities', callout: 'Voice STT pipeline, inline keyboards, autonomous posting, and domain-aware routing across 20+ expert domains.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'tg-pricing', route: '/telegram-bot', selector: '[data-tutorial="tg-pricing"]', action: 'click', title: 'Start Building', callout: 'From $29/mo. Professional includes all 32 personalities, crypto integration, and Knowledge Forge access.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     CRM (/crm) — NOT A PRODUCT PAGE YET, PLACEHOLDER
     ═══════════════════════════════════════════════════════ */
  'crm': makeSteps('crm', [
    { id: 'crm-hero', route: '/crm', selector: '[data-tutorial="crm-hero"]', action: 'observe', title: 'Echo CRM', callout: 'AI-powered customer relationship management — contacts, deals, pipelines, and automated follow-ups.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'crm-features', route: '/crm', selector: '[data-tutorial="crm-features"]', action: 'observe', title: 'CRM Features', callout: 'Deal tracking, contact enrichment, email sequences, pipeline visualization, and AI-powered insights.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'crm-pricing', route: '/crm', selector: '[data-tutorial="crm-pricing"]', action: 'click', title: 'Get Started', callout: 'Plans from $19/mo. All tiers include unlimited contacts and AI-powered lead scoring.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     BOOKING (/booking)
     ═══════════════════════════════════════════════════════ */
  'booking': makeSteps('booking', [
    { id: 'book-hero', route: '/booking', selector: '[data-tutorial="book-hero"]', action: 'observe', title: 'Echo Booking', callout: 'Intelligent appointment scheduling — automated confirmations, reminders, buffer times, and calendar sync.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'book-features', route: '/booking', selector: '[data-tutorial="book-features"]', action: 'observe', title: 'Scheduling Features', callout: 'Multi-staff calendars, service types, buffer times, automated reminders, and custom booking pages.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'book-pricing', route: '/booking', selector: '[data-tutorial="book-pricing"]', action: 'click', title: 'Start Booking', callout: 'Free tier for solo practitioners. Business tier adds staff management and API access.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     INVOICE (/invoice)
     ═══════════════════════════════════════════════════════ */
  'invoice': makeSteps('invoice', [
    { id: 'inv-hero', route: '/invoice', selector: '[data-tutorial="inv-hero"]', action: 'observe', title: 'Echo Invoice', callout: 'AI-powered invoicing — generate, send, track, and collect payments with automated reminders and late fees.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'inv-features', route: '/invoice', selector: '[data-tutorial="inv-features"]', action: 'observe', title: 'Invoicing Features', callout: 'Templates, recurring invoices, payment tracking, overdue alerts, tax calculation, and export to accounting.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'inv-pricing', route: '/invoice', selector: '[data-tutorial="inv-pricing"]', action: 'click', title: 'Try Free', callout: 'Free tier includes 10 invoices/month. Professional adds automation and payment processing.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     DOCUMENT MANAGER (/document-manager)
     ═══════════════════════════════════════════════════════ */
  'document-manager': makeSteps('document-manager', [
    { id: 'doc-hero', route: '/document-manager', selector: '[data-tutorial="doc-hero"]', action: 'observe', title: 'Echo Document Manager', callout: 'AI-powered document management — version control, OCR extraction, e-signatures, and smart search.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'doc-features', route: '/document-manager', selector: '[data-tutorial="doc-features"]', action: 'observe', title: 'Document Features', callout: 'Full-text search, version history, access controls, audit trails, and automated classification.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'doc-pricing', route: '/document-manager', selector: '[data-tutorial="doc-pricing"]', action: 'click', title: 'Get Started', callout: 'From $19/mo with 5GB storage. Professional adds OCR, e-signatures, and AI classification.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     EXPENSE TRACKER (/expense)
     ═══════════════════════════════════════════════════════ */
  'expense': makeSteps('expense', [
    { id: 'exp-hero', route: '/expense', selector: '[data-tutorial="exp-hero"]', action: 'observe', title: 'Echo Expense Tracker', callout: 'AI-powered expense management — receipt scanning, mileage tracking, policy enforcement, and approval workflows.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'exp-features', route: '/expense', selector: '[data-tutorial="exp-features"]', action: 'observe', title: 'Expense Features', callout: 'OCR receipt scanning, category detection, per diem calculations, and multi-currency support.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'exp-pricing', route: '/expense', selector: '[data-tutorial="exp-pricing"]', action: 'click', title: 'Start Free Trial', callout: 'Plans from $9/mo per user. Unlimited receipt scanning on all tiers.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     CUSTOMER SUCCESS (/customer-success)
     ═══════════════════════════════════════════════════════ */
  'customer-success': makeSteps('customer-success', [
    { id: 'cs-hero', route: '/customer-success', selector: '[data-tutorial="cs-hero"]', action: 'observe', title: 'Echo Customer Success', callout: 'AI-powered customer health scoring, churn prediction, expansion revenue tracking, and automated outreach.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'cs-features', route: '/customer-success', selector: '[data-tutorial="cs-features"]', action: 'observe', title: 'Success Features', callout: 'Health scores, usage analytics, NPS tracking, playbook automation, and renewal management.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'cs-pricing', route: '/customer-success', selector: '[data-tutorial="cs-pricing"]', action: 'click', title: 'Get Started', callout: 'From $49/mo. All plans include AI health scoring and churn prediction.', tooltipPosition: 'top' },
  ]),
  /* ═══════════════════════════════════════════════════════
     SENTINEL AI (/sentinel)
     ═══════════════════════════════════════════════════════ */
  'sentinel': makeSteps('sentinel', [
    { id: 'sent-hero', route: '/sentinel', selector: '[data-tutorial="sentinel-hero"]', action: 'observe', title: 'Welcome to Sentinel AI', callout: 'Sentinel is a professional intelligence interface — not a chatbot. It queries 5,486+ engines and 611K+ doctrine blocks for court-defensible answers with citations.', autoAdvance: true, autoAdvanceDelay: 6000, tooltipPosition: 'bottom' },
    { id: 'sent-input', route: '/sentinel', selector: '[data-tutorial="sentinel-input"]', action: 'type', title: 'Ask a Domain Question', callout: 'Type a question in any domain: tax law, cybersecurity, oilfield engineering, medical, legal. Try "What are the IRC §199A deductions for pass-through entities?"', exampleValue: 'IRC 199A deductions', tooltipPosition: 'bottom' },
    { id: 'sent-response', route: '/sentinel', selector: '[data-tutorial="sentinel-response"]', action: 'observe', title: 'Engine-Backed Response', callout: 'Every response includes authority citations (IRC codes, case law, NIST frameworks), confidence levels, and risk stratification. No hallucinations — only verified doctrines.', autoAdvance: true, autoAdvanceDelay: 8000, tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     PERMIAN BASIN (/permian)
     ═══════════════════════════════════════════════════════ */
  'permian': makeSteps('permian', [
    { id: 'per-hero', route: '/permian', selector: '[data-tutorial="permian-hero"]', action: 'observe', title: 'Permian Basin Intelligence', callout: 'The most comprehensive oilfield intelligence platform for the Permian Basin. Title search, well data, production analytics, and AI-powered mineral rights analysis.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'per-features', route: '/permian', selector: '[data-tutorial="permian-features"]', action: 'observe', title: 'Platform Features', callout: 'County records search (224K+ Ector Co.), chain-of-title automation, mineral rights mapping, production data, and AI landman analysis.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'per-pricing', route: '/permian', selector: '[data-tutorial="permian-pricing"]', action: 'click', title: 'Explore Pricing', callout: 'Permian Pilot packages from $7,500 for 30-day engagements. Enterprise custom pricing available.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     HELPDESK (/helpdesk)
     ═══════════════════════════════════════════════════════ */
  'helpdesk': makeSteps('helpdesk', [
    { id: 'hd-hero', route: '/helpdesk', selector: '[data-tutorial="helpdesk-hero"]', action: 'observe', title: 'AI Helpdesk', callout: 'AI-powered ticket management with auto-categorization, sentiment detection, SLA tracking, and smart agent routing.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'hd-features', route: '/helpdesk', selector: '[data-tutorial="helpdesk-features"]', action: 'observe', title: 'Key Features', callout: 'Multi-channel support (email, chat, phone), knowledge base integration, canned responses, and customer satisfaction surveys.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'hd-pricing', route: '/helpdesk', selector: '[data-tutorial="helpdesk-pricing"]', action: 'click', title: 'Start Free', callout: 'Free tier with 100 tickets/month. Pro from $29/agent/month with AI auto-routing.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     LIVE CHAT (/live-chat)
     ═══════════════════════════════════════════════════════ */
  'live-chat': makeSteps('live-chat', [
    { id: 'lc-hero', route: '/live-chat', selector: '[data-tutorial="live-chat-hero"]', action: 'observe', title: 'AI Live Chat', callout: 'Resolve 70% of customer queries autonomously with AI chat that understands context, sentiment, and intent. Smart routing to human agents when needed.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'lc-features', route: '/live-chat', selector: '[data-tutorial="live-chat-features"]', action: 'observe', title: 'Chat Features', callout: 'Visitor tracking, proactive chat triggers, canned responses, file sharing, chat transcripts, and CRM integration.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'lc-pricing', route: '/live-chat', selector: '[data-tutorial="live-chat-pricing"]', action: 'click', title: 'Try Live Chat', callout: 'From $19/mo. AI auto-resolution included on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     CRM (/crm)
     ═══════════════════════════════════════════════════════ */
  'crm-full': makeSteps('crm-full', [
    { id: 'crm-hero', route: '/crm', selector: '[data-tutorial="crm-hero"]', action: 'observe', title: 'Echo CRM', callout: 'AI-powered customer relationship management with lead scoring, pipeline automation, email sequences, and revenue forecasting.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'crm-pipeline', route: '/crm', selector: '[data-tutorial="crm-pipeline"]', action: 'observe', title: 'Sales Pipeline', callout: 'Drag-and-drop pipeline with AI deal scoring. Automatic next-best-action suggestions and win probability predictions.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'crm-pricing', route: '/crm', selector: '[data-tutorial="crm-pricing"]', action: 'click', title: 'Get Started', callout: 'From $29/user/month. Unlimited contacts on all plans. No per-contact pricing traps.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     SOCIAL MEDIA MANAGEMENT (/social-media)
     ═══════════════════════════════════════════════════════ */
  'social-media': makeSteps('social-media', [
    { id: 'sm-hero', route: '/social-media', selector: '[data-tutorial="social-media-hero"]', action: 'observe', title: 'Social Media Management', callout: 'AI content generation, multi-platform scheduling, engagement analytics, and competitor monitoring. Manage all social accounts from one dashboard.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sm-features', route: '/social-media', selector: '[data-tutorial="social-media-features"]', action: 'observe', title: 'Platform Features', callout: 'Auto-generate posts with AI, schedule across 8+ platforms, track engagement metrics, and get content suggestions based on trending topics.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sm-pricing', route: '/social-media', selector: '[data-tutorial="social-media-pricing"]', action: 'click', title: 'Start Managing', callout: 'From $19/mo for 5 social accounts. AI content generation on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     EMAIL MARKETING (/email-marketing)
     ═══════════════════════════════════════════════════════ */
  'email-marketing': makeSteps('email-marketing', [
    { id: 'em-hero', route: '/email-marketing', selector: '[data-tutorial="email-marketing-hero"]', action: 'observe', title: 'AI Email Marketing', callout: 'AI-powered email campaigns with smart segmentation, subject line optimization, send time prediction, and A/B testing built in.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'em-features', route: '/email-marketing', selector: '[data-tutorial="email-marketing-features"]', action: 'observe', title: 'Campaign Features', callout: 'Drag-and-drop email builder, automation workflows, deliverability monitoring, and AI-generated content suggestions.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'em-pricing', route: '/email-marketing', selector: '[data-tutorial="email-marketing-pricing"]', action: 'click', title: 'Start Free', callout: 'Free up to 500 subscribers. Pro from $19/mo with unlimited sends and AI optimization.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     SURVEYS (/surveys)
     ═══════════════════════════════════════════════════════ */
  'surveys': makeSteps('surveys', [
    { id: 'sur-hero', route: '/surveys', selector: '[data-tutorial="surveys-hero"]', action: 'observe', title: 'AI Surveys', callout: 'Create intelligent surveys with AI-powered question generation, response analysis, and sentiment scoring. NPS, CSAT, and custom survey types.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sur-features', route: '/surveys', selector: '[data-tutorial="surveys-features"]', action: 'observe', title: 'Survey Features', callout: 'Conditional logic, multi-language, custom branding, response analytics with AI insights, and integrations with CRM and helpdesk.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sur-pricing', route: '/surveys', selector: '[data-tutorial="surveys-pricing"]', action: 'click', title: 'Create Survey', callout: 'Free tier with 100 responses/month. Pro from $29/mo with AI analysis.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     FORMS (/forms)
     ═══════════════════════════════════════════════════════ */
  'forms': makeSteps('forms', [
    { id: 'frm-hero', route: '/forms', selector: '[data-tutorial="forms-hero"]', action: 'observe', title: 'AI Form Builder', callout: 'Drag-and-drop form builder with AI field suggestions, conditional logic, file uploads, payment collection, and webhook integrations.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'frm-features', route: '/forms', selector: '[data-tutorial="forms-features"]', action: 'observe', title: 'Builder Features', callout: 'Pre-built templates, multi-step forms, calculation fields, e-signatures, and automatic data routing to CRM and helpdesk.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'frm-pricing', route: '/forms', selector: '[data-tutorial="forms-pricing"]', action: 'click', title: 'Build a Form', callout: 'Free tier with 5 forms. Pro from $19/mo with unlimited forms and AI suggestions.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     LMS / LEARNING (/lms)
     ═══════════════════════════════════════════════════════ */
  'lms': makeSteps('lms', [
    { id: 'lms-hero', route: '/lms', selector: '[data-tutorial="lms-hero"]', action: 'observe', title: 'AI Learning Management', callout: 'Create, sell, and deliver online courses with AI-powered content generation, adaptive learning paths, and student progress analytics.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'lms-features', route: '/lms', selector: '[data-tutorial="lms-features"]', action: 'observe', title: 'LMS Features', callout: 'Course builder, video hosting, quizzes, certificates, student forums, drip content, and payment processing built in.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'lms-pricing', route: '/lms', selector: '[data-tutorial="lms-pricing"]', action: 'click', title: 'Create Course', callout: 'From $29/mo. 0% transaction fee on all plans (competitors charge 5-10%).', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     APPOINTMENTS / SCHEDULING (/appointments)
     ═══════════════════════════════════════════════════════ */
  'appointments': makeSteps('appointments', [
    { id: 'apt-hero', route: '/appointments', selector: '[data-tutorial="appointments-hero"]', action: 'observe', title: 'AI Scheduling', callout: 'Smart appointment booking with AI time optimization, buffer management, timezone detection, and automatic reminders via email and SMS.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'apt-features', route: '/appointments', selector: '[data-tutorial="appointments-features"]', action: 'observe', title: 'Scheduling Features', callout: 'Round-robin assignment, group bookings, recurring appointments, payment collection at booking, and calendar sync (Google, Outlook, Apple).', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'apt-pricing', route: '/appointments', selector: '[data-tutorial="appointments-pricing"]', action: 'click', title: 'Start Booking', callout: 'Free tier with unlimited bookings. Pro from $15/mo with SMS reminders and payment collection.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     WORKFLOW AUTOMATION (/workflow-automation)
     ═══════════════════════════════════════════════════════ */
  'workflow-automation': makeSteps('workflow-automation', [
    { id: 'wf-hero', route: '/workflow-automation', selector: '[data-tutorial="workflow-hero"]', action: 'observe', title: 'AI Workflow Automation', callout: 'Visual workflow builder with AI-powered triggers, conditions, and actions. Automate any business process without code.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'wf-features', route: '/workflow-automation', selector: '[data-tutorial="workflow-features"]', action: 'observe', title: 'Automation Features', callout: 'Multi-step workflows, conditional branching, webhooks, API integrations, scheduled triggers, and error handling with auto-retry.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'wf-pricing', route: '/workflow-automation', selector: '[data-tutorial="workflow-pricing"]', action: 'click', title: 'Automate Now', callout: 'From $19/mo with unlimited workflows. No per-task pricing like Zapier.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     CONTRACTS (/contracts)
     ═══════════════════════════════════════════════════════ */
  'contracts': makeSteps('contracts', [
    { id: 'con-hero', route: '/contracts', selector: '[data-tutorial="contracts-hero"]', action: 'observe', title: 'AI Contract Management', callout: 'AI-powered contract lifecycle management with template generation, clause extraction, risk analysis, and automated renewal tracking.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'con-features', route: '/contracts', selector: '[data-tutorial="contracts-features"]', action: 'observe', title: 'Contract Features', callout: 'Template library, clause bank, version control, approval workflows, e-signatures, and obligation tracking with deadline alerts.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'con-pricing', route: '/contracts', selector: '[data-tutorial="contracts-pricing"]', action: 'click', title: 'Start Managing', callout: 'From $39/mo. AI clause extraction and risk scoring on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     VENDOR MANAGER (/vendor-manager)
     ═══════════════════════════════════════════════════════ */
  'vendor-manager': makeSteps('vendor-manager', [
    { id: 'vm-hero', route: '/vendor-manager', selector: '[data-tutorial="vendor-hero"]', action: 'observe', title: 'AI Vendor Management', callout: 'Full vendor lifecycle management with AI risk assessment, PO automation, contract tracking, and spend analytics.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'vm-features', route: '/vendor-manager', selector: '[data-tutorial="vendor-features"]', action: 'observe', title: 'Vendor Features', callout: '29-field vendor profiles, automated PO approval, diversity tracking, SLA monitoring, and proactive renewal alerts.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'vm-pricing', route: '/vendor-manager', selector: '[data-tutorial="vendor-pricing"]', action: 'click', title: 'Manage Vendors', callout: 'From $29/mo. AI risk scoring and PO auto-approval on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     SIGNATURES (/signatures)
     ═══════════════════════════════════════════════════════ */
  'signatures': makeSteps('signatures', [
    { id: 'sig-hero', route: '/signatures', selector: '[data-tutorial="signatures-hero"]', action: 'observe', title: 'AI eSignatures', callout: 'Legally binding electronic signatures with AI document analysis, smart field placement, and automated signing workflows.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sig-features', route: '/signatures', selector: '[data-tutorial="signatures-features"]', action: 'observe', title: 'Signature Features', callout: 'Template library, bulk send, signing order, audit trail, mobile signing, and integration with contracts and document management.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sig-pricing', route: '/signatures', selector: '[data-tutorial="signatures-pricing"]', action: 'click', title: 'Sign Up Free', callout: 'Free tier: 5 documents/month. Pro from $15/mo with unlimited documents.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     PROPOSALS (/proposals)
     ═══════════════════════════════════════════════════════ */
  'proposals': makeSteps('proposals', [
    { id: 'pro-hero', route: '/proposals', selector: '[data-tutorial="proposals-hero"]', action: 'observe', title: 'AI Proposals', callout: 'Create winning proposals in minutes with AI content generation, dynamic pricing tables, e-signatures, and client engagement tracking.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'pro-features', route: '/proposals', selector: '[data-tutorial="proposals-features"]', action: 'observe', title: 'Proposal Features', callout: 'Template library, interactive pricing, video embedding, client comments, analytics (opens, time spent), and one-click acceptance.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'pro-pricing', route: '/proposals', selector: '[data-tutorial="proposals-pricing"]', action: 'click', title: 'Create Proposal', callout: 'From $29/mo. AI content generation and e-signature on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     SEC INTEL (/sec-intel)
     ═══════════════════════════════════════════════════════ */
  'sec-intel': makeSteps('sec-intel', [
    { id: 'si-hero', route: '/sec-intel', selector: '[data-tutorial="sec-intel-hero"]', action: 'observe', title: 'Security Intelligence', callout: 'Real-time threat intelligence, vulnerability scanning, dark web monitoring, and compliance reporting for your entire infrastructure.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'si-features', route: '/sec-intel', selector: '[data-tutorial="sec-intel-features"]', action: 'observe', title: 'Intel Features', callout: 'CVE tracking, attack surface mapping, credential leak detection, phishing simulation, and automated incident response playbooks.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'si-pricing', route: '/sec-intel', selector: '[data-tutorial="sec-intel-pricing"]', action: 'click', title: 'Secure Now', callout: 'From $99/mo. Continuous scanning and dark web monitoring on all plans.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     SPEAK CLOUD / VOICE (/speak-cloud)
     ═══════════════════════════════════════════════════════ */
  'speak-cloud': makeSteps('speak-cloud', [
    { id: 'sc-hero', route: '/speak-cloud', selector: '[data-tutorial="speak-cloud-hero"]', action: 'observe', title: 'Speak Cloud TTS', callout: 'Multi-provider text-to-speech with 69 cloned voices, emotion detection, and persona switching. ElevenLabs + Edge TTS with quota-aware blending.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sc-features', route: '/speak-cloud', selector: '[data-tutorial="speak-cloud-features"]', action: 'observe', title: 'Voice Features', callout: 'Cloned voice enforcement, multilingual support, 4-layer emotion intelligence, and automatic provider failover for 99.9% uptime.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'sc-pricing', route: '/speak-cloud', selector: '[data-tutorial="speak-cloud-pricing"]', action: 'click', title: 'Try Voice AI', callout: 'Free tier: 1,000 characters/day. Pro from $29/mo with unlimited characters and cloned voices.', tooltipPosition: 'top' },
  ]),

  /* ═══════════════════════════════════════════════════════
     GRAPH RAG (/graph-rag)
     ═══════════════════════════════════════════════════════ */
  'graph-rag': makeSteps('graph-rag', [
    { id: 'gr-hero', route: '/graph-rag', selector: '[data-tutorial="graph-rag-hero"]', action: 'observe', title: 'Graph RAG Knowledge', callout: '312K+ nodes, 3.3M+ edges spanning 101 domains. Cross-domain knowledge retrieval that finds connections traditional search misses.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'gr-features', route: '/graph-rag', selector: '[data-tutorial="graph-rag-features"]', action: 'observe', title: 'Graph Features', callout: 'Entity resolution, relationship extraction, semantic similarity, cross-domain traversal, and real-time graph updates from doctrine forge.', autoAdvance: true, autoAdvanceDelay: 5000, tooltipPosition: 'bottom' },
    { id: 'gr-pricing', route: '/graph-rag', selector: '[data-tutorial="graph-rag-pricing"]', action: 'click', title: 'Explore Graph', callout: 'Included in SDK Pro tier. API access for custom queries and knowledge traversal.', tooltipPosition: 'top' },
  ]),

  /* ═══ WAVE 3 — 20 more tutorials ═══ */
  ...Object.fromEntries([
    ['closer', 'Closer AI', '/closer', 'AI Sales Agent that handles cold calls, objection handling, and follow-ups autonomously.'],
    ['affiliate', 'Affiliate Program', '/affiliate', 'Earn recurring commissions promoting Echo Prime products. Dashboard with real-time earnings.'],
    ['agentic-engine', 'Agentic Engine', '/agentic-engine', 'Autonomous AI agents that execute multi-step tasks. Deploy to Cloudflare Workers.'],
    ['app-forge', 'App Forge', '/app-forge', 'Build and deploy full-stack apps from natural language descriptions. AI-powered code generation.'],
    ['coin-rewards', 'Echo Coin Rewards', '/coin-rewards', 'Loyalty program with tokenized rewards. Earn coins for engagement, spend on products.'],
    ['project-management', 'Project Management', '/project-management', 'AI project boards with auto-scheduling, dependency tracking, and resource optimization.'],
    ['invoicing', 'Invoicing', '/invoicing', 'AI-powered invoicing with auto-categorization, payment tracking, and smart reminders.'],
    ['hr-management', 'HR Management', '/hr-management', 'AI HR platform with employee onboarding, time-off tracking, and performance reviews.'],
    ['inventory', 'Inventory Management', '/inventory', 'AI inventory tracking with demand forecasting, reorder automation, and multi-location support.'],
    ['knowledge-base', 'Knowledge Base', '/knowledge-base', 'Semantic search knowledge base. AI auto-categorizes articles and generates instant answers.'],
    ['finance-ai', 'Finance AI', '/finance-ai', 'Portfolio tracking, expense analysis, and AI-driven financial insights for personal and business.'],
    ['compliance', 'Compliance Auditor', '/compliance', 'Automated compliance monitoring. Continuous policy checks across all systems and Workers.'],
    ['domain-harvester', 'Domain Harvester', '/domain-harvester', 'AI-powered domain discovery and competitive intelligence. WHOIS, DNS, and content analysis.'],
    ['drive-intelligence', 'Drive Intelligence', '/drive-intelligence', 'AI file system analysis. Identifies duplicates, sensitive data, and organization patterns.'],
    ['documents', 'Document Manager', '/documents', 'AI document management with semantic search, auto-tagging, and version control.'],
    ['status-page', 'Status Page', '/status-page', 'Real-time service status dashboard. Automated incident detection and public status communication.'],
    ['surveillance', 'Surveillance', '/surveillance', 'AI-powered OSINT monitoring. Track mentions, threats, and digital footprints across the web.'],
    ['web-analytics', 'Web Analytics', '/web-analytics', 'Privacy-first analytics. Real-time visitor tracking, funnel analysis, and AI recommendations.'],
    ['payroll', 'Payroll', '/payroll', 'AI payroll processing with tax calculations, direct deposit, and compliance automation.'],
    ['newsletter', 'Newsletter', '/newsletter', 'AI-generated newsletters. Content curation, personalization, and send-time optimization.'],
  ].map(([id, name, route, desc]) => [id, makeSteps(id, [
    { id: `${id}-hero`, route, selector: `[data-tutorial="${id}-hero"]`, action: 'observe' as const, title: `Welcome to ${name}`, callout: desc, tooltipPosition: 'bottom' as const },
    { id: `${id}-features`, route, selector: `[data-tutorial="${id}-features"]`, action: 'observe' as const, title: 'Key Features', callout: `Explore the core capabilities of ${name}. Each feature is AI-powered and production-ready.`, tooltipPosition: 'top' as const },
    { id: `${id}-pricing`, route, selector: `[data-tutorial="${id}-pricing"]`, action: 'click' as const, title: 'Get Started', callout: `View pricing and start using ${name} today. Free tier available for all products.`, tooltipPosition: 'top' as const },
  ])])),
};

export function getGuidedSteps(tutorialId: string): GuidedStep[] {
  return GUIDED_STEPS[tutorialId] || [];
}

export function getAvailableGuidedTutorials(): string[] {
  return Object.keys(GUIDED_STEPS);
}
