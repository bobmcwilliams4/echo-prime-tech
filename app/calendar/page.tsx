'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FEATURES = [
  { icon: '📅', title: 'Public Booking Pages', desc: 'Share a link and let clients book directly. Custom booking types with durations, prices, and questions.' },
  { icon: '⏰', title: 'Smart Slot Calculation', desc: 'Real-time available slots based on your availability rules, existing events, buffer times, and max daily bookings.' },
  { icon: '🔄', title: 'Recurring Events', desc: 'Daily, weekly, monthly recurrence rules with end dates. Never manually create repeating meetings again.' },
  { icon: '👥', title: 'Team Calendars', desc: 'Shared calendars with role-based access. See who is available across your entire team.' },
  { icon: '🛡️', title: 'Buffer Times', desc: 'Configurable buffers before and after meetings. No more back-to-back booking burnout.' },
  { icon: '📧', title: 'Automated Reminders', desc: 'Email reminders 15 minutes before every meeting. Reduce no-shows by up to 40%.' },
  { icon: '❌', title: 'Cancel & Reschedule', desc: 'Unique cancel/reschedule tokens per booking. Guests manage their own appointments.' },
  { icon: '📎', title: 'ICS Export', desc: 'Download any event as an .ics file. Works with Google Calendar, Outlook, Apple Calendar.' },
  { icon: '🤖', title: 'AI Scheduling', desc: 'AI suggests optimal meeting times based on booking patterns, attendance rates, and preferences.' },
  { icon: '💰', title: 'Paid Bookings', desc: 'Charge for consultations or sessions. Set prices per booking type with currency support.' },
  { icon: '📊', title: 'Booking Analytics', desc: 'Track bookings, cancellations, popular time slots, and booking type performance.' },
  { icon: '🌎', title: 'Timezone Support', desc: 'Full timezone-aware scheduling. Guests see slots in their local time automatically.' },
];

const COMPARISON = [
  { feature: 'Public booking pages', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'AI scheduling suggestions', echo: true, cal: false, calendly: false, acuity: false },
  { feature: 'Team calendars', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'Buffer times', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'Recurring events', echo: true, cal: true, calendly: false, acuity: false },
  { feature: 'Paid bookings', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'ICS export', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'Cancel/reschedule tokens', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'Custom questions', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'Automated reminders', echo: true, cal: true, calendly: true, acuity: true },
  { feature: 'API access', echo: true, cal: true, calendly: true, acuity: false },
  { feature: 'Multi-tenant / white-label', echo: true, cal: true, calendly: false, acuity: false },
  { feature: 'Self-hostable', echo: true, cal: true, calendly: false, acuity: false },
  { feature: 'Open source', echo: false, cal: true, calendly: false, acuity: false },
  { feature: 'Starting price', echo: '$9/mo', cal: '$12/mo', calendly: '$10/mo', acuity: '$16/mo' },
];

const TIERS = [
  { name: 'Starter', price: 9, features: ['1 calendar', '3 booking types', 'Unlimited bookings', 'Public booking pages', 'Email reminders', 'ICS export', 'Basic analytics'], cta: 'Start Scheduling' },
  { name: 'Pro', price: 29, popular: true, features: ['5 calendars', 'Unlimited booking types', 'Everything in Starter', 'Team calendars', 'AI scheduling', 'Paid bookings', 'Buffer times', 'Custom questions', 'Priority support'], cta: 'Go Pro' },
  { name: 'Business', price: 59, features: ['Unlimited calendars', 'Everything in Pro', 'Multi-tenant / white-label', 'Full API access', 'CSV/JSON export', 'Approval workflows', 'Dedicated support', 'Custom integrations'], cta: 'Go Business' },
];

const FAQS = [
  { q: 'How do booking pages work?', a: 'Create a booking type (e.g., "30-min consultation"), set your availability, and share the link. Guests see real-time available slots and book directly. No back-and-forth emails.' },
  { q: 'Can I charge for bookings?', a: 'Yes. Set a price per booking type (e.g., "$50 for 60-min coaching session"). Payment integration coming soon — currently tracks pricing for invoicing.' },
  { q: 'How do reminders work?', a: 'Reminders are automatically queued 15 minutes before each booked event and sent via email. Processed every 15 minutes via cron.' },
  { q: 'Can guests cancel or reschedule?', a: 'Yes. Each booking gets unique cancel and reschedule tokens. Share these in confirmation emails so guests can manage their own appointments.' },
  { q: 'Does it work with Google Calendar?', a: 'Yes — download any event as an .ics file that imports into Google Calendar, Outlook, Apple Calendar, or any standard calendar app.' },
  { q: 'Can I set different availability for different days?', a: 'Yes. Set recurring availability by day of week (e.g., Mon-Fri 9am-5pm) and add date-specific overrides for holidays or special schedules.' },
];

export default function CalendarPage() {
  const { isDark } = useTheme();
  const check = '✓';
  const cross = '✗';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Calendar', href: '/calendar' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Login</Link>
          <Link href="/checkout?service=calendar&tier=pro" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI-POWERED SCHEDULING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Scheduling That<br />
          <span className="gradient-text">Just Works.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Public booking pages, smart availability, automated reminders, and AI-powered scheduling suggestions. Stop emailing about meeting times.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=calendar&tier=pro" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--ept-text-muted)' }}>14-day free trial. No credit card required.</p>
      </section>

      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12">Everything You Need for Scheduling</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12">How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Calendar</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Cal.com</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Calendly</th>
                <th className="p-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Acuity</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="p-3">{row.feature}</td>
                  {[row.echo, row.cal, row.calendly, row.acuity].map((val, i) => (
                    <td key={i} className="p-3 text-center">
                      {typeof val === 'string' ? <span className="font-bold" style={{ color: i === 0 ? 'var(--ept-accent)' : 'var(--ept-text-secondary)' }}>{val}</span> : val ? <span style={{ color: '#22c55e' }}>{check}</span> : <span style={{ color: '#ef4444' }}>{cross}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4">Simple Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-booking fees. Unlimited bookings on every plan.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div key={tier.name} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: tier.popular ? 2 : 1 }}>
              {tier.popular && <div className="text-xs font-bold mb-3 text-center" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold">${tier.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm"><span style={{ color: 'var(--ept-accent)' }}>{check}</span><span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span></li>
                ))}
              </ul>
              <Link href={`/checkout?service=calendar&tier=${tier.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: tier.popular ? '#fff' : 'var(--ept-text)' }}>{tier.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Automate Your Scheduling?</h2>
        <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Stop emailing about availability. Let Echo Calendar handle it.</p>
        <Link href="/checkout?service=calendar&tier=pro" className="px-8 py-4 rounded-xl font-bold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>

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
