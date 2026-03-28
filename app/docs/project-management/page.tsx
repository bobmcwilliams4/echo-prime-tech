'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Project Management',
  tagline: 'AI-powered Kanban boards, sprint planning, time tracking, and workload analytics for teams that ship.',
  accent: '#3b82f6',
  productUrl: '/project-management',
  workerUrl: 'echo-project-management.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Project Management is a complete project and task tracking platform built for teams that value speed over ceremony. It combines visual Kanban boards, Scrum sprint planning, built-in time tracking, and AI-powered task analysis into a single tool — without the bloat of legacy project management software.',
    'AI analyzes every task you create, estimating complexity via story points, identifying risks, and surfacing similar past tasks from your project history. This means sprint planning is driven by real data, not gut feelings. Burndown charts and workload reports give you full visibility into who is doing what and whether you are on track.',
    'Pricing starts at free for small teams (2 projects, unlimited tasks) and scales to $39/mo for businesses needing advanced analytics, custom workflows, portfolio views, and audit logs. No per-seat pricing traps — one flat monthly rate covers your entire team.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your First Project', desc: 'Sign up and create a project with a name, description, start date, and optional budget. Each project is an independent workspace with its own boards and settings.' },
    { step: 2, title: 'Set Up a Kanban Board', desc: 'Add columns to match your workflow (e.g., Backlog, In Progress, Review, Done). Set WIP limits on columns to prevent overload and keep work flowing smoothly.' },
    { step: 3, title: 'Add Tasks', desc: 'Create tasks with titles, descriptions, priorities (low/medium/high/critical), assignees, due dates, story points, and labels. Break complex items into subtasks for detailed tracking.' },
    { step: 4, title: 'Plan a Sprint', desc: 'If using Scrum, create a sprint with a start/end date and pull tasks from the backlog. The AI estimates total story points and flags risks based on your team velocity history.' },
    { step: 5, title: 'Track and Ship', desc: 'Drag tasks across columns, log time entries, review burndown charts, and use the project dashboard to monitor progress across all active projects.' },
  ],
  features: [
    { title: 'Kanban Boards', desc: 'Visual drag-and-drop boards with customizable columns, WIP limits, and color coding. See your entire workflow at a glance and move tasks with a single click.' },
    { title: 'Task Management', desc: 'Create tasks with titles, descriptions, priorities, assignees, due dates, story points, and labels. Subtasks allow detailed work breakdown for complex items.' },
    { title: 'Multiple Projects', desc: 'Manage unlimited projects (Team tier+) with status tracking, budgets, start/end dates, and project-level reporting. Archive completed projects to keep your workspace clean.' },
    { title: 'Sprint Planning', desc: 'Scrum boards with sprint velocity tracking, burndown charts, and story point estimation. Plan sprints using historical data instead of guesswork.' },
    { title: 'Time Tracking', desc: 'Log hours directly on tasks. View time reports by team member, project, or date range. Compare estimated vs. actual hours to improve future planning.' },
    { title: 'AI Task Analysis', desc: 'AI estimates task complexity, identifies risks, and finds similar past tasks. Get intelligent suggestions for breaking down large work items into manageable pieces.' },
    { title: 'Priority Management', desc: 'Four priority levels (low, medium, high, critical) with visual indicators. Filter and sort by priority to focus your team on what matters most.' },
    { title: 'Labels & Tags', desc: 'Create custom labels with colors to categorize tasks by type, component, epic, or any taxonomy. Filter boards by label for focused views.' },
    { title: 'Comments & Activity', desc: 'Discussion threads on every task with full activity logs that track all changes — who moved what, when, and why.' },
    { title: 'Workload Reports', desc: 'See task distribution across team members. Identify overloaded and underutilized people. Balance work before burnout becomes a problem.' },
    { title: 'Burndown Charts', desc: 'Track remaining work over time with burndown and burnup charts. Compare actual progress against the ideal line to know if deadlines are realistic.' },
    { title: 'Project Dashboard', desc: 'Overview of active projects, tasks by status, overdue items, team workload, and recent activity — one screen, full visibility.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/projects', desc: 'List all projects for the authenticated user with status, budget, and task counts.', auth: true },
    { method: 'POST', path: '/api/projects', desc: 'Create a new project with name, description, start/end dates, and budget.', auth: true },
    { method: 'GET', path: '/api/projects/:id/boards', desc: 'List all boards within a project, including columns and WIP limits.', auth: true },
    { method: 'GET', path: '/api/projects/:id/tasks', desc: 'List all tasks in a project with filtering by status, priority, assignee, and label.', auth: true },
    { method: 'POST', path: '/api/tasks', desc: 'Create a new task with title, description, priority, assignee, due date, story points, and labels.', auth: true },
    { method: 'PUT', path: '/api/tasks/:id', desc: 'Update task fields including status, column position, priority, assignee, and story points.', auth: true },
    { method: 'POST', path: '/api/tasks/:id/time', desc: 'Log a time entry against a task with hours, date, and optional description.', auth: true },
    { method: 'GET', path: '/api/projects/:id/burndown', desc: 'Get burndown chart data for a sprint or project date range.', auth: true },
    { method: 'POST', path: '/api/tasks/:id/analyze', desc: 'Trigger AI analysis on a task to estimate complexity, risks, and find similar past tasks.', auth: true },
    { method: 'GET', path: '/api/reports/workload', desc: 'Get team workload distribution showing task counts and hours by member.', auth: true },
  ],
  userGuide: [
    { title: 'Board Management', id: 'board-management', content: [
      'Each project can have multiple boards — use a Kanban board for continuous flow work and a Scrum board for sprint-based iterations. Switch between methodologies anytime without losing data.',
      'Columns are fully customizable. Add, rename, reorder, or remove columns to match your workflow. Set WIP (Work In Progress) limits on any column to signal when the team should finish existing work before pulling new items.',
      'Color-code columns for quick visual scanning. The board view updates in real time as team members drag tasks between columns.',
    ]},
    { title: 'Sprint Workflow', id: 'sprint-workflow', content: [
      'Create a sprint by setting a start and end date, then drag tasks from the backlog into the sprint. The AI calculates total story points and compares them against your historical velocity to predict whether the sprint is overcommitted.',
      'During the sprint, the burndown chart updates daily. If the actual line is above the ideal line, your team may need to cut scope or add capacity. After the sprint, incomplete tasks automatically roll back to the backlog.',
      'Sprint retrospective data is saved and available in reports so you can track velocity trends over multiple sprints and continuously improve planning accuracy.',
    ]},
    { title: 'Time Tracking', id: 'time-tracking', content: [
      'Log time directly on any task by entering the hours spent, the date, and an optional description of the work performed. Time entries are attributed to the logged-in user.',
      'Time reports can be filtered by person, project, date range, or label. Compare estimated hours (set when creating the task) against actual hours to identify estimation patterns and improve accuracy over time.',
      'Export time data for invoicing, payroll, or external reporting. The API provides programmatic access to all time entries for integration with accounting tools.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Task Complexity Estimation', desc: 'AI analyzes task titles, descriptions, and historical context to estimate story points. Suggestions are based on your team past performance with similar work.' },
    { capability: 'Risk Identification', desc: 'Automatically flags tasks with potential risks such as unclear scope, missing dependencies, unusually high complexity, or tight deadlines relative to estimated effort.' },
    { capability: 'Similar Task Discovery', desc: 'Searches your project history to find tasks with similar descriptions. See how long they took, what issues arose, and use that data to plan more accurately.' },
    { capability: 'Sprint Overcommitment Warning', desc: 'Compares total sprint story points against historical velocity and alerts when a sprint is likely overcommitted, helping teams set realistic goals.' },
  ],
  troubleshooting: [
    { issue: 'Tasks are not appearing on the board', solution: 'Verify the task is assigned to the correct project and board. Check active filters — priority, label, or assignee filters may be hiding tasks. Clear all filters and refresh the page.' },
    { issue: 'Burndown chart shows no data', solution: 'Burndown charts require a sprint with a defined start and end date. Ensure at least one task has story points assigned and that the sprint has been started (not just created).' },
    { issue: 'WIP limit warning is not triggering', solution: 'WIP limits only apply to Kanban board columns. Verify you have set a numeric WIP limit on the column in the board settings. The warning triggers when the column task count exceeds the limit.' },
    { issue: 'Time entries not appearing in reports', solution: 'Ensure the time entry has a valid date within the selected report date range. Time entries logged by users outside your project team will not appear unless they have project access.' },
  ],
  faq: [
    { q: 'How does the AI task analysis work?', a: 'When you create or update a task, the AI analyzes the title, description, and context to estimate complexity (story points), identify potential risks, and find similar past tasks from your project history. It helps you plan more accurately based on real data.' },
    { q: 'Can I use both Kanban and Scrum?', a: 'Yes. Each project can have multiple boards. Create a Kanban board for continuous work and a Scrum board for sprint-based work. Switch between views anytime. Different teams can use different methodologies within the same project.' },
    { q: 'How does time tracking work?', a: 'Team members log hours directly on tasks — enter the time, date, and optional description. Reports show time by person, project, or date range. Compare estimated hours vs. actual to improve future estimates.' },
    { q: 'What are WIP limits?', a: 'Work In Progress limits set a maximum number of tasks allowed in a board column. When a column hits its limit, it signals the team to finish existing work before starting new tasks, preventing overload and improving flow.' },
    { q: 'Is there per-seat pricing?', a: 'No. Echo Project Management uses flat monthly pricing — $15/mo for Team, $39/mo for Business. Your entire team is covered under one subscription with no per-user fees.' },
    { q: 'Can I create subtasks?', a: 'Yes. Any task can have subtasks for breaking down complex work. Subtasks have their own assignees, priorities, and due dates while being linked to the parent task. Progress rolls up automatically.' },
  ],
}

export default function ProjectManagementDocsPage() {
  return <ProductDoc {...data} />
}
