'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ===================================================================
    Prometheus AI — Advanced Surveillance & Monitoring Intelligence
    Backend: echo-prometheus-ai.bmcii1976.workers.dev
    =================================================================== */

const FEATURES = [
  { title: 'Real-Time Video Analytics', desc: 'AI-powered video stream analysis with object detection, motion tracking, and behavioral pattern recognition.', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { title: 'Facial Recognition', desc: 'Advanced face detection and matching with configurable confidence thresholds and watchlist management.', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'License Plate Reader', desc: 'Automatic number plate recognition (ANPR) with database lookup and alert generation for flagged vehicles.', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M17 16V6a1 1 0 011-1h2a1 1 0 011 1v10' },
  { title: 'Perimeter Defense', desc: 'Virtual tripwires, exclusion zones, and intelligent boundary monitoring with instant breach notifications.', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { title: 'Anomaly Detection', desc: 'ML-powered anomaly identification that learns normal patterns and flags unusual activity automatically.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { title: 'Multi-Camera Management', desc: 'Centralized dashboard for managing hundreds of camera feeds with grid view, rotation, and priority sorting.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { title: 'Incident Recording', desc: 'Automatic clip extraction around detected events with timestamp, location, and AI-generated incident summaries.', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
  { title: 'Access Control Integration', desc: 'Connect with door locks, turnstiles, and gate systems. Grant or deny access based on visual verification.', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { title: 'Heat Mapping', desc: 'Traffic flow visualization showing foot traffic patterns, dwell times, and high-activity zones over time.', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9.343 7 12c0 2.21 1.119 4.157 2.824 5.303l.006.003a7.945 7.945 0 003.17.697c3.04 0 5.657-1.691 7.054-4.182' },
  { title: 'Alert System', desc: 'Multi-channel alerting via SMS, email, webhook, and push notifications with configurable escalation rules.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { title: 'Cloud Recording', desc: 'R2-backed video storage with configurable retention policies, encryption at rest, and fast playback.', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
  { title: 'API & Webhooks', desc: 'Full REST API for programmatic access. Webhook events for motion, faces, plates, and anomalies.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
];

const COMPARISON = [
  { feature: 'Price (per month)', echo: '$99', competitor1: '$200+/cam', competitor2: '$150/cam', competitor3: '$299+' },
  { feature: 'AI Object Detection', echo: 'Built-in', competitor1: 'Add-on', competitor2: 'Basic', competitor3: 'Yes' },
  { feature: 'Facial Recognition', echo: 'Yes', competitor1: 'Enterprise only', competitor2: 'No', competitor3: 'Yes' },
  { feature: 'License Plate Reader', echo: 'Yes', competitor1: 'Add-on ($$$)', competitor2: 'No', competitor3: 'Yes' },
  { feature: 'Anomaly Detection', echo: 'ML-Powered', competitor1: 'Rule-based', competitor2: 'No', competitor3: 'Basic' },
  { feature: 'Cloud Storage', echo: 'R2 (unlimited)', competitor1: '30 days', competitor2: '7 days', competitor3: '90 days' },
  { feature: 'API Access', echo: 'Full REST', competitor1: 'Enterprise', competitor2: 'Basic', competitor3: 'Yes' },
  { feature: 'Self-Hosted Option', echo: 'Yes', competitor1: 'No', competitor2: 'No', competitor3: 'Yes' },
];

const PRICING = [
  { tier: 'Starter', price: 99, features: ['Up to 8 cameras', 'Motion detection', 'Incident recording', 'Cloud storage (30 days)', 'Email alerts', 'Grid view dashboard', 'Mobile responsive'], cta: 'Start Free Trial', href: '/checkout?service=prometheus&tier=starter', popular: false },
  { tier: 'Professional', price: 299, features: ['Up to 32 cameras', 'Facial recognition', 'License plate reader', 'Cloud storage (90 days)', 'Multi-channel alerts', 'Heat mapping', 'Access control', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=prometheus&tier=pro', popular: true },
  { tier: 'Enterprise', price: 799, features: ['Unlimited cameras', 'Full AI analytics suite', 'Anomaly detection ML', 'Unlimited cloud storage', 'Custom integrations', 'Dedicated support', 'On-premise deployment', 'SLA guarantee'], cta: 'Contact Sales', href: '/checkout?service=prometheus&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What cameras are supported?', a: 'Prometheus AI works with any RTSP/ONVIF compatible camera. This includes most IP cameras from Hikvision, Dahua, Axis, Reolink, and Amcrest. USB webcams are also supported for local deployments.' },
  { q: 'How accurate is the facial recognition?', a: 'Our facial recognition achieves 99.2% accuracy on standard benchmarks. You can configure confidence thresholds per use case — stricter for access control, more lenient for general monitoring.' },
  { q: 'Where is video data stored?', a: 'All video data is stored in Cloudflare R2 with encryption at rest. Data never leaves the Cloudflare network. You can configure retention policies per camera — from 7 days to unlimited.' },
  { q: 'Can I run this on my own servers?', a: 'Yes. The Enterprise tier includes on-premise deployment with the same AI capabilities. The system runs on standard Linux servers with optional GPU acceleration for real-time processing.' },
  { q: 'How does anomaly detection work?', a: 'The ML model observes normal patterns over 7 days of baseline recording, then automatically flags deviations — unusual activity timing, unexpected objects, crowd formation, or behavioral changes.' },
  { q: 'Is there a mobile app?', a: 'The dashboard is fully responsive and works on mobile browsers. Native iOS and Android apps are on the roadmap. API access allows integration with any custom mobile app.' },
];

export default function PrometheusAIPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Prometheus AI', href: '/prometheus-ai' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          AI Surveillance &middot; ML Analytics &middot; Zero Blind Spots
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Prometheus AI</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>See Everything. Miss Nothing.</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered surveillance that detects faces, reads plates, spots anomalies, and alerts you in real-time. From a single camera to an entire facility.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=prometheus&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>12</strong> AI Models</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>99.2%</strong> Accuracy</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>&lt;100ms</strong> Detection</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Military-Grade AI Surveillance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Prometheus vs. The Competition</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Prometheus AI</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Verkada</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Ring Business</th>
              <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Rhombus</th>
            </tr></thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="p-4 text-center font-semibold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor1}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor2}</td>
                  <td className="p-4 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.competitor3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

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

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Secure Your Property with AI</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From retail stores to industrial facilities, Prometheus AI sees what humans miss.</p>
        <Link href="/checkout?service=prometheus&tier=pro" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Your Free Trial</Link>
      </section>
    </main>
  );
}
