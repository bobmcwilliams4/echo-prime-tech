'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does Instagram automation work?', answer: 'Connect your Instagram Business account via OAuth. Schedule posts, stories, and reels with AI-optimized timing. AI generates captions, suggests hashtags, and analyzes engagement patterns to maximize reach.' },
  { question: 'Is this safe for my account?', answer: 'Yes. We use only official Instagram Graph API endpoints — no scraping, no bot actions, no risk of shadowbanning. Your account stays safe because we never violate Instagram Terms of Service.' },
  { question: 'Can AI generate content for me?', answer: 'AI generates captions based on your image/video content and brand voice. Suggests trending hashtags specific to your niche. Creates content calendars based on your audience peak times and historical performance.' },
  { question: 'What analytics are available?', answer: 'Follower growth, engagement rate, reach, impressions, story views, reel performance, best posting times, hashtag effectiveness, competitor benchmarking, and audience demographics — all in real-time dashboards.' },
]

const features = [
  { title: 'Smart Scheduling', desc: 'AI analyzes your audience activity patterns and schedules posts at optimal times. Queue weeks of content with drag-and-drop calendar.' },
  { title: 'AI Captions', desc: 'Generate engaging captions from your images using AI. Match your brand voice, include calls-to-action, and optimize for engagement.' },
  { title: 'Hashtag Engine', desc: 'AI suggests hashtags based on content, niche, and current trends. Mix popular, mid-range, and niche tags for maximum discovery.' },
  { title: 'Story Scheduler', desc: 'Schedule Instagram Stories in advance. Multi-slide stories, polls, and countdown stickers supported. Auto-post at peak engagement times.' },
  { title: 'Reels Analytics', desc: 'Track reel performance: views, likes, shares, saves, and completion rate. AI identifies which reel styles work best for your audience.' },
  { title: 'Competitor Tracking', desc: 'Monitor competitor accounts: posting frequency, engagement rates, top-performing content, and hashtag strategies.' },
  { title: 'Content Calendar', desc: 'Visual calendar showing all scheduled posts, stories, and reels. Drag-and-drop rescheduling. Template-based content planning.' },
  { title: 'Engagement Analytics', desc: 'Deep metrics: engagement rate by post type, best days/times, follower growth trends, reach vs impressions, and audience quality score.' },
  { title: 'Bio Link Page', desc: 'Customizable link-in-bio page with click tracking. Direct traffic to multiple destinations with branded mini-landing pages.' },
  { title: 'Comment Management', desc: 'AI filters spam, flags important comments, and suggests replies. Bulk actions for comment moderation across all posts.' },
  { title: 'Audience Insights', desc: 'Demographics, location, active hours, and interest categories of your followers. Identify your most engaged audience segments.' },
  { title: 'Webhook Events', desc: 'Real-time notifications for new followers, comments, mentions, and engagement milestones. Route to Slack, email, or any endpoint.' },
]

const comparison = [
  { feature: 'AI captions', echo: 'GPT-powered + brand voice', later: 'AI caption writer', hootsuite: 'OwlyWriter AI', buffer: 'AI assistant' },
  { feature: 'Hashtag AI', echo: 'Niche-aware trending', later: 'Hashtag suggestions', hootsuite: 'Basic', buffer: 'No' },
  { feature: 'Reels scheduling', echo: 'Yes + analytics', later: 'Yes', hootsuite: 'Yes', buffer: 'Yes' },
  { feature: 'Story scheduling', echo: 'Multi-slide + polls', later: 'Yes', hootsuite: 'Yes', buffer: 'Yes' },
  { feature: 'Competitor tracking', echo: 'AI benchmarking', later: 'No', hootsuite: 'Add-on', buffer: 'No' },
  { feature: 'Bio link page', echo: 'Built-in + tracking', later: 'Linkin.bio', hootsuite: 'No', buffer: 'Start Page' },
  { feature: 'Comment AI', echo: 'Filter + suggest + bulk', later: 'No', hootsuite: 'Stream', buffer: 'No' },
  { feature: 'Analytics depth', echo: 'Audience + content + growth', later: 'Good', hootsuite: 'Professional', buffer: 'Basic' },
  { feature: 'Webhook events', echo: 'Real-time to any endpoint', later: 'No', hootsuite: 'No', buffer: 'No' },
  { feature: 'Official API only', echo: 'Yes (safe)', later: 'Yes', hootsuite: 'Yes', buffer: 'Yes' },
  { feature: 'Starting price', echo: '$19/mo', later: '$25/mo', hootsuite: '$99/mo', buffer: '$6/mo' },
]

export default function InstagramAiPage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#e1306c'

  return (
    <>
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Instagram AI', href: '/instagram-ai' }]} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #e1306c, #fd1d1d, #f77737)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Instagram AI</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>AI-powered Instagram management. Smart scheduling, AI captions, hashtag optimization, competitor tracking, and deep analytics — grow your Instagram on autopilot.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=instagram-ai&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Instagram Growth On Autopilot</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Later</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Hootsuite</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Buffer</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.later}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.hootsuite}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.buffer}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['1 Instagram account', '30 scheduled posts/mo', 'AI captions', 'Hashtag suggestions', 'Basic analytics', 'Email support'], cta: 'starter' },
              { tier: 'Professional', price: '$59', period: '/mo', features: ['5 accounts', 'Unlimited posts', 'Stories + Reels', 'Competitor tracking', 'Content calendar', 'Bio link page', 'Comment management', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Agency', price: '$149', period: '/mo', features: ['25 accounts', 'White-label reports', 'Team collaboration', 'Client management', 'Bulk scheduling', 'API access', 'Webhook events', 'Dedicated support'], cta: 'agency' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=instagram-ai&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
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
