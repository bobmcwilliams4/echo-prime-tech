'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo HR Management',
  tagline: 'AI-powered people management: employee directory, time-off tracking, performance reviews, org charts, and compensation analytics.',
  accent: '#8b5cf6',
  productUrl: '/hr-management',
  workerUrl: 'echo-hr-management.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo HR Management is a complete people management platform that handles employee directory, time-off tracking, performance reviews, and organizational analytics. The AI Review Assistant generates structured performance reviews by analyzing employee data, saving managers hours of writing time each review cycle.',
    'The system organizes employees by department with managers, budgets, and headcount tracking. Position levels with salary bands from junior to C-suite ensure compensation equity. The org chart is auto-generated from manager-employee relationships and updates instantly when teams reorganize.',
    'At $25/mo for up to 25 employees, Echo HR delivers features that competitors like BambooHR, Gusto, and Rippling gate behind premium tiers. AI review writing, compensation analytics, full REST API access, and 10-minute setup time — without the enterprise price tag or multi-week onboarding.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Organization', desc: 'Sign up for a Startup plan at $25/mo (25 employees), Growth at $69/mo (100 employees), or Enterprise at $179/mo (unlimited). Free trial on all tiers.' },
    { step: 2, title: 'Set Up Departments', desc: 'Create your department structure with names, managers, and optional budgets. This forms the foundation of your org chart and reporting hierarchy.' },
    { step: 3, title: 'Add Employees', desc: 'Enter employee profiles with contact info, department, position, salary, manager assignment, and employment type (full-time, part-time, contract, intern).' },
    { step: 4, title: 'Configure Time-Off Policies', desc: 'Set up time-off types (vacation, sick, personal, parental, bereavement) and approval workflows. Employees can start submitting requests immediately.' },
    { step: 5, title: 'Start Your First Review Cycle', desc: 'Create a performance review cycle, assign reviewers, and let the AI Review Assistant help managers draft structured evaluations.' },
  ],
  features: [
    { title: 'Employee Directory', desc: 'Complete employee profiles with contact info, department, position, salary, manager, and employment history. Search and filter across the entire org.' },
    { title: 'Department Management', desc: 'Organize employees by department with managers, budgets, and headcount tracking. Visualize org structure at a glance.' },
    { title: 'Position & Levels', desc: 'Define positions with salary bands from junior to C-suite. Track career progression and ensure compensation equity across the organization.' },
    { title: 'Time-Off Management', desc: 'Employees request vacation, sick, personal, parental, or bereavement leave. Managers approve with one click. Calendar shows team availability.' },
    { title: 'Performance Reviews', desc: 'Structured review cycles with ratings, strengths, areas for improvement, and goals. Track from draft to submission to acknowledgment.' },
    { title: 'AI Review Assistant', desc: 'AI generates review summaries by analyzing employee performance data, goals completion, and peer feedback. Saves hours on review writing.' },
    { title: 'Employee Documents', desc: 'Store contracts, NDAs, tax forms, and certifications per employee. Organized by document type with upload tracking.' },
    { title: 'Org Chart View', desc: 'See the full organizational hierarchy auto-generated from manager-employee relationships. Click any manager to see direct reports.' },
    { title: 'Headcount Reports', desc: 'Track headcount by department, employment type, and status. See growth trends and plan for hiring needs.' },
    { title: 'Compensation Analytics', desc: 'Salary statistics by department and position level. Identify pay gaps, benchmark against salary bands, and ensure equity.' },
    { title: 'Turnover Reports', desc: 'Track employee turnover rate, average tenure, and departure patterns. Identify retention risks before they become problems.' },
    { title: 'HR Dashboard', desc: 'One-screen view of total employees, open positions, pending time-off requests, upcoming reviews, and recent hires and departures.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/employees', desc: 'List all employees with filters for department, status, position, and employment type.', auth: true },
    { method: 'POST', path: '/api/employees', desc: 'Create a new employee profile with contact info, department, position, and salary.', auth: true },
    { method: 'GET', path: '/api/employees/:id', desc: 'Get full employee profile including employment history and documents.', auth: true },
    { method: 'GET', path: '/api/departments', desc: 'List all departments with managers, headcounts, and budget utilization.', auth: true },
    { method: 'POST', path: '/api/time-off', desc: 'Submit a time-off request with type, dates, and reason.', auth: true },
    { method: 'PUT', path: '/api/time-off/:id/approve', desc: 'Approve or deny a time-off request with optional manager notes.', auth: true },
    { method: 'POST', path: '/api/reviews', desc: 'Create a performance review for an employee with ratings, strengths, and goals.', auth: true },
    { method: 'POST', path: '/api/reviews/ai-generate', desc: 'Generate an AI-assisted review draft based on employee performance data.', auth: true },
    { method: 'GET', path: '/api/reports/compensation', desc: 'Salary statistics by department and position level for pay equity analysis.', auth: true },
    { method: 'GET', path: '/api/reports/turnover', desc: 'Turnover rate, average tenure, and departure pattern analytics.', auth: true },
    { method: 'GET', path: '/api/org-chart', desc: 'Full organizational hierarchy tree for org chart rendering.', auth: true },
    { method: 'GET', path: '/health', desc: 'Worker health check endpoint.', auth: false },
  ],
  userGuide: [
    { title: 'Employee Onboarding', id: 'onboarding', content: [
      'Add new employees from the Directory page with their full profile: name, email, phone, department, position, salary, manager, hire date, and employment type. The employee immediately appears in department headcounts and org chart.',
      'Upload onboarding documents (contracts, NDAs, tax forms) to the employee\'s document section. Each document is tagged by type with upload date tracking for compliance purposes.',
    ]},
    { title: 'Time-Off Workflows', id: 'time-off', content: [
      'Employees submit time-off requests by selecting the type (vacation, sick, personal, parental, bereavement), entering dates, and providing an optional reason. Their direct manager receives a notification.',
      'Managers review requests from the Time-Off queue. One-click approve or deny with optional notes. Approved time-off appears on the team calendar so everyone can see who is available on any given day.',
    ]},
    { title: 'Performance Review Cycles', id: 'reviews', content: [
      'Create a review cycle by selecting the review period, assigning reviewers, and setting a deadline. Managers write reviews with structured fields: overall rating, strengths, areas for improvement, and goals for the next period.',
      'The AI Review Assistant can draft the review by analyzing the employee\'s position, tenure, historical goals, and any recorded notes. Managers edit and personalize the AI draft before submitting. Reviews track through draft, submitted, and acknowledged statuses.',
    ]},
    { title: 'Org Chart Navigation', id: 'org-chart', content: [
      'The org chart is automatically built from manager-employee relationships defined in employee profiles. Navigate by clicking any person to see their profile and direct reports.',
      'When you change an employee\'s manager assignment, the org chart updates instantly. This makes team reorganizations simple — just update the manager field on affected employees.',
    ]},
    { title: 'Compensation Analysis', id: 'compensation', content: [
      'The compensation analytics view shows salary statistics by department and position level: minimum, maximum, median, and average. Compare actual salaries against the salary bands defined for each position level.',
      'Use this data during annual compensation reviews to identify pay gaps, ensure equity across teams, and benchmark salaries against your defined bands from junior through C-suite levels.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'AI Review Assistant', desc: 'Generates structured performance review drafts by analyzing employee position, tenure, goals completion, and recorded notes. Produces ratings, strengths, improvement areas, and suggested goals.' },
    { capability: 'Turnover Risk Detection', desc: 'Analyzes employee tenure patterns, department turnover rates, and departure timing to identify retention risks before they escalate.' },
    { capability: 'Compensation Equity Analysis', desc: 'Compares actual salaries against position-level salary bands across departments to flag pay gaps and ensure equitable compensation.' },
    { capability: 'Headcount Forecasting', desc: 'Projects future hiring needs based on growth trends, turnover patterns, and department budget utilization.' },
  ],
  troubleshooting: [
    { issue: 'Org chart not displaying correctly', solution: 'Verify that all employees have a manager assigned in their profile. Employees without a manager assignment appear as disconnected nodes. Check for circular manager references.' },
    { issue: 'AI review generation returns generic content', solution: 'The AI produces better reviews when employee profiles include goals, notes, and historical review data. Add more context to the employee profile before generating.' },
    { issue: 'Time-off request stuck in pending', solution: 'Verify the employee\'s direct manager has system access and has received the notification. If the manager is on leave, reassign the approval to an alternate reviewer.' },
    { issue: 'Compensation report shows incomplete data', solution: 'Ensure all employees have salary and position level fields populated. Employees with missing salary data are excluded from compensation analytics.' },
    { issue: 'Employee not appearing in department headcount', solution: 'Check that the employee\'s status is set to Active and they are assigned to a department. Terminated or inactive employees are excluded from headcount reports.' },
  ],
  faq: [
    { q: 'How does the AI review assistant work?', a: 'When writing a review, the AI analyzes the employee\'s position, tenure, goals, and recorded notes. It generates a structured review with ratings, strengths, improvement areas, and suggested goals — editable before submission.' },
    { q: 'How does time-off management work?', a: 'Employees submit requests with type, dates, and reason. Their manager approves or denies with one click. Approved time-off shows on the team calendar for visibility.' },
    { q: 'Can I track different employment types?', a: 'Yes. Track full-time, part-time, contract, and intern employees with different positions, salary structures, and benefits. Filter reports by employment type.' },
    { q: 'How does the org chart work?', a: 'Auto-generated from manager-employee relationships. Click any person to see their profile and direct reports. Updates instantly when you change manager assignments.' },
    { q: 'Is employee data secure?', a: 'All data stored in Cloudflare D1 with encrypted connections. Write operations require API key authentication. Employee data is isolated per tenant with data minimization principles.' },
    { q: 'What plans are available?', a: 'Startup at $25/mo (25 employees), Growth at $69/mo (100 employees, AI features, compensation analytics), and Enterprise at $179/mo (unlimited employees, compliance reporting, multi-location).' },
  ],
}

export default function HrManagementDocsPage() {
  return <ProductDoc {...data} />
}
