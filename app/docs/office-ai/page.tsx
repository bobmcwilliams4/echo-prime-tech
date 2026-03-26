'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Office AI',
  tagline: 'Complete AI office suite — document generation, email management, meeting notes, task automation, and team collaboration.',
  accent: '#0ea5e9',
  productUrl: '/office-ai',
  workerUrl: 'https://echo-office-ai.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Office AI is a comprehensive AI-powered productivity platform that transforms how teams create documents, manage email, and collaborate. Instead of juggling separate tools for word processing, email clients, note-taking apps, and project managers, Echo Office AI unifies everything into a single intelligent workspace where AI handles the repetitive work so your team can focus on high-value decisions.',
    'The document engine drafts memos, reports, proposals, and contracts from simple prompts or structured templates. The email manager composes replies, prioritizes your inbox, and schedules follow-ups automatically. Meeting transcription captures every word in real time, generates structured summaries with action items, and distributes notes to attendees without anyone lifting a finger. Task automation connects all of these workflows — a meeting action item becomes a tracked task, a signed contract triggers an email sequence, and a completed milestone updates your calendar and notifies stakeholders.',
    'Calendar integration keeps your schedule synchronized across Google Calendar, Outlook, and Apple Calendar with AI-optimized scheduling that accounts for focus time, meeting density, and timezone differences. File organization uses intelligent tagging and semantic search so you can find any document by describing what it contains rather than remembering its filename. Whether you are a solo founder or a 500-person team, Echo Office AI scales from personal productivity to enterprise-wide collaboration with role-based permissions, approval workflows, and audit trails.',
  ],

  gettingStarted: [
    { step: 1, title: 'Sign Up', desc: 'Create your Echo Office AI account at echo-ept.com/office-ai. Enter your name, email, and organization details. Your workspace provisions instantly with sample templates and a guided onboarding tour.' },
    { step: 2, title: 'Connect Your Email', desc: 'Link your Gmail or Outlook account to enable AI email composition, inbox prioritization, and automated follow-ups. OAuth authorization takes under 30 seconds and syncs your last 30 days of email history.' },
    { step: 3, title: 'Import Documents', desc: 'Upload existing documents from Google Drive, OneDrive, Dropbox, or your local machine. Echo Office AI indexes every file for semantic search and auto-categorizes them into folders based on content type and project association.' },
    { step: 4, title: 'Set Up Your Team', desc: 'Invite team members via email, assign roles (admin, editor, viewer), and configure shared workspaces. Set up approval workflows for documents that require sign-off before distribution.' },
    { step: 5, title: 'Start Using the AI Assistant', desc: 'Open the AI command bar with Ctrl+K and start giving instructions: "Draft a project proposal for the Q3 expansion," "Summarize my unread emails," or "Create a meeting agenda for tomorrow\'s standup." The AI learns your writing style and preferences over time.' },
  ],

  features: [
    { title: 'AI Document Drafting', desc: 'Generate polished documents from natural language prompts. Supports memos, reports, proposals, contracts, SOPs, and custom templates. AI matches your brand voice and formatting standards automatically.' },
    { title: 'Email Composition', desc: 'AI drafts email replies and new messages based on context, tone preferences, and conversation history. Suggests subject lines, adjusts formality level, and handles multi-language correspondence.' },
    { title: 'Meeting Transcription', desc: 'Real-time transcription of video and audio meetings with speaker identification. Integrates with Zoom, Google Meet, and Microsoft Teams. Generates structured notes within 60 seconds of meeting end.' },
    { title: 'Task Automation', desc: 'Convert meeting action items, email commitments, and document approvals into tracked tasks automatically. Set due dates, assign owners, and trigger notifications on status changes.' },
    { title: 'Calendar Management', desc: 'AI-optimized scheduling that blocks focus time, prevents back-to-back meetings, and suggests optimal meeting slots based on participant availability and timezone preferences.' },
    { title: 'File Organization', desc: 'Intelligent file management with auto-tagging, semantic search, and smart folders. Find any document by describing its contents. Version history tracks every change with one-click rollback.' },
    { title: 'Team Chat', desc: 'Built-in messaging with channels, threads, and direct messages. AI summarizes long threads, translates messages in real time, and surfaces relevant documents when topics are discussed.' },
    { title: 'Approval Workflows', desc: 'Configure multi-step approval chains for documents, expenses, and requests. Approvers receive notifications with one-click approve/reject. Full audit trail of every decision.' },
    { title: 'Template Library', desc: 'Pre-built and custom templates for every business document type. AI fills in template fields from context, and teams share approved templates across the organization.' },
    { title: 'Cross-Document Search', desc: 'Semantic search across all documents, emails, meeting notes, and chat messages. Ask questions in natural language and get answers with source references and direct links.' },
    { title: 'Version Control', desc: 'Every document edit is versioned with author attribution, timestamps, and change summaries. Compare any two versions side-by-side. Restore previous versions with one click.' },
    { title: 'Integrations', desc: 'Native connections to Google Workspace, Microsoft 365, Slack, Notion, Asana, Jira, Salesforce, and 50+ other tools. Webhook support for custom integrations with any API.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/documents', desc: 'List documents with filtering by folder, tag, author, date range, and content type. Supports full-text search and pagination.', auth: true },
    { method: 'POST', path: '/api/documents', desc: 'Create a new document from a template or AI prompt. Specify title, content, folder, tags, and sharing permissions.', auth: true },
    { method: 'GET', path: '/api/emails', desc: 'List email threads with filtering by sender, label, priority, and read status. Returns AI-generated summaries for each thread.', auth: true },
    { method: 'POST', path: '/api/emails/compose', desc: 'Compose and send an email with AI assistance. Provide recipient, context, and tone preference. AI generates the full message body.', auth: true },
    { method: 'GET', path: '/api/meetings', desc: 'List meetings with transcriptions, summaries, action items, and attendee details. Filter by date range and participant.', auth: true },
    { method: 'POST', path: '/api/tasks', desc: 'Create a new task with title, description, assignee, due date, priority, and linked documents or meetings.', auth: true },
    { method: 'GET', path: '/api/calendar/events', desc: 'Retrieve calendar events with availability windows, conflict detection, and AI scheduling suggestions.', auth: true },
    { method: 'GET', path: '/api/files/search', desc: 'Semantic search across all files, documents, and meeting notes. Returns ranked results with relevance scores and content snippets.', auth: true },
  ],

  userGuide: [
    {
      title: 'Document Generation',
      id: 'document-generation',
      content: [
        'Open the document editor from the sidebar or use Ctrl+N to create a new document. Choose from the template library or start with a blank canvas. To use AI drafting, click the AI icon or type "/" to open the command menu and describe what you want to create.',
        'The AI considers your organization\'s style guide, previous documents, and the specific context you provide. For example, "Draft a client proposal for the website redesign project using our standard proposal template" will pull in your template structure, populate known project details, and generate professional copy that matches your brand voice.',
        'Collaborate in real time with your team — multiple editors can work on the same document simultaneously with live cursors and change tracking. Use comments and @mentions to discuss specific sections. When the document is ready, route it through your approval workflow before sharing externally.',
      ],
    },
    {
      title: 'Email Management',
      id: 'email-management',
      content: [
        'The email dashboard organizes your inbox by priority. AI analyzes sender importance, message urgency, and action requirements to surface critical emails at the top. Low-priority notifications and newsletters are automatically categorized into separate views.',
        'To compose a reply, click on any email and select "AI Reply." The AI reads the full conversation thread, understands the context, and drafts an appropriate response. Adjust the tone slider between casual and formal, edit any details, and send. For new emails, describe the purpose and recipient — the AI handles subject line, greeting, body, and sign-off.',
        'Automated follow-ups track emails that need responses. If a sent email goes unanswered for a configurable number of days, the AI drafts a polite follow-up and queues it for your approval. Smart scheduling sends emails at the optimal time based on recipient timezone and historical open-rate data.',
      ],
    },
    {
      title: 'Meeting Notes',
      id: 'meeting-notes',
      content: [
        'Connect your Zoom, Google Meet, or Teams account in Settings > Integrations. Once connected, Echo Office AI automatically joins scheduled meetings as a silent participant, transcribes the conversation in real time, and identifies speakers by name.',
        'Within 60 seconds of a meeting ending, you receive structured notes containing: a one-paragraph summary, key decisions made, action items with assigned owners, open questions, and a full searchable transcript. Action items are automatically converted to tasks and assigned to the mentioned team members.',
        'Review and edit meeting notes from the Meetings tab. Search across all past meetings by keyword, speaker, or date. The AI can answer questions about previous meetings — ask "What did we decide about the pricing model in last Tuesday\'s meeting?" and get an instant answer with a link to the source transcript.',
      ],
    },
    {
      title: 'Task Automation',
      id: 'task-automation',
      content: [
        'Tasks are created automatically from meeting action items, email commitments, and document approvals. You can also create tasks manually from the Tasks tab or via the AI command bar. Every task has a title, description, assignee, due date, priority level, and optional linked resources.',
        'Automation rules connect tasks to your workflows. Configure triggers like "When a document is approved, create a distribution task for the marketing team" or "When an email from a client goes unanswered for 48 hours, escalate to the account manager." The rule builder uses a visual drag-and-drop interface with no code required.',
        'The task dashboard shows your personal tasks, team tasks, and project-level task boards. Filter by status, priority, assignee, or due date. AI prioritization suggests which tasks to tackle first based on deadlines, dependencies, and business impact.',
      ],
    },
    {
      title: 'Team Collaboration',
      id: 'team-collaboration',
      content: [
        'Workspaces organize your team\'s documents, tasks, and conversations by project, department, or client. Each workspace has its own file library, task board, and chat channel. Control access with role-based permissions — admins manage settings, editors create and modify content, viewers have read-only access.',
        'The team chat supports channels for topic-based discussions, threads for focused conversations, and direct messages for private communication. Share documents inline, @mention teammates to assign tasks, and use reactions for quick feedback. AI summarizes long threads so you can catch up without reading every message.',
        'Activity feeds show real-time updates across your workspaces — new documents, completed tasks, approved requests, and team messages. Notification preferences let you choose which events trigger push notifications, email alerts, or in-app badges so you stay informed without being overwhelmed.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Document Drafting', desc: 'Generates complete documents from natural language descriptions, adapting to your organization\'s style guide, terminology, and formatting standards. Supports 40+ document types including proposals, contracts, reports, and marketing copy.' },
    { capability: 'Email Tone Adjustment', desc: 'Analyzes email context and adjusts response tone on a spectrum from casual to highly formal. Considers recipient relationship, subject sensitivity, and organizational communication norms to produce contextually appropriate messages.' },
    { capability: 'Meeting Summarization', desc: 'Processes meeting transcripts to extract structured summaries, key decisions, action items with owners, and open questions. Speaker attribution ensures every point is credited correctly. Summaries are generated within 60 seconds of meeting end.' },
    { capability: 'Task Prioritization', desc: 'Analyzes task deadlines, dependencies, business impact, and team workload to recommend optimal task ordering. Surfaces blocked tasks, identifies at-risk deadlines, and suggests workload redistribution when team members are overloaded.' },
    { capability: 'Smart Scheduling', desc: 'Optimizes calendar scheduling by analyzing meeting patterns, focus time preferences, timezone differences, and historical productivity data. Prevents meeting fatigue by enforcing buffer times and protecting deep-work blocks.' },
    { capability: 'Content Search', desc: 'Semantic search engine that understands natural language queries across all documents, emails, meeting notes, and chat messages. Returns answers with source references rather than just matching keywords, enabling questions like "What was our Q2 revenue target?" across any content type.' },
  ],

  troubleshooting: [
    { issue: 'Email sync not connecting', solution: 'Navigate to Settings > Integrations > Email and check the connection status. If disconnected, click Reconnect and re-authorize via OAuth. For Gmail, ensure "Less secure app access" is not blocking the connection. For Outlook, verify the Echo Office AI app is approved in your Azure AD admin portal. Allow up to 10 minutes for initial sync to complete.' },
    { issue: 'Meeting transcription not starting', solution: 'Verify your meeting platform (Zoom, Google Meet, or Teams) is connected in Settings > Integrations. The AI bot must be invited to the meeting — check that automatic join is enabled for your calendar. If the bot fails to join, manually add it using the meeting link in the Meetings tab. Ensure your plan includes meeting transcription credits.' },
    { issue: 'AI document generation producing low-quality output', solution: 'Provide more context in your prompt — include the audience, purpose, key points to cover, and desired length. Upload your organization\'s style guide in Settings > AI Preferences to improve brand consistency. Use the feedback buttons on generated content to train the AI on your preferences over time.' },
    { issue: 'Search not returning expected results', solution: 'Ensure the documents you are searching for have been fully indexed — newly uploaded files may take up to 5 minutes to appear in search results. Try rephrasing your query using different terms or asking a question instead of using keywords. Check that you have access permissions to the workspace containing the target documents.' },
  ],

  faq: [
    { q: 'What file formats does Echo Office AI support?', a: 'Echo Office AI supports all common document formats including DOCX, PDF, XLSX, PPTX, Google Docs, Sheets, Slides, Markdown, plain text, and rich text. Documents can be imported from Google Drive, OneDrive, Dropbox, or uploaded directly. Export to any supported format with one click.' },
    { q: 'How secure is my data in Echo Office AI?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Echo Office AI runs on Cloudflare\'s global edge network with SOC 2 compliance. Role-based access control, audit logging, and API key management ensure your documents and communications stay protected. Enterprise plans include data residency options and SSO integration.' },
    { q: 'Can I use Echo Office AI with my existing tools?', a: 'Yes. Native integrations are available for Google Workspace, Microsoft 365, Slack, Notion, Asana, Jira, Salesforce, HubSpot, and 50+ other platforms. Webhook and API support enable custom integrations with any tool that has an API. Zapier and Make connectors are also available.' },
    { q: 'How does the AI learn my writing style?', a: 'The AI analyzes your existing documents, emails, and writing patterns to build a personalized style profile. It learns your preferred vocabulary, sentence structure, formatting conventions, and tone preferences. The more you use it and provide feedback on generated content, the more accurately it matches your voice. Style profiles are private to your account.' },
    { q: 'What are the pricing tiers?', a: 'Starter at $19/mo per user includes document generation, email AI, and basic search. Professional at $49/mo per user adds meeting transcription, task automation, approval workflows, and advanced integrations. Enterprise pricing is custom and includes unlimited everything, SSO, dedicated support, custom AI training, and data residency options.' },
  ],
}

export default function OfficeAiDocsPage() {
  return <ProductDoc {...data} />
}
