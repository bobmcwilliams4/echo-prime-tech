'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';

/* ═══════════════════════════════════════════════════════════════
   CGC GRADING DATA
   ═══════════════════════════════════════════════════════════════ */

const CGC_GRADES: Record<number, string> = {
  10.0: 'Gem Mint', 9.9: 'Mint', 9.8: 'Near Mint/Mint',
  9.6: 'Near Mint+', 9.4: 'Near Mint', 9.2: 'Near Mint-',
  9.0: 'VF/NM', 8.5: 'Very Fine+', 8.0: 'Very Fine',
  7.5: 'Very Fine-', 7.0: 'Fine/VF', 6.5: 'Fine+',
  6.0: 'Fine', 5.5: 'Fine-', 5.0: 'VG/Fine',
  4.5: 'Very Good+', 4.0: 'Very Good', 3.5: 'Very Good-',
  3.0: 'Good/VG', 2.5: 'Good+', 2.0: 'Good',
  1.8: 'Good-', 1.5: 'Fair/Good', 1.0: 'Fair', 0.5: 'Poor',
};

const getGradeLabel = (g: number) => {
  const closest = Object.keys(CGC_GRADES).map(Number).reduce((a, b) => Math.abs(b - g) < Math.abs(a - g) ? b : a);
  return CGC_GRADES[closest];
};

const getGradeColor = (g: number) =>
  g >= 9.0 ? 'var(--ept-accent)' : g >= 7.0 ? '#22c55e' : g >= 5.0 ? '#f59e0b' : g >= 3.0 ? '#f97316' : '#ef4444';

const AI_PROVIDERS = [
  { name: 'Claude', weight: 35, active: true },
  { name: 'Gemini', weight: 25, active: true },
  { name: 'GPT-4', weight: 20, active: true },
  { name: 'Groq', weight: 15, active: false },
  { name: 'DeepSeek', weight: 5, active: false },
];

const DEFECT_TYPES = [
  { key: 'spine', label: 'Spine', icon: '📏', desc: 'Stress lines, roll, splits' },
  { key: 'cover', label: 'Cover', icon: '📖', desc: 'Tears, creases, detachment' },
  { key: 'pages', label: 'Pages', icon: '📄', desc: 'Yellowing, brittleness, foxing' },
  { key: 'staples', label: 'Staples', icon: '📎', desc: 'Rust, migration, pop' },
  { key: 'corners', label: 'Corners', icon: '📐', desc: 'Blunting, bending, chips' },
  { key: 'edges', label: 'Edges', icon: '✂️', desc: 'Wear, chips, tears' },
];

interface Comic {
  id: number;
  title: string;
  issue: string;
  publisher: string;
  year: number;
  grade: number | null;
  estimated_value: number | null;
  image_url: string | null;
  status: 'ungraded' | 'grading' | 'graded' | 'pending_review';
  defects: string[];
  consensus_confidence: number | null;
  graded_at: string | null;
}

const SAMPLE_COMICS: Comic[] = [
  { id: 1, title: 'Amazing Spider-Man', issue: '#129', publisher: 'Marvel', year: 1974, grade: 8.5, estimated_value: 12500, image_url: null, status: 'graded', defects: ['spine_stress', 'corner_blunt'], consensus_confidence: 92, graded_at: '2026-02-19T10:30:00Z' },
  { id: 2, title: 'X-Men', issue: '#1', publisher: 'Marvel', year: 1963, grade: 7.0, estimated_value: 48000, image_url: null, status: 'graded', defects: ['page_yellowing', 'spine_roll'], consensus_confidence: 88, graded_at: '2026-02-19T09:15:00Z' },
  { id: 3, title: 'Batman', issue: '#404', publisher: 'DC', year: 1987, grade: 9.2, estimated_value: 350, image_url: null, status: 'graded', defects: [], consensus_confidence: 96, graded_at: '2026-02-19T08:00:00Z' },
  { id: 4, title: 'Incredible Hulk', issue: '#181', publisher: 'Marvel', year: 1974, grade: 6.5, estimated_value: 8200, image_url: null, status: 'graded', defects: ['cover_crease', 'staple_rust'], consensus_confidence: 85, graded_at: '2026-02-18T16:00:00Z' },
  { id: 5, title: 'Action Comics', issue: '#1', publisher: 'DC', year: 1938, grade: 4.0, estimated_value: 1250000, image_url: null, status: 'graded', defects: ['cover_detached', 'page_brittle', 'spine_split'], consensus_confidence: 91, graded_at: '2026-02-18T14:30:00Z' },
  { id: 6, title: 'Detective Comics', issue: '#27', publisher: 'DC', year: 1939, grade: null, estimated_value: null, image_url: null, status: 'ungraded', defects: [], consensus_confidence: null, graded_at: null },
  { id: 7, title: 'Fantastic Four', issue: '#1', publisher: 'Marvel', year: 1961, grade: null, estimated_value: null, image_url: null, status: 'ungraded', defects: [], consensus_confidence: null, graded_at: null },
  { id: 8, title: 'Tales of Suspense', issue: '#39', publisher: 'Marvel', year: 1963, grade: null, estimated_value: null, image_url: null, status: 'pending_review', defects: ['corner_chip'], consensus_confidence: 72, graded_at: null },
];

const formatCurrency = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`;
const formatDate = (d: string) => { const dt = new Date(d); return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

/* ═══════════════════════════════════════════════════════════════
   WAVE CANVAS
   ═══════════════════════════════════════════════════════════════ */
function WaveCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    let raf: number;
    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;
      const cy = canvas.height / 2;
      const amp = canvas.height * 0.3;
      const pts = 100;
      // fill
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, 'rgba(13,115,119,0.15)');
      grad.addColorStop(0.5, 'rgba(20,184,166,0.2)');
      grad.addColorStop(1, 'rgba(13,115,119,0.15)');
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * canvas.width;
        const y = cy + Math.sin(t * 2 + i * 0.1) * amp * 0.5 + Math.sin(t * 3 + i * 0.15) * amp * 0.3;
        i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // line
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * canvas.width;
        const y = cy + Math.sin(t * 2 + i * 0.1) * amp * 0.5 + Math.sin(t * 3 + i * 0.15) * amp * 0.3;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'var(--ept-accent, #14b8a6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function GradingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collection' | 'grade' | 'pricing' | 'settings'>('dashboard');
  const [comics, setComics] = useState<Comic[]>(SAMPLE_COMICS);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGrading, setIsGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [gradingStep, setGradingStep] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h < 6 || h >= 18);
    document.documentElement.classList.toggle('dark', h < 6 || h >= 18);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const filteredComics = useMemo(() => comics.filter(c => {
    const matchSearch = !searchQuery || `${c.title} ${c.issue} ${c.publisher}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [comics, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: comics.length,
    graded: comics.filter(c => c.status === 'graded').length,
    ungraded: comics.filter(c => c.status === 'ungraded').length,
    pending: comics.filter(c => c.status === 'pending_review').length,
    totalValue: comics.filter(c => c.estimated_value).reduce((s, c) => s + (c.estimated_value || 0), 0),
    avgGrade: (() => { const g = comics.filter(c => c.grade !== null); return g.length ? g.reduce((s, c) => s + (c.grade || 0), 0) / g.length : 0; })(),
    avgConfidence: (() => { const g = comics.filter(c => c.consensus_confidence !== null); return g.length ? g.reduce((s, c) => s + (c.consensus_confidence || 0), 0) / g.length : 0; })(),
  }), [comics]);

  const simulateGrading = useCallback((comic: Comic) => {
    setIsGrading(true);
    setGradingProgress(0);
    const steps = [
      { pct: 10, msg: 'Analyzing front cover...' },
      { pct: 25, msg: 'Analyzing back cover...' },
      { pct: 40, msg: 'Detecting defects (spine, edges, corners)...' },
      { pct: 55, msg: 'Claude AI grading... (weight: 35%)' },
      { pct: 65, msg: 'Gemini AI grading... (weight: 25%)' },
      { pct: 75, msg: 'GPT-4 grading... (weight: 20%)' },
      { pct: 85, msg: 'Computing consensus vote...' },
      { pct: 95, msg: 'Fetching market pricing...' },
      { pct: 100, msg: 'Grading complete!' },
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        setGradingProgress(s.pct);
        setGradingStep(s.msg);
        if (s.pct === 100) {
          const grade = +(Math.random() * 4 + 6).toFixed(1);
          const value = Math.round(Math.random() * 50000 + 500);
          const defects = ['spine_stress', 'corner_blunt', 'page_yellowing', 'cover_crease'].filter(() => Math.random() > 0.6);
          setComics(prev => prev.map(c => c.id === comic.id ? { ...c, grade, estimated_value: value, status: 'graded' as const, defects, consensus_confidence: Math.round(Math.random() * 15 + 80), graded_at: new Date().toISOString() } : c));
          setTimeout(() => { setIsGrading(false); setGradingProgress(0); setGradingStep(''); }, 1500);
        }
      }, i * 800);
    });
  }, []);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'collection', label: 'Collection', icon: '📦' },
    { id: 'grade', label: 'Grade', icon: '🎯' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b px-6 py-3 flex items-center justify-between backdrop-blur-xl" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-nav-bg)' }}>
        <div className="flex items-center gap-6">
          <Link href="/dashboard"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[120px] md:w-[160px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
          <div className="h-6 w-px" style={{ backgroundColor: 'var(--ept-border)' }} />
          <span className="text-sm font-bold tracking-widest uppercase gradient-text">Collectibles Grading</span>
        </div>
        <div className="flex items-center gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: activeTab === t.id ? 'var(--ept-accent-glow)' : 'transparent', color: activeTab === t.id ? 'var(--ept-accent)' : 'var(--ept-text-muted)', border: activeTab === t.id ? '1px solid var(--ept-accent)' : '1px solid transparent' }}>
              <span className="mr-1">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user.photoURL ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border" style={{ borderColor: 'var(--ept-border)' }} /> : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ══════════════ DASHBOARD ══════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold">Collection Overview</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>AI-powered multi-model consensus grading system</p>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Items Graded', value: String(stats.graded), sub: `of ${stats.total} total` },
                { label: 'Collection Value', value: formatCurrency(stats.totalValue), sub: 'estimated market value' },
                { label: 'Avg Grade', value: stats.avgGrade.toFixed(1), sub: getGradeLabel(stats.avgGrade) },
                { label: 'AI Confidence', value: `${Math.round(stats.avgConfidence)}%`, sub: '5-model consensus' },
              ].map((s, i) => (
                <div key={s.label} className="rounded-xl p-5 card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</p>
                  <p className="text-3xl font-extrabold mt-1 gradient-text">{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Wave Viz + AI Providers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--ept-border)' }}>
                  <span className="gradient-text font-bold text-xs tracking-widest uppercase">Grading Activity</span>
                </div>
                <div className="h-32"><WaveCanvas /></div>
              </div>
              <div className="rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--ept-border)' }}>
                  <span className="gradient-text font-bold text-xs tracking-widest uppercase">AI Providers</span>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {AI_PROVIDERS.map(p => (
                    <span key={p.name} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={{ backgroundColor: p.active ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', color: p.active ? 'var(--ept-accent)' : 'var(--ept-text-muted)', border: `1px solid ${p.active ? 'var(--ept-accent)' : 'var(--ept-border)'}` }}>
                      {p.name} <span className="opacity-60">({p.weight}%)</span>
                    </span>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>85% agreement threshold for consensus</p>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>2+ models must confirm each defect</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
                <span className="gradient-text font-bold text-xs tracking-widest uppercase">Recent Gradings</span>
                <button onClick={() => setActiveTab('collection')} className="text-xs font-medium" style={{ color: 'var(--ept-accent)' }}>View All &rarr;</button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
                {comics.filter(c => c.status === 'graded').slice(0, 5).map(c => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--ept-surface-hover)] transition-colors cursor-pointer" onClick={() => { setSelectedComic(c); setActiveTab('collection'); }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>📚</div>
                      <div>
                        <p className="font-semibold text-sm">{c.title} {c.issue}</p>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} &middot; {c.year} {c.graded_at && `\u00B7 ${formatDate(c.graded_at)}`}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold font-mono" style={{ color: getGradeColor(c.grade!) }}>{c.grade}</p>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.estimated_value ? formatCurrency(c.estimated_value) : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ COLLECTION ══════════════ */}
        {activeTab === 'collection' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">Collection</h1>
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Search comics..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-4 py-2 rounded-lg text-sm focus:outline-none" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                <div className="flex gap-1">
                  {['all', 'graded', 'ungraded', 'pending_review'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: statusFilter === s ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', color: statusFilter === s ? 'var(--ept-accent)' : 'var(--ept-text-muted)', border: statusFilter === s ? '1px solid var(--ept-accent)' : '1px solid var(--ept-border)' }}>
                      {s === 'all' ? 'All' : s === 'pending_review' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComics.map(c => (
                <div key={c.id} onClick={() => setSelectedComic(selectedComic?.id === c.id ? null : c)} className="rounded-xl p-5 cursor-pointer card-hover transition-all" style={{ backgroundColor: 'var(--ept-card-bg)', border: selectedComic?.id === c.id ? '2px solid var(--ept-accent)' : '1px solid var(--ept-card-border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold">{c.title} {c.issue}</p>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} &middot; {c.year}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: c.status === 'graded' ? 'rgba(34,197,94,0.1)' : c.status === 'ungraded' ? 'var(--ept-surface)' : 'rgba(245,158,11,0.1)', color: c.status === 'graded' ? '#22c55e' : c.status === 'ungraded' ? 'var(--ept-text-muted)' : '#f59e0b' }}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  {c.grade !== null ? (
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-4xl font-extrabold font-mono" style={{ color: getGradeColor(c.grade) }}>{c.grade}</p>
                        <p className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{getGradeLabel(c.grade)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{c.estimated_value ? formatCurrency(c.estimated_value) : '—'}</p>
                        {c.consensus_confidence && <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.consensus_confidence}% confidence</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Not yet graded</p>
                      <button onClick={e => { e.stopPropagation(); simulateGrading(c); }} className="px-4 py-2 rounded-lg text-xs font-bold transition-all" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Grade Now</button>
                    </div>
                  )}
                  {c.defects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {c.defects.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>{d.replace('_', ' ')}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedComic && selectedComic.grade !== null && (
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '2px solid var(--ept-accent)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold">{selectedComic.title} {selectedComic.issue}</h2>
                    <p style={{ color: 'var(--ept-text-muted)' }}>{selectedComic.publisher} &middot; {selectedComic.year}</p>
                  </div>
                  <button onClick={() => setSelectedComic(null)} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>✕</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Grade</p>
                    <p className="text-3xl font-extrabold font-mono" style={{ color: getGradeColor(selectedComic.grade!) }}>{selectedComic.grade}</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{getGradeLabel(selectedComic.grade!)}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Market Value</p>
                    <p className="text-2xl font-extrabold gradient-text">{selectedComic.estimated_value ? formatCurrency(selectedComic.estimated_value) : '—'}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>AI Confidence</p>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{selectedComic.consensus_confidence}%</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>5-model consensus</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Defects</p>
                    <p className="text-2xl font-extrabold">{selectedComic.defects.length}</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{selectedComic.defects.length === 0 ? 'No defects found' : 'confirmed by 2+ models'}</p>
                  </div>
                </div>
                {/* Defect Breakdown */}
                {selectedComic.defects.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Detected Defects</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DEFECT_TYPES.filter(d => selectedComic.defects.some(cd => cd.includes(d.key))).map(d => (
                        <div key={d.key} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <span className="text-lg">{d.icon}</span>
                          <div>
                            <p className="text-sm font-semibold">{d.label}</p>
                            <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{d.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ GRADE ══════════════ */}
        {activeTab === 'grade' && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold">AI Grading Studio</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Upload an image or select from your collection to grade</p>
            </div>

            {/* Upload Area */}
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '2px dashed var(--ept-border)' }}>
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)' }}>📸</div>
              <p className="font-bold text-lg">Drop comic images here</p>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>or click to browse. Supports JPG, PNG, HEIC up to 25MB</p>
              <p className="text-xs mt-3" style={{ color: 'var(--ept-text-muted)' }}>Front cover analyzed at 70% weight, back cover at 30%</p>
            </div>

            {/* Grading Progress */}
            {isGrading && (
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-accent)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
                  <p className="font-bold gradient-text">Grading in Progress</p>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${gradingProgress}%`, background: 'linear-gradient(90deg, var(--ept-accent), var(--ept-accent-light))' }} />
                </div>
                <p className="text-sm font-mono" style={{ color: 'var(--ept-text-muted)' }}>{gradingStep}</p>
                <div className="flex gap-2 mt-4">
                  {AI_PROVIDERS.filter(p => p.active).map(p => (
                    <span key={p.name} className="px-3 py-1 rounded-full text-xs font-medium animate-pulse" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{p.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ungraded Queue */}
            <div className="rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <span className="gradient-text font-bold text-xs tracking-widest uppercase">Grading Queue ({comics.filter(c => c.status === 'ungraded').length} items)</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
                {comics.filter(c => c.status === 'ungraded' || c.status === 'pending_review').map(c => (
                  <div key={c.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--ept-surface)' }}>📚</div>
                      <div>
                        <p className="font-semibold">{c.title} {c.issue}</p>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} &middot; {c.year}</p>
                      </div>
                    </div>
                    <button onClick={() => simulateGrading(c)} disabled={isGrading} className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                      {isGrading ? 'Grading...' : 'Grade Now'}
                    </button>
                  </div>
                ))}
                {comics.filter(c => c.status === 'ungraded' || c.status === 'pending_review').length === 0 && (
                  <div className="px-5 py-12 text-center" style={{ color: 'var(--ept-text-muted)' }}>
                    <p className="text-3xl mb-2">✨</p>
                    <p className="font-semibold">All comics have been graded!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grading Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">CGC Grading Scale</p>
                <div className="space-y-1.5">
                  {[10.0, 9.8, 9.4, 8.0, 6.0, 4.0, 2.0, 0.5].map(g => (
                    <div key={g} className="flex items-center justify-between py-1">
                      <span className="text-sm font-mono font-bold" style={{ color: getGradeColor(g) }}>{g.toFixed(1)}</span>
                      <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{CGC_GRADES[g]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Defect Detection</p>
                <div className="space-y-2">
                  {DEFECT_TYPES.map(d => (
                    <div key={d.key} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <span className="text-lg">{d.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{d.label}</p>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ PRICING ══════════════ */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold">Market Pricing</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Multi-source price aggregation with outlier removal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'GoCollect / GPA', desc: 'Professional grading analytics and census data', icon: '📊', active: true },
                { name: 'Heritage Auctions', desc: 'Major auction house historical sales', icon: '🏛️', active: true },
                { name: 'eBay Sold Listings', desc: 'Real-time market prices from recent sales', icon: '🛒', active: true },
              ].map(src => (
                <div key={src.name} className="rounded-xl p-5 card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{src.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{src.name}</p>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{src.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: src.active ? '#22c55e' : '#ef4444' }} />
                    <span className="text-xs font-medium" style={{ color: src.active ? '#22c55e' : '#ef4444' }}>{src.active ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Table */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
                <span className="gradient-text font-bold text-xs tracking-widest uppercase">Graded Collection Values</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    {['Comic', 'Grade', 'Label', 'Est. Value', 'Confidence'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
                  {comics.filter(c => c.grade !== null).sort((a, b) => (b.estimated_value || 0) - (a.estimated_value || 0)).map(c => (
                    <tr key={c.id} className="hover:bg-[var(--ept-surface-hover)] transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-sm">{c.title} {c.issue}</p>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} ({c.year})</p>
                      </td>
                      <td className="px-5 py-3 font-mono font-extrabold text-lg" style={{ color: getGradeColor(c.grade!) }}>{c.grade}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--ept-text-muted)' }}>{getGradeLabel(c.grade!)}</td>
                      <td className="px-5 py-3 font-bold gradient-text">{c.estimated_value ? formatCurrency(c.estimated_value) : '—'}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--ept-accent)' }}>{c.consensus_confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ SETTINGS ══════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-2xl font-extrabold">Settings</h1>

            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">AI Provider Configuration</p>
              <div className="space-y-3">
                {AI_PROVIDERS.map(p => (
                  <div key={p.name} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.active ? '#22c55e' : 'var(--ept-text-muted)' }} />
                      <span className="font-semibold text-sm">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>Weight: {p.weight}%</span>
                      <span className="px-3 py-1 rounded text-xs font-bold" style={{ backgroundColor: p.active ? 'rgba(34,197,94,0.1)' : 'var(--ept-surface-hover)', color: p.active ? '#22c55e' : 'var(--ept-text-muted)' }}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Grading Configuration</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Consensus Threshold', value: '85%', desc: 'Minimum agreement between AI models' },
                  { label: 'Defect Confirmation', value: '2+ models', desc: 'Required confirmations per defect' },
                  { label: 'Cover Weight (Front)', value: '70%', desc: 'Front cover analysis weight' },
                  { label: 'Cover Weight (Back)', value: '30%', desc: 'Back cover analysis weight' },
                ].map(cfg => (
                  <div key={cfg.label} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{cfg.label}</span>
                      <span className="text-sm font-mono font-bold" style={{ color: 'var(--ept-accent)' }}>{cfg.value}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{cfg.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">About</p>
              <div className="space-y-2">
                {[
                  { label: 'Service', value: 'EPOCGS — Echo Prime Collectibles Grading System' },
                  { label: 'Version', value: '1.0.0' },
                  { label: 'AI Models', value: `${AI_PROVIDERS.length} providers (${AI_PROVIDERS.filter(p => p.active).length} active)` },
                  { label: 'Pricing Sources', value: 'GoCollect, Heritage Auctions, eBay' },
                  { label: 'Platform', value: 'Echo Prime Technologies' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{r.label}</span>
                    <span className="text-sm font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>&copy; 2026 Echo Prime Technologies. EPOCGS Collectibles Grading System.</p>
        </div>
      </footer>
    </div>
  );
}
