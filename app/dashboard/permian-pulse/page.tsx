'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../lib/auth-context';
import { useTheme } from '../../../lib/theme-context';

const API = 'https://permian-pulse-scraper.bmcii1976.workers.dev';

/* ─── types (matched to actual /report-data API response) ─── */
interface Competitor {
  id: number; name: string; website_url: string | null; priority: string;
  status: string; last_scraped: string | null; scrape_count: number; notes: string;
}
interface PageSummary { competitor_id: number; competitor_name: string; pages: number; page_types: string; intel_count: number; }
interface TechItem { technology: string; category: string; }
interface EndpointItem { url: string; severity: string; }
interface ContactItem { type: string; value: string; }
interface RevengReport { type: string; summary: string; full_report: string; generated_at: string; }
interface ReportData {
  generated_at: string;
  totals: { competitors: number; pages_scraped: number; intel_extracted: number; tech_signals: number; exposed_endpoints: number; reveng_reports: number; contacts: number; products: number; };
  competitors: Competitor[];
  pages_by_competitor: PageSummary[];
  chemical_product_matrix: Record<string, string[]>;
  service_area_map: Record<string, string[]>;
  certification_map: Record<string, string[]>;
  tech_by_competitor: Record<string, TechItem[]>;
  endpoints_by_competitor: Record<string, EndpointItem[]>;
  contacts_by_competitor: Record<string, ContactItem[]>;
  products_by_competitor: Record<string, string[]>;
  reveng_by_competitor: Record<string, RevengReport[]>;
}

type TabId = 'overview' | 'chemicals' | 'services' | 'tech' | 'contacts' | 'reveng' | 'endpoints';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'chemicals', label: 'Chemical Products' },
  { id: 'services', label: 'Service Areas' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'reveng', label: 'Reverse Engineering' },
  { id: 'endpoints', label: 'Exposed Endpoints' },
];

const priorityColor = (p: string) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#6b7280';
const statusColor = (s: string) => s === 'scraped' || s === 'analyzed' ? '#10b981' : s === 'pending' ? '#f59e0b' : '#6b7280';

function Badge({ text, color }: { text: string; color: string }) {
  return <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}35` }}>{text}</span>;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      <div className="text-2xl font-extrabold font-mono" style={{ color: accent || 'var(--ept-text)' }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--ept-text-muted)' }}>{label}</div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ data }: { data: ReportData }) {
  const { totals, competitors, pages_by_competitor } = data;
  const scraped = competitors.filter(c => c.status === 'scraped' || c.status === 'analyzed');
  const pending = competitors.filter(c => c.status === 'pending');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard label="Competitors" value={totals.competitors} accent="#6366f1" />
        <StatCard label="Pages Scraped" value={totals.pages_scraped} accent="#10b981" />
        <StatCard label="Intel Extracted" value={totals.intel_extracted} accent="#f59e0b" />
        <StatCard label="Tech Signals" value={totals.tech_signals} accent="#8b5cf6" />
        <StatCard label="Endpoints Found" value={totals.exposed_endpoints} accent="#ef4444" />
        <StatCard label="Contacts" value={totals.contacts} accent="#06b6d4" />
        <StatCard label="Reveng Reports" value={totals.reveng_reports} accent="#ec4899" />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Competitor Matrix</h3>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Competitor</th>
                <th className="text-center px-3 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Priority</th>
                <th className="text-center px-3 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Status</th>
                <th className="text-right px-3 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Pages</th>
                <th className="text-right px-3 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Intel</th>
                <th className="text-left px-3 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Last Scraped</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => {
                const pg = pages_by_competitor.find(p => p.competitor_id === c.id);
                return (
                  <tr key={c.id} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: 'var(--ept-text)' }}>{c.name}</span>
                        {c.website_url && (
                          <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'var(--ept-accent)' }}>
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" /><path d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" /></svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="text-center px-3 py-3"><Badge text={c.priority} color={priorityColor(c.priority)} /></td>
                    <td className="text-center px-3 py-3"><Badge text={c.status} color={statusColor(c.status)} /></td>
                    <td className="text-right px-3 py-3 font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>{pg?.pages || 0}</td>
                    <td className="text-right px-3 py-3 font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>{pg?.intel_count?.toLocaleString() || 0}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.last_scraped ? new Date(c.last_scraped).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color: 'var(--ept-text-muted)' }}>{c.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
          <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Not Yet Scraped ({pending.length})</h4>
          <div className="flex flex-wrap gap-2">
            {pending.map(c => (
              <span key={c.id} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-muted)', border: '1px solid var(--ept-border)' }}>{c.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Chemical Products Tab ─── */
function ChemicalsTab({ data }: { data: ReportData }) {
  const { chemical_product_matrix } = data;
  const names = Object.keys(chemical_product_matrix).sort();
  const [search, setSearch] = useState('');
  const filtered = search ? names.filter(n => {
    const items = chemical_product_matrix[n];
    return n.toLowerCase().includes(search.toLowerCase()) || items.some(v => v.toLowerCase().includes(search.toLowerCase()));
  }) : names;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text" placeholder="Search chemicals, products, competitors..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{filtered.length} competitors</span>
      </div>
      {filtered.length === 0 && <p className="text-sm py-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No chemical product data found.</p>}
      {filtered.map(name => {
        const items = chemical_product_matrix[name];
        return (
          <div key={name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h4 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{name} <span className="text-xs font-normal ml-2" style={{ color: 'var(--ept-text-muted)' }}>({items.length} items)</span></h4>
            <div className="flex flex-wrap gap-1.5 max-h-[400px] overflow-y-auto">
              {items.map((item, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md capitalize" style={{ backgroundColor: '#6366f115', color: '#6366f1', border: '1px solid #6366f130' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Service Areas Tab ─── */
function ServiceAreasTab({ data }: { data: ReportData }) {
  const { service_area_map, certification_map } = data;
  const saNames = Object.keys(service_area_map).sort();
  const certNames = Object.keys(certification_map).sort();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Service Areas by Competitor</h3>
        {saNames.length === 0 && <p className="text-sm py-4" style={{ color: 'var(--ept-text-muted)' }}>No service area data extracted yet.</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {saNames.map(name => (
            <div key={name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{name}</h4>
              <div className="flex flex-wrap gap-1.5">
                {service_area_map[name].map((item, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md capitalize" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)', border: '1px solid var(--ept-border)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Certifications by Competitor</h3>
        {certNames.length === 0 && <p className="text-sm py-4" style={{ color: 'var(--ept-text-muted)' }}>No certification data extracted yet.</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {certNames.map(name => (
            <div key={name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{name}</h4>
              <div className="flex flex-wrap gap-1.5">
                {certification_map[name].map((item, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md capitalize" style={{ backgroundColor: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Tech Stack Tab ─── */
function TechStackTab({ data }: { data: ReportData }) {
  const { tech_by_competitor } = data;
  const names = Object.keys(tech_by_competitor).sort();
  const [selectedComp, setSelectedComp] = useState<string | 'all'>('all');

  const techCategories = useMemo(() => {
    const cats: Record<string, Record<string, string[]>> = {};
    const entries = selectedComp === 'all' ? names : [selectedComp];
    for (const name of entries) {
      const items = tech_by_competitor[name] || [];
      for (const item of items) {
        if (!cats[item.category]) cats[item.category] = {};
        if (!cats[item.category][item.technology]) cats[item.category][item.technology] = [];
        if (!cats[item.category][item.technology].includes(name)) cats[item.category][item.technology].push(name);
      }
    }
    return cats;
  }, [selectedComp, names, tech_by_competitor]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={selectedComp} onChange={e => setSelectedComp(e.target.value)}
          className="px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        >
          <option value="all">All Competitors</option>
          {names.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {Object.keys(techCategories).sort().map(cat => (
        <div key={cat} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h4 className="font-bold mb-3 uppercase text-xs tracking-wider" style={{ color: 'var(--ept-accent)' }}>{cat}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(techCategories[cat]).sort((a, b) => b[1].length - a[1].length).map(([tech, companies]) => (
              <div key={tech} className="p-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)' }}>
                <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{tech}</div>
                <div style={{ color: 'var(--ept-text-muted)' }}>{companies.length} competitor{companies.length !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Contacts Tab ─── */
function ContactsTab({ data }: { data: ReportData }) {
  const { contacts_by_competitor } = data;
  const names = Object.keys(contacts_by_competitor).sort();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return names;
    const q = search.toLowerCase();
    return names.filter(n => {
      if (n.toLowerCase().includes(q)) return true;
      return contacts_by_competitor[n].some(c => c.type?.toLowerCase().includes(q) || c.value?.toLowerCase().includes(q));
    });
  }, [search, names, contacts_by_competitor]);

  const typeColor = (t: string) => {
    if (t === 'email') return 'var(--ept-accent)';
    if (t === 'phone') return '#10b981';
    if (t === 'address') return '#8b5cf6';
    return 'var(--ept-text-secondary)';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text" placeholder="Search contacts, emails, phones..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{data.totals.contacts.toLocaleString()} total</span>
      </div>
      {filtered.map(name => {
        const contacts = contacts_by_competitor[name];
        return (
          <div key={name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h4 className="font-bold mb-3" style={{ color: 'var(--ept-text)' }}>{name} <span className="text-xs font-normal ml-2" style={{ color: 'var(--ept-text-muted)' }}>({contacts.length})</span></h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <th className="text-left px-3 py-2" style={{ color: 'var(--ept-text-secondary)' }}>Type</th>
                    <th className="text-left px-3 py-2" style={{ color: 'var(--ept-text-secondary)' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 30).map((c, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                      <td className="px-3 py-2"><Badge text={c.type} color={typeColor(c.type)} /></td>
                      <td className="px-3 py-2 font-mono" style={{ color: typeColor(c.type) }}>
                        {c.type === 'email' ? <a href={`mailto:${c.value}`} style={{ color: 'var(--ept-accent)' }}>{c.value}</a> : c.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contacts.length > 30 && (
                <p className="text-xs mt-2 px-3" style={{ color: 'var(--ept-text-muted)' }}>+ {contacts.length - 30} more contacts</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Reverse Engineering Tab ─── */
function RevengTab({ data }: { data: ReportData }) {
  const { reveng_by_competitor } = data;
  const names = Object.keys(reveng_by_competitor).sort();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFull, setShowFull] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{data.totals.reveng_reports} reverse engineering reports across {names.length} competitors</p>
      {names.map(name => {
        const reports = reveng_by_competitor[name];
        const isOpen = expanded === name;
        return (
          <div key={name} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
            <button
              onClick={() => setExpanded(isOpen ? null : name)}
              className="w-full px-4 py-3 flex items-center justify-between text-left"
              style={{ backgroundColor: 'var(--ept-card-bg)' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold" style={{ color: 'var(--ept-text)' }}>{name}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--ept-text-muted)' }}>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t divide-y" style={{ borderColor: 'var(--ept-border)' }}>
                {reports.map((r, i) => {
                  const fullKey = `${name}-${i}`;
                  return (
                    <div key={i} className="p-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge text={r.type} color="#8b5cf6" />
                        <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{new Date(r.generated_at).toLocaleString()}</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>Summary</div>
                          <div className="whitespace-pre-wrap text-xs leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{r.summary}</div>
                        </div>
                        {r.full_report && (
                          <div>
                            <button
                              onClick={() => setShowFull(showFull === fullKey ? null : fullKey)}
                              className="text-xs font-semibold flex items-center gap-1"
                              style={{ color: 'var(--ept-accent)' }}
                            >
                              {showFull === fullKey ? 'Hide' : 'Show'} Full Report
                              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform ${showFull === fullKey ? 'rotate-180' : ''}`}>
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {showFull === fullKey && (
                              <div className="mt-2 p-3 rounded-lg whitespace-pre-wrap text-xs leading-relaxed max-h-[500px] overflow-y-auto" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)', border: '1px solid var(--ept-border)' }}>
                                {r.full_report}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Endpoints Tab ─── */
function EndpointsTab({ data }: { data: ReportData }) {
  const { endpoints_by_competitor } = data;
  const names = Object.keys(endpoints_by_competitor).sort();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return names;
    const q = search.toLowerCase();
    return names.filter(n => n.toLowerCase().includes(q) || endpoints_by_competitor[n].some(e => e.url.toLowerCase().includes(q) || e.severity.toLowerCase().includes(q)));
  }, [search, names, endpoints_by_competitor]);

  const sevColor = (s: string) => {
    const l = s.toLowerCase();
    if (l === 'critical' || l === 'high') return '#ef4444';
    if (l === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text" placeholder="Search endpoints, URLs, severity..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{data.totals.exposed_endpoints} total</span>
      </div>

      {filtered.map(name => {
        const eps = endpoints_by_competitor[name];
        const bySev: Record<string, EndpointItem[]> = {};
        for (const ep of eps) { (bySev[ep.severity || 'info'] ||= []).push(ep); }
        return (
          <div key={name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h4 className="font-bold mb-3" style={{ color: 'var(--ept-text)' }}>{name} <span className="text-xs font-normal ml-2" style={{ color: 'var(--ept-text-muted)' }}>({eps.length} endpoints)</span></h4>
            <div className="space-y-3">
              {Object.entries(bySev).sort((a, b) => b[1].length - a[1].length).map(([sev, items]) => (
                <div key={sev}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: sevColor(sev) }}>{sev} ({items.length})</div>
                  <div className="grid gap-1.5 max-h-[200px] overflow-y-auto">
                    {items.slice(0, 15).map((ep, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <Badge text={ep.severity?.toUpperCase() || 'INFO'} color={sevColor(ep.severity)} />
                        <span className="font-mono truncate" style={{ color: 'var(--ept-text-secondary)' }}>{ep.url}</span>
                      </div>
                    ))}
                    {items.length > 15 && <p className="text-xs px-2" style={{ color: 'var(--ept-text-muted)' }}>+ {items.length - 15} more</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─── */
export default function PermianPulsePage() {
  const router = useRouter();
  const { user, loading, role } = useAuth();
  const { isDark } = useTheme();
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Auth guard — owner only
  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && role !== 'owner') router.push('/dashboard');
  }, [user, loading, role, router]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API}/report-data`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { if (user && role === 'owner') fetchData(); }, [user, role]);

  if (loading || !user || role !== 'owner') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[140px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/dashboard" style={{ color: 'var(--ept-accent)' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--ept-text)' }}>Permian Pulse</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData} disabled={refreshing}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: refreshing ? 0.6 : 1 }}
          >
            {refreshing ? (
              <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.364.363a7 7 0 0011.712-3.138.75.75 0 00-1.112-.231zm-1.624-7.848a7 7 0 00-11.712 3.138.75.75 0 001.112.232 5.5 5.5 0 019.201-2.467l.312.311H10.17a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V1.907a.75.75 0 00-1.5 0v2.033l-.364-.364z" clipRule="evenodd" /></svg>
            )}
            Refresh
          </button>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }}>OWNER ONLY</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Permian Pulse <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Competitive intelligence on Permian Basin oilfield chemical companies.
            {data && <> Last updated: {new Date(data.generated_at).toLocaleString()}</>}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: '#ef444410', borderColor: '#ef444440', color: '#ef4444' }}>
            <span className="font-semibold">Error:</span> {error}
            <button onClick={fetchData} className="ml-3 underline text-sm">Retry</button>
          </div>
        )}

        {!data && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        )}

        {data && (
          <>
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 mb-6 pb-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--ept-accent)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'var(--ept-text-secondary)',
                    border: activeTab === tab.id ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'chemicals' && <ChemicalsTab data={data} />}
            {activeTab === 'services' && <ServiceAreasTab data={data} />}
            {activeTab === 'tech' && <TechStackTab data={data} />}
            {activeTab === 'contacts' && <ContactsTab data={data} />}
            {activeTab === 'reveng' && <RevengTab data={data} />}
            {activeTab === 'endpoints' && <EndpointsTab data={data} />}
          </>
        )}
      </div>
    </div>
  );
}
