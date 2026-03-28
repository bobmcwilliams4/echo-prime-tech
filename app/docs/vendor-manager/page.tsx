'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Vendor Manager',
  tagline: 'AI-powered vendor lifecycle management — onboarding, contracts, performance scoring, risk assessment, and spend analytics.',
  accent: '#059669',
  productUrl: '/vendor-manager',
  workerUrl: 'https://echo-vendor-manager.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Vendor Manager provides end-to-end vendor lifecycle management from onboarding through performance evaluation. Track contracts, monitor compliance, score vendor performance, and optimize spend — all from a single platform.',
    'The AI engine analyzes vendor performance patterns, predicts delivery risks, and recommends optimal procurement strategies. Automated alerts for contract renewals, compliance expirations, and performance degradation ensure nothing falls through the cracks.',
    'With full integration into the Echo ecosystem, vendor data flows into your CRM, invoicing, and compliance systems automatically. Multi-tier approval workflows, document management, and complete audit trails keep your procurement process secure and compliant.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Vendor Database', desc: 'Add vendors individually or bulk import from CSV. Each vendor profile includes company details, contacts, categories, certifications, and insurance information.' },
    { step: 2, title: 'Set Up Categories', desc: 'Organize vendors into categories (IT, facilities, professional services, supplies). Categories enable spend analysis and vendor comparison within segments.' },
    { step: 3, title: 'Upload Contracts', desc: 'Attach contracts to vendor profiles with key dates (start, end, renewal), terms, and compliance requirements. Set automatic renewal reminders.' },
    { step: 4, title: 'Configure Scorecards', desc: 'Define performance dimensions (quality, delivery, pricing, communication, compliance) with weighted scoring. Set minimum acceptable scores and review cadence.' },
    { step: 5, title: 'Start Managing', desc: 'Begin tracking vendor interactions, performance, and spend. The AI engine starts building performance baselines after the first scoring cycle.' },
  ],

  features: [
    { title: 'Vendor Profiles', desc: 'Comprehensive vendor records with company info, contacts, categories, certifications, insurance, W-9 status, and custom fields. Full interaction history.' },
    { title: 'Contract Management', desc: 'Track contracts with key dates, terms, and compliance requirements. Automated renewal reminders 30/60/90 days before expiration.' },
    { title: 'Performance Scorecards', desc: 'Multi-dimension scoring with configurable weights. Historical score tracking shows performance trends. Minimum score thresholds trigger alerts.' },
    { title: 'Spend Analytics', desc: 'Track vendor spend by category, department, and time period. Identify concentration risk and savings opportunities. Budget vs. actual tracking.' },
    { title: 'Risk Assessment', desc: 'AI-powered vendor risk scoring based on financial stability, compliance status, performance trends, and market conditions. Automated risk alerts.' },
    { title: 'Approval Workflows', desc: 'Multi-tier approval chains for new vendors, contracts, and purchase orders. Configurable thresholds and escalation rules.' },
    { title: 'Document Management', desc: 'Centralized storage for contracts, certificates, insurance documents, and W-9s. Expiry tracking with automated reminders.' },
    { title: 'Compliance Tracking', desc: 'Monitor vendor certifications, licenses, insurance policies, and regulatory compliance. Automatic alerts before expirations.' },
    { title: 'Audit Trail', desc: 'Complete history of all vendor interactions, score changes, contract modifications, and approval decisions with timestamps and user attribution.' },
    { title: 'Bulk Operations', desc: 'CSV import/export, bulk scoring updates, mass communication, and batch document requests for efficient vendor management at scale.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/vendors', desc: 'List all vendors with filtering by category, status, risk level, and search. Paginated with full profile data.', auth: true },
    { method: 'POST', path: '/api/vendors', desc: 'Create a new vendor with company details, contacts, categories, and certifications.', auth: true },
    { method: 'GET', path: '/api/contracts', desc: 'List contracts with filtering by vendor, status (active/expired/pending), and date range.', auth: true },
    { method: 'POST', path: '/api/scorecards', desc: 'Submit a performance scorecard for a vendor with dimension ratings and notes.', auth: true },
    { method: 'GET', path: '/api/analytics/spend', desc: 'Spend analytics by vendor, category, and time period with trend data.', auth: true },
    { method: 'GET', path: '/api/risk-assessment', desc: 'AI-generated risk assessment for a vendor based on all available data.', auth: true },
    { method: 'POST', path: '/api/approvals', desc: 'Submit a vendor or contract for approval through the configured workflow.', auth: true },
    { method: 'GET', path: '/api/compliance/expiring', desc: 'List vendors with certifications or documents expiring within a specified timeframe.', auth: true },
  ],

  userGuide: [
    {
      title: 'Vendor Onboarding',
      id: 'onboarding',
      content: [
        'New vendor onboarding collects essential information: company details, primary and secondary contacts, service categories, certifications, insurance documentation, and banking/payment details.',
        'The approval workflow routes new vendor requests through your configured chain — typically department head then procurement. You can configure auto-approval for vendors under a spend threshold.',
        'After approval, the vendor receives a welcome packet with your terms, compliance requirements, and portal access credentials. Document upload requests are sent automatically for missing certifications.',
      ],
    },
    {
      title: 'Performance Management',
      id: 'performance',
      content: [
        'Scorecards are your primary tool for vendor performance management. Configure dimensions that matter to your business: quality, on-time delivery, pricing competitiveness, communication responsiveness, and compliance adherence.',
        'Assign weights to each dimension based on importance. A vendor with perfect delivery but poor communication might score 85% if delivery is weighted 40% and communication 10%.',
        'Schedule regular scoring cycles (monthly or quarterly). The AI engine compares current scores against historical baselines and industry benchmarks, flagging significant changes.',
      ],
    },
    {
      title: 'Spend Optimization',
      id: 'spend',
      content: [
        'The spend analytics dashboard shows total vendor expenditure broken down by category, department, and time period. Identify your top vendors by spend and assess concentration risk.',
        'AI analysis highlights savings opportunities: vendors with rising prices, categories with single-source dependency, contracts approaching renewal that could be renegotiated, and duplicate services across vendors.',
        'Set budget alerts per category and vendor. The system notifies you when spend approaches or exceeds thresholds, preventing budget overruns.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Risk Prediction', desc: 'Analyzes vendor financial stability, performance trends, market conditions, and news sentiment to predict vendor risk levels. Early warning for potential supply chain disruptions.' },
    { capability: 'Spend Optimization', desc: 'Identifies consolidation opportunities, contract renegotiation windows, and alternative vendors that could reduce costs while maintaining quality levels.' },
    { capability: 'Performance Forecasting', desc: 'Predicts future vendor performance based on historical scoring trends, seasonal patterns, and leading indicators. Flags deteriorating vendors before problems impact your operations.' },
    { capability: 'Contract Intelligence', desc: 'Analyzes contract terms to identify unfavorable clauses, auto-renewal traps, and renegotiation leverage points. Recommends optimal contract structures based on market data.' },
  ],

  troubleshooting: [
    { issue: 'Scorecard calculations seem wrong', solution: 'Verify dimension weights sum to 100%. Check that all required dimensions have scores entered — missing scores are treated as zero, pulling the average down. Review the calculation formula in Settings > Scorecards.' },
    { issue: 'Contract renewal alerts not sending', solution: 'Check that the contract has valid start and end dates. Verify reminder intervals are configured (Settings > Notifications). Ensure the notification channel (email, webhook) is properly configured and the recipient list is correct.' },
    { issue: 'Spend data not matching invoices', solution: 'Verify that purchase orders are linked to the correct vendor. Check for duplicate entries from CSV imports. Ensure all payment records include the vendor ID. Run the reconciliation report to identify discrepancies.' },
    { issue: 'Approval workflow stuck', solution: 'Check the current approver in the workflow — they may not have received the notification. Use admin override to re-assign or skip the current step. Review the approval chain configuration for circular references or inactive approvers.' },
  ],

  faq: [
    { q: 'How many vendors can I manage?', a: 'Echo Vendor Manager scales from a handful of vendors to thousands. Free tier supports up to 50 vendors, Pro up to 500, and Enterprise is unlimited. Performance remains consistent regardless of vendor count.' },
    { q: 'Can I customize the scorecard dimensions?', a: 'Fully customizable. Add any number of performance dimensions with custom names, descriptions, and scoring scales (1-5, 1-10, or percentage). Assign weights to each dimension. Use different scorecard templates for different vendor categories.' },
    { q: 'Does it integrate with accounting software?', a: 'Yes. Export spend data to CSV for import into QuickBooks, Xero, or any accounting system. Direct API integrations with Echo Invoice and Echo Finance AI provide real-time spend tracking without manual exports.' },
    { q: 'How does the risk assessment work?', a: 'AI analyzes multiple data points: performance scorecard trends, contract compliance, payment history, insurance/certification status, and external signals. The result is a risk score (low/medium/high/critical) with specific contributing factors and recommended mitigations.' },
    { q: 'Can multiple team members manage vendors?', a: 'Yes. Role-based access control lets you assign permissions: viewer (read-only), manager (create/edit vendors and scores), approver (approval workflow participation), and admin (full system configuration). Each action is logged in the audit trail.' },
  ],
}

export default function EchoVendorManagerDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/vendor-manager' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
