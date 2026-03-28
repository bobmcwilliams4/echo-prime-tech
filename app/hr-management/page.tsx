'use client';
import FaqSchema from '../../components/FaqSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

/*  ═══════════════════════════════════════════════════════════════════
    Echo HR Management — AI-Powered People Management
    Backend: echo-hr-management.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Employee Directory', desc: 'Complete employee profiles with contact info, department, position, salary, manager, and employment history. Search and filter across the entire org.' },
  { title: 'Department Management', desc: 'Organize employees by department with managers, budgets, and headcount tracking. Visualize your org structure at a glance.' },
  { title: 'Position & Levels', desc: 'Define positions with salary bands from junior to C-suite. Track career progression and ensure compensation equity across the org.' },
  { title: 'Time-Off Management', desc: 'Employees request vacation, sick, personal, parental, or bereavement leave. Managers approve with one click. Calendar shows team availability.' },
  { title: 'Performance Reviews', desc: 'Structured review cycles with ratings, strengths, areas for improvement, and goals. Track from draft to submission to acknowledgment.' },
  { title: 'AI Review Assistant', desc: 'AI generates review summaries by analyzing employee performance data, goals completion, and peer feedback. Save hours on review writing.' },
  { title: 'Employee Documents', desc: 'Store contracts, NDAs, tax forms, and certifications per employee. Organized by document type with upload tracking.' },
  { title: 'Org Chart View', desc: 'See the full organizational hierarchy. Click any manager to see their direct reports. Understand reporting lines instantly.' },
  { title: 'Headcount Reports', desc: 'Track headcount by department, employment type, and status. See growth trends and plan for hiring needs.' },
  { title: 'Compensation Analytics', desc: 'Salary statistics by department and position level. Identify pay gaps, benchmark against salary bands, and ensure equity.' },
  { title: 'Turnover Reports', desc: 'Track employee turnover rate, average tenure, and departure patterns. Identify retention risks before they become problems.' },
  { title: 'HR Dashboard', desc: 'One-screen view of total employees, open positions, pending time-off requests, upcoming reviews, and recent hires and departures.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', echo: '$25/mo', c1: '$6/user/mo', c2: '$8/user/mo', c3: '$5/user/mo' },
  { feature: 'AI Review Writing', echo: 'Yes', c1: 'No', c2: 'Add-on', c3: 'No' },
  { feature: 'Time-Off Management', echo: 'All tiers', c1: 'All tiers', c2: 'Pro', c3: 'All tiers' },
  { feature: 'Performance Reviews', echo: 'All tiers', c1: 'Premium', c2: 'Pro', c3: 'Premium' },
  { feature: 'Compensation Analytics', echo: 'Pro+', c1: 'Premium', c2: 'Enterprise', c3: 'No' },
  { feature: 'Org Chart', echo: 'Yes', c1: 'Premium', c2: 'Yes', c3: 'No' },
  { feature: 'API Access', echo: 'Full REST', c1: 'Enterprise', c2: 'Pro', c3: 'No' },
  { feature: 'Setup Time', echo: '10 minutes', c1: '1-2 weeks', c2: '3-5 days', c3: '1 day' },
  { feature: 'Self-Hostable', echo: 'Cloudflare', c1: 'No', c2: 'No', c3: 'No' },
];

const PRICING = [
  { tier: 'Startup', price: 25, features: ['25 employees', 'Employee directory', 'Department management', 'Time-off requests', 'Basic reviews', 'Document storage', 'HR dashboard'], cta: 'Start Free Trial', href: '/checkout?service=hr&tier=startup', popular: false },
  { tier: 'Growth', price: 69, features: ['100 employees', 'AI review assistant', 'Compensation analytics', 'Turnover reports', 'Org chart', 'Position levels', 'Time-off calendar', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=hr&tier=growth', popular: true },
  { tier: 'Enterprise', price: 179, features: ['Unlimited employees', 'Advanced AI analytics', 'Custom review cycles', 'Compliance reporting', 'Multi-location', 'Webhook integrations', 'Priority support', 'Data export'], cta: 'Contact Sales', href: '/checkout?service=hr&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'How does the AI review assistant work?', a: 'When writing a performance review, the AI analyzes the employee\'s position, tenure, goals, and any notes you\'ve recorded. It generates a structured review with ratings, strengths, improvement areas, and suggested goals — which you can edit and personalize before submitting.' },
  { q: 'How does time-off management work?', a: 'Employees submit time-off requests specifying type (vacation, sick, etc.), dates, and reason. Their manager is notified and can approve or deny with one click. Approved time-off appears on the team calendar so everyone knows who\'s available.' },
  { q: 'Can I track different employment types?', a: 'Yes. Track full-time, part-time, contract, and intern employees with different positions, salary structures, and benefits. Filter reports by employment type to see your workforce composition.' },
  { q: 'What compensation data can I analyze?', a: 'See salary statistics by department and position level — min, max, median, and average. Compare actual salaries against position salary bands to identify pay gaps. Great for annual compensation reviews.' },
  { q: 'How does the org chart work?', a: 'The org chart is automatically generated from manager-employee relationships. Click any person to see their profile and direct reports. Reorganize teams by updating manager assignments — the chart updates instantly.' },
  { q: 'Is employee data secure?', a: 'All data is stored in Cloudflare D1 with encrypted connections. Write operations require API key authentication. Employee data is isolated per tenant. We follow data minimization principles and never share employee information.' },
];

export default function HRManagementPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'HR Management', href: '/hr-management' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>HR & PEOPLE MANAGEMENT</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">HR Management That<br /><span className="gradient-text">Actually Saves You Time</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Employee directory, time-off tracking, performance reviews, and AI-powered analytics. Run HR operations for your team without the enterprise price tag.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=hr&tier=startup" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial — $25/mo</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Complete People Management</h2>
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
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo vs BambooHR vs Gusto vs Rippling</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">BambooHR</th><th className="p-3 text-center font-bold">Gusto</th><th className="p-3 text-center font-bold">Rippling</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
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
              <div className="my-4"><span className="text-4xl font-extrabold">${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span></div>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--ept-text)' }}>Ready to Simplify HR?</h2>
        <p className="text-center mb-6" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered people management without the enterprise price tag.</p>
        <TrialCTA serviceId="echo-hr-management" tier="starter" productName="Echo HR Management" />
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
