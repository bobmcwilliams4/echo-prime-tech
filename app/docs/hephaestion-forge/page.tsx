'use client'

import ProductDoc from '@/components/ProductDoc'

export default function HephaestionForgeDocsPage() {
  return (
    <ProductDoc
      name="Hephaestion Forge"
      tagline="AI-powered software factory — code generation, architecture planning, multi-language support, testing, and automated deployment."
      accent="#7c3aed"
      productUrl="/hephaestion-forge"
      workerUrl="https://hephaestion-forge.bmcii1976.workers.dev"
      version="2.0.0"
      overview={[
        'Hephaestion Forge is an AI-powered software factory that generates production-ready code from natural language specifications. Named after Alexander the Great\'s most trusted companion and engineer, it transforms ideas into deployable software at unprecedented speed.',
        'The Forge generates complete applications including frontend, backend, database schemas, API endpoints, tests, and deployment configurations. It supports 20+ programming languages and 50+ frameworks. Every generated component follows best practices, includes error handling, and passes security analysis.',
        'From single-function utilities to full-stack SaaS applications, Hephaestion Forge handles projects of any scale. It integrates with GitHub for version control, Cloudflare Workers for deployment, and the Echo ecosystem for AI-enhanced features like voice, payments, and analytics.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Describe Your Project', desc: 'Write a natural language description of what you want to build. Be specific about features, tech stack preferences, and target platform. The more detail, the better the output.' },
        { step: 2, title: 'Review Architecture', desc: 'Hephaestion generates an architecture plan: file structure, database schema, API endpoints, and component hierarchy. Review and adjust before code generation begins.' },
        { step: 3, title: 'Generate Code', desc: 'Click Generate to produce the complete codebase. Watch as files are created in real-time. Each file includes inline comments explaining design decisions.' },
        { step: 4, title: 'Run Tests', desc: 'Auto-generated test suites cover unit tests, integration tests, and API tests. Run the test suite to verify everything works. Fix any issues with AI-assisted debugging.' },
        { step: 5, title: 'Deploy', desc: 'One-click deployment to Cloudflare Workers, Vercel, or GitHub Pages. CI/CD pipeline is pre-configured. Your application is live in seconds.' },
      ]}
      features={[
        { title: 'Full-Stack Generation', desc: 'Generates complete applications: React/Next.js frontend, Cloudflare Worker backend, D1/R2 storage, authentication, and deployment config. Everything needed to ship.' },
        { title: 'Multi-Language Support', desc: 'TypeScript, JavaScript, Python, Go, Rust, Java, C#, Ruby, PHP, Swift, Kotlin, and 10+ more. Framework-specific templates for Next.js, Hono, FastAPI, Express, and others.' },
        { title: 'Architecture Planning', desc: 'AI designs system architecture based on requirements: microservices vs monolith, database selection, caching strategy, API design, and scalability considerations.' },
        { title: 'Test Generation', desc: 'Comprehensive test suites generated alongside code: unit tests (Vitest/Jest), integration tests, API tests, and end-to-end tests. 80%+ coverage guaranteed.' },
        { title: 'Security Scanning', desc: 'Every generated codebase passes automated security analysis: OWASP Top 10 checks, dependency vulnerability scanning, secret detection, and input validation verification.' },
        { title: 'Documentation Generation', desc: 'README, API docs (OpenAPI/Swagger), inline code comments, and user guides generated automatically. Documentation stays in sync with code changes.' },
        { title: 'CI/CD Integration', desc: 'GitHub Actions workflows, Cloudflare Workers deployment scripts, and Vercel configuration generated automatically. Push-to-deploy pipeline works out of the box.' },
        { title: 'Code Review', desc: 'AI reviews generated code for: performance bottlenecks, security vulnerabilities, code style consistency, and architectural anti-patterns. Review report included with every generation.' },
        { title: 'Dependency Management', desc: 'Dependencies are carefully selected for security, maintenance status, and compatibility. Lock files generated. Automatic alerts for known vulnerabilities.' },
        { title: 'Iterative Refinement', desc: 'Modify generated code through natural language instructions. "Add user authentication", "Change the database to PostgreSQL", "Add rate limiting to all endpoints."' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/generate', desc: 'Generate a codebase from a natural language specification. Parameters: description, language, framework, features. Returns job ID for streaming results.', auth: true },
        { method: 'GET', path: '/api/jobs/:id', desc: 'Get generation job status and results. Includes file list, test results, and deployment status.', auth: true },
        { method: 'POST', path: '/api/review', desc: 'Submit code for AI review. Returns security findings, performance suggestions, and code quality scores.', auth: true },
        { method: 'POST', path: '/api/refine', desc: 'Modify existing generated code with natural language instructions. Maintains context from the original generation.', auth: true },
        { method: 'POST', path: '/api/deploy', desc: 'Deploy generated code to target platform (Cloudflare Workers, Vercel, GitHub Pages). Returns deployment URL.', auth: true },
        { method: 'GET', path: '/api/templates', desc: 'List available project templates: SaaS starter, API server, static site, bot, CLI tool, and more.' },
        { method: 'GET', path: '/health', desc: 'Health check endpoint. Returns service status and generation queue length.' },
      ]}
      userGuide={[
        { id: 'writing-specs', title: 'Writing Effective Specifications', content: [
          'The quality of generated code depends heavily on specification quality. Include: what the application does, who uses it, key features, preferred tech stack, and deployment target.',
          'Good: "Build a SaaS invoicing app with Cloudflare Workers backend, React frontend, D1 database. Features: create/send invoices, payment tracking, PDF generation, recurring invoices, client management, dashboard with revenue charts."',
          'Bad: "Make an invoice app." The AI will still generate something, but vague specs produce generic results. Specific requirements produce production-ready code.',
        ]},
        { id: 'architecture', title: 'Understanding the Architecture Phase', content: [
          'Before generating code, Hephaestion creates an architecture plan. This includes: file/folder structure, database tables and relationships, API endpoints, authentication flow, and deployment topology.',
          'Review the architecture plan carefully. This is where you catch structural issues — it is much easier to change the plan than to refactor generated code. Click "Modify Architecture" to adjust before proceeding.',
          'The architecture plan is saved and versioned. If you refine the code later, the architecture updates accordingly. You can export the plan as a diagram or documentation.',
        ]},
        { id: 'deployment', title: 'Deploying Generated Applications', content: [
          'One-click deployment pushes your generated code to the target platform. For Cloudflare Workers, the Forge configures wrangler.toml, D1 databases, R2 buckets, and KV namespaces automatically.',
          'For GitHub deployment, Hephaestion creates a repository, pushes the code, and configures GitHub Actions for CI/CD. Subsequent pushes trigger automatic builds and deployments.',
          'Custom deployment targets are supported via the deployment API. Provide your platform\'s CLI commands or API endpoints, and Hephaestion integrates them into the deployment pipeline.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Specification Analysis', desc: 'NLP analyzes natural language specs to extract: entities, relationships, features, constraints, and non-functional requirements. Disambiguation questions are asked when specs are ambiguous.' },
        { capability: 'Architecture Design', desc: 'AI selects optimal architecture patterns based on requirements: event-driven, CQRS, microservices, serverless, or monolithic. Database, caching, and messaging choices are justified.' },
        { capability: 'Code Generation', desc: 'Multi-model pipeline generates idiomatic code for each language/framework. Variable naming, error handling, logging, and documentation follow established conventions.' },
        { capability: 'Security Analysis', desc: 'Static analysis identifies: SQL injection, XSS, CSRF, insecure deserialization, broken auth, and 40+ other vulnerability classes. Every finding includes a fix suggestion.' },
        { capability: 'Performance Optimization', desc: 'AI identifies N+1 queries, unnecessary re-renders, missing indexes, and inefficient algorithms. Optimization suggestions include before/after benchmarks.' },
      ]}
      troubleshooting={[
        { issue: 'Generation takes too long', solution: 'Large applications (50+ files) may take 2-5 minutes. Check job status via the API. If stuck for more than 10 minutes, cancel and re-submit with a smaller scope. Break large projects into modules.' },
        { issue: 'Generated code has TypeScript errors', solution: 'Run the AI review endpoint which catches and fixes type errors. If persists, check that the specified framework version matches the generated code. Update the spec to specify exact versions.' },
        { issue: 'Deployment fails', solution: 'Check deployment logs for specific errors. Common issues: missing environment variables (add via platform dashboard), database not created (Forge auto-creates D1 but may need manual R2 setup), or domain not configured.' },
        { issue: 'Code does not match spec', solution: 'Add more detail to your specification. Use concrete examples: "when a user clicks Submit, validate all fields, then POST to /api/orders." Iterate with the refine endpoint to add missing features.' },
      ]}
      faq={[
        { q: 'What languages and frameworks are supported?', a: 'TypeScript/JavaScript (Next.js, Hono, Express), Python (FastAPI, Flask), Go (Gin, Echo), Rust (Actix, Axum), Java (Spring Boot), C# (.NET), Ruby (Rails), PHP (Laravel), Swift, Kotlin. 20+ languages total.' },
        { q: 'Can I modify generated code manually?', a: 'Yes. Generated code is yours to modify. The Forge outputs standard project structures. After generation, treat it like any codebase — edit in your IDE, commit to git, deploy normally.' },
        { q: 'How many projects can I generate?', a: 'Free: 3 projects/month. Starter: 20 projects. Professional: 100 projects. Enterprise: unlimited. Each project can be refined unlimited times within 30 days of creation.' },
        { q: 'Is the generated code production-ready?', a: 'Yes. All generated code includes error handling, input validation, structured logging, health endpoints, and security best practices. It passes automated security scanning before delivery.' },
        { q: 'Can it generate code for existing projects?', a: 'Yes. Provide your existing codebase (via GitHub repo URL) and describe what to add. The Forge analyzes your existing architecture and generates code that matches your patterns, naming conventions, and tech stack.' },
      ]}
    />
  )
}
