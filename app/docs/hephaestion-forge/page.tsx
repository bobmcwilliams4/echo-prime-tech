'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Hephaestion Forge',
  tagline: 'AI-powered software factory — code generation, architecture planning, and automated quality assurance.',
  accent: '#7c3aed',
  productUrl: '/hephaestion-forge',
  workerUrl: 'https://hephaestion-forge.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Hephaestion Forge is a software engineering platform that transforms how teams build, test, and ship code. It combines large language model code generation with static analysis, automated testing, security scanning, and CI/CD orchestration into a single integrated pipeline. Instead of juggling separate tools for code writing, linting, testing, vulnerability scanning, and deployment, developers work within a unified system where AI handles the repetitive engineering tasks so humans can focus on architecture, design, and business logic.',
    'The code generation engine goes beyond autocomplete. Describe a feature in natural language — "add a rate-limited REST endpoint that accepts a JSON payload, validates against a schema, stores to D1, and returns the created record with a 201 status" — and Hephaestion Forge generates the implementation, unit tests, integration tests, input validation, error handling, and API documentation in a single operation. It understands your existing codebase context, matches your team\'s coding style, and respects your framework conventions (Next.js, Hono, Express, FastAPI, or whatever you use).',
    'Security is embedded in the generation pipeline, not bolted on afterward. Every generated code block is scanned for OWASP Top 10 vulnerabilities, dependency risks, secret exposure, and injection patterns before it reaches your repository. The architecture planning module models system dependencies, identifies single points of failure, and recommends resilience patterns. And the performance optimization engine profiles generated code against benchmarks, suggesting algorithmic improvements and caching strategies that reduce latency and compute cost.',
  ],

  gettingStarted: [
    { step: 1, title: 'Connect Your Repository', desc: 'Link your GitHub, GitLab, or Bitbucket repository. Hephaestion Forge analyzes your codebase — framework, language, directory structure, coding patterns, and dependencies — to calibrate its generation engine to your project\'s conventions.' },
    { step: 2, title: 'Configure Project Settings', desc: 'Set your primary language and framework, test runner (Jest, Vitest, pytest, etc.), linting configuration, and deployment target (Cloudflare Workers, Vercel, AWS Lambda, Docker). These settings ensure generated code fits seamlessly into your existing toolchain.' },
    { step: 3, title: 'Generate Your First Feature', desc: 'Describe a feature in natural language or select from template patterns (CRUD endpoint, authentication flow, webhook handler, scheduled job). The engine generates implementation code, tests, and documentation. Review the output, make any adjustments, and commit to your repository.' },
    { step: 4, title: 'Run the Quality Pipeline', desc: 'Trigger the full quality pipeline — linting, type checking, unit tests, integration tests, security scan, and performance benchmarks. Results are displayed inline with specific file and line references. Fix any issues manually or use the AI auto-fix suggestions.' },
    { step: 5, title: 'Deploy via CI/CD', desc: 'Configure the deployment pipeline to your target environment. Hephaestion Forge generates the CI/CD configuration (GitHub Actions, GitLab CI, or Cloudflare Workers) and manages the deploy-on-merge workflow. Deployment status, logs, and rollback controls are accessible from the dashboard.' },
  ],

  features: [
    { title: 'Code Generation', desc: 'Multi-language code generation from natural language specifications. Supports TypeScript, JavaScript, Python, Go, Rust, and Java. Generated code follows your project\'s existing patterns — import style, naming conventions, error handling patterns, and directory structure. Produces implementation, tests, and documentation together.' },
    { title: 'Multi-Language Support', desc: 'Full generation and analysis support for TypeScript, JavaScript, Python, Go, Rust, Java, C#, and Ruby. Language-specific best practices are built into the generation templates — idiomatic error handling, proper typing, framework-specific patterns, and standard library usage.' },
    { title: 'Architecture Planning', desc: 'Model your system architecture with dependency graphs that show service relationships, data flows, and failure propagation paths. The AI identifies single points of failure, circular dependencies, and services with excessive coupling. Recommends patterns like circuit breakers, bulkheads, and async decoupling to improve resilience.' },
    { title: 'Test Generation', desc: 'Automatic generation of unit tests, integration tests, and edge case tests for any function, module, or API endpoint. Tests cover happy paths, error conditions, boundary values, and null/undefined handling. Generated tests use your project\'s test framework and assertion style. Coverage targets are configurable.' },
    { title: 'Dependency Analysis', desc: 'Scans your dependency tree for outdated packages, known vulnerabilities (CVE database), license compatibility issues, and abandoned/unmaintained packages. Generates upgrade plans that show which dependencies can be safely updated, which have breaking changes requiring code modifications, and which should be replaced entirely.' },
    { title: 'Security Scanning', desc: 'Static analysis for OWASP Top 10 vulnerabilities — SQL injection, XSS, CSRF, insecure deserialization, broken authentication, and more. Secret detection scans for hardcoded API keys, passwords, tokens, and private keys in code, comments, and configuration files. Each finding includes severity, affected code location, and a remediation recommendation with code example.' },
    { title: 'Documentation Generation', desc: 'Generates API documentation (OpenAPI/Swagger), README files, inline code comments, architecture decision records (ADRs), and runbook documentation from your codebase. Documentation stays synchronized with code — when a function signature changes, the documentation updates automatically.' },
    { title: 'CI/CD Integration', desc: 'Generates CI/CD pipeline configurations for GitHub Actions, GitLab CI, CircleCI, and Cloudflare Workers. Pipelines include build, lint, test, security scan, and deploy stages with proper caching, parallelization, and failure notifications. Manages environment variables and secrets through your CI provider\'s native secret store.' },
    { title: 'Code Review', desc: 'AI-powered code review that analyzes pull requests for logic errors, performance issues, security vulnerabilities, style inconsistencies, and missing test coverage. Reviews are contextual — the AI understands the full codebase and flags issues specific to your architecture, not just generic lint rules. Integrates with GitHub PR reviews.' },
    { title: 'Performance Optimization', desc: 'Profiles code against performance benchmarks — response latency, memory allocation, CPU cycles, and bundle size. Identifies bottlenecks and recommends optimizations: algorithm improvements, caching strategies, lazy loading, code splitting, and database query optimization. Estimates the performance impact of each recommendation before you implement it.' },
    { title: 'Refactoring Engine', desc: 'Automated refactoring that restructures code while preserving behavior. Extract functions, rename across the codebase, convert callbacks to async/await, decompose large modules, and migrate between frameworks. Each refactoring is accompanied by before/after tests to verify that behavior is preserved.' },
    { title: 'Template Library', desc: 'Library of production-ready code templates for common patterns — authentication flows (JWT, OAuth, session), CRUD APIs, webhook handlers, scheduled jobs, file upload/download, email sending, payment processing, and search indexing. Templates are parameterized and adapt to your project\'s framework and coding style.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/generate', desc: 'Generate code from a natural language specification. Accepts language, framework, and specification text. Returns generated implementation, tests, and documentation as separate files.', auth: true },
    { method: 'POST', path: '/api/analyze', desc: 'Run static analysis on a code snippet or repository path. Returns lint issues, type errors, security findings, and dependency vulnerabilities with severity and remediation recommendations.', auth: true },
    { method: 'POST', path: '/api/review', desc: 'Submit a diff (pull request format) for AI code review. Returns review comments with file paths, line numbers, severity, and suggested changes. Supports GitHub PR webhook integration for automated reviews.', auth: true },
    { method: 'POST', path: '/api/tests/generate', desc: 'Generate test cases for a function, module, or API endpoint. Specify the test framework, coverage targets, and whether to include edge cases and error conditions. Returns runnable test files.', auth: true },
    { method: 'POST', path: '/api/security/scan', desc: 'Run a security scan on a codebase or code snippet. Checks for OWASP Top 10, hardcoded secrets, vulnerable dependencies, and insecure configurations. Returns findings with CVSS scores and fix recommendations.', auth: true },
    { method: 'GET', path: '/api/dependencies/:repo', desc: 'Analyze the dependency tree of a repository. Returns outdated packages, known CVEs, license issues, and an upgrade plan with breaking change assessment.', auth: true },
    { method: 'POST', path: '/api/docs/generate', desc: 'Generate documentation from a codebase — API docs (OpenAPI), README, inline comments, or architecture diagrams. Specify the output format and documentation depth level.', auth: true },
    { method: 'POST', path: '/api/optimize', desc: 'Submit code for performance analysis. Returns profiling results, identified bottlenecks, and optimization recommendations with estimated impact scores.', auth: true },
  ],

  userGuide: [
    {
      title: 'Code Generation Workflow',
      id: 'code-generation',
      content: [
        'The code generation workflow starts with a specification. You can provide this as a natural language description ("build a REST API endpoint that accepts user registration with email validation, password hashing, and duplicate detection"), a structured spec (input/output schemas, business rules, error conditions), or by selecting a template pattern and customizing the parameters. The more specific your input, the more precisely the output matches your intent.',
        'Before generating, the engine analyzes your connected repository to understand context: your framework (Next.js, Hono, Express, FastAPI), language version, import style, naming conventions (camelCase vs. snake_case), error handling patterns, and directory structure. This analysis ensures the generated code looks like a human on your team wrote it — not like a generic code sample pasted from documentation.',
        'Generated output includes three components: the implementation file(s), corresponding test file(s), and documentation. Review each section in the preview panel. Edit inline if needed — the system tracks your modifications and learns your preferences for future generations. When satisfied, click "Commit" to write the files to your repository on a new branch, or "Copy" to paste into your editor manually. The commit option creates a PR with a descriptive title and body automatically.',
      ],
    },
    {
      title: 'Security Scanning & Remediation',
      id: 'security-scanning',
      content: [
        'Security scanning in Hephaestion Forge operates at three levels: pre-generation (before code reaches your repo), pull request (on every code change), and periodic full-codebase sweeps. The scanner checks for OWASP Top 10 vulnerabilities, hardcoded secrets, vulnerable dependencies, insecure configurations, and code patterns known to introduce security flaws.',
        'Each finding includes a severity rating (Critical, High, Medium, Low, Info), the specific vulnerability type (e.g., CWE-89 SQL Injection), the affected file and line number, a plain-English explanation of the risk, and a recommended fix with code example. For dependency vulnerabilities, the scanner shows the CVE ID, affected version range, and the minimum patched version. Findings are organized by severity so you can triage critical issues first.',
        'The auto-fix feature generates a remediation PR for many common finding types. SQL injection fixes replace string concatenation with parameterized queries. XSS fixes add proper output encoding. Hardcoded secret findings replace the literal value with an environment variable reference. Each auto-fix PR includes the security scan result before and after the fix so you can verify the issue is resolved. For complex findings that require architectural changes, the system provides a detailed remediation guide rather than an automated fix.',
      ],
    },
    {
      title: 'Architecture Planning & Dependency Mapping',
      id: 'architecture-planning',
      content: [
        'The architecture planning module visualizes your system as an interactive dependency graph. Services, databases, external APIs, message queues, and cron jobs are represented as nodes. Edges show data flows, API calls, and event subscriptions between components. The graph is generated automatically from your codebase by analyzing import statements, API client configurations, database connection strings, and infrastructure-as-code files.',
        'The AI analyzes the graph for structural risks. Single points of failure — services that, if they go down, bring the entire system to a halt — are highlighted in red. Circular dependencies that complicate deployment ordering and increase coupling are flagged. Services with excessive fan-out (calling too many other services) or fan-in (too many services depend on it) are identified as complexity hotspots that may need decomposition or an intermediary layer.',
        'Recommendation cards suggest specific improvements: "Add a circuit breaker between Service A and External API X — the current direct call pattern will cascade failures if the API is slow or unavailable" or "Introduce an async event queue between the Order Service and the Notification Service to decouple their availability requirements." Each recommendation includes an architecture diagram showing the before and after state and a code template for the recommended pattern.',
      ],
    },
    {
      title: 'CI/CD Pipeline Configuration',
      id: 'cicd-pipelines',
      content: [
        'Hephaestion Forge generates and manages CI/CD pipeline configurations tailored to your project. Specify your deployment target — Cloudflare Workers, Vercel, AWS Lambda, Docker/Kubernetes, or a custom server — and the system generates the appropriate pipeline definition file (GitHub Actions workflow, GitLab CI YAML, or wrangler.toml for Workers). The generated pipeline includes build, lint, type-check, test, security scan, and deploy stages.',
        'Pipeline stages are configured for maximum efficiency. Build artifacts are cached between runs to reduce build times. Test suites are parallelized across multiple runners when the CI provider supports it. Security scans run concurrently with tests rather than sequentially. Deployment uses zero-downtime strategies — blue-green for Workers and Lambda, rolling updates for Kubernetes. Failure at any stage halts the pipeline and sends notifications via your configured channel (Slack, email, or webhook).',
        'Environment management handles the staging-to-production promotion flow. Feature branches deploy to preview environments with unique URLs for testing. The main branch deploys to staging automatically. Production deployments require explicit approval (configurable per team) or can be set to auto-deploy after staging tests pass. Rollback is one-click — the system maintains the previous three deployment artifacts and can restore any of them in under 30 seconds.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Context-Aware Code Generation', desc: 'The generation engine analyzes your entire repository — framework, language, coding style, directory structure, existing patterns, and dependencies — before producing code. Generated output matches your team\'s conventions: import ordering, naming style, error handling approach, logging library, and test structure. The model improves over time as it learns from your code review modifications.' },
    { capability: 'Multi-Pass Security Analysis', desc: 'Three-layer security scanning: taint analysis tracks untrusted input through the codebase to detect injection vulnerabilities, pattern matching identifies known-vulnerable code constructs (eval, innerHTML, exec), and dependency scanning checks every package against the CVE database. Findings include CWE classification, CVSS score, and auto-generated fix PRs for common vulnerability types.' },
    { capability: 'Intelligent Test Generation', desc: 'Generates comprehensive test suites by analyzing function signatures, type definitions, branching logic, and error conditions. Covers happy paths, edge cases (empty arrays, null values, max integers), error conditions (network failures, invalid input, timeout), and concurrency scenarios. Tests are generated in your project\'s framework (Jest, Vitest, pytest, Go test) with idiomatic assertion patterns.' },
    { capability: 'Architecture Risk Detection', desc: 'Builds a dependency graph from your codebase and applies graph analysis to detect structural risks: single points of failure, circular dependencies, excessive coupling, and missing resilience patterns. Recommends specific architectural improvements with code templates — circuit breakers, bulkheads, retry policies, and async decoupling patterns.' },
    { capability: 'Performance Profiling & Optimization', desc: 'Static analysis identifies performance anti-patterns: N+1 database queries, synchronous operations that should be async, unbounded memory growth, missing pagination, and redundant computations. For each finding, provides the estimated performance impact and a recommended optimization with before/after benchmarks.' },
    { capability: 'Automated Refactoring', desc: 'Transforms code structure while preserving behavior. Supported refactorings include: extract function, inline function, rename symbol across codebase, convert callback chains to async/await, decompose large modules, migrate between API frameworks (Express to Hono, Flask to FastAPI), and upgrade deprecated API usage. Every refactoring generates before/after tests to verify behavioral equivalence.' },
  ],

  troubleshooting: [
    { issue: 'Generated code does not match project conventions', solution: 'Ensure your repository is connected and the latest code has been pushed. The engine analyzes the HEAD commit of your default branch. If you recently changed coding standards (e.g., switched from CommonJS to ESM, or camelCase to snake_case), trigger a re-analysis from Settings > Project > Re-analyze. You can also provide explicit style directives in the project configuration — preferred import style, naming convention, and error handling pattern — that override auto-detected conventions.' },
    { issue: 'Security scan reports false positives', solution: 'Not every pattern match is a real vulnerability — context matters. Review the finding details: does untrusted user input actually reach the flagged code path? If the input is validated upstream, the finding may be a false positive. Mark it as "suppressed" with a justification note. Suppressed findings are excluded from future scans but remain visible in the audit log. For recurring false positive patterns, create a suppression rule in Settings > Security > Suppressions.' },
    { issue: 'Generated tests fail immediately', solution: 'Test failures after generation typically indicate a mismatch between the generation context and the actual runtime environment. Common causes: the test references a database or API that is not available in the test environment (mock it), the test uses a newer language feature than your runtime supports (check the Node/Python version in project settings), or a dependency required by the test is not installed (run the package install command). Review the error message — it usually points directly to the issue.' },
    { issue: 'CI/CD pipeline fails on deployment stage', solution: 'Check the deployment logs for the specific error. Common issues: missing environment variables (add them in your CI provider\'s secret store and reference them in the pipeline config), authentication token expired (regenerate the deployment token), and resource limits exceeded (upgrade your deployment target\'s plan). For Cloudflare Workers, verify that wrangler is using the correct account ID and API token. For Vercel, ensure the project is linked and the deployment token has the correct scope.' },
  ],

  faq: [
    { q: 'What languages and frameworks does Hephaestion Forge support?', a: 'Full generation and analysis support for TypeScript, JavaScript, Python, Go, Rust, Java, C#, and Ruby. Framework-specific intelligence for Next.js, Hono, Express, FastAPI, Django, Flask, Gin, Actix, Spring Boot, and ASP.NET Core. The template library covers the most common patterns for each framework. New language and framework support is added regularly based on user demand.' },
    { q: 'Does the AI have access to my proprietary code?', a: 'Your repository data is used only to provide context for generation and analysis within your Hephaestion Forge workspace. Code is not used to train the underlying AI models. Repository analysis data is encrypted at rest and can be deleted at any time from Settings > Data. Enterprise plans support VPC deployment where all processing occurs within your infrastructure.' },
    { q: 'How does code generation handle complex business logic?', a: 'For complex features, break the specification into smaller units. Instead of "build the entire payment system," specify individual components: "create a Stripe checkout session endpoint," "build a webhook handler for payment events," "implement subscription lifecycle management." Each component generates with full tests and error handling. The architecture planner helps you design the component relationships before generating the implementations.' },
    { q: 'Can Hephaestion Forge work with monorepos?', a: 'Yes. Connect a monorepo and configure which packages/services are within scope. The engine understands workspace structures (npm workspaces, Yarn workspaces, Turborepo, Nx) and generates code that correctly references shared packages and respects workspace boundaries. Dependency analysis covers both external npm/pip packages and internal workspace cross-references.' },
    { q: 'How accurate is the security scanning?', a: 'The scanner has a true positive rate above 92% for OWASP Top 10 categories based on internal benchmarking against NIST SARD and OWASP Benchmark test suites. False positive rates vary by finding type — SQL injection detection is highly accurate because taint analysis traces actual data flow, while some pattern-based checks (e.g., potential XSS in templated strings) may flag safe patterns. Always review findings in context before committing fixes. The suppression system lets you manage false positives without noise.' },
  ],
}

export default function HephaestionForgeDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/hephaestion-forge' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
