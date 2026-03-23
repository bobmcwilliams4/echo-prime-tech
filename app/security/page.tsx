'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getServices, Service, createCheckout } from '../../lib/ept-api';
import ReadAloudButton from '../../components/ReadAloudButton';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';

const SERVICE_ID = 'cyber-defense';

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARDS — 16 deep defensive capabilities
   ═══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: '\uD83D\uDEE1\uFE0F',
    title: 'AI Threat Detection & Hunting',
    desc: 'Machine learning models trained on millions of attack patterns analyze your network traffic, endpoint behavior, and log data in real-time. Automated threat hunting runs 24/7 using hypothesis-driven campaigns — proactively finding adversaries that evade signature-based detection.',
    tools: ['Wazuh', 'BLUESPAWN', 'Security Onion', 'Chainsaw', 'RITA', 'Sigma Rules'],
    mitre: ['TA0043', 'TA0001', 'TA0040'],
  },
  {
    icon: '\uD83D\uDD13',
    title: 'Password Breach Intelligence',
    desc: 'Continuous monitoring of dark web forums, paste sites, stealer logs, and breach databases for your organization\'s credentials. Instant alerts when employee passwords appear in new leaks. Automated password strength auditing against real-world cracking dictionaries — not just complexity rules.',
    tools: ['HaveIBeenPwned', 'h8mail', 'pwnedOrNot', 'DeHashed', 'Custom OSINT Feeds'],
    mitre: ['T1589.001', 'T1078'],
  },
  {
    icon: '\uD83D\uDCE7',
    title: 'Email Security & Anti-Phishing',
    desc: 'Multi-layer email defense: SPF/DKIM/DMARC enforcement and monitoring, ML-based phishing detection that catches zero-day campaigns, attachment sandboxing with behavioral detonation, URL rewriting and click-time analysis, BEC (Business Email Compromise) detection using writing style analysis, and executive impersonation protection.',
    tools: ['Phishing Catcher', 'GoPhish (simulation)', 'DMARC Analyzer', 'Custom ML Pipeline'],
    mitre: ['T1566.001', 'T1566.002', 'T1534'],
  },
  {
    icon: '\uD83C\uDF10',
    title: 'Network Defense & Traffic Analysis',
    desc: 'Deep packet inspection, protocol analysis, and behavioral baselining across your entire network. Detect lateral movement, C2 beaconing, DNS tunneling, data exfiltration, and anomalous traffic patterns. Real-time IDS/IPS with custom Suricata rules tuned to your environment — not generic signatures that generate thousands of false positives.',
    tools: ['Suricata', 'Zeek', 'RITA', 'SafeLine WAF', 'ntopng', 'Wireshark'],
    mitre: ['TA0011', 'T1071', 'T1048', 'T1572'],
  },
  {
    icon: '\uD83D\uDD10',
    title: 'Credential Vault & Key Management',
    desc: 'Military-grade credential storage: AES-256-GCM encryption with Argon2id key derivation (64MB memory cost, 3 iterations) — the same KDF used by cryptocurrency wallets. HMAC-SHA256 integrity verification on every read. Automatic credential rotation policies, password strength scoring against real breach dictionaries, and reuse detection across all stored credentials.',
    tools: ['Echo Vault (AES-256-GCM)', 'Argon2id KDF', 'HMAC-SHA256', 'Auto-Rotation Engine'],
    mitre: ['T1552', 'T1555'],
  },
  {
    icon: '\uD83D\uDD0D',
    title: 'Vulnerability Management',
    desc: 'Continuous automated scanning with 9,000+ vulnerability templates updated daily. CVSS v4.0 scoring combined with EPSS (Exploit Prediction Scoring System) to prioritize what actually matters — not just what scores highest. Full asset inventory, attack surface mapping, and remediation SLA tracking with trend analysis over time.',
    tools: ['Nuclei', 'Nikto', 'Trivy', 'Prowler', 'OpenVAS', 'Custom Templates'],
    mitre: ['T1190', 'T1210'],
  },
  {
    icon: '\uD83D\uDC1B',
    title: 'Spyware & Malware Defense',
    desc: 'Full-spectrum malware defense powered by the Prometheus Spyware Defense System — a 14-module security platform with ML-based behavioral analysis, YARA signature engine (500+ rules), MVT (Mobile Verification Toolkit) for iOS/Android spyware detection, memory scanning, rootkit detection, and automated quarantine with forensic evidence preservation.',
    tools: ['Prometheus SP', 'MVT', 'YARA Engine', 'ClamAV', 'Custom ML Models', 'VirusTotal'],
    mitre: ['T1059', 'T1547', 'T1055', 'T1027'],
  },
  {
    icon: '\uD83D\uDCA5',
    title: 'Exploitation Prevention',
    desc: 'Proactive defense against exploitation: Web Application Firewall with custom rule sets, runtime application self-protection (RASP), exploit mitigation (ASLR, DEP, CFG verification), API rate limiting and abuse detection, deserialization attack prevention, and automated virtual patching for zero-days before vendor patches are available.',
    tools: ['SafeLine WAF', 'ModSecurity', 'Custom RASP', 'Virtual Patching Engine'],
    mitre: ['T1190', 'T1203', 'T1211'],
  },
  {
    icon: '\uD83D\uDD0E',
    title: 'Secret Detection & Data Loss Prevention',
    desc: 'Scan every git commit, CI/CD pipeline, configuration file, log output, and Slack message for leaked secrets. API keys, tokens, passwords, private keys, database connection strings — caught before they reach production. Supports 800+ secret patterns with custom regex rules. DLP policies for PII, PHI, PCI data in transit and at rest.',
    tools: ['Gitleaks', 'TruffleHog', 'SecretScanner', 'GitHub Watchman', 'Slack Watchman'],
    mitre: ['T1552.001', 'T1552.004'],
  },
  {
    icon: '\u2601\uFE0F',
    title: 'Cloud & Container Security',
    desc: 'Multi-cloud security posture management (CSPM) for AWS, Azure, GCP, and Cloudflare. CIS Benchmark compliance scanning, IAM misconfiguration detection, container image vulnerability scanning, Kubernetes RBAC auditing, IaC (Infrastructure-as-Code) security scanning before deployment, and runtime container threat detection.',
    tools: ['Prowler', 'Trivy', 'KICS', 'Terrascan', 'Checkov', 'ZeusCloud', 'Dockle'],
    mitre: ['T1530', 'T1525', 'T1610'],
  },
  {
    icon: '\uD83E\uDDEC',
    title: 'Reverse Engineering Defense',
    desc: 'Assess your applications\' resistance to reverse engineering. Binary protection analysis, code obfuscation gap identification, anti-debugging mechanism validation, license protection testing, firmware security review, supply chain integrity verification (SBOM analysis), and dependency vulnerability scoring. Find the gaps before your competitors or attackers do.',
    tools: ['Ghidra', 'IDA', 'Radare2', 'YARA', 'Sigcheck', 'SBOM Analyzer'],
    mitre: ['T1588.002'],
  },
  {
    icon: '\uD83D\uDCCA',
    title: 'SIEM & Security Operations Center',
    desc: 'Centralized security operations with real-time event correlation across all endpoints, network devices, cloud services, and applications. Custom detection rules, automated alert triage, threat intelligence feed integration (STIX/TAXII), and analyst playbooks. Not just a log aggregator — a fully orchestrated SOC that turns data into actionable intelligence.',
    tools: ['Wazuh SIEM', 'Sigma', 'MITRE ATT&CK', 'STIX/TAXII', 'Custom Correlation Engine'],
    mitre: ['TA0009', 'TA0010'],
  },
  {
    icon: '\uD83D\uDD2C',
    title: 'Digital Forensics & Incident Response',
    desc: 'When incidents occur, our DFIR team deploys immediately. Disk forensics, memory analysis, network forensics, cloud forensics, and mobile device forensics. Full evidence acquisition with chain of custody documentation. Timeline reconstruction, artifact analysis (prefetch, amcache, shimcache, MFT, USN journal, event logs), and anti-forensics detection.',
    tools: ['Autopsy', 'Volatility3', 'Plaso', 'KAPE', 'Chainsaw', 'Hayabusa'],
    mitre: ['TA0005', 'T1070'],
  },
  {
    icon: '\u2699\uFE0F',
    title: 'System & Infrastructure Hardening',
    desc: 'Automated security hardening for Windows (HardeningKitty with 400+ checks), Linux (Lynis with CIS benchmarks), and network devices. Registry lockdown, unnecessary service removal, firewall rule optimization, GPO enforcement, TLS configuration, SSH hardening, and attack surface reduction. Before and after scoring with compliance drift detection.',
    tools: ['HardeningKitty', 'Lynis', 'CIS-CAT', 'Windows Hardening Scripts', 'Ansible Hardening'],
    mitre: ['T1562', 'T1112'],
  },
  {
    icon: '\uD83D\uDCCB',
    title: 'Compliance Automation',
    desc: 'Continuous compliance monitoring across SOC2 Type I/II, HIPAA Security Rule, PCI-DSS v4.0, GDPR Article mapping, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and FedRAMP. Automated evidence collection, control mapping across frameworks, gap analysis with remediation priority scoring, and audit-ready report generation on demand.',
    tools: ['Custom Compliance Engine', 'Prowler', 'CIS-CAT', 'Audit Trail (SHA-256)'],
    mitre: [],
  },
  {
    icon: '\uD83E\uDD16',
    title: 'AI-Powered Security Orchestration (SOAR)',
    desc: 'Automated incident response playbooks for the top 50 attack scenarios. When a threat is detected, containment begins in seconds — not hours. Automated alert enrichment, threat intelligence correlation, affected asset identification, evidence collection, and stakeholder notification. Human analysts focus on strategy while AI handles the repetitive work.',
    tools: ['Custom SOAR Engine', 'n8n Workflows', 'Wazuh Active Response', 'Playbook Library'],
    mitre: ['TA0040', 'TA0005'],
  },
];

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 6-step engagement
   ═══════════════════════════════════════════════════════════════ */
const HOW_IT_WORKS = [
  { step: '01', title: 'Discovery & Threat Assessment', desc: 'Non-invasive reconnaissance of your infrastructure — networks, endpoints, cloud, email, credentials, and third-party integrations. Within 24 hours, you receive a complete threat landscape report with risk-ranked findings.' },
  { step: '02', title: 'Architecture & Policy Design', desc: 'We design your defensive architecture: network segmentation, zero-trust policies, detection rules, monitoring scopes, and response playbooks — tailored to your industry, compliance requirements, and threat model.' },
  { step: '03', title: 'Deploy Defense Layer', desc: 'Install monitoring agents, configure SIEM pipelines, enable breach monitoring, deploy credential vault, set up email security, activate vulnerability scanning, and establish forensic readiness. Zero downtime deployment.' },
  { step: '04', title: 'Tuning & Baseline', desc: '30-day tuning period: reduce false positives, establish behavioral baselines, calibrate alert thresholds, validate detection rules against real traffic, and document normal vs. anomalous patterns for your specific environment.' },
  { step: '05', title: 'Active Defense 24/7', desc: 'Fully operational security monitoring. AI-powered threat hunting runs continuously. Phishing blocked. Credentials monitored. Vulnerabilities patched. Every event logged, correlated, and scored. Automated response for high-confidence threats.' },
  { step: '06', title: 'Continuous Improvement', desc: 'Monthly security posture reports, quarterly risk reviews, annual penetration testing, compliance scorecards, threat landscape briefings, and detection rule updates. Your security improves every single month.' },
];

/* ═══════════════════════════════════════════════════════════════
   TOOLS WE DEPLOY — categorized arsenal
   ═══════════════════════════════════════════════════════════════ */
const TOOLS_DEPLOYED = [
  { category: 'Threat Detection & Hunting', tools: ['BLUESPAWN', 'Wazuh', 'Security Onion', 'Chainsaw', 'FalconFriday', 'RITA', 'Sysmon', 'Hayabusa', 'Sigma Rules', 'Suricata'] },
  { category: 'Credential & Breach Monitoring', tools: ['HaveIBeenPwned', 'h8mail', 'pwnedOrNot', 'DeHashed', 'Echo Vault (AES-256-GCM)', 'Argon2id KDF'] },
  { category: 'Vulnerability Management', tools: ['Nuclei (9K+ templates)', 'Nikto', 'Trivy', 'Prowler', 'Terrascan', 'OpenVAS', 'KICS', 'Checkov'] },
  { category: 'Email & Phishing Defense', tools: ['Phishing Catcher', 'DMARC Analyzer', 'SPF/DKIM Validator', 'Attachment Sandbox', 'BEC Detector'] },
  { category: 'Secret Detection & DLP', tools: ['Gitleaks', 'TruffleHog', 'SecretScanner', 'GitHub Watchman', 'Slack Watchman', 'GitLab Watchman'] },
  { category: 'Spyware & Malware Defense', tools: ['Prometheus SP (14 modules)', 'MVT', 'YARA (500+ rules)', 'ClamAV', 'Rootkit Detector', 'Memory Scanner'] },
  { category: 'Digital Forensics', tools: ['Autopsy', 'Volatility3', 'Plaso', 'KAPE', 'FTK Imager', 'Chainsaw', 'Log2Timeline'] },
  { category: 'System Hardening', tools: ['HardeningKitty (400+ checks)', 'Lynis', 'CIS-CAT', 'SafeLine WAF', 'Windows Hardening', 'Ansible Playbooks'] },
  { category: 'Network Security', tools: ['Suricata IDS/IPS', 'Zeek', 'SafeLine WAF', 'ntopng', 'DNS Guardian', 'VPN Analyzer'] },
  { category: 'Cloud & Container', tools: ['Prowler', 'Trivy', 'ZeusCloud', 'Dockle', 'ScoutSuite', 'Container Runtime Protection'] },
];

/* ═══════════════════════════════════════════════════════════════
   COMPLIANCE FRAMEWORKS
   ═══════════════════════════════════════════════════════════════ */
const COMPLIANCE = [
  { name: 'SOC 2', desc: 'Type I & II' },
  { name: 'HIPAA', desc: 'Security Rule' },
  { name: 'PCI-DSS', desc: 'v4.0' },
  { name: 'GDPR', desc: 'Full Articles' },
  { name: 'NIST CSF', desc: '2.0' },
  { name: 'NIST 800-53', desc: 'Rev 5' },
  { name: 'ISO 27001', desc: '2022' },
  { name: 'CIS Controls', desc: 'v8' },
];

/* ═══════════════════════════════════════════════════════════════
   THREAT STATS — real numbers
   ═══════════════════════════════════════════════════════════════ */
const STATS = [
  { value: '90+', label: 'Defense Tools Deployed' },
  { value: '9,000+', label: 'Vulnerability Templates' },
  { value: '500+', label: 'YARA Malware Rules' },
  { value: '14', label: 'Spyware Defense Modules' },
  { value: '<5min', label: 'Mean Detection Time' },
  { value: '24/7/365', label: 'Continuous Monitoring' },
  { value: '50+', label: 'Incident Playbooks' },
  { value: '8', label: 'Compliance Frameworks' },
];

function SecurityPageContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

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
    <div data-tutorial="security-hero" className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ─── Nav ─── */}
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

      {/* ─── Hero ─── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-accent-glow)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} /> Cyber Defense &bull; Blue Team &bull; Active Protection
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]" style={{ color: 'var(--ept-text)' }}>
          Defend Everything.<br />
          Detect Everything.<br />
          <span className="gradient-text">Trust Nothing.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered threat hunting, credential breach intelligence, email phishing defense, network traffic analysis, spyware detection, vulnerability management, digital forensics, and compliance automation — backed by <strong>90+ open-source defense tools</strong>, a <strong>14-module spyware defense system</strong>, and <strong>military-grade AES-256-GCM encryption</strong>.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href={user ? '/services' : '/signup'} className="px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Threat Assessment</Link>
          <Link href="/pentesting" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Need Offensive Testing?</Link>
        </div>
        <div className="mt-4"><ReadAloudButton label="Read page" getText={() => document.querySelector('main, .max-w-5xl')?.textContent?.trim().slice(0, 3000) || ''} /></div>
      </section>

      {/* ─── Stats Grid ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
              <div className="text-[11px] mt-1 uppercase tracking-wide font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Feature Grid (expandable) ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>16 Layers of Defense</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Every layer operates independently. Together, they create a defense-in-depth architecture that makes compromise exponentially harder at every step of the kill chain.</p>
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
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>
                  {isExpanded ? f.desc : f.desc.slice(0, 120) + '...'}
                </p>
                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>Tools</div>
                      <div className="flex flex-wrap gap-1.5">
                        {f.tools.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    {f.mitre.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: 'var(--ept-accent)' }}>MITRE ATT&CK Coverage</div>
                        <div className="flex flex-wrap gap-1.5">
                          {f.mitre.map((m, j) => (
                            <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 text-[10px] font-medium" style={{ color: 'var(--ept-accent)' }}>{isExpanded ? 'Click to collapse' : 'Click for details'}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Tools Arsenal ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Tools We Deploy</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>90+ industry-leading tools — selected, configured, tuned, and orchestrated by our AI security operations platform. Not just installed. Integrated.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {TOOLS_DEPLOYED.map((cat, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--ept-accent)' }}>{cat.category}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.tools.map((t, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-text-secondary)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Compliance ─── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Compliance Frameworks</h2>
          <p className="mt-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>Automated continuous compliance monitoring — always audit-ready</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMPLIANCE.map((c, i) => (
            <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{c.name}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Engagement Process</h2>
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

      {/* ─── Pricing ─── */}
      {service && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 data-tutorial="security-pricing" className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>{service.tagline}</p>
          <div data-tutorial="security-services" className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {service.pricing.map((tier, i) => (
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

      {/* ─── Why Not DIY ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ept-text)' }}>Why Not DIY?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>Building In-House</h3>
              <ul className="space-y-2">
                {['6-12 months to deploy', '$150K+/yr per security engineer', 'Tool sprawl — 90+ tools to manage', 'Alert fatigue from untuned rules', 'Compliance gaps during build-out', 'No coverage during vacations/turnover'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <span style={{ color: '#ef4444' }}>&#x2717;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>Echo Prime Defense</h3>
              <ul className="space-y-2">
                {['Operational in 7 days', 'Fraction of the cost of one FTE', 'All 90+ tools pre-integrated', 'AI-tuned rules — near-zero false positives', 'Compliance from day one', '24/7/365 — AI never takes a day off'].map((item, i) => (
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
      <section className="max-w-3xl mx-auto px-6 pb-12 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Pair with Offensive Testing</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Defense finds the threats. Offense finds the gaps. Our Red Team uses 300+ attack tools — including 8 C2 frameworks — to simulate real adversaries and validate your defenses under fire.</p>
          <Link href="/pentesting" className="inline-block px-8 py-3 rounded-xl font-semibold text-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>Explore Penetration Testing</Link>
        </div>
      </section>

      {/* ─── Cyber Doctrine Intelligence ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Security Intelligence Engine</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>Query our cyber defense doctrine library — backed by 100+ security engines covering MITRE ATT&CK, NIST, OWASP, and real-world threat intelligence.</p>
          <EngineQueryPanel
            domains={['CYBER', 'MALWARE', 'REVENG', 'PENTEST', 'DFIR', 'NET', 'INTELL']}
            title="Cyber Doctrine Search"
            placeholder="Ask about threats, vulnerabilities, compliance, incident response..."
            exampleQueries={[
              'Ransomware incident response playbook',
              'NIST 800-53 access control requirements',
              'Lateral movement detection techniques',
              'Zero trust architecture implementation',
            ]}
            showStats
          />
        </div>
      </section>

      {/* ─── Related Services ─── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Your Security Stack</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Defense is just the beginning. Combine with these services for full-spectrum protection.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Penetration Testing', desc: 'Offensive security engagements. Our red team has never failed to breach a target. Find vulnerabilities before attackers do.', href: '/pentesting', price: 'From $2,500' },
            { title: 'Intelligence Engines', desc: 'AI-powered threat intelligence across 940+ domains. Correlate indicators of compromise with deep contextual analysis.', href: '/engines', price: 'From $199/mo' },
            { title: 'Sentinel AI', desc: 'Real-time security monitoring with natural language queries. Ask your data questions in plain English.', href: '/sentinel', price: 'Free tier available' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>Don&apos;t wait for a breach.</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--ept-text-muted)' }}>The average time to detect a breach is 204 days. Our AI detects threats in under 5 minutes. Threat assessment takes 24 hours. Full deployment in 7 days. Your systems monitored 24/7 from day one.</p>
          <Link href={user ? '/services' : '/signup'} className="inline-block px-10 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Threat Assessment</Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Questions? <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>Contact us</a> | <Link href="/pentesting" className="underline" style={{ color: 'var(--ept-accent)' }}>Penetration Testing</Link> | <Link href="/pricing" className="underline" style={{ color: 'var(--ept-accent)' }}>All Pricing</Link> | <Link href="/" className="underline" style={{ color: 'var(--ept-accent)' }}>Home</Link>
        </p>
      </footer>
      <ProductTutorialButton tutorialId="security" productName="Cyber Defense" />
    </div>
  );
}

export default function SecurityPage() {
  return <SubscriptionGate serviceId="cyber-defense"><SecurityPageContent /></SubscriptionGate>;
}
