'use client';

/* ==============================================================================
   BLOODLINE PANEL — the owner's evidence-graded ancestry tree, inside the vault.
   Renders the P1 tree (/bloodline/{user}/tree): direct line by generation, every
   fact carried with its source + confidence, refuted family legends shown honestly
   (never silently dropped), living relatives kept private (owner-only view).
   ============================================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ACCENT, GOLD, BG_CARD, BORDER } from '../lib/constants';
import {
  getBloodlineTree, getBloodlineRecords, uploadBloodlineRecord, bloodlineRecordImageUrl,
  type BloodlineTree, type BloodlineNode, type BloodlineEdge, type BloodlineRecord,
} from '../lib/vault-api';

/* confidence → label + colour (matches the API's confidence_legend ranking) */
const CONF: Record<string, { label: string; color: string }> = {
  CONFIRMED_PRIMARY_SOURCE: { label: 'Primary source', color: '#34d399' },
  CONFIRMED_SECONDARY_SOURCE: { label: 'Secondary source', color: '#4ade80' },
  CONFIRMED_FAMILY_TESTIMONY: { label: 'Family testimony', color: '#22d3ee' },
  PROBABLE: { label: 'Probable', color: '#fbbf24' },
  POSSIBLE: { label: 'Possible', color: '#fb923c' },
  UNCONFIRMED: { label: 'Unconfirmed', color: '#94a3b8' },
  REFUTED: { label: 'Refuted', color: '#f87171' },
};
function conf(c: string) { return CONF[c] || { label: (c || 'Unknown').replace(/_/g, ' ').toLowerCase(), color: '#94a3b8' }; }

function lifespan(n: BloodlineNode): string {
  const b = n.birth_date || '', d = n.death_date || '';
  if (!b && !d) return n.living ? 'living' : '';
  return `${b || '?'} – ${n.living ? 'living' : (d || '?')}`;
}

export default function BloodlinePanel({ userId }: { userId: string | null }) {
  const [tree, setTree] = useState<BloodlineTree | null>(null);
  const [records, setRecords] = useState<BloodlineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true); setError(null);
    try {
      const [t, r] = await Promise.all([getBloodlineTree(userId), getBloodlineRecords(userId).catch(() => ({ records: [] }))]);
      setTree(t); setRecords(r.records || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your bloodline.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = useCallback(async (file: File, personKey?: string) => {
    if (!userId || !file) return;
    setUploading(true); setUploadMsg(null);
    try {
      const res = await uploadBloodlineRecord(userId, file, personKey ? { person_key: personKey } : {});
      const hits = (res.matched || []).filter(m => m.matched_person);
      const props = res.proposals || [];
      setUploadMsg(
        `Read a ${(res.record_type || 'record').replace(/_/g, ' ')}. ` +
        (hits.length ? `Attached to ${hits.map(m => m.matched_person).join(', ')}. ` : '') +
        (props.length ? `New name${props.length > 1 ? 's' : ''} found: ${props.map(p => p.name).join(', ')} (add them to place the record).` : 'Every name matched.')
      );
      await load();
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }, [userId, load]);

  if (loading) return <div style={{ padding: 40, color: '#94a3b8' }}>Tracing your bloodline…</div>;
  if (error) return (
    <div style={{ padding: 40 }}>
      <div style={{ color: '#f87171', marginBottom: 14 }}>{error}</div>
      <button onClick={load} style={btn(true)}>Try again</button>
    </div>
  );
  if (!tree || !tree.nodes?.length) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🌳</div>
      <div style={{ fontSize: 18, color: '#e5e7eb', marginBottom: 8 }}>Your bloodline is empty</div>
      <div style={{ maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
        Add the people you know in Family Vault, or upload a record (a death certificate, a census page)
        and we&rsquo;ll place them — with the source that proves it — into your tree.
      </div>
    </div>
  );

  const byKey = new Map(tree.nodes.map(n => [n.person_key, n]));
  const recsByPerson = new Map<string, BloodlineRecord[]>();
  records.forEach(r => { if (r.person_key) recsByPerson.set(r.person_key, [...(recsByPerson.get(r.person_key) || []), r]); });

  /* Walk the direct line UP from the root, grouped by generation. */
  const parentsOf = new Map<string, string[]>();
  tree.edges.filter((e: BloodlineEdge) => e.rel_type === 'parent').forEach(e => {
    parentsOf.set(e.to_person, [...(parentsOf.get(e.to_person) || []), e.from_person]);
  });
  const generations: BloodlineNode[][] = [];
  const seen = new Set<string>();
  let frontier = [tree.root].filter(k => byKey.has(k));
  const GEN_NAMES = ['You', 'Parents', 'Grandparents', 'Great-grandparents', '2× great-grandparents',
    '3× great-grandparents', '4× great-grandparents', '5× great-grandparents', '6× great-grandparents'];
  while (frontier.length) {
    const gen = frontier.map(k => byKey.get(k)!).filter(Boolean).filter(n => !seen.has(n.person_key));
    gen.forEach(n => seen.add(n.person_key));
    if (gen.length) generations.push(gen);
    frontier = frontier.flatMap(k => parentsOf.get(k) || []);
  }
  /* Anyone in the tree not reached on the direct line (collateral kin, refuted legends). */
  const offLine = tree.nodes.filter(n => !seen.has(n.person_key) && n.confidence !== 'REFUTED');
  const refuted = tree.nodes.filter(n => n.confidence === 'REFUTED');

  const S = tree.stats || { persons: 0, relationships: 0, refuted_legends: 0, living_redacted: 0 };

  return (
    <div style={{ padding: '8px 4px 40px' }}>
      {/* header + stats */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: '#94a3b8', margin: '0 0 16px', maxWidth: 620, lineHeight: 1.6 }}>
          Your family line, back through the generations. Every fact carries the record that proves it —
          and where a story couldn&rsquo;t be verified, we say so plainly rather than invent it.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['People', S.persons], ['Relationships', S.relationships], ['Documents', records.length],
            ['Refuted legends', S.refuted_legends],
            ...(S.living_redacted ? [['Living (private)', S.living_redacted] as [string, number]] : [])].map(([l, v]) => (
            <div key={l} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 18px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>{v as number}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{l as string}</div>
            </div>
          ))}
        </div>

        {/* upload a document — OCR auto-matches it to the right person */}
        <div style={{ marginTop: 16, background: BG_CARD, border: `1px dashed ${BORDER}`, borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); if (fileRef.current) fileRef.current.value = ''; }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={btn(true)}>
            {uploading ? 'Reading the record…' : 'Upload a document'}
          </button>
          <div style={{ fontSize: 13, color: '#94a3b8', flex: 1, minWidth: 200 }}>
            {uploadMsg || 'A birth or death certificate, a census page, a grave marker. We read it, attach every fact to the right person with the source, and keep the image encrypted.'}
          </div>
        </div>
      </div>

      {/* generational direct line */}
      {generations.map((gen, gi) => (
        <section key={gi} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 12px' }}>
            <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, fontWeight: 600 }}>
              {GEN_NAMES[gi] || `${gi}× great-grandparents`}
            </span>
            <span style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {gen.map(n => <PersonCard key={n.person_key} n={n} open={openKey === n.person_key}
              onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
              userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} uploading={uploading} />)}
          </div>
        </section>
      ))}

      {/* collateral / not-yet-linked kin */}
      {offLine.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 12px' }}>
            <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, fontWeight: 600 }}>Other kin &amp; spouses</span>
            <span style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {offLine.map(n => <PersonCard key={n.person_key} n={n} open={openKey === n.person_key}
              onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
              userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} uploading={uploading} />)}
          </div>
        </section>
      )}

      {/* refuted family legends — shown honestly */}
      {refuted.length > 0 && (
        <section style={{ marginTop: 26, background: '#1a0f0f', border: '1px solid #4c2626', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ color: '#f87171', fontWeight: 600, marginBottom: 6 }}>Family legends we could not confirm</div>
          <p style={{ color: '#c99', fontSize: 13.5, margin: '0 0 14px', lineHeight: 1.6 }}>
            Handed-down claims that the records contradict or can&rsquo;t support. We keep them here, honestly marked,
            rather than let a good story pose as a fact in your tree.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {refuted.map(n => (
              <div key={n.person_key} style={{ fontSize: 14 }}>
                <span style={{ color: '#e5e7eb', textDecoration: 'line-through' }}>{n.name}</span>
                {n.bio && <span style={{ color: '#a88', marginLeft: 8 }}>— {n.bio}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PersonCard({ n, open, onToggle, userId, records, onUpload, uploading }: {
  n: BloodlineNode; open: boolean; onToggle: () => void;
  userId: string | null; records: BloodlineRecord[]; onUpload: (f: File, personKey?: string) => void; uploading: boolean;
}) {
  const c = conf(n.confidence);
  const span = lifespan(n);
  const fileRef = useRef<HTMLInputElement>(null);
  const hasDetail = !!(n.bio || n.birth_place || n.death_place || n.buried || (n.sources && n.sources.length) || records.length);
  return (
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: 15.5 }}>{n.name}</div>
          {span && <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{span}{n.birth_place ? ` · ${n.birth_place}` : ''}</div>}
        </div>
        <span title={n.confidence} style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: c.color, border: `1px solid ${c.color}55`, background: `${c.color}18`, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
          {c.label}
        </span>
      </div>

      {hasDetail && (
        <button onClick={onToggle} style={{ marginTop: 10, background: 'none', border: 'none', color: ACCENT, fontSize: 12.5, cursor: 'pointer', padding: 0 }}>
          {open ? 'Hide details' : 'Details & sources'}
        </button>
      )}
      {open && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {n.bio && <div style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.55 }}>{n.bio}</div>}
          {(n.death_place || n.buried) && (
            <div style={{ fontSize: 12.5, color: '#94a3b8' }}>
              {n.death_place ? `Died in ${n.death_place}. ` : ''}{n.buried ? `Buried at ${n.buried}.` : ''}
            </div>
          )}
          {n.sources && n.sources.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 4 }}>Sources</div>
              {n.sources.map((s, i) => (
                <div key={i} style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.5 }}>
                  • {s.citation || s.fact || 'record'}{s.confidence ? <span style={{ color: conf(s.confidence).color }}> ({conf(s.confidence).label})</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>No source attached yet — upload a record to confirm this person.</div>
          )}
          {/* attached documents (decrypted, owner-only, opens in a new tab) */}
          {userId && records.length > 0 && (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 6 }}>Documents</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {records.map(r => (
                  <a key={r.id} href={bloodlineRecordImageUrl(userId, r.id)} target="_blank" rel="noopener noreferrer"
                    title={`${r.record_type.replace(/_/g, ' ')} — ${r.file_name}`}
                    style={{ display: 'block', width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: `1px solid ${BORDER}`, background: '#000' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bloodlineRecordImageUrl(userId, r.id)} alt={r.record_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {userId && (
            <div>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, n.person_key); if (fileRef.current) fileRef.current.value = ''; }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: 'none', border: `1px solid ${BORDER}`, color: ACCENT, fontSize: 12, borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
                {uploading ? 'Reading…' : `+ Attach a record to ${n.name.split(' ')[0]}`}
              </button>
            </div>
          )}
          {!n.living && n.persona_status === 'live' && (
            <div style={{ fontSize: 12.5, color: GOLD }}>✦ You can talk with {n.name.split(' ')[0]} in Ancestor Chat.</div>
          )}
        </div>
      )}
    </div>
  );
}

function btn(primary: boolean): React.CSSProperties {
  return { padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    border: primary ? 'none' : `1px solid ${ACCENT}`, background: primary ? ACCENT : 'transparent', color: primary ? '#0a0a0f' : ACCENT };
}
