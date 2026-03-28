'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { title: 'Visual Workflow Builder', desc: 'Create automation workflows with drag-and-drop steps. Supports actions, conditions, notifications, AI analysis, webhooks, and delays.' },
  { title: 'Multi-Step Execution', desc: 'Run workflows with ordered steps, each with its own type and failure handling. Steps execute sequentially with full result tracking.' },
  { title: 'Trigger Types', desc: 'Start workflows manually, on a schedule (cron), or via webhooks. External systems can trigger workflows through unique webhook URLs.' },
  { title: 'AI-Powered Steps', desc: 'Add AI analysis steps that query the Engine Runtime for intelligent decisions, document analysis, or data classification within your workflow.' },
  { title: 'Webhook Integrations', desc: 'Connect to any external API with webhook steps. Configure HTTP method, headers, and payload for outbound calls to Slack, Zapier, or custom APIs.' },
  { title: 'Notification Steps', desc: 'Send emails at any point in the workflow via the Email Sender integration. Notify teams on completion, failure, or specific conditions.' },
  { title: 'Conditional Logic', desc: 'Add condition steps with JSON-based rules. Branch workflow execution based on data values, previous step results, or custom expressions.' },
  { title: 'Templates Library', desc: 'Pre-built workflow templates for common automations. Create workflows from templates with one click, or build your own reusable templates.' },
  { title: 'Run History', desc: 'Complete execution logs for every workflow run. Track status, duration, step-by-step results, and error messages for debugging.' },
  { title: 'Failure Handling', desc: 'Configure per-step failure behavior: stop the workflow, skip to next step, or retry. Prevent cascading failures in complex automations.' },
  { title: 'Analytics Dashboard', desc: 'Track total runs, success rates, failure rates, and daily execution counts. Identify bottlenecks and optimize your automations.' },
  { title: 'Scheduled Execution', desc: 'Cron-based scheduling runs workflows automatically every 5 minutes. Set up daily reports, hourly checks, or custom intervals.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', zapier: '$29/mo', make: '$10.59/mo', echo: '$19/mo' },
  { feature: 'Workflows', zapier: '5 (starter)', make: '2 (free)', echo: '5 (starter)' },
  { feature: 'Runs/Month', zapier: '750', make: '1,000', echo: 'Unlimited' },
  { feature: 'AI Steps', zapier: 'Add-on ($)', make: 'Limited', echo: 'Built-in (free)' },
  { feature: 'Webhook Triggers', zapier: 'Yes', make: 'Yes', echo: 'Yes' },
  { feature: 'Conditional Logic', zapier: 'Yes', make: 'Yes', echo: 'Yes (JSON)' },
  { feature: 'Templates', zapier: '6,000+', make: '1,000+', echo: 'Growing' },
  { feature: 'Multi-Tenant', zapier: 'No', make: 'No', echo: 'Yes' },
  { feature: 'Self-Hostable', zapier: 'No', make: 'No', echo: 'Cloudflare' },
  { feature: 'Per-Task Pricing', zapier: 'Yes ($$$)', make: 'Yes', echo: 'No (flat)' },
  { feature: 'API Access', zapier: 'Enterprise', make: 'Yes', echo: 'All plans' },
];

const PRICING = [
  { name: 'Starter', price: '$19', period: '/mo', features: ['5 workflows', '100 runs/day', 'Manual + scheduled triggers', 'Basic step types', 'Run history (7 days)', 'Email notifications'] },
  { name: 'Pro', price: '$49', period: '/mo', features: ['25 workflows', 'Unlimited runs', 'Webhook triggers', 'AI analysis steps', 'Templates library', 'Run history (90 days)', 'Conditional logic', 'API access'] },
  { name: 'Business', price: '$129', period: '/mo', features: ['Unlimited workflows', 'Unlimited runs', 'All trigger types', 'All step types', 'Custom templates', 'Run history (unlimited)', 'Priority support', 'Webhook integrations', 'Analytics dashboard'] },
];

const FAQS = [
  { q: 'What types of steps can I add to a workflow?', a: 'Echo Workflows supports 6 step types: Action (custom logic), Condition (branching), Notification (email), AI Analyze (Engine Runtime query), Webhook (HTTP calls), and Delay (timed pause). Each step has configurable failure handling.' },
  { q: 'How does the AI analysis step work?', a: 'AI steps send a prompt to the Engine Runtime, which has access to 5,400+ specialized engines and 600K+ doctrines. You can analyze documents, classify data, generate summaries, or make intelligent decisions within your workflow — no external AI subscription needed.' },
  { q: 'Can I trigger workflows from external systems?', a: 'Yes. Every workflow with webhook trigger type gets a unique URL. POST to that URL from Slack, GitHub, Stripe, or any system. The webhook payload becomes the workflow input data, accessible to all steps.' },
  { q: 'What happens when a step fails?', a: 'Each step has configurable failure handling: "stop" halts the entire workflow, "skip" continues to the next step, or "retry" attempts the step again. Failed runs are logged with full error details for debugging.' },
  { q: 'How do templates work?', a: 'Templates are pre-configured workflow blueprints with steps already defined. Click "Create from Template" to instantly generate a new workflow with all steps pre-populated. Customize as needed, then activate.' },
  { q: 'Is there a limit on run history?', a: 'Starter plans retain 7 days of run history. Pro retains 90 days. Business and Enterprise plans have unlimited history retention for compliance and auditing.' },
];

export default function WorkflowsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Workflows', href: '/workflows' }]} />
      <FaqSchema faqs={FAQS} />
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
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>WORKFLOW AUTOMATION</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Automate Anything with<br /><span className="gradient-text">AI-Powered Workflows</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Build multi-step automations with triggers, conditions, AI analysis, webhooks, and notifications. No code required. Flat pricing — no per-task fees.</p>
        <div className="flex justify-center gap-4">
          <Link href="/checkout?service=workflows&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Automating — $19/mo</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Everything You Need to Automate</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo Workflows vs Zapier vs Make</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">Zapier</th><th className="p-3 text-center font-bold">Make</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
            <tbody>{COMPARISON.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="p-3 font-medium">{r.feature}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.zapier}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.make}</td><td className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Flat Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: i === 1 ? 2 : 1 }}>
              {i === 1 && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="my-4"><span className="text-4xl font-extrabold">{p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{p.period}</span></div>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map((f, j) => <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=workflows&tier=${p.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>Get Started</Link>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Ready to Automate?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Start your free trial and build your first workflow in minutes.</p>
        <TrialCTA serviceId="echo-workflows" tier="starter" productName="Echo Workflows" />
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
