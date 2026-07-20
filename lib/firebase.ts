import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  User,
  UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'echo-prime-ai.firebaseapp.com',
  projectId: 'echo-prime-ai',
  storageBucket: 'echo-prime-ai.appspot.com',
  messagingSenderId: '249995513427',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

// Session persistence guard. Firebase's default IS durable local persistence,
// but we pin it explicitly so the signed-in session ALWAYS survives the OAuth
// roundtrip and any page reload — this is awaited before every sign-in so a
// login can never land in a session that evaporates on the next load.
let persistenceReady: Promise<void> | null = null;

function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  if (!persistenceReady && typeof window !== 'undefined') {
    persistenceReady = setPersistence(auth, browserLocalPersistence).catch(() => {});
  }
  return { app, auth };
}

// Set (cleared in handleRedirectResult) so the app knows a full-page OAuth
// roundtrip is in flight — the intro splash must never play over that return.
const AUTH_REDIRECT_FLAG = 'ept_auth_redirect_pending';

function markRedirectPending() {
  try { sessionStorage.setItem(AUTH_REDIRECT_FLAG, '1'); } catch { /* ignore */ }
}

export function isAuthRedirectPending(): boolean {
  try { return sessionStorage.getItem(AUTH_REDIRECT_FLAG) === '1'; } catch { return false; }
}

function clearRedirectPending() {
  try { sessionStorage.removeItem(AUTH_REDIRECT_FLAG); } catch { /* ignore */ }
}

export interface EPTUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  emailVerified: boolean;
}

function detectProvider(user: User): string {
  if (!user.providerData || user.providerData.length === 0) return 'unknown';
  const providerId = user.providerData[0]?.providerId || 'unknown';
  const map: Record<string, string> = {
    'google.com': 'google',
    'apple.com': 'apple',
    'password': 'email',
    'phone': 'phone',
  };
  return map[providerId] || providerId;
}

export function toEPTUser(user: User): EPTUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: detectProvider(user),
    emailVerified: user.emailVerified,
  };
}

// Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Apple
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

/**
 * OAuth sign-in: POPUP-FIRST ON EVERY DEVICE.
 *
 * ROOT-CAUSE NOTE (do not regress): our Firebase authDomain is
 * echo-prime-ai.firebaseapp.com — a DIFFERENT origin from the sites that host
 * the apps (immortalityvault.app, echo-ept.com, …). `signInWithRedirect`
 * stashes its state in the authDomain's iframe storage, and every modern
 * browser (Safari ITP, Chrome 115+ storage partitioning) blocks that
 * third-party storage — so the redirect returns, getRedirectResult() finds
 * NOTHING, and the user lands back signed-out. That was the recurring
 * "Google login restarts the intro and doesn't log me in" bug: mobile UAs were
 * hard-routed to signInWithRedirect. Firebase's own guidance for cross-origin
 * authDomains on storage-partitioning browsers is: use signInWithPopup.
 * Redirect remains ONLY as a last resort where popups are impossible, and it
 * marks the roundtrip so the UI can react instead of playing the intro.
 */
async function oauthSignIn(provider: GoogleAuthProvider | OAuthProvider): Promise<EPTUser | null> {
  const { auth } = initFirebase();
  if (persistenceReady) await persistenceReady;
  try {
    const result = await signInWithPopup(auth, provider);
    return toEPTUser(result.user);
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/operation-not-supported-in-this-environment') {
      // Popup genuinely impossible (blocked / webview). Full-page redirect is
      // the only path left; flag it so the intro splash stays out of the way.
      markRedirectPending();
      await signInWithRedirect(auth, provider);
      return null;
    }
    // NOTE: 'auth/popup-closed-by-user' is deliberately NOT a redirect trigger —
    // the user closed the window on purpose; yanking the whole page to Google
    // after that was part of the old broken feel. It surfaces as a no-op.
    throw error;
  }
}

export async function signInWithGoogle(): Promise<EPTUser | null> {
  return oauthSignIn(googleProvider);
}

export async function signInWithApple(): Promise<EPTUser | null> {
  return oauthSignIn(appleProvider);
}

export async function signInWithEmail(email: string, password: string): Promise<EPTUser> {
  const { auth } = initFirebase();
  if (persistenceReady) await persistenceReady;
  const result = await signInWithEmailAndPassword(auth, email, password);
  return toEPTUser(result.user);
}

export async function signUpWithEmail(email: string, password: string): Promise<EPTUser> {
  const { auth } = initFirebase();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  return toEPTUser(result.user);
}

export async function resetPassword(email: string): Promise<void> {
  const { auth } = initFirebase();
  await sendPasswordResetEmail(auth, email);
}

// Phone/SMS Auth
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  const { auth } = initFirebase();
  if (recaptchaVerifierInstance) {
    recaptchaVerifierInstance.clear();
  }
  recaptchaVerifierInstance = new RecaptchaVerifier(auth, elementId, { size: 'invisible' });
  return recaptchaVerifierInstance;
}

export async function sendSmsCode(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<boolean> {
  const { auth } = initFirebase();
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return true;
}

export async function verifySmsCode(code: string): Promise<EPTUser | null> {
  if (!confirmationResult) throw new Error('No SMS verification in progress');
  const result = await confirmationResult.confirm(code);
  return toEPTUser(result.user);
}

export async function handleRedirectResult(): Promise<EPTUser | null> {
  const { auth } = initFirebase();
  if (persistenceReady) await persistenceReady;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) return toEPTUser(result.user);
    return null;
  } finally {
    clearRedirectPending();
  }
}

export async function signOut(): Promise<void> {
  const { auth } = initFirebase();
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: EPTUser | null) => void): () => void {
  const { auth } = initFirebase();
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toEPTUser(firebaseUser) : null);
  });
}

export function getCurrentUser(): EPTUser | null {
  const { auth } = initFirebase();
  return auth.currentUser ? toEPTUser(auth.currentUser) : null;
}

initFirebase();
export { auth };
