'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ScannerTutorial from '../../components/ScannerTutorial';
import ProductTutorialButton from '../../components/product-tutorial-button';
import FaqSchema from '../../components/FaqSchema';

const SERVICE_ID = 'scanner';

const CYAN = { gradient: 'linear-gradient(135deg, #06b6d4, #10b981)', solid: '#06b6d4', glow: 'rgba(6,182,212,0.12)' };

/* ═══════════════════════════════════════════════════════════════
   STATS — 8 at-a-glance numbers
   ═══════════════════════════════════════════════════════════════ */
const STATS = [
  { value: '12', label: 'Analyzers' },
  { value: '<30s', label: 'Scan Time' },
  { value: '200+', label: 'Check Points' },
  { value: '99.9%', label: 'Uptime' },
  { value: '6', label: 'Severity Levels' },
  { value: 'Live', label: 'Real-time Results' },
  { value: 'REST', label: 'API Access' },
  { value: '\u221E', label: 'Brain Memory' },
];

/* ═══════════════════════════════════════════════════════════════
   12 SCANNER CAPABILITIES — expandable feature cards
   ═══════════════════════════════════════════════════════════════ */
const CAPABILITIES = [
  {
    title: 'DNS & Infrastructure',
    desc: 'Complete DNS enumeration including A, AAAA, CNAME, MX, NS, TXT, SOA, and SRV records. Zone transfer testing, subdomain brute-force, DNSSEC validation, and nameserver configuration analysis. Identifies cloud providers, CDN configuration, load balancers, and mail infrastructure from DNS alone.',
    tags: ['DNS', 'Subdomains', 'Zone Transfer', 'DNSSEC'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  },
  {
    title: 'HTTP Security Headers',
    desc: 'Full audit of Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and CORS headers. Each header graded against industry best practices with specific remediation guidance. Detects missing, misconfigured, and overly permissive header values.',
    tags: ['CSP', 'HSTS', 'X-Frame', 'CORS'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    title: 'SSL/TLS Certificate Analysis',
    desc: 'Deep certificate chain inspection: issuer trust validation, expiration monitoring, Subject Alternative Name enumeration, certificate transparency log correlation, and cipher suite analysis. Tests for weak protocols (SSLv3, TLS 1.0/1.1), known vulnerabilities (BEAST, POODLE, Heartbleed, ROBOT), and Perfect Forward Secrecy configuration.',
    tags: ['Certificates', 'Cipher Suites', 'TLS', 'Expiry'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  },
  {
    title: 'Technology Fingerprinting',
    desc: 'Identifies web servers (Apache, Nginx, IIS, Cloudflare), frameworks (React, Next.js, Django, Rails), CMS platforms (WordPress, Drupal, Joomla), JavaScript libraries with exact versions, CDN providers, analytics tools, and third-party integrations. Cross-references discovered versions against CVE databases for known vulnerabilities.',
    tags: ['Frameworks', 'CMS', 'Libraries', 'Versions'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    title: 'Port Scanning',
    desc: 'TCP and UDP port scanning across the most commonly exploited 1,000 ports with service detection and banner grabbing. Identifies running services, software versions, and potential misconfigurations. Correlates open ports with expected services for the detected technology stack to flag anomalies.',
    tags: ['TCP', 'UDP', 'Services', 'Banners'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    title: 'Endpoint Discovery',
    desc: 'Parses robots.txt, sitemap.xml, and JavaScript bundles for hidden paths and API routes. Brute-forces common admin panels, backup files, configuration endpoints, and development artifacts. Discovers undocumented API endpoints, GraphQL introspection, and exposed Swagger/OpenAPI documentation.',
    tags: ['Sitemap', 'Robots.txt', 'APIs', 'Hidden Paths'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    title: 'Cookie Security Audit',
    desc: 'Inspects every cookie for Secure flag, HttpOnly attribute, SameSite policy, domain scope, path restrictions, and expiration settings. Identifies session tokens exposed to JavaScript, cookies transmitted over HTTP, and overly broad domain scoping that could enable subdomain cookie theft or session fixation.',
    tags: ['Secure', 'HttpOnly', 'SameSite', 'Domain Scope'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1.5" fill={c}/><circle cx="15" cy="13" r="1.5" fill={c}/><circle cx="10" cy="15" r="1" fill={c}/></svg>,
  },
  {
    title: 'JavaScript Analysis',
    desc: 'Static analysis of client-side JavaScript for hardcoded API keys, access tokens, internal URLs, debug endpoints, and sensitive configuration. Detects source maps that expose original source code, inline credentials, and PII handling in frontend logic. Identifies dependencies with known vulnerabilities via CVE cross-referencing.',
    tags: ['Source Maps', 'API Keys', 'Secrets', 'Dependencies'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    title: 'Content Security Policy',
    desc: 'Comprehensive CSP directive analysis: checks for unsafe-inline, unsafe-eval, wildcard sources, data: URIs, and blob: sources that weaken XSS protections. Validates report-uri/report-to configuration, tests nonce and hash implementations, and identifies bypass vectors through allowed CDN domains or JSONP endpoints.',
    tags: ['CSP Directives', 'unsafe-inline', 'Nonce', 'Report URI'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  {
    title: 'CORS Misconfiguration',
    desc: 'Tests Access-Control-Allow-Origin for wildcard patterns, reflected origins, null origin acceptance, and credential leaks via Access-Control-Allow-Credentials. Detects origin validation bypasses using subdomain tricks, protocol confusion, and prefix/suffix matching flaws that could enable cross-origin data theft.',
    tags: ['Wildcard', 'Credentials', 'Origin Bypass', 'Preflight'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    title: 'Server Information Leakage',
    desc: 'Detects server version disclosure in HTTP headers (Server, X-Powered-By, X-AspNet-Version), detailed error pages that expose stack traces and file paths, directory listings, default installation pages, and debug endpoints. Identifies internal hostnames, IP addresses, and infrastructure details leaked through headers, comments, or error responses.',
    tags: ['Version Headers', 'Error Pages', 'Stack Traces', 'Debug'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    title: 'MITRE ATT&CK Mapping',
    desc: 'Every finding is mapped to the MITRE ATT&CK framework with technique IDs, tactic categories, and procedure examples. Enables your security team to correlate scanner findings with threat intelligence, prioritize remediation based on real-world adversary behavior, and track security posture improvements against known attack patterns.',
    tags: ['ATT&CK', 'Techniques', 'Tactics', 'Threat Intel'],
    icon: (c: string) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
];

/* ═══════════════════════════════════════════════════════════════
   COMPETITIVE INTELLIGENCE — real scan data (sanitized)
   ═══════════════════════════════════════════════════════════════ */
const COMPETITORS = [
  { name: 'Wix', findings: 681, risk: 8.6, highlight: 'Missing CSP headers, cookies without Secure flag' },
  { name: 'Webflow', findings: 491, risk: 10.0, highlight: 'Internal k8s hostnames exposed in certificate SANs' },
  { name: 'Squarespace', findings: 44, risk: 10.0, highlight: 'AI bot blocklist detected, limited security headers' },
  { name: 'Framer', findings: 400, risk: 6.5, highlight: '2,960 Heroku API key instances found in source code' },
  { name: 'WordPress', findings: 58, risk: 10.0, highlight: '170 subdomains enumerated, server version disclosed' },
  { name: 'Carrd', findings: 70, risk: 10.0, highlight: 'No HSTS header, certificate expiring in 33 days' },
];

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 6 vertical steps
   ═══════════════════════════════════════════════════════════════ */
const HOW_IT_WORKS = [
  { step: '01', title: 'Enter Target URL', desc: 'Provide the domain or URL you want to scan. No authentication or agent installation required — the scanner operates externally, exactly like an attacker would.' },
  { step: '02', title: 'Select Scan Mode', desc: 'Choose Quick (top findings in <15s), Standard (full 12-analyzer sweep in <30s), or Deep (recursive enumeration, JavaScript analysis, and port scanning in <90s).' },
  { step: '03', title: 'AI Analyzers Execute', desc: '12 specialized analyzers run in parallel across edge infrastructure. DNS enumeration, header analysis, certificate inspection, technology fingerprinting, and more — simultaneously.' },
  { step: '04', title: 'Findings Classified', desc: 'Every finding is assigned a severity level: CRITICAL, HIGH, MEDIUM, LOW, INFO, or PASS. Risk scores calculated based on exploitability, impact, and remediation complexity.' },
  { step: '05', title: 'MITRE ATT&CK Mapped', desc: 'Findings are automatically mapped to MITRE ATT&CK techniques and tactics. Correlates your attack surface with real-world adversary behavior and known threat patterns.' },
  { step: '06', title: 'Report Generated & Stored', desc: 'Full scan report available instantly in the dashboard. Results stored in Brain Memory for historical comparison, trend analysis, and regression detection across future scans.' },
];

/* ═══════════════════════════════════════════════════════════════
   PRICING — 3 tiers
   ═══════════════════════════════════════════════════════════════ */
const PRICING = [
  { name: 'Scout', price: '$49', period: '/scan', features: ['Quick scan mode', 'Top 10 findings summary', 'PDF export', 'Email delivery', '24-hour result retention'], tier: 'scout' },
  { name: 'Hunter', price: '$199', period: '/month', popular: true, features: ['All scan modes', 'Unlimited scans', 'Full findings report', 'MITRE ATT&CK mapping', 'API access', 'Brain memory storage', 'Scheduled scans', 'Slack/Discord alerts'], tier: 'hunter' },
  { name: 'Arsenal', price: '$999', period: '/month', features: ['Everything in Hunter', 'Continuous monitoring', 'Custom analyzers', 'Team dashboard (5 seats)', 'Priority support', 'White-label reports', 'Compliance templates', 'Dedicated account manager'], tier: 'arsenal' },
];

/* ═══════════════════════════════════════════════════════════════
   DIFFERENTIATOR — us vs. them
   ═══════════════════════════════════════════════════════════════ */
const THEM = [
  'Basic header checks only',
  'No threat framework mapping',
  'Results forgotten after export',
  'Limited to 3-5 analyzers',
  'Centralized scanning servers',
  'Manual scheduling only',
];
const US = [
  'AI-powered 12-analyzer pipeline',
  'Full MITRE ATT&CK mapping',
  'Brain Memory stores every scan forever',
  '12 specialized parallel analyzers',
  'Edge infrastructure — zero cold starts',
  'Automated scheduling with drift detection',
];

/* ═══════════════════════════════════════════════════════════════
   FAQS — 6 common questions
   ═══════════════════════════════════════════════════════════════ */
const FAQS = [
  { q: 'How accurate is the document scanning?', a: 'Our scanner uses 12 parallel AI analyzers that cross-validate findings against multiple data sources. Each result includes a confidence score and severity rating calibrated against industry benchmarks. False positive rates are below 2% thanks to multi-layer verification — every finding is confirmed through at least two independent detection methods before being reported.' },
  { q: 'What file formats and input types are supported?', a: 'The scanner accepts any publicly accessible URL — HTML pages, single-page applications, REST APIs, GraphQL endpoints, and static file servers. It automatically parses HTML, JavaScript bundles, CSS, JSON, XML (including sitemap.xml and robots.txt), PDF metadata, and server response headers. No file uploads or agent installation required.' },
  { q: 'Does the scanner include OCR and content extraction capabilities?', a: 'Yes. The scanner extracts and analyzes text content from rendered pages, JavaScript-generated DOM elements, PDF documents served by the target, and embedded metadata. It identifies exposed credentials, API keys, internal URLs, PII patterns, and sensitive configuration data within any text content — whether it is in raw HTML, dynamically loaded scripts, or document files.' },
  { q: 'Can I process multiple targets in bulk?', a: 'Absolutely. The Hunter and Arsenal plans support unlimited scans with batch queuing. You can submit a list of domains or subdomains and the scanner processes them in parallel across edge infrastructure. Scheduled scans run automatically on your chosen cadence (hourly, daily, weekly) with drift detection that alerts you when security posture changes between scans.' },
  { q: 'Is there an API for integrating the scanner into my workflow?', a: 'Yes — the Hunter and Arsenal plans include full REST API access. Trigger scans programmatically, retrieve results as structured JSON, and integrate with CI/CD pipelines, Slack, Discord, or any webhook-compatible tool. The API follows OpenAPI 3.0 spec with comprehensive documentation, SDK examples in Python, JavaScript, and cURL, and rate limits generous enough for continuous monitoring.' },
  { q: 'What kind of data can be extracted from scanned documents and pages?', a: 'The scanner extracts DNS records, SSL certificate details, HTTP headers, technology stack versions, open ports with service banners, cookies with security attributes, JavaScript dependencies, API endpoints, CSP directives, CORS configurations, and server information leakage. Every extracted data point is mapped to MITRE ATT&CK techniques and stored in Brain Memory for historical trend analysis.' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function ScannerPageContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find((s: Service) => s.id === SERVICE_ID) || d.services.find((s: Service) => s.id === 'scanner');
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup'; return; }
    const pricingSource = service?.pricing ?? PRICING.map(p => ({ tier: p.tier, price: parseInt(p.price.replace(/\D/g, ''), 10), interval: p.period.replace('/', ''), features: p.features, custom: false, popular: !!p.popular }));
    const tier = pricingSource[tierIndex];
    if (!tier) return;
    setCheckingOut(tier.tier);
    try {
      const { url } = await createCheckout(SERVICE_ID, tier.tier);
      window.location.href = url;
    } catch {
      setCheckingOut(null);
    }
  };

  const heroDescription = 'AI-powered website intelligence scanner with 12 parallel analyzers. Scans DNS, headers, SSL, technologies, ports, endpoints, cookies, JavaScript, CSP, CORS, server leakage, and maps every finding to MITRE ATT&CK. Results stored in Brain Memory for historical tracking.';

  function riskColor(r: number) {
    if (r >= 8) return '#ef4444';
    if (r >= 5) return '#f59e0b';
    return '#22c55e';
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Scanner', href: '/scanner' }]} />
      <FaqSchema faqs={FAQS} />
      <ProductTutorialButton tutorialId="scanner" productName="Security Scanner" />
      {/* ─── Nav ─── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          {[
            { label: 'Home', href: '/' },
            { label: 'Engines', href: '/engines' },
            { label: 'Closer AI', href: '/closer' },
            { label: 'Pricing', href: '/pricing' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="hidden md:inline text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>{l.label}</Link>
          ))}
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: CYAN.gradient }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: CYAN.gradient }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section data-tutorial="scanner-hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: CYAN.solid, color: CYAN.solid, backgroundColor: CYAN.glow }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CYAN.solid }} /> REVENG Scanner
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          AI-Powered Website<br />
          <span style={{ background: CYAN.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intelligence Scanner</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          {heroDescription}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white shadow-lg transition-transform hover:scale-105" style={{ background: CYAN.gradient }}>Start Scanning</Link>
          <a href="#pricing" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>View Pricing</a>
        </div>
        <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
      </section>

      {/* ─── Stats ─── */}
      <section data-tutorial="scanner-target" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono" style={{ background: CYAN.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 12 Capabilities (expandable) ─── */}
      <section data-tutorial="scanner-scan-btn" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>12 Analyzers. Zero Blind Spots.</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Every scanner capability runs in parallel on edge infrastructure. Click any card for full details.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {CAPABILITIES.map((cap, i) => {
            const isExpanded = expandedFeature === i;
            return (
              <button key={i} onClick={() => setExpandedFeature(isExpanded ? null : i)} className="text-left p-5 rounded-2xl border transition-all hover:shadow-lg" style={{
                backgroundColor: isExpanded ? CYAN.glow : 'var(--ept-card-bg)',
                borderColor: isExpanded ? CYAN.solid : 'var(--ept-card-border)',
                boxShadow: isExpanded ? `0 0 25px ${CYAN.glow}` : undefined,
                gridColumn: isExpanded ? 'span 2' : undefined,
                gridRow: isExpanded ? 'span 2' : undefined,
              }}>
                <div className="mb-3">{cap.icon(CYAN.solid)}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{cap.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? cap.desc : cap.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: CYAN.solid }}>Tags</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.tags.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: CYAN.glow, color: 'var(--ept-text-secondary)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: CYAN.solid }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Competitive Intelligence ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>What We Found Scanning the Competition</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Real results from REVENG Scanner against major website builders. Every platform has security gaps — the question is whether you know about yours.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {COMPETITORS.map((comp, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: 'var(--ept-text)' }}>{comp.name}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${riskColor(comp.risk)}20`, color: riskColor(comp.risk) }}>Risk {comp.risk.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <div className="text-2xl font-extrabold font-mono" style={{ color: riskColor(comp.risk) }}>{comp.findings}</div>
                  <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ept-text-muted)' }}>Findings</div>
                </div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(comp.risk * 10, 100)}%`, backgroundColor: riskColor(comp.risk) }} />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{comp.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg text-white" style={{ background: CYAN.gradient }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Start with a single scan or go unlimited. Every plan includes full MITRE ATT&CK mapping and detailed remediation guidance.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {(service?.pricing ?? PRICING.map(p => ({ tier: p.name, price: parseInt(p.price.replace(/\D/g, ''), 10), interval: p.period.replace('/', ''), features: p.features, custom: false, popular: !!p.popular }))).map((tier, i) => (
            <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
              backgroundColor: 'var(--ept-card-bg)',
              borderColor: tier.popular ? CYAN.solid : 'var(--ept-card-border)',
              boxShadow: tier.popular ? `0 0 40px ${CYAN.glow}` : 'none',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: CYAN.gradient }}>Most Popular</div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
              <div className="mb-6">
                {tier.price !== null && tier.price !== undefined ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono" style={{ background: CYAN.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${typeof tier.price === 'number' ? tier.price.toLocaleString() : tier.price}</span>
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/{tier.interval}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold" style={{ color: CYAN.solid }}>Custom</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: CYAN.solid }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(i)} disabled={checkingOut === tier.tier} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                background: tier.popular ? CYAN.gradient : 'transparent',
                color: tier.popular ? '#fff' : CYAN.solid,
                border: tier.popular ? 'none' : `1px solid ${CYAN.solid}`,
              }}>
                {checkingOut === tier.tier ? 'Redirecting...' : tier.custom ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Differentiator ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>Why ECHO Scanner</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>Other Scanners</h3>
              <ul className="space-y-2">
                {THEM.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#ef4444' }}>&#x2717;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>ECHO REVENG Scanner</h3>
              <ul className="space-y-2">
                {US.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#22c55e' }}>&#x2713;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cross-sell ─── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Your Security Stack</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Scanning finds the gaps. These services help you close them and stay protected.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Penetration Testing', desc: 'Full-scope red team operations with 300+ tools across 16 attack categories. Manual exploitation, custom PoC code, and free retest after remediation.', href: '/pentesting', price: 'From $2,500' },
            { title: 'Cyber Defense', desc: 'Continuous 24/7 AI-powered monitoring, credential breach detection, spyware defense, and automated incident response. Always-on protection between scans.', href: '/security', price: 'From $499/mo' },
            { title: 'Dark Web Intel', desc: 'Monitor dark web marketplaces, forums, and paste sites for your credentials, brand mentions, and leaked data. Automated alerts when your assets appear.', href: '/dark-web-intel', price: 'From $199/mo' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Engine Query Panel ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Scanner Intelligence Knowledge Base</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our security doctrine library covering vulnerability analysis, reverse engineering, web security, and threat intelligence.</p>
          <EngineQueryPanel
            domains={['REVENG', 'CYBER']}
            title="REVENG Doctrine Search"
            placeholder="Search security checks, vulnerability classes, attack techniques..."
            exampleQueries={[
              'HTTP security header best practices',
              'SSL certificate chain validation',
              'CORS misconfiguration attack vectors',
              'MITRE ATT&CK web application techniques',
            ]}
            showStats
          />
        </div>
      </section>

      {/* ─── FAQ ─── */}
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

      {/* ─── CTA ─── */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Ready to Scan?</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Enter any URL and get a complete security intelligence report in under 30 seconds. 12 analyzers. 200+ checks. MITRE ATT&CK mapping. Brain Memory storage. No agents to install.</p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-transform hover:scale-105" style={{ background: CYAN.gradient }}>Start Scanning</Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pentesting" className="underline" style={{ color: 'var(--ept-accent)' }}>Pentesting</Link> | <Link href="/security" className="underline" style={{ color: 'var(--ept-accent)' }}>Cyber Defense</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}

export default function ScannerPage() {
  return <SubscriptionGate serviceId="scanner"><ScannerPageContent /><ScannerTutorial /></SubscriptionGate>;
}
