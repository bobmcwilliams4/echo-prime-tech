'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data = {
  name: 'GraphRAG Intelligence',
  tagline: '312K+ nodes, 3.3M+ edges, 101 domain clusters — knowledge graph meets vector search for cross-domain discovery.',
  accent: '#06b6d4',
  productUrl: '/graph-rag',
  workerUrl: 'https://graph-query-engine.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'GraphRAG Intelligence combines knowledge graph traversal with vector-based semantic search to deliver answers that span domains, trace citations, and surface connections that traditional RAG systems miss. Built on 312K+ nodes and 3.3M+ edges extracted from 5,400+ Intelligence Engines and 529K+ doctrines, the graph maps entities, relationships, contradictions, and cross-references across 101 domain clusters.',
    'Traditional vector search finds semantically similar text chunks. GraphRAG goes further: it traverses entity relationships to discover contextually connected information across domains. A tax depreciation question can traverse to oilfield equipment specifications, lease terms, and IRS rulings \u2014 connections that embedding similarity alone would never find. Every answer includes a full citation chain tracing back through the graph to authoritative source documents.',
    'The system ingests new documents automatically: chunking, embedding, entity extraction (50+ entity types), and graph linking happen within minutes of upload. Enterprise customers can bring their own data and have it woven into the same cross-domain knowledge fabric, gaining the same discovery capabilities as the base knowledge graph.',
  ],
  gettingStarted: [
    { step: 1, title: 'Explore the Graph', desc: 'Navigate to echo-ept.com/graph-rag to see live graph statistics, domain clusters, and sample queries. The dashboard shows node counts, edge distributions, and domain interconnection maps.' },
    { step: 2, title: 'Run a Query', desc: 'Use the search interface or POST to /query with a natural language question. The system performs hybrid search: vector similarity for initial retrieval, then graph traversal for relationship expansion and citation chain construction.' },
    { step: 3, title: 'Review Citation Chains', desc: 'Every response includes a citation chain showing how the answer was derived. Each node in the chain links to its source document, authority weight, and domain classification. Click any citation to inspect the underlying doctrine block.' },
    { step: 4, title: 'Traverse Subgraphs', desc: 'Use GET /subgraph/:entity to extract the knowledge neighborhood around any entity. This returns all connected nodes within N hops, revealing hidden relationships and cross-domain connections.' },
    { step: 5, title: 'Ingest Your Data', desc: 'POST documents to /ingest. The pipeline automatically chunks text, generates embeddings, extracts entities via NER, and links them into the graph. Your private data gains cross-domain discovery immediately.' },
  ],
  features: [
    { title: '312K+ Graph Nodes', desc: 'Entities, concepts, and relationships extracted from 5,400+ engines and 529K+ doctrines across every major domain. Nodes represent people, organizations, laws, standards, chemicals, equipment, and 50+ entity types.' },
    { title: '3.3M+ Relationship Edges', desc: 'Citation links, dependency chains, contradiction markers, and cross-references mapped automatically between entities. Each edge carries a relationship type, confidence score, and provenance reference.' },
    { title: '101 Domain Clusters', desc: 'Tax, legal, medical, engineering, oilfield, cryptocurrency, cybersecurity, real estate, insurance, and 92 more domains \u2014 each with deep internal structure and rich interconnections to other clusters.' },
    { title: '1.37M Cross-Domain Links', desc: 'The core differentiator: connections between domains. A drilling regulation links to environmental law links to tax deductions. These cross-domain paths enable discovery that siloed search systems cannot provide.' },
    { title: 'Hybrid Search', desc: 'Vectorize embeddings for semantic similarity combined with graph traversal for relationship discovery. Vector search finds the starting point; graph traversal expands the context with related entities and citations.' },
    { title: 'Full Citation Chains', desc: 'Every answer traces back through the graph to source documents. Follow the chain from conclusion to supporting authority \u2014 full provenance for audit, compliance, and professional work product.' },
    { title: 'Automatic Entity Extraction', desc: 'NER identifies people, organizations, laws, standards, chemicals, equipment, geographic locations, dates, financial amounts, and 50+ entity types from ingested documents.' },
    { title: 'Contradiction Detection', desc: 'Graph analysis identifies conflicting information between sources \u2014 critical for legal research, compliance, and any domain where authoritative disagreements carry professional risk.' },
    { title: 'Real-Time Ingestion', desc: 'New documents are chunked, embedded, entity-extracted, and graph-linked within minutes of upload. The graph grows continuously as new knowledge enters the system.' },
    { title: 'Subgraph Extraction', desc: 'Extract focused subgraphs around any entity or concept. Visualize the knowledge neighborhood with configurable hop depth, edge type filters, and domain constraints.' },
    { title: 'Community Detection', desc: 'Automatic clustering identifies knowledge communities \u2014 groups of tightly connected entities that represent coherent topic areas or emerging cross-domain patterns.' },
    { title: 'REST API + SDK', desc: 'Full REST API for graph queries, traversals, subgraph extraction, and document ingestion. Official TypeScript SDK handles authentication, pagination, and streaming results.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/query', desc: 'Hybrid graph+vector search. Send a natural language question and receive answers with citation chains, entity context, and cross-domain connections. Supports domain filtering and hop depth configuration.', auth: true },
    { method: 'GET', path: '/subgraph/:entity', desc: 'Extract the knowledge neighborhood around a specific entity. Returns all connected nodes within N hops with edge types, confidence scores, and domain classifications.', auth: true },
    { method: 'POST', path: '/ingest', desc: 'Ingest a document into the knowledge graph. The pipeline chunks, embeds, extracts entities, and creates graph links automatically. Returns the created node count and edge count.', auth: true },
    { method: 'GET', path: '/stats', desc: 'Graph statistics: total nodes, edges, domain clusters, cross-domain connections, and ingestion queue depth. No authentication required.', auth: false },
    { method: 'GET', path: '/domains', desc: 'List all 101 domain clusters with node counts, edge counts, and inter-cluster connection densities. Useful for understanding graph coverage.', auth: false },
    { method: 'POST', path: '/traverse', desc: 'Execute a custom graph traversal with start node, edge type filters, max hops, and domain constraints. Returns the traversal path with all intermediate nodes and edges.', auth: true },
    { method: 'GET', path: '/entities/search', desc: 'Search entities by name, type, or domain. Returns matching entities with their graph context \u2014 connected nodes, edge types, and community memberships.', auth: true },
    { method: 'GET', path: '/contradictions', desc: 'List detected contradictions between sources in a specific domain or across domains. Each contradiction includes both sources, the conflicting claims, and confidence assessment.', auth: true },
  ],
  userGuide: [
    { id: 'hybrid-search', title: 'How Hybrid Search Works', content: [
      'When you submit a query, the system first generates a vector embedding and performs semantic search against the Vectorize index. This returns the top-K most similar text chunks as candidate starting points.',
      'Each candidate is then used as a seed for graph traversal. The system walks outward along relationship edges \u2014 citations, dependencies, cross-references \u2014 expanding the context with related entities from connected domains. The traversal depth is configurable (default: 3 hops).',
      'Finally, the expanded context is ranked by a combination of semantic relevance (from the vector search), authority weight (from the doctrine blocks), and graph centrality (how well-connected the entities are). The result is an answer grounded in both textual similarity and structural knowledge relationships.',
    ]},
    { id: 'citation-chains', title: 'Reading Citation Chains', content: [
      'Every response includes a citation_chain array. Each entry in the chain contains the entity name, entity type, source document reference, authority weight, and the relationship that connects it to the next link in the chain.',
      'Citation chains read from conclusion back to source. The first entry is the primary conclusion entity; the last entry is the root authoritative source (IRC section, case citation, NIST control, etc.). Intermediate entries show how the reasoning traversed through the graph.',
      'For cross-domain answers, the citation chain may fork \u2014 one branch traces through tax authority while another traces through engineering standards. The response clearly marks where domain boundaries are crossed.',
    ]},
    { id: 'custom-traversals', title: 'Custom Graph Traversals', content: [
      'The /traverse endpoint gives you direct control over graph navigation. Specify a start_node (entity ID or name), edge_types to follow (citations, dependencies, contradictions), max_hops, and domain_filter to constrain the traversal.',
      'Use custom traversals to answer structural questions: "What standards depend on ASME B31.3?" or "What tax provisions cite IRC Section 179?" These are relationship queries that vector search alone cannot answer.',
      'Traversal results include the full path with all intermediate nodes, making it possible to reconstruct the reasoning chain programmatically. This is valuable for building compliance documentation and audit trails.',
    ]},
    { id: 'data-ingestion', title: 'Ingesting Your Own Data', content: [
      'POST documents to /ingest with the document text and optional metadata (domain, source_type, authority_weight). The pipeline runs five stages: chunking (semantic boundaries), embedding (Vectorize), NER (50+ entity types), graph linking (relationship extraction), and indexing.',
      'Private documents are encrypted at rest and isolated per API key. Your private entities and relationships are visible only to your queries but can still connect to public graph nodes for cross-domain discovery.',
      'For bulk ingestion, use the /ingest/batch endpoint which accepts up to 50 documents per request. The pipeline processes them in parallel with progress tracking via GET /ingest/status/:batch_id.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Cross-Domain Discovery', desc: 'AI identifies non-obvious connections between domains by traversing relationship paths that span cluster boundaries. A query about drilling permits can surface connected environmental regulations, tax implications, and insurance requirements.' },
    { capability: 'Entity Resolution', desc: 'AI deduplicates entities that appear under different names or contexts across documents. "IRC \u00a7179" and "Section 179 Deduction" resolve to the same node, preventing knowledge fragmentation.' },
    { capability: 'Relationship Inference', desc: 'Beyond explicitly stated relationships, AI infers implied connections from co-occurrence patterns, temporal proximity, and semantic similarity between entities in different documents.' },
    { capability: 'Contradiction Scoring', desc: 'When two sources make conflicting claims about the same entity or topic, AI assesses the severity of the contradiction and the relative authority weights to help users determine which source to trust.' },
    { capability: 'Community Evolution', desc: 'AI tracks how knowledge communities change over time as new documents are ingested. Emerging topic clusters and shifting cross-domain patterns are flagged for analyst review.' },
  ],
  troubleshooting: [
    { issue: 'Query returns no cross-domain connections', solution: 'Increase the hop depth from the default 3 to 5 or higher. Cross-domain connections often require more traversal steps. Also check if domain_filter is accidentally constraining results to a single cluster.' },
    { issue: 'Ingested document does not appear in graph queries', solution: 'The ingestion pipeline runs asynchronously. Check GET /ingest/status/:batch_id for pipeline progress. Entity extraction and graph linking can take 1-5 minutes depending on document size.' },
    { issue: 'Citation chain is incomplete or broken', solution: 'Some source documents may reference external authorities not yet in the graph. The chain shows [EXTERNAL] markers for references that point outside the current knowledge base. These gaps close as more documents are ingested.' },
    { issue: 'Too many results, low relevance', solution: 'Add domain_filter to constrain the search to specific clusters. Increase the min_authority_weight parameter to filter out low-confidence connections. Use the /query endpoint with limit parameter to control result count.' },
  ],
  faq: [
    { q: 'What is GraphRAG?', a: 'Graph-based Retrieval Augmented Generation combines knowledge graphs with vector search. Instead of just finding similar text chunks, GraphRAG traverses entity relationships to find contextually connected information across domains \u2014 delivering answers with full citation chains.' },
    { q: 'How big is the knowledge graph?', a: '312K+ nodes, 3.3M+ edges, spanning 101 domain clusters with 1.37M cross-domain connections. Built from 5,400+ engines and 529K+ doctrines. The graph grows continuously as new knowledge is ingested.' },
    { q: 'How is this different from vector search?', a: 'Vector search finds similar text. GraphRAG finds related concepts across domains. A tax question about depreciation can traverse to oilfield equipment specs, lease terms, and IRS rulings \u2014 connections that vector similarity alone would miss.' },
    { q: 'Can I bring my own data?', a: 'Yes. Upload documents via the /ingest API and they are automatically chunked, embedded, entity-extracted, and woven into the graph. Your private data gets the same cross-domain discovery as the base knowledge.' },
    { q: 'Is the graph updated in real-time?', a: 'The ingestion pipeline processes new documents within minutes. Entity extraction, relationship mapping, and graph linking happen automatically. The graph is a living knowledge structure that evolves with every new document.' },
  ],
}

export default function GraphRagDocPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/graph-rag' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
