'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: 'R', title: 'Review Collection', desc: 'Send automated review requests via email with branded landing pages. Customers leave reviews in one click — no login required' },
  { icon: 'S', title: 'AI Sentiment Analysis', desc: 'Every review is automatically analyzed for sentiment and scored. See positive/neutral/negative trends over time' },
  { icon: 'C', title: 'Campaign Management', desc: 'Create review request campaigns with custom timing, automatic reminders, and follow-up sequences' },
  { icon: 'W', title: 'Embeddable Widgets', desc: 'Showcase your best reviews anywhere with 5 widget styles: carousel, grid, list, badge, and floating' },
  { icon: 'A', title: 'AI Response Suggestions', desc: 'Get professional response suggestions for every review — thank positive reviewers and address negative feedback' },
  { icon: 'L', title: 'Multi-Location', desc: 'Track reviews and ratings separately for each business location with per-location analytics' },
  { icon: 'T', title: 'Competitor Tracking', desc: 'Monitor competitor ratings and review volume. Benchmark your reputation against the competition' },
  { icon: 'I', title: 'AI Insights', desc: 'Get automatic analysis of review trends: top strengths, areas for improvement, and actionable recommendations' },
  { icon: 'E', title: 'Review Request Emails', desc: 'Automated email campaigns with configurable delay, reminders, and expiration. Maximize response rates' },
  { icon: 'D', title: 'Analytics Dashboard', desc: 'Track review volume, average ratings, response rates, sentiment breakdown, and conversion over time' },
  { icon: 'X', title: 'Data Export', desc: 'Export all reviews as CSV or JSON. Your data is always portable — no lock-in' },
  { icon: 'V', title: 'Verified Reviews', desc: 'Reviews collected through request links are marked as verified — building trust with potential customers' },
];

const COMPARE = [
  ['Feature', 'Echo Reviews', 'Trustpilot', 'Podium'],
  ['Review collection emails', 'All plans', 'Paid plans', 'All plans'],
  ['AI sentiment analysis', 'All plans', 'Enterprise', 'No'],
  ['AI response suggestions', 'All plans', 'Enterprise', 'Paid add-on'],
  ['Embeddable widgets (5 types)', 'All plans', '1 type free', '1 type'],
  ['Multi-location', 'All plans', 'Paid plans', 'All plans'],
  ['Competitor tracking', 'All plans', 'Paid plans', 'No'],
  ['Review request campaigns', 'All plans', 'Paid plans', 'All plans'],
  ['Automatic reminders', 'All plans', 'Paid plans', 'All plans'],
  ['Custom branding', 'All plans', 'Enterprise', 'Paid plans'],
  ['AI trend insights', 'All plans', 'Enterprise', 'No'],
  ['API access', 'All plans', 'Enterprise', 'Enterprise'],
  ['Data export', 'All plans', 'Paid plans', 'Enterprise'],
  ['Revenue share / per-invite fees', '$0', '$0', '$0.10-0.25/invite'],
  ['Starting price', '$14/mo', '$259/mo', 'Contact sales'],
];

const TIERS = [
  { name: 'Starter', price: '$14', per: '/mo', features: ['1 location', '500 review requests/mo', 'AI sentiment analysis', 'AI response suggestions', 'Embeddable widgets', 'Review campaigns', 'Auto reminders', 'Analytics dashboard'] },
  { name: 'Growth', price: '$39', per: '/mo', features: ['5 locations', '5,000 review requests/mo', 'Competitor tracking', 'AI trend insights', 'Custom branding', 'API access', 'Data export', 'Priority support'], popular: true },
  { name: 'Scale', price: '$99', per: '/mo', features: ['Unlimited locations', 'Unlimited requests', 'White-label widgets', 'Custom domains', 'Webhook integrations', 'Bulk import', 'Dedicated support', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'How quickly can I start collecting reviews?', a: 'You can send your first review request within 5 minutes of signing up. Just import your customer list or connect your CRM, and Echo Reviews handles the rest — automated emails, branded landing pages, and one-click review submission.' },
  { q: 'Do customers need to create an account to leave a review?', a: 'No. Customers click the link in the email and leave their review directly — no login, no signup, no friction. This dramatically increases your response rate compared to platforms that require accounts.' },
  { q: 'How does AI sentiment analysis work?', a: 'Every review is automatically scored for positive, neutral, or negative sentiment using our proprietary AI. You get trend charts over time, automatic flagging of negative reviews, and AI-generated response suggestions for every review.' },
  { q: 'Can I embed reviews on my existing website?', a: 'Yes. One line of JavaScript gives you 5 widget styles: carousel, grid, list, badge, and floating. Each widget auto-filters by rating, supports light/dark/auto themes, and works on any website or CMS.' },
  { q: 'How does Echo Reviews compare to Trustpilot or Podium?', a: 'Echo Reviews includes AI sentiment analysis, AI response suggestions, competitor tracking, and 5 widget types on all plans — features that competitors lock behind enterprise tiers. Our Starter plan at $14/mo delivers more than most competitors at $250+/mo.' },
  { q: 'Can I track reviews across multiple business locations?', a: 'Yes, all plans support multi-location tracking. Each location gets its own analytics, ratings, and review volume tracking. The Growth and Scale plans include advanced per-location reporting and benchmarking.' },
];

export default function ReviewsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Reviews', href: '/reviews' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=reviews&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Reviews</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Turn happy customers into your best marketing.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=reviews&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Collecting Reviews</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>90% of Customers Read Reviews Before Buying</h3>
          <p style={{ color: 'var(--ept-text-secondary)' }}>Most businesses leave reviews to chance. Echo Reviews automates the entire process — send review requests after every transaction, analyze sentiment with AI, generate professional responses, and showcase your best reviews with embeddable widgets. More reviews = more trust = more revenue.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Embed Your Reviews Anywhere</h3>
          <div className="p-4 rounded-lg font-mono text-sm overflow-x-auto" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-accent)' }}>
            {'<script src="https://echo-reviews.bmcii1976.workers.dev/widget.js?id=YOUR_WIDGET_ID"></script>'}
          </div>
          <p className="text-sm mt-3" style={{ color: 'var(--ept-text-muted)' }}>One line of code. 5 widget styles (carousel, grid, list, badge, floating). Auto-filters by rating. Light/dark/auto theme. Works on any website.</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for Reputation Management</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell.startsWith('All') || cell.startsWith('$14') || cell === '$0') ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=reviews&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

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

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
