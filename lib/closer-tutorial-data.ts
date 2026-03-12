// Closer AI Tutorial Data — 8 tutorials, 52 steps total
// Designed for a 60-year-old sales rep who has never used AI software

export interface TutorialStep {
  title: string;
  callout: string;
  target?: string; // route or element hint
  exampleValue?: string;
  illustrationType: 'dashboard' | 'form' | 'table' | 'flow' | 'chart' | 'modal' | 'settings' | 'live';
  illustrationConfig: Record<string, unknown>;
}

export interface Tutorial {
  id: string;
  title: string;
  subtitle: string;
  route?: string;
  icon: string; // emoji
  steps: TutorialStep[];
  estimatedMinutes: number;
}

export const TUTORIALS: Tutorial[] = [
  // ─── TUTORIAL 1: Welcome ───
  {
    id: 'welcome',
    title: 'Welcome to Closer AI',
    subtitle: 'Your AI Sales Agent — What It Does',
    icon: '👋',
    estimatedMinutes: 3,
    steps: [
      {
        title: 'What Closer Does',
        callout: 'Closer is an AI that calls your leads for you, talks to them naturally, handles objections, and books appointments — while you watch in real time. No more cold-calling yourself.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'hero',
          kpis: [
            { label: 'AI Agent', value: 'ACTIVE', color: '#10b981' },
            { label: 'Calls Today', value: '47', color: 'var(--ept-accent)' },
            { label: 'Appointments', value: '6', color: '#f59e0b' },
            { label: 'Connection Rate', value: '34%', color: '#8b5cf6' },
          ],
          activity: ['AI booked appointment with Marcus Johnson', 'Call completed — Sarah Mitchell (3:42)', 'Campaign "Solar Q2" started'],
        },
      },
      {
        title: 'The Three-Step Setup',
        callout: 'You set it up once: add your leads, build a script, create a campaign. Then the AI does the calling. You can have it running in under 30 minutes.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: [
            { label: 'Add Leads', icon: '👥', desc: 'Import your contact list' },
            { label: 'Build Script', icon: '📝', desc: 'Tell the AI what to say' },
            { label: 'Create Campaign', icon: '🚀', desc: 'Set it and let it run' },
            { label: 'AI Calls', icon: '🤖', desc: 'Watch it work for you' },
          ],
        },
      },
      {
        title: 'Watch and Collect Results',
        callout: 'You watch the calls happen live, review recordings, and collect booked appointments. The AI handles the grunt work — you close the deals that matter.',
        illustrationType: 'chart',
        illustrationConfig: {
          metrics: [
            { label: 'Appointments Booked', value: '14', trend: '+23%' },
            { label: 'Connection Rate', value: '34%', trend: '+5%' },
            { label: 'Cost / Appointment', value: '$4.17', trend: '-12%' },
          ],
        },
      },
    ],
  },

  // ─── TUTORIAL 2: Settings ───
  {
    id: 'settings',
    title: 'Setting Up Your Business',
    subtitle: 'Configure your account before your first call',
    route: '/closer/settings',
    icon: '⚙️',
    estimatedMinutes: 8,
    steps: [
      {
        title: 'Business Information',
        callout: 'Enter your company name and select your timezone. This tells the AI who it represents and sets your calling hours correctly.',
        target: '/closer/settings',
        exampleValue: 'West Texas Solar LLC',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Company Name', value: 'West Texas Solar LLC', type: 'text' },
            { label: 'Timezone', value: 'America/Chicago (CST)', type: 'select' },
          ],
          highlight: 0,
        },
      },
      {
        title: 'Calling Hours (Business Hours)',
        callout: 'Set the hours your AI agent is allowed to make calls. The AI will never call outside these hours. Most sales teams use Mon-Fri 9am to 7pm.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'hours-grid',
          highlighted: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '9:00 AM', end: '7:00 PM' },
        },
      },
      {
        title: 'AI Voice Selection',
        callout: 'Choose the voice your AI uses on calls. Bobby is a warm male voice great for B2B. Alice is professional female, perfect for services. Listen to samples before picking.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'voice-picker',
          voices: [
            { name: 'Bobby', desc: 'Warm Male', selected: true },
            { name: 'Alice', desc: 'Professional Female', selected: false },
            { name: 'Catherine', desc: 'Calm Female', selected: false },
          ],
        },
      },
      {
        title: 'AI Personality',
        callout: 'Consultative Expert works for most industries — it asks questions before pitching. Choose the style that matches how your best rep would sell.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'personality',
          options: ['Consultative Expert', 'Friendly Advisor', 'Direct Closer', 'Empathetic Listener'],
          selected: 'Consultative Expert',
        },
      },
      {
        title: 'AI Instructions',
        callout: 'Write custom instructions that override the AI\'s default behavior. For example: "Always mention our 0% financing offer" or "If they mention a competitor, highlight our 24/7 support."',
        exampleValue: 'Always mention our 0% financing offer for the first 12 months. If they ask about competitors, highlight our 24/7 local support team in Midland.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'AI Instructions', value: 'Always mention our 0% financing offer for the first 12 months...', type: 'textarea' },
          ],
          highlight: 0,
        },
      },
      {
        title: 'Caller ID Display',
        callout: 'Set the phone number that shows on your leads\' caller ID. Use your real business number — people answer numbers they recognize or can Google.',
        exampleValue: '(432) 555-0100',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Caller ID Number', value: '(432) 555-0100', type: 'text' },
          ],
          highlight: 0,
        },
      },
      {
        title: 'Call Recording',
        callout: 'Enable Call Recording to review every call in your Calls tab. Highly recommended — you can coach the AI and learn what works. All recordings are private and encrypted.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'toggle',
          label: 'Call Recording',
          enabled: true,
          desc: 'Record all calls for review and coaching',
        },
      },
      {
        title: 'Calendar Integration',
        callout: 'Connect your calendar so the AI can book appointments directly into your schedule. Without this, the AI can\'t check your availability or book meetings.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'integration',
          options: ['Google Calendar', 'Outlook Calendar', 'Calendly'],
          connected: 'Google Calendar',
        },
      },
    ],
  },

  // ─── TUTORIAL 3: Scripts ───
  {
    id: 'scripts',
    title: 'Building Your First Script',
    subtitle: 'Tell the AI exactly what to say',
    route: '/closer/scripts',
    icon: '📝',
    estimatedMinutes: 7,
    steps: [
      {
        title: 'What Is a Script?',
        callout: 'A script tells your AI exactly what to say, what questions to ask, and what to do when the lead answers. Think of it as a playbook for your best sales rep — but the AI follows it perfectly every time.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: [
            { label: 'Greeting', icon: '👋', desc: 'Open the conversation' },
            { label: 'Discovery', icon: '🔍', desc: 'Ask qualifying questions' },
            { label: 'Pitch', icon: '💡', desc: 'Present your solution' },
            { label: 'Booking', icon: '📅', desc: 'Set the appointment' },
          ],
        },
      },
      {
        title: 'Click "Create Script"',
        callout: 'Click the Create Script button in the top-right corner to start building. You\'ll name it and pick your industry.',
        target: '/closer/scripts',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'button-highlight',
          buttonText: '+ Create Script',
          position: 'top-right',
          existingScripts: ['Insurance Opener v1', 'Solar Discovery Call'],
        },
      },
      {
        title: 'Name and Description',
        callout: 'Name it something you\'ll remember — you may build 5-10 scripts over time. The description helps you (and your team) know when to use this script.',
        exampleValue: 'Solar Opener v2',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Script Name', value: 'Solar Opener v2', type: 'text' },
            { label: 'Description', value: 'First contact for West Texas residential solar leads. Qualifies on home ownership, electric bill, and roof age before booking site survey.', type: 'textarea' },
            { label: 'Industry', value: 'Solar / Renewable Energy', type: 'select' },
          ],
          highlight: 0,
        },
      },
      {
        title: 'Conversation Steps',
        callout: 'Each step is one part of the conversation. Start with an opener, add discovery questions, then a pitch and booking step. The AI follows these in order.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: [
            { label: 'Step 1: Opener', icon: '1️⃣', desc: '"Hi, this is Alex from West Texas Solar..."' },
            { label: 'Step 2: Discovery', icon: '2️⃣', desc: 'Ask about electric bill, home ownership' },
            { label: 'Step 3: Booking', icon: '3️⃣', desc: '"I\'d love to schedule a free site survey..."' },
          ],
        },
      },
      {
        title: 'Step Types Explained',
        callout: 'DISCOVERY = AI asks qualifying questions to see if the lead is a good fit. BOOKING = AI tries to set an appointment. CONSENT_CHECK = required for compliance — AI asks permission to continue.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Type', 'What It Does', 'When to Use'],
          rows: [
            ['DISCOVERY', 'AI asks qualifying questions', 'Early in call — find out if they\'re a fit'],
            ['BOOKING', 'AI tries to set appointment', 'After qualifying — close the deal'],
            ['CONSENT_CHECK', 'AI asks permission', 'Required for TCPA compliance'],
          ],
        },
      },
      {
        title: 'Add Discovery Questions',
        callout: 'Add at least 2-3 discovery questions. These are the specific questions the AI will ask to qualify the lead before pitching. Good questions = better appointments.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Question 1', value: 'What is your average monthly electric bill?', type: 'text' },
            { label: 'Question 2', value: 'Do you own your home or rent?', type: 'text' },
            { label: 'Question 3', value: 'How old is your roof?', type: 'text' },
          ],
          highlight: -1,
          addButton: '+ Add Question',
        },
      },
      {
        title: 'Save and Activate',
        callout: 'Toggle Active to make this script available for campaigns. Inactive scripts won\'t be used by the AI. You can edit scripts anytime — changes take effect on the next call.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'toggle',
          label: 'Script Status',
          enabled: true,
          desc: 'Active — available for campaigns',
        },
      },
    ],
  },

  // ─── TUTORIAL 4: Leads ───
  {
    id: 'leads',
    title: 'Adding Your Leads',
    subtitle: 'Give the AI people to call',
    route: '/closer/leads',
    icon: '👥',
    estimatedMinutes: 6,
    steps: [
      {
        title: 'Add a Lead Manually',
        callout: 'Click "Add Lead" to add one lead at a time. Use this for individual referrals or high-value prospects you want to track carefully.',
        target: '/closer/leads',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'button-highlight',
          buttonText: '+ Add Lead',
          position: 'top-right',
          existingItems: ['Marcus Johnson — Acme Corp', 'Sarah Mitchell — Solar Plus'],
        },
      },
      {
        title: 'Lead Form Fields',
        callout: 'Phone number is required — that\'s what the AI calls. Everything else helps the AI personalize the conversation. More detail = better calls.',
        exampleValue: 'Marcus Johnson',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'First Name', value: 'Marcus', type: 'text' },
            { label: 'Last Name', value: 'Johnson', type: 'text' },
            { label: 'Company', value: 'Acme Corp', type: 'text' },
            { label: 'Phone', value: '(432) 555-0192', type: 'text', required: true },
            { label: 'Email', value: 'marcus@acme.com', type: 'text' },
            { label: 'Status', value: 'New', type: 'select' },
            { label: 'Notes', value: 'Referred by Jim at the Midland Chamber', type: 'textarea' },
          ],
          highlight: 3,
        },
      },
      {
        title: 'CSV Import',
        callout: 'Have a list of leads in a spreadsheet? Click "CSV Import" to upload hundreds at once. Your CSV needs at minimum a "phone" column. Name, email, and company columns are optional but recommended.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Import Leads from CSV',
          content: 'upload',
          sampleHeaders: ['first_name', 'last_name', 'phone', 'email', 'company'],
          sampleRow: ['Marcus', 'Johnson', '(432) 555-0192', 'marcus@acme.com', 'Acme Corp'],
        },
      },
      {
        title: 'Lead Status Pipeline',
        callout: 'These statuses update automatically as the AI calls. "New" = hasn\'t been called. "Contacted" = AI reached them. "Appointment Set" = the AI booked a meeting for you.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: [
            { label: 'New', icon: '🆕', desc: 'Not yet called', color: '#64748b' },
            { label: 'Contacted', icon: '📞', desc: 'AI reached them', color: '#3b82f6' },
            { label: 'Qualified', icon: '✅', desc: 'Good prospect', color: '#8b5cf6' },
            { label: 'Appt Set', icon: '📅', desc: 'Meeting booked!', color: '#10b981' },
            { label: 'Converted', icon: '🎉', desc: 'Deal closed', color: '#f59e0b' },
          ],
        },
      },
      {
        title: 'Search and Filter',
        callout: 'Use the status filter dropdown to see only your hot leads, only uncontacted leads, or only those with appointments. The search bar finds leads by name, phone, or company.',
        illustrationType: 'table',
        illustrationConfig: {
          filterLabel: 'All Statuses',
          headers: ['Name', 'Company', 'Phone', 'Status', 'Last Contact'],
          rows: [
            ['Marcus Johnson', 'Acme Corp', '(432) 555-0192', 'Appointment Set', '2 hours ago'],
            ['Sarah Mitchell', 'Solar Plus', '(432) 555-0283', 'Contacted', 'Yesterday'],
            ['David Thompson', 'Thompson LLC', '(432) 555-0374', 'New', '—'],
          ],
        },
      },
      {
        title: 'Call a Lead Directly',
        callout: 'Need to call a specific lead yourself? Hit the "Call" button on any lead to have the AI dial them right now, outside of any campaign.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'button-highlight',
          buttonText: 'Call',
          position: 'inline',
          context: 'Marcus Johnson — (432) 555-0192',
        },
      },
    ],
  },

  // ─── TUTORIAL 5: Campaigns ───
  {
    id: 'campaigns',
    title: 'Creating Your First Campaign',
    subtitle: 'Connect leads + scripts and let the AI call',
    route: '/closer/campaigns',
    icon: '🚀',
    estimatedMinutes: 7,
    steps: [
      {
        title: 'What Is a Campaign?',
        callout: 'A campaign connects your leads to a script and tells the AI when and how many calls to make per hour. Think of it as a "calling session" — you create one, assign leads, and press go.',
        illustrationType: 'flow',
        illustrationConfig: {
          steps: [
            { label: 'Leads', icon: '👥', desc: '25 solar prospects' },
            { label: 'Script', icon: '📝', desc: 'Solar Opener v2' },
            { label: 'Campaign', icon: '🚀', desc: 'West Texas Solar Q2' },
            { label: 'AI Calls', icon: '📞', desc: '10 calls/hour' },
          ],
        },
      },
      {
        title: 'Click "Create Campaign"',
        callout: 'Click Create Campaign to start. You\'ll need at least one active script and some leads before this works. If you don\'t have those yet, go build them first.',
        target: '/closer/campaigns',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'button-highlight',
          buttonText: '+ Create Campaign',
          position: 'top-right',
          existingItems: [],
        },
      },
      {
        title: 'Campaign Settings',
        callout: 'Name your campaign something descriptive. Start with 5-10 calls per hour — too many simultaneous calls hurts connection rates. You can increase later.',
        exampleValue: 'West Texas Solar Q2',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Campaign Name', value: 'West Texas Solar Q2', type: 'text' },
            { label: 'Campaign Type', value: 'Blended', type: 'select' },
            { label: 'Calls Per Hour', value: '10', type: 'number' },
            { label: 'Script', value: 'Solar Opener v2', type: 'select' },
          ],
          highlight: 2,
        },
      },
      {
        title: 'Assign Leads',
        callout: 'Click "Assign Leads" and check which leads go into this campaign. You can assign leads to multiple campaigns. The AI will call each lead once per campaign unless you reset them.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Assign Leads to Campaign',
          content: 'checklist',
          items: [
            { name: 'Marcus Johnson — Acme Corp', checked: true },
            { name: 'Sarah Mitchell — Solar Plus', checked: true },
            { name: 'David Thompson — Thompson LLC', checked: false },
            { name: 'Lisa Williams — Williams & Co', checked: false },
          ],
          actionButton: 'Assign 2 Leads',
        },
      },
      {
        title: 'Campaign Statuses',
        callout: 'Campaigns start as Draft. Toggle to Active when you\'re ready for the AI to start calling. You can pause anytime — all progress is saved.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Status', 'What Happens', 'When to Use'],
          rows: [
            ['Draft', 'AI will NOT call', 'While you\'re still setting up'],
            ['Active', 'AI starts calling immediately', 'When you\'re ready to go'],
            ['Paused', 'AI stops calling, saves progress', 'Need a break or reviewing results'],
            ['Completed', 'All leads have been called', 'Campaign finished naturally'],
          ],
        },
      },
      {
        title: 'Monitoring Live Metrics',
        callout: 'Once Active, watch these numbers in real time. "Connected" tells you how many leads picked up. "Appts" tells you how many appointments the AI booked. "Conv." is your conversion rate.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'hero',
          kpis: [
            { label: 'Dialed', value: '47', color: 'var(--ept-text)' },
            { label: 'Connected', value: '16', color: '#3b82f6' },
            { label: 'Appts', value: '6', color: '#10b981' },
            { label: 'Conv.', value: '37.5%', color: '#f59e0b' },
          ],
        },
      },
      {
        title: 'Pausing and Resuming',
        callout: 'Need to stop the AI from calling? Switch the campaign back to Draft or Paused. All progress is saved. Switch back to Active whenever you\'re ready to continue.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'toggle',
          label: 'Campaign Status',
          enabled: true,
          desc: 'Active — AI is calling leads now',
        },
      },
    ],
  },

  // ─── TUTORIAL 6: Calls ───
  {
    id: 'calls',
    title: 'Monitoring Calls & History',
    subtitle: 'Watch live calls and review recordings',
    route: '/closer/calls',
    icon: '📞',
    estimatedMinutes: 6,
    steps: [
      {
        title: 'Live Calls',
        callout: 'Live Calls shows every call happening RIGHT NOW. Watch the AI work in real time — see the transcript update as the conversation happens, and take over if needed.',
        target: '/closer/calls/live',
        illustrationType: 'live',
        illustrationConfig: {
          activeCalls: [
            { name: 'Sarah Mitchell', duration: '2:34', status: 'In Progress', transcript: 'AI: "I understand your concern about upfront costs. We actually offer 0% financing for the first 12 months..."' },
          ],
        },
      },
      {
        title: 'Call History',
        callout: 'Call History shows every completed call. You can see who was called, how long the call lasted, whether it was inbound or outbound, and what happened.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Lead', 'Duration', 'Direction', 'Campaign', 'Status'],
          rows: [
            ['Marcus Johnson', '3:42', 'Outbound', 'Solar Q2', 'Appointment Set'],
            ['Sarah Mitchell', '1:15', 'Outbound', 'Solar Q2', 'Voicemail'],
            ['David Thompson', '4:08', 'Outbound', 'Solar Q2', 'Interested'],
            ['Lisa Williams', '0:22', 'Outbound', 'Solar Q2', 'No Answer'],
          ],
        },
      },
      {
        title: 'Filtering Calls',
        callout: 'Filter by status (Answered, Voicemail, No Answer), direction (Inbound/Outbound), or date range. Use "Clear All" to reset filters and see everything.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'filters',
          filters: [
            { label: 'Status', value: 'All Statuses' },
            { label: 'Direction', value: 'All Directions' },
            { label: 'Date', value: 'All Time' },
          ],
        },
      },
      {
        title: 'Opening a Call Record',
        callout: 'Click any call to see the full details: complete transcript, AI coaching notes, call recording, and cost breakdown. This is where you learn what works.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'detail',
          sections: ['Full Transcript', 'Coaching Notes', 'Recording Player', 'Cost Breakdown'],
        },
      },
      {
        title: 'Coaching Notes',
        callout: 'The AI reviews every call and gives you specific coaching notes. Things like "Lead showed buying signals at 1:23 — could have pushed for appointment sooner." Read these — they make you better.',
        illustrationType: 'form',
        illustrationConfig: {
          fields: [
            { label: 'Coaching Notes', value: '1. Lead expressed interest in financing — AI handled well by mentioning 0% offer.\n2. Objection about roof age came at 2:15 — AI could probe deeper on replacement timeline.\n3. Strong close attempt at 3:20 — appointment booked successfully.', type: 'textarea' },
          ],
          highlight: -1,
        },
      },
      {
        title: 'Cost Breakdown',
        callout: 'See exactly what each call cost. Deepgram handles speech-to-text ($0.01-0.03). ElevenLabs handles the AI voice ($0.03-0.08). LLM is the AI brain ($0.02-0.05). Normal total: $0.10-0.30 per call.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Component', 'Purpose', 'Cost'],
          rows: [
            ['Deepgram STT', 'Listens to the lead\'s voice', '$0.024'],
            ['ElevenLabs TTS', 'Generates the AI\'s voice', '$0.067'],
            ['LLM (AI Brain)', 'Decides what to say', '$0.038'],
            ['Total', '', '$0.129'],
          ],
          highlightLast: true,
        },
      },
    ],
  },

  // ─── TUTORIAL 7: Analytics ───
  {
    id: 'analytics',
    title: 'Understanding Your Analytics',
    subtitle: 'Track ROI and optimize performance',
    route: '/closer/analytics',
    icon: '📊',
    estimatedMinutes: 5,
    steps: [
      {
        title: 'Key Metrics at a Glance',
        callout: 'These 5 numbers tell the whole story. Cost/Appointment is what matters most — lower is better. If you\'re spending less than $5 per appointment, you\'re beating 90% of human SDR teams.',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'hero',
          kpis: [
            { label: 'Appointments Booked', value: '14', color: '#10b981' },
            { label: 'Connection Rate', value: '34%', color: '#3b82f6' },
            { label: 'Avg Call Duration', value: '2:47', color: '#8b5cf6' },
            { label: 'Cost/Appointment', value: '$4.17', color: '#f59e0b' },
            { label: 'Avg per Call', value: '$0.18', color: 'var(--ept-accent)' },
          ],
        },
      },
      {
        title: 'Call Dispositions',
        callout: 'Dispositions show what happened on each call — Answered, Voicemail, No Answer, Booked, Declined. A healthy campaign has 30%+ connection rate and 10%+ booking rate.',
        illustrationType: 'chart',
        illustrationConfig: {
          type: 'bar',
          data: [
            { label: 'Answered', value: 45, color: '#10b981' },
            { label: 'Voicemail', value: 32, color: '#f59e0b' },
            { label: 'No Answer', value: 18, color: '#64748b' },
            { label: 'Busy', value: 5, color: '#ef4444' },
          ],
        },
      },
      {
        title: 'Calls by Hour',
        callout: 'See which hours get the best connection rates. Use this to optimize your Business Hours setting. Most B2B leads answer best 10am-11am and 2pm-4pm.',
        illustrationType: 'chart',
        illustrationConfig: {
          type: 'bar',
          data: [
            { label: '9am', value: 28, color: '#3b82f6' },
            { label: '10am', value: 42, color: '#10b981' },
            { label: '11am', value: 38, color: '#10b981' },
            { label: '12pm', value: 15, color: '#f59e0b' },
            { label: '1pm', value: 20, color: '#3b82f6' },
            { label: '2pm', value: 35, color: '#10b981' },
            { label: '3pm', value: 40, color: '#10b981' },
            { label: '4pm', value: 30, color: '#3b82f6' },
            { label: '5pm', value: 12, color: '#f59e0b' },
          ],
        },
      },
      {
        title: 'Cost Breakdown',
        callout: 'Your total AI cost broken down by component. LLM (the AI brain) is usually the biggest cost. Total is normally $0.10-$0.30 per call. If you\'re above $0.50, check your script length.',
        illustrationType: 'table',
        illustrationConfig: {
          headers: ['Component', 'Cost', '% of Total'],
          rows: [
            ['Deepgram (Speech-to-Text)', '$12.40', '22%'],
            ['ElevenLabs (AI Voice)', '$24.80', '44%'],
            ['LLM (AI Brain)', '$19.20', '34%'],
          ],
          highlightLast: false,
        },
      },
      {
        title: 'Date Range Filtering',
        callout: 'Change to "Last 7 Days" or "This Month" to compare performance periods. Look for trends — is your connection rate improving? Is cost per appointment going down?',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'filters',
          filters: [
            { label: 'Time Period', value: 'Last 7 Days' },
          ],
          options: ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'All Time'],
        },
      },
    ],
  },

  // ─── TUTORIAL 8: Full Workflow ───
  {
    id: 'full-workflow',
    title: 'Start to First Appointment',
    subtitle: 'The complete walkthrough — do this your first day',
    icon: '🏆',
    estimatedMinutes: 10,
    steps: [
      {
        title: 'Step 1: Set Up Settings',
        callout: 'Go to Settings and enter your company name, timezone, select an AI voice, and set your calling hours. This takes 5 minutes and only needs to be done once.',
        target: '/closer/settings',
        illustrationType: 'flow',
        illustrationConfig: { steps: [{ label: 'Settings', icon: '⚙️', desc: 'Company, voice, hours', color: 'var(--ept-accent)' }], linkTo: 'settings' },
      },
      {
        title: 'Step 2: Build a Script',
        callout: 'Go to Scripts and create your first sales script. Name it, add an opener, 2-3 discovery questions, and a booking step. Toggle it to Active.',
        target: '/closer/scripts',
        illustrationType: 'flow',
        illustrationConfig: { steps: [{ label: 'Script', icon: '📝', desc: 'What the AI says', color: 'var(--ept-accent)' }], linkTo: 'scripts' },
      },
      {
        title: 'Step 3: Add Your Leads',
        callout: 'Go to Leads and add at least 5-10 leads. You can type them in one at a time or upload a CSV file. Make sure every lead has a phone number.',
        target: '/closer/leads',
        illustrationType: 'flow',
        illustrationConfig: { steps: [{ label: 'Leads', icon: '👥', desc: '5-10 contacts minimum', color: 'var(--ept-accent)' }], linkTo: 'leads' },
      },
      {
        title: 'Step 4: Create a Campaign',
        callout: 'Go to Campaigns and create one. Pick your script, set calls per hour to 5-10, and leave it in Draft for now.',
        target: '/closer/campaigns',
        illustrationType: 'flow',
        illustrationConfig: { steps: [{ label: 'Campaign', icon: '🚀', desc: 'Connect leads + script', color: 'var(--ept-accent)' }], linkTo: 'campaigns' },
      },
      {
        title: 'Step 5: Assign Leads to Campaign',
        callout: 'In your campaign, click "Assign Leads" and select the leads you want the AI to call. Check at least 5 to give the AI enough to work with.',
        illustrationType: 'modal',
        illustrationConfig: {
          title: 'Assign Leads',
          content: 'checklist',
          items: [
            { name: 'Marcus Johnson', checked: true },
            { name: 'Sarah Mitchell', checked: true },
            { name: 'David Thompson', checked: true },
            { name: 'Lisa Williams', checked: true },
            { name: 'Robert Chen', checked: true },
          ],
          actionButton: 'Assign 5 Leads',
        },
      },
      {
        title: 'Step 6: Go Active!',
        callout: 'Toggle your campaign to Active. The AI will immediately start dialing leads according to your schedule and calling hours. This is the moment it all comes together.',
        illustrationType: 'settings',
        illustrationConfig: {
          type: 'toggle',
          label: 'Campaign Status',
          enabled: true,
          desc: 'ACTIVE — AI is now calling your leads!',
          color: '#10b981',
        },
      },
      {
        title: 'Step 7: Watch Live Calls',
        callout: 'Go to Calls > Live Calls and watch the AI work. You\'ll see the conversation transcript updating in real time. You can whisper-coach or take over if needed.',
        target: '/closer/calls/live',
        illustrationType: 'live',
        illustrationConfig: {
          activeCalls: [
            { name: 'Marcus Johnson', duration: '1:47', status: 'In Progress', transcript: 'AI: "That\'s great to hear you own your home, Marcus. Quick question — what does your average electric bill look like?"' },
          ],
        },
      },
      {
        title: 'Step 8: First Appointment Books!',
        callout: 'When the AI books an appointment, you\'ll see a notification. The appointment appears in your Appointments tab and on your connected calendar. Congratulations — your AI agent just closed!',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'notification',
          message: 'Appointment Booked! Marcus Johnson — Site Survey — Tomorrow 2:00 PM',
          icon: '🎉',
        },
      },
      {
        title: 'Step 9: Review the Call',
        callout: 'Go to Calls, find the call, and review the full transcript. Read the Coaching Notes to see what the AI did well and what could improve. This is how you fine-tune your script.',
        target: '/closer/calls',
        illustrationType: 'dashboard',
        illustrationConfig: {
          type: 'detail',
          sections: ['Transcript', 'Coaching Notes', 'Recording'],
        },
      },
      {
        title: 'Step 10: Check Your ROI',
        callout: 'Go to Analytics and look at Cost/Appointment. If it\'s under $5, you\'re crushing it. Compare to what a human SDR costs ($50-100/appointment). That\'s the power of Closer AI.',
        target: '/closer/analytics',
        illustrationType: 'chart',
        illustrationConfig: {
          type: 'comparison',
          items: [
            { label: 'Closer AI', value: '$4.17', color: '#10b981' },
            { label: 'Human SDR', value: '$67.00', color: '#ef4444' },
          ],
        },
      },
    ],
  },
];

export const QUICK_REFERENCE = [
  { action: 'Create a script', where: 'Scripts tab', howTo: 'Click "Create Script" top-right' },
  { action: 'Add leads', where: 'Leads tab', howTo: 'Click "Add Lead" or "CSV Import"' },
  { action: 'Create campaign', where: 'Campaigns tab', howTo: 'Click "Create Campaign"' },
  { action: 'Start calling', where: 'Campaigns tab', howTo: 'Toggle campaign to Active' },
  { action: 'Watch live calls', where: 'Calls tab', howTo: '"Live Calls" section at top' },
  { action: 'See bookings', where: 'Analytics tab', howTo: '"Appointments Booked" metric' },
  { action: 'Change AI voice', where: 'Settings → AI Voice', howTo: 'Select from Bobby/Alice/Catherine' },
  { action: 'Set calling hours', where: 'Settings → Business Hours', howTo: 'Toggle hour blocks on/off' },
];

export const CONTEXT_TRIGGERS: Record<string, { tutorialId: string; stepIndex: number }> = {
  '/closer/scripts': { tutorialId: 'scripts', stepIndex: 0 },
  '/closer/leads': { tutorialId: 'leads', stepIndex: 0 },
  '/closer/campaigns': { tutorialId: 'campaigns', stepIndex: 0 },
  '/closer/calls': { tutorialId: 'calls', stepIndex: 0 },
  '/closer/analytics': { tutorialId: 'analytics', stepIndex: 0 },
  '/closer/settings': { tutorialId: 'settings', stepIndex: 0 },
};
