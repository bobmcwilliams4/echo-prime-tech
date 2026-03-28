'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export default function CountyRecordsDocPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: 'Echo County Records', href: '/docs/county-records' },
      ]} />
      <ProductDoc
      name="Echo County Records"
      tagline="AI-powered oil & gas deed record search and analysis — 259K+ records across 80+ Texas counties."
      accent="#92400e"
      productUrl="/county-records"
      workerUrl="https://echo-county-records.bmcii1976.workers.dev"
      version="3.2.0"
      overview={[
        'Echo County Records is the most comprehensive AI-powered deed record search platform built specifically for the oil and gas industry. With over 259,000 indexed records spanning 80+ Texas counties, it provides landmen, title examiners, and mineral rights professionals with instant access to grantor/grantee indexes, instrument images, legal descriptions, and chain of title analysis that would traditionally take days of courthouse visits.',
        'The platform combines OCR-processed document images with structured data extraction to make every record fully searchable. Type a grantor name, legal description, or instrument number and get results in milliseconds. The AI engine parses complex legal descriptions into standardized formats, identifies mineral reservations and exceptions, and flags potential title defects automatically.',
        'Echo County Records is not just a search tool — it is an analytical platform. The chain of title builder traces ownership through decades of conveyances, identifying gaps, overlaps, and conflicts. Batch export capabilities let you pull entire run sheets in minutes. Whether you are running title for a single well or performing due diligence on a 10,000-acre acquisition, this platform compresses weeks of work into hours.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com/county-records with your company email. Select your subscription tier based on search volume needs. Professional and Enterprise tiers include API access for integration with your existing title software.' },
        { step: 2, title: 'Select Your Counties', desc: 'Browse the county coverage map and add your target counties to your workspace. Each county shows record count, date range coverage, and last update timestamp. New counties are added monthly.' },
        { step: 3, title: 'Run Your First Search', desc: 'Enter a grantor or grantee name, legal description, instrument number, or date range. Use filters to narrow by instrument type (deed, lease, assignment, release, etc.) and county. Results appear in under 2 seconds.' },
        { step: 4, title: 'Build a Chain of Title', desc: 'Select a legal description and click "Build Chain." The AI traces all conveyances affecting that tract, building a chronological chain from patent to present. Review the chain for gaps, conflicts, and defects.' },
        { step: 5, title: 'Export Your Results', desc: 'Export search results, chain of title reports, or full run sheets as PDF, CSV, or Excel. Batch export supports up to 10,000 records per job. Schedule recurring exports for monitored tracts.' },
      ]}
      features={[
        { title: 'Multi-County Search', desc: 'Search across all 80+ indexed counties simultaneously with a single query. Results are aggregated, deduplicated, and ranked by relevance. No need to search each county clerk website individually.' },
        { title: 'Deed Parsing & Analysis', desc: 'AI extracts structured data from deed images — grantor, grantee, legal description, consideration, mineral reservations, exceptions, and recording information. Handles handwritten documents from the 1800s through modern typed instruments.' },
        { title: 'Grantor/Grantee Indexing', desc: 'Full-text indexed grantor and grantee names with fuzzy matching to handle spelling variations, name changes, and OCR errors. Search by individual name, corporate entity, or trustee designation.' },
        { title: 'Instrument Type Filtering', desc: 'Filter results by 40+ instrument types: warranty deed, mineral deed, oil and gas lease, assignment, release, ratification, correction, right-of-way, surface use agreement, and more.' },
        { title: 'Document OCR', desc: 'Every document image is processed through multi-pass OCR optimized for county clerk records. Handles faded ink, microfilm artifacts, handwritten text, and non-standard formatting with 97%+ accuracy.' },
        { title: 'Chain of Title Builder', desc: 'Automatically constructs the chain of title for any legal description by tracing conveyances chronologically. Identifies gaps in the chain, conflicting conveyances, and outstanding mineral reservations.' },
        { title: 'Mineral Rights Tracking', desc: 'Tracks mineral interest ownership through splits, conveyances, and reservations. Calculates current fractional mineral interest for each owner in the chain. Flags outstanding non-participating royalty interests.' },
        { title: 'Legal Description Parsing', desc: 'AI parses complex legal descriptions (metes and bounds, lots and blocks, sections and surveys) into standardized formats. Identifies overlapping descriptions and maps tracts to GIS coordinates when survey data is available.' },
        { title: 'Batch Export', desc: 'Export up to 10,000 records per batch as PDF, CSV, or Excel. Run sheet exports include all chain of title data formatted for standard title opinion templates. Schedule recurring exports for monitored tracts.' },
        { title: 'Record Monitoring', desc: 'Set alerts on specific legal descriptions, grantor/grantee names, or instrument types. Receive notifications within 24 hours when new matching records are indexed from county clerk filings.' },
        { title: 'Historical Coverage', desc: 'Records span from the original Republic of Texas land patents through current filings. Coverage depth varies by county, with major Permian Basin counties having the most comprehensive historical indexes.' },
        { title: 'Collaboration Tools', desc: 'Share search results, chains of title, and run sheets with team members. Add annotations and notes to specific instruments. Track who reviewed each document in the audit trail.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/search', desc: 'Search records by grantor, grantee, legal description, instrument number, or date range. Supports pagination and multi-county queries.', auth: true },
        { method: 'GET', path: '/api/records/:id', desc: 'Retrieve full record details including parsed data, OCR text, and document image URL.', auth: true },
        { method: 'GET', path: '/api/records/:id/image', desc: 'Get the original document image (TIFF/PDF) for a specific instrument record.', auth: true },
        { method: 'POST', path: '/api/chain', desc: 'Build a chain of title for a given legal description. Returns chronological conveyance chain with gap analysis.', auth: true },
        { method: 'GET', path: '/api/counties', desc: 'List all available counties with record counts, date ranges, and last update timestamps.', auth: false },
        { method: 'POST', path: '/api/export', desc: 'Create a batch export job for search results or chain of title data. Returns job ID for status polling.', auth: true },
        { method: 'GET', path: '/api/export/:jobId', desc: 'Check export job status and retrieve download URL when complete.', auth: true },
        { method: 'POST', path: '/api/monitors', desc: 'Create a record monitor alert for a legal description, name, or instrument type.', auth: true },
      ]}
      userGuide={[
        { id: 'searching', title: 'Searching Records Effectively', content: [
          'The search engine supports multiple query types. For name searches, enter the last name first (e.g., "McWilliams, Bobby") for best results. The fuzzy matching algorithm handles common OCR errors and spelling variations, so "McWilliams" will also match "Mc Williams" and "MacWilliams" with lower confidence scores.',
          'Legal description searches work best when you use the standard format for the county. For Permian Basin counties, this is typically "Section X, Block Y, T&P RR Co Survey, County Name." The parser handles abbreviated and non-standard formats, but standardized queries return more precise results.',
          'Use the advanced filter panel to narrow results by instrument type, date range, county, and book/page or document number. Combining a name search with a legal description filter is the fastest way to find specific conveyances. All searches support wildcard characters (* for multiple characters, ? for single character).',
        ]},
        { id: 'chain-of-title', title: 'Building Chain of Title', content: [
          'The chain of title builder traces ownership of a specific tract from the earliest recorded conveyance to the present. Enter the legal description and select the target county. The AI identifies all instruments that affect that tract, including partial conveyances, mineral reservations, and corrections.',
          'The resulting chain is displayed as a chronological timeline with each link showing the instrument type, grantor, grantee, recording date, and any reservations or exceptions. Color-coded indicators highlight potential issues: red for gaps, yellow for overlapping claims, and blue for outstanding mineral reservations.',
          'You can edit the chain manually to add or remove instruments, adjust fractional interests, and annotate specific links with notes. The edited chain can be exported as a formal run sheet in PDF or Excel format, ready for use in title opinions.',
        ]},
        { id: 'mineral-tracking', title: 'Tracking Mineral Interest Ownership', content: [
          'The mineral rights tracker calculates current fractional mineral ownership by tracing all conveyances, reservations, and splits from the original full mineral estate. It handles partial conveyances (e.g., "an undivided 1/2 of 1/4 mineral interest"), retained royalty interests, and non-participating royalty interests.',
          'For each tract, the tracker produces an ownership summary table showing each current owner, their fractional interest, the chain of instruments supporting that interest, and any encumbrances (leases, liens, or royalty burdens). This table is the foundation for division order preparation.',
          'When the mineral interest calculation encounters ambiguous language or conflicting instruments, it flags the issue with a confidence score and explanation. Common ambiguities include the "subject to" versus "excepting" distinction and the "mineral or royalty" classification question. These flags direct your attention to issues that require legal interpretation.',
        ]},
        { id: 'batch-operations', title: 'Batch Operations & Exports', content: [
          'For large projects, use the batch search feature to upload a CSV of legal descriptions, names, or instrument numbers. The system processes all queries in parallel and returns a consolidated result set. Batch jobs of up to 10,000 queries typically complete in under 5 minutes.',
          'Export formats include PDF (formatted run sheet with document images), CSV (structured data for spreadsheet analysis), and Excel (multi-sheet workbook with chain of title, ownership summary, and instrument detail tabs). All exports include a metadata header with search parameters, date generated, and record count.',
          'Schedule recurring exports for tracts you are actively monitoring. The system runs your saved search on a daily or weekly basis and emails the results if new records are found. This is particularly useful during active drilling programs when new assignments and leases are filed frequently.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Intelligent OCR', desc: 'Multi-pass OCR engine optimized for county clerk documents. Handles handwritten instruments from the 1800s, faded microfilm, typewriter text, and modern laser-printed documents. Post-processing corrects common OCR errors using legal vocabulary models and contextual analysis.' },
        { capability: 'Legal Description Parsing', desc: 'Parses complex legal descriptions in multiple formats — metes and bounds, lots and blocks, Texas survey system (abstract, section, block), and free-form descriptions. Normalizes variations and identifies geographic coordinates when survey control data is available.' },
        { capability: 'Automated Chain Building', desc: 'Constructs chain of title by identifying all instruments affecting a tract, resolving conflicting legal descriptions, and ordering conveyances chronologically. Detects gaps, wild deeds, and breaks in the chain with confidence scoring.' },
        { capability: 'Mineral Interest Calculation', desc: 'Traces fractional mineral ownership through complex conveyance chains, handling partial interests, reservations, exceptions, and splits. Produces ownership summary tables suitable for division order preparation.' },
        { capability: 'Anomaly Detection', desc: 'Flags potential title defects including unreleased liens, expired leases without releases, conflicting conveyances, outstanding mineral reservations, and instruments with questionable signatures or acknowledgments.' },
        { capability: 'Name Resolution', desc: 'Matches grantor/grantee names across spelling variations, OCR errors, name changes, corporate entity variations, and trustee designations. Uses contextual clues (county, date range, associated names) to resolve ambiguous matches.' },
      ]}
      troubleshooting={[
        { issue: 'Search returns no results for a known record', solution: 'Try alternate name spellings or use wildcard characters. Check that the correct county is selected. For older records, the grantor/grantee name may be indexed differently than expected. Try searching by instrument number or book/page if available.' },
        { issue: 'Chain of title has gaps', solution: 'Gaps may indicate records that have not yet been indexed for that county, instruments filed in a different county, or conveyances outside the indexed date range. Use the gap analysis tool to identify the missing time period and search manually in the county clerk records for that window.' },
        { issue: 'OCR text does not match document image', solution: 'OCR accuracy varies with document quality. For critical instruments, always verify the OCR text against the original document image. Report OCR errors using the "Flag Error" button on the record detail page — corrections are typically processed within 48 hours.' },
        { issue: 'Export job stuck in processing', solution: 'Large exports (5,000+ records) can take up to 15 minutes. Check the job status page for progress percentage. If the job has been processing for over 30 minutes, cancel and retry with a smaller batch size. Contact support if the issue persists.' },
      ]}
      faq={[
        { q: 'Which Texas counties are currently covered?', a: 'Over 80 Texas counties are indexed, with the strongest coverage in the Permian Basin (Reeves, Loving, Ward, Winkler, Pecos, Crane, Upton, Midland, Martin, Howard, Glasscock, Reagan, and more). The coverage map on the dashboard shows all available counties with record counts and date ranges. New counties are added monthly.' },
        { q: 'How current are the records?', a: 'Major Permian Basin counties are updated daily from county clerk electronic filing systems. Smaller counties are updated weekly or monthly depending on their electronic filing capabilities. The last update timestamp is shown on each county in the coverage map.' },
        { q: 'Can I use Echo County Records for states other than Texas?', a: 'Currently, the platform is Texas-only with a focus on oil and gas producing counties. New Mexico Permian Basin counties (Lea, Eddy) are in development and expected to launch in Q3 2026. Additional states will follow based on demand.' },
        { q: 'How accurate is the mineral interest calculation?', a: 'The AI calculation is highly accurate for straightforward conveyance chains. For complex chains involving ambiguous reservation language, "subject to" clauses, or disputed ownership, the system flags issues requiring legal interpretation. Always have a licensed attorney review the final title opinion.' },
        { q: 'Is there an API for integrating with my title software?', a: 'Yes. Professional and Enterprise plans include full REST API access. The API supports all search, chain building, and export functions available in the web interface. API documentation with code examples is available in the API Reference tab.' },
      ]}
    />
    </>
  )
}
