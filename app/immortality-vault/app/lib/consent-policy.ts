import type { ConsentMediaType, ConsentPosture } from './vault-api';

export type ConsentBlockKind = 'allowed' | 'required' | 'pending' | 'restricted' | 'deletion-requested';

const NO_CONSENT_REASONS = new Set(['no_consent_on_record', 'no_consent', 'consent_required']);

export function isCaptureAllowed(posture: ConsentPosture | null, mediaType: ConsentMediaType): boolean {
  return Boolean(posture && !posture.deletion_requested && posture.media[mediaType]?.allowed === true);
}

export function areCaptureMediaAllowed(posture: ConsentPosture | null, mediaTypes: readonly ConsentMediaType[]): boolean {
  return mediaTypes.length > 0 && mediaTypes.every(mediaType => isCaptureAllowed(posture, mediaType));
}

export function consentBlockKind(posture: ConsentPosture | null, mediaType: ConsentMediaType): ConsentBlockKind {
  if (!posture) return 'required';
  if (posture.deletion_requested) return 'deletion-requested';
  if (isCaptureAllowed(posture, mediaType)) return 'allowed';

  const reason = (posture.media[mediaType]?.reason || '').toLowerCase();
  if (reason === 'legal_authority_pending_human_verification' || reason.includes('pending_human')) {
    return 'pending';
  }
  if (NO_CONSENT_REASONS.has(reason) || posture.records === 0) return 'required';
  return 'restricted';
}

export function consentBlockKindForMedia(posture: ConsentPosture | null, mediaTypes: readonly ConsentMediaType[]): ConsentBlockKind {
  if (areCaptureMediaAllowed(posture, mediaTypes)) return 'allowed';
  if (posture?.deletion_requested) return 'deletion-requested';
  const blocks = mediaTypes.map(mediaType => consentBlockKind(posture, mediaType));
  if (blocks.includes('pending')) return 'pending';
  if (blocks.includes('restricted')) return 'restricted';
  return 'required';
}
