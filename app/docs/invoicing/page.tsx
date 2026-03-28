'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Invoicing',
  tagline: 'AI-powered invoicing and billing: professional invoices, recurring billing, payment tracking, and AI payment prediction.',
  accent: '#0d9488',
  productUrl: '/invoicing',
  workerUrl: 'echo-invoicing.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Invoicing is a complete billing platform that helps businesses get paid faster. Generate professional branded invoices with line items, taxes, discounts, and custom notes. Track payments across six methods (card, bank transfer, PayPal, check, cash, crypto) with partial payment support and running balance tracking.',
    'The AI payment prediction engine analyzes each client\'s payment history — average days to pay, consistency, and current invoice amount — to predict when outstanding invoices will likely be paid and flag high-risk accounts before they become overdue. Daily cron automation marks past-due invoices and sends reminder emails at 7, 14, and 30 days.',
    'Starting at $15/mo with 50 clients and unlimited invoices, Echo Invoicing delivers AI features, recurring billing, and aging reports that FreshBooks and QuickBooks lock behind higher tiers. Full REST API access, multi-currency support, and Cloudflare-hosted reliability — without the enterprise price.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up for Starter at $15/mo, Professional at $39/mo, or Business at $99/mo. Configure your company name, address, tax ID, and default payment terms.' },
    { step: 2, title: 'Add Your Clients', desc: 'Build your client directory with company details, billing addresses, and default payment terms (Net 15, Net 30, Net 60, or custom).' },
    { step: 3, title: 'Create Your First Invoice', desc: 'Select a client, add line items with quantities and prices, apply tax rates and discounts, and send the invoice via built-in email.' },
    { step: 4, title: 'Track Payments', desc: 'Record payments as they arrive — card, bank transfer, PayPal, check, cash, or crypto. Partial payments are tracked with running balances.' },
    { step: 5, title: 'Set Up Recurring Invoices', desc: 'For retainers and subscriptions, configure recurring invoices with frequency and start date. The system auto-generates and sends them on schedule.' },
  ],
  features: [
    { title: 'Professional Invoices', desc: 'Generate branded invoices with line items, taxes, discounts, and custom notes. Print-ready PDF output with your company details.' },
    { title: 'Client Management', desc: 'Full client directory with company details, billing addresses, and payment history. One click to see all invoices for any client.' },
    { title: 'Multi-Currency', desc: 'Invoice in any currency. Set default currency per tenant or per client. Automatic tax calculations based on configurable tax rates.' },
    { title: 'Recurring Invoices', desc: 'Automatic recurring invoices for retainers and subscriptions. Weekly, monthly, quarterly, or yearly — auto-generated and sent on schedule.' },
    { title: 'Payment Tracking', desc: 'Record payments by card, bank transfer, PayPal, check, cash, or crypto. Partial payments supported with running balance tracking.' },
    { title: 'AI Payment Prediction', desc: 'AI analyzes payment patterns per client to predict when invoices will be paid and flag high-risk accounts before they become overdue.' },
    { title: 'Overdue Automation', desc: 'Daily cron marks past-due invoices as overdue. Automatic reminder emails at 7, 14, and 30 days past due.' },
    { title: 'Revenue Reports', desc: 'Revenue by month, quarter, or year. Breakdown by client, service, or payment method. Export data for your accountant.' },
    { title: 'Aging Reports', desc: 'Accounts receivable aging with current, 30-day, 60-day, and 90+ day outstanding balances. Never lose track of money owed.' },
    { title: 'Email Integration', desc: 'One-click invoice sending via integrated email. Clients receive professional HTML invoices with payment instructions.' },
    { title: 'Payment Terms', desc: 'Configure Net 15, Net 30, Net 60, or custom payment terms. Terms auto-calculate due dates and drive overdue automation.' },
    { title: 'Dashboard Overview', desc: 'Real-time view of total revenue, outstanding invoices, overdue amounts, recent payments, and upcoming recurring invoices.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/invoices', desc: 'List invoices with filters for client, status (draft, sent, paid, overdue), and date range.', auth: true },
    { method: 'POST', path: '/api/invoices', desc: 'Create a new invoice with client, line items, tax rate, discount, and payment terms.', auth: true },
    { method: 'GET', path: '/api/invoices/:id', desc: 'Get full invoice details including line items, payments, and balance.', auth: true },
    { method: 'POST', path: '/api/invoices/:id/send', desc: 'Send the invoice to the client via integrated email.', auth: true },
    { method: 'POST', path: '/api/invoices/:id/payments', desc: 'Record a payment against an invoice with method, amount, and reference number.', auth: true },
    { method: 'GET', path: '/api/clients', desc: 'List all clients with outstanding balance summaries.', auth: true },
    { method: 'POST', path: '/api/clients', desc: 'Create a new client with company details, billing address, and default terms.', auth: true },
    { method: 'POST', path: '/api/recurring', desc: 'Set up a recurring invoice with client, line items, frequency, and start date.', auth: true },
    { method: 'GET', path: '/api/reports/revenue', desc: 'Revenue report by period with breakdowns by client and payment method.', auth: true },
    { method: 'GET', path: '/api/reports/aging', desc: 'Accounts receivable aging report (current, 30, 60, 90+ days).', auth: true },
    { method: 'GET', path: '/api/predictions', desc: 'AI payment predictions for all outstanding invoices with risk scoring.', auth: true },
    { method: 'GET', path: '/health', desc: 'Worker health check endpoint.', auth: false },
  ],
  userGuide: [
    { title: 'Creating and Sending Invoices', id: 'creating', content: [
      'Navigate to the Invoices tab and click "New Invoice." Select a client from your directory (or create one inline), then add line items with description, quantity, and unit price. Apply a tax rate and optional discount.',
      'Set the payment terms (Net 15, Net 30, Net 60, or custom) which auto-calculate the due date. Add any custom notes for the client, then send the invoice directly via built-in email. The client receives a professional HTML email with payment instructions.',
      'Invoices start in Draft status. After sending, they move to Sent. The system tracks the full lifecycle through Sent, Overdue (auto-flagged by the daily cron), Partially Paid, and Paid.',
    ]},
    { title: 'Recording Payments', id: 'payments', content: [
      'When a client pays, open the invoice and click "Record Payment." Select the payment method (card, bank transfer, PayPal, check, cash, or crypto), enter the amount and reference number.',
      'Partial payments are fully supported. The system tracks total paid vs. invoice amount and shows the remaining balance. When the balance reaches zero, the invoice is automatically marked as Paid.',
    ]},
    { title: 'Recurring Invoice Setup', id: 'recurring', content: [
      'For retainers, subscriptions, or regular services, set up a recurring invoice. Choose the client, define the line items, select frequency (weekly, monthly, quarterly, yearly), and set the start date.',
      'The daily cron automatically generates and sends invoices on schedule. Each generated invoice is a standard invoice that tracks payments independently. Pause or cancel recurring schedules at any time.',
    ]},
    { title: 'Understanding Aging Reports', id: 'aging', content: [
      'The aging report groups outstanding invoices into buckets: Current (not yet due), 1-30 days overdue, 31-60 days, and 90+ days. Each bucket shows the total outstanding amount and number of invoices.',
      'Use aging data alongside AI payment predictions to prioritize collection efforts. Clients consistently appearing in 60+ day buckets may need revised payment terms or proactive outreach.',
    ]},
    { title: 'AI Payment Predictions', id: 'predictions', content: [
      'The AI analyzes each client\'s complete payment history — average days to pay, consistency of on-time payments, and current invoice amounts. It produces a predicted payment date and risk score for every outstanding invoice.',
      'High-risk invoices are flagged in the dashboard so you can follow up proactively. Over time, the AI becomes more accurate as it accumulates more payment data per client.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Payment Prediction', desc: 'Analyzes per-client payment history (average days to pay, consistency, invoice size) to predict when each outstanding invoice will be paid and assign risk scores.' },
    { capability: 'High-Risk Account Flagging', desc: 'Identifies clients with deteriorating payment patterns and flags them before invoices become significantly overdue.' },
    { capability: 'Overdue Automation', desc: 'Daily cron processes automatically mark past-due invoices and trigger reminder email sequences at 7, 14, and 30 days overdue.' },
    { capability: 'Revenue Trend Analysis', desc: 'Analyzes revenue data by client, service, and time period to identify growth patterns, seasonal variations, and client concentration risks.' },
  ],
  troubleshooting: [
    { issue: 'Invoice email not delivered to client', solution: 'Verify the client email address is correct. Check your email sending settings under tenant configuration. Some email providers may flag automated invoices — ask the client to check spam folders.' },
    { issue: 'Recurring invoice not auto-generating', solution: 'Confirm the recurring schedule is set to Active status and the next generation date has arrived. Check the recurring invoice log for any errors related to missing client data or line items.' },
    { issue: 'Invoice shows wrong due date', solution: 'Due dates are calculated from the invoice date plus the configured payment terms. Verify the payment terms on the invoice match expectations (Net 15, Net 30, etc.). Custom terms require manual date entry.' },
    { issue: 'Partial payment not reducing balance', solution: 'Ensure the payment amount was entered correctly and linked to the correct invoice. Open the invoice detail view to see all recorded payments and verify the running balance calculation.' },
    { issue: 'AI predictions showing low confidence', solution: 'The AI needs sufficient payment history per client to make accurate predictions. New clients with fewer than 3 paid invoices will have lower confidence scores until more data is available.' },
  ],
  faq: [
    { q: 'How does AI payment prediction work?', a: 'Our AI analyzes each client\'s payment history — average days to pay, payment consistency, and current invoice amount — to predict when outstanding invoices will be paid. High-risk invoices are flagged early for proactive follow-up.' },
    { q: 'Can I customize invoice templates?', a: 'Yes. Set your company name, address, tax ID, and payment terms at the tenant level. Each invoice includes your branding and custom notes. PDF output is print-ready.' },
    { q: 'How do recurring invoices work?', a: 'Set a client, line items, frequency (weekly/monthly/quarterly/yearly), and start date. Our daily cron automatically generates and sends invoices on schedule. Pause or resume anytime.' },
    { q: 'What payment methods are supported?', a: 'Record payments via credit card, bank transfer, PayPal, check, cash, or cryptocurrency. Each payment links to an invoice with reference numbers. Partial payments track running balances.' },
    { q: 'Can I track partial payments?', a: 'Absolutely. Record multiple payments against a single invoice. The system tracks total paid vs. invoice amount and auto-marks invoices as paid when the balance reaches zero.' },
    { q: 'What plans are available?', a: 'Starter at $15/mo (50 clients, unlimited invoices), Professional at $39/mo (unlimited clients, AI predictions, recurring invoices), and Business at $99/mo (multi-user, custom branding, webhooks).' },
  ],
}

export default function InvoicingDocsPage() {
  return <ProductDoc {...data} />
}
