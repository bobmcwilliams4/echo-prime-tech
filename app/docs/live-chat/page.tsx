'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Live Chat',
  tagline: 'Embeddable customer support chat with real-time messaging, AI auto-responses, agent management, and customizable widgets for any website.',
  accent: '#0ea5e9',
  productUrl: '/live-chat',
  workerUrl: 'https://echo-live-chat.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Live Chat is a complete customer messaging platform that puts a fully functional chat widget on any website in under 5 minutes. A single JavaScript embed tag at widget.js?id=X loads a configurable chat widget that handles everything from pre-chat lead capture forms to multi-agent support queues to post-conversation satisfaction ratings — no additional server infrastructure required.',
    'Real-time messaging uses a 3-second polling architecture that works across all browsers and corporate firewalls without requiring WebSockets or special server configurations. When no agents are available, AI auto-responses powered by the Engine Runtime GEN-01 model handle common questions immediately, maintaining conversation continuity and capturing contact information for agent follow-up. Business hours settings automatically switch between live agent mode and AI-only mode based on your configured schedule.',
    'The agent management console handles the human side of the operation — automatic conversation assignment based on agent availability and concurrent chat limits, online/away/offline status controls, canned response libraries for fast replies, and custom triggers that fire chat invitations based on visitor behavior. Every conversation, visitor interaction, and agent response is tracked in the analytics system with daily and weekly trend reporting.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Widget', desc: 'Sign in to echo-ept.com/live-chat and click "New Widget." Set your widget name, choose your primary color to match your brand, customize the greeting message, and select the position (bottom-right or bottom-left). Your unique widget ID is assigned immediately.' },
    { step: 2, title: 'Embed on Your Website', desc: 'Copy the one-line JavaScript embed snippet from the widget settings page. Paste it into your website\'s <head> or before the closing </body> tag. The widget appears immediately on your site — no rebuild or redeployment required in most CMS platforms.' },
    { step: 3, title: 'Configure Pre-Chat Form', desc: 'Optionally enable a pre-chat form that collects visitor name and email before the conversation starts. This ensures agents always have contact information and integrates directly with your CRM via webhook on form submission.' },
    { step: 4, title: 'Add Your Agents', desc: 'Invite team members as agents from Settings > Agents. Assign concurrent chat limits (default: 5 chats per agent), configure auto-assignment rules, and set up email notifications for new conversations when agents are offline.' },
    { step: 5, title: 'Configure AI Fallback', desc: 'Enable AI auto-responses in Settings > AI. Set the response delay (e.g., reply after 30 seconds if no agent responds), configure the AI\'s knowledge base context (your product descriptions, FAQs, policies), and set handoff triggers to escalate AI conversations to a live agent.' },
  ],

  features: [
    { title: 'Embeddable JS Widget', desc: 'Single-line JavaScript embed at widget.js?id=X. Loads asynchronously without affecting page performance. Fully customizable appearance, position, size, and greeting text. Works on any HTML website, React app, Next.js, WordPress, Shopify, and every major CMS.' },
    { title: 'Pre-Chat Forms', desc: 'Configurable pre-chat forms collect visitor name, email, phone, department selection, and custom fields before the conversation starts. Form data is stored with the conversation and can be forwarded to your CRM via webhook on submission.' },
    { title: 'Real-Time 3s Polling', desc: 'Conversation polling every 3 seconds ensures messages appear promptly without requiring WebSockets. Works reliably behind corporate proxies, firewalls, and in all browsers. The polling interval is configurable from 1-10 seconds based on your responsiveness requirements.' },
    { title: 'AI Auto-Responses', desc: 'Engine Runtime GEN-01 powers intelligent fallback responses when no agent is available. The AI has access to your configured knowledge base context, can answer product questions, collect contact details, and create support tickets. Smooth handoff to live agents when they become available.' },
    { title: 'Agent Management', desc: 'Full agent console with online/away/offline status controls, concurrent chat limits per agent, and auto-assignment rules (round-robin, least-loaded, department-based). Agents receive desktop notifications for new conversations and can transfer chats to colleagues.' },
    { title: 'Widget Customization', desc: 'Configure widget colors, fonts, greeting messages, avatar, position, and display rules. Show or hide the widget on specific pages, to specific visitor segments, or during specific hours. A/B test different widget configurations to optimize engagement.' },
    { title: 'Business Hours', desc: 'Define your support team\'s business hours per day of week and timezone. Outside business hours, the widget automatically switches to offline mode — showing expected response time, accepting messages for async follow-up, or enabling AI-only mode for 24/7 automated responses.' },
    { title: 'Canned Responses', desc: 'Build a library of pre-written responses for common questions. Agents access canned responses with a "/" shortcut in the chat console. Organize by category (Billing, Technical, Sales, Returns). Track usage to identify which canned responses are most valuable.' },
    { title: 'Trigger-Based Invitations', desc: 'Configure proactive chat invitations based on visitor behavior — invite after 30 seconds on a pricing page, offer help when a visitor clicks "Contact Us," or trigger when an exit intent scroll event fires. Triggers fire personalized invitation messages with accept/decline buttons.' },
    { title: 'Visitor Tracking', desc: 'See real-time visitor data in the agent console — current page, time on site, pages visited, geography, device type, referral source, and any CRM-linked identity data for known contacts. Context before the first message makes every conversation more productive.' },
    { title: 'Conversation Ratings', desc: 'Automatically send a satisfaction rating request (1-5 stars + optional comment) when conversations close. Track CSAT scores by agent, team, time period, and widget. Low-rated conversations trigger supervisor notifications for quality review.' },
    { title: 'Domain Allowlist', desc: 'Restrict which domains can load your widget using a domain allowlist. Prevents unauthorized use of your widget ID on external websites. Configure per-widget allowlists with wildcard support (e.g., *.yourcompany.com).' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/widget.js', desc: 'Public widget loader script. Accepts ?id=WIDGET_ID query parameter. Returns the embeddable JavaScript that initializes the chat widget with the specified configuration. No auth required.', auth: false },
    { method: 'POST', path: '/api/conversations', desc: 'Create a new conversation programmatically. Used by the widget internally and available for API integrations. Accepts visitor info, initial message, and pre-chat form data.', auth: false },
    { method: 'GET', path: '/api/conversations/:id/messages', desc: 'Poll for new messages in a conversation since a given timestamp. Returns all messages with sender type (visitor, agent, ai), content, and timestamps. Used by the widget polling loop.', auth: false },
    { method: 'POST', path: '/api/conversations/:id/messages', desc: 'Send a message to a conversation. Authenticated for agent messages. Accepts text content and optional file attachment. Triggers AI response evaluation if no agent is assigned.', auth: true },
    { method: 'GET', path: '/api/widgets/:id/config', desc: 'Get widget configuration for a given widget ID — appearance settings, greeting, pre-chat form fields, business hours, and trigger rules. Called by the widget loader on initialization.', auth: false },
    { method: 'PUT', path: '/api/agents/:id/status', desc: 'Update an agent\'s availability status (online, away, offline). Online agents are eligible for conversation assignment. Away agents complete existing chats but receive no new assignments.', auth: true },
    { method: 'GET', path: '/api/analytics/conversations', desc: 'Get conversation analytics for a date range — total conversations, average response time, resolution rate, CSAT scores, busiest hours, and top visitor questions. Filterable by widget, agent, and date range.', auth: true },
    { method: 'POST', path: '/api/widgets/:id/triggers', desc: 'Create a new trigger rule for a widget — specify the trigger condition (time on page, page URL match, exit intent, scroll depth), delay, and invitation message. Triggers are evaluated client-side by the widget JavaScript.', auth: true },
  ],

  userGuide: [
    {
      id: 'widget-installation',
      title: 'Widget Installation & Configuration',
      content: [
        'Installing Echo Live Chat on your website requires adding one JavaScript snippet to your HTML. Navigate to your widget settings page and copy the embed code — it looks like this: <script src="https://echo-live-chat.bmcii1976.workers.dev/widget.js?id=YOUR_WIDGET_ID" async></script>. Paste this tag in your site\'s <head> section or directly before the </body> closing tag. The widget loads asynchronously so it never blocks your page rendering.',
        'For Next.js and React applications, use the Script component from next/script or add it via useEffect for client-side only loading. WordPress users can add the snippet via a custom HTML widget in the footer, the Site Kit plugin, or a theme\'s additional scripts field. Shopify merchants paste the snippet in the Online Store > Themes > Edit Code > theme.liquid template.',
        'The widget configuration console at echo-ept.com/live-chat lets you change every visual aspect without editing code. Color, position, greeting text, avatar image, bubble icon, and widget size are all configurable from the dashboard and take effect within 60 seconds on all live instances. Display rules (show on specific pages, hide on checkout, only show to returning visitors) use URL match patterns and JavaScript condition expressions.',
      ],
    },
    {
      id: 'agent-console',
      title: 'The Agent Console',
      content: [
        'Agents access the live chat console at echo-ept.com/live-chat/console. The console shows all active conversations in a sidebar with color-coded indicators — green for assigned to you, yellow for unassigned queue, gray for AI-handled. Click any conversation to open it in the main panel where you can read the full history including pre-chat form data and visitor context.',
        'The visitor context panel on the right shows the current visitor\'s location, device, referral source, current page, and pages visited in this session. For returning visitors or contacts matched from your CRM, it shows their name, account status, and conversation history. This context helps you personalize your first message and anticipate the nature of the request.',
        'Use the "/" shortcut key in the message input to search and insert canned responses. Start typing any word from the response title or content to filter the list. Select with Enter or click. The full canned response text inserts into the message field for editing before sending — you always have the final say before the message goes to the visitor.',
      ],
    },
    {
      id: 'ai-auto-responses',
      title: 'AI Auto-Responses',
      content: [
        'The AI auto-response system activates when a visitor sends a message and no agent accepts it within your configured response timeout (default 30 seconds, configurable from 10-300 seconds). The AI uses the Engine Runtime GEN-01 model with access to the knowledge base context you provided in Settings > AI — this should include your product descriptions, pricing information, frequently asked questions, return policies, and any other information the AI needs to answer visitor questions accurately.',
        'Configure the AI\'s behavior per widget: enable or disable AI responses, set the response delay, specify whether the AI should identify itself as an AI or as a generic assistant, and define escalation triggers. Escalation triggers detect conversation signals that indicate the visitor needs a human — phrases like "speak to a person," expressions of frustration, questions about account-specific issues, or conversation duration exceeding a threshold. When triggered, the AI sends a handoff message and creates an urgent notification for available agents.',
        'Review AI conversation quality from the Analytics > AI Performance tab. This shows the percentage of AI conversations that were escalated to agents, average visitor satisfaction scores on AI-handled conversations, the most common questions the AI could not answer confidently (low-confidence responses are flagged), and response accuracy ratings submitted by agents who reviewed AI transcripts. Use these insights to improve your knowledge base context.',
      ],
    },
    {
      id: 'triggers-proactive',
      title: 'Triggers & Proactive Chat',
      content: [
        'Triggers let you proactively invite visitors to chat before they reach out — dramatically increasing engagement on high-intent pages like pricing, demo requests, and checkout. Each trigger has a condition (page URL contains "/pricing," time on page exceeds 45 seconds, visitor moves mouse toward browser exit), a delay (wait 5 seconds after condition fires before showing the invitation), and a message ("Noticed you\'re checking out our pricing — want a quick rundown of which plan is right for you?").',
        'Triggers can be configured to fire only once per visitor session, only to visitors who have not previously chatted, only during business hours, or only to visitors from specific geographic regions. Stack multiple conditions with AND/OR logic to target precisely. For example: URL contains "/enterprise" AND time on page > 30s AND first visit = true.',
        'Monitor trigger performance in Analytics > Triggers. The conversion rate for each trigger (invitations shown vs conversations started) tells you which trigger messages are resonating. A pricing page trigger with a 35% conversion rate is highly valuable — a generic trigger with 2% conversion is creating noise. A/B test trigger messages by creating two trigger variants and routing 50% of qualifying visitors to each.',
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      content: [
        'The conversation analytics dashboard provides daily and weekly snapshots of your live chat operation. Key metrics include total conversations started, average first response time (time from visitor\'s first message to first agent reply), average resolution time, and CSAT scores. These are shown with trend arrows indicating improvement or decline vs the prior period.',
        'The heat map shows conversation volume by hour of day and day of week — essential for staffing decisions. If 40% of your conversations happen between 10am-2pm on weekdays but you\'re running the same number of agents at all hours, you\'re either under-serving the busy period or over-staffing the slow periods. Use the heat map to right-size your agent schedule.',
        'Per-agent reporting shows each agent\'s conversation count, average response time, resolution rate, and CSAT score. Use this for performance reviews and to identify training opportunities. Agents with high conversation counts but low CSAT scores may need additional product training or coaching on de-escalation. Agents with low response times and high CSAT scores are your stars — study their canned responses and approach for team-wide adoption.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Contextual Auto-Response', desc: 'GEN-01 generates contextually appropriate responses to visitor questions using your configured knowledge base. The model maintains conversation history within each session to provide coherent follow-up answers rather than treating each message as independent. Confidence scores below 0.7 trigger human escalation rather than risking an inaccurate AI response.' },
    { capability: 'Intent Classification', desc: 'Classifies each incoming message by intent — support request, sales inquiry, billing question, complaint, general information, or escalation signal — before routing decisions are made. Intent classification informs auto-assignment (route sales intents to sales agents, support intents to support), AI response selection, and analytics categorization.' },
    { capability: 'Conversation Summarization', desc: 'When an agent takes over an AI-handled conversation or a conversation transfers between agents, an AI-generated summary appears at the top of the chat — covering the visitor\'s issue, information already collected, and any steps already attempted. Agents no longer read entire transcripts to get up to speed.' },
    { capability: 'Sentiment Monitoring', desc: 'Real-time sentiment analysis flags conversations where visitor tone is shifting negative — rising frustration, repeated questions, expressions of dissatisfaction. Sentiment alerts appear on the supervisor dashboard as color-coded indicators on conversation cards. Supervisors can silently monitor flagged conversations and intervene before they escalate.' },
    { capability: 'Optimal Response Suggestions', desc: 'As agents type responses, the AI suggests completions and improvements — more empathetic phrasing, clearer explanations, or relevant canned responses from the library. Suggestions appear inline and can be accepted with Tab or ignored. Helps junior agents respond with the quality of your best agents.' },
    { capability: 'Visitor Propensity Scoring', desc: 'Scores each visitor\'s purchase propensity in real time based on their behavior — pages visited, time on pricing page, return visit frequency, and content engagement patterns. High-propensity visitors trigger priority routing to your most experienced sales agents and proactive chat invitations with sales-focused messages.' },
  ],

  troubleshooting: [
    { issue: 'Widget not appearing on website after embedding the script', solution: 'Open your browser\'s developer console (F12) and check for JavaScript errors related to the widget script. Verify the widget ID in the script tag matches your widget ID exactly (case-sensitive). Confirm the script tag is inside <head> or before </body> — not inside another script block. Check if Content Security Policy (CSP) headers on your site are blocking the widget script domain — add echo-live-chat.bmcii1976.workers.dev to your CSP script-src directive. Verify the widget is not hidden by a display rule — check Settings > Display Rules for conditions that might be excluding your test session.' },
    { issue: 'Messages taking longer than expected to appear', solution: 'The default polling interval is 3 seconds, so there is a normal maximum 3-second delay between a message being sent and appearing on the other end. If delays are significantly longer (10+ seconds), check your browser\'s network tab for the polling request response times. Slow responses may indicate a network issue between the client and Cloudflare edge, or a temporary Worker performance issue. Check the status page at echo-ept.com/status. If the issue is isolated to a specific visitor, their corporate network firewall may be throttling polling requests.' },
    { issue: 'AI responses are inaccurate or missing key information', solution: 'AI response quality depends on the knowledge base context configured in Settings > AI. Review your context document for completeness, accuracy, and clarity. The context should be written as clear, factual statements rather than marketing copy. Include specific details — pricing tiers, feature names, process steps, policy terms. Avoid ambiguous language. After updating context, test by starting a new conversation incognito and asking the questions you expect visitors to ask. If specific question types consistently get wrong answers, add explicit Q&A pairs to the context document.' },
    { issue: 'Agent not receiving new conversation notifications', solution: 'Verify the agent\'s status is set to "Online" in the console — Away and Offline agents do not receive new conversation assignments. Check browser notification permissions — the console requests permission to send desktop notifications for new chats. If notifications are blocked, enable them in browser settings > Notifications for echo-ept.com. Confirm auto-assignment rules include this agent — if assignment is restricted to specific departments or teams, the agent may not be in the assignment pool. Check the agent\'s concurrent chat limit — if at maximum, no new conversations are assigned until one is resolved.' },
    { issue: 'CSAT survey not being sent after conversations close', solution: 'Verify CSAT surveys are enabled in Settings > Conversations > Post-Chat Survey. Surveys are only sent for conversations where the agent clicked "Resolve" — conversations closed by visitor disconnection or inactivity timeout do not trigger surveys. Check that the visitor provided an email address during the pre-chat form or that their email was identified via CRM match — email-based surveys require a valid address. If surveys are enabled and emails are present but not sending, check your configured sending domain\'s SPF/DKIM records and review the email delivery log.' },
  ],

  faq: [
    { q: 'How many concurrent chats can each agent handle?', a: 'The default concurrent chat limit is 5 chats per agent, configurable from 1 to 20 in Settings > Agents. Once an agent reaches their limit, new conversations are queued and assigned to the next available agent. Supervisors can temporarily override limits during peak periods. Different agents can have different limits — high-performers might handle 10 while newer agents are limited to 3.' },
    { q: 'Does the widget work on mobile browsers?', a: 'Yes. The widget is fully responsive and optimized for mobile. On small screens, the widget opens in full-screen mode for a better typing experience. Touch input is fully supported including swipe to dismiss. The pre-chat form and satisfaction rating screens are designed for thumb navigation. The widget is tested on iOS Safari, Android Chrome, and Firefox Mobile.' },
    { q: 'Can I route conversations to specific agents or teams based on topic?', a: 'Yes via department routing. Create department groups (e.g., Sales, Technical Support, Billing) and assign agents to departments. When visitors select a department in the pre-chat form, their conversation routes directly to agents in that department. You can also configure keyword-based routing — conversations containing words like "billing" or "invoice" automatically route to the Billing team regardless of department selection.' },
    { q: 'What happens to conversations when no agents are online?', a: 'Outside business hours or when all agents are offline, the widget switches to offline mode. Visitors can still send messages — they\'re stored and agents receive email notifications for each message. Visitors are shown your expected response time. If AI responses are enabled, the AI handles the conversation immediately regardless of agent availability. Offline messages appear in the console queue when agents come online.' },
    { q: 'Can I embed multiple widgets on different websites?', a: 'Yes. Each widget has a unique ID and configuration — create separate widgets for different websites, brands, or use cases. One account can manage unlimited widgets. Each widget has independent settings, agent assignments, triggers, and analytics. Agents can be assigned to multiple widgets and see conversations from all their assigned widgets in one console.' },
    { q: 'How is visitor data stored and for how long?', a: 'Conversation transcripts, visitor data, and pre-chat form submissions are stored encrypted in Cloudflare D1 (conversation metadata) and R2 (transcript archive). Data is retained for 2 years from conversation date on standard plans. GDPR-compliant data deletion is available — use the API or contact support to delete all data for a specific visitor email address. The widget does not set first-party cookies by default — session tracking uses a session storage key that clears when the browser tab is closed.' },
  ],
}

export default function EchoLiveChatDocsPage() {
  return <ProductDoc {...data} />
}
