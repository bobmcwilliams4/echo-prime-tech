'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Shopify Integration',
  tagline: 'Seamless Shopify store management with AI-powered inventory, pricing, and order automation.',
  accent: '#65a30d',
  productUrl: '/shopify',
  workerUrl: 'https://echo-shopify.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Shopify Integration connects your Shopify stores to the Echo Prime ecosystem, enabling AI-driven management of products, orders, inventory, pricing, and fulfillment. Rather than manually adjusting prices, restocking items, or chasing abandoned carts, the integration handles it all autonomously with intelligent rules you define once.',
    'The system operates as a bidirectional sync layer between Shopify and your Echo Prime dashboard. Product catalog changes, new orders, inventory movements, and customer data flow in real time through Shopify webhooks processed on Cloudflare Workers at the edge. Every event is logged, analyzed, and optionally triggers automated workflows like dynamic pricing adjustments, low-stock alerts, or fulfillment routing.',
    'Whether you run a single storefront or manage a portfolio of Shopify stores, Echo Shopify Integration provides unified analytics, cross-store inventory management, and AI-powered pricing optimization that continuously maximizes your margins while remaining competitive. Set your business rules, connect your stores, and let the automation handle the rest.',
  ],
  gettingStarted: [
    { step: 1, title: 'Install the Echo App in Shopify', desc: 'Navigate to your Shopify admin panel and install the Echo Prime app from the Shopify App Store. Grant the required permissions for products, orders, inventory, customers, and fulfillment access. The app uses OAuth 2.0 for secure authorization.' },
    { step: 2, title: 'Connect to Echo Prime', desc: 'After installation, you will be redirected to your Echo Prime dashboard. Confirm the store connection and select which data to sync: products, orders, inventory, customers, or all of the above. Initial sync typically completes in under 5 minutes for stores with up to 10,000 products.' },
    { step: 3, title: 'Configure Automation Rules', desc: 'Set up your pricing strategy (competitor-based, margin-based, or demand-based), inventory thresholds for restock alerts, fulfillment routing rules, and abandoned cart recovery sequences. Each rule can be toggled independently.' },
    { step: 4, title: 'Verify Webhook Processing', desc: 'Place a test order in your Shopify store and confirm it appears in your Echo Prime order feed within seconds. Check that inventory decremented correctly and any configured automations triggered as expected.' },
    { step: 5, title: 'Enable Multi-Store (Optional)', desc: 'If you manage multiple Shopify stores, repeat the installation for each store. The Echo Prime dashboard provides a unified view across all stores with cross-store analytics, shared inventory pools, and consolidated reporting.' },
  ],
  features: [
    { title: 'Product Sync', desc: 'Real-time bidirectional product synchronization between Shopify and Echo Prime. Create, update, or archive products from either side. Supports all Shopify product fields including variants, images, metafields, tags, and SEO attributes.' },
    { title: 'Order Management', desc: 'Automatic order ingestion with real-time status tracking from placement through fulfillment and delivery. View all orders across stores in a unified dashboard with filtering by status, date, customer, value, and fulfillment provider.' },
    { title: 'Inventory Tracking', desc: 'Multi-location inventory management with real-time stock levels, low-stock alerts, and automatic reorder point notifications. Supports inventory transfers between locations and maintains a full audit trail of every stock movement.' },
    { title: 'Automated Pricing', desc: 'AI-driven pricing engine that adjusts product prices based on competitor data, demand signals, margin targets, and time-based rules. Set floor and ceiling prices to maintain brand integrity while maximizing revenue per unit.' },
    { title: 'Fulfillment Automation', desc: 'Route orders to the optimal fulfillment center based on proximity to the customer, stock availability, and shipping cost. Automatically generate shipping labels, send tracking notifications, and update Shopify order status in real time.' },
    { title: 'Webhook Processing', desc: 'Processes all Shopify webhook events (orders/create, products/update, inventory/adjust, etc.) on Cloudflare Workers with sub-50ms latency. Failed webhooks are retried with exponential backoff and dead-lettered after exhaustion.' },
    { title: 'Multi-Store Support', desc: 'Connect and manage unlimited Shopify stores from a single Echo Prime dashboard. Cross-store analytics, shared product catalogs, unified inventory pools, and consolidated financial reporting across your entire Shopify portfolio.' },
    { title: 'Analytics Dashboard', desc: 'Revenue, orders, average order value, conversion rate, top products, customer lifetime value, and inventory turnover metrics updated in real time. Compare performance across stores, time periods, and product categories with exportable charts.' },
    { title: 'Customer Data Sync', desc: 'Synchronize customer profiles, order history, and lifetime value data between Shopify and Echo Prime CRM. Build unified customer segments for targeted marketing, loyalty programs, and personalized product recommendations.' },
    { title: 'Abandoned Cart Recovery', desc: 'Automated multi-step recovery sequences triggered when a customer abandons their cart. Configurable timing, messaging, and discount escalation. Track recovery rate, revenue recovered, and cost per recovery across all stores.' },
    { title: 'Collection Management', desc: 'Create and manage smart and manual collections from Echo Prime. Sync collection rules, sort orders, and featured images bidirectionally. Bulk-assign products to collections and schedule collection visibility changes.' },
    { title: 'Discount Automation', desc: 'Create and manage Shopify discount codes, automatic discounts, and buy-X-get-Y promotions programmatically. Schedule discount campaigns, set usage limits, and track redemption rates and revenue impact per discount.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/products/sync', desc: 'Trigger a full product sync between Shopify and Echo Prime. Returns sync status, product counts, and any conflicts detected. Supports delta sync via since parameter to only process changes after a given timestamp.', auth: true },
    { method: 'POST', path: '/orders/process', desc: 'Process a batch of Shopify orders. Accepts an array of order objects or Shopify order IDs to pull and process. Returns processing results with fulfillment routing decisions and automation actions triggered.', auth: true },
    { method: 'GET', path: '/inventory', desc: 'Retrieve current inventory levels across all connected stores and locations. Supports filtering by product ID, variant ID, location, and stock status (in-stock, low, out-of-stock). Returns quantities and reorder recommendations.', auth: true },
    { method: 'POST', path: '/pricing/optimize', desc: 'Run the AI pricing optimizer for specified products or entire catalog. Body includes strategy (competitor, margin, demand), target margin percentage, floor/ceiling constraints, and competitor URLs. Returns recommended prices with confidence scores.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Fetch analytics data across all connected stores. Supports metrics selection (revenue, orders, AOV, conversion, LTV), date range, store filter, and granularity (hourly, daily, weekly, monthly). Returns time-series data with comparison periods.', auth: true },
    { method: 'POST', path: '/webhooks/shopify', desc: 'Shopify webhook receiver endpoint. Validates HMAC signature, processes the event payload, and triggers configured automations. Supports all standard Shopify webhook topics. Returns 200 on successful processing or 202 for queued events.', auth: false },
  ],
  userGuide: [
    {
      title: 'Setting Up Automated Pricing',
      id: 'automated-pricing',
      content: [
        'Navigate to Automation > Pricing in your Echo Prime dashboard. You will see three pricing strategy options: Competitor-Based, Margin-Based, and Demand-Based. You can apply different strategies to different product categories or use a hybrid approach.',
        'Competitor-Based pricing monitors competitor product pages on a schedule you define (daily, hourly, or real-time for Enterprise accounts). When a competitor changes their price, the system evaluates whether to adjust yours based on your configured rules: match, undercut by percentage, or maintain premium positioning.',
        'Margin-Based pricing ensures every product maintains your target margin after accounting for cost of goods, shipping, transaction fees, and platform fees. Set a floor margin (never sell below this) and a target margin (optimize toward this). The system adjusts prices dynamically as your input costs change.',
        'Always set price floors and ceilings for every product. The floor prevents selling below cost during aggressive competitor matching, and the ceiling prevents unreasonable markups that could damage customer trust. Both can be set as fixed amounts or percentages of the base cost.',
      ],
    },
    {
      title: 'Managing Inventory Across Stores',
      id: 'inventory-management',
      content: [
        'The Inventory Hub shows a consolidated view of stock levels across all connected Shopify stores and fulfillment locations. Each row displays the product name, SKU, variant, total available quantity, committed quantity (in unfulfilled orders), and incoming quantity (from purchase orders).',
        'Enable Shared Inventory Pool to allow orders from one store to be fulfilled from another store\'s inventory when the primary store is out of stock. Configure priority rules to determine which location ships first based on proximity, stock depth, or shipping cost.',
        'Set reorder points per SKU to receive automatic alerts when stock falls below a threshold. For high-velocity items, the system can auto-generate purchase orders to your suppliers based on historical demand forecasting and current velocity.',
      ],
    },
    {
      title: 'Recovering Abandoned Carts',
      id: 'abandoned-cart-recovery',
      content: [
        'Echo Shopify Integration detects abandoned carts via Shopify webhooks and triggers configurable recovery sequences. Navigate to Automation > Cart Recovery to set up your flows.',
        'A typical recovery sequence sends three messages: a gentle reminder 1 hour after abandonment, a second message with social proof or urgency 24 hours later, and a final message with a discount incentive 48 hours after that. Customize the timing, content, and discount amount for each step.',
        'Track recovery performance in the Cart Recovery Analytics panel. Key metrics include total abandoned carts detected, recovery emails sent, open rate, click-through rate, carts recovered, revenue recovered, and cost per recovery. Compare performance across different recovery sequences to optimize your approach.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Dynamic Price Optimization', desc: 'Machine learning model trained on your historical sales data, competitor pricing, demand curves, and seasonality patterns. Recommends optimal prices that maximize revenue while maintaining your target margin constraints, updated continuously as market conditions change.' },
    { capability: 'Demand Forecasting', desc: 'Predicts future demand for each SKU using time-series analysis of historical sales, seasonality, promotional calendar, and external factors like holidays and market trends. Forecasts drive automatic reorder recommendations and inventory allocation decisions.' },
    { capability: 'Customer Segmentation', desc: 'Automatically clusters customers into behavioral segments based on purchase frequency, average order value, product category preferences, and recency. Segments update dynamically and integrate with your email marketing and ad targeting workflows.' },
    { capability: 'Anomaly Detection', desc: 'Monitors order patterns, inventory movements, and revenue metrics for anomalies in real time. Detects potential fraud (unusual order volumes, high-risk shipping addresses), inventory shrinkage, and revenue drops before they become critical issues.' },
  ],
  troubleshooting: [
    { issue: 'Products not syncing between Shopify and Echo Prime', solution: 'Verify the Shopify app has the required read_products and write_products scopes in your Shopify admin under Apps > Echo Prime > API access. Check the Sync Log in your dashboard for specific error messages. Common causes include rate limiting (Shopify allows 40 requests per second) and metafield permission issues.' },
    { issue: 'Webhooks failing with 401 errors', solution: 'The HMAC validation may be failing due to a stale shared secret. Reinstall the Echo Prime app in your Shopify admin to regenerate the webhook secret. If using a custom webhook URL, ensure the X-Shopify-Hmac-Sha256 header is being forwarded correctly by any proxies or CDNs in the path.' },
    { issue: 'Pricing optimizer recommending unexpected prices', solution: 'Review your floor and ceiling price constraints in Automation > Pricing. If competitor data appears stale, check the competitor monitoring schedule and verify the competitor URLs are still valid. The optimizer logs every price decision with the reasoning chain, accessible via Analytics > Price Change Log.' },
    { issue: 'Inventory counts mismatched between Shopify and dashboard', solution: 'Force a full inventory reconciliation from Inventory Hub > Actions > Reconcile. Mismatches typically occur when inventory adjustments are made directly in Shopify admin without webhook delivery (rare but possible during Shopify outages). The reconciliation compares every SKU and resolves discrepancies.' },
  ],
  faq: [
    { q: 'How many Shopify stores can I connect?', a: 'Free accounts support 1 store. Pro accounts support up to 5 stores. Enterprise accounts have no store limit. Each store operates independently with its own sync schedule, automation rules, and analytics, but you can view aggregated data across all stores in the unified dashboard.' },
    { q: 'Does the integration support Shopify Plus features?', a: 'Yes. Echo Shopify Integration supports Shopify Plus features including Shopify Flow triggers, Scripts (via Script Tags API), custom checkout extensions, B2B wholesale pricing, and multi-currency with automatic exchange rate adjustments.' },
    { q: 'What happens to my data if I disconnect a store?', a: 'Disconnecting a store stops all syncing and webhook processing immediately. Your historical data (orders, products, analytics) is retained in Echo Prime for 90 days. You can export all data before disconnecting. Reconnecting the same store restores the historical data and initiates a fresh sync.' },
    { q: 'Can I use the pricing optimizer without enabling auto-apply?', a: 'Absolutely. The pricing optimizer can run in recommendation-only mode where it suggests optimal prices but does not apply them automatically. You review recommendations in the Pricing Dashboard and approve or reject each one. This is the default mode for new accounts.' },
    { q: 'How does the integration handle Shopify API rate limits?', a: 'Echo Shopify Integration uses Shopify leak bucket rate limiting with intelligent request queuing. High-priority operations (order processing, webhook handling) are prioritized over background tasks (catalog sync, analytics). The system automatically throttles and retries when approaching rate limits, ensuring no data is lost.' },
  ],
}

export default function Page() { return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/shopify' },
      ]} />
      <ProductDoc {...data} />
    </>
  ) }
