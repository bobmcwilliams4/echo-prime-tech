'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const FAQS = [
  { q: 'How does online booking work?', a: 'Share your booking link or embed the widget on your site. Clients choose a service, pick an available time slot, and confirm in under 60 seconds. Real-time availability prevents double-bookings automatically.' },
  { q: 'Can I sync with Google Calendar or Outlook?', a: 'Yes. Two-way calendar sync keeps your personal calendar and booking calendar in lockstep. Blocked times on either side are respected instantly so you never get conflicting appointments.' },
  { q: 'How do automated reminders work?', a: 'Email and SMS reminders are sent 24 hours and 1 hour before each appointment. Studies show this reduces no-shows by 60-80%. You can customize the timing and message content per service.' },
  { q: 'Can clients reschedule or cancel on their own?', a: 'Absolutely. Clients receive a manage-booking link in their confirmation email. They can reschedule to any open slot or cancel within the policy window you define — no phone calls needed.' },
  { q: 'Do you support group or class bookings?', a: 'Yes. Create group sessions with a capacity limit and clients book individual seats. The slot closes automatically once capacity is reached. Perfect for classes, workshops, and group consultations.' },
  { q: 'How does payment collection at booking work?', a: 'Connect Stripe and require full or partial payment at the time of booking. Deposits reduce no-shows even further. Refund policies are enforced automatically on cancellation.' },
];

const FEATURES = [
  { icon: '\u{1F4C5}', title: 'Online Booking Page', desc: 'Branded booking page your clients visit to self-schedule. Embed on your website or share a direct link.' },
  { icon: '\u{1F504}', title: 'Calendar Sync', desc: 'Two-way sync with Google Calendar, Outlook, and Apple Calendar. Conflicts blocked in real time.' },
  { icon: '\u{1F552}', title: 'Availability Management', desc: 'Set weekly hours, buffer times, and blackout dates per provider. Prevent back-to-back burnout.' },
  { icon: '\u{1F3AF}', title: 'Smart Booking Flow', desc: 'Clients pick a service, provider, date, and time in a guided 4-step flow. Under 60 seconds to book.' },
  { icon: '\u{1F464}', title: 'Client Self-Service', desc: 'Clients reschedule, cancel, or update details through their booking link. Zero admin overhead.' },
  { icon: '\u{1F514}', title: 'Automated Reminders', desc: 'Email and SMS reminders at 24h and 1h before. Customizable timing and templates per service.' },
  { icon: '\u{1F4B3}', title: 'Payment Collection', desc: 'Require deposits or full payment at booking via Stripe. Reduce no-shows and guarantee revenue.' },
  { icon: '\u{1F465}', title: 'Group Bookings', desc: 'Offer classes and group sessions with capacity limits. Seats fill automatically until the session is full.' },
];

const PRICING = [
  { tier: 'Starter', price: 0, note: 'Free forever', features: ['1 provider', '3 services', 'Online booking page', 'Email reminders', 'Calendar view'], cta: 'Get Started Free', href: '/checkout?service=booking&tier=starter', popular: false },
  { tier: 'Professional', price: 29, note: '/mo', features: ['5 providers', 'Unlimited services', 'Calendar sync', 'SMS reminders', 'Payment collection', 'Group bookings', 'Client self-service'], cta: 'Start Free Trial', href: '/checkout?service=booking&tier=pro', popular: true },
  { tier: 'Business', price: 79, note: '/mo', features: ['Unlimited providers', 'Multi-location', 'Custom branding', 'Webhook integrations', 'API access', 'Priority support', 'Advanced analytics', 'Data export'], cta: 'Contact Sales', href: '/checkout?service=booking&tier=business', popular: false },
];

const BREADCRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/engines' },
  { name: 'Booking', href: '/booking' },
];

export default function BookingPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={BREADCRUMBS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section data-tutorial="book-hero" className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>ONLINE BOOKING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Your Calendar, Always Full.<br /><span className="gradient-text">Zero Phone Calls.</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Let clients book 24/7, sync every calendar, collect payments upfront, and eliminate no-shows with automated reminders. The booking system that runs itself.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=booking&tier=pro" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/appointments" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Appointments</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section data-tutorial="book-features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Everything You Need to Book Smarter</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section data-tutorial="book-pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.tier}</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold">{p.price === 0 ? 'Free' : `$${p.price}`}</span>
                {p.price > 0 && <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{p.note}</span>}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{f.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Fill Your Calendar?</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Start accepting bookings in under 5 minutes. No credit card required for the free tier.</p>
        <Link href="/checkout?service=booking&tier=pro" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
