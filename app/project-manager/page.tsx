'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

/* ==============================================================================
   ECHO PROJECT MANAGER — AI-Powered Project Management
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-project-manager.bmcii1976.workers.dev (65 endpoints, 12 D1 tables, v1.0)
   ============================================================================== */

const FEATURES = [
  { title: 'Kanban Boards', desc: 'Drag-and-drop task boards with Todo, In Progress, In Review, Blocked, and Done columns. Bulk move. Real-time status updates.', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
  { title: 'Sprint Management', desc: 'Plan sprints with capacity-based task selection. Track velocity across sprints. Burndown charts with ideal vs actual progress.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { title: 'AI Task Estimation', desc: 'Paste a task title and description — AI estimates hours, story points, complexity, risk factors, and suggests subtasks.', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
  { title: 'Time Tracking', desc: 'Log hours against tasks with billable/non-billable split. Timesheet reports by member, project, and date range.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Team Workload', desc: 'See each member\'s assigned tasks, estimated hours, and capacity utilization. Identify overloaded and underutilized team members.', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
  { title: 'Milestones & Deadlines', desc: 'Set project milestones with due dates. Track completion progress. Get alerts when deadlines approach or pass.', icon: 'M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5' },
  { title: 'Project Templates', desc: 'Save your project structure as a template. Apply it to new projects to instantly create tasks, milestones, and labels.', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Task Comments', desc: 'Threaded comments on every task. Internal notes for team-only discussions. Edit and delete with audit trail.', icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },
  { title: 'Labels & Priorities', desc: 'Custom color-coded labels per workspace. 5 priority levels (critical to none). 7 task types including bug, story, and epic.', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z' },
  { title: 'Activity Feed', desc: 'See who did what, when. Every project action logged — task creation, status changes, comments, time entries, member additions.', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Workspaces', desc: 'Separate workspaces for different teams or clients. Each workspace has its own projects, members, labels, and templates.', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z' },
  { title: 'AI Sprint Planning', desc: 'AI analyzes your backlog, team capacity, and priorities to suggest the optimal sprint plan. Automatic capacity-based task selection.', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605' },
];

const COMPARISON = [
  { feature: 'AI task estimation', echo: true, jira: false, asana: false, monday: false },
  { feature: 'AI sprint planning', echo: true, jira: false, asana: false, monday: false },
  { feature: 'Kanban boards', echo: true, jira: true, asana: true, monday: true },
  { feature: 'Sprint management', echo: true, jira: true, asana: 'Partial', monday: 'Partial' },
  { feature: 'Time tracking (built-in)', echo: true, jira: 'Add-on', asana: 'Add-on', monday: true },
  { feature: 'Burndown charts', echo: true, jira: true, asana: false, monday: 'Add-on' },
  { feature: 'Project templates', echo: true, jira: true, asana: true, monday: true },
  { feature: 'Workload balancing', echo: true, jira: 'Add-on', asana: true, monday: true },
  { feature: 'No per-user pricing', echo: true, jira: false, asana: false, monday: false },
  { feature: 'Self-hostable API', echo: true, jira: false, asana: false, monday: false },
  { feature: 'Sub-second latency', echo: true, jira: false, asana: false, monday: false },
  { feature: '$0.00 infrastructure cost', echo: true, jira: false, asana: false, monday: false },
];

const PRICING = [
  { tier: 'Starter', price: 19, features: ['1 workspace', '5 projects', '10 members', 'Kanban boards', 'Task comments', 'Labels & priorities', 'Activity feed'], cta: 'Start Free Trial', href: '/checkout?service=project-manager&tier=starter', popular: false },
  { tier: 'Team', price: 49, features: ['3 workspaces', 'Unlimited projects', '25 members', 'Sprint management', 'Time tracking', 'Burndown charts', 'AI task estimation', 'Project templates', 'Milestone tracking'], cta: 'Start Free Trial', href: '/checkout?service=project-manager&tier=team', popular: true },
  { tier: 'Business', price: 149, features: ['Unlimited workspaces', 'Unlimited projects', 'Unlimited members', 'AI sprint planning', 'Workload analytics', 'Velocity tracking', 'Custom integrations', 'Priority support', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=project-manager&tier=business', popular: false },
];

const FAQS = [
  { q: 'How is this different from Jira or Asana?', a: 'Two words: AI-native. We built task estimation and sprint planning into the core platform, not as add-ons. Our AI analyzes your backlog, understands task complexity, and suggests optimal sprint plans based on team capacity. Plus, we run on Cloudflare\'s edge network — sub-second response times globally, not the 3-5 second page loads you get with legacy tools.' },
  { q: 'Is there a per-user fee?', a: 'No. Our pricing is per workspace, not per seat. The Team plan includes 25 members for $49/month — that\'s $1.96/user. Jira charges $8.15/user and Asana charges $10.99/user. For a 25-person team, you save $2,500-$4,800 per year.' },
  { q: 'How does AI task estimation work?', a: 'Paste your task title and description. Our AI analyzes it against thousands of similar software tasks and returns: estimated hours, story points (Fibonacci), complexity rating, risk factors, and suggested subtasks. It gets better over time as it learns your team\'s velocity.' },
  { q: 'Can I import from Jira?', a: 'We are building a Jira import tool. In the meantime, use our REST API to programmatically create projects, tasks, and sprints from your existing data. Our API is fully documented and every endpoint returns JSON.' },
  { q: 'Where is my data stored?', a: 'All data is stored in Cloudflare D1 (SQLite at the edge). Your data is encrypted at rest, replicated globally, and never leaves Cloudflare\'s network. We do not sell, share, or mine your data. You can export everything via API at any time.' },
  { q: 'Do you support agile and waterfall?', a: 'Yes. Use sprints and kanban boards for agile workflows. Use milestones and Gantt-style target dates for waterfall. Mix both approaches in the same project if that suits your team.' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

export default function ProjectManagerPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm hover:underline" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.08)' }}>
          NEW PRODUCT
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Project Management<br />
          <span className="gradient-text">With AI Superpowers</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Kanban boards, sprints, time tracking, and burndown charts — plus AI that estimates tasks and plans your sprints. No per-user pricing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/checkout?service=project-manager&tier=team" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
        <div className="flex justify-center gap-8 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">65 API Endpoints</span>
          <span className="text-sm">12 D1 Tables</span>
          <span className="text-sm">13 Modules</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Everything Your Team Needs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>12 integrated modules. From kanban boards to AI sprint planning. Built for speed on Cloudflare&apos;s global edge.</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Echo vs. The Big Three</h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <th className="text-left py-3 px-4" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
                <th className="text-center py-3 px-4" style={{ color: 'var(--ept-text-secondary)' }}>Jira</th>
                <th className="text-center py-3 px-4" style={{ color: 'var(--ept-text-secondary)' }}>Asana</th>
                <th className="text-center py-3 px-4" style={{ color: 'var(--ept-text-secondary)' }}>Monday</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="text-center py-3 px-4"><ComparisonCell value={row.echo} /></td>
                  <td className="text-center py-3 px-4"><ComparisonCell value={row.jira} /></td>
                  <td className="text-center py-3 px-4"><ComparisonCell value={row.asana} /></td>
                  <td className="text-center py-3 px-4"><ComparisonCell value={row.monday} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple, Fair Pricing</h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat fees. No hidden add-ons. One price, whole team included.</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-8 rounded-xl border relative ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>/mo</span></div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Questions & Answers</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <button className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <svg className={`w-5 h-5 transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {openFaq === i && <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ship Faster With AI</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Join teams that manage projects at the speed of thought.</p>
        <Link href="/checkout?service=project-manager&tier=team" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>Echo Prime Technologies &copy; {new Date().getFullYear()} &middot; <Link href="/legal/privacy" className="hover:underline">Privacy</Link> &middot; <Link href="/legal/terms" className="hover:underline">Terms</Link></p>
      </footer>
    </main>
  );
}
