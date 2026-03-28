'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo QR Menu',
  tagline: 'Digital restaurant menus via QR code — branded, multilingual, and analytics-powered.',
  accent: '#14b8a6',
  productUrl: '/qr-menu',
  workerUrl: 'https://echo-qr-menu.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo QR Menu transforms your physical restaurant menu into a dynamic digital experience accessible from any smartphone. Guests scan a QR code at their table and instantly load a fully branded, mobile-optimized menu — no app download required, no printing costs, no waiting for updated menus to arrive from the printer. Changes go live in seconds across every table in every location.',
    'Beyond simply replacing paper menus, Echo QR Menu captures rich engagement data that paper never could. See which dishes get the most views, which categories guests browse first, how long they spend on your menu before ordering, and which items trigger the most add-to-cart actions. AI-powered menu generation helps you write compelling dish descriptions and suggest menu optimizations based on ordering patterns.',
    'Echo QR Menu supports multi-location restaurant groups, franchises, and food halls with centralized menu management, location-specific pricing, and bulk QR code generation. Time-based menu scheduling automatically switches between breakfast, lunch, dinner, and late-night menus. WiFi sharing codes embedded directly in the QR experience give your guests an extra reason to stay connected to your brand.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Restaurant Profile', desc: 'Sign up at echo-ept.com/qr-menu and create your restaurant with name, logo, brand colors, and contact details. Your branded menu portal is provisioned instantly with a sample menu to explore.' },
    { step: 2, title: 'Build Your Menu', desc: 'Add categories (Starters, Mains, Desserts, Drinks) and items under each. Upload photos, set prices, add allergen tags, and mark items as available or 86\'d. Use AI generation to write and improve dish descriptions automatically.' },
    { step: 3, title: 'Generate Your QR Codes', desc: 'Use the bulk QR generator to create table-specific codes (Table 1, Table 2, etc.) or a single universal code. Download print-ready PDFs or SVGs sized for table tents, coasters, or window stickers.' },
    { step: 4, title: 'Configure Time-Based Schedules', desc: 'Set up menu schedules so breakfast items only appear before 11am, lunch specials surface at noon, and the late-night menu kicks in automatically after 10pm. No manual switching required.' },
    { step: 5, title: 'Monitor Analytics', desc: 'Track scans per table, item view rates, peak engagement times, and order patterns from the analytics dashboard. Use scan data to optimize table layout and menu placement for maximum upsell impact.' },
  ],

  features: [
    { title: 'Branded Mobile Menus', desc: 'Fully customizable menu pages with your logo, brand colors, typography, and photography. Guests experience a seamless branded environment that matches your restaurant\'s identity — not a generic third-party portal.' },
    { title: 'Table Ordering', desc: 'Enable guests to place orders directly from the QR menu. Orders route to your kitchen display system or printer with table number, seat assignment, and special instructions. Reduces server trips and increases table turn speed.' },
    { title: 'Scan Analytics', desc: 'Real-time analytics on QR code scans per table, per time of day, and per day of week. Track which menu items get the most views, average time on menu, and scan-to-order conversion rates.' },
    { title: 'Multi-Language Support', desc: 'Offer your menu in up to 12 languages simultaneously. Guests select their preferred language from the menu page. AI auto-translates new menu items as you add them — no separate translation workflow required.' },
    { title: 'Bulk QR Generation', desc: 'Generate hundreds of unique QR codes at once — one per table, one per location, or one per menu category. Download as a ZIP of print-ready files with embedded table numbers, names, and custom styling.' },
    { title: 'WiFi Sharing', desc: 'Embed your restaurant\'s WiFi credentials directly in the QR menu experience. Guests see the network name and password without having to ask a server, reducing interruptions and improving guest satisfaction scores.' },
    { title: 'Time-Based Scheduling', desc: 'Define up to 8 menu schedules (breakfast, brunch, lunch, happy hour, dinner, late night, weekend, seasonal) with automatic time-based activation. Each schedule shows different items, prices, and featured specials.' },
    { title: 'Item Availability Toggles', desc: 'Mark items as unavailable with one click when you\'re 86\'d on a dish. Availability updates propagate to all active QR codes instantly — guests never order something you can\'t serve.' },
    { title: 'Photo Menu Builder', desc: 'Drag-and-drop photo upload with automatic compression and CDN delivery. Professional food photography presented in full-width hero images, gallery grids, or compact list views depending on your menu style.' },
    { title: 'Review Collection', desc: 'Post-meal QR prompt encourages guests to leave a review directly from the menu page. Reviews sync to your Echo Reviews account for AI sentiment analysis and response management.' },
    { title: 'Multi-Location Management', desc: 'Manage menus for unlimited restaurant locations from one dashboard. Share base menus across locations with location-specific price overrides, availability rules, and branding variations.' },
    { title: 'Allergen & Dietary Tags', desc: 'Tag each item with allergen information (gluten, nuts, dairy, shellfish) and dietary icons (vegan, vegetarian, keto, halal, kosher). Guests can filter the menu to show only items matching their dietary preferences.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/restaurants', desc: 'Create a new restaurant profile with name, logo, brand colors, address, and contact details. Returns restaurant ID and portal URL.', auth: true },
    { method: 'POST', path: '/menus', desc: 'Create a new menu for a restaurant with name, description, and schedule configuration (time ranges, active days).', auth: true },
    { method: 'POST', path: '/items', desc: 'Add an item to a menu with name, description, price, photos, allergen tags, dietary flags, and availability status.', auth: true },
    { method: 'GET', path: '/m/:code', desc: 'Public endpoint — loads the full branded menu page for a QR code. Returns restaurant branding, active menu items, and current schedule. No auth required.', auth: false },
    { method: 'POST', path: '/qr-codes', desc: 'Generate QR codes for a restaurant. Accepts table names, count, size, and format (PNG/SVG/PDF). Returns download URLs for print-ready files.', auth: true },
    { method: 'GET', path: '/analytics', desc: 'Retrieve scan analytics — total scans, unique scans, scans by table, scans by hour, top viewed items, and scan-to-order conversion rate for a date range.', auth: true },
    { method: 'POST', path: '/orders', desc: 'Submit a guest order from the QR menu. Includes table number, items with quantities and notes, and guest count. Returns order ID and estimated prep time.', auth: false },
    { method: 'POST', path: '/reviews', desc: 'Submit a post-meal review from the QR menu experience. Links review to the table scan session for attribution analytics.', auth: false },
  ],

  userGuide: [
    {
      title: 'Building Your First Menu',
      id: 'building-your-first-menu',
      content: [
        'Start by creating your restaurant profile with your name, logo, and brand colors. Echo QR Menu uses these to generate a fully branded menu portal that matches your physical restaurant\'s identity. Upload a high-resolution logo and select your primary and secondary brand colors — these are applied to buttons, headers, and accent elements throughout the guest-facing menu.',
        'From the Menu Builder, create your first menu and add categories. Categories organize your menu just like sections in a physical menu book — Starters, Salads, Mains, Sides, Desserts, Beverages. Drag to reorder categories at any time. Under each category, add individual items with name, description, price, and up to 6 photos. The AI description tool can generate or improve item descriptions with a single click.',
        'Mark items with allergen badges and dietary icons directly in the item editor. Guests can filter the menu by dietary preference (vegan, gluten-free, keto) using the filter bar at the top of their mobile menu view. Set a base item availability to available or paused — paused items are hidden from guests but preserved for easy re-activation.',
      ],
    },
    {
      title: 'QR Code Generation and Deployment',
      id: 'qr-code-generation',
      content: [
        'Navigate to QR Codes and use the bulk generator to create codes for every table at once. Enter your table naming convention (Table 1 through Table 24, or Bar 1 through Bar 8) and choose your output format. Print-ready PDFs are pre-sized for 4×4 inch table tents with your restaurant name and branding. SVG files are available for custom print layouts.',
        'Each table-specific QR code tracks scans independently, giving you per-table analytics on engagement, order frequency, and average spend. The universal code option creates one code for all tables — useful for window stickers, delivery bags, or social media where table attribution isn\'t needed.',
        'QR codes never expire and never require reprinting when you update your menu. The code links to your dynamic menu portal, so price changes, new items, and availability updates are reflected immediately when guests scan. You only need to reprint codes if you change your restaurant\'s slug or branding URL.',
      ],
    },
    {
      title: 'Time-Based Menu Scheduling',
      id: 'menu-scheduling',
      content: [
        'Menu schedules let you serve the right menu at the right time without any manual switching. Create up to 8 named schedules and define the days and hours each is active. For example, set Breakfast to active Monday–Friday 7am–11am, Brunch to active Saturday–Sunday 10am–2pm, and Dinner to active all days 5pm–10pm.',
        'Each schedule shows different menu items. Assign items to one or more schedules — a club sandwich might appear in both Lunch and Dinner, while eggs benedict is Brunch-only. Items not assigned to the current active schedule are automatically hidden from guests without any manual toggling.',
        'The schedule preview tool lets you simulate what guests will see at any time and day combination before activating schedules in production. Overlap rules handle edge cases — if two schedules overlap, the more specific schedule (e.g., Weekend Brunch) takes priority over the general one (e.g., Lunch).',
      ],
    },
    {
      title: 'Analytics and Menu Optimization',
      id: 'analytics-optimization',
      content: [
        'The Analytics dashboard shows scan volume over time, peak scanning hours, top-performing items by view count, and the path guests take through your menu categories. Use heat maps to see which table positions in your dining room generate the most scans — a proxy for highest-traffic seating areas.',
        'Item-level analytics reveal which dishes guests view most, how long they spend reading the description before ordering, and which items are frequently viewed but rarely ordered. High-view, low-order items may have pricing, photo, or description issues worth addressing.',
        'Export analytics to CSV for deeper analysis or to share with your team. Weekly summary emails deliver key metrics directly to your inbox every Monday morning. Use the AI optimization suggestions feature to receive menu restructuring recommendations based on your scan and order data.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Menu Generation', desc: 'Describe a dish in plain language and the AI writes a full menu description — name, evocative description, ingredient highlights, and preparation notes. Trained on thousands of professional restaurant menus to produce descriptions that drive ordering decisions.' },
    { capability: 'Description Improvement', desc: 'Paste an existing item description and the AI rewrites it to be more appetizing, accurate, and search-friendly. Adjusts tone to match your restaurant\'s style — casual and playful for a burger joint, elegant and precise for fine dining.' },
    { capability: 'Menu Optimization Suggestions', desc: 'Analyzes scan and order data via Engine Runtime to surface actionable recommendations — items to promote, items to retire, category ordering changes, and pricing adjustments based on engagement patterns.' },
    { capability: 'Auto-Translation', desc: 'New menu items are automatically translated into all active languages when added. AI translation is calibrated for food terminology to avoid the awkward literal translations that make menus unappetizing in a second language.' },
    { capability: 'Review Sentiment Analysis', desc: 'Analyzes post-meal reviews collected through the QR menu experience to identify recurring praise and complaint themes. Surfaces actionable feedback patterns — "guests frequently mention slow service on Friday nights" — before they impact your rating.' },
  ],

  troubleshooting: [
    { issue: 'QR code scans but shows wrong menu or 404', solution: 'Verify the menu has at least one published item and that the current time falls within an active schedule window. Check that the QR code was generated after your most recent restaurant slug change — old codes may point to a deprecated URL. Regenerate and reprint if the slug changed.' },
    { issue: 'Menu items not showing for guests', solution: 'Check item availability status — paused items are hidden from guests. Verify the current time is within the active schedule for that menu. Confirm the item is assigned to the active schedule in the item editor. Clear your browser cache and scan again to rule out a cached menu version.' },
    { issue: 'Analytics showing zero scans', solution: 'Confirm you are viewing the correct date range in the analytics filter. Analytics have a 5-minute processing delay — scans appear near real-time but may lag slightly. Verify the QR code being scanned belongs to the restaurant account you are viewing. Check that your browser is not blocking the analytics tracking script on the menu page.' },
    { issue: 'Orders not reaching kitchen display', solution: 'Verify the kitchen display integration is connected in Settings > Integrations. Check the KDS webhook URL is correctly configured and receiving a 200 response. Test with a manual order submission from the Orders tab. If using a printer, confirm the printer is online and the correct port is configured.' },
  ],

  faq: [
    { q: 'Do guests need to download an app to use Echo QR Menu?', a: 'No app required. Guests scan the QR code with their phone\'s built-in camera and the menu loads instantly in their mobile browser. Echo QR Menu is a progressive web app optimized for iOS Safari and Android Chrome with fast load times even on cellular connections.' },
    { q: 'How quickly do menu updates go live?', a: 'Menu changes are live within 5 seconds of saving. Price updates, new items, availability toggles, and photo changes all propagate to active QR codes immediately — no cache clearing, no reprint, no delay.' },
    { q: 'Can I use Echo QR Menu for multiple restaurant locations?', a: 'Yes. The Pro and Enterprise plans support unlimited locations. Each location has its own branded portal, QR codes, and analytics while sharing a base menu with location-specific overrides. A central dashboard shows combined analytics across all locations.' },
    { q: 'What happens to my QR codes if I change my menu?', a: 'Your QR codes remain valid indefinitely. They link to your dynamic menu portal, so all menu changes are automatically reflected when guests scan. You only need to reprint QR codes if you change your restaurant\'s unique URL slug, which we recommend never doing after initial setup.' },
    { q: 'Can I accept payments through the QR menu?', a: 'Echo QR Menu handles order submission and routing to your kitchen. Payment processing integrates with Stripe for in-menu checkout. Alternatively, configure the ordering flow as "order only" to have servers handle payment at the table — the QR menu submits the order and the server closes the check on your existing POS.' },
  ],
}

export default function EchoQrMenuDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/qr-menu' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
