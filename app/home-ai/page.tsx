'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

/* ==============================================================================
   ECHO HOME AI — Whole-Home Intelligence & Automation
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-home-ai.bmcii1976.workers.dev (30 endpoints, 8 D1 tables)
   ============================================================================== */

const FEATURES = [
  { title: 'Smart Device Control', desc: '40+ device brands. Lights, locks, thermostats, cameras, alarms, vacuums — unified in one dashboard.', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Family Task Management', desc: 'Chore boards, kid reward points, shared calendar, and assignment tracking for every family member.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'Bill Tracking & Finance', desc: 'Every household bill in one place. Autopay detection, due-date alerts, and spending breakdowns.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'AI Homework Tutoring', desc: 'Math, science, English, and SAT prep. Adaptive difficulty that meets each student where they are.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Voice AI (ConvoAI)', desc: 'Natural voice commands, morning briefings, weather updates, and intelligent call screening.', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { title: 'Robot Control', desc: 'Vacuums, mowers, and pool robots all managed from one interface with scheduling and zone mapping.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Energy Optimization', desc: 'Real-time usage tracking, cost reduction recommendations, and AI-powered smart scheduling.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Home Security Command', desc: 'Cameras, smart locks, alarm systems, and motion sensors in a unified security dashboard.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Scene Automation', desc: '"Movie Night", "Good Morning", "Away Mode" — build custom scenes that trigger multiple devices at once.', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Multi-Property', desc: 'Manage vacation homes, rental properties, and your primary residence all from a single account.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
];

const COMPARISON = [
  { feature: 'Unified bill tracking', echo: true, google: false, alexa: false, apple: false },
  { feature: 'AI homework tutoring', echo: true, google: false, alexa: false, apple: false },
  { feature: 'Robot control (vacuum + mower + pool)', echo: true, google: 'Partial', alexa: 'Partial', apple: false },
  { feature: 'Energy optimization AI', echo: true, google: 'Basic', alexa: 'Basic', apple: false },
  { feature: 'Family task boards', echo: true, google: false, alexa: false, apple: false },
  { feature: 'Voice call screening', echo: true, google: false, alexa: false, apple: false },
  { feature: '40+ device brands', echo: true, google: true, alexa: true, apple: 'Limited' },
  { feature: 'Scene automation', echo: true, google: true, alexa: true, apple: true },
  { feature: 'Multi-property support', echo: true, google: false, alexa: false, apple: false },
  { feature: 'No hardware required', echo: true, google: false, alexa: false, apple: false },
];

const PRICING = [
  { tier: 'Starter', price: 14.99, features: ['20 devices', 'Basic automation', '1 voice line', 'Bill tracking', 'Scene builder'], cta: 'Start Free Trial', href: '/checkout?service=home-ai&tier=starter', popular: false },
  { tier: 'Family', price: 29.99, features: ['50 devices', 'Homework tutoring (2 kids)', 'Full bill management', 'Robot control', 'Family task boards', 'Energy reports'], cta: 'Get Family Plan', href: '/checkout?service=home-ai&tier=family', popular: true },
  { tier: 'Premium', price: 49.99, features: ['100 devices', 'Unlimited tutoring', 'Energy optimization AI', 'Multi-property (2 homes)', 'Priority support', 'Call screening'], cta: 'Start Free Trial', href: '/checkout?service=home-ai&tier=premium', popular: false },
  { tier: 'Estate', price: 99.99, features: ['Unlimited devices', 'Unlimited everything', 'Dedicated account manager', 'Priority support', 'Multi-property (unlimited)', 'Custom integrations'], cta: 'Contact Sales', href: 'mailto:bob@echo-op.com', popular: false },
];

const FAQS = [
  { q: 'Do I need to buy special hardware?', a: 'No. Echo Home AI is a software platform that connects to the smart devices you already own. We support 40+ brands including Tuya, Ring, Nest, Philips Hue, Ecobee, August, and more. If it has Wi-Fi or Zigbee, we probably support it.' },
  { q: 'How does AI homework tutoring work?', a: 'Students interact with our AI tutor through text or voice. It covers math, science, English, and SAT prep with adaptive difficulty. The AI identifies weak areas and adjusts questions accordingly. Parents get weekly progress reports.' },
  { q: 'Is my data private?', a: 'Absolutely. We do not sell your data, serve ads, or share information with third parties. All data is encrypted at rest and in transit. Voice commands are processed and discarded — we do not store recordings.' },
  { q: 'Can I manage a rental property remotely?', a: 'Yes. Multi-property support lets you manage multiple homes from one account. Set guest access codes, monitor energy usage, and receive security alerts for each property independently.' },
  { q: 'What happens if I cancel?', a: 'You can cancel anytime. Your data is retained for 30 days in case you reactivate. After that, it is permanently deleted per our privacy policy. No cancellation fees, no contracts.' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

export default function HomeAIPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/services" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Services</Link>
          <Link href="/checkout?service=home-ai&tier=starter" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">Echo Home AI</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>Whole-Home Intelligence & Automation</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Google and Alexa listen to sell you ads. We listen to run your home.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/checkout?service=home-ai&tier=starter" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#pricing" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Pricing</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">40+ Device Brands</span>
          <span className="text-sm">30 API Endpoints</span>
          <span className="text-sm">8 D1 Tables</span>
          <span className="text-sm">Zero Hardware Required</span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Three steps. Five minutes. Your entire home under one roof.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Connect Your Devices', desc: 'Link your existing smart devices through our secure integration hub. We support Tuya, Ring, Nest, Hue, Ecobee, August, Wyze, TP-Link, and 30+ more brands. No new hardware needed.' },
            { step: '2', title: 'Set Up Your Household', desc: 'Add family members, assign roles, configure chore boards, link your bills, and set up homework profiles for your kids. The AI learns your routines within the first week.' },
            { step: '3', title: 'Let AI Run Your Home', desc: 'Voice commands, automated scenes, energy optimization, and proactive alerts. Echo Home AI handles the daily operations so you can focus on what matters.' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Everything Your Home Needs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>One platform replaces a dozen apps. Control devices, manage your family, track bills, tutor your kids, and secure your property.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitor Comparison ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Echo Home AI is the only platform that combines device control, family management, finances, education, and security in one place.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo Home AI</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Google Home</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Alexa</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Apple HomeKit</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.echo} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.google} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.alexa} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.apple} /></td>
                </tr>
              ))}
              <tr className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>Price</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>From $14.99/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Free*</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Free*</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Free*</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>*Requires hardware purchases ($50-$300+). Echo Home AI is software-only — works with devices you already own.</p>
      </section>

      {/* ── Built For Every Household ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built For Every Household</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Whether you rent an apartment or manage a ranch, Echo Home AI scales to fit your life.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Families with Kids', desc: 'Chore boards keep kids accountable. Homework AI tutors them through tough subjects. Reward points motivate good habits.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { title: 'Remote Workers', desc: 'Scene automation sets the perfect work environment. Energy optimization cuts costs during peak hours. Voice AI screens calls.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { title: 'Property Owners', desc: 'Monitor multiple properties from one dashboard. Set guest codes for Airbnb guests. Get security alerts per property.', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
            { title: 'Tech Enthusiasts', desc: '40+ device brands, scene builder, robot fleet control, and a full API. Build the smart home you have always wanted.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-7 h-7 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '40+', label: 'Device Brands' },
            { value: '30', label: 'API Endpoints' },
            { value: '10', label: 'Core Modules' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No contracts. No hardware fees. Cancel anytime.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map((plan, i) => (
            <div key={i} className="relative p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: plan.popular ? 2 : 1 }}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</span>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.tier}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/mo</span>
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.href.startsWith('mailto:') ? (
                <a href={plan.href} className="block text-center px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>{plan.cta}</a>
              ) : (
                <Link href={plan.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: plan.popular ? '#fff' : 'var(--ept-text)' }}>{plan.cta}</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <svg className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy Promise ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <svg className="w-10 h-10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>The Privacy Promise</h3>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            We do not sell your data. We do not serve ads. We do not share your information with third parties.
            Voice commands are processed and immediately discarded. All data is encrypted at rest and in transit.
            Your home is your business — we just help you run it.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6" style={{ color: 'var(--ept-text-muted)' }}>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              AES-256 Encryption
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Zero Ad Tracking
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              No Voice Storage
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              SOC 2 Compliant
            </span>
          </div>
        </div>
      </section>

      {/* ── Related Reading ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--ept-text)' }}>Related Reading</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/blog/smart-home-ai-automation-beyond-alexa" className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>Smart Home AI That Goes Beyond "Hey Alexa"</h3>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Predictive automation, energy optimization, and contextual security for 2026.</p>
          </Link>
          <Link href="/blog/edge-computing-cloudflare-workers-ai" className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>Edge Computing with Cloudflare Workers</h3>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>How we build always-on AI services with zero cold starts at the edge.</p>
          </Link>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>Ready to Take Control of Your Home?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Stop juggling ten apps. Start running your home from one intelligent platform.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/checkout?service=home-ai&tier=starter" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="/checkout?service=home-ai&tier=family" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Get Family Plan</Link>
          <a href="mailto:bob@echo-op.com" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Contact Sales</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Echo Prime Technologies -- Echo Home AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
