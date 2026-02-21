'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import {
  getCatalog,
  getPricing,
  createCheckout,
  registerUser,
  isAuthenticated,
  type CatalogResponse,
  type PricingTier,
  type EngineCategory,
} from '../../lib/engine-cloud-api';

// ── Tier classification ──

const TIER_GROUPS: { label: string; color: string; glow: string; domains: string[] }[] = [
  {
    label: 'Supreme',
    color: '#f59e0b',
    glow: '#f59e0b33',
    domains: ['TAX', 'LEGAL', 'FINANCE', 'CYBERSECURITY', 'MEDICAL', 'FORENSIC', 'NUCLEAR'],
  },
  {
    label: 'Critical',
    color: '#ef4444',
    glow: '#ef444433',
    domains: ['DRILLING', 'OILFIELD', 'FRACTURING', 'PRODUCTION', 'ENERGY', 'AVIATION', 'CHEMICAL'],
  },
  {
    label: 'Engineering',
    color: '#6366f1',
    glow: '#6366f133',
    domains: ['MECHANICAL', 'AUTOMOTIVE', 'RAILROAD', 'HVAC', 'WELDING', 'ELECTRICAL', 'MINING', 'MARINE'],
  },
  {
    label: 'Standard',
    color: '#10b981',
    glow: '#10b98133',
    domains: [], // everything else
  },
];

function getTierGroup(category: string): typeof TIER_GROUPS[number] {
  const upper = category.toUpperCase();
  for (const group of TIER_GROUPS) {
    if (group.domains.some(d => upper.includes(d))) return group;
  }
  return TIER_GROUPS[3];
}

// ── Domain pricing (static fallback — live API preferred) ──

const DOMAIN_PRICING: Record<string, number> = {
  TAX_LAW: 0.15, OIL_GAS_TAX: 0.20, LEGAL_CONTRACTS: 0.12, LEGAL_LITIGATION: 0.15,
  CYBERSECURITY: 0.18, DRILLING: 0.15, OILFIELD_EQUIPMENT: 0.12, FINANCIAL_COMPLIANCE: 0.15,
  MEDICAL_TOXICOLOGY: 0.25, FORENSIC_ANALYSIS: 0.20, NUCLEAR_ENERGY: 0.20,
  GENERAL: 0.05,
};

export default function EnginesPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [search, setSearch] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Supreme');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      getCatalog().then(setCatalog),
      getPricing().then(p => setPricing(p.tiers)),
    ]).finally(() => setLoading(false));
  }, []);

  const totalEngines = catalog?.total_engines || 932;
  const totalDoctrines = catalog?.total_doctrines || 35331;
  const categories = catalog?.categories || [];
  const totalCategories = categories.length || 65;

  // Group categories by tier
  const grouped = useMemo(() => {
    const filtered = search
      ? categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      )
      : categories;

    const groups: Record<string, EngineCategory[]> = { Supreme: [], Critical: [], Engineering: [], Standard: [] };
    for (const cat of filtered) {
      const tier = getTierGroup(cat.name);
      groups[tier.label].push(cat);
    }
    return groups;
  }, [categories, search]);

  const handleRegister = async () => {
    if (!user?.email) return;
    setRegistering(true);
    try {
      await registerUser(user.email, user.displayName || undefined);
      window.location.href = '/sentinel';
    } catch {
      alert('Registration failed. You may already have an account — try Sentinel directly.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCheckout = async (tier: string) => {
    setUpgrading(tier);
    try {
      const { checkout_url } = await createCheckout(
        tier.toLowerCase() as 'professional' | 'business' | 'enterprise',
        `${window.location.origin}/sentinel?upgraded=true`,
        window.location.href,
      );
      window.location.href = checkout_url;
    } catch {
      alert('Checkout failed. Please try again.');
      setUpgrading(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/sentinel" className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90" style={{ backgroundColor: '#6366f1', color: '#fff' }}>
            Open Sentinel
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)' : 'linear-gradient(180deg, #f0f4ff 0%, #fff 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ backgroundColor: '#6366f120', color: '#818cf8', border: '1px solid #6366f140' }}>
            Engine Intelligence Catalog
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {totalEngines.toLocaleString()}
            </span>{' '}
            Engines
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            {totalCategories} domains. {totalDoctrines.toLocaleString()} pre-compiled doctrine blocks. Court-defensible. Zero hallucination. Every response grounded in expert knowledge with deterministic audit trails.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { label: 'Engines', value: totalEngines.toLocaleString(), icon: '⚡' },
              { label: 'Domains', value: String(totalCategories), icon: '🏛️' },
              { label: 'Doctrines', value: totalDoctrines.toLocaleString(), icon: '📋' },
              { label: 'Encryption', value: 'AES-256', icon: '🔒' },
            ].map(s => (
              <div key={s.label} className="px-5 py-3 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                <div className="text-2xl font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>{s.icon} {s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ept-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search engines by domain, category, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--ept-surface)',
              border: '1px solid var(--ept-border)',
              color: 'var(--ept-text)',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Grid by Tier */}
        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--ept-text-muted)' }}>
            <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
            <p>Loading engine catalog...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {TIER_GROUPS.map(tier => {
              const cats = grouped[tier.label] || [];
              if (cats.length === 0) return null;
              const isExpanded = expandedGroup === tier.label;
              const totalInTier = cats.reduce((sum, c) => sum + c.engines, 0);

              return (
                <div key={tier.label} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tier.color}30`, backgroundColor: 'var(--ept-card-bg)' }}>
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : tier.label)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
                    style={{ backgroundColor: `${tier.color}08` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color, boxShadow: `0 0 8px ${tier.glow}` }} />
                      <span className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{tier.label} Tier</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
                        {cats.length} categories / {totalInTier} engines
                      </span>
                    </div>
                    <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ color: 'var(--ept-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                      {cats.map(cat => {
                        const domainKey = cat.name.replace(/\s+/g, '_').toUpperCase();
                        const perQuery = DOMAIN_PRICING[domainKey] || 0.05;
                        return (
                          <div key={cat.name} className="p-5 rounded-xl transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{cat.name}</h3>
                              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${tier.color}15`, color: tier.color }}>
                                {cat.engines} engines
                              </span>
                            </div>
                            {cat.description && (
                              <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--ept-text-muted)' }}>{cat.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                                ${perQuery.toFixed(2)}/query
                              </span>
                              {cat.knowledge_depth !== undefined && (
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-1.5 h-3 rounded-sm" style={{
                                      backgroundColor: i <= (cat.knowledge_depth || 3) ? tier.color : 'var(--ept-border)',
                                    }} />
                                  ))}
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
        )}

        {/* Pricing Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#818cf8' }}>Pricing</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
              Zero hallucination starts free
            </h2>
            <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Court-defensible AI that replaces $300-500/hour professionals. Every tier includes encrypted reports, deterministic audit trails, and full doctrine citations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricing.length > 0 ? pricing.map(tier => {
              const tierKey = tier.name.toLowerCase();
              const isFree = tier.price === 0;
              return (
                <div key={tier.name} className="relative p-6 rounded-2xl transition-all" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  border: tier.popular ? '2px solid #6366f1' : '1px solid var(--ept-border)',
                  boxShadow: tier.popular ? '0 0 30px #6366f122' : 'none',
                }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#6366f1', color: '#fff' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-base font-bold mt-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>
                      {isFree ? 'Free' : `$${tier.price}`}
                    </span>
                    {!isFree && <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>}
                  </div>
                  <div className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>
                    {tier.queries.toLocaleString()} queries/month
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isFree ? (
                    isAuthenticated() ? (
                      <Link href="/sentinel" className="block text-center py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                        Open Sentinel
                      </Link>
                    ) : user?.email ? (
                      <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{ backgroundColor: '#6366f120', color: '#818cf8', border: '1px solid #6366f140' }}
                      >
                        {registering ? 'Registering...' : 'Activate Free'}
                      </button>
                    ) : (
                      <Link href="/signup" className="block text-center py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#6366f120', color: '#818cf8', border: '1px solid #6366f140' }}>
                        Get Started
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={() => handleCheckout(tierKey)}
                      disabled={upgrading !== null}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: tier.popular ? '#6366f1' : 'transparent',
                        color: tier.popular ? '#fff' : '#818cf8',
                        border: tier.popular ? 'none' : '1px solid #6366f1',
                        cursor: upgrading ? 'wait' : 'pointer',
                      }}
                    >
                      {upgrading === tierKey ? 'Redirecting...' : `Subscribe`}
                    </button>
                  )}
                </div>
              );
            }) : (
              /* Static fallback pricing */
              [
                { name: 'Free', price: 0, queries: 3, features: ['3 queries/month', 'Standard domains', 'Summary responses'], popular: false },
                { name: 'Professional', price: 499, queries: 500, features: ['500 queries/month', 'All 65 domains', 'Encrypted reports', 'API access'], popular: true },
                { name: 'Business', price: 1499, queries: 2000, features: ['2,000 queries/month', 'Priority routing', 'Bulk reports', 'Dedicated support'], popular: false },
                { name: 'Enterprise', price: 4999, queries: 10000, features: ['10,000 queries/month', 'Custom domains', 'SLA guarantee', 'On-prem option'], popular: false },
              ].map(tier => (
                <div key={tier.name} className="p-6 rounded-2xl" style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  border: tier.popular ? '2px solid #6366f1' : '1px solid var(--ept-border)',
                }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#6366f1', color: '#fff' }}>Popular</div>
                  )}
                  <h3 className="text-base font-bold" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>
                      {tier.price === 0 ? 'Free' : `$${tier.price}`}
                    </span>
                    {tier.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>}
                  </div>
                  <div className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>{tier.queries.toLocaleString()} queries/month</div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                        <span style={{ color: '#10b981' }}>&#10003;</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block text-center py-2.5 rounded-lg text-sm font-semibold" style={{
                    backgroundColor: tier.popular ? '#6366f1' : 'transparent',
                    color: tier.popular ? '#fff' : '#818cf8',
                    border: tier.popular ? 'none' : '1px solid #6366f1',
                  }}>
                    {tier.price === 0 ? 'Get Started' : 'Subscribe'}
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-10 text-center p-8 rounded-2xl mx-auto max-w-3xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Sovereign Plan</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
              Unlimited queries. Custom engine development. White-label deployment. On-premise installation. Dedicated account manager.
            </p>
            <a href="mailto:bob@echo-op.com" className="inline-block px-8 py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#f59e0b', color: '#0a0a0f' }}>
              Contact Sales
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            Echo Prime Technologies — {totalEngines.toLocaleString()} engines. {totalDoctrines.toLocaleString()} doctrines. AES-256-GCM encrypted. Deterministic audit trails. Court-defensible AI.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/sentinel" className="text-xs underline" style={{ color: '#818cf8' }}>Sentinel</Link>
            <Link href="/pricing" className="text-xs underline" style={{ color: '#818cf8' }}>Pricing</Link>
            <a href="mailto:bob@echo-op.com" className="text-xs underline" style={{ color: '#818cf8' }}>Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
