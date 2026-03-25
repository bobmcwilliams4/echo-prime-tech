'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const FEATURES = [
  { icon: '💬', title: 'Natural Language to Website', desc: 'Describe your site in plain English. Our 30-LLM orchestrator interprets intent and generates a production-ready build in minutes.' },
  { icon: '🎨', title: 'AI Design Suggestions', desc: 'The AI proposes color palettes, layouts, and component hierarchies based on your industry and brand preferences.' },
  { icon: '📱', title: 'Responsive by Default', desc: 'Every site ships mobile-first and fully responsive. No breakpoints to tune — the AI handles it automatically.' },
  { icon: '🔎', title: 'SEO Optimization', desc: 'Meta tags, structured data, sitemap, and canonical URLs generated and maintained by the AI on every build.' },
  { icon: '⚡', title: 'One-Click Deploy', desc: 'Push to Cloudflare Pages, Vercel, or your own domain in a single click. Zero devops knowledge required.' },
  { icon: '🌐', title: 'Custom Domain Support', desc: 'Connect any domain you own — DNS configuration is handled automatically through the control panel.' },
  { icon: '🛒', title: 'E-commerce Ready', desc: 'Stripe integration, product catalog, cart, and checkout flow generated on demand for any storefront.' },
  { icon: '✍️', title: 'Blog & CMS', desc: 'Built-in content management system so you can publish, edit, and schedule posts without touching code.' },
  { icon: '📈', title: 'Analytics Built-in', desc: 'Cloudflare Web Analytics and custom event tracking wired in from day one. No third-party scripts needed.' },
  { icon: '🧪', title: 'A/B Testing', desc: 'Define variants in plain language. The AI splits traffic and reports winners automatically — no code required.' },
];

const COMPARISON = [
  { feature: 'AI generates entire site from prompt', wb: true, wix: false, sq: false, wp: false },
  { feature: '30-LLM orchestration backend', wb: true, wix: false, sq: false, wp: false },
  { feature: 'Refine via chat', wb: true, wix: false, sq: false, wp: false },
  { feature: 'SEO auto-configured', wb: true, wix: true, sq: true, wp: false },
  { feature: 'E-commerce built-in', wb: true, wix: true, sq: true, wp: true },
  { feature: 'One-click deploy to Cloudflare', wb: true, wix: false, sq: false, wp: false },
  { feature: 'A/B testing (no code)', wb: true, wix: false, sq: false, wp: false },
  { feature: 'Analytics included free', wb: true, wix: false, sq: false, wp: false },
  { feature: 'Code export (own your site)', wb: true, wix: false, sq: false, wp: true },
  { feature: 'White-label (agency plan)', wb: true, wix: false, sq: false, wp: false },
];

const PRICING = [
  {
    tier: 'Starter',
    price: 'Free',
    period: '',
    popular: false,
    features: ['1 site', 'Echo branding', 'Cloudflare deploy', 'AI chat refinement', 'Basic SEO', 'Community support'],
    cta: 'Start Free',
  },
  {
    tier: 'Pro',
    price: '$19',
    period: '/mo',
    popular: true,
    features: ['5 sites', 'Custom domain', 'Remove Echo branding', 'E-commerce (up to 100 products)', 'A/B testing', 'Analytics dashboard', 'Priority support'],
    cta: 'Start Free Trial',
  },
  {
    tier: 'Business',
    price: '$49',
    period: '/mo',
    popular: false,
    features: ['Unlimited sites', 'Unlimited products', 'Blog & CMS', 'Advanced analytics', 'Custom code injection', 'API access', 'Phone support'],
    cta: 'Get Started',
  },
  {
    tier: 'Agency',
    price: '$149',
    period: '/mo',
    popular: false,
    features: ['White-label portal', 'Client management', 'Team collaboration', 'Bulk site generation', 'Revenue sharing', 'Dedicated account manager'],
    cta: 'Contact Sales',
  },
];

const FAQS = [
  {
    q: 'How much can I customize the generated site?',
    a: 'Everything is customizable. After generation you can refine via chat ("make the hero darker", "add a testimonials section", "change the font to serif"), or export the full source code and edit it directly. You are never locked into the generated output.',
  },
  {
    q: 'Where is my site hosted?',
    a: 'All sites deploy to Cloudflare Pages by default — global CDN, 99.99% uptime, and free SSL. Business and Agency plans can also deploy to Vercel or your own infrastructure. You can export the build output to host anywhere.',
  },
  {
    q: 'Can I migrate an existing website?',
    a: 'Yes. Provide your existing site URL and the AI performs a structural analysis, then rebuilds an equivalent site with improvements. Content, pages, and navigation structure are preserved. Full migration typically completes in under 10 minutes.',
  },
  {
    q: 'What does the 30-LLM orchestrator actually do?',
    a: 'The echo-ai-orchestrator routes your request across 30 FREE LLM workers in parallel — each specialized for a different task (layout, copy, SEO, code, images, etc.). Results are merged and ranked. You get the combined intelligence of dozens of models for the price of one.',
  },
  {
    q: 'Do I own the generated site and its code?',
    a: '100% ownership. Generated sites, code, content, and assets belong entirely to you. No watermarks (on paid plans), no platform lock-in, no royalties. Export anytime to your own repo or hosting.',
  },
  {
    q: 'Can the AI update my site after it\'s live?',
    a: 'Yes — this is what the "refine" and "chat" capabilities are for. Open any live site in the AI editor, describe the change you want in plain English, and the AI applies it and redeploys automatically. Version history is maintained so you can roll back any change.',
  },
];

export default function WebsiteBuilderPage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Tech" width={140} height={36}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors"
              style={{ color: 'var(--ept-text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ color: 'var(--ept-text-secondary)' }}>Sign In</Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-surface)' }}>
          v1.2.0 — echo-website-builder-ai.bmcii1976.workers.dev
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="gradient-text">Website Builder AI</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>Describe It. We Build It.</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Type what you want in plain English. Our 30-LLM AI orchestrator generates a
          production-ready, deployed website — in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-white text-center"
            style={{ backgroundColor: 'var(--ept-accent)' }}>
            Build Your Site Free
          </Link>
          <Link href="#features" className="px-8 py-3 rounded-xl font-semibold text-center border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            See All Features
          </Link>
        </div>

        {/* Demo prompt box */}
        <div className="mt-14 p-6 rounded-2xl border text-left"
          style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ept-text-muted)' }}>EXAMPLE PROMPT</p>
          <p className="text-sm italic" style={{ color: 'var(--ept-text-secondary)' }}>
            "Build me a modern SaaS landing page for a dog grooming booking app called Bark &amp; Shine.
            Dark color scheme, teal accents. Include a pricing section with 3 tiers, a testimonials
            section, and a contact form. Mobile-first. SEO-optimized."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
            <span className="text-xs" style={{ color: 'var(--ept-accent)' }}>Generated and deployed in 4 minutes 12 seconds</span>
          </div>
        </div>

        {/* Capability badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {['Build', 'Refine', 'Chat'].map(cap => (
            <span key={cap} className="px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-surface)' }}>
              {cap}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Everything you need. Nothing you don't.
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          Every feature ships automatically. No plugins to install, no settings to configure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            How we compare
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
            Wix drags. Squarespace limits. WordPress overwhelms. Website Builder AI just builds.
          </p>
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ept-card-bg)', borderBottom: '1px solid var(--ept-card-border)' }}>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-accent)' }}>Website Builder AI</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>Wix</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>Squarespace</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>WordPress</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature}
                    style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)', borderBottom: '1px solid var(--ept-card-border)' }}>
                    <td className="p-4" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                    <td className="p-4 text-center">{row.wb ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.wix ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.sq ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.wp ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Start free. Scale as you grow.
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          No credit card required to start. Cancel anytime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map(plan => (
            <div key={plan.tier}
              className="p-6 rounded-xl border flex flex-col"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: plan.popular ? '0 0 0 2px var(--ept-accent)' : undefined,
              }}>
              {plan.popular && (
                <div className="text-xs font-bold px-3 py-1 rounded-full mb-4 self-start"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.tier}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.tier === 'Agency' ? '/support' : '/signup'}
                className="w-full py-2.5 rounded-lg font-semibold text-center text-sm block"
                style={{
                  backgroundColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-surface)',
                  color: plan.popular ? '#fff' : 'var(--ept-text)',
                  border: plan.popular ? 'none' : '1px solid var(--ept-border)',
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border overflow-hidden"
                style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-sm"
                  style={{ color: 'var(--ept-text)' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span style={{ color: 'var(--ept-accent)', fontSize: '1.2rem', lineHeight: 1 }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Your next site is one <span className="gradient-text">sentence away.</span>
        </h2>
        <p className="mb-8 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
          Stop dragging blocks. Stop hiring devs for simple sites. Describe what you want and go live today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: 'var(--ept-accent)' }}>
            Build Your Site Free
          </Link>
          <Link href="/support" className="px-8 py-3 rounded-xl font-semibold border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm"
        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>© {new Date().getFullYear()} Echo Prime Tech. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>

    </div>
  );
}
