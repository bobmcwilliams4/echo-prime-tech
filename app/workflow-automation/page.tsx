'use client';
import FaqSchema from '../../components/FaqSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'W', title: 'Multi-Step Workflows', desc: 'Chain unlimited steps with HTTP calls, transforms, conditions, delays, and AI' },
  { icon: 'H', title: 'Webhook Triggers', desc: 'Trigger workflows from any service via unique webhook URLs with signed payloads' },
  { icon: 'S', title: 'Scheduled Runs', desc: 'Run workflows on cron schedules — every minute, hour, day, or custom' },
  { icon: 'C', title: 'Conditional Logic', desc: 'Branch workflows with if/else conditions — equals, contains, greater than, exists' },
  { icon: 'A', title: 'AI-Powered Steps', desc: 'Add AI analysis, generation, or classification steps using 5,400+ engines' },
  { icon: 'I', title: '18 Echo Integrations', desc: 'Built-in connectors to every Echo product — CRM, Helpdesk, Invoice, and more' },
  { icon: 'T', title: 'Template Library', desc: 'Start from pre-built workflow templates for common business processes' },
  { icon: 'D', title: 'Data Transform', desc: 'Map and transform data between steps with template variables {{trigger.field}}' },
  { icon: 'R', title: 'Retry & Error Handling', desc: 'Auto-retry failed steps, skip errors, or stop — configurable per workflow' },
  { icon: 'L', title: 'Run History & Logs', desc: 'Full execution logs for every run — step timing, input/output, errors' },
  { icon: 'P', title: 'API-First Design', desc: 'Every feature accessible via REST API — build custom integrations or UIs' },
  { icon: 'M', title: 'Run Analytics', desc: 'Track success rates, average duration, top workflows, and daily trends' },
];

const COMPARE = [
  ['Feature', 'Echo Workflows', 'Zapier', 'Make'],
  ['Multi-step workflows', 'Yes', 'Yes', 'Yes'],
  ['Webhook triggers', 'Yes', 'Yes', 'Yes'],
  ['Scheduled triggers', 'Yes', 'Yes', 'Yes'],
  ['Conditional logic', 'Yes', 'Yes', 'Yes'],
  ['AI steps (built-in)', 'Yes (5,400+ engines)', 'Add-on', 'Add-on'],
  ['Echo ecosystem (18 apps)', 'Native', 'No', 'No'],
  ['Template library', 'Yes', 'Yes', 'Yes'],
  ['Data transform', 'Yes', 'Yes', 'Yes'],
  ['Error handling (retry/skip)', 'Yes', 'Pro+', 'Yes'],
  ['Run history', 'All plans', '7 days', '30 days'],
  ['API access', 'All plans', 'Professional+', 'Pro+'],
  ['Custom HTTP requests', 'Yes', 'Webhooks add-on', 'Yes'],
  ['Starting price', '$19/mo', '$29.99/mo', '$10.59/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['10 workflows', '500 runs/month', 'Webhook + manual triggers', '18 Echo integrations', 'Template library', 'Run history (30 days)'] },
  { name: 'Pro', price: '$49', per: '/mo', features: ['50 workflows', '5,000 runs/month', 'Scheduled triggers (cron)', 'AI-powered steps', 'Conditional branching', 'Priority support'], popular: true },
  { name: 'Business', price: '$129', per: '/mo', features: ['Unlimited workflows', '50,000 runs/month', 'Custom HTTP integrations', 'Advanced analytics', 'Retry & error handling', 'Dedicated support'] },
];

const EXAMPLES = [
  { name: 'New Lead to CRM + Email', steps: 'Form submission -> Create CRM contact -> Send welcome email -> Notify Slack' },
  { name: 'Invoice Overdue Alert', steps: 'Daily schedule -> Check overdue invoices -> AI draft reminder -> Send email -> Log to helpdesk' },
  { name: 'Support Ticket Routing', steps: 'Webhook from helpdesk -> AI categorize ticket -> Assign to team -> Send notification' },
  { name: 'Employee Onboarding', steps: 'HR new employee -> Create accounts -> Send welcome docs -> Schedule training -> Notify manager' },
];

const FAQS = [
  { q: 'What can I automate with Echo Workflows?', a: 'Anything that follows a trigger-action pattern: form submissions, email sequences, CRM updates, invoice generation, approval chains, data sync between tools, scheduled reports, and custom API integrations. If it has an API, you can automate it.' },
  { q: 'Do I need to write code?', a: 'No. The visual workflow builder uses drag-and-drop nodes with pre-built triggers and actions. For advanced users, custom JavaScript steps are available for complex transformations or API calls.' },
  { q: 'How does it compare to Zapier?', a: 'Echo Workflows runs on Cloudflare edge infrastructure — faster execution, lower latency, and no per-task pricing. You get unlimited workflow runs on all plans. Plus, native integration with all Echo products means zero-config connections.' },
  { q: 'Can workflows run on a schedule?', a: 'Yes. Trigger workflows on cron schedules (every minute, hourly, daily, weekly, custom). Perfect for report generation, data cleanup, sync jobs, or any recurring process.' },
  { q: 'What happens if a workflow step fails?', a: 'Built-in error handling with configurable retry logic (1-5 retries with exponential backoff). Failed steps trigger alert notifications. Full execution logs show exactly where and why a workflow failed.' },
  { q: 'Can I connect to external APIs?', a: 'Yes. HTTP request nodes support any REST API with custom headers, authentication, and request/response transformations. Store API keys securely in the credential vault — never exposed in workflow definitions.' },
];

export default function WorkflowAutomationPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'Workflow Automation', href: '/workflow-automation' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Workflow Automation</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Connect everything. Automate anything. Your AI-powered Zapier alternative.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=workflow-automation&tier=starter"  className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Example Workflows</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {EXAMPLES.map((ex) => (
            <div key={ex.name} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>{ex.name}</h3>
              <div className="flex flex-wrap gap-2">
                {ex.steps.split(' -> ').map((step, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span style={{ color: 'var(--ept-accent)' }}>&rarr;</span>}
                    <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{step}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Powerful Automation Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell.startsWith('Yes')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=workflow-automation&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Automate Your Business Today</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Connect everything. Automate anything. AI-powered workflows with 18 native Echo integrations. Free trial, no credit card required.</p>
        <TrialCTA serviceId="echo-workflow-automation" tier="starter" productName="Echo Workflow Automation" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
