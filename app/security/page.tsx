'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';

const SERVICE_ID = 'enterprise-security';

const FEATURES = [
  { icon: '\uD83D\uDEE1\uFE0F', title: 'Threat Monitoring', desc: '24/7 automated surveillance across your entire attack surface. Real-time alerts with actionable intelligence, not noise.' },
  { icon: '\uD83D\uDD10', title: 'Zero-Trust Access', desc: 'Every request is verified. Role-based access control, MFA enforcement, session management, and device trust policies.' },
  { icon: '\uD83D\uDD0D', title: 'Vulnerability Scanning', desc: 'Continuous automated scanning of your infrastructure, applications, and dependencies. CVE tracking with remediation guidance.' },
  { icon: '\uD83D\uDDC3\uFE0F', title: 'Credential Vault', desc: 'AES-256-GCM encrypted credential management with Argon2id key derivation. Auto-rotation, breach detection, and strength scoring.' },
  { icon: '\uD83D\uDCCB', title: 'Audit Trails', desc: 'Complete forensic-grade logging of every operation. SHA-256 hash chains for tamper evidence. SOC2 and HIPAA ready.' },
  { icon: '\uD83D\uDE80', title: 'Incident Response', desc: 'Automated playbooks for common attack patterns. Containment, eradication, and recovery workflows with escalation paths.' },
  { icon: '\uD83C\uDF10', title: 'WAF & DDoS Protection', desc: 'Web application firewall with custom rule sets. Rate limiting, bot detection, and DDoS mitigation at the edge.' },
  { icon: '\uD83D\uDCCA', title: 'Compliance Dashboard', desc: 'Track your compliance posture across SOC2, HIPAA, GDPR, and PCI-DSS. Gap analysis with prioritized remediation.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Security Assessment', desc: 'We scan your infrastructure, identify vulnerabilities, and map your current security posture against industry benchmarks.' },
  { step: '02', title: 'Deploy Protection', desc: 'Install monitoring agents, configure WAF rules, set up credential vaults, and establish audit trail pipelines.' },
  { step: '03', title: 'Continuous Monitoring', desc: 'Our systems watch 24/7. Threats are detected, classified, and responded to automatically. You get alerts only when action is needed.' },
  { step: '04', title: 'Compliance & Reporting', desc: 'Monthly security reports, compliance scorecards, and recommendations. Always audit-ready.' },
];

export default function SecurityPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    getServices().then(d => {
      const svc = d.services.find(s => s.id === SERVICE_ID);
      if (svc) setService(svc);
    }).catch(() => {});
  }, []);

  const handleCheckout = async (tierIndex: number) => {
    if (!user) { window.location.href = '/signup'; return; }
    const tier = service?.pricing[tierIndex];
    if (!tier || tier.custom) { window.location.href = 'mailto:bob@echo-op.com?subject=Enterprise%20Security%20Inquiry'; return; }
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
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Enterprise Security</div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ color: 'var(--ept-text)' }}>Military-Grade<br />Protection for<br /><span className="gradient-text">Your Systems</span></h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Automated threat monitoring, zero-trust access control, vulnerability scanning, credential management, and complete audit trails for every operation.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Secure Your Systems</Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>View Pricing</Link>
        </div>
        <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('.max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Complete Security Suite</h2>
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

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Don&apos;t wait for a breach</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Protect your systems now. Security assessment takes under 24 hours. Full deployment in a week.</p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Security Assessment</Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}
