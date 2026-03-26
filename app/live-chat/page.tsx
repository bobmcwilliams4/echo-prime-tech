'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { icon: 'W', title: 'Embeddable Widget', desc: 'One-line script tag adds a beautiful chat widget to any website — fully customizable colors, position, and greeting' },
  { icon: 'A', title: 'AI Auto-Responses', desc: 'When no agent is online, AI responds instantly using your knowledge base and custom instructions' },
  { icon: 'T', title: 'Team Inbox', desc: 'All conversations in one shared inbox with assignment, status tracking, and agent performance metrics' },
  { icon: 'V', title: 'Visitor Tracking', desc: 'See who is on your site in real-time — page URL, referrer, country, visit history, and custom data' },
  { icon: 'C', title: 'Canned Responses', desc: 'Save common replies with keyboard shortcuts for instant responses — slash commands like /pricing or /hours' },
  { icon: 'P', title: 'Pre-Chat Forms', desc: 'Collect visitor name and email before chat starts — optional fields you control per widget' },
  { icon: 'R', title: 'Conversation Ratings', desc: 'Visitors rate their experience after chat — track satisfaction scores per agent and overall' },
  { icon: 'G', title: 'Chat Triggers', desc: 'Auto-send messages based on visitor behavior — time on page, scroll depth, or URL patterns' },
  { icon: 'M', title: 'Multi-Widget', desc: 'Create different widgets for different pages — sales widget on pricing, support widget on docs' },
  { icon: 'D', title: 'Domain Allowlist', desc: 'Lock widgets to specific domains so only your authorized sites can use your chat' },
  { icon: 'B', title: 'Business Hours', desc: 'Set operating hours per widget — show online/offline greeting automatically based on schedule' },
  { icon: 'S', title: 'Analytics Dashboard', desc: 'Daily conversation trends, response times, agent performance, visitor counts, and satisfaction scores' },
];

const COMPARE = [
  ['Feature', 'Echo Live Chat', 'Intercom', 'Drift'],
  ['Chat widget', 'Yes', 'Yes', 'Yes'],
  ['AI auto-responses', 'All plans', 'Advanced+', 'Premium'],
  ['Visitor tracking', 'Yes', 'Yes', 'Yes'],
  ['Team inbox', 'Yes', 'Yes', 'Yes'],
  ['Canned responses', 'Yes', 'Yes', 'Yes'],
  ['Pre-chat forms', 'Yes', 'Yes', 'Yes'],
  ['Chat triggers', 'Yes', 'Pro+', 'Premium'],
  ['Multi-widget', 'Pro+', 'Enterprise', 'Premium'],
  ['Custom branding', 'All plans', 'Starter+', 'Pro+'],
  ['Conversation ratings', 'Yes', 'Yes', 'Yes'],
  ['API access', 'All plans', 'All plans', 'All plans'],
  ['Starting price', '$19/mo', '$39/seat/mo', '$50/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['1 widget', '3 agents', '100 conversations/day', 'AI auto-responses', 'Pre-chat forms', 'Canned responses', 'Visitor tracking'] },
  { name: 'Growth', price: '$49', per: '/mo', features: ['3 widgets', '10 agents', '500 conversations/day', 'Chat triggers', 'Business hours', 'Domain allowlist', 'Priority support'], popular: true },
  { name: 'Business', price: '$129', per: '/mo', features: ['Unlimited widgets', 'Unlimited agents', 'Unlimited conversations', 'Custom AI prompts', 'Remove branding', 'API access', 'Dedicated support'] },
];

const FAQS = [
  { q: 'How do I add live chat to my website?', a: 'Copy-paste a single JavaScript snippet into your site. The widget loads asynchronously (no performance impact) and inherits your brand colors. Works with any website — WordPress, Shopify, React, static HTML, anything.' },
  { q: 'Can AI handle chats automatically?', a: 'Yes. Configure AI auto-responses for common questions using your knowledge base. AI handles first-touch conversations, collects visitor info, and escalates to a human agent when needed. Average 40% of chats resolved without human intervention.' },
  { q: 'What visitor information do I see?', a: 'Real-time visitor tracking shows current page, referral source, location (city/country), device type, browser, visit history, and previous chat transcripts. See who is on your site right now.' },
  { q: 'Can multiple agents handle chats?', a: 'Yes. Team inbox with round-robin or manual assignment. Agents see all active chats, can transfer conversations, add internal notes, and use canned responses for fast replies.' },
  { q: 'Is there an offline mode?', a: 'When no agents are online, the widget converts to a contact form. Messages go to your team inbox and trigger email notifications. Visitors can also leave their email for follow-up.' },
  { q: 'How does pricing work?', a: 'Flat monthly fee — no per-chat or per-agent charges. Starter ($19/mo) includes 1 widget and 2 agents. Business ($49/mo) includes 5 widgets, unlimited agents, and AI auto-responses. Enterprise ($129/mo) adds white-label and API access.' },
];

export default function LiveChatPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/pricing' }, { name: 'Live Chat', href: '/live-chat' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=live-chat&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">Live Chat</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered website chat. Engage visitors. Close deals. Resolve tickets.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=live-chat&tier=starter" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Widget Preview */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>One Line of Code</h3>
          <p className="mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Add live chat to any website with a single script tag</p>
          <div className="rounded-lg p-4 text-left font-mono text-sm overflow-x-auto" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>
            {'<script src="https://echo-live-chat.bmcii1976.workers.dev/widget.js?id=YOUR_WIDGET_ID" async></script>'}
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything for Customer Conversations</h2>
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
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && (cell === 'Yes' || cell.startsWith('All') || cell.startsWith('$19')) ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
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
              <Link href={`/checkout?service=live-chat&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
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

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
