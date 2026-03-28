"use client"

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo PayPal Integration',
  tagline: 'Complete PayPal business integration — payments, subscriptions, invoicing, and payout management via unified API.',
  accent: '#003087',
  productUrl: '/paypal-integration',
  workerUrl: 'https://echo-paypal.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo PayPal Integration wraps PayPal Business API with 26 endpoints covering payments, subscriptions, invoicing, and payouts. Cloudflare Worker with D1 and KV cache.',
    'Handles OAuth token management, webhook verification, idempotency, and retry logic. Your app makes simple REST calls.',
    'Connects with Echo Invoice for collection, Echo Subscription for recurring billing, and Echo CRM for payment history.',
  ],
  gettingStarted: [
    { step: 1, title: 'Connect PayPal', desc: 'Add Client ID and Secret from PayPal Developer Dashboard. OAuth handled automatically.' },
    { step: 2, title: 'Configure Webhooks', desc: 'Point PayPal webhooks to /webhooks/paypal. Signature verification is automatic.' },
    { step: 3, title: 'Test in Sandbox', desc: 'Use Sandbox credentials first. Create test payments and subscriptions.' },
    { step: 4, title: 'Go Live', desc: 'Switch to live credentials. Worker auto-detects sandbox vs production.' },
    { step: 5, title: 'Monitor', desc: 'View transactions at /transactions. Cross-reference with PayPal account.' },
  ],
  features: [
    { title: 'Payment Processing', desc: 'One-time payments, authorized captures, partial captures. Auto currency conversion.' },
    { title: 'Subscription Management', desc: 'Billing plans, trials, setup fees. Upgrades, downgrades, cancellations.' },
    { title: 'Invoice Generation', desc: 'Create and send invoices programmatically. Track status. Auto reminders.' },
    { title: 'Payout Processing', desc: 'Send to individuals or batches. PayPal accounts, emails, phone numbers.' },
    { title: 'Webhook Processing', desc: 'Auto-verification and event handling. Payment, subscription, dispute events.' },
    { title: 'Transaction Logging', desc: 'Every transaction in D1 with full details. Query and export for reconciliation.' },
    { title: 'KV Caching', desc: 'Frequently accessed data cached for sub-millisecond response.' },
    { title: 'Error Recovery', desc: 'Auto-retry with backoff. Idempotency keys prevent duplicates.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/payments/create', desc: 'Create payment order with items and amounts.', auth: true },
    { method: 'POST', path: '/payments/capture', desc: 'Capture authorized payment. Full or partial.', auth: true },
    { method: 'POST', path: '/subscriptions/create', desc: 'Create subscription with billing plan.', auth: true },
    { method: 'POST', path: '/subscriptions/cancel', desc: 'Cancel active subscription.', auth: true },
    { method: 'POST', path: '/invoices/create', desc: 'Create and send PayPal invoice.', auth: true },
    { method: 'POST', path: '/payouts/create', desc: 'Send payout to recipients.', auth: true },
    { method: 'GET', path: '/transactions', desc: 'List transactions with filters.', auth: true },
    { method: 'POST', path: '/webhooks/paypal', desc: 'Webhook endpoint with auto signature verification.', auth: false },
  ],
  userGuide: [
    { title: 'Payment Flow', id: 'payments', content: ['Create Order -> Redirect to PayPal -> Customer Approves -> Capture Payment.', '/payments/create returns the approval URL. After approval, call /payments/capture.', 'Server-to-server: use direct capture with pre-authorized method.'] },
    { title: 'Subscriptions', id: 'subs', content: ['Create billing plan first, then subscriptions referencing the plan.', 'Worker tracks status and processes webhook events for payments and cancellations.', 'Upgrade/downgrade by creating new subscription and cancelling old.'] },
    { title: 'Reconciliation', id: 'reconciliation', content: ['Every transaction logged with PayPal ID, amount, currency, status.', 'Cross-reference with PayPal transaction search to verify completeness.', 'Monthly reports compare D1 records with PayPal statements.'] },
  ],
  aiCapabilities: [
    { capability: 'Fraud Detection', desc: 'Analyzes patterns for unusual amounts, velocity spikes, geographic anomalies.' },
    { capability: 'Revenue Optimization', desc: 'Analyzes success rates to recommend configurations maximizing conversion.' },
    { capability: 'Churn Prediction', desc: 'For subscriptions, predicts cancellation risk from payment and usage patterns.' },
    { capability: 'Fee Optimization', desc: 'Recommends payment methods minimizing transaction costs.' },
  ],
  troubleshooting: [
    { issue: 'OAuth errors', solution: 'Verify Client ID/Secret match environment (sandbox vs production). Clear cached token.' },
    { issue: 'No webhook events', solution: 'Check URL accessibility. Verify webhook in PayPal Developer Dashboard.' },
    { issue: 'Capture fails', solution: 'Order may have expired (3hr default). Verify customer approved.' },
    { issue: 'Duplicate transactions', solution: 'Include idempotency key in creation. Tie key to your order ID.' },
  ],
  faq: [
    { q: 'Business account required?', a: 'Yes. Business accounts have REST API access for programmatic payments.' },
    { q: 'Currencies?', a: 'All 25+ PayPal-supported currencies. Auto formatting and conversion.' },
    { q: 'PCI compliance?', a: 'No. PayPal handles all card data. Customers enter info on PayPal.' },
    { q: 'Use alongside Stripe?', a: 'Yes. Both as payment options. Unified transaction reporting.' },
    { q: 'Disputes?', a: 'Dispute webhooks processed and logged. Respond via PayPal API.' },
  ],
}

export default function EchoPayPalDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/paypal-integration' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
