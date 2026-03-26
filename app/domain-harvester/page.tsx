'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'

const faqs = [
  { question: 'What does domain monitoring include?', answer: 'Real-time WHOIS change detection, DNS record monitoring, SSL certificate tracking, nameserver changes, registrar transfers, and expiration alerts. Every change is logged with before/after diffs.' },
  { question: 'How does brand protection work?', answer: 'AI scans new domain registrations for typosquatting, homoglyph attacks, and brand impersonation. Get alerted within hours when someone registers a domain similar to yours — before they can use it for phishing.' },
  { question: 'Can it find expiring domains?', answer: 'Yes. Track domains in your niche as they approach expiration. Set alerts for premium domains, competitor domains, or keyword-rich domains entering the drop cycle. Integrates with registrar APIs for instant acquisition.' },
  { question: 'How many domains can I monitor?', answer: 'Starter plan tracks 100 domains, Professional handles 1,000, and Enterprise is unlimited. Bulk import via CSV or API. Add entire competitor portfolios with one click.' },
]

const features = [
  { title: 'WHOIS Monitoring', desc: 'Track ownership changes, registrar transfers, nameserver updates, and expiration dates across all TLDs. Instant alerts on any change.' },
  { title: 'Brand Protection', desc: 'AI detects typosquatting, homoglyph attacks, and phishing domains targeting your brand. Alert within hours of registration.' },
  { title: 'DNS Tracking', desc: 'Monitor A, AAAA, CNAME, MX, TXT, and NS records. Detect unauthorized changes, hijacking attempts, and misconfigurations.' },
  { title: 'Expiring Domain Alerts', desc: 'Track premium domains approaching expiration. Set keyword filters and get notified before they hit the drop market.' },
  { title: 'SSL Certificate Monitor', desc: 'Track certificate issuance, expiration, and changes. Detect unauthorized certificates issued for your domains.' },
  { title: 'Competitor Intelligence', desc: 'Monitor competitor domain portfolios. Track new registrations, redirects, and infrastructure changes.' },
  { title: 'Bulk Domain Import', desc: 'Import thousands of domains via CSV, API, or registrar integration. Monitor entire portfolios effortlessly.' },
  { title: 'Historical WHOIS Data', desc: 'Full WHOIS history for any domain. See ownership changes, registrar transfers, and nameserver history over time.' },
  { title: 'Subdomain Discovery', desc: 'Enumerate and monitor subdomains for any domain. Discover hidden services, staging environments, and shadow IT.' },
  { title: 'Registrar API Integration', desc: 'Direct integration with GoDaddy, Namecheap, Cloudflare, and major registrars for instant domain acquisition.' },
  { title: 'Webhook Alerts', desc: 'Real-time webhook notifications to Slack, Discord, email, or any HTTP endpoint when monitored domains change.' },
  { title: 'Domain Valuation', desc: 'AI-powered domain value estimation based on length, keywords, TLD, backlinks, traffic history, and comparable sales.' },
]

const comparison = [
  { feature: 'WHOIS monitoring', echo: 'All TLDs real-time', domaintools: 'Enterprise only', securitytrails: 'API access', whoisxml: 'API access' },
  { feature: 'Brand protection', echo: 'AI typosquatting', domaintools: 'Yes', securitytrails: 'Limited', whoisxml: 'Basic' },
  { feature: 'DNS tracking', echo: 'Full record types', domaintools: 'Yes', securitytrails: 'Yes', whoisxml: 'Yes' },
  { feature: 'Expiring alerts', echo: 'Keyword + AI filter', domaintools: 'No', securitytrails: 'No', whoisxml: 'No' },
  { feature: 'SSL monitoring', echo: 'CT log + cert', domaintools: 'Yes', securitytrails: 'No', whoisxml: 'Basic' },
  { feature: 'Subdomain discovery', echo: 'Enumeration + monitor', domaintools: 'Yes', securitytrails: 'Yes', whoisxml: 'Limited' },
  { feature: 'Domain valuation', echo: 'AI-powered', domaintools: 'No', securitytrails: 'No', whoisxml: 'No' },
  { feature: 'Registrar integration', echo: '4+ registrars', domaintools: 'No', securitytrails: 'No', whoisxml: 'No' },
  { feature: 'Webhook alerts', echo: 'Slack + Discord + HTTP', domaintools: 'Email only', securitytrails: 'Webhook', whoisxml: 'Email' },
  { feature: 'Historical WHOIS', echo: 'Full history', domaintools: 'Premium', securitytrails: 'Yes', whoisxml: 'Premium' },
  { feature: 'Starting price', echo: '$29/mo', domaintools: '$99/mo', securitytrails: '$50/mo', whoisxml: '$29/mo' },
]

export default function DomainHarvesterPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#f97316'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #f97316, #eab308)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Domain Harvester</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered domain intelligence. Monitor WHOIS changes, detect brand impersonation, track DNS records, and discover expiring premium domains — all from one dashboard.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=domain-harvester&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Complete Domain Intelligence</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>DomainTools</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>SecurityTrails</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>WhoisXML</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.domaintools}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.securitytrails}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.whoisxml}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$29', period: '/mo', features: ['100 domains monitored', 'WHOIS + DNS alerts', 'Brand protection (1 brand)', 'Email alerts', 'Weekly reports'], cta: 'starter' },
              { tier: 'Professional', price: '$99', period: '/mo', features: ['1,000 domains', 'All monitoring types', 'Brand protection (10 brands)', 'Expiring domain alerts', 'Subdomain discovery', 'Registrar integration', 'Webhook alerts', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$299', period: '/mo', features: ['Unlimited domains', 'Full domain intelligence', 'Unlimited brands', 'Historical WHOIS data', 'Domain valuation AI', 'Bulk API access', 'Custom alerting rules', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=domain-harvester&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
