'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Employee Profiles', desc: 'Complete employee records: personal info, job details, compensation, emergency contacts, employment history. Search across your workforce instantly.' },
  { title: 'Department Management', desc: 'Organize teams with hierarchical departments. Track headcount, budgets, and managers. Auto-generated org chart per department.' },
  { title: 'Time Tracking', desc: 'Clock in/out with automatic hours and overtime calculation. Project-based tracking, break deductions, bulk approval for managers.' },
  { title: 'Leave Management', desc: 'Configurable leave types (vacation, sick, personal) with annual entitlements, carry-over rules, and balance tracking. Request/approve workflow.' },
  { title: 'Payroll Generation', desc: 'Auto-calculate gross pay, federal/state taxes, Social Security, Medicare. Support for salary and hourly employees with overtime at 1.5x. Draft → approve workflow.' },
  { title: 'Performance Reviews', desc: 'Structured review cycles with multi-dimension ratings, strengths/improvements, goals, and employee self-comments. Track ratings over time.' },
  { title: 'Onboarding Checklists', desc: 'Create reusable onboarding templates per department. Assign to new hires with task-by-task progress tracking until 100% complete.' },
  { title: 'Document Management', desc: 'Store employee documents: contracts, certifications, IDs, tax forms. Track expiry dates for automatic renewal reminders.' },
  { title: 'AI Retention Risk', desc: 'Engine Runtime analyzes tenure, salary, review scores, and recent leave patterns to predict flight risk and recommend retention actions.' },
  { title: 'AI Performance Insights', desc: 'Get team-wide performance analysis: distribution of ratings, high/low performer identification, and improvement recommendations.' },
  { title: 'Headcount Analytics', desc: 'Department-level headcount, average salary, turnover trends, new hire velocity, and payroll summaries — all in real-time dashboards.' },
  { title: 'Multi-Tenant Architecture', desc: 'Complete tenant isolation with configurable employee limits, pay periods, and fiscal year settings. White-label ready for HR SaaS.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', gusto: '$40+$6/emp', bamboo: '$99+', echo: '$29 flat' },
  { feature: 'Employee Profiles', gusto: 'Yes', bamboo: 'Yes', echo: 'Yes' },
  { feature: 'Time Tracking', gusto: 'Add-on', bamboo: 'Yes', echo: 'Built-in' },
  { feature: 'Leave Management', gusto: 'Yes', bamboo: 'Yes', echo: 'Yes + carry-over' },
  { feature: 'Payroll', gusto: 'Yes', bamboo: 'No (integration)', echo: 'Built-in calc' },
  { feature: 'Performance Reviews', gusto: 'No', bamboo: 'Yes', echo: 'Yes' },
  { feature: 'Onboarding Checklists', gusto: 'Basic', bamboo: 'Yes', echo: 'Templates + tracking' },
  { feature: 'AI Retention Risk', gusto: 'No', bamboo: 'No', echo: 'Yes' },
  { feature: 'AI Performance Analysis', gusto: 'No', bamboo: 'No', echo: 'Yes' },
  { feature: 'Org Chart', gusto: 'Basic', bamboo: 'Yes', echo: 'Auto-generated' },
  { feature: 'Document Management', gusto: 'Yes', bamboo: 'Yes', echo: 'Yes + expiry' },
  { feature: 'API Access', gusto: 'Custom pricing', bamboo: 'Enterprise', echo: 'All plans' },
];

export default function HRPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime Tech</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          AI-Powered HR Management
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>
          HR That Runs Itself.<br />People That Stay.
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Employee management, time tracking, leave requests, payroll, performance reviews, and onboarding —
          all with AI-powered retention risk prediction. From 10 employees to 10,000, at a fraction of Gusto or BambooHR.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl border font-semibold text-lg" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '70+', l: 'API Endpoints' },
            { n: '14', l: 'DB Tables' },
            { n: '99.9%', l: 'Uptime (Edge)' },
            { n: '$29/mo', l: 'All Features' },
          ].map((s) => (
            <div key={s.l} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.n}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Complete HR in One Platform</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Gusto</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>BambooHR</th>
                <th className="text-center p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo HR</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={r.feature} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.gusto}</td>
                  <td className="p-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.bamboo}</td>
                  <td className="p-3 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: '$29', period: '/mo', features: ['Up to 25 employees', 'Employee profiles', 'Time tracking', 'Leave management', 'Basic analytics', 'Document storage'] },
            { name: 'Growth', price: '$79', period: '/mo', features: ['Up to 100 employees', 'Everything in Starter', 'Payroll generation', 'Performance reviews', 'Onboarding checklists', 'AI retention risk', 'AI performance insights'], popular: true },
            { name: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited employees', 'Everything in Growth', 'Multi-tenant / white-label', 'Custom integrations', 'Advanced analytics', 'API access', 'Dedicated support'] },
          ].map((p) => (
            <div key={p.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4"><span className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => <li key={f} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}
              </ul>
              <Link href="/signup" className="block text-center px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Stop Overpaying for HR Software</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Get employee management, payroll, time tracking, leave management, performance reviews,
          and AI-powered retention insights — all for less than Gusto charges for payroll alone.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Managing Your Team</Link>
      </section>
    </div>
  );
}
