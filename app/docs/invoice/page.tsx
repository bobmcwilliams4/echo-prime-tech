'use client'

import ProductDoc from '@/components/ProductDoc'

export default function InvoiceDocPage() {
  return (
    <ProductDoc
      name="Echo Invoice"
      tagline="AI-powered invoicing — create, send, track, and automate billing with intelligent payment reminders."
      accent="#10b981"
      productUrl="/invoice"
      workerUrl="https://echo-invoice.bmcii1976.workers.dev"
      version="1.0.0"
      overview={[
        'Echo Invoice is a comprehensive AI-powered invoicing and billing platform designed to streamline your entire accounts receivable workflow. Create professional invoices in seconds, send them automatically, and track payments in real-time with intelligent follow-up reminders.',
        'The AI engine analyzes payment patterns across your client base to predict which invoices are at risk of late payment, automatically adjusting reminder schedules and escalation paths. Smart line-item suggestions speed up invoice creation by learning from your billing history.',
        'Supports recurring invoices, multi-currency billing, tax calculation, payment links (Stripe/PayPal), and detailed financial reporting. Every invoice is branded with your logo and colors, and clients can pay directly from the invoice with one click.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/invoice and complete your business profile — company name, address, logo, and tax ID.' },
        { step: 2, title: 'Add Payment Methods', desc: 'Connect Stripe or PayPal to accept online payments. Configure bank details for wire transfers.' },
        { step: 3, title: 'Add Your First Client', desc: 'Create a client record with company name, billing contact, email, payment terms (Net 15/30/60), and currency.' },
        { step: 4, title: 'Create an Invoice', desc: 'Click "New Invoice", select a client, add line items (AI suggests from history), set due date, and send.' },
        { step: 5, title: 'Track & Automate', desc: 'Monitor the dashboard for payment status. Configure automatic reminders for overdue invoices.' },
      ]}
      features={[
        { title: 'AI Invoice Builder', desc: 'Create professional invoices with AI-suggested line items, descriptions, and pricing based on your billing history and client profile.' },
        { title: 'Recurring Billing', desc: 'Set up weekly, monthly, quarterly, or annual recurring invoices. Auto-generate and send on schedule with prorated adjustments.' },
        { title: 'Online Payments', desc: 'Clients pay directly from the invoice via Stripe, PayPal, or bank transfer. One-click payment with mobile-optimized checkout.' },
        { title: 'Smart Reminders', desc: 'AI predicts late payments and adjusts reminder timing. Escalation paths from gentle nudge to final notice with customizable templates.' },
        { title: 'Multi-Currency', desc: 'Invoice in 50+ currencies with automatic exchange rate conversion. Clients see amounts in their local currency.' },
        { title: 'Tax Calculation', desc: 'Automatic tax calculation based on jurisdiction. Supports sales tax, VAT, GST with configurable rates per product/service.' },
        { title: 'Credit Notes', desc: 'Issue credit notes and refunds linked to original invoices. Automatic balance adjustment and audit trail.' },
        { title: 'Expense Tracking', desc: 'Attach expenses to clients and projects. Convert expenses into billable line items with one click.' },
        { title: 'Financial Reports', desc: 'Revenue reports, aging analysis, cash flow forecast, tax summary, and client payment history with exportable data.' },
        { title: 'Client Portal', desc: 'Branded self-service portal where clients view invoices, make payments, download receipts, and update billing info.' },
        { title: 'Team Collaboration', desc: 'Role-based access for accountants, sales, and managers. Approval workflows for high-value invoices.' },
        { title: 'Integrations', desc: 'Connect with QuickBooks, Xero, Stripe, PayPal, Slack, and 50+ tools via webhook and API.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/invoices', desc: 'Create a new invoice with line items, client, and payment terms.', auth: true },
        { method: 'GET', path: '/api/invoices', desc: 'List all invoices with filtering by status, client, date range.', auth: true },
        { method: 'GET', path: '/api/invoices/:id', desc: 'Get invoice details including line items, payments, and activity.', auth: true },
        { method: 'PUT', path: '/api/invoices/:id', desc: 'Update invoice details, line items, or status.', auth: true },
        { method: 'POST', path: '/api/invoices/:id/send', desc: 'Send invoice to client via email with payment link.', auth: true },
        { method: 'POST', path: '/api/invoices/:id/remind', desc: 'Send payment reminder for overdue invoice.', auth: true },
        { method: 'POST', path: '/api/clients', desc: 'Create a new client with billing details and payment terms.', auth: true },
        { method: 'GET', path: '/api/clients', desc: 'List all clients with invoice totals and payment history.', auth: true },
        { method: 'GET', path: '/api/reports/revenue', desc: 'Revenue report with breakdown by client, period, and status.', auth: true },
        { method: 'GET', path: '/api/reports/aging', desc: 'Accounts receivable aging analysis (current, 30, 60, 90+ days).', auth: true },
      ]}
      userGuide={[
        { id: 'creating-invoices', title: 'Creating & Sending Invoices', content: [
          'To create a new invoice, click "New Invoice" from the dashboard. Select an existing client or create one inline. The AI will suggest line items based on your previous invoices for that client.',
          'Each line item has a description, quantity, rate, tax rate, and total. You can add discounts at the line or invoice level. The invoice number is auto-generated but can be customized to match your numbering scheme.',
          'Once complete, click "Send" to email the invoice directly to the client. The email includes a branded invoice PDF and a one-click payment button. You can also download the PDF or copy a shareable payment link.',
        ]},
        { id: 'recurring', title: 'Recurring Invoices', content: [
          'Set up recurring invoices for subscription or retainer billing. Choose the frequency (weekly, bi-weekly, monthly, quarterly, annual) and start date.',
          'The system auto-generates and sends invoices on schedule. Each recurring invoice can have prorated adjustments for mid-cycle changes. Pause or cancel recurring series at any time.',
          'View all recurring series from the Recurring tab. Each series shows the next invoice date, total billed to date, and payment status history.',
        ]},
        { id: 'payments', title: 'Tracking Payments', content: [
          'The dashboard shows all invoices by status: Draft, Sent, Viewed, Paid, Overdue, and Void. Color-coded indicators make it easy to spot issues.',
          'When a client pays via the payment link, the invoice is automatically marked as paid and a receipt is emailed. For manual payments (check, wire), click "Record Payment" to log the amount and method.',
          'Partial payments are supported — the system tracks the remaining balance and adjusts reminder schedules accordingly.',
        ]},
        { id: 'reminders', title: 'Smart Payment Reminders', content: [
          'Configure automatic reminders from Settings > Reminders. Set timing (e.g., 3 days before due, day of, 7 days after) and choose templates.',
          'The AI analyzes each client\'s payment history to predict which invoices are at risk. High-risk invoices get earlier, more frequent reminders. Good payers get gentler, less frequent nudges.',
          'Escalation paths can be configured: Reminder → Second Notice → Final Notice → Collections Flag. Each stage has customizable email templates.',
        ]},
        { id: 'reports', title: 'Reports & Analytics', content: [
          'Revenue Report: Total invoiced, collected, and outstanding by period. Breakdown by client, service category, and payment method.',
          'Aging Report: Accounts receivable organized by age buckets (current, 1-30 days, 31-60 days, 61-90 days, 90+ days). Identifies cash flow risks.',
          'Cash Flow Forecast: Predicts incoming payments based on invoice due dates and historical payment patterns. Helps plan spending and investments.',
          'All reports can be exported to CSV, PDF, or synced to your accounting software via integration.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Smart Line Items', desc: 'AI suggests line items, descriptions, and pricing based on your billing history with each client. Learns from patterns to speed up invoice creation.' },
        { capability: 'Late Payment Prediction', desc: 'Analyzes client payment history, invoice amount, and seasonal patterns to predict which invoices are at risk of late payment.' },
        { capability: 'Optimal Reminder Timing', desc: 'AI determines the best time to send payment reminders based on client responsiveness patterns and day-of-week/time-of-day analysis.' },
        { capability: 'Revenue Forecasting', desc: 'Predicts monthly revenue based on recurring invoices, pipeline, and historical collection rates. Accounts for seasonality.' },
        { capability: 'Duplicate Detection', desc: 'Warns when creating invoices that may duplicate existing ones based on client, amount, date range, and line items.' },
        { capability: 'Currency Optimization', desc: 'Suggests optimal invoicing currency based on client location and exchange rate trends to minimize conversion losses.' },
      ]}
      troubleshooting={[
        { issue: 'Client not receiving invoice emails', solution: 'Check the client email address is correct. Verify your sending domain is configured in Settings > Email. Check spam folders. Try resending from the invoice detail page.' },
        { issue: 'Payment link not working', solution: 'Ensure your Stripe or PayPal integration is active in Settings > Payments. Test with a small amount. Check that the invoice status is "Sent" not "Draft".' },
        { issue: 'Tax calculation seems wrong', solution: 'Review tax rates in Settings > Tax. Each line item can have an individual tax rate override. Check if the client has a tax-exempt flag enabled.' },
        { issue: 'Recurring invoice not generating', solution: 'Verify the recurring series is active (not paused). Check the next generate date. Ensure the client record is still active and has a valid email.' },
      ]}
      faq={[
        { q: 'How many invoices can I send per month?', a: 'Starter plan includes 50 invoices/month. Professional is 500, and Enterprise is unlimited. Recurring invoices count against the monthly limit.' },
        { q: 'Can clients pay by credit card?', a: 'Yes, via Stripe integration. Clients can pay with Visa, Mastercard, Amex, and other cards directly from the invoice payment link. Fees are standard Stripe rates (2.9% + $0.30).' },
        { q: 'Does Echo Invoice handle sales tax?', a: 'Yes. Configure tax rates by jurisdiction in Settings. The system automatically applies the correct rate based on your and your client\'s location. Supports multi-tax scenarios (state + local).' },
        { q: 'Can I customize the invoice template?', a: 'Yes. Upload your logo, choose colors, add a footer message, and customize the payment terms text. Professional and Enterprise plans include multiple template designs.' },
        { q: 'How do I migrate from QuickBooks or FreshBooks?', a: 'Use the CSV import tool to migrate clients, products, and invoice history. We provide import templates and a migration guide. Enterprise plan includes assisted migration.' },
      ]}
    />
  )
}
