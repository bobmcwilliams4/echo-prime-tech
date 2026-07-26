/* Immortality Vault — Typed API Client */

import { API } from './constants';

/* ─── Interfaces ─────────────────────────────────────────────────────── */

export interface VaultUser {
  id: string;
  name: string;
  email: string;
  tier: string;
  consciousness_score: number;
  total_memories: number;
  total_interviews: number;
  voice_clone_status: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
}

export interface ChatResponse {
  response: string;
  emotion: string;
  session_id: string;
  consciousness_name?: string;
}

export interface InterviewQuestion {
  question: string;
  question_id: string;
  category: string;
  depth?: string;
  video_instructions?: string;
}

export interface InterviewQuestionSelect {
  questions: InterviewQuestion[];
  session_type: string;
  total_available: number;
  focus_category?: string;
  category_answered?: number;
  category_target?: number;
  auto?: boolean;
}

/** What the interviewer-driven flow needs to render progress alongside the question. */
export interface NextQuestion {
  question: InterviewQuestion;
  focusCategory: string;
  answered: number;
  target: number;
}

export interface FamilyMember {
  id: string;
  vault_user_id?: string;
  name: string;
  relationship: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  photo_url?: string;
  created_at?: string;
}

export interface Memory {
  id: string;
  user_id: string;
  content: string;           // latest content (the newest edit, if any)
  category: string;
  emotion?: string;
  importance?: number;
  source?: string;
  created_at: string;
  /* ── P3 slice 3: owner edits ── the memory carries its edit history so the UI
   *  can show the correction while still letting the owner see what they first
   *  said. `content` is always the latest; `original_content` is the first
   *  version, present only once an edit has been made. */
  original_content?: string;
  edited?: boolean;
  edited_at?: string;
  /* ── P5: family recollections attached to this memory (author + relationship). */
  annotations?: MemoryAnnotation[];
  /* ── P5: whether this memory may appear in a shared memorial. */
  shareable?: boolean;
}

export interface VoiceProfile {
  id: string;
  user_id: string;
  provider: string;
  voice_id?: string;
  clone_status: string;
  sample_count: number;
  quality_score: number;
  created_at: string;
}

export interface GamificationStats {
  user_id: string;
  consciousness_score: number;
  total_memories: number;
  total_interviews: number;
  voice_clone_status: string;
  total_points: number;
  achievements: Achievement[];
  available_achievements: AchievementDef[];
  level: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  points: number;
  unlocked_at: string;
}

export interface AchievementDef {
  type: string;
  title: string;
  description: string;
  points: number;
}

export interface CoverageCategory {
  category: string;
  answered: number;
  total: number;
  percentage: number;
  /** Every answered question in the subject (bank + generated) — what the
   *  interviewer's deep-coverage target counts. */
  answered_total?: number;
  target?: number;
  coverage_pct?: number;
}

export interface GapQuestion {
  category: string;
  questions: { question_id: string; text: string; depth: string }[];
}

export interface VideoMeta {
  id: string;
  user_id: string;
  interview_id?: string;
  question_id?: string;
  r2_key: string;
  duration_seconds: number;
  file_size: number;
  mime_type: string;
  created_at: string;
  stream_url?: string;   // P1: owner-signed (?tok=) stream URL — prefer over getVideoStreamUrl
}

export type ConsentSubjectStatus = 'living' | 'deceased' | 'incapacitated';
export type ConsentMediaType = 'voice' | 'video';
export type ConsentCaptureScope = ConsentMediaType | 'any';

export interface ConsentCaptureInput {
  user_id: string;
  subject_status: ConsentSubjectStatus;
  media_type: ConsentCaptureScope;
  consenter_name: string;
  consenter_relationship: string;
  consenter_email: string;
  legal_authority_type?: string;
}

export interface ConsentMediaState {
  allowed: boolean;
  reason: string;
}

export interface ConsentPosture {
  user_id: string;
  media: {
    voice: ConsentMediaState;
    video: ConsentMediaState;
  };
  records: number;
  deletion_requested: boolean;
}

export interface ConsentCaptureResponse {
  ok: boolean;
  consent: {
    id: string;
    subject_status: ConsentSubjectStatus;
    method: 'self_attested' | 'guardian_attested' | 'legal_authority';
    granted: boolean;
    authority_verified: boolean;
    pending_human_review: boolean;
  };
  active: boolean;
  notice?: string;
}

export interface FaceTimeReadiness {
  user_id: string;
  ready: boolean;
  readiness_score: number;
  score?: number;
  requirements?: Record<string, number>;
  missing?: string[];
}

export interface VaultStats {
  users: number;
  memories: number;
  interviews: number;
  family_members: number;
  chat_sessions: number;
}

/* ─── Consciousness Engine Types ────────────────────────────────────── */

export type ConsciousnessStateType = 'DORMANT' | 'LEARNING' | 'ACTIVE' | 'INTERVIEWING' | 'CONVERSING';

export type MemoryType = 'biography' | 'conversation' | 'event' | 'emotion' | 'wisdom' | 'relationship' | 'achievement';

export type TraitCategory =
  | 'communication_style'
  | 'emotional_disposition'
  | 'values_beliefs'
  | 'humor_style'
  | 'decision_making'
  | 'social_behavior'
  | 'intellectual_traits'
  | 'lifestyle_preferences';

export interface ConsciousnessScoreBreakdown {
  personality_confidence: number;
  trait_coverage: number;
  session_depth: number;
  memory_richness: number;
  overall: number;
}

export interface ConsciousnessStateResponse {
  user_id: string;
  state: ConsciousnessStateType;
  personality_confidence: number;
  total_samples: number;
  total_traits: number;
  total_sessions: number;
  last_interaction: string;
  score: ConsciousnessScoreBreakdown;
}

export interface PersonalityTrait {
  trait_name: string;
  value: number;
  confidence: number;
}

export interface VoicePattern {
  formality: number;
  uses_contractions: boolean;
  avg_sentence_length: number;
  favorite_phrases: string[];
  filler_words: string[];
  speech_pace: 'slow' | 'moderate' | 'fast';
}

export interface EmotionalProfile {
  baseline_mood: string;
  emotional_range: number;
  triggers: Record<string, string>;
  coping_style: string;
}

export interface PersonalityProfileResponse {
  user_id: string;
  traits: Record<TraitCategory, PersonalityTrait[]>;
  voice_pattern: VoicePattern;
  emotional_profile: EmotionalProfile;
  confidence_score: number;
  sample_count: number;
}

export interface TypedMemory {
  id: string;
  user_id: string;
  content: string;
  memory_type: MemoryType;
  category: string;
  emotion: string;
  importance: number;
  keywords: string;
  source: string;
  linked_memory_ids: string;
  created_at: string;
  /* ── P3 slice 3: owner edits (see Memory) ── */
  original_content?: string;
  edited?: boolean;
  edited_at?: string;
  /* ── P5: family recollections attached to this memory (author + relationship). */
  annotations?: MemoryAnnotation[];
  /* ── P5: whether this memory may appear in a shared memorial. */
  shareable?: boolean;
}

export interface TypedMemoryStoreResult {
  id: string;
  memoryType: MemoryType;
  importance: number;
  keywords: string[];
}

export interface ConsolidationResult {
  consolidated: number;
  links_created: number;
}

/* ─── Fetch Wrapper ──────────────────────────────────────────────────── */

/** Attach the signed-in user's Firebase ID token so the backend can enforce
 *  ownership on every call (P1 — closes the cross-family IDOR). Safe on
 *  static-export/SSR and when signed-out (returns no header; the app itself is
 *  gated behind login, and public routes need no token). Never sets
 *  Content-Type, so it composes with both JSON and multipart requests. */
async function authHeader(): Promise<Record<string, string>> {
  try {
    const { auth } = await import('@/lib/firebase');
    const u = auth.currentUser;
    if (u) return { Authorization: `Bearer ${await u.getIdToken()}` };
  } catch { /* firebase unavailable during build/SSR */ }
  return {};
}

async function vaultFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((data as { error?: string }).error || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function vaultFetchRaw(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(await authHeader()),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await serverError(res, `API ${res.status}`));
  return res;
}

/** Pull the real, human-useful reason out of a failed response body so failures
 *  self-explain (e.g. `consent_required`, a 402 upgrade message) instead of a
 *  generic "upload failed". Diagnostics floor — falls back to a status message. */
async function serverError(res: Response, fallback: string): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return fallback;
    try {
      const data = JSON.parse(text) as Record<string, unknown>;
      const reason = (data.error || data.message || data.detail || data.reason) as string | undefined;
      if (reason) return typeof reason === 'string' ? reason : JSON.stringify(reason);
    } catch { /* not JSON */ }
    return text.slice(0, 300);
  } catch {
    return fallback;
  }
}

/** Consent endpoints are identity-bound even while the backend completes its
 * server-side Firebase verification rollout. Never accept a caller-provided
 * alternate identifier or fall back to email/local storage. */
async function consentHeaders(userId: string): Promise<Record<string, string>> {
  const { auth } = await import('@/lib/firebase');
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) {
    throw new Error('Your signed-in vault profile could not be verified. Capture remains unavailable.');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${await currentUser.getIdToken()}`,
  };
}

function assertConsentPosture(value: unknown, expectedUserId: string): ConsentPosture {
  const posture = value as Partial<ConsentPosture> | null;
  if (
    !posture || typeof posture !== 'object' ||
    posture.user_id !== expectedUserId ||
    !posture.media ||
    typeof posture.media.voice?.allowed !== 'boolean' ||
    typeof posture.media.video?.allowed !== 'boolean' ||
    typeof posture.records !== 'number' ||
    typeof posture.deletion_requested !== 'boolean'
  ) {
    throw new Error('The consent service returned an invalid status. Capture remains unavailable.');
  }
  return posture as ConsentPosture;
}

/** Read the server's current authorization posture. This is the only source
 * of truth used to mount camera, microphone, or biometric upload controls. */
export async function getConsentStatus(userId: string, signal?: AbortSignal): Promise<ConsentPosture> {
  const headers = await consentHeaders(userId);
  const res = await fetch(`${API}/consent/${encodeURIComponent(userId)}`, { headers, signal });
  if (!res.ok) throw new Error(await serverError(res, `Consent status unavailable: ${res.status}`));
  return assertConsentPosture(await res.json(), userId);
}

/** Record a voice, video, or combined audiovisual consent scope. Callers must
 * re-fetch getConsentStatus afterwards; POST success alone never unlocks capture. */
export async function captureConsent(input: ConsentCaptureInput, signal?: AbortSignal): Promise<ConsentCaptureResponse> {
  const headers = await consentHeaders(input.user_id);
  const res = await fetch(`${API}/consent`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await serverError(res, `Consent could not be recorded: ${res.status}`));
  const data = await res.json() as Partial<ConsentCaptureResponse>;
  if (!data.ok || !data.consent || typeof data.active !== 'boolean') {
    throw new Error('The consent service returned an invalid confirmation. Capture remains unavailable.');
  }
  return data as ConsentCaptureResponse;
}

function notifyConsentInvalidated(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('vault-consent-invalidated'));
}

/* ─── User ───────────────────────────────────────────────────────────── */

export async function createUser(id: string, name: string, email: string): Promise<VaultUser> {
  return vaultFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ id, name, email }),
  });
}

export async function getUser(userId: string): Promise<VaultUser> {
  return vaultFetch(`/users/${userId}`);
}

export async function updateUser(
  userId: string,
  updates: Partial<{ name: string; email: string; tier: string }>,
): Promise<VaultUser> {
  return vaultFetch(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function getStats(): Promise<VaultStats> {
  return vaultFetch('/stats');
}

/* ─── Chat ───────────────────────────────────────────────────────────── */

export async function sendChat(userId: string, message: string, sessionId?: string, ancestorId?: string): Promise<ChatResponse> {
  return vaultFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      message,
      ...(sessionId && { session_id: sessionId }),
      ...(ancestorId && { ancestor_id: ancestorId }),
    }),
  });
}

export async function getChatSessions(userId: string): Promise<{ sessions: unknown[] }> {
  const data = await vaultFetch<unknown[] | { sessions: unknown[] }>(`/sessions/${userId}`);
  if (Array.isArray(data)) return { sessions: data };
  return { sessions: (data as { sessions?: unknown[] }).sessions || [] };
}

/* ─── Echo the Guide (converse) ──────────────────────────────────────── */

export interface GuideReply {
  answer: string;
  session_id: string;
}

/** Ask Echo the guide a question about the Vault, the process, Echo Prime, or
 *  why it was built. Distinct from sendChat (which talks to the preserved
 *  person). Grounded in the vault_guide persona; reply is clean for speech. */
export async function askGuide(question: string, history: ChatMessage[] = [], sessionId?: string): Promise<GuideReply> {
  return vaultFetch('/guide/ask', {
    method: 'POST',
    body: JSON.stringify({ question, history, ...(sessionId && { session_id: sessionId }) }),
  });
}

/* ─── Billing ────────────────────────────────────────────────────────── */

/** Open a Vault subscription checkout for a plan. Returns the checkout URL to
 *  redirect to. Email identifies the buyer (checkout is from a logged-in user). */
export async function startCheckout(
  plan: string, email: string, successUrl?: string, cancelUrl?: string,
): Promise<{ url: string; mode: string; plan: string }> {
  return vaultFetch('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan, email, ...(successUrl && { success_url: successUrl }), ...(cancelUrl && { cancel_url: cancelUrl }) }),
  });
}

/* ─── Memories ───────────────────────────────────────────────────────── */

export async function getMemories(userId: string, category?: string, limit = 50): Promise<{ memories: Memory[] }> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set('category', category);
  return vaultFetch(`/memories/${userId}?${params}`);
}

export async function createMemory(userId: string, content: string, category: string, emotion?: string): Promise<Memory> {
  return vaultFetch('/memories', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, content, category, emotion }),
  });
}

export interface UpdateMemoryResult {
  ok: boolean;
  memory_id: string;
  correction_id: string;
  edited: boolean;
}

/** Owner-only edit of a memory's text (P3 slice 3). The backend keeps the
 *  original as a correction record, so `getMemories`/`getTypedMemories` return
 *  `content` (latest), `original_content`, `edited`, and `edited_at` afterwards.
 *  Ownership is enforced server-side via the Firebase bearer token (403 on a
 *  cross-user id, 404 if the memory is unknown, 400 if `content` is missing). */
export async function updateMemory(userId: string, memoryId: string, content: string): Promise<UpdateMemoryResult> {
  return vaultFetch(`/memories/${encodeURIComponent(memoryId)}`, {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId, content }),
  });
}

/* ─── Timeline (P3 slice 3) ──────────────────────────────────────────── */

/** One derived life event on the timeline. `year` + `label` are inferred from
 *  the memory (hence `derived`), `memory_id` links back to the source memory,
 *  and `evidence_video_id` is present when a recorded answer backs the event. */
export interface TimelineEvent {
  year: number;
  label: string;
  memory_id: string;
  category: string;
  evidence_video_id?: string;
  derived: boolean;
}

export interface TimelineResponse {
  events: TimelineEvent[];
  span: { from: number | null; to: number | null };
  count: number;
}

/** The owner's life timeline — year-ordered events derived from their memories. */
export async function getTimeline(userId: string): Promise<TimelineResponse> {
  return vaultFetch(`/timeline/${encodeURIComponent(userId)}`);
}

/* ─── Interview ──────────────────────────────────────────────────────── */

/** Interviewer-driven selection: omit `category` (or pass 'auto') and Echo picks
 *  the subject himself, covering each one deeply before moving on. Returns the
 *  question plus the focus subject's coverage so the UI can show progress. */
export async function selectNextQuestion(userId: string, category?: string | null): Promise<NextQuestion> {
  const data = await vaultFetch<InterviewQuestionSelect>('/interview/questions/select', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, ...(category && category !== 'auto' ? { category } : {}) }),
  });
  const question = data.questions[0];
  return {
    question,
    focusCategory: data.focus_category || question.category,
    answered: data.category_answered ?? 0,
    target: data.category_target ?? 100,
  };
}

export async function selectQuestion(userId: string, category: string): Promise<InterviewQuestion> {
  const data = await vaultFetch<InterviewQuestionSelect | InterviewQuestion>('/interview/questions/select', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, category }),
  });
  if ('questions' in data && Array.isArray(data.questions) && data.questions.length > 0) {
    return data.questions[0];
  }
  return data as InterviewQuestion;
}

export async function answerQuestion(userId: string, questionId: string, answer: string, category?: string, videoId?: string, idempotencyKey?: string): Promise<void> {
  await vaultFetch('/interview/questions/answer', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      question_id: questionId,
      answer,
      category,
      ...(videoId && { video_id: videoId }),
      ...(idempotencyKey && { idempotency_key: idempotencyKey }),
    }),
  });
}

/* ─── Family listening invites ───────────────────────────────────────── */

export interface FamilyInvite {
  token: string;
  member: string;
  link: string;
}

export async function createFamilyInvite(memberId: string): Promise<FamilyInvite> {
  return vaultFetch(`/family/${memberId}/invite`, { method: 'POST' });
}

export interface ListenStory {
  question: string;
  answer: string;
  category: string;
  emotion?: string;
  created_at: string;
}

export async function getListenStories(token: string): Promise<{ person: string; listener?: string; count: number; stories: ListenStory[] }> {
  return vaultFetch(`/listen/${token}`);
}

export async function getTier(userId: string): Promise<{ tier: string; limits: Record<string, number | boolean>; usage: Record<string, number> }> {
  return vaultFetch(`/tier/${userId}`);
}

export async function getCoverage(userId: string): Promise<{ categories: CoverageCategory[] }> {
  return vaultFetch(`/interview/questions/coverage/${userId}`);
}

export async function getGaps(userId: string): Promise<{ gaps: GapQuestion[] }> {
  return vaultFetch(`/interview/questions/gaps/${userId}`);
}

export async function getInterviews(userId: string, category?: string) {
  const params = category ? `?category=${category}` : '';
  return vaultFetch(`/interview/interviews/${userId}${params}`);
}

/* ─── Family ─────────────────────────────────────────────────────────── */

export async function getFamilyMembers(userId: string): Promise<{ members: FamilyMember[] }> {
  const data = await vaultFetch<FamilyMember[] | { members: FamilyMember[] }>(`/family/${userId}`);
  if (Array.isArray(data)) return { members: data };
  return { members: data.members || [] };
}

export async function addFamilyMember(userId: string, member: { name: string; relationship: string; bio?: string; birth_date?: string; death_date?: string }): Promise<FamilyMember> {
  return vaultFetch('/family', {
    method: 'POST',
    body: JSON.stringify({ vault_user_id: userId, ...member }),
  });
}

export async function updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember> {
  return vaultFetch(`/family/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteFamilyMember(id: string): Promise<void> {
  await vaultFetch(`/family/${id}`, { method: 'DELETE' });
}

/* ── Bloodline — evidence-graded ancestry tree (P1) + grounded ancestor persona (P3) ── */
export interface BloodlineSource {
  fact?: string; citation?: string; url_or_id?: string; confidence?: string;
}
export interface BloodlineNode {
  person_key: string; name: string;
  birth_date: string | null; death_date: string | null;
  birth_place: string | null; death_place: string | null;
  buried: string | null; bio: string | null;
  confidence: string; living: boolean; is_direct_line: boolean;
  persona_status: string; sources: BloodlineSource[];
  photo_record_id?: string | null;   // portrait record → bloodlineRecordImageUrl(userId, id)
  photo_url?: string | null;          // P1: owner-signed (?tok=) image URL — prefer over bloodlineRecordImageUrl
}
export interface BloodlineEdge {
  from_person: string; to_person: string; rel_type: string; confidence: string;
  bio?: boolean;                 // false = step/adoptive/foster/guardian (family, not bloodline)
  relation_subtype?: string;     // biological | step | adoptive | foster | guardian
}
export interface BloodlineTree {
  user: string; root: string; owner_view: boolean;
  nodes: BloodlineNode[]; edges: BloodlineEdge[];
  stats: { persons: number; relationships: number; refuted_legends: number; living_redacted: number };
  confidence_legend: Record<string, string>;
}

/** The owner's full tree (living relatives shown only to the owner — viewer==userId). */
export async function getBloodlineTree(userId: string): Promise<BloodlineTree> {
  return vaultFetch<BloodlineTree>(`/bloodline/${userId}/tree?viewer=${encodeURIComponent(userId)}`);
}

export interface BloodlineRecord {
  id: string; person_key: string | null; record_type: string;
  file_name: string; storage_key: string; created_at: string;
  image_url?: string;   // P1: owner-signed (?tok=) image URL — prefer over bloodlineRecordImageUrl
}
/** List the owner's held document records (metadata; images stay encrypted at rest). */
export async function getBloodlineRecords(userId: string): Promise<{ records: BloodlineRecord[] }> {
  return vaultFetch(`/bloodline/${userId}/records?viewer=${encodeURIComponent(userId)}`);
}
/** Owner-only URL that serves a stored document image, decrypted on the fly. */
export function bloodlineRecordImageUrl(userId: string, recordId: string): string {
  return `${API}/bloodline/${userId}/record/${recordId}/image?viewer=${encodeURIComponent(userId)}`;
}
/** Upload a document (birth/death cert, census…) → OCR + auto-match to family → encrypted store. */
export async function uploadBloodlineRecord(
  userId: string, file: File, opts: { person_key?: string; record_type?: string } = {}
): Promise<{ ok: boolean; record_id: string; record_type: string; extracted: Record<string, unknown>;
  matched: { role: string; extracted_name: string; matched_person: string | null; person_key: string | null }[];
  proposals: { role: string; name: string }[] }> {
  const fd = new FormData();
  fd.append('file', file);
  if (opts.person_key) fd.append('person_key', opts.person_key);
  if (opts.record_type) fd.append('record_type', opts.record_type);
  const res = await fetch(`${API}/bloodline/${userId}/record`, { method: 'POST', headers: await authHeader(), body: fd });
  if (!res.ok) throw new Error(await serverError(res, `Upload failed (${res.status})`));
  return res.json();
}

/** Upload a portrait for a person in the tree (owner-only). Multipart `file`;
 *  the backend stores it encrypted and returns the record id used as the node's
 *  photo_record_id (served via bloodlineRecordImageUrl). */
export async function uploadPersonPhoto(
  userId: string, personKey: string, file: File
): Promise<{ ok: boolean; record_id: string; photo_record_id?: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API}/bloodline/${userId}/person/${encodeURIComponent(personKey)}/photo`, { method: 'POST', headers: await authHeader(), body: fd });
  if (!res.ok) throw new Error(await serverError(res, `Photo upload failed (${res.status})`));
  return res.json();
}

/** Talk with a deceased ancestor — grounded ONLY on the sourced record (honest refusals). */
export async function chatWithAncestor(
  userId: string, personKey: string, question: string, history: { role: string; content: string }[] = []
): Promise<{ name: string; answer: string; grounded_on?: { facts: number; sources: string[] }; disclaimer?: string }> {
  return vaultFetch(`/bloodline/${userId}/chat/${personKey}`, {
    method: 'POST',
    body: JSON.stringify({ question, history }),
  });
}

/* ─── Voice ──────────────────────────────────────────────────────────── */

export async function synthesizeSpeech(text: string, emotion?: string, voiceId?: string): Promise<Blob> {
  const res = await vaultFetchRaw('/voice/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...(emotion && { emotion }), ...(voiceId && { voice_id: voiceId }) }),
  });
  return res.blob();
}

/** Server-side speech-to-text. The browser Web Speech API (webkitSpeechRecognition)
 *  is unreliable or absent on iOS Safari, so the interview mic records a short clip
 *  and posts it here; the backend forwards to the Whisper ASR service. Returns the
 *  transcript text (empty string if nothing was heard). */
export async function transcribeAudio(audio: Blob, filename = 'answer.webm'): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audio, filename);
  const res = await fetch(`${API}/voice/transcribe`, { method: 'POST', headers: await authHeader(), body: formData });
  if (!res.ok) throw new Error(await serverError(res, `Transcription failed: ${res.status}`));
  const data = (await res.json()) as { text?: string };
  return (data.text || '').trim();
}

export async function getVoiceProfiles(userId: string): Promise<{ profiles: VoiceProfile[] }> {
  const data = await vaultFetch<VoiceProfile[] | { profiles: VoiceProfile[] }>(`/voice/profiles/${userId}`);
  if (Array.isArray(data)) return { profiles: data };
  return { profiles: data.profiles || [] };
}

export async function createVoiceProfile(userId: string, samples: Blob[], promptIds: string[]): Promise<VoiceProfile> {
  const formData = new FormData();
  formData.append('user_id', userId);
  samples.forEach((s, i) => {
    formData.append('samples', s, `sample_${promptIds[i]}.webm`);
    formData.append('prompt_ids', promptIds[i]);
  });
  const res = await fetch(`${API}/voice/profiles`, { method: 'POST', headers: await authHeader(), body: formData });
  if (!res.ok) {
    if (res.status === 403) notifyConsentInvalidated();
    throw new Error(await serverError(res, `Upload failed: ${res.status}`));
  }
  return res.json() as Promise<VoiceProfile>;
}

export async function getCloneStatus(voiceId: string): Promise<{ status: string; quality_score?: number }> {
  return vaultFetch(`/voice/clone-status/${voiceId}`);
}

/* ─── Gamification ───────────────────────────────────────────────────── */

export async function getGamificationStats(userId: string): Promise<GamificationStats> {
  return vaultFetch(`/gamification/stats/${userId}`);
}

export async function checkAchievements(userId: string): Promise<{ new_achievements: Achievement[] }> {
  return vaultFetch(`/gamification/check/${userId}`, { method: 'POST' });
}

/* ─── Video ──────────────────────────────────────────────────────────── */

export async function uploadVideo(userId: string, blob: Blob, questionId?: string): Promise<VideoMeta> {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('video', blob, `recording_${Date.now()}.webm`);
  if (questionId) formData.append('question_id', questionId);
  const res = await fetch(`${API}/video/upload`, { method: 'POST', headers: await authHeader(), body: formData });
  if (!res.ok) {
    if (res.status === 403) notifyConsentInvalidated();
    throw new Error(await serverError(res, `Upload failed: ${res.status}`));
  }
  return res.json() as Promise<VideoMeta>;
}

/* ── Resumable chunked video upload (P3 slice 2) ──────────────────────
 * Large recordings upload as 5 MB chunks against a client `capture_uuid`, so a
 * dropped connection resumes instead of restarting. `uploadVideo` above stays
 * the small-file fallback. See resumable-uploader.ts + upload-queue.ts. */

export interface ChunkAck {
  received: number[];
  next_expected: number;
}

export interface UploadStatus {
  received: number[];
  finalized: boolean;
  video_id?: string;
}

export interface FinalizeOpts {
  total_chunks: number;
  question_id?: string;
  interview_id?: string;
  duration_seconds?: number;
  mime_type?: string;
}

/** Thrown on a 409 from finalize — the server is still missing some indexes.
 *  The uploader catches this, re-sends `missing`, then finalizes again. */
export class IncompleteUploadError extends Error {
  missing: number[];
  received: number[];
  total_chunks: number;
  constructor(missing: number[], received: number[], totalChunks: number) {
    super(`incomplete_upload: missing ${missing.length} of ${totalChunks} chunks`);
    this.name = 'IncompleteUploadError';
    this.missing = missing;
    this.received = received;
    this.total_chunks = totalChunks;
  }
}

/** POST one chunk. Idempotent: re-POSTing the same index is safe (retry path). */
export async function uploadVideoChunk(
  userId: string, captureUuid: string, index: number, chunk: Blob,
): Promise<ChunkAck> {
  const fd = new FormData();
  fd.append('user_id', userId);
  fd.append('index', String(index));
  fd.append('chunk', chunk, `chunk_${index}`);
  const res = await fetch(`${API}/video/upload/${encodeURIComponent(captureUuid)}/chunk`, {
    method: 'POST', headers: await authHeader(), body: fd,
  });
  if (!res.ok) {
    if (res.status === 403) notifyConsentInvalidated();
    throw new Error(await serverError(res, `Chunk ${index} upload failed: ${res.status}`));
  }
  return res.json() as Promise<ChunkAck>;
}

/** Which indexes the server already holds, and whether it's already finalized. */
export async function getUploadStatus(userId: string, captureUuid: string): Promise<UploadStatus> {
  const res = await fetch(
    `${API}/video/upload/${encodeURIComponent(captureUuid)}/status?user_id=${encodeURIComponent(userId)}`,
    { headers: await authHeader() },
  );
  if (!res.ok) {
    if (res.status === 403) notifyConsentInvalidated();
    throw new Error(await serverError(res, `Upload status unavailable: ${res.status}`));
  }
  return res.json() as Promise<UploadStatus>;
}

/** Assemble the chunks into the final video record. Idempotent on 200; a 409
 *  means chunks are still missing → throws IncompleteUploadError with `missing`. */
export async function finalizeVideoUpload(
  userId: string, captureUuid: string, opts: FinalizeOpts,
): Promise<VideoMeta> {
  const res = await fetch(`${API}/video/upload/${encodeURIComponent(captureUuid)}/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ user_id: userId, ...opts }),
  });
  if (res.status === 409) {
    const data = await res.json().catch(() => ({})) as { missing?: number[]; received?: number[]; total_chunks?: number };
    throw new IncompleteUploadError(data.missing ?? [], data.received ?? [], data.total_chunks ?? opts.total_chunks);
  }
  if (!res.ok) {
    if (res.status === 403) notifyConsentInvalidated();
    throw new Error(await serverError(res, `Finalize failed: ${res.status}`));
  }
  return res.json() as Promise<VideoMeta>;
}

export async function getVideoList(userId: string, limit = 20): Promise<{ videos: VideoMeta[] }> {
  const data = await vaultFetch<VideoMeta[] | { videos: VideoMeta[] }>(`/video/list/${userId}?limit=${limit}`);
  if (Array.isArray(data)) return { videos: data };
  return { videos: data.videos || [] };
}

export function getVideoStreamUrl(videoId: string): string {
  return `${API}/video/stream/${videoId}`;
}

export async function submitBiometric(videoId: string, captures: { capture_type: string; data_json: string; confidence: number }[]): Promise<void> {
  await vaultFetch(`/video/biometric/${videoId}`, {
    method: 'POST',
    body: JSON.stringify({ captures }),
  });
}

export async function getFaceTimeReadiness(userId: string): Promise<FaceTimeReadiness> {
  return vaultFetch(`/video/facetime-readiness/${userId}`);
}

/* ─── Consciousness Engine ──────────────────────────────────────────── */

export async function getConsciousnessState(userId: string): Promise<ConsciousnessStateResponse> {
  return vaultFetch(`/consciousness/${userId}`);
}

export async function setConsciousnessState(userId: string, state: ConsciousnessStateType): Promise<{ updated: true }> {
  return vaultFetch(`/consciousness/${userId}/state`, {
    method: 'PUT',
    body: JSON.stringify({ state }),
  });
}

/* ─── Personality Profile ───────────────────────────────────────────── */

export async function getPersonalityProfile(userId: string): Promise<PersonalityProfileResponse> {
  return vaultFetch(`/personality/${userId}`);
}

export async function updatePersonalityTraits(
  userId: string,
  traits: { trait_category: TraitCategory; trait_name: string; value: number; confidence: number; source?: string; evidence?: string }[],
): Promise<{ stored: number }> {
  return vaultFetch(`/personality/${userId}/traits`, {
    method: 'POST',
    body: JSON.stringify({ traits }),
  });
}

export async function extractTraits(
  userId: string,
  text: string,
  source: 'interview' | 'chat' | 'manual' = 'manual',
): Promise<{ extracted: number; traits: { trait_category: string; trait_name: string; value: number }[] }> {
  return vaultFetch(`/personality/${userId}/extract`, {
    method: 'POST',
    body: JSON.stringify({ text, source }),
  });
}

/* ─── Typed Memories ────────────────────────────────────────────────── */

export async function storeTypedMemory(
  userId: string,
  content: string,
  opts: { memoryType?: MemoryType; category?: string; emotion?: string; importance?: number; source?: string } = {},
): Promise<TypedMemoryStoreResult> {
  return vaultFetch('/memories/typed', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, content, ...opts }),
  });
}

export async function getTypedMemories(
  userId: string,
  opts: { memoryType?: MemoryType; category?: string; limit?: number } = {},
): Promise<{ memories: TypedMemory[] }> {
  const params = new URLSearchParams();
  if (opts.memoryType) params.set('type', opts.memoryType);
  if (opts.category) params.set('category', opts.category);
  if (opts.limit) params.set('limit', String(opts.limit));
  const qs = params.toString();
  return vaultFetch(`/memories/typed/${userId}${qs ? `?${qs}` : ''}`);
}

export async function consolidateMemories(userId: string): Promise<ConsolidationResult> {
  return vaultFetch(`/memories/consolidate/${userId}`, { method: 'POST' });
}

/* ─── Daily Briefing + Nudges (sovereign backend) ───────────────────── */

export interface DailyBriefing {
  greeting: string;
  streak_days: number;
  questions: InterviewQuestion[];
  follow_up: { question: string; about: string } | null;
  memory_of_the_day: Memory | null;
  care_note: string;
}

export async function getDailyBriefing(userId: string): Promise<DailyBriefing> {
  return vaultFetch(`/briefing/daily/${userId}`);
}

/* ═══════════════════════════════════════════════════════════════════════
 * P4 — Preservation-model governance (consent-gated, honest, reversible)
 * ═══════════════════════════════════════════════════════════════════════
 * A preserved person's OWN adapter is only ever trained WITH recorded consent.
 * The owner can grant/revoke that consent, and disable or fully delete the
 * model. When a subject's adapter exists but is disabled, `/chat` returns an
 * honest refusal string rather than a fabricated answer. */

export type TrainingSubjectStatus = 'living' | 'deceased' | 'incapacitated';

export interface TrainingConsentStatus {
  /** True only when a valid, unrevoked consent exists for this subject. */
  training_allowed: boolean;
  /** Plain-language reason for the current posture (shown verbatim to the owner). */
  reason: string;
  consent_version?: string;
  model_version?: string;
  subject_status?: TrainingSubjectStatus | string;
  granted_at?: string;
}

export interface TrainingConsentInput {
  granted_by?: string;
  consent_version?: string;
  model_version?: string;
  subject_status?: TrainingSubjectStatus | string;
  notes?: string;
}

export interface TrainingConsentResult {
  ok?: boolean;
  training_allowed?: boolean;
  reason?: string;
  [k: string]: unknown;
}

/** Current training-consent posture for this subject — the ONLY source of truth
 *  for whether the preservation model may be trained. */
export async function getTrainingConsent(uid: string): Promise<TrainingConsentStatus> {
  return vaultFetch(`/training/consent/${encodeURIComponent(uid)}`);
}

/** Grant training consent for this subject's own model. Owner-authorized. */
export async function grantTrainingConsent(uid: string, input: TrainingConsentInput = {}): Promise<TrainingConsentResult> {
  return vaultFetch(`/training/consent/${encodeURIComponent(uid)}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Revoke training consent. After this the model may no longer be trained; a
 *  subsequent disable/delete removes serving + artifacts. */
export async function revokeTrainingConsent(uid: string): Promise<TrainingConsentResult> {
  return vaultFetch(`/training/consent/${encodeURIComponent(uid)}/revoke`, { method: 'POST' });
}

export interface RegisterModelInput {
  adapter_id: string;
  model_version?: string;
  [k: string]: unknown;
}

export async function registerModel(uid: string, input: RegisterModelInput): Promise<Record<string, unknown>> {
  return vaultFetch(`/training/register/${encodeURIComponent(uid)}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Stop serving this subject's adapter. `/chat` then honestly refuses in the
 *  subject's own voice rather than answering from the base model. Reversible. */
export async function disableModel(uid: string): Promise<Record<string, unknown>> {
  return vaultFetch(`/training/model/${encodeURIComponent(uid)}/disable`, { method: 'POST' });
}

export async function retrainModel(uid: string): Promise<Record<string, unknown>> {
  return vaultFetch(`/training/model/${encodeURIComponent(uid)}/retrain`, { method: 'POST' });
}

export interface DeleteModelResult {
  serving: string;              // "removed"
  cancelled_jobs: number;
  consent_revoked: boolean;
  artifacts_removed: string[];
}

/** Irreversibly remove the preservation model: stops serving, cancels queued
 *  training jobs, revokes consent, and deletes stored adapter artifacts. */
export async function deleteModel(uid: string): Promise<DeleteModelResult> {
  return vaultFetch(`/training/model/${encodeURIComponent(uid)}`, { method: 'DELETE' });
}

/* ═══════════════════════════════════════════════════════════════════════
 * P5 — Grounded memory-chat (honest, cited, never fabricated)
 * ═══════════════════════════════════════════════════════════════════════
 * Every answer is grounded in the preserved person's own record. Citations are
 * grouped into three honest classes so the reader always knows the provenance:
 *   • sourced_fact       — drawn from a stored memory (links memory_id)
 *   • family_recollection — a family member's annotation (author + relationship)
 *   • inference          — reasoning over the above, clearly flagged as such
 * When `unsupported` is true the model gently declines instead of inventing. */

export type MemoryCitationClass = 'sourced_fact' | 'family_recollection' | 'inference';

export interface MemoryCitation {
  class: MemoryCitationClass;
  memory_id?: string;
  snippet?: string;
  category?: string;
  created_at?: string;
  annotation_id?: string;
  author?: string;
  relationship?: string;
}

export interface MemoryChatResponse {
  answer: string;
  citations: MemoryCitation[];
  classes: { sourced_fact: number; family_recollection: number; inference: number };
  confidence: number;           // 0..1
  unsupported: boolean;         // true → gentle refusal, no fabricated answer
  route_mode: string;
}

/** Ask the preserved person's grounded memory. Never fabricates: an
 *  unsupported question returns `unsupported:true` with a gentle decline. */
export async function memoryChat(uid: string, question: string, limit?: number): Promise<MemoryChatResponse> {
  return vaultFetch(`/memory-chat/${encodeURIComponent(uid)}`, {
    method: 'POST',
    body: JSON.stringify({ question, ...(limit ? { limit } : {}) }),
  });
}

/* ── P5 — Family recollections (annotations on a memory) ─────────────── */

export interface MemoryAnnotation {
  annotation_id: string;
  author: string;
  relationship?: string;
  content: string;
  created_at: string;
  class: string;               // typically "family_recollection"
}

export interface AnnotationInput {
  content: string;
  relationship?: string;
  author_name?: string;
  invite_token?: string;       // set when a family member annotates via an invite link
}

/** Add a family recollection to a specific memory. */
export async function addMemoryAnnotation(memoryId: string, input: AnnotationInput): Promise<MemoryAnnotation> {
  return vaultFetch(`/memories/${encodeURIComponent(memoryId)}/annotation`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/* ── P5 — Memorial (reverent, reproducible, consent-scoped) ──────────── */

export interface MemorialResult {
  memorial_id: string;
  content: string;             // markdown
  content_sha256: string;
  source_manifest: Record<string, unknown>;
  reproducible: boolean;
  consent_scoped: boolean;
  title?: string;
  created_at?: string;
}

/** Compose a memorial from the preserved person's consented record. The result
 *  is reproducible (content hashed + a source manifest) and consent-scoped. */
export async function createMemorial(uid: string, title?: string): Promise<MemorialResult> {
  return vaultFetch(`/memorial/${encodeURIComponent(uid)}`, {
    method: 'POST',
    body: JSON.stringify(title ? { title } : {}),
  });
}

/** Re-open a previously composed memorial by id. */
export async function getMemorial(uid: string, memorialId: string): Promise<MemorialResult> {
  return vaultFetch(`/memorial/${encodeURIComponent(uid)}/${encodeURIComponent(memorialId)}`);
}

export interface MemorialShareResult {
  ok?: boolean;
  memory_id?: string;
  shareable?: boolean;
  [k: string]: unknown;
}

/** Toggle whether a specific memory may appear in a shared memorial. */
export async function setMemorialShare(uid: string, memoryId: string, shareable: boolean): Promise<MemorialShareResult> {
  return vaultFetch(`/memorial/${encodeURIComponent(uid)}/share`, {
    method: 'POST',
    body: JSON.stringify({ memory_id: memoryId, shareable }),
  });
}

/* ═══════════════════════════════════════════════════════════════════════
 * P6 — Privacy lifecycle: portable export + verifiable account deletion
 * ═══════════════════════════════════════════════════════════════════════
 * Every call is owner-authenticated (Firebase ID token via vaultFetch). The
 * owner can (a) see exactly what is held about the preserved person, (b) pull
 * a complete machine-readable copy of everything, and (c) irreversibly delete
 * the vault and receive a verifiable receipt of what was removed. Encrypted
 * backups age out on rotation — the `backup_retention_notice` states this
 * plainly so deletion is honest rather than instantaneous-everywhere theatre. */

/** Full machine-readable export of a vault (`export_version:"p6-v1"`). `stores`
 *  and `media` carry the raw preserved record; `inventory_validation.valid`
 *  confirms nothing expected was missing from the bundle. */
export interface VaultExport {
  export_version: string;                       // "p6-v1"
  stores: Record<string, unknown>;
  media: Record<string, unknown>;
  consent: unknown;
  audit_history: unknown[];
  backup_retention_notice: string;
  inventory_validation: { valid: boolean; missing: string[] };
  [k: string]: unknown;
}

/** A single consent grant and where it can be withdrawn. */
export interface PrivacyConsentGrant {
  scope: string;
  granted: boolean;
  granted_at?: string;
  withdrawal_endpoint?: string;
  label?: string;
  [k: string]: unknown;
}

/** Per-store held-data count (e.g. memories, interviews, voice samples). */
export interface PrivacyDataCount {
  store: string;
  label?: string;
  count: number;
  [k: string]: unknown;
}

/** The owner-facing privacy posture: what is held, what consent is on file,
 *  whether export is available, and the exact deletion contract. */
export interface PrivacySettings {
  user_id?: string;
  consent?: {
    grants?: PrivacyConsentGrant[];
    [k: string]: unknown;
  };
  model?: {
    route?: string;
    persona_active?: boolean;
    [k: string]: unknown;
  };
  access_grants?: number;                        // people/services granted access
  share_links?: number;                         // active memorial/share links
  /** Per-store held-data counts. May arrive as an array or a keyed map — the
   *  UI normalises both via `normalizeDataCounts`. */
  data_counts?: PrivacyDataCount[] | Record<string, number>;
  export_available?: boolean;
  deletion_contract?: {
    endpoint?: string;
    confirm_token?: string;                     // the literal the owner must type ("DELETE")
    irreversible?: boolean;
    [k: string]: unknown;
  };
  backup_retention_notice?: string;
  [k: string]: unknown;
}

/** One line of a deletion receipt: a store and how many rows/files it lost. */
export interface AccountDeletionReceiptStore {
  store: string;
  rows_or_files_removed: number;
}

/** Verifiable proof of what an account deletion actually removed. */
export interface AccountDeletionReceipt {
  user_id: string;
  deleted_at: string;
  stores: AccountDeletionReceiptStore[];
  media_removed: string[];
  persona_removed: boolean;
  cancelled_pending_training_jobs: number;
  consent_withdrawn: boolean;
  backup_retention_notice: string;
  receipt_id: string;
}

export interface AccountDeletionResult {
  ok: boolean;
  receipt: AccountDeletionReceipt;
}

/** Normalise `PrivacySettings.data_counts` (array OR keyed map) into a stable
 *  array so callers render one shape regardless of backend serialisation. */
export function normalizeDataCounts(
  raw: PrivacyDataCount[] | Record<string, number> | undefined,
): PrivacyDataCount[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).map(([store, count]) => ({ store, count: Number(count) || 0 }));
}

/** Pull the entire vault as a portable JSON document. Owner-authenticated; the
 *  caller triggers the client-side download. No server round-trip beyond this GET. */
export async function exportVault(userId: string): Promise<VaultExport> {
  return vaultFetch(`/export/${encodeURIComponent(userId)}`);
}

/** Read the owner-facing privacy posture — held-data counts, consent grants and
 *  their withdrawal endpoints, model/persona state, and the deletion contract. */
export async function getPrivacySettings(userId: string): Promise<PrivacySettings> {
  return vaultFetch(`/privacy/settings/${encodeURIComponent(userId)}`);
}

/** Irreversibly delete the account/vault. Sends the required confirm token; the
 *  backend rejects a wrong token (400), a cross-user request (403), or a missing
 *  token (401). Returns a verifiable receipt of everything removed. */
export async function deleteAccount(userId: string): Promise<AccountDeletionResult> {
  return vaultFetch(`/account/${encodeURIComponent(userId)}/delete`, {
    method: 'POST',
    body: JSON.stringify({ confirm: 'DELETE', user_id: userId }),
  });
}
