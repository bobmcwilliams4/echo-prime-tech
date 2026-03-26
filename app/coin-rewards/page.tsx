'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { question: 'How does the token economy work?', answer: 'Users earn Echo Coins for actions you define — purchases, referrals, reviews, engagement, milestones. Coins are redeemable for discounts, exclusive content, upgrades, or custom rewards. The exchange rate and reward catalog are fully customizable.' },
  { question: 'What makes the AI personalization special?', answer: 'AI analyzes each user behavior pattern to serve the right reward at the right time. A frequent buyer gets loyalty bonuses. An inactive user gets re-engagement offers. A social sharer gets referral multipliers. Every user gets a unique incentive strategy.' },
  { question: 'Can I integrate with my existing platform?', answer: 'Yes. JavaScript SDK for web apps, REST API for backends, webhook events for any system. Pre-built integrations for Shopify, WooCommerce, and Stripe. Embed reward widgets or build custom UIs.' },
  { question: 'How does referral tracking work?', answer: 'Unique referral codes per user with multi-level tracking. Referrers earn coins when their invites sign up, make first purchase, or hit milestones. AI optimizes referral incentives based on network effects and conversion data.' },
]

const features = [
  { title: 'Token Economy', desc: 'Fully customizable coin system. Define earning rules, exchange rates, and expiration policies. Users see real-time balances and transaction history.' },
  { title: 'AI Personalization', desc: 'Machine learning optimizes rewards per user. Behavioral segmentation identifies which incentives drive action for each customer type.' },
  { title: 'Gamification Engine', desc: 'Levels, badges, streaks, leaderboards, and challenges. Turn customer engagement into a game that drives repeat behavior.' },
  { title: 'Referral Multipliers', desc: 'Multi-level referral tracking with customizable reward tiers. AI optimizes referral incentive amounts based on conversion and LTV data.' },
  { title: 'Reward Catalog', desc: 'Create a catalog of redeemable rewards — discounts, free products, exclusive content, early access, or custom perks. Manage inventory and availability.' },
  { title: 'Engagement Triggers', desc: 'Award coins for any user action — purchases, reviews, social shares, profile completion, anniversaries, or custom events via API.' },
  { title: 'Embeddable Widgets', desc: 'Drop-in reward widgets for your website. Show coin balance, available rewards, leaderboard position, and referral links.' },
  { title: 'Streak System', desc: 'Reward consecutive daily/weekly actions with streak multipliers. Broken streaks trigger re-engagement nudges.' },
  { title: 'Tier System', desc: 'Bronze, Silver, Gold, Platinum — or custom tier names. Each tier unlocks better earning rates, exclusive rewards, and VIP perks.' },
  { title: 'Analytics Dashboard', desc: 'Track coin circulation, reward redemption rates, top earners, referral networks, and ROI of your loyalty program.' },
  { title: 'Anti-Fraud', desc: 'AI detects coin farming, fake referrals, and reward abuse. Velocity limits and behavioral analysis prevent exploitation.' },
  { title: 'API + Webhooks', desc: 'Full REST API for point management. Webhooks for coin events. JavaScript SDK for client-side integration.' },
]

const comparison = [
  { feature: 'AI personalization', echo: 'Per-user ML', smile: 'Basic segments', loyaltylion: 'Rules only', yotpo: 'Basic segments' },
  { feature: 'Gamification', echo: 'Levels+badges+streaks', smile: 'Points+VIP', loyaltylion: 'Points+tiers', yotpo: 'Points+referrals' },
  { feature: 'Referral tracking', echo: 'Multi-level + AI', smile: 'Single level', loyaltylion: 'Single level', yotpo: 'Single level' },
  { feature: 'Reward catalog', echo: 'Custom + inventory', smile: 'Discounts', loyaltylion: 'Discounts+products', yotpo: 'Discounts' },
  { feature: 'Streak system', echo: 'Streaks + multipliers', smile: 'No', loyaltylion: 'No', yotpo: 'No' },
  { feature: 'Anti-fraud AI', echo: 'Behavioral analysis', smile: 'Basic limits', loyaltylion: 'Manual review', yotpo: 'Basic limits' },
  { feature: 'Embeddable widgets', echo: 'Full customizable', smile: 'Launcher widget', loyaltylion: 'Popup widget', yotpo: 'Widget' },
  { feature: 'Tier system', echo: 'Unlimited custom', smile: '3 VIP tiers', loyaltylion: 'Custom tiers', yotpo: '3 VIP tiers' },
  { feature: 'Analytics', echo: 'ROI + network graph', smile: 'Basic dashboard', loyaltylion: 'Reports', yotpo: 'Dashboard' },
  { feature: 'API access', echo: 'Full REST + webhooks', smile: 'Limited API', loyaltylion: 'Full API', yotpo: 'API' },
  { feature: 'Starting price', echo: '$29/mo', smile: '$49/mo', loyaltylion: '$159/mo', yotpo: '$79/mo' },
]

export default function CoinRewardsPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#eab308'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #eab308, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Coin Rewards</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered loyalty with token economy, gamification, and personalized rewards. Turn customers into superfans with streaks, levels, referrals, and smart incentives.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=coin-rewards&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Loyalty That Actually Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Smile.io</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>LoyaltyLion</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Yotpo</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.smile}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.loyaltylion}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.yotpo}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['500 active members', 'Points + referrals', '3 rewards', 'Basic widget', 'Email support'], cta: 'starter' },
              { tier: 'Growth', price: '$79', period: '/mo', features: ['5,000 members', 'AI personalization', 'Gamification engine', 'Streak system', 'Custom tiers', 'Referral multipliers', 'Full analytics', 'Priority support'], cta: 'growth', popular: true },
              { tier: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited members', 'All AI features', 'Anti-fraud detection', 'Custom reward catalog', 'White-label widgets', 'Multi-store', 'API + webhooks', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=coin-rewards&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
