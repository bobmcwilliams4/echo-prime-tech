'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AIMessage } from '../../lib/builder/types';

interface AskEchoPrimeProps {
  onApplyHtml: (html: string) => void;
  currentHtml?: string;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
};

const AI_WORKER_URL = 'https://echo-website-builder-ai.bmcii1976.workers.dev';

const QUICK_ACTIONS = [
  { label: 'Build from scratch', prompt: 'Build me a complete website from scratch. Ask me what kind of website I need.' },
  { label: 'Redesign this page', prompt: 'Redesign the current page content to look more modern and professional.' },
  { label: 'Add a section', prompt: 'Suggest and add a new section to my current page. What type of section would you recommend?' },
  { label: 'Change colors', prompt: 'Suggest a new color scheme for my website and apply it.' },
];

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function extractHtmlFromResponse(content: string): string | null {
  // 1. Code fences: ```html ... ```
  const codeBlockMatch = content.match(/```html\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  // 2. Full HTML document — return as-is so handleApplyHtml can extract body + CSS
  if (/<!DOCTYPE\s+html/i.test(content) || /<html[\s>]/i.test(content)) {
    return content.trim();
  }
  // 3. HTML fragment with block-level tags
  const htmlTagMatch = content.match(/(<(?:section|div|nav|header|footer|main|article|aside|form|table|ul|ol|h[1-6]|p)\b[\s\S]*>[\s\S]*<\/(?:section|div|nav|header|footer|main|article|aside|form|table|ul|ol|h[1-6]|p)>)/i);
  if (htmlTagMatch) return htmlTagMatch[1].trim();
  return null;
}

export default function AskEchoPrime({ onApplyHtml, currentHtml }: AskEchoPrimeProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'I\'m Echo Prime, your AI website builder. Tell me what you want to build and I\'ll generate the HTML for you. You can describe a full website or ask me to modify what\'s on your canvas.',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: AIMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);

      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() },
      ]);

      try {
        const payload = {
          message: text.trim(),
          session_id: sessionId,
          current_html: currentHtml || '',
          conversation: messages
            .filter((m) => m.id !== 'welcome')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        };

        const response = await fetch(`${AI_WORKER_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('text/event-stream') && response.body) {
          // SSE streaming
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content || parsed.token) {
                    accumulated += parsed.content || parsed.token;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId ? { ...m, content: accumulated } : m,
                      ),
                    );
                  }
                  if (parsed.type === 'done' && parsed.html) {
                    // Done event — use the complete HTML from the worker
                    const extractedHtml = extractHtmlFromResponse(parsed.html) || parsed.html;
                    setMessages((prev) =>
                      prev.map((m) => (m.id === assistantId ? { ...m, html: extractedHtml } : m)),
                    );
                  }
                } catch {
                  // Non-JSON data line, treat as text token
                  accumulated += data;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: accumulated } : m,
                    ),
                  );
                }
              }
            }
          }

          // Final extraction pass
          const finalHtml = extractHtmlFromResponse(accumulated);
          if (finalHtml) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, html: finalHtml } : m)),
            );
          }
        } else {
          // JSON response (non-streaming)
          const data = await response.json();
          const content = data.message || data.content || data.response || JSON.stringify(data);
          const html = data.html || extractHtmlFromResponse(content) || undefined;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content, html } : m)),
          );
        }
      } catch (err: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `Error connecting to Echo Prime AI: ${err.message}. Make sure the builder AI worker is deployed.`,
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, currentHtml, messages],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage],
  );

  const handleQuickAction = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage],
  );

  const handleApply = useCallback(
    (html: string) => {
      onApplyHtml(html);
    },
    [onApplyHtml],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '0 12px',
        overflow: 'hidden',
      }}
    >
      {/* Quick actions (shown only when few messages) */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 4px 12px', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '8px', fontWeight: 600 }}>
            QUICK ACTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.surface,
                  color: COLORS.text,
                  fontSize: '13px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) (e.currentTarget as HTMLElement).style.borderColor = COLORS.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = COLORS.border;
                }}
              >
                <span style={{ color: COLORS.accent }}>&#9656;</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          scrollbarWidth: 'thin',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.accent}, #8B6914)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#0f1219',
                }}
              >
                EP
              </div>
            )}
            {msg.role === 'user' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '14px',
                  color: COLORS.muted,
                }}
              >
                U
              </div>
            )}

            {/* Message body */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '11px',
                  color: COLORS.muted,
                  marginBottom: '3px',
                  fontWeight: 600,
                }}
              >
                {msg.role === 'assistant' ? 'Echo Prime' : 'You'}
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: msg.role === 'user' ? `${COLORS.accent}15` : COLORS.surface,
                  border: `1px solid ${msg.role === 'user' ? `${COLORS.accent}33` : COLORS.border}`,
                  fontSize: '13px',
                  color: COLORS.text,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content || (
                  <span style={{ color: COLORS.muted, fontStyle: 'italic' }}>
                    Echo Prime is building...
                  </span>
                )}
              </div>

              {/* Apply to Canvas button */}
              {msg.role === 'assistant' && msg.html && (
                <button
                  onClick={() => handleApply(msg.html!)}
                  style={{
                    marginTop: '8px',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: `1px solid ${COLORS.accent}`,
                    backgroundColor: `${COLORS.accent}18`,
                    color: COLORS.accent,
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.accent;
                    (e.currentTarget as HTMLElement).style.color = '#0f1219';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${COLORS.accent}18`;
                    (e.currentTarget as HTMLElement).style.color = COLORS.accent;
                  }}
                >
                  &#9654; Apply to Canvas
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 0',
              color: COLORS.muted,
              fontSize: '12px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: COLORS.accent,
                animation: 'pulse 1.2s infinite',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: COLORS.accent,
                animation: 'pulse 1.2s infinite 0.3s',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: COLORS.accent,
                animation: 'pulse 1.2s infinite 0.6s',
              }}
            />
            <span style={{ marginLeft: '4px' }}>Echo Prime is building...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 4px 8px',
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            rows={2}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              fontSize: '13px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: inputValue.trim() && !isLoading ? COLORS.accent : COLORS.surface,
              color: inputValue.trim() && !isLoading ? '#0f1219' : COLORS.muted,
              fontWeight: 700,
              fontSize: '13px',
              cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>

        {/* Status footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px',
            padding: '0 2px',
          }}
        >
          <span style={{ fontSize: '10px', color: COLORS.muted }}>
            Shift+Enter for new line
          </span>
          <span style={{ fontSize: '10px', color: COLORS.muted }}>
            Session: {sessionId.slice(0, 16)}...
          </span>
        </div>
      </div>

      {/* Pulse animation keyframes injected via style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
