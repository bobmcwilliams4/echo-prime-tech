'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/theme-context';
import { getStoredSDKKey } from '../../../lib/sdk-api';

const GATEWAY_URL = 'https://echo-sdk-gateway.bmcii1976.workers.dev';

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--ept-card-border)',
        marginBottom: 16,
      }}
    >
      {lang && (
        <div
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            background: 'var(--ept-surface)',
            borderBottom: '1px solid var(--ept-card-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ opacity: 0.6 }}>{lang}</span>
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ept-accent)',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 16,
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono, monospace)',
          overflowX: 'auto',
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
          color: isDark ? '#e2e8f0' : '#1e293b',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function SDKQuickstartPage() {
  const { isDark } = useTheme();
  const storedKey = typeof window !== 'undefined' ? getStoredSDKKey() : null;
  const keyPlaceholder = storedKey || 'YOUR_API_KEY';

  const cardStyle: React.CSSProperties = {
    background: 'var(--ept-card-bg)',
    border: '1px solid var(--ept-card-border)',
    borderRadius: 12,
    padding: 32,
    marginBottom: 32,
  };

  const stepNum: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--ept-accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px', color: 'var(--ept-text)' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Quick Start</h1>
      <p style={{ fontSize: 17, opacity: 0.7, marginBottom: 48, lineHeight: 1.5 }}>
        Get up and running with the Echo SDK Gateway in under 5 minutes.
      </p>

      {/* Step 1: Get API Key */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={stepNum}>1</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Get your API key</h2>
            <p style={{ opacity: 0.7, fontSize: 15 }}>
              {storedKey
                ? 'You already have a key stored in your browser.'
                : 'Create a free account and generate an API key.'}
            </p>
          </div>
        </div>
        {storedKey ? (
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 13,
              padding: '10px 14px',
              borderRadius: 8,
              background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
              marginBottom: 12,
            }}
          >
            {storedKey.slice(0, 12)}...{storedKey.slice(-6)}
          </div>
        ) : (
          <Link href="/sdk/signup">
            <button
              style={{
                background: 'var(--ept-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Get Free API Key
            </button>
          </Link>
        )}
      </div>

      {/* Step 2: First Request */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={stepNum}>2</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Make your first request</h2>
            <p style={{ opacity: 0.7, fontSize: 15 }}>Query an intelligence engine with a single API call.</p>
          </div>
        </div>

        <CodeBlock
          lang="curl"
          code={`curl -X POST ${GATEWAY_URL}/engine/query \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: ${keyPlaceholder}" \\
  -d '{"query": "What is a 1031 exchange?", "mode": "FAST"}'`}
        />

        <CodeBlock
          lang="Python"
          code={`import requests

response = requests.post(
    "${GATEWAY_URL}/engine/query",
    headers={"X-Echo-API-Key": "${keyPlaceholder}"},
    json={"query": "What is a 1031 exchange?", "mode": "FAST"}
)
result = response.json()
print(result["data"]["analysis"])`}
        />

        <CodeBlock
          lang="JavaScript / TypeScript"
          code={`const res = await fetch("${GATEWAY_URL}/engine/query", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Echo-API-Key": "${keyPlaceholder}",
  },
  body: JSON.stringify({
    query: "What is a 1031 exchange?",
    mode: "FAST",
  }),
});
const { data } = await res.json();
console.log(data.analysis);`}
        />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>Example Response</h3>
        <CodeBlock
          lang="JSON"
          code={`{
  "success": true,
  "data": {
    "analysis": "A 1031 exchange (IRC Section 1031) allows taxpayers to defer capital gains tax...",
    "confidence": "DEFENSIBLE",
    "sources_cited": 12,
    "engine_id": "TX03",
    "domain": "TAX"
  },
  "meta": {
    "ts": "2026-03-12T08:30:00Z",
    "version": "1.0.0",
    "latency_ms": 42
  }
}`}
        />
      </div>

      {/* Step 3: Explore Domains */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={stepNum}>3</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Explore domains</h2>
            <p style={{ opacity: 0.7, fontSize: 15 }}>
              Discover 940+ domain categories across 5,486+ engines.
            </p>
          </div>
        </div>

        <CodeBlock
          lang="curl"
          code={`# List all available domains
curl ${GATEWAY_URL}/engine/domains \\
  -H "X-Echo-API-Key: ${keyPlaceholder}"

# Search engines by keyword
curl "${GATEWAY_URL}/engine/search?q=cryptocurrency&limit=5" \\
  -H "X-Echo-API-Key: ${keyPlaceholder}"

# Query a specific domain
curl -X POST ${GATEWAY_URL}/engine/domain \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: ${keyPlaceholder}" \\
  -d '{"domain": "CRYPTO", "query": "How does staking work?"}'`}
        />
      </div>

      {/* Step 4: Use Memory */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={stepNum}>4</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Add memory</h2>
            <p style={{ opacity: 0.7, fontSize: 15 }}>
              Store and retrieve context with the Shared Brain for persistent AI memory.
            </p>
          </div>
        </div>

        <CodeBlock
          lang="Python"
          code={`# Store a memory
requests.post(
    "${GATEWAY_URL}/brain/ingest",
    headers={"X-Echo-API-Key": "${keyPlaceholder}"},
    json={
        "instance_id": "my-app",
        "role": "assistant",
        "content": "User prefers concise answers about tax law",
        "importance": 7,
        "tags": ["preference", "tax"]
    }
)

# Search memories
results = requests.post(
    "${GATEWAY_URL}/brain/search",
    headers={"X-Echo-API-Key": "${keyPlaceholder}"},
    json={"query": "user preferences", "limit": 5}
).json()
print(results["data"])`}
        />
      </div>

      {/* Step 5: Search Knowledge */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={stepNum}>5</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Search the knowledge base</h2>
            <p style={{ opacity: 0.7, fontSize: 15 }}>
              Access 12,000+ expert documents with semantic search.
            </p>
          </div>
        </div>

        <CodeBlock
          lang="curl"
          code={`curl -X POST ${GATEWAY_URL}/knowledge/search \\
  -H "Content-Type: application/json" \\
  -H "X-Echo-API-Key: ${keyPlaceholder}" \\
  -d '{"query": "mineral rights in Texas", "limit": 5}'`}
        />
      </div>

      {/* Next Steps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {[
          { label: 'Full API Reference', href: '/sdk/docs', desc: 'Every endpoint documented' },
          { label: 'Playground', href: '/sdk/playground', desc: 'Test endpoints interactively' },
          { label: 'Pricing', href: '/sdk/pricing', desc: 'Upgrade for higher limits' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              ...cardStyle,
              marginBottom: 0,
              padding: 20,
              textDecoration: 'none',
              color: 'var(--ept-text)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{link.label} →</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>{link.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
