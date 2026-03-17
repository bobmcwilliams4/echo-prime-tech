'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import {
  searchGenealogyRecords,
  searchDeedRecords,
  unifiedSearch,
  getGenealogyHealth,
  getDeedHealth,
  getDeedCounties,
  getDeedInstrumentTypes,
  getDeedStats,
  getGenealogySources,
  type GenealogyRecord,
  type DeedRecord,
  type UnifiedRecord,
  type GenealogyHealth,
  type DeedHealth,
} from '../../lib/county-records-api';

// ════════════════════════════════════════════════════════════════
// ECHO PRIME TECHNOLOGIES — County Records Search
// Unified Genealogy + Deed Records Search Interface
// ════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Closer AI', href: '/closer' },
  { label: 'Pipelines', href: '/pipelines' },
  { label: 'Security', href: '/security' },
  { label: 'Tax Prep', href: '/tax-returns' },
  { label: 'Pricing', href: '/pricing' },
];

const RECORD_TYPE_FILTERS = [
  { value: '', label: 'All Types' },
  { value: 'birth', label: 'Birth Records' },
  { value: 'death', label: 'Death Records' },
  { value: 'marriage', label: 'Marriage Records' },
  { value: 'burial', label: 'Burial Records' },
  { value: 'census', label: 'Census Records' },
  { value: 'military', label: 'Military Records' },
  { value: 'immigration', label: 'Immigration Records' },
  { value: 'land', label: 'Land Records' },
  { value: 'probate', label: 'Probate Records' },
];

const GENEALOGY_SOURCES = [
  { id: 'familysearch', name: 'FamilySearch', icon: '🌳', desc: 'Largest free genealogy database' },
  { id: 'findagrave', name: 'Find a Grave', icon: '🪦', desc: 'Cemetery & burial records' },
  { id: 'chronicling_america', name: 'Chronicling America', icon: '📰', desc: 'Library of Congress newspapers' },
  { id: 'usgenweb', name: 'USGenWeb', icon: '🗂️', desc: 'Volunteer county archives' },
  { id: 'courthouse', name: 'County Courthouses', icon: '🏛️', desc: 'Direct clerk portal access' },
];

interface SearchState {
  query: string;
  surname: string;
  givenName: string;
  county: string;
  state: string;
  recordType: string;
  instrumentType: string;
  grantor: string;
  grantee: string;
  dateFrom: string;
  dateTo: string;
}

interface HealthStatus {
  genealogy: GenealogyHealth | null;
  deeds: DeedHealth | null;
  loading: boolean;
}

export default function CountyRecordsPage() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'unified' | 'genealogy' | 'deeds' | 'sources'>('unified');
  const [results, setResults] = useState<UnifiedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [health, setHealth] = useState<HealthStatus>({ genealogy: null, deeds: null, loading: true });
  const [deedCounties, setDeedCounties] = useState<string[]>([]);
  const [deedTypes, setDeedTypes] = useState<string[]>([]);
  const [deedStats, setDeedStats] = useState<{ total_records: number; counties: number; instrument_types: number } | null>(null);
  const [search, setSearch] = useState<SearchState>({
    query: '', surname: '', givenName: '', county: '', state: 'TX',
    recordType: '', instrumentType: '', grantor: '', grantee: '',
    dateFrom: '', dateTo: '',
  });

  // Load health + metadata on mount
  useEffect(() => {
    const load = async () => {
      const [gHealth, dHealth, counties, types, stats] = await Promise.allSettled([
        getGenealogyHealth(),
        getDeedHealth(),
        getDeedCounties(),
        getDeedInstrumentTypes(),
        getDeedStats(),
      ]);
      setHealth({
        genealogy: gHealth.status === 'fulfilled' ? gHealth.value : null,
        deeds: dHealth.status === 'fulfilled' ? dHealth.value : null,
        loading: false,
      });
      if (counties.status === 'fulfilled') setDeedCounties(counties.value.counties || []);
      if (types.status === 'fulfilled') setDeedTypes(types.value.types || []);
      if (stats.status === 'fulfilled') setDeedStats(stats.value);
    };
    load();
  }, []);

  const handleUnifiedSearch = useCallback(async () => {
    if (!search.query.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await unifiedSearch(search.query, search.county || undefined);
      setResults(data);
      setTotalResults(data.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
      setResults([]);
    }
    setLoading(false);
  }, [search.query, search.county]);

  const handleGenealogySearch = useCallback(async () => {
    if (!search.surname.trim() && !search.givenName.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await searchGenealogyRecords({
        surname: search.surname || undefined,
        given_name: search.givenName || undefined,
        county: search.county || undefined,
        state: search.state || undefined,
        record_type: search.recordType || undefined,
        limit: 50,
      });
      setResults((data.records || []).map(r => ({ type: 'genealogy' as const, data: r })));
      setTotalResults(data.total || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
      setResults([]);
    }
    setLoading(false);
  }, [search]);

  const handleDeedSearch = useCallback(async () => {
    if (!search.county && !search.grantor && !search.grantee) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await searchDeedRecords({
        county: search.county || undefined,
        instrument_type: search.instrumentType || undefined,
        grantor: search.grantor || undefined,
        grantee: search.grantee || undefined,
        date_from: search.dateFrom || undefined,
        date_to: search.dateTo || undefined,
        limit: 50,
      });
      setResults((data.records || []).map(r => ({ type: 'deed' as const, data: r })));
      setTotalResults(data.total || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
      setResults([]);
    }
    setLoading(false);
  }, [search]);

  const handleSearch = () => {
    if (activeTab === 'unified') handleUnifiedSearch();
    else if (activeTab === 'genealogy') handleGenealogySearch();
    else if (activeTab === 'deeds') handleDeedSearch();
  };

  const updateSearch = (field: keyof SearchState, value: string) => {
    setSearch(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div data-tutorial="county-hero" className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--ept-text-secondary)' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div data-tutorial="county-search-fields" className="flex items-center gap-3">
          <button onClick={toggle} className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="county-search-btn" className="px-6 py-16 md:py-24 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-up" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
          Genealogy + Deed Records
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up" style={{ color: 'var(--ept-text)' }}>
          County Records <span className="gradient-text">Search</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>
          Search genealogy records from 5 public sources and deed records from Texas county courthouses — all in one place. Birth, death, marriage, burial, land records, and 33+ instrument types.
        </p>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up-delay-2">
          {[
            { label: 'Genealogy Sources', value: health.genealogy?.platforms?.length ?? 5 },
            { label: 'Genealogy Records', value: health.genealogy?.records?.toLocaleString() ?? '—' },
            { label: 'Deed Records', value: deedStats?.total_records?.toLocaleString() ?? '—' },
            { label: 'TX Counties', value: (deedStats?.counties ?? deedCounties.length) || '—' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Tabs */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div data-tutorial="county-tabs" className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
          {([
            { key: 'unified', label: 'Unified Search', icon: '🔍' },
            { key: 'genealogy', label: 'Genealogy', icon: '🌳' },
            { key: 'deeds', label: 'Deed Records', icon: '📜' },
            { key: 'sources', label: 'Data Sources', icon: '📡' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setHasSearched(false); setResults([]); setError(''); }}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? 'var(--ept-card-bg)' : 'transparent',
                color: activeTab === tab.key ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* Unified Search */}
        {activeTab === 'unified' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Search All Records</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                Enter a name to search across genealogy databases and deed records simultaneously.
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter a name (e.g. John Smith)"
                  value={search.query}
                  onChange={e => updateSearch('query', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
                <input
                  type="text"
                  placeholder="County (optional)"
                  value={search.county}
                  onChange={e => updateSearch('county', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="md:w-48 px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !search.query.trim()}
                  className="px-8 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Results */}
            {error && (
              <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: '#ef444410', borderColor: '#ef4444', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {hasSearched && !loading && results.length === 0 && !error && (
              <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-3xl mb-3">🔍</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No records found. Try a different name or county.</div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
                    {totalResults} record{totalResults !== 1 ? 's' : ''} found
                  </span>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                      {results.filter(r => r.type === 'genealogy').length} genealogy
                    </span>
                    <span className="px-2 py-1 rounded-full" style={{ backgroundColor: isDark ? '#f59e0b20' : '#f59e0b20', color: '#f59e0b' }}>
                      {results.filter(r => r.type === 'deed').length} deeds
                    </span>
                  </div>
                </div>
                {results.map((record, i) => (
                  <RecordCard key={`${record.type}-${i}`} record={record} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Genealogy Search */}
        {activeTab === 'genealogy' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Genealogy Record Search</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                Search birth, death, marriage, burial, and census records from FamilySearch, Find a Grave, Chronicling America, USGenWeb, and county courthouses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Surname *</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={search.surname}
                    onChange={e => updateSearch('surname', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Given Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={search.givenName}
                    onChange={e => updateSearch('givenName', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>County</label>
                  <input
                    type="text"
                    placeholder="e.g. Midland"
                    value={search.county}
                    onChange={e => updateSearch('county', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>State</label>
                  <input
                    type="text"
                    placeholder="e.g. TX"
                    value={search.state}
                    onChange={e => updateSearch('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Record Type</label>
                  <select
                    value={search.recordType}
                    onChange={e => updateSearch('recordType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  >
                    {RECORD_TYPE_FILTERS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={loading || (!search.surname.trim() && !search.givenName.trim())}
                    className="w-full px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    {loading ? 'Searching...' : 'Search Genealogy'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: '#ef444410', borderColor: '#ef4444', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {hasSearched && !loading && results.length === 0 && !error && (
              <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-3xl mb-3">🌳</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No genealogy records found. Try different search criteria.</div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
                  {totalResults} record{totalResults !== 1 ? 's' : ''} found
                </div>
                {results.map((record, i) => (
                  <RecordCard key={`gen-${i}`} record={record} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deed Records Search */}
        {activeTab === 'deeds' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Deed & Instrument Search</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                Search {deedStats?.total_records?.toLocaleString() ?? 'thousands of'} deed records across {deedStats?.counties ?? '14+'} Texas counties.
                {deedStats?.instrument_types ? ` ${deedStats.instrument_types} instrument types indexed.` : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>County</label>
                  <select
                    value={search.county}
                    onChange={e => updateSearch('county', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  >
                    <option value="">All Counties</option>
                    {deedCounties.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Instrument Type</label>
                  <select
                    value={search.instrumentType}
                    onChange={e => updateSearch('instrumentType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  >
                    <option value="">All Types</option>
                    {deedTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Grantor</label>
                  <input
                    type="text"
                    placeholder="Seller / transferor"
                    value={search.grantor}
                    onChange={e => updateSearch('grantor', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Grantee</label>
                  <input
                    type="text"
                    placeholder="Buyer / transferee"
                    value={search.grantee}
                    onChange={e => updateSearch('grantee', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Date From</label>
                  <input
                    type="date"
                    value={search.dateFrom}
                    onChange={e => updateSearch('dateFrom', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-secondary)' }}>Date To</label>
                  <input
                    type="date"
                    value={search.dateTo}
                    onChange={e => updateSearch('dateTo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSearch}
                  disabled={loading || (!search.county && !search.grantor && !search.grantee)}
                  className="px-8 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {loading ? 'Searching...' : 'Search Deeds'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: '#ef444410', borderColor: '#ef4444', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {hasSearched && !loading && results.length === 0 && !error && (
              <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-3xl mb-3">📜</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No deed records found. Try a different county, name, or date range.</div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
                  {totalResults} record{totalResults !== 1 ? 's' : ''} found
                </div>
                {results.map((record, i) => (
                  <RecordCard key={`deed-${i}`} record={record} isDark={isDark} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data Sources */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Genealogy Sources</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                Records are aggregated from these public genealogy databases. All sources are scraped on a regular schedule.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GENEALOGY_SOURCES.map(src => (
                  <div key={src.id} className="p-4 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                    <div className="text-2xl mb-2">{src.icon}</div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{src.name}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{src.desc}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                      <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Deed Record Sources</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                Deed and instrument records come from the encore-cloud-scraper pipeline, which indexes county courthouse records across Texas.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{deedStats?.total_records?.toLocaleString() ?? '—'}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Total Records</div>
                </div>
                <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{(deedStats?.counties ?? deedCounties.length) || '—'}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Counties</div>
                </div>
                <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{(deedStats?.instrument_types ?? deedTypes.length) || '—'}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Instrument Types</div>
                </div>
                <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>2x Daily</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Scrape Schedule</div>
                </div>
              </div>
              {deedCounties.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--ept-text-secondary)' }}>Indexed Counties</div>
                  <div className="flex flex-wrap gap-2">
                    {deedCounties.map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', border: '1px solid var(--ept-border)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Scheduled Scraping', desc: 'Cron jobs scrape 5 genealogy platforms and county courthouse portals at 6AM, 6PM daily, and Mondays at noon.' },
                  { step: '02', title: 'AI Enrichment', desc: 'Workers AI generates summaries, normalizes names, and deduplicates records using content hashing.' },
                  { step: '03', title: 'Unified Search', desc: 'Search both genealogy and deed records through a single API. Results ranked by relevance with source attribution.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <div className="text-3xl font-black" style={{ color: 'var(--ept-accent)', opacity: 0.3 }}>{item.step}</div>
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{item.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center" style={{ borderTop: '1px solid var(--ept-border)' }}>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Need Professional Title Intelligence?
        </h2>
        <p className="text-sm max-w-2xl mx-auto mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
          For automated chain of title construction, gap analysis, and fractional interest calculations across 98 Texas counties, check out our Title Intelligence product.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/title-intelligence" className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Title Intelligence
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center text-xs" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
          <Link href="/legal/terms" className="hover:underline">Terms</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </div>
      </footer>
      <ProductTutorialButton tutorialId="county-records" productName="County Records" />
    </div>
  );
}

// ── Record Card Component ─────────────────────────────────────
function RecordCard({ record, isDark }: { record: UnifiedRecord; isDark: boolean }) {
  if (record.type === 'genealogy') {
    const r = record.data as GenealogyRecord;
    return (
      <div className="p-4 rounded-xl border transition-all hover:scale-[1.005]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
                GENEALOGY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                {r.record_type || 'record'}
              </span>
              {r.source_platform && (
                <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>
                  via {r.source_platform}
                </span>
              )}
            </div>
            <div data-tutorial="county-filters" className="font-semibold" style={{ color: 'var(--ept-text)' }}>
              {r.full_name || [r.given_name, r.surname].filter(Boolean).join(' ') || 'Unknown'}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
              {r.birth_date && <span>Born: {r.birth_date}{r.birth_place ? `, ${r.birth_place}` : ''}</span>}
              {r.death_date && <span>Died: {r.death_date}{r.death_place ? `, ${r.death_place}` : ''}</span>}
              {r.marriage_date && <span>Married: {r.marriage_date}{r.spouse_name ? ` to ${r.spouse_name}` : ''}</span>}
              {r.burial_place && <span>Buried: {r.burial_place}</span>}
              {(r.county || r.state) && <span>{[r.county, r.state].filter(Boolean).join(', ')}</span>}
            </div>
            {r.ai_summary && (
              <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                {r.ai_summary}
              </div>
            )}
          </div>
          {r.source_url && (
            <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              Source
            </a>
          )}
        </div>
      </div>
    );
  }

  const r = record.data as DeedRecord;
  return (
    <div className="p-4 rounded-xl border transition-all hover:scale-[1.005]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
              DEED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
              {r.instrument_type || 'instrument'}
            </span>
            {r.doc_number && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                #{r.doc_number}
              </span>
            )}
          </div>
          <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>
            {r.county || 'Unknown'} County
            {r.book && r.page ? ` — Book ${r.book}, Page ${r.page}` : ''}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
            {r.grantor && <span>Grantor: {r.grantor}</span>}
            {r.grantee && <span>Grantee: {r.grantee}</span>}
            {r.filing_date && <span>Filed: {r.filing_date}</span>}
            {r.recording_date && <span>Recorded: {r.recording_date}</span>}
            {r.consideration && <span>Consideration: {r.consideration}</span>}
          </div>
          {r.legal_description && (
            <div className="mt-2 text-xs leading-relaxed font-mono" style={{ color: 'var(--ept-text-muted)' }}>
              {r.legal_description.length > 200 ? r.legal_description.slice(0, 200) + '...' : r.legal_description}
            </div>
          )}
        </div>
        {r.source_url && (
          <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Source
          </a>
        )}
      </div>
    </div>
  );
}
