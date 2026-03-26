'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '@/lib/theme-context'

export interface DocSection {
  title: string
  id: string
  content: string[]
}

export interface ApiEndpoint {
  method: string
  path: string
  desc: string
  auth?: boolean
}

export interface ProductDocProps {
  name: string
  tagline: string
  accent: string
  productUrl: string
  workerUrl?: string
  version: string
  overview: string[]
  gettingStarted: { step: number; title: string; desc: string }[]
  features: { title: string; desc: string }[]
  apiEndpoints?: ApiEndpoint[]
  userGuide: DocSection[]
  aiCapabilities: { capability: string; desc: string }[]
  troubleshooting: { issue: string; solution: string }[]
  faq: { q: string; a: string }[]
}

export default function ProductDoc(props: ProductDocProps) {
  const { isDark } = useTheme()
  const dark = isDark
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'features', label: 'Features' },
    ...(props.apiEndpoints?.length ? [{ id: 'api', label: 'API Reference' }] : []),
    { id: 'user-guide', label: 'User Manual' },
    { id: 'ai', label: 'AI Capabilities' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'faq', label: 'FAQ' },
  ]

  const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
  const cardBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={dark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={120} height={32} style={{ mixBlendMode: dark ? 'screen' : 'multiply' }} />
          </Link>
          <span style={{ color: 'var(--ept-text-muted)', fontSize: '0.85rem' }}>/</span>
          <Link href="/docs" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Docs</Link>
          <span style={{ color: 'var(--ept-text-muted)', fontSize: '0.85rem' }}>/</span>
          <span className="text-sm font-semibold" style={{ color: props.accent }}>{props.name}</span>
        </div>
        <Link href={props.productUrl} className="text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: props.accent, color: '#fff' }}>
          Try {props.name}
        </Link>
      </nav>

      {/* Header */}
      <section style={{ padding: '48px 20px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{props.name}</h1>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, color: 'var(--ept-text-muted)' }}>v{props.version}</span>
        </div>
        <p style={{ color: 'var(--ept-text-secondary)', fontSize: '1.1rem' }}>{props.tagline}</p>
        {props.workerUrl && (
          <p className="mt-2 text-sm font-mono" style={{ color: 'var(--ept-text-muted)' }}>Worker: {props.workerUrl}</p>
        )}
      </section>

      {/* Tab Navigation */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: `1px solid ${cardBorder}` }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
                color: activeTab === tab.id ? props.accent : 'var(--ept-text-secondary)',
                borderBottom: activeTab === tab.id ? `2px solid ${props.accent}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>

        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Overview</h2>
            {props.overview.map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed" style={{ color: 'var(--ept-text-secondary)', fontSize: '1rem' }}>{p}</p>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                <div className="text-2xl font-bold" style={{ color: props.accent }}>{props.features.length}</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Features</div>
              </div>
              {props.apiEndpoints && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="text-2xl font-bold" style={{ color: props.accent }}>{props.apiEndpoints.length}</div>
                  <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>API Endpoints</div>
                </div>
              )}
              <div className="p-4 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                <div className="text-2xl font-bold" style={{ color: props.accent }}>{props.aiCapabilities.length}</div>
                <div className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>AI Capabilities</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'getting-started' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Getting Started</h2>
            <div className="space-y-6">
              {props.gettingStarted.map(step => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: props.accent, color: '#fff' }}>
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Feature Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {props.features.map(f => (
                <div key={f.title} className="p-5 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <h3 className="font-semibold mb-2" style={{ color: props.accent }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api' && props.apiEndpoints && (
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>API Reference</h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              Base URL: <code className="font-mono px-2 py-0.5 rounded" style={{ backgroundColor: cardBg }}>{props.workerUrl || 'https://echo-sdk-gateway.bmcii1976.workers.dev'}</code>
              &nbsp;&bull;&nbsp;Auth: <code className="font-mono px-2 py-0.5 rounded" style={{ backgroundColor: cardBg }}>X-Echo-API-Key: your-key</code>
            </p>
            <div className="space-y-3">
              {props.apiEndpoints.map((ep, i) => (
                <div key={i} className="p-4 rounded-xl font-mono text-sm" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{
                      backgroundColor: ep.method === 'GET' ? '#22c55e20' : ep.method === 'POST' ? '#3b82f620' : ep.method === 'PUT' ? '#f59e0b20' : '#ef444420',
                      color: ep.method === 'GET' ? '#22c55e' : ep.method === 'POST' ? '#3b82f6' : ep.method === 'PUT' ? '#f59e0b' : '#ef4444',
                    }}>{ep.method}</span>
                    <span style={{ color: 'var(--ept-text)' }}>{ep.path}</span>
                    {ep.auth && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>Auth</span>}
                  </div>
                  <p className="font-sans text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'user-guide' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>User Manual</h2>
            <div className="space-y-8">
              {props.userGuide.map(section => (
                <div key={section.id} id={section.id}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: props.accent }}>{section.title}</h3>
                  {section.content.map((p, i) => (
                    <p key={i} className="mb-3 leading-relaxed text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>AI Capabilities</h2>
            <div className="space-y-4">
              {props.aiCapabilities.map((cap, i) => (
                <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <h3 className="font-semibold mb-2" style={{ color: props.accent }}>{cap.capability}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'troubleshooting' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Troubleshooting</h2>
            <div className="space-y-4">
              {props.troubleshooting.map((item, i) => (
                <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#ef4444' }}>{item.issue}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
            {props.faq.map(faq => (
              <details key={faq.q} className="mb-3" style={{ padding: 20, borderRadius: 12, backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
                <summary className="font-semibold cursor-pointer" style={{ color: 'var(--ept-text)' }}>{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
