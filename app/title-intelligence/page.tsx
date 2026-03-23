'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import { startAsyncInvestigation, getJobProgress, type AsyncJobProgress, type PipelineResult } from '../../lib/landman-api';
import TitleChainReport from '../../components/TitleChainReport';

// ════════════════════════════════════════════════════════════════
// ECHO PRIME TECHNOLOGIES — Title Intelligence Product Page
// AI-Powered Chain of Title & Mineral Rights Analysis
// ════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Closer AI', href: '/closer' },
  { label: 'Pipelines', href: '/pipelines' },
  { label: 'Security', href: '/security' },
  { label: 'Tax Prep', href: '/tax-returns' },
  { label: 'Pricing', href: '/pricing' },
];

const FEATURES = [
  {
    icon: '⛓️',
    title: 'Automated Chain Construction',
    description: 'Build gap-free chains of title from sovereignty to present. AI traverses grantor-grantee indexes, resolves name variations, and links instruments across decades — in hours, not weeks.',
  },
  {
    icon: '⚖️',
    title: 'Probate & Heirship Resolution',
    description: 'Automatically track multi-generation intestate succession. Apply Texas Estates Code Chapter 201 intestacy rules, calculate fractional shares with exact rational arithmetic, and detect missing heirs.',
  },
  {
    icon: '📐',
    title: 'Fractional Interest Calculator',
    description: 'NMA, NRI, working interest, ORRI, and overconveyance analysis. Every calculation uses exact fractions — never floating-point rounding. Verify 8/8ths balance across all ownership lines.',
  },
  {
    icon: '🔍',
    title: '59 Instrument Types',
    description: 'Classify and extract data from 59+ instrument types across 6 categories: Conveyance, Lease, Encumbrance, Easement, Probate, and Miscellaneous. From general warranty deeds to division orders.',
  },
  {
    icon: '🏛️',
    title: 'Direct Courthouse Access',
    description: 'ShadowGlass connects to 98 Texas county clerk portals. Search GovOS, Tyler Technologies, TexasFile, and Odyssey systems — no middlemen, no third-party data vendors.',
  },
  {
    icon: '🧠',
    title: '5,400+ Domain Engines',
    description: 'Multi-domain intelligence across 940+ categories with 697K+ doctrine blocks. From oil & gas lease interpretation to environmental compliance — every edge case has a doctrine.',
  },
];

const COMPARISON = [
  { metric: 'Time to complete', manual: '1-8 weeks', echo: '2-8 hours' },
  { metric: 'Cost per search', manual: '$2,000-$10,000', echo: '$200-$500' },
  { metric: 'Instrument types', manual: 'Varies by examiner', echo: '59+ classified' },
  { metric: 'County coverage', manual: 'One at a time', echo: '98 TX counties' },
  { metric: 'Probate resolution', manual: 'Manual genealogy', echo: 'AI-automated' },
  { metric: 'Gap detection', manual: 'Experience-dependent', echo: 'Algorithmic + AI' },
  { metric: 'Output format', manual: 'Word doc', echo: 'HTML + DOCX + API' },
  { metric: 'Fractional math', manual: 'Calculator/spreadsheet', echo: 'Exact rational arithmetic' },
];

const TIERS = [
  {
    name: 'Per Search',
    price: '$200-$500',
    period: 'per title search',
    features: [
      'Single property chain of title',
      'HTML + DOCX report',
      'Gap analysis with curative recommendations',
      'Fractional interest calculation',
      '98-county coverage',
      '24-hour delivery SLA',
    ],
    cta: 'Run a Title Search',
    accent: false,
  },
  {
    name: 'Professional',
    price: '$1,500',
    period: 'per month',
    features: [
      'Everything in Per Search',
      'Unlimited title searches',
      'API access for integration',
      'Batch processing (100+ titles)',
      'Priority support',
      'Custom report templates',
      'Probate/heirship analysis',
    ],
    cta: 'Start Free Trial',
    accent: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom county expansion',
      'White-label reports',
      'SLA guarantees',
      'On-premise deployment option',
      'API rate limit customization',
      'Training and onboarding',
    ],
    cta: 'Contact Sales',
    accent: false,
  },
];

const INSTRUMENT_CATEGORIES = [
  { name: 'Conveyance', count: 18, examples: 'Warranty, Mineral, Royalty, Gift, Executor\'s, Tax, TODD, Partition, Life Estate' },
  { name: 'Lease', count: 8, examples: 'OGL, Memorandum, Amendment, Release, Surface, Top Lease, Mineral Lease' },
  { name: 'Encumbrance', count: 10, examples: 'Deed of Trust, Mechanic\'s Lien, Federal/State Tax Lien, Lis Pendens, UCC' },
  { name: 'Easement & ROW', count: 7, examples: 'Pipeline, Road, Utility, Conservation, Water, Railroad, Construction' },
  { name: 'Probate & Succession', count: 10, examples: 'Will, Codicil, AoH, Determination of Heirship, Letters Testamentary, TODD' },
  { name: 'Miscellaneous', count: 12, examples: 'POA, Plat, Declaration of Trust, Pooling, Unitization, Division Order, DBA' },
];

const WORKFLOW_STEPS = [
  { step: 1, title: 'Submit Query', desc: 'Enter property legal description, county, and section/block/survey. Or paste a raw legal description — our parser handles the rest.' },
  { step: 2, title: 'Record Discovery', desc: 'AI searches 98 county portals, 16M+ pre-indexed records, and supplemental databases. Every grantor and grantee name is searched systematically.' },
  { step: 3, title: 'Chain Assembly', desc: 'Knowledge graph constructs the chain from sovereignty to present. Graph traversal links instruments, resolves name variations, and identifies mineral/surface splits.' },
  { step: 4, title: 'Gap Analysis', desc: 'AI identifies breaks: missing probates, unrecorded transfers, overconveyances, and orphan instruments. Each gap gets a severity score and curative recommendation.' },
  { step: 5, title: 'Live Portal Search', desc: 'For unfilled gaps, the system scrapes live county portals in real-time — GovOS, Tyler Technologies, TexasFile — searching by name, date, and instrument type.' },
  { step: 6, title: 'Report Generation', desc: 'Gold-standard HTML and DOCX reports with ownership tables, family trees, timeline visualization, instrument index, confidence scores, and legal theory analysis.' },
];

interface DeedRecord {
  id?: string | number;
  county?: string;
  instrument_type?: string;
  recorded_date?: string;
  instrument_date?: string;
  grantor?: string;
  grantee?: string;
  book?: string;
  page?: string;
  legal_description?: string;
  platform?: string;
  survey?: string;
  subdivision?: string;
  created_at?: string;
}

interface DisplayRecord {
  id: string | number;
  county: string;
  type: string;
  grantor: string;
  grantee: string;
  filed: string;
}

function normalizeRecord(raw: DeedRecord): DisplayRecord {
  const isTexasFile = raw.platform === 'TEXASFILE' || /^\d+$/.test(raw.instrument_type || '');

  if (isTexasFile) {
    // TexasFile scrape has column misalignment — recorded_date holds instrument type,
    // legal_description holds party names, grantor/grantee hold codes
    const names = (raw.legal_description || '').split(/,\s*/);
    return {
      id: raw.id || 0,
      county: raw.county || '—',
      type: raw.recorded_date || raw.instrument_date || '—',
      grantor: names[0] || '—',
      grantee: names.length > 1 ? names.slice(1).join(', ') : '—',
      filed: raw.created_at ? raw.created_at.split(' ')[0] : '—',
    };
  }

  // PublicSearch / clean platforms
  return {
    id: raw.id || 0,
    county: raw.county || '—',
    type: raw.instrument_type || '—',
    grantor: raw.grantor || '—',
    grantee: raw.grantee || '—',
    filed: raw.recorded_date ? raw.recorded_date.split(' ')[0] : raw.instrument_date ? raw.instrument_date.split(' ')[0] : '—',
  };
}

export default function TitleIntelligencePage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'features' | 'how' | 'pricing' | 'instruments'>('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DisplayRecord[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // ── Title Investigation State ──
  const [invCounty, setInvCounty] = useState('Reeves');
  const [invSection, setInvSection] = useState('');
  const [invBlock, setInvBlock] = useState('');
  const [invAbstract, setInvAbstract] = useState('');
  const [invParty, setInvParty] = useState('');
  const [invProgress, setInvProgress] = useState<AsyncJobProgress | null>(null);
  const [invResult, setInvResult] = useState<PipelineResult | null>(null);
  const [invError, setInvError] = useState('');
  const [invRunning, setInvRunning] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const runInvestigation = async () => {
    if (!invCounty.trim()) { setInvError('County is required'); return; }
    if (!user) { setInvError('Please sign in to run investigations'); return; }
    setInvError('');
    setInvResult(null);
    setInvProgress(null);
    setInvRunning(true);
    try {
      const { job_id } = await startAsyncInvestigation({
        county: invCounty.trim(),
        section: invSection.trim() || undefined,
        block: invBlock.trim() || undefined,
        abstract: invAbstract.trim() || undefined,
        party: invParty.trim() || undefined,
      });
      // Poll for progress
      pollRef.current = setInterval(async () => {
        try {
          const progress = await getJobProgress(job_id);
          setInvProgress(progress);
          if (progress.status === 'complete' && progress.result) {
            stopPolling();
            setInvResult(progress.result);
            setInvRunning(false);
          } else if (progress.status === 'failed') {
            stopPolling();
            setInvError(progress.error || 'Investigation failed');
            setInvRunning(false);
          } else if (progress.status === 'cancelled') {
            stopPolling();
            setInvError('Investigation was cancelled');
            setInvRunning(false);
          }
        } catch {
          // Polling error — keep trying
        }
      }, 3000);
    } catch (err) {
      setInvError(err instanceof Error ? err.message : 'Failed to start investigation');
      setInvRunning(false);
    }
  };

  const runDemoSearch = async (override?: string) => {
    const q = override || searchQuery;
    if (!q.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setHasSearched(true);
    try {
      const res = await fetch(`https://shadowglass-v8-warpspeed.bmcii1976.workers.dev/search?q=${encodeURIComponent(q.trim())}&limit=8`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = await res.json();
      const raw: DeedRecord[] = json.data || json.results || json.records || [];
      setTotalRecords(json.total || raw.length);
      setSearchResults(raw.slice(0, 5).map(normalizeRecord));
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div data-tutorial="title-hero" className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b transition-colors duration-500" style={{ backgroundColor: 'var(--ept-nav-bg)', borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={600} height={400} className="w-[180px] md:w-[260px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:opacity-100" style={{ color: 'var(--ept-text-secondary)' }}>{item.label}</Link>
            ))}
            <Link href="/sentinel" className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>Sentinel AI</Link>
          </div>
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        {/* ─── Hero ─── */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-16">
          <div data-tutorial="title-chain" className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest mb-6 animate-fade-up" style={{ backgroundColor: isDark ? '#0d948815' : '#0d737715', color: 'var(--ept-accent)', border: '1px solid var(--ept-accent)' }}>
            FIRST-TO-MARKET AI TITLE INTELLIGENCE
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-up">
            <span className="gradient-text">Chain of Title</span>
            <br />
            <span style={{ color: 'var(--ept-text)' }}>Built by AI, Not Guesswork</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
            The world&apos;s first AI system that constructs complete mineral title chains from raw courthouse records. 59 instrument types. 98 Texas counties. Probate resolution. Gap detection. Fractional interest math. In hours — not weeks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-2">
            <Link href="/sentinel?preset=Landman+%2F+Title" className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Try Title Intelligence Free
            </Link>
            <Link href="#how" className="px-8 py-4 rounded-xl font-semibold border text-base transition-transform hover:scale-105" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              See How It Works
            </Link>
          </div>
        </section>

        {/* ─── Live Demo Search ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
            <div className="text-center mb-6">
              <div data-tutorial="title-run-search" className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3" style={{ backgroundColor: isDark ? '#14b8a615' : '#0d737715', color: 'var(--ept-accent)' }}>
                LIVE DEMO — 16M+ REAL RECORDS
              </div>
              <h2 data-tutorial="title-search" className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Search Real Courthouse Records</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--ept-text-secondary)' }}>
                Try a grantor name, grantee, or legal description. Results are from live Texas county databases.
              </p>
            </div>

            <div className="flex gap-3 max-w-2xl mx-auto mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') runDemoSearch(); }}
                placeholder='Try "Smith" or "Marathon Oil" or "Section 12 Block A"'
                className="flex-1 px-4 py-3 rounded-xl text-sm border outline-none transition-colors"
                style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
              />
              <button
                onClick={() => runDemoSearch()}
                disabled={searchLoading || !searchQuery.trim()}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: 'var(--ept-accent)' }}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchError && (
              <div className="text-center text-sm py-3 text-red-400">{searchError}</div>
            )}

            {hasSearched && !searchLoading && !searchError && searchResults.length === 0 && (
              <div className="text-center text-sm py-4" style={{ color: 'var(--ept-text-muted)' }}>
                No records found. Try a different name or legal description.
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>County</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Type</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Grantor</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Grantee</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Filed</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((r, i) => (
                        <tr key={`${r.id}-${i}`} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)', borderTop: '1px solid var(--ept-card-border)' }}>
                          <td className="p-3 font-medium" style={{ color: 'var(--ept-accent)' }}>{r.county}</td>
                          <td className="p-3" style={{ color: 'var(--ept-text)' }}>{r.type}</td>
                          <td className="p-3" style={{ color: 'var(--ept-text-secondary)' }}>{r.grantor}</td>
                          <td className="p-3" style={{ color: 'var(--ept-text-secondary)' }}>{r.grantee}</td>
                          <td className="p-3 whitespace-nowrap" style={{ color: 'var(--ept-text-muted)' }}>{r.filed}</td>
                          <td className="p-3">
                            <Link href="/pricing" className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                              Full Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-center border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-surface)' }}>
                  <p className="text-xs mb-3" style={{ color: 'var(--ept-text-muted)' }}>
                    Showing 5 of {totalRecords > 1000 ? `${Math.round(totalRecords / 1000)}K+` : totalRecords.toLocaleString()} matching records. Full access includes legal descriptions, book/page, document images, and AI chain-of-title assembly.
                  </p>
                  <Link href="/pricing" className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white inline-block" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    Get Full Access — Starting at $200/search
                  </Link>
                </div>
              </div>
            )}

            {!hasSearched && (
              <div className="flex flex-wrap justify-center gap-2">
                {['Marathon Oil', 'Smith', 'Section 12', 'Chevron', 'Mineral Deed'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setSearchQuery(q); runDemoSearch(q); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Full Title Investigation ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3" style={{ backgroundColor: isDark ? '#14b8a615' : '#0d737715', color: 'var(--ept-accent)' }}>
                AI-POWERED CHAIN OF TITLE
              </div>
              <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Run a Full Title Investigation</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--ept-text-secondary)' }}>
                Enter a county and tract description. Our pipeline searches courthouse records, builds the chain, detects gaps, and generates a professional report.
              </p>
            </div>

            {invResult ? (
              <TitleChainReport result={invResult} onClose={() => { setInvResult(null); setInvProgress(null); }} />
            ) : (
              <>
                <div className="grid md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>County *</label>
                    <input
                      type="text" value={invCounty} onChange={e => setInvCounty(e.target.value)}
                      placeholder="Reeves" className="w-full px-3 py-2.5 rounded-xl text-sm border"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Section</label>
                    <input
                      type="text" value={invSection} onChange={e => setInvSection(e.target.value)}
                      placeholder="270" className="w-full px-3 py-2.5 rounded-xl text-sm border"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Block</label>
                    <input
                      type="text" value={invBlock} onChange={e => setInvBlock(e.target.value)}
                      placeholder="13" className="w-full px-3 py-2.5 rounded-xl text-sm border"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Abstract</label>
                    <input
                      type="text" value={invAbstract} onChange={e => setInvAbstract(e.target.value)}
                      placeholder="A-270" className="w-full px-3 py-2.5 rounded-xl text-sm border"
                      style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                    />
                  </div>
                </div>
                <div className="max-w-3xl mx-auto mb-4">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Party Name (optional — narrow search to a specific grantor/grantee)</label>
                  <input
                    type="text" value={invParty} onChange={e => setInvParty(e.target.value)}
                    placeholder="Marathon Oil" className="w-full px-3 py-2.5 rounded-xl text-sm border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={runInvestigation}
                    disabled={invRunning || !invCounty.trim()}
                    className="px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--ept-accent)' }}
                  >
                    {invRunning ? 'Investigation Running...' : 'Start Investigation'}
                  </button>
                  {!user && (
                    <p className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>
                      <Link href="/login" className="underline" style={{ color: 'var(--ept-accent)' }}>Sign in</Link> to run investigations
                    </p>
                  )}
                </div>

                {invError && (
                  <div className="text-center text-sm py-3 mt-4 rounded-lg" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>{invError}</div>
                )}

                {invProgress && invRunning && (
                  <div className="mt-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>
                        {invProgress.current_step_label || invProgress.current_step || 'Starting...'}
                      </span>
                      <span className="text-xs font-mono" style={{ color: 'var(--ept-accent)' }}>
                        {invProgress.progress_pct ?? 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${invProgress.progress_pct ?? 0}%`, backgroundColor: 'var(--ept-accent)' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      <span>{invProgress.records_found ?? 0} records found</span>
                      <span>{invProgress.gaps_found ?? 0} gaps detected</span>
                      <span>{invProgress.elapsed_ms ? `${(invProgress.elapsed_ms / 1000).toFixed(1)}s` : '...'}</span>
                    </div>
                    {invProgress.steps && invProgress.steps.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {invProgress.steps.map((step, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: step.status === 'complete' ? (isDark ? '#14b8a620' : '#0d737720') : step.status === 'running' ? (isDark ? '#f59e0b20' : '#f59e0b15') : 'var(--ept-surface)',
                              color: step.status === 'complete' ? 'var(--ept-accent)' : step.status === 'running' ? '#f59e0b' : 'var(--ept-text-muted)',
                            }}
                          >
                            {step.status === 'complete' ? '\u2713' : step.status === 'running' ? '\u25CF' : '\u25CB'} {step.name || `Step ${i + 1}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '16M+', label: 'Records Indexed' },
              { value: '98', label: 'TX Counties' },
              { value: '59', label: 'Instrument Types' },
              { value: '5,400+', label: 'AI Engines' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-2xl md:text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Tab Navigation ─── */}
        <section className="max-w-5xl mx-auto px-6 mb-12">
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
            {(['features', 'how', 'pricing', 'instruments'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--ept-card-bg)' : 'transparent',
                  color: activeTab === tab ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tab === 'features' ? 'Features' : tab === 'how' ? 'How It Works' : tab === 'pricing' ? 'Pricing' : 'Instruments'}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Features Tab ─── */}
        {activeTab === 'features' && (
          <section className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {FEATURES.map(f => (
                <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.description}</p>
                </div>
              ))}
            </div>

            {/* ─── Comparison Table ─── */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Manual vs. AI Title Search</h2>
            <div className="rounded-xl border overflow-hidden mb-16" style={{ borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Metric</th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Manual Search</th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Title Intelligence</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.metric} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)', borderTop: '1px solid var(--ept-card-border)' }}>
                      <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.metric}</td>
                      <td className="p-4" style={{ color: 'var(--ept-text-muted)' }}>{row.manual}</td>
                      <td className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ─── How It Works Tab ─── */}
        {activeTab === 'how' && (
          <section id="how" className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--ept-text)' }}>6-Stage Pipeline</h2>
            <div className="space-y-6">
              {WORKFLOW_STEPS.map(s => (
                <div key={s.step} className="flex gap-5 items-start p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Opportunity */}
            <div className="mt-16 p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Why This Matters</h3>
              <p className="text-sm mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                The global title insurance market is <strong style={{ color: 'var(--ept-accent)' }}>$72.77 billion</strong> and growing at 7.93% CAGR. Manual mineral title searches cost $2,000-$10,000 and take 1-8 weeks. No company on Earth has automated the full pipeline from raw courthouse records to certified ownership opinion. Until now.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div>
                  <div className="text-2xl font-extrabold gradient-text">$72.8B</div>
                  <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Global Market</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold gradient-text">90%</div>
                  <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold gradient-text">95%</div>
                  <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Time Savings</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Pricing Tab ─── */}
        {activeTab === 'pricing' && (
          <section className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TIERS.map(tier => (
                <div
                  key={tier.name}
                  className="p-6 rounded-xl border flex flex-col"
                  style={{
                    backgroundColor: 'var(--ept-card-bg)',
                    borderColor: tier.accent ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                    borderWidth: tier.accent ? 2 : 1,
                  }}
                >
                  {tier.accent && (
                    <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>
                  )}
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-extrabold gradient-text">{tier.price}</span>
                  </div>
                  <div className="text-xs mb-6" style={{ color: 'var(--ept-text-muted)' }}>{tier.period}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                        <span style={{ color: 'var(--ept-accent)' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.name === 'Enterprise' ? 'mailto:bob@echo-op.com?subject=Title%20Intelligence%20Enterprise' : `/checkout?service=title-intelligence&tier=${tier.name.toLowerCase()}`}
                    className="w-full py-3 rounded-xl font-semibold text-center block text-sm"
                    style={{
                      backgroundColor: tier.accent ? 'var(--ept-accent)' : 'transparent',
                      color: tier.accent ? '#fff' : 'var(--ept-text-secondary)',
                      border: tier.accent ? 'none' : '1px solid var(--ept-border)',
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Instruments Tab ─── */}
        {activeTab === 'instruments' && (
          <section className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>59 Instrument Types Across 6 Categories</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Every document type that affects Texas mineral and surface title — classified, extracted, and chained automatically.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {INSTRUMENT_CATEGORIES.map(cat => (
                <div key={cat.name} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{cat.name}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                      {cat.count} types
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cat.examples}</p>
                </div>
              ))}
            </div>

            {/* Legal Framework */}
            <div className="mt-12 p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Texas Legal Framework</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {[
                  'Tex. Prop. Code Ch. 5 — Conveyances',
                  'Tex. Prop. Code Ch. 12-13 — Recording & Notice',
                  'Tex. Estates Code Ch. 201 — Intestate Succession',
                  'Tex. Estates Code Ch. 202 — Determination of Heirship',
                  'Tex. Estates Code Ch. 203 — Affidavit of Heirship',
                  'Tex. Estates Code Ch. 114 — Transfer on Death Deed',
                  'Tex. Nat. Res. Code Ch. 52 — Mineral Development',
                  'Tex. Tax Code Ch. 33-34 — Tax Sales & Redemption',
                ].map(statute => (
                  <div key={statute} className="flex items-center gap-2 py-1" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span className="text-xs" style={{ color: 'var(--ept-accent)' }}>§</span>
                    {statute}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Cross-Sell ─── */}
        <section className="max-w-5xl mx-auto px-6 mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Your Land &amp; Title Stack</h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Pair title intelligence with these services for end-to-end mineral rights operations</p>
          <div data-tutorial="title-county" className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Data Pipelines', desc: 'Automated extraction from county clerk websites, RRC filings, and tax assessor records. Feed fresh data directly into title analysis.', href: '/pipelines', price: 'From $199/mo' },
              { title: 'Intelligence Engines', desc: '5,400+ domain-specific AI engines including 22 landman engines for lease analysis, easements, water rights, and ROW acquisition.', href: '/engines', price: 'From $199/mo' },
              { title: 'AI Sales Agent', desc: 'Automate mineral rights outreach to surface owners and lessors. AI handles cold calls, scheduling, and lead qualification 24/7.', href: '/closer', price: 'From $299/mo' },
            ].map((svc, i) => (
              <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
                <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="max-w-3xl mx-auto px-6 mt-20 text-center">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Ready to Transform Your Title Work?
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Join the first AI-powered title intelligence platform built specifically for Texas mineral rights. Start with a free search through Sentinel AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sentinel?preset=Landman+%2F+Title" className="px-8 py-4 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Start Free Title Search
            </Link>
            <Link href="/checkout?service=title-intelligence&tier=professional" className="px-8 py-4 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Buy Professional Plan
            </Link>
          </div>
        </section>

        {/* ─── Footer ─── */}
      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Title Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['OG', 'RE', 'LG']}
          title="Ask the Title Intelligence Engine"
          placeholder="Ask about mineral rights, chain of title, deeds..."
          exampleQueries={['How to calculate net mineral acres', 'Texas intestate succession for mineral rights', 'What is a division order?']}
        />
      </section>
        <footer className="max-w-5xl mx-auto px-6 mt-20 pt-8 border-t text-center" style={{ borderColor: 'var(--ept-border)' }}>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            © {new Date().getFullYear()} Echo Prime Technologies. All rights reserved. Title Intelligence is for informational purposes and does not constitute a legal opinion.
          </p>
        </footer>
      </div>
      <ProductTutorialButton tutorialId="title-intelligence" productName="Title Intelligence" />
    </div>
  );
}
