'use client'

import ProductDoc from '@/components/ProductDoc'
import type { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Security Suite',
  tagline: 'AI-powered cybersecurity — pentesting, dark web intelligence, vulnerability management, SIEM, compliance automation, and 24/7 threat monitoring.',
  accent: '#ef4444',
  productUrl: '/security',
  workerUrl: 'https://echo-security-suite.bmcii1976.workers.dev',
  version: '2.0.0',

  overview: [
    'Echo Prime Security Suite is a full-spectrum cybersecurity platform built for businesses that take security seriously but lack the budget for a dedicated SOC team. It combines offensive security (penetration testing, red teaming, attack surface mapping) with defensive operations (SIEM, threat hunting, incident response) in a single platform backed by AI-driven automation and a team holding OSCP, OSCE, GPEN, GWAPT, CEH, and CISSP certifications.',
    'The platform deploys 16 deep defensive capabilities covering AI threat detection, credential breach monitoring, email security, network defense, vulnerability management, malware defense, exploitation prevention, secret scanning, cloud security, reverse engineering defense, SIEM operations, digital forensics, system hardening, compliance automation, and SOAR orchestration. Each capability integrates open-source and proprietary tools tuned for your specific environment — not generic signatures that generate thousands of false positives.',
    'Compliance is not an afterthought. The suite continuously monitors your posture against SOC 2 Type I/II, HIPAA, PCI-DSS v4.0, GDPR, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and FedRAMP. Automated evidence collection and audit-ready report generation mean your next audit is a formality, not a fire drill. Every finding maps to MITRE ATT&CK techniques so your team speaks the same language as the threat landscape.',
  ],

  gettingStarted: [
    { step: 1, title: 'Schedule a Discovery Call', desc: 'Contact our team to scope your engagement. We assess your infrastructure — networks, endpoints, cloud, email, credentials, and third-party integrations — and deliver a threat landscape report within 24 hours.' },
    { step: 2, title: 'Architecture & Policy Design', desc: 'We design your defensive architecture: network segmentation, zero-trust policies, detection rules, monitoring scopes, and response playbooks tailored to your industry and compliance requirements.' },
    { step: 3, title: 'Deploy the Defense Layer', desc: 'Monitoring agents, SIEM pipelines, breach monitoring, credential vault, email security, vulnerability scanning, and forensic readiness are deployed with zero downtime.' },
    { step: 4, title: 'Tuning & Baseline (30 days)', desc: 'A 30-day tuning period reduces false positives, establishes behavioral baselines, calibrates alert thresholds, and validates detection rules against real traffic in your environment.' },
    { step: 5, title: 'Activate 24/7 Monitoring', desc: 'The platform goes fully operational with AI-powered threat hunting, phishing blocking, credential monitoring, vulnerability patching, event correlation, and automated response for high-confidence threats.' },
    { step: 6, title: 'Continuous Improvement', desc: 'Monthly posture reports, quarterly risk reviews, annual penetration testing, compliance scorecards, threat landscape briefings, and detection rule updates ensure your security improves every month.' },
  ],

  features: [
    { title: 'AI Threat Detection & Hunting', desc: 'ML models trained on millions of attack patterns analyze network traffic, endpoint behavior, and log data in real time. Automated threat hunting runs 24/7 using hypothesis-driven campaigns with Wazuh, BLUESPAWN, Security Onion, Chainsaw, RITA, and Sigma Rules.' },
    { title: 'Password Breach Intelligence', desc: 'Continuous monitoring of dark web forums, paste sites, stealer logs, and breach databases for your organization\'s credentials. Instant alerts when employee passwords appear in new leaks via HaveIBeenPwned, h8mail, pwnedOrNot, and DeHashed.' },
    { title: 'Email Security & Anti-Phishing', desc: 'Multi-layer email defense: SPF/DKIM/DMARC enforcement, ML-based phishing detection, attachment sandboxing, URL rewriting, BEC detection using writing style analysis, and executive impersonation protection.' },
    { title: 'Network Defense & Traffic Analysis', desc: 'Deep packet inspection, protocol analysis, and behavioral baselining. Detect lateral movement, C2 beaconing, DNS tunneling, and data exfiltration with Suricata, Zeek, RITA, and SafeLine WAF.' },
    { title: 'Credential Vault & Key Management', desc: 'Military-grade storage with AES-256-GCM encryption, Argon2id key derivation (64MB memory cost), HMAC-SHA256 integrity verification, automatic rotation policies, and reuse detection across all stored credentials.' },
    { title: 'Vulnerability Management', desc: 'Continuous automated scanning with 9,000+ vulnerability templates (Nuclei, Nikto, Trivy, Prowler, OpenVAS). CVSS v4.0 + EPSS scoring prioritizes what actually matters. Full asset inventory and remediation SLA tracking.' },
    { title: 'Spyware & Malware Defense', desc: 'Prometheus Spyware Defense System — 14-module platform with ML behavioral analysis, YARA engine (500+ rules), MVT for iOS/Android spyware detection, memory scanning, rootkit detection, and automated quarantine.' },
    { title: 'Exploitation Prevention', desc: 'WAF with custom rule sets, runtime application self-protection (RASP), exploit mitigation (ASLR, DEP, CFG), API rate limiting, deserialization attack prevention, and automated virtual patching for zero-days.' },
    { title: 'Secret Detection & DLP', desc: 'Scan every git commit, CI/CD pipeline, config file, log output, and Slack message for leaked secrets. Supports 800+ secret patterns with Gitleaks, TruffleHog, and GitHub Watchman. DLP policies for PII, PHI, and PCI data.' },
    { title: 'Cloud & Container Security', desc: 'Multi-cloud CSPM for AWS, Azure, GCP, and Cloudflare. CIS Benchmark scanning, IAM misconfiguration detection, container image vulnerability scanning, Kubernetes RBAC auditing, and IaC security scanning.' },
    { title: 'SIEM & Security Operations', desc: 'Centralized security operations with real-time event correlation across all endpoints, network devices, cloud services, and applications. Custom detection rules, automated alert triage, and STIX/TAXII threat intelligence feeds.' },
    { title: 'Digital Forensics & Incident Response', desc: 'Full DFIR capability: disk forensics, memory analysis, network forensics, cloud forensics, mobile device forensics, chain of custody documentation, timeline reconstruction, and anti-forensics detection with Autopsy, Volatility3, and KAPE.' },
    { title: 'System & Infrastructure Hardening', desc: 'Automated hardening for Windows (HardeningKitty, 400+ checks), Linux (Lynis, CIS benchmarks), and network devices. Before/after scoring with compliance drift detection.' },
    { title: 'Compliance Automation', desc: 'Continuous monitoring for SOC 2, HIPAA, PCI-DSS v4.0, GDPR, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and FedRAMP. Automated evidence collection and audit-ready report generation.' },
    { title: 'Reverse Engineering Defense', desc: 'Binary protection analysis, code obfuscation gap identification, anti-debugging validation, license protection testing, firmware security review, SBOM analysis, and dependency vulnerability scoring.' },
    { title: 'AI-Powered SOAR', desc: 'Automated incident response playbooks for the top 50 attack scenarios. Containment begins in seconds — automated alert enrichment, threat intelligence correlation, evidence collection, and stakeholder notification.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/scan/network', desc: 'Initiate a network penetration test against specified targets. Returns a job ID for progress polling. Requires scope approval.', auth: true },
    { method: 'POST', path: '/api/scan/webapp', desc: 'Start a web application security assessment (OWASP Top 10, API testing, authentication bypass). Targets a URL or API endpoint.', auth: true },
    { method: 'GET', path: '/api/vulnerabilities', desc: 'List all discovered vulnerabilities with CVSS v4.0 scores, EPSS predictions, affected assets, and remediation guidance. Filterable by severity, status, and asset.', auth: true },
    { method: 'GET', path: '/api/breaches', desc: 'Query dark web breach monitoring results. Returns exposed credentials, leak source, detection date, and remediation status.', auth: true },
    { method: 'POST', path: '/api/compliance/report', desc: 'Generate a compliance report for a specific framework (SOC2, HIPAA, PCI-DSS, NIST, ISO 27001). Returns a downloadable PDF with control mapping.', auth: true },
    { method: 'GET', path: '/api/alerts', desc: 'Retrieve active security alerts with severity, MITRE ATT&CK mapping, affected assets, and recommended actions. Supports real-time SSE streaming.', auth: true },
    { method: 'POST', path: '/api/incident', desc: 'Create an incident response case. Triggers automated containment playbook based on incident type and severity classification.', auth: true },
    { method: 'GET', path: '/api/posture', desc: 'Get your current security posture score across all monitored assets. Includes trend data, framework compliance percentages, and comparison benchmarks.', auth: false },
    { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status, scanner availability, SIEM pipeline health, and threat feed connectivity.', auth: false },
  ],

  userGuide: [
    {
      title: 'Running Security Scans',
      id: 'running-scans',
      content: [
        'Security scans are initiated from the dashboard or via the API. Select the scan type — network penetration test, web application assessment, cloud configuration review, or vulnerability scan — and define the scope. Scope definition is critical: specify target IP ranges, URLs, excluded hosts, and testing windows to ensure accurate results without disrupting production.',
        'Network scans use Nmap for discovery, Suricata for traffic analysis, and custom Nuclei templates for vulnerability detection. Web application scans integrate Nikto for server misconfigurations, ZAP for dynamic application testing, and custom scripts for business logic vulnerabilities. Cloud scans use Prowler (AWS), ScoutSuite (multi-cloud), and Trivy (containers).',
        'Scan results are prioritized using a combination of CVSS v4.0 base scores and EPSS (Exploit Prediction Scoring System) data. This means vulnerabilities with active exploits in the wild rank higher than theoretical vulnerabilities with high CVSS scores but no known exploitation. Each finding includes a detailed remediation guide.',
      ],
    },
    {
      title: 'Configuring Alerts',
      id: 'configuring-alerts',
      content: [
        'Alert configuration is managed in Settings > Alerts. You can create rules based on severity (Critical, High, Medium, Low), source (SIEM, vulnerability scanner, breach monitor, email security), and asset group. Each rule defines a notification channel: email, Slack, PagerDuty, webhook, or SMS.',
        'Alert fatigue is the enemy of effective security. Use the built-in tuning wizard to establish a baseline during the first 30 days. The AI learns your normal traffic patterns and automatically suppresses known-benign alerts while escalating novel threats. You can review suppressed alerts weekly to ensure nothing important was filtered.',
        'For critical alerts, configure automatic containment actions: isolate an endpoint, block an IP, disable a user account, or trigger an incident response playbook. These actions execute in seconds and are logged with full audit trail for post-incident review.',
      ],
    },
    {
      title: 'Compliance Monitoring',
      id: 'compliance-monitoring',
      content: [
        'Navigate to the Compliance tab to see your current posture against all enabled frameworks. Each framework is broken into controls, and each control shows its status: Compliant, Non-Compliant, Partially Compliant, or Not Assessed. Click any control to see the evidence collected, gaps identified, and recommended remediation steps.',
        'Evidence collection is automated. The platform continuously gathers configuration snapshots, access logs, encryption status, patch levels, and policy documentation from your infrastructure. When audit time comes, generate a report with one click — all evidence is pre-mapped to the specific controls your auditor will check.',
        'Supported frameworks: SOC 2 Type I and Type II, HIPAA Security Rule, PCI-DSS v4.0, GDPR Article mapping, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and FedRAMP. Cross-framework mapping shows where a single control satisfies requirements across multiple standards.',
      ],
    },
    {
      title: 'Dark Web Monitoring',
      id: 'dark-web-monitoring',
      content: [
        'The breach intelligence module monitors dark web forums, paste sites, stealer log markets, Telegram channels, and known breach databases for any mention of your organization\'s domains, email addresses, or credentials. Monitoring runs continuously and new findings trigger alerts within minutes of detection.',
        'When a breach is detected, the alert includes: the exposed credential (email or username — passwords are redacted in the UI), the source of the leak, the date it was first seen, and a risk score based on how recently the password was active. Automated workflows can force a password reset for the affected user.',
        'Proactive password auditing complements breach monitoring. The platform tests your Active Directory or identity provider against real-world cracking dictionaries — not just complexity rules. Passwords that would fall to a dictionary attack in under 4 hours are flagged for immediate rotation.',
      ],
    },
    {
      title: 'Incident Response',
      id: 'incident-response',
      content: [
        'When a security incident is confirmed, create an incident case from the Incidents tab or let the SOAR engine create one automatically when a high-confidence threat is detected. Each case tracks the incident lifecycle: Detection, Containment, Eradication, Recovery, and Lessons Learned.',
        'Automated playbooks handle the first 90% of incident response: isolate affected endpoints, preserve forensic evidence, block malicious IPs, disable compromised accounts, and notify stakeholders. Human analysts step in for strategic decisions — the AI handles the repetitive, time-sensitive work.',
        'Post-incident, the platform generates a full timeline reconstruction: what happened, when, how the attacker gained access, what they accessed, and how containment was achieved. This report satisfies regulatory notification requirements and feeds back into detection rules to prevent recurrence.',
      ],
    },
    {
      title: 'Tool Integrations',
      id: 'tool-integrations',
      content: [
        'The Security Suite integrates with your existing stack. Connect Nmap, Nikto, and ZAP for scanning. Wazuh and Security Onion for SIEM. Suricata and Zeek for network monitoring. Nuclei and Trivy for vulnerability detection. Prowler for cloud security. Autopsy and Volatility3 for forensics.',
        'All tool outputs are normalized into a unified data model and fed into the correlation engine. A vulnerability found by Nuclei is automatically cross-referenced with Suricata network alerts and Wazuh endpoint logs. This correlation eliminates blind spots that exist when tools operate in isolation.',
        'Custom integrations are supported via webhook and REST API. Push alerts to Slack, PagerDuty, Jira, ServiceNow, or any system that accepts webhooks. Pull data from the API for custom dashboards, executive reports, or integration with your existing GRC platform.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Threat Hunting AI', desc: 'Machine learning models trained on millions of attack patterns run hypothesis-driven hunting campaigns 24/7. Detects adversaries that evade signature-based detection by identifying behavioral anomalies across network, endpoint, and cloud telemetry.' },
    { capability: 'Phishing Detection ML', desc: 'Zero-day phishing campaign detection using natural language processing, visual similarity analysis (for cloned login pages), URL reputation scoring, and sender behavior profiling. Catches campaigns that bypass traditional email gateways.' },
    { capability: 'Vulnerability Prioritization', desc: 'Combines CVSS v4.0 base scores with EPSS exploit prediction data, asset criticality, and business context to rank vulnerabilities by actual risk — not theoretical severity. Reduces remediation backlog by 60-80% by focusing on what matters.' },
    { capability: 'SOAR Playbook Engine', desc: 'Automated incident response for the top 50 attack scenarios. Alert enrichment, threat correlation, containment actions, evidence preservation, and stakeholder notification — all executed in seconds without human intervention for high-confidence detections.' },
    { capability: 'Behavioral Baselining', desc: 'Establishes normal behavior profiles for every user, endpoint, and network segment. Detects anomalies like unusual login times, unexpected data transfers, privilege escalation patterns, and lateral movement that indicate compromise.' },
    { capability: 'Compliance Gap Prediction', desc: 'Analyzes your configuration changes, access patterns, and infrastructure updates to predict compliance drift before it becomes a finding. Proactive remediation recommendations prevent audit failures.' },
    { capability: 'Dark Web Intelligence', desc: 'Continuous monitoring of underground markets, forums, paste sites, and stealer log channels using NLP to identify mentions of your organization, domains, credentials, and intellectual property. Automated risk scoring and credential rotation triggers.' },
    { capability: 'Attack Surface Mapping', desc: 'Automated discovery and continuous monitoring of your external attack surface: domains, subdomains, exposed services, cloud assets, APIs, and third-party integrations. Identifies shadow IT and forgotten assets before attackers find them.' },
  ],

  troubleshooting: [
    { issue: 'Scan timing out on large networks', solution: 'For networks with 500+ hosts, break the scan into subnets using the scope configuration. Set the scan type to "incremental" which discovers hosts first, then deep-scans in batches. Adjust the concurrent thread count in Settings > Scanning > Performance.' },
    { issue: 'Too many false positive alerts', solution: 'Run the tuning wizard in Settings > Alerts > Tune. The 30-day baseline period is designed to learn your normal patterns. You can also create suppression rules for known-benign alerts (e.g., scheduled backup traffic, legitimate scanning tools). Review suppressed alerts weekly.' },
    { issue: 'Compliance report shows controls as Not Assessed', solution: 'Not Assessed means the platform lacks data for that control. Check that the relevant monitoring agent is installed on the asset in question. Some controls require manual evidence upload (e.g., physical security policies). Navigate to the control and click "Provide Evidence" to upload documentation.' },
    { issue: 'Dark web alerts for old/expired credentials', solution: 'Breach databases often contain historical data. Mark credentials as "Rotated" in the breach dashboard to acknowledge them without closing the alert. Enable the "Active Only" filter to focus on credentials that are currently in use in your identity provider.' },
    { issue: 'SIEM pipeline lag or missing events', solution: 'Check agent health in Settings > Agents. Agents that lose connectivity buffer events locally and sync when reconnected. If lag persists, verify network connectivity between agents and the SIEM collector. Check that the collector has sufficient disk space for the event buffer.' },
  ],

  faq: [
    { q: 'What types of security assessments do you offer?', a: 'Network penetration testing, web application testing, API security testing, social engineering, wireless security, cloud configuration review, source code review, and red team exercises. Each engagement includes a detailed report with remediation priorities.' },
    { q: 'Do you work with small businesses?', a: 'Yes. Our starter security audit is designed for businesses with 5-50 employees who need professional-grade security without enterprise budgets. We assess your attack surface, identify critical vulnerabilities, and provide a prioritized remediation plan.' },
    { q: 'What certifications do your testers hold?', a: 'Our team holds OSCP, OSCE, GPEN, GWAPT, CEH, and CISSP certifications. All testing follows OWASP, NIST, and PTES methodologies. We stay current with the latest CVEs and attack techniques.' },
    { q: 'How long does a typical engagement take?', a: 'A basic web application test takes 1-2 weeks. A full network penetration test takes 2-4 weeks. Red team exercises run 4-8 weeks. Timelines depend on scope and complexity. We provide a detailed statement of work before starting.' },
    { q: 'Do you offer ongoing monitoring after an assessment?', a: 'Yes. After the initial assessment, we offer continuous monitoring packages that include vulnerability scanning, threat intelligence feeds, dark web monitoring for your credentials, and quarterly re-testing of critical assets.' },
    { q: 'Which compliance frameworks are supported?', a: 'SOC 2 Type I and Type II, HIPAA Security Rule, PCI-DSS v4.0, GDPR, NIST CSF 2.0, NIST 800-53 Rev 5, ISO 27001:2022, CIS Controls v8, and FedRAMP. Cross-framework mapping shows where one control satisfies multiple standards simultaneously.' },
    { q: 'Will penetration testing disrupt our operations?', a: 'We design tests to minimize disruption. Non-destructive techniques are used by default. Denial-of-service testing is only performed in isolated environments with your approval. Testing windows can be scheduled during off-hours.' },
    { q: 'How does the MITRE ATT&CK mapping work?', a: 'Every finding and alert is mapped to specific MITRE ATT&CK techniques and tactics. This gives your team a common language for describing threats and helps prioritize defenses against the techniques most commonly used against your industry. Dashboard views show coverage heat maps across the ATT&CK matrix.' },
  ],
}

export default function SecurityDocsPage() {
  return <ProductDoc {...data} />
}
