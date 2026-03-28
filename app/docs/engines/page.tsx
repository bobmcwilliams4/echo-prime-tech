'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'Intelligence Engines',
  tagline: '5,486 domain-expert engines with 611K+ doctrines across law, tax, oilfield, finance, security, medical, and engineering.',
  accent: '#f59e0b',
  productUrl: '/engines',
  workerUrl: 'https://echo-engine-runtime.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'The Echo Prime Engine Runtime hosts 5,486 domain-specific Intelligence Engines, each backed by structured knowledge blocks called doctrines. Unlike general-purpose LLM wrappers that generate probabilistic text, every engine is indexed against real authoritative sources in its field \u2014 IRC sections, case law, NIST frameworks, OSHA regulations, API specifications, drilling standards, medical guidelines, and thousands of other primary documents. When you query an engine, you get a grounded answer with inline citations pointing to the exact source material.',
    'Each engine contains pre-compiled doctrine blocks: structured knowledge units that carry the source reference, extracted content, authority weight, provenance chain, and cross-references to related blocks in other domains. The system currently indexes 611,000+ doctrine blocks across 200+ domain categories, with continuous ingestion expanding coverage daily. Doctrine blocks are version-controlled, so historical positions remain queryable even after source material is updated.',
    'Engines are organized into domain clusters (Tax, Legal, Land & Minerals, Cybersecurity, Medical, Financial, Drilling, Forensics, Accounting, AI/ML, and 180+ more) and priced across four tiers based on complexity and professional liability: Supreme, Critical, Engineering, and Standard. Every response includes a confidence stratification \u2014 DEFENSIBLE, AGGRESSIVE, DISCLOSURE, or HIGH_RISK \u2014 so professionals know exactly how much weight to place on the answer.',
  ],
  gettingStarted: [
    { step: 1, title: 'Browse the Engine Catalog', desc: 'Navigate to echo-ept.com/engines to explore all 5,486 engines organized by domain category. Each listing shows the engine code, domain, doctrine count, and pricing tier.' },
    { step: 2, title: 'Select Your Domain', desc: 'Identify the domain relevant to your question: TX for tax, LG for legal, LM for land & minerals, CYBER for security, MED for medical, FIN for finance, DRL for drilling, and 200+ more categories.' },
    { step: 3, title: 'Query an Engine', desc: 'Use the Sentinel AI interface at echo-ept.com/sentinel for interactive queries, or call the REST API at POST /api/query with your engine_id and natural-language question. Auto-routing is available if you omit the engine_id.' },
    { step: 4, title: 'Review Doctrine Citations', desc: 'Every response includes inline authority citations referencing specific IRC sections, case law, NIST controls, or other primary sources. Click any citation to view the full doctrine block and its provenance chain.' },
    { step: 5, title: 'Integrate via API', desc: 'Get your API key from the SDK dashboard and use the Engine Runtime REST API or the official SDKs for TypeScript and Python. Specify confidence_min to filter responses below your risk threshold.' },
  ],
  features: [
    { title: '5,486 Domain Engines', desc: 'Specialized engines across 200+ domain categories including tax, legal, land & minerals, cybersecurity, medical, financial, drilling, forensics, accounting, AI/ML, and engineering. Each engine is trained on domain-specific authoritative sources.' },
    { title: 'Doctrine Blocks', desc: '611,000+ structured knowledge units extracted from primary sources. Each block carries source reference, authority weight, provenance chain, and cross-references. Version-controlled for historical queryability.' },
    { title: 'Authority Citations', desc: 'Every response includes inline citations pointing to specific IRC sections, case law, NIST frameworks, OSHA standards, or other authoritative documents. Professionals can verify every claim against the original source.' },
    { title: 'Confidence Stratification', desc: 'Four-tier confidence system: DEFENSIBLE (strong authority, safe for deliverables), AGGRESSIVE (reasonable but higher risk), DISCLOSURE (requires client notification), HIGH_RISK (thin authority, use with caution).' },
    { title: 'Cross-Domain Routing', desc: 'Queries spanning multiple domains are automatically split into parallel sub-queries, dispatched to each relevant engine cluster, and synthesized into a unified response with citations from all contributing domains.' },
    { title: 'Engine Marketplace', desc: 'Browse, compare, and subscribe to engines through the marketplace. Filter by domain, pricing tier, doctrine count, and user ratings. Preview engine capabilities before committing.' },
    { title: 'Custom Engines', desc: 'Enterprise customers can create custom engines with proprietary doctrine blocks from their own documents. Custom engines inherit the full confidence stratification and citation system.' },
    { title: 'Bulk Queries', desc: 'Submit up to 100 queries in a single batch request. The runtime parallelizes execution across engine clusters and returns all responses together, reducing latency for high-volume workflows.' },
    { title: 'Real-Time Stats', desc: 'Live dashboard showing engine health, query volume, average latency, doctrine coverage, and confidence distribution. Monitor system performance and identify trending query domains.' },
    { title: 'Query Telemetry', desc: 'Every query is logged with latency, engine match score, doctrine blocks consulted, confidence level assigned, and routing path. Full audit trail for compliance and debugging.' },
    { title: 'Engine Categories', desc: '200+ domain categories organized in a hierarchical taxonomy. Categories include Tax (TX), Legal (LG), Land & Minerals (LM), Cybersecurity (CYBER), Medical (MED), Financial (FIN), Drilling (DRL), Fracturing (FRAC), Forensics (FOREN), and many more.' },
    { title: 'Export & Reporting', desc: 'Export query results, doctrine citations, and confidence assessments as PDF reports or structured JSON. Ideal for client deliverables, audit documentation, and compliance records.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/engines', desc: 'List all available engines with metadata: engine_id, domain, name, doctrine count, pricing tier, and status. Supports pagination and filtering by domain category.', auth: false },
    { method: 'GET', path: '/api/engines/:id', desc: 'Get detailed information about a specific engine including its full doctrine manifest, domain classification, capability description, and query statistics.', auth: false },
    { method: 'POST', path: '/api/query', desc: 'Query an engine with natural language. Specify engine_id for direct routing or omit it for auto-detection. Set confidence_min to filter responses below your threshold. Returns analysis with citations.', auth: true },
    { method: 'GET', path: '/api/engines/search', desc: 'Search engines by keyword, domain, capability, or doctrine topic. Returns ranked matches with relevance scores. Useful for discovering which engine handles a specific question type.', auth: false },
    { method: 'GET', path: '/api/doctrines/:id', desc: 'Retrieve a specific doctrine block by ID. Returns the full content, source reference, authority weight, provenance chain, version history, and cross-references to related blocks.', auth: true },
    { method: 'GET', path: '/api/stats', desc: 'Get system-wide statistics: total engines, total doctrine blocks, queries served, average latency, uptime, and per-domain breakdowns.', auth: false },
    { method: 'GET', path: '/api/categories', desc: 'List all engine domain categories with engine counts, doctrine totals, and descriptions. Use category codes when filtering engine lists or routing queries.', auth: false },
    { method: 'POST', path: '/api/engines/batch', desc: 'Submit a batch of up to 100 queries. Each query can target a different engine. Returns all responses in a single payload with per-query status and timing.', auth: true },
  ],
  userGuide: [
    { id: 'understanding-engines', title: 'Understanding Engines', content: [
      'An Intelligence Engine is a domain-specific AI system built on top of pre-compiled doctrine blocks rather than general-purpose language model weights. When you query an engine, it searches its indexed doctrine blocks, ranks them by authority weight and relevance, synthesizes a coherent answer, and attaches inline citations to every claim.',
      'Engines are identified by a domain prefix and numeric ID (e.g., TX01 for Tax Engine #1, CYBER03 for Cybersecurity Engine #3). Each engine specializes in a specific sub-domain within its category. For example, TX01 handles IRC code analysis while TX07 specializes in multi-entity structuring.',
      'Engines are priced in four tiers based on domain complexity and professional liability: Supreme (tax, legal \u2014 highest liability), Critical (cybersecurity, medical), Engineering (drilling, construction), and Standard (general business, IT). Higher tiers have more doctrine blocks and stricter citation requirements.',
    ]},
    { id: 'querying-engines', title: 'Querying Engines', content: [
      'The simplest way to query is through the Sentinel AI interface at echo-ept.com/sentinel. Type your question in natural language and Sentinel automatically detects the domain, selects the best engine, and returns a fully cited response with confidence stratification.',
      'For programmatic access, POST to /api/query with a JSON body containing your query text. Optionally include engine_id to target a specific engine, domain to constrain routing, and confidence_min to filter out low-confidence responses. The response includes the answer, citations, confidence level, engine_id used, and latency.',
      'For questions that span multiple domains (e.g., tax implications of mineral rights transfers), omit the engine_id and domain fields. The router will detect all relevant domains, dispatch parallel sub-queries, and return a synthesized cross-domain response with citations from each contributing engine.',
    ]},
    { id: 'doctrine-blocks', title: 'Reading Doctrine Blocks', content: [
      'Every citation in an engine response links to a specific doctrine block. Each block contains: the source reference (IRC section, case citation, NIST control, etc.), the extracted content in normalized form, an authority weight score, and a provenance chain showing when and how it was indexed.',
      'Authority weight determines how strongly a doctrine block supports a conclusion. Settled case law and explicit statutory provisions score highest. Advisory rulings, IRS guidance letters, and interpretive bulletins score lower. The confidence stratification of the overall response is derived from the aggregate authority weight of all supporting blocks.',
      'Doctrine blocks are version-controlled. When source material is updated (new tax legislation, revised NIST framework), new blocks are indexed alongside the old ones. You can query historical positions by specifying a date range, which is essential for audit defense and retroactive analysis.',
    ]},
    { id: 'confidence-levels', title: 'Confidence Levels', content: [
      'DEFENSIBLE: The conclusion is backed by strong, well-established authority \u2014 settled case law, clear IRC provisions, widely accepted industry standards. Safe for client deliverables, formal opinions, and audit responses. This is the tier professionals should target for work product.',
      'AGGRESSIVE: A reasonable interpretation that pushes the boundaries of established authority. Supportable but carries higher audit or challenge risk. Common in tax planning, litigation strategy, and competitive intelligence where exploring the edge of what is permissible adds value.',
      'DISCLOSURE: Positions that require explicit disclosure to clients or regulators. May rely on favorable interpretations of ambiguous authority or minority positions in case law. The engine flags these so professionals can make informed risk decisions.',
      'HIGH_RISK: Thin authority support. Conclusions drawn from limited, contested, or outdated sources. Useful for understanding the full range of possible positions but should never be used in deliverables without full client awareness and robust disclaimers.',
    ]},
    { id: 'custom-engines', title: 'Building Custom Engines', content: [
      'Enterprise customers can create custom engines backed by their own proprietary documents. Upload PDFs, Word documents, or structured data through the ingestion API. The system extracts doctrine blocks, assigns authority weights, and indexes them for semantic search.',
      'Custom engines inherit the full confidence stratification system, citation formatting, and cross-domain linking capabilities of standard engines. They can also be linked to existing public engines so queries draw from both proprietary and public doctrine blocks.',
      'Custom engine doctrine blocks are encrypted at rest with per-engine AES-256 keys stored in the vault. They are never shared across customers and can be deleted on demand with cryptographic verification that all copies are destroyed.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Doctrine Matching', desc: 'Semantic search across 611K+ doctrine blocks uses embedding-based similarity combined with authority weight scoring. The engine finds the most relevant AND most authoritative blocks, not just the closest semantic match.' },
    { capability: 'Cross-Domain Correlation', desc: 'When a query spans multiple domains, AI identifies the intersection points and synthesizes a unified answer that respects the authority hierarchies of each domain. A tax-and-minerals query cites both IRC sections and mineral rights case law.' },
    { capability: 'Confidence Stratification', desc: 'AI assigns DEFENSIBLE, AGGRESSIVE, DISCLOSURE, or HIGH_RISK based on aggregate authority weight, source recency, jurisdictional consistency, and the presence of contrary authority. The classification is deterministic and auditable.' },
    { capability: 'Authority Ranking', desc: 'Within each response, cited authorities are ranked by weight. Supreme Court decisions outrank circuit court opinions, which outrank district court rulings. Statutory provisions outrank regulatory guidance. This hierarchy is domain-aware and customizable.' },
    { capability: 'Counter-Argument Generation', desc: 'For AGGRESSIVE and DISCLOSURE positions, the engine automatically generates potential counter-arguments from opposing authority. This helps professionals anticipate challenges and prepare more robust positions.' },
    { capability: 'Pattern Extraction', desc: 'AI identifies recurring patterns across queries in the same domain \u2014 common fact patterns, frequently cited authorities, and emerging trends in how questions are framed. This intelligence feeds back into engine optimization.' },
  ],
  troubleshooting: [
    { issue: 'Engine returns low confidence on a straightforward question', solution: 'The engine may be matching against ambiguous or contested doctrine blocks. Try specifying the engine_id directly instead of relying on auto-routing, or add domain context to your query (e.g., "Under IRC Section 179..." instead of just "Section 179 limits").' },
    { issue: 'Cross-domain query is slow (>5 seconds)', solution: 'Cross-domain queries dispatch parallel sub-queries to multiple engine clusters. Latency is bounded by the slowest cluster. For time-sensitive applications, query each domain separately and merge results client-side.' },
    { issue: 'No results returned for a valid query', solution: 'The domain auto-detector may have misclassified your query. Specify the domain code explicitly (e.g., domain: "TX" for tax). Check /api/categories for the full list of valid domain codes.' },
    { issue: 'Doctrine block citations show outdated sources', solution: 'Doctrine blocks are version-controlled. By default, queries return the most recent version. If you are seeing old citations, check whether a date filter is active in your request. Use the /api/doctrines/:id endpoint to view the full version history.' },
  ],
  faq: [
    { q: 'What is an Intelligence Engine?', a: 'An Intelligence Engine is a domain-specific AI system backed by pre-compiled doctrine blocks extracted from authoritative sources. Each engine is indexed against real documents in its field so every response is grounded in verifiable source material, not probabilistic generation.' },
    { q: 'How many engines and doctrines are available?', a: 'The system currently operates 5,486 live engines across 200+ domain categories with 611,000+ indexed doctrine blocks. The catalog expands continuously with new engines and updated doctrine blocks ingested daily.' },
    { q: 'Are engine responses citable in professional work?', a: 'Yes. Every response includes inline authority citations referencing specific source material. The DEFENSIBLE confidence tier is specifically designed for use in client deliverables, audit responses, formal opinions, and regulatory filings.' },
    { q: 'How does cross-domain routing work?', a: 'When a query spans multiple domains, the engine router identifies all relevant domain clusters, dispatches parallel sub-queries, collects doctrine blocks from each, ranks them together by relevance and authority, and synthesizes a unified response with citations from every contributing engine.' },
    { q: 'What confidence level should I use for client deliverables?', a: 'Use DEFENSIBLE for client-facing deliverables, formal opinions, and audit responses. AGGRESSIVE is appropriate for internal strategy and research. DISCLOSURE and HIGH_RISK are useful for understanding the full range of positions but require appropriate risk disclaimers.' },
  ],
}

export default function EngineDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/engines' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
