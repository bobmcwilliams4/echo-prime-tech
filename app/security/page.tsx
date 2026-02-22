'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';

const SERVICE_ID = 'cyber-defense';

const FEATURES = [
  { icon: '\uD83D\uDEE1\uFE0F', title: 'Threat Monitoring & Detection', desc: 'AI-powered 24/7 surveillance with BLUESPAWN, Wazuh, and Security Onion. Behavioral analysis, anomaly detection, and automated threat hunting across your entire infrastructure.' },
  { icon: '\uD83D\uDD12', title: 'Password Breach Monitoring', desc: 'Continuous monitoring of credential leaks across dark web, paste sites, and breach databases. Instant alerts when your credentials appear. Powered by HaveIBeenPwned, h8mail, and custom OSINT feeds.' },
  { icon: '\uD83D\uDCE7', title: 'Email Phishing Defense', desc: 'ML-based phishing detection, domain spoofing alerts, and email header analysis. Real-time phishing campaign tracking with automated quarantine and user education triggers.' },
  { icon: '\uD83D\uDD10', title: 'Credential Vault', desc: 'AES-256-GCM encrypted credential management with Argon2id key derivation (64MB memory, 3 iterations). Auto-rotation, strength scoring, reuse detection, and HMAC-SHA256 integrity verification.' },
  { icon: '\uD83D\uDD0D', title: 'Vulnerability Scanning', desc: 'Continuous scanning with Nuclei (9,000+ templates), Nikto, Trivy, and custom checks. CVE tracking, CVSS scoring, exploitability analysis, and prioritized remediation guidance.' },
  { icon: '\uD83D\uDCA3', title: 'Spyware & Malware Defense', desc: 'Advanced spyware detection with MVT (Mobile Verification Toolkit) integration, YARA signature matching, behavioral analysis, and ML-based anomaly detection. Full forensic chain of evidence.' },
  { icon: '\uD83D\uDD0E', title: 'Secret Detection & DLP', desc: 'Scan repos, configs, logs, and artifacts for leaked secrets using Gitleaks, TruffleHog, and custom regex patterns. API keys, tokens, passwords, private keys — caught before they ship.' },
  { icon: '\uD83C\uDFE2', title: 'Container & Cloud Security', desc: 'Kubernetes, Docker, and cloud infrastructure hardening with Trivy, Prowler, Terrascan, and KICS. Image scanning, IaC analysis, runtime protection, and cloud posture management.' },
  { icon: '\uD83E\uDDEC', title: 'Reverse Engineering Defense', desc: 'Identify reverse engineering vulnerabilities in your applications before attackers do. Binary analysis, code obfuscation gaps, debug symbol exposure, and tamper-detection assessment.' },
  { icon: '\uD83D\uDCCA', title: 'SIEM & SOC Dashboard', desc: 'Centralized security operations center with real-time event correlation, log aggregation from all endpoints, custom alert rules, and threat intelligence feed integration.' },
  { icon: '\u2699\uFE0F', title: 'System Hardening', desc: 'Automated hardening with HardeningKitty (Windows), Lynis (Linux), and CIS Benchmarks. Registry lockdown, firewall tuning, service minimization, and GPO enforcement.' },
  { icon: '\uD83D\uDCCB', title: 'Compliance & Audit', desc: 'SOC2, HIPAA, GDPR, PCI-DSS, and NIST compliance tracking. Automated audit trails with SHA-256 hash chains for tamper evidence. Gap analysis with remediation roadmaps.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Threat Assessment', desc: 'We deploy non-invasive scanners across your infrastructure — networks, endpoints, cloud, email, and credentials. Within 24 hours, you get a complete threat landscape report.' },
  { step: '02', title: 'Deploy Defense Layer', desc: 'Install monitoring agents (Wazuh, BLUESPAWN), configure WAF rules, enable breach monitoring, deploy credential vault, and establish SIEM pipelines. Zero downtime.' },
  { step: '03', title: 'Active Defense 24/7', desc: 'AI-powered threat hunting runs continuously. Phishing attempts blocked. Credential leaks detected in real-time. Vulnerabilities patched before exploitation. Every event logged and correlated.' },
  { step: '04', title: 'Forensics & Reporting', desc: 'Digital forensics on any incidents with complete chain of custody. Monthly security posture reports, compliance scorecards, and executive summaries. Always audit-ready.' },
];

const TOOLS_DEPLOYED = [
  { category: 'Threat Detection', tools: ['BLUESPAWN', 'Wazuh', 'Security Onion', 'Chainsaw', 'FalconFriday', 'RITA'] },
  { category: 'Credential Security', tools: ['HaveIBeenPwned', 'h8mail', 'pwnedOrNot', 'Vault (AES-256-GCM)'] },
  { category: 'Vulnerability Scanning', tools: ['Nuclei', 'Nikto', 'Trivy', 'Prowler', 'Terrascan'] },
  { category: 'Secret Detection', tools: ['Gitleaks', 'TruffleHog', 'SecretScanner', 'GitHub Watchman'] },
  { category: 'Forensics', tools: ['Autopsy', 'Plaso', 'Volatility3', 'Chainsaw', 'MVT'] },
  { category: 'Hardening', tools: ['HardeningKitty', 'Lynis', 'CIS Benchmarks', 'SafeLine WAF'] },
];

export default function SecurityPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find(s => s.id === SERVICE_ID) || d.services.find(s => s.id === 'enterprise-security');
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup'; return; }
    const tier = service?.pricing[tierIndex];
    if (!tier || tier.custom) { window.location.href = 'mailto:bob@echo-op.com?subject=Cyber%20Defense%20Inquiry'; return; }
    setCheckingOut(tier.tier);
    try {
      const { url } = await createCheckout(SERVICE_ID, tier.tier);
      window.location.href = url;
    } catch {
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pentesting" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Offensive Security</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Cyber Defense &bull; Blue Team</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Defend Everything.<br />Detect Everything.<br /><span className="gradient-text">Trust Nothing.</span></h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered threat monitoring, credential breach detection, phishing defense, vulnerability scanning, spyware detection, digital forensics, and compliance automation. Backed by 90+ open-source defense tools and military-grade encryption.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Threat Assessment</Link>
          <Link href="/pentesting" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Need Offensive Testing?</Link>
        </div>
        <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('.max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '90+', label: 'Defense Tools Deployed' },
            { value: '9,000+', label: 'Vulnerability Templates' },
            { value: '24/7', label: 'Continuous Monitoring' },
            { value: '<5min', label: 'Breach Detection Time' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Complete Defensive Security Suite</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Deployed */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Tools We Deploy</h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Industry-leading open-source and proprietary tools, tuned and orchestrated by our AI</p>
        <div className="grid md:grid-cols-3 gap-5">
          {TOOLS_DEPLOYED.map((cat, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ept-accent)' }}>{cat.category}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.tools.map((t, j) => (
                  <span key={j} className="px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <div className="space-y-8">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{s.step}</div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {service && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>{service.tagline}</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {service.pricing.map((tier, i) => (
              <div key={i} className="relative p-8 rounded-2xl border transition-all" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: tier.popular ? '0 0 30px var(--ept-accent-glow)' : 'none',
              }}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>
                )}
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{tier.tier}</h3>
                <div className="mb-6">
                  {tier.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price}</span>
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
                <button onClick={() => handleCheckout(i)} disabled={checkingOut === tier.tier} className="w-full text-center py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60" style={{
                  backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                  color: tier.popular ? '#fff' : 'var(--ept-accent)',
                  border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                }}>
                  {checkingOut === tier.tier ? 'Redirecting...' : tier.custom ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cross-sell */}
      <section className="max-w-3xl mx-auto px-6 pb-12 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Need Offensive Security Testing?</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Our Red Team services include penetration testing, social engineering, wireless attacks, AD exploitation, and full adversary simulation. Find vulnerabilities before attackers do.</p>
          <Link href="/pentesting" className="inline-block px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Explore Penetration Testing</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Don&apos;t wait for a breach</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Threat assessment takes under 24 hours. Full defensive deployment in a week. Your systems monitored 24/7 from day one.</p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Threat Assessment</Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pentesting" className="underline" style={{ color: 'var(--ept-accent)' }}>Penetration Testing</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}
