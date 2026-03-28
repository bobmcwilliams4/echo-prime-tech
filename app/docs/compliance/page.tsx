'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Compliance',
  tagline: 'Enterprise compliance automation — SOC 2, HIPAA, GDPR, ISO 27001 — with AI gap analysis and auto-populated controls.',
  accent: '#059669',
  productUrl: '/compliance',
  workerUrl: 'https://echo-compliance.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Compliance is a full-stack compliance management platform that transforms the burden of regulatory adherence into an automated, continuous process. With support for SOC 2, HIPAA, GDPR, and ISO 27001 out of the box, Echo Compliance centralizes every control, risk, policy, and piece of evidence in one structured workspace — eliminating the spreadsheet chaos that plagues most compliance programs.',
    'The platform is built around intelligent automation. When you onboard a new framework, the AI auto-populates controls based on your existing infrastructure data, maps overlapping requirements across multiple frameworks, and scores your readiness with a dynamic compliance percentage. A 5×5 risk matrix provides visual risk heat mapping so you can prioritize remediation efforts by impact and likelihood rather than guessing.',
    'Evidence management is continuous: automated collection pulls screenshots, logs, and configuration exports from connected tools and maps them directly to the controls they satisfy. Policy lifecycle management ensures every policy document has an owner, approval chain, and acknowledgment record. Vendor risk assessments are tracked with scoring, and the full audit trail is exportable in CSV or JSON format for auditor handoff.',
  ],

  gettingStarted: [
    { step: 1, title: 'Select Your Frameworks', desc: 'Choose from SOC 2 Type I/II, HIPAA, GDPR, ISO 27001, or combine multiple frameworks into a single unified compliance program. Echo Compliance automatically maps overlapping controls so you satisfy multiple frameworks without duplicating work.' },
    { step: 2, title: 'Auto-Populate Controls', desc: 'Connect your infrastructure (AWS, Azure, GCP, GitHub, Okta) and let the AI scan your environment to automatically populate control evidence. Controls are categorized by domain — access control, change management, incident response, encryption, and availability.' },
    { step: 3, title: 'Assess Your Risk Posture', desc: 'Use the 5×5 risk matrix to identify, score, and prioritize risks by likelihood (1–5) and impact (1–5). Each risk links to one or more controls, creating a closed-loop between risk management and compliance evidence.' },
    { step: 4, title: 'Build Your Policy Library', desc: 'Create policies from templates or import existing documents. Assign owners, configure approval workflows with sequential reviewers, and deploy acknowledgment campaigns to ensure every employee has reviewed required policies.' },
    { step: 5, title: 'Run AI Gap Analysis', desc: 'Let the AI gap analysis engine compare your current evidence and control status against framework requirements to generate a prioritized remediation roadmap. Each gap includes a recommended action, estimated effort, and risk level.' },
    { step: 6, title: 'Prepare for Audit', desc: 'Generate auditor-ready reports with complete control evidence, risk register, policy acknowledgment records, and vendor assessments. Export packages in PDF, CSV, or JSON format. Share read-only audit workrooms with external auditors.' },
  ],

  features: [
    { title: 'Multi-Framework Support', desc: 'SOC 2 (Type I & II), HIPAA, GDPR, and ISO 27001 are built in with all control requirements pre-loaded. Cross-framework mapping automatically identifies controls that satisfy requirements in multiple frameworks simultaneously, reducing compliance overhead by up to 60%.' },
    { title: 'AI Control Auto-Population', desc: 'Connect your cloud infrastructure, identity providers, and developer tools. The AI scanner reads your environment and auto-populates controls with evidence — no manual upload required. Handles AWS CloudTrail, Azure Policy, GitHub Audit Logs, Okta access reviews, and more.' },
    { title: 'Compliance Scoring', desc: 'Real-time compliance percentage per framework, control domain, and overall program. Scores factor in control status (implemented, partial, not started, not applicable), evidence freshness, and risk severity. Dashboard tiles update live as evidence is added or expires.' },
    { title: '5×5 Risk Matrix', desc: 'Visual heat-map risk matrix with 25 risk cells organized by likelihood (1–5) and impact (1–5). Create risk records with descriptions, asset links, control mappings, and remediation plans. Inherent and residual risk scores tracked separately with full treatment history.' },
    { title: 'Evidence Management', desc: 'Centralized evidence library with file upload, URL evidence, screenshot capture, and automated pull from connected integrations. Evidence expires on configurable schedules, triggering collection reminders. Each piece maps to specific control objectives across frameworks.' },
    { title: 'Policy Lifecycle Management', desc: 'Create, version, and publish policies with a full approval workflow. Policies move through draft → review → approved → published states with time-stamped approvals. Acknowledgment campaigns track employee completion with reminder automation and completion certificates.' },
    { title: 'Vendor Risk Tracking', desc: 'Maintain a vendor inventory with security questionnaires, risk scores, contract dates, and sub-processor records. Track vendor SOC 2 reports, penetration test results, and insurance certificates. Flag overdue reviews and automatically re-assess vendors on configurable schedules.' },
    { title: 'AI Gap Analysis', desc: 'On-demand gap analysis compares your current compliance posture against framework requirements to produce a prioritized, actionable remediation roadmap. Each gap is classified by severity (critical, high, medium, low), linked to the specific control failing, and includes an AI-suggested remediation action.' },
    { title: 'AI Readiness Scoring', desc: 'Beyond gap analysis, the AI readiness score predicts your likelihood of passing an audit given current evidence quality, control coverage, and risk posture. Includes a breakdown by domain (security, availability, confidentiality, processing integrity, privacy) with specific improvement recommendations.' },
    { title: 'Audit Workroom', desc: 'Create read-only, time-limited audit workrooms for external auditors with filtered evidence views, structured control walkthroughs, and comment threading. Auditors can request additional evidence directly in the workroom with notifications sent to control owners.' },
    { title: 'CSV/JSON Export', desc: 'Export any compliance artifact — control register, risk register, evidence library, policy list, vendor roster, gap analysis report — to CSV or structured JSON. Scheduled exports keep your data warehouse or GRC tool in sync automatically.' },
    { title: 'Role-Based Access Control', desc: 'Granular RBAC with compliance admin, control owner, policy reviewer, auditor, and read-only roles. Field-level permissions ensure sensitive controls are visible only to authorized users. All access changes are recorded in the immutable audit log.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/frameworks', desc: 'List all compliance frameworks in the workspace with overall compliance score, control counts by status, and last assessment date.', auth: true },
    { method: 'GET', path: '/api/frameworks/:id/controls', desc: 'Retrieve all controls for a specific framework with status, evidence count, owner, and domain classification. Supports filtering by status and domain.', auth: true },
    { method: 'POST', path: '/api/controls/:id/evidence', desc: 'Upload or link a piece of evidence to a control. Accepts file upload (multipart/form-data) or URL-based evidence with title and expiry date.', auth: true },
    { method: 'GET', path: '/api/risks', desc: 'List all risks in the risk register with likelihood, impact, inherent score, residual score, treatment status, and linked controls.', auth: true },
    { method: 'POST', path: '/api/risks', desc: 'Create a new risk record with title, description, likelihood (1–5), impact (1–5), risk owner, treatment type, and control associations.', auth: true },
    { method: 'GET', path: '/api/policies', desc: 'List all policies with current version, status (draft/review/approved/published), owner, last reviewed date, and acknowledgment completion rate.', auth: true },
    { method: 'POST', path: '/api/gap-analysis', desc: 'Trigger an AI gap analysis for a specific framework. Returns a prioritized list of gaps with severity, affected controls, and AI-generated remediation recommendations.', auth: true },
    { method: 'GET', path: '/api/vendors', desc: 'List all vendors with risk tier, last assessment date, outstanding questionnaire status, and sub-processor flag.', auth: true },
    { method: 'GET', path: '/api/export/:type', desc: 'Export compliance data. Type: controls, risks, policies, vendors, or full-report. Format query param: csv or json.', auth: true },
    { method: 'GET', path: '/api/score', desc: 'Get the current overall compliance score broken down by framework, domain, and control status. Includes trend data for the last 90 days.', auth: false },
  ],

  userGuide: [
    {
      id: 'framework-setup',
      title: 'Setting Up Compliance Frameworks',
      content: [
        'When you activate a compliance framework in Echo Compliance, the system loads all control requirements from the framework specification — for example, all 64 Trust Services Criteria for SOC 2 or all 114 controls from ISO 27001 Annex A. Each control is pre-classified by domain (e.g., CC6 for Logical and Physical Access in SOC 2) and includes the full requirement text, implementation guidance, and suggested evidence types.',
        'For multi-framework programs, Echo Compliance automatically maps overlapping controls. For instance, access review requirements in SOC 2 CC6.2, HIPAA §164.308(a)(3), and ISO 27001 A.9.2 all map to the same underlying access review process — meaning evidence collected once satisfies all three frameworks simultaneously. The overlap map is visible in Settings > Framework Mapping.',
        'To activate a framework, navigate to Compliance > Frameworks > Add Framework. Select the frameworks relevant to your business, assign a compliance program owner, and set your target audit date. The system will calculate your initial compliance score based on existing evidence and flag your highest-priority gaps in the dashboard.',
      ],
    },
    {
      id: 'evidence-collection',
      title: 'Evidence Collection and Management',
      content: [
        'Evidence is the foundation of any compliance program. Echo Compliance provides three evidence collection methods: manual upload (any file format), URL-based evidence (for public documents or dashboards), and automated collection via integrations. Automated collection is the most powerful — once you connect AWS, Azure, GitHub, or Okta, the system continuously pulls configuration screenshots, access logs, and policy settings and maps them to the appropriate controls.',
        'Every piece of evidence has a freshness lifecycle. You configure expiry periods per control or evidence type — for example, access review evidence expires every 90 days, while encryption configuration screenshots expire annually. As evidence approaches expiry, control owners receive automated reminder notifications. Expired evidence automatically reduces the control status and compliance score until refreshed.',
        'The evidence library supports bulk operations: you can tag multiple evidence items, reassign them to different controls, archive superseded versions, or export a full evidence package for auditor review. Each evidence item has a SHA-256 hash recorded at upload for integrity verification, and a complete access history showing every user who viewed or modified the record.',
      ],
    },
    {
      id: 'risk-management',
      title: 'Risk Management with the 5×5 Matrix',
      content: [
        'The risk matrix in Echo Compliance uses the industry-standard 5×5 model where every risk is scored on two dimensions: likelihood (1=rare, 5=near certain) and impact (1=negligible, 5=catastrophic). Multiplying these scores gives a risk rating from 1 to 25, which maps to four color-coded tiers: green (1–4, acceptable), yellow (5–9, monitor), orange (10–14, treat), and red (15–25, critical). The heat map view shows all your risks plotted on the matrix simultaneously.',
        'For each risk, you define a treatment type: Accept (document and monitor), Mitigate (implement or improve controls), Transfer (insure or contractually shift), or Avoid (stop the activity creating the risk). Mitigation treatments link directly to specific controls, creating traceability between your risk register and compliance control framework. As controls are implemented and evidence is added, the residual risk score automatically recalculates.',
        'Risk reviews are scheduled automatically based on risk tier: critical risks are flagged for quarterly review, high risks semi-annually, and others annually. Risk owners receive email reminders before review due dates. The risk review process includes confirming or updating likelihood/impact scores, documenting any changes in the threat environment, and updating treatment plans as needed.',
      ],
    },
    {
      id: 'policy-management',
      title: 'Policy Lifecycle and Acknowledgment',
      content: [
        'Echo Compliance provides a full document management system for your policy library. Policies are versioned — every edit creates a new version while the previous version is archived with its approval history intact. The version history tab shows every change, who made it, and when, providing a complete audit trail for regulators and auditors who need to verify policy governance.',
        'Policy approval workflows are fully configurable. You define a sequential list of approvers (e.g., policy author → legal review → CISO → CEO) and each approver receives an email notification when it\'s their turn. Approvers can approve, reject with comments, or request changes. Once all approvers have signed off, the policy publishes automatically and acknowledgment campaigns can be triggered.',
        'Acknowledgment campaigns ensure every employee has reviewed and confirmed understanding of required policies. Configure campaign scope (all employees, specific teams, specific roles), set a completion deadline, and enable automatic reminders. The completion dashboard shows real-time acknowledgment rates by department. Completed acknowledgments are stored with timestamp, IP address, and user identity for audit evidence.',
      ],
    },
    {
      id: 'audit-preparation',
      title: 'Preparing for an External Audit',
      content: [
        'When your audit date approaches, Echo Compliance provides a dedicated Audit Prep workflow that evaluates your current evidence coverage, identifies any controls still marked "not started" or "partial," and generates a gap report highlighting what needs to be addressed before your auditor arrives. The AI readiness score gives you a realistic prediction of audit readiness based on evidence quality and coverage.',
        'The audit workroom feature lets you create a secure, read-only environment for your external auditors. You specify which frameworks and date ranges are in scope, invite the auditors by email, and set an expiry date for access. Auditors can browse evidence organized by control, leave questions on specific controls, and request additional evidence — all within the workroom interface, with notifications sent to control owners.',
        'After the audit, use the Findings Tracker to manage any observations, exceptions, or recommendations from auditors. Each finding is assigned an owner, a remediation due date, and linked to the specific control it relates to. Status updates are tracked through to resolution and the closed finding becomes part of your audit evidence for future cycles.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'AI Control Auto-Population', desc: 'Connects to cloud infrastructure APIs and reads configuration state — IAM policies, encryption settings, logging configurations, network rules — to automatically populate controls with real evidence. Reduces manual evidence collection by up to 70% for cloud-native organizations.' },
    { capability: 'Gap Analysis Engine', desc: 'Analyzes current control status and evidence coverage against framework requirements to produce a structured gap report ranked by severity. Each gap includes the specific control failing, why it fails the requirement, estimated remediation effort (hours), and a concrete action recommendation.' },
    { capability: 'AI Readiness Scoring', desc: 'Predicts audit readiness probability based on evidence completeness, control implementation rates, policy acknowledgment coverage, and risk treatment status. Scores are domain-specific (security, availability, confidentiality, processing integrity, privacy) with specific improvement actions for each lagging domain.' },
    { capability: 'Risk Intelligence', desc: 'Analyzes your risk register against your industry peer data and current threat intelligence to suggest risks you may have missed. Flags controls that are theoretically implemented but have low evidence quality, creating hidden risk exposure. Recommends risk scoring adjustments based on recent incident data.' },
    { capability: 'Policy Generation Assistant', desc: 'Drafts compliant policy documents from templates tailored to your industry and applicable frameworks. Accepts context about your environment (cloud provider, company size, industry) and generates complete policy text including purpose, scope, definitions, requirements, and revision history sections — ready for human review and approval.' },
    { capability: 'Vendor Risk AI', desc: 'Scores vendor risk questionnaire responses automatically using NLP to extract security posture signals from free-text answers. Flags contradictory or incomplete responses, compares answers against expected standards for the vendor\'s service type, and generates a structured risk summary with recommended follow-up questions.' },
  ],

  troubleshooting: [
    { issue: 'Compliance score not updating after adding evidence', solution: 'Evidence uploads trigger an asynchronous score recalculation that typically completes within 60 seconds. Refresh the dashboard after one minute. If the score still has not updated, verify the evidence is mapped to the correct control and that the control status is not set to "Not Applicable" — N/A controls are excluded from scoring. Check the Evidence tab of the specific control to confirm the upload was accepted.' },
    { issue: 'Automated evidence collection not pulling from connected integrations', solution: 'Navigate to Settings > Integrations and verify the connection status shows "Active." Re-authorize the integration if the token has expired (OAuth tokens expire annually for most providers). Check that the IAM role or service account used for the integration has the required read permissions — the integration setup guide lists the minimum permission set for each provider. Collection runs every 24 hours; force a manual sync from the integration detail page.' },
    { issue: 'Policy acknowledgment emails not being received by employees', solution: 'Verify that the campaign is in "Active" status and has not passed its deadline. Check the email domain used for employee accounts is not on a suppression list in Settings > Email. Ask the affected employee to check their spam folder for messages from no-reply@echo-ept.com. For organizations with strict email security, add the Echo Compliance sending domain to your email allowlist. Re-send individual acknowledgment requests from the campaign detail page.' },
    { issue: 'Gap analysis taking too long or returning incomplete results', solution: 'Gap analysis runs as a background job and typically completes in 2–5 minutes for frameworks with under 100 controls. For large programs with 300+ controls across multiple frameworks, allow up to 15 minutes. If the analysis shows "pending" for more than 20 minutes, cancel it from the job queue in Settings > Background Jobs and retry. Ensure your AI credits are not exhausted — gap analysis consumes compute credits shown on your billing page.' },
    { issue: 'Risk matrix not displaying correctly on some screens', solution: 'The 5×5 risk matrix requires a minimum viewport width of 768px to render correctly. On smaller screens, the matrix collapses to a list view automatically. If the matrix is blank on a desktop screen, clear your browser cache and ensure JavaScript is not blocked. The matrix uses SVG rendering which requires a modern browser — Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ are supported.' },
  ],

  faq: [
    { q: 'Which compliance frameworks does Echo Compliance support?', a: 'Echo Compliance ships with SOC 2 Type I & II (all Trust Services Criteria), HIPAA (Security, Privacy, and Breach Notification Rules), GDPR (all 99 articles mapped to technical controls), and ISO 27001:2022 (all Annex A controls). Additional frameworks including PCI-DSS, NIST CSF, and FedRAMP are available on Enterprise plans. Custom framework builder lets you define your own control sets for internal compliance programs or industry-specific regulations.' },
    { q: 'How does cross-framework mapping work?', a: 'When you activate multiple frameworks, Echo Compliance automatically identifies controls that satisfy requirements in more than one framework. For example, your access review process satisfies SOC 2 CC6.2, HIPAA §164.308(a)(3), and ISO 27001 A.9.2 simultaneously. Evidence uploaded once maps to all three frameworks, so you maintain a single compliance program instead of three separate ones. The mapping is based on NIST\'s authoritative cross-framework reference data and reviewed quarterly.' },
    { q: 'Can Echo Compliance integrate with our existing tools?', a: 'Yes. Echo Compliance integrates with AWS (CloudTrail, Config, Security Hub), Azure (Policy, Defender, Activity Logs), GCP (Security Command Center, Audit Logs), GitHub (Audit Log, branch protection settings), Okta (access reviews, MFA status), Jira (map findings to tickets), Slack (compliance notifications), and PagerDuty (incident-to-control linkage). Custom webhook-based integrations are supported for any tool with an outbound webhook capability.' },
    { q: 'Is the evidence we upload stored securely?', a: 'All evidence files are encrypted at rest using AES-256 and in transit using TLS 1.3. Evidence is stored in Cloudflare R2 with access restricted to authenticated users with the appropriate control permissions. Evidence integrity is verified via SHA-256 hashing at upload and on retrieval. Audit logs record every access to every evidence file. Enterprise plans support customer-managed encryption keys (CMEK) and private storage bucket configuration.' },
    { q: 'How long does it take to get audit-ready?', a: 'Time to audit-readiness depends on your starting point and framework scope. For a SOC 2 Type I report (which covers a point-in-time assessment), most organizations with cloud infrastructure get to 80%+ readiness in 4–8 weeks using Echo Compliance\'s automated evidence collection and gap analysis. SOC 2 Type II requires a 6–12 month observation period regardless of tooling. The AI readiness score gives you a real-time assessment of where you stand at any moment.' },
    { q: 'Can our external auditors access Echo Compliance directly?', a: 'Yes. The Audit Workroom feature lets you grant external auditors read-only, time-limited access to a scoped view of your compliance evidence. Auditors can review control evidence organized by domain, ask questions via comment threads, and request additional documentation — all without needing a full Echo Compliance account. Workroom access is logged and automatically revoked at the expiry date you set.' },
  ],
}

export default function EchoComplianceDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/compliance' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
