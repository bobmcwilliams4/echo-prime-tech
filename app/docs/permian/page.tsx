'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Permian Basin Intelligence',
  tagline: 'Comprehensive Permian Basin oil and gas intelligence powered by 20+ drilling engines and 632K+ doctrine records',
  accent: '#78350f',
  productUrl: '/permian',
  workerUrl: 'echo-engine-runtime.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Permian Basin Intelligence aggregates well data, production analytics, lease records, drilling permits, and formation mapping for the Midland and Delaware sub-basins into a single queryable interface. Operators, landmen, investors, and engineers access the same authoritative dataset through a natural-language query interface or structured API.',
    'The system is powered by 20+ specialized drilling and oilfield reasoning engines running on Echo Engine Runtime, backed by 632,000+ doctrine records spanning regulatory filings, production reports, completion records, and formation studies. Queries return defensible answers with citations to source records — not AI-generated summaries.',
    'Formation coverage includes Wolfcamp A/B/C/D, Bone Spring 1/2/3, Spraberry, Dean, and Barnett. Well data covers the full Texas Railroad Commission record set plus operator-reported production, completion, and workover records. Lease records include active, expired, and held-by-production tracts across Midland, Ector, Andrews, Loving, Reeves, Ward, and Pecos counties.',
  ],
  gettingStarted: [
    { step: 1, title: 'Search for wells', desc: 'Enter an API number, operator name, lease name, or legal description in the well search. Results include basic well header, current operator, production status, and target formation.' },
    { step: 2, title: 'Analyze production data', desc: 'Select any well to view monthly oil, gas, and water production history back to first production. Decline curve analysis and EUR estimates are calculated automatically for wells with 12 or more months of history.' },
    { step: 3, title: 'Compare operators', desc: 'Use the Operator Analysis view to compare completion performance, average EUR per lateral foot, and drilling pace across operators in a selected county or formation interval.' },
    { step: 4, title: 'Monitor lease activity', desc: 'Set up lease monitors for specific tracts by legal description or lessor name. Receive alerts when permits are filed, wells spud, production begins, or lease assignments record at the county clerk.' },
    { step: 5, title: 'Export reports', desc: 'Export production data, well lists, and formation maps as CSV, Excel, or PDF. Report packages include source citations for every data point, suitable for investor presentations and regulatory filings.' },
  ],
  features: [
    { title: 'Well Production Tracking', desc: 'Monthly oil (Bbls), gas (Mcf), and water (Bbls) production for every permitted well in the Permian Basin. Data sourced from RRC production reports and operator submissions with 60–75 day lag.' },
    { title: 'Operator Analysis', desc: 'Compare any set of operators on completed lateral length, average 12-month cumulative, EUR per 1,000 ft, completion cost estimates, and drilling pace quarter-over-quarter and year-over-year.' },
    { title: 'Formation Data', desc: 'Wolfcamp A/B/C/D, Bone Spring 1/2/3, Spraberry, Dean, and Barnett formation mapping with isopach, porosity, and fluid property data. Identify sweet spots by county and operator section.' },
    { title: 'Lease Monitoring', desc: 'Track active, expired, and HBP leases by legal description, lessor name, or operator. Automated alerts fire when lease status changes, permits file, or assignment instruments record at the county clerk.' },
    { title: 'Drilling Permit Tracking', desc: 'Real-time RRC permit filings with operator, surface location, proposed formation, and estimated spud date. Filter by county, operator, or formation to monitor competitive drilling activity.' },
    { title: 'Completion Data', desc: 'Hydraulic fracture completion records including lateral length, proppant volume, fluid volume, stage count, and completion date sourced from RRC completion reports and operator filings.' },
    { title: 'Decline Curve Analysis', desc: 'Arps decline curve fitting (exponential, hyperbolic, harmonic) applied automatically to wells with sufficient production history. Select b-factor assumption or use AI-optimized best-fit parameters.' },
    { title: 'EUR Estimation', desc: 'Estimated ultimate recovery calculated from type curves, decline analysis, and offset analogs. EUR estimates include P10/P50/P90 confidence intervals updated monthly as new production reports file.' },
    { title: 'Offset Well Comparison', desc: 'Identify offset wells within a configurable radius and formation interval. Compare production performance, completion design, and EUR to benchmark new well locations against existing producers.' },
    { title: 'Regulatory Compliance', desc: 'Monitor RRC compliance status for operated wells: H-15 production reports, W-3A completion reports, P-5 organization reports, and statewide Rule compliance history with exception tracking.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/wells', desc: 'Search wells by API number, operator, lease name, county, or formation. Returns well header, operator, completion status, and basic production summary.', auth: true },
    { method: 'GET', path: '/production/:api', desc: 'Retrieve full monthly production history for a well identified by its 14-digit API number. Returns oil, gas, and water volumes with RRC filing citations.', auth: true },
    { method: 'GET', path: '/operators', desc: 'List operators active in specified counties or formations with well count, aggregate production, EUR statistics, and completion performance benchmarks.', auth: true },
    { method: 'GET', path: '/formations', desc: 'Return formation mapping data for a geographic area including isopach thickness, porosity, and sweet spot ratings aggregated by section-township-range.', auth: true },
    { method: 'GET', path: '/permits', desc: 'Retrieve recent RRC permit filings filtered by operator, county, or formation. Includes estimated spud date, proposed depth, and unit designation.', auth: true },
    { method: 'POST', path: '/query/reason', desc: 'Submit a natural-language question to the DRL engine suite. Body: { query, domain: "DRL" }. Returns defensible answer with citations to RRC records and formation data.', auth: true },
  ],
  userGuide: [
    {
      title: 'Well Research',
      id: 'wells',
      content: [
        'Search wells by any combination of API number prefix, operator name, lease name, county, and formation. API number search supports partial matches — enter the first 5 digits (state + county code) to retrieve all wells in a county, or 8 digits to filter by operator within a county.',
        'The well detail page shows header information (location, operator, spud date, completion date), the production history chart with formation labels, completion details if available from RRC filings, and regulatory compliance history. Use the Compare button to add the well to a side-by-side comparison view.',
        'Offset well analysis is triggered from any well detail page. Set the search radius (0.25, 0.5, 1, 2, or 5 miles) and formation filter. Results show all wells within radius with production overlaid on the same time axis, normalized by lateral length for fair performance comparison.',
      ],
    },
    {
      title: 'Production Analytics',
      id: 'production',
      content: [
        'The Production Analytics dashboard aggregates production at operator, county, formation, or custom polygon level. Time-series charts show gross and net production with stacked formation breakdown. Export any chart as PNG or the underlying data as CSV for use in external tools.',
        'Decline curve analysis runs automatically for wells with 12 or more months of production data. The system fits Arps curves using nonlinear least squares optimization and displays the fit alongside actual production. Hover any point to see the monthly volume and cumulative production to date.',
        'EUR estimates are displayed as P10/P50/P90 ranges reflecting uncertainty in decline parameters. EUR per lateral foot normalizes performance across wells with different lateral lengths, enabling apples-to-apples comparison of completion efficiency across operators and time periods.',
      ],
    },
    {
      title: 'Lease Monitoring',
      id: 'leases',
      content: [
        'Create a lease monitor by entering a legal description (Section-Township-Range), a lessor name search string, or an operator-lease combination. Monitors check for new activity daily and notify via email or webhook when status changes.',
        'Lease status is determined from a combination of RRC permit data, county deed records, and operator production reports. HBP status is inferred from active production within the primary lease term. Consult a licensed landman for legal determinations — this system provides research assistance, not legal title opinions.',
        'The Lease Expiry Tracker shows leases with primary terms expiring in the next 90, 180, and 365 days within a selected area. Filter by lessor, operator, or acreage size to identify acquisition opportunities before competitive bidders file permits and spud wells.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Production Forecasting', desc: 'Multi-engine production forecasting combines Arps decline modeling with analog-well type curves and formation-specific recovery factors. Forecasts include P10/P50/P90 confidence intervals from Monte Carlo simulation over the well economic life.' },
    { capability: 'Sweet Spot Identification', desc: 'Formation quality scoring integrates isopach thickness, porosity logs, fluid saturation, and analog production performance to rank 40-acre sections by drilling potential across Wolfcamp, Bone Spring, and Spraberry intervals.' },
    { capability: 'Completion Optimization Recommendations', desc: 'Statistical analysis of 4,200+ Permian completions correlates proppant loading, fluid volume, stage spacing, and lateral length to 12-month cumulative production. Recommendations specify optimal completion parameters for a given location and formation.' },
    { capability: 'Regulatory Risk Assessment', desc: 'Natural-language queries about RRC regulations, field rules, statewide rules, and exception precedents are answered by the DRL engine suite with citations to specific RRC rule text and commission orders.' },
  ],
  troubleshooting: [
    { issue: 'Well not found by API number', solution: 'Verify the full 14-digit API number format: state (2) + county (3) + unique well (5) + sidetrack (2) + perforation (2). Coverage is Texas (42) wells only. New wells may take up to 30 days to appear after initial RRC filing.' },
    { issue: 'Production data showing zeroes for recent months', solution: 'RRC production reports are typically filed 60–75 days after the production month. Data gaps in the most recent two months are normal. Check the data_through field in the API response for the latest available reporting period.' },
    { issue: 'Formation mapping not available for a specific area', solution: 'Formation data currently covers Midland, Ector, Andrews, Loving, Reeves, Ward, and Pecos counties. Upton, Crane, and Winkler counties are in progress. Export the county coverage list from Settings > Data Coverage for the latest status.' },
    { issue: 'Natural-language query returning a generic response', solution: 'Be specific: include county name, formation, time period, and operator name when relevant. The DRL engine performs best with structured queries like "Wolfcamp A production for Pioneer in Midland County in 2024" rather than open-ended questions.' },
  ],
  faq: [
    { q: 'How current is the production data?', a: 'Production data reflects RRC filings with a typical lag of 60–75 days. The system updates within 24 hours of RRC posting new monthly production reports. The data_through field on every production response shows the exact cutoff date for that well.' },
    { q: 'Does this cover both Midland and Delaware sub-basins?', a: 'Yes. Coverage includes the Midland Basin (Wolfcamp, Spraberry, Dean) and Delaware Basin (Bone Spring, Wolfcamp, Barnett) across all primary Permian counties in West Texas. Eastern Shelf and Central Basin Platform data is read-only at present.' },
    { q: 'Can I use this for lease acquisition due diligence?', a: 'The system provides research data for due diligence workflows. Lease status, production history, and permit data are sourced from public records. All conclusions should be verified by a licensed landman and reviewed by counsel before closing any transaction.' },
    { q: 'Is formation mapping available at the well-pad level?', a: 'Formation isopach and porosity data is available at 40-acre section resolution. Pad-level detail requires subsurface data not available in public records. Export section-level data to layer with your proprietary subsurface models in Petrel or Kingdom.' },
    { q: 'How do I export data for use in Spotfire or Power BI?', a: 'All API endpoints return JSON by default. Append ?format=csv to any list endpoint for CSV output. A Power BI connector and Spotfire template are available in the Integrations section of the developer portal.' },
  ],
}

export default function PermianDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/permian' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
