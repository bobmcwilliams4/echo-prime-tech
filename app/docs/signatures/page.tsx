'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Signatures',
  tagline: 'Legally binding e-signatures with multi-signer workflows, branded signing pages, bulk send, and tamper-evident completion certificates.',
  accent: '#4f46e5',
  productUrl: '/signatures',
  workerUrl: 'https://echo-signatures.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Signatures is a complete electronic signature platform that transforms your document signing workflow from email attachments and wet ink to a streamlined, legally binding digital process. Create signature envelopes from uploaded PDFs or reusable templates, define the signing order, and send branded signing invitations — all in under two minutes per document.',
    'Every signature is captured via an HTML5 Canvas drawing interface that records the exact strokes, pressure points, and timestamp of the signing act. Each signer\'s identity is verified by email, and every action — view, sign, decline, complete — is logged with IP address, user agent, geolocation, and timestamp to an immutable audit trail. Completion certificates are generated automatically when all parties have signed, providing a single-page legal record of the entire transaction.',
    'Multi-signer workflows support sequential and parallel signing with configurable order enforcement. Automated reminder sequences handle signer follow-up without manual intervention. Bulk send lets you dispatch up to 50 instances of a template to different signers simultaneously — ideal for employee agreements, vendor contracts, or client onboarding. The full REST API and webhook system integrate with any CRM, HR, or document management platform.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/signatures. Complete your sender profile with your name, title, and company — this appears on all signing invitations and completion certificates. Upload your company logo for branded signing pages.' },
    { step: 2, title: 'Upload Your First Document', desc: 'Click "New Envelope" and upload a PDF. Echo Signatures displays the document in the editor where you can drag and drop signature fields, initial fields, date fields, and text input fields onto any page.' },
    { step: 3, title: 'Add Signers', desc: 'Add each signer with their name and email address. Assign signature fields to specific signers. For sequential signing, set the order — Signer 1 must complete before Signer 2 receives their invitation.' },
    { step: 4, title: 'Configure & Send', desc: 'Set an expiration date, customize the email message, configure reminder intervals, and click Send. Each signer receives a branded email with a secure signing link unique to them.' },
    { step: 5, title: 'Track & Collect', desc: 'Monitor the envelope dashboard to see which signers have viewed, signed, or not yet opened their invitation. Once all signers complete, download the signed PDF and completion certificate.' },
  ],

  features: [
    { title: 'Multi-Signer Sequential Workflows', desc: 'Define precise signing order across unlimited signers. Each signer only receives their invitation after the previous signer completes. Supports both sequential (ordered) and parallel (simultaneous) signing configurations per envelope.' },
    { title: 'HTML5 Canvas Signature Capture', desc: 'Signers draw their signature directly on the document using touch or mouse. The canvas records precise stroke data, pressure simulation, and timing. Signatures render as a high-resolution overlay on the document — no image uploads or typed fonts.' },
    { title: 'Branded Signing Pages', desc: 'Each signing session opens at /sign/:token — a fully branded page showing your company logo, colors, and envelope title. Signers never see the Echo Signatures brand unless you choose to show it. Custom domains available on Enterprise plans.' },
    { title: 'Completion Certificates', desc: 'Available at /certificate/:slug, the completion certificate is a tamper-evident page documenting every signer\'s name, email, IP address, signature timestamp, and user agent. Serves as legal evidence of the signing transaction alongside the signed document.' },
    { title: 'Decline with Reason', desc: 'Signers can decline to sign with a required reason field. Declines immediately notify the envelope sender, halt the signing workflow, and log the reason text in the audit trail. The sender can void the envelope or edit and resend.' },
    { title: 'Auto-Reminders', desc: 'Configure automatic reminder sequences — e.g., remind 3 days after sending, then 7 days, then final notice at 14 days. Reminders include the original signing link. Stop reminders when a signer completes or when the envelope expires.' },
    { title: 'Bulk Send from Templates', desc: 'Send up to 50 instances of a template document simultaneously, each to a different signer. Each instance is a separate, independently tracked envelope. Perfect for mass agreement distributions, new hire paperwork, or vendor onboarding campaigns.' },
    { title: 'Template Library', desc: 'Save frequently used documents as reusable templates with pre-placed signature fields and signer role placeholders. Templates can be locked to prevent field editing or left open for customization per send. Share templates across your team.' },
    { title: 'Void & Expire', desc: 'Void any in-progress envelope with a reason — voids invalidate all signing links and notify all parties. Set envelope expiration dates to automatically expire unsigned documents. Expired and voided envelopes are retained in your audit history.' },
    { title: 'Contact Book', desc: 'Save frequent signers to a contact book for one-click signer addition. Contacts store name, email, title, and company. Tag contacts by team or department for organized searches.' },
    { title: 'Full Audit Trail', desc: 'Every envelope action is logged: created, sent, viewed (with view duration), field-by-field completion, signature drawn, submitted, completed, declined, reminded, voided, expired. Each event captures IP address, user agent, and timestamp in UTC.' },
    { title: 'Webhook Notifications', desc: 'Subscribe to envelope events — envelope_sent, signer_viewed, signer_completed, envelope_completed, signer_declined, envelope_voided — to trigger workflows in your CRM, HR system, or document management platform in real time.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/envelopes', desc: 'Create a new envelope with document, signers, field placements, signing order, expiration, and reminder configuration. Returns the envelope ID and signing links for each signer.', auth: true },
    { method: 'GET', path: '/api/envelopes', desc: 'List all envelopes with filtering by status (draft, sent, in_progress, completed, declined, voided, expired), date range, and signer email.', auth: true },
    { method: 'GET', path: '/api/envelopes/:id', desc: 'Get full envelope details including document, all signers with their status, field placements, audit trail events, and completion certificate URL if finished.', auth: true },
    { method: 'POST', path: '/api/envelopes/:id/void', desc: 'Void an in-progress envelope with a required reason string. Invalidates all signing links, notifies all parties, and records the void event in the audit trail.', auth: true },
    { method: 'POST', path: '/api/templates', desc: 'Create a reusable template from a PDF with predefined field placements and signer role assignments. Templates can be locked or editable at send time.', auth: true },
    { method: 'POST', path: '/api/templates/:id/bulk-send', desc: 'Send up to 50 envelope instances from a template simultaneously. Provide an array of signer objects — each becomes an independent tracked envelope.', auth: true },
    { method: 'GET', path: '/api/envelopes/:id/certificate', desc: 'Download the completion certificate as a PDF. Returns 404 if the envelope is not yet completed. The certificate includes full audit trail and signature evidence.', auth: true },
    { method: 'GET', path: '/sign/:token', desc: 'Public signing page endpoint. No auth required — the token authenticates the specific signer session. Returns the branded HTML signing interface.', auth: false },
  ],

  userGuide: [
    {
      id: 'creating-envelopes',
      title: 'Creating & Sending Envelopes',
      content: [
        'To create an envelope, navigate to Signatures > New Envelope and upload your PDF document (up to 25 MB, max 200 pages). The document editor displays your PDF with an overlay tool panel on the right. Drag signature fields, initial fields, date fields, and text input fields from the panel onto any page. Each field can be assigned to a specific signer by selecting from the signer list.',
        'Add signers by entering their name and email address. For sequential signing, drag and reorder signers in the order they should sign. Toggle "Parallel" if all signers should receive invitations simultaneously. You can also add yourself as a signer to countersign documents after the client has signed.',
        'Before sending, configure the envelope settings: set an expiration date (documents not signed by this date are automatically expired), customize the email subject and message body, and set reminder intervals. Click "Review & Send" for a final preview, then "Send" to dispatch all first-round signer invitations.',
      ],
    },
    {
      id: 'signing-experience',
      title: 'The Signer Experience',
      content: [
        'Each signer receives a branded email with a subject line you customized. The email contains a "Sign Now" button linking to their unique /sign/:token URL — a session token that is single-use and tied to that specific signer on that specific envelope. No account creation is required for signers.',
        'The signing page displays the full document with highlighted fields the signer needs to complete. Clicking a signature field opens the signature canvas where the signer draws their signature using a mouse, touchscreen, or stylus. The canvas uses a smooth bezier curve rendering algorithm to produce clean, natural-looking signatures. Signers can clear and redraw until satisfied, then click "Apply" to place the signature on the document.',
        'Once all required fields are completed, the "Submit" button activates. Clicking Submit locks the signer\'s portion of the document, logs the final submission event with IP and timestamp, and triggers the next signer\'s invitation (in sequential mode) or checks if all parallel signers have completed. The signer receives a confirmation email with a link to download the completed document when all parties have signed.',
      ],
    },
    {
      id: 'templates-bulk',
      title: 'Templates & Bulk Send',
      content: [
        'Templates save documents with pre-placed fields and signer role placeholders so you can send the same document repeatedly without repositioning fields each time. Create a template by uploading a document, placing fields, and assigning each field to a role name (e.g., "Employee", "Manager") rather than a specific person. Save as a template and it appears in your template library.',
        'When sending from a template, you fill in the actual signer names and emails for each role. The field placements carry over automatically. You can optionally edit the document or add/remove fields before sending a specific instance.',
        'Bulk Send lets you populate up to 50 signer lists at once from a CSV — upload a file with columns for each role\'s name and email, and Echo Signatures creates 50 separate envelopes, each with the correct signer. All 50 instances are tracked independently on the bulk send dashboard showing how many have been sent, viewed, signed, and completed.',
      ],
    },
    {
      id: 'audit-certificates',
      title: 'Audit Trail & Completion Certificates',
      content: [
        'Every action on every envelope is recorded in the immutable audit trail. The trail captures: envelope created (sender IP, timestamp), invitation sent (email, timestamp), document viewed (signer IP, user agent, view duration), each field completed (field ID, value, timestamp), signature drawn (stroke count, duration), envelope submitted (IP, timestamp), completion certificate generated, and any reminders sent or voids applied.',
        'The completion certificate at /certificate/:slug is a legally formatted HTML page you can print to PDF or share via link. It displays the document name, sender information, signing completion timestamp, and a table with each signer\'s full name, email address, IP address, signature timestamp, and user agent string. A document fingerprint (SHA-256 hash of the signed PDF) is included for tamper verification.',
        'For legal admissibility, the combination of the signed PDF and completion certificate establishes the electronic signature record under the ESIGN Act and UETA. The IP address and email-based identity verification satisfies the intent and attribution requirements of both laws. For higher-assurance transactions, Enterprise plans add SMS OTP verification as a second factor before the signing page loads.',
      ],
    },
    {
      id: 'reminders-expiration',
      title: 'Reminders & Expiration',
      content: [
        'Reminder sequences run automatically based on the intervals you configured when creating the envelope. The default sequence sends a reminder 3 days after the initial invitation, a second reminder at 7 days, and a final notice at 13 days with a 14-day expiration. You can customize these intervals or disable auto-reminders entirely if you prefer to send manual reminders from the envelope detail page.',
        'Reminders include the original secure signing link — no new link is generated, so the signer\'s session remains consistent. If a signer has already completed their portion, they are automatically excluded from reminder sequences even if other signers are still pending.',
        'Envelope expiration can be set to any date. When an envelope expires, all pending signing links are invalidated, remaining signers are notified by email, and the envelope status changes to "Expired." The sender can clone the expired envelope with a new expiration date to restart the process with the original document and field placements intact.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Signature Authenticity Scoring', desc: 'Analyzes signature stroke patterns, drawing speed, and consistency against the signer\'s historical signatures to produce an authenticity confidence score. Flags signatures that deviate significantly from established patterns for sender review before finalizing the envelope.' },
    { capability: 'Smart Field Placement', desc: 'When you upload a new document, the AI scans the document content to identify signature blocks, initial lines, date fields, and text entry areas using visual and textual pattern recognition. Suggests field placements automatically — review and adjust with one click rather than manually dragging every field.' },
    { capability: 'Signer Risk Assessment', desc: 'Evaluates completion likelihood for each signer based on their past response patterns (if they\'ve signed envelopes through Echo Signatures before), email domain, time-to-open rates, and envelope complexity. High-risk signers trigger earlier reminder sequences and optional priority alerts to the sender.' },
    { capability: 'Document Classification', desc: 'Automatically classifies uploaded documents by type (employment agreement, NDA, sales contract, vendor agreement, lease) and applies the appropriate default field set and compliance tagging. Classification informs template suggestions and retention policy rules.' },
    { capability: 'Anomaly Detection', desc: 'Monitors signing sessions for suspicious activity — rapid completion suggesting automated signing rather than human review, geolocation mismatches between email open and signing IP, multiple simultaneous sessions on the same token, and unusual signing hours. Flags anomalies without blocking legitimate signers.' },
    { capability: 'Natural Language Envelope Creation', desc: 'Describe the document and signing requirements in plain English — "NDA between my company and Acme Corp, I sign first then they sign, expires in 30 days" — and the AI pre-configures the envelope structure, field placements based on document scan, and reminder sequence. Dramatically speeds up envelope creation for experienced users.' },
  ],

  troubleshooting: [
    { issue: 'Signer says they did not receive the invitation email', solution: 'First verify the email address in the envelope\'s signer list is correct — a single character typo means the email went to a different address. Check the envelope audit trail to confirm the invitation was sent (timestamp and delivery log visible in the Events tab). Ask the signer to check spam/junk folders — transactional email from new domains is frequently filtered. Use the "Resend Invitation" button on the envelope detail page to send a fresh email. If delivery continues to fail, verify your sending domain\'s SPF and DKIM records are configured in Settings > Email.' },
    { issue: 'Signature canvas not working on mobile', solution: 'The HTML5 Canvas signature requires a modern mobile browser (Chrome 90+, Safari 14+, Firefox 90+). Ensure the signer is not using an in-app browser from an email client — these often have restricted Canvas API access. Ask them to open the signing link in their device\'s full browser. On iOS, ensure JavaScript is enabled and not blocked by content restrictions. If the issue persists on a specific device model, report it with the user agent string from the envelope audit trail.' },
    { issue: 'Bulk send CSV import errors', solution: 'The bulk send CSV must have column headers matching the exact role names defined in the template (case-sensitive). Required columns: one name column and one email column per signer role. Optional: a custom_message column for per-envelope message customization. Download the template CSV from the Bulk Send page to use the correct format. Rows with invalid email addresses are skipped — the error report after import lists skipped rows with reasons.' },
    { issue: 'Completed envelope PDF is missing signatures', solution: 'If the signed PDF shows empty signature fields, the PDF rendering process may have timed out. Navigate to the envelope detail page and click "Regenerate Signed PDF." This re-renders the document with all signature overlays. If specific fields are still missing, check the audit trail to confirm those fields were actually completed (look for field_completed events). Contact support if fields show as completed in the audit trail but missing in the PDF.' },
    { issue: 'Webhook events not firing', solution: 'Verify your webhook URL is correctly configured in Settings > Webhooks and the event types you want are selected. Confirm your webhook endpoint returns a 2xx response within 5 seconds — timeouts are treated as failures. Check the webhook delivery log in Settings > Webhooks > Delivery History for failed attempts with HTTP status codes and response bodies. If your endpoint requires specific headers, add them in the webhook configuration. Test with the "Send Test Event" button before relying on webhooks in production.' },
  ],

  faq: [
    { q: 'Are Echo Signatures legally binding?', a: 'Yes. Echo Signatures produces legally binding electronic signatures under the U.S. ESIGN Act (Electronic Signatures in Global and National Commerce Act) and UETA (Uniform Electronic Transactions Act), adopted by 49 states. The combination of signer intent (clicking "Submit"), identity attribution (email-based authentication), and the audit trail record satisfies the legal requirements for an enforceable e-signature. For international transactions, signatures comply with eIDAS standards for Simple Electronic Signatures in EU jurisdictions.' },
    { q: 'How many signers can an envelope have?', a: 'Up to 20 signers per envelope on Professional plans, and unlimited signers on Enterprise. There is no minimum — single-signer envelopes (client signs, you receive a copy) are common. All signers can be sequential, all parallel, or a mix — e.g., three parallel reviewers followed by one final approver.' },
    { q: 'Can I require signers to verify their identity?', a: 'Standard envelopes use email-based identity verification — the signing link is sent to a specific email address. Enterprise plans add SMS OTP verification (a code texted to the signer\'s phone before the signing page loads) and knowledge-based authentication (KBA) with identity questions. Both options are configured per envelope in the Advanced Security settings.' },
    { q: 'How long are signed documents and certificates retained?', a: 'All signed envelopes, PDFs, audit trails, and completion certificates are retained for 10 years from the completion date on all plans. Documents are stored encrypted at rest in Cloudflare R2 with AES-256. You can download originals at any time during the retention period. Enterprise plans support configurable retention policies and legal hold.' },
    { q: 'Can I integrate Echo Signatures with my CRM or HR system?', a: 'Yes via the REST API and webhooks. When an envelope is completed, the envelope_completed webhook fires with the envelope ID, all signer details, and a download URL for the signed PDF. Use this to automatically update a CRM deal stage, mark an HR onboarding task complete, or store the signed document in your document management system. Pre-built integrations for Salesforce, HubSpot, BambooHR, and Workday are available on Enterprise plans.' },
    { q: 'What file formats are supported for documents?', a: 'PDF is the primary format and supports all PDF features including embedded fonts, images, and form fields. DOCX files are automatically converted to PDF upon upload using a high-fidelity conversion engine that preserves formatting, tables, and images. Image files (PNG, JPG) are wrapped in a PDF envelope automatically. Maximum file size is 25 MB and maximum 200 pages per document.' },
  ],
}

export default function EchoSignaturesDocsPage() {
  return <ProductDoc {...data} />
}
