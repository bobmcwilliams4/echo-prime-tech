'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const PLATFORMS = ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook', 'Reddit', 'TikTok', 'YouTube', 'Threads'];

const FEATURES = [
  { icon: 'C', title: 'Content Calendar', desc: 'Visual calendar for planning posts across all platforms with time slots and assignments' },
  { icon: 'S', title: 'Smart Scheduling', desc: 'Schedule posts for optimal times based on AI analysis of your audience engagement data' },
  { icon: 'X', title: 'Cross-Post', desc: 'Write once, publish everywhere — adapt content for each platform automatically' },
  { icon: 'K', title: 'Campaigns', desc: 'Organize posts into campaigns with budgets, targets, and performance tracking' },
  { icon: 'A', title: 'AI Content Writer', desc: 'Generate platform-specific posts with tone control and hashtag suggestions' },
  { icon: 'H', title: 'Hashtag Manager', desc: 'Save and organize hashtag groups by category — auto-apply to posts' },
  { icon: 'T', title: 'Post Templates', desc: 'Create reusable templates with variables for consistent brand voice' },
  { icon: 'E', title: 'Engagement Analytics', desc: 'Track likes, comments, shares, impressions, and engagement rates across platforms' },
  { icon: 'B', title: 'Best Time Analysis', desc: 'AI analyzes your historical data to find optimal posting times by platform' },
  { icon: 'P', title: 'Performance Reports', desc: 'Daily engagement trends, top posts, platform comparison, and growth metrics' },
  { icon: 'M', title: 'Team Collaboration', desc: 'Invite editors and reviewers — assign calendar slots, approve posts before publishing' },
  { icon: 'R', title: 'API-First Design', desc: 'Full REST API — integrate with your existing tools, CRM, or automation workflows' },
];

const COMPARE = [
  ['Feature', 'Echo Social', 'Buffer', 'Hootsuite'],
  ['Platforms', '8', '8', '10+'],
  ['AI content generation', 'Built-in (5,400+ engines)', 'AI Assistant', 'OwlyWriter AI'],
  ['Content calendar', 'Yes', 'Yes', 'Yes'],
  ['Cross-posting', 'Yes', 'Yes', 'Yes'],
  ['Hashtag manager', 'Yes', 'No', 'No'],
  ['Post templates', 'Yes', 'No', 'Yes'],
  ['Campaign tracking', 'Yes', 'No', 'Yes'],
  ['Best time analysis', 'AI-powered', 'Limited', 'Yes'],
  ['Team collaboration', 'All plans', 'Team plan', 'Team plan'],
  ['API access', 'All plans', 'No', 'Enterprise'],
  ['Bulk scheduling', 'Yes', 'Yes', 'Yes'],
  ['Starting price', '$19/mo', '$6/mo', '$99/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['5 social accounts', '20 posts/day', 'Content calendar', 'AI content writer', 'Hashtag manager', 'Basic analytics'] },
  { name: 'Growth', price: '$49', per: '/mo', features: ['15 social accounts', '100 posts/day', 'Campaigns & tracking', 'Best time analysis', 'Post templates', 'Team (3 members)'], popular: true },
  { name: 'Agency', price: '$129', per: '/mo', features: ['50 social accounts', 'Unlimited posts', 'Full API access', 'Advanced analytics', 'White-label reports', 'Team (unlimited)'] },
];

const FAQS = [
  { q: 'How many social media accounts can I connect?', a: 'Depends on your plan. Starter supports 5 accounts, Growth supports 15, and Enterprise is unlimited. Each account can be on any platform — mix and match X, LinkedIn, Instagram, Facebook, Reddit, TikTok, Pinterest, and YouTube.' },
  { q: 'Can AI write my social media posts?', a: 'Yes. Provide a topic or link and AI generates platform-optimized posts with proper hashtags, character limits, and formatting. You can edit before scheduling or let it auto-post. Tone and style are configurable per account.' },
  { q: 'How does the content calendar work?', a: 'Drag-and-drop calendar with daily, weekly, and monthly views. Schedule posts for specific times across all platforms. See gaps in your publishing schedule at a glance. Bulk upload via CSV for batch scheduling.' },
  { q: 'Can I manage a team?', a: 'Growth and Enterprise plans include team collaboration. Assign roles (admin, editor, publisher), require approval before posting, and see who created, edited, and published each post.' },
  { q: 'What analytics are included?', a: 'Per-post and aggregate analytics: impressions, engagement rate, clicks, follower growth, best posting times, and top-performing content. Compare performance across platforms and time periods.' },
  { q: 'How does it compare to Buffer or Hootsuite?', a: 'Echo Social Media starts at $19/month flat — no per-channel fees. Buffer charges $6/channel and Hootsuite starts at $99/month. You get AI content generation, which neither offers natively, plus native integration with all Echo products.' },
];

export default function SocialMediaPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Social Media', href: '/social-media' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Social Media Manager</span></h1>
        <p className="text-xl md:text-2xl mb-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>Schedule. Analyze. Grow. AI-powered social media management.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up-delay-1">
          {PLATFORMS.map(p => (
            <span key={p} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{p}</span>
          ))}
        </div>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=social-media&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Grow</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell.startsWith('Built-in') || cell.startsWith('AI-') || cell.startsWith('All')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=social-media&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
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

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Grow Your Social Presence</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered social media management across 8 platforms. Schedule, analyze, and grow. Free trial, no credit card required.</p>
        <TrialCTA serviceId="echo-social-media" tier="starter" productName="Echo Social Media Manager" />
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
