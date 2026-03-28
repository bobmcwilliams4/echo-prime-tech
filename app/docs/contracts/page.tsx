'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Contracts',
  tagline: 'End-to-end contract lifecycle management — templates, clause library, e-signatures, approval workflows, and AI risk analysis.',
  accent: '#7c3aed',
  productUrl: '/contracts',
  workerUrl: 'https://echo-contracts.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Contracts is a comprehensive contract lifecycle management platform that takes contracts from first draft through execution, obligation tracking, and renewal — all within a single, AI-powered workspace. Whether you\'re managing customer agreements, vendor contracts, NDAs, or employment documents, Echo Contracts provides the structure, workflow, and intelligence to eliminate contract chaos and reduce legal exposure.',
    'The platform is built around a powerful template and clause library system. Create reusable contract templates with dynamic variables (party names, dates, values) and a curated clause library with pre-approved language at every risk level. Version control captures every edit with a full diff history, and approval workflows with sequential routing ensure the right eyes review every contract before it goes out.',
    'E-signatures are fully integrated with a token-based public signing system that captures IP address, user agent, and timestamp for a complete audit trail — no third-party tool required. AI risk analysis powered by the Echo Engine Runtime scans every contract for red-flag clauses, unusual indemnification language, liability caps, and non-standard terms, giving your team confidence before you sign.',
  ],

  gettingStarted: [
    { step: 1, title: 'Build Your Template Library', desc: 'Create contract templates for your most common agreement types — MSA, NDA, SOW, employment offer letter, vendor agreement. Define variable placeholders ({party_name}, {contract_value}, {start_date}) that auto-fill when creating new contracts from the template. Assign each template a default approval workflow and clause set.' },
    { step: 2, title: 'Populate the Clause Library', desc: 'Add standard clauses with risk classifications (standard, negotiable, non-negotiable). Organize by category: indemnification, limitation of liability, IP ownership, confidentiality, termination, governing law. Flag preferred vs. fallback language so AI suggestions pull from approved alternatives during negotiation.' },
    { step: 3, title: 'Configure Approval Workflows', desc: 'Set up sequential approval chains for different contract types and value thresholds. For example: contracts under $10K need only legal review; contracts over $100K route through legal, finance, and CEO. Approvers receive email and in-app notifications with full contract context.' },
    { step: 4, title: 'Create Your First Contract', desc: 'Start a contract from a template or scratch. Fill variable fields, add or swap clauses from the library, and attach relevant files. The editor shows clause risk levels inline and flags deviations from your standard language as you type.' },
    { step: 5, title: 'Send for Signature', desc: 'Once approved, generate a public signing link for each party. Signers receive an email with a secure token-based link — no account required. They review the full contract, type or draw their signature, and submit. IP address, user agent, and UTC timestamp are captured and stored with the signed document.' },
    { step: 6, title: 'Track Obligations and Renewals', desc: 'After execution, set obligation reminders (payment terms, deliverable deadlines, audit rights) and configure renewal alerts. Contracts approaching expiry surface in the renewal queue with AI-generated renegotiation summaries.' },
  ],

  features: [
    { title: 'Contract Templates with Variables', desc: 'Build reusable templates with dynamic variable placeholders that auto-populate when creating a contract. Supports text, number, date, list, and boolean variable types. Template inheritance lets child templates extend parent boilerplate while overriding specific sections.' },
    { title: 'Clause Library with Risk Levels', desc: 'Centralized clause library with preferred, fallback, and non-negotiable language for every clause type. Each clause is tagged with risk level (standard, moderate, high, non-negotiable) and category. AI contract review checks every clause in a new contract against library standards and flags deviations.' },
    { title: 'Full Version Control', desc: 'Every edit to a contract creates a new version with a complete diff showing what changed, who changed it, and when. Restore any previous version with one click. Compare any two versions side by side with highlighted differences. Version history is preserved indefinitely as part of the immutable contract record.' },
    { title: 'Sequential Approval Workflows', desc: 'Define multi-stage approval chains per contract type, value band, or business unit. Approvers review the full contract in context, leave comments on specific clauses, approve or reject with required comments, and optionally request changes that route back to the author. Delegation and out-of-office routing keep workflows moving.' },
    { title: 'Token-Based E-Signatures', desc: 'Generate secure public signing links for any party — counterparties sign without creating an account. Each signing session captures IP address, user agent, geolocation, and UTC timestamp. Signatures are embedded in a signed PDF with a verifiable audit certificate. Multi-party signing supports sequential or parallel signing order.' },
    { title: 'IP and UA Audit Trail', desc: 'Every signature event is recorded with a cryptographically signed audit trail: signer identity, IP address, user agent string, screen resolution, signing timestamp (UTC), and a hash of the document signed. The audit certificate is attached to every executed contract as a tamper-evident appendix.' },
    { title: 'Contract Lifecycle Tracking', desc: 'Contracts move through a defined lifecycle: draft → review → sent → active → expired → terminated. Automated status transitions trigger notifications and workflow actions. The contract dashboard shows counts and value by status, with aging reports for contracts stuck in each stage.' },
    { title: 'Obligation Management', desc: 'Extract and track obligations from executed contracts: payment milestones, deliverable due dates, renewal windows, audit rights, reporting requirements, and insurance certificate renewals. Obligation owners receive automated reminders at configurable lead times before due dates.' },
    { title: 'Renewal Automation', desc: 'Set renewal rules per contract — auto-renew, manual review required, or opt-out window. Contracts approaching renewal surface in the renewal queue 30, 60, or 90 days out. AI generates a renegotiation brief summarizing key terms, performance history, and market comparables to prepare for renewal conversations.' },
    { title: 'Counterparty Negotiation Tracking', desc: 'Track negotiation rounds with counterparties. Each round captures a redlined version showing all proposed changes with clause-level comments. Accept, reject, or propose alternatives on each redline. Negotiation history is preserved in the contract record showing the evolution from first draft to final execution.' },
    { title: 'Contract Repository Search', desc: 'Full-text search across all contract content including clause text, variable values, and attachments. Filter by contract type, party name, value range, status, owner, and date. Saved searches enable one-click access to frequently queried contract sets. OCR processing makes scanned legacy contracts searchable.' },
    { title: 'Integration and Export', desc: 'Integrates with Salesforce, HubSpot, and Echo CRM to link contracts to deals and customer records. Webhook triggers on contract events (signed, expired, renewed). Export any contract as PDF, DOCX, or JSON. Bulk export for archival or migration purposes.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/contracts', desc: 'List all contracts with pagination. Filter by status, type, owner, party name, value range, and date range. Returns summary fields — full content requires /api/contracts/:id.', auth: true },
    { method: 'POST', path: '/api/contracts', desc: 'Create a new contract from a template ID or from scratch. Provide template_id, variable values, and initial metadata. Returns draft contract with assigned ID.', auth: true },
    { method: 'GET', path: '/api/contracts/:id', desc: 'Retrieve full contract details including current content, all versions, approval status, signatures, obligations, and audit trail.', auth: true },
    { method: 'PUT', path: '/api/contracts/:id', desc: 'Update contract content or metadata. Creates a new version automatically. Body: { content, change_reason }. Triggers workflow notifications if contract is in review state.', auth: true },
    { method: 'POST', path: '/api/contracts/:id/sign', desc: 'Initiate the signing process. Returns signing tokens for each party. Optional: specify signing_order (sequential/parallel) and expiry for signing links.', auth: true },
    { method: 'GET', path: '/api/sign/:token', desc: 'Public endpoint — retrieve the contract for signing using a token. Returns contract content and party details. No authentication required (token is the credential).', auth: false },
    { method: 'POST', path: '/api/sign/:token/submit', desc: 'Public endpoint — submit a signature for a signing token. Body: { signature_data, signer_name }. Captures IP, UA, timestamp, and locks the document if all parties have signed.', auth: false },
    { method: 'GET', path: '/api/clauses', desc: 'List all clauses in the clause library. Filter by category, risk level, or text search. Returns clause text, risk classification, and usage statistics.', auth: true },
    { method: 'POST', path: '/api/contracts/:id/analyze', desc: 'Trigger AI risk analysis on a contract. Returns a risk report with flagged clauses, risk scores, deviations from standard library language, and specific recommendations.', auth: true },
    { method: 'GET', path: '/api/templates', desc: 'List all contract templates with variable definitions, default workflow, clause set, and usage count. Filter by type or category.', auth: true },
  ],

  userGuide: [
    {
      id: 'template-management',
      title: 'Creating and Managing Contract Templates',
      content: [
        'Contract templates are the productivity foundation of Echo Contracts. A well-structured template library means your team spends minutes, not hours, creating new contracts. Navigate to Templates > New Template to start building. Give the template a name, select its contract type (NDA, MSA, SOW, etc.), and begin adding content in the rich text editor.',
        'Variable placeholders use double curly-brace syntax: {{party_name}}, {{contract_value}}, {{start_date}}. When a user creates a contract from the template, they\'re prompted to fill in each variable. You can mark variables as required or optional, set default values, and add helper text explaining what each variable expects. Variables support text, number, date, currency, and selection (dropdown) types.',
        'Templates support clause inheritance — you can designate certain sections as "locked" (cannot be edited in child contracts) or "suggested" (pre-populated but overridable). Link specific clauses from your clause library to template sections so the AI knows which clause alternatives are approved for this contract type. Set the default approval workflow and signing requirements so every contract created from the template has consistent governance from the start.',
      ],
    },
    {
      id: 'clause-library',
      title: 'Building and Using the Clause Library',
      content: [
        'The clause library is your organization\'s approved language repository. Each clause entry contains the clause text, a category tag (indemnification, limitation of liability, IP, confidentiality, termination, etc.), a risk level (standard, negotiable, non-negotiable), and optional notes explaining when to use this specific language versus alternatives.',
        'Risk levels guide your team and the AI during contract review. "Standard" clauses are pre-approved and should be used without modification. "Negotiable" clauses can be modified within defined parameters — these typically have one or more fallback alternatives in the library. "Non-negotiable" clauses must appear verbatim in any agreement of that type; deviations require legal director approval.',
        'When the AI risk analysis runs on a contract, it compares every clause against your library. Clauses that match standard language pass silently. Clauses that deviate from library language are flagged with the deviation highlighted and the nearest library alternative suggested. Clauses not found in any library entry are marked as unreviewed and given a default risk score based on clause category and language patterns from the AI model.',
      ],
    },
    {
      id: 'approval-workflows',
      title: 'Configuring and Running Approval Workflows',
      content: [
        'Approval workflows in Echo Contracts are fully configurable per contract type, value threshold, and business unit. Navigate to Settings > Workflows to create workflow templates. Each workflow consists of sequential steps — each step has one or more approvers, an optional time limit, and a fallback action (escalate or auto-approve on timeout). Parallel approval groups within a step let you require approval from any one of several approvers.',
        'When a contract is submitted for review, the workflow engine notifies the first step\'s approvers via email and in-app notification. The notification includes the full contract context, a summary of key terms, and direct links to approve or reject. Approvers can add comments on specific clauses, request revisions (which route back to the author), or pass the approval along to another team member.',
        'Approval audit trails are complete and immutable. Every approval decision, rejection, comment, and delegation is recorded with the approver\'s identity, timestamp, and the version of the contract they reviewed. This audit trail is exported with the final signed contract as evidence of proper governance — critical for regulatory compliance, board review, or disputes.',
      ],
    },
    {
      id: 'esignature-process',
      title: 'E-Signature Process and Audit Trail',
      content: [
        'Once a contract is approved, the sender initiates the signing process from the contract detail page. Specify each signing party (name, email, role) and choose signing order: sequential (each party signs in order after the previous) or parallel (all parties can sign simultaneously). Set an expiry date for signing links — after expiry, signers are notified the link has expired and a new invitation must be sent.',
        'Each signing party receives an email with a unique, single-use signing token embedded in a secure URL. The signer clicks the link, reviews the full contract text in a clean read-only view, and applies their signature via typed name, drawn signature, or uploaded image. No Echo Contracts account is required — the token serves as authentication. Once signed, the signer receives a PDF copy of the executed contract via email.',
        'The audit certificate attached to every executed contract is a comprehensive, cryptographically signed record of the entire signing process. It includes: the SHA-256 hash of the document each party signed (proving document integrity), each party\'s full name, IP address, user agent string, and signing timestamp in UTC, and a certificate hash that links all this data. The audit certificate is tamper-evident — any modification to the contract after signing invalidates the certificate hash.',
      ],
    },
    {
      id: 'renewal-management',
      title: 'Obligation Tracking and Renewal Management',
      content: [
        'After a contract is executed, obligation tracking begins. Navigate to the Obligations tab of any active contract to view extracted obligations — these can be manually entered or extracted by the AI from the contract text. Each obligation has a type (payment, deliverable, notice, report, certification renewal), a due date, an owner, and a lead-time notification period. Owners receive automated reminders at the configured lead time.',
        'The renewal management queue surfaces all contracts approaching their expiry date, grouped by renewal type: auto-renew (scheduled to renew automatically unless cancelled), opt-out window open (party must act to prevent renewal), and manual renewal required (requires explicit action to continue). The queue shows days remaining, current contract value, and a quick action to initiate the renewal workflow.',
        'The AI renegotiation brief, available for any contract in the renewal queue, synthesizes the key commercial terms from the current contract, summarizes any obligations that were missed or late, extracts any performance clauses that may affect renewal terms, and provides a negotiation framework with suggested positions. This brief is designed to prepare a negotiator for a renewal conversation in minutes rather than hours of contract review.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'AI Risk Analysis (LG-01)', desc: 'The LG-01 legal analysis engine scans every contract clause for risk signals: unusual indemnification scope, asymmetric liability caps, broad IP assignment language, unlimited audit rights, punitive termination triggers, and deviation from your standard clause library. Each flagged item receives a risk score (1–10), a plain-language explanation, and a recommended clause alternative from your library.' },
    { capability: 'AI Clause Suggestions', desc: 'As you draft or negotiate a contract, the AI suggests approved clause alternatives from your library that fit the current context. Type a clause type (e.g., "limitation of liability") and the AI retrieves your standard, negotiable fallback, and last-resort language ranked by preference. It also suggests clauses from similar executed contracts in your repository that were accepted by counterparties.' },
    { capability: 'AI Negotiation Coaching', desc: 'During counterparty negotiation, the AI analyzes each redline proposed by the other side and provides a negotiation recommendation: accept (clause is within acceptable parameters), reject with counter (suggests specific counter-language), or escalate (clause poses high risk requiring legal review). Recommendations are grounded in your clause library and historical negotiation outcomes.' },
    { capability: 'Renewal Renegotiation Briefs', desc: 'For contracts approaching renewal, the AI generates a structured renegotiation brief: executive summary of current terms, performance against obligations, market benchmarking of key commercial terms, recommended positions for key negotiation points, and red lines (terms that must not be conceded). The brief is exportable as a PDF for use in renewal meetings.' },
    { capability: 'Obligation Extraction', desc: 'After a contract is executed, the AI parses the full text to extract and categorize all obligations: payment milestones with amounts and dates, deliverable deadlines, reporting requirements, insurance certificate renewals, audit rights windows, and notice period triggers. Extracted obligations are pre-populated in the obligation tracker for human review and confirmation.' },
    { capability: 'Contract Similarity Search', desc: 'When creating a new contract or responding to a counterparty redline, the AI retrieves the most similar executed contracts from your repository ranked by clause overlap, party type, and contract value. This surfaces historical precedent — showing how similar terms were negotiated in past deals — to inform your current position with real internal data.' },
  ],

  troubleshooting: [
    { issue: 'Signing link not working or showing "token expired"', solution: 'Signing tokens expire after the period set when initiating signing (default 7 days). If a token has expired, navigate to the contract, open the Signatures tab, and re-send the invitation to the affected party — this generates a new token. If the link expires immediately after generation, verify that the signing expiry setting in the contract is set to a future date and not inadvertently set to the current date.' },
    { issue: 'Approval workflow stuck — approver not receiving notification', solution: 'Check the approver\'s email address in Settings > Team Members. Verify the workflow step is correctly assigned to that user and not to a role that the user doesn\'t have. Check the approver\'s notification preferences in their account settings — notifications may be muted. For email delivery issues, ask the approver to check spam folders and whitelist no-reply@echo-ept.com. You can manually reassign the workflow step to a different approver from the contract\'s Approvals tab.' },
    { issue: 'AI risk analysis returning no results', solution: 'AI risk analysis requires the contract to have text content — it cannot analyze blank or image-only contracts. If the contract was created from a scanned PDF, ensure OCR processing has completed (check the Processing Status badge on the contract). Verify that AI credits are available in your billing dashboard. If credits are available and content exists, re-run the analysis from the contract\'s AI Analysis tab. Analysis typically completes in 30–90 seconds depending on contract length.' },
    { issue: 'Version history showing unexpected changes', solution: 'Echo Contracts creates a new version on every save. If minor auto-saves are cluttering the version history, enable "Manual Versions Only" in Settings > Contracts to only create versions when you explicitly click "Save Version." Each version is labeled with the user who saved it and a timestamp, so you can identify which team member made specific changes. Admin users can archive minor auto-save versions to declutter the timeline without losing the data.' },
    { issue: 'Signed PDF not showing the audit certificate', solution: 'The audit certificate is appended as the last page(s) of the signed PDF. If the certificate is missing, the PDF may have been generated before the final signature was captured — re-download the executed contract PDF from the Signatures tab after all parties have signed. If the certificate is still absent, use the "Regenerate Signed PDF" option in the contract actions menu, which recompiles the document with all captured signatures and appends a fresh audit certificate.' },
  ],

  faq: [
    { q: 'Do counterparties need an Echo Contracts account to sign?', a: 'No. Counterparties receive a secure, token-based signing link via email and can review and sign the contract directly in their browser with no account required. The token is single-use and expires after the period you set. This frictionless signing experience means there is no barrier to getting contracts signed quickly, regardless of whether the other party uses Echo Contracts.' },
    { q: 'Are Echo Contracts e-signatures legally binding?', a: 'Yes. Echo Contracts e-signatures comply with the U.S. ESIGN Act (Electronic Signatures in Global and National Commerce Act), UETA (Uniform Electronic Transactions Act), and eIDAS Regulation (EU). The audit trail captured with each signature — IP address, user agent, timestamp, document hash, and signer identity — satisfies the legal requirements for enforceable electronic signatures in most commercial contexts. For high-value or regulated transactions, consult your legal team about whether advanced or qualified electronic signatures are required.' },
    { q: 'How many contract templates can I create?', a: 'Free plans include up to 5 templates. Pro plans support up to 50 templates. Enterprise plans have unlimited templates. All plans support unlimited contracts — the template limit only applies to reusable template definitions, not to individual contract instances created from those templates.' },
    { q: 'Can I import existing contracts into Echo Contracts?', a: 'Yes. Upload existing contracts as PDF or DOCX files. The OCR engine makes uploaded documents full-text searchable and enables AI analysis on legacy contracts. For contracts with variable data you want to track (value, parties, dates), use the metadata extraction tool to pull key fields into the contract record. Bulk import via ZIP file is supported for large-scale migrations.' },
    { q: 'What happens to contracts if we cancel our subscription?', a: 'All executed contract PDFs and their audit certificates are immediately downloadable as a bulk export package before cancellation. Signed contracts remain legally valid regardless of subscription status — the PDF and embedded audit certificate are self-contained legal records. Draft and unsigned contracts can also be exported as PDF or DOCX. We retain your data for 90 days after cancellation before permanent deletion, giving you time to complete any outstanding exports.' },
    { q: 'Can Echo Contracts integrate with our existing contract repository or CLM?', a: 'Echo Contracts supports import and export in standard formats (PDF, DOCX, JSON) for compatibility with any existing repository. Native integrations exist for Salesforce (link contracts to opportunities and accounts), HubSpot (attach contracts to deals), and Echo CRM. A full REST API with webhook events allows integration with any CLM or document management system. For enterprise migrations from platforms like DocuSign, Ironclad, or Conga, contact our onboarding team for a guided migration service.' },
  ],
}

export default function EchoContractsDocsPage() {
  return <ProductDoc {...data} />
}
