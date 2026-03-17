'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { getTokenomics, getRules, getLeaderboard, getBurnStats } from '../../lib/coin-rewards-api';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

type Tab = 'overview' | 'earn' | 'leaderboard' | 'burns' | 'staking';

export default function RewardsPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<Tab>('overview');
  const [tokenomics, setTokenomics] = useState<any>(null);
  const [rules, setRules] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [burns, setBurns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTokenomics().catch(() => null),
      getRules().catch(() => null),
      getLeaderboard(10).catch(() => null),
      getBurnStats().catch(() => null),
    ]).then(([t, r, l, b]) => {
      setTokenomics(t);
      setRules(r);
      setLeaderboard(l);
      setBurns(b);
      setLoading(false);
    });
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'earn', label: 'How to Earn' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'burns', label: 'Burn Tracker' },
    { id: 'staking', label: 'Staking' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Earning</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>$ECHO Rewards Program</div>
          <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
            Earn <span className="gradient-text">$ECHO</span> for Everything You Do
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Use our services, refer friends, and earn Beta Points that convert 1:1 to $ECHO tokens on Base.
            Early adopters earn the most — earning rates halve every 180 days.
          </p>

          {/* Quick Stats */}
          {tokenomics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 animate-fade-up-delay-1">
              {[
                { label: 'Total Users', value: tokenomics.live_metrics?.total_users?.toLocaleString() || '0' },
                { label: 'Points Burned', value: tokenomics.live_metrics?.burned_points?.toLocaleString() || '0' },
                { label: 'Chain', value: 'Base L2' },
                { label: 'Halving', value: `${((tokenomics.value_growth?.halving_multiplier || 1) * 100).toFixed(0)}%` },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: tab === t.id ? '#fff' : 'var(--ept-text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {tab === 'overview' && tokenomics && (
              <div className="space-y-8 animate-fade-up">
                {/* Value Flywheel */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>How $ECHO Gains Value</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Deflationary Burns', desc: tokenomics.value_growth?.deflationary_burn, icon: '🔥' },
                      { title: 'Revenue Buyback', desc: tokenomics.value_growth?.revenue_buyback, icon: '💰' },
                      { title: 'Staking Lock-Up', desc: tokenomics.value_growth?.staking_lock, icon: '🔒' },
                      { title: 'Halving Schedule', desc: tokenomics.value_growth?.halving, icon: '📉' },
                      { title: 'Service Discount', desc: tokenomics.value_growth?.utility_demand, icon: '🏷️' },
                      { title: 'Growing Demand', desc: 'More services + more users = more $ECHO demand', icon: '📈' },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{item.title}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token Distribution */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Token Distribution</h2>
                  <div className="space-y-3">
                    {tokenomics.distribution && Object.entries(tokenomics.distribution).map(([key, val]) => {
                      const pct = parseInt((val as string).split('%')[0]) || 0;
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: 'var(--ept-text)' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                            <span style={{ color: 'var(--ept-text-muted)' }}>{val as string}</span>
                          </div>
                          <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--ept-surface)' }}>
                            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--ept-accent)' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Roadmap */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Roadmap</h2>
                  <div className="space-y-4">
                    {tokenomics.phases?.map((phase: any) => (
                      <div key={phase.phase} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{
                          backgroundColor: phase.status === 'ACTIVE' ? 'var(--ept-accent)' : 'var(--ept-surface)',
                          color: phase.status === 'ACTIVE' ? '#fff' : 'var(--ept-text-muted)',
                        }}>{phase.phase}</div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                            {phase.name}
                            {phase.status === 'ACTIVE' && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>LIVE</span>}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{phase.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token Info */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Token Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {[
                      ['Symbol', tokenomics.token?.symbol],
                      ['Chain', tokenomics.token?.chain],
                      ['Total Supply', tokenomics.token?.total_supply],
                      ['Contract', tokenomics.token?.contract ? `${tokenomics.token.contract.slice(0, 10)}...${tokenomics.token.contract.slice(-6)}` : '—'],
                      ['Conversion', tokenomics.beta_program?.conversion_rate],
                      ['Status', tokenomics.beta_program?.status],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ color: 'var(--ept-text-muted)' }}>{label}</div>
                        <div className="font-semibold" style={{ color: 'var(--ept-text)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Earn Tab */}
            {tab === 'earn' && rules && (
              <div className="animate-fade-up">
                <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    Halving Multiplier: <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{rules.halving_multiplier}x</span> — Early adopters earn more. Rates halve every 180 days.
                  </div>
                </div>

                <div className="grid gap-3">
                  {rules.earning_rules?.map((rule: any) => (
                    <div key={rule.action} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                      <div className="flex-1">
                        <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{rule.description}</div>
                        <div className="flex gap-3 mt-1 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                          <span>Cooldown: {rule.cooldown}</span>
                          <span>Daily max: {rule.daily_limit}</span>
                          {rule.tier_required !== 'bronze' && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>Requires {rule.tier_required}</span>}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>+{rule.effective_points}</div>
                        <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>points</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tier Multipliers */}
                <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Tier Multipliers — Earn More as You Level Up</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {rules.tier_multipliers && Object.entries(rules.tier_multipliers).map(([tier, mult]) => (
                      <div key={tier} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <div className="text-sm font-semibold capitalize" style={{ color: 'var(--ept-text)' }}>{tier}</div>
                        <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>{String(mult)}x</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {tab === 'leaderboard' && leaderboard && (
              <div className="animate-fade-up">
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <th className="px-4 py-3 text-left" style={{ color: 'var(--ept-text-muted)' }}>Rank</th>
                        <th className="px-4 py-3 text-left" style={{ color: 'var(--ept-text-muted)' }}>User</th>
                        <th className="px-4 py-3 text-left" style={{ color: 'var(--ept-text-muted)' }}>Tier</th>
                        <th className="px-4 py-3 text-right" style={{ color: 'var(--ept-text-muted)' }}>Points</th>
                        <th className="px-4 py-3 text-right hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Lifetime</th>
                        <th className="px-4 py-3 text-right hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.leaderboard?.map((user: any) => (
                        <tr key={user.rank} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                          <td className="px-4 py-3 font-bold" style={{ color: user.rank <= 3 ? 'var(--ept-accent)' : 'var(--ept-text)' }}>
                            {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                          </td>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>{user.username}</td>
                          <td className="px-4 py-3 capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{user.tier}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: 'var(--ept-accent)' }}>{user.beta_points?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>{user.lifetime_earned?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right hidden md:table-cell" style={{ color: 'var(--ept-text-muted)' }}>{user.streak_days}d</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {leaderboard.global_stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: 'Total Users', value: leaderboard.global_stats.total_users?.toLocaleString() },
                      { label: 'Circulating', value: leaderboard.global_stats.circulating_points?.toLocaleString() },
                      { label: 'Burned', value: leaderboard.global_stats.total_burned?.toLocaleString() },
                      { label: 'Halving', value: `${(leaderboard.global_stats.halving_multiplier * 100).toFixed(0)}%` },
                    ].map((s) => (
                      <div key={s.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                        <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Burns Tab */}
            {tab === 'burns' && burns && (
              <div className="space-y-6 animate-fade-up">
                <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--ept-text-muted)' }}>Total Points Burned Forever</div>
                  <div className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{burns.total_burned?.toLocaleString() || '0'}</div>
                  <div className="text-sm mt-2" style={{ color: 'var(--ept-text-secondary)' }}>
                    = {burns.echo_equivalent_burned?.toLocaleString() || '0'} $ECHO permanently removed from circulation
                  </div>
                  <div className="mt-4 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{burns.message}</div>
                </div>

                {burns.by_source?.length > 0 && (
                  <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                    <h3 className="font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Burns by Source</h3>
                    {burns.by_source.map((src: any) => (
                      <div key={src.source} className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                        <span className="capitalize" style={{ color: 'var(--ept-text)' }}>{src.source}</span>
                        <span className="font-mono font-bold" style={{ color: 'var(--ept-accent)' }}>{src.total?.toLocaleString()} pts ({src.count} txns)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Staking Tab */}
            {tab === 'staking' && rules && (
              <div className="space-y-6 animate-fade-up">
                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Stake Your Points, Earn Passive Rewards</h2>
                  <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    Lock your Beta Points to earn APY. Longer locks earn higher rates. Points are returned with interest at maturity.
                    Staking reduces circulating supply, increasing token value.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rules.staking_tiers?.map((tier: any) => (
                    <div key={tier.lock_days} className="p-6 rounded-xl border text-center card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                      <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{tier.apy}</div>
                      <div className="text-sm font-semibold mt-1" style={{ color: 'var(--ept-text)' }}>{tier.label}</div>
                      <div className="text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>Min: {tier.min_stake} points</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>
                        Example: 10,000 pts = {Math.round(10000 * parseFloat(tier.apy) * tier.lock_days / 365)} earned
                      </div>
                      <Link href="/signup" className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                        Start Staking
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <h3 className="font-bold mb-3" style={{ color: 'var(--ept-text)' }}>How Staking Works</h3>
                  <div className="space-y-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <p>1. Choose a lock period (30, 90, 180, or 365 days)</p>
                    <p>2. Stake your points — they are deducted from your balance</p>
                    <p>3. Interest accrues daily based on the APY for your lock period</p>
                    <p>4. At maturity, your principal + earned interest are returned to your balance</p>
                    <p>5. Early withdrawal is not available — choose your lock period carefully</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 text-center p-8 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Ready to start earning?</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
            Create an account and earn 500 Beta Points instantly. Refer friends for 500 more each.
          </p>
          <div className="mt-6 flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Create Account — Earn 500 Points Free
            </Link>
            <Link href="/pricing" className="px-6 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Services
            </Link>
          </div>
        </div>
      </div>

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Rewards Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['BUS', 'FIN']}
          title="Ask the Rewards Intelligence Engine"
          placeholder="Ask about loyalty programs, rewards design..."
          exampleQueries={['Best loyalty program structures', 'How to calculate reward point ROI', 'Gamification strategies for retention']}
        />
      </section>
    </div>
  );
}
