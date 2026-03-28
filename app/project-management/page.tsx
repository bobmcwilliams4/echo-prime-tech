'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Project Management — AI-Powered Project & Task Tracking
    Backend: echo-project-management.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Kanban Boards', desc: 'Visual drag-and-drop boards with customizable columns, WIP limits, and color coding. See your workflow at a glance.' },
  { title: 'Task Management', desc: 'Create tasks with titles, descriptions, priorities, assignees, due dates, story points, and labels. Subtasks for complex work breakdown.' },
  { title: 'Multiple Projects', desc: 'Manage unlimited projects with status tracking, budgets, start/end dates, and project-level reporting. Archive completed projects.' },
  { title: 'Sprint Planning', desc: 'Scrum boards with sprint velocity tracking, burndown charts, and story point estimation. Plan sprints with data, not guesses.' },
  { title: 'Time Tracking', desc: 'Log hours directly on tasks. See time logged by team member, project, or date range. Compare estimates vs. actuals.' },
  { title: 'AI Task Analysis', desc: 'AI estimates task complexity, identifies risks, and finds similar past tasks. Get intelligent suggestions for breaking down large work items.' },
  { title: 'Priority Management', desc: 'Four priority levels (low/medium/high/critical) with visual indicators. Filter and sort by priority to focus on what matters.' },
  { title: 'Labels & Tags', desc: 'Create custom labels with colors to categorize tasks by type, component, epic, or any taxonomy that fits your workflow.' },
  { title: 'Comments & Activity', desc: 'Discussion threads on every task. Full activity log tracks all changes — who moved what, when, and why.' },
  { title: 'Workload Reports', desc: 'See task distribution across team members. Identify overloaded and underutilized people. Balance work before burnout.' },
  { title: 'Burndown Charts', desc: 'Track progress over time with burndown and burnup charts. See if you\'re on track for deadlines based on actual velocity.' },
  { title: 'Project Dashboard', desc: 'Overview of active projects, tasks by status, overdue items, team workload, and recent activity. One screen, full visibility.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', echo: '$15/mo', c1: '$10/user/mo', c2: '$10/user/mo', c3: 'Free (limited)' },
  { feature: 'AI Task Analysis', echo: 'Yes', c1: 'AI add-on', c2: 'Enterprise', c3: 'No' },
  { feature: 'Kanban Boards', echo: 'Unlimited', c1: 'Unlimited', c2: '1 (free)', c3: 'Limited' },
  { feature: 'Time Tracking', echo: 'Built-in', c1: 'Plugin', c2: 'No', c3: 'No' },
  { feature: 'Burndown Charts', echo: 'All tiers', c1: 'Premium', c2: 'Yes', c3: 'No' },
  { feature: 'Subtasks', echo: 'Yes', c1: 'Yes', c2: 'Yes', c3: 'Yes' },
  { feature: 'API Access', echo: 'Full REST', c1: 'All tiers', c2: 'Yes', c3: 'Premium' },
  { feature: 'WIP Limits', echo: 'Yes', c1: 'Yes', c2: 'Yes', c3: 'No' },
  { feature: 'Self-Hostable', echo: 'Cloudflare', c1: 'Data Center', c2: 'No', c3: 'No' },
];

const PRICING = [
  { tier: 'Free', price: 0, features: ['2 projects', '1 board per project', 'Unlimited tasks', 'Comments & activity', 'Labels & priorities', 'Basic dashboard', 'API access'], cta: 'Get Started Free', href: '/checkout?service=pm&tier=free', popular: false },
  { tier: 'Team', price: 15, features: ['Unlimited projects', 'Unlimited boards', 'AI task analysis', 'Time tracking', 'Burndown charts', 'Workload reports', 'Sprint planning', 'Subtasks'], cta: 'Start Free Trial', href: '/checkout?service=pm&tier=team', popular: true },
  { tier: 'Business', price: 39, features: ['Everything in Team', 'Advanced analytics', 'Custom workflows', 'Portfolio view', 'Webhook integrations', 'Priority support', 'Data export', 'Audit log'], cta: 'Start Free Trial', href: '/checkout?service=pm&tier=business', popular: false },
];

const FAQS = [
  { q: 'How does the AI task analysis work?', a: 'When you create or update a task, the AI analyzes the title, description, and context to estimate complexity (story points), identify potential risks, and find similar past tasks from your project history. It helps you plan more accurately based on real data.' },
  { q: 'Can I use both Kanban and Scrum?', a: 'Yes. Each project can have multiple boards. Create a Kanban board for continuous work and a Scrum board for sprint-based work. Switch between views anytime. Different teams can use different methodologies.' },
  { q: 'How does time tracking work?', a: 'Team members log hours directly on tasks — just enter the time, date, and optional description. Reports show time by person, project, or date range. Compare estimated hours vs. actual to improve future estimates.' },
  { q: 'What are WIP limits?', a: 'Work In Progress (WIP) limits set a maximum number of tasks allowed in a column. When a column hits its limit, it signals the team to finish existing work before starting new tasks. This prevents overload and improves flow.' },
  { q: 'Can I create subtasks?', a: 'Yes. Any task can have subtasks for breaking down complex work. Subtasks have their own assignees, priorities, and due dates while being linked to the parent task. Progress rolls up automatically.' },
  { q: 'How do burndown charts work?', a: 'Burndown charts track remaining work (story points or task count) over time. A downward-sloping line means you\'re making progress. Compare the actual burndown against the ideal line to see if you\'re on track for your sprint or project deadline.' },
];

export default function ProjectManagementPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Project Management', href: '/project-management' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>PROJECT MANAGEMENT</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Ship Projects Faster with<br /><span className="gradient-text">AI-Powered Planning</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Kanban boards, sprint planning, time tracking, and AI that estimates complexity. Project management without the bloat — just the features teams actually use.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=pm&tier=free" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started Free</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Everything You Need to Ship</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo vs Jira vs Linear vs Asana</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">Jira</th><th className="p-3 text-center font-bold">Linear</th><th className="p-3 text-center font-bold">Asana</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
            <tbody>{COMPARISON.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="p-3 font-medium">{r.feature}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c1}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c2}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c3}</td><td className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Honest Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.tier}</h3>
              <div className="my-4"><span className="text-4xl font-extrabold">{p.price === 0 ? 'Free' : `$${p.price}`}</span>{p.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span>}</div>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map((f, j) => <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={p.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{f.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
