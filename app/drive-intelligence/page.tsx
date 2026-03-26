'use client'

import { useTheme } from '@/lib/theme-context'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const faqs = [
  { question: 'How does AI file analysis work?', answer: 'Our AI scans file content, metadata, and structure to classify documents, detect duplicates, identify sensitive data, and suggest organization schemes. It understands context — grouping related files even when names are inconsistent.' },
  { question: 'Will it modify my files?', answer: 'Never without your approval. Drive Intelligence operates in read-only mode by default. It analyzes and recommends — you approve actions before any files are moved, renamed, or deleted.' },
  { question: 'Can it scan network drives and cloud storage?', answer: 'Yes. Scan local drives, NAS, network shares, and cloud storage (Google Drive, OneDrive, Dropbox, S3, R2). Unified view across all storage locations.' },
  { question: 'How does compliance scanning work?', answer: 'AI identifies PII, PHI, financial data, and other sensitive information across your file systems. Generate compliance reports for GDPR, HIPAA, SOC2, and PCI-DSS. Flag files that need encryption or access restriction.' },
]

const features = [
  { title: 'AI File Classification', desc: 'Automatically categorize files by content type, project, department, and relevance. No more digging through folder hierarchies.' },
  { title: 'Duplicate Detection', desc: 'Content-aware duplicate finding that goes beyond filename matching. Detect near-duplicates, versioned copies, and redundant backups.' },
  { title: 'Storage Optimization', desc: 'Identify large files, old backups, temp files, and unused data consuming storage. Get actionable cleanup recommendations with projected savings.' },
  { title: 'Sensitive Data Discovery', desc: 'AI scans for PII, credentials, API keys, financial data, and PHI across all file types — including PDFs, images with OCR, and archives.' },
  { title: 'Smart Organization', desc: 'AI suggests folder structures based on actual usage patterns. Reorganize years of accumulated files into logical hierarchies.' },
  { title: 'File Relationship Mapping', desc: 'Discover which files reference each other, share data, or belong to the same project — even across different folders.' },
  { title: 'Version History', desc: 'Track file versions across locations. Find the latest version of any document regardless of where copies live.' },
  { title: 'Multi-Source Scanning', desc: 'Scan local drives, network shares, cloud storage (Google Drive, S3, R2, OneDrive), and NAS devices from one dashboard.' },
  { title: 'Compliance Reports', desc: 'Generate GDPR, HIPAA, SOC2, and PCI-DSS compliance reports. Identify data that needs encryption, access control, or deletion.' },
  { title: 'Usage Analytics', desc: 'Track which files are accessed frequently, which are stale, and how storage grows over time. Plan capacity and cleanup.' },
  { title: 'Automated Policies', desc: 'Set rules for automatic archival, deletion of old temp files, and alerts when sensitive data appears in unsecured locations.' },
  { title: 'Search Everything', desc: 'Full-text search across all file contents, metadata, and tags. Find any file in seconds, even across terabytes of data.' },
]

const comparison = [
  { feature: 'AI classification', echo: 'Content-aware', treesize: 'No', spacesniffer: 'No', varonis: 'Yes' },
  { feature: 'Duplicate detection', echo: 'Content + near-dups', treesize: 'Basic hash', spacesniffer: 'No', varonis: 'Basic' },
  { feature: 'Sensitive data scan', echo: 'PII/PHI/creds/OCR', treesize: 'No', spacesniffer: 'No', varonis: 'Yes' },
  { feature: 'Cloud storage', echo: 'S3/R2/GDrive/OneDrive', treesize: 'No', spacesniffer: 'No', varonis: 'Yes' },
  { feature: 'Smart organization', echo: 'AI-suggested', treesize: 'No', spacesniffer: 'No', varonis: 'No' },
  { feature: 'File relationships', echo: 'Reference mapping', treesize: 'No', spacesniffer: 'No', varonis: 'Limited' },
  { feature: 'Compliance reports', echo: 'GDPR/HIPAA/SOC2', treesize: 'No', spacesniffer: 'No', varonis: 'Yes' },
  { feature: 'Full-text search', echo: 'All content + OCR', treesize: 'Filename only', spacesniffer: 'Filename', varonis: 'Yes' },
  { feature: 'Automated policies', echo: 'Archive/delete/alert', treesize: 'No', spacesniffer: 'No', varonis: 'Yes' },
  { feature: 'Usage analytics', echo: 'Access + growth', treesize: 'Size only', spacesniffer: 'Size only', varonis: 'Yes' },
  { feature: 'Starting price', echo: '$19/mo', treesize: '$50 (one-time)', spacesniffer: 'Free', varonis: 'Enterprise' },
]

export default function DriveIntelligencePage() {
  const { isDark } = useTheme()
  const dark = isDark
  const accent = '#3b82f6'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Drive Intelligence', href: '/drive-intelligence' }]} />
      <FaqSchema faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />
      <div style={{ minHeight: '100vh', background: dark ? 'var(--ept-bg-dark, #0a0a0a)' : 'var(--ept-bg-light, #ffffff)', color: dark ? '#e5e7eb' : '#1f2937' }}>
        <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Echo Drive Intelligence</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: 32, lineHeight: 1.6 }}>Turn chaotic file systems into organized intelligence. AI-powered classification, duplicate detection, sensitive data discovery, and compliance scanning across all your storage.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?service=drive-intelligence&tier=starter" style={{ padding: '14px 32px', background: accent, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start Free Trial</a>
            <a href="#pricing" style={{ padding: '14px 32px', border: `2px solid ${accent}`, color: accent, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>View Pricing</a>
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>AI-Powered File Intelligence</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f) => (<div key={f.title} style={{ padding: 24, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: accent }}>{f.title}</h3><p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>{f.desc}</p></div>))}
          </div>
        </section>
        <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>How We Compare</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr style={{ borderBottom: `2px solid ${dark ? '#374151' : '#e5e7eb'}` }}><th style={{ textAlign: 'left', padding: '12px 16px' }}>Feature</th><th style={{ textAlign: 'center', padding: '12px 16px', color: accent, fontWeight: 800 }}>Echo</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>TreeSize</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>SpaceSniffer</th><th style={{ textAlign: 'center', padding: '12px 16px' }}>Varonis</th></tr></thead>
              <tbody>{comparison.map((row) => (<tr key={row.feature} style={{ borderBottom: `1px solid ${dark ? '#1f2937' : '#f3f4f6'}` }}><td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.feature}</td><td style={{ padding: '10px 16px', textAlign: 'center', color: accent, fontWeight: 700 }}>{row.echo}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.treesize}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.spacesniffer}</td><td style={{ padding: '10px 16px', textAlign: 'center', opacity: 0.7 }}>{row.varonis}</td></tr>))}</tbody>
            </table>
          </div>
        </section>
        <section id="pricing" style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Starter', price: '$19', period: '/mo', features: ['1TB scan capacity', 'Local drives only', 'Duplicate detection', 'Storage optimization', 'Email reports'], cta: 'starter' },
              { tier: 'Professional', price: '$59', period: '/mo', features: ['10TB scan capacity', 'Cloud + local + NAS', 'AI classification', 'Sensitive data scan', 'Compliance reports', 'Automated policies', 'Full-text search', 'Priority support'], cta: 'professional', popular: true },
              { tier: 'Enterprise', price: '$199', period: '/mo', features: ['Unlimited capacity', 'All storage sources', 'Custom classifiers', 'GDPR/HIPAA/SOC2', 'File relationships', 'API access', 'Team management', 'Dedicated support'], cta: 'enterprise' },
            ].map((plan) => (
              <div key={plan.tier} style={{ padding: 32, borderRadius: 16, background: dark ? 'rgba(255,255,255,0.05)' : '#fff', border: plan.popular ? `2px solid ${accent}` : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>Most Popular</div>}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span><span style={{ opacity: 0.6 }}>{plan.period}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>{plan.features.map((f) => (<li key={f} style={{ padding: '6px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: accent, fontWeight: 700 }}>✓</span> {f}</li>))}</ul>
                <a href={`/checkout?service=drive-intelligence&tier=${plan.cta}`} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: plan.popular ? accent : 'transparent', color: plan.popular ? '#fff' : accent, border: plan.popular ? 'none' : `2px solid ${accent}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
              </div>
            ))}
          </div>
        </section>
        <section style={{ padding: '60px 20px 80px', maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          {faqs.map((faq) => (<details key={faq.question} style={{ marginBottom: 16, padding: 20, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}><summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>{faq.question}</summary><p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.6 }}>{faq.answer}</p></details>))}
        </section>
      </div>
    </>
  )
}
