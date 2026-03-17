/* ─── Business Manager API Client ─── */
const API_URL = 'https://echo-business-api.bmcii1976.workers.dev';

async function getToken(): Promise<string | null> {
  try {
    const { auth } = await import('./firebase');
    if (auth.currentUser) return await auth.currentUser.getIdToken();
  } catch { /* no auth available */ }
  return null;
}

async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/* ─── Types ─── */
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: 'residential' | 'commercial';
  company_name?: string;
  payment_terms?: string;
  tax_exempt?: boolean;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  duration_minutes: number;
  active: boolean;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer_name?: string;
  service_id: string;
  service_name?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  quoted_price: number;
  created_at?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'void';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  amount_paid: number;
  payment_terms: string;
  notes: string;
  items?: InvoiceItem[];
  payments?: Payment[];
  created_at?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Payment {
  id: string;
  invoice_id?: string;
  customer_id?: string;
  amount: number;
  method: string;
  reference: string;
  date: string;
  notes: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  vendor: string;
  recurring: boolean;
  notes: string;
  created_at?: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'engineer' | 'technician' | 'support' | 'sales' | 'worker' | 'lead';
  hourly_rate: number;
  hire_date: string;
  status: 'active' | 'inactive';
  notes: string;
  created_at?: string;
}

export interface HourEntry {
  id: string;
  employee_id: string;
  employee_name?: string;
  date: string;
  hours: number;
  overtime: number;
  notes: string;
  approved: boolean;
  created_at?: string;
}

export interface PayrollRun {
  id: string;
  period_start: string;
  period_end: string;
  status: 'draft' | 'approved' | 'paid';
  gross_total: number;
  deductions_total: number;
  net_total: number;
  items?: PayrollItem[];
  created_at?: string;
}

export interface PayrollItem {
  id: string;
  payroll_run_id: string;
  employee_id: string;
  employee_name?: string;
  regular_hours: number;
  overtime_hours: number;
  hourly_rate: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
}

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  text: string;
  service_type: string;
  status: 'pending' | 'approved';
  featured: boolean;
  date: string;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorder_level: number;
  unit_cost: number;
  vendor: string;
  notes: string;
  created_at?: string;
}

export interface BusinessSettings {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  tax_rate: number;
  tax_id: string;
  payment_methods: string[];
  business_hours: Record<string, { open: string; close: string; closed: boolean }>;
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_expenses: number;
  active_customers: number;
  monthly_bookings: number;
  outstanding_ar: number;
  recent_bookings: Booking[];
}

export interface RevenueData {
  monthly: { month: string; revenue: number }[];
  ytd: number;
}

export interface ExpenseAnalytics {
  monthly: { month: string; total: number }[];
  by_category: { category: string; total: number; percentage: number }[];
  ytd: number;
}

export interface ArAgingData {
  buckets: {
    label: string;
    min_days: number;
    max_days: number;
    count: number;
    total: number;
  }[];
  invoices: {
    invoice_number: string;
    customer_name: string;
    issue_date: string;
    due_date: string;
    amount: number;
    days_outstanding: number;
    bucket: string;
  }[];
}

/* ─── Customers ─── */
export const getCustomers = (search?: string) =>
  apiFetch<{ customers: Customer[] }>(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const createCustomer = (data: Partial<Customer>) =>
  apiFetch<Customer>('/customers', { method: 'POST', body: JSON.stringify(data) });
export const getCustomer = (id: string) =>
  apiFetch<Customer>(`/customers/${id}`);
export const updateCustomer = (id: string, data: Partial<Customer>) =>
  apiFetch<Customer>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCustomer = (id: string) =>
  apiFetch<{ success: boolean }>(`/customers/${id}`, { method: 'DELETE' });

/* ─── Services ─── */
export const getServiceItems = () =>
  apiFetch<{ services: ServiceItem[] }>('/services');
export const createServiceItem = (data: Partial<ServiceItem>) =>
  apiFetch<ServiceItem>('/services', { method: 'POST', body: JSON.stringify(data) });
export const updateServiceItem = (id: string, data: Partial<ServiceItem>) =>
  apiFetch<ServiceItem>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteServiceItem = (id: string) =>
  apiFetch<{ success: boolean }>(`/services/${id}`, { method: 'DELETE' });

/* ─── Bookings ─── */
export const getBookings = (status?: string) =>
  apiFetch<{ bookings: Booking[] }>(`/bookings${status ? `?status=${status}` : ''}`);
export const createBooking = (data: Partial<Booking>) =>
  apiFetch<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const getBooking = (id: string) =>
  apiFetch<Booking>(`/bookings/${id}`);
export const updateBooking = (id: string, data: Partial<Booking>) =>
  apiFetch<Booking>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const updateBookingStatus = (id: string, status: string) =>
  apiFetch<Booking>(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

/* ─── Invoices ─── */
export const getInvoices = (status?: string) =>
  apiFetch<{ invoices: Invoice[] }>(`/invoices${status ? `?status=${status}` : ''}`);
export const createInvoice = (data: Partial<Invoice>) =>
  apiFetch<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(data) });
export const getInvoice = (id: string) =>
  apiFetch<Invoice>(`/invoices/${id}`);
export const updateInvoice = (id: string, data: Partial<Invoice>) =>
  apiFetch<Invoice>(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const sendInvoice = (id: string) =>
  apiFetch<Invoice>(`/invoices/${id}/send`, { method: 'POST' });
export const voidInvoice = (id: string) =>
  apiFetch<Invoice>(`/invoices/${id}/void`, { method: 'POST' });

/* ─── Invoice Items ─── */
export const addInvoiceItem = (invoiceId: string, data: Partial<InvoiceItem>) =>
  apiFetch<InvoiceItem>(`/invoices/${invoiceId}/items`, { method: 'POST', body: JSON.stringify(data) });
export const removeInvoiceItem = (invoiceId: string, itemId: string) =>
  apiFetch<{ success: boolean }>(`/invoices/${invoiceId}/items/${itemId}`, { method: 'DELETE' });

/* ─── Payments ─── */
export const getPayments = () =>
  apiFetch<{ payments: Payment[] }>('/payments');
export const createPayment = (data: Partial<Payment>) =>
  apiFetch<Payment>('/payments', { method: 'POST', body: JSON.stringify(data) });

/* ─── Expenses ─── */
export const getExpenses = (category?: string) =>
  apiFetch<{ expenses: Expense[] }>(`/expenses${category ? `?category=${category}` : ''}`);
export const createExpense = (data: Partial<Expense>) =>
  apiFetch<Expense>('/expenses', { method: 'POST', body: JSON.stringify(data) });
export const updateExpense = (id: string, data: Partial<Expense>) =>
  apiFetch<Expense>(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteExpense = (id: string) =>
  apiFetch<{ success: boolean }>(`/expenses/${id}`, { method: 'DELETE' });

/* ─── Employees ─── */
export const getEmployees = () =>
  apiFetch<{ employees: Employee[] }>('/employees');
export const createEmployee = (data: Partial<Employee>) =>
  apiFetch<Employee>('/employees', { method: 'POST', body: JSON.stringify(data) });
export const updateEmployee = (id: string, data: Partial<Employee>) =>
  apiFetch<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });

/* ─── Hours ─── */
export const getHours = (filters?: { employee_id?: string; start?: string; end?: string }) => {
  const params = new URLSearchParams();
  if (filters?.employee_id) params.set('employee_id', filters.employee_id);
  if (filters?.start) params.set('start', filters.start);
  if (filters?.end) params.set('end', filters.end);
  const qs = params.toString();
  return apiFetch<{ hours: HourEntry[] }>(`/hours${qs ? `?${qs}` : ''}`);
};
export const logHours = (data: Partial<HourEntry>) =>
  apiFetch<HourEntry>('/hours', { method: 'POST', body: JSON.stringify(data) });
export const updateHours = (id: string, data: Partial<HourEntry>) =>
  apiFetch<HourEntry>(`/hours/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const approveHours = (id: string) =>
  apiFetch<HourEntry>(`/hours/${id}/approve`, { method: 'POST' });

/* ─── Payroll ─── */
export const getPayrollRuns = () =>
  apiFetch<{ runs: PayrollRun[] }>('/payroll');
export const createPayrollRun = (data: { period_start: string; period_end: string }) =>
  apiFetch<PayrollRun>('/payroll', { method: 'POST', body: JSON.stringify(data) });
export const getPayrollRun = (id: string) =>
  apiFetch<PayrollRun>(`/payroll/${id}`);
export const approvePayrollRun = (id: string) =>
  apiFetch<PayrollRun>(`/payroll/${id}/approve`, { method: 'POST' });

/* ─── Reviews (admin — tenant-isolated) ─── */
export const getReviews = (status?: string) => {
  const params = new URLSearchParams({ tenant: 'public' });
  if (status) params.set('status', status);
  return apiFetch<{ reviews: Review[] }>(`/reviews?${params.toString()}`);
};
export const createReview = (data: Partial<Review>) =>
  apiFetch<Review>('/reviews?tenant=public', { method: 'POST', body: JSON.stringify(data) });
export const approveReview = (id: string) =>
  apiFetch<Review>(`/reviews/${id}/approve?tenant=public`, { method: 'POST' });
export const deleteReview = (id: string) =>
  apiFetch<{ success: boolean }>(`/reviews/${id}?tenant=public`, { method: 'DELETE' });

/* ─── Reviews (public — no auth) ─── */
export const getPublicReviews = async (): Promise<{ reviews: Review[] }> => {
  const res = await fetch(`${API_URL}/public/reviews`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};
export const submitPublicReview = async (data: {
  reviewer_name: string;
  rating: number;
  text: string;
  service_type?: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/public/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error: string }).error || `API ${res.status}`);
  }
  return res.json();
};

/* ─── Inventory ─── */
export const getInventory = (category?: string) =>
  apiFetch<{ items: InventoryItem[] }>(`/inventory${category ? `?category=${category}` : ''}`);
export const createInventoryItem = (data: Partial<InventoryItem>) =>
  apiFetch<InventoryItem>('/inventory', { method: 'POST', body: JSON.stringify(data) });
export const updateInventoryItem = (id: string, data: Partial<InventoryItem>) =>
  apiFetch<InventoryItem>(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInventoryItem = (id: string) =>
  apiFetch<{ success: boolean }>(`/inventory/${id}`, { method: 'DELETE' });
export const restockItem = (id: string, data: { quantity: number; cost_per_unit: number; supplier?: string }) =>
  apiFetch<InventoryItem>(`/inventory/${id}/restock`, { method: 'POST', body: JSON.stringify(data) });

/* ─── Quotes (uses Invoice endpoints with quote prefix) ─── */
export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  customer_name?: string;
  issue_date: string;
  valid_until: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  notes: string;
  items?: QuoteItem[];
  created_at?: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export const getQuotes = (status?: string) =>
  apiFetch<{ quotes: Quote[] }>(`/quotes${status ? `?status=${status}` : ''}`);
export const createQuote = (data: Partial<Quote>) =>
  apiFetch<Quote>('/quotes', { method: 'POST', body: JSON.stringify(data) });
export const getQuote = (id: string) =>
  apiFetch<Quote>(`/quotes/${id}`);
export const updateQuote = (id: string, data: Partial<Quote>) =>
  apiFetch<Quote>(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteQuote = (id: string) =>
  apiFetch<{ success: boolean }>(`/quotes/${id}`, { method: 'DELETE' });
export const sendQuote = (id: string) =>
  apiFetch<Quote>(`/quotes/${id}/send`, { method: 'POST' });
export const approveQuote = (id: string) =>
  apiFetch<Quote>(`/quotes/${id}/approve`, { method: 'POST' });
export const convertQuoteToInvoice = (id: string) =>
  apiFetch<Invoice>(`/quotes/${id}/convert`, { method: 'POST' });

/* ─── Settings ─── */
export const getSettings = () =>
  apiFetch<BusinessSettings>('/settings');
export const updateSetting = (key: string, value: unknown) =>
  apiFetch<{ success: boolean }>('/settings', { method: 'PUT', body: JSON.stringify({ key, value }) });

/* ─── Analytics ─── */
export const getSummary = () =>
  apiFetch<AnalyticsSummary>('/analytics/summary');
export const getRevenue = () =>
  apiFetch<RevenueData>('/analytics/revenue');
export const getExpenseAnalytics = () =>
  apiFetch<ExpenseAnalytics>('/analytics/expenses');
export const getArAging = () =>
  apiFetch<ArAgingData>('/analytics/ar-aging');
