'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Expense',
  tagline: 'AI expense management — receipt scanning, policy enforcement, and automated approvals.',
  accent: '#14b8a6',
  productUrl: '/expense',
  workerUrl: 'https://echo-expense.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Expense Management is a comprehensive AI-powered platform that transforms how businesses handle expense tracking, policy enforcement, and reimbursement workflows. From the moment an employee photographs a receipt, the system extracts every detail via advanced OCR, auto-categorizes the expense against your company policy, flags potential violations before submission, and routes the report through configurable approval chains — all without manual data entry. What used to consume hours of spreadsheet work now happens in seconds.',
    'The platform handles the full expense lifecycle: corporate card transaction reconciliation, mileage tracking with GPS verification, per diem calculations for domestic and international travel, multi-currency conversion at actual transaction rates, and granular tax categorization for every line item. Finance teams get real-time visibility into company spending with drill-down dashboards, budget tracking against departmental allocations, and anomaly detection that surfaces duplicate submissions, split transactions, and policy-circumvention patterns before they become audit findings.',
    'Built for organizations of every size, Echo Expense Management scales from a 10-person startup with simple receipt tracking to a 10,000-employee enterprise with complex approval hierarchies, multi-entity accounting, and compliance requirements across jurisdictions. Integration with major accounting platforms (QuickBooks, Xero, NetSuite, SAP), payroll systems, and corporate card providers ensures expense data flows seamlessly into your existing financial infrastructure without duplicate entry or reconciliation headaches.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Organization', desc: 'Sign up at echo-ept.com/expense and configure your organization profile including company name, base currency, fiscal year, and default expense categories. Upload your company logo for branded expense reports and employee-facing interfaces.' },
    { step: 2, title: 'Define Expense Policies', desc: 'Set up your expense policy rules: spending limits per category (meals, travel, supplies), per diem rates by destination, mileage reimbursement rates, receipt requirements by threshold, and restricted merchant categories. The AI enforces these rules automatically at submission time.' },
    { step: 3, title: 'Configure Approval Workflows', desc: 'Build approval chains based on your organizational hierarchy. Define routing rules by expense amount, category, department, or cost center. Set up multi-level approvals for high-value expenses and auto-approval thresholds for low-value items to reduce bottlenecks.' },
    { step: 4, title: 'Connect Financial Systems', desc: 'Integrate with your accounting platform (QuickBooks, Xero, NetSuite, SAP) and corporate card provider. Authorized transactions sync automatically for reconciliation. Map expense categories to your chart of accounts for seamless GL posting.' },
    { step: 5, title: 'Invite Employees', desc: 'Add employees via email invite, CSV bulk upload, or HRIS integration. Each employee receives access to the mobile app and web portal for submitting expenses. Assign departments, cost centers, default approvers, and spending limits per employee or role.' },
  ],

  features: [
    { title: 'Receipt OCR', desc: 'Photograph any receipt with the mobile app and the AI extracts merchant name, date, total, tax, tip, line items, and payment method in under 2 seconds. Supports receipts in 40+ languages, handles crumpled and faded paper, and works with digital receipts forwarded via email.' },
    { title: 'Auto-Categorization', desc: 'Every expense is automatically categorized based on merchant type, receipt content, and historical patterns. Categories map directly to your chart of accounts. Employees can override categories, but the AI learns from corrections to improve future accuracy — reaching 97%+ after 500 transactions.' },
    { title: 'Policy Enforcement', desc: 'Real-time policy checks at the point of submission catch violations before they enter the approval queue. Over-limit spending, missing receipts, restricted merchants, weekend expenses, and duplicate submissions are flagged with clear explanations and suggested corrections.' },
    { title: 'Approval Workflows', desc: 'Configurable multi-level approval chains with conditional routing. Expenses under $50 auto-approve, $50-$500 go to direct manager, $500+ require VP sign-off. Approvers receive push notifications and can approve/reject/request-info directly from email or the mobile app.' },
    { title: 'Corporate Card Reconciliation', desc: 'Automated matching of corporate card transactions to submitted expense reports. Unmatched card charges are surfaced to employees for receipt attachment and categorization. Reconciliation dashboards show matched, pending, and orphaned transactions across all cardholders.' },
    { title: 'Mileage Tracking', desc: 'GPS-verified mileage tracking with automatic route recording. Employees start a trip from the mobile app and the system calculates distance, applies the configured reimbursement rate (IRS standard or custom), and generates the expense line item. Supports commute deduction rules and round-trip detection.' },
    { title: 'Per Diem Calculation', desc: 'Automatic per diem rate lookup based on travel destination using GSA (domestic) and State Department (international) rates. Supports partial-day calculations for first/last travel days, meal deductions when meals are provided, and incidental expense allowances. Rates update automatically when government schedules change.' },
    { title: 'Multi-Currency Support', desc: 'Expenses in foreign currencies are converted using the actual transaction exchange rate from the card provider, or the daily mid-market rate for cash expenses. Supports 150+ currencies with automatic conversion to your base currency. Exchange rate gains/losses are tracked and reported separately.' },
    { title: 'Tax Categorization', desc: 'Every expense is tagged with the appropriate tax treatment: deductible, partially deductible, non-deductible, or capital expenditure. Sales tax, VAT, and GST are extracted from receipts and categorized for input tax credit recovery. Year-end tax reports are generated automatically by category.' },
    { title: 'Expense Reporting', desc: 'Real-time dashboards show spending by department, category, employee, project, and time period. Budget vs. actual tracking with variance alerts. Trend analysis identifies spending pattern changes. Export reports in PDF, CSV, or direct GL journal entries. Schedule automated email reports for finance leadership.' },
    { title: 'Duplicate Detection', desc: 'AI-powered duplicate detection catches identical, near-identical, and split-transaction patterns across all employees. Same merchant + same amount + same date across different submitters triggers a review flag. Split transactions that individually fall below receipt-required thresholds are automatically surfaced.' },
    { title: 'Audit Trail', desc: 'Complete immutable audit trail for every expense from creation through reimbursement. Every edit, approval, rejection, policy override, and status change is logged with timestamp, actor, and reason. Audit-ready export packages include all receipts, approvals, and policy compliance evidence.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/expenses', desc: 'Submit a new expense with receipt image, amount, currency, category, date, merchant, and optional memo. Receipt is processed via OCR and validated against company policy.', auth: true },
    { method: 'GET', path: '/expenses', desc: 'List expenses with filtering by status, category, date range, employee, department, and amount range. Supports pagination, sorting, and search by merchant name or memo text.', auth: true },
    { method: 'POST', path: '/reports', desc: 'Create an expense report by grouping multiple expense IDs. Attach to a trip, project, or cost center. Submits the report into the configured approval workflow.', auth: true },
    { method: 'POST', path: '/approve', desc: 'Approve or reject an expense or expense report. Requires manager or finance role. Rejections require a comment. Approved expenses queue for reimbursement.', auth: true },
    { method: 'POST', path: '/ai/scan-receipt', desc: 'Submit a receipt image (base64 or URL) for AI OCR extraction. Returns merchant, date, amount, tax, currency, and suggested expense category with confidence scores.', auth: true },
    { method: 'GET', path: '/policies', desc: 'Retrieve the current expense policy configuration — category limits, per diem rates by city, mileage rates, auto-approve thresholds, and required fields by category.', auth: true },
    { method: 'POST', path: '/mileage', desc: 'Submit a mileage expense with origin, destination, date, and purpose. System calculates distance via routing API and applies configured reimbursement rate.', auth: true },
    { method: 'GET', path: '/budgets', desc: 'Retrieve department and category budget status — allocated amount, consumed to date, remaining, and projected month-end based on current spending velocity.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Spending analytics for a date range — total by department, category, employee, and project. Top spenders, policy violation rates, average approval times, and reimbursement cycle times.', auth: true },
  ],

  userGuide: [
    {
      title: 'Submitting Expenses',
      id: 'submitting-expenses',
      content: [
        'The fastest way to submit an expense is through the mobile app. Tap the camera icon, photograph your receipt, and the AI extracts all relevant data in seconds. Review the extracted fields — merchant, date, amount, tax, category — make any corrections, add an optional memo or project code, and tap Submit. The expense enters your draft report or, if configured, submits directly into the approval workflow.',
        'For digital receipts, forward the email to your unique intake address (shown in Settings > Email Intake). The system parses the email body and attachments to extract expense data automatically. Credit card transaction confirmation emails, airline itineraries, hotel folios, and ride-share receipts are all supported with dedicated parsers that extract line-item detail beyond what generic OCR captures.',
        'Bulk submission is available from the web dashboard for employees who batch their expenses weekly. Upload multiple receipt images at once, and the system processes them in parallel. Review all extracted data in a spreadsheet-style editor, make corrections across multiple expenses simultaneously, and submit the entire batch as a single report.',
      ],
    },
    {
      title: 'Approval & Reimbursement',
      id: 'approval-reimbursement',
      content: [
        'Approvers receive notifications via push notification, email, and in-app badge when a report requires their review. The approval view shows all line items with receipt thumbnails, policy compliance indicators (green check, yellow warning, red violation), and the total amount. Approvers can approve the full report, reject it with comments, approve individual line items while rejecting others, or request additional information from the submitter.',
        'Multi-level approval chains process sequentially — a report must be approved at each level before advancing to the next. If an approver is unavailable for more than the configured timeout (default: 48 hours), the system automatically escalates to their designated delegate or the next level. Finance admins can manually reassign reports stuck in the approval queue.',
        'Once fully approved, reimbursements are processed according to your configured schedule — real-time ACH, next payroll cycle, or manual batch. The system generates payment files compatible with major payroll and banking platforms. Employees receive notification when their reimbursement is processed, with a breakdown showing approved amounts, rejected items (with reasons), and the net payment.',
      ],
    },
    {
      title: 'Corporate Card Management',
      id: 'corporate-card-management',
      content: [
        'Corporate card transactions sync automatically from your card provider via direct feed or file import. Each transaction appears in the cardholder\'s reconciliation queue within 24 hours of posting. The AI pre-categorizes transactions and attempts to match them against submitted expense reports. Matched transactions show a green indicator; unmatched transactions require the employee to attach a receipt and categorize.',
        'The reconciliation dashboard gives finance teams a real-time view of card program health: total outstanding unreconciled transactions, aging of unmatched charges, policy violations on card transactions, and per-cardholder reconciliation status. Automated reminders notify employees when card charges are aging past the reconciliation window.',
        'Card transaction limits and merchant category restrictions are enforced in real-time if your card issuer supports pre-authorization controls. Otherwise, policy violations are flagged post-transaction during reconciliation. The system tracks personal charges on corporate cards separately and generates repayment records for payroll deduction or direct repayment.',
      ],
    },
    {
      title: 'Travel & Per Diem',
      id: 'travel-per-diem',
      content: [
        'Create a trip record before or during business travel by specifying the destination, dates, and purpose. The system automatically calculates applicable per diem rates using GSA rates for domestic travel and State Department rates for international destinations. Per diem is split into lodging and meals/incidentals components, with first and last travel days receiving 75% of the meals rate per federal guidelines.',
        'For mileage reimbursement, activate GPS tracking from the mobile app before starting your drive. The system records the route, calculates total distance using the shortest practical path, and applies the configured rate (IRS standard mileage rate or your company\'s custom rate). Regular commute distance can be automatically deducted for trips that start or end at home. Round trips are detected and consolidated into a single line item.',
        'International travel features include automatic currency conversion for all expense types, country-specific tax reclaim guidance (VAT refund eligibility), visa and travel insurance expense tracking, and per diem adjustments for high-cost localities. The trip summary report compiles all travel-related expenses into a single document suitable for client billing or internal cost allocation.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Intelligent OCR Extraction', desc: 'Multi-model OCR pipeline combines specialized receipt parsing with general document understanding. Handles 40+ languages, degraded print quality, handwritten amounts, and complex layouts like hotel folios with room charges, taxes, and resort fees broken out. Extraction accuracy exceeds 98% on standard receipts and 94% on complex multi-page invoices.' },
    { capability: 'Anomaly & Fraud Detection', desc: 'Behavioral analysis engine learns normal spending patterns per employee, department, and role. Flags statistical outliers: unusual merchants, atypical amounts for the category, geographic impossibilities (expense in New York and London on the same day), round-number patterns suggesting fabrication, and weekend/holiday charges in categories that suggest personal use.' },
    { capability: 'Smart Categorization Learning', desc: 'The categorization model adapts to your organization\'s specific chart of accounts and expense taxonomy. It starts with a pre-trained model covering 500+ merchant categories, then fine-tunes based on your employees\' corrections. After 500 transactions, the model achieves 97%+ accuracy on your specific categories, including custom categories unique to your business.' },
    { capability: 'Policy Compliance Prediction', desc: 'Before an employee submits an expense, the AI pre-evaluates it against all applicable policies and surfaces warnings proactively. If a meal expense at a restaurant exceeds the per-person limit, the system suggests splitting the check or notes which attendees to add. This prevents rejection and resubmission cycles that waste time for both submitters and approvers.' },
    { capability: 'Spend Forecasting', desc: 'Historical spending data feeds a forecasting model that projects future expenses by department, category, and project. Finance teams can compare forecasts against budgets to identify potential overruns before they happen. The model accounts for seasonal patterns, headcount changes, planned travel, and historical variance to produce confidence-banded projections.' },
    { capability: 'Natural Language Expense Entry', desc: 'Employees can submit expenses by typing or speaking a natural language description: "Lunch with client at Ruth\'s Chris, $127.50, project Falcon." The AI parses the description into structured fields — amount, merchant, category (client entertainment), project code — and creates the expense record. Missing fields are prompted conversationally.' },
  ],

  troubleshooting: [
    { issue: 'Receipt OCR is extracting incorrect amounts or dates', solution: 'Ensure the receipt photo is well-lit, in focus, and captures the entire receipt including the total line. Avoid shadows and glare on thermal paper receipts. If the receipt is faded, try adjusting your phone\'s exposure before photographing. For persistent extraction errors on specific receipt formats, report the issue from the expense detail screen — the system learns from corrections.' },
    { issue: 'Corporate card transactions are not syncing', solution: 'Card transaction feeds typically sync within 24 hours of the charge posting to your account (not the authorization date). If transactions are missing after 48 hours, verify the card feed integration is active under Settings > Integrations > Card Providers. Check that the card in question is enrolled in the feed — new cards may need to be added manually by your card administrator.' },
    { issue: 'Expense reports are stuck in the approval queue', solution: 'Check the approval chain status on the report detail page to identify which approver is pending. If the approver is unavailable, an admin can reassign the report from the Admin > Pending Approvals dashboard. Configure automatic escalation rules under Settings > Workflows > Escalation to prevent future bottlenecks by auto-routing to delegates after a configurable timeout.' },
    { issue: 'Per diem rates seem incorrect for my travel destination', solution: 'Verify the destination city/county is correctly identified on the trip record. GSA rates vary by county, and some cities have rates different from the surrounding county. The system uses the most specific rate available. For international travel, rates update quarterly — check Settings > Per Diem > Rate Source to confirm rates are current. You can override rates at the organizational level for destinations where your company has negotiated different allowances.' },
  ],

  faq: [
    { q: 'Can employees submit expenses without a receipt?', a: 'This depends on your company policy configuration. By default, receipts are required for expenses over $25 (configurable). Expenses below the threshold can be submitted with a description only. For lost receipts, employees can submit a lost receipt affidavit from the expense detail screen, which logs their attestation for audit purposes. Admins can set stricter or more lenient receipt requirements per category.' },
    { q: 'Does Echo Expense Management integrate with our accounting software?', a: 'Yes. Native integrations are available for QuickBooks Online, QuickBooks Desktop, Xero, NetSuite, SAP Concur, and Sage. Approved expense reports are automatically exported as journal entries mapped to your chart of accounts. For other accounting platforms, the API supports exporting expense data in standard formats (CSV, IIF, JE) or via webhook for custom integration.' },
    { q: 'How does multi-currency reimbursement work?', a: 'Expenses submitted in foreign currencies are converted to your organization\'s base currency using the exchange rate from the card provider (for card transactions) or the mid-market rate on the transaction date (for cash expenses). Reimbursement is always paid in the employee\'s configured payout currency. Exchange rate differences between submission and reimbursement dates are tracked as FX gain/loss in the GL.' },
    { q: 'Is the system compliant with IRS documentation requirements?', a: 'Yes. Echo Expense Management enforces IRS Accountable Plan requirements including timely submission (within 60 days of expense), business purpose documentation, receipt retention for amounts over $75 (or your lower threshold), and return of excess advances. The audit trail provides the contemporaneous documentation the IRS requires. Annual compliance reports summarize per-employee substantiation status.' },
    { q: 'Can I set different policies for different departments or employee levels?', a: 'Yes. Expense policies can be scoped by department, cost center, employee role, or individual. A field sales team might have higher meal and entertainment limits than engineering, while executives might have different approval chains. Policy inheritance lets you set organization-wide defaults and override specific rules at the department or role level without duplicating the entire policy.' },
  ],
}

export default function EchoExpenseDocsPage() {
  return <ProductDoc {...data} />
}
