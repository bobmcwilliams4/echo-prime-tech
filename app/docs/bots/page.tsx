'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '../../../lib/theme-context'
import BreadcrumbSchema from '../../../components/BreadcrumbSchema'
import FaqSchema from '../../../components/FaqSchema'

const SECTIONS = [
  { id: 'overview', label: 'Fleet Overview' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'capabilities', label: 'Bot Capabilities' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'opsec', label: 'OPSEC' },
  { id: 'auditor', label: 'Bot Auditor' },
  { id: 'api', label: 'API Reference' },
  { id: 'faq', label: 'FAQ' },
]

const PLATFORMS = [
  { name: 'Discord', icon: '🎮', status: 'LIVE', deploy: 'Create a Discord Application at discord.com/developers, generate a Bot token, add the bot to your server with Message Content + Slash Command intents, then store the token in the Echo Vault. The Worker registers slash commands on deploy and listens for interactions via webhook.' },
  { name: 'X / Twitter', icon: '🐦', status: 'LIVE', deploy: 'Apply for a Twitter Developer account, create a project with OAuth 2.0 + API v2 access, generate Bearer and user tokens. Configure tweet compose, reply, and timeline read scopes. The Worker posts on cron triggers and monitors mentions via filtered stream.' },
  { name: 'LinkedIn', icon: '💼', status: 'LIVE', deploy: 'Create a LinkedIn App under your organization page, request Community Management API and Sign In With LinkedIn. Store the OAuth2 client_id and client_secret in the vault. Posts go through an approval queue by default.' },
  { name: 'Telegram', icon: '✈️', status: 'LIVE', deploy: 'Message @BotFather on Telegram to create a new bot and receive the API token. Set the webhook URL to your Worker endpoint. The bot supports inline queries, group commands, and payment processing out of the box.' },
  { name: 'Reddit', icon: '🔴', status: 'LIVE', deploy: 'Register a script-type application at reddit.com/prefs/apps, obtain client_id and client_secret. Configure target subreddits and keyword triggers. The Worker monitors new posts and comments on matching threads.' },
  { name: 'Slack', icon: '💬', status: 'LIVE', deploy: 'Create a Slack App at api.slack.com/apps, enable Event Subscriptions pointing to your Worker URL, add bot scopes (chat:write, channels:read, commands). Install to your workspace and store the Bot User OAuth Token.' },
  { name: 'WhatsApp', icon: '📱', status: 'READY', deploy: 'Set up a Meta Business account and WhatsApp Business API via the Meta Developer Portal. Create a phone number, configure message templates, and point the webhook to your Worker. Supports text, image, and interactive button messages.' },
  { name: 'Messenger', icon: '📘', status: 'READY', deploy: 'Configure a Facebook Page, create a Meta App with Messenger platform, subscribe to message webhooks. The Worker handles structured replies, quick reply buttons, and persistent menu configuration.' },
  { name: 'Instagram', icon: '📸', status: 'CUSTOM', deploy: 'Connect via the Instagram Graph API through your Meta Business account. Enable messaging and content publishing scopes. The Worker schedules story and feed posts, auto-replies to DMs, and tracks hashtag performance.' },
]

const PERSONALITIES = [
  'Professional Advisor', 'Casual Friend', 'Technical Expert', 'Sales Closer',
  'Community Manager', 'News Anchor', 'Motivational Coach', 'Sarcastic Wit',
  'Data Analyst', 'Customer Support', 'Brand Ambassador', 'Thought Leader',
  'Entertainer', 'Educator',
]

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/bots', desc: 'List all bots with status, platform, and last activity timestamp.' },
  { method: 'POST', path: '/api/bots', desc: 'Create a new bot instance. Accepts platform, personality, schedule config, and target channels.' },
  { method: 'GET', path: '/api/bots/:id/analytics', desc: 'Engagement metrics, post performance, audience growth, and sentiment breakdown.' },
  { method: 'POST', path: '/api/bots/:id/post', desc: 'Trigger an immediate post. Accepts content, media URLs, and hashtag overrides.' },
  { method: 'PUT', path: '/api/bots/:id/schedule', desc: 'Update posting schedule. Accepts cron expression, timezone, and content categories.' },
  { method: 'GET', path: '/api/bots/:id/audit', desc: 'Latest audit report: health score, shadowban check, rate limit status, dedup results.' },
  { method: 'POST', path: '/api/bots/:id/personality', desc: 'Switch or customize the AI personality. Accepts preset name or full personality config object.' },
  { method: 'GET', path: '/api/fleet/summary', desc: 'Fleet-wide dashboard: total posts, total engagement, platform breakdown, alert count.' },
]

const FAQS = [
  { q: 'How many platforms can a single bot manage?', a: 'Professional tier bots support up to 5 platforms simultaneously from a single control panel. Each platform gets its own posting schedule, content adaptation, and analytics stream while sharing the same AI personality and knowledge base.' },
  { q: 'What AI personalities are available?', a: 'Echo Bot Fleet ships with 14 pre-built personalities ranging from Professional Advisor to Sarcastic Wit. Each personality controls tone, vocabulary, emoji usage, response length, and engagement style. You can also define fully custom personalities with your own prompt templates.' },
  { q: 'How does shadowban detection work?', a: 'The Bot Auditor runs platform-specific health checks every 6 hours. For X/Twitter, it checks reply visibility and search indexing. For Reddit, it monitors post visibility in subreddit listings. For Instagram, it tracks reach-to-follower ratios. Any anomaly triggers an alert with recommended remediation steps.' },
  { q: 'Can the bot generate images and media?', a: 'Yes. Bots can attach images, GIFs, and video clips to posts. Content can be sourced from your media library, generated via AI image models, or pulled from configured RSS/media feeds. Platform-specific formatting (Twitter cards, LinkedIn articles, Instagram carousels) is handled automatically.' },
  { q: 'What happens if a bot hits a rate limit?', a: 'Every bot runs behind an intelligent rate limiter that tracks per-platform quotas. When approaching limits, the bot queues posts and spaces them across available windows. If hard-limited, it pauses and resumes automatically. Rate limit events are logged and visible in the audit dashboard.' },
  { q: 'Is there a content approval workflow?', a: 'Yes. Each bot can be configured in auto-post or approval-required mode. In approval mode, generated content is queued for human review with one-click approve/reject/edit. LinkedIn bots default to approval mode given the professional context.' },
  { q: 'How does deduplication work across platforms?', a: 'The dedup engine hashes content before posting and checks against a 90-day rolling window. Exact duplicates are blocked. Near-duplicates (>85% similarity) are flagged for review. Cross-platform dedup ensures the same message is adapted, not copy-pasted, across channels.' },
]

export default function BotsDocsPage() {
  const { isDark } = useTheme()
  const [active, setActive] = useState('overview')

  const sectionStyle = { backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }
  const headingColor = { color: 'var(--ept-text)' }
  const bodyColor = { color: 'var(--ept-text-secondary)' }
  const mutedColor = { color: 'var(--ept-text-muted)' }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Bots', href: '/bots' },
        { name: 'Documentation', href: '/docs/bots' },
      ]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={36} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="text-lg font-bold" style={headingColor}>Bot Fleet Docs</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/bots" className="text-sm font-medium" style={mutedColor}>Bot Factory</Link>
          <Link href="/pricing" className="text-sm font-medium" style={mutedColor}>Pricing</Link>
          <Link href="/" className="text-sm font-medium" style={mutedColor}>Home</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ backgroundColor: active === s.id ? 'var(--ept-accent)' : 'var(--ept-surface)', color: active === s.id ? '#fff' : 'var(--ept-text-muted)' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Fleet Overview ── */}
        {active === 'overview' && (
          <section className="space-y-6 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-extrabold" style={headingColor}>Echo Bot Fleet Overview</h1>
            <p style={bodyColor}>Echo Bot Fleet deploys autonomous AI bots across 9 platforms. Every bot runs on Cloudflare Workers with D1 storage, KV cache, and cron-triggered posting schedules. Bots are backed by ConvoAI intelligence for natural conversation, content generation, and real-time engagement tracking.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {PLATFORMS.map(p => (
                <div key={p.name} className="p-4 rounded-xl border" style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{p.icon}</span>
                    <span className="font-bold text-sm" style={headingColor}>{p.name}</span>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: p.status === 'LIVE' ? '#10b981' : p.status === 'READY' ? '#3b82f6' : '#8b5cf6' }}>{p.status}</span>
                  </div>
                  <p className="text-xs" style={mutedColor}>{p.deploy.slice(0, 80)}...</p>
                </div>
              ))}
            </div>
            <p className="text-xs" style={mutedColor}>LIVE = deployed and operational. READY = built, awaiting platform credentials. CUSTOM = built to order with your specifications.</p>
          </section>
        )}

        {/* ── Getting Started ── */}
        {active === 'getting-started' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Getting Started</h2>
            <p style={bodyColor}>Each platform requires API credentials stored in the Echo Vault. Below is the deployment process for every supported platform.</p>
            <div className="space-y-4">
              {PLATFORMS.map((p, i) => (
                <div key={p.name} className="p-5 rounded-xl border" style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>{i + 1}</span>
                    <span className="text-lg">{p.icon}</span>
                    <h3 className="font-bold" style={headingColor}>{p.name}</h3>
                  </div>
                  <p className="text-sm" style={bodyColor}>{p.deploy}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Bot Capabilities ── */}
        {active === 'capabilities' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Bot Capabilities</h2>
            <div className="p-5 rounded-xl border" style={sectionStyle}>
              <h3 className="font-bold mb-2" style={headingColor}>14 AI Personalities</h3>
              <p className="text-sm mb-3" style={bodyColor}>Every bot ships with 14 pre-built personalities. Each controls tone, vocabulary, emoji frequency, response length, and engagement triggers. Switch personalities at runtime via the API or control panel.</p>
              <div className="flex flex-wrap gap-2">
                {PERSONALITIES.map(p => (
                  <span key={p} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{p}</span>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: 'ConvoAI Intelligence', d: 'LLM-powered conversation engine generates contextual replies, original posts, and thread continuations. Understands platform conventions — hashtags on X, professional tone on LinkedIn, memes on Reddit.' },
                { t: 'Autonomous Posting', d: 'Cron-triggered schedules post content without human intervention. Configure hourly, daily, or custom intervals. Content is generated fresh each cycle based on trending topics, your knowledge base, and engagement history.' },
                { t: 'Engagement Tracking', d: 'Every interaction is logged — likes, replies, shares, clicks, follows, and unfollows. Metrics are aggregated per post, per day, and per campaign for trend analysis.' },
                { t: 'Multi-Platform Sync', d: 'A single piece of content is adapted per platform — shortened for X, formatted with headers for LinkedIn, conversation-style for Reddit. Posting times are optimized per platform audience.' },
                { t: 'Content Categories', d: 'Organize content into categories (educational, promotional, engagement, curated, news) with configurable distribution ratios. Example: 40% educational, 20% promotional, 40% engagement.' },
                { t: 'Media Generation', d: 'Auto-generate social images, infographics, and quote cards. Attach media from your library or external feeds. Platform-specific formatting handled automatically.' },
              ].map(c => (
                <div key={c.t} className="p-4 rounded-xl border" style={sectionStyle}>
                  <h4 className="font-bold text-sm mb-1" style={headingColor}>{c.t}</h4>
                  <p className="text-xs" style={bodyColor}>{c.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Configuration ── */}
        {active === 'configuration' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Configuration</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Posting Schedules</h3>
                <p className="text-sm mb-2" style={bodyColor}>Schedules use cron syntax and support timezone-aware triggers. Common presets include peak-hours (9am, 12pm, 5pm local), business-hours (every 2h from 8am-6pm), and always-on (every 4h around the clock).</p>
                <div className="p-3 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
                  {`{ "cron": "0 9,12,17 * * 1-5", "timezone": "America/Chicago", "category_weights": { "educational": 40, "promotional": 20, "engagement": 40 } }`}
                </div>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Content Categories</h3>
                <p className="text-sm" style={bodyColor}>Define content buckets with weighted distribution. The AI selects the category for each post based on weights, then generates platform-appropriate content. Categories include educational, promotional, engagement, curated news, behind-the-scenes, and user-generated content reposts.</p>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Hashtag Strategy</h3>
                <p className="text-sm" style={bodyColor}>Configure hashtag pools per platform and category. The bot rotates hashtags to avoid repetition, mixes high-volume and niche tags, and tracks which hashtags drive the most engagement. X bots use 2-3 hashtags per post; Instagram bots use up to 30 with relevance scoring.</p>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Personality Tuning</h3>
                <p className="text-sm" style={bodyColor}>Each personality exposes tunable parameters: formality (0-100), emoji_density (0-10), response_length (short/medium/long), humor_level (0-5), and engagement_aggression (passive/moderate/active). Adjust these to match your brand voice exactly.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Analytics ── */}
        {active === 'analytics' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Analytics</h2>
            <p style={bodyColor}>Every bot collects engagement data per post and aggregates it into actionable dashboards. Metrics update in near real-time via platform webhooks and periodic polling.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: 'Post Performance', d: 'Impressions, reach, engagement rate, click-through rate, and shares for every published post. Compare performance across content categories and posting times.' },
                { t: 'Engagement Metrics', d: 'Likes, comments, reposts, saves, and profile visits broken down by platform. Track reply sentiment and identify top-performing conversation threads.' },
                { t: 'Audience Growth', d: 'Follower/subscriber count over time, follow/unfollow velocity, audience demographics (where available), and growth attribution by content type.' },
                { t: 'Conversion Tracking', d: 'Link click tracking with UTM parameters, landing page conversions, and revenue attribution for posts with product links or CTAs.' },
                { t: 'Best Time to Post', d: 'ML-driven analysis of your specific audience activity patterns. Suggests optimal posting windows per platform and adjusts cron schedules automatically when enabled.' },
                { t: 'Competitor Benchmarking', d: 'Track competitor engagement rates and posting frequency (public data only). Identify content gaps and trending topics in your niche.' },
              ].map(a => (
                <div key={a.t} className="p-4 rounded-xl border" style={sectionStyle}>
                  <h4 className="font-bold text-sm mb-1" style={headingColor}>{a.t}</h4>
                  <p className="text-xs" style={bodyColor}>{a.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── OPSEC ── */}
        {active === 'opsec' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>OPSEC &mdash; Operational Security</h2>
            <p style={bodyColor}>Bot operations require careful operational security to protect brand reputation and maintain platform standing. The following safeguards are built into every bot.</p>
            <div className="space-y-4">
              {[
                { t: 'Brand Safety Filters', d: 'Every generated post passes through a content safety pipeline before publishing. Filters check for profanity, controversial topics, competitor mentions, confidential information leaks, and off-brand messaging. Flagged content is held for human review.' },
                { t: 'Deduplication Engine', d: 'Content is hashed before posting and checked against a 90-day rolling window across all platforms. Exact duplicates are blocked. Near-duplicates (>85% cosine similarity) are flagged. Cross-platform posts are adapted, never copy-pasted.' },
                { t: 'Rate Limiting', d: 'Per-platform rate limiters track API quotas in real-time. Posts are queued and spaced when approaching limits. Hard limit events trigger automatic pause-and-resume. All rate limit events are logged in the audit trail.' },
                { t: 'Shadowban Detection', d: 'The Bot Auditor runs platform-specific visibility checks every 6 hours. Techniques include search indexing verification, reply visibility sampling, reach-to-follower ratio monitoring, and engagement rate anomaly detection. Alerts include remediation steps.' },
                { t: 'Credential Rotation', d: 'API tokens are stored in the Echo Vault with rotation reminders. When a token approaches expiry, the system alerts and can auto-rotate for platforms that support refresh tokens (LinkedIn, Reddit, Slack).' },
                { t: 'IP & Fingerprint Safety', d: 'All bot traffic routes through Cloudflare Workers, avoiding residential IP associations. User-agent strings match platform expectations. No headless browser fingerprints that could trigger automated detection.' },
              ].map(o => (
                <div key={o.t} className="p-5 rounded-xl border" style={sectionStyle}>
                  <h3 className="font-bold mb-1" style={headingColor}>{o.t}</h3>
                  <p className="text-sm" style={bodyColor}>{o.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Bot Auditor ── */}
        {active === 'auditor' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Bot Auditor</h2>
            <p style={bodyColor}>The Bot Auditor is an automated monitoring system that continuously validates bot health, content quality, and platform compliance. It runs independently on its own Cloudflare Worker.</p>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>6-Hour Audit Cycles</h3>
                <p className="text-sm" style={bodyColor}>Every 6 hours, the Auditor runs a full sweep of each active bot. Checks include: platform connectivity, token validity, posting success rate, engagement anomalies, shadowban indicators, content quality scoring, and rate limit headroom. Results are stored in D1 with a 90-day retention window.</p>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Daily Summary Reports</h3>
                <p className="text-sm" style={bodyColor}>At midnight UTC, the Auditor compiles a daily summary per bot and a fleet-wide rollup. Reports include: posts published, engagement totals, new followers, flagged content count, audit pass/fail status, and health score (0-100). Reports are delivered via webhook to your configured notification channels (Slack, Discord, email).</p>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Alert Escalation</h3>
                <p className="text-sm" style={bodyColor}>Critical alerts (token expired, shadowban detected, posting failure streak) escalate immediately without waiting for the next audit cycle. Warning alerts (engagement drop, approaching rate limits) are batched into the next summary. All alerts include one-click remediation actions where possible.</p>
              </div>
              <div className="p-5 rounded-xl border" style={sectionStyle}>
                <h3 className="font-bold mb-2" style={headingColor}>Health Score</h3>
                <p className="text-sm" style={bodyColor}>Each bot receives a health score from 0-100 based on weighted factors: token validity (20%), posting success rate (25%), engagement trend (20%), shadowban status (20%), and rate limit headroom (15%). Scores below 60 trigger a warning; below 40 triggers an automatic pause with escalation.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── API Reference ── */}
        {active === 'api' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>API Reference</h2>
            <p style={bodyColor}>All endpoints require authentication via <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>Authorization: Bearer &lt;token&gt;</code> header. Base URL routes through the SDK Gateway.</p>
            <div className="space-y-3">
              {API_ENDPOINTS.map(ep => (
                <div key={ep.path + ep.method} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start gap-3" style={sectionStyle}>
                  <span className="px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0"
                    style={{ backgroundColor: ep.method === 'GET' ? 'rgba(16,185,129,0.15)' : ep.method === 'POST' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                      color: ep.method === 'GET' ? '#10b981' : ep.method === 'POST' ? '#3b82f6' : '#f59e0b' }}>
                    {ep.method}
                  </span>
                  <div>
                    <code className="text-sm font-mono font-bold" style={headingColor}>{ep.path}</code>
                    <p className="text-xs mt-1" style={bodyColor}>{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        {active === 'faq' && (
          <section className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold" style={headingColor}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map(f => (
                <div key={f.q} className="p-5 rounded-xl border" style={sectionStyle}>
                  <h3 className="font-semibold mb-2 text-sm" style={headingColor}>{f.q}</h3>
                  <p className="text-sm" style={bodyColor}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to Product */}
        <div className="mt-12 text-center">
          <Link href="/bots" className="px-6 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105 inline-block" style={{ backgroundColor: 'var(--ept-accent)' }}>
            Explore the Bot Factory
          </Link>
        </div>
      </div>
    </div>
  )
}
