'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ===================================================================
    Forge Marketplace — Buy & Sell AI Engine Templates
    Backend: echo-forge-marketplace.bmcii1976.workers.dev
    =================================================================== */

const FEATURES = [
  { title: 'Engine Templates', desc: 'Pre-built AI engine templates for legal, tax, oilfield, medical, security, and 20+ other domains. Ready to deploy.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'One-Click Deploy', desc: 'Deploy purchased engines directly to your Cloudflare Workers account. Pre-configured D1 schemas, KV namespaces, and cron triggers.', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { title: 'Doctrine Packs', desc: 'Domain expertise packaged as doctrine sets. 632K+ verified doctrines covering tax law, regulations, standards, and case law.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Quality Tiers', desc: 'Three quality tiers — Standard, Professional, and Sovereign. Each tier has minimum accuracy and completeness requirements.', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { title: 'Seller Dashboard', desc: 'Build and sell your own engine templates. Track sales, reviews, downloads, and revenue with real-time analytics.', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Version Control', desc: 'Every engine template is versioned. Buyers get automatic updates. Sellers can publish patches without breaking deployments.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Live Preview', desc: 'Test engine templates before buying. Submit a sample query and see the doctrine-backed response in real-time.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { title: 'Bundle Deals', desc: 'Curated engine bundles for specific industries — complete legal suite, full tax compliance, oilfield operations package.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { title: 'Reviews & Ratings', desc: 'Verified buyer reviews with accuracy ratings, deployment feedback, and support quality scores.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { title: 'License Management', desc: 'Per-seat and per-deployment licensing options. Transfer licenses between projects. Volume discounts for teams.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'API Integration', desc: 'Programmatic marketplace access. Search, purchase, deploy, and manage engines entirely via REST API.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { title: 'Support Channels', desc: 'Direct communication with template sellers. Bug reports, feature requests, and custom modification requests.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
];

const COMPARISON = [
  { feature: 'Price Range', echo: '$29-$499', competitor1: '$99-$999', competitor2: 'Free-$299', competitor3: 'Custom' },
  { feature: 'AI Engine Templates', echo: '5,500+', competitor1: '500+', competitor2: '200+', competitor3: '50+' },
  { feature: 'One-Click Deploy', echo: 'Yes (Cloudflare)', competitor1: 'Docker only', competitor2: 'Manual', competitor3: 'Yes' },
  { feature: 'Doctrine Packs', echo: '632K+ verified', competitor1: 'No', competitor2: 'No', competitor3: 'No' },
  { feature: 'Live Preview', echo: 'Yes', competitor1: 'Screenshots only', competitor2: 'Demo links', competitor3: 'No' },
  { feature: 'Seller Revenue Share', echo: '80%', competitor1: '70%', competitor2: '50%', competitor3: '60%' },
  { feature: 'Quality Verification', echo: '3-tier + automated', competitor1: 'Manual review', competitor2: 'Community', competitor3: 'Basic' },
  { feature: 'Bundled Doctrines', echo: 'Yes', competitor1: 'No', competitor2: 'No', competitor3: 'No' },
];

const PRICING = [
  { tier: 'Buyer', price: 0, features: ['Browse full catalog', 'Live previews', 'Reviews & ratings', 'One-click deploy', 'Purchase history', 'Basic support', 'License management'], cta: 'Browse Marketplace', href: '/checkout?service=forge-marketplace&tier=buyer', popular: false },
  { tier: 'Pro Buyer', price: 49, features: ['Everything in Buyer', 'Early access to new engines', 'Volume discounts (15%)', 'Priority support', 'API access', 'Bundle deals', 'Custom requests', 'Team licenses'], cta: 'Start Free Trial', href: '/checkout?service=forge-marketplace&tier=pro', popular: true },
  { tier: 'Seller', price: 99, features: ['Everything in Pro Buyer', 'Sell your own engines', '80% revenue share', 'Seller analytics dashboard', 'Verification badge', 'Promoted listings', 'Bulk upload tools', 'Dedicated seller support'], cta: 'Become a Seller', href: '/checkout?service=forge-marketplace&tier=seller', popular: false },
];

const FAQS = [
  { q: 'What is an AI engine template?', a: 'An engine template is a ready-to-deploy Cloudflare Worker with pre-built business logic, D1 database schemas, doctrine sets, and API endpoints for a specific domain. Think of it as a full AI microservice you can deploy in minutes.' },
  { q: 'How do doctrine packs work?', a: 'Doctrine packs are curated sets of verified knowledge — IRC sections for tax law, NIST frameworks for security, API standards for engineering, etc. They plug directly into the Engine Runtime to give your AI real domain expertise instead of hallucinated answers.' },
  { q: 'Can I sell my own engine templates?', a: 'Yes. The Seller tier lets you publish templates with a 80% revenue share. You set the price, we handle distribution, deployment, licensing, and payment processing.' },
  { q: 'What quality controls exist?', a: 'All templates go through automated testing (syntax, health endpoint, schema validation) plus manual review for Sovereign tier. Accuracy is verified against known-good doctrine sets.' },
  { q: 'Can I customize purchased templates?', a: 'Absolutely. You get full source code access. Modify, extend, and customize any template to fit your needs. Updates from the seller can be merged selectively.' },
  { q: 'What if a template doesn\'t work as advertised?', a: 'We offer a 14-day money-back guarantee on all purchases. If a template doesn\'t meet the advertised quality tier or has critical bugs, you get a full refund.' },
];

export default function ForgeMarketplacePage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Forge Marketplace', href: '/forge-marketplace' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          5,500+ Engines &middot; 632K Doctrines &middot; Deploy in Minutes
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Forge Marketplace</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>The AI Engine Store</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Buy, sell, and deploy AI engine templates. 5,500+ ready-made engines with 632K verified doctrines. From tax compliance to oilfield operations — one click to production.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=forge-marketplace&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse Marketplace</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>5,500+</strong> Engines</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>632K</strong> Doctrines</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>80%</strong> Seller Revenue</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Build with AI</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Forge vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Forge Marketplace</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>AWS Marketplace</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Hugging Face</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Custom Build</th>
            </tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor1}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor2}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
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

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Start Building with AI Engines Today</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>5,500+ engines, 632K doctrines, one-click deploy. The fastest way to add AI to your business.</p>
        <Link href="/checkout?service=forge-marketplace&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Browse the Marketplace</Link>
      </section>
    </main>
  );
}
