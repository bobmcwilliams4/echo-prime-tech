'use client'

import ProductDoc from '@/components/ProductDoc'

export default function DarkWebIntelDocPage() {
  return (
    <ProductDoc
      name="Dark Web Intelligence"
      tagline="AI-powered dark web monitoring and threat detection — know about breaches and threats before they become crises."
      accent="#991b1b"
      productUrl="/dark-web-intel"
      workerUrl="https://echo-darkweb-intelligence.bmcii1976.workers.dev"
      version="1.2.0"
      overview={[
        'Dark Web Intelligence is an automated threat detection platform that continuously monitors dark web forums, paste sites, marketplaces, and breach databases for threats targeting your organization, executives, and digital assets. When your credentials appear in a breach dump, your brand is mentioned in a threat actor forum, or your data surfaces on a marketplace, you are alerted within minutes — not months.',
        'The platform operates a fleet of AI-powered crawlers that navigate Tor hidden services, I2P networks, paste sites, and closed forums where stolen data, exploit kits, and threat actor communications live. Unlike manual dark web research which requires specialized expertise and carries operational risk, Dark Web Intelligence automates the entire process from crawling to analysis to alerting while maintaining strict operational security.',
        'Beyond simple keyword monitoring, the AI engine performs deep contextual analysis on discovered threats. It classifies threat severity, identifies the likely source of compromised data, estimates the freshness and validity of exposed credentials, and provides actionable remediation guidance. Executive protection monitoring watches for personal information exposure, impersonation attempts, and targeted threats against named individuals in your organization.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Configure Your Digital Footprint', desc: 'Define what to monitor: company domains, email patterns, executive names, IP ranges, brand terms, and proprietary data markers. The more comprehensive your footprint definition, the more effective the monitoring.' },
        { step: 2, title: 'Set Severity Thresholds', desc: 'Configure how threats are classified (Critical, High, Medium, Low) based on data type, source credibility, and freshness. Customize thresholds to match your organization risk tolerance and response capabilities.' },
        { step: 3, title: 'Connect Notification Channels', desc: 'Route alerts to the right people — security team Slack channel for credential exposures, executive inbox for brand threats, SIEM webhook for automated incident creation. Configure escalation paths for critical findings.' },
        { step: 4, title: 'Review Initial Scan Results', desc: 'The first scan takes 24-48 hours to complete a comprehensive sweep of historical data. Review the baseline findings report, dismiss known/accepted risks, and prioritize items requiring immediate remediation.' },
        { step: 5, title: 'Enable Continuous Monitoring', desc: 'After the initial scan, continuous monitoring activates automatically. New findings are detected and alerted in near real-time. Review the weekly intelligence summary for trends and emerging threat patterns.' },
      ]}
      features={[
        { title: 'Breach Monitoring', desc: 'Continuous scanning of breach databases, combo lists, and data dumps for your organization credentials. Detects exposed email/password combinations, API keys, session tokens, and internal documents within hours of appearing online.' },
        { title: 'Credential Exposure Detection', desc: 'Identifies exposed credentials across dark web sources and correlates them with your domain and email patterns. Reports include breach source, exposure date, password hash type, and whether credentials are being actively traded.' },
        { title: 'Brand Monitoring', desc: 'Tracks mentions of your brand, products, and executives across dark web forums, marketplaces, and chat channels. Detects impersonation attempts, counterfeit product listings, and reputation attacks before they escalate.' },
        { title: 'Threat Actor Tracking', desc: 'Profiles threat actors who have targeted your industry or organization. Tracks their activity across forums, monitors their tool development, and alerts when their focus shifts toward your sector or assets.' },
        { title: 'Paste Site Monitoring', desc: 'Scans Pastebin, PrivateBin, Ghostbin, and dozens of other paste sites for exposed data matching your footprint. Captures paste content before deletion and archives it for forensic analysis.' },
        { title: 'Marketplace Scanning', desc: 'Monitors dark web marketplaces for listings containing your data, credentials, or intellectual property. Tracks pricing trends for different data types and identifies sellers with repeated access to your information.' },
        { title: 'Vulnerability Alerts', desc: 'Correlates zero-day exploits and vulnerability discussions on dark web forums with your technology stack. Alerts when threat actors discuss exploiting specific software or infrastructure that you use.' },
        { title: 'Executive Protection', desc: 'Dedicated monitoring for named executives — personal email exposure, home address leaks, social engineering reconnaissance, doxxing attempts, and physical threat indicators across all dark web sources.' },
        { title: 'Data Leak Detection', desc: 'AI-powered detection of proprietary data (source code, internal documents, customer databases) appearing on dark web file sharing services, forums, and marketplaces. Content fingerprinting identifies your data even in modified or partial form.' },
        { title: 'Automated Reporting', desc: 'Weekly and monthly intelligence reports summarizing all findings, trends, and risk posture changes. Executive summary format for leadership, detailed technical reports for security teams, and compliance-ready formats for auditors.' },
        { title: 'Historical Analysis', desc: 'Access to historical dark web data for forensic investigations. Search past breaches, forum posts, and marketplace listings to understand the timeline and scope of previous exposures.' },
        { title: 'SIEM Integration', desc: 'Bi-directional integration with major SIEM platforms (Splunk, Sentinel, QRadar, Elastic). Findings automatically create incidents, and SIEM context enriches dark web intelligence with internal telemetry.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/findings', desc: 'List all dark web findings with filtering by severity, type, source, and date range. Supports pagination.', auth: true },
        { method: 'GET', path: '/api/findings/:id', desc: 'Get detailed finding with full context, source data, threat classification, and remediation guidance.', auth: true },
        { method: 'POST', path: '/api/footprint', desc: 'Add or update your digital footprint definition (domains, emails, names, IP ranges, keywords).', auth: true },
        { method: 'GET', path: '/api/footprint', desc: 'Retrieve current digital footprint configuration with monitoring status per asset.', auth: true },
        { method: 'GET', path: '/api/credentials/check', desc: 'Check if a specific email or domain has exposed credentials in the monitored breach databases.', auth: true },
        { method: 'GET', path: '/api/reports/weekly', desc: 'Retrieve the latest weekly intelligence summary with findings, trends, and risk score.', auth: true },
        { method: 'POST', path: '/api/findings/:id/dismiss', desc: 'Dismiss a finding as known/accepted risk with reason and expiration date.', auth: true },
        { method: 'GET', path: '/api/threat-actors', desc: 'List tracked threat actors relevant to your organization with activity summaries.', auth: true },
      ]}
      userGuide={[
        { id: 'footprint', title: 'Defining Your Digital Footprint', content: [
          'Your digital footprint is the foundation of effective monitoring. Navigate to Settings > Digital Footprint to define what the platform watches for. Start with your primary domain and all email patterns (@company.com, @subsidiary.com). Add executive names exactly as they appear in public records and social media profiles.',
          'For comprehensive coverage, also add IP address ranges, internal hostnames, proprietary terms or project codenames, and any unique data markers (internal document headers, code repository names, database table names). The more specific your footprint, the fewer false positives and the faster you detect real threats.',
          'Review your footprint quarterly. As your organization acquires new domains, launches new products, or onboards new executives, the footprint should be updated immediately. The platform suggests footprint additions based on findings — for example, if a related domain appears in a breach, it may recommend adding that domain to your watch list.',
        ]},
        { id: 'findings', title: 'Understanding & Acting on Findings', content: [
          'Each finding includes a severity rating (Critical, High, Medium, Low), threat type classification, source details, and recommended actions. Critical findings require immediate action — typically credential rotation, incident response initiation, or executive notification. High findings should be addressed within 24-48 hours.',
          'The finding detail page shows the full context: where the data was found, how it was detected, the estimated freshness of the exposure, and whether the data appears to be actively traded or simply archived. For credential exposures, the platform indicates whether passwords are plaintext, hashed, or encrypted, and estimates crack difficulty.',
          'Mark findings as "Remediated" after taking action, or "Dismissed" if the exposure is a known/accepted risk. Dismissed findings can be set to auto-expire, causing them to resurface if the same data appears in a new source. This prevents alert fatigue while ensuring nothing falls through the cracks.',
        ]},
        { id: 'executive-protection', title: 'Executive Protection Monitoring', content: [
          'Executive protection mode provides enhanced monitoring for named individuals. Add executives in Settings > Executive Protection with their full name, known email addresses, home city (for geographic threat correlation), and any public-facing aliases. Each executive gets a dedicated risk score and finding feed.',
          'The platform monitors for personal email exposure in breaches, home address or phone number leaks, social engineering reconnaissance (e.g., forum posts gathering information about an executive), impersonation accounts on forums or marketplaces, and physical threat indicators in dark web communications.',
          'Executive findings are routed to a dedicated notification channel separate from general security alerts. Configure who receives executive protection alerts — typically the CISO, corporate security team, and the executive assistant. For physical threat indicators, the platform can be configured to simultaneously notify local law enforcement contacts.',
        ]},
        { id: 'compliance', title: 'Compliance & Reporting', content: [
          'Dark Web Intelligence generates compliance-ready reports for auditors and regulatory requirements. The weekly intelligence summary satisfies continuous monitoring requirements under frameworks like NIST CSF, SOC 2, and PCI DSS. Monthly reports include trend analysis and risk posture scoring.',
          'For incident response documentation, each finding includes a complete audit trail: detection timestamp, source classification, analyst actions, remediation steps, and resolution timestamp. This trail is exportable in standard incident report formats for regulatory submissions.',
          'Data retention policies are configurable to meet your compliance requirements. Finding data, source material, and reports can be retained for 1 year, 3 years, 7 years, or indefinitely. Deleted findings are purged from all backups within 30 days. Access logs for all platform actions are retained for the configured compliance period.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Threat Classification', desc: 'AI engine classifies each finding by threat type (credential exposure, data leak, brand impersonation, vulnerability exploit, physical threat), severity, credibility of source, and estimated business impact. Classification accuracy exceeds 94% based on analyst validation.' },
        { capability: 'Source Credibility Scoring', desc: 'Not all dark web sources are equal. The AI scores each source by historical accuracy, seller reputation, data freshness indicators, and corroboration from other sources. A credential dump from a verified seller scores higher than an anonymous paste.' },
        { capability: 'Credential Validity Estimation', desc: 'For exposed credentials, the AI estimates whether they are still valid based on breach date, password rotation policies, and whether the same credentials appear in subsequent breaches (indicating they were not changed). Helps prioritize remediation effort.' },
        { capability: 'Pattern Recognition', desc: 'Identifies recurring patterns in dark web activity targeting your organization — same threat actor, same data type, same entry vector. Correlates findings over time to detect ongoing campaigns rather than treating each exposure as isolated.' },
        { capability: 'Natural Language Threat Analysis', desc: 'Processes dark web forum posts, marketplace descriptions, and chat logs in multiple languages to extract threat intelligence relevant to your organization. Understands slang, coded language, and obfuscation techniques commonly used by threat actors.' },
        { capability: 'Automated Remediation Guidance', desc: 'Each finding includes specific, actionable remediation steps generated by AI based on the threat type, affected assets, and your organization context. Guidance ranges from "force password reset for these 47 accounts" to "initiate incident response for apparent database exfiltration."' },
      ]}
      troubleshooting={[
        { issue: 'Receiving too many low-severity alerts', solution: 'Adjust your severity thresholds in Settings > Alert Rules. Increase the minimum severity for notifications from Low to Medium. You can also create suppression rules for specific finding types that are not relevant to your risk profile. Low-severity findings are still logged and appear in reports.' },
        { issue: 'Initial scan taking longer than 48 hours', solution: 'Large digital footprints with many domains, email patterns, and keywords require more scanning time. The initial scan checks historical data across all sources, which is significantly more work than ongoing monitoring. Check the scan progress page for completion percentage. If stuck, verify that your footprint does not contain overly broad terms that match millions of records.' },
        { issue: 'Finding shows credential exposure but email does not match our domain', solution: 'This can occur when employees use company email addresses for personal accounts that were breached, or when the AI matches a similar (but different) domain. Review the exact email in the finding detail. If it is a false positive, dismiss it and add an exclusion rule for that pattern.' },
        { issue: 'SIEM integration not receiving findings', solution: 'Verify the webhook URL in Settings > Integrations is correct and accessible from the internet. Check that the SIEM is not rejecting payloads due to authentication or format issues. Test with the "Send Test Finding" button. Review the integration log for HTTP response codes from your SIEM.' },
      ]}
      faq={[
        { q: 'Is it legal to monitor the dark web?', a: 'Yes. Passive monitoring and intelligence gathering from publicly accessible (even if hidden) sources is legal in the United States and most jurisdictions. Dark Web Intelligence only performs passive observation — it does not interact with threat actors, purchase stolen data, or engage in any activity that could constitute unauthorized access.' },
        { q: 'How quickly will I be alerted about a new breach?', a: 'For major breaches, alerts typically arrive within 1-4 hours of data appearing on dark web sources. Smaller, targeted leaks may take 12-24 hours depending on the source. The platform monitors over 10,000 dark web sources continuously, with high-priority sources checked every 15 minutes.' },
        { q: 'Can threat actors detect that they are being monitored?', a: 'No. The platform uses strict operational security practices — anonymous access methods, distributed crawling infrastructure, and no interactive engagement with dark web entities. Monitoring is entirely passive and leaves no fingerprint that could identify your organization as the observer.' },
        { q: 'What happens when exposed credentials are found?', a: 'The platform generates a Critical or High severity finding with the exposed email addresses, password hash types, breach source, and estimated exposure date. Recommended actions include forcing password resets for affected accounts, checking for unauthorized access in your logs, and enabling MFA if not already active.' },
        { q: 'Does the platform store the actual stolen passwords?', a: 'No. The platform stores password hashes and metadata (hash type, length, complexity indicators) but never stores plaintext passwords. This allows credential matching and validity estimation without creating an additional exposure risk. All finding data is encrypted at rest.' },
      ]}
    />
  )
}
