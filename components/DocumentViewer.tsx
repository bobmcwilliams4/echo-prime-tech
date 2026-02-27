'use client';

import { useEffect, useRef, useState } from 'react';

interface DocumentViewerProps {
  html: string;
  sessionId: string;
  onClose: () => void;
}

export default function DocumentViewer({ html, sessionId, onClose }: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Use shadow DOM to isolate document styles
    const existing = containerRef.current.shadowRoot;
    const shadow = existing || containerRef.current.attachShadow({ mode: 'open' });
    shadow.innerHTML = html;
  }, [html]);

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chain_of_title_${sessionId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div style={{
      ...styles.overlay,
      ...(isFullscreen ? styles.fullscreen : {}),
    }}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <span style={styles.toolbarTitle}>Chain of Title Document</span>
          <span style={styles.toolbarMeta}>Session: {sessionId.slice(0, 16)}...</span>
        </div>
        <div style={styles.toolbarRight}>
          <button onClick={handleDownload} style={styles.toolBtn} title="Download HTML">
            <DownloadIcon /> Download
          </button>
          <button onClick={handlePrint} style={styles.toolBtn} title="Print / PDF">
            <PrintIcon /> Print
          </button>
          <button onClick={toggleFullscreen} style={styles.toolBtn} title="Toggle Fullscreen">
            <FullscreenIcon /> {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
          <button onClick={onClose} style={styles.closeBtn} title="Close">
            &#10005;
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div style={styles.documentWrapper}>
        <div ref={containerRef} style={styles.documentContainer} />
      </div>
    </div>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--ept-bg, #0a0e17)',
  },
  fullscreen: {
    position: 'fixed',
    inset: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'var(--ept-surface, #111827)',
    borderBottom: '1px solid var(--ept-border, #374151)',
    flexShrink: 0,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolbarTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--ept-text, #e5e7eb)',
  },
  toolbarMeta: {
    fontSize: '12px',
    color: 'var(--ept-text-dim, #6b7280)',
    fontFamily: 'monospace',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'var(--ept-surface2, #1f2937)',
    color: 'var(--ept-text, #e5e7eb)',
    border: '1px solid var(--ept-border, #374151)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'background 0.15s',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
  },
  documentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '0',
  },
  documentContainer: {
    width: '100%',
    minHeight: '100%',
  },
};
