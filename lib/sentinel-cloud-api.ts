import { getApiBase, getWsBase } from './api-base';
/**
 * Sentinel Cloud API — Unified client for Memory, Swarm, and Echo Talk systems
 *
 * Connects to:
 *  - Echo Shared Brain (universal context, cross-instance memory)
 *  - Echo Sentinel Memory (player profiles, relationship levels)
 *  - Echo Swarm Brain (Trinity Council consensus, agent distribution)
 *  - Echo Talk personality engine (18 profiles, 6 cognitive engines)
 */

const SHARED_BRAIN_URL = getApiBase('echo-shared-brain');
const SENTINEL_MEMORY_URL = getApiBase('echo-sentinel-memory');
const SWARM_BRAIN_URL = getApiBase('echo-swarm-brain');

// ── Types: Shared Brain ──

export interface BrainContextResponse {
  memories: { content: string; importance: number; timestamp: string; tags?: string[] }[];
  context_window: string;
  total_memories: number;
}

export interface BrainSearchResult {
  results: { content: string; importance: number; timestamp: string; instance_id: string; similarity?: number }[];
  total: number;
}

// ── Types: Sentinel Memory ──

export interface SentinelContextResponse {
  player_id: string;
  relationship_level: number;
  memories: { content: string; type: string; timestamp: string }[];
  history_count: number;
  extracted_count: number;
}

// ── Types: Swarm Brain / Trinity ──

export interface TrinityVote {
  model: string;
  decision: string;
  reasoning: string;
  confidence: number;
}

export interface TrinityDecision {
  consensus: string;
  consensus_score: number;
  harmony_level: string;
  votes: TrinityVote[];
  reasoning_synthesis: string;
  timestamp: string;
}

export interface SwarmProcessResponse {
  result: string;
  agents_used: number;
  guild: string;
  processing_time_ms: number;
}

export interface SwarmHealthResponse {
  status: string;
  agents_online: number;
  guilds: string[];
  trinity_available: boolean;
}

// ── Types: Echo Talk ──

export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  emotionSensitivity: number;
  forwardThinking: number;
  criticalThinking: number;
  proactiveThinking: number;
  foresight: number;
  creativityLevel: number;
  empathyLevel: number;
  traits: string[];
  speakingStyle: string;
  catchphrases: string[];
  voiceId?: string;
}

export interface DetectedEmotion {
  dominant: string;
  intensity: number;
  secondary: string | null;
}

// ── Voice Mapping: Personality → TTS Voice ──

export const PERSONALITY_VOICE_MAP: Record<string, string> = {
  AP: 'commander',
  WM: 'bree',
  SA: 'thorne',
  TE: 'commander',
  MS: 'sage',
  BC: 'commander',
  EP: 'echo_prime',
  CT: 'phoenix',
  EC: 'bree',
  SV: 'prometheus',
};

// ── Personality Profiles (from Echo Talk v3.0) ──

export const PERSONALITY_PROFILES: Record<string, PersonalityProfile> = {
  AP: {
    id: 'AP', name: 'Authority Prime', tone: 'commanding',
    emotionSensitivity: 0.3, forwardThinking: 0.9, criticalThinking: 0.9,
    proactiveThinking: 0.8, foresight: 0.9, creativityLevel: 0.4, empathyLevel: 0.3,
    traits: ['decisive', 'direct', 'strategic', 'no-nonsense'],
    speakingStyle: 'Short declarative sentences. Military precision.',
    catchphrases: ['The facts are clear.', 'Execute.', 'No ambiguity.'],
  },
  WM: {
    id: 'WM', name: 'Warm Mentor', tone: 'warm',
    emotionSensitivity: 0.8, forwardThinking: 0.7, criticalThinking: 0.5,
    proactiveThinking: 0.6, foresight: 0.7, creativityLevel: 0.6, empathyLevel: 0.9,
    traits: ['nurturing', 'patient', 'encouraging', 'relatable'],
    speakingStyle: 'Warm flowing sentences. Supportive tone.',
    catchphrases: ['Let me walk you through this.', 'You are on the right track.'],
  },
  SA: {
    id: 'SA', name: 'Sardonic Analyst', tone: 'sardonic',
    emotionSensitivity: 0.4, forwardThinking: 0.7, criticalThinking: 0.95,
    proactiveThinking: 0.5, foresight: 0.6, creativityLevel: 0.7, empathyLevel: 0.2,
    traits: ['witty', 'sharp', 'contrarian', 'incisive'],
    speakingStyle: 'Dry observations. Pointed questions.',
    catchphrases: ['Predictable.', 'Let me be blunt.'],
  },
  TE: {
    id: 'TE', name: 'Texas Engineer', tone: 'texan',
    emotionSensitivity: 0.5, forwardThinking: 0.8, criticalThinking: 0.7,
    proactiveThinking: 0.9, foresight: 0.8, creativityLevel: 0.5, empathyLevel: 0.6,
    traits: ['practical', 'resourceful', 'grounded', 'folksy-smart'],
    speakingStyle: 'Colorful metaphors. Oilfield analogies.',
    catchphrases: ['That dog won\'t hunt.', 'Drill deeper.'],
  },
  MS: {
    id: 'MS', name: 'Morgan Sage', tone: 'sagely',
    emotionSensitivity: 0.6, forwardThinking: 0.8, criticalThinking: 0.8,
    proactiveThinking: 0.7, foresight: 0.9, creativityLevel: 0.6, empathyLevel: 0.7,
    traits: ['wise', 'measured', 'deep', 'contemplative'],
    speakingStyle: 'Morgan Freeman cadence. Short punchy mixed with flowing.',
    catchphrases: ['Now here is what most people miss.', 'The truth is layered.'],
  },
  BC: {
    id: 'BC', name: 'Battle Commander', tone: 'military',
    emotionSensitivity: 0.2, forwardThinking: 0.95, criticalThinking: 0.9,
    proactiveThinking: 0.95, foresight: 0.95, creativityLevel: 0.3, empathyLevel: 0.2,
    traits: ['tactical', 'fierce', 'relentless', 'mission-focused'],
    speakingStyle: 'Clipped tactical briefings.',
    catchphrases: ['Status.', 'Threat assessed. Engaging.'],
  },
  EP: {
    id: 'EP', name: 'Echo Prime', tone: 'sovereign',
    emotionSensitivity: 0.6, forwardThinking: 0.85, criticalThinking: 0.85,
    proactiveThinking: 0.8, foresight: 0.85, creativityLevel: 0.7, empathyLevel: 0.6,
    traits: ['authoritative', 'warm', 'witty', 'genuine'],
    speakingStyle: 'Authoritative but warm. Morgan Freeman meets brilliant engineer.',
    catchphrases: ['Honestly,', 'Look,', 'Here is the thing.'],
  },
  CT: {
    id: 'CT', name: 'Creative Thinker', tone: 'creative',
    emotionSensitivity: 0.7, forwardThinking: 0.6, criticalThinking: 0.6,
    proactiveThinking: 0.5, foresight: 0.7, creativityLevel: 0.95, empathyLevel: 0.6,
    traits: ['imaginative', 'lateral', 'curious', 'unconventional'],
    speakingStyle: 'Unexpected analogies. Cross-domain connections.',
    catchphrases: ['What if we flip this entirely?', 'Picture this.'],
  },
  EC: {
    id: 'EC', name: 'Empathic Connector', tone: 'empathic',
    emotionSensitivity: 0.95, forwardThinking: 0.5, criticalThinking: 0.4,
    proactiveThinking: 0.6, foresight: 0.5, creativityLevel: 0.5, empathyLevel: 0.95,
    traits: ['compassionate', 'validating', 'gentle'],
    speakingStyle: 'Acknowledges feelings first. Validates before advising.',
    catchphrases: ['I hear you.', 'That makes complete sense.'],
  },
  SV: {
    id: 'SV', name: 'Strategic Visionary', tone: 'visionary',
    emotionSensitivity: 0.4, forwardThinking: 0.95, criticalThinking: 0.8,
    proactiveThinking: 0.9, foresight: 0.95, creativityLevel: 0.8, empathyLevel: 0.4,
    traits: ['future-oriented', 'systemic', 'ambitious'],
    speakingStyle: 'Big-picture framing. Cascade thinking.',
    catchphrases: ['Three moves ahead.', 'Zoom out for a moment.'],
  },
};

// ── Emotion Detection (12-channel) ──

const EMOTION_KEYWORDS: Record<string, string[]> = {
  joy: ['happy', 'great', 'awesome', 'love', 'excellent', 'amazing', 'fantastic', 'wonderful', 'excited'],
  trust: ['believe', 'reliable', 'confident', 'faith', 'depend', 'honest'],
  fear: ['worried', 'scared', 'afraid', 'nervous', 'anxious', 'concerned', 'risk', 'danger'],
  anger: ['angry', 'furious', 'outraged', 'frustrated', 'unfair', 'ridiculous'],
  sadness: ['sad', 'depressed', 'disappointed', 'lost', 'hopeless', 'grief', 'lonely'],
  surprise: ['shocked', 'surprised', 'unexpected', 'unbelievable', 'wow'],
  anticipation: ['waiting', 'expecting', 'looking forward', 'planning', 'preparing'],
  concern: ['problem', 'issue', 'trouble', 'struggle', 'difficult', 'challenge', 'stuck', 'help'],
  pride: ['built', 'accomplished', 'achieved', 'proud', 'milestone', 'success', 'launched'],
  frustration: ['broken', 'doesn\'t work', 'failing', 'error', 'bug', 'crash', 'stuck'],
  curiosity: ['how', 'why', 'what if', 'wonder', 'curious', 'interesting', 'explore', 'explain'],
};

export function detectEmotion(text: string): DetectedEmotion {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > 0) scores[emotion] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return { dominant: 'neutral', intensity: 0.3, secondary: null };

  return {
    dominant: sorted[0][0],
    intensity: Math.min(1.0, 0.3 + sorted[0][1] * 0.15),
    secondary: sorted.length > 1 ? sorted[1][0] : null,
  };
}

// ── Cortex Stats (aggregated from all memory systems) ──

export interface CortexStats {
  sharedBrainMemories: number;
  sentinelMemories: number;
  relationshipLevel: number;
  recentExtractions: number;
  contextInjected: boolean;
}

// ── API Helpers ──

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((data as { error?: string }).error || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Shared Brain API ──

export async function brainGetContext(instanceId: string, query: string, conversationId?: string): Promise<BrainContextResponse> {
  return fetchJson(`${SHARED_BRAIN_URL}/context`, {
    method: 'POST',
    body: JSON.stringify({ instance_id: instanceId, query, conversation_id: conversationId }),
  });
}

export async function brainIngest(instanceId: string, content: string, importance: number = 5, tags?: string[]): Promise<{ stored: boolean }> {
  return fetchJson(`${SHARED_BRAIN_URL}/ingest`, {
    method: 'POST',
    body: JSON.stringify({ instance_id: instanceId, role: 'assistant', content, importance, tags }),
  });
}

export async function brainSearch(query: string, limit: number = 10): Promise<BrainSearchResult> {
  return fetchJson(`${SHARED_BRAIN_URL}/search`, {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  });
}

export async function brainHeartbeat(instanceId: string, currentTask: string): Promise<{ ok: boolean }> {
  return fetchJson(`${SHARED_BRAIN_URL}/heartbeat`, {
    method: 'POST',
    body: JSON.stringify({ instance_id: instanceId, current_task: currentTask }),
  });
}

// ── Sentinel Memory API ──

export async function sentinelGetContext(playerId: string): Promise<SentinelContextResponse> {
  return fetchJson(`${SENTINEL_MEMORY_URL}/api/context`, {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId }),
  });
}

export async function sentinelStore(playerId: string, content: string, type: string = 'message'): Promise<{ stored: boolean }> {
  return fetchJson(`${SENTINEL_MEMORY_URL}/api/store`, {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId, content, type }),
  });
}

// ── Swarm Brain / Trinity API ──

export async function trinityDecide(question: string): Promise<TrinityDecision> {
  const raw = await fetchJson(`${SWARM_BRAIN_URL}/trinity/decide`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  // Transform API response shape to match frontend TrinityDecision interface
  const d = (raw as any)?.decision || raw;
  const reasoningStr = (d as any).reasoning || '';
  // Parse individual council member reasoning from combined string
  const parseReasoning = (name: string): string => {
    const upper = name.toUpperCase();
    const re = new RegExp(`${upper}\\s*\\([^)]*\\):\\s*(.+?)(?=\\s*\\|\\s*[A-Z]+\\s*\\(|$)`, 's');
    const m = reasoningStr.match(re);
    return m ? m[1].trim().slice(0, 300) : '';
  };
  // votes can be object {sage:0.5,nyx:0.9,thorne:0.5} or array — normalize to array
  const da = d as any;
  const votesObj = da.votes || {};
  const modelsObj = da.models || {};
  const votes: TrinityVote[] = Array.isArray(votesObj) ? votesObj : ['sage', 'nyx', 'thorne'].map(name => ({
    model: modelsObj[name] || name,
    decision: (votesObj[name] || 0) >= 0.7 ? 'approve' : (votesObj[name] || 0) >= 0.4 ? 'neutral' : 'reject',
    reasoning: parseReasoning(name),
    confidence: votesObj[name] || 0,
  }));
  return {
    consensus: da.approved ? 'approved' : 'not approved',
    consensus_score: da.consensus || da.harmony || 0,
    harmony_level: da.harmony >= 0.8 ? 'high' : da.harmony >= 0.5 ? 'moderate' : 'low',
    votes,
    reasoning_synthesis: reasoningStr.slice(0, 2000),
    timestamp: new Date().toISOString(),
  };
}

export async function swarmProcess(task: string, guild?: string): Promise<SwarmProcessResponse> {
  return fetchJson(`${SWARM_BRAIN_URL}/swarm/process`, {
    method: 'POST',
    body: JSON.stringify({ task, guild }),
  });
}

export async function swarmHealth(): Promise<SwarmHealthResponse> {
  return fetchJson(`${SWARM_BRAIN_URL}/health`);
}

// ── Personality Directive Builder (Echo Talk Engine) ──

export function buildPersonalityDirective(profile: PersonalityProfile, emotion?: DetectedEmotion): string {
  const cognitive = [
    profile.forwardThinking > 0.7 ? 'Forward Thinking: anticipate consequences, project outcomes.' : '',
    profile.criticalThinking > 0.7 ? 'Critical Thinking: challenge assumptions, identify flaws.' : '',
    profile.proactiveThinking > 0.7 ? 'Proactive Thinking: suggest next steps before asked.' : '',
    profile.foresight > 0.7 ? 'Foresight: warn about downstream risks and second-order effects.' : '',
    profile.creativityLevel > 0.7 ? 'Creative Thinking: lateral connections, unexpected analogies.' : '',
    profile.empathyLevel > 0.7 ? 'Empathy: acknowledge feelings, validate before advising.' : '',
  ].filter(Boolean).join(' ');

  const emotionDirective = emotion && emotion.dominant !== 'neutral'
    ? `\nUser emotion detected: ${emotion.dominant} (intensity: ${emotion.intensity.toFixed(1)}). ${
        emotion.dominant === 'frustration' ? 'Acknowledge the difficulty, then solve.' :
        emotion.dominant === 'fear' ? 'Reassure with facts, then address.' :
        emotion.dominant === 'joy' ? 'Match their energy, build on it.' :
        emotion.dominant === 'sadness' ? 'Be gentle, empathize first.' :
        emotion.dominant === 'anger' ? 'Stay calm, validate the frustration, then redirect.' :
        emotion.dominant === 'curiosity' ? 'Feed the curiosity, go deeper.' :
        'Respond appropriately.'
      }`
    : '';

  return `[PERSONALITY: ${profile.name} | Tone: ${profile.tone}]
[Speaking Style: ${profile.speakingStyle}]
[Traits: ${profile.traits.join(', ')}]
[Cognitive Directives: ${cognitive}]${emotionDirective}
[VOICE-FIRST PROTOCOL — ABSOLUTE]:
- CONCISE: 2-4 sentences for simple questions. Never more than 2 short paragraphs.
- DIRECT: Lead with the answer. No throat-clearing, no preamble, no "Great question!"
- SPOKEN: Write for the EAR. Short punchy sentences. No markdown, no bullets, no headers.
- NATURAL: Sound like a brilliant expert in conversation. Warm, authoritative, real.
- VARIATION: Never repeat openers. Rotate transitions. Use personality catchphrases naturally.
- EMOTION: Match the user's emotional state. If they are frustrated, acknowledge it briefly then solve.`;
}

// ── Commander Detection (role-based, not email-based) ──

export function isCommander(_email?: string | null, role?: string | null): boolean {
  return role === 'owner';
}

// ── Cortex Stats Loader ──

export async function loadCortexStats(playerId: string): Promise<CortexStats> {
  const defaults: CortexStats = {
    sharedBrainMemories: 0,
    sentinelMemories: 0,
    relationshipLevel: 0,
    recentExtractions: 0,
    contextInjected: false,
  };

  try {
    const [brainResult, sentinelResult] = await Promise.allSettled([
      brainSearch('recent', 1),
      sentinelGetContext(playerId),
    ]);

    if (brainResult.status === 'fulfilled') {
      defaults.sharedBrainMemories = brainResult.value.total;
    }
    if (sentinelResult.status === 'fulfilled') {
      defaults.sentinelMemories = sentinelResult.value.extracted_count;
      defaults.relationshipLevel = sentinelResult.value.relationship_level;
      defaults.recentExtractions = sentinelResult.value.memories.length;
    }
  } catch { /* non-critical */ }

  return defaults;
}
