'use client';

import FaqSchema from '../../components/FaqSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '🎯', title: 'Objectives & Key Results', desc: 'Set ambitious objectives with measurable key results. Track progress with weighted scoring and auto-calculated rollups.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Weighted key result progress auto-calculates objective completion. Number, percentage, and milestone metric types supported.' },
  { icon: '✏️', title: 'Weekly Check-Ins', desc: 'Team members update key result values with confidence levels and notes. Full history of every check-in preserved.' },
  { icon: '🔗', title: 'Goal Alignment', desc: 'Cascade objectives from company to team to individual. Alignment trees show how every goal connects to the mission.' },
  { icon: '📅', title: 'Cycle Management', desc: 'Quarterly, monthly, or custom OKR cycles. Close cycles to archive and start fresh with learned insights.' },
  { icon: '👥', title: 'Team Dashboards', desc: 'See progress by team with on-track, at-risk, and behind indicators. Compare teams and identify where to focus.' },
  { icon: '🤖', title: 'AI OKR Suggestions', desc: 'AI generates relevant OKRs based on your team type, quarter, and context. Get started in seconds, not hours.' },
  { icon: '💡', title: 'AI Progress Insights', desc: 'AI analyzes your OKR data and provides coaching on attention areas, check-in cadence, and goal quality.' },
  { icon: '⚖️', title: 'Weighted Scoring', desc: 'Assign weights to key results. Critical KRs count more toward objective progress than stretch goals.' },
  { icon: '🔔', title: 'Status Detection', desc: 'Auto-detects on-track, at-risk, and behind status based on progress vs expected timeline completion.' },
  { icon: '🏢', title: 'Multi-Level Goals', desc: 'Company, department, team, and individual objectives. Parent-child relationships track cascading alignment.' },
  { icon: '📤', title: 'CSV/JSON Export', desc: 'Export OKRs with key results for leadership reviews, board presentations, or external reporting tools.' },
];

const COMPARISON = [
  { feature: 'Objectives & Key Results', echo: true, lattice: true, fifteenfive: true, weekdone: true },
  { feature: 'Weighted Key Results', echo: true, lattice: true, fifteenfive: false, weekdone: false },
  { feature: 'Check-In History', echo: true, lattice: true, fifteenfive: true, weekdone: true },
  { feature: 'Goal Alignment Tree', echo: true, lattice: true, fifteenfive: true, weekdone: true },
  { feature: 'Cycle Management', echo: true, lattice: true, fifteenfive: true, weekdone: true },
  { feature: 'AI OKR Suggestions', echo: true, lattice: false, fifteenfive: false, weekdone: false },
  { feature: 'AI Progress Insights', echo: true, lattice: false, fifteenfive: false, weekdone: false },
  { feature: 'Auto Status Detection', echo: true, lattice: true, fifteenfive: false, weekdone: false },
  { feature: 'Multi-Level Hierarchy', echo: true, lattice: true, fifteenfive: true, weekdone: true },
  { feature: 'Confidence Tracking', echo: true, lattice: false, fifteenfive: true, weekdone: false },
  { feature: 'Performance Reviews', echo: false, lattice: true, fifteenfive: true, weekdone: false },
  { feature: 'Starting Price', echo: '$6/user', lattice: '$11/user', fifteenfive: '$4/user', weekdone: '$9/user' },
];

const TIERS = [
  { name: 'Starter', price: '$6', period: '/user/mo', desc: 'For small teams getting started with OKRs.', features: ['Up to 25 users', 'Unlimited objectives', 'Key result tracking', 'Weekly check-ins', 'Basic dashboards', 'Cycle management', 'CSV export', 'Email support'] },
  { name: 'Growth', price: '$12', period: '/user/mo', desc: 'For teams scaling with AI-powered insights.', features: ['Unlimited users', 'Goal alignment trees', 'Weighted scoring', 'AI OKR suggestions', 'AI progress insights', 'Auto status detection', 'Confidence tracking', 'Team comparisons', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$22', period: '/user/mo', desc: 'For organizations with complex goal structures.', features: ['Everything in Growth', 'Multi-level hierarchy', 'Advanced analytics', 'Custom scoring methods', 'API access', 'SSO integration', 'Audit trail', 'Dedicated account manager'] },
];

const FAQS = [
  { q: 'What are OKRs?', a: 'OKR stands for Objectives and Key Results. An Objective is an ambitious qualitative goal (e.g., "Become the #1 product in our category"). Key Results are measurable outcomes that prove you achieved the objective (e.g., "Increase NPS from 40 to 70"). Used by Google, Intel, and Spotify.' },
  { q: 'How does progress tracking work?', a: 'Each key result has a start value, target value, and current value. Progress is automatically calculated as a percentage. Key results can have different weights — a critical KR with weight 3 counts three times more than a stretch KR with weight 1. Objective progress is the weighted average of all its key results.' },
  { q: 'What are check-ins?', a: 'Check-ins are periodic updates to key result values. Team members update their current values, optionally add a confidence level (0-1 scale) and notes explaining progress. Every check-in is preserved as history so you can see the trajectory over time.' },
  { q: 'How does goal alignment work?', a: 'Objectives can be linked parent-to-child or through alignment relationships. Company objectives cascade to department objectives, which cascade to team and individual objectives. The alignment tree view shows how every goal connects to the top-level mission.' },
  { q: 'What do the AI features do?', a: 'AI OKR Suggestions generates relevant objectives and key results based on your team type, quarter, and context. AI Progress Insights analyzes your OKR data and provides coaching on which objectives need attention, whether your check-in cadence is healthy, and how to improve goal quality.' },
  { q: 'How does this compare to Lattice?', a: 'Lattice is a broader people platform ($11+/user) that includes performance reviews, engagement surveys, and OKRs. Echo OKR is focused purely on goal tracking with AI assistance, starting at $6/user. If you need OKRs without the full HR platform, Echo is the better fit.' },
];

export default function OKRPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'OKR', href: '/okr' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=okr&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Goal Tracking</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Set Goals,<br /><span className="gradient-text">Crush Them</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Objectives and key results with AI-powered suggestions, weighted scoring, alignment trees, and progress insights — everything your team needs to set and achieve ambitious goals.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=okr&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Track Goals</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Focused OKR tracking with AI, at a fraction of the cost.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Lattice</th><th className="py-3 px-4 font-semibold">15Five</th><th className="py-3 px-4 font-semibold">Weekdone</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.lattice === 'boolean' ? (row.lattice ? '✅' : '❌') : row.lattice}</td>
                  <td className="py-3 px-4 text-center">{typeof row.fifteenfive === 'boolean' ? (row.fifteenfive ? '✅' : '❌') : row.fifteenfive}</td>
                  <td className="py-3 px-4 text-center">{typeof row.weekdone === 'boolean' ? (row.weekdone ? '✅' : '❌') : row.weekdone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Per-User Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No contracts. No setup fees. Scale as your team grows.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <div key={i} className={`p-8 rounded-xl border ${t.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {t.popular && <div className="text-xs font-bold uppercase mb-4 tracking-wider" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-2xl font-bold mb-1">{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold">{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.period}</span></div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{t.desc}</p>
              <ul className="space-y-2 mb-8">
                {t.features.map((f, j) => (<li key={j} className="text-sm flex items-start gap-2"><span style={{ color: 'var(--ept-accent)' }}>✓</span><span>{f}</span></li>))}
              </ul>
              <Link href={`/checkout?service=okr&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Align Your Team on What Matters?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join teams hitting their goals with AI-powered OKR tracking and alignment.</p>
        <Link href="/checkout?service=okr&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
