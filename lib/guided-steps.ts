import type { GuidedStep } from './guided-tutorial-context';

/* ─────────────────────────────────────────────────────────
   GUIDED STEP DEFINITIONS
   Maps each tutorial to a sequence of interactive steps
   targeting real UI elements via data-tutorial selectors.
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
  /* ═══════════════════════════════════════════
     TUTORIAL 2: Settings Page
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     TUTORIAL 3: Scripts Page
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     TUTORIAL 4: Leads Page
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     TUTORIAL 5: Campaigns Page
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     TUTORIAL 6: Calls Page
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     TUTORIAL 7: Analytics Page
     ═══════════════════════════════════════════ */
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
};

export function getGuidedSteps(tutorialId: string): GuidedStep[] {
  return GUIDED_STEPS[tutorialId] || [];
}

export function getAvailableGuidedTutorials(): string[] {
  return Object.keys(GUIDED_STEPS);
}
