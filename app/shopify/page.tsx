'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { q: 'How does it connect to my Shopify store?', a: 'Install the app from our dashboard, authenticate via Shopify OAuth, and your catalog syncs automatically. Products, orders, customers, and inventory all sync in real-time via the Admin API and webhooks.' },
  { q: 'What AI features are included?', a: 'AI product recommendations, smart pricing suggestions, automated product descriptions, customer segmentation, demand forecasting, and inventory optimization — all powered by the Echo Engine Runtime.' },
  { q: 'Does it work with Shopify Plus?', a: 'Yes. Full Storefront API and Admin API support, including custom checkout flows, B2B features, and multi-location inventory. Enterprise plan includes dedicated support for Shopify Plus stores.' },
  { q: 'How often does catalog sync?', a: 'Real-time webhooks for orders and inventory changes. Full catalog sync every 6 hours via cron. Manual sync available anytime through the dashboard.' },
]

const features = [
  { title: 'Catalog Sync', desc: 'Automatic product sync via Storefront and Admin APIs. Products, variants, images, and inventory stay perfectly in sync.' },
  { title: 'AI Recommendations', desc: 'Smart product recommendations based on browsing behavior, purchase history, and similar customer patterns.' },
  { title: 'Smart Checkout', desc: 'Optimized checkout flows with AI-driven upsells, cross-sells, and cart recovery — powered by conversion data.' },
  { title: 'Order Management', desc: 'Unified order dashboard with fulfillment tracking, return processing, and automated customer notifications.' },
  { title: 'Inventory Intelligence', desc: 'AI demand forecasting predicts stockouts before they happen. Automatic reorder point calculations.' },
  { title: 'Webhook Processing', desc: 'Real-time webhook handling for orders, products, customers, and fulfillment events. Never miss a beat.' },
  { title: 'Customer Segmentation', desc: 'AI clusters customers by behavior, lifetime value, and purchase patterns. Target segments with personalized campaigns.' },
  { title: 'AI Product Descriptions', desc: 'Generate SEO-optimized product descriptions from images and bullet points. A/B test descriptions for conversion.' },
  { title: 'Multi-Location', desc: 'Support for multiple warehouse locations with intelligent routing and inventory allocation.' },
  { title: 'Analytics Dashboard', desc: 'Revenue, conversion, AOV, and customer LTV metrics with trend analysis and competitor benchmarking.' },
  { title: 'Discount Engine', desc: 'Create and manage discounts, bundles, and loyalty rewards with AI-optimized pricing strategies.' },
  { title: 'Edge Performance', desc: 'Cloudflare Workers serve storefront data with sub-50ms latency globally. Your store stays fast.' },
]

const comparison = [
  { feature: 'AI recommendations', echo: 'Engine-backed', shopifyai: 'Basic', nosto: 'ML-based', klaviyo: 'Email only' },
  { feature: 'Smart checkout', echo: 'AI upsells', shopifyai: 'Shopify Plus', nosto: 'Pop-ups', klaviyo: 'No' },
  { feature: 'Inventory forecast', echo: 'AI demand prediction', shopifyai: 'No', nosto: 'No', klaviyo: 'No' },
  { feature: 'Product descriptions', echo: 'AI generated + A/B', shopifyai: 'Basic AI', nosto: 'No', klaviyo: 'Email copy' },
  { feature: 'Customer segments', echo: 'AI clustering', shopifyai: 'Manual', nosto: 'Segments', klaviyo: 'Yes' },
  { feature: 'Webhook processing', echo: 'Real-time', shopifyai: 'Built-in', nosto: 'Limited', klaviyo: 'Yes' },
  { feature: 'Multi-location', echo: 'Full support', shopifyai: 'Plus only', nosto: 'No', klaviyo: 'No' },
  { feature: 'Knowledge engines', echo: '2,600+ domains', shopifyai: 'No', nosto: 'No', klaviyo: 'No' },
  { feature: 'Edge performance', echo: 'Cloudflare Workers', shopifyai: 'Shopify CDN', nosto: 'Cloud', klaviyo: 'Cloud' },
  { feature: 'Starting price', echo: '$39/mo', shopifyai: 'Included', nosto: '$99/mo', klaviyo: '$20/mo' },
]

export default function ShopifyPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#96bf48'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Echo Shopify — AI-Powered Shopify Integration & E-commerce Automation</h1><p>Supercharge your Shopify store with AI-powered product recommendations, automated catalog sync, smart checkout optimization, and real-time analytics. Features include automatic product sync via Storefront and Admin APIs, smart product recommendations based on browsing and purchase behavior, optimized checkout flows with AI-driven upsells and cross-sells, unified order management with fulfillment tracking, AI demand forecasting to predict stockouts, real-time webhook processing for orders and inventory, customer segmentation by behavior and lifetime value, AI-generated SEO-optimized product descriptions, multi-location inventory support, revenue and conversion analytics, discount engine with AI-optimized pricing, and edge performance via Cloudflare Workers. Pricing from $39/mo.</p></div></noscript>
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #96bf48, #5c8a26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Shopify</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Supercharge your Shopify store with AI. Product recommendations, smart checkout, inventory forecasting, and automated descriptions — all powered by 2,600+ knowledge engines.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=shopify&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>AI-Powered E-commerce</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Shopify AI</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Nosto</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Klaviyo</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.shopifyai}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.nosto}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.klaviyo}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$39', period: '/mo', features: ['1 Shopify store', 'Catalog sync', 'Basic recommendations', 'Order dashboard', 'Webhook processing', 'Email support'], cta: 'starter' },
              { tier: 'Growth', price: '$99', period: '/mo', features: ['3 stores', 'AI recommendations', 'Smart checkout', 'AI product descriptions', 'Inventory forecast', 'Customer segments', 'Analytics', 'Priority support'], cta: 'growth', popular: true },
              { tier: 'Enterprise', price: '$249', period: '/mo', features: ['Unlimited stores', 'All AI features', 'Multi-location', 'Discount engine', 'Custom integrations', 'API access', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=shopify&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.q} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.q}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.a}</p></details>))}
        </section>
      </div>
    </>
  )
}
