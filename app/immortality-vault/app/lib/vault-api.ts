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
  content: string;
  category: string;
  emotion?: string;
  importance?: number;
  source?: string;
  created_at: string;
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

async function vaultFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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
  const res = await fetch(`${API}${path}`, options);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res;
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

export async function answerQuestion(userId: string, questionId: string, answer: string, category?: string, videoId?: string): Promise<void> {
  await vaultFetch('/interview/questions/answer', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, question_id: questionId, answer, category, ...(videoId && { video_id: videoId }) }),
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
}
export interface BloodlineEdge {
  from_person: string; to_person: string; rel_type: string; confidence: string;
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
  const res = await fetch(`${API}/bloodline/${userId}/record`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
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
  const res = await fetch(`${API}/voice/transcribe`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
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
  const res = await fetch(`${API}/voice/profiles`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
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
  const res = await fetch(`${API}/video/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
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
