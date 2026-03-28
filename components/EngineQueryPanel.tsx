'use client';

import { useState, useEffect } from 'react';
import { useEngineQuery } from '../lib/hooks/use-engine-query';
import { getRuntimeStats, getConfidenceBadge, getMatchQualityBadge, formatDoctrineCount, type CategoryStats } from '../lib/engine-runtime-api';

interface Props {
  domain?: string;
  domains?: string[];
  title?: string;
  placeholder?: string;
  exampleQueries?: string[];
  showStats?: boolean;
}

export function EngineQueryPanel({
  domain,
  domains,
  title = 'Ask the Intelligence Engine',
  placeholder = 'Ask a question...',
  exampleQueries = [],
  showStats = true,
}: Props) {
  const [input, setInput] = useState('');
  const { query, queryMulti, result, loading, error, clear } = useEngineQuery();
  const [stats, setStats] = useState<{ engines: number; doctrines: number } | null>(null);

  useEffect(() => {
    if (!showStats) return;
    const targetDomains = domains || (domain ? [domain] : []);
    if (targetDomains.length === 0) return;

    getRuntimeStats()
      .then((s) => {
        const matched = s.categories.filter((c: CategoryStats) =>
          targetDomains.includes(c.category),
        );
        setStats({
          engines: matched.reduce((a: number, c: CategoryStats) => a + c.c, 0),
          doctrines: matched.reduce((a: number, c: CategoryStats) => a + c.doctrines, 0),
        });
      })
      .catch(() => {});
  }, [domain, domains, showStats]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    if (domains && domains.length > 0) {
      await queryMulti(input, domains);
    } else {
      await query(input, domain);
    }
  };

  const handleExample = (q: string) => {
    setInput(q);
    clear();
    if (domains && domains.length > 0) {
      queryMulti(q, domains);
    } else {
      query(q, domain);
    }
  };

  return (
    <div>
      {/* Stats banner */}
      {showStats && stats && (
        <div
          className="flex items-center gap-4 mb-6 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}
        >
          <span style={{ color: 'var(--ept-accent)', fontWeight: 600 }}>
            {stats.engines} engines
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: 'var(--ept-accent)', fontWeight: 600 }}>
            {formatDoctrineCount(stats.doctrines)} doctrines
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Pre-compiled expert reasoning</span>
        </div>
      )}

      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl border text-sm"
          style={{
            backgroundColor: 'var(--ept-surface)',
            borderColor: 'var(--ept-border)',
            color: 'var(--ept-text)',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity"
          style={{
            backgroundColor: 'var(--ept-accent)',
            color: '#fff',
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          {loading ? 'Querying...' : 'Ask'}
        </button>
      </form>

      {/* Example queries */}
      {exampleQueries.length > 0 && !result && (
        <div className="flex flex-wrap gap-2 mb-6">
          {exampleQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleExample(q)}
              className="px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--ept-border)',
                color: 'var(--ept-text-secondary)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--ept-accent)';
                e.currentTarget.style.color = 'var(--ept-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ept-border)';
                e.currentTarget.style.color = 'var(--ept-text-secondary)';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            Querying {stats ? `${stats.engines} engines` : 'doctrine network'}...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm mb-4"
          style={{ backgroundColor: '#ef44441a', color: '#ef4444', border: '1px solid #ef44443a' }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && result.results && result.results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                {result.total} doctrine{result.total !== 1 ? 's' : ''} matched
                {result.latency_ms > 0 && ` · ${result.latency_ms}ms`}
              </span>
              {result.match_quality && (() => {
                const mqBadge = getMatchQualityBadge(result.match_quality);
                return (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1"
                    style={{ backgroundColor: mqBadge.color + '1a', color: mqBadge.color }}
                  >
                    {mqBadge.icon} {mqBadge.label}
                  </span>
                );
              })()}
            </div>
            <button
              onClick={clear}
              className="text-xs px-2 py-1 rounded"
              style={{ color: 'var(--ept-text-muted)' }}
            >
              Clear
            </button>
          </div>

          {/* Match guidance warning for weak/none matches */}
          {result.match_guidance && result.match_quality && result.match_quality !== 'strong' && (
            <div
              className="px-4 py-2.5 rounded-xl text-xs"
              style={{
                backgroundColor: result.match_quality === 'weak' || result.match_quality === 'none'
                  ? '#f59e0b12' : 'var(--ept-surface)',
                color: result.match_quality === 'weak' || result.match_quality === 'none'
                  ? '#f59e0b' : 'var(--ept-text-muted)',
                border: `1px solid ${result.match_quality === 'weak' || result.match_quality === 'none'
                  ? '#f59e0b30' : 'var(--ept-border)'}`,
              }}
            >
              {result.match_guidance}
            </div>
          )}

          {result.results.map((doc, i) => {
            const badge = getConfidenceBadge(doc.confidence);
            return (
              <div
                key={i}
                className="p-5 rounded-xl border"
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: 'var(--ept-card-border)',
                }}
              >
                {/* Header: topic + badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                    {doc.topic}
                  </h4>
                  <div className="flex gap-2 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: badge.color + '1a', color: badge.color }}
                    >
                      {badge.label}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-mono"
                      style={{
                        backgroundColor: 'var(--ept-surface)',
                        color: 'var(--ept-text-muted)',
                      }}
                    >
                      {doc.domain}
                    </span>
                  </div>
                </div>

                {/* Conclusion */}
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ept-text-secondary)' }}>
                  {doc.conclusion}
                </p>

                {/* Reasoning (collapsed by default for brevity) */}
                {doc.reasoning && (
                  <details className="mb-3">
                    <summary
                      className="text-xs cursor-pointer select-none"
                      style={{ color: 'var(--ept-accent)' }}
                    >
                      View reasoning
                    </summary>
                    <p
                      className="text-xs mt-2 leading-relaxed pl-3"
                      style={{
                        color: 'var(--ept-text-muted)',
                        borderLeft: '2px solid var(--ept-border)',
                      }}
                    >
                      {doc.reasoning}
                    </p>
                  </details>
                )}

                {/* Authority citations */}
                {doc.authority && doc.authority.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {doc.authority.map((auth, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--ept-surface)',
                          color: 'var(--ept-text-muted)',
                        }}
                      >
                        {auth}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {result && result.results && result.results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>
            No matching doctrines found. Try a different query or broader terms.
          </p>
        </div>
      )}
    </div>
  );
}
