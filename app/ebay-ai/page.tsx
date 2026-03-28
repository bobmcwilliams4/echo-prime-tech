'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does AI listing optimization work?', answer: 'AI analyzes top-performing listings in your category and generates optimized titles (80-char SEO), descriptions, item specifics, and pricing. It studies what sells and adapts your listings to match winning patterns.' },
  { question: 'What is dynamic repricing?', answer: 'AI monitors competitor prices and adjusts yours in real-time to win the Buy Box while maximizing profit. Set floor prices and margin targets — the AI handles everything else. Repricing runs 24/7.' },
  { question: 'Can it manage inventory across channels?', answer: 'Yes. Sync inventory between eBay, your Shopify store, Amazon, and local warehouse. When an item sells on one channel, stock updates everywhere automatically to prevent overselling.' },
  { question: 'How does competitor analysis work?', answer: 'AI tracks competitor listings: pricing changes, sold quantities, listing strategies, and sell-through rates. Get alerts when competitors undercut you and automated response strategies.' },
]

const features = [
  { title: 'AI Listing Generator', desc: 'Generate optimized eBay titles, descriptions, and item specifics from product photos. SEO-optimized for eBay search algorithm.' },
  { title: 'Dynamic Repricing', desc: 'AI adjusts prices in real-time based on competition, demand, and your margin targets. Win more Buy Boxes without race-to-bottom pricing.' },
  { title: 'Competitor Intelligence', desc: 'Track competitor pricing, sold quantities, listing changes, and strategies. Get alerts and automated responses to competitive moves.' },
  { title: 'Bulk Listing Tools', desc: 'List hundreds of items at once with CSV import, template-based listing, and bulk edit. Clone and modify existing listings in seconds.' },
  { title: 'Inventory Sync', desc: 'Multi-channel inventory management. Sync stock between eBay, Shopify, Amazon, and your warehouse. Zero overselling risk.' },
  { title: 'Sales Analytics', desc: 'Revenue, profit margins, sell-through rates, best-selling categories, peak selling times, and buyer demographics in real-time dashboards.' },
  { title: 'Photo Enhancement', desc: 'AI auto-enhances product photos: background removal, brightness correction, and watermark addition. Professional-looking listings every time.' },
  { title: 'Shipping Calculator', desc: 'AI calculates optimal shipping rates across carriers. Suggest free shipping thresholds that increase conversion without eating margins.' },
  { title: 'Returns Management', desc: 'Automated return handling with AI-generated responses. Track return rates by product and identify quality issues before they become trends.' },
  { title: 'Promoted Listings AI', desc: 'AI manages eBay Promoted Listings campaigns. Optimize ad spend based on sell-through rates and profit margins, not just clicks.' },
  { title: 'eBay SEO Score', desc: 'Score your listings on 15 eBay SEO factors. Get specific recommendations to improve search ranking and visibility.' },
  { title: 'Profit Calculator', desc: 'Real-time profit calculation after eBay fees, shipping costs, and payment processing. Know your true margin on every sale.' },
]

const comparison = [
  { feature: 'AI listings', echo: 'Full generation + SEO', inkfrog: 'Templates only', sellercloud: 'No', terapeak: 'Research only' },
  { feature: 'Dynamic repricing', echo: 'AI + margin targets', inkfrog: 'No', sellercloud: 'Basic rules', terapeak: 'No' },
  { feature: 'Competitor tracking', echo: 'AI analysis + alerts', inkfrog: 'No', sellercloud: 'No', terapeak: 'Market research' },
  { feature: 'Photo enhancement', echo: 'AI auto-enhance', inkfrog: 'No', sellercloud: 'No', terapeak: 'No' },
  { feature: 'Multi-channel sync', echo: 'eBay+Shopify+Amazon', inkfrog: 'eBay only', sellercloud: 'Yes', terapeak: 'No' },
  { feature: 'Bulk listing', echo: 'CSV + templates + clone', inkfrog: 'Yes', sellercloud: 'Yes', terapeak: 'No' },
  { feature: 'Promoted Listings AI', echo: 'AI campaign optimizer', inkfrog: 'No', sellercloud: 'No', terapeak: 'No' },
  { feature: 'SEO scoring', echo: '15-factor analysis', inkfrog: 'No', sellercloud: 'No', terapeak: 'Keyword research' },
  { feature: 'Profit calculator', echo: 'Real-time per-item', inkfrog: 'Basic', sellercloud: 'Yes', terapeak: 'No' },
  { feature: 'Returns automation', echo: 'AI responses', inkfrog: 'No', sellercloud: 'Manual', terapeak: 'No' },
  { feature: 'Starting price', echo: '$29/mo', inkfrog: '$11/mo', sellercloud: '$99/mo', terapeak: '$13/mo' },
]

export default function EbayAiPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#0064d2'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'eBay AI', href: '/ebay-ai' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #0064d2, #e53238, #f5af02, #86b817)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo eBay AI</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered eBay selling. Automated listings, dynamic repricing, competitor intelligence, and sales analytics — sell smarter, not harder.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=ebay-ai&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Sell Smarter On eBay</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Inkfrog</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>SellerCloud</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Terapeak</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.inkfrog}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.sellercloud}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.terapeak}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['100 active listings', 'AI listing generator', 'Basic repricing', 'Sales dashboard', 'Profit calculator', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$79', period: '/mo', features: ['1,000 listings', 'Dynamic repricing AI', 'Competitor tracking', 'Photo enhancement', 'Bulk listing tools', 'Promoted Listings AI', 'Multi-channel sync', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited listings', 'All AI features', 'Returns automation', 'eBay SEO scoring', 'Team management', 'API access', 'Custom integrations', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=ebay-ai&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
