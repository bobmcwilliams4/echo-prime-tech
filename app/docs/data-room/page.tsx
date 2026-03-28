'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Data Room',
  tagline: 'AI-powered virtual data room for secure document sharing, due diligence, and deal management.',
  accent: '#6366f1',
  productUrl: '/data-room',
  workerUrl: 'echo-data-room.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Data Room is a secure virtual data room (VDR) built for M&A transactions, fundraising rounds, due diligence, and confidential document sharing. Unlike legacy VDR providers that charge $10K-$15K per deal, Echo Data Room offers flat monthly pricing starting at $49/mo with enterprise-grade security plus AI-powered analysis.',
    'Control access at the per-user, per-document level with granular view, download, print, upload, and comment permissions. Require digital NDA signatures before granting room access with full legal records including signer details, IP addresses, and timestamps. Every document view, download, login, and permission change is logged in a complete audit trail.',
    'AI-powered features set Echo Data Room apart from legacy providers: document summarization for due diligence, completeness analysis of your document set, suggested answers for Q&A threads, and automatic document tagging and categorization. Dynamic watermarking stamps viewer name and timestamp on every viewed document to prevent unauthorized sharing.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create a Data Room', desc: 'Click Create Room, give it a name and optional description. Choose whether to require NDA signatures before access. Set up your folder hierarchy for organizing documents.' },
    { step: 2, title: 'Upload Documents', desc: 'Drag and drop files or use the upload button. Organize documents into nested folders. AI automatically tags and categorizes uploaded files. Upload new versions with change notes while preserving full version history.' },
    { step: 3, title: 'Invite Participants', desc: 'Generate secure access links with configurable permissions (view, download, print, comment). Set expiration dates and usage limits. Require email verification and optional NDA acceptance before access.' },
    { step: 4, title: 'Monitor Activity', desc: 'Track who viewed which documents, when, and for how long via the engagement analytics dashboard. Review the complete audit trail for compliance. Use Q&A threads for structured communication.' },
  ],
  features: [
    { title: 'Granular Permissions', desc: 'Control view, download, print, upload, and comment access per user per document. Folder-level restrictions and expiring access for time-limited deals.' },
    { title: 'NDA Tracking', desc: 'Require digital NDA signatures before granting room access. Full legal records with signer name, email, company, IP address, and timestamps.' },
    { title: 'Complete Audit Trail', desc: 'Every document view, download, login, permission change, and Q&A interaction is logged with user identity, timestamp, and IP address.' },
    { title: 'AI Due Diligence', desc: 'AI analyzes your document set for completeness, identifies missing categories, flags risks, and recommends next steps to strengthen your data room.' },
    { title: 'Q&A Module', desc: 'Structured question-and-answer threads tied to specific documents. AI suggests answers to common due diligence questions to accelerate the process.' },
    { title: 'Secure Access Links', desc: 'Generate expiring, usage-limited invitation links with configurable permissions. Require email verification and NDA acceptance.' },
    { title: 'Folder Hierarchy', desc: 'Organize documents in nested folders with drag-and-drop ordering. Version control with change notes for every document update.' },
    { title: 'Dynamic Watermarking', desc: 'Automatically watermark viewed documents with the viewer name and timestamp to prevent unauthorized sharing and track document leaks.' },
    { title: 'Engagement Analytics', desc: 'Track who viewed what, when, and for how long. Daily analytics dashboards with visitor, view, and download metrics across all rooms.' },
    { title: 'Document Versioning', desc: 'Upload new versions with change notes while preserving complete version history. Always know which version is current.' },
    { title: 'AI Auto-Tagging', desc: 'AI automatically categorizes and tags uploaded documents for faster organization and searchability across your data room.' },
    { title: 'Export & Reporting', desc: 'Export audit logs, document indexes, and NDA records as CSV or JSON for compliance reporting and legal documentation.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/rooms', desc: 'Create a new data room', auth: true },
    { method: 'GET', path: '/api/rooms/:id', desc: 'Get room details including settings and stats', auth: true },
    { method: 'POST', path: '/api/rooms/:id/documents', desc: 'Upload a document to a room', auth: true },
    { method: 'GET', path: '/api/rooms/:id/audit', desc: 'Retrieve the audit trail for a room', auth: true },
    { method: 'POST', path: '/api/rooms/:id/invite', desc: 'Generate a secure access link with permissions', auth: true },
    { method: 'GET', path: '/api/rooms/:id/analytics', desc: 'Get engagement analytics for a room', auth: true },
    { method: 'POST', path: '/api/rooms/:id/qa', desc: 'Post a question in the Q&A module', auth: true },
    { method: 'GET', path: '/api/rooms/:id/ndas', desc: 'List NDA signatures for a room', auth: true },
  ],
  userGuide: [
    { title: 'Room Setup & Organization', id: 'room-setup', content: [
      'Create a new room from the dashboard. Each room represents a deal, transaction, or project. Name it descriptively (e.g., "Series B Due Diligence" or "Acquisition - Acme Corp"). Optionally add a description visible to participants.',
      'Build your folder structure before uploading documents. Common structures include: Financial (audited statements, projections, cap table), Legal (articles, contracts, IP), Operations (org chart, processes), and Technology (architecture, security audits).',
      'Enable NDA requirement if participants must sign a non-disclosure agreement before accessing any documents. Upload your NDA template or use the built-in default.',
    ]},
    { title: 'Permission Management', id: 'permissions', content: [
      'Set default permissions at the room level, then override per folder or per document. The permission hierarchy is: Room defaults, then Folder overrides, then Document overrides.',
      'Available permissions: View (can see the document), Download (can save a copy), Print (can print), Upload (can add documents), Comment (can post Q&A). Each permission can be granted or denied per user.',
      'Create access groups for common permission sets (e.g., "Buyers Team - View Only", "Legal Counsel - Full Access"). Assign users to groups for efficient permission management.',
    ]},
    { title: 'AI Analysis Features', id: 'ai-analysis', content: [
      'Run a Completeness Analysis from the AI menu to check if your data room covers all standard due diligence categories. The AI identifies missing document types and recommends what to add.',
      'Use Document Summaries to generate AI-powered summaries of uploaded documents. Summaries highlight key terms, financial figures, and potential risk areas for reviewers.',
      'Enable AI Q&A Suggestions to automatically draft answers to common due diligence questions based on your uploaded documents. Review and edit suggested answers before posting.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Due Diligence Completeness', desc: 'AI analyzes your document set against standard due diligence categories and identifies gaps, missing documents, and areas that need additional documentation.' },
    { capability: 'Document Summarization', desc: 'Generates concise summaries of uploaded documents highlighting key terms, financial figures, and potential risk areas for faster reviewer comprehension.' },
    { capability: 'Q&A Answer Suggestions', desc: 'AI drafts suggested answers to due diligence questions based on the content of your uploaded documents, accelerating the Q&A process.' },
    { capability: 'Auto-Tagging & Categorization', desc: 'Automatically tags and categorizes uploaded documents by type (financial, legal, operational, technical) for faster organization and searchability.' },
  ],
  troubleshooting: [
    { issue: 'Participant cannot access room', solution: 'Verify the access link has not expired and the usage limit has not been reached. Check if NDA signing is required and whether the participant completed it. Review the user permissions in Room Settings.' },
    { issue: 'Document upload fails', solution: 'Check file size limits for your plan (Starter: 100MB/file, Professional: 500MB/file, Enterprise: 2GB/file). Verify you have upload permissions for the target folder. Ensure storage quota is not exceeded.' },
    { issue: 'Watermark not appearing', solution: 'Dynamic watermarking is available on Professional and Enterprise plans. Ensure watermarking is enabled in Room Settings. Watermarks appear on viewed documents, not on original files.' },
    { issue: 'AI analysis not available', solution: 'AI features (document analysis, Q&A suggestions, due diligence checks) require the Professional plan or higher. Upgrade your subscription to access AI capabilities.' },
  ],
  faq: [
    { q: 'What is a virtual data room?', a: 'A virtual data room (VDR) is a secure online repository for sharing confidential documents during M&A transactions, fundraising rounds, due diligence, and other sensitive business processes.' },
    { q: 'How does Echo Data Room compare to Intralinks or Datasite?', a: 'Echo Data Room provides enterprise-grade security features — granular permissions, NDA tracking, audit trails, and watermarking — plus AI-powered document analysis and Q&A suggestions, at a fraction of the cost ($49/mo vs $10K-$15K per deal).' },
    { q: 'Is my data secure?', a: 'Documents are stored in Cloudflare R2 with encryption at rest and in transit. Access is controlled via granular per-user, per-document permissions with full audit logging of every view, download, and action.' },
    { q: 'Can I require NDAs before document access?', a: 'Yes. Rooms can require NDA signatures before granting access. Digital NDA records include signer name, email, company, IP address, and timestamp for legal compliance.' },
    { q: 'What AI features are included?', a: 'AI-powered document summarization, due diligence completeness analysis, Q&A answer suggestions, and automatic document tagging and categorization. AI features require the Professional plan or higher.' },
  ],
}

export default function DataRoomDocsPage() {
  return <ProductDoc {...data} />
}
