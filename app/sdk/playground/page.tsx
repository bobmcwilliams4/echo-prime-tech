'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../lib/theme-context';
import { getStoredSDKKey, sdkFetch, getOpenAPISpec, parseOpenAPIEndpoints, OpenAPIEndpoint } from '../../../lib/sdk-api';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  method: string;
  path: string;
  status: number;
  latency: number;
  timestamp: string;
  request: string;
  response: string;
}

const GATEWAY_URL = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

export default function SDKPlaygroundPage() {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();

  const [endpoints, setEndpoints] = useState<OpenAPIEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<OpenAPIEndpoint | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load endpoints from OpenAPI spec
  useEffect(() => {
    getOpenAPISpec()
      .then((spec) => {
        const eps = parseOpenAPIEndpoints(spec);
        setEndpoints(eps);

        // Auto-select from URL params
        const method = searchParams.get('method');
        const path = searchParams.get('path');
        if (method && path) {
          const match = eps.find((e) => e.method === method && e.path === path);
          if (match) {
            setSelectedEndpoint(match);
            setDefaultBody(match);
          }
        } else if (eps.length > 0) {
          setSelectedEndpoint(eps[0]);
          setDefaultBody(eps[0]);
        }
      })
      .catch(() => {});
  }, [searchParams]);

  // Load stored API key
  useEffect(() => {
    const key = getStoredSDKKey();
    if (key) setApiKey(key);
  }, []);

  const setDefaultBody = (ep: OpenAPIEndpoint) => {
    const bodySchema = ep.requestBody?.content?.['application/json']?.schema;
    if (bodySchema?.properties) {
      const body: Record<string, unknown> = {};
      for (const [name, prop] of Object.entries(bodySchema.properties)) {
        const p = prop as { example?: unknown; default?: unknown; type?: string };
        body[name] = p.example ?? p.default ?? (p.type === 'number' ? 0 : p.type === 'boolean' ? false : '');
      }
      setBodyText(JSON.stringify(body, null, 2));
    } else {
      setBodyText('');
    }
    // Reset params
    setQueryParams({});
    setPathParams({});
  };

  const handleEndpointChange = (key: string) => {
    const ep = endpoints.find((e) => `${e.method} ${e.path}` === key);
    if (ep) {
      setSelectedEndpoint(ep);
      setDefaultBody(ep);
      setResponse(null);
      setStatus(null);
      setLatency(null);
    }
  };

  const buildUrl = useCallback((): string => {
    if (!selectedEndpoint) return '';
    let path = selectedEndpoint.path;

    // Replace path parameters like {id}
    for (const [key, value] of Object.entries(pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(value));
    }

    // Add query parameters
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return `${GATEWAY_URL}${path}${qs ? '?' + qs : ''}`;
  }, [selectedEndpoint, pathParams, queryParams]);

  const handleSend = async () => {
    if (!selectedEndpoint) return;
    setLoading(true);
    setResponse(null);

    const url = buildUrl();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Echo-API-Key'] = apiKey;

    const start = Date.now();
    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };
      if (selectedEndpoint.method !== 'GET' && bodyText.trim()) {
        options.body = bodyText;
      }

      const res = await fetch(url, options);
      const elapsed = Date.now() - start;
      const text = await res.text();

      let formatted: string;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        formatted = text;
      }

      setResponse(formatted);
      setStatus(res.status);
      setLatency(elapsed);

      // Add to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        status: res.status,
        latency: elapsed,
        timestamp: new Date().toISOString(),
        request: bodyText || '(no body)',
        response: formatted,
      };
      setHistory((prev) => [entry, ...prev.slice(0, 49)]);
    } catch (err) {
      const elapsed = Date.now() - start;
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : 'Request failed' }, null, 2));
      setStatus(0);
      setLatency(elapsed);
    }
    setLoading(false);
  };

  const restoreHistory = (entry: HistoryEntry) => {
    const ep = endpoints.find((e) => e.method === entry.method && e.path === entry.path);
    if (ep) {
      setSelectedEndpoint(ep);
      setBodyText(entry.request === '(no body)' ? '' : entry.request);
      setResponse(entry.response);
      setStatus(entry.status);
      setLatency(entry.latency);
      setShowHistory(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid var(--ept-card-border)',
    background: 'var(--ept-surface)',
    color: 'var(--ept-text)',
    fontSize: 14,
    fontFamily: 'var(--font-mono, monospace)',
    outline: 'none',
  };

  // Extract path params like {id}
  const pathParamNames = selectedEndpoint
    ? (selectedEndpoint.path.match(/\{(\w+)\}/g) || []).map((s) => s.slice(1, -1))
    : [];

  // Query params from spec
  const queryParamDefs = (selectedEndpoint?.parameters || []).filter((p) => p.in === 'query');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', color: 'var(--ept-text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>API Playground</h1>
          <p style={{ opacity: 0.6, fontSize: 15 }}>Test SDK Gateway endpoints interactively.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            background: 'transparent',
            border: '1px solid var(--ept-card-border)',
            borderRadius: 8,
            padding: '8px 16px',
            color: 'var(--ept-text)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          History ({history.length})
        </button>
      </div>

      {/* No API key warning */}
      {!apiKey && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: isDark ? 'rgba(234,179,8,0.1)' : 'rgba(234,179,8,0.05)',
            border: '1px solid rgba(234,179,8,0.3)',
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          No API key detected.{' '}
          <Link href="/sdk/signup" style={{ color: 'var(--ept-accent)', fontWeight: 600 }}>
            Get one free
          </Link>{' '}
          to make authenticated requests.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: showHistory ? '1fr 300px' : '1fr', gap: 24 }}>
        <div>
          {/* Request Builder */}
          <div style={{ ...cardStyle, padding: 24, marginBottom: 24 }}>
            {/* Endpoint selector */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <select
                value={selectedEndpoint ? `${selectedEndpoint.method} ${selectedEndpoint.path}` : ''}
                onChange={(e) => handleEndpointChange(e.target.value)}
                style={{
                  ...inputStyle,
                  flex: 1,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {endpoints.map((ep) => (
                  <option key={`${ep.method}-${ep.path}`} value={`${ep.method} ${ep.path}`}>
                    {ep.method} {ep.path} — {ep.summary}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSend}
                disabled={loading || !selectedEndpoint}
                style={{
                  background: 'var(--ept-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>

            {/* API Key */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, opacity: 0.6 }}>
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                style={inputStyle}
              />
            </div>

            {/* Path Parameters */}
            {pathParamNames.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.6 }}>
                  Path Parameters
                </label>
                {pathParamNames.map((name) => (
                  <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, minWidth: 80 }}>{`{${name}}`}</span>
                    <input
                      type="text"
                      value={pathParams[name] || ''}
                      onChange={(e) => setPathParams((p) => ({ ...p, [name]: e.target.value }))}
                      placeholder={name}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Query Parameters */}
            {queryParamDefs.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.6 }}>
                  Query Parameters
                </label>
                {queryParamDefs.map((p) => (
                  <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, minWidth: 80 }}>
                      {p.name}
                      {p.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </span>
                    <input
                      type="text"
                      value={queryParams[p.name] || ''}
                      onChange={(e) => setQueryParams((q) => ({ ...q, [p.name]: e.target.value }))}
                      placeholder={p.description || p.name}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Request Body */}
            {selectedEndpoint && selectedEndpoint.method !== 'GET' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, opacity: 0.6 }}>
                  Request Body (JSON)
                </label>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={10}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                />
              </div>
            )}

            {/* Generated URL preview */}
            {selectedEndpoint && (
              <div
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 12,
                  opacity: 0.6,
                  wordBreak: 'break-all',
                }}
              >
                {selectedEndpoint.method} {buildUrl()}
              </div>
            )}
          </div>

          {/* Response Viewer */}
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--ept-card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'var(--ept-surface)',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>Response</span>
              {status !== null && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: status >= 200 && status < 300 ? '#22c55e' : status >= 400 ? '#ef4444' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background:
                      status >= 200 && status < 300
                        ? 'rgba(34,197,94,0.1)'
                        : status >= 400
                          ? 'rgba(239,68,68,0.1)'
                          : 'rgba(245,158,11,0.1)',
                  }}
                >
                  {status === 0 ? 'ERROR' : status}
                </span>
              )}
              {latency !== null && (
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, opacity: 0.5 }}>
                  {latency}ms
                </span>
              )}
            </div>
            <pre
              style={{
                margin: 0,
                padding: 20,
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: 'var(--font-mono, monospace)',
                overflowX: 'auto',
                minHeight: 200,
                maxHeight: 500,
                color: isDark ? '#e2e8f0' : '#1e293b',
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <code>{response || '// Send a request to see the response here'}</code>
            </pre>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div style={{ ...cardStyle, padding: 16, maxHeight: 800, overflowY: 'auto' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Request History</h3>
            {history.length === 0 && (
              <p style={{ fontSize: 13, opacity: 0.5 }}>No requests yet.</p>
            )}
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => restoreHistory(entry)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: 6,
                  borderRadius: 6,
                  border: '1px solid var(--ept-card-border)',
                  background: 'transparent',
                  color: 'var(--ept-text)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: entry.status >= 200 && entry.status < 300 ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {entry.method}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 11,
                      opacity: 0.7,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.path}
                  </span>
                </div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>
                  {entry.status} · {entry.latency}ms ·{' '}
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
