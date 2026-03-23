'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const SUPPORT_CHANNELS = [
  { title: 'Phone Support', desc: 'Talk to Bree — our AI customer service rep. Real conversations, real answers.', detail: '(432) 527-6112', href: 'tel:+14325276112', icon: 'P' },
  { title: 'Email Support', desc: 'Get help from our team within 24 hours.', detail: 'support@echo-ept.com', href: 'mailto:support@echo-ept.com', icon: 'M' },
  { title: 'Sentinel AI', desc: 'Ask our AI assistant anything — instant answers across 940+ domains.', detail: 'Available 24/7', href: '/sentinel', icon: 'S' },
  { title: 'Documentation', desc: 'Guides, API references, and integration docs.', detail: 'Self-service', href: '/knowledge', icon: 'D' },
];

const FAQ = [
  { q: 'How do I get started?', a: 'Sign up at echo-ept.com/signup and explore the dashboard. Most services include a free tier to get started.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe. Enterprise customers can request invoicing.' },
  { q: 'How do Intelligence Engines work?', a: 'Our 5,400+ engines embed real domain expertise — tax law, oilfield operations, cybersecurity, and 940+ more domains. They produce doctrine-backed responses with authority citations, not generic AI output.' },
  { q: 'Can I integrate your services into my own application?', a: 'Yes. All services are available via REST API with Bearer token authentication. See the API documentation in your dashboard after signing up.' },
  { q: 'What is your uptime guarantee?', a: 'We run on Cloudflare\'s global edge network with zero cold starts. Our infrastructure delivers 99.9%+ uptime across all services.' },
  { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from your dashboard under Settings. No contracts, no cancellation fees.' },
];

export default function SupportPage() {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://ept-api.bmcii1976.workers.dev/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
    } catch { /* best effort */ }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <Link href="/pricing" className="text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>View Pricing</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>How can we help?</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Reach out through any channel below. Our team and AI assistants are here to help you get the most out of Echo Prime Technologies.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SUPPORT_CHANNELS.map((ch) => (
            <Link key={ch.title} href={ch.href} className="p-6 rounded-xl border transition-all hover:opacity-90 card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4" style={{ backgroundColor: 'var(--ept-accent)' }}>{ch.icon}</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{ch.title}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--ept-text-secondary)' }}>{ch.desc}</p>
              <span className="text-xs font-mono" style={{ color: 'var(--ept-accent)' }}>{ch.detail}</span>
            </Link>
          ))}
        </div>

        {/* Contact Form + FAQ side by side on desktop */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>Send us a message</h2>
            {submitted ? (
              <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="text-4xl mb-4 gradient-text font-extrabold">Received</div>
                <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Thanks, {name}. We&apos;ll get back to you at {email} within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Subject</label>
                  <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Message</label>
                  <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 resize-none" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', '--tw-ring-color': 'var(--ept-accent)' } as React.CSSProperties} />
                </div>
                <button type="submit" className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Send Message</button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                    <span className="text-sm font-semibold pr-4" style={{ color: 'var(--ept-text)' }}>{item.q}</span>
                    <span className="text-lg flex-shrink-0" style={{ color: 'var(--ept-text-muted)' }}>{openFaq === i ? '\u2212' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)' }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-16 pt-8 border-t flex flex-wrap gap-6 text-sm" style={{ borderColor: 'var(--ept-border)' }}>
          <Link href="/legal/privacy" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Privacy Policy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Terms of Service</Link>
          <Link href="/legal/cookies" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Cookie Policy</Link>
          <Link href="/" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
