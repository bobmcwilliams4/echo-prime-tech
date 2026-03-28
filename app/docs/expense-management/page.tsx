'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Expense Management',
  tagline: 'AI-powered expense tracking with receipt scanning, policy enforcement, approval workflows, and spending analytics.',
  accent: '#f97316',
  productUrl: '/expense-management',
  workerUrl: 'echo-expense.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Expense Management puts business expenses on autopilot. AI receipt scanning extracts merchant, amount, date, and category from receipt text automatically. Policy enforcement catches violations before submission, and multi-level approval workflows keep managers in control without creating bottlenecks.',
    'The platform covers the full expense lifecycle: mileage tracking with IRS rates, per diem calculations for business travel, multi-currency support with automatic normalization, budget tracking with overspend alerts, and reimbursement management from approval through payment.',
    'Unlike Brex and Ramp, Echo Expense does not require a corporate card. Employees can use any payment method — personal cards, corporate cards, cash, or any other method. The system tracks and reimburses expenses regardless of how they were paid. AI spending analysis provides 90-day insights on cost reduction and budget optimization.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Organization', desc: 'Sign up and configure your organization name, default currency, and expense categories. Plans start at $6/user/mo.' },
    { step: 2, title: 'Set Spending Policies', desc: 'Define per-category spending limits, receipt requirements, and auto-approve thresholds (e.g., expenses under $25 auto-approve).' },
    { step: 3, title: 'Invite Your Team', desc: 'Add employees and managers. Assign approval chains so each expense report routes to the correct reviewer.' },
    { step: 4, title: 'Submit First Expense', desc: 'Upload a receipt or enter expense details manually. AI will extract merchant, amount, and suggest a category with a confidence score.' },
    { step: 5, title: 'Review & Approve', desc: 'Managers review submitted reports, approve or deny with notes, and mark reimbursements as paid when processed.' },
  ],
  features: [
    { title: 'AI Receipt Scanning', desc: 'AI extracts merchant, amount, date, and category from receipt text. Auto-categorizes expenses with confidence scores to eliminate manual data entry.' },
    { title: 'Expense Reports', desc: 'Create reports, attach expenses, submit for approval. Track status through the full lifecycle: draft, submitted, approved, paid.' },
    { title: 'Approval Workflows', desc: 'Multi-level approval with manager review, notes, and full audit trail. Auto-approve expenses under configurable thresholds to eliminate bottlenecks.' },
    { title: 'Policy Enforcement', desc: 'Define spending policies per category with max amounts and receipt requirements. Auto-detect violations before submission reaches the approver.' },
    { title: 'Mileage Tracking', desc: 'Log business miles with configurable IRS mileage rates (default $0.67/mile). Auto-calculates reimbursement amounts for each trip.' },
    { title: 'Per Diem', desc: 'Per diem tracking with configurable daily rates. Auto-calculates total reimbursement for multi-day business trips.' },
    { title: 'Multi-Currency', desc: 'Log expenses in any currency with exchange rates. All amounts normalize to your organization currency for reporting.' },
    { title: 'Budget Tracking', desc: 'Set department and category budgets with period controls. Real-time utilization tracking and overspend alerts at configurable thresholds.' },
    { title: 'Reimbursement Management', desc: 'Track reimbursement status from approval to payment. Supports direct deposit, check, and manual payment methods with reference numbers.' },
    { title: 'Duplicate Detection', desc: 'AI-powered duplicate detection finds expenses with matching merchant, amount, and date across your organization.' },
    { title: 'Spending Analytics', desc: 'AI analyzes 90-day spending patterns and provides insights on cost reduction, budget optimization, and trend identification.' },
    { title: 'CSV/JSON Export', desc: 'Export expenses with date ranges for payroll, accounting, QuickBooks, or any external system integration.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/expenses', desc: 'Create a new expense entry with receipt data, amount, and category.', auth: true },
    { method: 'GET', path: '/api/expenses', desc: 'List expenses with filters for date range, category, status, and employee.', auth: true },
    { method: 'POST', path: '/api/expenses/scan-receipt', desc: 'Submit receipt text for AI extraction of merchant, amount, date, and category.', auth: true },
    { method: 'POST', path: '/api/reports', desc: 'Create an expense report and attach selected expenses for approval.', auth: true },
    { method: 'PUT', path: '/api/reports/:id/approve', desc: 'Approve or deny an expense report with optional manager notes.', auth: true },
    { method: 'GET', path: '/api/budgets', desc: 'Retrieve budget status with utilization percentages by category and department.', auth: true },
    { method: 'GET', path: '/api/analytics/spending', desc: 'Get AI-generated 90-day spending analysis with actionable insights.', auth: true },
    { method: 'GET', path: '/api/export', desc: 'Export expenses as CSV or JSON for a specified date range.', auth: true },
    { method: 'GET', path: '/health', desc: 'Worker health check endpoint.', auth: false },
  ],
  userGuide: [
    { title: 'Submitting Expenses', id: 'submitting', content: [
      'To submit an expense, navigate to the Expenses tab and click "New Expense." You can enter details manually or paste receipt text for AI extraction. The AI will identify the merchant, amount, date, and suggest a category.',
      'Attach the expense to an existing report or create a new one. Once all expenses are attached, submit the report for manager approval. The system checks all expenses against spending policies before submission and flags any violations.',
      'Mileage expenses use a separate form where you enter miles driven and the system calculates reimbursement using the configured IRS rate.',
    ]},
    { title: 'Managing Approvals', id: 'approvals', content: [
      'Managers receive notifications when reports are submitted. Open the report to review each expense line item, receipt data, and policy compliance status.',
      'Approve the entire report or deny individual expenses with notes explaining the reason. Approved reports move to the reimbursement queue. Expenses under the auto-approve threshold bypass manager review entirely.',
    ]},
    { title: 'Budget Configuration', id: 'budgets', content: [
      'Set budgets by department or category with monthly, quarterly, or annual periods. The dashboard shows real-time utilization as a percentage of each budget.',
      'Configure alert thresholds (default 80%) to receive notifications before budgets are exceeded. Budget data feeds into the AI spending analysis for optimization recommendations.',
    ]},
    { title: 'Reimbursement Workflow', id: 'reimbursements', content: [
      'After a report is approved, mark it as paid with the payment method (direct deposit, check, etc.) and reference number. The system creates a reimbursement record linked to the original report.',
      'Track the full lifecycle from expense submission through payment. Export reimbursement data for payroll processing via CSV or JSON.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Receipt Scanning', desc: 'Extracts merchant name, amount, date, and category from receipt text with confidence scoring. Eliminates manual data entry for most expenses.' },
    { capability: 'Auto-Categorization', desc: 'Classifies expenses into categories like meals, travel, supplies, and software based on merchant and description analysis.' },
    { capability: 'Duplicate Detection', desc: 'Identifies potential duplicate expenses by matching merchant, amount, and date patterns across the organization.' },
    { capability: 'Spending Pattern Analysis', desc: 'Analyzes 90 days of expense data to identify cost reduction opportunities, budget optimization suggestions, and spending anomalies.' },
    { capability: 'Policy Violation Prediction', desc: 'Pre-checks expenses against spending policies before submission, flagging violations to employees before they reach the approval queue.' },
  ],
  troubleshooting: [
    { issue: 'Receipt scanning returns incorrect category', solution: 'AI categorization uses merchant name and description. If the category is wrong, manually override it. The system learns from corrections over time to improve accuracy.' },
    { issue: 'Expense report stuck in submitted status', solution: 'Verify the assigned approver has access to the system. Check if the report triggered a policy violation that requires additional review. Contact the approver directly if the delay is unexpected.' },
    { issue: 'Mileage rate incorrect', solution: 'Mileage rates are configurable per organization. Go to Settings > Mileage Rates and update the per-mile amount. The IRS standard rate for 2026 is the default.' },
    { issue: 'Budget alerts not triggering', solution: 'Check that budget alert thresholds are configured (Settings > Budgets). Default is 80%. Ensure the budget period matches the current calendar period.' },
    { issue: 'Export missing expenses', solution: 'Verify the date range filter covers the expected period. Only expenses in approved or paid status are included in exports by default.' },
  ],
  faq: [
    { q: 'How does AI receipt scanning work?', a: 'Submit receipt text (from a photo or scan) and our AI extracts the merchant name, amount, date, and suggests a category with a confidence score. This saves manual data entry and reduces errors on expense submissions.' },
    { q: 'What is the auto-approve threshold?', a: 'You can set a dollar amount (e.g., $25) below which expenses are automatically approved without manager review. This eliminates approval bottleneck for small purchases while enforcing review for larger expenses.' },
    { q: 'Do I need a corporate card?', a: 'No. Unlike Brex and Ramp which require their corporate cards, Echo Expense works with any payment method. Employees can use personal cards, corporate cards, cash, or any other method.' },
    { q: 'Can I track mileage and per diem?', a: 'Yes. Log business miles and the system calculates reimbursement using configurable mileage rates (default: IRS standard $0.67/mile). For per diem, enter the number of days and the daily rate auto-calculates the total.' },
    { q: 'What plans are available?', a: 'Starter at $6/user/mo (25 employees, basic features), Business at $12/user/mo (unlimited employees, AI features, policy enforcement), and Enterprise at $22/user/mo (SSO, audit compliance, custom approval chains).' },
  ],
}

export default function ExpenseManagementDocsPage() {
  return <ProductDoc {...data} />
}
