'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: '🎙️', title: 'Unlimited Hosting', desc: 'Upload unlimited episodes to our global CDN. No bandwidth caps, no storage limits.' },
  { icon: '📡', title: 'RSS 2.0 + iTunes', desc: 'Auto-generated podcast RSS feeds with full iTunes/Apple Podcasts namespace support.' },
  { icon: '🤖', title: 'AI Show Notes', desc: 'Generate professional show notes, timestamps, and episode descriptions with one click.' },
  { icon: '📊', title: 'Download Analytics', desc: 'Track downloads by country, device, and podcast app. See which episodes resonate.' },
  { icon: '🎧', title: 'Embeddable Player', desc: 'Branded HTML5 audio player you can embed on any website with a single line of code.' },
  { icon: '📋', title: 'Transcript Support', desc: 'Store and display full episode transcripts for accessibility and SEO.' },
  { icon: '📅', title: 'Scheduled Publishing', desc: 'Schedule episodes in advance. They auto-publish at the exact time you set.' },
  { icon: '📧', title: 'Subscriber Management', desc: 'Build your email list with built-in subscribe forms and audience management.' },
  { icon: '🎵', title: 'Playlists & Seasons', desc: 'Organize episodes into seasons and custom playlists for better listener experience.' },
  { icon: '🔗', title: 'Multi-Platform Distribution', desc: 'Your RSS feed works with Apple Podcasts, Spotify, Google Podcasts, and 20+ apps.' },
  { icon: '💡', title: 'AI Episode Ideas', desc: 'Stuck on content? AI analyzes your show and suggests episode topics your audience wants.' },
  { icon: '📈', title: 'Growth Dashboard', desc: 'Daily analytics with trends, top episodes, listener geography, and subscriber growth.' },
];

const COMPARISON = [
  { feature: 'Unlimited storage', echo: true, buzzsprout: false, anchor: true, transistor: false },
  { feature: 'AI show notes', echo: true, buzzsprout: false, anchor: false, transistor: false },
  { feature: 'AI episode ideas', echo: true, buzzsprout: false, anchor: false, transistor: false },
  { feature: 'Embeddable player', echo: true, buzzsprout: true, anchor: true, transistor: true },
  { feature: 'RSS 2.0 + iTunes', echo: true, buzzsprout: true, anchor: true, transistor: true },
  { feature: 'Download analytics', echo: true, buzzsprout: true, anchor: true, transistor: true },
  { feature: 'Scheduled publishing', echo: true, buzzsprout: true, anchor: true, transistor: true },
  { feature: 'Subscriber management', echo: true, buzzsprout: false, anchor: false, transistor: false },
  { feature: 'Transcript support', echo: true, buzzsprout: true, anchor: false, transistor: true },
  { feature: 'Custom playlists', echo: true, buzzsprout: false, anchor: false, transistor: false },
  { feature: 'Multi-tenant / white-label', echo: true, buzzsprout: false, anchor: false, transistor: true },
  { feature: 'API access', echo: true, buzzsprout: false, anchor: false, transistor: true },
  { feature: 'No ads forced', echo: true, buzzsprout: true, anchor: false, transistor: true },
  { feature: 'Starting price', echo: '$9/mo', buzzsprout: '$12/mo', anchor: 'Free*', transistor: '$19/mo' },
];

const TIERS = [
  { name: 'Starter', price: 9, features: ['2 shows', '50 episodes', 'RSS + iTunes feed', 'Basic analytics', 'Embeddable player', 'Email support'], cta: 'Start Podcasting' },
  { name: 'Creator', price: 29, popular: true, features: ['10 shows', 'Unlimited episodes', 'AI show notes & ideas', 'Advanced analytics', 'Subscriber management', 'Scheduled publishing', 'Custom playlists', 'Priority support'], cta: 'Go Creator' },
  { name: 'Network', price: 79, features: ['Unlimited shows', 'Unlimited episodes', 'Everything in Creator', 'Multi-tenant / white-label', 'Full API access', 'CSV/JSON export', 'Dedicated support', 'Custom integrations'], cta: 'Launch Network' },
];

const FAQS = [
  { q: 'Can I migrate my existing podcast?', a: 'Yes. Import your existing RSS feed and we\'ll pull in all your episodes, artwork, and metadata. Your listeners won\'t notice any change — same RSS URL redirect.' },
  { q: 'Do you add ads to my episodes?', a: 'Never. Your content is yours. We don\'t inject ads, watermarks, or branding into your audio. You control your monetization.' },
  { q: 'How does AI show notes work?', a: 'Upload your episode audio and click "Generate Show Notes." Our AI listens to the content and produces a professional summary, key topics, timestamps, and guest bios.' },
  { q: 'What podcast apps does the RSS feed support?', a: 'All of them. Apple Podcasts, Spotify, Google Podcasts, Overcast, Pocket Casts, Castro, Amazon Music, and any app that supports RSS 2.0.' },
  { q: 'Can I use my own domain?', a: 'Yes. On Creator and Network plans, you can use a custom domain for your podcast page and RSS feed.' },
  { q: 'Is there a free trial?', a: 'Yes — 14-day free trial on all plans, no credit card required. Cancel anytime.' },
];

export default function PodcastPage() {
  const { isDark } = useTheme();
  const check = '✓';
  const cross = '✗';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Podcast', href: '/podcast' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Login</Link>
          <Link href="/checkout?service=podcast&tier=creator" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>PODCAST HOSTING PLATFORM</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Host Your Podcast.<br />
          <span className="gradient-text">Grow Your Audience.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Upload episodes, generate AI show notes, distribute to every podcast app, and track your growth — all from one platform. No bandwidth limits. No forced ads.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=podcast&tier=creator" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--ept-text-muted)' }}>14-day free trial. No credit card required.</p>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Podcast</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Podcast</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Buzzsprout</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Anchor/Spotify</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Transistor</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="p-3" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  {[row.echo, row.buzzsprout, row.anchor, row.transistor].map((val, i) => (
                    <td key={i} className="p-3 text-center">
                      {typeof val === 'string' ? (
                        <span className="font-bold" style={{ color: i === 0 ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>{val}</span>
                      ) : val ? (
                        <span style={{ color: '#22c55e' }}>{check}</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>{cross}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple, Honest Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No hidden fees. No bandwidth overages. Cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div key={tier.name} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: tier.popular ? 2 : 1 }}>
              {tier.popular && <div className="text-xs font-bold mb-3 text-center" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${tier.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--ept-accent)' }}>{check}</span>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=podcast&tier=${tier.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: tier.popular ? '#fff' : 'var(--ept-text)' }}>{tier.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Launch Your Podcast?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Join thousands of creators who trust Echo Podcast for reliable, AI-powered hosting.</p>
        <Link href="/checkout?service=podcast&tier=creator" className="px-8 py-4 rounded-xl font-bold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <Link href="/" style={{ color: 'var(--ept-text-secondary)' }}>Home</Link>
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/blog" style={{ color: 'var(--ept-text-secondary)' }}>Blog</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-secondary)' }}>Support</Link>
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-secondary)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-secondary)' }}>Terms</Link>
        </div>
        &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
      </footer>
    </div>
  );
}
