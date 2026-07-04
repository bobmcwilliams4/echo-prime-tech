'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCENT, BG_CARD, BORDER, CATEGORIES, GOLD } from '../lib/constants';
import { selectQuestion, answerQuestion, extractTraits, synthesizeSpeech, type InterviewQuestion } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';

interface Props {
  userId: string;
}

export default function InterviewPanel({ userId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const spokenFor = useRef<string | null>(null);

  const speakQuestion = useCallback(async (q: InterviewQuestion) => {
    setSpeaking(true);
    try {
      const blob = await synthesizeSpeech(q.question, 'warmth');
      await playAudioBlob(blob);
    } catch { /* voice is a bonus — never block the interview */ }
    setSpeaking(false);
  }, []);

  // Read each new question aloud (free sovereign TTS) — Commander directive
  // 2026-07-03: the interviewer speaks, the user just answers.
  useEffect(() => {
    if (voiceOn && question && spokenFor.current !== question.question_id) {
      spokenFor.current = question.question_id;
      speakQuestion(question);
    }
  }, [question, voiceOn, speakQuestion]);

  const startInterview = async (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    try {
      const q = await selectQuestion(userId, category);
      setQuestion(q);
    } catch (err) {
      console.error('Failed to load question:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question || !selectedCategory) return;
    setLoading(true);
    try {
      await answerQuestion(userId, question.question_id, answer.trim(), selectedCategory);
      // Fire-and-forget: extract personality traits from the answer via AI
      extractTraits(userId, answer.trim(), 'interview').catch(() => {});
      setSubmitted(true);
      setAnswer('');
      setTimeout(() => {
        setSubmitted(false);
        startInterview(selectedCategory);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
    setLoading(false);
  };

  if (selectedCategory && question) {
    const generated = question.question_id.startsWith('gen_');
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedCategory(null); setQuestion(null); }} className="text-sm" style={{ color: ACCENT }}>
            &larr; Back to Categories
          </button>
          <button
            onClick={() => setVoiceOn(v => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ border: `1px solid ${BORDER}`, color: voiceOn ? GOLD : '#71717a' }}
            title="Read questions aloud"
          >
            {voiceOn ? '\u{1F50A} Voice On' : '\u{1F507} Voice Off'}
          </button>
        </div>
        <div className="p-6 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono" style={{ color: ACCENT, letterSpacing: 2 }}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {selectedCategory.toUpperCase().replace('_', ' ')}
            </div>
            {generated && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#1e1033', color: GOLD, border: `1px solid ${BORDER}` }}>
                {'\u{2728}'} written just for you
              </span>
            )}
          </div>
          <p className="text-xl text-white font-light italic leading-relaxed mb-3">
            &ldquo;{question.question}&rdquo;
          </p>
          <button
            onClick={() => question && speakQuestion(question)}
            disabled={speaking}
            className="text-xs mb-4 px-3 py-1.5 rounded-full font-semibold disabled:opacity-40"
            style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
          >
            {speaking ? '\u{1F50A} Speaking...' : '\u{1F50A} Hear it again'}
          </button>
          {question.video_instructions && (
            <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg" style={{ background: '#0a0a0f' }}>
              {'\u{1F4F9}'} {question.video_instructions}
            </div>
          )}
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">{'\u{2705}'}</div>
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
                  {loading ? 'Saving...' : 'Preserve Memory \u{2192}'}
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
      <p className="text-sm text-gray-400">Choose a life category to begin recording your story. The interviewer reads each question aloud — just talk.</p>
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
