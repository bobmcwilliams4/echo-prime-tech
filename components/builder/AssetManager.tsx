'use client';

import React, { useState, useCallback, useRef } from 'react';

interface Asset {
  id: string;
  name: string;
  src: string; // base64 data URI
  type: string;
  size: number;
  width?: number;
  height?: number;
  addedAt: number;
}

interface AssetManagerProps {
  onInsertImage: (src: string) => void;
  editorRef: React.MutableRefObject<any>;
}

const COLORS = {
  bg: '#0f1219',
  surface: '#1a1f2e',
  border: '#2a2f3e',
  accent: '#C9A94E',
  text: '#e2e8f0',
  muted: '#9ca3af',
  danger: '#ef4444',
};

const STORAGE_KEY = 'echo-builder-assets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

function loadAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAssets(assets: Asset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch {
    // localStorage full — remove oldest assets until it fits
    const sorted = [...assets].sort((a, b) => a.addedAt - b.addedAt);
    while (sorted.length > 0) {
      sorted.shift();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        return;
      } catch { /* keep removing */ }
    }
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = src;
  });
}

export default function AssetManager({ onInsertImage, editorRef }: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>(loadAssets);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const newAssets: Asset[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Unsupported format: ${file.name}. Use PNG, JPG, GIF, WebP, or SVG.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name} (${formatSize(file.size)}). Max 5MB.`);
        continue;
      }

      const src = await readFileAsDataURL(file);
      const dims = await getImageDimensions(src);
      newAssets.push({
        id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        src,
        type: file.type,
        size: file.size,
        width: dims.width,
        height: dims.height,
        addedAt: Date.now(),
      });
    }

    if (newAssets.length > 0) {
      const updated = [...assets, ...newAssets];
      setAssets(updated);
      saveAssets(updated);

      // Register with GrapeJS asset manager
      if (editorRef.current) {
        const am = editorRef.current.AssetManager;
        if (am) {
          newAssets.forEach(a => {
            am.add({ src: a.src, name: a.name, type: 'image', width: a.width, height: a.height });
          });
        }
      }
    }
  }, [assets, editorRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  }, [addFiles]);

  const handleDelete = useCallback((id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    saveAssets(updated);
    if (selectedId === id) setSelectedId(null);
  }, [assets, selectedId]);

  const handleInsert = useCallback((asset: Asset) => {
    onInsertImage(asset.src);
  }, [onInsertImage]);

  const handleClearAll = useCallback(() => {
    setAssets([]);
    saveAssets([]);
    setSelectedId(null);
  }, []);

  const selectedAsset = assets.find(a => a.id === selectedId);

  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? COLORS.accent : COLORS.border}`,
          borderRadius: 10,
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? `${COLORS.accent}11` : 'transparent',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 4 }}>
          {isDragging ? '\u{1F4E5}' : '\u{1F5BC}'}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>
          {isDragging ? 'Drop images here' : 'Upload Images'}
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted }}>
          Drag & drop or click to browse. PNG, JPG, GIF, WebP, SVG. Max 5MB.
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Error */}
      {error && (
        <div style={{ padding: '8px 12px', borderRadius: 8, background: '#ef444422', border: '1px solid #ef444444', fontSize: 12, color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {/* Asset Count + Clear */}
      {assets.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: COLORS.muted }}>{assets.length} image{assets.length !== 1 ? 's' : ''}</span>
          <button
            onClick={handleClearAll}
            style={{
              border: 'none', background: 'transparent', color: COLORS.danger,
              fontSize: 11, cursor: 'pointer', padding: '2px 6px',
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Asset Grid */}
      {assets.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedId(selectedId === asset.id ? null : asset.id)}
              style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                border: selectedId === asset.id ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                cursor: 'pointer',
                aspectRatio: '1',
                background: COLORS.surface,
              }}
            >
              <img
                src={asset.src}
                alt={asset.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', asset.src);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Selected Asset Details */}
      {selectedAsset && (
        <div style={{ padding: 12, borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedAsset.name}
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 8 }}>
            {selectedAsset.width}&times;{selectedAsset.height}px &middot; {formatSize(selectedAsset.size)} &middot; {selectedAsset.type.split('/')[1].toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handleInsert(selectedAsset)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none',
                background: COLORS.accent, color: '#fff', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Insert on Canvas
            </button>
            <button
              onClick={() => handleDelete(selectedAsset.id)}
              style={{
                padding: '8px 12px', borderRadius: 8, border: `1px solid ${COLORS.danger}44`,
                background: 'transparent', color: COLORS.danger, fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {assets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
            No images uploaded yet.<br />
            Upload images to use in your website design.
          </div>
        </div>
      )}

      {/* URL Import */}
      <URLImport onAdd={(src, name) => {
        const asset: Asset = {
          id: `asset-${Date.now()}`,
          name: name || 'external-image',
          src,
          type: 'image/url',
          size: 0,
          addedAt: Date.now(),
        };
        const updated = [...assets, asset];
        setAssets(updated);
        saveAssets(updated);
      }} />
    </div>
  );
}

/* ── URL Import sub-component ── */
function URLImport({ onAdd }: { onAdd: (src: string, name: string) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      // Validate it loads as an image
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Invalid image URL'));
        img.src = url;
      });
      const name = url.split('/').pop()?.split('?')[0] || 'external-image';
      onAdd(url, name);
      setUrl('');
    } catch {
      // silently fail — the image URL was invalid
    } finally {
      setLoading(false);
    }
  }, [url, onAdd]);

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 6 }}>Import from URL</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          onKeyDown={e => e.key === 'Enter' && handleImport()}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #2a2f3e',
            background: '#1a1f2e', color: '#e2e8f0', fontSize: 12, outline: 'none',
          }}
        />
        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          style={{
            padding: '8px 14px', borderRadius: 8, border: 'none',
            background: loading ? '#2a2f3e' : '#C9A94E', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            opacity: !url.trim() ? 0.5 : 1,
          }}
        >
          {loading ? '...' : 'Add'}
        </button>
      </div>
    </div>
  );
}
