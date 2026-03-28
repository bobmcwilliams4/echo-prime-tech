'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

/*  ═══════════════════════════════════════════════════════════════════
    Echo Appointments — AI-Powered Scheduling & Booking
    Backend: echo-appointments.bmcii1976.workers.dev
    ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { title: 'Online Booking', desc: 'Public booking page where clients choose a service, provider, and available time slot. Embed on your website or share a direct link.' },
  { title: 'Provider Management', desc: 'Add team members with roles, bios, and service capabilities. Each provider manages their own availability schedule.' },
  { title: 'Service Catalog', desc: 'Define services with duration, price, and description. Color-code for easy calendar viewing. Enable or disable services anytime.' },
  { title: 'Smart Availability', desc: 'Set weekly availability per provider with day-of-week rules. System automatically prevents double-booking and respects buffer times.' },
  { title: 'Automated Reminders', desc: 'Email reminders sent 24 hours and 1 hour before appointments. Reduce no-shows by up to 80% with automated notifications.' },
  { title: 'Appointment Lifecycle', desc: 'Full status tracking: scheduled → confirmed → completed. Handle cancellations, reschedules, and no-shows with one click.' },
  { title: 'AI Scheduling Insights', desc: 'AI analyzes booking patterns to predict peak hours, no-show risk per client, and optimal provider scheduling.' },
  { title: 'Calendar View', desc: 'Team calendar showing all appointments across providers. Filter by provider, service, or status. See approved time-off at a glance.' },
  { title: 'Client Self-Service', desc: 'Clients can book, reschedule, or cancel through your booking page. No phone calls needed. Confirmation emails sent automatically.' },
  { title: 'Provider Utilization', desc: 'See how booked each provider is. Identify underutilized team members and balance the workload across your team.' },
  { title: 'Revenue Tracking', desc: 'Track revenue by service, provider, and time period. See which services generate the most income and highest completion rates.' },
  { title: 'Multi-Location Ready', desc: 'Multi-tenant architecture supports multiple businesses or locations. Each tenant gets isolated data with full API access.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', echo: '$19/mo', c1: '$16/mo', c2: '$12/mo', c3: 'Free (limited)' },
  { feature: 'AI Insights', echo: 'Yes', c1: 'No', c2: 'No', c3: 'No' },
  { feature: 'Automated Reminders', echo: 'All tiers', c1: 'All tiers', c2: 'Premium', c3: 'Pro only' },
  { feature: 'Public Booking Page', echo: 'Yes', c1: 'Yes', c2: 'Yes', c3: 'Yes' },
  { feature: 'Provider Management', echo: 'Yes', c1: 'Premium', c2: 'Yes', c3: 'No' },
  { feature: 'No-Show Tracking', echo: 'Automatic', c1: 'Manual', c2: 'Manual', c3: 'No' },
  { feature: 'API Access', echo: 'Full REST', c1: 'Premium', c2: 'Enterprise', c3: 'No' },
  { feature: 'Revenue Analytics', echo: 'All tiers', c1: 'Premium', c2: 'Pro', c3: 'No' },
  { feature: 'Self-Hostable', echo: 'Cloudflare', c1: 'No', c2: 'No', c3: 'No' },
];

const PRICING = [
  { tier: 'Solo', price: 19, features: ['1 provider', '3 services', 'Online booking page', 'Email reminders', 'Calendar view', 'Appointment management', 'Basic analytics'], cta: 'Start Free Trial', href: '/checkout?service=appointments&tier=solo', popular: false },
  { tier: 'Team', price: 49, features: ['10 providers', 'Unlimited services', 'AI scheduling insights', 'No-show prediction', 'Provider utilization', 'Revenue tracking', 'Client self-service', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=appointments&tier=team', popular: true },
  { tier: 'Business', price: 129, features: ['Unlimited providers', 'Unlimited services', 'Advanced AI analytics', 'Multi-location', 'Webhook integrations', 'Priority support', 'Custom booking pages', 'Data export'], cta: 'Contact Sales', href: '/checkout?service=appointments&tier=business', popular: false },
];

const FAQS = [
  { q: 'How does online booking work?', a: 'Share your booking URL or embed it on your website. Clients see available services, choose a provider, pick a time slot, and confirm. The system checks real-time availability so double-bookings are impossible.' },
  { q: 'How do automated reminders reduce no-shows?', a: 'Email reminders are sent 24 hours and 1 hour before each appointment. Studies show automated reminders reduce no-shows by 60-80%. Our AI also flags high-risk bookings based on client history.' },
  { q: 'Can I manage multiple team members?', a: 'Yes. Each provider has their own availability schedule, services they offer, and appointment calendar. The Team plan supports up to 10 providers, Business is unlimited.' },
  { q: 'What happens when a client cancels?', a: 'Cancelled appointments free up the time slot for new bookings automatically. You can also reschedule to a new time with one click. All changes are logged in the activity history.' },
  { q: 'Can clients book appointments on mobile?', a: 'The public booking page is fully responsive and works on any device. No app needed — clients just visit the URL and book. Works on iPhone, Android, tablets, and desktop.' },
  { q: 'How does the AI predict no-shows?', a: 'Our AI analyzes each client\'s appointment history — cancellation rate, reschedule frequency, and no-show history — to predict risk for each upcoming appointment. High-risk bookings are flagged so you can confirm or overbook strategically.' },
];

export default function AppointmentsPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Appointments', href: '/appointments' }]} />
      <FaqSchema faqs={FAQS} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', opacity: 0.9 }}>SCHEDULING & BOOKING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Stop Playing Phone Tag.<br /><span className="gradient-text">Automate Your Bookings.</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Online booking, automated reminders, no-show prediction, and provider scheduling. The appointment system that fills your calendar and keeps clients showing up.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/checkout?service=appointments&tier=solo" className="px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial — $19/mo</Link>
          <Link href="/engines" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See AI Engines</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Smart Scheduling Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Echo vs Calendly vs Acuity vs Square</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}><th className="p-3 text-left font-bold">Feature</th><th className="p-3 text-center font-bold">Calendly</th><th className="p-3 text-center font-bold">Acuity</th><th className="p-3 text-center font-bold">Square</th><th className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>Echo</th></tr></thead>
            <tbody>{COMPARISON.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                <td className="p-3 font-medium">{r.feature}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c1}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c2}</td><td className="p-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{r.c3}</td><td className="p-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Simple, Honest Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: p.popular ? 2 : 1 }}>
              {p.popular && <div className="text-xs font-bold mb-2" style={{ color: 'var(--ept-accent)' }}>MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{p.tier}</h3>
              <div className="my-4"><span className="text-4xl font-extrabold">${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>/mo</span></div>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map((f, j) => <li key={j} className="text-sm flex items-start gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={p.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: p.popular ? '#fff' : 'var(--ept-text)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

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

      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--ept-text)' }}>Ready to Fill Your Calendar?</h2>
        <p className="text-center mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Automate bookings and reduce no-shows. No credit card required.</p>
        <TrialCTA serviceId="echo-appointments" tier="starter" productName="Echo Appointments" />
      </section>

      <footer className="text-center py-10 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
