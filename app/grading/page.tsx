'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

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
  { name: 'SAGE', weight: 40, active: true, model: 'Claude Opus 4.6', color: '#8b5cf6', voice: 'SAGE' as const },
  { name: 'NYX', weight: 35, active: true, model: 'Grok 4', color: '#ec4899', voice: 'NYX' as const },
  { name: 'THORNE', weight: 25, active: true, model: 'GPT-4o / o1', color: '#f59e0b', voice: 'THORNE' as const },
];

const VISION_MODELS = [
  { model: 'anthropic/claude-opus-4-6', weight: 0.25, label: 'Claude Opus 4.6', color: '#8b5cf6' },
  { model: 'openai/gpt-4o', weight: 0.25, label: 'GPT-4o', color: '#22c55e' },
  { model: 'google/gemini-2.5-pro', weight: 0.20, label: 'Gemini 2.5 Pro', color: '#4285f4' },
  { model: 'xai/grok-4', weight: 0.15, label: 'Grok 4', color: '#ec4899' },
  { model: 'qwen/qwen-2.5-vl-72b', weight: 0.15, label: 'Qwen 2.5 VL', color: '#f59e0b' },
];

const GRADE_MULTIPLIERS: Record<number, number> = {
  10.0: 3.0, 9.9: 2.8, 9.8: 2.5, 9.6: 2.2, 9.4: 2.0, 9.2: 1.8, 9.0: 1.5, 8.5: 1.3, 8.0: 1.0,
  7.5: 0.85, 7.0: 0.7, 6.5: 0.6, 6.0: 0.5, 5.5: 0.4, 5.0: 0.35, 4.5: 0.3, 4.0: 0.25,
  3.5: 0.2, 3.0: 0.15, 2.5: 0.12, 2.0: 0.1, 1.8: 0.08, 1.5: 0.06, 1.0: 0.04, 0.5: 0.02,
};

/* ═══════════════════════════════════════════════════════════════
   SWARM BRAIN + ENGINE RUNTIME API
   ═══════════════════════════════════════════════════════════════ */

const SWARM_BRAIN_URL = 'https://echo-swarm-brain.bmcii1976.workers.dev';
const ENGINE_RUNTIME_URL = 'https://echo-engine-runtime.bmcii1976.workers.dev';
const MEMORY_CORTEX_URL = 'https://echo-memory-cortex.bmcii1976.workers.dev';
const R2_MEDIA_URL = 'https://pub-68bd8f2b7ab147f6ac04c91aa5afedb8.r2.dev/comics';

function getComicImageUrl(title: string, issue: string): string {
  const safe = title.replace(/[^a-zA-Z0-9 \-_]/g, '').trim().replace(/\s+/g, '_').slice(0, 50);
  const num = issue.replace('#', '').trim();
  return `${R2_MEDIA_URL}/${safe}_${num}_front.jpg`;
}

interface TrinityGradeResult {
  voice: string;
  grade: number | null;
  analysis: string;
  confidence: number;
  defects: string[];
  model_used: string;
  tokens_used: number;
}

interface EngineDoctrineResult {
  engine_id: string;
  topic: string;
  conclusion: string;
  confidence: string;
  score: number;
}

async function consultTrinity(voice: 'SAGE' | 'NYX' | 'THORNE', comic: Comic): Promise<TrinityGradeResult> {
  const prompt = `You are an expert CGC comic book grader. Grade the following comic on the CGC 0.5-10.0 scale.

Comic: ${comic.title} ${comic.issue}
Publisher: ${comic.publisher}
Year: ${comic.year}
Known defects: ${comic.defects.length > 0 ? comic.defects.join(', ') : 'None reported — grade from description only'}

INSTRUCTIONS:
1. Assign a CGC numeric grade (0.5 to 10.0, in standard increments: 0.5, 1.0, 1.5, 1.8, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.2, 9.4, 9.6, 9.8, 9.9, 10.0)
2. List all detected/suspected defects
3. Estimate fair market value in USD
4. Provide confidence level (0-100)

RESPOND IN THIS EXACT FORMAT:
GRADE: [number]
DEFECTS: [comma-separated list]
VALUE: [USD number]
CONFIDENCE: [0-100]
ANALYSIS: [2-3 sentence expert analysis]`;

  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/trinity/consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: prompt, voice }),
    });
    const data = await res.json();
    if (!data.ok) return { voice, grade: null, analysis: data.error || 'Failed', confidence: 0, defects: [], model_used: 'error', tokens_used: 0 };

    const text = data.consultation?.analysis || '';
    const gradeMatch = text.match(/GRADE:\s*([\d.]+)/i);
    const defectsMatch = text.match(/DEFECTS:\s*(.+?)(?:\n|$)/i);
    const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i);
    const analysisMatch = text.match(/ANALYSIS:\s*(.+?)$/im);

    return {
      voice,
      grade: gradeMatch ? parseFloat(gradeMatch[1]) : null,
      analysis: analysisMatch ? analysisMatch[1].trim() : text.slice(0, 300),
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 70,
      defects: defectsMatch ? defectsMatch[1].split(',').map((d: string) => d.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean) : [],
      model_used: data.consultation?.model_used || voice,
      tokens_used: data.consultation?.tokens_used || 0,
    };
  } catch {
    return { voice, grade: null, analysis: 'Network error', confidence: 0, defects: [], model_used: 'error', tokens_used: 0 };
  }
}

async function queryEngineRuntime(comic: Comic): Promise<EngineDoctrineResult[]> {
  try {
    const res = await fetch(`${ENGINE_RUNTIME_URL}/search?q=${encodeURIComponent(`${comic.title} ${comic.issue} valuation collectible appraisal`)}&limit=3`);
    const data = await res.json();
    return data.ok ? (data.results || []) : [];
  } catch {
    return [];
  }
}

async function storeGradeToMemory(comic: Comic, results: TrinityGradeResult[], consensusGrade: number, consensusConfidence: number) {
  const trinityDetail = results.map(r => `${r.voice}=${r.grade ?? '?'} (${r.confidence}% via ${r.model_used})`).join(', ');
  const content = `GRADE: ${comic.title} ${comic.issue} (${comic.publisher} ${comic.year}) — CGC ${consensusGrade} (${getGradeLabel(consensusGrade)}). Confidence: ${consensusConfidence}%. Trinity: ${trinityDetail}. Value: est. market. Defects: ${results.flatMap(r => r.defects).filter((d, i, a) => a.indexOf(d) === i).join(', ') || 'none'}.`;
  try {
    await fetch(`${MEMORY_CORTEX_URL}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        memory_type: 'semantic',
        source: 'collectibles_grading',
        tags: ['grading', 'comic', comic.publisher.toLowerCase(), `grade_${consensusGrade}`],
        strength: 2.0 + (consensusConfidence / 100),
        summary: `${comic.title} ${comic.issue} graded CGC ${consensusGrade}`,
        metadata: {
          comic_title: comic.title,
          comic_issue: comic.issue,
          publisher: comic.publisher,
          year: comic.year,
          grade: consensusGrade,
          confidence: consensusConfidence,
          trinity: results.map(r => ({ voice: r.voice, grade: r.grade, confidence: r.confidence, model: r.model_used })),
          graded_at: new Date().toISOString(),
        },
      }),
    });
  } catch { /* best effort */ }
}

async function recallGradeFromMemory(comic: Comic): Promise<{ grade: number; confidence: number; defects: string[]; graded_at: string } | null> {
  try {
    const res = await fetch(`${MEMORY_CORTEX_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `${comic.title} ${comic.issue} grade`,
        memory_type: 'semantic',
        limit: 1,
        min_strength: 1.0,
      }),
    });
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) return null;
    const mem = results[0];
    const meta = typeof mem.metadata === 'string' ? JSON.parse(mem.metadata) : mem.metadata;
    if (meta?.grade && meta?.comic_title === comic.title && meta?.comic_issue === comic.issue) {
      return { grade: meta.grade, confidence: meta.confidence || 80, defects: [], graded_at: meta.graded_at || mem.created_at };
    }
    return null;
  } catch { return null; }
}

function computeConsensus(results: TrinityGradeResult[]): { grade: number; confidence: number; defects: string[] } {
  const validResults = results.filter(r => r.grade !== null && r.grade >= 0.5 && r.grade <= 10.0);
  if (validResults.length === 0) return { grade: 7.0, confidence: 50, defects: [] };

  const providerMap: Record<string, { weight: number }> = {};
  AI_PROVIDERS.forEach(p => { providerMap[p.voice] = { weight: p.weight }; });

  let totalWeight = 0;
  let weightedGrade = 0;
  let weightedConfidence = 0;
  const allDefects: Record<string, number> = {};

  validResults.forEach(r => {
    const w = providerMap[r.voice]?.weight || 33;
    totalWeight += w;
    weightedGrade += (r.grade || 0) * w;
    weightedConfidence += r.confidence * w;
    r.defects.forEach(d => { allDefects[d] = (allDefects[d] || 0) + 1; });
  });

  const grade = Math.round((weightedGrade / totalWeight) * 10) / 10;
  const confidence = Math.round(weightedConfidence / totalWeight);
  const confirmedDefects = Object.entries(allDefects).filter(([, count]) => count >= 2).map(([d]) => d);

  return { grade: Math.max(0.5, Math.min(10.0, grade)), confidence: Math.min(100, confidence), defects: confirmedDefects };
}

/* ═══════════════════════════════════════════════════════════════
   EPOCGS v3.0 TYPES
   ═══════════════════════════════════════════════════════════════ */

type CaptureState = 'idle' | 'requesting' | 'positioning' | 'stabilizing' | 'quality_check' | 'ready' | 'captured' | 'uploading';
type CaptureSide = 'front' | 'back' | 'issue_number';

interface CaptureWorkflow {
  side: CaptureSide;
  step: number;
  frontBlob: Blob | null;
  backBlob: Blob | null;
  issueBlob: Blob | null;
  frontR2Key: string | null;
  backR2Key: string | null;
  issueR2Key: string | null;
  qualityScores: { front: number; back: number; issue: number };
}

interface QualityScore {
  sharpness: number;
  brightness: number;
  contrast: number;
  overall: number;
}

interface PipelineStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  startTime: number | null;
  endTime: number | null;
  detail: string;
}

interface VisionModelResult {
  model: string;
  label: string;
  grade: number;
  confidence: number;
  defects: string[];
  analysis: string;
}

interface DebateRound {
  round: number;
  bull: string;
  bear: string;
  judge: string;
}

interface TrinityDecision {
  sage: { grade: number; reasoning: string };
  nyx: { grade: number; reasoning: string };
  thorne: { grade: number; reasoning: string };
  finalGrade: number;
  dissent: string | null;
}

interface EngineEnrichment {
  prb02: { value: number; framework: string } | null;
  lg06: { significance: string } | null;
  fin12: { range: string; trend: string } | null;
  hist: { context: string } | null;
}

const DEFECT_TYPES = [
  { key: 'spine_stress', label: 'Spine Stress', icon: '📏', desc: 'Stress lines along spine', severity: 'minor' },
  { key: 'spine_roll', label: 'Spine Roll', icon: '📏', desc: 'Spine curved from storage', severity: 'moderate' },
  { key: 'spine_split', label: 'Spine Split', icon: '📏', desc: 'Split along spine', severity: 'major' },
  { key: 'cover_tear', label: 'Cover Tear', icon: '📖', desc: 'Tears in cover material', severity: 'major' },
  { key: 'cover_crease', label: 'Cover Crease', icon: '📖', desc: 'Creasing on cover', severity: 'moderate' },
  { key: 'cover_detached', label: 'Cover Detached', icon: '📖', desc: 'Cover separated from staples', severity: 'severe' },
  { key: 'page_yellowing', label: 'Page Yellowing', icon: '📄', desc: 'Yellowed/tanned pages', severity: 'minor' },
  { key: 'page_brittle', label: 'Brittle Pages', icon: '📄', desc: 'Pages crack when bent', severity: 'major' },
  { key: 'page_foxing', label: 'Foxing', icon: '📄', desc: 'Brown spots on pages', severity: 'moderate' },
  { key: 'staple_rust', label: 'Staple Rust', icon: '📎', desc: 'Rust on staples', severity: 'moderate' },
  { key: 'staple_migration', label: 'Staple Migration', icon: '📎', desc: 'Rust staining around staples', severity: 'moderate' },
  { key: 'staple_pop', label: 'Staple Pop', icon: '📎', desc: 'Staple pulled through cover', severity: 'major' },
  { key: 'corner_blunt', label: 'Corner Blunting', icon: '📐', desc: 'Rounded/blunted corners', severity: 'minor' },
  { key: 'corner_bend', label: 'Corner Bend', icon: '📐', desc: 'Bent corners', severity: 'minor' },
  { key: 'corner_chip', label: 'Corner Chip', icon: '📐', desc: 'Missing corner material', severity: 'moderate' },
  { key: 'edge_wear', label: 'Edge Wear', icon: '✂️', desc: 'Wear along edges', severity: 'minor' },
  { key: 'edge_tear', label: 'Edge Tear', icon: '✂️', desc: 'Tears along edges', severity: 'moderate' },
  { key: 'color_fading', label: 'Color Fading', icon: '🎨', desc: 'Faded colors from sun exposure', severity: 'moderate' },
  { key: 'color_break', label: 'Color Break', icon: '🎨', desc: 'Color flaking at stress points', severity: 'minor' },
  { key: 'water_damage', label: 'Water Damage', icon: '💧', desc: 'Staining from water exposure', severity: 'major' },
  { key: 'writing', label: 'Writing/Marks', icon: '✏️', desc: 'Writing, stamps, or marks', severity: 'moderate' },
  { key: 'stains', label: 'Stains', icon: '🟤', desc: 'Food, liquid, or other stains', severity: 'moderate' },
  { key: 'restoration', label: 'Restoration', icon: '🔧', desc: 'Amateur or professional restoration', severity: 'major' },
  { key: 'fold_marks', label: 'Fold Marks', icon: '📁', desc: 'Evidence of folding', severity: 'major' },
  { key: 'paper_loss', label: 'Paper Loss', icon: '📄', desc: 'Missing paper/material', severity: 'severe' },
  { key: 'mold', label: 'Mold/Mildew', icon: '🦠', desc: 'Mold or mildew growth', severity: 'severe' },
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
  era: string | null;
  key_issue: boolean;
  key_issue_reason: string | null;
  writer: string | null;
  cover_artist: string | null;
  characters: string[];
  buy_price: number | null;
  buy_date: string | null;
  buy_source: string | null;
  sold_price: number | null;
  sold_date: string | null;
  cortex_uid: string | null;
  // v3.0 — Image storage
  front_r2_key: string | null;
  back_r2_key: string | null;
  issue_r2_key: string | null;
  quality_score: number | null;
  // v3.0 — Bree commentary
  bree_comment: string | null;
  bree_emotion: string | null;
  // v3.0 — Collection enhancements
  tags: string[];
  notes: string | null;
  // v3.0 — Full pipeline data
  vision_grades: Record<string, number> | null;
  research_notes: string | null;
  engine_enrichment: EngineEnrichment | null;
  debate_summary: string | null;
  trinity_decision: TrinityDecision | null;
}

async function loadCollectionFromCortex(): Promise<Comic[]> {
  try {
    const res = await fetch(`${MEMORY_CORTEX_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '', memory_type: 'fact', limit: 500, min_strength: 0 }),
    });
    const data = await res.json();
    const results = (data.results || []).filter((m: any) => m.source === 'collectibles-grading-app');
    return results.map((m: any, idx: number) => {
      const meta = typeof m.metadata === 'string' ? JSON.parse(m.metadata) : (m.metadata || {});
      const grade = meta.consensus_grade ? parseFloat(meta.consensus_grade) : null;
      const price = meta.consensus_price ? parseFloat(meta.consensus_price) : null;
      const comicTitle = meta.title || 'Unknown';
      const comicIssue = `#${meta.issue_number || '?'}`;
      return {
        id: idx + 1,
        title: comicTitle,
        issue: comicIssue,
        publisher: meta.publisher || 'Unknown',
        year: meta.publication_year ? parseInt(meta.publication_year) : 0,
        grade,
        estimated_value: price,
        image_url: getComicImageUrl(comicTitle, comicIssue),
        status: (grade ? 'graded' : 'ungraded') as Comic['status'],
        defects: [],
        consensus_confidence: meta.grade_confidence ? parseFloat(meta.grade_confidence) : (grade ? 85 : null),
        graded_at: m.created_at || null,
        era: meta.era || null,
        key_issue: !!meta.key_issue,
        key_issue_reason: meta.key_issue_reason || null,
        writer: meta.writer || null,
        cover_artist: meta.cover_artist || null,
        characters: [],
        buy_price: null, buy_date: null, buy_source: null,
        sold_price: null, sold_date: null, cortex_uid: m.uid || null,
        front_r2_key: meta.front_r2_key || null, back_r2_key: meta.back_r2_key || null, issue_r2_key: meta.issue_r2_key || null,
        quality_score: meta.quality_score || null,
        bree_comment: meta.bree_comment || null, bree_emotion: meta.bree_emotion || null,
        tags: meta.tags || [], notes: meta.notes || null,
        vision_grades: meta.vision_grades || null, research_notes: meta.research_notes || null,
        engine_enrichment: meta.engine_enrichment || null, debate_summary: meta.debate_summary || null,
        trinity_decision: meta.trinity_decision || null,
      } as Comic;
    });
  } catch (err) {
    console.error('Failed to load collection from Memory Cortex:', err);
    return [];
  }
}

async function addComicToCortex(comic: Omit<Comic, 'id' | 'cortex_uid'>): Promise<string | null> {
  try {
    const content = `${comic.title} #${comic.issue.replace('#', '')} (${comic.publisher}, ${comic.year})${comic.grade ? ` - Grade: ${comic.grade} (${getGradeLabel(comic.grade)})` : ''}${comic.estimated_value ? ` - Value: $${comic.estimated_value}` : ''}${comic.era ? ` - Era: ${comic.era}` : ''}`;
    const res = await fetch(`${MEMORY_CORTEX_URL}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        memory_type: 'fact',
        source: 'collectibles-grading-app',
        tags: ['comic', 'collection', comic.publisher.toLowerCase().replace(/\s+/g, '-')],
        strength: 2.0,
        summary: `${comic.title} ${comic.issue} by ${comic.publisher} (${comic.year})`,
        metadata: {
          title: comic.title, issue_number: comic.issue.replace('#', ''), publisher: comic.publisher,
          publication_year: comic.year, consensus_grade: comic.grade, grade_label: comic.grade ? getGradeLabel(comic.grade) : null,
          grade_confidence: comic.consensus_confidence, consensus_price: comic.estimated_value,
          era: comic.era, key_issue: comic.key_issue, key_issue_reason: comic.key_issue_reason,
          writer: comic.writer, cover_artist: comic.cover_artist, grading_status: comic.status,
        },
      }),
    });
    const data = await res.json();
    return data.memory?.uid || data.uid || null;
  } catch { return null; }
}

async function deleteComicFromCortex(uid: string): Promise<boolean> {
  try {
    await fetch(`${MEMORY_CORTEX_URL}/memory/${uid}`, { method: 'DELETE' });
    return true;
  } catch { return false; }
}

const formatCurrency = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`;
const formatDate = (d: string) => { const dt = new Date(d); return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

/* ═══════════════════════════════════════════════════════════════
   EPOCGS v3.0 — 6-STEP PIPELINE API FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

async function uploadToR2(blob: Blob, comicId: string, side: CaptureSide): Promise<string> {
  const key = `comics/${comicId}/${side}_${Date.now()}.jpg`;
  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/artifacts?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: await blob.arrayBuffer(),
    });
    const data = await res.json();
    if (!data.ok) throw new Error('R2 upload failed');
    return key;
  } catch { return ''; }
}

async function runVisionEnsemble(frontBase64: string, backBase64: string, comic: Comic): Promise<{ results: VisionModelResult[]; consensus: number; confidence: number; defects: string[] }> {
  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/llm/hybrids/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'ensemble',
        prompt: `You are an expert CGC comic book grader. Grade this comic on the CGC 0.5-10.0 scale from the photographs.
Comic: ${comic.title} ${comic.issue} (${comic.publisher}, ${comic.year})
Known defects reported by owner: ${comic.defects.length > 0 ? comic.defects.join(', ') : 'None reported'}

RESPOND IN JSON: {"grade": number, "confidence": number, "defects": ["list"], "analysis": "2 sentences"}`,
        models: VISION_MODELS.map(m => m.model),
        images: [{ data: frontBase64, type: 'image/jpeg' }, ...(backBase64 ? [{ data: backBase64, type: 'image/jpeg' }] : [])],
        options: { temperature: 0.2, max_tokens: 2000 },
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Vision ensemble failed');
    const modelResults: VisionModelResult[] = (data.results || []).map((r: any, i: number) => ({
      model: VISION_MODELS[i]?.model || `model_${i}`,
      label: VISION_MODELS[i]?.label || `Model ${i}`,
      grade: parseGrade(r.response || r.text || ''),
      confidence: parseConfidence(r.response || r.text || ''),
      defects: parseDefects(r.response || r.text || ''),
      analysis: r.response?.slice(0, 300) || r.text?.slice(0, 300) || '',
    }));
    const validGrades = modelResults.filter(r => r.grade > 0);
    let totalWeight = 0, weightedGrade = 0;
    validGrades.forEach((r, i) => {
      const w = VISION_MODELS[i]?.weight || 0.2;
      totalWeight += w; weightedGrade += r.grade * w;
    });
    const consensus = totalWeight > 0 ? Math.round((weightedGrade / totalWeight) * 10) / 10 : 7.0;
    const allDefects: Record<string, number> = {};
    modelResults.forEach(r => r.defects.forEach(d => { allDefects[d] = (allDefects[d] || 0) + 1; }));
    const confirmedDefects = Object.entries(allDefects).filter(([, c]) => c >= 2).map(([d]) => d);
    const avgConf = validGrades.length > 0 ? Math.round(validGrades.reduce((s, r) => s + r.confidence, 0) / validGrades.length) : 60;
    return { results: modelResults, consensus: Math.max(0.5, Math.min(10.0, consensus)), confidence: avgConf, defects: confirmedDefects };
  } catch {
    return { results: [], consensus: 0, confidence: 0, defects: [] };
  }
}

function parseGrade(text: string): number {
  try { const j = JSON.parse(text); if (j.grade) return parseFloat(j.grade); } catch { /* not json */ }
  const m = text.match(/(?:grade|GRADE)[:\s]*(\d+\.?\d*)/i);
  return m ? Math.max(0.5, Math.min(10.0, parseFloat(m[1]))) : 0;
}
function parseConfidence(text: string): number {
  try { const j = JSON.parse(text); if (j.confidence) return parseInt(j.confidence); } catch { /* not json */ }
  const m = text.match(/(?:confidence|CONFIDENCE)[:\s]*(\d+)/i);
  return m ? Math.min(100, parseInt(m[1])) : 70;
}
function parseDefects(text: string): string[] {
  try { const j = JSON.parse(text); if (Array.isArray(j.defects)) return j.defects.map((d: string) => d.toLowerCase().replace(/\s+/g, '_')); } catch { /* not json */ }
  const m = text.match(/(?:defects|DEFECTS)[:\s]*(.+?)(?:\n|$)/i);
  return m ? m[1].split(',').map(d => d.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean) : [];
}

async function runResearchSwarm(comic: Comic, ensembleGrade: number): Promise<string> {
  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/swarm/think`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: `Research everything about ${comic.title} #${comic.issue.replace('#', '')} (${comic.publisher}, ${comic.year}):
- Is this a key issue? What happens in it?
- First appearance of any character?
- Significant cover artist or story?
- Print run size and scarcity?
- Notable variants or printings?
- Record sale prices at auction?
- Current market trends?
- Census data (how many graded at each level)?`,
        context: `Grading a physical copy. Vision ensemble grade: ${ensembleGrade}. Publisher: ${comic.publisher}. Year: ${comic.year}.`,
        agents: 50,
      }),
    });
    const data = await res.json();
    return data.ok ? (data.synthesis || data.result || data.answer || JSON.stringify(data).slice(0, 3000)) : '';
  } catch { return ''; }
}

async function runEngineEnrichment(comic: Comic, grade: number): Promise<EngineEnrichment> {
  const queries = [
    { engine: 'PRB02', query: `Value ${comic.title} #${comic.issue.replace('#', '')} at CGC ${grade}. Apply USPAP standards. Condition-adjusted pricing.` },
    { engine: 'LG06', query: `IP significance of ${comic.title} #${comic.issue.replace('#', '')}. First appearances, trademark implications, licensing value.` },
    { engine: 'FIN12', query: `Market analysis: ${comic.title} #${comic.issue.replace('#', '')} at grade ${grade}. Recent sales, price trends, investment outlook.` },
    { engine: 'HIST', query: `Historical context: ${comic.title} #${comic.issue.replace('#', '')} (${comic.publisher}, ${comic.year}). Publication era, cultural significance.` },
  ];
  const results = await Promise.allSettled(queries.map(async q => {
    const res = await fetch(`${ENGINE_RUNTIME_URL}/query`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engine: q.engine, query: q.query, mode: 'FAST' }),
    });
    return res.json();
  }));
  const extract = (idx: number) => {
    const r = results[idx];
    return r.status === 'fulfilled' && r.value?.ok ? r.value : null;
  };
  const prb02Data = extract(0);
  const lg06Data = extract(1);
  const fin12Data = extract(2);
  const histData = extract(3);
  return {
    prb02: prb02Data ? { value: parseFloat(prb02Data.result?.match(/\$[\d,]+/)?.[0]?.replace(/[$,]/g, '') || '0') || 0, framework: (prb02Data.result || '').slice(0, 500) } : null,
    lg06: lg06Data ? { significance: (lg06Data.result || '').slice(0, 500) } : null,
    fin12: fin12Data ? { range: (fin12Data.result || '').match(/\$[\d,]+-?\$?[\d,]*/)?.[0] || 'N/A', trend: (fin12Data.result || '').slice(0, 500) } : null,
    hist: histData ? { context: (histData.result || '').slice(0, 500) } : null,
  };
}

async function runDebateHybrid(frontBase64: string, comic: Comic, ensembleGrade: number, defects: string[], researchNotes: string): Promise<{ adjustedGrade: number; rounds: DebateRound[]; transcript: string }> {
  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/llm/hybrids/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'debate',
        prompt: `Vision ensemble graded CGC ${ensembleGrade}. Defects: ${defects.join(', ') || 'none'}.
Research: ${researchNotes.slice(0, 2000)}.
BULL: Argue the grade should be HIGHER. BEAR: Argue the grade should be LOWER. JUDGE: Render final adjusted grade with reasoning.`,
        models: ['openai/gpt-4o', 'anthropic/claude-opus-4-6', 'xai/grok-4'],
        images: frontBase64 ? [{ data: frontBase64, type: 'image/jpeg' }] : [],
        options: { rounds: 3, temperature: 0.4 },
      }),
    });
    const data = await res.json();
    if (!data.ok) return { adjustedGrade: ensembleGrade, rounds: [], transcript: '' };
    const rounds: DebateRound[] = (data.rounds || []).map((r: any, i: number) => ({
      round: i + 1, bull: r.bull || r.for || '', bear: r.bear || r.against || '', judge: r.judge || r.verdict || '',
    }));
    const judgeGrade = parseGrade(data.final || data.verdict || data.judge || '');
    return {
      adjustedGrade: judgeGrade > 0 ? judgeGrade : ensembleGrade,
      rounds,
      transcript: data.transcript || rounds.map(r => `Round ${r.round}: BULL: ${r.bull.slice(0, 200)} | BEAR: ${r.bear.slice(0, 200)} | JUDGE: ${r.judge.slice(0, 200)}`).join('\n'),
    };
  } catch { return { adjustedGrade: ensembleGrade, rounds: [], transcript: '' }; }
}

async function runTrinityCouncil(comic: Comic, ensembleGrade: number, debateGrade: number, defects: string[], researchNotes: string, prb02Value: number): Promise<TrinityDecision> {
  try {
    const res = await fetch(`${SWARM_BRAIN_URL}/trinity/decide`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: `FINAL GRADE for ${comic.title} ${comic.issue}:
Vision Ensemble: ${ensembleGrade} (5 models)
Debate Adjusted: ${debateGrade}
Confirmed Defects: ${defects.join(', ') || 'none'}
PRB02 Valuation: $${prb02Value}
Research: ${researchNotes.slice(0, 1500)}
Render FINAL CGC grade. This is the grade of record.`,
        context: 'Comic grading with full vision + research + debate evidence.',
        tier: 'critical',
        debate_rounds: 2,
      }),
    });
    const data = await res.json();
    if (!data.ok) return { sage: { grade: debateGrade, reasoning: '' }, nyx: { grade: debateGrade, reasoning: '' }, thorne: { grade: debateGrade, reasoning: '' }, finalGrade: debateGrade, dissent: null };
    const voices = data.decision?.voices || data.voices || {};
    const sageGrade = parseGrade(voices.sage?.text || voices.SAGE?.text || '');
    const nyxGrade = parseGrade(voices.nyx?.text || voices.NYX?.text || '');
    const thorneGrade = parseGrade(voices.thorne?.text || voices.THORNE?.text || '');
    const finalGrade = parseGrade(data.decision?.final || data.final_grade || '') || Math.round(((sageGrade || debateGrade) * 0.4 + (nyxGrade || debateGrade) * 0.35 + (thorneGrade || debateGrade) * 0.25) * 10) / 10;
    const grades = [sageGrade, nyxGrade, thorneGrade].filter(g => g > 0);
    const spread = grades.length > 1 ? Math.max(...grades) - Math.min(...grades) : 0;
    return {
      sage: { grade: sageGrade || debateGrade, reasoning: (voices.sage?.text || voices.SAGE?.text || '').slice(0, 400) },
      nyx: { grade: nyxGrade || debateGrade, reasoning: (voices.nyx?.text || voices.NYX?.text || '').slice(0, 400) },
      thorne: { grade: thorneGrade || debateGrade, reasoning: (voices.thorne?.text || voices.THORNE?.text || '').slice(0, 400) },
      finalGrade: Math.max(0.5, Math.min(10.0, finalGrade)),
      dissent: spread > 0.3 ? `Spread: ${spread.toFixed(1)} — voices disagree` : null,
    };
  } catch { return { sage: { grade: debateGrade, reasoning: '' }, nyx: { grade: debateGrade, reasoning: '' }, thorne: { grade: debateGrade, reasoning: '' }, finalGrade: debateGrade, dissent: null }; }
}

function buildBreePrompt(comic: Comic, grade: number, defects: string[], value: number, confidence: number, researchNotes: string, engineData: EngineEnrichment): string {
  const keyInfo = researchNotes?.includes('key issue') || researchNotes?.includes('first appearance') ? `\nResearch says: ${researchNotes.slice(0, 500)}` : '';
  const valInfo = engineData?.prb02 ? `\nPRB02 USPAP valuation: $${engineData.prb02.value}` : '';
  if (grade >= 9.4) return `Holy shit! ${comic.title} #${comic.issue.replace('#', '')} graded CGC ${grade}! Value: $${value}. ${defects.length === 0 ? 'ZERO defects.' : `Minor: ${defects.join(', ')}.`}${keyInfo}${valInfo} This is a GEM. Be BREE at her most hyped.`;
  if (grade >= 7.0) return `${comic.title} #${comic.issue.replace('#', '')} got a ${grade}. Solid but not legendary. Value: $${value}. Defects: ${defects.join(', ') || 'none'}.${keyInfo} Give the classic BREE reality check.`;
  if (grade >= 4.0) return `${comic.title} #${comic.issue.replace('#', '')} managed a ${grade}. Rough. Value: $${value}. Defects: ${defects.join(', ')}.${keyInfo} Roast it but show some love.`;
  return `Oh no. ${comic.title} #${comic.issue.replace('#', '')} at ${grade}. Value: $${value}. Defects: ${defects.join(', ')}.${keyInfo} Full savage BREE. End with something slightly encouraging.`;
}

async function getBreeCommentary(comic: Comic, grade: number, defects: string[], value: number, confidence: number, researchNotes: string, engineData: EngineEnrichment): Promise<{ text: string; emotion: string }> {
  const message = buildBreePrompt(comic, grade, defects, value, confidence, researchNotes, engineData);
  try {
    const res = await fetch('https://brees.echo-lge.com/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, player_id: `grading_${Date.now()}`, userContext: { authority: 8, title: 'Collector' } }),
    });
    const data = await res.json();
    return { text: data.response || data.message || '', emotion: data.emotion || 'sarcastic' };
  } catch {
    if (grade >= 9.0) return { text: `Alright bitches, ${comic.title} ${comic.issue} is a goddamn ${getGradeLabel(grade)}. That's what I'm talking about.`, emotion: 'excited' };
    if (grade >= 6.0) return { text: `Real talk \u2014 ${comic.title} ${comic.issue} at ${grade}? It's fine. Not sending anyone to the moon.`, emotion: 'sarcastic' };
    return { text: `Oh honey, no. ${comic.title} ${comic.issue} at ${grade}? I've seen better condition napkins at Taco Bell. But hey, $${value}.`, emotion: 'bluntly' };
  }
}

async function playBreeVoice(text: string, emotion: string): Promise<void> {
  try {
    const res = await fetch('https://brees.echo-lge.com/api/tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, emotion }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
    return;
  } catch { /* ElevenLabs failed, try Cartesia */ }
  try {
    const res = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cartesia-Version': '2024-06-10' },
      body: JSON.stringify({
        model_id: 'sonic-3', transcript: text,
        voice: { mode: 'id', id: 'f762e181-ddc7-486e-9a48-636bd7e229d4' },
        output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
      }),
    });
    if (res.ok) { const blob = await res.blob(); new Audio(URL.createObjectURL(blob)).play(); }
  } catch { /* silent fail — text commentary still visible */ }
}

/* ═══════════════════════════════════════════════════════════════
   CAMERA UTILITIES — BORDER DETECTION + QUALITY SCORING
   ═══════════════════════════════════════════════════════════════ */

function detectComicBorder(canvas: HTMLCanvasElement): { detected: boolean; confidence: number; bounds: { x: number; y: number; w: number; h: number } | null } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { detected: false, confidence: 0, bounds: null };
  const w = canvas.width, h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = 0.299 * imageData.data[i * 4] + 0.587 * imageData.data[i * 4 + 1] + 0.114 * imageData.data[i * 4 + 2];
  }
  // Sobel edge detection
  const edges = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = -gray[(y - 1) * w + x - 1] + gray[(y - 1) * w + x + 1] - 2 * gray[y * w + x - 1] + 2 * gray[y * w + x + 1] - gray[(y + 1) * w + x - 1] + gray[(y + 1) * w + x + 1];
      const gy = -gray[(y - 1) * w + x - 1] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + x + 1] + gray[(y + 1) * w + x - 1] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + x + 1];
      edges[y * w + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  // Threshold at 90th percentile
  const sorted = Array.from(edges).sort((a, b) => a - b);
  const threshold = sorted[Math.floor(sorted.length * 0.9)];
  // Find bounding box of strong edges
  let minX = w, maxX = 0, minY = h, maxY = 0, edgeCount = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (edges[y * w + x] > threshold) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        edgeCount++;
      }
    }
  }
  const bw = maxX - minX, bh = maxY - minY;
  if (bw < w * 0.2 || bh < h * 0.2) return { detected: false, confidence: 0, bounds: null };
  const aspect = bw / bh;
  const isComic = aspect >= 0.5 && aspect <= 0.9;
  const areaCoverage = (bw * bh) / (w * h);
  const confidence = isComic ? Math.min(100, Math.round(areaCoverage * 100 + edgeCount / (w * h) * 50)) : 0;
  return {
    detected: isComic && confidence > 30,
    confidence,
    bounds: { x: minX, y: minY, w: bw, h: bh },
  };
}

function computeQualityScore(canvas: HTMLCanvasElement): QualityScore {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { sharpness: 0, brightness: 0, contrast: 0, overall: 0 };
  const w = canvas.width, h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const gray = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < w * h; i++) {
    gray[i] = 0.299 * imageData.data[i * 4] + 0.587 * imageData.data[i * 4 + 1] + 0.114 * imageData.data[i * 4 + 2];
    sum += gray[i];
  }
  const mean = sum / (w * h);
  // Brightness: penalize <80 or >180
  const brightness = Math.max(0, Math.min(100, 100 - Math.abs(mean - 128) * 1.5));
  // Contrast: std deviation
  let variance = 0;
  for (let i = 0; i < w * h; i++) variance += (gray[i] - mean) * (gray[i] - mean);
  const stdDev = Math.sqrt(variance / (w * h));
  const contrast = Math.min(100, stdDev * 1.5);
  // Sharpness: Laplacian variance
  let lapSum = 0, lapCount = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const lap = -4 * gray[y * w + x] + gray[(y - 1) * w + x] + gray[(y + 1) * w + x] + gray[y * w + x - 1] + gray[y * w + x + 1];
      lapSum += lap * lap; lapCount++;
    }
  }
  const sharpness = Math.min(100, (lapSum / lapCount) / 10);
  const overall = sharpness * 0.4 + brightness * 0.3 + contrast * 0.3;
  return { sharpness: Math.round(sharpness), brightness: Math.round(brightness), contrast: Math.round(contrast), overall: Math.round(overall) };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => { const result = reader.result as string; resolve(result.split(',')[1] || ''); };
    reader.readAsDataURL(blob);
  });
}

function estimateValue(grade: number, year: number, keyIssue: boolean): number {
  const baseValue = year < 1960 ? 20000 : year < 1970 ? 10000 : year < 1980 ? 3000 : year < 1990 ? 1000 : 300;
  const closest = Object.keys(GRADE_MULTIPLIERS).map(Number).reduce((a, b) => Math.abs(b - grade) < Math.abs(a - grade) ? b : a);
  const multiplier = GRADE_MULTIPLIERS[closest] || 0.5;
  return Math.round(baseValue * multiplier * (keyIssue ? 3.0 : 1.0));
}

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
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collection' | 'grade' | 'pricing' | 'analytics' | 'settings'>('dashboard');
  const [comics, setComics] = useState<Comic[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publisherFilter, setPublisherFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'grade' | 'value' | 'year'>('title');
  const [isGrading, setIsGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [gradingStep, setGradingStep] = useState('');
  const [trinityResults, setTrinityResults] = useState<TrinityGradeResult[]>([]);
  const [doctrineResults, setDoctrineResults] = useState<EngineDoctrineResult[]>([]);
  const [swarmStatus, setSwarmStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [cortexStatus, setCortexStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [cortexStats, setCortexStats] = useState<{ total_memories: number; recent_24h: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', issue: '', publisher: '', year: '', era: '', buy_price: '', buy_date: '', buy_source: '', key_issue: false, key_issue_reason: '', writer: '', cover_artist: '' });
  const [showEditForm, setShowEditForm] = useState(false);

  // v3.0 — Camera + Capture
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [captureWorkflow, setCaptureWorkflow] = useState<CaptureWorkflow>({ side: 'front', step: 1, frontBlob: null, backBlob: null, issueBlob: null, frontR2Key: null, backR2Key: null, issueR2Key: null, qualityScores: { front: 0, back: 0, issue: 0 } });
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [qualityScore, setQualityScore] = useState<QualityScore>({ sharpness: 0, brightness: 0, contrast: 0, overall: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // v3.0 — 6-Step Pipeline
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [visionResults, setVisionResults] = useState<VisionModelResult[]>([]);
  const [researchNotes, setResearchNotes] = useState<string>('');
  const [engineEnrichment, setEngineEnrichment] = useState<EngineEnrichment | null>(null);
  const [debateTranscript, setDebateTranscript] = useState<DebateRound[]>([]);
  const [trinityDecision, setTrinityDecision] = useState<TrinityDecision | null>(null);
  const [frontBase64, setFrontBase64] = useState<string>('');
  const [backBase64, setBackBase64] = useState<string>('');

  // v3.0 — Bree
  const [breeComment, setBreeComment] = useState<{ text: string; emotion: string } | null>(null);
  const [breeLoading, setBreeLoading] = useState(false);
  const [breeAudioPlaying, setBreeAudioPlaying] = useState(false);
  const [breeMuted, setBreeMuted] = useState(false);

  // v3.0 — Batch Grading
  const [batchGrading, setBatchGrading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, currentTitle: '', currentStep: '' });

  // v3.0 — Enhanced Collection
  const [comicDetailModal, setComicDetailModal] = useState<Comic | null>(null);
  const [collectionTags] = useState<string[]>(['All', 'For Sale', 'Grails', 'Reader', 'Wishlist']);
  const [activeTag, setActiveTag] = useState('All');

  // Load collection from Memory Cortex on mount
  useEffect(() => {
    fetch(`${SWARM_BRAIN_URL}/health`).then(r => r.json()).then(d => setSwarmStatus(d.ok ? 'online' : 'offline')).catch(() => setSwarmStatus('offline'));
    fetch(`${MEMORY_CORTEX_URL}/status`).then(r => r.json()).then(d => {
      setCortexStatus(d.status === 'operational' ? 'online' : 'offline');
      setCortexStats({ total_memories: d.database?.total_memories || 0, recent_24h: d.database?.recent_24h || 0 });
    }).catch(() => setCortexStatus('offline'));
    loadCollectionFromCortex().then(loaded => {
      setComics(loaded);
      setCollectionLoading(false);
    }).catch(() => setCollectionLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const publishers = useMemo(() => {
    const pubs: Record<string, number> = {};
    comics.forEach(c => { pubs[c.publisher] = (pubs[c.publisher] || 0) + 1; });
    return Object.entries(pubs).sort((a, b) => b[1] - a[1]);
  }, [comics]);

  const filteredComics = useMemo(() => {
    let filtered = comics.filter(c => {
      const matchSearch = !searchQuery || `${c.title} ${c.issue} ${c.publisher} ${c.era || ''} ${c.writer || ''} ${c.characters.join(' ')}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchPublisher = publisherFilter === 'all' || c.publisher === publisherFilter;
      const matchTag = activeTag === 'All' || (c.tags && c.tags.includes(activeTag));
      return matchSearch && matchStatus && matchPublisher && matchTag;
    });
    filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'grade') return (b.grade || 0) - (a.grade || 0);
      if (sortBy === 'value') return (b.estimated_value || 0) - (a.estimated_value || 0);
      if (sortBy === 'year') return (a.year || 9999) - (b.year || 9999);
      return 0;
    });
    return filtered;
  }, [comics, searchQuery, statusFilter, publisherFilter, sortBy, activeTag]);

  const stats = useMemo(() => {
    const graded = comics.filter(c => c.grade !== null);
    const withValue = comics.filter(c => c.estimated_value);
    const eras: Record<string, number> = {};
    comics.forEach(c => { if (c.era) eras[c.era] = (eras[c.era] || 0) + 1; });
    const totalBuyPrice = comics.reduce((s, c) => s + (c.buy_price || 0), 0);
    const totalSoldPrice = comics.filter(c => c.sold_price).reduce((s, c) => s + (c.sold_price || 0), 0);
    return {
      total: comics.length,
      graded: graded.length,
      ungraded: comics.filter(c => c.status === 'ungraded').length,
      pending: comics.filter(c => c.status === 'pending_review').length,
      totalValue: withValue.reduce((s, c) => s + (c.estimated_value || 0), 0),
      avgGrade: graded.length ? graded.reduce((s, c) => s + (c.grade || 0), 0) / graded.length : 0,
      avgConfidence: (() => { const g = comics.filter(c => c.consensus_confidence !== null); return g.length ? g.reduce((s, c) => s + (c.consensus_confidence || 0), 0) / g.length : 0; })(),
      highestGrade: graded.length ? Math.max(...graded.map(c => c.grade!)) : 0,
      lowestGrade: graded.length ? Math.min(...graded.map(c => c.grade!)) : 0,
      publisherCount: publishers.length,
      eras,
      keyIssues: comics.filter(c => c.key_issue).length,
      totalInvested: totalBuyPrice,
      totalSold: totalSoldPrice,
      roi: totalBuyPrice > 0 ? ((totalSoldPrice - totalBuyPrice) / totalBuyPrice * 100) : 0,
    };
  }, [comics, publishers]);

  const handleAddComic = useCallback(async () => {
    if (!addForm.title || !addForm.issue || !addForm.publisher) return;
    const newComic: Omit<Comic, 'id' | 'cortex_uid'> = {
      title: addForm.title, issue: addForm.issue.startsWith('#') ? addForm.issue : `#${addForm.issue}`,
      publisher: addForm.publisher, year: parseInt(addForm.year) || new Date().getFullYear(),
      grade: null, estimated_value: null, image_url: null, status: 'ungraded', defects: [],
      consensus_confidence: null, graded_at: null, era: addForm.era || null,
      key_issue: addForm.key_issue, key_issue_reason: addForm.key_issue_reason || null,
      writer: addForm.writer || null, cover_artist: addForm.cover_artist || null, characters: [],
      buy_price: addForm.buy_price ? parseFloat(addForm.buy_price) : null,
      buy_date: addForm.buy_date || null, buy_source: addForm.buy_source || null,
      sold_price: null, sold_date: null,
      front_r2_key: null, back_r2_key: null, issue_r2_key: null, quality_score: null,
      bree_comment: null, bree_emotion: null, tags: [], notes: null,
      vision_grades: null, research_notes: null, engine_enrichment: null, debate_summary: null, trinity_decision: null,
    };
    const uid = await addComicToCortex(newComic);
    setComics(prev => [...prev, { ...newComic, id: prev.length + 1, cortex_uid: uid }]);
    setAddForm({ title: '', issue: '', publisher: '', year: '', era: '', buy_price: '', buy_date: '', buy_source: '', key_issue: false, key_issue_reason: '', writer: '', cover_artist: '' });
    setShowAddForm(false);
  }, [addForm]);

  const handleDeleteComic = useCallback(async (comic: Comic) => {
    if (comic.cortex_uid) await deleteComicFromCortex(comic.cortex_uid);
    setComics(prev => prev.filter(c => c.id !== comic.id));
    if (selectedComic?.id === comic.id) setSelectedComic(null);
  }, [selectedComic]);

  const exportCollection = useCallback((format: 'json' | 'csv') => {
    let content: string, filename: string, mime: string;
    if (format === 'json') {
      content = JSON.stringify(comics, null, 2);
      filename = `collection_${new Date().toISOString().slice(0, 10)}.json`;
      mime = 'application/json';
    } else {
      const headers = 'Title,Issue,Publisher,Year,Grade,Label,Value,Confidence,Era,Status,Key Issue\n';
      const rows = comics.map(c => `"${c.title}","${c.issue}","${c.publisher}",${c.year},${c.grade || ''},${c.grade ? getGradeLabel(c.grade) : ''},${c.estimated_value || ''},${c.consensus_confidence || ''},"${c.era || ''}",${c.status},${c.key_issue}`).join('\n');
      content = headers + rows;
      filename = `collection_${new Date().toISOString().slice(0, 10)}.csv`;
      mime = 'text/csv';
    }
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }, [comics]);

  // v3.0 — Camera controls
  const startCamera = useCallback(async (deviceId?: string) => {
    setCaptureState('requesting');
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setCameraDevices(videoDevices);
      const camId = deviceId || selectedCamera;
      const constraints: MediaStreamConstraints = {
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: { ideal: 'environment' }, ...(camId ? { deviceId: { exact: camId } } : {}) },
      };
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCaptureState('positioning');
    } catch { setCaptureState('idle'); }
  }, [selectedCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCaptureState('idle');
  }, []);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    // Detect and crop
    const detection = detectComicBorder(canvas);
    if (detection.detected && detection.bounds) {
      const { x, y, w, h } = detection.bounds;
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 1200; cropCanvas.height = 1800;
      const cropCtx = cropCanvas.getContext('2d');
      if (cropCtx) cropCtx.drawImage(canvas, x, y, w, h, 0, 0, 1200, 1800);
      const quality = computeQualityScore(cropCanvas);
      setQualityScore(quality);
      cropCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const side = captureWorkflow.side;
        const b64 = await blobToBase64(blob);
        if (side === 'front') { setFrontBase64(b64); setCaptureWorkflow(prev => ({ ...prev, frontBlob: blob, qualityScores: { ...prev.qualityScores, front: quality.overall } })); }
        else if (side === 'back') { setBackBase64(b64); setCaptureWorkflow(prev => ({ ...prev, backBlob: blob, qualityScores: { ...prev.qualityScores, back: quality.overall } })); }
        else { setCaptureWorkflow(prev => ({ ...prev, issueBlob: blob, qualityScores: { ...prev.qualityScores, issue: quality.overall } })); }
        setCaptureState('captured');
      }, 'image/jpeg', 0.92);
    } else {
      // No border detected — capture full frame
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const quality = computeQualityScore(canvas);
        setQualityScore(quality);
        const b64 = await blobToBase64(blob);
        const side = captureWorkflow.side;
        if (side === 'front') { setFrontBase64(b64); setCaptureWorkflow(prev => ({ ...prev, frontBlob: blob, qualityScores: { ...prev.qualityScores, front: quality.overall } })); }
        else if (side === 'back') { setBackBase64(b64); setCaptureWorkflow(prev => ({ ...prev, backBlob: blob, qualityScores: { ...prev.qualityScores, back: quality.overall } })); }
        else { setCaptureWorkflow(prev => ({ ...prev, issueBlob: blob, qualityScores: { ...prev.qualityScores, issue: quality.overall } })); }
        setCaptureState('captured');
      }, 'image/jpeg', 0.92);
    }
  }, [captureWorkflow.side]);

  const acceptCapture = useCallback(() => {
    if (captureWorkflow.side === 'front') {
      setCaptureWorkflow(prev => ({ ...prev, side: 'back', step: 2 }));
      setCaptureState('positioning');
    } else if (captureWorkflow.side === 'back') {
      setCaptureWorkflow(prev => ({ ...prev, side: 'issue_number', step: 3 }));
      setCaptureState('positioning');
    } else {
      stopCamera();
      setCaptureState('idle');
    }
  }, [captureWorkflow.side, stopCamera]);

  const skipToManualUpload = useCallback(() => { stopCamera(); setCaptureState('idle'); }, [stopCamera]);

  // v3.0 — Full 6-Step Grading Pipeline (25+ LLMs)
  const gradeWithFullPipeline = useCallback(async (comic: Comic) => {
    setIsGrading(true); setGradingProgress(0); setTrinityResults([]); setDoctrineResults([]);
    setVisionResults([]); setResearchNotes(''); setEngineEnrichment(null);
    setDebateTranscript([]); setTrinityDecision(null); setBreeComment(null);
    const steps: PipelineStep[] = [
      { id: 'cache', label: 'Cache check', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'upload', label: 'Image processing + R2 upload', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'vision', label: 'Vision Ensemble (5 models)', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'research', label: 'Research Swarm (50 agents)', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'engines', label: 'Engine Runtime (4 engines)', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'debate', label: 'Debate Hybrid (3 rounds)', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'trinity', label: 'Trinity Council (SAGE/NYX/THORNE)', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'value', label: 'Value computation', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'bree', label: 'Bree commentary', status: 'pending', startTime: null, endTime: null, detail: '' },
      { id: 'store', label: 'Store to collection', status: 'pending', startTime: null, endTime: null, detail: '' },
    ];
    setPipelineSteps(steps);
    const updateStep = (id: string, update: Partial<PipelineStep>) => {
      setPipelineSteps(prev => prev.map(s => s.id === id ? { ...s, ...update } : s));
    };

    // Step 0: Cache check
    updateStep('cache', { status: 'running', startTime: Date.now() });
    setGradingStep('Checking Memory Cortex cache...'); setGradingProgress(5);
    const cached = await recallGradeFromMemory(comic);
    if (cached?.grade) {
      updateStep('cache', { status: 'complete', endTime: Date.now(), detail: `Found: CGC ${cached.grade}` });
      setGradingProgress(100); setGradingStep('Grade recalled from memory');
      setComics(prev => prev.map(c => c.id === comic.id ? { ...c, grade: cached.grade, estimated_value: estimateValue(cached.grade, comic.year, comic.key_issue), status: 'graded' as const, consensus_confidence: cached.confidence || 85, graded_at: cached.graded_at || new Date().toISOString() } : c));
      setTimeout(() => { setIsGrading(false); setGradingProgress(0); setGradingStep(''); }, 1500);
      return;
    }
    updateStep('cache', { status: 'complete', endTime: Date.now(), detail: 'No cache hit' });

    // Step 1: Upload images to R2 if we have them
    updateStep('upload', { status: 'running', startTime: Date.now() });
    setGradingStep('Processing images...'); setGradingProgress(10);
    const comicId = `${comic.title.replace(/\W/g, '_')}_${comic.issue.replace('#', '')}`.toLowerCase();
    let frontKey = comic.front_r2_key || '', backKey = comic.back_r2_key || '';
    if (captureWorkflow.frontBlob) frontKey = await uploadToR2(captureWorkflow.frontBlob, comicId, 'front');
    if (captureWorkflow.backBlob) backKey = await uploadToR2(captureWorkflow.backBlob, comicId, 'back');
    updateStep('upload', { status: 'complete', endTime: Date.now(), detail: `${frontKey ? 'Front' : ''}${frontKey && backKey ? ' + ' : ''}${backKey ? 'Back' : ''} uploaded` });

    // Step 2: Vision Ensemble (5 models) — only if we have images
    updateStep('vision', { status: 'running', startTime: Date.now() });
    setGradingStep('Vision Ensemble — 5 models grading photos...'); setGradingProgress(20);
    let ensembleGrade = 0, ensembleConfidence = 0, ensembleDefects: string[] = [];
    if (frontBase64) {
      const visionResult = await runVisionEnsemble(frontBase64, backBase64, comic);
      setVisionResults(visionResult.results);
      ensembleGrade = visionResult.consensus;
      ensembleConfidence = visionResult.confidence;
      ensembleDefects = visionResult.defects;
      updateStep('vision', { status: 'complete', endTime: Date.now(), detail: `Consensus: ${ensembleGrade} (${ensembleConfidence}% conf)` });
    } else {
      // Fallback: text-only Trinity grading (legacy mode)
      setGradingStep('No images — falling back to Trinity text grading...');
      const [sage, nyx, thorne] = await Promise.all([consultTrinity('SAGE', comic), consultTrinity('NYX', comic), consultTrinity('THORNE', comic)]);
      setTrinityResults([sage, nyx, thorne]);
      const consensus = computeConsensus([sage, nyx, thorne]);
      ensembleGrade = consensus.grade; ensembleConfidence = consensus.confidence; ensembleDefects = consensus.defects;
      updateStep('vision', { status: 'complete', endTime: Date.now(), detail: `Trinity text: ${ensembleGrade} (${ensembleConfidence}%)` });
    }

    // Step 3: Research Swarm (50 agents)
    updateStep('research', { status: 'running', startTime: Date.now() });
    setGradingStep('Research Swarm — 50 agents mining intelligence...'); setGradingProgress(40);
    const research = await runResearchSwarm(comic, ensembleGrade);
    setResearchNotes(research);
    updateStep('research', { status: 'complete', endTime: Date.now(), detail: research ? `${research.length} chars of intel` : 'No data' });

    // Step 4: Engine Runtime (4 engines in parallel)
    updateStep('engines', { status: 'running', startTime: Date.now() });
    setGradingStep('Engine Runtime — PRB02 + LG06 + FIN12 + HIST...'); setGradingProgress(55);
    const enrichment = await runEngineEnrichment(comic, ensembleGrade);
    setEngineEnrichment(enrichment);
    const doctrines = await queryEngineRuntime(comic);
    setDoctrineResults(doctrines);
    updateStep('engines', { status: 'complete', endTime: Date.now(), detail: `PRB02: ${enrichment.prb02 ? `$${enrichment.prb02.value}` : 'N/A'}` });

    // Step 5: Debate Hybrid (adversarial, 3 rounds)
    updateStep('debate', { status: 'running', startTime: Date.now() });
    setGradingStep('Debate Hybrid — Bull vs Bear vs Judge...'); setGradingProgress(65);
    const debate = await runDebateHybrid(frontBase64, comic, ensembleGrade, ensembleDefects, research);
    setDebateTranscript(debate.rounds);
    updateStep('debate', { status: 'complete', endTime: Date.now(), detail: `Adjusted: ${debate.adjustedGrade} (${debate.rounds.length} rounds)` });

    // Step 6: Trinity Council (final grade blessing)
    updateStep('trinity', { status: 'running', startTime: Date.now() });
    setGradingStep('Trinity Council — SAGE + NYX + THORNE final grade...'); setGradingProgress(78);
    const trinity = await runTrinityCouncil(comic, ensembleGrade, debate.adjustedGrade, ensembleDefects, research, enrichment.prb02?.value || 0);
    setTrinityDecision(trinity);
    updateStep('trinity', { status: 'complete', endTime: Date.now(), detail: `Final: ${trinity.finalGrade}${trinity.dissent ? ' (DISSENT)' : ''}` });

    // Step 7: Compute final value
    updateStep('value', { status: 'running', startTime: Date.now() });
    setGradingStep('Computing market value...'); setGradingProgress(88);
    const finalGrade = trinity.finalGrade;
    const valueEstimate = enrichment.prb02?.value || estimateValue(finalGrade, comic.year, comic.key_issue || research.toLowerCase().includes('key issue'));
    updateStep('value', { status: 'complete', endTime: Date.now(), detail: `$${valueEstimate}` });

    // Step 8: Bree commentary
    updateStep('bree', { status: 'running', startTime: Date.now() });
    setGradingStep('Bree is forming an opinion...'); setGradingProgress(92);
    setBreeLoading(true);
    const bree = await getBreeCommentary(comic, finalGrade, ensembleDefects, valueEstimate, ensembleConfidence, research, enrichment);
    setBreeComment(bree); setBreeLoading(false);
    updateStep('bree', { status: 'complete', endTime: Date.now(), detail: `[${bree.emotion}]` });

    // Step 9: Store to collection + Memory Cortex
    updateStep('store', { status: 'running', startTime: Date.now() });
    setGradingStep('Storing to collection...'); setGradingProgress(96);
    await storeGradeToMemory(comic, trinityResults.length > 0 ? trinityResults : [{ voice: 'COUNCIL', grade: finalGrade, analysis: '', confidence: ensembleConfidence, defects: ensembleDefects, model_used: 'Trinity Council', tokens_used: 0 }], finalGrade, ensembleConfidence);
    setComics(prev => prev.map(c => c.id === comic.id ? {
      ...c, grade: finalGrade, estimated_value: valueEstimate, status: 'graded' as const,
      defects: ensembleDefects, consensus_confidence: ensembleConfidence, graded_at: new Date().toISOString(),
      front_r2_key: frontKey || c.front_r2_key, back_r2_key: backKey || c.back_r2_key,
      bree_comment: bree.text, bree_emotion: bree.emotion,
      vision_grades: Object.fromEntries(visionResults.map(v => [v.label, v.grade])),
      research_notes: research, engine_enrichment: enrichment,
      debate_summary: debate.transcript, trinity_decision: trinity,
    } : c));
    updateStep('store', { status: 'complete', endTime: Date.now(), detail: 'Saved' });

    setGradingStep('Grading complete!'); setGradingProgress(100);
    if (!breeMuted && bree.text) playBreeVoice(bree.text, bree.emotion);
    setTimeout(() => { setIsGrading(false); setGradingProgress(0); setGradingStep(''); }, 2000);
  }, [frontBase64, backBase64, captureWorkflow, breeMuted, trinityResults, visionResults]);

  // v3.0 — Batch Grading
  const handleBatchGrade = useCallback(async () => {
    const ungraded = comics.filter(c => c.status === 'ungraded');
    if (ungraded.length === 0) return;
    setBatchGrading(true);
    setBatchProgress({ current: 0, total: ungraded.length, currentTitle: '', currentStep: '' });
    for (let i = 0; i < ungraded.length; i++) {
      setBatchProgress({ current: i + 1, total: ungraded.length, currentTitle: `${ungraded[i].title} ${ungraded[i].issue}`, currentStep: 'Starting pipeline...' });
      await gradeWithFullPipeline(ungraded[i]);
      await new Promise(r => setTimeout(r, 500)); // Brief pause between comics
    }
    setBatchGrading(false);
  }, [comics, gradeWithFullPipeline]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (collectionLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      <p className="text-sm font-medium">Loading collection from Memory Cortex...</p>
      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Fetching {user.email}&apos;s graded collectibles</p>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'collection', label: 'Collection', icon: '📦' },
    { id: 'grade', label: 'Grade', icon: '🎯' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
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
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Powered by Echo Swarm Brain Trinity &mdash; SAGE + NYX + THORNE</p>
            </div>

            {/* System Connection Status */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${swarmStatus === 'online' ? 'bg-emerald-500 animate-pulse' : swarmStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="text-xs font-bold" style={{ color: swarmStatus === 'online' ? '#22c55e' : swarmStatus === 'offline' ? '#ef4444' : '#f59e0b' }}>
                  Swarm Brain {swarmStatus === 'online' ? 'ONLINE' : swarmStatus === 'offline' ? 'OFFLINE' : '...'}
                </span>
              </div>
              <div className="h-4 w-px" style={{ backgroundColor: 'var(--ept-border)' }} />
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${cortexStatus === 'online' ? 'bg-emerald-500 animate-pulse' : cortexStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="text-xs font-bold" style={{ color: cortexStatus === 'online' ? '#22c55e' : cortexStatus === 'offline' ? '#ef4444' : '#f59e0b' }}>
                  Memory Cortex {cortexStatus === 'online' ? 'ONLINE' : cortexStatus === 'offline' ? 'OFFLINE' : '...'}
                </span>
                {cortexStats && <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>({cortexStats.total_memories} memories)</span>}
              </div>
              <div className="h-4 w-px" style={{ backgroundColor: 'var(--ept-border)' }} />
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Trinity AI &middot; Engine Runtime &middot; FTS5 Search &middot; 90-day Decay</span>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Items', value: String(stats.total), sub: `${stats.graded} graded, ${stats.ungraded} ungraded` },
                { label: 'Collection Value', value: formatCurrency(stats.totalValue), sub: `${stats.publisherCount} publishers` },
                { label: 'Avg Grade', value: stats.avgGrade.toFixed(1), sub: `${getGradeLabel(stats.avgGrade)} (${stats.lowestGrade.toFixed(1)}-${stats.highestGrade.toFixed(1)} range)` },
                { label: 'Key Issues', value: String(stats.keyIssues), sub: `${Object.keys(stats.eras).length} eras represented` },
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
                  <span className="gradient-text font-bold text-xs tracking-widest uppercase">Swarm Brain Trinity</span>
                </div>
                <div className="p-4 space-y-2">
                  {AI_PROVIDERS.map(p => (
                    <div key={p.name} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <div>
                          <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                          <p className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{p.model}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: 'var(--ept-text-muted)' }}>{p.weight}%</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>2+ Trinity voices must confirm each defect</p>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Engine Runtime doctrines enhance valuation</p>
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
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold">Collection</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{filteredComics.length} of {comics.length}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setShowAddForm(true)} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>+ Add Comic</button>
                {comics.filter(c => !c.grade).length > 0 && (
                  <button onClick={handleBatchGrade} disabled={batchGrading || isGrading} className="px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50" style={{ backgroundColor: '#8b5cf6', color: '#fff' }}>
                    {batchGrading ? `Grading ${batchProgress.current}/${batchProgress.total}...` : `Grade All (${comics.filter(c => !c.grade).length})`}
                  </button>
                )}
                <button onClick={() => exportCollection('json')} className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>Export JSON</button>
                <button onClick={() => exportCollection('csv')} className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>Export CSV</button>
              </div>
            </div>

            {/* Batch Grading Progress */}
            {batchGrading && (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid #8b5cf6' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#8b5cf6' }} />
                  <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>Batch Grading: {batchProgress.currentTitle}</span>
                  <span className="text-xs font-mono ml-auto" style={{ color: 'var(--ept-text-muted)' }}>{batchProgress.current}/{batchProgress.total}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%`, backgroundColor: '#8b5cf6' }} />
                </div>
                {batchProgress.currentStep && <p className="text-xs mt-1 font-mono" style={{ color: 'var(--ept-text-muted)' }}>{batchProgress.currentStep}</p>}
              </div>
            )}

            {/* Collection Tags */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1 mr-2">
                {collectionTags.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ backgroundColor: activeTag === tag ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', color: activeTag === tag ? 'var(--ept-accent)' : 'var(--ept-text-muted)', border: activeTag === tag ? '1px solid var(--ept-accent)' : '1px solid var(--ept-border)' }}>
                    {tag}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Search title, publisher, era, writer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-4 py-2 rounded-lg text-sm focus:outline-none flex-1 min-w-[200px]" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
              <select value={publisherFilter} onChange={e => setPublisherFilter(e.target.value)} className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                <option value="all">All Publishers ({publishers.length})</option>
                {publishers.map(([pub, count]) => <option key={pub} value={pub}>{pub} ({count})</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                <option value="title">Sort: Title</option>
                <option value="grade">Sort: Grade</option>
                <option value="value">Sort: Value</option>
                <option value="year">Sort: Year</option>
              </select>
              <div className="flex gap-1">
                {['all', 'graded', 'ungraded', 'pending_review'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: statusFilter === s ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', color: statusFilter === s ? 'var(--ept-accent)' : 'var(--ept-text-muted)', border: statusFilter === s ? '1px solid var(--ept-accent)' : '1px solid var(--ept-border)' }}>
                    {s === 'all' ? 'All' : s === 'pending_review' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Comic Modal */}
            {showAddForm && (
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '2px solid var(--ept-accent)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold gradient-text">Add Comic to Collection</h2>
                  <button onClick={() => setShowAddForm(false)} className="p-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--ept-surface)' }}>Cancel</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Title *</label>
                    <input type="text" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Amazing Spider-Man" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Issue # *</label>
                    <input type="text" value={addForm.issue} onChange={e => setAddForm(f => ({ ...f, issue: e.target.value }))} placeholder="129" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Year</label>
                    <input type="text" value={addForm.year} onChange={e => setAddForm(f => ({ ...f, year: e.target.value }))} placeholder="1974" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Publisher *</label>
                    <input type="text" value={addForm.publisher} onChange={e => setAddForm(f => ({ ...f, publisher: e.target.value }))} placeholder="Marvel" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Era</label>
                    <select value={addForm.era} onChange={e => setAddForm(f => ({ ...f, era: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                      <option value="">Select era...</option>
                      <option value="golden age">Golden Age (1938-1956)</option>
                      <option value="silver age">Silver Age (1956-1970)</option>
                      <option value="bronze age">Bronze Age (1970-1985)</option>
                      <option value="copper age">Copper Age (1985-1991)</option>
                      <option value="modern age">Modern Age (1991+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Writer</label>
                    <input type="text" value={addForm.writer} onChange={e => setAddForm(f => ({ ...f, writer: e.target.value }))} placeholder="Stan Lee" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Cover Artist</label>
                    <input type="text" value={addForm.cover_artist} onChange={e => setAddForm(f => ({ ...f, cover_artist: e.target.value }))} placeholder="John Romita" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Buy Price ($)</label>
                    <input type="text" value={addForm.buy_price} onChange={e => setAddForm(f => ({ ...f, buy_price: e.target.value }))} placeholder="25.00" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--ept-text-muted)' }}>Buy Source</label>
                    <input type="text" value={addForm.buy_source} onChange={e => setAddForm(f => ({ ...f, buy_source: e.target.value }))} placeholder="eBay, LCS, etc." className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }} />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addForm.key_issue} onChange={e => setAddForm(f => ({ ...f, key_issue: e.target.checked }))} className="w-4 h-4 rounded" />
                      <span className="text-xs font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Key Issue</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>Cancel</button>
                  <button onClick={handleAddComic} className="px-6 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Add to Collection</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComics.map(c => (
                <div key={c.id} onClick={() => setComicDetailModal(c)} onContextMenu={e => { e.preventDefault(); setSelectedComic(selectedComic?.id === c.id ? null : c); }} className="rounded-xl overflow-hidden cursor-pointer card-hover transition-all" style={{ backgroundColor: 'var(--ept-card-bg)', border: selectedComic?.id === c.id ? '2px solid var(--ept-accent)' : '1px solid var(--ept-card-border)' }}>
                  {c.image_url && (
                    <div className="relative w-full" style={{ aspectRatio: '2/3', maxHeight: 220, overflow: 'hidden', backgroundColor: 'var(--ept-surface)' }}>
                      <img
                        src={c.image_url}
                        alt={`${c.title} ${c.issue}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold">{c.title} {c.issue}</p>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} &middot; {c.year}{c.era ? ` \u00B7 ${c.era}` : ''}</p>
                      {c.key_issue && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase" style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308' }}>Key Issue</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: c.status === 'graded' ? 'rgba(34,197,94,0.1)' : c.status === 'ungraded' ? 'var(--ept-surface)' : 'rgba(245,158,11,0.1)', color: c.status === 'graded' ? '#22c55e' : c.status === 'ungraded' ? 'var(--ept-text-muted)' : '#f59e0b' }}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <button onClick={e => { e.stopPropagation(); handleDeleteComic(c); }} className="p-1 rounded text-[10px] opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#ef4444' }} title="Delete">x</button>
                    </div>
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
                      <button onClick={e => { e.stopPropagation(); gradeWithFullPipeline(c); }} className="px-4 py-2 rounded-lg text-xs font-bold transition-all" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Grade Now</button>
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
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedComic && selectedComic.grade !== null && (
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '2px solid var(--ept-accent)' }}>
                <div className="flex items-start gap-5 mb-6">
                  {selectedComic.image_url && (
                    <img
                      src={selectedComic.image_url}
                      alt={`${selectedComic.title} ${selectedComic.issue}`}
                      className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
                      style={{ border: '1px solid var(--ept-border)' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold">{selectedComic.title} {selectedComic.issue}</h2>
                      <p style={{ color: 'var(--ept-text-muted)' }}>{selectedComic.publisher} &middot; {selectedComic.year}</p>
                    </div>
                    <button onClick={() => setSelectedComic(null)} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>✕</button>
                  </div>
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
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Trinity consensus</p>
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

                {/* Trinity Analysis (if we just graded this comic) */}
                {trinityResults.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Trinity AI Analysis</p>
                    <div className="space-y-3">
                      {trinityResults.map(r => {
                        const prov = AI_PROVIDERS.find(p => p.voice === r.voice);
                        return (
                          <div key={r.voice} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)', border: `1px solid ${prov?.color || 'var(--ept-border)'}25` }}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prov?.color }} />
                                <span className="text-sm font-bold" style={{ color: prov?.color }}>{r.voice}</span>
                                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{r.model_used} &middot; {r.tokens_used} tokens</span>
                              </div>
                              {r.grade !== null && (
                                <span className="text-lg font-extrabold font-mono" style={{ color: getGradeColor(r.grade) }}>{r.grade}</span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{r.analysis.slice(0, 400)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ GRADE ══════════════ */}
        {activeTab === 'grade' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold">AI Grading Studio v3.0</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>25+ LLMs &middot; Vision Ensemble &middot; 50-Agent Research &middot; Debate Hybrid &middot; Trinity Council</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setBreeMuted(m => !m)} className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: breeMuted ? '#ef4444' : 'var(--ept-text-muted)' }}>
                  {breeMuted ? 'Bree Muted' : 'Bree Voice ON'}
                </button>
              </div>
            </div>

            {/* Camera Capture System */}
            {captureState !== 'idle' ? (
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', border: `2px solid ${captureState === 'ready' ? '#22c55e' : captureState === 'captured' ? 'var(--ept-accent)' : '#f59e0b'}` }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--ept-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${captureState === 'ready' ? '' : 'animate-pulse'}`} style={{ backgroundColor: captureState === 'ready' ? '#22c55e' : '#f59e0b' }} />
                    <span className="text-sm font-bold">Step {captureWorkflow.step}/3: {captureWorkflow.side === 'front' ? 'Front Cover' : captureWorkflow.side === 'back' ? 'Back Cover' : 'Issue Number (optional)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cameraDevices.length > 1 && (
                      <select value={selectedCamera} onChange={e => { setSelectedCamera(e.target.value); startCamera(e.target.value); }} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>
                        {cameraDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0,8)}`}</option>)}
                      </select>
                    )}
                    <button onClick={stopCamera} className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--ept-surface)', color: '#ef4444' }}>Cancel</button>
                  </div>
                </div>
                <div className="relative" style={{ aspectRatio: '4/3', maxHeight: '480px' }}>
                  {captureState !== 'captured' ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <canvas ref={detectionCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                    </>
                  ) : (
                    <canvas ref={canvasRef} className="w-full h-full object-contain" style={{ backgroundColor: '#000' }} />
                  )}
                </div>
                {/* Quality Bar */}
                <div className="px-5 py-2 flex items-center gap-3" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--ept-text-muted)' }}>Quality</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-bg)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${qualityScore.overall}%`, backgroundColor: qualityScore.overall > 70 ? '#22c55e' : qualityScore.overall > 40 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: qualityScore.overall > 70 ? '#22c55e' : '#f59e0b' }}>{qualityScore.overall}%</span>
                </div>
                {/* Capture Controls */}
                <div className="px-5 py-4 flex items-center justify-center gap-4">
                  {captureState === 'captured' ? (
                    <>
                      <button onClick={() => { setCaptureState('positioning'); }} className="px-6 py-3 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>Retake</button>
                      <button onClick={acceptCapture} className="px-8 py-3 rounded-lg text-sm font-bold" style={{ backgroundColor: '#22c55e', color: '#fff' }}>Accept</button>
                    </>
                  ) : (
                    <>
                      <button onClick={captureFrame} disabled={captureState !== 'ready' && captureState !== 'positioning'} className="w-16 h-16 rounded-full border-4 transition-all disabled:opacity-30" style={{ borderColor: captureState === 'ready' ? '#22c55e' : 'var(--ept-border)', backgroundColor: captureState === 'ready' ? '#22c55e20' : 'transparent' }}>
                        <span className="text-2xl">{captureState === 'ready' ? '📸' : '...'}</span>
                      </button>
                      {captureWorkflow.step > 1 && <button onClick={() => skipToManualUpload()} className="text-xs underline" style={{ color: 'var(--ept-text-muted)' }}>Skip to manual</button>}
                    </>
                  )}
                </div>
                {/* Thumbnail Preview Strip */}
                {(captureWorkflow.frontBlob || captureWorkflow.backBlob) && (
                  <div className="px-5 py-3 flex gap-3" style={{ borderTop: '1px solid var(--ept-border)' }}>
                    {captureWorkflow.frontBlob && <div className="w-16 h-24 rounded overflow-hidden border-2" style={{ borderColor: '#22c55e' }}><img src={URL.createObjectURL(captureWorkflow.frontBlob)} alt="Front" className="w-full h-full object-cover" /></div>}
                    {captureWorkflow.backBlob && <div className="w-16 h-24 rounded overflow-hidden border-2" style={{ borderColor: '#22c55e' }}><img src={URL.createObjectURL(captureWorkflow.backBlob)} alt="Back" className="w-full h-full object-cover" /></div>}
                    {captureWorkflow.issueBlob && <div className="w-16 h-16 rounded overflow-hidden border-2" style={{ borderColor: '#22c55e' }}><img src={URL.createObjectURL(captureWorkflow.issueBlob)} alt="Issue" className="w-full h-full object-cover" /></div>}
                  </div>
                )}
              </div>
            ) : (
              /* Start Camera / Manual Upload */
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--ept-card-bg)', border: '2px dashed var(--ept-border)' }}>
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)' }}>📸</div>
                <p className="font-bold text-lg">Capture or Upload Comic</p>
                <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Use your camera for auto-detection + border crop, or upload manually</p>
                <div className="flex items-center justify-center gap-4 mt-5">
                  <button onClick={() => startCamera()} className="px-6 py-3 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Open Camera</button>
                  <button onClick={() => skipToManualUpload()} className="px-6 py-3 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)', color: 'var(--ept-text)' }}>Upload Images</button>
                </div>
                <p className="text-xs mt-3" style={{ color: 'var(--ept-text-muted)' }}>5 vision models analyze front+back photos &middot; 50-agent research swarm &middot; 4 engine doctrines &middot; adversarial debate &middot; Trinity Council final grade</p>
              </div>
            )}

            {/* 6-Step Pipeline Progress */}
            {pipelineSteps.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-accent)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="gradient-text font-bold text-xs tracking-widest uppercase">Grading Pipeline</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{pipelineSteps.filter(s => s.status === 'complete').length}/{pipelineSteps.length} steps</span>
                </div>
                <div className="space-y-2">
                  {pipelineSteps.map(step => (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: step.status === 'running' ? 'var(--ept-accent-glow)' : 'var(--ept-surface)', border: step.status === 'running' ? '1px solid var(--ept-accent)' : '1px solid transparent' }}>
                      <span className="text-sm w-5">
                        {step.status === 'complete' ? '✓' : step.status === 'running' ? '...' : step.status === 'error' ? '✗' : '○'}
                      </span>
                      <span className={`text-xs font-semibold flex-1 ${step.status === 'complete' ? '' : step.status === 'running' ? 'animate-pulse' : ''}`} style={{ color: step.status === 'complete' ? '#22c55e' : step.status === 'running' ? 'var(--ept-accent)' : step.status === 'error' ? '#ef4444' : 'var(--ept-text-muted)' }}>
                        {step.label}
                      </span>
                      {step.endTime && step.startTime && <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{((step.endTime - step.startTime) / 1000).toFixed(1)}s</span>}
                      {step.detail && <span className="text-[10px] font-mono max-w-[300px] truncate" style={{ color: 'var(--ept-text-muted)' }}>{step.detail}</span>}
                    </div>
                  ))}
                </div>

                {/* Vision Ensemble Results */}
                {visionResults.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--ept-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Vision Ensemble (5 Models)</p>
                    <div className="grid grid-cols-5 gap-2">
                      {visionResults.map(vr => (
                        <div key={vr.model} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <p className="text-[10px] font-bold truncate" style={{ color: VISION_MODELS.find(vm => vm.model === vr.model)?.color || 'var(--ept-text)' }}>{vr.label}</p>
                          <p className="text-xl font-extrabold font-mono mt-1" style={{ color: getGradeColor(vr.grade) }}>{vr.grade.toFixed(1)}</p>
                          <p className="text-[9px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>{vr.confidence}% conf</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debate Transcript */}
                {debateTranscript.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--ept-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Debate Hybrid (Adversarial)</p>
                    {debateTranscript.map(round => (
                      <div key={round.round} className="mb-2 p-2 rounded text-[10px]" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <span className="font-bold" style={{ color: '#22c55e' }}>BULL:</span> <span style={{ color: 'var(--ept-text-muted)' }}>{round.bull.slice(0, 120)}...</span>
                        <br /><span className="font-bold" style={{ color: '#ef4444' }}>BEAR:</span> <span style={{ color: 'var(--ept-text-muted)' }}>{round.bear.slice(0, 120)}...</span>
                        <br /><span className="font-bold" style={{ color: '#f59e0b' }}>JUDGE:</span> <span style={{ color: 'var(--ept-text-muted)' }}>{round.judge.slice(0, 120)}...</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trinity Council Decision */}
                {trinityDecision && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--ept-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Trinity Council (Final Authority)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'SAGE', data: trinityDecision.sage, color: '#8b5cf6' },
                        { name: 'NYX', data: trinityDecision.nyx, color: '#ec4899' },
                        { name: 'THORNE', data: trinityDecision.thorne, color: '#f59e0b' },
                      ].map(v => (
                        <div key={v.name} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)', border: `1px solid ${v.color}30` }}>
                          <p className="text-xs font-bold" style={{ color: v.color }}>{v.name}</p>
                          <p className="text-2xl font-extrabold font-mono mt-1" style={{ color: getGradeColor(v.data.grade) }}>{v.data.grade.toFixed(1)}</p>
                          <p className="text-[9px] mt-1 line-clamp-2" style={{ color: 'var(--ept-text-muted)' }}>{v.data.reasoning.slice(0, 80)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-accent-glow)', border: '1px solid var(--ept-accent)' }}>
                      <p className="text-xs font-bold" style={{ color: 'var(--ept-accent)' }}>FINAL GRADE</p>
                      <p className="text-4xl font-extrabold font-mono" style={{ color: getGradeColor(trinityDecision.finalGrade) }}>{trinityDecision.finalGrade.toFixed(1)}</p>
                      <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{getGradeLabel(trinityDecision.finalGrade)}</p>
                    </div>
                    {trinityDecision.dissent && <p className="text-[10px] mt-2 italic" style={{ color: '#f59e0b' }}>Dissent: {trinityDecision.dissent}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Bree Commentary */}
            {breeComment && (
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid #ec4899' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💅</span>
                    <span className="font-bold text-sm" style={{ color: '#ec4899' }}>BREE says:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: '#ec489920', color: '#ec4899' }}>{breeComment.emotion}</span>
                  </div>
                  <button onClick={() => { if (!breeMuted) playBreeVoice(breeComment.text, breeComment.emotion); }} disabled={breeAudioPlaying} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ec489920', color: '#ec4899' }}>
                    {breeAudioPlaying ? '...' : '▶'}
                  </button>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: 'var(--ept-text)' }}>&ldquo;{breeComment.text}&rdquo;</p>
                <p className="text-[9px] mt-2" style={{ color: 'var(--ept-text-muted)' }}>via Swarm Brain x Bree Chat (ElevenLabs v3 / Cartesia fallback)</p>
              </div>
            )}

            {/* Research Notes */}
            {researchNotes && (
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-3">Research Swarm Intelligence (50 Agents)</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--ept-text-muted)' }}>{researchNotes.slice(0, 1500)}</p>
              </div>
            )}

            {/* Engine Enrichment */}
            {engineEnrichment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {engineEnrichment.prb02 && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#8b5cf6' }}>PRB02: USPAP Valuation</p>
                    <p className="text-xl font-extrabold gradient-text">{formatCurrency(engineEnrichment.prb02.value)}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{engineEnrichment.prb02.framework.slice(0, 200)}</p>
                  </div>
                )}
                {engineEnrichment.fin12 && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#22c55e' }}>FIN12: Market Analysis</p>
                    <p className="text-sm font-bold">{engineEnrichment.fin12.range}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{engineEnrichment.fin12.trend}</p>
                  </div>
                )}
                {engineEnrichment.lg06 && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#f59e0b' }}>LG06: IP Significance</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{engineEnrichment.lg06.significance.slice(0, 200)}</p>
                  </div>
                )}
                {engineEnrichment.hist && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#ec4899' }}>HIST: Historical Context</p>
                    <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{engineEnrichment.hist.context.slice(0, 200)}</p>
                  </div>
                )}
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
                    <button onClick={() => gradeWithFullPipeline(c)} disabled={isGrading} className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
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
          </div>
        )}

        {/* ══════════════ PRICING ══════════════ */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold">Market Pricing</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>Multi-source price aggregation with outlier removal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Comics Price Guide', desc: 'comicspriceguide.com — API-integrated comic valuations and price history', icon: '💰', active: true },
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

        {/* ══════════════ ANALYTICS ══════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-2xl font-extrabold">Collection Analytics</h1>

            {/* Investment Tracking */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const totalInvested = comics.reduce((s, c) => s + (c.buy_price || 0), 0);
                const totalEstimated = stats.totalValue;
                const roi = totalInvested > 0 ? ((totalEstimated - totalInvested) / totalInvested * 100) : 0;
                const soldComics = comics.filter(c => c.sold_price);
                const realizedPL = soldComics.reduce((s, c) => s + ((c.sold_price || 0) - (c.buy_price || 0)), 0);
                const unrealizedPL = totalEstimated - totalInvested - realizedPL;
                return [
                  { label: 'Total Invested', value: formatCurrency(totalInvested), sub: `${comics.filter(c => c.buy_price).length} with cost basis`, color: 'var(--ept-text)' },
                  { label: 'Estimated Value', value: formatCurrency(totalEstimated), sub: `${stats.graded} graded comics`, color: 'var(--ept-accent)' },
                  { label: 'ROI', value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`, sub: roi >= 0 ? 'Gain' : 'Loss', color: roi >= 0 ? '#22c55e' : '#ef4444' },
                  { label: 'Unrealized P&L', value: `${unrealizedPL >= 0 ? '+' : ''}${formatCurrency(Math.abs(unrealizedPL))}`, sub: `${soldComics.length} sold (${formatCurrency(realizedPL)} realized)`, color: unrealizedPL >= 0 ? '#22c55e' : '#ef4444' },
                ];
              })().map(s => (
                <div key={s.label} className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</p>
                  <p className="text-3xl font-extrabold mt-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Comics', value: String(stats.total), sub: `${stats.graded} graded` },
                { label: 'Total Value', value: formatCurrency(stats.totalValue), sub: `avg ${stats.total ? formatCurrency(Math.round(stats.totalValue / stats.total)) : '$0'}/comic` },
                { label: 'Grade Range', value: `${stats.lowestGrade.toFixed(1)}-${stats.highestGrade.toFixed(1)}`, sub: `avg ${stats.avgGrade.toFixed(1)} (${getGradeLabel(stats.avgGrade)})` },
                { label: 'Publishers', value: String(stats.publisherCount), sub: `${Object.keys(stats.eras).length} eras` },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-5" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</p>
                  <p className="text-3xl font-extrabold mt-1 gradient-text">{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Publisher Breakdown */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Publisher Breakdown</p>
              <div className="space-y-2">
                {publishers.slice(0, 15).map(([pub, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  const pubComics = comics.filter(c => c.publisher === pub);
                  const pubValue = pubComics.reduce((s, c) => s + (c.estimated_value || 0), 0);
                  return (
                    <div key={pub} className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-40 truncate">{pub}</span>
                      <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--ept-accent), #8b5cf6)' }} />
                      </div>
                      <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--ept-text-muted)' }}>{count} ({pct}%)</span>
                      <span className="text-xs font-mono w-20 text-right" style={{ color: 'var(--ept-accent)' }}>{pubValue > 0 ? formatCurrency(pubValue) : '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Era Distribution + Grade Distribution side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Era Distribution</p>
                <div className="space-y-2">
                  {Object.entries(stats.eras).sort((a, b) => b[1] - a[1]).map(([era, count]) => (
                    <div key={era} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <span className="text-sm font-semibold capitalize">{era}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: 'var(--ept-accent)' }}>{count} comics</span>
                    </div>
                  ))}
                  {Object.keys(stats.eras).length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--ept-text-muted)' }}>No era data available</p>}
                </div>
              </div>
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Grade Distribution</p>
                <div className="space-y-2">
                  {[
                    { label: 'Near Mint+ (9.0-10.0)', min: 9.0, max: 10.0 },
                    { label: 'Very Fine (7.0-8.5)', min: 7.0, max: 8.99 },
                    { label: 'Fine (5.0-6.5)', min: 5.0, max: 6.99 },
                    { label: 'Very Good (3.0-4.5)', min: 3.0, max: 4.99 },
                    { label: 'Below VG (0.5-2.5)', min: 0, max: 2.99 },
                  ].map(range => {
                    const count = comics.filter(c => c.grade !== null && c.grade >= range.min && c.grade <= range.max).length;
                    const pct = stats.graded > 0 ? Math.round((count / stats.graded) * 100) : 0;
                    return (
                      <div key={range.label} className="flex items-center gap-3">
                        <span className="text-xs w-36 truncate">{range.label}</span>
                        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: getGradeColor((range.min + range.max) / 2) }} />
                        </div>
                        <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--ept-text-muted)' }}>{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Value Comics */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">Top 10 Most Valuable</p>
              <div className="divide-y" style={{ borderColor: 'var(--ept-border)' }}>
                {comics.filter(c => c.estimated_value).sort((a, b) => (b.estimated_value || 0) - (a.estimated_value || 0)).slice(0, 10).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>{i + 1}</span>
                      <div>
                        <p className="font-semibold text-sm">{c.title} {c.issue}</p>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{c.publisher} ({c.year}){c.era ? ` \u00B7 ${c.era}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {c.grade && <span className="text-sm font-mono font-bold" style={{ color: getGradeColor(c.grade) }}>{c.grade}</span>}
                      <span className="font-bold gradient-text">{formatCurrency(c.estimated_value!)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ SETTINGS ══════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-2xl font-extrabold">Settings</h1>

            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
              <p className="gradient-text font-bold text-xs tracking-widest uppercase mb-4">v3.0 Grading Pipeline Configuration</p>
              <div className="space-y-3">
                {AI_PROVIDERS.map(p => (
                  <div key={p.name} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <div>
                        <span className="font-bold text-sm" style={{ color: p.color }}>{p.name}</span>
                        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{p.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>Weight: {p.weight}%</span>
                      <span className="px-3 py-1 rounded text-xs font-bold" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Swarm Brain (Trinity AI)</span>
                    <span className="text-xs font-bold" style={{ color: swarmStatus === 'online' ? '#22c55e' : '#ef4444' }}>{swarmStatus === 'online' ? 'CONNECTED' : 'DISCONNECTED'}</span>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>echo-swarm-brain.bmcii1976.workers.dev &middot; 362 models &middot; Trinity consensus grading</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Memory Cortex (Biological Memory)</span>
                    <span className="text-xs font-bold" style={{ color: cortexStatus === 'online' ? '#22c55e' : '#ef4444' }}>{cortexStatus === 'online' ? 'CONNECTED' : 'DISCONNECTED'}</span>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--ept-text-muted)' }}>
                    echo-memory-cortex.bmcii1976.workers.dev &middot; D1+FTS5 &middot; 90-day decay &middot; {cortexStats?.total_memories ?? '?'} memories
                  </p>
                </div>
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
                  { label: 'Service', value: 'EPOCGS v3.0 — Echo Prime Collectibles Grading System' },
                  { label: 'Version', value: '3.0.0 (Full Pipeline: Vision + Research + Debate + Trinity)' },
                  { label: 'Vision Ensemble', value: '5 models: Claude Opus 4.6, GPT-4o, Gemini 2.5 Pro, Grok 4, Qwen 2.5 VL' },
                  { label: 'Research Swarm', value: '50 agents across 362 models via echo-swarm-brain' },
                  { label: 'Engine Runtime', value: '921 engines, 34K doctrines (PRB02, LG06, FIN12, HIST)' },
                  { label: 'Debate Hybrid', value: 'Bull vs Bear vs Judge — 3 adversarial rounds' },
                  { label: 'Trinity Council', value: 'SAGE (Opus 4.6) + NYX (Grok 4) + THORNE (o1) — final authority' },
                  { label: 'Bree Commentary', value: 'Canon Overkill v4.0 — ElevenLabs v3 / Cartesia sonic-3 TTS' },
                  { label: 'Memory', value: 'Memory Cortex (D1+FTS5, 90-day decay, strength-based recall)' },
                  { label: 'Camera', value: 'getUserMedia + canvas border detection + auto-crop + quality scoring' },
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

      {/* Comic Detail Modal */}
      {comicDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setComicDetailModal(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{ backgroundColor: 'var(--ept-bg)' }} onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold">{comicDetailModal.title} {comicDetailModal.issue}</h2>
                  <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{comicDetailModal.publisher} &middot; {comicDetailModal.year}{comicDetailModal.era ? ` \u00B7 ${comicDetailModal.era}` : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => gradeWithFullPipeline(comicDetailModal)} disabled={isGrading} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{isGrading ? 'Re-grading...' : 'Re-grade'}</button>
                  <button onClick={() => setComicDetailModal(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ept-surface)' }}>✕</button>
                </div>
              </div>

              {/* Images + Grade */}
              <div className="flex gap-6">
                <div className="flex gap-3">
                  {comicDetailModal.front_r2_key && (
                    <div className="w-48 h-72 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <img src={`${R2_MEDIA_URL}/${comicDetailModal.front_r2_key}`} alt="Front" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {comicDetailModal.back_r2_key && (
                    <div className="w-48 h-72 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--ept-surface)' }}>
                      <img src={`${R2_MEDIA_URL}/${comicDetailModal.back_r2_key}`} alt="Back" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  {comicDetailModal.grade !== null && (
                    <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'var(--ept-accent-glow)', border: '1px solid var(--ept-accent)' }}>
                      <p className="text-5xl font-extrabold font-mono" style={{ color: getGradeColor(comicDetailModal.grade!) }}>{comicDetailModal.grade}</p>
                      <p className="text-sm font-semibold mt-1">{getGradeLabel(comicDetailModal.grade!)}</p>
                      {comicDetailModal.estimated_value && <p className="text-lg font-bold gradient-text mt-2">{formatCurrency(comicDetailModal.estimated_value)}</p>}
                      {comicDetailModal.consensus_confidence && <p className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{comicDetailModal.consensus_confidence}% confidence</p>}
                    </div>
                  )}
                  {comicDetailModal.defects.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Defects</p>
                      <div className="flex flex-wrap gap-1">
                        {comicDetailModal.defects.map(d => (
                          <span key={d} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>{d.replace('_', ' ')}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vision Ensemble Grades */}
              {comicDetailModal.vision_grades && Object.keys(comicDetailModal.vision_grades).length > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Vision Ensemble (5 Models)</p>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(comicDetailModal.vision_grades).map(([model, grade]) => {
                      const vm = VISION_MODELS.find(v => v.model === model);
                      return (
                        <div key={model} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <p className="text-[10px] font-bold truncate" style={{ color: vm?.color || 'var(--ept-text)' }}>{vm?.label || model.split('/').pop()}</p>
                          <p className="text-xl font-extrabold font-mono" style={{ color: getGradeColor(grade as number) }}>{(grade as number).toFixed(1)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Research Notes */}
              {comicDetailModal.research_notes && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Research Swarm Intelligence</p>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--ept-text-muted)' }}>{comicDetailModal.research_notes.slice(0, 1000)}</p>
                </div>
              )}

              {/* Trinity Decision */}
              {comicDetailModal.trinity_decision && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-text-muted)' }}>Trinity Council Decision</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['sage', 'nyx', 'thorne'].map(voice => {
                      const td = comicDetailModal.trinity_decision as TrinityDecision;
                      const data = td[voice as keyof TrinityDecision] as { grade: number; reasoning: string };
                      const colors: Record<string, string> = { sage: '#8b5cf6', nyx: '#ec4899', thorne: '#f59e0b' };
                      return (
                        <div key={voice} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
                          <p className="text-xs font-bold uppercase" style={{ color: colors[voice] }}>{voice}</p>
                          <p className="text-xl font-extrabold font-mono" style={{ color: getGradeColor(data.grade) }}>{data.grade.toFixed(1)}</p>
                          <p className="text-[9px] mt-1 line-clamp-2" style={{ color: 'var(--ept-text-muted)' }}>{data.reasoning.slice(0, 80)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bree Commentary */}
              {comicDetailModal.bree_comment && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid #ec4899' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>💅</span>
                    <span className="font-bold text-sm" style={{ color: '#ec4899' }}>BREE</span>
                    {comicDetailModal.bree_emotion && <span className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#ec489920', color: '#ec4899' }}>{comicDetailModal.bree_emotion}</span>}
                  </div>
                  <p className="text-sm italic" style={{ color: 'var(--ept-text)' }}>&ldquo;{comicDetailModal.bree_comment}&rdquo;</p>
                </div>
              )}

              {/* Debate Summary */}
              {comicDetailModal.debate_summary && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ept-card-bg)', border: '1px solid var(--ept-card-border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Debate Hybrid Summary</p>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{comicDetailModal.debate_summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-6 mt-12" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>&copy; 2026 Echo Prime Technologies. EPOCGS v3.0 Collectibles Grading System.</p>
        </div>
      </footer>
    </div>
  );
}
