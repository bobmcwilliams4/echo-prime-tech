'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { question: 'What is GraphRAG?', answer: 'Graph-based Retrieval Augmented Generation combines knowledge graphs with vector search. Instead of just finding similar text chunks, GraphRAG traverses entity relationships to find contextually connected information across domains — delivering answers with full citation chains.' },
  { question: 'How big is the knowledge graph?', answer: '312K+ nodes, 3.3M+ edges, spanning 101 domain clusters with 1.37M cross-domain connections. Built from 5,400+ engines and 529K+ doctrines. The graph grows continuously as new knowledge is ingested.' },
  { question: 'How is this different from vector search?', answer: 'Vector search finds similar text. GraphRAG finds related concepts across domains. A tax question about depreciation can traverse to oilfield equipment specs, lease terms, and IRS rulings — connections that vector similarity alone would miss.' },
  { question: 'Can I bring my own data?', answer: 'Yes. Upload documents via the Knowledge Forge API and they are automatically chunked, embedded, entity-extracted, and woven into the graph. Your private data gets the same cross-domain discovery as the base knowledge.' },
]

const features = [
  { title: '312K+ Graph Nodes', desc: 'Entities, concepts, and relationships extracted from 5,400+ engines and 529K+ doctrines across every major domain.' },
  { title: '3.3M+ Edges', desc: 'Relationship connections between entities — citations, dependencies, contradictions, and cross-references mapped automatically.' },
  { title: '101 Domain Clusters', desc: 'Tax, legal, medical, engineering, oilfield, crypto, cybersecurity, and 94 more — each with deep interconnections.' },
  { title: '1.37M Cross-Domain Links', desc: 'The real power: connections BETWEEN domains. A drilling regulation links to environmental law links to tax deductions.' },
  { title: 'Semantic + Graph Search', desc: 'Vectorize embeddings for semantic similarity combined with graph traversal for relationship discovery. Best of both worlds.' },
  { title: 'Citation Chains', desc: 'Every answer traces back through the graph to source documents. Full provenance from conclusion to authority.' },
  { title: 'Entity Extraction', desc: 'Automatic NER identifies people, organizations, laws, standards, chemicals, equipment, and 50+ entity types.' },
  { title: 'Cross-Domain Discovery', desc: 'Ask a question in one domain, discover relevant knowledge in domains you never thought to search.' },
  { title: 'Real-Time Ingestion', desc: 'New documents are chunked, embedded, entity-extracted, and graph-linked within minutes of upload.' },
  { title: 'Subgraph Queries', desc: 'Extract focused subgraphs around any entity or concept. Visualize the knowledge neighborhood.' },
  { title: 'Contradiction Detection', desc: 'Graph analysis identifies conflicting information between sources — critical for legal and compliance domains.' },
  { title: 'API + SDK Access', desc: 'Full REST API for graph queries, traversals, and ingestion. TypeScript SDK for seamless integration.' },
]

const comparison = [
  { feature: 'Graph + vector hybrid', echo: 'Built-in', neo4j: 'Separate setup', pinecone: 'Vector only', weaviate: 'Partial' },
  { feature: 'Pre-built knowledge', echo: '312K nodes', neo4j: 'Empty graph', pinecone: 'Empty index', weaviate: 'Empty' },
  { feature: 'Domain clusters', echo: '101 domains', neo4j: 'DIY', pinecone: 'No', weaviate: 'No' },
  { feature: 'Cross-domain links', echo: '1.37M automatic', neo4j: 'Manual only', pinecone: 'No', weaviate: 'No' },
  { feature: 'Entity extraction', echo: '50+ types auto', neo4j: 'Plugin needed', pinecone: 'No', weaviate: 'Basic' },
  { feature: 'Citation chains', echo: 'Full provenance', neo4j: 'Manual', pinecone: 'No', weaviate: 'No' },
  { feature: 'Contradiction detection', echo: 'Built-in', neo4j: 'Custom queries', pinecone: 'No', weaviate: 'No' },
  { feature: 'Real-time ingestion', echo: 'Minutes', neo4j: 'Manual ETL', pinecone: 'Fast', weaviate: 'Fast' },
  { feature: 'Managed infrastructure', echo: 'Cloudflare edge', neo4j: 'Aura or self-host', pinecone: 'Cloud', weaviate: 'Cloud or self-host' },
  { feature: 'Knowledge engines', echo: '5,400+ integrated', neo4j: 'No', pinecone: 'No', weaviate: 'No' },
  { feature: 'Starting price', echo: '$49/mo', neo4j: '$65/mo', pinecone: '$70/mo', weaviate: '$25/mo' },
]

export default function GraphRagPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#a855f7'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Graph RAG</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Knowledge graph AI with 312K+ nodes, 3.3M+ edges, and 101 domain clusters. Cross-domain discovery, citation chains, and semantic search — beyond what vector databases can do alone.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=graph-rag&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Knowledge Graphs Meet AI Retrieval</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Neo4j</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Pinecone</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Weaviate</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.neo4j}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.pinecone}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.weaviate}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$49', period: '/mo', features: ['10K graph queries/mo', 'Semantic search', '101 domain clusters', 'Citation chains', 'REST API', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$149', period: '/mo', features: ['100K queries/mo', 'Custom data ingestion', 'Cross-domain discovery', 'Subgraph extraction', 'Contradiction detection', 'Entity extraction', 'SDK access', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited queries', 'Private graph namespace', 'Custom entity types', 'Bulk ingestion API', 'Graph visualization', 'Team management', 'SLA guarantee', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=graph-rag&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
