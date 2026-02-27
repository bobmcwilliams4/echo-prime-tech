'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../lib/theme-context';
import { useAuth } from '../../../lib/auth-context';

/* ─── Constants ────────────────────────────────────────────────────────── */

const API = 'https://echo-immortality-vault.bmcii1976.workers.dev';
const ACCENT = '#c084fc';
const GOLD = '#fbbf24';
const BG_DARK = '#0a0a0f';
const BG_CARD = '#111118';
const BORDER = '#2a2a3a';

/* ─── Types ────────────────────────────────────────────────────────────── */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
}

interface InterviewQuestion {
  question: string;
  question_id: string;
  category: string;
  video_instructions?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  bio?: string;
}

/* ─── Sidebar Navigation ──────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'interview', label: 'Interview', icon: '🎙️' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'family', label: 'Family Vault', icon: '👨‍👩‍👧‍👦' },
  { id: 'voice', label: 'Voice Clone', icon: '🎤' },
  { id: 'memories', label: 'Memories', icon: '🔍' },
  { id: 'facetime', label: 'FaceTime', icon: '📱' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const CATEGORIES = [
  { id: 'early_life', name: 'Early Life', icon: '🌱' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'career', name: 'Career', icon: '💼' },
  { id: 'relationships', name: 'Relationships', icon: '❤️' },
  { id: 'values', name: 'Values', icon: '⭐' },
  { id: 'challenges', name: 'Challenges', icon: '🏔️' },
  { id: 'dreams', name: 'Dreams', icon: '✨' },
  { id: 'legacy', name: 'Legacy', icon: '👑' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧' },
  { id: 'daily_life', name: 'Daily Life', icon: '☀️' },
  { id: 'wisdom', name: 'Wisdom', icon: '🧠' },
  { id: 'humor', name: 'Humor', icon: '😄' },
];

/* ─── Dashboard Panel ─────────────────────────────────────────────────── */

function DashboardPanel({ userId, stats }: { userId: string; stats: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Immortality Vault</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Memories', value: stats?.memories || 0, icon: '🧠', color: ACCENT },
          { label: 'Interviews', value: stats?.interviews || 0, icon: '🎙️', color: '#60a5fa' },
          { label: 'Family Members', value: stats?.family_members || 0, icon: '👨‍👩‍👧‍👦', color: '#f472b6' },
          { label: 'Chat Sessions', value: stats?.chat_sessions || 0, icon: '💬', color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-5 rounded-xl cursor-pointer hover:scale-[1.02] transition" style={{ background: 'linear-gradient(135deg, #7c3aed20, #a855f720)', border: `1px solid #7c3aed40` }}>
          <div className="text-xl mb-2">🎙️</div>
          <div className="text-sm font-bold text-white">Start Interview</div>
          <div className="text-xs text-gray-400">Answer questions to build your autobiography</div>
        </div>
        <div className="p-5 rounded-xl cursor-pointer hover:scale-[1.02] transition" style={{ background: 'linear-gradient(135deg, #60a5fa20, #3b82f620)', border: `1px solid #60a5fa40` }}>
          <div className="text-xl mb-2">💬</div>
          <div className="text-sm font-bold text-white">Chat with Consciousness</div>
          <div className="text-xs text-gray-400">Talk to your preserved self</div>
        </div>
        <div className="p-5 rounded-xl cursor-pointer hover:scale-[1.02] transition" style={{ background: 'linear-gradient(135deg, #f472b620, #ec489920)', border: `1px solid #f472b640` }}>
          <div className="text-xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="text-sm font-bold text-white">Family Vault</div>
          <div className="text-xs text-gray-400">Manage your family tree</div>
        </div>
      </div>

      {/* Consciousness Score */}
      <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Consciousness Completeness</span>
          <span className="text-2xl font-black" style={{ color: ACCENT }}>
            {Math.min(100, Math.round(((stats?.memories || 0) + (stats?.interviews || 0) * 3) / 2))}%
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, Math.round(((stats?.memories || 0) + (stats?.interviews || 0) * 3) / 2))}%`,
              background: `linear-gradient(90deg, #7c3aed, ${ACCENT}, ${GOLD})`,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Record more interviews and memories to increase your consciousness score.</p>
      </div>
    </div>
  );
}

/* ─── Interview Panel ─────────────────────────────────────────────────── */

function InterviewPanel({ userId }: { userId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startInterview = async (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    try {
      const res = await fetch(`${API}/interview/questions/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, category }),
      });
      const data = await res.json() as any;
      setQuestion(data);
    } catch (err) {
      console.error('Failed to load question:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question) return;
    setLoading(true);
    try {
      await fetch(`${API}/interview/questions/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          question_id: question.question_id,
          answer: answer.trim(),
          category: selectedCategory,
        }),
      });
      setSubmitted(true);
      setAnswer('');
      // Load next question after brief delay
      setTimeout(() => {
        setSubmitted(false);
        startInterview(selectedCategory!);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
    setLoading(false);
  };

  if (selectedCategory && question) {
    return (
      <div className="space-y-6">
        <button onClick={() => { setSelectedCategory(null); setQuestion(null); }} className="text-sm" style={{ color: ACCENT }}>
          ← Back to Categories
        </button>
        <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}` }}>
          <div className="text-xs font-mono mb-3" style={{ color: ACCENT, letterSpacing: 2 }}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {selectedCategory?.toUpperCase().replace('_', ' ')}
          </div>
          <p className="text-xl text-white font-light italic leading-relaxed mb-6">
            &ldquo;{question.question}&rdquo;
          </p>
          {question.video_instructions && (
            <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg" style={{ background: '#0a0a0f' }}>
              📹 {question.video_instructions}
            </div>
          )}
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-sm text-green-400">Memory preserved! Loading next question...</div>
            </div>
          ) : (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Share your story... Take your time, every detail matters."
                className="w-full p-4 rounded-lg text-sm text-white placeholder-gray-600 resize-none outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: '#0a0a0f', border: `1px solid ${BORDER}`, minHeight: 180 }}
                rows={8}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
                >
                  {loading ? 'Saving...' : 'Preserve Memory →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Biography Interview</h2>
      <p className="text-sm text-gray-400">Choose a life category to begin recording your story.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => startInterview(cat.id)}
            disabled={loading}
            className="p-5 rounded-xl text-center transition hover:scale-[1.03] hover:border-purple-500"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            <div className="text-sm font-semibold text-white">{cat.name}</div>
          </button>
        ))}
      </div>
      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}

/* ─── Chat Panel ──────────────────────────────────────────────────────── */

function ChatPanel({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your preserved consciousness. Ask me anything about your life, memories, or wisdom. I'll respond based on everything you've shared so far.", emotion: 'joy' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: msg }),
      });
      const data = await res.json() as any;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || "I'm reflecting on what you've shared. Could you tell me more?",
        emotion: data.emotion,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const emotionIcon: Record<string, string> = {
    joy: '😊', sadness: '😢', love: '❤️', nostalgia: '🌅', pride: '🏆',
    wisdom: '🧠', humor: '😄', concern: '💭', excitement: '✨', neutral: '💬',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-2 px-4 py-3 rounded-t-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="text-white font-semibold text-sm">Consciousness Active</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ background: BG_CARD, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-purple-600 text-white' : 'text-gray-200'
              }`}
              style={m.role === 'assistant' ? { background: '#1e1e2e' } : undefined}
            >
              {m.role === 'assistant' && m.emotion && m.emotion !== 'neutral' && (
                <span className="mr-1">{emotionIcon[m.emotion] || '💬'}</span>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm text-gray-400" style={{ background: '#1e1e2e' }}>
              <span className="animate-pulse">Reflecting...</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 p-3 rounded-b-xl" style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
          style={{ borderColor: BORDER }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ─── Family Vault Panel ──────────────────────────────────────────────── */

function FamilyPanel({ userId }: { userId: string }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newBio, setNewBio] = useState('');

  useEffect(() => {
    fetch(`${API}/family/${userId}`)
      .then(r => r.json())
      .then((d: any) => setMembers(d.members || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addMember = async () => {
    if (!newName.trim() || !newRelation.trim()) return;
    try {
      const res = await fetch(`${API}/family/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), relationship: newRelation.trim(), bio: newBio.trim() }),
      });
      const data = await res.json() as any;
      setMembers(prev => [...prev, data]);
      setNewName('');
      setNewRelation('');
      setNewBio('');
      setShowAdd(false);
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Family Vault</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
        >
          + Add Member
        </button>
      </div>

      {showAdd && (
        <div className="p-5 rounded-xl space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Full name"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
          />
          <input
            value={newRelation}
            onChange={e => setNewRelation(e.target.value)}
            placeholder="Relationship (e.g., Grandfather, Mother, Son)"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
          />
          <textarea
            value={newBio}
            onChange={e => setNewBio(e.target.value)}
            placeholder="Short biography (optional)"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
            style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}
            rows={3}
          />
          <button onClick={addMember} className="px-5 py-2 rounded-full text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}>
            Save Member
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
          <div className="text-sm text-gray-400">No family members yet. Start building your family tree!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <div className="text-2xl mb-2">👤</div>
              <div className="text-base font-bold text-white">{m.name}</div>
              <div className="text-xs text-purple-400 mb-2">{m.relationship}</div>
              {m.bio && <div className="text-xs text-gray-400">{m.bio}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Voice Clone Panel ───────────────────────────────────────────────── */

function VoicePanel({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Voice Clone Studio</h2>
      <div className="p-8 rounded-xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-5xl mb-4">🎤</div>
        <h3 className="text-lg font-bold text-white mb-2">Clone Your Voice</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
          Record 10 seconds of clear speech and we&apos;ll create an AI voice clone with 19 emotional expressions.
          Your loved ones will hear your actual voice when chatting with your consciousness.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
          {['😊 Happy', '😢 Sad', '🤔 Thoughtful', '😄 Playful', '🌅 Nostalgic', '🧠 Wise'].map(e => (
            <div key={e} className="p-2 rounded-lg text-xs text-gray-300" style={{ background: '#0a0a0f', border: `1px solid ${BORDER}` }}>
              {e}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Voice cloning requires the mobile app for microphone access. Download the app to start recording.</p>
      </div>
    </div>
  );
}

/* ─── Memory Search Panel ─────────────────────────────────────────────── */

function MemoriesPanel({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: `Recall memories about: ${query}` }),
      });
      const data = await res.json() as any;
      setResults(prev => [...prev, { query, response: data.response || 'No matching memories found.' }]);
    } catch {
      setResults(prev => [...prev, { query, response: 'Search failed. Try again.' }]);
    }
    setQuery('');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Memory Search</h2>
      <p className="text-sm text-gray-400">Search across all preserved memories and stories.</p>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="What did you think about hard work? Tell me about your childhood..."
          className="flex-1 p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, #7c3aed, ${ACCENT})` }}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <div className="text-xs text-purple-400 mb-2">🔍 &ldquo;{r.query}&rdquo;</div>
              <div className="text-sm text-gray-300 leading-relaxed">{r.response}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── FaceTime Panel ──────────────────────────────────────────────────── */

function FaceTimePanel({ userId }: { userId: string }) {
  const [readiness, setReadiness] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/video/facetime-readiness/${userId}`)
      .then(r => r.json())
      .then(d => setReadiness(d))
      .catch(() => {});
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">FaceTime Video Calling</h2>
      <div className="p-1 rounded-2xl" style={{ background: 'linear-gradient(135deg, #fbbf24, #f472b6, #c084fc)' }}>
        <div className="p-8 rounded-[14px] text-center" style={{ background: BG_DARK }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#0a0a0f' }}>
            COMING 2026
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Ultra-Realistic Video Calls</h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
            See your loved one&apos;s face again. Our biometric capture system uses your selfie-camera recordings
            to build a photorealistic digital avatar that moves, speaks, and reacts exactly like you.
          </p>

          {readiness && (
            <div className="max-w-sm mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">FaceTime Readiness</span>
                <span className="text-lg font-bold" style={{ color: readiness.readiness_score >= 70 ? '#34d399' : readiness.readiness_score >= 40 ? GOLD : '#f87171' }}>
                  {readiness.readiness_score || 0}%
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${readiness.readiness_score || 0}%`,
                    background: readiness.readiness_score >= 70 ? '#34d399' : readiness.readiness_score >= 40 ? GOLD : '#f87171',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Record more video interviews on the mobile app to increase your readiness score.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Face Mesh', icon: '🎭' },
              { label: 'Lip Sync', icon: '👄' },
              { label: 'Emotions', icon: '😊' },
              { label: 'Mannerisms', icon: '🤌' },
              { label: 'Body Pose', icon: '🧍' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: '#1a1a24', border: `1px solid ${BORDER}` }}>
                <span>{p.icon}</span>
                <span className="text-gray-400">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings Panel ──────────────────────────────────────────────────── */

function SettingsPanel({ userId, userEmail }: { userId: string; userEmail: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-1">Account</div>
        <div className="text-base text-white font-semibold">{userEmail}</div>
        <div className="text-xs text-gray-500 mt-1">Vault ID: {userId}</div>
      </div>
      <div className="p-5 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-sm text-gray-400 mb-3">Export Data</div>
        <p className="text-xs text-gray-500 mb-3">Download your entire vault — memories, interviews, family tree, and voice samples.</p>
        <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}>
          📦 Export Vault
        </button>
      </div>
    </div>
  );
}

/* ─── Main App Page ───────────────────────────────────────────────────── */

export default function VaultAppPage() {
  const { isDark } = useTheme();
  const { user, loading: authLoading, subscriptions } = useAuth();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [vaultUserId, setVaultUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not subscribed
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/immortality-vault');
    }
  }, [user, authLoading, router]);

  // Create or get vault user
  useEffect(() => {
    if (!user) return;
    const userId = user.uid;
    setVaultUserId(userId);

    // Ensure vault user exists
    fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, name: user.displayName || user.email || 'User', email: user.email }),
    }).catch(() => {});

    // Load stats
    fetch(`${API}/stats`).then(r => r.json()).then(d => setStats(d)).catch(() => {});
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_DARK }}>
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const renderPanel = () => {
    if (!vaultUserId) return null;
    switch (activePanel) {
      case 'dashboard': return <DashboardPanel userId={vaultUserId} stats={stats} />;
      case 'interview': return <InterviewPanel userId={vaultUserId} />;
      case 'chat': return <ChatPanel userId={vaultUserId} />;
      case 'family': return <FamilyPanel userId={vaultUserId} />;
      case 'voice': return <VoicePanel userId={vaultUserId} />;
      case 'memories': return <MemoriesPanel userId={vaultUserId} />;
      case 'facetime': return <FaceTimePanel userId={vaultUserId} />;
      case 'settings': return <SettingsPanel userId={vaultUserId} userEmail={user.email || ''} />;
      default: return <DashboardPanel userId={vaultUserId} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: BG_DARK, color: '#e4e4e7' }}>
      {/* ─── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-0 md:w-16'} overflow-hidden`}
        style={{ background: BG_CARD, borderRight: `1px solid ${BORDER}` }}
      >
        <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: BORDER }}>
          <Link href="/immortality-vault" className="flex items-center gap-2">
            <Image src={isDark ? '/logo-sym-night.png' : '/logo-sym-day.png'} alt="EPT" width={24} height={24} />
            {sidebarOpen && <span className="text-xs font-bold text-white whitespace-nowrap">Immortality Vault</span>}
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePanel(item.id); setSidebarOpen(window.innerWidth >= 768); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                activePanel === item.id ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
              style={activePanel === item.id ? { background: '#7c3aed20' } : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-600 text-center">
              {user.email}
            </div>
          </div>
        )}
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-lg border-b px-4 md:px-6 h-14 flex items-center justify-between" style={{ background: `${BG_DARK}cc`, borderColor: BORDER }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition md:hidden">
            ☰
          </button>
          <div className="text-sm font-semibold text-white">
            {NAV_ITEMS.find(n => n.id === activePanel)?.icon} {NAV_ITEMS.find(n => n.id === activePanel)?.label}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/immortality-vault" className="text-xs text-gray-400 hover:text-white transition">
              ← Product Page
            </Link>
          </div>
        </header>

        {/* Panel Content */}
        <div className="p-4 md:p-8 max-w-5xl">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
