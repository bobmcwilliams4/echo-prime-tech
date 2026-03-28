'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';

/*  ===================================================================
    Tool Discovery — AI-Powered MCP Tool Search & Integration
    Backend: echo-tool-discovery.bmcii1976.workers.dev
    =================================================================== */

const FEATURES = [
  { title: '37,475+ Tools Indexed', desc: 'The largest MCP tool catalog in existence. Search across 1,873 servers with instant full-text search.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Semantic Search', desc: 'Natural language search that understands intent. Ask "send a message to Slack" and find the right tool instantly.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { title: 'Tool Categories', desc: 'Browse tools by category — APIs, databases, file systems, AI/ML, communication, DevOps, security, and more.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'One-Click Integration', desc: 'Add any discovered tool to your MCP configuration with a single click. Auto-generates the mcp.json entry.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Tool Ratings', desc: 'Community ratings and reviews for every tool. See reliability scores, response times, and real user feedback.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { title: 'Server Health Monitoring', desc: 'Real-time health checks on all indexed MCP servers. Know which tools are up before you depend on them.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { title: 'Tool Comparison', desc: 'Side-by-side comparison of similar tools. Compare parameters, response formats, rate limits, and pricing.', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
  { title: 'Auto-Discovery', desc: 'Automatically discover new MCP servers from GitHub, npm, and community registries. Daily crawl with deduplication.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { title: 'Usage Analytics', desc: 'Track which tools your AI agents use most, success rates, latency percentiles, and cost per tool call.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Private Registry', desc: 'Host your own private MCP tool registry for internal tools. Access control, versioning, and audit trail.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Compatibility Matrix', desc: 'See which tools work with Claude, GPT, Gemini, and other AI platforms. Filter by model compatibility.', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { title: 'REST API', desc: 'Full API for programmatic tool discovery, search, and integration management. Build custom tool marketplaces.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
];

const PRICING = [
  { tier: 'Free', price: 0, features: ['Full search access', 'Tool categories', 'Community ratings', 'Basic analytics', 'Public registry', '100 API calls/day'], cta: 'Get Started', href: '/checkout?service=tool-discovery&tier=free', popular: false },
  { tier: 'Developer', price: 29, features: ['Everything in Free', 'Semantic search', 'One-click integration', 'Health monitoring', 'Usage analytics', 'Private registry (50 tools)', '10,000 API calls/day'], cta: 'Start Free Trial', href: '/checkout?service=tool-discovery&tier=developer', popular: true },
  { tier: 'Enterprise', price: 149, features: ['Everything in Developer', 'Auto-discovery', 'Tool comparison', 'Compatibility matrix', 'Unlimited private tools', 'Unlimited API calls', 'Priority support', 'Custom integrations'], cta: 'Contact Sales', href: '/checkout?service=tool-discovery&tier=enterprise', popular: false },
];

const FAQS = [
  { q: 'What is an MCP tool?', a: 'MCP (Model Context Protocol) tools are standardized interfaces that let AI models interact with external services — databases, APIs, file systems, and more. Think of them as plugins for AI agents.' },
  { q: 'How are the 37,475 tools indexed?', a: 'We crawl GitHub, npm, PyPI, and community MCP registries daily. Each tool is validated, categorized, and tested for basic functionality before being added to our index.' },
  { q: 'Can I add my own tools to the index?', a: 'Yes. Submit any MCP-compatible tool for public listing, or use the private registry to host internal-only tools. All submissions go through automated quality checks.' },
  { q: 'How does semantic search work?', a: 'We use embedding models to understand the intent behind your search query. Instead of keyword matching, you can describe what you need in natural language and we\'ll find the right tool.' },
  { q: 'Is there a way to test tools before integrating?', a: 'Each tool listing includes a "Try it" sandbox where you can test the tool with sample inputs and see the response format before adding it to your agent.' },
  { q: 'Does this work with Claude Code?', a: 'Yes. Tool Discovery integrates directly with Claude Code\'s MCP configuration. One-click adds the selected tool to your .mcp.json file.' },
];

export default function ToolDiscoveryPage() {
  const { isDark } = useTheme();

  return (
    <main className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Tool Discovery', href: '/tool-discovery' }]} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={32} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Sign In</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.1)', color: 'var(--ept-accent)' }}>
          37,475+ Tools &middot; 1,873 Servers &middot; One Search
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">Tool Discovery</span>
          <br />
          <span style={{ color: 'var(--ept-text)' }}>Find Any AI Tool Instantly</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ept-text-secondary)' }}>
          The world&apos;s largest MCP tool catalog. Search 37,475+ tools across 1,873 servers. Find, compare, and integrate AI tools in seconds.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/checkout?service=tool-discovery&tier=developer" className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Free Trial</Link>
          <a href="#features" className="px-8 py-4 rounded-xl font-semibold text-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Explore Tools</a>
        </div>
        <div className="flex justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text)' }}>37,475</strong> Tools</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>1,873</strong> Servers</span>
          <span><strong style={{ color: 'var(--ept-text)' }}>&lt;50ms</strong> Search</span>
        </div>
      </section>

      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>The AI Tool Marketplace</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(p => (
            <div key={p.tier} className={`p-8 rounded-xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
              {p.popular && <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{p.tier}</h3>
              <div className="mb-6"><span className="text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>${p.price}</span><span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span style={{ color: 'var(--ept-text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="block text-center py-3 rounded-xl font-semibold" style={{ backgroundColor: p.popular ? 'var(--ept-accent)' : 'transparent', color: p.popular ? '#fff' : 'var(--ept-accent)', border: p.popular ? 'none' : '1px solid var(--ept-border)' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

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

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Find the Perfect Tool for Any Task</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Stop building custom integrations. Search 37,475+ MCP tools and connect in one click.</p>
        <Link href="/checkout?service=tool-discovery&tier=developer" className="px-8 py-4 rounded-xl font-semibold text-lg inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Start Discovering</Link>
      </section>
    </main>
  );
}
