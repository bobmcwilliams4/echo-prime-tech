'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '📊', title: 'NPS Surveys', desc: 'One-click Net Promoter Score surveys with promoter/passive/detractor breakdown' },
  { icon: '⭐', title: 'CSAT Surveys', desc: 'Customer satisfaction ratings with configurable 5-point scales' },
  { icon: '📝', title: 'Custom Surveys', desc: 'Build any survey with multiple question types — rating, choice, text, NPS' },
  { icon: '🤖', title: 'AI Question Generator', desc: 'Generate relevant survey questions from a topic description using AI' },
  { icon: '🧠', title: 'AI Feedback Analysis', desc: 'Automatically analyze open-text responses for themes and sentiment' },
  { icon: '🔗', title: 'Public Survey Links', desc: 'Share surveys via slug-based URLs — no login required for respondents' },
  { icon: '📈', title: 'Real-Time Analytics', desc: 'Response trends, NPS scores, completion rates, and question-level breakdowns' },
  { icon: '🔔', title: 'Webhooks', desc: 'Get notified instantly when responses come in via configurable webhooks' },
  { icon: '🎨', title: 'Custom Branding', desc: 'Customize survey themes, thank-you messages, and redirect URLs' },
  { icon: '🔒', title: 'Anonymous Mode', desc: 'Collect anonymous or identified responses — your choice per survey' },
  { icon: '⏰', title: 'Scheduled Surveys', desc: 'Set start/end dates — surveys auto-close when they expire' },
  { icon: '🏢', title: 'Multi-Tenant', desc: 'Isolated data per organization with survey and response limits' },
];

const COMPARE = [
  ['Feature', 'Echo Surveys', 'SurveyMonkey', 'Typeform'],
  ['AI Question Generation', 'Yes', 'No', 'No'],
  ['AI Feedback Analysis', 'Yes', 'Add-on', 'No'],
  ['NPS Preset', 'Built-in', 'Premium', 'Yes'],
  ['CSAT Preset', 'Built-in', 'Premium', 'Yes'],
  ['API Access', 'All plans', 'Enterprise', 'Business+'],
  ['Custom Branding', 'All plans', 'Premium', 'Premium'],
  ['Webhooks', 'All plans', 'Enterprise', 'Business+'],
  ['Anonymous Surveys', 'Yes', 'Yes', 'Yes'],
  ['Response Analytics', 'Yes', 'Yes', 'Yes'],
  ['Auto-Close', 'Yes', 'Manual', 'Manual'],
  ['Multi-Tenant', 'Yes', 'No', 'No'],
  ['Starting Price', '$12/mo', '$25/mo', '$25/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$12', per: '/mo', features: ['10 surveys', '500 responses/mo', 'NPS & CSAT presets', 'AI questions', 'Basic analytics', 'Public links'] },
  { name: 'Pro', price: '$35', per: '/mo', features: ['50 surveys', '5,000 responses/mo', 'AI feedback analysis', 'Webhooks', 'Custom branding', 'Full analytics'], popular: true },
  { name: 'Business', price: '$89', per: '/mo', features: ['Unlimited surveys', 'Unlimited responses', 'Multi-tenant', 'White-label', 'API access', 'Priority support'] },
];

const FAQS = [
  { q: 'What question types are available?', a: 'Multiple choice, single choice, rating scale (1-5, 1-10, NPS), text (short/long), dropdown, matrix/grid, ranking, date picker, and file upload. New types added regularly.' },
  { q: 'Can I use skip logic?', a: 'Yes. Full conditional branching — show or hide questions, skip to specific pages, or end the survey based on any combination of previous answers. No coding required.' },
  { q: 'How do I distribute surveys?', a: 'Share via unique link, embed on your website (iframe or popup), send via email campaigns, or distribute through QR codes. Each distribution channel is tracked separately in analytics.' },
  { q: 'What analytics are included?', a: 'Real-time response dashboards with completion rates, average time, drop-off points, and cross-tabulation. Export raw data as CSV or JSON. AI-powered sentiment analysis on open-text responses.' },
  { q: 'Is there an NPS survey template?', a: 'Yes. Pre-built NPS (Net Promoter Score) template with automatic Promoter/Passive/Detractor categorization, trend tracking over time, and follow-up question branching based on score.' },
  { q: 'Can I white-label surveys?', a: 'Business and Enterprise plans include custom branding — your logo, colors, and domain. Remove all Echo branding. Surveys look like they come from your company.' },
];

export default function SurveysPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Surveys', href: '/surveys' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Surveys</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered feedback collection. Know what your customers really think.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=surveys&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Collect Feedback That Matters</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && cell === 'Yes' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=surveys&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Start Collecting Better Feedback</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered surveys with NPS, CSAT, and custom templates. Free trial, no credit card required.</p>
        <TrialCTA serviceId="echo-surveys" tier="starter" productName="Echo Surveys" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
