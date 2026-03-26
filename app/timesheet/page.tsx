'use client';

import FaqSchema from '../../components/FaqSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '⏱️', title: 'One-Click Timer', desc: 'Start and stop timers with one click. Auto-stops running timers when you start a new one.' },
  { icon: '📝', title: 'Manual Entries', desc: 'Log time manually with start/end times, duration, project, task, and description.' },
  { icon: '📂', title: 'Projects & Tasks', desc: 'Organize time by projects and tasks. Set budgets, hourly rates, and billable status.' },
  { icon: '👥', title: 'Team Management', desc: 'Add team members with roles, hourly rates, and weekly capacity targets.' },
  { icon: '📋', title: 'Weekly Timesheets', desc: 'Generate, submit, and approve weekly timesheets with total and billable hours.' },
  { icon: '💰', title: 'Invoice Generation', desc: 'Auto-generate invoices from billable hours with client, period, and rate calculations.' },
  { icon: '📊', title: 'Reports & Analytics', desc: 'Detailed reports by project, member, and day with billable percentage tracking.' },
  { icon: '🏢', title: 'Client Management', desc: 'Track clients and link them to projects for organized billing and reporting.' },
  { icon: '🎯', title: 'Budget Tracking', desc: 'Set hour and dollar budgets per project. Track utilization in real-time.' },
  { icon: '🤖', title: 'AI Productivity', desc: 'AI analyzes your time data and provides personalized productivity insights.' },
  { icon: '🏷️', title: 'Tags & Categorization', desc: 'Tag time entries for flexible filtering and reporting across any dimension.' },
  { icon: '📤', title: 'CSV/JSON Export', desc: 'Export time data for payroll, accounting, or any external system integration.' },
];

const COMPARISON = [
  { feature: 'One-Click Timer', echo: true, toggl: true, harvest: true, clockify: true },
  { feature: 'Manual Time Entry', echo: true, toggl: true, harvest: true, clockify: true },
  { feature: 'Project Budgets', echo: true, toggl: true, harvest: true, clockify: false },
  { feature: 'Weekly Timesheets', echo: true, toggl: false, harvest: true, clockify: true },
  { feature: 'Approval Workflow', echo: true, toggl: false, harvest: true, clockify: false },
  { feature: 'Invoice Generation', echo: true, toggl: false, harvest: true, clockify: false },
  { feature: 'AI Productivity Insights', echo: true, toggl: false, harvest: false, clockify: false },
  { feature: 'Client Management', echo: true, toggl: true, harvest: true, clockify: true },
  { feature: 'Budget Utilization', echo: true, toggl: true, harvest: true, clockify: false },
  { feature: 'Team Reports', echo: true, toggl: true, harvest: true, clockify: true },
  { feature: 'Multi-Workspace', echo: true, toggl: false, harvest: false, clockify: false },
  { feature: 'Starting Price', echo: '$5/user', toggl: '$9/user', harvest: '$11/user', clockify: '$4/user' },
];

const TIERS = [
  { name: 'Starter', price: '$5', period: '/user/mo', desc: 'For freelancers and small teams.', features: ['Unlimited time entries', 'Up to 10 projects', 'One-click timer', 'Manual entries', 'Basic reports', 'CSV export', 'Email support'] },
  { name: 'Business', price: '$9', period: '/user/mo', desc: 'For teams that need approval workflows and invoicing.', features: ['Unlimited projects', 'Weekly timesheets', 'Approval workflows', 'Invoice generation', 'Client management', 'Budget tracking', 'AI productivity insights', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$14', period: '/user/mo', desc: 'For organizations needing advanced analytics and control.', features: ['Everything in Business', 'Multi-workspace', 'Advanced reports', 'Custom tags', 'API access', 'Detailed audit log', 'Dedicated account manager', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'How does the timer work?', a: 'Click "Start" to begin tracking time. The timer runs in the background and you can assign it to a project and task at any time. Starting a new timer automatically stops the previous one. You can also add time entries manually.' },
  { q: 'Can I generate invoices from tracked time?', a: 'Yes. Select a client and date range, and Echo Timesheet calculates the total billable hours and amount based on project hourly rates. The invoice is generated with an auto-incrementing number and can be sent directly to clients.' },
  { q: 'How do weekly timesheets work?', a: 'Team members generate a weekly timesheet that aggregates all their time entries for the week. They submit it for approval, and managers can approve or reject with comments. Approved timesheets can feed directly into payroll.' },
  { q: 'Can I track project budgets?', a: 'Yes. Set hour budgets and dollar budgets on each project. The budget report shows real-time utilization percentage, remaining hours, and spent amount so you never go over budget.' },
  { q: 'What are AI productivity insights?', a: 'Our AI analyzes your time tracking patterns over the last 30 days and provides personalized insights about your work habits, billable vs non-billable ratio, and suggestions for improving efficiency.' },
  { q: 'How does this compare to Toggl or Harvest?', a: 'Echo Timesheet combines the best of both: Toggl\'s simple timer with Harvest\'s invoicing and timesheets. Plus AI productivity insights that neither offers. All at $5-14/user vs $9-11/user.' },
];

export default function TimesheetPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Timesheet', href: '/timesheet' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=timesheet&tier=business" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>AI-Powered Time Tracking</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Track Time,<br /><span className="gradient-text">Bill Smarter</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>One-click timers, project budgets, weekly timesheets, invoice generation, and AI productivity insights — everything your team needs to track and bill time effectively.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=timesheet&tier=business" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Track Time</h2>
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

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>The best of Toggl + Harvest + AI, at a better price.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">Toggl</th><th className="py-3 px-4 font-semibold">Harvest</th><th className="py-3 px-4 font-semibold">Clockify</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.toggl === 'boolean' ? (row.toggl ? '✅' : '❌') : row.toggl}</td>
                  <td className="py-3 px-4 text-center">{typeof row.harvest === 'boolean' ? (row.harvest ? '✅' : '❌') : row.harvest}</td>
                  <td className="py-3 px-4 text-center">{typeof row.clockify === 'boolean' ? (row.clockify ? '✅' : '❌') : row.clockify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Per-User Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No hidden fees. No feature gates. Scale as you grow.</p>
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
              <Link href={`/checkout?service=timesheet&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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
        <h2 className="text-3xl font-bold mb-4">Ready to Track Time Smarter?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join teams billing more accurately and boosting productivity with AI-powered time tracking.</p>
        <Link href="/checkout?service=timesheet&tier=business" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </div>
  );
}
