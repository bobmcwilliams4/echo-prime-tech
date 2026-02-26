'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  getHealth,
  getStats,
  type HealthResponse,
  type ForgeStats,
} from '../../lib/hephaestion-forge-api';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '⚡' },
  { id: 'archetypes', label: 'Archetypes', icon: '◎' },
  { id: 'pipeline', label: 'Pipeline', icon: '▸▸' },
  { id: 'quality', label: 'Quality Gates', icon: '✦' },
  { id: 'languages', label: 'Languages', icon: '⟨⟩' },
  { id: 'swarm', label: 'LLM Swarm', icon: '⬡' },
  { id: 'api', label: 'API Reference', icon: '⟨/⟩' },
] as const;

const ARCHETYPES = [
  { id: 'web_app', name: 'Web Application', stack: ['Next.js', 'React', 'Tailwind', 'PostgreSQL'], desc: 'Full-stack web application with auth, dashboard, API routes, and database. SSR/SSG, responsive design, SEO optimized.' },
  { id: 'api_service', name: 'API Service', stack: ['FastAPI', 'Hono', 'Express', 'GraphQL'], desc: 'RESTful or GraphQL API with OpenAPI docs, rate limiting, auth middleware, health checks, and structured logging.' },
  { id: 'cli_tool', name: 'CLI Tool', stack: ['Click', 'Commander.js', 'Clap'], desc: 'Command-line application with argument parsing, colored output, progress bars, configuration management, and shell completion.' },
  { id: 'worker', name: 'Cloudflare Worker', stack: ['Hono', 'KV', 'D1', 'R2'], desc: 'Edge-deployed serverless worker with KV storage, D1 database, R2 objects, cron triggers, and Durable Objects.' },
  { id: 'desktop_app', name: 'Desktop Application', stack: ['Electron', 'Tauri', 'Qt'], desc: 'Cross-platform desktop application with native menus, system tray, auto-update, and local storage.' },
  { id: 'mobile_app', name: 'Mobile Application', stack: ['React Native', 'Flutter', 'Swift'], desc: 'iOS/Android mobile application with navigation, state management, push notifications, and offline support.' },
  { id: 'ml_pipeline', name: 'ML Pipeline', stack: ['PyTorch', 'HuggingFace', 'MLflow'], desc: 'Machine learning training/inference pipeline with data loading, model training, evaluation, and deployment.' },
  { id: 'game', name: 'Game', stack: ['Godot', 'Unity', 'Bevy'], desc: 'Game project with game loop, physics, rendering, input handling, asset management, and multiplayer networking.' },
  { id: 'library', name: 'Library / Package', stack: ['npm', 'PyPI', 'crates.io'], desc: 'Reusable library with public API, documentation, examples, CI/CD, versioning, and package registry publishing.' },
  { id: 'microservice', name: 'Microservice', stack: ['Docker', 'gRPC', 'Kubernetes'], desc: 'Containerized microservice with health probes, graceful shutdown, distributed tracing, and service mesh integration.' },
  { id: 'data_pipeline', name: 'Data Pipeline', stack: ['Apache Beam', 'dbt', 'Airflow'], desc: 'ETL/ELT data pipeline with extraction, transformation, loading, scheduling, monitoring, and data quality checks.' },
  { id: 'browser_ext', name: 'Browser Extension', stack: ['Chrome', 'Firefox', 'Manifest V3'], desc: 'Browser extension with content scripts, background workers, popup UI, storage, and cross-browser compatibility.' },
  { id: 'smart_contract', name: 'Smart Contract', stack: ['Solidity', 'Rust/Anchor', 'Move'], desc: 'Blockchain smart contract with tests, gas optimization, security audit, deployment scripts, and frontend integration.' },
  { id: 'embedded', name: 'Embedded System', stack: ['Rust', 'C', 'MicroPython'], desc: 'Firmware for microcontrollers with HAL abstraction, peripheral drivers, RTOS tasks, and OTA update support.' },
  { id: 'ai_agent', name: 'AI Agent', stack: ['LangChain', 'CrewAI', 'AutoGen'], desc: 'Autonomous AI agent with tool use, memory, planning, multi-agent coordination, and human-in-the-loop.' },
];

const PIPELINE_STAGES = [
  { phase: 'ANALYSIS', stages: ['Requirements Parsing', 'Archetype Selection', 'Architecture Design'], color: '#3b82f6', desc: 'Understand what to build and how to structure it' },
  { phase: 'SCAFFOLDING', stages: ['Project Structure', 'Dependency Resolution', 'Configuration Setup'], color: '#8b5cf6', desc: 'Generate project skeleton with all config and deps' },
  { phase: 'GENERATION', stages: ['Core Logic', 'API Layer', 'Data Layer', 'UI Components'], color: '#f59e0b', desc: 'Write the actual application code across all layers' },
  { phase: 'QUALITY', stages: ['Lint & Format', 'Type Checking', 'Unit Tests', 'Integration Tests'], color: '#22c55e', desc: 'Validate code quality, types, and test coverage' },
  { phase: 'DELIVERY', stages: ['Documentation', 'Build Optimization', 'Deployment Config'], color: '#06b6d4', desc: 'Package for production with docs and CI/CD' },
];

const QUALITY_GATES = [
  { gate: 'Syntax Validation', desc: 'AST parsing to verify all generated code is syntactically valid. No broken imports, unclosed brackets, or invalid tokens.', threshold: '100% pass', icon: '⟨⟩' },
  { gate: 'Type Safety', desc: 'Full type checking (TypeScript tsc, Python mypy, Rust cargo check). Zero type errors. Generic types properly constrained.', threshold: '0 errors', icon: '◆' },
  { gate: 'Lint Compliance', desc: 'ESLint, Ruff, Clippy — zero warnings on strict ruleset. Consistent formatting via Prettier/Black/rustfmt.', threshold: '0 warnings', icon: '✓' },
  { gate: 'Test Coverage', desc: 'Minimum 80% line coverage. All public APIs tested. Edge cases covered. Mocks for external dependencies.', threshold: '≥80%', icon: '▣' },
  { gate: 'Security Scan', desc: 'Static analysis for injection, XSS, SSRF, path traversal, and hardcoded secrets. OWASP Top 10 compliance.', threshold: '0 critical', icon: '⛊' },
  { gate: 'Performance Budget', desc: 'Bundle size limits, startup time benchmarks, memory usage caps. Lighthouse scores for web projects (90+ all categories).', threshold: 'within budget', icon: '⚡' },
];

const LANGUAGES = [
  { name: 'TypeScript', frameworks: ['Next.js', 'Hono', 'Express', 'NestJS', 'Svelte', 'Astro'], icon: 'TS' },
  { name: 'Python', frameworks: ['FastAPI', 'Django', 'Flask', 'PyTorch', 'LangChain', 'Streamlit'], icon: 'PY' },
  { name: 'Rust', frameworks: ['Actix', 'Axum', 'Bevy', 'Tauri', 'Anchor', 'Embassy'], icon: 'RS' },
  { name: 'Go', frameworks: ['Gin', 'Echo', 'Fiber', 'Cobra', 'gRPC', 'Ent'], icon: 'GO' },
  { name: 'Solidity', frameworks: ['Hardhat', 'Foundry', 'OpenZeppelin'], icon: 'SOL' },
  { name: 'C/C++', frameworks: ['Qt', 'SDL', 'Arduino', 'ESP-IDF'], icon: 'C' },
  { name: 'Swift', frameworks: ['SwiftUI', 'UIKit', 'Vapor'], icon: 'SW' },
  { name: 'Kotlin', frameworks: ['Ktor', 'Compose', 'Spring Boot'], icon: 'KT' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/health', desc: 'Forge status, archetype count, pipeline stages' },
  { method: 'GET', path: '/stats', desc: 'Full forge capabilities and metrics' },
  { method: 'GET', path: '/archetypes', desc: 'All 15 project archetypes' },
  { method: 'GET', path: '/pipeline', desc: '13-stage build pipeline' },
  { method: 'GET', path: '/quality/gates', desc: '6 quality gate definitions' },
  { method: 'GET', path: '/templates', desc: 'Starter templates per archetype' },
  { method: 'GET', path: '/languages', desc: 'Supported languages and frameworks' },
  { method: 'POST', path: '/plan', desc: 'Generate project plan from description' },
  { method: 'POST', path: '/build', desc: 'Execute full build pipeline' },
  { method: 'POST', path: '/review', desc: 'Code review with issue detection' },
  { method: 'POST', path: '/chat', desc: 'Conversational code generation' },
];

export default function HephaestionForgePage() {
  const { isDark, toggle } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<ForgeStats | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => {});
    getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ept-bg)' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 260, borderRight: '1px solid var(--ept-border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'var(--ept-bg-alt)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={32} height={32} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ept-text)', letterSpacing: -0.3 }}>Echo Prime</span>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--ept-accent)', marginBottom: 12 }}>Hephaestion Forge</div>

        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 2, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
            background: activeSection === s.id ? 'var(--ept-accent-glow)' : 'transparent',
            color: activeSection === s.id ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
          }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{s.icon}</span>
            {s.label}
          </button>
        ))}

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--ept-border)', marginTop: 24 }}>
          <button onClick={toggle} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--ept-border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
            {isDark ? '☀ Day Mode' : '☾ Night Mode'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 1000 }}>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 40 }}>⚡</span>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ept-text)', letterSpacing: -0.8, margin: 0 }}>Hephaestion Forge</h1>
                <p style={{ color: 'var(--ept-accent)', fontSize: 14, fontWeight: 500, margin: 0 }}>AI Program Builder &amp; Code Forge</p>
              </div>
            </div>
            <div className="accent-line" style={{ margin: '16px 0 24px' }} />
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ept-text-secondary)', marginBottom: 24 }}>
              Conversational AI code forge running on Cloudflare&apos;s global edge. Describe what you want to build — Hephaestion plans the architecture, selects the right framework, generates production-ready code, and validates it through 6 quality gates. 15 project archetypes, 8 languages, 13-stage pipeline, and a multi-LLM swarm that picks the best model for each generation task.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 32 }}>
              {[
                { label: 'Archetypes', value: health?.archetypes || 15 },
                { label: 'Pipeline', value: `${health?.pipeline_stages || 13} stages` },
                { label: 'Gates', value: health?.quality_gates || 6 },
                { label: 'Languages', value: health?.languages || 8 },
                { label: 'Status', value: health?.status === 'operational' ? 'LIVE' : '...' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '18px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ept-accent)' }}>{c.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ept-text-secondary)', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 16 }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Describe Your Project', desc: 'Tell Hephaestion what you want to build in natural language. "Build a real-time chat app with rooms and file sharing." The forge analyzes requirements and selects the optimal archetype.' },
                { title: 'Architecture Planning', desc: 'Auto-generates project architecture — directory structure, module boundaries, data models, API contracts, and dependency graph. Review and refine before generation.' },
                { title: 'Code Generation', desc: 'Multi-LLM swarm generates code across all layers. Core logic, API routes, data access, UI components, tests, and configuration. Every file production-ready.' },
                { title: 'Quality Validation', desc: '6 quality gates validate every line — syntax, types, lint, tests, security, and performance. Only code that passes all gates ships. Zero-defect pipeline.' },
                { title: 'Conversational Refinement', desc: 'Chat with the forge to iterate. "Add WebSocket support." "Switch from PostgreSQL to SQLite." "Add rate limiting to the API." Incremental changes, full pipeline re-validation.' },
                { title: 'Production Delivery', desc: 'Optimized build output with documentation, CI/CD config, deployment scripts, and environment setup. Ready for GitHub → Vercel/Cloudflare → production.' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--ept-surface)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ARCHETYPES */}
        {activeSection === 'archetypes' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Project Archetypes</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>15 project templates covering every major software category. Each archetype defines optimal stack, architecture, and pipeline configuration.</p>

            <div style={{ display: 'grid', gap: 10 }}>
              {ARCHETYPES.map(a => (
                <div key={a.id} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ept-text)' }}>{a.name}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {a.stack.slice(0, 3).map(s => (
                        <span key={s} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--ept-accent-glow)', border: '1px solid var(--ept-accent)', borderRadius: 4, color: 'var(--ept-accent)', fontWeight: 500 }}>{s}</span>
                      ))}
                      {a.stack.length > 3 && <span style={{ fontSize: 10, padding: '2px 6px', color: 'var(--ept-text-muted)' }}>+{a.stack.length - 3}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.5 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PIPELINE */}
        {activeSection === 'pipeline' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>13-Stage Build Pipeline</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>From natural language description to production-ready code in 5 phases.</p>

            <div style={{ display: 'grid', gap: 20 }}>
              {PIPELINE_STAGES.map((p, i) => (
                <div key={p.phase} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ept-text)' }}>{p.phase}</div>
                      <div style={{ fontSize: 12, color: 'var(--ept-text-muted)' }}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {p.stages.map(s => (
                      <span key={s} style={{ fontSize: 12, padding: '5px 12px', background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 20, color: p.color, fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUALITY GATES */}
        {activeSection === 'quality' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Quality Gates</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>6 automated validation gates. Every line of generated code must pass all gates before delivery.</p>

            <div style={{ display: 'grid', gap: 14 }}>
              {QUALITY_GATES.map((g, i) => (
                <div key={g.gate} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{g.icon}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)' }}>Gate {i + 1}: {g.gate}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: 6 }}>{g.threshold}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6, paddingLeft: 38 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {activeSection === 'languages' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Languages &amp; Frameworks</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>8 languages with 40+ frameworks. Hephaestion selects the optimal stack based on project archetype and requirements.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {LANGUAGES.map(l => (
                <div key={l.name} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 8px', background: 'var(--ept-accent-glow)', border: '1px solid var(--ept-accent)', borderRadius: 4, color: 'var(--ept-accent)' }}>{l.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)' }}>{l.name}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {l.frameworks.map(f => (
                      <span key={f} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--ept-surface)', borderRadius: 20, color: 'var(--ept-text-secondary)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LLM SWARM */}
        {activeSection === 'swarm' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>Multi-LLM Swarm</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 20 }}>Hephaestion dispatches code generation tasks to the optimal LLM based on language, complexity, and task type.</p>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { model: 'Claude Opus 4.6', role: 'Architecture & Complex Logic', desc: 'Handles high-level architecture design, complex algorithm implementation, and multi-file refactoring. Best for tasks requiring deep reasoning.', strength: 'Reasoning depth' },
                { model: 'GPT-4.1', role: 'General Code Generation', desc: 'Primary workhorse for standard code generation, API implementations, and CRUD operations. Fast, reliable, and consistent output quality.', strength: 'Speed + consistency' },
                { model: 'DeepSeek V3', role: 'Performance Optimization', desc: 'Specializes in performance-critical code, algorithm optimization, and low-level systems programming. Strong at Rust, Go, and C++.', strength: 'Systems code' },
                { model: 'Groq (Llama 3.3 70B)', role: 'Rapid Prototyping', desc: 'Ultra-fast inference for quick prototypes, boilerplate generation, and iterative refinement cycles. 10x faster than standard models.', strength: 'Generation speed' },
              ].map(m => (
                <div key={m.model} style={{ background: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ept-text)' }}>{m.model}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: 'var(--ept-accent-glow)', borderRadius: 20, color: 'var(--ept-accent)' }}>{m.strength}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ept-accent)', fontWeight: 500, marginBottom: 6 }}>{m.role}</div>
                  <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.6 }}>{m.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, background: 'var(--ept-surface)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ept-text)', marginBottom: 8 }}>Smart Dispatch</div>
              <div style={{ fontSize: 13, color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
                The forge automatically selects the best model for each generation task based on: (1) language specialization — Rust/Go tasks route to DeepSeek, (2) complexity — architectural decisions route to Claude, (3) speed requirements — rapid iteration uses Groq, (4) cost optimization — simple boilerplate uses smaller models. The dispatch engine tracks success rates per model per task type and continuously improves routing.
              </div>
            </div>
          </section>
        )}

        {/* API REFERENCE */}
        {activeSection === 'api' && (
          <section>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--ept-text)', marginBottom: 8 }}>API Reference</h1>
            <p style={{ color: 'var(--ept-text-secondary)', fontSize: 14, marginBottom: 8 }}>
              Base URL: <code style={{ color: 'var(--ept-accent)', background: 'var(--ept-code-bg)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>https://hephaestion-forge.bmcii1976.workers.dev</code>
            </p>
            <p style={{ color: 'var(--ept-text-muted)', fontSize: 12, marginBottom: 20 }}>POST endpoints accept JSON. Write endpoints require X-Echo-API-Key header.</p>

            <div style={{ display: 'grid', gap: 8 }}>
              {API_ENDPOINTS.map(e => (
                <div key={e.path} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 2fr', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--ept-surface)', borderRadius: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.method === 'GET' ? '#22c55e' : '#3b82f6', background: e.method === 'GET' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', padding: '3px 8px', borderRadius: 4, textAlign: 'center' }}>{e.method}</span>
                  <code style={{ fontSize: 12, color: 'var(--ept-text)', fontFamily: "'JetBrains Mono', monospace" }}>{e.path}</code>
                  <span style={{ fontSize: 12, color: 'var(--ept-text-secondary)' }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
