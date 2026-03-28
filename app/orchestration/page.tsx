'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FAQS = [
  { q: 'What is workflow orchestration and why do I need it?', a: 'Workflow orchestration automates multi-step business processes — data pipelines, approval chains, API integrations, and scheduled tasks — so they run reliably without manual intervention. If you spend time copying data between systems or babysitting cron jobs, orchestration eliminates that overhead entirely.' },
  { q: 'How does Echo Orchestration differ from Zapier or Make?', a: 'Echo Orchestration runs on Cloudflare\'s edge network with sub-50ms latency worldwide, supports complex branching logic and parallel execution natively, and integrates directly with the entire Echo Prime ecosystem — engines, vault, knowledge forge, and 37,000+ MCP tools. No per-task pricing or arbitrary step limits.' },
  { q: 'Can I connect orchestration workflows to external APIs and services?', a: 'Yes. Any REST or GraphQL API is a first-class citizen. Built-in connectors exist for Stripe, Twilio, Slack, Discord, GitHub, Cloudflare Workers, AWS S3, Google Sheets, and dozens more. Custom HTTP steps let you integrate anything with an endpoint.' },
  { q: 'Is there a free tier or trial available?', a: 'The Engines marketplace includes a free tier with up to 500 orchestration runs per month. This covers most small-business and developer use cases. Pro and Enterprise tiers unlock unlimited runs, priority execution, dedicated queues, and SLA guarantees.' },
  { q: 'How do I monitor and debug orchestration workflows?', a: 'Every workflow execution produces a full audit trail with structured JSON logs, step-by-step timing, input/output snapshots, and error traces. The dashboard provides real-time run status, historical analytics, and one-click replay for failed runs.' },
  { q: 'Can orchestration workflows trigger AI engines automatically?', a: 'Absolutely. Orchestration is deeply integrated with Echo Engine Runtime. You can chain engine calls — tax analysis, document generation, sentiment scoring, title research — into a single automated pipeline that triggers on schedule, webhook, or event.' },
];

export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/engines'); }, [router]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Workflow Orchestration - Echo Prime Technologies</h1>
          <p>Automate multi-step business processes including data pipelines, approval chains, API integrations, and scheduled tasks on Cloudflare's edge network with sub-50ms latency. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Orchestration', href: '/orchestration' }]} />
      <FaqSchema faqs={FAQS} />
      <p>Redirecting...</p>

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
    </div>
  );
}
