'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Agentic Engine',
  tagline: 'Build autonomous AI agents with tool use, multi-step reasoning, and durable task queues — running 24/7 on the global edge.',
  accent: '#7c3aed',
  productUrl: '/agentic-engine',
  workerUrl: 'echo-agentic-engine.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Agentic Engine lets you build AI agents that plan, execute, and iterate without human intervention. Give an agent a goal and it breaks it into tasks, selects tools, executes steps, evaluates results, and adjusts its approach — all running on Cloudflare Workers at the global edge.',
    'Unlike localhost-based frameworks like AutoGPT or CrewAI, Agentic Engine runs on production-grade infrastructure with durable task queues via Cloudflare Queues, persistent artifact storage in R2, and access to 2,600+ knowledge engines through the Echo Engine Runtime.',
    'Agents support parallel sub-agent execution, event-driven triggers (cron, webhooks, database changes), observation loops with self-correction, and a full audit trail of every decision and tool call logged to D1.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create an Account', desc: 'Sign up at echo-ept.com and choose the Agentic Engine plan that fits your needs. All plans include a free trial.' },
    { step: 2, title: 'Define Your Agent', desc: 'Describe your agent\'s goal and select from pre-built templates (research, data analysis, content creation, monitoring) or start from scratch.' },
    { step: 3, title: 'Configure Tools', desc: 'Define tools as JSON schemas. Agents can use API calls, document search, web scraping, database queries, file operations, and any custom tool you define.' },
    { step: 4, title: 'Set Triggers', desc: 'Configure when your agent runs — on a schedule (cron), via webhook, on database changes, or triggered manually. Agents can also spawn sub-agents for parallel work.' },
    { step: 5, title: 'Monitor & Iterate', desc: 'Watch your agent execute in real-time. Review the full audit trail, adjust tools or goals, and let observation loops handle self-correction automatically.' },
  ],
  features: [
    { title: 'Autonomous Execution', desc: 'Agents plan, execute, and iterate without human intervention. Set a goal and let the agent figure out the optimal path to completion.' },
    { title: 'Tool Use Framework', desc: 'Define tools as JSON schemas. Agents select the right tool for each step — API calls, searches, calculations, file operations, and custom actions.' },
    { title: 'Durable Task Queues', desc: 'Cloudflare Queues ensure tasks survive failures. Auto-retry, dead letter queues, and priority scheduling are built-in for reliability.' },
    { title: 'Multi-Step Reasoning', desc: 'Chain-of-thought planning with self-evaluation. Agents reason about their approach and adjust when results differ from expectations.' },
    { title: '2,600+ Knowledge Engines', desc: 'Every agent accesses the full Echo Engine Runtime — domain expertise in 20+ fields including tax, legal, cybersecurity, and oilfield with citation-backed responses.' },
    { title: 'R2 Artifact Storage', desc: 'Agents store intermediate results, generated files, and final outputs in R2 for persistent access, sharing, and downstream processing.' },
    { title: 'Workers AI Integration', desc: 'On-device inference for fast, private AI processing. Sensitive operations stay on Cloudflare infrastructure with no external API calls.' },
    { title: 'Agent Templates', desc: 'Pre-built templates for common workflows — research assistants, data analysis pipelines, content creation, monitoring agents, and automation scripts.' },
    { title: 'Parallel Sub-Agents', desc: 'Spawn sub-agents for concurrent task execution. Complex workflows decompose into parallel streams automatically for faster completion.' },
    { title: 'Observation Loops', desc: 'Agents observe their own output, detect errors, and self-correct. Built-in guardrails prevent runaway execution and resource waste.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/agents', desc: 'Create a new agent with goal, tools, and trigger configuration.', auth: true },
    { method: 'GET', path: '/agents', desc: 'List all agents with status, last run time, and execution counts.', auth: true },
    { method: 'POST', path: '/agents/:id/run', desc: 'Trigger an agent run manually. Returns a task ID for tracking.', auth: true },
    { method: 'GET', path: '/agents/:id/runs', desc: 'Get execution history for an agent with full audit trail per run.', auth: true },
    { method: 'GET', path: '/agents/:id/artifacts', desc: 'List all artifacts produced by an agent, stored in R2.', auth: true },
    { method: 'DELETE', path: '/agents/:id', desc: 'Delete an agent and optionally its artifacts and execution history.', auth: true },
  ],
  userGuide: [
    { title: 'Designing Effective Agents', id: 'designing-agents', content: [
      'Start with a clear, specific goal. Agents perform best when the objective is well-defined — "Research competitors in the CRM space and produce a comparison report" is better than "Do some research."',
      'Break complex goals into sub-goals using the multi-agent pattern. A research agent can spawn a data-collection sub-agent and a report-writing sub-agent that work in parallel.',
      'Define tools carefully. Each tool schema should include clear descriptions of inputs, outputs, and when the tool should be used. The agent relies on these descriptions to select the right tool at each step.',
    ] },
    { title: 'Managing Task Queues', id: 'task-queues', content: [
      'Cloudflare Queues provide durable task persistence. If a Worker crashes mid-execution, the task automatically retries from the last checkpoint. Dead letter queues capture permanently failed tasks for review.',
      'Configure retry policies per agent: maximum retries, backoff intervals, and timeout limits. Priority scheduling lets urgent agents jump the queue when resources are constrained.',
      'Monitor queue depth and processing latency through the analytics dashboard. Set alerts for queue backup or elevated failure rates to catch issues before they cascade.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'Chain-of-Thought Planning', desc: 'Agents decompose complex goals into ordered steps using chain-of-thought reasoning. Each step is evaluated before proceeding to the next, with automatic replanning when results deviate from expectations.' },
    { capability: 'Self-Correction via Observation Loops', desc: 'After each action, the agent observes the result and compares it to the expected outcome. Errors trigger automatic correction — retrying with different parameters, selecting alternative tools, or adjusting the overall plan.' },
    { capability: 'Knowledge Engine Integration', desc: 'Agents query the Echo Engine Runtime for domain-specific expertise across 2,600+ engines. Responses include citations and authority references, giving agents access to real doctrine rather than hallucinated facts.' },
    { capability: 'Multi-LLM Routing', desc: 'The engine routes inference requests to the optimal model based on task complexity — fast models for simple classification, powerful models for complex reasoning, and private models for sensitive data.' },
  ],
  troubleshooting: [
    { issue: 'Agent stuck in a loop', solution: 'Check the observation loop configuration. Ensure your agent has a maximum iteration limit set. Review the audit trail to identify which step is cycling, and verify the tool output matches expected format.' },
    { issue: 'Tasks not retrying after failure', solution: 'Verify queue retry configuration in the agent settings. Ensure the dead letter queue is not full. Check that the failure is not a permanent error (4xx responses) which skips retry by default.' },
    { issue: 'Knowledge engine queries returning empty', solution: 'Confirm the engine domain matches your query topic. Use the /engines endpoint to list available engines and their domains. Ensure your plan includes knowledge engine access.' },
    { issue: 'Sub-agents not spawning', solution: 'Parallel sub-agents require the Professional plan or higher. Check your active agent count against your plan limit. Verify the parent agent has the spawn_subagent tool defined in its schema.' },
  ],
  faq: [
    { q: 'What is an autonomous AI agent?', a: 'An AI agent that can plan, execute, and iterate without human intervention. Give it a goal, and it breaks it into tasks, selects tools, executes steps, evaluates results, and adjusts its approach — running 24/7 on Cloudflare Workers.' },
    { q: 'What tools can agents use?', a: 'Agents access the full Echo ecosystem: 2,600+ knowledge engines, document search, web scraping, API calls, database queries, file operations, and custom tool definitions via simple JSON schemas.' },
    { q: 'How does task queuing work?', a: 'Cloudflare Queues provide durable task queuing with producer-consumer patterns. Tasks survive failures, retry automatically, and scale to millions of concurrent operations.' },
    { q: 'Is it like AutoGPT or CrewAI?', a: 'Similar concept but production-grade. Runs on Cloudflare Workers (not localhost), scales globally, has durable task queues (not in-memory), and integrates with 2,600+ knowledge engines (not just ChatGPT).' },
    { q: 'What are the pricing tiers?', a: 'Starter at $49/mo (5 agents, 10K executions), Professional at $149/mo (25 agents, 100K executions, parallel sub-agents), and Enterprise at $399/mo (unlimited agents and executions, custom tools, R2 storage).' },
  ],
}

export default function AgenticEngineDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/agentic-engine' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
