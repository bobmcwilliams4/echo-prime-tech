'use client'

import ProductDoc from '@/components/ProductDoc'

export default function KnowledgeDocsPage() {
  return (
    <ProductDoc
      name="Echo Knowledge Systems"
      tagline="AI-powered knowledge management — document ingestion, semantic search, auto-categorization, and enterprise knowledge graph."
      accent="#0d9488"
      productUrl="/knowledge"
      workerUrl="https://echo-knowledge-forge.bmcii1976.workers.dev"
      version="2.0.0"
      overview={[
        'Echo Knowledge Systems is a comprehensive knowledge management platform powered by the Knowledge Forge engine. It ingests documents from any source — PDFs, web pages, APIs, databases, and file systems — then chunks, embeds, categorizes, and indexes them for instant semantic search across your entire knowledge base.',
        'With 24,886 documents, 170,540 chunks, and 575+ categories already indexed, the platform provides enterprise-grade knowledge retrieval. Documents are automatically categorized using AI, and the semantic search engine understands meaning, not just keywords. Ask a question in natural language and get precise answers with source citations.',
        'The system integrates with the Intelligence Engine network, Graph RAG for relationship mapping, and the Doctrine Forge for generating structured knowledge from raw documents. Every document ingested strengthens the collective intelligence of the entire Echo ecosystem.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Access Knowledge Dashboard', desc: 'Navigate to echo-ept.com/knowledge to access the knowledge management dashboard. Browse existing categories or start ingesting your own documents.' },
        { step: 2, title: 'Upload Documents', desc: 'Drag and drop files (PDF, DOCX, TXT, HTML, CSV) or provide URLs for web scraping. Documents are automatically chunked and processed within seconds.' },
        { step: 3, title: 'Auto-Categorization', desc: 'The AI categorizer analyzes document content and assigns categories, tags, and relevance scores. Review and adjust if needed, or trust the AI defaults.' },
        { step: 4, title: 'Search Your Knowledge', desc: 'Use the semantic search bar to query your knowledge base in natural language. Results include relevance scores, source citations, and contextual snippets.' },
        { step: 5, title: 'API Integration', desc: 'Get your API key and integrate knowledge search into your applications. The REST API supports document upload, search, category management, and bulk operations.' },
      ]}
      features={[
        { title: '170K+ Chunks Indexed', desc: 'Over 170,540 document chunks from 24,886 documents across 575+ categories. Every chunk is embedded for semantic search with sub-second query times.' },
        { title: 'Semantic Search', desc: 'Find answers using natural language questions, not just keywords. The search engine understands meaning, context, and relationships between concepts.' },
        { title: 'Auto-Categorization', desc: 'AI automatically categorizes uploaded documents into the taxonomy. New categories are created when content does not fit existing ones.' },
        { title: 'Multi-Format Ingestion', desc: 'Ingest PDFs, DOCX, TXT, HTML, CSV, JSON, Markdown, and web pages. OCR support for scanned documents. Batch upload for bulk ingestion.' },
        { title: 'Smart Chunking', desc: 'Documents are intelligently chunked by section, paragraph, or semantic boundary. Chunk size is optimized for retrieval accuracy while preserving context.' },
        { title: 'Knowledge Graph', desc: 'Integration with Graph RAG maps relationships between documents, entities, and concepts. Visualize how your knowledge connects across domains.' },
        { title: 'Version Control', desc: 'Document versions are tracked. When a source is re-ingested, only changed chunks are updated. Full history is preserved for audit purposes.' },
        { title: 'Access Control', desc: 'Role-based access control determines who can view, edit, and manage knowledge categories. API keys can be scoped to specific categories.' },
        { title: 'Source Citations', desc: 'Every search result includes the source document, page number, and chunk location. Click through to view the original document in context.' },
        { title: 'Embedding Pipeline', desc: 'Documents are embedded using state-of-the-art models via the Embedding Pipeline Worker. Vectorize index enables fast approximate nearest neighbor search.' },
        { title: 'Scheduled Ingestion', desc: 'Set up cron-based scraping to automatically re-ingest web sources on a schedule. Knowledge stays current without manual intervention.' },
        { title: 'Export & Backup', desc: 'Export your knowledge base as JSON, CSV, or structured bundles. Automatic backups to R2 storage ensure nothing is lost.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/ingest', desc: 'Ingest a document into the knowledge base. Accepts file upload or URL. Returns document ID, chunk count, and assigned categories.', auth: true },
        { method: 'POST', path: '/api/search', desc: 'Semantic search across all indexed documents. Parameters: query, category (optional), limit, threshold.', auth: true },
        { method: 'GET', path: '/api/categories', desc: 'List all categories with document counts and metadata.' },
        { method: 'GET', path: '/api/documents/:id', desc: 'Get document details including chunks, categories, embeddings status, and ingestion metadata.', auth: true },
        { method: 'GET', path: '/api/stats', desc: 'Knowledge base statistics: total documents, chunks, categories, storage used, query volume.' },
        { method: 'POST', path: '/api/bulk-ingest', desc: 'Ingest multiple documents in a single request. Accepts array of URLs or file references. Returns batch job ID for status tracking.', auth: true },
        { method: 'DELETE', path: '/api/documents/:id', desc: 'Remove a document and all its chunks from the knowledge base. Irreversible.', auth: true },
        { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status, document count, and index health.' },
      ]}
      userGuide={[
        { id: 'searching', title: 'Effective Knowledge Search', content: [
          'The semantic search engine works best with natural language questions. Instead of typing keywords like "tax deduction oil gas", ask "What tax deductions are available for oil and gas operators?" The AI understands intent and returns contextually relevant results.',
          'Use category filters to narrow results to specific domains. For example, filtering to "Tax Law" returns only tax-related documents. Combine filters with natural language queries for maximum precision.',
          'Results are ranked by semantic similarity. The relevance score (0-1) indicates how closely a chunk matches your query. Scores above 0.8 are highly relevant. Click "View Source" on any result to see the full document context.',
        ]},
        { id: 'ingestion', title: 'Document Ingestion Guide', content: [
          'Upload documents via the dashboard or API. Supported formats include PDF, DOCX, TXT, HTML, CSV, JSON, and Markdown. For PDFs with scanned images, OCR is applied automatically.',
          'Large documents are chunked into manageable segments (typically 500-1000 tokens). The chunking algorithm respects document structure — it splits on section headers, paragraphs, and semantic boundaries rather than arbitrary character counts.',
          'After ingestion, the AI categorizer assigns one or more categories. You can override the auto-assigned categories in the document detail view. Custom categories are supported — just type a new category name when editing.',
        ]},
        { id: 'organization', title: 'Organizing Your Knowledge', content: [
          'The category taxonomy is hierarchical. Top-level categories (Law, Tax, Engineering, Medical, etc.) contain sub-categories. Documents can belong to multiple categories simultaneously.',
          'Tags provide an additional layer of organization beyond categories. Tags are freeform and can describe document type (whitepaper, manual, regulation), source (IRS, NIST, IEEE), or any custom attribute.',
          'Use the bulk management tools to re-categorize, tag, or delete multiple documents at once. Export your category tree as JSON for backup or to replicate the structure in another instance.',
        ]},
        { id: 'api-integration', title: 'Integrating Knowledge Search', content: [
          'The REST API accepts POST requests to /api/search with a JSON body containing your query string. Authentication uses the X-Echo-API-Key header. Free tier allows 100 searches per day.',
          'For real-time applications, use the streaming endpoint /api/search/stream which returns results as they are found, with the most relevant first. This reduces perceived latency for large knowledge bases.',
          'Webhook notifications can be configured to trigger when new documents match specific criteria. Use this to build automated workflows: when a new tax regulation is ingested, notify the tax team automatically.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Semantic Understanding', desc: 'Embedding models convert text to high-dimensional vectors capturing meaning, not just keywords. Queries like "how to reduce taxable income" match documents about deductions, credits, and sheltering strategies.' },
        { capability: 'Auto-Categorization', desc: 'AI classifier analyzes document content and assigns categories from the 575+ category taxonomy. New documents are categorized within seconds of ingestion with 94%+ accuracy.' },
        { capability: 'Cross-Domain Linking', desc: 'Graph RAG integration maps relationships between documents across different categories. A tax case citing an environmental regulation creates a link between Tax Law and Environmental categories.' },
        { capability: 'Question Answering', desc: 'Beyond simple search, the system can synthesize answers from multiple document chunks. Ask complex questions and get consolidated answers with citations from relevant sources.' },
        { capability: 'Duplicate Detection', desc: 'AI detects near-duplicate documents during ingestion. When a document is substantially similar to an existing one, the system flags it and offers to merge, replace, or keep both.' },
        { capability: 'Knowledge Gap Analysis', desc: 'The system identifies topics with sparse coverage and recommends areas where additional documents would strengthen the knowledge base. Focus ingestion efforts where they matter most.' },
      ]}
      troubleshooting={[
        { issue: 'Search returns no results for a valid query', solution: 'Check that documents have been fully processed (status: indexed, not pending). If recently ingested, allow 30-60 seconds for embedding generation. Try broader search terms or remove category filters to verify documents exist.' },
        { issue: 'PDF upload fails or produces empty chunks', solution: 'The PDF may be image-based without text layers. Enable OCR in upload settings. For encrypted PDFs, remove the password before uploading. Maximum file size is 50MB per document.' },
        { issue: 'Auto-categorization assigns wrong categories', solution: 'Override the category in the document detail view. The AI learns from corrections — manually re-categorized documents improve future auto-categorization accuracy for similar content.' },
        { issue: 'Ingestion is slow for large batches', solution: 'Bulk ingestion processes documents in parallel but large batches (500+ documents) may take several minutes. Use the batch job status endpoint to monitor progress. Consider splitting into smaller batches.' },
      ]}
      faq={[
        { q: 'How many documents can I store?', a: 'Free tier: 100 documents. Starter: 10,000. Professional: 100,000. Enterprise: unlimited. Storage includes all chunks and embeddings.' },
        { q: 'What languages are supported?', a: 'The system supports 50+ languages for both ingestion and search. Documents in any language are chunked and embedded correctly. Cross-language search is supported — query in English, find results in Spanish.' },
        { q: 'Can I connect external data sources?', a: 'Yes. Scheduled ingestion supports web URLs, RSS feeds, and API endpoints. Configure a cron schedule and the system automatically re-ingests on your chosen interval. Custom connectors available on Enterprise plans.' },
        { q: 'How is data privacy handled?', a: 'All documents are stored in your dedicated namespace. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Enterprise plans support data residency requirements and custom encryption keys.' },
        { q: 'Does ingesting a document make it public?', a: 'No. Documents are private by default. Only users with API keys scoped to the relevant category can access them. Public categories can be created for shared knowledge, but this is opt-in.' },
      ]}
    />
  )
}
