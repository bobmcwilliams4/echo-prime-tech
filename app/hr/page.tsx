'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '\u{1F465}', title: 'Employee Management', desc: 'Centralized profiles with contact info, department, role, salary history, and documents. Search, filter, and manage your entire workforce from one screen.' },
  { icon: '\u{1F680}', title: 'Onboarding Workflows', desc: 'Automated onboarding checklists for new hires — equipment requests, policy acknowledgments, training schedules, and mentor assignments. Zero paperwork.' },
  { icon: '\u{1F3D6}\uFE0F', title: 'Time-Off Tracking', desc: 'Employees request PTO, sick leave, or parental leave. Managers approve in one click. Team calendar shows availability so nobody double-books.' },
  { icon: '\u{1F4CA}', title: 'Performance Reviews', desc: 'Structured review cycles with AI-generated summaries, goal tracking, peer feedback, and rating calibration. From draft to acknowledgment in minutes.' },
  { icon: '\u{1F3E2}', title: 'Org Charts', desc: 'Auto-generated organizational hierarchy from manager relationships. Click any node to see direct reports, open positions, and department stats.' },
  { icon: '\u{1F6E1}\uFE0F', title: 'Compliance & Audit', desc: 'Track certifications, mandatory training, policy sign-offs, and labor law compliance. Automated alerts before deadlines expire.' },
  { icon: '\u{1F4B0}', title: 'Benefits Administration', desc: 'Manage health plans, 401k enrollment, HSA contributions, and benefit elections. Employees compare plans and enroll during open windows.' },
  { icon: '\u{1F464}', title: 'Employee Self-Service', desc: 'Employees update personal info, download pay stubs, view benefits, request time off, and check review status — all without HR involvement.' },
];

const FAQS = [
  { q: 'How many employees can I manage?', a: 'The Starter plan supports up to 25 employees. Growth handles 150 employees with advanced analytics. Enterprise is unlimited with multi-location support and dedicated account management.' },
  { q: 'Does the system handle onboarding automatically?', a: 'Yes. Create onboarding templates with task checklists, document requirements, and training assignments. When a new hire is added, the workflow triggers automatically and tracks completion in real time.' },
  { q: 'How does time-off tracking work?', a: 'Employees submit requests specifying leave type, dates, and notes. Their manager receives a notification and can approve or deny with one click. Approved time-off syncs to the team calendar automatically.' },
  { q: 'Can the AI write performance reviews?', a: 'The AI review assistant analyzes employee goals, tenure, peer feedback, and prior reviews to generate a structured draft with ratings, strengths, and improvement areas. You edit and finalize before submission.' },
  { q: 'Is employee data secure?', a: 'All data is stored in encrypted Cloudflare infrastructure with tenant isolation. Write operations require authenticated API keys. We follow data minimization principles and never share employee information with third parties.' },
  { q: 'Can I export data for payroll or audits?', a: 'Yes. Export employee records, time-off reports, compensation data, and compliance logs in CSV or JSON. The Enterprise plan includes scheduled auto-exports and webhook integrations with payroll providers.' },
];

const PRICING = [
  { tier: 'Starter', price: 25, features: ['25 employees', 'Employee directory', 'Time-off requests', 'Basic onboarding', 'Document storage', 'Org chart'], cta: 'Start Free Trial', href: '/checkout?service=hr&tier=starter', popular: false },
  { tier: 'Growth', price: 79, features: ['150 employees', 'AI review assistant', 'Performance cycles', 'Benefits admin', 'Compliance tracking', 'Compensation analytics', 'Self-service portal', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=hr&tier=growth', popular: true },
  { tier: 'Enterprise', price: 199, features: ['Unlimited employees', 'Multi-location', 'Advanced AI analytics', 'Custom workflows', 'Webhook integrations', 'Scheduled exports', 'Priority support', 'Dedicated CSM'], cta: 'Contact Sales', href: '/checkout?service=hr&tier=enterprise', popular: false },
];

export default function HRPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'HR', href: '/hr' }]} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/engines" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>AI-POWERED HR SOFTWARE</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">People Management<br /><span className="gradient-text">Without the Overhead</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Onboarding, time-off, performance reviews, compliance, and benefits — all in one platform. AI handles the busywork so you can focus on your people.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=hr&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/hr-management" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Full Feature Breakdown</Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y py-12" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10 min', label: 'Setup Time' },
            { value: '80%', label: 'Less Admin Work' },
            { value: '24/7', label: 'Self-Service Access' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Everything Your HR Team Needs</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Eight core modules that replace a patchwork of spreadsheets and legacy tools.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-10 text-center">Up and Running in Three Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Import Your Team', desc: 'Upload a CSV or add employees manually. Departments, positions, and reporting lines are configured in minutes.' },
              { step: '2', title: 'Configure Policies', desc: 'Set time-off policies, review cycles, onboarding templates, and compliance requirements for your organization.' },
              { step: '3', title: 'Let AI Handle the Rest', desc: 'The system automates onboarding tasks, sends review reminders, tracks compliance deadlines, and generates analytics.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold mx-auto mb-4" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
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
              <div className="my-4"><span className="text-4xl font-extrabold">${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span></div>
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
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-3xl font-extrabold mb-4">Ready to Modernize Your HR?</h2>
          <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Start a free trial today. No credit card required. Set up in under 10 minutes.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/checkout?service=hr&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
            <Link href="/support" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Talk to Sales</Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
