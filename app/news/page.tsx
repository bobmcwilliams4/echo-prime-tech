'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO AI NEWS AGGREGATOR — Multi-Source Intelligence Feed
   Product page: hero, features, feed preview, pricing, FAQ, footer CTA
   Backend: echo-news-scraper.bmcii1976.workers.dev + echo-knowledge-scout
   ============================================================================== */

const FEATURES = [
  { title: 'Multi-Source Aggregation', desc: 'Pull news from 50+ sources in real time — RSS, Reddit, Hacker News, arXiv, GitHub, TechCrunch, and industry feeds. Never miss a story.', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { title: 'AI Sentiment Analysis', desc: 'Every article scored for sentiment and relevance. See at a glance if news is positive, negative, or neutral — and how it affects your industry.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Topic Clustering', desc: 'AI groups related stories into clusters. One event, one cluster — no noise. See how stories evolve over hours and days.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { title: 'Custom Alerts', desc: 'Set keyword-based alerts for topics that matter. Get notified via email or webhook when a high-relevance story hits your feed.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Industry Filters', desc: 'Pre-built filters for AI, cybersecurity, oil & gas, legal, finance, and more. Or create your own with custom keyword sets.', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
  { title: 'Trend Detection', desc: 'Spot emerging trends before they hit mainstream. AI analyzes velocity, sentiment shifts, and cross-source correlation to surface what matters next.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { title: 'Daily Digests', desc: 'Automated daily briefings delivered to your inbox or Slack. Top stories, emerging trends, and sentiment shifts — summarized by AI.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'API Access', desc: 'Full REST API for integrating news data into your workflows. Webhooks for real-time event streaming. SDKs for Python and TypeScript.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { title: 'Knowledge Scout', desc: 'Autonomous AI agent that discovers new sources, evaluates relevance, and expands your intelligence network without manual configuration.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Source Credibility', desc: 'Every source rated for reliability and bias. AI cross-references claims across sources and flags potential misinformation.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

const FEED_TABS = [
  { name: 'All Sources', desc: 'Unified feed across all 50+ sources, sorted by relevance' },
  { name: 'AI & ML', desc: 'Machine learning, LLMs, robotics, and AI research papers' },
  { name: 'Cybersecurity', desc: 'Threats, vulnerabilities, zero-days, and defense strategies' },
  { name: 'Oil & Gas', desc: 'Permian Basin, drilling tech, commodity prices, regulations' },
  { name: 'Finance', desc: 'Markets, crypto, fintech, regulations, and economic analysis' },
  { name: 'Legal & Tax', desc: 'Case law updates, IRS rulings, compliance, and regulations' },
];

const PRICING = [
  {
    tier: 'Free',
    price: 0,
    features: [
      '10 sources monitored',
      'Daily digest email',
      'Basic sentiment scoring',
      '7-day article history',
      'Up to 5 keyword alerts',
    ],
    cta: 'Start Free',
    href: '/signup?service=news&tier=free',
    popular: false,
  },
  {
    tier: 'Pro',
    price: 29,
    features: [
      '50+ sources monitored',
      'Real-time feed access',
      'Advanced sentiment & clustering',
      '90-day article history',
      'Unlimited keyword alerts',
      'Daily AI briefings',
      'Slack & email notifications',
      'API access (1,000 calls/day)',
    ],
    cta: 'Start Free Trial',
    href: '/checkout?service=news&tier=pro',
    popular: true,
  },
  {
    tier: 'Enterprise',
    price: 99,
    features: [
      'Everything in Pro',
      'Custom source integration',
      'Knowledge Scout AI agent',
      'Unlimited API access',
      'Webhook event streaming',
      'Source credibility scoring',
      'White-label reports',
      'Priority support',
    ],
    cta: 'Contact Sales',
    href: '/checkout?service=news&tier=enterprise',
    popular: false,
  },
];

const FAQS = [
  { q: 'What sources does the AI News Aggregator monitor?', a: 'We aggregate from 50+ sources including Reddit, Hacker News, arXiv, GitHub trending, TechCrunch, industry RSS feeds, government publications, and specialized databases. Enterprise plans can add custom sources.' },
  { q: 'How does the sentiment analysis work?', a: 'Each article is analyzed by AI models that score sentiment on a -1 to +1 scale (negative to positive), relevance to your configured topics (0-100%), and urgency. The system cross-references multiple articles about the same event for higher accuracy.' },
  { q: 'Can I get alerts for specific topics?', a: 'Yes. Set up keyword-based alerts that trigger when high-relevance articles match your criteria. Alerts can be delivered via email, Slack, or webhook. Pro and Enterprise plans support unlimited alerts.' },
  { q: 'What is Knowledge Scout?', a: 'Knowledge Scout is an autonomous AI agent (Enterprise plan) that continuously discovers new relevant sources, evaluates their credibility and relevance to your interests, and expands your intelligence network without manual configuration. It runs daily discovery cycles.' },
  { q: 'Is there an API?', a: 'Yes. Pro plans get 1,000 API calls/day, Enterprise gets unlimited. The REST API supports article search, feed streaming, alert management, and analytics. We also offer webhook event streaming for real-time integration.' },
  { q: 'How is this different from Google Alerts?', a: 'Google Alerts is keyword-matching on web pages. Our AI News Aggregator provides sentiment analysis, topic clustering, trend detection, source credibility scoring, multi-source correlation, and automated AI-powered daily briefings. It is an intelligence platform, not a notification tool.' },
];

const COMPARISON = [
  { feature: 'Sources monitored', echo: '50+', google: '~5', feedly: '~30', competitor: 'Varies' },
  { feature: 'AI sentiment analysis', echo: 'Per-article', google: 'None', feedly: 'Basic', competitor: 'Limited' },
  { feature: 'Topic clustering', echo: 'Automatic', google: 'None', feedly: 'Manual tags', competitor: 'Manual' },
  { feature: 'Daily AI briefings', echo: 'Included', google: 'None', feedly: 'Add-on', competitor: 'Paid' },
  { feature: 'Custom alerts', echo: 'Unlimited (Pro)', google: 'Basic', feedly: 'Paid', competitor: 'Paid' },
  { feature: 'API access', echo: 'Included', google: 'None', feedly: 'Enterprise', competitor: 'Paid' },
  { feature: 'Knowledge Scout AI', echo: 'Enterprise', google: 'None', feedly: 'None', competitor: 'None' },
  { feature: 'Source credibility', echo: 'AI-scored', google: 'None', feedly: 'None', competitor: 'None' },
  { feature: 'Trend detection', echo: 'Real-time', google: 'None', feedly: 'None', competitor: 'Basic' },
  { feature: 'Starting price', echo: 'Free', google: 'Free', feedly: '$6/mo', competitor: '$15/mo' },
];

export default function NewsPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <FaqSchema faqs={FAQS.map(f => ({ question: f.q, answer: f.a }))} name="Echo AI News Aggregator FAQ" />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'AI News Aggregator', href: '/news' }]} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Blog</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          50+ Sources &middot; Real-Time &middot; AI-Powered
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--ept-text)' }}>
          AI News <span className="gradient-text">Aggregator</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: 'var(--ept-text-secondary)' }}>
          Multi-source intelligence feed with AI sentiment analysis, topic clustering, trend detection, and automated daily briefings. Stop drowning in tabs — let AI curate what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup?service=news" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            See Features
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y px-6 py-8" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Sources Monitored', value: '50+' },
            { label: 'Articles/Day', value: '2,000+' },
            { label: 'Discovery Cycles', value: '6/day' },
            { label: 'Avg Latency', value: '<2min' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Intelligence Features</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          More than an RSS reader. A full intelligence platform that analyzes, clusters, and surfaces what matters.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feed Preview */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Live Feed Preview</h2>
          <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>
            Industry-specific feeds curated by AI. Click a category to preview.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {FEED_TABS.map((t, i) => (
              <button key={i} onClick={() => setActiveTab(i)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{
                backgroundColor: activeTab === i ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: activeTab === i ? '#fff' : 'var(--ept-text-secondary)',
              }}>
                {t.name}
              </button>
            ))}
          </div>
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--ept-accent)' }}>{FEED_TABS[activeTab].name}</div>
            <div className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>{FEED_TABS[activeTab].desc}</div>
            <div className="space-y-4">
              {[
                { title: 'Breaking: New AI Model Achieves Record Benchmark Scores', source: 'arXiv', time: '12 min ago', sentiment: 0.82, relevance: 95 },
                { title: 'Federal Reserve Signals Rate Decision Ahead of Q2 Data', source: 'Reuters', time: '28 min ago', sentiment: -0.15, relevance: 72 },
                { title: 'Critical Vulnerability Found in Popular Open Source Library', source: 'Hacker News', time: '45 min ago', sentiment: -0.65, relevance: 88 },
                { title: 'Permian Basin Production Hits New Monthly Record', source: 'Industry Feed', time: '1 hr ago', sentiment: 0.55, relevance: 91 },
                { title: 'EU Proposes New AI Regulation Framework for Enterprise', source: 'TechCrunch', time: '2 hrs ago', sentiment: -0.22, relevance: 76 },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{a.title}</div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                      <span>{a.source}</span>
                      <span>&middot;</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Sentiment</div>
                      <div className="text-sm font-semibold" style={{ color: a.sentiment > 0.3 ? '#22c55e' : a.sentiment < -0.3 ? '#ef4444' : 'var(--ept-text-secondary)' }}>
                        {a.sentiment > 0 ? '+' : ''}{a.sentiment.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Relevance</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--ept-accent)' }}>{a.relevance}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>
          Not just another news reader. A full intelligence platform.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Prime</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Google Alerts</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Feedly</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Others</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="py-3 px-4 text-center font-medium" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                  <td className="py-3 px-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.google}</td>
                  <td className="py-3 px-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.feedly}</td>
                  <td className="py-3 px-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{r.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Start free. Scale when you need more.</p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{
              backgroundColor: 'var(--ept-bg)',
              borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              ...(p.popular ? { ringColor: 'var(--ept-accent)' } as React.CSSProperties : {}),
            }}>
              {p.popular && (
                <div className="text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{p.price === 0 ? 'Free' : `$${p.price}`}</span>
                {p.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span>}
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block w-full text-center py-3 rounded-xl font-semibold" style={{
                backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent',
                color: p.popular ? '#fff' : 'var(--ept-accent)',
                border: p.popular ? 'none' : '1px solid var(--ept-border)',
              }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <details key={i} className="p-5 rounded-xl border group" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                {f.q}
                <svg className="w-5 h-5 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 text-center" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Stop Missing the News That Matters
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Join thousands of professionals who use Echo AI News to stay ahead. Free forever — upgrade when you need more.
        </p>
        <Link href="/signup?service=news" className="inline-block px-10 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
      </footer>

      <noscript>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Echo AI News Aggregator</h1>
          <p>AI-powered news aggregation across 50+ sources with real-time sentiment analysis, topic clustering, and custom alerts.</p>
          <p>Features: Multi-source aggregation, AI sentiment analysis, topic clustering, custom alerts, industry filters, trend detection, daily digests, API access, Knowledge Scout, source credibility scoring.</p>
          <p>Pricing: Free (10 sources), Pro $29/mo (50+ sources, API), Enterprise $99/mo (unlimited, Knowledge Scout).</p>
        </div>
      </noscript>
    </div>
  );
}
