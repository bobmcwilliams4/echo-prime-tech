'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '../../../lib/theme-context'
import BreadcrumbSchema from '../../../components/BreadcrumbSchema'
import FaqSchema from '../../../components/FaqSchema'

const SECTIONS = [
  { id: 'what', label: 'What Are Engines?' },
  { id: 'categories', label: 'Categories' },
  { id: 'how', label: 'How They Work' },
  { id: 'querying', label: 'Querying' },
  { id: 'doctrines', label: 'Doctrine System' },
  { id: 'cross', label: 'Cross-Domain' },
  { id: 'confidence', label: 'Confidence Levels' },
  { id: 'faq', label: 'FAQ' },
]

const CATEGORIES = [
  { code: 'TX', range: 'TX01-TX14', name: 'Tax Intelligence', desc: 'IRC code analysis, audit defense, multi-entity structuring, state tax law.' },
  { code: 'LG', range: 'LG01-LG18', name: 'Legal Analysis', desc: 'Case law, contract review, litigation risk scoring, regulatory compliance.' },
  { code: 'LM', range: 'LM01-LM22', name: 'Land & Minerals', desc: 'Title examination, mineral rights, lease interpretation, chain of title.' },
  { code: 'CYBER', range: 'CYBER01-CYBER09', name: 'Cybersecurity', desc: 'Threat intel, vulnerability assessment, incident response, NIST frameworks.' },
  { code: 'MED', range: 'MED01-MED11', name: 'Medical Intelligence', desc: 'Clinical decision support, drug interactions, diagnostic reasoning.' },
  { code: 'FIN', range: 'FIN01-FIN12', name: 'Financial Intelligence', desc: 'Risk modeling, portfolio analysis, compliance reporting, market intel.' },
  { code: 'DRL', range: 'DRL01-DRL08', name: 'Drilling Engineering', desc: 'Well design, drilling fluids, directional drilling, well control.' },
  { code: 'FRAC', range: 'FRAC01-FRAC06', name: 'Fracturing & Completions', desc: 'Frac design, proppant selection, stimulation treatment analysis.' },
  { code: 'FOREN', range: 'FOREN01-FOREN07', name: 'Forensic Analysis', desc: 'Digital forensics, evidence analysis, chain of custody, expert witness.' },
  { code: 'ACCT', range: 'ACCT01-ACCT10', name: 'Accounting & Audit', desc: 'GAAP/IFRS compliance, audit procedures, internal controls.' },
  { code: 'AIML', range: 'AIML01-AIML08', name: 'AI & Machine Learning', desc: 'Model architecture, MLOps, training pipelines, evaluation.' },
  { code: 'ENT', range: 'ENT01-ENT06', name: 'Enterprise Systems', desc: 'ERP integration, CRM optimization, IT governance, digital transformation.' },
]

const CONFIDENCE_LEVELS = [
  { level: 'DEFENSIBLE', color: '#10b981', desc: 'Backed by strong, well-established authority. Settled case law, clear IRC provisions, widely-accepted standards. Safe for client deliverables and formal opinions.' },
  { level: 'AGGRESSIVE', color: '#f59e0b', desc: 'Reasonable interpretation pushing boundaries of established authority. Supportable but carries higher audit or challenge risk. Common in tax planning.' },
  { level: 'DISCLOSURE', color: '#f97316', desc: 'Positions requiring explicit disclosure to clients or regulators. May rely on favorable interpretations of ambiguous authority.' },
  { level: 'HIGH_RISK', color: '#ef4444', desc: 'Thin authority support. Conclusions that should be used with extreme caution and full client awareness of the risk profile.' },
]

const FAQS: { q: string; a: string }[] = [
  { q: 'What is an Intelligence Engine?', a: 'An Intelligence Engine is a domain-specific AI model backed by pre-compiled doctrine blocks. Each engine is trained and indexed against authoritative sources in its field, so every response is grounded in real documents rather than probabilistic generation.' },
  { q: 'How many engines are available?', a: 'Echo Prime currently operates 5,486+ live engines across 200+ domain categories with 529,000+ indexed doctrine blocks. The catalog expands continuously with a target of 10,000+ engines.' },
  { q: 'What are doctrine blocks?', a: 'Doctrine blocks are structured knowledge units extracted from authoritative sources like IRC sections, case law, NIST frameworks, API standards, and regulatory codes. Each block carries source provenance, authority weight, and indexing metadata.' },
  { q: 'Are responses citable in professional work?', a: 'Yes. Every engine response includes inline authority citations referencing the specific source material. The DEFENSIBLE confidence tier is designed for use in client deliverables, audit responses, and formal opinions.' },
  { q: 'How does cross-domain routing work?', a: 'When a query spans multiple domains (e.g., tax implications of mineral rights transfers), the engine router identifies all relevant domains, queries each engine cluster in parallel, and synthesizes a unified response with citations from all contributing engines.' },
  { q: 'What confidence level should I use?', a: 'For client-facing deliverables, use DEFENSIBLE. For internal research and strategy exploration, AGGRESSIVE provides broader coverage. DISCLOSURE and HIGH_RISK are useful for understanding the full range of possible positions but require appropriate risk disclaimers.' },
  { q: 'Is there an API for programmatic access?', a: 'Yes. The Engine Runtime API supports both direct engine queries and domain-routed queries via REST endpoints. Authenticate with your API key and specify the engine or domain to query. See the Querying section for curl and JavaScript examples.' },
  { q: 'How is data encrypted?', a: 'All engine queries and doctrine blocks are encrypted with AES-256. Data in transit uses TLS 1.3. Doctrine source material is stored in encrypted R2 buckets with per-engine access controls.' },
]

export default function EngineDocsPage() {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState('what')

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cardStyle = { backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }
  const codeStyle: React.CSSProperties = { backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8125rem', lineHeight: '1.6', overflowX: 'auto' as const, whiteSpace: 'pre' as const }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Docs', href: '/docs' }, { name: 'Intelligence Engines', href: '/docs/engines' }]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/engines" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ color: 'var(--ept-text-secondary)' }}>Engine Catalog</Link>
          <Link href="/sentinel" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Try Sentinel</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-10 self-start">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-text-muted)' }}>On this page</p>
          <ul className="space-y-1">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <button onClick={() => scrollTo(s.id)} className="text-sm py-1.5 px-3 rounded-lg w-full text-left transition-colors" style={{ backgroundColor: activeSection === s.id ? 'var(--ept-surface)' : 'transparent', color: activeSection === s.id ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: activeSection === s.id ? 600 : 400 }}>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Intelligence Engine Guide</h1>
          <p className="text-lg mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Everything you need to understand, query, and integrate the Echo Prime engine system.</p>

          {/* 1. What Are Intelligence Engines? */}
          <section id="what" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>What Are Intelligence Engines?</h2>
            <div className="p-6 rounded-xl border" style={cardStyle}>
              <p className="mb-3" style={{ color: 'var(--ept-text-secondary)' }}>Intelligence Engines are domain-specific AI models backed by pre-compiled <strong style={{ color: 'var(--ept-text)' }}>doctrine blocks</strong> — structured knowledge units extracted from authoritative sources. Unlike general-purpose language models that generate probabilistic text, each engine is indexed against real documents in its field: IRC sections, case law, NIST frameworks, API standards, OSHA regulations, and thousands of other primary sources.</p>
              <p className="mb-3" style={{ color: 'var(--ept-text-secondary)' }}>Every response includes inline authority citations so professionals can verify the answer against the original source. The system operates 5,486+ engines across 200+ domains with 529,000+ indexed doctrine blocks and counting.</p>
              <p style={{ color: 'var(--ept-text-secondary)' }}>Engines are organized into four pricing tiers based on domain complexity and liability: <strong style={{ color: '#f59e0b' }}>Supreme</strong>, <strong style={{ color: '#ef4444' }}>Critical</strong>, <strong style={{ color: '#6366f1' }}>Engineering</strong>, and <strong style={{ color: '#10b981' }}>Standard</strong>.</p>
            </div>
          </section>

          {/* 2. Engine Categories */}
          <section id="categories" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Engine Categories</h2>
            <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Engines are grouped by domain code. Each category contains multiple specialized engines. Below are the primary categories:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CATEGORIES.map(c => (
                <div key={c.code} className="p-4 rounded-xl border" style={cardStyle}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{c.code}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{c.name}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{c.range}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-4" style={{ color: 'var(--ept-text-muted)' }}>Additional categories include Oilfield Equipment (OFE), Production Engineering (PROD), Energy Systems (ENRG), Aerospace (AERO), Automotive (AUTO), HVAC, Construction, Architecture, Biotechnology, Agriculture, Game Development, and 180+ more. See the <Link href="/engines" style={{ color: 'var(--ept-accent)' }}>full Engine Catalog</Link> for the complete list.</p>
          </section>

          {/* 3. How Engines Work */}
          <section id="how" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>How Engines Work</h2>
            <div className="p-6 rounded-xl border" style={cardStyle}>
              <ol className="space-y-4">
                {[
                  { step: 'Query Received', desc: 'A natural-language question arrives via the Sentinel interface or the REST API.' },
                  { step: 'Domain Routing', desc: 'The engine router analyzes the query to identify the target domain(s). Multi-domain queries are split into parallel sub-queries.' },
                  { step: 'Doctrine Lookup', desc: 'The matched engine searches its indexed doctrine blocks, ranking them by authority weight and relevance score.' },
                  { step: 'Synthesis', desc: 'Top-ranked doctrine blocks are synthesized into a coherent response. Every claim is linked to its source doctrine block.' },
                  { step: 'Citation & Confidence', desc: 'Inline citations are attached. A confidence level (DEFENSIBLE, AGGRESSIVE, DISCLOSURE, or HIGH_RISK) is assigned based on the authority weight of supporting sources.' },
                  { step: 'Response Delivered', desc: 'The final answer, complete with citations and confidence tag, is returned to the caller in under 2 seconds for most single-domain queries.' },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{i + 1}</span>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--ept-text)' }}>{s.step}</p>
                      <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 4. Querying Engines */}
          <section id="querying" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Querying Engines</h2>
            <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Use the Engine Runtime API for programmatic access. All requests require an API key passed via the <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>Authorization</code> header.</p>

            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>curl</h3>
            <div className="p-4 rounded-xl border mb-6" style={{ ...cardStyle, ...codeStyle }}>{`curl -X POST https://echo-engine-runtime.bmcii1976.workers.dev/query \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "query": "What are the IRC 1031 requirements for mineral rights?",
    "domain": "TX",
    "confidence_min": "DEFENSIBLE"
  }'`}</div>

            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>JavaScript / TypeScript</h3>
            <div className="p-4 rounded-xl border mb-4" style={{ ...cardStyle, ...codeStyle }}>{`const res = await fetch(
  "https://echo-engine-runtime.bmcii1976.workers.dev/query",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify({
      query: "NIST 800-53 controls for cloud workloads",
      domain: "CYBER",
      confidence_min: "AGGRESSIVE",
    }),
  }
);
const data = await res.json();
console.log(data.answer, data.citations);`}</div>

            <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Omit the <code className="font-mono">domain</code> field to let the router detect the domain automatically. Set <code className="font-mono">confidence_min</code> to filter out responses below your threshold.</p>
          </section>

          {/* 5. Doctrine System */}
          <section id="doctrines" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Doctrine System</h2>
            <div className="p-6 rounded-xl border" style={cardStyle}>
              <p className="mb-3" style={{ color: 'var(--ept-text-secondary)' }}>Doctrine blocks are the foundational knowledge units of the engine system. Each block is a structured record containing:</p>
              <ul className="space-y-2 mb-4">
                {[
                  ['Source Reference', 'The authoritative document — an IRC section, case citation, NIST control, OSHA standard, or other primary source.'],
                  ['Content', 'The extracted knowledge in normalized form, ready for semantic matching.'],
                  ['Authority Weight', 'A numeric score reflecting the strength and recency of the source. Settled law scores higher than advisory rulings.'],
                  ['Provenance Chain', 'Full audit trail of when the block was indexed, from which source, and which engine owns it.'],
                  ['Cross-References', 'Links to related blocks in other domains for multi-engine synthesis.'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-2 text-sm">
                    <span className="font-semibold shrink-0" style={{ color: 'var(--ept-text)' }}>{title}:</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{desc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>The system currently contains 529,000+ doctrine blocks with continuous ingestion from upstream sources. Blocks are version-controlled so historical positions remain queryable even after source material is updated.</p>
            </div>
          </section>

          {/* 6. Cross-Domain Queries */}
          <section id="cross" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Cross-Domain Queries</h2>
            <div className="p-6 rounded-xl border" style={cardStyle}>
              <p className="mb-3" style={{ color: 'var(--ept-text-secondary)' }}>Many professional questions span multiple domains. A question about the tax implications of a hydraulic fracturing operation on leased mineral rights touches Tax (TX), Land &amp; Minerals (LM), and Fracturing (FRAC) simultaneously.</p>
              <p className="mb-3" style={{ color: 'var(--ept-text-secondary)' }}>The engine router handles this automatically:</p>
              <ol className="space-y-2 mb-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                <li><strong style={{ color: 'var(--ept-text)' }}>1.</strong> The query is analyzed and all relevant domains are identified.</li>
                <li><strong style={{ color: 'var(--ept-text)' }}>2.</strong> Sub-queries are dispatched to each engine cluster in parallel.</li>
                <li><strong style={{ color: 'var(--ept-text)' }}>3.</strong> Doctrine blocks from all contributing engines are ranked together.</li>
                <li><strong style={{ color: 'var(--ept-text)' }}>4.</strong> A unified response is synthesized with citations from every domain.</li>
              </ol>
              <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Cross-domain queries are billed at the rate of the highest-tier domain involved. For example, a TX+LM query is billed at the Supreme tier rate.</p>
            </div>
          </section>

          {/* 7. Confidence Levels */}
          <section id="confidence" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Confidence Levels</h2>
            <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Every engine response carries a confidence stratification tier based on the authority weight of supporting doctrine blocks.</p>
            <div className="space-y-3">
              {CONFIDENCE_LEVELS.map(c => (
                <div key={c.level} className="p-4 rounded-xl border flex gap-4 items-start" style={cardStyle}>
                  <span className="shrink-0 w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="font-bold font-mono text-sm" style={{ color: c.color }}>{c.level}</p>
                    <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. FAQ */}
          <section id="faq" className="mb-14">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details key={i} className="p-4 rounded-xl border group" style={cardStyle}>
                  <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                    {f.q}
                    <span className="text-xs ml-2 transition-transform group-open:rotate-180" style={{ color: 'var(--ept-text-muted)' }}>&#9660;</span>
                  </summary>
                  <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center py-10 rounded-2xl border" style={cardStyle}>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Ready to query the engines?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Try Sentinel AI for interactive engine-backed intelligence, or explore the full catalog.</p>
            <div className="flex justify-center gap-3">
              <Link href="/sentinel" className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Open Sentinel AI</Link>
              <Link href="/engines" className="px-6 py-2.5 rounded-lg text-sm font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Engine Catalog</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
