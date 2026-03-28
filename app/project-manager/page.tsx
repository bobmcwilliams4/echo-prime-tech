'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { title: 'Kanban Boards', desc: 'Drag-and-drop boards with customizable columns, WIP limits, and swimlanes. Visualize every stage of your workflow at a glance.' },
  { title: 'Sprint Planning', desc: 'Plan sprints with velocity tracking, story point estimation, and burndown charts. Data-driven sprint commitments, not guesswork.' },
  { title: 'Task Management', desc: 'Create tasks with priorities, assignees, due dates, subtasks, and dependencies. Break complex work into manageable pieces.' },
  { title: 'Team Collaboration', desc: 'Threaded comments, @mentions, file attachments, and real-time activity feeds on every task. Keep discussions in context.' },
  { title: 'Gantt Charts', desc: 'Interactive timeline view with task dependencies, critical path highlighting, and drag-to-reschedule. See the full project timeline.' },
  { title: 'Resource Allocation', desc: 'Workload heatmaps show who is overloaded and who has capacity. Balance assignments before burnout happens.' },
  { title: 'Milestone Tracking', desc: 'Define project milestones with target dates and completion criteria. Track progress toward key deliverables with visual indicators.' },
  { title: 'Reporting Dashboards', desc: 'Real-time dashboards with burndown charts, velocity trends, cycle time analytics, and custom widgets. One screen, full visibility.' },
];

const PRICING = [
  { tier: 'Starter', price: 0, features: ['3 projects', 'Kanban boards', 'Unlimited tasks', 'Basic reporting', 'Comments & activity', 'API access'], cta: 'Get Started Free', href: '/checkout?service=pm&tier=starter', popular: false },
  { tier: 'Professional', price: 19, features: ['Unlimited projects', 'Gantt charts', 'Sprint planning', 'Resource allocation', 'Milestone tracking', 'Advanced dashboards', 'Time tracking', 'Custom workflows'], cta: 'Start Free Trial', href: '/checkout?service=pm&tier=pro', popular: true },
  { tier: 'Enterprise', price: 49, features: ['Everything in Professional', 'Portfolio management', 'Audit log & compliance', 'SAML SSO', 'Dedicated support', 'Custom integrations', 'Data export & backup', 'SLA guarantee'], cta: 'Contact Sales', href: '/support', popular: false },
];

const FAQS: { q: string; a: string }[] = [
  { q: 'Can I use Kanban and Scrum together?', a: 'Yes. Each project supports multiple board types. Run a Kanban board for continuous delivery alongside a Scrum board for sprint-based work. Switch views anytime without losing data.' },
  { q: 'How do Gantt chart dependencies work?', a: 'Link tasks with finish-to-start, start-to-start, or finish-to-finish relationships. The Gantt view automatically highlights the critical path and shifts dependent tasks when dates change.' },
  { q: 'What reporting metrics are available?', a: 'Dashboards include burndown/burnup charts, sprint velocity trends, cycle time distribution, cumulative flow diagrams, and workload heatmaps. Export any chart as PNG or CSV.' },
  { q: 'How does resource allocation prevent overload?', a: 'The workload view shows each team member\'s assigned story points or hours per sprint. Color-coded capacity bars flag overloaded members so you can rebalance before it impacts delivery.' },
  { q: 'Is there an API for integrations?', a: 'Full REST API available on all tiers. Create tasks, update statuses, pull reports, and sync with external tools like GitHub, Slack, or CI/CD pipelines via webhooks.' },
  { q: 'Can I track milestones across multiple projects?', a: 'Yes. The portfolio view aggregates milestones from all projects into a single timeline. Filter by team, status, or date range to see cross-project progress at a glance.' },
];

const BREADCRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/engines' },
  { name: 'Project Manager', href: '/project-manager' },
];

export default function ProjectManagerPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={BREADCRUMBS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>PROJECT MANAGER</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Plan, Track &amp; Deliver<br /><span className="gradient-text">Projects on Time</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Kanban boards, Gantt charts, sprint planning, and resource allocation in one platform. Built for teams that ship — not teams that manage tools.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=pm&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View All Products</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Everything Teams Need to Ship</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', title: 'Create Your Project', desc: 'Set up a project in seconds. Choose Kanban, Scrum, or a hybrid workflow. Invite your team and define your first milestones.' },
              { step: '2', title: 'Plan & Assign Work', desc: 'Break projects into tasks with priorities, story points, and due dates. Drag cards across boards. Build your Gantt timeline.' },
              { step: '3', title: 'Track & Deliver', desc: 'Monitor progress with real-time dashboards. Spot blockers early with burndown charts. Ship on time, every time.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold mb-4" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.tier}</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold">{p.price === 0 ? 'Free' : `$${p.price}`}</span>
                {p.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span>}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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

      {/* CTA Footer */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Ready to Ship Faster?</h2>
        <p className="mb-6 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Start managing projects in minutes. No credit card required.</p>
        <TrialCTA serviceId="echo-pm" tier="starter" productName="Echo Project Manager" />
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
