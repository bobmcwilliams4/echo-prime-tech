'use client';

import { type FormEvent, type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ACCENT, BG_CARD, BG_INSET, BORDER, GOLD, GOLD_BRIGHT, IVORY, MUTED } from '../lib/constants';
import {
  captureConsent,
  getConsentStatus,
  type ConsentCaptureScope,
  type ConsentCaptureResponse,
  type ConsentMediaType,
  type ConsentPosture,
  type ConsentSubjectStatus,
} from '../lib/vault-api';
import { areCaptureMediaAllowed, consentBlockKindForMedia } from '../lib/consent-policy';
import VaultIcon from './VaultIcon';

interface ConsentGateProps {
  children: ReactNode;
  userId: string;
  mediaScope: ConsentCaptureScope;
  consenterName: string;
  consenterEmail: string;
  profileStatus: 'loading' | 'ready' | 'error';
}

const AUTHORITY_OPTIONS = [
  'Power of attorney',
  'Court-appointed guardian',
  'Executor or estate administrator',
  'Other documented legal authority',
];

export default function ConsentGate({
  children,
  userId,
  mediaScope,
  consenterName,
  consenterEmail,
  profileStatus,
}: ConsentGateProps) {
  const formId = useId();
  const activeRequest = useRef<AbortController | null>(null);
  const submitRequest = useRef<AbortController | null>(null);
  const [posture, setPosture] = useState<ConsentPosture | null>(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);
  const [subjectStatus, setSubjectStatus] = useState<ConsentSubjectStatus>('living');
  const [name, setName] = useState(consenterName);
  const [email, setEmail] = useState(consenterEmail);
  const [relationship, setRelationship] = useState('self');
  const [authorityType, setAuthorityType] = useState('');
  const [affirmed, setAffirmed] = useState(false);

  const mediaTypes: readonly ConsentMediaType[] = mediaScope === 'any' ? ['voice', 'video'] : [mediaScope];
  const mediaLabel = mediaScope === 'any' ? 'voice and video' : mediaScope;

  const refreshPosture = useCallback(async () => {
    if (profileStatus !== 'ready') return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setChecking(true);
    setPosture(null);
    setError(null);
    try {
      const next = await getConsentStatus(userId, controller.signal);
      if (!controller.signal.aborted) setPosture(next);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'Consent status is unavailable. Capture remains unavailable.');
      }
    } finally {
      if (!controller.signal.aborted) setChecking(false);
    }
  }, [profileStatus, userId]);

  useEffect(() => {
    setPosture(null);
    setSubmissionNotice(null);
    setName(consenterName);
    setEmail(consenterEmail);
    setSubjectStatus('living');
    setRelationship('self');
    setAuthorityType('');
    setAffirmed(false);
    if (profileStatus === 'ready') {
      void refreshPosture();
    } else {
      setChecking(false);
    }

    const invalidate = () => void refreshPosture();
    window.addEventListener('vault-consent-invalidated', invalidate);
    return () => {
      activeRequest.current?.abort();
      submitRequest.current?.abort();
      window.removeEventListener('vault-consent-invalidated', invalidate);
    };
  }, [consenterEmail, consenterName, mediaScope, profileStatus, refreshPosture, userId]);

  const changeSubjectStatus = (next: ConsentSubjectStatus) => {
    setSubjectStatus(next);
    if (next === 'living') {
      setName(consenterName);
      setEmail(consenterEmail);
    }
    setRelationship(next === 'living' ? 'self' : '');
    setAuthorityType('');
    setAffirmed(false);
    setError(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedRelationship = relationship.trim();
    const requiresAuthority = subjectStatus !== 'living';
    if (!trimmedName || !trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail) || !trimmedRelationship) {
      setError('Enter the consenter name, relationship, and a valid email address.');
      return;
    }
    if (subjectStatus === 'living' && trimmedRelationship.toLowerCase() !== 'self') {
      setError('This signed-in flow currently supports a living person recording only their own consent.');
      return;
    }
    if (requiresAuthority && !authorityType) {
      setError('Select the legal authority that will be reviewed by a person.');
      return;
    }
    if (!affirmed) {
      setError('Review and select the acknowledgement before submitting.');
      return;
    }

    submitRequest.current?.abort();
    const controller = new AbortController();
    submitRequest.current = controller;
    setSubmitting(true);
    setError(null);
    setSubmissionNotice(null);
    try {
      const response: ConsentCaptureResponse = await captureConsent({
        user_id: userId,
        subject_status: subjectStatus,
        media_type: mediaScope,
        consenter_name: trimmedName,
        consenter_relationship: trimmedRelationship,
        consenter_email: trimmedEmail,
        ...(requiresAuthority ? { legal_authority_type: authorityType } : {}),
      }, controller.signal);
      if (controller.signal.aborted) return;
      if (response.notice) setSubmissionNotice(response.notice);
      setAffirmed(false);
      await refreshPosture();
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'Consent could not be recorded. Capture remains unavailable.');
      }
    } finally {
      if (!controller.signal.aborted) setSubmitting(false);
    }
  };

  if (profileStatus === 'loading' || checking) {
    return <StatusCard title="Checking consent" text={`The ${mediaLabel} capture tools stay unavailable while your current consent status is verified.`} loading />;
  }

  if (profileStatus === 'error') {
    return <StatusCard title="Vault profile unavailable" text="Your signed-in vault profile could not be prepared. Camera, microphone, and uploads remain unavailable." />;
  }

  if (error && !posture) {
    return <StatusCard title="Consent status unavailable" text={error} actionLabel="Try again" onAction={() => void refreshPosture()} />;
  }

  if (posture?.user_id === userId && areCaptureMediaAllowed(posture, mediaTypes)) return <>{children}</>;

  const block = consentBlockKindForMedia(posture, mediaTypes);
  if (block === 'pending') {
    return (
      <StatusCard
        title="Authority review pending"
        text={submissionNotice || 'Your submission was recorded. A person must verify the legal authority before camera, microphone, or uploads can be enabled.'}
        actionLabel="Check status"
        onAction={() => void refreshPosture()}
      />
    );
  }
  if (block === 'deletion-requested') {
    return <StatusCard title="Capture unavailable" text="A deletion request is active for this vault. Biometric capture and uploads remain disabled." />;
  }
  if (block === 'restricted') {
    return <StatusCard title="Consent requires review" text="The current consent record does not authorize this capture. Camera, microphone, and uploads remain unavailable." actionLabel="Check status" onAction={() => void refreshPosture()} />;
  }

  const requiresAuthority = subjectStatus !== 'living';
  const disclosure = subjectStatus === 'living'
    ? `I consent to capture and store my ${mediaLabel} biometric data for my Immortality Vault. I understand I can revoke consent.`
    : `I understand this submission records my claimed authority but does not permit ${mediaLabel} capture until a person verifies it.`;

  return (
    <div className="max-w-2xl mx-auto rounded-2xl p-5 md:p-7" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-start gap-4 mb-6">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${BORDER}` }}>
          <VaultIcon name="lock" size={22} />
        </span>
        <div>
          <h2 className="text-xl font-semibold mb-1" style={{ color: IVORY }}>Consent before {mediaLabel} capture</h2>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            The {mediaLabel} recorder and upload controls are hidden until the vault confirms an active consent record for this signed-in profile.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field label="Subject status" htmlFor={`${formId}-status`}>
          <select
            id={`${formId}-status`}
            value={subjectStatus}
            onChange={event => changeSubjectStatus(event.target.value as ConsentSubjectStatus)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
          >
            <option value="living">Living — my own consent</option>
            <option value="deceased">Deceased — legal authority review required</option>
            <option value="incapacitated">Incapacitated — legal authority review required</option>
          </select>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Consenter name" htmlFor={`${formId}-name`}>
            <input id={`${formId}-name`} value={name} onChange={event => setName(event.target.value)} readOnly={subjectStatus === 'living'} autoComplete="name" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none read-only:opacity-70" style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }} />
          </Field>
          <Field label="Consenter email" htmlFor={`${formId}-email`}>
            <input id={`${formId}-email`} type="email" value={email} onChange={event => setEmail(event.target.value)} readOnly={subjectStatus === 'living'} autoComplete="email" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none read-only:opacity-70" style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }} />
          </Field>
        </div>
        {subjectStatus === 'living' && <p className="-mt-3 text-xs" style={{ color: MUTED }}>The consenter identity is bound to the signed-in Firebase account.</p>}

        <Field label="Relationship to subject" htmlFor={`${formId}-relationship`}>
          <input
            id={`${formId}-relationship`}
            value={relationship}
            onChange={event => setRelationship(event.target.value)}
            readOnly={subjectStatus === 'living'}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none read-only:opacity-70"
            style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}
          />
          {subjectStatus === 'living' && <p className="mt-1.5 text-xs" style={{ color: MUTED }}>Living-person consent is limited to the signed-in person&apos;s own biometric data.</p>}
        </Field>

        {requiresAuthority && (
          <Field label="Legal authority type" htmlFor={`${formId}-authority`}>
            <select id={`${formId}-authority`} value={authorityType} onChange={event => setAuthorityType(event.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: BG_INSET, border: `1px solid ${BORDER}`, color: IVORY }}>
              <option value="">Select the authority to be reviewed</option>
              {AUTHORITY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: MUTED }}>Submitting this form records the request only. Capture remains unavailable until a person verifies the authority.</p>
          </Field>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl p-4" style={{ background: BG_INSET, border: `1px solid ${BORDER}` }}>
          <input type="checkbox" checked={affirmed} onChange={event => setAffirmed(event.target.checked)} className="mt-1 h-4 w-4 accent-amber-400" />
          <span className="text-sm leading-relaxed" style={{ color: IVORY }}>{disclosure}</span>
        </label>

        {error && <div role="alert" className="rounded-xl p-3 text-sm" style={{ color: '#fca5a5', background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(252,165,165,0.24)' }}>{error}</div>}

        <button type="submit" disabled={submitting} className="w-full rounded-full px-6 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}>
          {submitting ? 'Recording consent…' : requiresAuthority ? 'Submit for human review' : `Consent to ${mediaLabel} capture`}
        </button>
      </form>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{label}</label>
      {children}
    </div>
  );
}

function StatusCard({ title, text, loading = false, actionLabel, onAction }: { title: string; text: string; loading?: boolean; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="max-w-xl mx-auto rounded-2xl p-6 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full" style={{ color: ACCENT, background: 'rgba(245,196,81,0.08)', border: `1px solid ${BORDER}` }}>
        {loading ? <span className="h-5 w-5 animate-spin rounded-full" style={{ border: `2px solid ${BORDER}`, borderTopColor: ACCENT }} /> : <VaultIcon name="lock" size={21} />}
      </span>
      <h2 className="text-lg font-semibold mb-2" style={{ color: IVORY }}>{title}</h2>
      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{text}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-5 rounded-full px-5 py-2 text-sm font-semibold transition hover:brightness-110" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: '#20160a' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
