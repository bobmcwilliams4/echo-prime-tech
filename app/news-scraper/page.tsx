'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ═══════════════════════════════════════════════════════════════════
    Echo News Scraper — AI-Powered News Intelligence Pipeline
    Backend: echo-news-scraper.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Multi-Source Ingestion', desc: 'Scrapes news from 50+ sources including AP, Reuters, Bloomberg, TechCrunch, industry-specific publications, and government press releases.', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { title: 'AI Summarization', desc: 'Every article auto-summarized into 2-3 sentence briefs. Get the gist in seconds without reading full articles. Key facts extracted and highlighted.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Entity Extraction', desc: 'Automatically identifies companies, people, locations, dollar amounts, and dates from every article. Structured data from unstructured news.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { title: 'Sentiment Analysis', desc: 'AI scores article sentiment (-1 to +1) for companies, sectors, and topics. Track market sentiment shifts before they move prices.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Topic Clustering', desc: 'Related articles automatically grouped into story threads. Follow developing stories across multiple sources without manual curation.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { title: 'Industry Filters', desc: 'Pre-configured filters for Oil & Gas, Technology, Finance, Legal, Healthcare, and 20+ other industries. See only what matters to your business.', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
  { title: 'Breaking News Alerts', desc: 'Real-time alerts for breaking stories matching your keywords. Delivered via webhook, Slack, email, or Shared Brain broadcast within minutes of publication.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Historical Archive', desc: 'Full article archive with search going back months. Track how stories develop over time. See when a topic first appeared in news.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'API & Webhooks', desc: 'RESTful API for querying articles, managing subscriptions, and configuring alerts. Webhook delivery for real-time integration with any system.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Deduplication', desc: 'Same story from AP, Reuters, and 10 blogs? You see it once. Content fingerprinting ensures no duplicate noise in your feed.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'RSS Feed Generation', desc: 'Your filtered, AI-curated news feed available as an RSS feed. Subscribe from any reader or integrate into dashboards and portals.', icon: 'M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z' },
  { title: 'Cron-Powered Automation', desc: 'Runs on configurable schedules via Cloudflare Workers cron. Default: every 30 minutes. Zero infrastructure to manage.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const PRICING = [
  { tier: 'Starter', price: 19, features: ['10 source feeds', '100 articles/day', 'AI summaries', 'Basic sentiment', 'Email alerts', 'RSS feed'], cta: 'Start Free Trial', href: '/checkout?service=news-scraper&tier=starter', popular: false },
  { tier: 'Pro', price: 59, features: ['50+ source feeds', 'Unlimited articles', 'AI summaries + entities', 'Full sentiment analysis', 'Topic clustering', 'Webhook + Slack alerts', 'Custom RSS feeds', 'Historical archive', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=news-scraper&tier=pro', popular: true },
  { tier: 'Enterprise', price: 199, features: ['Everything in Pro', 'Custom source addition', 'White-label feeds', 'Dedicated scraper instance', 'Priority processing', 'SLA guarantee', 'Bulk export', 'Team management'], cta: 'Contact Sales', href: '/checkout?service=news-scraper&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What news sources are covered?', a: 'Over 50 sources including major wire services (AP, Reuters), business news (Bloomberg, CNBC, WSJ), tech news (TechCrunch, Ars Technica, The Verge), industry-specific publications, and government press releases. Custom sources can be added on Pro and Enterprise tiers.' },
  { q: 'How does AI summarization work?', a: 'Each article is processed through our Engine Runtime to extract key facts, generate a 2-3 sentence summary, identify named entities (people, companies, locations, amounts), and score sentiment. This happens automatically within minutes of article publication.' },
  { q: 'Can I get alerts for specific topics?', a: 'Yes. Configure keyword-based alerts for any topic. When a matching article is detected, you receive notifications via webhook, Slack, email, or Shared Brain broadcast. Alert latency is typically under 5 minutes from publication.' },
  { q: 'How is this different from Google Alerts?', a: 'Google Alerts gives you links. Echo News Scraper gives you AI-processed intelligence: summaries, entity extraction, sentiment scores, topic clustering, deduplication, and structured data you can query via API. It is a news intelligence pipeline, not a link aggregator.' },
  { q: 'Is there an API?', a: 'Yes. Full REST API for querying articles (with filtering by date, source, topic, sentiment), managing source subscriptions, configuring alerts, and exporting data. Webhook support for real-time integration.' },
  { q: 'What about data freshness?', a: 'Default scrape cycle is every 30 minutes. Breaking news sources are checked more frequently. Articles are processed and available via API within 5-10 minutes of scraping. Real-time alert delivery for keyword matches.' },
];

export default function NewsScraperPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'News Scraper', href: '/news-scraper' }]} />
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
          50+ Sources &middot; AI Summaries &middot; Real-Time Alerts
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">News Scraper</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>AI News Intelligence</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          50+ news sources scraped every 30 minutes. AI summarizes, extracts entities, scores sentiment, and clusters topics. Know what matters before anyone else.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=news-scraper&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>50+</strong> Sources</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>30min</strong> Cycle</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>AI</strong> Processed</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>News Intelligence, Not News Overload</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
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
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Stay Ahead of Every Story</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>50+ sources. AI processing. Real-time alerts. Your news intelligence pipeline runs 24/7 so you don&apos;t have to.</p>
        <Link href="/checkout?service=news-scraper&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
