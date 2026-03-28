'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Payments',
  tagline: 'Unified payment processing with PayPal, Stripe, and cryptocurrency support.',
  accent: '#6366f1',
  productUrl: '/payments',
  workerUrl: 'https://echo-paypal.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Payments is a unified payment processing engine that consolidates PayPal, Stripe, and cryptocurrency transactions into a single API surface. Instead of maintaining separate integrations for each payment provider, Echo Payments abstracts the complexity behind a consistent interface — letting you accept credit cards, PayPal wallets, ACH transfers, and crypto payments with one integration. Every transaction is tracked in real time with full audit trails, webhook event logging, and automatic reconciliation.',
    'Built for businesses that need reliable, PCI-compliant payment infrastructure without the overhead of managing multiple provider SDKs, Echo Payments handles the entire payment lifecycle from authorization through settlement. Subscription billing, recurring invoices, refund workflows, and multi-currency conversion are all native capabilities. The system automatically retries failed charges, sends dunning notifications for expiring cards, and provides revenue analytics dashboards that update in real time.',
    'Echo Payments runs on Cloudflare Workers at the edge, meaning payment API calls resolve in under 50ms globally. Webhook events from Stripe and PayPal are verified, deduplicated, and routed to your configured endpoints with at-least-once delivery guarantees. Whether you are processing ten transactions a day or ten thousand, the infrastructure scales automatically with zero cold starts and no server management.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com and navigate to the Payments section from your dashboard. Your account comes with a sandbox environment pre-configured for testing with both Stripe and PayPal test credentials.' },
    { step: 2, title: 'Connect Payment Providers', desc: 'Link your Stripe account via OAuth and your PayPal business account via API credentials. Echo Payments securely stores your provider tokens in the encrypted vault and handles token refresh automatically.' },
    { step: 3, title: 'Configure Webhooks', desc: 'Set your webhook endpoint URL in the Payments settings. Echo Payments will automatically register the necessary webhook events with Stripe and PayPal, and begin forwarding verified events to your endpoint.' },
    { step: 4, title: 'Test in Sandbox', desc: 'Use the sandbox environment to simulate charges, refunds, subscription creation, and webhook deliveries. The sandbox mirrors production behavior exactly, including retry logic and event deduplication.' },
    { step: 5, title: 'Go Live', desc: 'Switch from sandbox to production mode with a single toggle. Echo Payments validates that your provider credentials are live-ready, confirms webhook endpoints are reachable, and activates real transaction processing.' },
  ],
  features: [
    { title: 'PayPal Integration', desc: 'Full PayPal Commerce Platform support including PayPal Wallet, Venmo, Pay Later, and PayPal Credit. Orders are created, captured, and refunded through the PayPal REST API v2 with automatic currency conversion and seller protection eligibility checks.' },
    { title: 'Stripe Processing', desc: 'Native Stripe integration supporting credit cards, debit cards, ACH direct debit, Apple Pay, and Google Pay. Payment Intents API with automatic 3D Secure authentication, SCA compliance, and intelligent retry logic for declined transactions.' },
    { title: 'Subscription Billing', desc: 'Flexible subscription management with support for monthly, annual, and custom billing intervals. Proration on plan changes, trial periods, usage-based billing add-ons, and automatic dunning for failed renewal charges.' },
    { title: 'Invoice Payments', desc: 'Generate and send professional invoices with embedded payment links. Customers can pay via any connected provider directly from the invoice. Automatic payment reminders, overdue notifications, and partial payment tracking.' },
    { title: 'Refund Management', desc: 'Process full and partial refunds across any provider from a single interface. Refund requests are validated against the original transaction, processed through the correct provider, and tracked with reason codes and audit logs.' },
    { title: 'Webhook Events', desc: 'Centralized webhook processing that verifies signatures from Stripe and PayPal, deduplicates events, and routes them to your endpoints. Failed deliveries are retried with exponential backoff up to 72 hours.' },
    { title: 'Multi-Currency Support', desc: 'Accept payments in 135+ currencies with automatic conversion at market rates. Settlement currency is configurable per provider. Real-time exchange rate display at checkout with locked rates for 30-minute windows.' },
    { title: 'Payment Analytics', desc: 'Real-time revenue dashboards showing gross volume, net revenue, refund rates, churn, MRR, and ARR. Breakdowns by provider, currency, plan, and time period with exportable CSV and PDF reports.' },
    { title: 'Recurring Billing Engine', desc: 'Automated charge scheduling with smart retry logic that analyzes historical payment patterns to determine optimal retry times. Supports grace periods, charge date customization, and automatic card updater integration.' },
    { title: 'PCI Compliance', desc: 'All card data is tokenized at the edge before reaching your servers. Echo Payments is PCI DSS Level 1 compliant. No sensitive payment data is stored, logged, or transmitted in plaintext at any point in the transaction lifecycle.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/payments/create', desc: 'Create a new payment intent with the specified amount, currency, provider, and metadata. Returns a client secret for front-end confirmation or a redirect URL for PayPal.', auth: true },
    { method: 'GET', path: '/payments/:id', desc: 'Retrieve full details of a payment including status, provider response, timeline events, refund history, and associated subscription or invoice references.', auth: true },
    { method: 'POST', path: '/refunds', desc: 'Initiate a full or partial refund on a completed payment. Specify the payment ID, refund amount (optional for partial), reason code, and optional internal notes.', auth: true },
    { method: 'GET', path: '/subscriptions', desc: 'List all active subscriptions with filtering by status, plan, provider, and date range. Includes current period details, upcoming invoice preview, and payment method on file.', auth: true },
    { method: 'POST', path: '/webhooks/stripe', desc: 'Stripe webhook receiver endpoint. Verifies the Stripe-Signature header, parses the event payload, deduplicates by event ID, and dispatches to internal handlers and external forwarding URLs.' },
    { method: 'GET', path: '/analytics/revenue', desc: 'Revenue analytics endpoint returning gross volume, net revenue, refund totals, MRR, ARR, and churn rate for the specified date range with optional grouping by provider or currency.', auth: true },
  ],
  userGuide: [
    { title: 'Processing Your First Payment', id: 'first-payment', content: [
      'To process your first payment, call POST /payments/create with a JSON body containing the amount (in smallest currency unit, e.g., cents), currency code (e.g., "usd"), and preferred provider ("stripe" or "paypal"). The response includes a payment ID and either a client_secret for Stripe front-end confirmation or a redirect_url for PayPal checkout.',
      'For Stripe payments, pass the client_secret to Stripe.js confirmCardPayment() on your front end. For PayPal, redirect the customer to the provided URL. Once the customer completes payment, Echo Payments receives the provider webhook, updates the payment status to "completed", and fires your configured webhook endpoint.',
      'You can verify payment status at any time by calling GET /payments/:id. The response includes the full timeline of status changes, provider-specific response codes, and any associated metadata you included in the create request.',
    ] },
    { title: 'Managing Subscriptions', id: 'subscriptions', content: [
      'Create a subscription by calling POST /subscriptions with the customer ID, plan ID, and billing interval. The system creates the subscription in the appropriate provider, schedules the first charge, and returns the subscription object with its current status and next billing date.',
      'Plan changes are handled with automatic proration. When a customer upgrades or downgrades mid-cycle, Echo Payments calculates the prorated amount, applies credits or charges as needed, and adjusts the next invoice accordingly. You can override proration behavior by passing prorate: false in the update request.',
      'Cancellations can be immediate or scheduled for end-of-period. Immediate cancellations trigger a prorated refund if configured. End-of-period cancellations keep the subscription active until the current billing cycle ends, then set the status to "canceled" without further charges.',
    ] },
    { title: 'Handling Refunds and Disputes', id: 'refunds-disputes', content: [
      'Refunds are initiated through POST /refunds with the original payment ID and optional amount for partial refunds. The system validates that the refund amount does not exceed the original charge minus any previous refunds, then processes it through the original payment provider.',
      'Dispute and chargeback notifications arrive via provider webhooks and are surfaced in the Payments dashboard with all relevant details. Echo Payments provides the original transaction data, customer information, and delivery evidence to help you respond to disputes within the provider deadline.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Fraud Detection', desc: 'AI-powered transaction scoring analyzes payment patterns, device fingerprints, velocity checks, and behavioral signals in real time. Suspicious transactions are flagged or blocked before authorization, reducing chargebacks by up to 60% without impacting legitimate conversion rates.' },
    { capability: 'Smart Retry Optimization', desc: 'Machine learning models analyze historical decline patterns across card networks and banks to determine the optimal retry time, amount adjustment, and routing strategy for failed charges. Average recovery rate for soft declines exceeds 35% with intelligent retry scheduling.' },
    { capability: 'Revenue Forecasting', desc: 'Predictive analytics engine projects future revenue based on subscription growth trends, seasonal patterns, churn rates, and expansion revenue signals. Forecasts update daily with confidence intervals and scenario modeling for best-case and worst-case outcomes.' },
    { capability: 'Churn Prediction', desc: 'Behavioral analysis identifies customers at high risk of cancellation based on payment failures, support interactions, usage decline, and engagement metrics. Automated retention workflows trigger personalized offers or outreach before voluntary churn occurs.' },
  ],
  troubleshooting: [
    { issue: 'Payment stuck in "pending" status', solution: 'Pending payments typically indicate the provider is awaiting customer action (e.g., 3D Secure authentication or PayPal approval). Check the payment object for a next_action field. If the payment has been pending for more than 30 minutes, verify your webhook endpoint is receiving events — a missed "payment_intent.succeeded" webhook can leave the local status stale. Use the dashboard Sync button to force a status refresh from the provider.' },
    { issue: 'Webhook events not being received', solution: 'Verify your webhook endpoint URL is publicly accessible and returns a 200 status within 10 seconds. Check the Webhook Logs in the dashboard for delivery attempts and response codes. If events show as "failed", confirm your endpoint is not behind a firewall or rate limiter that blocks POST requests from Cloudflare IP ranges. Re-register webhooks from Settings if the provider endpoint configuration was deleted.' },
    { issue: 'Subscription renewal charge failing repeatedly', solution: 'Check the customer payment method status — expired or revoked cards are the most common cause. The Card Updater service runs nightly but may not cover all issuers. Contact the customer to update their payment method. If the card is valid but charges fail, check the decline code in the payment object — "insufficient_funds" and "do_not_honor" require customer action, while "processing_error" is a temporary provider issue that auto-retries.' },
    { issue: 'Currency conversion showing incorrect amounts', solution: 'Exchange rates are cached for 30 minutes to ensure price consistency during checkout. If the displayed rate diverges significantly from market rate, it will correct on the next cache refresh. For high-value transactions, use the /rates/lock endpoint to lock an exchange rate for up to 24 hours before creating the payment.' },
  ],
  faq: [
    { q: 'What payment providers does Echo Payments support?', a: 'Echo Payments currently supports Stripe (credit/debit cards, ACH, Apple Pay, Google Pay) and PayPal (PayPal Wallet, Venmo, Pay Later). Cryptocurrency payment support via Coinbase Commerce is in beta. Additional providers are added based on customer demand.' },
    { q: 'How does pricing work for Echo Payments?', a: 'Echo Payments charges a flat platform fee of 0.5% per transaction on top of the underlying provider fees (Stripe: 2.9% + $0.30, PayPal: 2.89% + $0.49 for standard). Subscription plans include volume discounts starting at $10,000/month in processing volume. There are no monthly minimums or setup fees.' },
    { q: 'Is Echo Payments PCI compliant?', a: 'Yes. Echo Payments is PCI DSS Level 1 compliant. All card data is tokenized at the edge using Stripe Elements or PayPal hosted fields — raw card numbers never touch your servers or ours. Tokenized references are stored in encrypted KV storage with automatic rotation.' },
    { q: 'Can I use Echo Payments with my existing Stripe or PayPal account?', a: 'Absolutely. Echo Payments connects to your existing Stripe and PayPal accounts via OAuth or API credentials. Your existing customers, subscriptions, and transaction history remain intact. Echo Payments acts as an orchestration layer on top of your existing accounts.' },
    { q: 'How are webhooks handled for reliability?', a: 'Webhook events from providers are verified (Stripe signature, PayPal certificate chain), deduplicated by event ID, and forwarded to your endpoint with at-least-once delivery. Failed deliveries retry with exponential backoff (1min, 5min, 30min, 2hr, 12hr, 72hr). Events are stored for 30 days for replay.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }
