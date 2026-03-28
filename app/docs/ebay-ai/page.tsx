'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo eBay AI',
  tagline: 'AI-powered eBay selling: automated listings, dynamic repricing, competitor intelligence, and sales analytics.',
  accent: '#e11d48',
  productUrl: '/ebay-ai',
  workerUrl: 'echo-ebay.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo eBay AI is a complete AI-powered selling platform designed to automate and optimize every aspect of eBay commerce. From generating SEO-optimized listings with a single product photo to dynamically repricing inventory 24/7, the platform replaces hours of manual work with intelligent automation.',
    'The system combines competitor intelligence, bulk listing tools, photo enhancement, promoted listings campaign optimization, and real-time profit calculations into a single dashboard. Sellers can manage inventory across eBay, Shopify, and Amazon simultaneously with automatic stock synchronization.',
    'Whether you sell 100 items or run a large-scale eBay store, Echo eBay AI adapts to your business. The AI learns from top-performing listings in your categories and continuously optimizes your store presence to maximize visibility and profit margins.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up and select a plan starting at $29/mo for up to 100 active listings. A free trial is available on all tiers.' },
    { step: 2, title: 'Connect Your eBay Store', desc: 'Authorize your eBay seller account so the AI can read your current listings, sales history, and competitor landscape.' },
    { step: 3, title: 'Generate Your First AI Listing', desc: 'Upload a product photo and let the AI generate an optimized title (80-char SEO), description, item specifics, and suggested pricing based on market data.' },
    { step: 4, title: 'Enable Dynamic Repricing', desc: 'Set your floor prices and margin targets. The AI will monitor competitor prices and adjust yours in real-time to win Buy Boxes while protecting profits.' },
    { step: 5, title: 'Review Analytics', desc: 'Check the sales dashboard for revenue, profit margins, sell-through rates, best-selling categories, and buyer demographics.' },
  ],
  features: [
    { title: 'AI Listing Generator', desc: 'Generate optimized eBay titles, descriptions, and item specifics from product photos. SEO-optimized for the eBay search algorithm with 80-character title formatting.' },
    { title: 'Dynamic Repricing', desc: 'AI adjusts prices in real-time based on competition, demand, and your margin targets. Win more Buy Boxes without race-to-bottom pricing. Runs 24/7.' },
    { title: 'Competitor Intelligence', desc: 'Track competitor pricing, sold quantities, listing changes, and strategies. Get alerts and automated responses to competitive moves.' },
    { title: 'Bulk Listing Tools', desc: 'List hundreds of items at once with CSV import, template-based listing, and bulk edit. Clone and modify existing listings in seconds.' },
    { title: 'Inventory Sync', desc: 'Multi-channel inventory management across eBay, Shopify, Amazon, and warehouse. Automatic stock updates prevent overselling.' },
    { title: 'Sales Analytics', desc: 'Revenue, profit margins, sell-through rates, best-selling categories, peak selling times, and buyer demographics in real-time dashboards.' },
    { title: 'Photo Enhancement', desc: 'AI auto-enhances product photos: background removal, brightness correction, and watermark addition for professional-looking listings.' },
    { title: 'Shipping Calculator', desc: 'AI calculates optimal shipping rates across carriers and suggests free shipping thresholds that increase conversion without eating margins.' },
    { title: 'Returns Management', desc: 'Automated return handling with AI-generated responses. Track return rates by product and identify quality issues early.' },
    { title: 'Promoted Listings AI', desc: 'AI manages eBay Promoted Listings campaigns, optimizing ad spend based on sell-through rates and profit margins.' },
    { title: 'eBay SEO Score', desc: 'Score listings on 15 eBay SEO factors with specific recommendations to improve search ranking and visibility.' },
    { title: 'Profit Calculator', desc: 'Real-time profit calculation after eBay fees, shipping costs, and payment processing. Know your true margin on every sale.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/listings/generate', desc: 'Generate an AI-optimized listing from product data or photo URL.', auth: true },
    { method: 'GET', path: '/api/listings', desc: 'Retrieve all active listings with pricing and performance data.', auth: true },
    { method: 'PUT', path: '/api/listings/:id/reprice', desc: 'Manually trigger a reprice evaluation for a specific listing.', auth: true },
    { method: 'GET', path: '/api/competitors/:category', desc: 'Fetch competitor intelligence data for a given eBay category.', auth: true },
    { method: 'POST', path: '/api/listings/bulk', desc: 'Bulk import listings via CSV or JSON payload.', auth: true },
    { method: 'GET', path: '/api/analytics/sales', desc: 'Retrieve sales analytics including revenue, margins, and sell-through rates.', auth: true },
    { method: 'GET', path: '/api/analytics/seo-score/:id', desc: 'Get the 15-factor SEO score for a specific listing.', auth: true },
    { method: 'GET', path: '/api/inventory/sync-status', desc: 'Check multi-channel inventory synchronization status.', auth: true },
    { method: 'GET', path: '/health', desc: 'Worker health check endpoint.', auth: false },
  ],
  userGuide: [
    { title: 'Creating Listings with AI', id: 'ai-listings', content: [
      'The AI Listing Generator accepts a product photo or text description and produces a fully optimized eBay listing. Titles are formatted to the 80-character SEO sweet spot that performs best in eBay search results.',
      'Item specifics are auto-filled based on category analysis. The AI studies top-performing listings in your category and adapts your listing content to match winning patterns while keeping your unique product details.',
      'After generation, review the suggested pricing based on current market data, edit if needed, and publish directly to your eBay store.',
    ]},
    { title: 'Dynamic Repricing Strategy', id: 'repricing', content: [
      'Set floor prices (minimum acceptable) and margin targets for each listing or category. The repricing engine monitors competitor prices continuously and adjusts yours to maximize Buy Box wins.',
      'The AI avoids race-to-bottom pricing by factoring in your margin requirements. If a competitor drops below your floor, the system holds your price and alerts you instead of matching blindly.',
      'Repricing runs 24/7 and reacts to market changes within minutes. You can pause repricing on individual items or categories at any time.',
    ]},
    { title: 'Multi-Channel Inventory', id: 'inventory', content: [
      'Connect your eBay, Shopify, Amazon, and warehouse inventory in one place. When an item sells on any channel, stock updates everywhere automatically.',
      'The system prevents overselling by reserving stock across channels. If you have 5 units, you can allocate 3 to eBay and 2 to Amazon, or let the AI distribute based on sell-through velocity.',
    ]},
    { title: 'Promoted Listings Campaigns', id: 'promoted', content: [
      'The Promoted Listings AI manages your eBay advertising campaigns. It sets ad rates based on each listing\'s sell-through rate and profit margin, not just click metrics.',
      'Low-margin items get lower ad spend, while high-margin items with good sell-through get aggressive promotion. The AI continuously adjusts rates based on campaign performance data.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Listing Generation', desc: 'Analyzes top-performing listings in your category to generate SEO-optimized titles, descriptions, and item specifics from product photos.' },
    { capability: 'Dynamic Price Optimization', desc: 'Real-time competitor monitoring with intelligent repricing that balances Buy Box wins against profit margin targets.' },
    { capability: 'Competitor Pattern Analysis', desc: 'Tracks competitor pricing changes, sold quantities, listing strategies, and sell-through rates with automated alert triggers.' },
    { capability: 'Photo Enhancement', desc: 'Automatic background removal, brightness correction, and watermark placement for professional product photography.' },
    { capability: 'Ad Campaign Optimization', desc: 'Manages Promoted Listings ad rates based on sell-through rates and profit margins, optimizing spend across your entire catalog.' },
    { capability: 'SEO Scoring', desc: 'Evaluates listings against 15 eBay search ranking factors and provides specific, actionable improvement recommendations.' },
  ],
  troubleshooting: [
    { issue: 'Listings not syncing to eBay', solution: 'Verify your eBay API authorization is still active. Re-authorize from Settings > Connections if the token has expired. Check that listing data meets eBay category requirements.' },
    { issue: 'Repricing not activating', solution: 'Ensure floor prices and margin targets are set for the affected listings. Repricing only runs on listings with configured pricing rules. Check the repricing log for error details.' },
    { issue: 'Inventory counts mismatch', solution: 'Trigger a manual sync from the Inventory page. If the issue persists, check that all connected channels have valid API credentials and that no external tool is overriding stock levels.' },
    { issue: 'AI-generated titles too long', solution: 'The AI targets 80 characters for eBay SEO. If titles exceed limits, edit the generated output or adjust category settings to prioritize shorter keyword combinations.' },
    { issue: 'Photo enhancement producing artifacts', solution: 'Upload higher-resolution source images (minimum 1000x1000px). Background removal works best with clear product-to-background contrast.' },
  ],
  faq: [
    { q: 'How does AI listing optimization work?', a: 'AI analyzes top-performing listings in your category and generates optimized titles (80-char SEO), descriptions, item specifics, and pricing. It studies what sells and adapts your listings to match winning patterns.' },
    { q: 'What is dynamic repricing?', a: 'AI monitors competitor prices and adjusts yours in real-time to win the Buy Box while maximizing profit. Set floor prices and margin targets — the AI handles everything else. Repricing runs 24/7.' },
    { q: 'Can it manage inventory across channels?', a: 'Yes. Sync inventory between eBay, your Shopify store, Amazon, and local warehouse. When an item sells on one channel, stock updates everywhere automatically to prevent overselling.' },
    { q: 'How does competitor analysis work?', a: 'AI tracks competitor listings: pricing changes, sold quantities, listing strategies, and sell-through rates. Get alerts when competitors undercut you and automated response strategies.' },
    { q: 'What pricing plans are available?', a: 'Starter at $29/mo (100 listings), Professional at $79/mo (1,000 listings with all AI features), and Enterprise at $199/mo (unlimited listings with API access and custom integrations).' },
  ],
}

export default function EbayAiDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/ebay-ai' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
