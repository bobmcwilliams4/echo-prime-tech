'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/theme-context';
import { getOpenAPISpec, parseOpenAPIEndpoints, OpenAPIEndpoint, OpenAPISpec } from '../../../lib/sdk-api';

const METHOD_COLORS: Record<string, string> = {
  GET: '#22c55e',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#a855f7',
};

const TAG_LABELS: Record<string, string> = {
  engine: 'Intelligence Engines',
  brain: 'Shared Brain',
  knowledge: 'Knowledge Forge',
  vault: 'Credential Vault',
  worker: 'Worker Proxy',
  system: 'System',
};

function EndpointCard({ ep }: { ep: OpenAPIEndpoint }) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);

  const methodColor = METHOD_COLORS[ep.method] || 'var(--ept-text)';
  const bodySchema = ep.requestBody?.content?.['application/json']?.schema;
  const bodyProps = bodySchema?.properties || {};
  const requiredFields = bodySchema?.required || [];
  const hasAuth = ep.security && ep.security.length > 0;

  return (
    <div
      style={{
        border: '1px solid var(--ept-card-border)',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 8,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--ept-card-bg)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ept-text)',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            fontWeight: 700,
            color: methodColor,
            background: `${methodColor}15`,
            padding: '2px 8px',
            borderRadius: 4,
            minWidth: 48,
            textAlign: 'center',
          }}
        >
          {ep.method}
        </span>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, flex: 1 }}>
          {ep.path}
        </span>
        <span style={{ fontSize: 13, opacity: 0.6, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ep.summary}
        </span>
        {hasAuth && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            AUTH
          </span>
        )}
        <span style={{ fontSize: 14, opacity: 0.4 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div
          style={{
            padding: 20,
            borderTop: '1px solid var(--ept-card-border)',
            background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
          }}
        >
          {ep.description && (
            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>
              {ep.description}
            </p>
          )}

          {/* Auth note */}
          {hasAuth && (
            <div
              style={{
                fontSize: 13,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.2)',
                marginBottom: 16,
              }}
            >
              Requires <code style={{ fontFamily: 'var(--font-mono, monospace)' }}>X-Echo-API-Key</code> header
            </div>
          )}

          {/* Query Parameters */}
          {ep.parameters && ep.parameters.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Parameters</h4>
              <div
                style={{
                  border: '1px solid var(--ept-card-border)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ept-card-border)', background: 'var(--ept-surface)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>In</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Required</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.parameters.map((p) => (
                      <tr key={p.name} style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono, monospace)' }}>{p.name}</td>
                        <td style={{ padding: '8px 12px', opacity: 0.6 }}>{p.schema?.type || 'string'}</td>
                        <td style={{ padding: '8px 12px', opacity: 0.6 }}>{p.in}</td>
                        <td style={{ padding: '8px 12px' }}>{p.required ? 'Yes' : 'No'}</td>
                        <td style={{ padding: '8px 12px', opacity: 0.7 }}>{p.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {Object.keys(bodyProps).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Request Body</h4>
              <div
                style={{
                  border: '1px solid var(--ept-card-border)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ept-card-border)', background: 'var(--ept-surface)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Field</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Required</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(bodyProps).map(([name, prop]) => {
                      const p = prop as { type?: string; description?: string; default?: unknown; example?: unknown };
                      return (
                        <tr key={name} style={{ borderBottom: '1px solid var(--ept-card-border)' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono, monospace)' }}>{name}</td>
                          <td style={{ padding: '8px 12px', opacity: 0.6 }}>{p.type || 'string'}</td>
                          <td style={{ padding: '8px 12px' }}>{requiredFields.includes(name) ? 'Yes' : 'No'}</td>
                          <td style={{ padding: '8px 12px', opacity: 0.7 }}>
                            {p.description || '—'}
                            {p.default !== undefined && (
                              <span style={{ opacity: 0.5 }}> (default: {JSON.stringify(p.default)})</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Try It button */}
          <Link href={`/sdk/playground?method=${ep.method}&path=${encodeURIComponent(ep.path)}`}>
            <button
              style={{
                background: 'var(--ept-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try it in Playground →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SDKDocsPage() {
  const { isDark } = useTheme();
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [endpoints, setEndpoints] = useState<OpenAPIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    getOpenAPISpec()
      .then((s) => {
        setSpec(s);
        setEndpoints(parseOpenAPIEndpoints(s));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tags = [...new Set(endpoints.flatMap((e) => e.tags || ['system']))];

  const filtered = endpoints.filter((ep) => {
    if (activeTag && !(ep.tags || ['system']).includes(activeTag)) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return (
        ep.path.toLowerCase().includes(q) ||
        ep.summary.toLowerCase().includes(q) ||
        (ep.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by tag
  const grouped: Record<string, OpenAPIEndpoint[]> = {};
  for (const ep of filtered) {
    const tag = ep.tags?.[0] || 'system';
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(ep);
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--ept-text)' }}>
        Loading API specification...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px', color: 'var(--ept-text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>API Reference</h1>
          <p style={{ opacity: 0.6, fontSize: 15 }}>
            {spec?.info?.title || 'Echo SDK Gateway'} — {endpoints.length} endpoints
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <code
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--ept-card-bg)',
              border: '1px solid var(--ept-card-border)',
              opacity: 0.7,
            }}
          >
            Base URL: echo-sdk-gateway.bmcii1976.workers.dev
          </code>
        </div>
      </div>

      {/* Auth info */}
      <div
        style={{
          background: 'var(--ept-card-bg)',
          border: '1px solid var(--ept-card-border)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Authentication</h3>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
          All authenticated endpoints require an API key in the request header:
        </p>
        <code
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            padding: '8px 14px',
            borderRadius: 6,
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
            display: 'block',
          }}
        >
          X-Echo-API-Key: your_api_key_here
        </code>
        <p style={{ fontSize: 13, opacity: 0.5, marginTop: 8 }}>
          Or use{' '}
          <code style={{ fontFamily: 'var(--font-mono, monospace)' }}>Authorization: Bearer your_api_key_here</code>.
          Get a key at{' '}
          <Link href="/sdk/signup" style={{ color: 'var(--ept-accent)' }}>
            /sdk/signup
          </Link>
          .
        </p>
      </div>

      {/* Search + Tag Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search endpoints..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--ept-card-border)',
            background: 'var(--ept-surface)',
            color: 'var(--ept-text)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTag(null)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid var(--ept-card-border)',
              background: !activeTag ? 'var(--ept-accent)' : 'transparent',
              color: !activeTag ? '#fff' : 'var(--ept-text)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: '1px solid var(--ept-card-border)',
                background: activeTag === tag ? 'var(--ept-accent)' : 'transparent',
                color: activeTag === tag ? '#fff' : 'var(--ept-text)',
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {TAG_LABELS[tag] || tag}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints grouped by tag */}
      {Object.entries(grouped).map(([tag, eps]) => (
        <div key={tag} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, textTransform: 'capitalize' }}>
            {TAG_LABELS[tag] || tag}
          </h2>
          {eps.map((ep) => (
            <EndpointCard key={`${ep.method}-${ep.path}`} ep={ep} />
          ))}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
          No endpoints match your search.
        </div>
      )}

      {/* Response format */}
      <div
        style={{
          background: 'var(--ept-card-bg)',
          border: '1px solid var(--ept-card-border)',
          borderRadius: 12,
          padding: 24,
          marginTop: 32,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Response Format</h3>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>
          All endpoints return a consistent JSON envelope:
        </p>
        <pre
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            lineHeight: 1.6,
            padding: 16,
            borderRadius: 8,
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
            overflowX: 'auto',
            margin: 0,
          }}
        >
          <code>{`{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "ts": "2026-03-12T00:00:00Z",
    "version": "1.0.0",
    "service": "echo-sdk-gateway",
    "latency_ms": 42
  }
}`}</code>
        </pre>
      </div>
    </div>
  );
}
