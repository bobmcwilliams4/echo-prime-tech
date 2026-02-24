'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  createClient, createReturn, getReturn, addIncome, deleteIncome,
  addDeduction, deleteDeduction, addDependent, deleteDependent,
  uploadDocument, calculateReturn, getOptimizations, getReturnForms,
  getPricing, createCheckout, healthCheck,
  type Client, type TaxReturn, type IncomeItem, type Deduction,
  type Dependent, type TaxDocument, type Optimization, type TaxCalculation,
  type PricingTier,
} from '../../lib/tax-return-api';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type Tab = 'hero' | 'intake' | 'documents' | 'dashboard' | 'forms' | 'status';
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

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function TaxReturnPage() {
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

  // Intake form
  const [intakeStep, setIntakeStep] = useState<IntakeStep>(1);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', ssn: '', dob: '', phone: '',
    address_street: '', address_city: '', address_state: '', address_zip: '',
    filing_status: 'single', tax_year: 2024,
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

  useEffect(() => {
    getPricing().then(setPricing).catch(() => {});
  }, []);

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

  // ─── Handlers ──────────────────────────────────────────────

  const handleCreateClient = async () => {
    clearMessages(); setLoading(true);
    try {
      const c = await createClient({
        first_name: form.first_name, last_name: form.last_name, email: form.email,
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

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#0d1321] to-[#0a0e17] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm">&larr; Home</Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Tax Return Preparation
            </h1>
          </div>
          <div className="flex gap-1 text-xs">
            {(['hero', 'intake', 'documents', 'dashboard', 'forms', 'status'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${tab === t ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-300 hover:text-white">x</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-emerald-300 hover:text-white">x</button>
          </div>
        )}

        {/* ═══ HERO TAB ═══ */}
        {tab === 'hero' && (
          <div className="space-y-12">
            <div className="text-center space-y-6 py-12">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Professional Tax Preparation
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Powered by 14 AI Tax Intelligence Engines. Accurate calculations, expert optimization,
                and dedicated preparer review for every return.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setTab('intake')} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
                  Start Your Return
                </button>
                <a href="#pricing" className="px-8 py-3 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-all">
                  View Pricing
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'AI-Powered Analysis', desc: '14 specialized tax engines analyze every aspect of your return — from standard deductions to oil & gas taxation.', icon: '\u{1F9E0}' },
                { title: 'Optimization Engine', desc: 'Our TX engines identify deductions, credits, and strategies you might miss. Average savings of $2,400+ per complex return.', icon: '\u{1F4B0}' },
                { title: 'Expert Review', desc: 'Every return is reviewed by a qualified preparer before filing. PTIN-certified with full audit support.', icon: '\u{1F50D}' },
              ].map(f => (
                <div key={f.title} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div id="pricing" className="space-y-6">
              <h3 className="text-3xl font-bold text-center">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(pricing.length ? pricing : [
                  { tier: 'basic', price: 150, name: 'Basic', description: 'W-2 only', includes: ['Federal 1040', 'W-2 income', 'E-file'] },
                  { tier: 'standard', price: 250, name: 'Standard', description: 'W-2 + 1099s', includes: ['All Basic', '1099 forms', 'Itemized deductions'] },
                  { tier: 'complex', price: 400, name: 'Complex', description: 'Investments + rental', includes: ['All Standard', 'Schedule D/E', 'TX engine optimization'] },
                  { tier: 'business', price: 600, name: 'Business', description: 'Self-employment', includes: ['All Complex', 'Schedule C/SE', 'QBI deduction'] },
                  { tier: 'oilgas', price: 750, name: 'Oil & Gas', description: 'IDC, depletion, royalties', includes: ['All Business', 'TX12 engine', 'Mineral rights analysis'] },
                ]).map((p, i) => (
                  <div key={p.tier} className={`p-5 rounded-2xl border transition-all ${i === 2 ? 'bg-cyan-500/10 border-cyan-500/40 scale-105' : 'bg-white/5 border-white/10 hover:border-cyan-500/20'}`}>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">{p.name}</div>
                    <div className="text-3xl font-bold text-white my-2">${p.price}</div>
                    <div className="text-xs text-gray-500 mb-4">{p.description}</div>
                    <ul className="space-y-1.5">
                      {p.includes.map(inc => (
                        <li key={inc} className="text-xs text-gray-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">&#10003;</span> {inc}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setTab('intake')}
                      className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-all ${i === 2 ? 'bg-cyan-500 text-white hover:bg-cyan-400' : 'bg-white/10 hover:bg-white/20'}`}>
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TX Engine Logos */}
            <div className="text-center space-y-3 pb-8">
              <p className="text-sm text-gray-500 uppercase tracking-widest">Powered by Echo Prime Tax Intelligence</p>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 14 }, (_, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-cyan-400 border border-cyan-500/20">
                    TX{String(i + 1).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ INTAKE TAB ═══ */}
        {tab === 'intake' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full ${s <= intakeStep ? 'bg-cyan-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <div className="text-sm text-gray-400 mb-2">Step {intakeStep} of 3</div>

            {/* Step 1: Personal Info */}
            {intakeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name *" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
                  <Input label="Last Name *" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} />
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
                  <label className="block text-sm text-gray-400 mb-1">Filing Status *</label>
                  <select value={form.filing_status} onChange={e => setForm(f => ({ ...f, filing_status: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none">
                    {FILING_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tax Year</label>
                  <select value={form.tax_year} onChange={e => setForm(f => ({ ...f, tax_year: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none">
                    {[2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <button onClick={handleCreateClient} disabled={loading || !form.first_name || !form.last_name}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold disabled:opacity-50 hover:from-cyan-400 hover:to-blue-500 transition-all">
                  {loading ? 'Creating...' : 'Continue to Dependents'}
                </button>
              </div>
            )}

            {/* Step 2: Dependents */}
            {intakeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Dependents</h3>
                <p className="text-sm text-gray-400">Add any dependents claimed on your return. Skip if none.</p>

                {dependents.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <span className="font-medium">{d.first_name} {d.last_name}</span>
                      <span className="text-xs text-gray-400 ml-2">{d.relationship}</span>
                      {d.qualifies_ctc ? <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">CTC</span> : null}
                    </div>
                    <button onClick={async () => {
                      if (taxReturn) { await deleteDependent(taxReturn.id, d.id); setDependents(prev => prev.filter(x => x.id !== d.id)); }
                    }} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                ))}

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="First Name" value={depForm.first_name} onChange={v => setDepForm(f => ({ ...f, first_name: v }))} />
                    <Input label="Last Name" value={depForm.last_name} onChange={v => setDepForm(f => ({ ...f, last_name: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date of Birth" value={depForm.dob} onChange={v => setDepForm(f => ({ ...f, dob: v }))} type="date" />
                    <Input label="Relationship" value={depForm.relationship} onChange={v => setDepForm(f => ({ ...f, relationship: v }))} placeholder="Child, Parent, etc." />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={depForm.qualifies_ctc} onChange={e => setDepForm(f => ({ ...f, qualifies_ctc: e.target.checked }))}
                        className="rounded bg-white/10 border-white/20" /> Child Tax Credit
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={depForm.qualifies_odc} onChange={e => setDepForm(f => ({ ...f, qualifies_odc: e.target.checked }))}
                        className="rounded bg-white/10 border-white/20" /> Other Dependent Credit
                    </label>
                  </div>
                  <button onClick={handleAddDependent} disabled={loading || !depForm.first_name}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 disabled:opacity-50">
                    + Add Dependent
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(1)} className="flex-1 py-3 bg-white/5 rounded-xl hover:bg-white/10">Back</button>
                  <button onClick={() => setIntakeStep(3)} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold">
                    Continue to Income
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Income & Deductions */}
            {intakeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Income & Deductions</h3>

                {/* Income */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-400">Income Sources</h4>
                  {incomeItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <span className="text-sm font-medium capitalize">{item.category.replace(/_/g, ' ')}</span>
                        {item.description && <span className="text-xs text-gray-400 ml-2">- {item.description}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400">{fmt(item.amount)}</span>
                        {item.tax_withheld > 0 && <span className="text-xs text-gray-400">W/H: {fmt(item.tax_withheld)}</span>}
                        <button onClick={async () => {
                          if (taxReturn) { await deleteIncome(taxReturn.id, item.id); setIncomeItems(prev => prev.filter(x => x.id !== item.id)); }
                        }} className="text-red-400 hover:text-red-300 text-xs">x</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Category</label>
                        <select value={incomeForm.category} onChange={e => setIncomeForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none">
                          {INCOME_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <Input label="Description" value={incomeForm.description} onChange={v => setIncomeForm(f => ({ ...f, description: v }))} placeholder="Employer name" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Amount *" value={incomeForm.amount} onChange={v => setIncomeForm(f => ({ ...f, amount: v }))} type="number" placeholder="0.00" />
                      <Input label="Tax Withheld" value={incomeForm.tax_withheld} onChange={v => setIncomeForm(f => ({ ...f, tax_withheld: v }))} type="number" placeholder="0.00" />
                    </div>
                    <button onClick={handleAddIncome} disabled={loading || !incomeForm.amount}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 disabled:opacity-50">
                      + Add Income
                    </button>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-emerald-400">Deductions</h4>
                  {deductions.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <span className="text-sm font-medium capitalize">{d.category.replace(/_/g, ' ')}</span>
                        {d.description && <span className="text-xs text-gray-400 ml-2">- {d.description}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-amber-400">{fmt(d.amount)}</span>
                        <button onClick={async () => {
                          if (taxReturn) { await deleteDeduction(taxReturn.id, d.id); setDeductions(prev => prev.filter(x => x.id !== d.id)); }
                        }} className="text-red-400 hover:text-red-300 text-xs">x</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Category</label>
                        <select value={deductionForm.category} onChange={e => setDeductionForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none">
                          {DEDUCTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <Input label="Description" value={deductionForm.description} onChange={v => setDeductionForm(f => ({ ...f, description: v }))} />
                    </div>
                    <Input label="Amount *" value={deductionForm.amount} onChange={v => setDeductionForm(f => ({ ...f, amount: v }))} type="number" placeholder="0.00" />
                    <button onClick={handleAddDeduction} disabled={loading || !deductionForm.amount}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 disabled:opacity-50">
                      + Add Deduction
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setIntakeStep(2)} className="flex-1 py-3 bg-white/5 rounded-xl hover:bg-white/10">Back</button>
                  <button onClick={handleCalculate} disabled={loading || incomeItems.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl font-semibold disabled:opacity-50">
                    {loading ? 'Calculating...' : 'Calculate My Return'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ DOCUMENTS TAB ═══ */}
        {tab === 'documents' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Document Upload</h3>
            {!taxReturn ? (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400">Complete the intake form first to upload documents.</p>
                <button onClick={() => setTab('intake')} className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm">Go to Intake</button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Document Type</label>
                      <select value={uploadDocType} onChange={e => setUploadDocType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none">
                        {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <Input label="Issuer / Employer Name" value={uploadIssuer} onChange={setUploadIssuer} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">File (PDF, JPG, PNG — max 10MB)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-400" />
                  </div>
                  <button onClick={handleUpload} disabled={loading || !uploadFile}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 disabled:opacity-50">
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Uploaded Documents</h4>
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase">{doc.doc_type}</span>
                          <span className="text-sm">{doc.issuer_name || 'Unknown issuer'}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${doc.status === 'parsed' ? 'bg-emerald-500/20 text-emerald-400' : doc.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
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

        {/* ═══ DASHBOARD TAB ═══ */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {!calculation && !taxReturn ? (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400">Complete intake and calculate your return to see the dashboard.</p>
                <button onClick={() => setTab('intake')} className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm">Go to Intake</button>
              </div>
            ) : calculation ? (
              <>
                {/* Refund / Owed Banner */}
                <div className={`p-6 rounded-2xl text-center ${calculation.refund_or_owed >= 0 ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30' : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30'}`}>
                  <div className="text-sm text-gray-300 mb-1">{calculation.refund_or_owed >= 0 ? 'Estimated Refund' : 'Estimated Amount Owed'}</div>
                  <div className={`text-5xl font-bold ${calculation.refund_or_owed >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmt(Math.abs(calculation.refund_or_owed))}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Tax Year {calculation.tax_year} | {calculation.filing_status.replace(/_/g, ' ')}</div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Income', value: fmt(calculation.income_summary.total), color: 'text-white' },
                    { label: 'AGI', value: fmt(calculation.agi), color: 'text-blue-400' },
                    { label: 'Taxable Income', value: fmt(calculation.taxable_income), color: 'text-yellow-400' },
                    { label: 'Total Tax', value: fmt(calculation.total_tax), color: 'text-red-400' },
                  ].map(card => (
                    <div key={card.label} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                      <div className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Income Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3">Income Breakdown</h4>
                    {Object.entries(calculation.income_summary)
                      .filter(([k, v]) => k !== 'total' && v > 0)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-sm text-gray-300 capitalize">{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono text-sm">{fmt(v)}</span>
                        </div>
                      ))}
                    <div className="flex justify-between pt-2 font-semibold">
                      <span>Total</span>
                      <span className="font-mono">{fmt(calculation.income_summary.total)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3">Deductions</h4>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-sm text-gray-300">Standard Deduction</span>
                      <span className={`font-mono text-sm ${calculation.deductions.method === 'standard' ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {fmt(calculation.deductions.standard)} {calculation.deductions.method === 'standard' ? '\u2713' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-sm text-gray-300">Itemized Deductions</span>
                      <span className={`font-mono text-sm ${calculation.deductions.method === 'itemized' ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {fmt(calculation.deductions.itemized)} {calculation.deductions.method === 'itemized' ? '\u2713' : ''}
                      </span>
                    </div>
                    {calculation.qbi_deduction > 0 && (
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-sm text-gray-300">QBI Deduction (Sec. 199A)</span>
                        <span className="font-mono text-sm text-emerald-400">{fmt(calculation.qbi_deduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 font-semibold">
                      <span>Total Deduction</span>
                      <span className="font-mono">{fmt(calculation.deductions.amount + calculation.qbi_deduction)}</span>
                    </div>
                  </div>
                </div>

                {/* Tax Brackets */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-lg font-semibold mb-3">Tax Bracket Breakdown</h4>
                  <div className="space-y-2">
                    {calculation.tax_bracket_detail.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs w-12 text-right font-mono text-cyan-400">{(b.rate * 100).toFixed(0)}%</span>
                        <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, (b.taxable_in_bracket / calculation.taxable_income) * 100)}%` }} />
                        </div>
                        <span className="text-xs font-mono text-gray-300 w-24 text-right">{fmt(b.tax_in_bracket)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-2 border-t border-white/10 font-semibold">
                    <span>Regular Tax</span>
                    <span className="font-mono">{fmt(calculation.regular_tax)}</span>
                  </div>
                </div>

                {/* Credits & Payments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3">Credits</h4>
                    {Object.entries(calculation.credits)
                      .filter(([k, v]) => k !== 'total' && v > 0)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-sm text-gray-300 uppercase">{k}</span>
                          <span className="font-mono text-sm text-emerald-400">-{fmt(v)}</span>
                        </div>
                      ))}
                    <div className="flex justify-between pt-2 font-semibold">
                      <span>Total Credits</span>
                      <span className="font-mono text-emerald-400">-{fmt(calculation.credits.total)}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3">Payments & Withholding</h4>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-sm text-gray-300">Federal Withholding</span>
                      <span className="font-mono text-sm">{fmt(calculation.payments.withholding)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-sm text-gray-300">Estimated Payments</span>
                      <span className="font-mono text-sm">{fmt(calculation.payments.estimated)}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-semibold">
                      <span>Total Payments</span>
                      <span className="font-mono">{fmt(calculation.payments.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={handleOptimize} disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold disabled:opacity-50 hover:from-purple-400 hover:to-pink-500">
                    {loading ? 'Optimizing...' : 'Run AI Optimization'}
                  </button>
                  <button onClick={handleGetForms} disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold disabled:opacity-50">
                    View 1040 Form
                  </button>
                </div>

                {/* Optimizations */}
                {optimizations.length > 0 && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-3">
                    <h4 className="text-lg font-semibold text-purple-400">AI Optimization Suggestions</h4>
                    {optimizations.map((opt, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase">{opt.engine_id}</span>
                          <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded capitalize">{opt.category}</span>
                          {opt.potential_savings > 0 && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                              Save ~{fmt(opt.potential_savings)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{opt.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400">
                <p>Return exists but not yet calculated.</p>
                <button onClick={handleCalculate} className="mt-3 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg">Calculate Now</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ FORMS TAB ═══ */}
        {tab === 'forms' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Form 1040 Preview</h3>
            {!formData?.form_1040 ? (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400">Calculate your return first to preview forms.</p>
                <button onClick={handleGetForms} disabled={loading || !taxReturn}
                  className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm disabled:opacity-50">
                  {loading ? 'Loading...' : 'Generate Forms'}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-white border border-gray-200 rounded-xl text-black font-mono text-sm space-y-4">
                <div className="text-center border-b-2 border-black pb-3">
                  <div className="text-lg font-bold">Form 1040 — U.S. Individual Income Tax Return</div>
                  <div className="text-sm">Tax Year {formData.form_1040.tax_year}</div>
                </div>
                <div className="border-b border-gray-300 pb-2">
                  <div>{formData.form_1040.taxpayer.first_name} {formData.form_1040.taxpayer.last_name}</div>
                  <div className="text-xs text-gray-600">{formData.form_1040.taxpayer.address}</div>
                  <div className="text-xs text-gray-600">Filing Status: {formData.form_1040.filing_status.replace(/_/g, ' ')}</div>
                </div>
                {formData.form_1040.dependents?.length > 0 && (
                  <div className="border-b border-gray-300 pb-2">
                    <div className="font-bold text-xs">Dependents:</div>
                    {formData.form_1040.dependents.map((d: any, i: number) => (
                      <div key={i} className="text-xs">{d.name} ({d.relationship})</div>
                    ))}
                  </div>
                )}
                <table className="w-full text-xs">
                  <tbody>
                    {formData.form_1040.lines.map((line: any) => (
                      <tr key={line.line} className="border-b border-gray-100">
                        <td className="py-1 w-16 text-gray-500">Line {line.line}</td>
                        <td className="py-1">{line.description}</td>
                        <td className="py-1 text-right w-28">{line.amount !== 0 ? fmt(line.amount) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Schedules */}
                {formData.form_1040.schedules && Object.entries(formData.form_1040.schedules).map(([name, lines]: [string, any]) => (
                  <div key={name} className="mt-4 pt-3 border-t-2 border-black">
                    <div className="font-bold text-sm mb-2">{name.replace(/_/g, ' ').toUpperCase()}</div>
                    <table className="w-full text-xs">
                      <tbody>
                        {lines.map((line: any) => (
                          <tr key={line.line} className="border-b border-gray-100">
                            <td className="py-1 w-16 text-gray-500">{line.line}</td>
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

        {/* ═══ STATUS TAB ═══ */}
        {tab === 'status' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Return Status</h3>
            {!taxReturn ? (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center text-gray-400">
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isComplete ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                          {isComplete ? '\u2713' : i + 1}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`w-12 h-0.5 ${i < currentIdx ? 'bg-emerald-500' : 'bg-white/10'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 px-2">
                  {STATUS_STEPS.map(s => <span key={s} className="capitalize">{s}</span>)}
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Return ID</span><span className="font-mono text-sm">{taxReturn.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Tax Year</span><span>{taxReturn.tax_year}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="capitalize text-cyan-400">{taxReturn.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total Income</span><span className="font-mono">{fmt(taxReturn.total_income)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">AGI</span><span className="font-mono">{fmt(taxReturn.adjusted_gross_income)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total Tax</span><span className="font-mono">{fmt(taxReturn.total_tax)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{taxReturn.refund_or_owed >= 0 ? 'Refund' : 'Amount Owed'}</span>
                    <span className={`font-mono font-bold ${taxReturn.refund_or_owed >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fmt(Math.abs(taxReturn.refund_or_owed))}
                    </span>
                  </div>
                  {taxReturn.filed_at && <div className="flex justify-between"><span className="text-gray-400">Filed At</span><span>{new Date(taxReturn.filed_at).toLocaleString()}</span></div>}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8 text-center text-xs text-gray-500">
        <p>Echo Prime Technologies | Tax Return Preparation Service</p>
        <p className="mt-1">Powered by 14 AI Tax Intelligence Engines (TX01-TX14)</p>
        <p className="mt-1">Preparer: Bobby Don McWilliams II | Midland, TX</p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Input({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-gray-600" />
    </div>
  );
}
