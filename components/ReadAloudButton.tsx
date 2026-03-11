'use client';

import { useTTS } from '../lib/use-tts';

interface ReadAloudButtonProps {
  getText: () => string;
  voice?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function ReadAloudButton({
  getText,
  voice = 'echo',
  label = 'Read Aloud',
  className = '',
  size = 'sm',
}: ReadAloudButtonProps) {
  const { isReading, startReading, stopReading, progress } = useTTS({ voice });

  const handleClick = () => {
    if (isReading) {
      stopReading();
    } else {
      const text = getText();
      if (text.trim()) startReading(text);
    }
  };

  const sz = size === 'sm'
    ? 'px-3 py-1.5 text-xs gap-1.5'
    : 'px-4 py-2 text-sm gap-2';

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center rounded-lg font-medium transition-all ${sz} ${className}`}
      style={{
        backgroundColor: isReading ? 'var(--ept-accent)' : 'var(--ept-accent-glow)',
        color: isReading ? '#fff' : 'var(--ept-accent)',
        border: `1px solid ${isReading ? 'var(--ept-accent)' : 'var(--ept-border)'}`,
      }}
      title={isReading ? 'Stop reading' : label}
    >
      {isReading ? (
        <>
          <svg width={size === 'sm' ? 14 : 16} height={size === 'sm' ? 14 : 16} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
          <span>{progress > 0 ? `${progress}%` : 'Playing...'}</span>
        </>
      ) : (
        <>
          <svg width={size === 'sm' ? 14 : 16} height={size === 'sm' ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.2" />
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
