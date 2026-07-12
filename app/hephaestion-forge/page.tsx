'use client';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import FaqSchema from '../../components/FaqSchema';

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'Pricing', href: '/pricing' },
];

const FEATURES = [
  { icon: '⚙️', title: 'Full-Stack App Generation', desc: 'Generate complete applications — frontend, backend, database, and infra — from a single prompt.' },
  { icon: '🔌', title: 'API Design & Scaffolding', desc: 'Architect RESTful and GraphQL APIs with auto-generated OpenAPI specs and type-safe client SDKs.' },
  { icon: '🗄️', title: 'Database Schema Design', desc: 'Optimized schema generation with indexes, relations, and migration scripts for any database engine.' },
  { icon: '🧪', title: 'Test Suite Generation', desc: 'Unit, integration, and e2e test coverage auto-generated at 80%+ from your codebase structure.' },
  { icon: '🚀', title: 'CI/CD Pipeline Setup', desc: 'GitHub Actions, Dockerfile, and deployment configs scaffolded for every project automatically.' },
  { icon: '🔍', title: 'Code Review AI', desc: '13-stage pipeline reviews every output for correctness, performance, and best-practice adherence.' },
  { icon: '🔒', title: 'Security Audit Automation', desc: 'OWASP top-10 scanning, dependency audit, and secrets detection baked into every build.' },
  { icon: '📄', title: 'Documentation Generator', desc: 'Auto-generated README, API docs, and inline JSDoc/TSDoc from your code structure and intent.' },
  { icon: '🏗️', title: 'Microservice Architecture', desc: 'Decompose monoliths or scaffold microservices with service mesh, contracts, and event schemas.' },
  { icon: '📊', title: 'Performance Profiling', desc: 'Static performance analysis flags bottlenecks before you ship — not after users complain.' },
];

const COMPARISON = [
  { feature: 'Full-stack generation', heph: true, copilot: false, cursor: false, replit: false },
  { feature: '13-stage quality pipeline', heph: true, copilot: false, cursor: false, replit: false },
  { feature: '6 quality gates', heph: true, copilot: false, cursor: false, replit: false },
  { feature: 'Security audit built-in', heph: true, copilot: false, cursor: false, replit: true },
  { feature: 'Database schema + migrations', heph: true, copilot: false, cursor: false, replit: false },
  { feature: 'CI/CD pipeline scaffolding', heph: true, copilot: false, cursor: false, replit: true },
  { feature: 'Test suite auto-generation', heph: true, copilot: true, cursor: false, replit: false },
  { feature: '8 design patterns', heph: true, copilot: false, cursor: false, replit: false },
  { feature: '15 project types', heph: true, copilot: false, cursor: false, replit: true },
  { feature: 'Microservice decomposition', heph: true, copilot: false, cursor: false, replit: false },
];

const PRICING = [
  {
    tier: 'Starter',
    price: '$99',
    period: '/mo',
    popular: false,
    features: ['50 build credits/mo (~10–25 builds)', 'All 5 languages (Python, TypeScript, JavaScript, Rust, Go)', '3 archetypes', 'Quality gates: lint + security scan + code review', 'Download full repo', 'Community support'],
    cta: 'Start Building',
  },
  {
    tier: 'Pro',
    price: '$299',
    period: '/mo',
    popular: true,
    features: ['250 build credits/mo (~50–150 builds)', 'All 6 project types + all 8 design patterns', 'Priority pipeline', 'GitHub push', 'API access', '13-stage pipeline', 'Priority support'],
    cta: 'Start Free Trial',
  },
  {
    tier: 'Enterprise',
    price: 'Contact',
    period: '',
    popular: false,
    features: ['Unlimited builds', 'Private forge deployment', 'Custom archetypes', 'On-prem option', 'SLA 99.9%', 'Dedicated engineer'],
    cta: 'Contact Sales',
  },
];

const FAQS = [
  {
    q: 'What types of projects can Hephaestion Forge build?',
    a: 'Hephaestion supports 15 project types including SaaS apps, REST APIs, microservices, CLI tools, data pipelines, mobile backends, admin dashboards, e-commerce platforms, Discord/Slack bots, and browser extensions. If it runs on a server or in a browser, Forge can scaffold it.',
  },
  {
    q: 'What programming languages are supported?',
    a: 'Forge currently supports TypeScript/JavaScript, Python, Go, Rust, and Java. Each language has tailored templates, idiomatic patterns, and framework-specific scaffolding (Next.js, FastAPI, Gin, Axum, Spring Boot).',
  },
  {
    q: 'Do I own the code Hephaestion generates?',
    a: 'Yes, 100%. All generated code is yours to use, modify, and deploy without restriction. No royalties, no attribution requirements, no vendor lock-in. You own every line.',
  },
  {
    q: 'How does the 13-stage pipeline ensure quality?',
    a: 'Every build passes through intent analysis, architecture selection, scaffold generation, dependency resolution, code synthesis, static analysis, security scan, test generation, documentation, CI/CD config, peer review simulation, and two final quality gate checks before output. Builds that fail any gate are auto-revised.',
  },
  {
    q: 'Can Forge integrate with my existing codebase?',
    a: 'Yes. Provide your existing repo and Forge performs a codebase analysis pass before generating new components. It matches your existing conventions, naming patterns, and dependency versions rather than generating from a blank slate.',
  },
  {
    q: 'What are the 8 design patterns available?',
    a: 'Forge supports: Clean Architecture, Hexagonal (Ports & Adapters), Domain-Driven Design (DDD), CQRS + Event Sourcing, Layered MVC, Serverless Edge-First, Microkernel Plugin Architecture, and Repository/Service pattern. Each produces structurally distinct and idiomatic scaffolding.',
  },
];

export default function HephaestionForgePage() {
  const { isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Hephaestion Forge', href: '/hephaestion-forge' }]} />
      <FaqSchema faqs={FAQS} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Tech" width={140} height={36}
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors"
              style={{ color: 'var(--ept-text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ color: 'var(--ept-text-secondary)' }}>Sign In</Link>
          <Link href="/checkout?service=hephaestion-forge&tier=starter" className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)', backgroundColor: 'var(--ept-surface)' }}>
          v2.1.0 — hephaestion-forge.bmcii1976.workers.dev
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="gradient-text">Hephaestion Forge</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>AI Software Factory</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Describe an application. Get production-ready code — tested, documented, and secured —
          through a 13-stage AI pipeline with 6 quality gates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=hephaestion-forge&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-white text-center"
            style={{ backgroundColor: 'var(--ept-accent)' }}>
            Start Building Free
          </Link>
          <Link href="#features" className="px-8 py-3 rounded-xl font-semibold text-center border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            See All Features
          </Link>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { val: '13', label: 'Pipeline Stages' },
            { val: '6', label: 'Quality Gates' },
            { val: '15', label: 'Project Types' },
            { val: '5', label: 'Languages' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-3xl font-extrabold gradient-text">{stat.val}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Everything a software factory needs
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
          Not just autocomplete. A complete software development lifecycle, automated end-to-end.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover"
              style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
            How Forge compares
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>
            Copilot writes lines. Cursor rewrites lines. Forge ships entire products.
          </p>
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--ept-card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ept-card-bg)', borderBottom: '1px solid var(--ept-card-border)' }}>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-accent)' }}>Hephaestion</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>Copilot</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>Cursor</th>
                  <th className="p-4 font-semibold text-center" style={{ color: 'var(--ept-text-muted)' }}>Replit AI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature}
                    style={{ backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)', borderBottom: '1px solid var(--ept-card-border)' }}>
                    <td className="p-4" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                    <td className="p-4 text-center">{row.heph ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.copilot ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.cursor ? '✅' : '❌'}</td>
                    <td className="p-4 text-center">{row.replit ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>
          Pricing that scales with your team
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
          Priced per deliverable — a build is a scaffolded, tested, security-scanned repo you own outright.
          Metered in build credits: a simple CLI scaffold costs 1–2 credits, a full CQRS microservice 5–8.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRICING.map(plan => (
            <div key={plan.tier}
              className="p-6 rounded-xl border flex flex-col"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                boxShadow: plan.popular ? '0 0 0 2px var(--ept-accent)' : undefined,
              }}>
              {plan.popular && (
                <div className="text-xs font-bold px-3 py-1 rounded-full mb-4 self-start"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.tier}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <span style={{ color: 'var(--ept-accent)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.tier === 'Enterprise' ? '/support' : `/checkout?service=hephaestion-forge&tier=${plan.tier.toLowerCase()}`}
                className="w-full py-2.5 rounded-lg font-semibold text-center text-sm block"
                style={{
                  backgroundColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-surface)',
                  color: plan.popular ? '#fff' : 'var(--ept-text)',
                  border: plan.popular ? 'none' : '1px solid var(--ept-border)',
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--ept-text)' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border overflow-hidden"
                style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-sm"
                  style={{ color: 'var(--ept-text)' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span style={{ color: 'var(--ept-accent)', fontSize: '1.2rem', lineHeight: 1 }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Ready to ship your next product <span className="gradient-text">10x faster?</span>
        </h2>
        <p className="mb-8 text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
          Join teams using Hephaestion Forge to go from idea to deployed application in hours, not weeks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout?service=hephaestion-forge&tier=starter" className="px-8 py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: 'var(--ept-accent)' }}>
            Start Building Free
          </Link>
          <Link href="/support" className="px-8 py-3 rounded-xl font-semibold border"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm"
        style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>© {new Date().getFullYear()} Echo Prime Tech. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/support" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
        </div>
      </footer>

    </div>
  );
}
