'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import {
  queryEngine,
  getUsage,
  registerUser,
  getPricing,
  getProfile,
  createCheckout,
  openCustomerPortal,
  isAuthenticated,
  getStoredApiKey,
  getStoredUserId,
  getConfidenceColor,
  getConfidenceLabel,
  type QueryResponse,
  type UsageResponse,
  type PricingTier,
  type ProfileResponse,
} from '../../lib/engine-cloud-api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  confidence?: string;
  sources?: number;
  cost?: number;
  remaining?: number;
  hash?: string;
  duration?: number;
}

// ── Main Component ──

export default function SentinelPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [mode, setMode] = useState<'FAST' | 'DEFENSE' | 'MEMO'>('FAST');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check auth on mount
  useEffect(() => {
    const hasKey = isAuthenticated();
    setApiKeyReady(hasKey);
    if (!hasKey) {
      setShowSetup(true);
    }
  }, []);

  // Load usage + profile on mount
  useEffect(() => {
    if (apiKeyReady) {
      getUsage().then(setUsage).catch(() => {});
      getProfile().then(setProfile).catch(() => {});
    }
  }, [apiKeyReady]);

  // Check for upgrade success on return from Stripe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('upgraded') === 'true') {
        // Refresh profile and usage after upgrade
        setTimeout(() => {
          getProfile().then(setProfile).catch(() => {});
          getUsage().then(setUsage).catch(() => {});
        }, 2000);
        setMessages(prev => [...prev, {
          id: `upgrade_${Date.now()}`,
          role: 'system',
          content: 'Subscription activated! Your plan has been upgraded. New query limits are now active.',
          timestamp: Date.now(),
        }]);
        window.history.replaceState({}, '', '/sentinel');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load pricing
  useEffect(() => {
    getPricing()
      .then(p => setPricingTiers(p.tiers))
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (apiKeyReady && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'system',
        content: 'Sentinel Intelligence Engine online. 932 engines across 65 domains. 35,331 doctrine blocks loaded. All responses are encrypted, sanitized, and signed.\n\nAsk anything — tax law, contract analysis, cybersecurity, drilling operations, reverse engineering, financial compliance, and 59 more verticals.',
        timestamp: Date.now(),
      }]);
    }
  }, [apiKeyReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-register with Firebase email
  const handleAutoRegister = useCallback(async () => {
    if (!user?.email) return;
    try {
      await registerUser(user.email, user.displayName || undefined);
      setApiKeyReady(true);
      setShowSetup(false);
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint')) {
        // Already registered — user needs to use stored key or contact support
        setMessages(prev => [...prev, {
          id: `err_${Date.now()}`,
          role: 'system',
          content: 'This email is already registered. If you lost your API key, contact support@echo-ept.com for a key reset.',
          timestamp: Date.now(),
        }]);
      }
    }
  }, [user]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !apiKeyReady) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await queryEngine(text, mode);
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: result.analysis,
        timestamp: Date.now(),
        confidence: result.confidence,
        sources: result.sources_cited,
        cost: result.usage.cost,
        remaining: result.usage.remaining,
        hash: result.determinism_hash,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Update usage
      if (usage) {
        setUsage({
          ...usage,
          queries: usage.queries + 1,
          remaining: result.usage.remaining,
          total_cost: usage.total_cost + result.usage.cost,
        });
      }
    } catch (err: any) {
      const errorMsg = err.message === 'unauthorized'
        ? 'API key expired or invalid. Please re-register.'
        : err.message === 'rate_limit_exceeded'
          ? 'Monthly query limit reached. Upgrade your plan for more queries.'
          : `Error: ${err.message}`;

      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`,
        role: 'system',
        content: errorMsg,
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiKeyReady, mode, usage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Render ──

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          width: 280,
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f1117',
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                boxShadow: '0 0 16px #6366f144',
              }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Sentinel</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Intelligence Engine</div>
              </div>
            </Link>
          </div>

          {/* Mode Selector */}
          <div style={{ padding: '16px 12px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Analysis Mode
            </div>
            {(['FAST', 'DEFENSE', 'MEMO'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: 4,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: mode === m ? 600 : 400,
                  color: mode === m ? '#f1f5f9' : '#94a3b8',
                  backgroundColor: mode === m ? '#1e293b' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'FAST' && '⚡ Fast — Concise analysis'}
                {m === 'DEFENSE' && '🛡️ Defense — Audit-ready'}
                {m === 'MEMO' && '📋 Memo — Full documentation'}
              </button>
            ))}
          </div>

          {/* Usage Stats */}
          {usage && (
            <div style={{ padding: '16px 12px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Usage — {usage.month}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                {usage.queries} / {usage.limit} queries
              </div>
              <div style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: '#1e293b',
                marginBottom: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: 2,
                  width: `${Math.min(100, (usage.queries / usage.limit) * 100)}%`,
                  backgroundColor: usage.queries / usage.limit > 0.9 ? '#ef4444' : usage.queries / usage.limit > 0.7 ? '#f59e0b' : '#6366f1',
                  transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Tier: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{usage.tier.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Cost: <span style={{ color: '#f1f5f9' }}>${usage.total_cost.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '12px', flex: 1 }}>
            <button
              onClick={() => setShowPricing(true)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #334155',
                cursor: 'pointer',
                fontSize: 13,
                color: '#94a3b8',
                backgroundColor: 'transparent',
                marginBottom: 8,
                textAlign: 'left',
              }}
            >
              {profile?.tier === 'free' ? '⬆ Upgrade Plan' : '📊 Manage Plan'}
            </button>
            {profile?.has_subscription && (
              <button
                onClick={async () => {
                  try {
                    const { portal_url } = await openCustomerPortal();
                    window.location.href = portal_url;
                  } catch {}
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#94a3b8',
                  backgroundColor: 'transparent',
                  marginBottom: 8,
                  textAlign: 'left',
                }}
              >
                💳 Billing Portal
              </button>
            )}
            <button
              onClick={() => { setMessages([]); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #334155',
                cursor: 'pointer',
                fontSize: 13,
                color: '#94a3b8',
                backgroundColor: 'transparent',
                textAlign: 'left',
              }}
            >
              🗑️ Clear History
            </button>
          </div>

          {/* User info */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', fontSize: 12, color: '#64748b' }}>
            {user?.email || getStoredUserId()?.slice(0, 8) + '...'}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0f1117',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
              Sentinel — 932 Engines • 35,331 Doctrines • 65 Domains
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: '#0f2a1a',
              color: '#10b981',
              fontWeight: 600,
            }}>
              🔒 ENCRYPTED
            </span>
            <span style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: '#1e1b4b',
              color: '#818cf8',
              fontWeight: 600,
            }}>
              {mode}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 20 }}>
                {msg.role === 'user' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      backgroundColor: '#334155',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: '#f1f5f9',
                      flexShrink: 0,
                    }}>
                      {user?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>You</div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                      boxShadow: '0 0 12px #6366f133',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#818cf8' }}>Sentinel</span>
                        {msg.confidence && (
                          <span style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 4,
                            backgroundColor: getConfidenceColor(msg.confidence) + '22',
                            color: getConfidenceColor(msg.confidence),
                            fontWeight: 600,
                          }}>
                            {getConfidenceLabel(msg.confidence)}
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: 14,
                        color: '#e2e8f0',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        backgroundColor: '#111827',
                        borderRadius: 12,
                        padding: '16px 20px',
                        border: '1px solid #1e293b',
                      }}>
                        {msg.content}
                      </div>
                      {/* Metadata bar */}
                      <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 11, color: '#475569' }}>
                        {msg.sources !== undefined && msg.sources > 0 && (
                          <span>{msg.sources} sources cited</span>
                        )}
                        {msg.cost !== undefined && (
                          <span>${msg.cost.toFixed(4)} cost</span>
                        )}
                        {msg.remaining !== undefined && (
                          <span>{msg.remaining} queries left</span>
                        )}
                        {msg.hash && (
                          <span title="Determinism hash for reproducibility">#{msg.hash}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* System message */
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    backgroundColor: '#1e293b44',
                    border: '1px solid #334155',
                    fontSize: 13,
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                  flexShrink: 0, animation: 'pulse 2s infinite',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#818cf8', marginBottom: 4 }}>Sentinel</div>
                  <div style={{
                    padding: '16px 20px', borderRadius: 12,
                    backgroundColor: '#111827', border: '1px solid #1e293b',
                    fontSize: 13, color: '#64748b',
                  }}>
                    Analyzing across 932 engines...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div style={{ borderTop: '1px solid #1e293b', padding: '16px 24px', backgroundColor: '#0f1117' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {apiKeyReady ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything — tax, legal, cybersecurity, engineering, finance..."
                  disabled={loading}
                  rows={1}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#f1f5f9',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.5,
                    minHeight: 44,
                    maxHeight: 200,
                    fontFamily: 'inherit',
                  }}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    cursor: loading || !input.trim() ? 'default' : 'pointer',
                    backgroundColor: loading || !input.trim() ? '#1e293b' : '#6366f1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
                  Get started with 50 free queries per month. No credit card required.
                </p>
                {user?.email ? (
                  <button
                    onClick={handleAutoRegister}
                    style={{
                      padding: '12px 32px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#6366f1',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Activate Free Plan — {user.email}
                  </button>
                ) : (
                  <Link href="/login" style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    borderRadius: 10,
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                    Sign In to Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div
          onClick={() => setShowPricing(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#111827',
              borderRadius: 16,
              border: '1px solid #1e293b',
              padding: 32,
              maxWidth: 960,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              {profile?.tier === 'free' ? 'Upgrade Your Plan' : 'Manage Your Plan'}
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>
              Access 932 intelligence engines across 65 domains. All plans include encrypted analysis, audit trails, and deterministic hashing.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {pricingTiers.map(tier => {
                const tierKey = tier.name.toLowerCase();
                const isCurrentTier = profile?.tier === tierKey;
                const isFree = tier.price === 0;
                return (
                  <div
                    key={tier.name}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      border: `2px solid ${isCurrentTier ? '#10b981' : tier.popular ? '#6366f1' : '#334155'}`,
                      backgroundColor: isCurrentTier ? '#10b98108' : tier.popular ? '#6366f108' : 'transparent',
                      position: 'relative',
                    }}
                  >
                    {isCurrentTier && (
                      <div style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 10, fontWeight: 700, color: '#10b981', backgroundColor: '#111827',
                        padding: '2px 10px', borderRadius: 4, border: '1px solid #10b981',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        Current Plan
                      </div>
                    )}
                    {tier.popular && !isCurrentTier && (
                      <div style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 10, fontWeight: 700, color: '#818cf8', backgroundColor: '#111827',
                        padding: '2px 10px', borderRadius: 4, border: '1px solid #6366f1',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginTop: 8 }}>
                      {isFree ? 'Free' : `$${tier.price}`}
                      {!isFree && <span style={{ fontSize: 14, fontWeight: 400, color: '#64748b' }}>/mo</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                      {tier.queries.toLocaleString()} queries/month
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
                      {tier.features.map((f, i) => (
                        <li key={i} style={{ fontSize: 12, color: '#94a3b8', padding: '3px 0', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                          <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 16 }}>
                      {isCurrentTier ? (
                        <div style={{
                          padding: '10px 0', textAlign: 'center', borderRadius: 8,
                          fontSize: 13, fontWeight: 600, color: '#10b981',
                        }}>
                          Active
                        </div>
                      ) : isFree ? (
                        <div style={{
                          padding: '10px 0', textAlign: 'center', borderRadius: 8,
                          fontSize: 13, color: '#64748b',
                        }}>
                          Included
                        </div>
                      ) : (
                        <button
                          disabled={upgrading !== null}
                          onClick={async () => {
                            setUpgrading(tierKey);
                            try {
                              const { checkout_url } = await createCheckout(
                                tierKey as 'starter' | 'growth' | 'enterprise'
                              );
                              window.location.href = checkout_url;
                            } catch (err: any) {
                              setUpgrading(null);
                              setMessages(prev => [...prev, {
                                id: `cerr_${Date.now()}`,
                                role: 'system',
                                content: `Checkout error: ${err.message}. Please try again.`,
                                timestamp: Date.now(),
                              }]);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 0',
                            borderRadius: 8,
                            border: 'none',
                            cursor: upgrading ? 'wait' : 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#fff',
                            backgroundColor: tier.popular ? '#6366f1' : '#334155',
                            transition: 'all 0.15s',
                          }}
                        >
                          {upgrading === tierKey ? 'Redirecting...' : `Upgrade to ${tier.name}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
              {profile?.has_subscription && (
                <button
                  onClick={async () => {
                    try {
                      const { portal_url } = await openCustomerPortal();
                      window.location.href = portal_url;
                    } catch {}
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: '1px solid #6366f1',
                    backgroundColor: 'transparent',
                    color: '#818cf8',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Manage Subscription
                </button>
              )}
              <button
                onClick={() => setShowPricing(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
