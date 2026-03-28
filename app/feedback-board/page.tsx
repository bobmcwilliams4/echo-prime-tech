'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: 'F', title: 'Feature Requests', desc: 'Let users submit ideas with categories — feature, bug, improvement, question — and vote on what matters most' },
  { icon: 'V', title: 'Upvoting', desc: 'One-click voting with IP deduplication — see what your users actually want, ranked by demand' },
  { icon: 'R', title: 'Public Roadmap', desc: 'Share your product roadmap with quarters, status columns, and linked feature requests' },
  { icon: 'C', title: 'Changelogs', desc: 'Publish release notes and automatically close resolved feature requests when you ship' },
  { icon: 'S', title: 'Status Workflow', desc: 'Move requests through open, under review, planned, in progress, complete — with full history' },
  { icon: 'M', title: 'Merge Duplicates', desc: 'Combine duplicate requests and transfer votes — keep your board clean without losing signal' },
  { icon: 'B', title: 'Multiple Boards', desc: 'Separate boards for different products or teams — each with its own settings and visibility' },
  { icon: 'T', title: 'Threaded Comments', desc: 'Public discussion threads on every request — plus private internal notes for your team' },
  { icon: 'A', title: 'AI Insights', desc: 'AI summarizes feedback themes, most-requested features, and common pain points across your board' },
  { icon: 'P', title: 'Public & Private', desc: 'Make boards public for customer feedback or private for internal team ideation' },
  { icon: 'N', title: 'Notifications', desc: 'Subscribers get notified when requests they voted on change status or get completed' },
  { icon: 'D', title: 'Analytics Dashboard', desc: 'Track open vs completed, votes over time, top requests, and category breakdowns' },
];

const COMPARE = [
  ['Feature', 'Echo Feedback', 'Canny', 'UserVoice'],
  ['Feedback boards', 'Unlimited', '1 (Free)', '1 (Essential)'],
  ['Feature requests', 'Unlimited', 'Unlimited', 'Unlimited'],
  ['Upvoting', 'All plans', 'All plans', 'All plans'],
  ['Public roadmap', 'All plans', 'Growth+', 'Premium'],
  ['Changelogs', 'All plans', 'Growth+', 'No'],
  ['Status workflow', 'All plans', 'All plans', 'All plans'],
  ['Merge duplicates', 'All plans', 'Growth+', 'Premium'],
  ['Internal notes', 'All plans', 'Growth+', 'Premium'],
  ['AI insights', 'Pro+', 'No', 'No'],
  ['Custom branding', 'All plans', 'Business+', 'Premium'],
  ['API access', 'All plans', 'Growth+', 'Premium'],
  ['Starting price', '$12/mo', '$360/mo', '$799/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$12', per: '/mo', features: ['3 boards', 'Unlimited posts', 'Upvoting & comments', 'Public roadmap', 'Changelogs', 'Status workflow', 'Custom branding'] },
  { name: 'Pro', price: '$39', per: '/mo', features: ['10 boards', 'AI feedback insights', 'Internal notes', 'Merge duplicates', 'Custom domain', 'Email notifications', 'Priority support'], popular: true },
  { name: 'Business', price: '$99', per: '/mo', features: ['Unlimited boards', 'SSO integration', 'API access', 'Webhook notifications', 'White-label', 'Export data', 'Dedicated support'] },
];

const FAQS = [
  { q: 'How do users submit feedback?', a: 'Users visit your public feedback board (hosted on your custom domain or ours), create an account or post anonymously, and submit feature requests with a title and description. Other users upvote ideas they want.' },
  { q: 'Can I organize feedback by product area?', a: 'Yes. Create categories (e.g., "Mobile App", "Billing", "Integrations") and tags. Users can filter by category. You can also create separate boards for different products.' },
  { q: 'What is the roadmap feature?', a: 'A public or private roadmap shows what you are working on. Items move through stages: Under Review → Planned → In Progress → Completed. Users see that their feedback leads to action.' },
  { q: 'Can I use it for internal feedback?', a: 'Yes. Make boards private (visible only to your team) or restrict posting to authenticated users. Perfect for internal product teams, employee suggestions, or partner feedback programs.' },
  { q: 'How does AI help with feedback?', a: 'AI analyzes feedback text to detect sentiment, group similar requests automatically, identify trending topics, and suggest priority based on upvote velocity and user segment value.' },
  { q: 'Does it integrate with project management?', a: 'Yes. Connect feedback items to Jira, Linear, Asana, or any tool via webhooks. When a linked ticket is completed, the feedback item automatically moves to "Completed" and notifies upvoters.' },
];

export default function FeedbackBoardPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Feedback Board', href: '/feedback-board' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=feedback-board&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Feedback Board</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Know what to build next. Let your users vote.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=feedback-board&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Value Prop */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Stop Guessing, Start Listening</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Feature requests scattered across email, Slack, and support tickets? Centralize everything. Let users vote. Build what matters. Ship changelogs. Close the loop.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for Product Feedback</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Unlimited' || cell.startsWith('All') || cell.startsWith('$12')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=feedback-board&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Hear from Your Users?</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Centralize feature requests, let users vote, and build what matters.</p>
        <TrialCTA serviceId="echo-feedback-board" tier="starter" productName="Echo Feedback Board" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
