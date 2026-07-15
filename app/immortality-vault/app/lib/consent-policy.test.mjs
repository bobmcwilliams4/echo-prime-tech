import assert from 'node:assert/strict';
import test from 'node:test';
import { areCaptureMediaAllowed, consentBlockKind, consentBlockKindForMedia, isCaptureAllowed } from './consent-policy.ts';

function posture({ voice = false, video = false, reason = 'no_consent_on_record', records = 0, deletion = false } = {}) {
  return {
    user_id: 'firebase-uid',
    media: {
      voice: { allowed: voice, reason: voice ? 'active' : reason },
      video: { allowed: video, reason: video ? 'active' : reason },
    },
    records,
    deletion_requested: deletion,
  };
}

test('authorization is narrow to the requested biometric medium', () => {
  const state = posture({ voice: true, video: false, records: 1 });
  assert.equal(isCaptureAllowed(state, 'voice'), true);
  assert.equal(isCaptureAllowed(state, 'video'), false);
  assert.equal(consentBlockKind(state, 'video'), 'required');
  assert.equal(areCaptureMediaAllowed(state, ['voice', 'video']), false);
  assert.equal(consentBlockKindForMedia(state, ['voice', 'video']), 'required');
});

test('audiovisual capture requires active consent for both media', () => {
  assert.equal(areCaptureMediaAllowed(posture({ voice: true, video: false, records: 1 }), ['voice', 'video']), false);
  assert.equal(areCaptureMediaAllowed(posture({ voice: false, video: true, records: 1 }), ['voice', 'video']), false);
  assert.equal(areCaptureMediaAllowed(posture({ voice: true, video: true, records: 1 }), ['voice', 'video']), true);
});

test('pending legal-authority review never unlocks capture', () => {
  const state = posture({ reason: 'legal_authority_pending_human_verification', records: 1 });
  assert.equal(isCaptureAllowed(state, 'voice'), false);
  assert.equal(consentBlockKind(state, 'voice'), 'pending');
});

test('deletion requests override an otherwise active consent', () => {
  const state = posture({ voice: true, video: true, records: 2, deletion: true });
  assert.equal(isCaptureAllowed(state, 'voice'), false);
  assert.equal(consentBlockKind(state, 'video'), 'deletion-requested');
});

test('unknown denied postures fail closed', () => {
  const state = posture({ reason: 'revoked', records: 2 });
  assert.equal(isCaptureAllowed(state, 'video'), false);
  assert.equal(consentBlockKind(state, 'video'), 'restricted');
  assert.equal(consentBlockKind(null, 'video'), 'required');
});
