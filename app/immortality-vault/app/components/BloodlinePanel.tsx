'use client';

/* ==============================================================================
   BLOODLINE PANEL — the owner's evidence-graded ancestry tree, inside the vault.
   Black + bright-gold. Two views: a graphical SVG pedigree ("Tree") and the
   list-by-generation ("Generations"). Every fact carries its source + confidence;
   refuted legends are shown honestly; living relatives stay private (owner-only).
   ============================================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ACCENT, GOLD, GOLD_DEEP, BG_CARD, BG_CARD2, BG_INSET, BORDER, HAIR, IVORY, MUTED,
} from '../lib/constants';
import {
  getBloodlineTree, getBloodlineRecords, uploadBloodlineRecord, uploadPersonPhoto, bloodlineRecordImageUrl,
  type BloodlineTree, type BloodlineNode, type BloodlineEdge, type BloodlineRecord,
} from '../lib/vault-api';
import VaultIcon from './VaultIcon';
import BloodlineTreeGraph from './BloodlineTreeGraph';

/* Atmospheric gold-on-black backdrop behind the tree — a gold-tree-roots-on-black
   render, drawn behind the nodes at low opacity under a dark scrim (handled in
   BloodlineTreeGraph) so the gold cards read clearly over it. */
const TREE_BG: string | undefined = '/immortality-vault/tree-bg.jpg';

/* confidence → label + colour (matches the API's confidence_legend ranking) */
const CONF: Record<string, { label: string; color: string }> = {
  CONFIRMED_PRIMARY_SOURCE: { label: 'Primary source', color: '#34d399' },
  CONFIRMED_SECONDARY_SOURCE: { label: 'Secondary source', color: '#4ade80' },
  CONFIRMED_FAMILY_TESTIMONY: { label: 'Family testimony', color: '#22d3ee' },
  PROBABLE: { label: 'Probable', color: '#f5c451' },
  POSSIBLE: { label: 'Possible', color: '#fb923c' },
  UNCONFIRMED: { label: 'Unconfirmed', color: '#a99e8b' },
  REFUTED: { label: 'Refuted', color: '#f87171' },
};
function conf(c: string) { return CONF[c] || { label: (c || 'Unknown').replace(/_/g, ' ').toLowerCase(), color: MUTED }; }

function lifespan(n: BloodlineNode): string {
  const b = n.birth_date || '', d = n.death_date || '';
  if (!b && !d) return n.living ? 'living' : '';
  return `${b || '?'} – ${n.living ? 'living' : (d || '?')}`;
}
function monogram(name: string | null | undefined): string {
  return ((name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()) || '·';
}
function firstName(name: string | null | undefined): string {
  return (name ?? '').split(' ').filter(Boolean)[0] || 'them';
}

/* Circular gold-framed portrait, or a gold monogram placeholder. */
function Avatar({ n, userId, size = 46 }: { n: BloodlineNode; userId: string | null; size?: number }) {
  const src = n.photo_url ?? (userId && n.photo_record_id ? bloodlineRecordImageUrl(userId, n.photo_record_id) : null);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative',
      background: BG_CARD2, border: `1.5px solid ${GOLD_DEEP}`, boxShadow: `0 0 0 3px rgba(245,196,81,0.06)`,
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: GOLD, fontSize: size * 0.32, fontFamily: 'Cormorant Garamond, Georgia, serif', letterSpacing: '0.02em' }}>{monogram(n.name)}</span>}
    </div>
  );
}

export default function BloodlinePanel({ userId }: { userId: string | null }) {
  const [tree, setTree] = useState<BloodlineTree | null>(null);
  const [records, setRecords] = useState<BloodlineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [view, setView] = useState<'tree' | 'generations'>('tree');
  const [detailKey, setDetailKey] = useState<string | null>(null);
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

  const handlePhoto = useCallback(async (file: File, personKey: string) => {
    if (!userId || !file) return;
    setUploading(true); setUploadMsg(null);
    try {
      await uploadPersonPhoto(userId, personKey, file);
      setUploadMsg('Portrait saved.');
      await load();
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : 'Portrait upload failed.');
    } finally {
      setUploading(false);
    }
  }, [userId, load]);

  if (loading) return <div style={{ padding: 40, color: MUTED }}>Tracing your bloodline…</div>;
  if (error) return (
    <div style={{ padding: 40 }}>
      <div style={{ color: '#f87171', marginBottom: 14 }}>{error}</div>
      <button onClick={load} style={btn(true)}>Try again</button>
    </div>
  );
  if (!tree || !tree.nodes?.length) return (
    <div style={{ padding: 48, textAlign: 'center', color: MUTED }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: GOLD_DEEP }}><VaultIcon name="bloodline" size={44} /></div>
      <div style={{ fontSize: 19, color: IVORY, marginBottom: 8, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Your bloodline is empty</div>
      <div style={{ maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
        Add the people you know in Family Vault, or upload a record (a death certificate, a census page)
        and we&rsquo;ll place them — with the source that proves it — into your tree.
      </div>
    </div>
  );

  const byKey = new Map(tree.nodes.map(n => [n.person_key, n]));
  const recsByPerson = new Map<string, BloodlineRecord[]>();
  records.forEach(r => { if (r.person_key) recsByPerson.set(r.person_key, [...(recsByPerson.get(r.person_key) || []), r]); });

  /* BLOOD parent edges, mapped both ways so we can walk UP (ancestors) and DOWN
     (descendants) from the root. parentsOf (child → parents) also feeds the graph's
     edge routine — a parent always sits one row above its child in either direction. */
  const parentsOf = new Map<string, string[]>();   // child  → parents
  const childrenOf = new Map<string, string[]>();  // parent → children
  tree.edges.filter((e: BloodlineEdge) => e.rel_type === 'parent' && e.bio !== false).forEach(e => {
    parentsOf.set(e.to_person, [...(parentsOf.get(e.to_person) || []), e.from_person]);
    childrenOf.set(e.from_person, [...(childrenOf.get(e.from_person) || []), e.to_person]);
  });
  /* Non-bloodline family (step/adoptive/foster/guardian). */
  const nonBioKeys = new Map<string, string>();
  tree.edges.filter((e: BloodlineEdge) => e.bio === false).forEach(e => {
    [e.from_person, e.to_person].forEach(k => { if (k !== tree.root) nonBioKeys.set(k, e.relation_subtype || 'step'); });
  });

  const seen = new Set<string>();

  /* Ancestors UP from the root — generations[0] = You, [1] = Parents, … */
  const generations: BloodlineNode[][] = [];
  const GEN_NAMES = ['You', 'Parents', 'Grandparents', 'Great-grandparents', '2× great-grandparents',
    '3× great-grandparents', '4× great-grandparents', '5× great-grandparents', '6× great-grandparents'];
  let upFrontier = [tree.root].filter(k => byKey.has(k));
  while (upFrontier.length) {
    const gen = upFrontier.map(k => byKey.get(k)!).filter(Boolean).filter(n => !seen.has(n.person_key));
    gen.forEach(n => seen.add(n.person_key));
    if (gen.length) generations.push(gen);
    upFrontier = upFrontier.flatMap(k => parentsOf.get(k) || []);
  }

  /* Descendants DOWN from the root — descendants[0] = Children, [1] = Grandchildren, … */
  const descendants: BloodlineNode[][] = [];
  const DESC_NAMES = ['Children', 'Grandchildren', 'Great-grandchildren', '2× great-grandchildren',
    '3× great-grandchildren', '4× great-grandchildren', '5× great-grandchildren'];
  let downFrontier = (childrenOf.get(tree.root) || []).filter(k => byKey.has(k) && !nonBioKeys.has(k));
  while (downFrontier.length) {
    const gen = downFrontier.map(k => byKey.get(k)!).filter(Boolean).filter(n => !seen.has(n.person_key));
    gen.forEach(n => seen.add(n.person_key));
    if (gen.length) descendants.push(gen);
    downFrontier = downFrontier.flatMap(k => (childrenOf.get(k) || []).filter(c => !nonBioKeys.has(c)));
  }

  /* The DIRECT line: root + ancestors + descendants (everything walked above). */
  const directKeys = new Set<string>(seen);

  /* ── COLLATERAL-AWARE TREE ROWS ──────────────────────────────────────────
     Place EVERY blood relative by a signed generation (root = 0, ancestors +,
     descendants −), reached by walking parent edges up AND child edges down
     from the root. This picks up siblings (gen 0), aunts/uncles (gen +1),
     cousins (gen 0), nieces/nephews (gen −1) and married-in spouses — all with
     their real parent edges, so the graph's edge routine connects each to its
     own parent one row above, instead of dropping them into a leftover list. */
  const generationOf = new Map<string, number>();
  generationOf.set(tree.root, 0);
  {
    const q: string[] = [tree.root];
    while (q.length) {
      const k = q.shift()!;
      const g = generationOf.get(k)!;
      (parentsOf.get(k) || []).forEach(p => { if (byKey.has(p) && !generationOf.has(p)) { generationOf.set(p, g + 1); q.push(p); } });
      (childrenOf.get(k) || []).forEach(c => { if (byKey.has(c) && !generationOf.has(c)) { generationOf.set(c, g - 1); q.push(c); } });
    }
  }

  /* Order each generation top→bottom so children cluster under their parents
     and married-in spouses sit beside their partner — while the direct-line
     spine stays legible. `order` accumulates row-by-row from the top down. */
  const order = new Map<string, number>();
  const meanParentOrder = (k: string) => {
    const ps = (parentsOf.get(k) || []).filter(p => order.has(p));
    return ps.length ? ps.reduce((s, p) => s + order.get(p)!, 0) / ps.length : Number.POSITIVE_INFINITY;
  };
  const findPartner = (k: string, members: string[]) => {
    for (const c of childrenOf.get(k) || []) {
      for (const p of parentsOf.get(c) || []) {
        if (p !== k && members.includes(p)) return p; // a co-parent in the same generation
      }
    }
    return null;
  };
  const gensPresent = Array.from(new Set(generationOf.values())).sort((a, b) => b - a); // high (oldest) → low
  const treeRows: BloodlineNode[][] = [];
  for (const g of gensPresent) {
    const members = Array.from(generationOf.entries()).filter(([, gg]) => gg === g).map(([k]) => k);
    const withParents = members.filter(k => (parentsOf.get(k) || []).some(p => order.has(p)));
    const withoutParents = members.filter(k => !(parentsOf.get(k) || []).some(p => order.has(p)));
    withParents.sort((a, b) => (meanParentOrder(a) - meanParentOrder(b)) || a.localeCompare(b));
    const seq: string[] = [...withParents];
    // Splice married-in spouses in right beside their partner; true top
    // ancestors (no partner in this row) append in stable order.
    withoutParents.sort((a, b) => a.localeCompare(b));
    for (const s of withoutParents) {
      const partner = findPartner(s, members);
      const idx = partner ? seq.indexOf(partner) : -1;
      if (idx >= 0) seq.splice(idx + 1, 0, s); else seq.push(s);
    }
    seq.forEach((k, i) => order.set(k, i));
    treeRows.push(seq.map(k => byKey.get(k)!).filter(Boolean));
  }

  /* Relation labels for the four named collateral categories (shown as pills). */
  const relLabel = new Map<string, string>();
  {
    const rootParents = new Set(parentsOf.get(tree.root) || []);
    const grandparents = new Set<string>();
    rootParents.forEach(p => (parentsOf.get(p) || []).forEach(gp => grandparents.add(gp)));
    const mark = (keys: Iterable<string>, label: string) => { for (const k of keys) if (!directKeys.has(k)) relLabel.set(k, label); };
    const siblings = new Set<string>();
    rootParents.forEach(p => (childrenOf.get(p) || []).forEach(c => { if (c !== tree.root) siblings.add(c); }));
    const auntsUncles = new Set<string>();
    grandparents.forEach(gp => (childrenOf.get(gp) || []).forEach(c => { if (!rootParents.has(c)) auntsUncles.add(c); }));
    const cousins = new Set<string>();
    auntsUncles.forEach(a => (childrenOf.get(a) || []).forEach(c => cousins.add(c)));
    const niblings = new Set<string>();
    siblings.forEach(s => (childrenOf.get(s) || []).forEach(c => niblings.add(c)));
    mark(siblings, 'sibling');
    mark(auntsUncles, 'aunt · uncle');
    mark(cousins, 'cousin');
    mark(niblings, 'niece · nephew');
  }

  const offLine = tree.nodes.filter(n => !seen.has(n.person_key) && !generationOf.has(n.person_key) && n.confidence !== 'REFUTED' && !nonBioKeys.has(n.person_key));
  const stepFamily = tree.nodes.filter(n => nonBioKeys.has(n.person_key));
  const refuted = tree.nodes.filter(n => n.confidence === 'REFUTED');
  const stepForGraph = stepFamily.map(n => ({ node: n, subtype: nonBioKeys.get(n.person_key) || 'step' }));

  const S = tree.stats || { persons: 0, relationships: 0, refuted_legends: 0, living_redacted: 0 };
  const detailNode = detailKey ? byKey.get(detailKey) : null;

  return (
    <div style={{ padding: '8px 4px 40px' }}>
      {/* header + stats */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: MUTED, margin: '0 0 16px', maxWidth: 620, lineHeight: 1.6 }}>
          Your family line, back through the generations. Every fact carries the record that proves it —
          and where a story couldn&rsquo;t be verified, we say so plainly rather than invent it.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['People', S.persons], ['Relationships', S.relationships], ['Documents', records.length],
            ['Refuted legends', S.refuted_legends],
            ...(S.living_redacted ? [['Living (private)', S.living_redacted] as [string, number]] : [])].map(([l, v]) => (
            <div key={l} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '12px 18px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>{v as number}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{l as string}</div>
            </div>
          ))}
        </div>

        {/* upload a document — OCR auto-matches it to the right person */}
        <div style={{ marginTop: 16, background: BG_CARD, border: `1px dashed ${BORDER}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); if (fileRef.current) fileRef.current.value = ''; }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={btn(true)}>
            {uploading ? 'Reading the record…' : 'Upload a document'}
          </button>
          <div style={{ fontSize: 13, color: MUTED, flex: 1, minWidth: 200 }}>
            {uploadMsg || 'A birth or death certificate, a census page, a grave marker. We read it, attach every fact to the right person with the source, and keep the image encrypted.'}
          </div>
        </div>
      </div>

      {/* view switcher */}
      <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: BG_INSET, border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 18 }}>
        {([['tree', 'Tree', 'bloodline'], ['generations', 'Generations', 'progress']] as const).map(([v, label, icon]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 15px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all .15s',
              background: view === v ? 'rgba(245,196,81,0.14)' : 'transparent',
              color: view === v ? ACCENT : MUTED }}>
            <VaultIcon name={icon} size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── TREE VIEW ── */}
      {view === 'tree' && (
        <>
          <BloodlineTreeGraph
            rows={treeRows}
            rootKey={tree.root}
            parentsOf={parentsOf}
            stepFamily={stepForGraph}
            userId={userId}
            photoUrl={(id) => tree.nodes.find(n => n.photo_record_id === id)?.photo_url ?? (userId ? bloodlineRecordImageUrl(userId, id) : '')}
            onSelect={(k) => setDetailKey(k)}
            bgUrl={TREE_BG}
            directKeys={directKeys}
            relLabel={relLabel}
          />
          <div style={{ marginTop: 10, fontSize: 12, color: MUTED, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>Drag to pan · scroll to zoom · click a person for details.</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 10, borderRadius: 3, border: `1px solid ${GOLD_DEEP}`, opacity: 0.7, transform: 'scale(0.85)' }} /> extended family — siblings, aunts &amp; uncles, cousins, nieces &amp; nephews
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 18, borderTop: `1px dashed ${GOLD_DEEP}` }} /> step / adoptive family (not bloodline)
            </span>
          </div>
        </>
      )}

      {/* ── GENERATIONS VIEW ── */}
      {view === 'generations' && (
        <>
          {generations.map((gen, gi) => (
            <section key={gi} style={{ marginBottom: 20 }}>
              <GenHeading label={GEN_NAMES[gi] || `${gi}× great-grandparents`} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {gen.map(n => <PersonCard key={n.person_key} n={n} open={openKey === n.person_key}
                  onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
                  userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} onPhoto={handlePhoto} uploading={uploading} />)}
              </div>
            </section>
          ))}

          {descendants.map((gen, gi) => (
            <section key={`desc-${gi}`} style={{ marginBottom: 20 }}>
              <GenHeading label={DESC_NAMES[gi] || `${gi + 1}× great-grandchildren`} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {gen.map(n => <PersonCard key={n.person_key} n={n} open={openKey === n.person_key}
                  onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
                  userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} onPhoto={handlePhoto} uploading={uploading} />)}
              </div>
            </section>
          ))}

          {offLine.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <GenHeading label="Other kin & spouses" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {offLine.map(n => <PersonCard key={n.person_key} n={n} open={openKey === n.person_key}
                  onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
                  userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} onPhoto={handlePhoto} uploading={uploading} />)}
              </div>
            </section>
          )}

          {stepFamily.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <GenHeading label="Step & adoptive family" />
              <p style={{ color: MUTED, fontSize: 13, margin: '0 0 12px', maxWidth: 620 }}>Family by love, not by blood — kept in your tree, never counted as bloodline ancestors.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {stepFamily.map(n => (
                  <div key={n.person_key} style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 10, right: 12, zIndex: 1, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: ACCENT, background: BG_CARD2, border: `1px solid ${BORDER}`, borderRadius: 999, padding: '2px 9px' }}>{nonBioKeys.get(n.person_key)}</span>
                    <PersonCard n={n} open={openKey === n.person_key}
                      onToggle={() => setOpenKey(openKey === n.person_key ? null : n.person_key)}
                      userId={userId} records={recsByPerson.get(n.person_key) || []} onUpload={handleUpload} onPhoto={handlePhoto} uploading={uploading} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* refuted family legends — shown honestly (both views) */}
      {refuted.length > 0 && (
        <section style={{ marginTop: 26, background: '#1a0f0d', border: '1px solid #4c2626', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ color: '#f4a4a4', fontWeight: 600, marginBottom: 6 }}>Family legends we could not confirm</div>
          <p style={{ color: '#c9a29a', fontSize: 13.5, margin: '0 0 14px', lineHeight: 1.6 }}>
            Handed-down claims that the records contradict or can&rsquo;t support. We keep them here, honestly marked,
            rather than let a good story pose as a fact in your tree.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {refuted.map(n => (
              <div key={n.person_key} style={{ fontSize: 14 }}>
                <span style={{ color: IVORY, textDecoration: 'line-through' }}>{n.name}</span>
                {n.bio && <span style={{ color: '#a88', marginLeft: 8 }}>— {n.bio}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* tree-node detail modal */}
      {detailNode && (
        <div onClick={() => setDetailKey(null)} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, maxHeight: '86vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button onClick={() => setDetailKey(null)} style={{ background: BG_CARD2, border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 9, padding: 7, cursor: 'pointer', display: 'flex' }} aria-label="Close">
                <VaultIcon name="close" size={16} />
              </button>
            </div>
            <PersonCard n={detailNode} open userId={userId} records={recsByPerson.get(detailNode.person_key) || []}
              onToggle={() => {}} onUpload={handleUpload} onPhoto={handlePhoto} uploading={uploading} />
          </div>
        </div>
      )}
    </div>
  );
}

function GenHeading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 12px' }}>
      <span style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD_DEEP, fontWeight: 600 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: HAIR }} />
    </div>
  );
}

function PersonCard({ n, open, onToggle, userId, records, onUpload, onPhoto, uploading }: {
  n: BloodlineNode; open: boolean; onToggle: () => void;
  userId: string | null; records: BloodlineRecord[];
  onUpload: (f: File, personKey?: string) => void; onPhoto: (f: File, personKey: string) => void; uploading: boolean;
}) {
  const c = conf(n.confidence);
  const span = lifespan(n);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const hasDetail = !!(n.bio || n.birth_place || n.death_place || n.buried || (n.sources && n.sources.length) || records.length);
  return (
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        <Avatar n={n} userId={userId} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: IVORY, fontSize: 15.5 }}>{n.name}</div>
              {span && <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{span}{n.birth_place ? ` · ${n.birth_place}` : ''}</div>}
            </div>
            <span title={n.confidence} style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: c.color, border: `1px solid ${c.color}55`, background: `${c.color}18`, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              {c.label}
            </span>
          </div>
        </div>
      </div>

      {hasDetail && (
        <button onClick={onToggle} style={{ marginTop: 10, background: 'none', border: 'none', color: ACCENT, fontSize: 12.5, cursor: 'pointer', padding: 0 }}>
          {open ? 'Hide details' : 'Details & sources'}
        </button>
      )}
      {open && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${HAIR}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {n.bio && <div style={{ fontSize: 13.5, color: '#d6cbb6', lineHeight: 1.55 }}>{n.bio}</div>}
          {(n.death_place || n.buried) && (
            <div style={{ fontSize: 12.5, color: MUTED }}>
              {n.death_place ? `Died in ${n.death_place}. ` : ''}{n.buried ? `Buried at ${n.buried}.` : ''}
            </div>
          )}
          {n.sources && n.sources.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD_DEEP, marginBottom: 4 }}>Sources</div>
              {n.sources.map((s, i) => (
                <div key={i} style={{ fontSize: 12.5, color: '#a99e8b', lineHeight: 1.5 }}>
                  • {s.citation || s.fact || 'record'}{s.confidence ? <span style={{ color: conf(s.confidence).color }}> ({conf(s.confidence).label})</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: MUTED, fontStyle: 'italic' }}>No source attached yet — upload a record to confirm this person.</div>
          )}
          {/* attached documents */}
          {userId && records.length > 0 && (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD_DEEP, marginBottom: 6 }}>Documents</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {records.map(r => (
                  <a key={r.id} href={(r.image_url ?? bloodlineRecordImageUrl(userId, r.id))} target="_blank" rel="noopener noreferrer"
                    title={`${r.record_type.replace(/_/g, ' ')} — ${r.file_name}`}
                    style={{ display: 'block', width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: `1px solid ${BORDER}`, background: '#000' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={(r.image_url ?? bloodlineRecordImageUrl(userId, r.id))} alt={r.record_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {userId && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, n.person_key); if (fileRef.current) fileRef.current.value = ''; }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={ghostBtn}>
                {uploading ? 'Reading…' : `+ Attach a record`}
              </button>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onPhoto(f, n.person_key); if (photoRef.current) photoRef.current.value = ''; }} />
              <button onClick={() => photoRef.current?.click()} disabled={uploading} style={ghostBtn}>
                {n.photo_record_id ? 'Replace portrait' : '+ Add portrait'}
              </button>
            </div>
          )}
          {!n.living && n.persona_status === 'live' && (
            <div style={{ fontSize: 12.5, color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <VaultIcon name="spark" size={13} /> You can talk with {firstName(n.name)} in Ancestor Chat.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ghostBtn: React.CSSProperties = { background: 'none', border: `1px solid ${BORDER}`, color: ACCENT, fontSize: 12, borderRadius: 9, padding: '5px 12px', cursor: 'pointer' };

function btn(primary: boolean): React.CSSProperties {
  return { padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    border: primary ? 'none' : `1px solid ${ACCENT}`, background: primary ? `linear-gradient(135deg, ${GOLD}, #ffe08a)` : 'transparent', color: primary ? '#20160a' : ACCENT };
}
