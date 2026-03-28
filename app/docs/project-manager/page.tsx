"use client"

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Project Manager',
  tagline: 'AI-powered project management — Kanban boards, sprint planning, time tracking, milestones, and velocity analytics.',
  accent: '#2563eb',
  productUrl: '/project-manager',
  workerUrl: 'https://echo-project-manager.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Project Manager provides Kanban boards, sprint planning, time tracking, and AI-powered estimation. 65 endpoints, 12 D1 tables. Built for teams wanting powerful PM without Jira complexity.',
    'AI estimation analyzes task descriptions and historical velocity to predict timelines. Sprint planning suggests optimal task selection based on priority, dependencies, and capacity.',
    'Templates let you spin up new projects with pre-configured boards, labels, and workflows in seconds.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Project', desc: 'Set up with name, team, and template (Kanban, Scrum, or Custom).' },
    { step: 2, title: 'Configure Board', desc: 'Customize columns, WIP limits, and automation rules.' },
    { step: 3, title: 'Add Tasks', desc: 'Create tasks with assignees, labels, priority. Use AI for story point estimation.' },
    { step: 4, title: 'Plan Sprints', desc: 'Create sprints with dates. AI suggests optimal task selection from backlog.' },
    { step: 5, title: 'Track & Deliver', desc: 'Move tasks, log time, monitor burndown charts and velocity trends.' },
  ],
  features: [
    { title: 'Kanban Board', desc: 'Drag-and-drop with customizable columns, WIP limits, swimlanes. Filter by assignee, label, priority.' },
    { title: 'Sprint Planning', desc: 'Capacity planning with AI task suggestions. Burndown chart tracks progress.' },
    { title: 'Time Tracking', desc: 'Start/stop timer or manual entry. Billable vs non-billable. Timesheet reports.' },
    { title: 'AI Estimation', desc: 'Analyzes descriptions to suggest story points. Improves with historical data.' },
    { title: 'Milestones', desc: 'Group tasks with target dates. Track progress and blocking tasks.' },
    { title: 'Velocity Analytics', desc: 'Story points per sprint over time. Forecast capacity. Identify bottlenecks.' },
    { title: 'Labels & Priorities', desc: 'Color-coded labels (feature, bug, tech-debt). Customizable priority sort.' },
    { title: 'Comments & Activity', desc: 'Threaded comments. Full activity log with timestamps and authors.' },
    { title: 'Project Templates', desc: 'Save configurations as templates. One-click project creation.' },
    { title: 'Notifications', desc: 'Assignments, mentions, due dates, sprint events. Email and webhook.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/projects', desc: 'List projects with task counts, active sprint, team size.', auth: true },
    { method: 'POST', path: '/api/tasks', desc: 'Create task with title, description, assignee, labels, AI estimation.', auth: true },
    { method: 'PUT', path: '/api/tasks/:id/move', desc: 'Move task to different column or sprint.', auth: true },
    { method: 'POST', path: '/api/sprints', desc: 'Create sprint with dates and optional AI task selection.', auth: true },
    { method: 'POST', path: '/api/time-entries', desc: 'Log time. Start/stop timer or manual hours.', auth: true },
    { method: 'GET', path: '/api/analytics/velocity', desc: 'Velocity data: story points per sprint with trends.', auth: true },
    { method: 'GET', path: '/api/analytics/workload', desc: 'Tasks and points per team member.', auth: true },
    { method: 'POST', path: '/api/ai/estimate', desc: 'AI estimation: description in, story points out.', auth: true },
  ],
  userGuide: [
    { title: 'Sprint Workflow', id: 'sprints', content: ['Use AI sprint planning to select tasks based on velocity and priority.', 'Track via burndown chart. Deviation early signals scope issues.', 'At sprint end, velocity auto-calculates. Incomplete tasks roll over.'] },
    { title: 'Task Management', id: 'tasks', content: ['Write deliverable-focused titles, not activity descriptions.', 'Use consistent labels: feature, bug, tech-debt, docs, ops.', 'Use AI estimation to validate sprint commitments are achievable.'] },
    { title: 'Analytics', id: 'analytics', content: ['Velocity trend shows throughput. Declining may signal tech debt.', 'Workload distribution prevents burnout and single points of failure.', 'Cycle time identifies bottleneck stages in your workflow.'] },
  ],
  aiCapabilities: [
    { capability: 'Task Estimation', desc: 'NLP analysis of descriptions compared against historical tasks. Story points with confidence intervals.' },
    { capability: 'Sprint Planning', desc: 'Optimal task selection based on velocity, priorities, dependencies, and capacity.' },
    { capability: 'Bottleneck Detection', desc: 'Cycle time analysis per column. Flags accumulation points.' },
    { capability: 'Risk Forecasting', desc: 'Sprint completion probability based on velocity and remaining work.' },
  ],
  troubleshooting: [
    { issue: 'Burndown not updating', solution: 'Move completed tasks to Done column. Check sprint dates.' },
    { issue: 'AI estimation off', solution: 'Needs 2-3 sprints of data. Ensure completed tasks have story points.' },
    { issue: 'Zero velocity', solution: 'Tasks need story point values. Tasks without points excluded.' },
    { issue: 'Notifications missing', solution: 'Check project notification settings. Verify email/webhook endpoints.' },
  ],
  faq: [
    { q: 'vs Jira?', a: 'Core features without enterprise complexity. Setup in minutes. AI estimation included.' },
    { q: 'Import from Jira/Trello?', a: 'CSV import maps titles, descriptions, assignees, and labels.' },
    { q: 'Task limits?', a: 'Free: 3 projects/100 tasks. Pro: 20/1000. Enterprise: unlimited.' },
    { q: 'Multi-team?', a: 'Yes. Roles: admin, member, viewer. Cross-team projects with swimlanes.' },
    { q: 'Dependencies?', a: 'Yes. Blocked-by and blocks relationships. Board highlights blocked tasks.' },
  ],
}

export default function EchoProjectManagerDocsPage() {
  return <ProductDoc {...data} />
}
