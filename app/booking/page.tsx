'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

const FEATURES = [
  { title: 'Real-Time Slot Finder', desc: 'Calculates available time slots based on staff availability, existing appointments, buffer times, time off, and service duration. No double-bookings.' },
  { title: 'Staff Management', desc: 'Track staff with service assignments, weekly availability schedules, time-off requests, bios, and performance ratings from customer reviews.' },
  { title: 'Service Catalog', desc: 'Define services with duration, pricing, buffer times, max attendees, colors, and categories. Assign multiple staff per service.' },
  { title: 'Appointment Lifecycle', desc: 'Full status tracking: confirmed, completed, cancelled, no-show, rescheduled. Each transition logged with timestamps.' },
  { title: 'AI No-Show Prediction', desc: 'Engine Runtime analyzes customer history — booking count, no-show rate, recent patterns — to predict no-show probability and recommend deposits or extra reminders.' },
  { title: 'AI Scheduling Insights', desc: 'Analyzes 90-day booking patterns by day and hour to recommend optimal staffing, overbooking strategies, and demand forecasting.' },
  { title: 'Smart Waitlist', desc: 'When a slot is full, customers join the waitlist. Cancellations auto-notify up to 3 waitlisted customers for the same service and date.' },
  { title: 'Recurring Appointments', desc: 'Set up weekly, biweekly, monthly, or custom recurring bookings. Auto-generated 14 days ahead via daily cron. Pause or cancel anytime.' },
  { title: 'Multi-Location', desc: 'Manage separate locations with their own addresses, timezones, and staff assignments. Availability scoped per location.' },
  { title: 'Customer Profiles', desc: 'Track booking history, total spent, no-show count, and last visit per customer. Full appointment history on each profile.' },
  { title: 'Reviews & Ratings', desc: 'Collect post-appointment reviews with star ratings and comments. Avg rating displayed on staff profiles.' },
  { title: 'Buffer Time Control', desc: 'Set buffer time before and after services for setup/cleanup. Global buffer or per-service buffers prevent back-to-back stress.' },
];

const COMPARISON = [
  { feature: 'Monthly Cost', calendly: '$12/seat', acuity: '$20+', echo: '$19 flat' },
  { feature: 'Real-Time Availability', calendly: 'Yes', acuity: 'Yes', echo: 'Yes' },
  { feature: 'AI No-Show Prediction', calendly: 'No', acuity: 'No', echo: 'Yes' },
  { feature: 'AI Scheduling Insights', calendly: 'No', acuity: 'No', echo: 'Yes' },
  { feature: 'Waitlist', calendly: 'No', acuity: 'Basic', echo: 'Auto-notify' },
  { feature: 'Recurring Bookings', calendly: 'No', acuity: 'Yes', echo: 'Auto-gen (cron)' },
  { feature: 'Multi-Location', calendly: 'No', acuity: 'Yes', echo: 'Yes' },
  { feature: 'Staff Reviews', calendly: 'No', acuity: 'No', echo: 'Built-in' },
  { feature: 'Buffer Times', calendly: 'Basic', acuity: 'Yes', echo: 'Per-service' },
  { feature: 'API Endpoints', calendly: 'REST', acuity: 'Limited', echo: '65+ REST' },
  { feature: 'Multi-Tenant', calendly: 'No', acuity: 'No', echo: 'Yes' },
  { feature: 'Per-Seat Pricing', calendly: 'Yes ($$$)', acuity: 'Yes', echo: 'No (flat)' },
];

const PRICING = [
  { name: 'Solo', price: '$19', period: '/mo', features: ['1 location', '3 staff', 'Unlimited bookings', 'Real-time availability', 'Waitlist', 'Customer profiles', 'Basic analytics'] },
  { name: 'Team', price: '$49', period: '/mo', features: ['3 locations', 'Unlimited staff', 'Recurring bookings', 'AI no-show prediction', 'Reviews & ratings', 'Time-off management', 'Full analytics', 'API access'] },
  { name: 'Enterprise', price: '$129', period: '/mo', features: ['Unlimited locations', 'Unlimited staff', 'AI scheduling insights', 'Custom booking rules', 'Webhook integrations', 'Priority support', 'White-label options', 'Audit log'] },
];

export default function BookingPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-bold text-lg" style={{ color: 'var(--ept-text)' }}>Echo Prime</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-accent)' }}>AI APPOINTMENT SCHEDULING</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6"><span className="gradient-text">Echo Booking</span></h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          Smart scheduling with real-time availability, AI no-show prediction, automatic waitlist notifications, and recurring appointment generation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Pricing</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ val: '65+', label: 'API Endpoints' }, { val: '13', label: 'Database Tables' }, { val: '15min', label: 'Slot Granularity' }, { val: '24/7', label: 'Auto-Scheduling' }].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)' }}>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Fill Your Calendar</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover animate-fade-up" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Echo Booking vs The Rest</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Flat pricing. No per-seat fees. AI built in.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Calendly</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Acuity</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Booking</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{r.feature}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.calendly}</td>
                  <td className="text-center px-4 py-3" style={{ color: 'var(--ept-text-muted)' }}>{r.acuity}</td>
                  <td className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>{r.echo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat fees. No per-booking fees. Flat monthly rate.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <div key={i} className={`p-6 rounded-xl border ${i === 1 ? 'ring-2 ring-[--ept-accent]' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ept-text)' }}>{p.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{p.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-surface)', color: i === 1 ? '#fff' : 'var(--ept-text)' }}>
                {i === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Fill Every Slot. Reduce No-Shows.</h2>
          <p className="mb-6" style={{ color: 'var(--ept-text-secondary)' }}>AI predicts which customers will skip, auto-notifies waitlisted clients on cancellations, and generates recurring appointments on autopilot.</p>
          <Link href="/signup" className="inline-block px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
}
