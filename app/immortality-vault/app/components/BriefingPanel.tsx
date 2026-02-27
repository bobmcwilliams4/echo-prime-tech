'use client';

import { useState, useEffect, useCallback } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER, BG_DARK } from '../lib/constants';
import { getUser, getFamilyMembers, getMemories, synthesizeSpeech, type VaultUser, type FamilyMember, type Memory } from '../lib/vault-api';
import { playAudioBlob } from '../lib/media';

interface Props {
  userId: string;
  onNavigate: (panel: string) => void;
}

interface BriefingSection {
  id: string;
  icon: string;
  title: string;
  content: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateStr(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const INSPIRING = [
  "Every story you share is a gift to the future. Keep building your legacy.",
  "The memories you preserve today will bring comfort to generations tomorrow.",
  "Your voice, your wisdom, your love \u2014 all being captured for eternity.",
  "You are creating something truly timeless. Keep going.",
  "Each interview brings you closer to digital immortality.",
];

export default function BriefingPanel({ userId, onNavigate }: Props) {
  const [sections, setSections] = useState<BriefingSection[]>([]);
  const [current, setCurrent] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      let name = 'Friend';
      let familyCount = 0;
      let memoryOfDay: Memory | null = null;

      try {
        const user = await getUser(userId);
        name = user.name || user.email?.split('@')[0] || 'Friend';
        setUserName(name);
      } catch { /* empty */ }

      try {
        const fam = await getFamilyMembers(userId);
        familyCount = fam.members.length;
      } catch { /* empty */ }

      try {
        const mems = await getMemories(userId, undefined, 10);
        if (mems.memories?.length > 0) {
          memoryOfDay = mems.memories[Math.floor(Math.random() * mems.memories.length)];
        }
      } catch { /* empty */ }

      const built: BriefingSection[] = [
        {
          id: 'greeting',
          icon: '\u{2600}\u{FE0F}',
          title: `${getGreeting()}, ${name}`,
          content: `Welcome to your Immortality Vault. Today is ${getDateStr()}. Let's make it count.`,
        },
        {
          id: 'family',
          icon: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}',
          title: 'Family Summary',
          content: familyCount > 0
            ? `You have ${familyCount} family member${familyCount !== 1 ? 's' : ''} in your vault. Consider adding more to enrich your legacy.`
            : 'Your family vault is waiting. Adding family members unlocks ancestor chat and enriches your consciousness.',
        },
        {
          id: 'memory',
          icon: '\u{1F4D6}',
          title: 'Memory of the Day',
          content: memoryOfDay
            ? memoryOfDay.content.slice(0, 300) + (memoryOfDay.content.length > 300 ? '...' : '')
            : 'No memories yet. Start an interview or add a memory to see your daily highlight here.',
        },
        {
          id: 'inspiring',
          icon: '\u{2728}',
          title: 'Daily Inspiration',
          content: INSPIRING[Math.floor(Math.random() * INSPIRING.length)],
        },
      ];

      setSections(built);
      setLoading(false);
    };

    load();
  }, [userId]);

  const speakSection = useCallback(async () => {
    if (playing || !sections[current]) return;
    setPlaying(true);
    try {
      const text = `${sections[current].title}. ${sections[current].content}`;
      const blob = await synthesizeSpeech(text, 'warmth');
      await playAudioBlob(blob);
    } catch { /* silent */ }
    setPlaying(false);
  }, [playing, sections, current]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  const section = sections[current];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white mb-1">{getGreeting()}, {userName || 'Friend'}</h2>
        <p className="text-sm text-gray-400">{getDateStr()}</p>
      </div>

      {/* Briefing Card */}
      {section && (
        <div className="p-8 rounded-2xl text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-4xl mb-4">{section.icon}</div>
          <h3 className="text-lg font-bold text-white mb-3">{section.title}</h3>
          <p className="text-base text-gray-300 leading-relaxed max-w-lg mx-auto">{section.content}</p>

          {/* Section dots */}
          <div className="flex justify-center gap-2 mt-6">
            {sections.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition"
                style={{ background: i === current ? ACCENT : '#2a2a3a' }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-30"
              style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
            >
              &larr; Prev
            </button>
            <button
              onClick={speakSection}
              disabled={playing}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-black"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #f59e0b)` }}
            >
              {playing ? '\u{1F50A} Playing...' : '\u{1F50A} Hear This Aloud'}
            </button>
            <button
              onClick={() => setCurrent(Math.min(sections.length - 1, current + 1))}
              disabled={current === sections.length - 1}
              className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-30"
              style={{ border: `1px solid ${BORDER}`, color: '#d4d4d8' }}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { panel: 'memories', icon: '\u{1F4DD}', label: 'View Memories' },
          { panel: 'ancestor', icon: '\u{1F54A}\u{FE0F}', label: 'Talk to Family' },
          { panel: 'interview', icon: '\u{1F399}\u{FE0F}', label: 'Record Stories' },
          { panel: 'chat', icon: '\u{1F4AC}', label: 'Chat with Self' },
        ].map(a => (
          <button
            key={a.panel}
            onClick={() => onNavigate(a.panel)}
            className="p-4 rounded-xl text-center transition hover:scale-[1.02]"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="text-2xl mb-1">{a.icon}</div>
            <div className="text-xs font-semibold text-white">{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
