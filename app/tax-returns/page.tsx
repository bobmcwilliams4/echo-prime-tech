'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import {
  createClient, getClient, listClients, createReturn, getReturn, listReturns,
  addIncome, deleteIncome, addDeduction, deleteDeduction, addDependent, deleteDependent,
  uploadDocument, calculateReturn, getOptimizations, getReturnForms,
  getPricing, createCheckout, healthCheck, updateReturnStatus,
  getAuditRisk, whatIf, getStrategy, getTrend, getSelfEmploymentTax,
  getSafeHarbor, getStateTax, getBracketAnalysis, getPenaltyEstimate,
  getKeyNumbers, getTaxCalendar, getPreparerDashboard, getAuditLog,
  getReturnSummary, getDocumentChecklist, getDeductionOpportunities,
  getClientSummary, getReturnTimeline, searchTaxKnowledge, validateReturn,
  lockReturn, getLockStatus, getReturnHealth, getWithholdingEstimate,
  addNote, getNotes, getEngagementLetter, exportReturn, getIncomeAnalysis,
  type Client, type TaxReturn, type IncomeItem, type Deduction,
  type Dependent, type TaxDocument, type Optimization, type TaxCalculation,
  type PricingTier,
} from '../../lib/tax-return-api';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';
import SubscriptionGate from '../../components/SubscriptionGate';
import ProductTutorialButton from '../../components/product-tutorial-button';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import FaqSchema from '../../components/FaqSchema';

// ===============================================================
// TYPES
// ===============================================================

type Tab = 'hero' | 'intake' | 'documents' | 'dashboard' | 'strategy' | 'forms' | 'tools' | 'status' | 'admin';
type IntakeStep = 1 | 2 | 3;

const FILING_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
  { value: 'widow', label: 'Qualifying Surviving Spouse' },
];

const DOC_TYPES = [
  { value: 'w2', label: 'W-2 (Wages)' },
  { value: '1099_int', label: '1099-INT (Interest)' },
  { value: '1099_div', label: '1099-DIV (Dividends)' },
  { value: '1099_nec', label: '1099-NEC (Self-Employment)' },
  { value: '1099_misc', label: '1099-MISC (Miscellaneous)' },
  { value: '1099_b', label: '1099-B (Stocks/Investments)' },
  { value: '1099_r', label: '1099-R (Retirement)' },
  { value: '1099_ssa', label: 'SSA-1099 (Social Security)' },
  { value: '1099_g', label: '1099-G (Unemployment)' },
  { value: 'receipt', label: 'Receipt / Other' },
];

const INCOME_CATEGORIES = [
  { value: 'wages', label: 'Wages / Salary' },
  { value: 'interest', label: 'Interest' },
  { value: 'dividends', label: 'Dividends' },
  { value: 'business', label: 'Business / Self-Employment' },
  { value: 'capital_gains', label: 'Capital Gains' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'retirement', label: 'Retirement / Pension' },
  { value: 'social_security', label: 'Social Security' },
  { value: 'other', label: 'Other Income' },
];

const DEDUCTION_CATEGORIES = [
  { value: 'medical', label: 'Medical Expenses' },
  { value: 'salt', label: 'State & Local Taxes (SALT)' },
  { value: 'mortgage_interest', label: 'Mortgage Interest' },
  { value: 'charitable', label: 'Charitable Donations' },
  { value: 'student_loan', label: 'Student Loan Interest' },
  { value: 'ira', label: 'IRA Contribution' },
  { value: 'hsa', label: 'HSA Contribution' },
  { value: 'educator', label: 'Educator Expenses' },
  { value: 'business_expense', label: 'Business Expense' },
];

const STATUS_STEPS = ['intake', 'documents', 'calculating', 'review', 'filed', 'accepted'];

const TAB_ITEMS: { id: Tab; label: string }[] = [
  { id: 'hero', label: 'Overview' },
  { id: 'intake', label: 'Intake' },
  { id: 'documents', label: 'Documents' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'forms', label: 'Forms' },
  { id: 'tools', label: 'Tools' },
  { id: 'status', label: 'Status' },
  { id: 'admin', label: 'Admin' },
];

// ===============================================================
// COMPONENT
// ===============================================================

function TaxReturnPageContent() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<Tab>('hero');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Client state
  const [client, setClient] = useState<Client | null>(null);
  const [taxReturn, setTaxReturn] = useState<TaxReturn | null>(null);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [pricing, setPricing] = useState<PricingTier[]>([]);

  // Advanced state
  const [auditRisk, setAuditRisk] = useState<any>(null);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [bracketData, setBracketData] = useState<any>(null);
  const [penaltyData, setPenaltyData] = useState<any>(null);
  const [keyNumbers, setKeyNumbers] = useState<any>(null);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [auditLog, setAuditLog] = useState<any>(null);
  const [seTaxData, setSeTaxData] = useState<any>(null);
  const [safeHarborData, setSafeHarborData] = useState<any>(null);
  const [deductionOps, setDeductionOps] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  const [whatIfForm, setWhatIfForm] = useState({ field: 'income', amount: '' });
  const [notes, setNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [returnList, setReturnList] = useState<TaxReturn[]>([]);
  const [knowledgeQuery, setKnowledgeQuery] = useState('');
  const [knowledgeResults, setKnowledgeResults] = useState<any>(null);

  // Intake form
  const [intakeStep, setIntakeStep] = useState<IntakeStep>(1);
  const [form, setForm] = useState({
    first_name: '', middle_name: '', last_name: '', suffix: '', email: '', ssn: '', dob: '', phone: '',
    address_street: '', address_city: '', address_state: '', address_zip: '',
    filing_status: 'single', tax_year: 2025,
  });

  // Income form
  const [incomeForm, setIncomeForm] = useState({ category: 'wages', description: '', amount: '', tax_withheld: '' });
  // Deduction form
  const [deductionForm, setDeductionForm] = useState({ category: 'charitable', description: '', amount: '' });
  // Dependent form
  const [depForm, setDepForm] = useState({ first_name: '', last_name: '', dob: '', relationship: '', qualifies_ctc: true, qualifies_odc: false });
  // Document upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('w2');
  const [uploadIssuer, setUploadIssuer] = useState('');

  // Restore session from localStorage on mount
  useEffect(() => {
    getPricing().then(setPricing).catch(() => {});
    try {
      const saved = localStorage.getItem('ept-tax-session');
      if (saved) {
        const { clientId, returnId } = JSON.parse(saved);
        if (clientId && returnId) {
          getClient(clientId).then(c => { setClient(c); }).catch(() => {});
          getReturn(returnId).then(data => {
            setTaxReturn(data.return);
            setIncomeItems(data.income_items);
            setDeductions(data.deductions);
            setDependents(data.dependents);
            setDocuments(data.documents);
            setOptimizations(data.optimizations);
            if (data.return.status !== 'intake') setTab('dashboard');
          }).catch(() => {});
        }
      }
    } catch {}
  }, []);

  // Save session to localStorage when client/return changes
  useEffect(() => {
    if (client?.id && taxReturn?.id) {
      localStorage.setItem('ept-tax-session', JSON.stringify({ clientId: client.id, returnId: taxReturn.id }));
    }
  }, [client?.id, taxReturn?.id]);

  const clearMessages = () => { setError(''); setSuccess(''); };

  // Load return data
  const loadReturnData = useCallback(async (returnId: string) => {
    try {
      const data = await getReturn(returnId);
      setTaxReturn(data.return);
      setIncomeItems(data.income_items);
      setDeductions(data.deductions);
      setDependents(data.dependents);
      setDocuments(data.documents);
      setOptimizations(data.optimizations);
    } catch (err) {
      setError(String(err));
    }
  }, []);

  // --- Handlers ---

  const handleCreateClient = async () => {
    clearMessages(); setLoading(true);
    try {
      const c = await createClient({
        first_name: form.first_name, middle_name: form.middle_name || undefined, last_name: form.last_name, suffix: form.suffix || undefined, email: form.email,
        ssn: form.ssn || undefined, dob: form.dob || undefined, phone: form.phone || undefined,
        address_street: form.address_street || undefined, address_city: form.address_city || undefined,
        address_state: form.address_state || undefined, address_zip: form.address_zip || undefined,
        filing_status: form.filing_status,
      });
      setClient(c);
      const ret = await createReturn(c.id, form.tax_year);
      setTaxReturn(ret);
      setSuccess('Client profile and return created!');
      setIntakeStep(2);
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleAddIncome = async () => {
    if (!taxReturn || !incomeForm.amount) return;
    clearMessages(); setLoading(true);
    try {
      const item = await addIncome(taxReturn.id, {
        category: incomeForm.category,
        description: incomeForm.description || undefined,
        amount: parseFloat(incomeForm.amount),
        tax_withheld: incomeForm.tax_withheld ? parseFloat(incomeForm.tax_withheld) : undefined,
      });
      setIncomeItems(prev => [...prev, item]);
      setIncomeForm({ category: 'wages', description: '', amount: '', tax_withheld: '' });
      setSuccess('Income added');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleAddDeduction = async () => {
    if (!taxReturn || !deductionForm.amount) return;
    clearMessages(); setLoading(true);
    try {
      const item = await addDeduction(taxReturn.id, {
        category: deductionForm.category,
        description: deductionForm.description || undefined,
        amount: parseFloat(deductionForm.amount),
      });
      setDeductions(prev => [...prev, item]);
      setDeductionForm({ category: 'charitable', description: '', amount: '' });
      setSuccess('Deduction added');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleAddDependent = async () => {
    if (!taxReturn || !depForm.first_name) return;
    clearMessages(); setLoading(true);
    try {
      const dep = await addDependent(taxReturn.id, {
        first_name: depForm.first_name, last_name: depForm.last_name,
        dob: depForm.dob || undefined, relationship: depForm.relationship || undefined,
        qualifies_ctc: depForm.qualifies_ctc, qualifies_odc: depForm.qualifies_odc,
      });
      setDependents(prev => [...prev, dep]);
      setDepForm({ first_name: '', last_name: '', dob: '', relationship: '', qualifies_ctc: true, qualifies_odc: false });
      setSuccess('Dependent added');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!taxReturn || !uploadFile) return;
    clearMessages(); setLoading(true);
    try {
      const doc = await uploadDocument(taxReturn.id, uploadFile, uploadDocType, uploadIssuer || undefined);
      setDocuments(prev => [...prev, doc]);
      setUploadFile(null); setUploadIssuer('');
      setSuccess('Document uploaded');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleCalculate = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try {
      const calc = await calculateReturn(taxReturn.id);
      setCalculation(calc);
      await loadReturnData(taxReturn.id);
      setSuccess('Tax return calculated!');
      setTab('dashboard');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleOptimize = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try {
      const opts = await getOptimizations(taxReturn.id);
      setOptimizations(opts);
      setSuccess(`Found ${opts.length} optimization suggestions`);
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetForms = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try {
      const data = await getReturnForms(taxReturn.id);
      setFormData(data);
      setTab('forms');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  // --- Strategy Handlers ---

  const handleGetStrategy = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try {
      const data = await getStrategy(taxReturn.id);
      setStrategyData(data);
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetAuditRisk = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try {
      const data = await getAuditRisk(taxReturn.id);
      setAuditRisk(data);
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleWhatIf = async () => {
    if (!taxReturn || !whatIfForm.amount) return;
    clearMessages(); setLoading(true);
    try {
      const scenario: any = {};
      if (whatIfForm.field === 'income') scenario.income_overrides = { wages: parseFloat(whatIfForm.amount) };
      else if (whatIfForm.field === 'deduction') scenario.deduction_overrides = { charitable: parseFloat(whatIfForm.amount) };
      else if (whatIfForm.field === 'filing_status') scenario.filing_status = whatIfForm.amount;
      const data = await whatIf(taxReturn.id, scenario);
      setWhatIfResult(data);
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetSETax = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setSeTaxData(await getSelfEmploymentTax(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetTrend = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setTrendData(await getTrend(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetSafeHarbor = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setSafeHarborData(await getSafeHarbor(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetDeductionOps = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setDeductionOps(await getDeductionOpportunities(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  // --- Tools Handlers ---

  const handleGetPenalty = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setPenaltyData(await getPenaltyEstimate(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetBrackets = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setBracketData(await getBracketAnalysis(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetKeyNumbers = async (year = 2025) => {
    clearMessages(); setLoading(true);
    try { setKeyNumbers(await getKeyNumbers(year)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleGetCalendar = async (year = 2025) => {
    clearMessages(); setLoading(true);
    try { setCalendarData(await getTaxCalendar(year)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleSearchKnowledge = async () => {
    if (!knowledgeQuery) return;
    clearMessages(); setLoading(true);
    try { setKnowledgeResults(await searchTaxKnowledge(knowledgeQuery)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleValidate = async () => {
    if (!taxReturn) return;
    clearMessages(); setLoading(true);
    try { setValidationResult(await validateReturn(taxReturn.id)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  // --- Admin Handlers ---

  const handleLoadDashboard = async () => {
    clearMessages(); setLoading(true);
    try { setDashboard(await getPreparerDashboard()); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleLoadAuditLog = async () => {
    clearMessages(); setLoading(true);
    try { setAuditLog(await getAuditLog(1, 50)); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleLoadClients = async () => {
    clearMessages(); setLoading(true);
    try { setClientList(await listClients()); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleLoadReturns = async () => {
    clearMessages(); setLoading(true);
    try { setReturnList(await listReturns()); } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!taxReturn || !noteText.trim()) return;
    clearMessages(); setLoading(true);
    try {
      await addNote(taxReturn.id, { content: noteText, author: 'Preparer' });
      setNotes(await getNotes(taxReturn.id));
      setNoteText('');
      setSuccess('Note added');
    } catch (err) { setError(String(err)); }
    setLoading(false);
  };

  const handleLoadNotes = async () => {
    if (!taxReturn) return;
    try { setNotes(await getNotes(taxReturn.id)); } catch {}
  };

  const handleLoadTimeline = async () => {
    if (!taxReturn) return;
    try { setTimeline(await getReturnTimeline(taxReturn.id)); } catch {}
  };

  // ===============================================================
  // RENDER
  // ===============================================================

  return (
    <div data-tutorial="tax-hero" className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Tax Intelligence &amp; Preparation - Echo Prime Technologies</h1>
          <p>AI-powered tax preparation with 14 specialized Tax Intelligence Engines that analyze your situation against the full Internal Revenue Code. Automated document extraction, deduction optimization, audit risk scoring, and licensed preparer review. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <BreadcrumbSchema items={[{name:'Home',href:'/'},{name:'Products',href:'/services'},{name:'Tax Intelligence',href:'/tax-returns'}]} />
      <FaqSchema faqs={[
        { q: 'How does AI tax preparation actually work?', a: 'You upload your tax documents (W-2s, 1099s, receipts) and our system extracts all data automatically using OCR and AI classification. 14 specialized Tax Intelligence Engines then analyze your situation against the full Internal Revenue Code, identifying every applicable deduction, credit, and optimization strategy before generating your complete return.' },
        { q: 'Is my tax data secure?', a: 'All tax documents and personal data are encrypted with AES-256-GCM at rest and in transit. We follow IRS Publication 4557 security standards for tax preparers. Your data is never used for AI training, never shared with third parties, and you can request full deletion at any time.' },
        { q: 'What types of tax returns do you support?', a: 'We handle individual returns (1040), self-employment (Schedule C/SE), rental income (Schedule E), investment income (Schedule D), and multi-state filings. Support for partnership (1065) and S-Corp (1120-S) returns is available on Business and Enterprise plans.' },
        { q: 'How much can the AI save me compared to doing taxes myself?', a: 'Our 14 TX Engines scan the entire IRC code for deductions and credits most people miss. On average, AI-optimized returns identify 15-30% more deductions than self-prepared returns. The what-if scenario tool lets you compare filing strategies side by side so you can see exactly how much each optimization saves.' },
        { q: 'Who reviews my return before filing?', a: 'Every return goes through a multi-stage review: AI validation checks for mathematical accuracy and completeness, the audit risk engine flags potential issues, and a licensed tax preparer performs final review. You receive a detailed return health score and can ask questions before authorizing submission.' },
        { q: 'What if I get audited?', a: 'Every answer and recommendation our engines produce includes full IRC authority citations and confidence scoring. If the IRS questions any position on your return, we provide complete documentation of the legal basis for each line item. Business and Enterprise plans include audit defense support with doctrine-backed response preparation.' },
      ]} />
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b px-6 py-3 flex items-center justify-between backdrop-blur-xl" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-nav-bg)' }}>
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src={isDark ? '/logo-night.png' : '/logo-day.png'}
              alt="EPT"
              width={400}
              height={260}
              className="w-[120px] md:w-[160px] h-auto"
              style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
              priority
            />
          </Link>
          <div data-tutorial="tax-tab-overview" className="h-6 w-px" style={{ backgroundColor: 'var(--ept-border)' }} />
          <span className="text-sm font-bold tracking-widest uppercase gradient-text">Tax Return Preparation</span>
        </div>
        <div className="flex items-center gap-1">
          {TAB_ITEMS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === t.id ? 'var(--ept-accent-glow)' : 'transparent',
                color: tab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
                border: tab === t.id ? '1px solid var(--ept-accent)' : '1px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm flex justify-between items-center" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <span>{error}</span>
            <button onClick={() => setError('')} className="hover:opacity-70" style={{ color: '#ef4444' }}>x</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg text-sm flex justify-between items-center" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="hover:opacity-70" style={{ color: '#10b981' }}>x</button>
          </div>
        )}

        {/* ======= HERO TAB ======= */}
        {tab === 'hero' && (
          <div className="space-y-12 animate-fade-up">
            <div className="text-center space-y-6 py-12">
              <h2 className="text-5xl font-extrabold gradient-text">
                Professional Tax Preparation
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
                Powered by the TIE Backbone + 14 AI Tax Intelligence Engines. Accurate calculations, expert optimization,
                and dedicated preparer review for every return.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setTab('intake')}
                  className="px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  Start Your Return
                </button>
                <a
                  href="#pricing"
                  className="px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-80"
                  style={{ border: '1px solid var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  View Pricing
                </a>
              </div>
            </div>

            {/* Features */}
            <div data-tutorial="tax-deductions" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'AI-Powered Analysis', desc: '14 specialized tax engines analyze every aspect of your return \u2014 from standard deductions to oil & gas taxation.', icon: '\u{1F9E0}' },
                { title: 'Optimization Engine', desc: 'Our TX engines identify deductions, credits, and strategies you might miss. Average savings of $2,400+ per complex return.', icon: '\u{1F4B0}' },
                { title: 'Expert Review', desc: 'Every return is reviewed by a qualified preparer before filing. PTIN-certified with full audit support.', icon: '\u{1F50D}' },
              ].map(f => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl card-hover transition-all"
                  style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div id="pricing" className="space-y-6">
              <h3 className="text-3xl font-bold text-center" style={{ color: 'var(--ept-text)' }}>Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(pricing.length ? pricing : [
                  { tier: 'basic', price: 150, name: 'Basic', description: 'W-2 only', includes: ['Federal 1040', 'W-2 income', 'E-file'] },
                  { tier: 'standard', price: 250, name: 'Standard', description: 'W-2 + 1099s', includes: ['All Basic', '1099 forms', 'Itemized deductions'] },
                  { tier: 'complex', price: 400, name: 'Complex', description: 'Investments + rental', includes: ['All Standard', 'Schedule D/E', 'TX engine optimization'] },
                  { tier: 'business', price: 600, name: 'Business', description: 'Self-employment', includes: ['All Business', 'Schedule C/SE', 'QBI deduction'] },
                  { tier: 'oilgas', price: 750, name: 'Oil & Gas', description: 'IDC, depletion, royalties', includes: ['All Business', 'TX12 engine', 'Mineral rights analysis'] },
                ]).map((p, i) => (
                  <div
                    key={p.tier}
                    className={`p-5 rounded-2xl transition-all card-hover ${i === 2 ? 'scale-105' : ''}`}
                    style={{
                      backgroundColor: i === 2 ? 'var(--ept-accent-glow)' : 'var(--ept-card-bg)',
                      border: i === 2 ? '1px solid var(--ept-accent)' : '1px solid var(--ept-card-border)',
                    }}
                  >
                    <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>{p.name}</div>
                    <div className="text-3xl font-bold my-2" style={{ color: 'var(--ept-text)' }}>${p.price}</div>
                    <div className="text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>{p.description}</div>
                    <ul className="space-y-1.5">
                      {p.includes.map(inc => (
                        <li key={inc} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--ept-text-secondary)' }}>
                          <span style={{ color: '#10b981' }} className="mt-0.5">&#10003;</span> {inc}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setTab('intake')}
                      className="w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: i === 2 ? 'var(--ept-accent)' : 'var(--ept-surface)',
                        color: i === 2 ? '#fff' : 'var(--ept-text-secondary)',
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TX Engine Badges */}
            <div className="text-center space-y-3 pb-8">
              <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--ept-text-muted)' }}>Powered by Echo Prime Tax Intelligence</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', border: '1px solid var(--ept-accent)' }}
                >
                  TIE (Backbone)
                </span>
                {Array.from({ length: 14 }, (_, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)', border: '1px solid var(--ept-accent)' }}
                  >
                    TX{String(i + 1).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======= INTAKE TAB ======= */}
        {tab === 'intake' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{ backgroundColor: s <= intakeStep ? 'var(--ept-accent)' : 'var(--ept-surface)' }}
                />
              ))}
            </div>
            <div data-tutorial="tax-tab-intake" className="text-sm mb-2" style={{ color: 'var(--ept-text-muted)' }}>Step {intakeStep} of 3</div>

            {/* Step 1: Personal Info */}
            {intakeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Personal Information</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Input label="First Name *" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
                  <Input label="Middle Name" value={form.middle_name} onChange={v => setForm(f => ({ ...f, middle_name: v }))} />
                  <Input label="Last Name *" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} />
                  <Input label="Suffix" value={form.suffix} onChange={v => setForm(f => ({ ...f, suffix: v }))} placeholder="Jr, Sr, II, III" />
                </div>
                <Input label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
                <Input label="SSN (encrypted, optional)" value={form.ssn} onChange={v => setForm(f => ({ ...f, ssn: v }))} placeholder="XXX-XX-XXXX" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date of Birth" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} type="date" />
                  <Input label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} type="tel" />
                </div>
                <Input label="Street Address" value={form.address_street} onChange={v => setForm(f => ({ ...f, address_street: v }))} />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City" value={form.address_city} onChange={v => setForm(f => ({ ...f, address_city: v }))} />
                  <Input label="State" value={form.address_state} onChange={v => setForm(f => ({ ...f, address_state: v }))} placeholder="TX" />
                  <Input label="ZIP" value={form.address_zip} onChange={v => setForm(f => ({ ...f, address_zip: v }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--ept-text-muted)' }}>Filing Status *</label>
                  <select
                    value={form.filing_status}
                    onChange={e => setForm(f => ({ ...f, filing_status: e.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', border: '1px solid var(--ept-border)' }}
                  >
                    {FILING_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--ept-text-muted)' }}>Tax Year</label>
                  <select
                    value={form.tax_year}
                    onChange={e => setForm(f => ({ ...f, tax_year: parseInt(e.target.value) }))}
                    className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                    style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)', border: '1px solid var(--ept-border)' }}
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleCreateClient}
                  disabled={loading || !form.first_name || !form.last_name}
                  className="w-full py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  {loading ? 'Creating...' : 'Continue to Dependents'}
                </button>
              </div>
            )}

            {/* Step 2: Dependents */}
            {intakeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Dependents</h3>
                <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Add any dependents claimed on your return. Skip if none.</p>

                {dependents.map(d => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: 'var(--ept-text)' }}>{d.first_name} {d.last_name}</span>
                      <span className="text-xs ml-2" style={{ color: 'var(--ept-text-muted)' }}>{d.relationship}</span>
                      {d.qualifies_ctc ? <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>CTC</span> : null}
                    </div>
                    <button onClick={async () => {
                      if (taxReturn) { await deleteDependent(taxReturn.id, d.id); setDependents(prev => prev.filter(x => x.id !== d.id)); }
                    }} className="text-sm hover:opacity-70" style={{ color: '#ef4444' }}>Remove</button>
                  </div>
                ))}

                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="First Name" value={depForm.first_name} onChange={v => setDepForm(f => ({ ...f, first_name: v }))} />
                    <Input label="Last Name" value={depForm.last_name} onChange={v => setDepForm(f => ({ ...f, last_name: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date of Birth" value={depForm.dob} onChange={v => setDepForm(f => ({ ...f, dob: v }))} type="date" />
                    <Input label="Relationship" value={depForm.relationship} onChange={v => setDepForm(f => ({ ...f, relationship: v }))} placeholder="Child, Parent, etc." />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <input type="checkbox" checked={depForm.qualifies_ctc} onChange={e => setDepForm(f => ({ ...f, qualifies_ctc: e.target.checked }))}
                        className="rounded" style={{ accentColor: 'var(--ept-accent)' }} /> Child Tax Credit
                    </label>
                    <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <input type="checkbox" checked={depForm.qualifies_odc} onChange={e => setDepForm(f => ({ ...f, qualifies_odc: e.target.checked }))}
                        className="rounded" style={{ accentColor: 'var(--ept-accent)' }} /> Other Dependent Credit
                    </label>
                  </div>
                  <button
                    onClick={handleAddDependent}
                    disabled={loading || !depForm.first_name}
                    className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all hover:opacity-80"
                    style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                  >
                    + Add Dependent
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIntakeStep(1)}
                    className="flex-1 py-3 rounded-xl transition-all hover:opacity-80"
                    style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setIntakeStep(3)}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    Continue to Income
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Income & Deductions */}
            {intakeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Income &amp; Deductions</h3>

                {/* Income */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold gradient-text">Income Sources</h4>
                  {incomeItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}
                    >
                      <div>
                        <span className="text-sm font-medium capitalize" style={{ color: 'var(--ept-text)' }}>{item.category.replace(/_/g, ' ')}</span>
                        {item.description && <span className="text-xs ml-2" style={{ color: 'var(--ept-text-muted)' }}>- {item.description}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono" style={{ color: '#10b981' }}>{fmt(item.amount)}</span>
                        {item.tax_withheld > 0 && <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>W/H: {fmt(item.tax_withheld)}</span>}
                        <button onClick={async () => {
                          if (taxReturn) { await deleteIncome(taxReturn.id, item.id); setIncomeItems(prev => prev.filter(x => x.id !== item.id)); }
                        }} className="text-xs hover:opacity-70" style={{ color: '#ef4444' }}>x</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category</label>
                        <select
                          value={incomeForm.category}
                          onChange={e => setIncomeForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                          style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                        >
                          {INCOME_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <Input label="Description" value={incomeForm.description} onChange={v => setIncomeForm(f => ({ ...f, description: v }))} placeholder="Employer name" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Amount *" value={incomeForm.amount} onChange={v => setIncomeForm(f => ({ ...f, amount: v }))} type="number" placeholder="0.00" />
                      <Input label="Tax Withheld" value={incomeForm.tax_withheld} onChange={v => setIncomeForm(f => ({ ...f, tax_withheld: v }))} type="number" placeholder="0.00" />
                    </div>
                    <button
                      onClick={handleAddIncome}
                      disabled={loading || !incomeForm.amount}
                      className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all hover:opacity-80"
                      style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                    >
                      + Add Income
                    </button>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold" style={{ color: '#10b981' }}>Deductions</h4>
                  {deductions.map(d => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}
                    >
                      <div>
                        <span className="text-sm font-medium capitalize" style={{ color: 'var(--ept-text)' }}>{d.category.replace(/_/g, ' ')}</span>
                        {d.description && <span className="text-xs ml-2" style={{ color: 'var(--ept-text-muted)' }}>- {d.description}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono" style={{ color: '#f59e0b' }}>{fmt(d.amount)}</span>
                        <button onClick={async () => {
                          if (taxReturn) { await deleteDeduction(taxReturn.id, d.id); setDeductions(prev => prev.filter(x => x.id !== d.id)); }
                        }} className="text-xs hover:opacity-70" style={{ color: '#ef4444' }}>x</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Category</label>
                        <select
                          value={deductionForm.category}
                          onChange={e => setDeductionForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                          style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                        >
                          {DEDUCTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <Input label="Description" value={deductionForm.description} onChange={v => setDeductionForm(f => ({ ...f, description: v }))} />
                    </div>
                    <Input label="Amount *" value={deductionForm.amount} onChange={v => setDeductionForm(f => ({ ...f, amount: v }))} type="number" placeholder="0.00" />
                    <button
                      onClick={handleAddDeduction}
                      disabled={loading || !deductionForm.amount}
                      className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all hover:opacity-80"
                      style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                    >
                      + Add Deduction
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIntakeStep(2)}
                    className="flex-1 py-3 rounded-xl transition-all hover:opacity-80"
                    style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCalculate}
                    disabled={loading || incomeItems.length === 0}
                    className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    {loading ? 'Calculating...' : 'Calculate My Return'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======= DOCUMENTS TAB ======= */}
        {tab === 'documents' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
            <h3 data-tutorial="tax-doc-upload" className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Document Upload</h3>
            {!taxReturn ? (
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p style={{ color: 'var(--ept-text-muted)' }}>Complete the intake form first to upload documents.</p>
                <button
                  onClick={() => setTab('intake')}
                  className="mt-3 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                >
                  Go to Intake
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Document Type</label>
                      <select
                        value={uploadDocType}
                        onChange={e => setUploadDocType(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                        style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                      >
                        {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <Input label="Issuer / Employer Name" value={uploadIssuer} onChange={setUploadIssuer} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>File (PDF, JPG, PNG &mdash; max 10MB)</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs"
                      style={{
                        backgroundColor: 'var(--ept-surface)',
                        border: '1px solid var(--ept-border)',
                        color: 'var(--ept-text-secondary)',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={loading || !uploadFile}
                    className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all hover:opacity-80"
                    style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--ept-text)' }}>Uploaded Documents</h4>
                    {documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded uppercase" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{doc.doc_type}</span>
                          <span className="text-sm" style={{ color: 'var(--ept-text)' }}>{doc.issuer_name || 'Unknown issuer'}</span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: doc.status === 'parsed' ? 'rgba(16,185,129,0.1)' : doc.status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                            color: doc.status === 'parsed' ? '#10b981' : doc.status === 'error' ? '#ef4444' : '#f59e0b',
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ======= DASHBOARD TAB ======= */}
        {tab === 'dashboard' && (
          <div className="space-y-6 animate-fade-up">
            {!calculation && !taxReturn ? (
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p style={{ color: 'var(--ept-text-muted)' }}>Complete intake and calculate your return to see the dashboard.</p>
                <button
                  onClick={() => setTab('intake')}
                  className="mt-3 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                >
                  Go to Intake
                </button>
              </div>
            ) : calculation ? (
              <>
                {/* Refund / Owed Banner */}
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{
                    backgroundColor: calculation.refund_or_owed >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    border: calculation.refund_or_owed >= 0 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <div className="text-sm mb-1" style={{ color: 'var(--ept-text-secondary)' }}>{calculation.refund_or_owed >= 0 ? 'Estimated Refund' : 'Estimated Amount Owed'}</div>
                  <div className="text-5xl font-bold" style={{ color: calculation.refund_or_owed >= 0 ? '#10b981' : '#ef4444' }}>
                    {fmt(Math.abs(calculation.refund_or_owed))}
                  </div>
                  <div className="text-sm mt-2" style={{ color: 'var(--ept-text-muted)' }}>Tax Year {calculation.tax_year} | {calculation.filing_status.replace(/_/g, ' ')}</div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Income', value: fmt(calculation.income_summary.total), color: 'var(--ept-text)' },
                    { label: 'AGI', value: fmt(calculation.agi), color: '#3b82f6' },
                    { label: 'Taxable Income', value: fmt(calculation.taxable_income), color: '#f59e0b' },
                    { label: 'Total Tax', value: fmt(calculation.total_tax), color: '#ef4444' },
                  ].map(card => (
                    <div key={card.label} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>{card.label}</div>
                      <div className="text-2xl font-bold font-mono" style={{ color: card.color }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Income Breakdown + Deductions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Income Breakdown</h4>
                    {Object.entries(calculation.income_summary)
                      .filter(([k, v]) => k !== 'total' && v > 0)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-sm capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{fmt(v)}</span>
                        </div>
                      ))}
                    <div className="flex justify-between pt-2 font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <span>Total</span>
                      <span className="font-mono">{fmt(calculation.income_summary.total)}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Deductions</h4>
                    <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Standard Deduction</span>
                      <span className="font-mono text-sm" style={{ color: calculation.deductions.method === 'standard' ? '#10b981' : 'var(--ept-text-muted)' }}>
                        {fmt(calculation.deductions.standard)} {calculation.deductions.method === 'standard' ? '\u2713' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Itemized Deductions</span>
                      <span className="font-mono text-sm" style={{ color: calculation.deductions.method === 'itemized' ? '#10b981' : 'var(--ept-text-muted)' }}>
                        {fmt(calculation.deductions.itemized)} {calculation.deductions.method === 'itemized' ? '\u2713' : ''}
                      </span>
                    </div>
                    {calculation.qbi_deduction > 0 && (
                      <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                        <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>QBI Deduction (Sec. 199A)</span>
                        <span className="font-mono text-sm" style={{ color: '#10b981' }}>{fmt(calculation.qbi_deduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <span>Total Deduction</span>
                      <span className="font-mono">{fmt(calculation.deductions.amount + calculation.qbi_deduction)}</span>
                    </div>
                  </div>
                </div>

                {/* Tax Brackets */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Tax Bracket Breakdown</h4>
                  <div className="space-y-2">
                    {calculation.tax_bracket_detail.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs w-12 text-right font-mono" style={{ color: 'var(--ept-accent)' }}>{(b.rate * 100).toFixed(0)}%</span>
                        <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div data-tutorial="tax-income-categories"
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (b.taxable_in_bracket / calculation.taxable_income) * 100)}%`,
                              backgroundColor: 'var(--ept-accent)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono w-24 text-right" style={{ color: 'var(--ept-text-secondary)' }}>{fmt(b.tax_in_bracket)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-2 font-semibold" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                    <span>Regular Tax</span>
                    <span className="font-mono">{fmt(calculation.regular_tax)}</span>
                  </div>
                </div>

                {/* Credits & Payments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Credits</h4>
                    {Object.entries(calculation.credits)
                      .filter(([k, v]) => k !== 'total' && v > 0)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-sm uppercase" style={{ color: 'var(--ept-text-secondary)' }}>{k}</span>
                          <span className="font-mono text-sm" style={{ color: '#10b981' }}>-{fmt(v)}</span>
                        </div>
                      ))}
                    <div className="flex justify-between pt-2 font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <span>Total Credits</span>
                      <span className="font-mono" style={{ color: '#10b981' }}>-{fmt(calculation.credits.total)}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--ept-text)' }}>Payments &amp; Withholding</h4>
                    <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Federal Withholding</span>
                      <span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{fmt(calculation.payments.withholding)}</span>
                    </div>
                    <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                      <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Estimated Payments</span>
                      <span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{fmt(calculation.payments.estimated)}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-semibold" style={{ color: 'var(--ept-text)' }}>
                      <span>Total Payments</span>
                      <span className="font-mono">{fmt(calculation.payments.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleOptimize}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
                  >
                    {loading ? 'Optimizing...' : 'Run AI Optimization'}
                  </button>
                  <button
                    onClick={handleGetForms}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                  >
                    View 1040 Form
                  </button>
                </div>

                {/* Optimizations */}
                {optimizations.length > 0 && (
                  <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <h4 className="text-lg font-semibold" style={{ color: '#8b5cf6' }}>AI Optimization Suggestions</h4>
                    {optimizations.map((opt, i) => (
                      <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded uppercase" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>{opt.engine_id}</span>
                          <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{opt.category}</span>
                          {opt.potential_savings > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                              Save ~{fmt(opt.potential_savings)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{opt.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center" style={{ color: 'var(--ept-text-muted)' }}>
                <p>Return exists but not yet calculated.</p>
                <button
                  onClick={handleCalculate}
                  className="mt-3 px-6 py-2 rounded-lg transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                >
                  Calculate Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======= STRATEGY TAB ======= */}
        {tab === 'strategy' && (
          <div className="space-y-6 animate-fade-up">
            {!taxReturn ? (
              <NeedReturn onGo={() => setTab('intake')} message="Complete intake and calculate your return to access strategy tools." />
            ) : (
              <>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Tax Strategy &amp; Analysis</h3>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <ActionBtn label="Tax Strategy" onClick={handleGetStrategy} loading={loading} color="var(--ept-accent)" />
                  <ActionBtn label="Audit Risk" onClick={handleGetAuditRisk} loading={loading} color="#f59e0b" />
                  <ActionBtn label="Deduction Opportunities" onClick={handleGetDeductionOps} loading={loading} color="#10b981" />
                  <ActionBtn label="SE Tax" onClick={handleGetSETax} loading={loading} color="#8b5cf6" />
                  <ActionBtn label="Trend Analysis" onClick={handleGetTrend} loading={loading} color="#3b82f6" />
                  <ActionBtn label="Safe Harbor" onClick={handleGetSafeHarbor} loading={loading} color="#ec4899" />
                </div>

                {/* What-If Simulator */}
                <Card title="What-If Scenario Simulator">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>Scenario Type</label>
                      <select
                        value={whatIfForm.field}
                        onChange={e => setWhatIfForm(f => ({ ...f, field: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                        style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                      >
                        <option value="income">Change Income</option>
                        <option value="deduction">Add Deduction</option>
                        <option value="filing_status">Change Filing Status</option>
                      </select>
                    </div>
                    <Input
                      label={whatIfForm.field === 'filing_status' ? 'New Filing Status' : 'Amount'}
                      value={whatIfForm.amount}
                      onChange={v => setWhatIfForm(f => ({ ...f, amount: v }))}
                      type={whatIfForm.field === 'filing_status' ? 'text' : 'number'}
                      placeholder={whatIfForm.field === 'filing_status' ? 'married_joint' : '75000'}
                    />
                    <div className="flex items-end">
                      <button
                        onClick={handleWhatIf}
                        disabled={loading || !whatIfForm.amount}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                      >
                        Run Scenario
                      </button>
                    </div>
                  </div>
                  {whatIfResult && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <MiniStat label="Original Tax" value={fmt(whatIfResult.original?.total_tax || 0)} color="var(--ept-text)" />
                      <MiniStat label="Scenario Tax" value={fmt(whatIfResult.scenario?.total_tax || 0)} color="#3b82f6" />
                      <MiniStat label="Difference" value={fmt(whatIfResult.delta?.total_tax || 0)} color={whatIfResult.delta?.total_tax < 0 ? '#10b981' : '#ef4444'} />
                    </div>
                  )}
                </Card>

                {/* Audit Risk */}
                {auditRisk && (
                  <Card title="Audit Risk Assessment">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{
                          backgroundColor: auditRisk.risk_level === 'low' ? 'rgba(16,185,129,0.15)' : auditRisk.risk_level === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: auditRisk.risk_level === 'low' ? '#10b981' : auditRisk.risk_level === 'medium' ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {auditRisk.risk_score}
                      </div>
                      <div>
                        <div className="text-lg font-semibold capitalize" style={{ color: 'var(--ept-text)' }}>{auditRisk.risk_level} Risk</div>
                        <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Score: {auditRisk.risk_score}/100</div>
                      </div>
                    </div>
                    {auditRisk.flags?.length > 0 && (
                      <div className="space-y-2">
                        {auditRisk.flags.map((f: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                            <div>
                              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded mr-2" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{f.category}</span>
                              <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{f.description}</span>
                            </div>
                            <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>wt: {f.weight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Tax Strategy */}
                {strategyData?.strategies?.length > 0 && (
                  <Card title="Tax Strategy Recommendations">
                    <div className="space-y-3">
                      {strategyData.strategies.map((s: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>#{s.rank}</span>
                              <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{s.strategy}</span>
                            </div>
                            {s.potential_savings > 0 && (
                              <span className="text-xs font-mono" style={{ color: '#10b981' }}>Save ~{fmt(s.potential_savings)}</span>
                            )}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.implementation}</div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)' }}>{s.category}</span>
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)' }}>Confidence: {pct(s.confidence)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* SE Tax */}
                {seTaxData?.schedule_se && (
                  <Card title="Self-Employment Tax (Schedule SE)">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(seTaxData.schedule_se).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-sm capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{typeof v === 'number' ? fmt(v) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Trend Analysis */}
                {trendData?.years?.length > 0 && (
                  <Card title="Year-over-Year Trend">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                            <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Year</th>
                            <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Income</th>
                            <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Tax</th>
                            <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Eff. Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trendData.years.map((y: any) => (
                            <tr key={y.year} style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                              <td className="py-2" style={{ color: 'var(--ept-accent)' }}>{y.year}</td>
                              <td className="py-2 text-right font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(y.income)}</td>
                              <td className="py-2 text-right font-mono" style={{ color: '#ef4444' }}>{fmt(y.tax)}</td>
                              <td className="py-2 text-right font-mono" style={{ color: '#f59e0b' }}>{pct(y.effective_rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {/* Safe Harbor */}
                {safeHarborData?.analysis && (
                  <Card title="Safe Harbor Analysis">
                    <div className="space-y-2">
                      {Object.entries(safeHarborData.analysis).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-sm capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{typeof v === 'number' ? fmt(v) : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Deduction Opportunities */}
                {deductionOps.length > 0 && (
                  <Card title="Deduction Opportunities">
                    <div className="space-y-2">
                      {deductionOps.map((op, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div>
                            <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded mr-2" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{op.category}</span>
                            <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{op.description}</span>
                          </div>
                          <span className="text-xs font-mono" style={{ color: '#10b981' }}>~{fmt(op.estimated_savings)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Engine Intelligence — Tax Doctrine */}
                <Card title="Ask the Tax Intelligence Engine">
                  <EngineQueryPanel
                    domains={['TX', 'ACCT', 'TXLAW', 'TXRE', 'TXINS', 'FIN', 'INS']}
                    title="Tax Doctrine Intelligence"
                    placeholder="Ask about tax strategy, deductions, credits, audit defense..."
                    exampleQueries={[
                      'Section 179 deduction limits for 2025',
                      'Qualified business income deduction requirements',
                      'Home office deduction safe harbor',
                      'Capital gains tax deferral strategies',
                    ]}
                    showStats
                  />
                </Card>
              </>
            )}
          </div>
        )}

        {/* ======= FORMS TAB ======= */}
        {tab === 'forms' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Form 1040 Preview</h3>
            {!formData?.form_1040 ? (
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p style={{ color: 'var(--ept-text-muted)' }}>Calculate your return first to preview forms.</p>
                <button
                  onClick={handleGetForms}
                  disabled={loading || !taxReturn}
                  className="mt-3 px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}
                >
                  {loading ? 'Loading...' : 'Generate Forms'}
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-xl font-mono text-sm space-y-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                <div className="text-center pb-3" style={{ borderBottom: '2px solid #0f172a' }}>
                  <div className="text-lg font-bold">Form 1040 &mdash; U.S. Individual Income Tax Return</div>
                  <div className="text-sm">Tax Year {formData.form_1040.tax_year}</div>
                </div>
                <div className="pb-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div>{[formData.form_1040.taxpayer.first_name, formData.form_1040.taxpayer.middle_name, formData.form_1040.taxpayer.last_name, formData.form_1040.taxpayer.suffix].filter(Boolean).join(' ')}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{formData.form_1040.taxpayer.address}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>Filing Status: {formData.form_1040.filing_status.replace(/_/g, ' ')}</div>
                </div>
                {formData.form_1040.dependents?.length > 0 && (
                  <div className="pb-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <div className="font-bold text-xs">Dependents:</div>
                    {formData.form_1040.dependents.map((d: any, i: number) => (
                      <div key={i} className="text-xs">{d.name} ({d.relationship})</div>
                    ))}
                  </div>
                )}
                <table className="w-full text-xs">
                  <tbody>
                    {formData.form_1040.lines.map((line: any) => (
                      <tr key={line.line} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="py-1 w-16" style={{ color: '#94a3b8' }}>Line {line.line}</td>
                        <td className="py-1">{line.description}</td>
                        <td className="py-1 text-right w-28">{line.amount !== 0 ? fmt(line.amount) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Schedules */}
                {formData.form_1040.schedules && Object.entries(formData.form_1040.schedules).map(([name, lines]: [string, any]) => (
                  <div key={name} className="mt-4 pt-3" style={{ borderTop: '2px solid #0f172a' }}>
                    <div className="font-bold text-sm mb-2">{name.replace(/_/g, ' ').toUpperCase()}</div>
                    <table className="w-full text-xs">
                      <tbody>
                        {lines.map((line: any) => (
                          <tr key={line.line} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td className="py-1 w-16" style={{ color: '#94a3b8' }}>{line.line}</td>
                            <td className="py-1">{line.description}</td>
                            <td className="py-1 text-right w-28">{fmt(line.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======= TOOLS TAB ======= */}
        {tab === 'tools' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Tax Tools &amp; Reference</h3>

            {/* Tools Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ActionBtn label="Key Numbers 2025" onClick={() => handleGetKeyNumbers(2025)} loading={loading} color="var(--ept-accent)" />
              <ActionBtn label="Tax Calendar" onClick={() => handleGetCalendar(2025)} loading={loading} color="#3b82f6" />
              {taxReturn && <ActionBtn label="Penalty Estimate" onClick={handleGetPenalty} loading={loading} color="#ef4444" />}
              {taxReturn && <ActionBtn label="Bracket Analysis" onClick={handleGetBrackets} loading={loading} color="#f59e0b" />}
              {taxReturn && <ActionBtn label="Validate Return" onClick={handleValidate} loading={loading} color="#10b981" />}
            </div>

            {/* Tax Knowledge Search */}
            <Card title="Tax Knowledge Search">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={knowledgeQuery}
                    onChange={e => setKnowledgeQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchKnowledge()}
                    placeholder="Search tax knowledge (e.g., Section 179, QBI deduction, EITC)..."
                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                </div>
                <button
                  onClick={handleSearchKnowledge}
                  disabled={loading || !knowledgeQuery}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
                >
                  Search
                </button>
              </div>
              {knowledgeResults && (
                <div className="mt-4 space-y-2">
                  {knowledgeResults.results?.map((r: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{r.title || r.topic || `Result ${i + 1}`}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{r.content || r.summary || JSON.stringify(r).slice(0, 200)}</div>
                    </div>
                  )) || (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <pre className="text-xs whitespace-pre-wrap" style={{ color: 'var(--ept-text-secondary)' }}>{JSON.stringify(knowledgeResults, null, 2).slice(0, 2000)}</pre>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Engine Intelligence — Doctrine Search */}
            <Card title="Tax Doctrine Intelligence">
              <EngineQueryPanel
                domains={['TX', 'ACCT', 'TXLAW', 'TXRE', 'TXINS', 'FIN', 'INS']}
                title="Tax Engine Intelligence"
                placeholder="Query tax doctrine engines (IRC, regulations, case law)..."
                exampleQueries={[
                  'Disguised sale partnership rules',
                  'SALT deduction workarounds for 2025',
                  'Installment sale reporting requirements',
                  'Pass-through entity tax elections',
                ]}
                showStats
              />
            </Card>

            {/* Key Numbers */}
            {keyNumbers && (
              <Card title={`Key Tax Numbers — ${keyNumbers.year}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {keyNumbers.standard_deductions && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2 gradient-text">Standard Deductions</h5>
                      {Object.entries(keyNumbers.standard_deductions).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-xs capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-xs" style={{ color: 'var(--ept-text)' }}>{fmt(v as number)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {keyNumbers.contribution_limits && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2 gradient-text">Contribution Limits</h5>
                      {Object.entries(keyNumbers.contribution_limits).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-xs capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-xs" style={{ color: 'var(--ept-text)' }}>{fmt(v as number)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {keyNumbers.fica && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2 gradient-text">FICA / Payroll</h5>
                      {Object.entries(keyNumbers.fica).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-xs capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-xs" style={{ color: 'var(--ept-text)' }}>{typeof v === 'number' && v > 100 ? fmt(v) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {keyNumbers.brackets && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2 gradient-text">Tax Brackets (Single)</h5>
                      {(keyNumbers.brackets.single || []).map((b: any, i: number) => (
                        <div key={i} className="flex justify-between py-1" style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <span className="text-xs" style={{ color: 'var(--ept-accent)' }}>{(b.rate * 100).toFixed(0)}%</span>
                          <span className="font-mono text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                            {fmt(b.min)} &mdash; {b.max ? fmt(b.max) : 'No limit'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Tax Calendar */}
            {calendarData.length > 0 && (
              <Card title="Tax Calendar — Key Dates">
                <div className="space-y-2">
                  {calendarData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-4 p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="text-xs font-mono font-bold w-24 shrink-0" style={{ color: 'var(--ept-accent)' }}>{entry.date}</div>
                      <div className="flex-1">
                        <span className="text-sm" style={{ color: 'var(--ept-text)' }}>{entry.description}</span>
                        {entry.form && <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-muted)' }}>{entry.form}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Penalty Estimate */}
            {penaltyData && (
              <Card title="Penalty Estimate">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MiniStat label="Underpayment" value={fmt(penaltyData.underpayment_penalty || 0)} color="#ef4444" />
                  <MiniStat label="Late Filing" value={fmt(penaltyData.late_filing_penalty || 0)} color="#f59e0b" />
                  <MiniStat label="Late Payment" value={fmt(penaltyData.late_payment_penalty || 0)} color="#f59e0b" />
                  <MiniStat label="Total Penalty" value={fmt(penaltyData.total_penalty || 0)} color="#ef4444" />
                </div>
              </Card>
            )}

            {/* Bracket Analysis */}
            {bracketData && (
              <Card title="Bracket Analysis">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <MiniStat label="Current Bracket" value={pct(bracketData.marginal_rate || 0)} color="var(--ept-accent)" />
                  <MiniStat label="Effective Rate" value={pct(bracketData.effective_rate || 0)} color="#f59e0b" />
                  <MiniStat label="Room in Bracket" value={fmt(bracketData.room_in_bracket || 0)} color="#10b981" />
                  <MiniStat label="Next Bracket At" value={fmt(bracketData.current_bracket?.range_end || 0)} color="var(--ept-text-muted)" />
                </div>
                {bracketData.brackets?.length > 0 && (
                  <div className="space-y-1">
                    {bracketData.brackets.map((b: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs w-10 text-right font-mono" style={{ color: 'var(--ept-accent)' }}>{pct(b.rate)}</span>
                        <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (b.tax_in_bracket / (bracketData.brackets[bracketData.brackets.length - 1]?.tax_in_bracket || 1)) * 100)}%`, backgroundColor: 'var(--ept-accent)' }} />
                        </div>
                        <span className="text-xs font-mono w-20 text-right" style={{ color: 'var(--ept-text-secondary)' }}>{fmt(b.tax_in_bracket)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Validation Result */}
            {validationResult && (
              <Card title="Return Validation">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: validationResult.valid ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: validationResult.valid ? '#10b981' : '#ef4444',
                    }}
                  >
                    {validationResult.valid ? 'VALID' : 'ISSUES FOUND'}
                  </div>
                  {validationResult.score !== undefined && (
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Score: {validationResult.score}/100</span>
                  )}
                </div>
                {validationResult.issues?.length > 0 && (
                  <div className="space-y-1">
                    {validationResult.issues.map((issue: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase" style={{
                          backgroundColor: issue.severity === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                          color: issue.severity === 'error' ? '#ef4444' : '#f59e0b',
                        }}>{issue.severity}</span>
                        <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* ======= STATUS TAB ======= */}
        {tab === 'status' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Return Status</h3>
            {!taxReturn ? (
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)', color: 'var(--ept-text-muted)' }}>
                No active return. Start from the intake form.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  {STATUS_STEPS.map((step, i) => {
                    const currentIdx = STATUS_STEPS.indexOf(taxReturn.status);
                    const isComplete = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={step} className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: isComplete ? '#10b981' : isCurrent ? 'var(--ept-accent)' : 'var(--ept-surface)',
                            color: isComplete || isCurrent ? '#fff' : 'var(--ept-text-muted)',
                          }}
                        >
                          {isComplete ? '\u2713' : i + 1}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className="w-12 h-0.5" style={{ backgroundColor: i < currentIdx ? '#10b981' : 'var(--ept-surface)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs px-2" style={{ color: 'var(--ept-text-muted)' }}>
                  {STATUS_STEPS.map(s => <span key={s} className="capitalize">{s}</span>)}
                </div>

                <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Return ID</span><span className="font-mono text-sm" style={{ color: 'var(--ept-text)' }}>{taxReturn.id}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Tax Year</span><span style={{ color: 'var(--ept-text)' }}>{taxReturn.tax_year}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Status</span><span className="capitalize" style={{ color: 'var(--ept-accent)' }}>{taxReturn.status}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Total Income</span><span className="font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(taxReturn.total_income)}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>AGI</span><span className="font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(taxReturn.adjusted_gross_income)}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Total Tax</span><span className="font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(taxReturn.total_tax)}</span></div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ept-text-muted)' }}>{taxReturn.refund_or_owed >= 0 ? 'Refund' : 'Amount Owed'}</span>
                    <span className="font-mono font-bold" style={{ color: taxReturn.refund_or_owed >= 0 ? '#10b981' : '#ef4444' }}>
                      {fmt(Math.abs(taxReturn.refund_or_owed))}
                    </span>
                  </div>
                  {taxReturn.filed_at && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--ept-text-muted)' }}>Filed At</span>
                      <span style={{ color: 'var(--ept-text)' }}>{new Date(taxReturn.filed_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {/* ======= ADMIN TAB ======= */}
        {tab === 'admin' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>Preparer Admin</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ActionBtn label="Load Dashboard" onClick={handleLoadDashboard} loading={loading} color="var(--ept-accent)" />
              <ActionBtn label="Client List" onClick={handleLoadClients} loading={loading} color="#3b82f6" />
              <ActionBtn label="All Returns" onClick={handleLoadReturns} loading={loading} color="#8b5cf6" />
              <ActionBtn label="Audit Log" onClick={handleLoadAuditLog} loading={loading} color="#f59e0b" />
              {taxReturn && <ActionBtn label="Load Notes" onClick={handleLoadNotes} loading={loading} color="#10b981" />}
              {taxReturn && <ActionBtn label="Timeline" onClick={handleLoadTimeline} loading={loading} color="#ec4899" />}
            </div>

            {/* Preparer Dashboard */}
            {dashboard && (
              <Card title="Preparer Dashboard">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <MiniStat label="Total Clients" value={String(dashboard.total_clients || 0)} color="var(--ept-accent)" />
                  <MiniStat label="Total Returns" value={String(dashboard.total_returns || 0)} color="#3b82f6" />
                  <MiniStat label="Revenue" value={fmt(dashboard.revenue || 0)} color="#10b981" />
                  <MiniStat label="Pending Items" value={String(dashboard.pending_items || 0)} color="#f59e0b" />
                </div>
                {dashboard.returns_by_status && (
                  <div>
                    <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--ept-text-muted)' }}>Returns by Status</h5>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {Object.entries(dashboard.returns_by_status).map(([status, count]) => (
                        <div key={status} className="p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{String(count)}</div>
                          <div className="text-xs capitalize" style={{ color: 'var(--ept-text-muted)' }}>{status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Client List */}
            {clientList.length > 0 && (
              <Card title={`Clients (${clientList.length})`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Name</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Email</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Filing Status</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientList.map(c => (
                        <tr key={c.id} className="hover:opacity-80 cursor-pointer" style={{ borderBottom: '1px solid var(--ept-surface)' }}
                          onClick={() => { setClient(c); setTab('intake'); }}>
                          <td className="py-2" style={{ color: 'var(--ept-text)' }}>{c.first_name} {c.last_name}</td>
                          <td className="py-2" style={{ color: 'var(--ept-text-secondary)' }}>{c.email || '-'}</td>
                          <td className="py-2 capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{c.filing_status?.replace(/_/g, ' ') || '-'}</td>
                          <td className="py-2 text-xs" style={{ color: 'var(--ept-text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Returns List */}
            {returnList.length > 0 && (
              <Card title={`Returns (${returnList.length})`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Year</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Status</th>
                        <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Income</th>
                        <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Tax</th>
                        <th className="py-2 text-right" style={{ color: 'var(--ept-text-muted)' }}>Refund/Owed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnList.map(r => (
                        <tr key={r.id} className="hover:opacity-80 cursor-pointer" style={{ borderBottom: '1px solid var(--ept-surface)' }}
                          onClick={() => { loadReturnData(r.id); setTab('dashboard'); }}>
                          <td className="py-2 font-mono" style={{ color: 'var(--ept-accent)' }}>{r.tax_year}</td>
                          <td className="py-2 capitalize" style={{ color: 'var(--ept-text-secondary)' }}>{r.status}</td>
                          <td className="py-2 text-right font-mono" style={{ color: 'var(--ept-text)' }}>{fmt(r.total_income)}</td>
                          <td className="py-2 text-right font-mono" style={{ color: '#ef4444' }}>{fmt(r.total_tax)}</td>
                          <td className="py-2 text-right font-mono" style={{ color: r.refund_or_owed >= 0 ? '#10b981' : '#ef4444' }}>{fmt(Math.abs(r.refund_or_owed))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Notes */}
            {taxReturn && (
              <Card title="Preparer Notes">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                    placeholder="Add a note about this return..."
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={loading || !noteText.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#10b981', color: '#fff' }}
                  >
                    Add Note
                  </button>
                </div>
                {notes.length > 0 && (
                  <div className="space-y-2">
                    {notes.map((n, i) => (
                      <div key={n.id || i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{n.author || 'System'}</span>
                          <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{n.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Return Timeline */}
            {timeline.length > 0 && (
              <Card title="Return Timeline">
                <div className="space-y-2">
                  {timeline.map((entry, i) => (
                    <div key={i} className="flex gap-4 p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="text-xs font-mono shrink-0 w-36" style={{ color: 'var(--ept-text-muted)' }}>{new Date(entry.timestamp).toLocaleString()}</div>
                      <div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{entry.event}</span>
                        {entry.details && <span className="text-xs ml-2" style={{ color: 'var(--ept-text-muted)' }}>{entry.details}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Audit Log */}
            {auditLog?.entries?.length > 0 && (
              <Card title={`Audit Log (${auditLog.total} entries)`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Time</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Action</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Entity</th>
                        <th className="py-2 text-left" style={{ color: 'var(--ept-text-muted)' }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.entries.map((entry: any) => (
                        <tr key={entry.id} style={{ borderBottom: '1px solid var(--ept-surface)' }}>
                          <td className="py-1.5 font-mono" style={{ color: 'var(--ept-text-muted)' }}>{new Date(entry.timestamp).toLocaleString()}</td>
                          <td className="py-1.5" style={{ color: 'var(--ept-accent)' }}>{entry.action}</td>
                          <td className="py-1.5" style={{ color: 'var(--ept-text-secondary)' }}>{entry.entity_type}:{entry.entity_id?.slice(0, 8)}</td>
                          <td className="py-1.5" style={{ color: 'var(--ept-text-muted)' }}>{JSON.stringify(entry.details || {}).slice(0, 80)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* ─── Cross-Sell ─── */}
      <section className="mt-16 max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Complete Your Financial Stack</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Pair AI tax preparation with these services for full-spectrum financial intelligence</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Intelligence Engines', desc: '5,486+ domain-specific AI engines including 14 tax law, MACRS depreciation, QBI, and oil & gas IDC engines.', href: '/engines', price: 'From $199/mo' },
            { title: 'Title Intelligence', desc: 'AI chain of title for oil & gas mineral rights. Perfect for clients with royalty income and depletion deductions.', href: '/title-intelligence', price: 'From $200/mo' },
            { title: 'Data Pipelines', desc: 'Automated extraction of W-2s, 1099s, K-1s, and financial documents. Feeds directly into tax preparation workflow.', href: '/pipelines', price: 'From $199/mo' },
          ].map((svc, i) => (
            <Link key={i} href={svc.href} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{svc.title}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ept-text-muted)' }}>{svc.desc}</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>{svc.price} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Related Reading ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--ept-text)' }}>Related Reading</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/blog/ai-tax-strategies-oil-gas-royalty-owners" className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-base font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>AI Tax Strategies for O&G Royalty Owners</h3>
            <p className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>Percentage depletion, working interest exceptions, and 5 strategies most CPAs miss.</p>
          </Link>
          <Link href="/blog/ai-tax-preparation-macrs-depreciation" className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-base font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>AI Tax Preparation & MACRS Depreciation</h3>
            <p className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>How AI engines optimize depreciation schedules and identify missed deductions.</p>
          </Link>
          <Link href="/blog/ai-compliance-automation-enterprise" className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-base font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>AI Compliance Automation for Enterprise</h3>
            <p className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>Automating regulatory compliance with doctrine-backed AI intelligence.</p>
          </Link>
        </div>
      </section>

      {/* ── Related Articles ── */}
      <div className="mt-4 max-w-4xl mx-auto px-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'IRS Audit Defense with AI', href: '/blog/irs-audit-defense-ai-documentation-guide-2026' },
            { title: 'LLC vs S-Corp vs C-Corp', href: '/blog/business-entity-selection-tax-optimization-llc-scorp-2026' },
            { title: 'R&D Tax Credit for Software Companies', href: '/blog/r-and-d-tax-credit-software-companies-startups-2026' },
          ].map(a => (
            <a key={a.href} href={a.href} className="p-4 rounded-lg border text-sm font-medium hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--ept-card-border)', color: 'var(--ept-accent)' }}>
              {a.title} &rarr;
            </a>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: 'How does AI tax preparation actually work?', a: 'You upload your tax documents (W-2s, 1099s, receipts) and our system extracts all data automatically using OCR and AI classification. 14 specialized Tax Intelligence Engines then analyze your situation against the full Internal Revenue Code, identifying every applicable deduction, credit, and optimization strategy before generating your complete return.' },
            { q: 'Is my tax data secure?', a: 'All tax documents and personal data are encrypted with AES-256-GCM at rest and in transit. We follow IRS Publication 4557 security standards for tax preparers. Your data is never used for AI training, never shared with third parties, and you can request full deletion at any time.' },
            { q: 'What types of tax returns do you support?', a: 'We handle individual returns (1040), self-employment (Schedule C/SE), rental income (Schedule E), investment income (Schedule D), and multi-state filings. Support for partnership (1065) and S-Corp (1120-S) returns is available on Business and Enterprise plans.' },
            { q: 'How much can the AI save me compared to doing taxes myself?', a: 'Our 14 TX Engines scan the entire IRC code for deductions and credits most people miss. On average, AI-optimized returns identify 15-30% more deductions than self-prepared returns. The what-if scenario tool lets you compare filing strategies side by side so you can see exactly how much each optimization saves.' },
            { q: 'Who reviews my return before filing?', a: 'Every return goes through a multi-stage review: AI validation checks for mathematical accuracy and completeness, the audit risk engine flags potential issues, and a licensed tax preparer performs final review. You receive a detailed return health score and can ask questions before authorizing submission.' },
            { q: 'What if I get audited?', a: 'Every answer and recommendation our engines produce includes full IRC authority citations and confidence scoring. If the IRS questions any position on your return, we provide complete documentation of the legal basis for each line item. Business and Enterprise plans include audit defense support with doctrine-backed response preparation.' },
          ].map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-xs" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
        <p>Echo Prime Technologies | Tax Return Preparation Service | Powered by 14 TX Engines</p>
        <p className="mt-1">Preparer: Bobby Don McWilliams II | Midland, TX</p>
      </footer>
      <ProductTutorialButton tutorialId="tax-returns" productName="AI Tax Returns" />
    </div>
  );
}

// ===============================================================
// SHARED COMPONENTS
// ===============================================================

function Input({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all"
        style={{
          backgroundColor: 'var(--ept-surface)',
          border: '1px solid var(--ept-border)',
          color: 'var(--ept-text)',
        }}
      />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
      <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--ept-text)' }}>{title}</h4>
      {children}
    </div>
  );
}

function ActionBtn({ label, onClick, loading, color }: { label: string; onClick: () => void; loading: boolean; color: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}40` }}
    >
      {label}
    </button>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>
      <div className="text-xs mb-1" style={{ color: 'var(--ept-text-muted)' }}>{label}</div>
      <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
    </div>
  );
}

function NeedReturn({ onGo, message }: { onGo: () => void; message: string }) {
  return (
    <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
      <p style={{ color: 'var(--ept-text-muted)' }}>{message}</p>
      <button onClick={onGo} className="mt-3 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
        Go to Intake
      </button>
    </div>
  );
}

export default function TaxReturnPage() {
  return <SubscriptionGate serviceId="tax-return-prep"><TaxReturnPageContent /></SubscriptionGate>;
}
