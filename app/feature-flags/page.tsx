'use client';

import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: '🚀', title: 'Boolean Flags', desc: 'Simple on/off toggles to instantly enable or disable features for all users or specific environments.' },
  { icon: '📊', title: 'Percentage Rollouts', desc: 'Gradually roll out features to 1–100% of users using deterministic hashing for consistent experiences.' },
  { icon: '🎯', title: 'Targeted Flags', desc: 'Target features by user ID, attributes, or custom rules. Show features to specific segments only.' },
  { icon: '📋', title: 'Targeting Rules', desc: 'Build rules with operators (eq, neq, in, contains, gt, lt) on any user attribute. Priority-based evaluation.' },
  { icon: '👤', title: 'User Overrides', desc: 'Override flag values for specific users with optional expiration dates. Perfect for beta testers and VIPs.' },
  { icon: '⚡', title: 'Instant Evaluation', desc: 'Evaluate multiple flags in a single API call with sub-10ms latency via edge caching on Cloudflare.' },
  { icon: '🔍', title: 'Full Audit Trail', desc: 'Every flag change is logged with old/new values, timestamps, and metadata. Complete change history.' },
  { icon: '🌍', title: 'Multi-Environment', desc: 'Separate flags for production, staging, and development. Test safely before shipping to all users.' },
  { icon: '💾', title: 'Edge Caching', desc: 'KV-backed caching with 60-second TTL for blazing-fast evaluations. Auto-invalidation on flag changes.' },
  { icon: '🔗', title: 'REST API', desc: 'Clean REST API for flag CRUD, rule management, overrides, evaluation, and audit queries.' },
  { icon: '📈', title: 'Usage Analytics', desc: 'Track evaluation counts, request volumes, and error rates. Real-time stats dashboard.' },
  { icon: '🛡️', title: 'Kill Switches', desc: 'Instantly disable any feature in production without a deploy. Soft-delete with full recovery.' },
];

const COMPARISON = [
  { feature: 'Boolean Flags', echo: true, launchdarkly: true, flagsmith: true, split: true },
  { feature: 'Percentage Rollouts', echo: true, launchdarkly: true, flagsmith: true, split: true },
  { feature: 'Targeting Rules', echo: true, launchdarkly: true, flagsmith: true, split: true },
  { feature: 'User Overrides', echo: true, launchdarkly: true, flagsmith: false, split: false },
  { feature: 'Deterministic Hashing', echo: true, launchdarkly: true, flagsmith: false, split: true },
  { feature: 'Multi-Environment', echo: true, launchdarkly: true, flagsmith: true, split: true },
  { feature: 'Full Audit Trail', echo: true, launchdarkly: true, flagsmith: true, split: false },
  { feature: 'Edge Caching', echo: true, launchdarkly: true, flagsmith: false, split: false },
  { feature: 'Auto Cache Invalidation', echo: true, launchdarkly: false, flagsmith: false, split: false },
  { feature: 'Override Expiration', echo: true, launchdarkly: false, flagsmith: false, split: false },
  { feature: 'Self-Hosted Option', echo: true, launchdarkly: false, flagsmith: true, split: false },
  { feature: 'Starting Price', echo: '$19/mo', launchdarkly: '$8.33/seat', flagsmith: '$45/mo', split: 'Custom' },
];

const TIERS = [
  { name: 'Starter', price: '$19', period: '/mo', desc: 'For small teams shipping faster.', features: ['Up to 25 flags', 'Boolean + percentage rollouts', '10,000 evaluations/day', 'Single environment', 'Full audit trail', 'REST API', 'Email support'] },
  { name: 'Growth', price: '$49', period: '/mo', desc: 'For teams with complex rollout needs.', features: ['Unlimited flags', 'Boolean + percentage + targeted', '500,000 evaluations/day', 'Multi-environment', 'Targeting rules engine', 'User overrides', 'Edge caching', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$149', period: '/mo', desc: 'For organizations with mission-critical releases.', features: ['Everything in Growth', '10M+ evaluations/day', 'Advanced analytics', 'Override expiration', 'Webhook notifications', 'SSO integration', 'SLA guarantee', 'Dedicated support'] },
];

const FAQS = [
  { q: 'How do percentage rollouts work?', a: 'Echo uses deterministic SHA-256 hashing on the combination of flag key and user ID. This means the same user always sees the same flag state, and you can gradually increase the percentage from 1% to 100% without disrupting existing users.' },
  { q: 'What are targeting rules?', a: 'Targeting rules let you evaluate flags based on user attributes. For example, show a feature only to users where plan equals "enterprise" or country is in "US,CA,UK". Rules support operators: equals, not equals, in, contains, greater than, and less than.' },
  { q: 'How fast are flag evaluations?', a: 'Flag values are cached at the edge using Cloudflare KV with a 60-second TTL. Most evaluations complete in under 5ms. You can evaluate multiple flags in a single API call for batch efficiency.' },
  { q: 'Can I override flags for specific users?', a: 'Yes. User overrides take highest priority in evaluation. You can set a specific flag value for any user, optionally with an expiration date. This is perfect for beta testers, internal dogfooding, or customer-specific features.' },
  { q: 'How does the audit trail work?', a: 'Every flag creation, update, deletion, and override is recorded with timestamps, old/new values, and metadata. You can query the audit log by flag key or time range for full compliance visibility.' },
  { q: 'How does this compare to LaunchDarkly?', a: 'Echo Feature Flags offers the same core capabilities — boolean flags, percentage rollouts, targeting rules, and audit trails — at a fraction of the cost. LaunchDarkly charges per seat ($8.33+/user/mo), while Echo charges a flat monthly rate starting at $19/mo for the whole team.' },
];

export default function FeatureFlagsPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Feature Flags', href: '/feature-flags' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=feature-flags&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>Ship Features with Confidence</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Feature Flags for<br /><span className="gradient-text">Fearless Releases</span></h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Boolean toggles, percentage rollouts, and targeted flags with a powerful rules engine. Ship features to 1% or 100% of users — and roll back instantly if anything goes wrong.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=feature-flags&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Controlled Releases</h2>
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

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>All the power of enterprise feature flags, without the enterprise price tag.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-3 px-4 font-semibold">Feature</th><th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th><th className="py-3 px-4 font-semibold">LaunchDarkly</th><th className="py-3 px-4 font-semibold">Flagsmith</th><th className="py-3 px-4 font-semibold">Split</th></tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.launchdarkly === 'boolean' ? (row.launchdarkly ? '✅' : '❌') : row.launchdarkly}</td>
                  <td className="py-3 px-4 text-center">{typeof row.flagsmith === 'boolean' ? (row.flagsmith ? '✅' : '❌') : row.flagsmith}</td>
                  <td className="py-3 px-4 text-center">{typeof row.split === 'boolean' ? (row.split ? '✅' : '❌') : row.split}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Flat Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat charges. No per-flag charges. One price for your whole team.</p>
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
              <Link href={`/checkout?service=feature-flags&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">Ready to Ship Features Fearlessly?</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Join teams releasing faster with controlled rollouts and instant kill switches.</p>
        <TrialCTA serviceId="echo-feature-flags" tier="starter" productName="Echo Feature Flags" />
      </section>
    </div>
  );
}
