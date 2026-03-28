'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Finance',
  tagline: 'AI-powered personal finance: multi-account tracking, auto-categorization, budgets, goals, and spending insights.',
  accent: '#059669',
  productUrl: '/finance',
  workerUrl: 'echo-finance.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Finance is a comprehensive personal and business finance platform that replaces Mint with a modern, AI-powered alternative. Track checking, savings, credit, and investment accounts in one dashboard with real-time balances, automatic transaction categorization, and actionable spending insights.',
    'Set monthly budgets by category with real-time utilization tracking, create financial goals with deadline-based progress bars, and manage recurring payments with automatic processing. The AI analyzes your 30-day spending patterns and delivers personalized tips for saving money and optimizing your budget.',
    'Built as a multi-tenant SaaS on Cloudflare, Echo Finance provides full REST API access, no ads, and no data selling. Financial advisors can manage multiple clients with isolated data. All write operations require API key authentication, and your financial data is never shared or monetized.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up for a Personal plan at $12/mo or Pro plan at $29/mo with AI features. All plans include unlimited transactions.' },
    { step: 2, title: 'Add Your Accounts', desc: 'Create checking, savings, credit card, and investment accounts with opening balances. Personal plan supports 3 accounts; Pro and Business are unlimited.' },
    { step: 3, title: 'Log Transactions', desc: 'Enter income and expenses with categories, payees, dates, and tags. Pro plan users get AI auto-categorization that handles this automatically.' },
    { step: 4, title: 'Set Budgets', desc: 'Configure monthly budgets by category. The dashboard shows real-time spending as a percentage of each budget with alerts at 80% utilization.' },
    { step: 5, title: 'Create Financial Goals', desc: 'Set savings targets with deadlines for emergency fund, vacation, home down payment, or any objective. Track progress with visual bars.' },
  ],
  features: [
    { title: 'Multi-Account Tracking', desc: 'Track checking, savings, credit, and investment accounts with real-time balances. Connect all financial accounts in one dashboard.' },
    { title: 'Smart Transactions', desc: 'Log income and expenses with categories, payees, dates, and tags. Filter by account, category, type, and date range with instant search.' },
    { title: 'AI Auto-Categorization', desc: 'AI analyzes transaction descriptions and payees to automatically categorize spending into 15+ categories without manual tagging.' },
    { title: 'Budget Tracking', desc: 'Set monthly budgets by category with real-time spending tracking. See percent used, remaining balance, and alerts at custom thresholds (default 80%).' },
    { title: 'Financial Goals', desc: 'Set savings targets with deadlines. Track progress toward emergency fund, vacation, home down payment, or any goal with visual progress bars.' },
    { title: 'Recurring Payments', desc: 'Track subscriptions and recurring bills with auto-processing. Weekly, biweekly, monthly, quarterly, or yearly frequencies with automatic account deductions.' },
    { title: 'AI Spending Insights', desc: 'AI analyzes 30-day spending patterns and provides actionable tips on savings opportunities, spending anomalies, and budget alerts.' },
    { title: 'Financial Reports', desc: 'Summary reports with income vs expenses, net savings, and savings rate. Category breakdowns and monthly trend analysis up to 12 months.' },
    { title: 'Dashboard Overview', desc: 'One-screen view of total balance, all accounts, recent transactions, upcoming recurring payments, and active goals with progress.' },
    { title: 'Transaction Search', desc: 'Full-text search across descriptions, payees, and categories. Filter by date range, account, type (income/expense), and tags.' },
    { title: 'Monthly Trends', desc: 'Track income and expense trends over time with monthly aggregation. Spot patterns, seasonal changes, and long-term financial trajectory.' },
    { title: 'Multi-Tenant SaaS', desc: 'Built for businesses and families. Each tenant gets isolated data with full API access. Perfect for financial advisors managing multiple clients.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/api/accounts', desc: 'List all financial accounts with current balances and account types.', auth: true },
    { method: 'POST', path: '/api/accounts', desc: 'Create a new financial account (checking, savings, credit, investment).', auth: true },
    { method: 'GET', path: '/api/transactions', desc: 'List transactions with filters for account, category, type, date range, and search.', auth: true },
    { method: 'POST', path: '/api/transactions', desc: 'Create a new transaction with automatic AI categorization (Pro plan).', auth: true },
    { method: 'GET', path: '/api/budgets', desc: 'Retrieve budget status with utilization percentages by category.', auth: true },
    { method: 'POST', path: '/api/budgets', desc: 'Create or update a monthly budget for a spending category.', auth: true },
    { method: 'GET', path: '/api/goals', desc: 'List financial goals with current progress and projected completion dates.', auth: true },
    { method: 'GET', path: '/api/insights', desc: 'Get AI-generated 30-day spending insights with actionable recommendations.', auth: true },
    { method: 'GET', path: '/api/reports/summary', desc: 'Financial summary with income, expenses, net savings, and savings rate.', auth: true },
    { method: 'GET', path: '/api/reports/trends', desc: 'Monthly income and expense trends for up to 12 months.', auth: true },
    { method: 'GET', path: '/health', desc: 'Worker health check endpoint.', auth: false },
  ],
  userGuide: [
    { title: 'Managing Accounts', id: 'accounts', content: [
      'Add each of your financial accounts (checking, savings, credit cards, investments) with the account name, institution, type, and opening balance. Account balances update automatically as you log transactions.',
      'The dashboard displays all accounts with real-time balances and a total net worth calculation. Click any account to see its transaction history and filter by date or category.',
    ]},
    { title: 'Transaction Management', id: 'transactions', content: [
      'Log each income or expense with the amount, payee, category, date, and optional tags. Pro plan users benefit from AI auto-categorization that classifies transactions into 15+ categories based on description and payee.',
      'Use the search bar to find transactions instantly by description, payee, or category. Apply filters for date range, account, and transaction type to narrow results.',
    ]},
    { title: 'Budgets and Alerts', id: 'budgets', content: [
      'Set monthly spending limits for categories like housing, food, transport, and entertainment. The budget view shows a progress bar for each category with the percentage consumed.',
      'When spending reaches your alert threshold (default 80%), you receive a notification. Categories that exceed their budget are highlighted so you can adjust spending before the month ends.',
    ]},
    { title: 'Recurring Payments', id: 'recurring', content: [
      'Add subscriptions and recurring bills with their frequency (weekly, biweekly, monthly, quarterly, yearly) and linked account. The daily cron job automatically creates transactions and deducts from the account when payments are due.',
      'The dashboard shows upcoming recurring payments so you know what is due next. Pause or cancel recurring entries at any time without affecting historical transactions.',
    ]},
    { title: 'AI Spending Insights', id: 'insights', content: [
      'The AI analyzes your last 30 days of transactions by category and type. It produces 3-5 actionable insights: warnings about overspending categories, tips for saving money, alerts about unusual activity, and reinforcement for good financial habits.',
      'Insights refresh automatically as new transactions are added. Use them to guide monthly budget adjustments and identify long-term savings opportunities.',
    ]},
  ],
  aiCapabilities: [
    { capability: 'Auto-Categorization', desc: 'Classifies transactions into 15+ spending categories (housing, utilities, food, transport, health, entertainment, etc.) using Engine Runtime financial models.' },
    { capability: 'Spending Insights', desc: 'Analyzes 30 days of transaction data to produce 3-5 actionable tips covering overspending alerts, savings opportunities, anomaly detection, and positive habit reinforcement.' },
    { capability: 'Budget Forecasting', desc: 'Projects end-of-month spending based on current trajectory and warns when categories are on pace to exceed their budget before the period ends.' },
    { capability: 'Goal Progress Estimation', desc: 'Calculates projected completion dates for financial goals based on current savings rate and suggests adjustments to meet deadlines.' },
  ],
  troubleshooting: [
    { issue: 'AI categorization assigns wrong category', solution: 'Manually change the category on the transaction. The AI uses description and payee text for classification. Over time, consistent corrections improve accuracy for similar transactions.' },
    { issue: 'Recurring payment not auto-processing', solution: 'Verify the recurring entry is set to Active status and the linked account exists. Check that the next payment date has not been set to a future date beyond the current processing window.' },
    { issue: 'Budget utilization shows 0%', solution: 'Ensure transactions in that category are logged for the current budget period. Verify the budget category name matches the transaction category exactly.' },
    { issue: 'Account balance incorrect', solution: 'Account balances are calculated from the opening balance plus all logged transactions. Review the transaction list for the account and check for missing or duplicate entries.' },
    { issue: 'Insights not appearing', solution: 'AI insights require at least 10 transactions in the last 30 days to generate meaningful analysis. Log more transactions and check again.' },
  ],
  faq: [
    { q: 'How does AI auto-categorization work?', a: 'When you add a transaction, our AI analyzes the description and payee against 15+ spending categories using the Engine Runtime with trained financial models. No manual tagging needed.' },
    { q: 'What types of accounts can I track?', a: 'Checking, savings, credit cards, investment, cash, and custom account types. Each account tracks its own balance, currency, and institution with automatic balance updates.' },
    { q: 'How do recurring payments work?', a: 'Add recurring bills with their frequency (weekly, biweekly, monthly, quarterly, yearly). A daily cron automatically creates transactions and deducts from the linked account when due.' },
    { q: 'Is my financial data secure?', a: 'All data is stored in Cloudflare D1 with encrypted connections. Write operations require API key authentication. We never store bank credentials, sell data, or show ads.' },
    { q: 'What plans are available?', a: 'Personal at $12/mo (3 accounts, budgets, goals), Pro at $29/mo (unlimited accounts, AI features, API access), and Business at $79/mo (multi-user, advanced analytics, webhooks).' },
  ],
}

export default function FinanceDocsPage() {
  return <ProductDoc {...data} />
}
