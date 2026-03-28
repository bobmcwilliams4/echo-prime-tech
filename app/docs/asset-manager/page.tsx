'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Asset Manager',
  tagline: 'Track every asset with automatic depreciation, maintenance scheduling, AI condition assessments, and tax forecasting — all in one platform.',
  accent: '#f59e0b',
  productUrl: '/asset-manager',
  workerUrl: 'echo-asset-manager.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Asset Manager is an AI-powered asset lifecycle management platform. Track every asset with custom fields, serial numbers, manufacturers, models, and photos. Automatic depreciation calculations run daily via cron — straight-line and double-declining balance methods keep book values current without manual intervention.',
    'Schedule preventive maintenance, track costs, and get AI condition assessments that analyze asset age, maintenance history, and manufacturer data to predict remaining useful life. Location tracking spans buildings, floors, rooms, and GPS coordinates with full assignment and transfer history.',
    'Compared to Asset Panda ($1,500/yr), Snipe-IT (self-hosted), and UpTimize ($2,000/yr), Echo Asset Manager starts at $29/mo with zero infrastructure to manage. Unique AI features include condition assessment, tax forecast for depreciation impact, and automated disposal workflows — none of which competitors offer.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com and choose a plan: Starter ($29/mo, 100 assets), Business ($79/mo, 1,000 assets), or Enterprise ($199/mo, unlimited). All include a free trial.' },
    { step: 2, title: 'Add Your First Assets', desc: 'Enter assets manually or import via CSV. Add serial numbers, manufacturers, models, purchase dates, purchase prices, and photos. Assign barcodes or QR codes for quick lookups.' },
    { step: 3, title: 'Configure Depreciation', desc: 'Select straight-line or double-declining balance per asset or asset category. Set useful life and salvage value. The system calculates depreciation daily — book values are always current.' },
    { step: 4, title: 'Set Up Locations', desc: 'Define your location hierarchy — buildings, floors, rooms, or GPS coordinates. Assign assets to locations and track transfers with a full audit trail.' },
    { step: 5, title: 'Schedule Maintenance', desc: 'Create maintenance schedules for each asset with service intervals, cost estimates, and provider assignments. The system alerts you before maintenance is due.' },
  ],
  features: [
    { title: 'Asset Registry', desc: 'Track every asset with custom fields, tags, serial numbers, manufacturers, models, and photos. Auto-generated asset tags for consistent identification.' },
    { title: 'Depreciation Tracking', desc: 'Automatic straight-line and declining-balance depreciation with daily cron updates. Book value is always current without manual recalculation.' },
    { title: 'Maintenance Scheduling', desc: 'Schedule preventive maintenance, track repair costs, set next-due dates, and get notified before service intervals expire.' },
    { title: 'AI Condition Assessment', desc: 'AI analyzes asset age, maintenance history, and condition reports to recommend repairs and predict remaining useful life.' },
    { title: 'Location Tracking', desc: 'Track assets across buildings, floors, rooms, and GPS coordinates. Full assignment and transfer history with audit trail.' },
    { title: 'Insurance Management', desc: 'Manage policies linked to specific assets. Track premiums, deductibles, and coverage amounts. Alerts fire before policies expire.' },
    { title: 'Portfolio Analytics', desc: 'Dashboard with total portfolio value, depreciation curves, breakdowns by category and location, upcoming maintenance, and warranty alerts.' },
    { title: 'Check In/Out', desc: 'Track asset assignments with condition-before and condition-after logging. Auto-update assigned users when assets change hands.' },
    { title: 'Valuations', desc: 'Record market valuations, book values, and replacement costs. Track value changes over time with full valuation history.' },
    { title: 'Disposal Workflow', desc: 'Structured disposal process — sold, donated, recycled, or scrapped — with value capture at disposal and complete audit trail.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/assets', desc: 'List all assets with filtering by category, location, status, and custom fields.', auth: true },
    { method: 'POST', path: '/assets', desc: 'Create a new asset with all fields including custom attributes, location, and depreciation settings.', auth: true },
    { method: 'GET', path: '/assets/:id', desc: 'Get full asset details including depreciation schedule, maintenance history, and valuations.', auth: true },
    { method: 'POST', path: '/assets/:id/maintenance', desc: 'Log a maintenance event with type, cost, provider, and next-due date.', auth: true },
    { method: 'POST', path: '/assets/:id/check-in-out', desc: 'Record asset assignment change with condition assessment.', auth: true },
    { method: 'GET', path: '/analytics/portfolio', desc: 'Portfolio summary with total value, depreciation, and breakdowns by category and location.', auth: true },
  ],
  userGuide: [
    { title: 'Depreciation Setup', id: 'depreciation', content: [
      'Choose a depreciation method per asset or apply a default at the category level. Straight-line spreads cost evenly over useful life. Double-declining balance front-loads depreciation for assets that lose value faster in early years.',
      'Set the useful life in months and the salvage value (the expected value at end of life). The system runs daily cron jobs to update book values automatically. You can view the full depreciation schedule for any asset from its detail page.',
      'For tax reporting, the AI Tax Forecast feature (Enterprise plan) analyzes your entire portfolio to project depreciation impact on taxable income and recommends timing strategies for asset acquisitions and disposals.',
    ] },
    { title: 'Maintenance Management', id: 'maintenance', content: [
      'Create maintenance schedules by defining the service type (preventive, corrective, or inspection), interval (days, weeks, months), and estimated cost. The system tracks actual costs against estimates over time.',
      'When maintenance is completed, log the event with actual cost, provider, notes, and updated condition assessment. The system automatically calculates the next due date based on the defined interval.',
      'The portfolio dashboard shows upcoming maintenance across all assets, sorted by due date. Set alert thresholds (e.g., 7 days before due) to receive notifications and prevent missed service intervals.',
    ] },
    { title: 'Barcode and QR Scanning', id: 'scanning', content: [
      'Each asset can have a barcode and QR code assigned during creation or generated automatically. Print labels from the asset detail page for physical tagging.',
      'Use any barcode scanner or smartphone camera to scan an asset tag. The system opens the asset detail page immediately, showing current location, condition, depreciation status, and maintenance history.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Condition Assessment', desc: 'AI evaluates each asset\'s current condition by analyzing age, maintenance history, manufacturer reliability data, and condition reports. It recommends specific maintenance actions and estimates remaining useful life.' },
    { capability: 'Tax Depreciation Forecast', desc: 'AI analyzes your full asset portfolio to forecast the tax impact of depreciation over 1, 3, and 5 year horizons. It recommends optimal timing for acquisitions and disposals to minimize taxable income.' },
    { capability: 'Predictive Maintenance', desc: 'Based on historical maintenance data and manufacturer specifications, AI predicts when assets are likely to need service before the scheduled interval, preventing unexpected downtime.' },
    { capability: 'Replacement Cost Estimation', desc: 'AI tracks market pricing for asset categories and estimates current replacement costs, helping you maintain accurate insurance coverage and make informed buy-vs-repair decisions.' },
  ],
  troubleshooting: [
    { issue: 'Depreciation not updating daily', solution: 'Verify the asset has a depreciation method, useful life, and salvage value configured. Assets with status "disposed" or "retired" stop depreciating. Check the cron job status on the health dashboard.' },
    { issue: 'Barcode scan not finding the asset', solution: 'Ensure the barcode value matches exactly what is stored in the asset record. Leading zeros and special characters must match. Try searching by serial number or asset tag as a fallback.' },
    { issue: 'AI condition assessment shows "insufficient data"', solution: 'The AI needs at least 3 maintenance records and a purchase date to generate a condition assessment. Add historical maintenance events if the asset was tracked elsewhere before importing.' },
    { issue: 'CSV import skipping rows', solution: 'Check that required fields (name, category, purchase_date, purchase_price) are present in every row. Dates must be in ISO 8601 format (YYYY-MM-DD). Review the import error log for specific row failures.' },
  ],
  faq: [
    { q: 'What depreciation methods are supported?', a: 'Straight-line and double-declining balance methods with automatic daily calculations via cron. MACRS support is on the roadmap.' },
    { q: 'Can I track maintenance schedules?', a: 'Yes. Schedule preventive and corrective maintenance, track costs, set next-due dates, and get AI-powered condition assessments for each asset.' },
    { q: 'Does it support barcode/QR scanning?', a: 'Each asset can have a barcode and QR code assigned. Use any barcode scanner or phone camera to look up asset details instantly.' },
    { q: 'How does AI condition assessment work?', a: 'AI analyzes asset age, maintenance history, condition reports, and manufacturer data to assess current condition, recommend maintenance actions, and predict remaining useful life.' },
    { q: 'What are the pricing tiers?', a: 'Starter at $29/mo (100 assets), Business at $79/mo (1,000 assets, AI condition assessment), and Enterprise at $199/mo (unlimited assets, AI tax forecast, multi-location).' },
  ],
}

export default function AssetManagerDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/asset-manager' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
