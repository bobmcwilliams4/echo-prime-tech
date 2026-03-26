'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

/* ==============================================================================
   ECHO SHEPHERD AI — The Pastor's Autonomous Ministry Platform
   Product page: hero, features, personas, denominations, pricing, FAQ, CTA
   Backend: echo-shepherd-ai.bmcii1976.workers.dev (80+ endpoints, 25 D1 tables, v2.0)
   ============================================================================== */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* --- SVG Icon Components --- */

function SermonIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ScriptureIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function CRMIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GivingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function VolunteerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CareIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function RecurringIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function CurriculumIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

const FEATURES = [
  { title: 'AI Sermon Builder', desc: 'Scripture-backed outlines with 9+ denomination awareness, illustration suggestions, and exegetical depth. From text selection to full manuscript in minutes.', Icon: SermonIcon },
  { title: 'Scripture Engine', desc: '66 books with cross-references, Hebrew/Greek lexicon, and AI commentary that respects your theological tradition. Search by topic, theme, or passage.', Icon: ScriptureIcon },
  { title: 'Congregation CRM', desc: 'Member profiles, family connections, attendance tracking, and encrypted pastoral care notes. Know your flock like a shepherd should.', Icon: CRMIcon },
  { title: 'Tithing & Donations', desc: 'Fund tracking, pledge management, giving reports, and tax receipt generation. Full financial transparency for your congregation.', Icon: GivingIcon },
  { title: 'Worship Planning', desc: '15K+ song library, CCLI license tracking, setlist builder with key/tempo management. Plan services weeks in advance.', Icon: MusicIcon },
  { title: 'Volunteer Management', desc: 'Scheduling, gap detection, background check tracking, and automated reminders. Never scramble for volunteers again.', Icon: VolunteerIcon },
  { title: 'Small Groups', desc: 'Group management, curriculum distribution, attendance tracking, and leader dashboards. Grow your community in circles.', Icon: GroupIcon },
  { title: 'Church Calendar', desc: 'Events, RSVPs, recurring services, facility booking, and conflict detection. One calendar for the entire church.', Icon: CalendarIcon },
  { title: 'Pastoral Care', desc: 'Counseling notes, hospital visit tracking, prayer request management, and follow-up reminders. Encrypted and confidential.', Icon: CareIcon },
  { title: 'Church Analytics', desc: 'Growth trends, giving patterns, attendance metrics, and retention analysis. Data-driven decisions for kingdom impact.', Icon: AnalyticsIcon },
  { title: 'Online Giving Portal', desc: 'Recurring donations, text-to-give, fundraising campaigns with progress tracking, and year-end tax statements. Digital tithing made simple.', Icon: RecurringIcon },
  { title: 'Curriculum & Studies', desc: 'AI-generated study guides, multi-week Bible study curricula, group progress tracking, and discussion question builders. Feed your flock with depth.', Icon: CurriculumIcon },
  { title: 'Communications Hub', desc: 'Church announcements, scheduled newsletters, prayer request management, and targeted group messaging. Keep your congregation connected.', Icon: MegaphoneIcon },
  { title: 'Media Library', desc: 'Sermon recordings, podcast feed generation, daily devotionals with AI assistance, and video archive with view analytics. Your church content, organized.', Icon: MediaIcon },
];

const PERSONAS = [
  { title: 'Solo Pastors', size: '50-200 members', desc: 'You wear 15 hats. Shepherd AI wears 14 of them. Sermon prep, member care, finances, and events -- all automated so you can focus on shepherding.' },
  { title: 'Senior Pastors', size: '200-1,000 members', desc: 'Analytics dashboards, staff coordination tools, and delegation workflows. See your church health at a glance and lead with clarity.' },
  { title: 'Lead Pastors', size: '1,000+ members', desc: 'Multi-campus management, executive dashboards, volunteer armies, and API integrations. Enterprise-grade tools for kingdom-scale impact.' },
  { title: 'Youth Pastors', size: 'All sizes', desc: 'Curriculum management, event planning, parent communication portals, and attendance tracking built for the unique rhythm of youth ministry.' },
  { title: 'Worship Leaders', size: 'All sizes', desc: 'Song library with CCLI tracking, setlist builder, team scheduling, and key/tempo management. Plan worship that flows.' },
  { title: 'Church Administrators', size: 'All sizes', desc: 'Financial reporting, facility management, compliance tracking, and donor relations. The back office that keeps the church running.' },
];

const DENOMINATIONS = [
  'Baptist', 'Reformed', 'Catholic', 'Pentecostal', 'Orthodox',
  'Lutheran', 'Anglican', 'Wesleyan', 'Non-denominational',
];

const PRICING = [
  {
    name: 'Shepherd',
    price: '$49',
    period: '/mo',
    desc: 'For solo pastors and small churches getting started with AI ministry tools.',
    popular: false,
    features: ['1 campus', 'Up to 200 members', 'AI Sermon Builder', 'Basic Congregation CRM', 'Scripture Engine', 'Church Calendar', 'Prayer requests', 'Email support'],
    href: '/checkout?service=shepherd&tier=shepherd',
    cta: 'Start Free Trial',
  },
  {
    name: 'Flock',
    price: '$149',
    period: '/mo',
    desc: 'Full-featured ministry platform for growing churches.',
    popular: true,
    features: ['1 campus', 'Up to 500 members', 'Everything in Shepherd', 'Full CRM with family links', 'Worship planning + CCLI', 'Online giving + recurring donations', 'Small groups + curriculum', 'Communications hub', 'Priority support'],
    href: '/checkout?service=shepherd&tier=flock',
    cta: 'Get Flock Plan',
  },
  {
    name: 'Congregation',
    price: '$349',
    period: '/mo',
    desc: 'Multi-campus tools with analytics and volunteer coordination.',
    popular: false,
    features: ['Up to 3 campuses', 'Up to 2,000 members', 'Everything in Flock', 'Volunteer management', 'Church analytics dashboard', 'Media library + podcast feed', 'AI devotional generator', 'Giving campaigns + tax statements', 'Dedicated account manager'],
    href: '/checkout?service=shepherd&tier=congregation',
    cta: 'Start Free Trial',
  },
  {
    name: 'Cathedral',
    price: '$799',
    period: '/mo',
    desc: 'Enterprise ministry platform for mega-churches and networks.',
    popular: false,
    features: ['Unlimited campuses', 'Unlimited members', 'Everything in Congregation', 'White-label branding', 'Full API access', 'Text-to-give SMS', 'Custom integrations', 'Priority phone support', 'Dedicated success manager'],
    href: 'mailto:bob@echo-op.com?subject=Cathedral%20Plan%20Inquiry',
    cta: 'Contact Sales',
  },
];

const FAQ = [
  {
    q: 'Does the AI Sermon Builder replace my preparation?',
    a: 'Not at all. Shepherd AI gives you a strong exegetical foundation, cross-references, and illustration ideas -- but the final word is always yours. Think of it as a tireless research assistant that knows your denomination\'s theology.',
  },
  {
    q: 'Is our congregation data secure?',
    a: 'Absolutely. All pastoral care notes and sensitive data are encrypted at rest. We use Cloudflare\'s global edge network with SOC 2 compliant infrastructure. Your data is never used for AI training.',
  },
  {
    q: 'Can I import data from our current church management system?',
    a: 'Yes. We support imports from Planning Center, Church Community Builder, Breeze, and CSV/Excel files. Our onboarding team handles the migration at no extra cost for Flock plans and above.',
  },
  {
    q: 'How does denomination awareness work?',
    a: 'When you set up your church profile, you select your tradition. The AI adapts its sermon suggestions, commentary lens, and theological vocabulary to align with your denomination\'s distinctives. You can fine-tune this at any time.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every plan includes a 14-day free trial with full feature access. No credit card required to start. If you love it, upgrade seamlessly. If not, your data exports cleanly.',
  },
  {
    q: 'How does the online giving portal work?',
    a: 'Members can set up recurring donations (weekly, bi-weekly, monthly, quarterly), donate to specific fundraising campaigns, or even give via text message. Year-end tax statements are auto-generated for each member with a full fund-by-fund breakdown.',
  },
  {
    q: 'Can the AI generate Bible study curriculum?',
    a: 'Yes. Provide a scripture passage or topic, select your audience and denomination, and Shepherd AI generates a multi-week study guide with discussion questions, application challenges, and prayer focuses. Assign curricula directly to small groups and track lesson progress.',
  },
  {
    q: 'Does Shepherd AI support sermon video archiving?',
    a: 'The media library stores sermon recordings (video, audio, or podcast format), links them to their corresponding sermon entries, tracks view counts, and can generate a podcast-style RSS feed for your church\'s content.',
  },
];

export default function ShepherdPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useInView(0.1);
  const featRef = useInView(0.1);
  const personaRef = useInView(0.1);
  const pricingRef = useInView(0.1);

  return (
    <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)', minHeight: '100vh' }}>

      {/* ── Nav Bar ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Tech" width={120} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </Link>
          <span className="text-sm font-mono" style={{ color: 'var(--ept-text-muted)' }}>/shepherd</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden sm:inline text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/checkout?service=shepherd&tier=shepherd" className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section ref={heroRef.ref} className="px-6 py-20 md:py-28 text-center max-w-4xl mx-auto">
        <div className={`transition-all duration-700 ${heroRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--ept-accent)' }}>
            The Pastor&apos;s Autonomous Ministry Platform
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Echo Shepherd AI</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
            Every tool a pastor needs. None of the complexity they don&apos;t.
          </p>
          <p className="text-sm max-w-xl mx-auto mb-10" style={{ color: 'var(--ept-text-muted)' }}>
            AI-powered sermon builder, congregation CRM, tithing management, worship planning, volunteer coordination, and church analytics -- all in one platform built for ministry.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/checkout?service=shepherd&tier=shepherd" className="px-8 py-3 rounded-xl font-semibold text-base" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
              Start Free Trial
            </Link>
            <a href="#features" className="px-8 py-3 rounded-xl border font-semibold text-base" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              See Features
            </a>
          </div>
          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '80+', label: 'API Endpoints' },
              { value: '21+', label: 'Denominations' },
              { value: '15K+', label: 'Worship Songs' },
              { value: '25', label: 'Database Tables' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" ref={featRef.ref} className="px-6 py-16 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${featRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Everything Your Church Needs
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            14 integrated modules purpose-built for ministry. No duct-taping five different platforms together.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <div className="mb-4" style={{ color: 'var(--ept-accent)' }}>
                  <f.Icon />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section ref={personaRef.ref} className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${personaRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Built for Every Role in Ministry
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            Whether you lead a congregation of 50 or 5,000, Shepherd AI adapts to your role.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAS.map((p) => (
              <div key={p.title} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{p.title}</h3>
                <p className="text-xs font-mono mb-3" style={{ color: 'var(--ept-accent)' }}>{p.size}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Denomination Support ── */}
      <section className="px-6 py-14 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>
          Respects Your Tradition
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Shepherd AI adapts its theology, sermon style, and commentary to your denomination. Set it once; it remembers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {DENOMINATIONS.map((d) => (
            <span key={d} className="px-4 py-2 rounded-full text-sm font-medium border" style={{ borderColor: 'var(--ept-card-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'var(--ept-card-bg)' }}>
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" ref={pricingRef.ref} className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${pricingRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            Simple, Honest Pricing
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
            No hidden fees. No per-member surcharges. 14-day free trial on every plan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING.map((tier) => (
              <div key={tier.name} className="p-6 rounded-xl border flex flex-col relative" style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                borderWidth: tier.popular ? 2 : 1,
              }}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{tier.price}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{tier.period}</span>
                </div>
                <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>{tier.desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ept-accent)' }} />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.href.startsWith('mailto') ? (
                  <a href={tier.href} className="block text-center px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                    {tier.cta}
                  </a>
                ) : (
                  <Link href={tier.href} className="block text-center px-6 py-3 rounded-xl font-semibold" style={{
                    backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                    color: tier.popular ? '#fff' : 'var(--ept-text-secondary)',
                    border: tier.popular ? 'none' : '1px solid var(--ept-border)',
                  }}>
                    {tier.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Testimonial Section ── */}
      <section className="px-6 py-16 text-center max-w-3xl mx-auto">
        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4" style={{ color: 'var(--ept-accent)' }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <blockquote className="text-lg md:text-xl italic leading-relaxed mb-4" style={{ color: 'var(--ept-text)' }}>
            &ldquo;Built by a believer, for believers. Every line of code in Shepherd AI was written with the conviction that technology should serve the Church -- not replace the pastor, but multiply their impact.&rdquo;
          </blockquote>
          <p className="text-sm font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>
            Echo Prime Technologies
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Midland, Texas
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-sm"
                style={{ color: 'var(--ept-text)' }}
              >
                {item.q}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Ready to Shepherd Smarter?
        </h2>
        <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          14-day free trial. No credit card required. Set up your church in under 5 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/checkout?service=shepherd&tier=shepherd" className="px-8 py-3 rounded-xl font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Start Free Trial
          </Link>
          <a href="mailto:bob@echo-op.com?subject=Shepherd%20AI%20Demo%20Request" className="px-8 py-3 rounded-xl border font-semibold" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Request a Demo
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Echo Shepherd AI is a product of Echo Prime Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
