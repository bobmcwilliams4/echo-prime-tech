'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import FaqSchema from '../../components/FaqSchema';

/* ==============================================================================
   ECHO PROMETHEUS SURVEILLANCE — AI-Powered Intelligence & Monitoring
   Product page: hero, modules, features, comparison, pricing, FAQ
   Backend: echo-prometheus-surveillance.bmcii1976.workers.dev
   ============================================================================== */

const MODULES = [
  { id: 'gps', title: 'GPS Fleet Tracking', status: 'active', desc: 'Real-time GPS device tracking with historical playback, predictive movement analysis, and multi-device fleet management.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'cell', title: 'Cell Tower Intelligence', status: 'active', desc: 'Cell tower triangulation via OpenCelliD, Google, BeaconDB, and Mylnikov. Carrier-level location intel via Twilio Lookup.', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0' },
  { id: 'intercept', title: 'Active Intercept', status: 'active', desc: 'Packet capture coordination, MITM proxy management, WiFi monitoring (aircrack-ng), DNS interception, SSL/TLS inspection routing.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'camera', title: 'Camera Integration', status: 'active', desc: 'IP camera RTSP integration via ONVIF protocol. License plate recognition (ALPR) and facial recognition routing.', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { id: 'ip', title: 'IP Intelligence', status: 'active', desc: 'IP geolocation (3 free providers), threat intelligence (proxy/tor/bot/attacker/spam detection), bulk lookup (100/req), geo-search.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { id: 'phys', title: 'Physical Surveillance', status: 'active', desc: 'Geofencing with real-time alerts, SIM swap detection, CDR pattern analysis, SS7/Diameter protocol analysis.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

const CAPABILITIES = [
  'Real-time GPS device tracking',
  'Cell tower triangulation (4 providers)',
  'Carrier-level location intelligence',
  'SS7/Diameter protocol analysis',
  'SIM swap detection',
  'CDR pattern analysis',
  'IP camera RTSP integration (ONVIF)',
  'License plate recognition (ALPR)',
  'Facial recognition routing',
  'Geofencing with real-time alerts',
  'Packet capture coordination',
  'MITM proxy management',
  'WiFi monitoring (aircrack-ng)',
  'DNS interception',
  'SSL/TLS inspection routing',
  'Multi-device fleet tracking',
  'Historical location playback',
  'Predictive movement analysis',
  'IP geolocation (3 free providers)',
  'IP threat intelligence',
  'Bulk IP lookup (up to 100/req)',
  'IP threat feed tracking',
  'IP geo-search by area',
];

const COMPARISON = [
  { feature: 'GPS fleet tracking', echo: true, maltego: false, palantir: true, splunk: false },
  { feature: 'Cell tower triangulation', echo: true, maltego: false, palantir: true, splunk: false },
  { feature: 'IP threat intelligence', echo: true, maltego: true, palantir: true, splunk: true },
  { feature: 'ONVIF camera integration', echo: true, maltego: false, palantir: 'Partial', splunk: false },
  { feature: 'License plate recognition', echo: true, maltego: false, palantir: true, splunk: false },
  { feature: 'Packet capture / MITM', echo: true, maltego: false, palantir: false, splunk: 'Partial' },
  { feature: 'WiFi monitoring', echo: true, maltego: false, palantir: false, splunk: false },
  { feature: 'Geofencing alerts', echo: true, maltego: false, palantir: true, splunk: false },
  { feature: 'SIM swap detection', echo: true, maltego: false, palantir: false, splunk: false },
  { feature: 'Predictive movement', echo: true, maltego: false, palantir: true, splunk: false },
  { feature: 'No per-seat licensing', echo: true, maltego: false, palantir: false, splunk: false },
];

const PRICING = [
  { tier: 'Recon', price: 99, features: ['5 tracked devices', 'IP intelligence (1K lookups/mo)', 'Geofencing (10 zones)', 'Cell tower lookups (500/mo)', 'Email alerts', '7-day history'], cta: 'Start Free Trial', href: '/checkout?service=surveillance&tier=recon', popular: false },
  { tier: 'Operator', price: 299, features: ['25 tracked devices', 'IP intelligence (10K lookups/mo)', 'Geofencing (unlimited)', 'Cell tower (5K/mo)', 'Camera integration (10 feeds)', 'ALPR + facial routing', '90-day history', 'API access'], cta: 'Start Free Trial', href: '/checkout?service=surveillance&tier=operator', popular: true },
  { tier: 'Command', price: 799, features: ['Unlimited devices', 'Unlimited IP lookups', 'Full intercept suite', 'Unlimited cameras', 'Predictive analytics', 'SS7/Diameter analysis', '1-year history', 'Dedicated support', 'Custom integrations'], cta: 'Contact Sales', href: 'mailto:bob@echo-op.com?subject=Prometheus%20Command%20Tier', popular: false },
];

const FAQS = [
  { q: 'Who is this for?', a: 'Prometheus Surveillance is built for licensed private investigators, corporate security teams, law enforcement agencies, and enterprise security operations. All use must comply with applicable laws and regulations. We provide the tools — you provide the legal authority.' },
  { q: 'Is this legal?', a: 'The platform provides intelligence tools. Legality depends on your jurisdiction and authorization. GPS tracking of assets you own, monitoring your own network, and querying public IP data are generally lawful. Intercepting communications or tracking individuals without consent may require legal authority. Consult your legal team.' },
  { q: 'How does cell tower triangulation work?', a: 'We query 4 cell tower databases (OpenCelliD, Google Geolocation, BeaconDB, Mylnikov) to estimate device location based on visible cell towers. Accuracy ranges from 50m in urban areas to 2km in rural areas. Carrier-level lookups via Twilio provide additional precision.' },
  { q: 'What cameras are supported?', a: 'Any ONVIF-compatible IP camera. This includes most commercial brands: Hikvision, Dahua, Axis, Reolink, Amcrest, and hundreds more. We connect via RTSP streams and support PTZ control, motion detection events, and snapshot capture.' },
  { q: 'How does IP threat intelligence work?', a: 'We aggregate data from 3 free geolocation providers (ip-api, ipwhois, ipapi) and maintain a threat feed tracking proxies, Tor exit nodes, known botnets, attackers, and spam sources. Bulk lookups process up to 100 IPs per request. Geo-search finds all tracked IPs within a geographic radius.' },
  { q: 'Can I self-host?', a: 'The platform runs on Cloudflare Workers with D1 database storage. Enterprise customers can deploy to their own Cloudflare account for full data sovereignty. Contact sales for self-hosted deployment.' },
];

const USE_CASES = [
  { title: 'Corporate Security', desc: 'Monitor company assets, track fleet vehicles, detect unauthorized network access, and protect executive travel routes.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Private Investigation', desc: 'GPS tracking, cell tower analysis, historical location playback, and predictive movement patterns for authorized investigations.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Law Enforcement', desc: 'Real-time surveillance coordination, ALPR integration, facial recognition routing, geofencing, and evidence-grade audit trails.', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { title: 'Network Security', desc: 'IP threat detection, packet capture analysis, DNS monitoring, WiFi security auditing, and SSL/TLS inspection for SOC teams.', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

interface HealthData {
  status: string;
  modules: Record<string, string>;
  stats: Record<string, number>;
}

export default function SurveillancePage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    fetch('https://echo-prometheus-surveillance.bmcii1976.workers.dev/health')
      .then(r => r.json())
      .then((d: HealthData) => setHealth(d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Prometheus Surveillance - Echo Prime Technologies</h1>
          <p>AI-powered intelligence and physical monitoring platform with GPS tracking, cell tower triangulation, IP intelligence, camera integration, network interception, and predictive analytics. Built for authorized security professionals. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Surveillance', href: '/surveillance' }]} />
      <FaqSchema faqs={FAQS} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/security" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Cyber Defense</Link>
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=surveillance&tier=recon" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 animate-fade-up" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
          CODENAME: ARGUS PANOPTES
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">Prometheus Surveillance</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>AI-Powered Intelligence & Physical Monitoring</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          GPS tracking, cell tower triangulation, IP intelligence, camera integration, network interception, and predictive analytics — all in one platform on the edge.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/checkout?service=surveillance&tier=operator" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#modules" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>View Modules</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">6 Active Modules</span>
          <span className="text-sm">23 Capabilities</span>
          <span className="text-sm">Cloudflare Edge</span>
          <span className="text-sm">Zero Idle Cost</span>
        </div>
      </section>

      {/* Live Status */}
      {health && (
        <section className="max-w-4xl mx-auto px-6 pb-8">
          <div className="p-4 rounded-xl border flex flex-wrap items-center justify-center gap-6 text-xs" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: health.status === 'healthy' ? '#10b981' : '#ef4444' }} />
              <span style={{ color: 'var(--ept-text)' }}>System: {health.status === 'healthy' ? 'Operational' : health.status}</span>
            </span>
            {Object.entries(health.modules).map(([mod, status]) => (
              <span key={mod} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status === 'active' ? '#10b981' : '#f59e0b' }} />
                <span style={{ color: 'var(--ept-text-muted)' }}>{mod.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Modules */}
      <section id="modules" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>6 Intelligence Modules</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Each module operates independently. Activate what you need.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                </svg>
                <h3 className="font-bold text-sm" style={{ color: 'var(--ept-text)' }}>{m.title}</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{m.status}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full Capability List */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>23 Capabilities</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Every capability from the Prometheus engine, available via API and dashboard.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {CAPABILITIES.map((cap, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'transparent' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--ept-text)' }}>{cap}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Built For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-7 h-7 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={uc.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{uc.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>Enterprise-grade intelligence without enterprise pricing or per-seat licenses.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Capability</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>Prometheus</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Maltego</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Palantir</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Splunk</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.echo} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.maltego} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.palantir} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.splunk} /></td>
                </tr>
              ))}
              <tr className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>Starting Price</td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--ept-accent)' }}>$99/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$999/mo</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>Custom</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>$1,800/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '6', label: 'Active Modules' },
            { value: '23', label: 'Capabilities' },
            { value: '4', label: 'Cell Tower DBs' },
            { value: '3', label: 'IP Geo Providers' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat licensing. No data caps on core features. Scale up when you need to.</p>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
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

      {/* FAQ */}
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

      {/* Legal Notice */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <svg className="w-10 h-10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Authorized Use Only</h3>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Prometheus Surveillance tools are intended for authorized security professionals, licensed investigators,
            and law enforcement agencies operating within their legal jurisdiction. Unauthorized surveillance,
            interception, or tracking of individuals is illegal. Users are solely responsible for compliance
            with all applicable federal, state, and local laws.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Prometheus Surveillance by Echo Prime Technologies. Authorized use only.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/legal/terms" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/legal/privacy" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/security" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Cyber Defense</Link>
          <Link href="/" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Echo Prime</Link>
        </div>
      </footer>
    </div>
  );
}
