'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '../../lib/theme-context';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import FaqSchema from '../../components/FaqSchema';

/* ── Scraper Categories ── */

interface ScraperExample {
  name: string;
  icon: string;
  desc: string;
  features: string[];
  tag: string;
  tagColor: string;
}

interface ScraperCategory {
  id: string;
  label: string;
  icon: string;
  desc: string;
  scrapers: ScraperExample[];
}

const SCRAPER_CATEGORIES: ScraperCategory[] = [
  {
    id: 'web',
    label: 'Web Scrapers',
    icon: '🌐',
    desc: 'Extract structured data from any website at industrial scale.',
    scrapers: [
      { name: 'E-Commerce Scraper', icon: '🛒', desc: 'Product listings, pricing, reviews, inventory levels, competitor monitoring', features: ['Multi-marketplace', 'Price history tracking', 'Review aggregation', 'Stock alerts', 'API + CSV export'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Real Estate Scraper', icon: '🏠', desc: 'MLS listings, Zillow, Redfin, county records, tax assessments', features: ['Multi-source sync', 'Price comparisons', 'Tax records', 'Market analytics', 'GIS integration'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Job Board Scraper', icon: '💼', desc: 'LinkedIn, Indeed, Glassdoor, custom boards — aggregate all openings', features: ['Multi-board support', 'Salary extraction', 'Company profiles', 'Skills matching', 'Alert system'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'News & Media Scraper', icon: '📰', desc: 'RSS feeds, news sites, blogs, press releases — full text extraction', features: ['Full-text extraction', 'Image/media capture', 'Author detection', 'Sentiment scoring', 'Topic clustering'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Directory Scraper', icon: '📋', desc: 'Yellow Pages, Yelp, Google Maps, industry directories — lead generation', features: ['Contact extraction', 'Phone/email parsing', 'Category filtering', 'Geo-targeting', 'CRM export'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Academic / Research Scraper', icon: '🎓', desc: 'PubMed, arXiv, Google Scholar, patent databases, citation graphs', features: ['Citation extraction', 'Author networks', 'Abstract analysis', 'PDF download', 'BibTeX export'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'gov',
    label: 'Government & Legal',
    icon: '🏛️',
    desc: 'County records, court filings, SEC documents, regulatory databases.',
    scrapers: [
      { name: 'County Deed Scraper', icon: '📜', desc: 'Automated county clerk deed record extraction — deeds, liens, mortgages, easements', features: ['80+ Texas counties', 'Multi-instrument types', 'OCR integration', 'Chain of title', 'R2 storage'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'SEC / EDGAR Scraper', icon: '📊', desc: '10-K, 10-Q, proxy statements, insider trades, beneficial ownership', features: ['Filing extraction', 'Financial parsing', 'Insider tracking', 'Full-text search', 'Watchlists'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Court Filing Scraper', icon: '⚖️', desc: 'PACER, state courts, bankruptcy filings, case dockets', features: ['Multi-court access', 'Docket tracking', 'Party search', 'Document download', 'Alert on new filings'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Permit & License Scraper', icon: '🏗️', desc: 'Building permits, business licenses, contractor registrations', features: ['Multi-jurisdiction', 'Status tracking', 'Owner lookup', 'Timeline analysis', 'Compliance checks'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'RRC Production Data', icon: '🛢️', desc: 'Texas Railroad Commission well production, drilling permits, completion reports', features: ['Well-level data', 'Production history', 'Operator tracking', 'Field analysis', 'CSV/API export'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Tax Assessment Scraper', icon: '🏦', desc: 'County tax appraisal districts, assessed values, property tax records', features: ['Multi-county', 'Valuation history', 'Appeal tracking', 'Exemption detection', 'Batch processing'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'social',
    label: 'Social & Market Intelligence',
    icon: '📡',
    desc: 'Social media intelligence, brand monitoring, and market research scrapers.',
    scrapers: [
      { name: 'Twitter / X Intelligence', icon: '🐦', desc: 'Keyword tracking, sentiment analysis, influencer mapping, trend detection', features: ['Real-time tracking', 'Sentiment scoring', 'Influencer ranking', 'Thread extraction', 'Export to analytics'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Reddit Monitor', icon: '🔴', desc: 'Subreddit tracking, comment analysis, post scoring, brand mentions', features: ['Multi-subreddit', 'Keyword alerts', 'Sentiment trends', 'Top poster analysis', 'Data export'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Review Aggregator', icon: '⭐', desc: 'Google Reviews, Trustpilot, G2, Capterra — unified review intelligence', features: ['Multi-platform', 'Rating trends', 'Keyword extraction', 'Competitor comparison', 'Alert system'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Crypto Alpha Scanner', icon: '🔍', desc: 'DEX launches, whale wallets, smart money tracking, token analytics', features: ['On-chain analysis', 'Whale alerts', 'Token scoring', 'Liquidity tracking', 'Risk detection'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Competitive Intel Scraper', icon: '🕵️', desc: 'Competitor pricing, feature changes, hiring signals, press releases', features: ['Price monitoring', 'Feature tracking', 'Job posting analysis', 'Press monitoring', 'Changelog scraping'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
  {
    id: 'data',
    label: 'Data Harvesters & Pipelines',
    icon: '🔄',
    desc: 'Bulk data collection, transformation, and enrichment pipelines.',
    scrapers: [
      { name: 'API Harvester', icon: '⚡', desc: 'Bulk data extraction from REST/GraphQL APIs with rate limiting and pagination', features: ['Auto-pagination', 'Rate limiting', 'Schema detection', 'Error retry', 'Incremental sync'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Document Processor', icon: '📄', desc: 'PDF, DOCX, images — OCR, table extraction, metadata parsing', features: ['Multi-format', 'OCR + Tesseract', 'Table extraction', 'Metadata parsing', 'Vector embedding'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Knowledge Harvester', icon: '🧠', desc: 'Multi-source knowledge ingestion — feeds, APIs, databases, files', features: ['56+ sources', '18 categories', 'Auto-categorize', 'Deduplication', 'Semantic indexing'], tag: 'LIVE', tagColor: '#10b981' },
      { name: 'Email Parser Pipeline', icon: '📬', desc: 'Extract structured data from email inboxes — invoices, receipts, notifications', features: ['IMAP integration', 'Template matching', 'Data extraction', 'Auto-filing', 'Webhook output'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
      { name: 'Spreadsheet ETL', icon: '📊', desc: 'Google Sheets, Excel, CSV — normalize, transform, and load into databases', features: ['Multi-format', 'Schema mapping', 'Validation rules', 'Scheduled runs', 'Error reporting'], tag: 'READY', tagColor: '#3b82f6' },
      { name: 'Web Archive Crawler', icon: '🕸️', desc: 'Full-site archival crawling with deduplication, version tracking', features: ['Full-site crawl', 'Version history', 'Asset download', 'Link validation', 'Sitemap generation'], tag: 'CUSTOM', tagColor: '#8b5cf6' },
    ],
  },
];

const FAQS = [
  { q: 'What types of data can your scrapers extract?', a: 'Our scrapers handle structured and unstructured data from virtually any web source — HTML pages, JavaScript-rendered SPAs, REST/GraphQL APIs, PDFs, spreadsheets, and more. We extract text, tables, images, metadata, and nested data structures, then normalize everything into clean JSON, CSV, or database records.' },
  { q: 'Can you scrape JavaScript-heavy websites and single-page apps?', a: 'Yes. Our scraping stack includes headless browser rendering powered by Cloudflare Browser Rendering and Playwright. This means we fully execute JavaScript, wait for dynamic content to load, handle infinite scroll, and interact with page elements — just like a real user would.' },
  { q: 'How do you handle rate limiting and anti-bot protections?', a: 'Every scraper includes intelligent rate limiting with configurable delays, automatic retry with exponential backoff, rotating proxy support, and browser fingerprint randomization. We respect robots.txt by default and design scrapers to be polite and resilient, avoiding bans while maintaining high throughput.' },
  { q: 'What export formats and integrations are supported?', a: 'Scraped data can be exported as JSON, CSV, Parquet, or streamed directly into your database. We support real-time webhooks, REST API access, D1/R2 cloud storage, and direct integrations with tools like Google Sheets, Airtable, PostgreSQL, and custom data pipelines.' },
  { q: 'Is web scraping legal? How do you ensure compliance?', a: 'Web scraping of publicly available data is generally legal, but compliance depends on the source and jurisdiction. We build scrapers that respect robots.txt, honor Terms of Service where applicable, avoid scraping personal data without consent, and comply with CFAA, GDPR, and CCPA guidelines. We always recommend consulting legal counsel for sensitive use cases.' },
  { q: 'Can scrapers run on a schedule or be triggered automatically?', a: 'Absolutely. All scrapers deploy on Cloudflare Workers with built-in cron triggers for scheduled runs — hourly, daily, weekly, or custom intervals. You can also trigger scrapes on-demand via API call or webhook, and chain multiple scrapers together in automated data pipelines.' },
];

const PRICING_TIERS = [
  { tier: 'Starter', price: 399, interval: 'one-time', features: ['1 scraper, 1 source', 'Basic scheduling (cron)', 'CSV/JSON export', 'Cloudflare Workers hosting', '30 days support'], popular: false },
  { tier: 'Professional', price: 1299, interval: 'one-time', features: ['1 scraper, multi-source', 'Anti-detection suite', 'D1 database + R2 storage', 'Real-time webhooks', 'Analytics dashboard', '90 days support'], popular: true },
  { tier: 'Enterprise', price: null, interval: 'mo', features: ['Unlimited scrapers', 'Proxy rotation', 'Custom data pipelines', 'SLA guarantee', 'Dedicated engineer', 'Priority support'], popular: false, custom: true },
];

export default function ScrapersPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('web');
  const currentCategory = SCRAPER_CATEGORIES.find(c => c.id === activeCategory) || SCRAPER_CATEGORIES[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Custom Scraper Factory — Echo Prime Technologies</h1><p>Industrial-grade data extraction. Web scrapers, API harvesters, document processors, and intelligence pipelines built to your spec, deployed on Cloudflare Workers. Categories include web scrapers for e-commerce, real estate, and job boards; government and legal scrapers for county deeds, SEC filings, and court documents; social media intelligence for Twitter, Reddit, and reviews; and data harvester pipelines for APIs, documents, and knowledge ingestion. Pricing starts at $399 one-time for a starter scraper build.</p></div></noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Scrapers', href: '/scrapers' }]} />
      <FaqSchema faqs={FAQS} />
      <ProductTutorialButton tutorialId="scrapers" productName="Custom Scrapers" />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={36} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>Scraper Factory</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/bots" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Bot Factory</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Home</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div data-tutorial="scrapers-hero" className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(20,184,166,0.1)', color: 'var(--ept-accent)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
            {SCRAPER_CATEGORIES.reduce((t, c) => t + c.scrapers.length, 0)} Scraper Templates Available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
            Custom <span className="gradient-text">Scraper</span> Factory
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
            Industrial-grade data extraction. Web scrapers, API harvesters, document processors, and intelligence pipelines — built to your spec, deployed on Cloudflare Workers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:bob@echo-op.com?subject=Scraper%20Build%20Request" className="px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Request a Scraper Build
            </a>
            <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold border transition-transform hover:scale-105" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View Pricing
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {SCRAPER_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--ept-accent)' : 'var(--ept-surface)',
                color: activeCategory === cat.id ? '#fff' : 'var(--ept-text-secondary)',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-center mb-8">
          <p className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>{currentCategory.icon} {currentCategory.label}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{currentCategory.desc}</p>
        </div>

        {/* Scraper Grid */}
        <div data-tutorial="scrapers-templates" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {currentCategory.scrapers.map(s => (
            <div
              key={s.name}
              className="p-6 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <h3 className="font-bold" style={{ color: 'var(--ept-text)' }}>{s.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: s.tagColor }}>
                  {s.tag}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
              <ul className="space-y-1.5">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div data-tutorial="scrapers-features" className="rounded-2xl border p-8 mb-16" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: 'var(--ept-text)' }}>
            Our Scraping Stack
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>Enterprise-grade infrastructure powering every scraper</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '☁️', title: 'Cloudflare Workers', desc: 'Edge-deployed scrapers running in 300+ cities. Zero cold starts, auto-scaling, built-in cron.' },
              { icon: '🗄️', title: 'D1 + R2 Storage', desc: 'SQLite-compatible databases + S3-compatible object storage. No infrastructure to manage.' },
              { icon: '🧠', title: 'AI Processing', desc: 'OCR, NLP, entity extraction, classification — AI enriches every data point automatically.' },
              { icon: '🔄', title: 'Anti-Detection', desc: 'Rotating proxies, browser fingerprinting, rate limiting, CAPTCHA handling for resilient scraping.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time monitoring, success rates, data quality scoring, alerting on anomalies.' },
              { icon: '🔗', title: 'API & Webhooks', desc: 'RESTful API for all data. Webhooks for real-time notifications. CSV, JSON, Parquet export.' },
            ].map(s => (
              <div key={s.title} className="text-center p-4">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="font-bold mt-2 mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div data-tutorial="scrapers-pricing" className="mb-16">
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: 'var(--ept-text)' }}>Scraper Build Pricing</h2>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>One-time build fee. Hosting on Cloudflare Workers included.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING_TIERS.map(t => (
              <div
                key={t.tier}
                className="p-6 rounded-xl border relative"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: t.popular ? '0 0 30px rgba(20,184,166,0.15)' : undefined,
                }}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--ept-text)' }}>{t.tier}</h3>
                <div className="mb-4">
                  {t.custom ? (
                    <span className="text-2xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${t.price?.toLocaleString()}</span>
                      <span className="text-sm ml-1" style={{ color: 'var(--ept-text-muted)' }}>{t.interval}</span>
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--ept-accent)' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.custom ? 'mailto:bob@echo-op.com?subject=Enterprise%20Scraper%20Build' : 'mailto:bob@echo-op.com?subject=Scraper%20Build%20Request%20-%20' + t.tier}
                  className="block w-full text-center py-2.5 rounded-xl font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent',
                    color: t.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: t.popular ? 'none' : '1px solid var(--ept-border)',
                  }}
                >
                  {t.custom ? 'Contact Us' : 'Get Started'}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Need Custom Data?</h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Tell us what data you need — we&apos;ll build a scraper to extract it, clean it, and deliver it to you.
          </p>
          <a href="mailto:bob@echo-op.com?subject=Custom%20Scraper%20Request" className="inline-flex px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Start Your Scraper Project
          </a>
        </div>
      </div>

      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Scraping Intelligence Engine
        </h2>
        <EngineQueryPanel
          domains={['SE', 'DATA']}
          title="Ask the Scraping Intelligence Engine"
          placeholder="Ask about web scraping, data extraction..."
          exampleQueries={['How to bypass Cloudflare protection ethically', 'Best headless browser for scraping', 'Handling dynamic JavaScript content']}
        />
      </section>

      {/* FAQ */}
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
    </div>
  );
}
