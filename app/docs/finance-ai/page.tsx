'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Echo Finance AI',
  tagline: 'AI-powered financial analysis, forecasting, bookkeeping automation, and compliance monitoring for businesses of all sizes.',
  accent: '#10b981',
  productUrl: '/finance-ai',
  workerUrl: 'https://echo-finance-ai.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Finance AI combines Intelligence Engine expertise in tax, accounting, and financial regulations with automated data processing to deliver a comprehensive financial management platform. Unlike generic accounting software that requires manual categorization and interpretation, Finance AI understands the domain \u2014 it knows which expenses are deductible under IRC \u00a7179, which transactions require 1099 reporting, and which financial patterns indicate compliance risks.',
    'The platform handles three layers: operational (bookkeeping, categorization, reconciliation), analytical (cash flow forecasting, profitability analysis, scenario modeling), and compliance (tax obligation tracking, regulatory deadline monitoring, audit preparation). Each layer is powered by domain-specific Intelligence Engines with doctrine-backed analysis, ensuring every recommendation traces to authoritative sources.',
    'Integration with the broader Echo ecosystem means Finance AI connects to your CRM for revenue forecasting, your invoicing system for AR/AP automation, your email marketing for campaign ROI attribution, and your workflow automation for approval chains. For professional services firms, it integrates with the Tax Returns product for seamless return preparation.',
  ],
  gettingStarted: [
    { step: 1, title: 'Connect Your Accounts', desc: 'Link bank accounts, credit cards, and payment processors via Plaid or manual CSV import. The system categorizes transactions automatically using AI trained on your industry\'s chart of accounts.' },
    { step: 2, title: 'Set Up Your Chart of Accounts', desc: 'Start with an industry-specific template (oilfield, professional services, SaaS, retail, construction, etc.) or import your existing chart. AI maps your historical transactions to the new structure.' },
    { step: 3, title: 'Review AI Categorizations', desc: 'The dashboard highlights transactions needing review. AI categorizes with 95%+ accuracy for established patterns. Train the system on edge cases and accuracy improves over time.' },
    { step: 4, title: 'Configure Compliance Rules', desc: 'Set up tax jurisdiction rules, 1099 reporting thresholds, depreciation schedules, and regulatory deadlines. The system monitors automatically and alerts before deadlines.' },
    { step: 5, title: 'Generate Reports', desc: 'Generate P&L, balance sheet, cash flow statement, and custom financial reports on demand. Schedule recurring reports with automatic email delivery to stakeholders.' },
  ],
  features: [
    { title: 'AI Transaction Categorization', desc: 'Machine learning trained on millions of business transactions categorizes with 95%+ accuracy. Learns from your corrections to improve over time. Handles multi-entity, multi-currency transactions.' },
    { title: 'Cash Flow Forecasting', desc: 'AI analyzes historical patterns, seasonal trends, and upcoming obligations to project cash flow 30/60/90 days out. Scenario modeling for what-if analysis (lose a client, hire 3 people, buy equipment).' },
    { title: 'Tax Compliance Monitoring', desc: 'Real-time tracking of tax obligations across federal, state, and local jurisdictions. Automatic deadline alerts, estimated payment calculations, and 1099 contractor tracking.' },
    { title: 'Expense Management', desc: 'Receipt scanning with OCR, automatic expense categorization, policy enforcement, and approval workflows. Mobile app for on-the-go expense capture.' },
    { title: 'AR/AP Automation', desc: 'Automated invoice creation, payment reminders, aging reports, and collection workflows for accounts receivable. Purchase order matching and approval chains for accounts payable.' },
    { title: 'Multi-Entity Support', desc: 'Manage multiple business entities, LLCs, and subsidiaries from one dashboard. Consolidated reporting with inter-company elimination. Entity-specific compliance rules.' },
    { title: 'Audit Preparation', desc: 'Generate audit-ready documentation packages with categorized transactions, supporting documents, reconciliation reports, and compliance certifications. One-click audit trail export.' },
    { title: 'Profitability Analysis', desc: 'Track profitability by client, project, department, or product line. AI identifies margin trends, cost anomalies, and revenue concentration risks.' },
    { title: 'Bank Reconciliation', desc: 'Automated matching of bank transactions to ledger entries. AI resolves common mismatches (timing differences, partial payments, fees) automatically. Exceptions flagged for review.' },
    { title: 'Depreciation Tracking', desc: 'Automatic depreciation calculation for all fixed assets using MACRS, straight-line, or declining balance methods. Section 179 and bonus depreciation optimization suggestions.' },
    { title: 'Financial Dashboards', desc: 'Real-time dashboards for key metrics: revenue, expenses, profit margin, cash position, AR aging, AP aging, and custom KPIs. Shareable with stakeholders via secure links.' },
    { title: 'API Integration', desc: 'REST API for all financial data: transactions, accounts, reports, and compliance status. Webhook events for real-time integration with external systems.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/transactions', desc: 'List transactions with filtering by date range, account, category, amount range, and status. Supports pagination and CSV export.', auth: true },
    { method: 'POST', path: '/api/transactions/categorize', desc: 'AI categorizes a batch of uncategorized transactions. Returns categories with confidence scores. Accepts corrections for model training.', auth: true },
    { method: 'GET', path: '/api/reports/pnl', desc: 'Generate a profit and loss statement for a date range. Supports monthly/quarterly/annual periods with comparative analysis.', auth: true },
    { method: 'GET', path: '/api/reports/balance-sheet', desc: 'Generate a balance sheet as of a specific date. Includes asset, liability, and equity breakdowns with sub-account detail.', auth: true },
    { method: 'GET', path: '/api/reports/cash-flow', desc: 'Generate a cash flow statement for a date range. Categories: operating, investing, and financing activities.', auth: true },
    { method: 'POST', path: '/api/forecast', desc: 'AI cash flow forecast for 30/60/90 days based on historical patterns and known upcoming obligations. Includes scenario modeling.', auth: true },
    { method: 'GET', path: '/api/compliance/deadlines', desc: 'List upcoming tax and regulatory deadlines with days remaining, estimated amounts due, and preparation status.', auth: true },
    { method: 'POST', path: '/api/reconcile', desc: 'Trigger bank reconciliation for a specific account and date range. Returns matched, unmatched, and exception transactions.', auth: true },
  ],
  userGuide: [
    { id: 'categorization', title: 'Transaction Categorization', content: [
      'The AI categorization engine uses a multi-signal approach: vendor name matching, transaction description parsing, amount pattern analysis, and historical categorization for the same vendor. New vendors are categorized based on industry classification and transaction characteristics.',
      'When the AI categorizes a transaction with less than 90% confidence, it appears in your review queue. Approve or correct the categorization \u2014 corrections train the model for future transactions from the same vendor or pattern.',
      'For multi-entity businesses, categorization rules are entity-specific. The same vendor might categorize differently across entities (e.g., inter-company payments vs. external expenses). The system handles this automatically once configured.',
    ]},
    { id: 'tax-compliance', title: 'Tax Compliance Monitoring', content: [
      'Configure your tax jurisdictions and filing obligations during setup. The system tracks federal, state, and local tax deadlines automatically. Estimated tax payment calculations use your actual YTD income data, not generic estimates.',
      'Contractor payments are tracked for 1099 reporting. The system flags when a contractor approaches the $600 threshold and collects W-9 information. Year-end 1099 generation is one-click.',
      'For industries with specific tax considerations (oilfield depletion, real estate depreciation, R&D credits), the compliance engine uses domain-specific Intelligence Engines to identify optimization opportunities. Recommendations come with IRC citations.',
    ]},
    { id: 'forecasting', title: 'Cash Flow Forecasting', content: [
      'The forecasting engine analyzes 12+ months of historical data to identify patterns: seasonal revenue cycles, recurring expense timing, payment collection velocity, and cash conversion cycles.',
      'Known future obligations (rent, loan payments, estimated taxes, payroll) are incorporated as fixed cash flows. Variable items (expected revenue, vendor payments) use probabilistic modeling with confidence bands.',
      'Scenario modeling lets you explore what-if questions: "What happens to cash flow if we lose our largest client?" or "Can we afford to hire 3 engineers next quarter?" Each scenario runs against your actual financial data.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Intelligent Categorization', desc: 'AI categorizes transactions with 95%+ accuracy using multi-signal analysis. Learns from corrections to improve over time. Handles edge cases like split transactions and inter-company transfers.' },
    { capability: 'Tax Optimization', desc: 'AI identifies deduction opportunities, Section 179 strategies, and timing optimizations using Tax Intelligence Engines backed by IRC doctrine. Every suggestion includes authority citations.' },
    { capability: 'Anomaly Detection', desc: 'AI flags unusual transactions: duplicate payments, amount outliers, new vendors, and pattern breaks. Configurable sensitivity prevents alert fatigue while catching genuine issues.' },
    { capability: 'Predictive Forecasting', desc: 'Time-series analysis with seasonal decomposition, trend detection, and external factor correlation. Cash flow predictions include confidence intervals and scenario sensitivity.' },
    { capability: 'Compliance Risk Scoring', desc: 'AI continuously assesses your compliance posture across tax, regulatory, and reporting obligations. Risk scores update in real-time as transactions are processed and deadlines approach.' },
  ],
  troubleshooting: [
    { issue: 'AI miscategorizing transactions from a specific vendor', solution: 'Manually correct 3-5 transactions from that vendor. The model retrains incrementally. If the vendor has unusual transaction descriptions, add a vendor-specific categorization rule in settings.' },
    { issue: 'Cash flow forecast seems inaccurate', solution: 'The model needs 3+ months of history for reasonable accuracy. Check if large one-time transactions are skewing the baseline \u2014 mark them as non-recurring in the transaction detail. Ensure all known future obligations are entered.' },
    { issue: 'Bank reconciliation showing many unmatched items', solution: 'Check the date range alignment between bank and ledger. Common causes: timing differences at month boundaries, transaction description mismatches, or bank fees not entered in the ledger.' },
    { issue: 'Multi-entity reports not consolidating correctly', solution: 'Verify inter-company accounts are properly configured with matching elimination entries. Check that all entities use the same chart of accounts structure or have proper account mappings defined.' },
  ],
  faq: [
    { q: 'Can this replace my accountant?', a: 'Finance AI handles day-to-day bookkeeping, categorization, and compliance monitoring. For complex tax strategy, audit defense, and formal opinions, you still need a CPA. The platform gives your accountant better data and saves them hours of manual work.' },
    { q: 'How does it handle multiple currencies?', a: 'Full multi-currency support with automatic exchange rate conversion using daily rates. Realized and unrealized gain/loss tracking. Separate reporting by currency or consolidated in your base currency.' },
    { q: 'Is my financial data secure?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Bank connections use Plaid with tokenized access \u2014 we never store bank credentials. SOC 2 Type II compliant infrastructure.' },
    { q: 'Can I import from QuickBooks or Xero?', a: 'Yes. Direct import from QuickBooks Desktop, QuickBooks Online, Xero, FreshBooks, and Wave. The import maps your existing chart of accounts and transaction history automatically.' },
    { q: 'How does the tax compliance monitoring work?', a: 'The system tracks your filing obligations based on entity type, jurisdictions, and activities. It monitors deadlines, calculates estimated payments, tracks contractor 1099 thresholds, and flags compliance risks using Tax Intelligence Engines.' },
  ],
}

export default function FinanceAiDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/finance-ai' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
