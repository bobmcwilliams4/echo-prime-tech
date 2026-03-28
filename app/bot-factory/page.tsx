'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ===================================================================
    Bot Factory — AI Social Media Bot Builder & Management
    Backend: echo-bot-factory.bmcii1976.workers.dev
    =================================================================== */

const FEATURES = [
  { title: 'Multi-Platform Bots', desc: 'Deploy bots to X/Twitter, LinkedIn, Reddit, Telegram, Discord, Slack, Instagram, and WhatsApp from a single interface.', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
  { title: 'AI Content Generation', desc: 'GPT-4, Claude, and custom model integration for generating posts, replies, and comments tailored to each platform.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { title: 'Personality Engine', desc: '14 pre-built AI personalities from professional to casual. Create custom personalities with tone, vocabulary, and behavior rules.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Smart Scheduling', desc: 'Optimal posting times per platform with timezone awareness. Cron-powered automation with configurable daily caps.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Lead Generation', desc: 'Automatic lead capture from bot interactions. Track conversations, score engagement, and export to your CRM.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { title: 'OPSEC Protection', desc: 'Anti-ban measures including rate limiting, human-like delays, browser fingerprint rotation, and activity pattern randomization.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Conversation AI', desc: 'Bots engage in genuine conversations, not just broadcast. Reply to mentions, DMs, comments, and threads contextually.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'Analytics Dashboard', desc: 'Track followers, engagement rates, lead quality, sentiment, and ROI per bot across all platforms.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Bot Auditor', desc: 'Automated 6-hour audit cycles checking health, activity quality, OPSEC compliance, deduplication, and brand safety.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'Voice Integration', desc: 'ElevenLabs and Edge TTS integration for bots that can speak. Clone voices for authentic brand communication.', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { title: 'Webhook Events', desc: 'Real-time webhook notifications for new followers, mentions, DMs, leads, and flagged content across all bots.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Template Library', desc: 'Pre-built bot templates for sales, support, community management, content promotion, and lead generation use cases.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];

const COMPARISON = [
  { feature: 'Price (per month)', echo: '$49', competitor1: '$99/bot', competitor2: '$79', competitor3: '$199' },
  { feature: 'Platforms Supported', echo: '8', competitor1: '3', competitor2: '5', competitor3: '4' },
  { feature: 'AI Content Generation', echo: 'Multi-model', competitor1: 'GPT only', competitor2: 'Templates', competitor3: 'GPT only' },
  { feature: 'Lead Generation', echo: 'Built-in', competitor1: 'No', competitor2: 'Basic', competitor3: 'Enterprise' },
  { feature: 'Anti-Ban Protection', echo: 'Advanced', competitor1: 'Basic', competitor2: 'No', competitor3: 'Basic' },
  { feature: 'Voice Integration', echo: 'ElevenLabs + TTS', competitor1: 'No', competitor2: 'No', competitor3: 'No' },
  { feature: 'Bot Auditing', echo: 'Automated 6hr', competitor1: 'Manual', competitor2: 'No', competitor3: 'Daily' },
  { feature: 'Custom Personalities', echo: 'Unlimited', competitor1: '3', competitor2: '5', competitor3: '10' },
];

const PRICING = [
  { tier: 'Starter', price: 49, features: ['3 bots', '2 platforms', 'AI content generation', 'Smart scheduling', 'Basic analytics', 'Lead capture', 'Email support'], cta: 'Start Free Trial', href: '/checkout?service=bot-factory&tier=starter', popular: false },
  { tier: 'Growth', price: 149, features: ['10 bots', 'All 8 platforms', 'Custom personalities', 'Advanced OPSEC', 'Conversation AI', 'Bot auditor', 'Voice integration', 'Webhook events'], cta: 'Start Free Trial', href: '/checkout?service=bot-factory&tier=growth', popular: true },
  { tier: 'Agency', price: 399, features: ['Unlimited bots', 'All platforms', 'White-label branding', 'Client management', 'Priority support', 'Custom integrations', 'Dedicated IP pools', 'SLA guarantee'], cta: 'Contact Sales', href: '/checkout?service=bot-factory&tier=agency', popular: false },
];

const FAQS = [
  { q: 'Is this legal to use?', a: 'Bot Factory is designed for legitimate business automation — social media management, customer engagement, lead generation, and community building. Always comply with each platform\'s terms of service. Our OPSEC features help maintain compliance.' },
  { q: 'Which AI models power the content generation?', a: 'Bot Factory integrates with Claude, GPT-4.1, Groq, and custom fine-tuned models. Each bot can use a different model based on your preference. We route through free tiers first to minimize costs.' },
  { q: 'How does anti-ban protection work?', a: 'Multiple layers: human-like posting delays, activity pattern randomization, rate limiting per platform, browser fingerprint rotation, and engagement warm-up sequences for new accounts. The Bot Auditor continuously checks compliance.' },
  { q: 'Can bots have conversations or just post?', a: 'Full conversation capability. Bots can reply to mentions, respond to DMs, participate in threads, comment on relevant posts, and engage with followers. Each conversation maintains context for natural interactions.' },
  { q: 'How are leads tracked?', a: 'Every meaningful interaction is scored and tracked. When someone engages with your bot, their profile, conversation history, and engagement score are captured. Export to Echo CRM or any CRM via API or CSV.' },
  { q: 'Can I use my own voice for audio content?', a: 'Yes. Connect your ElevenLabs account for voice cloning. Bot Factory can generate audio posts, voice DMs, and podcast clips using your cloned voice or any of our 14 built-in personalities.' },
];

export default function BotFactoryPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Bot Factory', href: '/bot-factory' }]} />
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
          8 Platforms &middot; AI-Powered &middot; Autonomous
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Bot Factory</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>Build Your Social Army</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Deploy AI-powered bots across 8 platforms. Generate content, engage followers, capture leads, and grow your brand — all on autopilot.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=bot-factory&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>8</strong> Platforms</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>14</strong> Personalities</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>24/7</strong> Automation</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>The Complete Bot Platform</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Bot Factory vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Bot Factory</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Phantombuster</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Hootsuite</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Sprout Social</th>
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
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Automate Your Social Presence?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Deploy your first AI bot in 5 minutes. No coding required. 8 platforms, unlimited potential.</p>
        <Link href="/checkout?service=bot-factory&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
