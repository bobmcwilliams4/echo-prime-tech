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

export async function getChatSessions(userId: string) {
  return vaultFetch(`/sessions/${userId}`);
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

export async function answerQuestion(userId: string, questionId: string, answer: string, category: string): Promise<void> {
  await vaultFetch('/interview/questions/answer', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, question_id: questionId, answer, category }),
  });
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

/* ─── Voice ──────────────────────────────────────────────────────────── */

export async function synthesizeSpeech(text: string, emotion?: string, voiceId?: string): Promise<Blob> {
  const res = await vaultFetchRaw('/voice/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...(emotion && { emotion }), ...(voiceId && { voice_id: voiceId }) }),
  });
  return res.blob();
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
