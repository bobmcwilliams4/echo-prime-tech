'use client';
import FaqSchema from '../../components/FaqSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import TrialCTA from '@/components/TrialCTA';

const FEATURES = [
  { icon: '🎓', title: 'Course Builder', desc: 'Drag-and-drop course creation with modules, lessons, and multimedia content' },
  { icon: '📝', title: 'AI Quiz Generator', desc: 'Auto-generate quizzes from lesson content with configurable difficulty levels' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Real-time student progress dashboards with completion rates and time spent' },
  { icon: '🏆', title: 'Certificates', desc: 'Auto-issue branded certificates with unique verification codes on completion' },
  { icon: '🤖', title: 'AI Course Outlines', desc: 'Generate full course structures from a topic — modules, lessons, and objectives' },
  { icon: '💬', title: 'Discussion Forums', desc: 'Threaded course discussions with pinning, replies, and lesson-level threads' },
  { icon: '🎥', title: 'Video Lessons', desc: 'Embed video content with duration tracking and free preview support' },
  { icon: '⭐', title: 'Reviews & Ratings', desc: 'Student reviews with automatic course rating calculation' },
  { icon: '📈', title: 'Analytics Dashboard', desc: 'Enrollment trends, popular courses, student activity, and revenue tracking' },
  { icon: '👨‍🏫', title: 'Instructor Profiles', desc: 'Instructor bios, expertise tags, course counts, and ratings' },
  { icon: '🔗', title: 'API-First', desc: 'Full REST API for headless LMS — embed courses in any app or website' },
  { icon: '🏢', title: 'Multi-Tenant', desc: 'Isolated tenants with custom branding, course limits, and student caps' },
];

const COMPARE = [
  ['Feature', 'Echo LMS', 'Teachable', 'Thinkific'],
  ['AI Course Generation', 'Yes', 'No', 'No'],
  ['AI Quiz Generator', 'Yes', 'No', 'No'],
  ['Auto Certificates', 'Yes', 'Pro plan', 'Pro plan'],
  ['API Access', 'All plans', 'Business+', 'Pro+'],
  ['Multi-Tenant', 'Yes', 'No', 'No'],
  ['Custom Branding', 'All plans', 'Pro plan', 'Pro plan'],
  ['Discussion Forums', 'Yes', 'Yes', 'Yes'],
  ['Video Hosting', 'BYO URL', 'Built-in', 'Built-in'],
  ['Quiz Scoring', 'Auto', 'Basic', 'Basic'],
  ['Progress Analytics', 'Yes', 'Pro plan', 'Pro plan'],
  ['Transaction Fees', '0%', '5% on free', '0%'],
  ['Starting Price', '$19/mo', '$59/mo', '$49/mo'],
];

const TIERS = [
  { name: 'Starter', price: '$19', per: '/mo', features: ['5 courses', '50 students', 'AI quiz generation', 'Certificates', 'Discussion forums', 'Basic analytics'] },
  { name: 'Pro', price: '$49', per: '/mo', features: ['25 courses', '500 students', 'AI course outlines', 'Custom branding', 'Full analytics', 'Priority support'], popular: true },
  { name: 'Academy', price: '$129', per: '/mo', features: ['Unlimited courses', 'Unlimited students', 'Multi-tenant', 'White-label', 'API access', 'Dedicated support'] },
];

const FAQS = [
  { q: 'Can I create courses with AI?', a: 'Yes. Provide a topic and Echo LMS generates a complete course outline with modules, lessons, objectives, and suggested content. You can edit and customize the generated structure before publishing.' },
  { q: 'How does the AI quiz generator work?', a: 'Select a lesson and the AI analyzes its content to generate multiple-choice, true/false, and short-answer questions at configurable difficulty levels. Questions are unique each time and test actual comprehension of the material.' },
  { q: 'Can students earn certificates?', a: 'Yes, on all plans. When a student completes a course, they automatically receive a branded certificate with a unique verification code. Anyone can verify certificate authenticity via the verification endpoint.' },
  { q: 'Is there an API for headless LMS?', a: 'Yes. Echo LMS is API-first with full REST endpoints for courses, enrollments, progress, quizzes, certificates, and analytics. Embed courses in any app, website, or mobile application without using our UI at all.' },
  { q: 'How does multi-tenancy work?', a: 'Each tenant gets isolated data with custom branding, course limits, and student caps. Perfect for agencies, franchises, or companies offering training to multiple client organizations from a single account.' },
  { q: 'Can I host video lessons?', a: 'Yes. Embed video content with automatic duration tracking and support for free preview lessons. The system tracks watch progress and completion status per student.' },
];

export default function LMSPage() {
  const { isDark } = useTheme();
  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/engines' }, { name: 'LMS', href: '/lms' }]} />
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Echo <span className="gradient-text">LMS</span></h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up-delay-1" style={{ color: 'var(--ept-text-secondary)' }}>AI-powered learning management. Build courses in minutes, not months.</p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-2">
          <Link href="/checkout?service=lms&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <Link href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Features</Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Everything You Need to Teach Online</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: 'var(--ept-surface)' }}>
              {COMPARE[0].map((h, i) => <th key={i} className="px-4 py-3 text-left font-bold" style={{ color: 'var(--ept-text)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {COMPARE.slice(1).map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--ept-border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3" style={{ color: ci === 1 && cell === 'Yes' ? 'var(--ept-accent)' : 'var(--ept-text-secondary)', fontWeight: ci === 1 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className="p-6 rounded-xl border relative" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: t.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: t.popular ? 2 : 1 }}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{t.name}</h3>
              <div className="mb-4"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{t.price}</span><span style={{ color: 'var(--ept-text-muted)' }}>{t.per}</span></div>
              <ul className="space-y-2 mb-6">{t.features.map((f) => <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--ept-text-secondary)' }}><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span>{f}</li>)}</ul>
              <Link href={`/checkout?service=lms&tier=${t.name.toLowerCase()}`} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: t.popular ? 'var(--ept-accent)' : 'transparent', color: t.popular ? '#fff' : 'var(--ept-accent)', border: t.popular ? 'none' : '1px solid var(--ept-border)' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
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

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: 'var(--ept-text)' }}>Start Teaching Online Today</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--ept-text-secondary)' }}>Build AI-powered courses in minutes, not months. Free trial, no credit card required.</p>
        <TrialCTA serviceId="echo-lms" tier="starter" productName="Echo LMS" />
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>&copy; 2026 Echo Prime Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
