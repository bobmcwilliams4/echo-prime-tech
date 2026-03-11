'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

const SERVICE_ID = 'surveillance';

/* ================================================================
   FEATURE CARDS — 8 location intelligence capabilities
   ================================================================ */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'GPS Fleet Tracking',
    desc: 'Real-time GPS tracking for vehicles, equipment, and mobile assets. Sub-meter accuracy using multi-constellation GNSS (GPS, GLONASS, Galileo, BeiDou). Track speed, heading, altitude, and status across unlimited assets with configurable reporting intervals from 1-second to hourly. Historical breadcrumb trails, trip replay, mileage calculations, idle time detection, and driver behavior scoring included.',
    sources: ['Multi-GNSS', 'Sub-Meter Accuracy', 'Speed/Heading', 'Trip Replay', 'Idle Detection', 'Driver Scoring'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    title: 'Cell Tower Analysis',
    desc: 'Cell tower triangulation and network analysis for location intelligence. Map cell tower infrastructure, analyze signal propagation patterns, identify coverage gaps, and correlate device presence with tower connection logs. Supports historical cell tower data analysis for movement pattern reconstruction. Integration with carrier APIs for authorized law enforcement and corporate security investigations.',
    sources: ['Triangulation', 'Signal Analysis', 'Coverage Mapping', 'Connection Logs', 'Pattern Reconstruction', 'Carrier Integration'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'IP Geolocation',
    desc: 'High-accuracy IP geolocation with city-level precision and ISP identification. Resolve IP addresses to physical locations using proprietary databases updated daily from BGP routing tables, Wi-Fi positioning data, and ground-truth validation. Detect VPN, proxy, and Tor usage. Identify hosting providers, ASN ownership, and network topology. Batch processing for large-scale IP analysis with sub-second response times.',
    sources: ['City-Level Accuracy', 'ISP Identification', 'VPN Detection', 'Proxy Detection', 'ASN Lookup', 'Batch Processing'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: 'Carrier Intelligence',
    desc: 'Mobile carrier network intelligence for authorized investigations. Identify carrier associations, device types, number portability history, and roaming patterns. Cross-reference phone numbers with known databases for ownership verification. Supports HLR (Home Location Register) lookups, number validation, and carrier routing analysis. All carrier intelligence operations require proper legal authorization.',
    sources: ['HLR Lookups', 'Number Validation', 'Carrier ID', 'Port History', 'Roaming Patterns', 'Device Type'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Physical Surveillance Coordination',
    desc: 'Team coordination platform for physical surveillance operations. Real-time operative positioning on shared maps, encrypted team communications, target tracking with handoff protocols, observation logging with timestamps and GPS coordinates, and evidence chain-of-custody management. Supports multi-team operations with role-based access and compartmentalized intelligence sharing.',
    sources: ['Team Mapping', 'Encrypted Comms', 'Target Tracking', 'Handoff Protocols', 'Evidence Management', 'Role-Based Access'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: 'Geofence Alerts',
    desc: 'Define custom geographic boundaries (circles, polygons, or corridors) and receive instant alerts when tracked assets enter, exit, or dwell within zones. Configurable dwell time thresholds, multi-zone rule engines, and time-based scheduling for geofence activation/deactivation. Supports nested geofences, exclusion zones, and speed-triggered alerts within defined corridors. Unlimited geofences per account.',
    sources: ['Custom Polygons', 'Entry/Exit Alerts', 'Dwell Time', 'Speed Triggers', 'Nested Zones', 'Time Scheduling'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Route Analysis',
    desc: 'Reconstruct and analyze movement patterns from historical tracking data. Identify routine routes, habitual stops, deviation patterns, and time-of-day behaviors. AI-powered anomaly detection flags unusual route changes, unexpected stops, and pattern breaks. Generate heat maps showing frequency of visits to specific locations, corridor analysis for fleet optimization, and predictive modeling for future movements.',
    sources: ['Pattern Detection', 'Route Reconstruction', 'Anomaly Flags', 'Heat Maps', 'Corridor Analysis', 'Predictive Models'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: 'Real-Time Dashboard',
    desc: 'Unified command-and-control dashboard displaying all tracked assets, geofence status, active alerts, team positions, and intelligence feeds on a single interactive map. Multi-layer map view with satellite imagery, street maps, terrain, and custom overlays. Supports picture-in-picture for multiple simultaneous views, timeline scrubbing for historical playback, and full-screen command center mode for operations rooms.',
    sources: ['Interactive Map', 'Multi-Layer View', 'Satellite Imagery', 'Timeline Scrub', 'Command Center', 'Live Feed'],
  },
];

/* ================================================================
   HOW IT WORKS — 4-step process
   ================================================================ */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Deploy Assets',
    desc: 'Install GPS trackers on vehicles and equipment, configure mobile device tracking, set up IP monitoring rules, and define your area of operations. Our onboarding team helps configure optimal reporting intervals and alert thresholds for your specific use case.',
  },
  {
    step: '02',
    title: 'Monitor',
    desc: 'All tracked assets appear on your real-time dashboard with live position updates, speed, heading, and status. Geofence alerts fire automatically when assets enter or exit defined zones. Team coordination tools keep operatives synchronized.',
  },
  {
    step: '03',
    title: 'Analyze',
    desc: 'AI analyzes movement patterns, identifies anomalies, and generates intelligence reports. Route analysis reveals habitual behaviors, heat maps show frequency patterns, and predictive models forecast future movements based on historical data.',
  },
  {
    step: '04',
    title: 'Act',
    desc: 'Use actionable intelligence to make decisions. Export reports for legal proceedings, share intelligence with authorized teams, and coordinate response operations through encrypted channels. Full audit trail for compliance and chain-of-custody requirements.',
  },
];

/* ================================================================
   STATS
   ================================================================ */
const STATS = [
  { value: 'Sub-Meter', label: 'GPS Accuracy' },
  { value: '<1s', label: 'Position Update' },
  { value: '4', label: 'GNSS Constellations' },
  { value: '24/7', label: 'Live Monitoring' },
  { value: 'AES-256', label: 'Encryption' },
  { value: 'Unlimited', label: 'Geofences' },
];

/* ================================================================
   PRICING TIERS
   ================================================================ */
const PRICING = [
  {
    tier: 'Standard',
    price: 499,
    interval: 'mo',
    popular: false,
    custom: false,
    features: [
      'Up to 25 tracked assets',
      'Real-time GPS tracking',
      'Geofence alerts (50 zones)',
      'IP geolocation lookups (1,000/mo)',
      'Basic route analysis',
      'Email + Telegram alerts',
      'Dashboard access',
      '90-day data retention',
    ],
  },
  {
    tier: 'Professional',
    price: 999,
    interval: 'mo',
    popular: true,
    custom: false,
    features: [
      'Up to 100 tracked assets',
      'Sub-second position updates',
      'Unlimited geofences',
      'Cell tower analysis',
      'AI route anomaly detection',
      'Team coordination platform',
      'Encrypted communications',
      'Evidence management system',
      'API access (REST + WebSocket)',
      'Multi-channel alerts',
      '1-year data retention',
    ],
  },
  {
    tier: 'Enterprise',
    price: null,
    interval: null,
    popular: false,
    custom: true,
    features: [
      'Unlimited tracked assets',
      'Carrier intelligence (HLR)',
      'Custom GNSS configurations',
      'Multi-team operations',
      'Compartmentalized intel sharing',
      'On-prem deployment option',
      'Dedicated operations support',
      'Custom integrations',
      'SLA with guaranteed uptime',
      'Compliance & audit packages',
      'White-label option',
      'Unlimited data retention',
    ],
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function SurveillancePage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleCheckout = (tierIndex: number) => {
    const tier = PRICING[tierIndex];
    if (tier.custom) {
      window.location.href = 'mailto:bob@echo-op.com?subject=Surveillance%20Platform%20-%20Enterprise%20Inquiry';
      return;
    }
    if (!user) {
      window.location.href = `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
      return;
    }
    window.location.href = `/checkout?service=${SERVICE_ID}&tier=${tier.tier.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* --- Nav --- */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/security" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Cyber Defense</Link>
          <Link href="/dark-web-intel" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Dark Web Intel</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* --- Hero --- */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f59e0b' }} /> Location Intelligence &bull; Fleet Tracking &bull; Geofence Alerts
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          Location Intelligence<br />
          Platform<br />
          <span className="gradient-text">Multi-Modal Tracking.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          Multi-modal surveillance and tracking with <strong>sub-meter GPS accuracy</strong>, cell tower analysis, IP geolocation, geofence alerting, AI-powered route analysis, and real-time command-and-control dashboards &mdash; built for fleet management, corporate security, and authorized investigations.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/dashboard' : `/signup?redirect=/checkout?service=${SERVICE_ID}&tier=standard`} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Deploy Location Intelligence
          </Link>
          <Link href="/security" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
            Need Full Cyber Defense?
          </Link>
        </div>
        <div className="mt-4">
          <ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} />
        </div>
      </section>

      {/* --- Stats Grid --- */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Feature Grid (expandable) --- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>8 Intelligence Layers</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            From GPS coordinates to actionable location intelligence &mdash; each layer operates independently and feeds into a unified surveillance platform.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const isExpanded = expandedFeature === i;
            return (
              <button key={i} onClick={() => setExpandedFeature(isExpanded ? null : i)} className="text-left p-5 rounded-2xl border transition-all hover:shadow-lg" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isExpanded ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: isExpanded ? '0 0 25px var(--ept-accent-glow)' : undefined,
                gridColumn: isExpanded ? 'span 2' : undefined,
                gridRow: isExpanded ? 'span 2' : undefined,
              }}>
                <div className="text-2xl mb-3" style={{ color: 'var(--ept-accent)' }}>{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? f.desc : f.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Sources &amp; Methods</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.sources.map((s, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Location intelligence scaled to your operational needs</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map((tier, i) => (
            <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
              boxShadow: tier.popular ? '0 0 40px var(--ept-accent-glow)' : 'none',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
              <div className="mb-6">
                {tier.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price.toLocaleString()}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>Custom</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(i)} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all" style={{
                backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                color: tier.popular ? '#fff' : 'var(--ept-accent)',
                border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
              }}>
                {tier.custom ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Legal Disclaimer --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: '#f59e0b33' }}>
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#f59e0b' }}>Authorized Use Only</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                This platform is designed for <strong>authorized use only</strong>, including fleet management, corporate asset protection, law enforcement investigations with proper legal authority, and insurance fraud investigations with court orders. Users are solely responsible for ensuring compliance with all applicable federal, state, and local laws, including but not limited to wiretapping laws, GPS tracking consent requirements, and privacy regulations. Echo Prime Technologies does not condone unauthorized surveillance. All operations are logged for audit and compliance purposes. By using this platform, you certify that you have proper legal authorization for all tracking and surveillance activities conducted through our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Intelligence Engine --- */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Location Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our surveillance and tracking doctrine library &mdash; backed by engines covering geospatial analysis, OSINT, network intelligence, and security operations.</p>
          <EngineQueryPanel
            domains={['CYBER', 'INTELL', 'NET', 'GEO', 'SECURITY']}
            title="Location Intelligence Search"
            placeholder="Ask about GPS tracking, geofencing, IP geolocation, surveillance techniques..."
            exampleQueries={[
              'Best practices for fleet GPS tracking deployment',
              'How does cell tower triangulation work?',
              'IP geolocation accuracy vs VPN detection',
              'Geofence alert configuration strategies',
            ]}
            showStats
          />
        </div>
      </section>

      {/* --- Related Services --- */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Related Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Combine location intelligence with these capabilities for comprehensive security operations.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Cyber Defense', desc: 'AI-powered threat hunting, credential vault, SIEM operations, digital forensics, and compliance automation across 16 defensive layers.', href: '/security', price: 'From $499/mo' },
            { title: 'Dark Web Intelligence', desc: 'Continuous dark web monitoring, breach intelligence, paste site surveillance, and real-time threat alerting across 2,500+ sources.', href: '/dark-web-intel', price: 'From $999/mo' },
            { title: 'Penetration Testing', desc: 'Offensive security engagements with 300+ attack tools, 8 C2 frameworks, and red team operators.', href: '/pentesting', price: 'From $2,500' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Know where your assets are. Always.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>
            Deploy location intelligence in under 24 hours. Track up to 25 assets, set unlimited geofences, and receive real-time alerts — starting at $499/month.
          </p>
          <Link href={`/checkout?service=${SERVICE_ID}&tier=standard`} className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Deploy Standard &mdash; $499/mo
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/security" className="underline" style={{ color: 'var(--ept-accent)' }}>Cyber Defense</Link> | <Link href="/dark-web-intel" className="underline" style={{ color: 'var(--ept-accent)' }}>Dark Web Intel</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}