'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Memory Prime',
  tagline: '9-pillar permanent memory archive powering cross-session continuity across all Echo AI instances',
  accent: '#a855f7',
  productUrl: '/memory-prime',
  workerUrl: 'echo-memory-prime.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Memory Prime is the persistent memory backbone of the entire Echo ecosystem. Every AI instance — Claude Code sessions, chatbots, automation workers, and background daemons — reads and writes to Memory Prime to maintain continuity across restarts, context compaction, and multi-instance coordination.',
    'The 9-pillar architecture organizes memories by type: Facts (verified knowledge), Decisions (recorded choices and rationale), Context (situational awareness), Sessions (session-level state), Tasks (work items and status), Errors (failure patterns and resolutions), Capabilities (learned skills and tools), Preferences (user and system settings), and Knowledge (domain expertise).',
    'Importance scoring, time-decay ranking, and full-text search ensure the most relevant memories surface when needed. Memory consolidation runs on a schedule to merge redundant entries, resolve contradictions, and compact storage. With cross-instance sync, every Echo service shares the same institutional memory in real time.',
  ],
  gettingStarted: [
    { step: 1, title: 'Register your instance', desc: 'Every service that reads or writes memories must register with a unique instance ID. POST to /instances with your service name, type, and version to receive an instance token used in all subsequent requests.' },
    { step: 2, title: 'Store your first memory', desc: 'POST to /store with a pillar, content, importance score (1–10), and optional tags. Memories with importance 8+ are flagged for preservation and excluded from low-priority pruning during consolidation runs.' },
    { step: 3, title: 'Search stored memories', desc: 'POST to /search with a natural-language query, optional pillar filter, and minimum importance threshold. Results are ranked by relevance combined with recency and importance score weighting.' },
    { step: 4, title: 'Configure importance thresholds', desc: 'Set per-pillar minimum importance thresholds in your instance settings to control what is auto-pruned during consolidation. Foundation memories at importance 10 are never pruned under any policy.' },
    { step: 5, title: 'Set up memory consolidation', desc: 'Enable the consolidation schedule (hourly, daily, or weekly) for your instance. Consolidation merges duplicate facts, resolves contradictions, and produces summary memories that replace verbose originals.' },
  ],
  features: [
    { title: '9-Pillar Architecture', desc: 'Memories are classified into nine semantic pillars: Facts, Decisions, Context, Sessions, Tasks, Errors, Capabilities, Preferences, and Knowledge. Each pillar has its own retention policies and search rank weights.' },
    { title: 'Full-Text Search', desc: 'BM25-powered full-text search across all pillars with optional semantic reranking. Searches return relevance scores alongside memory metadata for transparent, auditable ranking.' },
    { title: 'Importance Scoring', desc: 'Every memory carries an importance score from 1 to 10. Scores influence retention priority, search ranking, and consolidation decisions. Foundation memories at importance 10 are permanent and never eligible for pruning.' },
    { title: 'Tag-Based Retrieval', desc: 'Assign arbitrary tags to memories and retrieve by tag intersection or union. Tags power contextual memory loading — for example, loading all memories tagged with a project name at the start of a new session.' },
    { title: 'Time-Decay Ranking', desc: 'Search results factor in memory age via configurable decay functions. Recent memories rank higher by default, but high-importance memories resist decay to ensure critical context persists across long time gaps.' },
    { title: 'Cross-Instance Sync', desc: 'All Echo service instances share a unified memory space. A memory written by a worker on BRAVO is immediately readable by a Claude Code session on ALPHA or a Cloudflare Worker at the edge.' },
    { title: 'Memory Consolidation', desc: 'Scheduled consolidation jobs merge redundant memories, extract facts from verbose entries, resolve contradictions using importance score hierarchy, and compact the memory store to reduce retrieval latency.' },
    { title: 'Fact Extraction', desc: 'POST raw text — conversations, logs, documents — and the extraction pipeline identifies discrete facts, classifies them by pillar, scores importance, and stores them automatically without manual curation.' },
    { title: 'Bulk Operations', desc: 'Batch store, search, and delete operations handle up to 1,000 memories per request. Bulk imports support JSONL format for migrating from external memory systems or seeding initial knowledge bases.' },
    { title: 'Audit Trail', desc: 'Every write, update, and delete is logged with timestamp, instance ID, and change delta. Audit logs are immutable and retained for 90 days, enabling full memory provenance tracing for compliance.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/store', desc: 'Store a new memory. Body: { pillar, content, importance, tags, instance_id }. Returns memory ID and storage confirmation with assigned importance tier.', auth: true },
    { method: 'POST', path: '/search', desc: 'Search memories with natural-language query, pillar filter, importance threshold, and result limit. Returns ranked memory list with BM25 scores and metadata.', auth: true },
    { method: 'GET', path: '/context/:instance', desc: 'Load full context for an instance — all importance 8+ memories plus recent session state formatted for direct injection into a system prompt. Used at session start.', auth: true },
    { method: 'POST', path: '/facts/extract', desc: 'Submit raw text for automatic fact extraction, classification, importance scoring, and deduplication against existing memories. Returns list of newly created memory IDs.', auth: true },
    { method: 'POST', path: '/consolidate', desc: 'Trigger an on-demand consolidation run for a specific pillar or all pillars. Returns consolidation report with merge count, pruned count, and storage savings in bytes.', auth: true },
    { method: 'GET', path: '/stats', desc: 'Return memory store statistics: total count per pillar, storage size, oldest and newest memories, average importance, and consolidation run history.', auth: true },
  ],
  userGuide: [
    {
      title: 'Storing Memories',
      id: 'storing',
      content: [
        'Choose the right pillar before storing. Facts holds verified knowledge that should persist indefinitely. Decisions captures choices made and their rationale. Context stores situational awareness that may be pruned once stale. Using the correct pillar ensures consolidation and retention rules apply appropriately.',
        'Importance scores are the primary lever controlling memory lifetime. Score 1–3 for ephemeral context prunable in hours. Score 4–6 for useful but replaceable information. Score 7–9 for significant knowledge worth preserving across sessions. Reserve score 10 for foundation knowledge that must never be pruned.',
        'Tags dramatically improve retrieval precision. Use a consistent tagging taxonomy: project names, technology names, entity types (person, company, system), and status labels (active, resolved, deprecated). The /context/:instance endpoint loads memories by tag intersection at session start.',
      ],
    },
    {
      title: 'Searching and Retrieval',
      id: 'search',
      content: [
        'The /search endpoint accepts natural-language queries and returns memories ranked by a combined score of BM25 text relevance, importance weight, and time-decay. For precision retrieval, add a pillar filter to constrain results to a single semantic category.',
        'Set minimum_importance in your search request to filter out low-value memories when you need high-confidence results. A threshold of 7 returns only memories explicitly marked as significant, reducing noise in critical decision workflows.',
        'The /context/:instance endpoint is optimized for session start loading — it returns all importance 8+ memories for an instance plus the last 50 session entries, formatted for direct injection into a system prompt. Call it once at the start of each session rather than running multiple searches.',
      ],
    },
    {
      title: 'Memory Consolidation',
      id: 'consolidation',
      content: [
        'Consolidation runs automatically on the schedule configured for your instance. Daily consolidation is recommended for active services. The pipeline first identifies near-duplicate memories via semantic similarity, then merges pairs with importance-weighted content, then extracts structured facts from verbose session logs.',
        'Contradictions are resolved by importance score: the higher-importance memory wins. If both have equal importance, the more recent memory takes precedence and the older is archived rather than deleted. Archived memories remain searchable but are excluded from default ranking.',
        'Monitor consolidation health via /stats. A merge ratio above 30% indicates redundant writes that should be addressed upstream. A storage growth rate above 10 MB per day suggests importance thresholds need tightening or consolidation frequency needs increasing.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Fact Extraction from Conversations', desc: 'A lightweight extraction model processes raw conversation logs and documents, identifying discrete factual claims, classifying them into pillars, assigning importance scores, and deduplicating against existing memories before storage.' },
    { capability: 'Memory Importance Scoring', desc: 'An importance model evaluates memory content against signals including topic novelty, entity salience, recency of reference, and downstream utility. Scores are updated as memories are accessed and cited by other AI instances.' },
    { capability: 'Contradiction Detection', desc: 'During consolidation, a contradiction detection pass identifies memories making conflicting claims about the same entity or fact. Detected conflicts are flagged for human review or resolved automatically by importance score hierarchy.' },
    { capability: 'Knowledge Graph Building', desc: 'Memory Prime maintains a lightweight entity graph linking people, systems, concepts, and events referenced across memories. Graph traversal queries enable contextual loading: given an entity, retrieve all related memories across all pillars.' },
  ],
  troubleshooting: [
    { issue: 'Memory not appearing in search results', solution: 'Verify the importance score meets your search minimum_importance threshold. Check that the pillar filter is not excluding the target pillar. Newly stored memories may take up to 30 seconds to appear in full-text search indexes after write.' },
    { issue: 'Context endpoint returning stale data', solution: 'Context is cached per instance for 60 seconds. Call POST /cache/invalidate with your instance_id to force a refresh. For real-time context, use /search with a high recency bias instead of the cached context endpoint.' },
    { issue: 'Consolidation not reducing storage as expected', solution: 'Low merge ratios indicate memories are sufficiently unique. Review your importance threshold — if most memories are importance 8+, they are protected from pruning. Lower the threshold for ephemeral pillars (Sessions, Context) to allow more aggressive pruning.' },
    { issue: 'Duplicate memories being created on repeated writes', solution: 'Enable deduplication on /store by setting deduplicate: true. The system computes semantic similarity against recent memories in the same pillar and skips storage if similarity exceeds the 0.92 threshold.' },
  ],
  faq: [
    { q: 'What is the maximum size of a single memory entry?', a: 'Memory content is capped at 32,000 characters per entry. For larger documents, use the /facts/extract endpoint which automatically chunks input and stores extracted facts as individual memories with cross-references.' },
    { q: 'Can memories be exported for backup?', a: 'Yes. GET /export returns all memories as JSONL with full metadata. Export is available at the pillar level or for the entire store. Exports can be reimported via POST /import/bulk for migration or seeding.' },
    { q: 'How does cross-instance sync work?', a: 'All writes propagate to Cloudflare D1 (primary storage) and KV (fast read cache) synchronously. Edge Workers read from KV with sub-millisecond latency. BRAVO and ALPHA nodes sync every 30 seconds via the OmniSync pipeline.' },
    { q: 'Are memories encrypted at rest?', a: 'Yes. All memory content is encrypted at rest using AES-256. Memory content is never logged in plaintext. The audit trail stores content hashes rather than full content for provenance verification without exposing sensitive data.' },
    { q: 'Can Memory Prime be deployed on-premises?', a: 'The Memory Prime Worker can be deployed to any Cloudflare account or self-hosted environment. Contact Echo Prime for the self-hosted deployment package including D1 schema, KV namespace configuration, and migration tooling.' },
  ],
}

export default function MemoryPrimeDocsPage() {
  return <ProductDoc {...data} />
}
