'use client';

import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import Link from 'next/link';
import { useTheme } from '../../lib/theme-context';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '📋', title: 'Job Postings', desc: 'Create rich job listings with salary ranges, skills, benefits, and customizable application questions.' },
  { icon: '🔄', title: 'Pipeline Management', desc: 'Drag candidates through customizable hiring stages — from applied to screening to hired.' },
  { icon: '🤖', title: 'AI Resume Screening', desc: 'AI scores and summarizes every applicant against job requirements — surface top talent instantly.' },
  { icon: '🎯', title: 'Interview Scheduling', desc: 'Schedule phone screens, video calls, and onsite interviews with calendar integration.' },
  { icon: '📝', title: 'Scorecards', desc: 'Structured interview feedback with ratings, strengths, weaknesses, and hire/no-hire recommendations.' },
  { icon: '💰', title: 'Offer Management', desc: 'Create, send, and track offers with salary, equity, bonus, and benefits details.' },
  { icon: '🌐', title: 'Careers Page', desc: 'Public-facing careers page with company branding — candidates apply directly, no third-party forms.' },
  { icon: '👥', title: 'Talent Pools', desc: 'Save promising candidates to named pools for future openings — never lose a great candidate.' },
  { icon: '📊', title: 'Hiring Analytics', desc: 'Track time-to-hire, stage dropoff, source effectiveness, and pipeline conversion rates.' },
  { icon: '🏢', title: 'Multi-Department', desc: 'Organize jobs by department with dedicated hiring managers and recruiters per role.' },
  { icon: '📤', title: 'CSV/JSON Export', desc: 'Export your entire recruiting pipeline for reporting, compliance, or migration.' },
  { icon: '✨', title: 'AI Job Descriptions', desc: 'Generate professional job descriptions from just a title — complete with responsibilities and requirements.' },
];

const COMPARISON = [
  { feature: 'Job Postings', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'Pipeline Management', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'AI Resume Screening', echo: true, greenhouse: false, lever: false, workable: true },
  { feature: 'Interview Scorecards', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'Offer Management', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'Public Careers Page', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'AI Job Description Generator', echo: true, greenhouse: false, lever: false, workable: false },
  { feature: 'Talent Pools', echo: true, greenhouse: true, lever: true, workable: false },
  { feature: 'Multi-Company Support', echo: true, greenhouse: false, lever: false, workable: false },
  { feature: 'Hiring Analytics', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'No Per-Seat Pricing', echo: true, greenhouse: false, lever: false, workable: false },
  { feature: 'CSV/JSON Export', echo: true, greenhouse: true, lever: true, workable: true },
  { feature: 'Starting Price', echo: '$29/mo', greenhouse: '$6K/yr', lever: '$6K/yr', workable: '$149/mo' },
];

const TIERS = [
  { name: 'Starter', price: '$29', period: '/mo', desc: 'For small teams hiring 1-5 roles at a time.', features: ['Up to 5 open jobs', 'Unlimited candidates', 'Pipeline management', 'Public careers page', 'Interview scheduling', 'CSV export', 'Email support'] },
  { name: 'Growth', price: '$79', period: '/mo', desc: 'For growing teams with structured hiring processes.', features: ['Unlimited open jobs', 'AI resume screening', 'AI job description generator', 'Interview scorecards', 'Offer management', 'Talent pools', 'Hiring analytics', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$199', period: '/mo', desc: 'For companies scaling their hiring operations.', features: ['Everything in Growth', 'Multi-company support', 'Multi-department', 'Custom pipeline stages', 'Pipeline insights AI', 'API access', 'Dedicated account manager', 'SLA guarantee'] },
];

const FAQS = [
  { q: 'How does AI resume screening work?', a: 'Our AI engine analyzes each candidate\'s resume, skills, and experience against the job requirements and provides a 0-100 match score plus a 2-sentence summary. This helps you quickly identify top candidates without manually reviewing every application.' },
  { q: 'Can candidates apply directly on my careers page?', a: 'Yes. Every company gets a public careers page at /careers/your-company-slug. Candidates can browse open jobs and submit applications with their resume, cover letter, and custom answers — no third-party forms needed.' },
  { q: 'Can I customize the hiring pipeline stages?', a: 'Absolutely. Each job can have its own pipeline stages. The default is Applied → Screening → Phone Screen → Interview → Technical → Offer → Hired, but you can customize this to match your exact process.' },
  { q: 'How does offer management work?', a: 'Create offers with salary, equity, bonus, start date, and benefits. Send them to candidates, then track acceptance or decline. When a candidate accepts, they\'re automatically moved to the "hired" stage.' },
  { q: 'Can I manage recruiting for multiple companies?', a: 'Yes. Enterprise plans support multi-company recruiting — perfect for staffing agencies, recruiting firms, and holding companies managing hiring across multiple entities.' },
  { q: 'How does this compare to Greenhouse or Lever?', a: 'Echo Recruiting provides the same core ATS features at a fraction of the cost — starting at $29/mo vs $6K+/year. Plus, we include AI resume screening and AI job description generation that competitors either don\'t offer or charge extra for.' },
];

export default function RecruitingPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Recruiting', href: '/recruiting' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="text-xl font-bold" style={{ color: 'var(--ept-accent)' }}>Echo Prime Tech</Link>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=recruiting&tier=growth" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          AI-Powered Applicant Tracking
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Hire Smarter,<br /><span className="gradient-text">Not Harder</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          AI-powered recruiting that screens resumes, manages pipelines, schedules interviews,
          and tracks offers — all at a fraction of what Greenhouse or Lever charge.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/checkout?service=recruiting&tier=growth" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            See Features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Hire Great People</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How We Compare</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Enterprise ATS features without the enterprise price tag.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="py-3 px-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
                <th className="py-3 px-4 font-semibold">Greenhouse</th>
                <th className="py-3 px-4 font-semibold">Lever</th>
                <th className="py-3 px-4 font-semibold">Workable</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center">{typeof row.echo === 'boolean' ? (row.echo ? '✅' : '❌') : <span className="font-bold" style={{ color: 'var(--ept-accent)' }}>{row.echo}</span>}</td>
                  <td className="py-3 px-4 text-center">{typeof row.greenhouse === 'boolean' ? (row.greenhouse ? '✅' : '❌') : row.greenhouse}</td>
                  <td className="py-3 px-4 text-center">{typeof row.lever === 'boolean' ? (row.lever ? '✅' : '❌') : row.lever}</td>
                  <td className="py-3 px-4 text-center">{typeof row.workable === 'boolean' ? (row.workable ? '✅' : '❌') : row.workable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>No per-seat fees. No annual contracts. No hidden costs.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <div key={i} className={`p-8 rounded-xl border ${t.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)' }}>
              {t.popular && <div className="text-xs font-bold uppercase mb-4 tracking-wider" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-2xl font-bold mb-1">{t.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold">{t.price}</span>
                <span style={{ color: 'var(--ept-text-muted)' }}>{t.period}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{t.desc}</p>
              <ul className="space-y-2 mb-8">
                {t.features.map((f, j) => (
                  <li key={j} className="text-sm flex items-start gap-2">
                    <span style={{ color: 'var(--ept-accent)' }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/checkout?service=recruiting&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">Ready to Transform Your Hiring?</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>
          Join teams saving thousands by hiring smarter with AI-powered recruiting.
        </p>
        <TrialCTA serviceId="echo-recruiting" tier="starter" productName="Echo Recruiting" />
      </section>
    </div>
  );
}
