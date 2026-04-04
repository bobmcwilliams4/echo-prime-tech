'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service } from '../../lib/ept-api';
import {
  isAuthenticated as hasEngineKey,
  getUsage,
  getProfile as getEngineProfile,
  type UsageResponse,
  type ProfileResponse as EngineProfile,
} from '../../lib/engine-cloud-api';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { getTrialStatus, type TrialInfo } from '../../lib/trial-api';
import { getReferralStats, type ReferralStats } from '../../lib/referral-api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, role, displayName, trustLevel, subscriptions, signOut } = useAuth();
  const { isDark } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [engineUsage, setEngineUsage] = useState<UsageResponse | null>(null);
  const [engineProfile, setEngineProfile] = useState<EngineProfile | null>(null);
  const [commanderMode, setCommanderMode] = useState(false);
  const [trials, setTrials] = useState<TrialInfo[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    getServices().then(d => setServices(d.services)).catch(() => {});
  }, []);

  // Load referral stats
  useEffect(() => {
    if (user) {
      getReferralStats().then(setReferralStats).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (hasEngineKey()) {
      getUsage().then(setEngineUsage).catch(() => {});
      getEngineProfile().then(setEngineProfile).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (role === 'owner') setCommanderMode(true);
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      getTrialStatus(user.email).then(r => { if (r.ok && r.trials) setTrials(r.trials); }).catch(() => {});
    }
  }, [user]);

  const [viewMode, setViewMode] = useState<'owner' | 'user'>('owner');
  const showOwnerContent = commanderMode && viewMode === 'owner';

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const subscribedServices = services.filter(s => subscriptions.includes(s.id));
  const availableServices = services.filter(s => !subscriptions.includes(s.id));

  return (
    <div className="px-6 py-8 max-w-5xl">
      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between" data-tutorial="dashboard-welcome">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Welcome, <span className="gradient-text">{displayName || user.email?.split('@')[0] || 'there'}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Your Echo Prime Technologies control center.</p>
          {trustLevel && (
            <p className="mt-1 text-[11px] font-bold" style={{ color: 'var(--ept-accent)' }}>
              Trust Level {trustLevel.level} — {trustLevel.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {commanderMode && (
            <button
              onClick={() => setViewMode(v => v === 'owner' ? 'user' : 'owner')}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all"
              style={{
                backgroundColor: viewMode === 'owner' ? '#ef444418' : 'var(--ept-surface)',
                borderColor: viewMode === 'owner' ? '#ef444440' : 'var(--ept-border)',
                color: viewMode === 'owner' ? '#ef4444' : 'var(--ept-text-muted)',
              }}
            >
              {viewMode === 'owner' ? 'OWNER VIEW' : 'USER VIEW'}
            </button>
          )}
          {role === 'owner' && (
            <Link href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Admin
            </Link>
          )}
          <button onClick={handleSignOut} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Permian Pulse — owner only ── */}
      {showOwnerContent && (
        <div className="mb-6" data-tutorial="dashboard-permian">
          <Link href="/dashboard/permian-pulse" className="block p-5 rounded-2xl border group transition-all hover:shadow-lg" style={{ backgroundColor: isDark ? '#0c1a0c' : '#f0fff0', borderColor: isDark ? '#2d5e2d' : '#c7f0c7' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>P</div>
                <div>
                  <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                    Permian Pulse
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }}>OWNER</span>
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Competitive intelligence — 24 oilfield chemical companies. Live data.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: '#10b981' }}>
                Open
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── Sentinel AI — always visible ── */}
      <div className="mb-8" data-tutorial="dashboard-sentinel">
        <Link href="/sentinel" className="block p-6 rounded-2xl border group transition-all hover:shadow-lg" style={{ backgroundColor: isDark ? '#0c0c1a' : '#f0f0ff', borderColor: isDark ? '#2d2d5e' : '#c7c7f0', boxShadow: isDark ? '0 0 30px rgba(99,102,241,0.08)' : 'none' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}>
                S
              </div>
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                  Sentinel AI
                  {showOwnerContent && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>COMMANDER</span>}
                </h2>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                  932 engines. 65 domains. Court-defensible doctrine intelligence.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: '#818cf8' }}>
              Open
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </div>
          </div>

          {/* Usage stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-tutorial="dashboard-usage">
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: '#818cf8' }}>{engineProfile?.tier || (hasEngineKey() ? '\u2014' : 'Free')}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Plan</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>
                {showOwnerContent ? '\u221E' : engineUsage ? `${engineUsage.queries}` : '0'}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Queries Used</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: commanderMode ? '#f59e0b' : engineUsage && engineUsage.remaining < 5 ? '#ef4444' : '#10b981' }}>
                {showOwnerContent ? '\u221E' : engineUsage ? `${engineUsage.remaining}` : '3'}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Remaining</div>
            </div>
            <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-text)' }}>3</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Modes</div>
            </div>
          </div>

          {/* Mode badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: 'Standard', desc: 'Doctrine analysis', color: '#10b981' },
              { label: 'Swarm', desc: 'Trinity Council', color: '#6366f1' },
              { label: 'Echo Prime', desc: 'Personality + Memory', color: '#a855f7' },
            ].map(m => (
              <span key={m.label} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
              </span>
            ))}
            {!hasEngineKey() && (
              <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                3 free queries — no credit card
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Active Trials */}
      {trials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Trials</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {trials.map(t => (
              <div key={t.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.days_remaining <= 3 ? '#ef444460' : 'var(--ept-card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{t.product_name}</h3>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{t.tier} tier — free trial</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                    backgroundColor: t.expired ? '#ef444418' : t.days_remaining <= 3 ? '#f59e0b18' : '#10b98118',
                    color: t.expired ? '#ef4444' : t.days_remaining <= 3 ? '#f59e0b' : '#10b981',
                    border: `1px solid ${t.expired ? '#ef444440' : t.days_remaining <= 3 ? '#f59e0b40' : '#10b98140'}`,
                  }}>
                    {t.expired ? 'Expired' : `${t.days_remaining} days left`}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.max(5, ((14 - t.days_remaining) / 14) * 100)}%`,
                    backgroundColor: t.expired ? '#ef4444' : t.days_remaining <= 3 ? '#f59e0b' : 'var(--ept-accent)',
                  }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={t.product_url} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Open Product
                  </Link>
                  <a href={t.api_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                    API
                  </a>
                  <Link href={`/checkout?service=${t.service_id}&tier=${t.tier}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: t.days_remaining <= 3 ? '#f59e0b' : 'var(--ept-surface)', color: t.days_remaining <= 3 ? '#fff' : 'var(--ept-text-secondary)' }}>
                    {t.expired ? 'Reactivate' : 'Upgrade'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Referral Section ── */}
      {referralStats && (
        <div className="mb-8 p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                Refer & Earn
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {referralStats.total_referrals} referral{referralStats.total_referrals !== 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>Share your link and earn rewards when friends sign up.</p>
            </div>
          </div>

          {/* Referral link + copy + share */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border font-mono text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>
              <span className="truncate flex-1">{referralStats.referral_link}</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(referralStats.referral_link); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
              style={{ backgroundColor: copied ? '#10b981' : 'var(--ept-accent)', color: '#fff' }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Echo Prime Technologies \u2014 AI-powered enterprise tools!')}&url=${encodeURIComponent(referralStats.referral_link)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Post on X
            </a>
            <a href={`mailto:?subject=${encodeURIComponent('Check out Echo Prime Technologies')}&body=${encodeURIComponent(`I've been using Echo Prime Technologies and thought you'd love it:\n\n${referralStats.referral_link}`)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Check out Echo Prime Technologies: ${referralStats.referral_link}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.334-1.546l-.382-.23-2.645.887.887-2.645-.23-.382A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="px-3 py-2 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--ept-accent)' }}>{referralStats.total_referrals}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Total</div>
            </div>
            <div className="px-3 py-2 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: '#10b981' }}>{referralStats.converted_referrals}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Converted</div>
            </div>
            <div className="px-3 py-2 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="text-lg font-extrabold font-mono" style={{ color: '#818cf8' }}>{referralStats.this_week}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>This Week</div>
            </div>
          </div>

          {/* Next tier progress */}
          {referralStats.next_tier && (
            <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>
                  Next reward: <span style={{ color: 'var(--ept-accent)' }}>{referralStats.next_tier.reward_value}</span>
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>
                  {referralStats.total_referrals}/{referralStats.next_tier.count}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (referralStats.total_referrals / referralStats.next_tier.count) * 100)}%`, backgroundColor: 'var(--ept-accent)' }} />
              </div>
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--ept-text-muted)' }}>
                {referralStats.next_tier.remaining} more referral{referralStats.next_tier.remaining !== 1 ? 's' : ''} to unlock
              </p>
            </div>
          )}

          {/* Earned rewards */}
          {referralStats.rewards.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Earned Rewards</h3>
              <div className="flex flex-wrap gap-2">
                {referralStats.rewards.map((r, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    {r.reward_value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reward tiers */}
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Reward Tiers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { count: 3, reward: 'Priority Support' },
                { count: 5, reward: '$25 Credit' },
                { count: 10, reward: '1 Month Free' },
                { count: 25, reward: '$100 Credit' },
                { count: 50, reward: '3 Months Free' },
                { count: 100, reward: '20% Lifetime' },
              ].map(tier => {
                const unlocked = referralStats.total_referrals >= tier.count;
                return (
                  <div key={tier.count} className="px-3 py-2 rounded-lg text-center" style={{ backgroundColor: unlocked ? 'rgba(16,185,129,0.08)' : 'var(--ept-surface)', border: `1px solid ${unlocked ? 'rgba(16,185,129,0.3)' : 'var(--ept-border)'}`, opacity: unlocked ? 1 : 0.6 }}>
                    <div className="text-xs font-bold" style={{ color: unlocked ? '#10b981' : 'var(--ept-text-secondary)' }}>{tier.count} referrals</div>
                    <div className="text-[10px]" style={{ color: unlocked ? '#10b981' : 'var(--ept-text-muted)' }}>{tier.reward}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subscribed Services */}
      <div data-tutorial="dashboard-services">
        {subscribedServices.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedServices.map((svc, i) => (
                <Link key={i} href={svc.url || '#'} className="card-hover p-6 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{svc.icon}</div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>Active</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{svc.name}</h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>{svc.tagline}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2" style={{ color: 'var(--ept-accent)' }}>
                    Open
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10 p-10 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-4xl mb-4">&#x1F680;</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>No active services yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Choose the services you want to activate to get started.</p>
            <Link href="/services" className="inline-flex px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse Services</Link>
          </div>
        )}
      </div>

      {/* Available to add */}
      {availableServices.length > 0 && (
        <div data-tutorial="dashboard-available">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Available Services</h2>
            <Link href="/services" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Manage All</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableServices.map((svc, i) => (
              <div key={i} className="p-4 rounded-xl border opacity-60 hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: 'var(--ept-accent)' }}>{svc.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{svc.name}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>From ${svc.pricing?.[0]?.price || '\u2014'}/mo</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tutorial Button */}
      <ProductTutorialButton tutorialId="dashboard" productName="Dashboard" />
    </div>
  );
}
