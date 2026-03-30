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
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import NewsletterSignup from '../../components/NewsletterSignup';

const SERVICE_ID = 'cyber-defense';

const FAQS = [
  { q: 'What types of security assessments do you offer?', a: 'Network penetration testing, web application testing, API security testing, social engineering, wireless security, cloud configuration review, source code review, and red team exercises. Each engagement includes a detailed report with remediation priorities.' },
  { q: 'Do you work with small businesses?', a: 'Yes. Our starter security audit is designed for businesses with 5-50 employees who need professional-grade security without enterprise budgets. We assess your attack surface, identify critical vulnerabilities, and provide a prioritized remediation plan.' },
  { q: 'What certifications do your testers hold?', a: 'Our team holds OSCP, OSCE, GPEN, GWAPT, CEH, and CISSP certifications. All testing follows OWASP, NIST, and PTES methodologies. We stay current with the latest CVEs and attack techniques.' },
  { q: 'How long does a typical engagement take?', a: 'A basic web application test takes 1-2 weeks. A full network penetration test takes 2-4 weeks. Red team exercises run 4-8 weeks. Timelines depend on scope and complexity. We provide a detailed statement of work before starting.' },
  { q: 'Do you offer ongoing monitoring?', a: 'Yes. After the initial assessment, we offer continuous monitoring packages that include vulnerability scanning, threat intelligence feeds, dark web monitoring for your credentials, and quarterly re-testing of critical assets.' },
  { q: 'Will testing disrupt our operations?', a: 'We design tests to minimize disruption. Non-destructive techniques are used by default. Denial-of-service testing is only performed in isolated environments with your approval. Testing windows can be scheduled during off-hours.' },
];

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
  const [mobileMenu, setMobileMenu] = useState(false);

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
      <noscript><div style={{padding:'40px',maxWidth:'800px',margin:'0 auto'}}><h1>Cybersecurity Intelligence — AI Threat Detection | Echo Prime Technologies</h1><p>Enterprise-grade cybersecurity with AI-powered penetration testing, dark web monitoring, credential auditing, and threat intelligence. Features include network penetration testing, web application security, API security assessment, social engineering testing, wireless security auditing, cloud configuration review, source code analysis, red team exercises, dark web credential monitoring, OSINT intelligence gathering, and compliance reporting for NIST, SOC2, PCI-DSS, and HIPAA frameworks. Our team holds OSCP, OSCE, GPEN, GWAPT, CEH, and CISSP certifications.</p></div></noscript>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{name:'Home',href:'/'},{name:'Products',href:'/services'},{name:'Cybersecurity',href:'/security'}]} />
      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between backdrop-blur-xl"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: isDark ? 'rgba(5,5,8,0.85)' : 'rgba(255,255,255,0.85)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/architecture" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Architecture</Link>
          <Link href="/pentesting" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Offensive Security</Link>
          <Link href="/benchmarks" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Benchmarks</Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/free" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--ept-text)' }}>
            {mobileMenu
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>}
          </svg>
        </button>
      </nav>
      {mobileMenu && (
        <div className="md:hidden border-b px-6 py-4 space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-border)' }}>
          <Link href="/architecture" className="block text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Architecture</Link>
          <Link href="/pentesting" className="block text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Offensive Security</Link>
          <Link href="/benchmarks" className="block text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Benchmarks</Link>
          <Link href="/pricing" className="block text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/free" className="block text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Start Free</Link>
          <Link href="/login" className="block text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>Sign In</Link>
        </div>
      )}

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

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <summary className="cursor-pointer select-none px-6 py-4 font-semibold flex items-center justify-between" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <span className="ml-2 transition-transform group-open:rotate-45 text-lg" style={{ color: 'var(--ept-accent)' }}>+</span>
              </summary>
              <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ─── Related Articles ─── */}
      <div className="mt-16 max-w-4xl mx-auto px-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'Zero Trust Security for Small Business', href: '/blog/zero-trust-security-small-business-implementation-2026' },
            { title: 'Ransomware Incident Response Plan', href: '/blog/ransomware-incident-response-plan-smb-2026' },
            { title: 'API Security Testing: OWASP Top 10', href: '/blog/api-security-testing-owasp-top-10-automated-scanning-2026' },
          ].map(a => (
            <a key={a.href} href={a.href} className="p-4 rounded-lg border text-sm font-medium hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--ept-card-border)', color: 'var(--ept-accent)' }}>
              {a.title} &rarr;
            </a>
          ))}
        </div>
      </div>

      {/* ─── Data Policy & Privacy ─── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Data Policy &amp; Privacy</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Your data security is non-negotiable. Here&apos;s exactly how we protect it.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Zero Data Retention', desc: 'Queries are processed on Cloudflare\'s edge network and never stored. No centralized server holds your data. API responses are ephemeral — they exist only for the duration of the request.', icon: '\u{1F6AB}' },
            { title: 'Encryption Everywhere', desc: 'TLS 1.3 in transit. AES-256-GCM at rest. Argon2id key derivation for credential storage. HMAC-SHA256 integrity verification on every vault read. The same standards used by banks and defense contractors.', icon: '\u{1F512}' },
            { title: 'No Model Training', desc: 'We do not use your queries, documents, or data to train any AI models. Your intellectual property stays yours. Period. This is contractually guaranteed for enterprise customers.', icon: '\u{1F6E1}\u{FE0F}' },
            { title: 'Edge-Only Processing', desc: 'All computation runs on Cloudflare\'s global edge network across 300+ data centers. Data is processed at the nearest edge location and never leaves the region. No data is sent to third-party AI providers.', icon: '\u{1F30D}' },
            { title: 'SOC 2 Type II Infrastructure', desc: 'Cloudflare Workers run on SOC 2 Type II certified infrastructure. Annual penetration testing. Continuous monitoring. Incident response within 30 minutes. Full audit trail on all administrative actions.', icon: '\u{1F4CB}' },
            { title: 'Data Sovereignty', desc: 'For regulated industries, we offer data locality guarantees ensuring your data is processed only within specified geographic regions. Full GDPR Article 28 compliance for EU data.', icon: '\u{1F3F3}\u{FE0F}' },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Certifications & Compliance Roadmap ─── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--ept-text)' }}>Certifications &amp; Compliance Roadmap</h2>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--ept-text-muted)' }}>Our commitment to security isn&apos;t just words — it&apos;s a roadmap of certifications and compliance milestones.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Current */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: '#22c55e' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#22c55e' }}>Active Now</span>
            </div>
            <ul className="space-y-3">
              {[
                'SOC 2 Type II Infrastructure (via Cloudflare)',
                'TLS 1.3 + AES-256-GCM Encryption',
                'GDPR Article 28 Compliant',
                'OWASP Top 10 Tested (Quarterly)',
                'NIST CSF 2.0 Aligned',
                'CIS Controls v8 Mapped',
                'Automated Vulnerability Scanning',
                'Annual Penetration Testing',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* In Progress */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>In Progress</span>
            </div>
            <ul className="space-y-3">
              {[
                'SOC 2 Type II Direct Certification',
                'ISO 27001:2022 Certification',
                'HIPAA Business Associate Agreement',
                'PCI-DSS v4.0 Compliance',
                'FedRAMP Authorization (Moderate)',
                'Bug Bounty Program Launch',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Planned */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--ept-text-muted)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Planned 2026-2027</span>
            </div>
            <ul className="space-y-3">
              {[
                'NIST 800-53 Rev 5 Full Assessment',
                'CSA STAR Level 2 Certification',
                'StateRAMP Authorization',
                'TX-RAMP Certification (Texas)',
                'Cyber Essentials Plus (UK)',
                'IRAP Assessment (Australia)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="max-w-xl mx-auto px-6 pb-16">
        <NewsletterSignup />
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
      <footer className="border-t px-6 py-12" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-6 mb-8">
            {[
              { href: 'https://x.com/EchoPrimeTech', label: 'X / Twitter', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { href: 'https://linkedin.com/company/echo-prime-technologies', label: 'LinkedIn', d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              { href: 'https://youtube.com/@EchoPrimeTech', label: 'YouTube', d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              { href: 'https://github.com/ECHO-OMEGA-PRIME', label: 'GitHub', d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'var(--ept-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ept-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ept-text-muted)')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/architecture" className="hover:underline">Architecture</Link>
            <Link href="/benchmarks" className="hover:underline">Benchmarks</Link>
            <Link href="/case-studies" className="hover:underline">Case Studies</Link>
            <Link href="/pentesting" className="hover:underline">Pentesting</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/docs" className="hover:underline">Docs</Link>
          </div>
          <p className="text-center text-xs" style={{ color: 'var(--ept-text-muted)' }}>
            &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.{' '}
            <Link href="/legal/privacy" className="underline">Privacy</Link> &middot;{' '}
            <Link href="/legal/terms" className="underline">Terms</Link>
          </p>
          <p className="text-center text-xs mt-2" style={{ color: 'var(--ept-text-muted)' }}>
            Midland, TX &middot; bobbymcwilliams@echo-op.com
          </p>
        </div>
      </footer>
      <ProductTutorialButton tutorialId="security" productName="Cyber Defense" />
    </div>
  );
}

export default function SecurityPage() {
  return <SubscriptionGate serviceId="cyber-defense"><SecurityPageContent /></SubscriptionGate>;
}
